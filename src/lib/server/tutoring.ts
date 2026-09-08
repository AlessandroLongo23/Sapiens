import 'server-only';
import { supabase } from './supabase';
import type { TutorProfile } from '@/lib/tutoring/config';

/**
 * Server-side reads of the tutor marketplace, through the `tutors_public`
 * view (published profiles only, no surname, no contact data). Cached in
 * memory for a short time like the content tree; the pages on top use ISR.
 */

const TTL_MS = 60_000;

let cached: { at: number; tutors: TutorProfile[] } | null = null;
let inflight: Promise<TutorProfile[]> | null = null;

const COLUMNS =
	'id,slug,first_name,last_initial,headline,bio,subjects,levels,modes,city,hourly_rate,education,years_experience,avatar_url,verified,created_at,updated_at';

function toProfile(row: Record<string, unknown>): TutorProfile {
	return {
		id: String(row.id),
		slug: String(row.slug),
		first_name: String(row.first_name ?? ''),
		last_initial: String(row.last_initial ?? ''),
		headline: String(row.headline ?? ''),
		bio: String(row.bio ?? ''),
		subjects: Array.isArray(row.subjects) ? (row.subjects as string[]) : [],
		levels: Array.isArray(row.levels) ? (row.levels as TutorProfile['levels']) : [],
		modes: Array.isArray(row.modes) ? (row.modes as TutorProfile['modes']) : [],
		city: typeof row.city === 'string' && row.city.trim() ? row.city.trim() : null,
		hourly_rate: row.hourly_rate == null ? null : Number(row.hourly_rate),
		education: typeof row.education === 'string' && row.education.trim() ? row.education : null,
		years_experience: Number(row.years_experience ?? 0),
		avatar_url: typeof row.avatar_url === 'string' && row.avatar_url ? row.avatar_url : null,
		verified: row.verified === true,
		created_at: String(row.created_at ?? ''),
		updated_at: String(row.updated_at ?? row.created_at ?? '')
	};
}

async function fetchTutors(): Promise<TutorProfile[]> {
	const { data, error } = await supabase.from('tutors_public').select(COLUMNS).order('created_at', { ascending: false });
	if (error) {
		console.error('tutors_public query failed:', error.message);
		return [];
	}
	return (data ?? []).map((row: Record<string, unknown>) => toProfile(row));
}

/** Drop the in-memory copy after a profile or its status changes, so the next read is fresh. */
export function invalidateTutorCache(): void {
	cached = null;
}

/** Every published tutor, newest first. An unavailable database yields an empty list, not an error page. */
export async function getPublishedTutors(): Promise<TutorProfile[]> {
	if (cached && Date.now() - cached.at < TTL_MS) return cached.tutors;
	if (!inflight) {
		inflight = fetchTutors()
			.then((tutors) => {
				cached = { at: Date.now(), tutors };
				return tutors;
			})
			.finally(() => {
				inflight = null;
			});
	}
	return inflight;
}

export async function getTutorBySlug(slug: string): Promise<TutorProfile | null> {
	const fromCache = cached?.tutors.find((t) => t.slug === slug);
	if (fromCache) return fromCache;
	const { data, error } = await supabase.from('tutors_public').select(COLUMNS).eq('slug', slug).maybeSingle();
	if (error) {
		console.error('tutors_public lookup failed:', error.message);
		return null;
	}
	return data ? toProfile(data as Record<string, unknown>) : null;
}

/** Most recent profile change, for the sitemap. */
export function latestTutorUpdate(tutors: TutorProfile[]): string | null {
	let latest: string | null = null;
	for (const t of tutors) {
		if (!latest || t.updated_at > latest) latest = t.updated_at;
	}
	return latest;
}

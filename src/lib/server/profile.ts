import 'server-only';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { adminClient } from '@/lib/server/supabase';
import { isRole, type AgeBand, type Role } from '@/lib/onboarding/config';

/**
 * What an account is to Sapiens: table `profiles` (supabase/migrations/20261007120000_onboarding.sql), written
 * with the service role only. An account without a row was made before the table, or by hand in the Supabase
 * dashboard: it is a student, and its email counts as confirmed when Supabase Auth says so.
 */
export interface Profile {
	roles: Role[];
	ageBand: AgeBand | null;
	schoolYear: number | null;
	/** Database path of the lesson the class is on. */
	topic: string | null;
	/** Whether the welcome questions were answered or skipped. */
	onboarded: boolean;
	heardFrom: string | null;
	emailVerified: boolean;
	parentEmail: string | null;
	parentConsent: boolean;
}

export const profilesDb = (): SupabaseClient => adminClient() as unknown as SupabaseClient;

type Account = Pick<User, 'id' | 'email_confirmed_at' | 'created_at'>;

export async function profileOf(user: Account): Promise<Profile> {
	const { data, error } = await profilesDb().from('profiles').select('*').eq('user_id', user.id).maybeSingle();
	if (error) throw error;
	if (!data) {
		return { roles: ['student'], ageBand: null, schoolYear: null, topic: null, onboarded: false, heardFrom: null, emailVerified: !!user.email_confirmed_at, parentEmail: null, parentConsent: false };
	}
	return {
		roles: ((data.roles as unknown[]) ?? []).filter(isRole),
		ageBand: (data.age_band as AgeBand | null) ?? null,
		schoolYear: (data.school_year as number | null) ?? null,
		topic: (data.topic as string | null) ?? null,
		onboarded: !!data.onboarded_at,
		heardFrom: (data.heard_from as string | null) ?? null,
		emailVerified: !!data.email_verified_at,
		parentEmail: (data.parent_email as string | null) ?? null,
		parentConsent: !!data.parent_consent_at
	};
}

/** Makes the row of an account that has none, with the rule above, so later updates have something to update. */
export async function ensureProfile(user: Account): Promise<void> {
	const { error } = await profilesDb()
		.from('profiles')
		.upsert({ user_id: user.id, email_verified_at: user.email_confirmed_at ?? null, created_at: user.created_at }, { onConflict: 'user_id', ignoreDuplicates: true });
	if (error) throw error;
}

export async function updateProfile(user: Account, fields: Record<string, unknown>): Promise<void> {
	await ensureProfile(user);
	const { error } = await profilesDb().from('profiles').update({ ...fields, updated_at: new Date().toISOString() }).eq('user_id', user.id);
	if (error) throw error;
}

/**
 * Whether the account's email is confirmed. Studying never asks; paying, inviting and writing to a tutor do
 * (vault/Decisioni/2026-10-07 La conferma dell'email non blocca l'ingresso.md).
 */
export async function emailVerified(user: Account): Promise<boolean> {
	return (await profileOf(user)).emailVerified;
}

/** The answer of a route that needs a confirmed email; the client opens the code form on this `code`. */
export const EMAIL_UNVERIFIED = { error: 'Prima conferma la tua email: ti mandiamo un codice di 6 cifre.', code: 'email_unverified' } as const;

/** Adds a role to an account that takes on a second one (a student who becomes a tutor). */
export async function addRole(user: Account, role: Role): Promise<void> {
	const { roles } = await profileOf(user);
	if (roles.includes(role)) return;
	await updateProfile(user, { roles: [...roles, role] });
}

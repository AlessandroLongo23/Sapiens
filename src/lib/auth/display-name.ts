import type { User } from '@supabase/supabase-js';

/** The name to show for a user: first and last name from the sign-up form, else the part of the email before the @. */
export function displayName(user: User): string {
	const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
	const full = [meta.first_name, meta.last_name].filter((v): v is string => typeof v === 'string' && v.trim() !== '').join(' ');
	if (full) return full;
	if (typeof meta.full_name === 'string' && meta.full_name.trim()) return meta.full_name.trim();
	return user.email?.split('@')[0] ?? 'Il tuo account';
}

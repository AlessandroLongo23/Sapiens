/**
 * Invites and creator codes (vault/Prodotti/Studenti/Inviti e codici.md). The database applies the same numbers
 * in supabase/migrations/20260928120000_referrals.sql: change them in both places.
 */
export const REFERRAL = {
	/** Days of trial for an account that signs up with a code, a friend's or a creator's. */
	trialDays: 14,
	/** Days of Studio for the student whose friend finished a first run. */
	rewardDays: 30,
	/** Rewards a student can earn in a school year (from 1 September). */
	rewardsPerYear: 3,
	/** The reward on an active subscription: a credit on the next invoice, in cents. */
	creditCents: 999,
	/**
	 * Only an adult can have a code of their own: the Danish consumer ombudsman's guidelines say a business should
	 * not use children and young people to recruit friends (vault/Decisioni/2026-09-28 Porta un amico solo per i
	 * maggiorenni.md). Anyone can sign up with a code.
	 */
	minAge: 18,
	/**
	 * The sign-up link's parameter, and the cookie that keeps the code once the visitor has chosen "Usa l'invito",
	 * for a few hours: nothing is stored before that click (vault/Decisioni/2026-09-28 L'invito si salva solo dopo
	 * Usa l'invito.md).
	 */
	param: 'invito',
	cookie: 'sapiens_invito',
	cookieHours: 3
} as const;

/** A code as stored: 4 to 20 capital letters and digits. */
export const CODE_PATTERN = /^[A-Z0-9]{4,20}$/;

/** A code as typed or found in a link, normalized; null when it cannot be one. */
export function normalizeCode(value: unknown): string | null {
	if (typeof value !== 'string') return null;
	const code = value.trim().toUpperCase();
	return CODE_PATTERN.test(code) ? code : null;
}

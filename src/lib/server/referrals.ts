import 'server-only';
import { randomInt } from 'node:crypto';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { adminClient } from '@/lib/server/supabase';
import { stripe } from '@/lib/stripe/server';
import { TRIAL_DAYS, romeDate } from '@/lib/stripe/config';
import { bonusOf } from '@/lib/auth/entitlements';
import { REFERRAL, normalizeCode } from '@/lib/referrals/config';

/**
 * Invites and creator codes (vault/Prodotti/Studenti/Inviti e codici.md). The database does the part that must
 * happen with the account and the exercises: the longer trial at sign-up and the reward when a friend finishes a
 * first run (supabase/migrations/20260928120000_referrals.sql). Here: a person's own code, made once they declare
 * they are adults, and what it brought; a code entered by hand; the creators' codes and what they brought; the
 * credits the Stripe webhook puts on a subscriber's invoice. Creators are paid per content, by hand: nothing here
 * pays them. Every table is written with the service role only; a person sees counts, never who their friends are.
 */

export class ReferralError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

const db = (): SupabaseClient => adminClient() as unknown as SupabaseClient;

/** Letters and digits that cannot be mistaken for each other when a code is read aloud or copied by hand. */
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const randomCode = (length = 6) => Array.from({ length }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');

/** 1 September of the school year `day` (YYYY-MM-DD) is in, as an ISO instant in Rome. */
function schoolYearStart(day: string = romeDate()): string {
	const [year, month] = day.split('-').map(Number);
	const start = `${month < 9 ? year - 1 : year}-09-01T00:00:00`;
	// Rome is UTC+2 on 1 September.
	return new Date(`${start}+02:00`).toISOString();
}

/** The person's own code, if they have one. */
async function friendCode(userId: string): Promise<string | null> {
	const { data, error } = await db().from('referral_codes').select('code').eq('owner_id', userId).eq('kind', 'amico').maybeSingle();
	if (error) throw error;
	return (data?.code as string | undefined) ?? null;
}

/**
 * A code of one's own, made when the person declares they are at least REFERRAL.minAge: the declaration is stored
 * with the code. A second call returns the code already made.
 */
export async function createFriendCode(userId: string, declared: unknown): Promise<string> {
	if (declared !== true) throw new ReferralError(400, `Per invitare gli amici devi avere almeno ${REFERRAL.minAge} anni.`);
	const existing = await friendCode(userId);
	if (existing) return existing;
	for (let attempt = 0; attempt < 5; attempt++) {
		const code = randomCode();
		const { error } = await db().from('referral_codes').insert({ code, kind: 'amico', owner_id: userId, declared_adult_at: new Date().toISOString() });
		if (!error) return code;
		// Another request made this person's code at the same moment: take that one.
		if (error.code === '23505' && error.message.includes('one_per_student')) return (await friendCode(userId)) ?? code;
		if (error.code !== '23505') throw error;
	}
	throw new ReferralError(503, 'Non riesco a creare il tuo codice. Riprova più tardi.');
}

/** Whether a code exists and is switched on: the invite offer asks before showing itself. */
export async function codeIsActive(input: unknown): Promise<boolean> {
	const code = normalizeCode(input);
	if (!code) return false;
	const { data, error } = await db().from('referral_codes').select('code').eq('code', code).eq('active', true).maybeSingle();
	if (error) throw error;
	return !!data;
}

/** What the invite page shows. */
export interface InviteSummary {
	/** Null until the person has declared they are adults and made one. */
	code: string | null;
	/** Friends who signed up with the code, and those of them who finished a first run. */
	joined: number;
	activated: number;
	/** Rewards earned this school year, out of `REFERRAL.rewardsPerYear`. */
	rewardsThisYear: number;
	/** Credits waiting for the next invoice of the subscription. */
	pendingCredits: number;
	/** Last day of the Studio earned with invites, while it lasts. */
	bonusUntil: string | null;
	/** Whether the student can still enter a code by hand: none yet, and within the first days of the account. */
	canClaim: boolean;
}

export async function inviteSummary(user: User): Promise<InviteSummary> {
	const code = await friendCode(user.id);
	// Without a code nothing can have been brought: the counts read an impossible code.
	const mine = code ?? '-';
	const [joined, activated, rewards, pending, own] = await Promise.all([
		db().from('referrals').select('user_id', { count: 'exact', head: true }).eq('code', mine),
		db().from('referrals').select('user_id', { count: 'exact', head: true }).eq('code', mine).not('activated_at', 'is', null),
		db().from('referral_rewards').select('id', { count: 'exact', head: true }).eq('referrer_id', user.id).gte('created_at', schoolYearStart()),
		db().from('referral_rewards').select('id', { count: 'exact', head: true }).eq('referrer_id', user.id).eq('kind', 'credito').is('applied_at', null),
		db().from('referrals').select('user_id').eq('user_id', user.id).maybeSingle()
	]);
	for (const r of [joined, activated, rewards, pending, own]) if (r.error) throw r.error;
	return {
		code,
		joined: joined.count ?? 0,
		activated: activated.count ?? 0,
		rewardsThisYear: rewards.count ?? 0,
		pendingCredits: pending.count ?? 0,
		bonusUntil: bonusOf(user)?.until ?? null,
		canClaim: !own.data && claimWindowOpen(user)
	};
}

/** A code can be entered by hand during the account's first TRIAL_DAYS days, as if it had come with the link. */
const claimWindowOpen = (user: User) => Date.now() - Date.parse(user.created_at) < TRIAL_DAYS * 86_400_000;

/**
 * A code entered by hand after signing up: the same as signing up with the link. The longer trial is written into
 * app_metadata; if the student has already finished a run, the friend's reward is given now, since the trigger
 * that would have given it has already fired.
 */
export async function claimInvite(user: User, input: unknown): Promise<void> {
	const code = normalizeCode(input);
	if (!code) throw new ReferralError(400, 'Il codice ha da 4 a 20 lettere e cifre.');
	if (!claimWindowOpen(user)) throw new ReferralError(400, `Un codice si può inserire solo nei primi ${TRIAL_DAYS} giorni dall'iscrizione.`);
	const { data: found, error } = await db().from('referral_codes').select('code, owner_id').eq('code', code).eq('active', true).maybeSingle();
	if (error) throw error;
	if (!found) throw new ReferralError(404, 'Questo codice non esiste. Controlla di averlo scritto bene.');
	if (found.owner_id === user.id) throw new ReferralError(400, 'Questo è il tuo codice: condividilo con un amico.');

	const { error: insertError } = await db().from('referrals').insert({ user_id: user.id, code });
	if (insertError?.code === '23505') throw new ReferralError(400, 'Hai già usato un codice.');
	if (insertError) throw insertError;

	const { error: metaError } = await adminClient().auth.admin.updateUserById(user.id, { app_metadata: { trialDays: REFERRAL.trialDays } });
	if (metaError) throw metaError;

	const { count, error: runError } = await db().from('exercise_sessions').select('id', { count: 'exact', head: true }).eq('user_id', user.id).not('finished_at', 'is', null);
	if (runError) throw runError;
	if (count) {
		const { error: activateError } = await db().rpc('referral_activate', { p_user: user.id });
		if (activateError) throw activateError;
	}
}

// ---- Creators ----

/** A creator's code and what it brought, in counts. */
export interface CreatorCodeStats {
	code: string;
	label: string;
	active: boolean;
	createdAt: string;
	signups: number;
	activated: number;
	/** Accounts that paid at least once. */
	paying: number;
}

/** The friends' codes all together: never one person's. */
export interface FriendTotals {
	codes: number;
	signups: number;
	activated: number;
	daysRewards: number;
	creditRewards: number;
	pendingCredits: number;
}

export async function referralOverview(): Promise<{ creators: CreatorCodeStats[]; friends: FriendTotals }> {
	const [codes, stats, referrals, rewards] = await Promise.all([
		db().from('referral_codes').select('code, kind, label, active, created_at').order('created_at', { ascending: false }).limit(10_000),
		db().rpc('creator_code_stats'),
		db().from('referrals').select('code, activated_at, referral_codes!inner(kind)').eq('referral_codes.kind', 'amico').limit(100_000),
		db().from('referral_rewards').select('kind, applied_at').limit(100_000)
	]);
	for (const r of [codes, stats, referrals, rewards]) if (r.error) throw r.error;
	const byCode = new Map(((stats.data ?? []) as { code: string; signups: number; activated: number; paying: number }[]).map((s) => [s.code, s]));
	const friends: FriendTotals = { codes: 0, signups: 0, activated: 0, daysRewards: 0, creditRewards: 0, pendingCredits: 0 };
	for (const r of referrals.data ?? []) {
		friends.signups++;
		if (r.activated_at) friends.activated++;
	}
	for (const r of rewards.data ?? []) {
		if (r.kind === 'giorni') friends.daysRewards++;
		else {
			friends.creditRewards++;
			if (!r.applied_at) friends.pendingCredits++;
		}
	}
	const creators: CreatorCodeStats[] = [];
	for (const c of codes.data ?? []) {
		if (c.kind === 'amico') {
			friends.codes++;
			continue;
		}
		const s = byCode.get(c.code);
		creators.push({ code: c.code, label: c.label ?? '', active: c.active, createdAt: c.created_at, signups: s?.signups ?? 0, activated: s?.activated ?? 0, paying: s?.paying ?? 0 });
	}
	return { creators, friends };
}

/** A new creator's code, chosen by the admin (the name the creator will say in a video). */
export async function createCreatorCode(input: unknown, labelInput: unknown): Promise<void> {
	const code = normalizeCode(input);
	if (!code) throw new ReferralError(400, 'Il codice ha da 4 a 20 lettere e cifre, senza spazi.');
	const label = typeof labelInput === 'string' ? labelInput.trim().slice(0, 100) : '';
	if (!label) throw new ReferralError(400, 'Scrivi il nome del creator.');
	const { error } = await db().from('referral_codes').insert({ code, kind: 'creator', label });
	if (error?.code === '23505') throw new ReferralError(400, 'Questo codice esiste già.');
	if (error) throw error;
}

/** Switches a creator's code on or off: an inactive code is ignored at sign-up, and what it brought stays. */
export async function setCreatorCodeActive(code: string, active: boolean): Promise<void> {
	const { error } = await db().from('referral_codes').update({ active }).eq('code', code).eq('kind', 'creator');
	if (error) throw error;
}

// ---- From the Stripe webhook ----

/**
 * The credits a subscriber earned with invites, onto their Stripe balance: called when the next invoice is drafted,
 * so it is taken off that invoice. The idempotency key makes a retried webhook add nothing twice.
 */
export async function applyPendingCredits(userId: string, customerId: string): Promise<void> {
	const { data, error } = await db().from('referral_rewards').select('id, credit_cents').eq('referrer_id', userId).eq('kind', 'credito').is('applied_at', null);
	if (error) throw error;
	for (const reward of (data ?? []) as { id: string; credit_cents: number }[]) {
		const transaction = await stripe.customers.createBalanceTransaction(
			customerId,
			{ amount: -reward.credit_cents, currency: 'eur', description: 'Premio per un amico invitato su Sapiens', metadata: { rewardId: reward.id, userId } },
			{ idempotencyKey: `referral-credit-${reward.id}` }
		);
		const { error: updateError } = await db().from('referral_rewards').update({ applied_at: new Date().toISOString(), stripe_ref: transaction.id }).eq('id', reward.id);
		if (updateError) throw updateError;
	}
}

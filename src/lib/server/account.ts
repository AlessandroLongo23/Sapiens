import 'server-only';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { planOf, subscriptionOf } from '@/lib/auth/entitlements';
import { stripe } from '@/lib/stripe/server';
import { adminClient } from './supabase';

/**
 * The student's own data, for the "I tuoi dati" section of the account
 * (GDPR arts. 15 and 20: access and portability; art. 17: erasure).
 */

/** Every table that holds the student's rows, with the column that points at them. */
const TABLES = [
	['notebooks', 'user_id'],
	['notes', 'user_id'],
	['note_stickers', 'user_id'],
	['cover_stickers', 'user_id'],
	['diary_entries', 'user_id'],
	['diary_pages', 'user_id'],
	['exercise_sessions', 'user_id'],
	['exercise_attempts', 'user_id'],
	['exercise_days', 'user_id'],
	['tutor_requests', 'student_id']
] as const;

export class AccountError extends Error {
	constructor(
		message: string,
		readonly status: number
	) {
		super(message);
	}
}

/**
 * All of it as one JSON document: the account (without payment identifiers,
 * which are Stripe's and come with the receipts) and every row, read with the
 * student's own client so row level security decides what is theirs.
 */
export async function exportAccount(supabase: SupabaseClient, user: User) {
	const tables = await Promise.all(
		TABLES.map(async ([table, column]) => {
			const { data, error } = await supabase.from(table).select('*').eq(column, user.id);
			if (error) throw new Error(`export ${table}: ${error.message}`);
			return [table, data] as const;
		})
	);
	const { plan, source } = planOf(user);
	return {
		exportedAt: new Date().toISOString(),
		account: {
			id: user.id,
			email: user.email,
			createdAt: user.created_at,
			lastSignInAt: user.last_sign_in_at,
			profile: user.user_metadata,
			plan: { id: plan.id, source, status: subscriptionOf(user).status }
		},
		...Object.fromEntries(tables)
	};
}

/**
 * Deletes the account. A live subscription is cancelled first, at once and
 * without a refund, so Stripe stops charging a card nobody can manage any
 * more; if that fails nothing is deleted. Every table cascades from
 * auth.users, except a tutor profile, which is kept without its owner.
 * Receipts stay with Stripe, as the tax rules require.
 */
export async function deleteAccount(user: User): Promise<void> {
	const subscription = subscriptionOf(user);
	if (subscription.subscriptionId && !['canceled', 'incomplete_expired'].includes(subscription.status)) {
		try {
			await stripe.subscriptions.cancel(subscription.subscriptionId);
		} catch (err) {
			if ((err as { code?: string }).code !== 'resource_missing') {
				console.error('account delete: subscription cancel failed', err);
				throw new AccountError("Non siamo riusciti a chiudere l'abbonamento, quindi l'account non è stato eliminato. Riprova più tardi o scrivici.", 503);
			}
		}
	}
	const { error } = await adminClient().auth.admin.deleteUser(user.id);
	if (error) throw new Error(`delete user: ${error.message}`);
}

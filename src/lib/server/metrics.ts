import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { adminClient } from '@/lib/server/supabase';

/** A weekly cohort of sign-ups, as supabase/migrations/20260926140000_beta_metrics.sql counts it. */
export interface Cohort {
	/** Monday of the week, YYYY-MM-DD. */
	week: string;
	signups: number;
	activated: number;
	trial_ended: number;
	paid: number;
	w4_eligible: number;
	w4_returned: number;
}

/** The beta's metrics by weekly cohort, newest first. Counts only; the function is callable by the service role alone. */
export async function betaMetrics(): Promise<Cohort[]> {
	const { data, error } = await (adminClient() as unknown as SupabaseClient).rpc('beta_metrics');
	if (error) throw error;
	return (data ?? []) as Cohort[];
}

/** The cohorts added up. */
export function totals(cohorts: Cohort[]): Omit<Cohort, 'week'> {
	const sum = (k: keyof Omit<Cohort, 'week'>) => cohorts.reduce((n, c) => n + c[k], 0);
	return { signups: sum('signups'), activated: sum('activated'), trial_ended: sum('trial_ended'), paid: sum('paid'), w4_eligible: sum('w4_eligible'), w4_returned: sum('w4_returned') };
}

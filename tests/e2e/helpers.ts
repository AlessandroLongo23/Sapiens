import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import type { Page } from '@playwright/test';

/** Throwaway Supabase users and Stripe sandbox customers for one test run. */

export const supabaseAdmin = () =>
	createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
		auth: { persistSession: false, autoRefreshToken: false }
	});

export const stripeSandbox = () => new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-08-26.dahlia' });

export interface TestUser {
	id: string;
	email: string;
	password: string;
}

export async function createTestUser(label: string): Promise<TestUser> {
	const email = `e2e-${label}-${Date.now()}@example.com`;
	const password = `Pw-${Math.random().toString(36).slice(2)}-${Date.now()}`;
	const { data, error } = await supabaseAdmin().auth.admin.createUser({
		email,
		password,
		email_confirm: true,
		user_metadata: { first_name: 'Test', last_name: label }
	});
	if (error || !data.user) throw new Error(`could not create test user: ${error?.message}`);
	return { id: data.user.id, email, password };
}

/** Removes the user and any Stripe customer created for it (subscriptions go with the customer). */
export async function deleteTestUser(user: TestUser | null) {
	if (!user) return;
	const stripe = stripeSandbox();
	const customers = await stripe.customers.list({ email: user.email, limit: 5 });
	for (const c of customers.data) {
		await stripe.customers.del(c.id);
	}
	await supabaseAdmin().auth.admin.deleteUser(user.id);
}

export async function subscriptionClaim(userId: string) {
	const { data } = await supabaseAdmin().auth.admin.getUserById(userId);
	return (data.user?.app_metadata?.subscription ?? null) as null | { plan: string; status: string };
}

/** Signs in through the site's own modal. */
export async function loginViaModal(page: Page, user: TestUser) {
	await page.getByRole('button', { name: 'Accedi' }).first().click();
	const dialog = page.getByRole('dialog');
	await dialog.getByPlaceholder('Email').fill(user.email);
	await dialog.getByPlaceholder('Password').fill(user.password);
	await dialog.getByRole('button', { name: 'Accedi', exact: true }).click();
	await page.getByRole('link', { name: /Account|Dashboard/ }).waitFor();
}

export const EXERCISES_PATH =
	'/materiale/scuola-superiore/matematica/insiemi-e-logica/operazioni-e-relazioni-tra-insiemi/esercizi';
export const THEORY_PATH = '/materiale/scuola-superiore/matematica/insiemi-e-logica/prime-definizioni';

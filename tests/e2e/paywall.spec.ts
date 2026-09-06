import { test, expect } from '@playwright/test';
import { createTestUser, deleteTestUser, loginViaModal, subscriptionClaim, EXERCISES_PATH, THEORY_PATH, type TestUser } from './helpers';

/**
 * The whole Premium path with a throwaway account against the Stripe sandbox:
 * locked → login → Checkout with trial → webhook → unlocked → AI gate → portal.
 */
test.describe.configure({ mode: 'serial' });

let user: TestUser | null = null;

test.beforeAll(async () => {
	user = await createTestUser('paywall');
});

test.afterAll(async () => {
	await deleteTestUser(user);
});

test('anonymous visitor sees the upgrade card, not the exercises', async ({ page }) => {
	await page.goto(EXERCISES_PATH);
	await expect(page.locator('#paywall-title')).toContainText('piano Lite');
	await expect(page.getByRole('button', { name: /Prova Lite gratis/ })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Inizia Esercizi' })).toHaveCount(0);
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
});

test('free account: still locked, then Checkout with the trial unlocks it', async ({ page }) => {
	await page.goto(EXERCISES_PATH);
	await page.getByRole('button', { name: 'Rifiuta' }).click();
	await loginViaModal(page, user!);

	await expect(page.locator('#paywall-title')).toContainText('piano Lite');
	await expect(page.getByText('Hai già un abbonamento?')).toHaveCount(0);

	await page.getByRole('button', { name: /Prova Lite gratis/ }).click();
	await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30_000 });
	await expect(page.getByTestId('product-summary-total-amount')).toContainText('7 giorni');
	await page.getByTestId('hosted-payment-submit-button').click();

	await page.waitForURL(/\/pricing\/success/, { timeout: 60_000 });
	await expect(page.getByRole('heading', { name: /attivo/ })).toBeVisible({ timeout: 45_000 });

	const claim = await subscriptionClaim(user!.id);
	expect(claim).toMatchObject({ plan: 'lite', status: 'trialing' });

	await page.getByRole('link', { name: 'Continua' }).click();
	await page.waitForURL(new RegExp(EXERCISES_PATH.replace(/\//g, '\\/')));
	await expect(page.locator('#paywall-title')).toHaveCount(0);
	await page.getByRole('button', { name: 'Inizia Esercizi' }).click();

	// Answer every question with its first option; the summary appears at the end.
	for (let i = 0; i < 12; i++) {
		const summary = page.getByText(/Corrette/);
		if (await summary.isVisible().catch(() => false)) break;
		const option = page.locator('#esercizi button').first();
		await option.waitFor({ state: 'visible' });
		await option.click();
		await page.waitForTimeout(1700);
	}
	await expect(page.getByText(/Corrette/)).toBeVisible();
});

test('Lite does not include Sapiens AI: the sidebar shows the Base card and the API refuses', async ({ page }) => {
	await page.goto(THEORY_PATH);
	await page.getByRole('button', { name: 'Rifiuta' }).click();
	await loginViaModal(page, user!);
	await page.goto(THEORY_PATH);
	await expect(page.locator('#paywall-title')).toContainText('piano Base');
	const res = await page.request.post('/api/chat', { data: { messages: [{ role: 'user', content: 'ciao' }] } });
	expect(res.status()).toBe(403);
	expect((await res.json()).requiredPlan).toBe('base');
});

test('account page shows the plan and the portal cancels at period end', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Rifiuta' }).click();
	await loginViaModal(page, user!);
	await page.goto('/subscription');
	await expect(page.locator('h3', { hasText: 'Piano Lite' })).toBeVisible();
	await expect(page.getByText('Periodo di prova')).toBeVisible();

	await page.getByRole('button', { name: 'Gestisci abbonamento' }).click();
	await page.waitForURL(/billing\.stripe\.com/, { timeout: 30_000 });
	// The portal renders its actions as links; the confirmation screen repeats the label.
	const cancel = /Annulla abbonamento|Cancel subscription|Cancel plan/i;
	await page.getByRole('link', { name: cancel }).first().click();
	await expect(page.getByText(/fine del periodo|end of (the )?billing period/i)).toBeVisible({ timeout: 20_000 });
	await page.getByRole('button', { name: cancel }).or(page.getByRole('link', { name: cancel })).last().click();
	await expect(page.getByText(/Data di annullamento|Non annullare|will be cancel|renew/i).first()).toBeVisible({ timeout: 20_000 });

	const claim = await subscriptionClaim(user!.id);
	expect(claim?.plan).toBe('lite');
});

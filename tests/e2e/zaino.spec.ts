import { test, expect } from '@playwright/test';
import { createTestUser, deleteTestUser, gotoHydrated, loginViaModal, type TestUser } from './helpers';

/**
 * The backpack: the signed-out landing, the free-plan ceilings, and the
 * editor — autosave, both modes, and the two things the Simple mode must not
 * lose (a formula's LaTeX, and a table it cannot edit).
 */

const CONSENT = {
	name: 'sapiens-cookie-consent',
	value: encodeURIComponent(
		JSON.stringify({ necessary: true, analytics: false, version: '2026-09-03', timestamp: new Date().toISOString() })
	),
	path: '/'
};

test.beforeEach(async ({ context, baseURL }) => {
	await context.addCookies([{ ...CONSENT, domain: new URL(baseURL!).hostname }]);
});

test('signed out, /zaino sells itself instead of redirecting', async ({ page }) => {
	const response = await page.goto('/zaino');
	expect(response?.status()).toBe(200);
	expect(new URL(page.url()).pathname).toBe('/zaino');
	await expect(page.getByRole('heading', { name: /I tuoi appunti/ })).toBeVisible();
	// Reachable, but never indexed.
	expect(response?.headers()['x-robots-tag']).toContain('noindex');
});

test.describe('free plan', () => {
	let user: TestUser | null = null;
	test.afterEach(async () => {
		await deleteTestUser(user);
		user = null;
	});

	test('one quaderno, five note, then the paywall', async ({ page }) => {
		user = await createTestUser('zaino-free');
		await gotoHydrated(page, '/zaino');
		await loginViaModal(page, user);
		await gotoHydrated(page, '/zaino');

		await page.getByRole('button', { name: 'Crea il primo quaderno' }).click();
		await expect(page.getByRole('link', { name: /Nuovo quaderno/ })).toBeVisible();

		// The note ceiling, through the API the page calls: five pass, the sixth is 402.
		const shelf = await (await page.request.get('/api/zaino/quaderni')).json();
		const notebookId = shelf.notebooks[0].id;
		for (let i = 0; i < 5; i++) {
			const made = await page.request.post(`/api/zaino/quaderni/${notebookId}/note`, { data: {} });
			expect(made.status(), `note ${i + 1}`).toBe(201);
		}
		const sixth = await page.request.post(`/api/zaino/quaderni/${notebookId}/note`, { data: {} });
		expect(sixth.status(), 'the sixth note').toBe(402);
		expect((await sixth.json()).error).toContain('piano gratuito');

		// The second quaderno is over the ceiling too, and the page says so with the paywall.
		await page.getByRole('button', { name: 'Nuovo quaderno', exact: true }).click();
		await expect(page.getByRole('heading', { name: /piano Lite/ })).toBeVisible();
	});

	test('a stale save is refused with the row that won', async ({ page }) => {
		user = await createTestUser('zaino-conflict');
		await gotoHydrated(page, '/zaino');
		await loginViaModal(page, user);

		const notebook = (await (await page.request.post('/api/zaino/quaderni', { data: { title: 'Conflitti' } })).json()).notebook;
		const note = (await (await page.request.post(`/api/zaino/quaderni/${notebook.id}/note`, { data: {} })).json()).note;

		const first = await page.request.patch(`/api/zaino/note/${note.id}`, { data: { content: 'primo', version: note.version } });
		expect(first.status()).toBe(200);

		// A second tab still holding the old version loses, and is handed the winner.
		const stale = await page.request.patch(`/api/zaino/note/${note.id}`, { data: { content: 'secondo', version: note.version } });
		expect(stale.status()).toBe(409);
		expect((await stale.json()).note.content).toBe('primo');
	});
});

test.describe('the editor', () => {
	let user: TestUser | null = null;
	test.afterEach(async () => {
		await deleteTestUser(user);
		user = null;
	});

	test('writes, saves by itself, and keeps what Simple mode cannot edit', async ({ page }) => {
		user = await createTestUser('zaino-edit', { subscription: 'lite' });
		await gotoHydrated(page, '/zaino');
		await loginViaModal(page, user);
		await gotoHydrated(page, '/zaino');

		await page.getByRole('button', { name: 'Crea il primo quaderno' }).click();
		await page.getByRole('link', { name: /Nuovo quaderno/ }).click();
		await page.getByRole('button', { name: 'Scrivi la prima nota' }).click();
		await page.getByRole('link', { name: /Nuova nota/ }).click();

		// Advanced mode is the source view: type markdown, including a formula
		// and a table (which Simple mode has to freeze rather than drop).
		await page.getByRole('group', { name: 'Modalità di scrittura' }).getByRole('button', { name: 'Avanzata' }).click();
		const source = page.getByRole('textbox', { name: /Testo della nota in markdown/ });
		const written = '# Le derivate\n\nLa derivata di $x^2$ vale $2x$, e $a_1 + \\frac{n(n+1)}{2}$ resta intatto.\n\n| a | b |\n|---|---|\n| 1 | 2 |\n';
		await source.fill(written);

		await expect(page.getByRole('status').filter({ hasText: 'Salvato' })).toBeVisible({ timeout: 20_000 });

		// It survives a reload, which is the only proof that matters.
		await page.reload();
		await page.getByRole('group', { name: 'Modalità di scrittura' }).getByRole('button', { name: 'Avanzata' }).click();
		await expect(page.getByRole('textbox', { name: /Testo della nota in markdown/ })).toHaveValue(/Le derivate/);

		// Simple mode typesets the formula and locks the table instead of losing it.
		await page.getByRole('group', { name: 'Modalità di scrittura' }).getByRole('button', { name: 'Semplice' }).click();
		await expect(page.getByRole('textbox', { name: 'Testo della nota' })).toBeVisible();
		// The banner's wording is free to change; the way out of it is not.
		await expect(page.getByRole('button', { name: 'Passa ad Avanzata' })).toBeVisible();
		await expect(page.getByRole('group', { name: /Blocco non modificabile/ })).toBeVisible();
		await expect(page.locator('.katex').first()).toBeVisible();

		// Back to the source: the LaTeX comes through unescaped.
		await page.getByRole('group', { name: 'Modalità di scrittura' }).getByRole('button', { name: 'Avanzata' }).click();
		const after = await page.getByRole('textbox', { name: /Testo della nota in markdown/ }).inputValue();
		expect(after).toContain('$a_1 + \\frac{n(n+1)}{2}$');
		expect(after).toContain('| 1 | 2 |');
	});
});

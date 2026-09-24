import { test, expect, type Page } from '@playwright/test';
import { createTestUser, deleteTestUser, gotoHydrated, loginViaModal, THEORY_PATH, type TestUser } from './helpers';

/**
 * Organising the backpack: moving a note between quaderni, ordering a list,
 * finding a note again, and taking notes from a lesson.
 */

const CONSENT = {
	name: 'sapiens-cookie-consent',
	value: encodeURIComponent(
		JSON.stringify({ necessary: true, analytics: false, version: '2026-09-03', timestamp: new Date().toISOString() })
	),
	path: '/'
};

let user: TestUser | null = null;

test.beforeEach(async ({ context, baseURL }) => {
	await context.addCookies([{ ...CONSENT, domain: new URL(baseURL!).hostname }]);
});
test.afterEach(async () => {
	await deleteTestUser(user);
	user = null;
});

/** A signed-in student with two quaderni and three notes in the first. */
async function backpack(page: Page) {
	user = await createTestUser('zaino-org', { subscription: 'lite' });
	await gotoHydrated(page, '/zaino');
	await loginViaModal(page, user);
	const make = async (title: string) => (await (await page.request.post('/api/zaino/quaderni', { data: { title } })).json()).notebook;
	const analisi = await make('Analisi');
	const fisica = await make('Fisica');
	const notes = [];
	for (const [title, content] of [
		['Le derivate', '# Le derivate\n\nLa derivata misura la variazione.'],
		['Limiti notevoli', '# Limiti notevoli\n\nIl limite fondamentale del seno.'],
		['Integrali', '# Integrali\n\nIntegrazione per sostituzione.'],
		// A fourth note: the filter field appears once a quaderno holds more than three.
		['Serie numeriche', '# Serie numeriche\n\nConvergenza e divergenza.']
	]) {
		const note = (await (await page.request.post(`/api/zaino/quaderni/${analisi.id}/note`, { data: { title } })).json()).note;
		await page.request.patch(`/api/zaino/note/${note.id}`, { data: { content, version: note.version } });
		notes.push(note);
	}
	return { analisi, fisica, notes };
}

test('a note moves to another quaderno', async ({ page }) => {
	const { analisi, fisica } = await backpack(page);
	await gotoHydrated(page, `/zaino/${analisi.id}`);

	await page.getByRole('button', { name: 'Opzioni di Le derivate' }).click();
	await page.getByRole('button', { name: 'Sposta in un altro quaderno' }).click();
	const sheet = page.getByRole('dialog', { name: 'Sposta la nota' });
	await sheet.getByRole('button', { name: /Fisica/ }).click();

	await expect(page.getByRole('link', { name: /Le derivate/ })).toHaveCount(0);
	await gotoHydrated(page, `/zaino/${fisica.id}`);
	await expect(page.getByRole('link', { name: /Le derivate/ })).toBeVisible();
});

test('notes reorder from the keyboard and the order sticks', async ({ page }) => {
	const { analisi } = await backpack(page);
	await gotoHydrated(page, `/zaino/${analisi.id}`);

	const titles = async () => page.locator('li[data-reorder-id] a span:nth-child(1)').allInnerTexts();
	expect((await titles())[0]).toBe('Le derivate');

	// The grab handle is a button: arrows move the row it belongs to.
	await page.getByRole('button', { name: /Riordina Le derivate/ }).focus();
	await page.keyboard.press('ArrowDown');
	await expect.poll(async () => (await titles())[0]).toBe('Limiti notevoli');

	await page.waitForResponse((r) => r.url().includes('/note/reorder') && r.request().method() === 'POST');
	await page.reload();
	expect((await titles())[0], 'the new order survives a reload').toBe('Limiti notevoli');
});

test('a note is findable by a word from its body', async ({ page }) => {
	const { analisi } = await backpack(page);

	// In the quaderno, the filter narrows what is on the page.
	await gotoHydrated(page, `/zaino/${analisi.id}`);
	await page.getByRole('searchbox', { name: /Filtra le note/ }).fill('sostituzione');
	await expect(page.getByRole('link', { name: /Integrali/ })).toBeVisible();
	await expect(page.getByRole('link', { name: /Le derivate/ })).toHaveCount(0);

	// Site-wide, the student's own notes come back above the catalogue.
	await gotoHydrated(page, '/zaino');
	await page.getByPlaceholder('Cerca su Sapiens').fill('sostituz');
	const overlay = page.getByPlaceholder('Cerca in Sapiens');
	await expect(overlay).toBeVisible();
	await overlay.fill('sostituz');
	const own = page.locator('section[aria-labelledby="note-trovate"]');
	await expect(own.getByRole('link', { name: /Integrali/ })).toBeVisible({ timeout: 15_000 });
});

test('the shelf offers the notes touched most recently', async ({ page }) => {
	await backpack(page);
	await gotoHydrated(page, '/zaino');
	const recent = page.locator('section[aria-labelledby="recenti"]');
	await expect(recent).toBeVisible();
	await expect(recent.getByRole('link', { name: /Integrali/ })).toBeVisible();
});

test('a lesson makes a note bound to it, and the note links back', async ({ page }) => {
	user = await createTestUser('zaino-lesson', { subscription: 'lite' });
	await gotoHydrated(page, THEORY_PATH);
	await loginViaModal(page, user);
	await gotoHydrated(page, THEORY_PATH);

	await page.getByRole('button', { name: /Prendi appunti/ }).click();
	await page.waitForURL(/\/zaino\/nota\//);

	// The note carries the lesson's title and a way back to it.
	const back = page.getByRole('link', { name: /.+/ }).filter({ hasText: /.+/ });
	await expect(page.locator(`a[href="${THEORY_PATH}"]`).last()).toBeVisible();
	expect(back).toBeTruthy();

	// Returning to the lesson, the button says a note already exists.
	await gotoHydrated(page, THEORY_PATH);
	await expect(page.getByRole('button', { name: /Riprendi i tuoi appunti/ })).toBeVisible({ timeout: 10_000 });
});

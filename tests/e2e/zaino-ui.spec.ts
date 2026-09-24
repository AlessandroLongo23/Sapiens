import { test, expect } from '@playwright/test';
import { createTestUser, deleteTestUser, gotoHydrated, loginViaModal, type TestUser } from './helpers';

/**
 * The Zaino's interaction and motion contract: what must stay true whatever the
 * styling does. Hover and press feedback, a toolbar that behaves like a real
 * toolbar for the keyboard, a formatting button that does not steal the caret,
 * and motion that gets out of the way when the visitor asks it to.
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

async function withNote(page: import('@playwright/test').Page) {
	user = await createTestUser('zaino-ui', { subscription: 'lite' });
	await gotoHydrated(page, '/zaino');
	await loginViaModal(page, user);
	const notebook = (await (await page.request.post('/api/zaino/quaderni', { data: { title: 'Analisi' } })).json()).notebook;
	const note = (
		await (await page.request.post(`/api/zaino/quaderni/${notebook.id}/note`, { data: { title: 'Derivate' } })).json()
	).note;
	await page.request.patch(`/api/zaino/note/${note.id}`, {
		data: { content: '# Derivate\n\nLa derivata di $x^2$ vale $2x$.\n\n- primo punto\n- secondo punto\n', version: note.version }
	});
	return { notebook, note };
}

test('a quaderno card answers the pointer and the keyboard', async ({ page }) => {
	const { notebook } = await withNote(page);
	await gotoHydrated(page, '/zaino');

	const card = page.getByRole('link', { name: /Analisi/ }).first();
	// Tailwind v4 puts `translate-y` on the `translate` property, not `transform`.
	const rest = await card.evaluate((el) => getComputedStyle(el).translate);
	await card.hover();
	await page.waitForTimeout(300);
	const hovered = await card.evaluate((el) => getComputedStyle(el).translate);
	expect(hovered, 'the card lifts on hover').not.toBe(rest);

	// The options button is always reachable, and named for the quaderno it belongs to.
	await expect(page.getByRole('button', { name: `Opzioni di ${notebook.title}` })).toBeAttached();

	// Keyboard focus is visible, not just implied.
	await card.focus();
	const ring = await card.evaluate((el) => getComputedStyle(el).boxShadow + getComputedStyle(el).outlineWidth);
	expect(ring, 'a focused card shows a ring').not.toMatch(/^none0px$/);
});

test('the toolbar is one tab stop and the arrows move within it', async ({ page }) => {
	const { note } = await withNote(page);
	await gotoHydrated(page, `/zaino/nota/${note.id}`);
	const toolbar = page.getByRole('toolbar', { name: 'Formattazione' });
	await expect(toolbar).toBeVisible();

	const tabbable = toolbar.locator('button[tabindex="0"]');
	await expect(tabbable, 'exactly one button is tabbable').toHaveCount(1);
	// Annulla leads the toolbar and is disabled until there is something to undo:
	// if the roving index sat on it, Tab could not reach the toolbar at all.
	await expect(tabbable, 'the tabbable button is not a disabled one').toBeEnabled();

	await tabbable.focus();
	const first = await toolbar.locator('button:focus').getAttribute('aria-label');
	await page.keyboard.press('ArrowRight');
	const second = await toolbar.locator('button:focus').getAttribute('aria-label');
	expect(second, 'ArrowRight moves along the toolbar').not.toBe(first);
	await page.keyboard.press('End');
	const last = await toolbar.locator('button:focus').getAttribute('aria-label');
	expect(last).not.toBe(second);

	// Toggles say whether they are on; plain actions must not pretend to.
	await expect(toolbar.getByRole('button', { name: 'Grassetto' })).toHaveAttribute('aria-pressed', /true|false/);
	await expect(toolbar.getByRole('button', { name: 'Annulla' })).not.toHaveAttribute('aria-pressed', /.*/);
});

test('a formatting button does not take the caret from the text', async ({ page }) => {
	const { note } = await withNote(page);
	await gotoHydrated(page, `/zaino/nota/${note.id}`);
	const body = page.getByRole('textbox', { name: 'Testo della nota' });
	await body.click();
	await expect(body).toBeFocused();

	// Without preventDefault on pointerdown this blurs the editor and the command
	// applies to nothing — the classic way a mobile editor toolbar ships broken.
	await page.getByRole('toolbar', { name: 'Formattazione' }).getByRole('button', { name: 'Grassetto' }).click();
	await expect(body, 'the caret stays in the note').toBeFocused();
});

test('reduced motion leaves nothing hidden behind a delay', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await withNote(page);
	await gotoHydrated(page, '/zaino');

	// The shelf staggers items with an animation-delay. With the duration cut but
	// the delay intact, `fill-mode: both` would hold later items invisible.
	const cards = page.locator('li.note-in');
	await expect(cards.first()).toBeVisible();
	for (const card of await cards.all()) {
		const { opacity, delay } = await card.evaluate((el) => ({
			opacity: Number(getComputedStyle(el).opacity),
			delay: getComputedStyle(el).animationDelay
		}));
		expect(delay, 'the stagger delay is cleared').toBe('0s');
		expect(opacity, 'every card is fully visible at once').toBe(1);
	}
});

test('the note body uses the tightened note scale, not the lesson scale', async ({ page }) => {
	const { note } = await withNote(page);
	await gotoHydrated(page, `/zaino/nota/${note.id}`);
	const body = page.getByRole('textbox', { name: 'Testo della nota' });
	await expect(body).toHaveClass(/note-body/);

	// The h1 a note carries must not render at body size (the lesson pipeline
	// never needed an h1 rule, so it had none).
	const h1 = body.locator('h1').first();
	const size = await h1.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
	const paragraph = await body.locator('p').first().evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
	expect(size, 'the note title is a heading, not body text').toBeGreaterThan(paragraph * 1.3);

	// A list item's text is a paragraph; without the override it carries the
	// paragraph's bottom margin and every bullet sits a line and a half apart.
	const gap = await body.locator('li p').first().evaluate((el) => getComputedStyle(el).marginBottom);
	expect(gap, 'list items are not double-spaced').toBe('0px');
});

test('typing during a save is never overwritten by the response', async ({ page }) => {
	const { note } = await withNote(page);

	// Hold every save open long enough to type into the gap on purpose. This is
	// the window the bug lived in: the response used to be written back over the
	// editor, deleting whatever had been typed while it was in flight.
	await page.route('**/api/zaino/note/**', async (route) => {
		if (route.request().method() !== 'PATCH') return route.fallback();
		await new Promise((resolve) => setTimeout(resolve, 1500));
		await route.continue();
	});

	await gotoHydrated(page, `/zaino/nota/${note.id}`);
	await page.getByRole('group', { name: 'Modalità di scrittura' }).getByRole('button', { name: 'Avanzata' }).click();
	const source = page.getByRole('textbox', { name: /Testo della nota in markdown/ });

	await source.click();
	await page.keyboard.press('ControlOrMeta+a');
	await page.keyboard.type('PRIMA');
	await expect(page.getByRole('status').filter({ hasText: 'Salvataggio' })).toBeVisible({ timeout: 10_000 });

	// Armed before the second burst, so the assertion below runs *after* the
	// response has landed — checking any earlier would pass before the old code
	// had a chance to roll the editor back.
	const landed = page.waitForResponse((r) => r.url().includes('/api/zaino/note/') && r.request().method() === 'PATCH');
	await page.keyboard.type('-DOPO');
	await landed;

	await expect(source, 'the response must not roll the editor back').toHaveValue('PRIMA-DOPO');

	// And the trailing edit must still reach the server on its own.
	await page.unroute('**/api/zaino/note/**');
	await expect(page.getByRole('status').filter({ hasText: 'Salvato' })).toBeVisible({ timeout: 20_000 });
	const saved = await (await page.request.get(`/api/zaino/note/${note.id}`)).json();
	expect(saved.note.content.trim(), 'the whole text reached the server').toBe('PRIMA-DOPO');
});

test('the title survives a save that lands while it is being typed', async ({ page }) => {
	const { note } = await withNote(page);
	await page.route('**/api/zaino/note/**', async (route) => {
		if (route.request().method() !== 'PATCH') return route.fallback();
		await new Promise((resolve) => setTimeout(resolve, 1200));
		await route.continue();
	});

	await gotoHydrated(page, `/zaino/nota/${note.id}`);
	const heading = page.getByRole('textbox', { name: 'Titolo della nota' });
	await heading.click();
	await page.keyboard.press('ControlOrMeta+a');
	await page.keyboard.type('Deriv');
	await expect(page.getByRole('status').filter({ hasText: 'Salvataggio' })).toBeVisible({ timeout: 10_000 });

	const landed = page.waitForResponse((r) => r.url().includes('/api/zaino/note/') && r.request().method() === 'PATCH');
	await page.keyboard.type('ate parziali');
	await landed;

	await expect(heading, 'the title must not revert mid-word').toHaveValue('Derivate parziali');
});

test('the formula editor takes Enter to confirm and Shift+Enter for a new line', async ({ page }) => {
	const { note } = await withNote(page);
	await gotoHydrated(page, `/zaino/nota/${note.id}`);

	const body = page.getByRole('textbox', { name: 'Testo della nota' });
	await body.click();
	await page.getByRole('toolbar', { name: 'Formattazione' }).getByRole('button', { name: 'Formula' }).click();

	const source = page.getByRole('textbox', { name: 'Formula in LaTeX' });
	await expect(source).toBeVisible();
	await expect(source).toBeFocused();

	// Shift+Enter stays in the field and writes a line break.
	await page.keyboard.type('a^2');
	await page.keyboard.press('Shift+Enter');
	await page.keyboard.type('+b^2');
	await expect(source, 'Shift+Enter goes to a new line').toHaveValue('a^2\n+b^2');
	await expect(source, 'and does not close the popover').toBeVisible();

	// Enter confirms, like the Fine button.
	await page.keyboard.press('Enter');
	await expect(source, 'Enter confirms and closes').toBeHidden();
	await expect(body.locator('.katex').first()).toBeVisible();
});

test('Escape leaves the formula editor without confirming', async ({ page }) => {
	const { note } = await withNote(page);
	await gotoHydrated(page, `/zaino/nota/${note.id}`);
	await page.getByRole('textbox', { name: 'Testo della nota' }).click();
	await page.getByRole('toolbar', { name: 'Formattazione' }).getByRole('button', { name: 'Formula' }).click();

	const source = page.getByRole('textbox', { name: 'Formula in LaTeX' });
	await page.keyboard.type('x^2');
	await page.keyboard.press('Escape');
	await expect(source).toBeHidden();
});

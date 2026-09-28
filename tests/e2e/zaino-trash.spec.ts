import { test, expect, type Page } from '@playwright/test';
import { createTestUser, deleteTestUser, gotoHydrated, loginViaModal, type TestUser } from './helpers';

/**
 * The Zaino's trash: deleting moves a note or a quaderno there, what is in it does not count towards the free plan's
 * ceiling, and it can be restored or deleted for good. (A new account is on the 7-day trial, so the 402 itself is not
 * reachable here: the counts the ceiling is read from are.) Then the two ways to throw a note away on the page: its ⋯ menu, and
 * dragging it onto the trash that comes up while a note is dragged.
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

let user: TestUser | null = null;
test.afterEach(async () => {
	await deleteTestUser(user);
	user = null;
});

async function signIn(page: Page, label: string, subscription?: string) {
	user = await createTestUser(label, subscription ? { subscription } : {});
	await gotoHydrated(page, '/zaino');
	await loginViaModal(page, user);
}

async function notebookWithNotes(page: Page, title: string, count: number) {
	const made = await page.request.post('/api/zaino/quaderni', { data: { title, color: 'crimson' } });
	expect(made.status()).toBe(201);
	const notebook = (await made.json()).notebook as { id: string };
	const notes: string[] = [];
	for (let i = 0; i < count; i++) {
		const note = await page.request.post(`/api/zaino/quaderni/${notebook.id}/note`, { data: { title: `Nota ${i + 1}` } });
		expect(note.status(), `note ${i + 1}`).toBe(201);
		notes.push((await note.json()).note.id);
	}
	return { notebookId: notebook.id, notes };
}

const trash = async (page: Page) => (await (await page.request.get('/api/zaino/cestino')).json()).trash as { notebooks: { id: string; notes: number }[]; notes: { id: string }[] };

const used = async (page: Page) => (await (await page.request.get('/api/zaino/quaderni')).json()).quota as { notebooks: { used: number }; notes: { used: number } };

test('the trash: what it holds, what counts, restore and delete for good', async ({ page }) => {
	await signIn(page, 'zaino-trash');
	const { notebookId, notes } = await notebookWithNotes(page, 'Fisica', 5);
	expect((await used(page)).notes.used).toBe(5);

	// A note in the trash is off the shelf and off the count.
	expect((await page.request.delete(`/api/zaino/note/${notes[0]}`)).status()).toBe(200);
	expect((await used(page)).notes.used, 'the trash does not count').toBe(4);
	expect((await page.request.get(`/api/zaino/note/${notes[0]}`)).status(), 'a note in the trash is not found').toBe(404);
	const listed = (await (await page.request.get(`/api/zaino/quaderni/${notebookId}/note`)).json()).notes as { id: string }[];
	expect(listed.map((n) => n.id)).not.toContain(notes[0]);
	// Restored, and back at the end of its quaderno.
	expect((await page.request.post(`/api/zaino/cestino/note/${notes[0]}`)).status()).toBe(200);
	const back0 = (await (await page.request.get(`/api/zaino/quaderni/${notebookId}/note`)).json()).notes as { id: string }[];
	expect(back0.map((n) => n.id).at(-1)).toBe(notes[0]);
	expect((await page.request.delete(`/api/zaino/note/${notes[0]}`)).status()).toBe(200);

	// Deleted for good: gone from the trash.
	expect((await page.request.delete(`/api/zaino/cestino/note/${notes[0]}`)).status()).toBe(200);
	expect((await trash(page)).notes).toHaveLength(0);
	// Only from the trash: a note on the shelf is not deleted for good.
	expect((await page.request.delete(`/api/zaino/cestino/note/${notes[1]}`)).status()).toBe(404);

	// A quaderno goes with its notes, and comes back with them.
	expect((await page.request.delete(`/api/zaino/quaderni/${notebookId}`)).status()).toBe(200);
	const shelf = await (await page.request.get('/api/zaino/quaderni')).json();
	expect(shelf.notebooks).toHaveLength(0);
	expect(shelf.quota.notes.used, 'notes in a quaderno in the trash do not count').toBe(0);
	expect(shelf.quota.notebooks.used).toBe(0);
	const held = await trash(page);
	expect(held.notebooks).toEqual([expect.objectContaining({ id: notebookId, notes: 4 })]);
	const back = await page.request.post(`/api/zaino/cestino/quaderni/${notebookId}`);
	expect(back.status()).toBe(200);
	const restored = await (await page.request.get('/api/zaino/quaderni')).json();
	expect(restored.notebooks.map((n: { id: string }) => n.id)).toEqual([notebookId]);
	expect(restored.quota.notes.used).toBe(4);

	// A note restored from a quaderno in the trash brings the quaderno back.
	expect((await page.request.delete(`/api/zaino/note/${notes[1]}`)).status()).toBe(200);
	expect((await page.request.delete(`/api/zaino/quaderni/${notebookId}`)).status()).toBe(200);
	const both = await page.request.post(`/api/zaino/cestino/note/${notes[1]}`);
	expect(both.status()).toBe(200);
	expect((await both.json()).notebookRestored).toBe(true);

	// Emptied: nothing left in it.
	expect((await page.request.delete(`/api/zaino/note/${notes[2]}`)).status()).toBe(200);
	expect((await page.request.delete('/api/zaino/cestino')).status()).toBe(200);
	const empty = await trash(page);
	expect(empty.notebooks).toHaveLength(0);
	expect(empty.notes).toHaveLength(0);
});

test('a quaderno restored after its name was taken comes back renamed', async ({ page }) => {
	await signIn(page, 'zaino-trash-name', 'base');
	const first = await notebookWithNotes(page, 'Chimica', 0);
	expect((await page.request.delete(`/api/zaino/quaderni/${first.notebookId}`)).status()).toBe(200);
	await notebookWithNotes(page, 'Chimica', 0);
	const back = await page.request.post(`/api/zaino/cestino/quaderni/${first.notebookId}`);
	expect(back.status()).toBe(200);
	expect((await back.json()).notebook.title).toBe('Chimica (ripristinato)');
});

test('thrown away from the menu and from a drag, then restored from the trash page', async ({ page }) => {
	await signIn(page, 'zaino-trash-ui', 'base');
	const { notebookId } = await notebookWithNotes(page, 'Storia', 3);
	await gotoHydrated(page, `/zaino/${notebookId}`);
	const trashLink = page.getByRole('link', { name: /^Cestino/ });
	await expect(trashLink).toHaveAccessibleName('Cestino');

	// From the ⋯ menu: no confirmation, into the trash.
	await page.getByRole('button', { name: 'Opzioni di Nota 1' }).first().click();
	await page.getByRole('button', { name: 'Elimina la nota' }).click();
	await expect(page.locator('[data-note-id]')).toHaveCount(2, { timeout: 10_000 });
	await expect(trashLink).toHaveAccessibleName('Cestino, 1 elemento');

	// Dragged onto the trash that comes up: into the trash too, and the order is not saved.
	await page.getByRole('button', { name: 'Elenco' }).click();
	const handle = page.locator('[data-note-id]').first().locator('[data-reorder-handle]');
	const box = (await handle.boundingBox())!;
	await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
	await page.mouse.down();
	await page.mouse.move(box.x + box.width / 2, box.y + 40, { steps: 4 });
	const bin = page.locator('.zn-drop-bin[data-shown]');
	await expect(bin).toBeVisible();
	const target = (await bin.boundingBox())!;
	await page.mouse.move(target.x + target.width / 2, target.y + target.height / 2, { steps: 12 });
	await expect(page.locator('.zn-drop-bin[data-over]')).toBeVisible();
	await page.mouse.up();
	await expect(page.locator('[data-note-id]')).toHaveCount(1, { timeout: 10_000 });
	await expect(trashLink).toHaveAccessibleName('Cestino, 2 elementi');

	// The trash page lists both; one comes back to its quaderno.
	await trashLink.click();
	await expect(page.getByRole('heading', { name: 'Cestino', level: 1 })).toBeVisible();
	await expect(page.locator('[data-trash-id]')).toHaveCount(2);
	await page.getByRole('button', { name: 'Ripristina' }).first().click();
	await expect(page.getByRole('status').filter({ hasText: 'è tornata in «Storia»' })).toBeVisible();
	await expect(page.locator('[data-trash-id]')).toHaveCount(1);
	await gotoHydrated(page, `/zaino/${notebookId}`);
	await expect(page.locator('[data-note-id]')).toHaveCount(2);
});

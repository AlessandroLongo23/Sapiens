import { test, expect, type Page } from '@playwright/test';
import { createTestUser, deleteTestUser, gotoHydrated, loginViaModal, EXERCISES_PATH, THEORY_PATH, type TestUser } from './helpers';

/**
 * The phone experience, on the iPhone and Pixel projects: the shell (tab
 * bar, menu sheet, search), the lesson reader (section bar, table of
 * contents sheet, assistant sheet, selection menu), the exercise runner,
 * the tutor list filters, and a few hard limits (no sideways scroll,
 * targets big enough for a finger, inputs that do not trigger zoom).
 */

const CONSENT = {
	name: 'sapiens-cookie-consent',
	value: encodeURIComponent(
		JSON.stringify({ necessary: true, analytics: false, version: '2026-09-03', timestamp: new Date().toISOString() })
	),
	path: '/'
};

/** What a copy would put on the clipboard, without touching the real one. */
async function copyOf(page: Page): Promise<string> {
	return page.evaluate(() => {
		const data = new DataTransfer();
		document.dispatchEvent(new ClipboardEvent('copy', { clipboardData: data, bubbles: true, cancelable: true }));
		return data.getData('text/plain');
	});
}

async function noHorizontalOverflow(page: Page, label: string) {
	const { doc, vw } = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, vw: window.innerWidth }));
	expect(doc, `${label} scrolls sideways`).toBeLessThanOrEqual(vw);
}

test.beforeEach(async ({ context, baseURL }) => {
	await context.addCookies([{ ...CONSENT, domain: new URL(baseURL!).hostname }]);
});

test.describe('shell', () => {
	test('phone header, tab bar and menu sheet', async ({ page }) => {
		await gotoHydrated(page, '/');
		await noHorizontalOverflow(page, 'home');

		const tabBar = page.getByRole('navigation', { name: 'Navigazione principale' });
		await expect(tabBar).toBeVisible();
		for (const name of ['Home', 'Materiale', 'Zaino', 'Ripetizioni']) {
			const box = await tabBar.getByRole('link', { name }).boundingBox();
			expect(box!.height, `${name} tab height`).toBeGreaterThanOrEqual(44);
		}
		await expect(tabBar.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');

		// The desktop-only controls are gone.
		await expect(page.getByRole('navigation', { name: 'Sezioni' })).toBeHidden();

		await page.getByRole('button', { name: 'Apri il menu' }).click();
		const menu = page.getByRole('dialog', { name: 'Menu' });
		await expect(menu).toBeVisible();
		await expect(menu.getByRole('link', { name: 'Ripetizioni' })).toBeVisible();
		await menu.getByRole('button', { name: 'Chiudi' }).click();
		await expect(menu).toBeHidden();

		// Escape closes it too.
		await page.getByRole('button', { name: 'Apri il menu' }).click();
		await expect(menu).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(menu).toBeHidden();

		// A menu link navigates and the sheet goes away.
		await page.getByRole('button', { name: 'Apri il menu' }).click();
		await menu.getByRole('link', { name: 'Ripetizioni' }).click();
		await expect(page).toHaveURL(/\/ripetizioni$/);
		await expect(menu).toBeHidden();
		await expect(tabBar.getByRole('link', { name: 'Ripetizioni' })).toHaveAttribute('aria-current', 'page');
	});

	test('search opens full screen with the keyboard field focused', async ({ page }) => {
		await gotoHydrated(page, '/');
		await page.getByRole('button', { name: 'Cerca su Sapiens' }).click();
		const field = page.getByPlaceholder('Cerca in Sapiens');
		await expect(field).toBeFocused();
		await field.fill('insiemi');
		await expect(page.getByText(/risultat[io] trovat[io]/)).toBeVisible();
		await noHorizontalOverflow(page, 'search');
		await page.getByRole('link', { name: /Prime definizioni/ }).first().click();
		await expect(page).toHaveURL(new RegExp(THEORY_PATH));
	});

	test('the header slides away on scroll down and returns on scroll up', async ({ page }) => {
		await gotoHydrated(page, '/materiale');
		const header = page.locator('header').first();
		await expect(header).toBeInViewport();
		await page.evaluate(() => {
			const s = document.querySelector('main')!.parentElement!;
			s.scrollTop = 300;
			s.dispatchEvent(new Event('scroll'));
			s.scrollTop = 420;
			s.dispatchEvent(new Event('scroll'));
		});
		// Slid up: nothing but its bottom edge can still be on screen.
		await expect.poll(async () => (await header.boundingBox())!.y + (await header.boundingBox())!.height).toBeLessThanOrEqual(2);
		await page.evaluate(() => {
			const s = document.querySelector('main')!.parentElement!;
			s.scrollTop = 380;
			s.dispatchEvent(new Event('scroll'));
		});
		await expect.poll(async () => (await header.boundingBox())!.y).toBe(0);
	});

	test('form controls are at least 16px on touch screens, tab targets at least 44px', async ({ page }) => {
		await gotoHydrated(page, '/ripetizioni');
		const size = await page.locator('#tutor-search').evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
		expect(size).toBeGreaterThanOrEqual(16);
		await noHorizontalOverflow(page, 'ripetizioni');
	});

	test('pages of every kind fit the screen', async ({ page }) => {
		for (const path of ['/materiale', '/materiale/scuola-superiore/matematica', '/pricing', '/faq', '/contacts', '/ripetizioni/diventa-tutor', '/zaino']) {
			await gotoHydrated(page, path);
			await noHorizontalOverflow(page, path);
			await expect(page.locator('h1'), path).toHaveCount(1);
		}
	});
});

test.describe('lesson reader', () => {
	test('section bar replaces the tab bar; table of contents opens in a sheet and jumps', async ({ page }) => {
		await gotoHydrated(page, THEORY_PATH);
		await noHorizontalOverflow(page, 'theory');
		await expect(page.getByRole('navigation', { name: 'Navigazione principale' })).toHaveCount(0);

		const sections = page.getByRole('navigation', { name: 'Sezioni', exact: true });
		await expect(sections).toBeVisible();
		await expect(sections.getByRole('link', { name: 'Teoria' })).toHaveAttribute('aria-current', 'page');
		await expect(sections.getByRole('button', { name: 'Chiedi a Sapiens AI' })).toBeVisible();

		// The site header is out of the way on phones.
		await expect(page.getByRole('button', { name: 'Apri il menu' })).toBeHidden();
		await expect(page.locator('h1')).toHaveCount(1);

		await page.getByRole('button', { name: 'Indice della lezione' }).click();
		const toc = page.getByRole('dialog', { name: 'Indice della lezione' });
		await expect(toc).toBeVisible();
		const target = toc.getByRole('button').nth(1);
		const title = (await target.textContent())!.trim();
		await target.click();
		await expect(toc).toBeHidden();
		const heading = page.locator('#content-container').getByRole('heading', { name: title }).first();
		await expect(heading).toBeInViewport();
		const top = (await heading.boundingBox())!.y;
		expect(top, 'heading lands below the sticky header').toBeGreaterThanOrEqual(48);
		expect(top).toBeLessThan(200);

		// Progress bar moved off zero.
		const progress = page.getByRole('progressbar', { name: 'Avanzamento della lettura' });
		await expect(progress).toBeVisible();
		await expect.poll(async () => Number(await progress.getAttribute('aria-valuenow'))).toBeGreaterThan(0);
	});

	test('the assistant opens in a sheet from the section bar and from a text selection', async ({ page }) => {
		await gotoHydrated(page, THEORY_PATH);
		await page.getByRole('button', { name: 'Chiedi a Sapiens AI' }).click();
		const sheet = page.getByRole('dialog', { name: 'Sapiens AI' });
		await expect(sheet).toBeVisible();
		// Anonymous: the plan that includes it, not a chat box.
		await expect(sheet.getByRole('heading', { name: /Sapiens AI è incluso/ })).toBeVisible();
		await sheet.getByRole('button', { name: 'Chiudi' }).click();
		await expect(sheet).toBeHidden();

		// A finger selection: the menu sits below the text and stays on screen.
		await page.evaluate(() => {
			const p = document.querySelector('#content-container p')!;
			p.scrollIntoView({ block: 'center' });
			document.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch', bubbles: true }));
			const range = document.createRange();
			range.selectNodeContents(p);
			const sel = window.getSelection()!;
			sel.removeAllRanges();
			sel.addRange(range);
			document.dispatchEvent(new PointerEvent('pointerup', { pointerType: 'touch', bubbles: true }));
		});
		const menu = page.getByRole('toolbar', { name: 'Chiedi a Sapiens AI' });
		await expect(menu).toBeVisible();
		const box = (await menu.boundingBox())!;
		const vw = page.viewportSize()!.width;
		expect(box.x).toBeGreaterThanOrEqual(0);
		expect(box.x + box.width).toBeLessThanOrEqual(vw);
		const selectionBottom = await page.evaluate(() => window.getSelection()!.getRangeAt(0).getBoundingClientRect().bottom);
		expect(box.y).toBeGreaterThanOrEqual(selectionBottom);

		await menu.getByRole('button', { name: 'Semplifica' }).dispatchEvent('pointerdown');
		await expect(sheet).toBeVisible();
	});

	test('a tap takes a whole formula, and a second one lets it go', async ({ page }) => {
		await gotoHydrated(page, THEORY_PATH);
		const formula = page.locator('#content-container .formula').first();
		await formula.scrollIntoViewIfNeeded();
		await formula.tap();
		// Held on its own, so it wears the outline, and the menu offers to ask about it.
		await expect(formula).toHaveAttribute('data-picked', 'alone');
		await expect(page.getByRole('toolbar', { name: 'Chiedi a Sapiens AI' })).toBeVisible();
		// What comes off it is the LaTeX, not the glyph spans it is drawn with.
		expect(await copyOf(page)).toBe(`$${await formula.getAttribute('data-tex')}$`);

		await formula.tap();
		await expect(formula).not.toHaveAttribute('data-picked', /.*/);
		await expect(page.getByRole('toolbar', { name: 'Chiedi a Sapiens AI' })).toBeHidden();
	});

	test('a selection that stops inside a formula rounds out to its edges', async ({ page }) => {
		await gotoHydrated(page, THEORY_PATH);
		const formula = page.locator('#content-container .formula').first();
		await formula.scrollIntoViewIfNeeded();
		// A finger dragged from the start of the line into the middle of the formula.
		await page.evaluate(() => {
			const target = document.querySelector('#content-container .formula')!;
			const glyph = document.createTreeWalker(target.querySelector('.katex-html')!, NodeFilter.SHOW_TEXT).nextNode()!;
			document.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch', bubbles: true }));
			const range = document.createRange();
			range.setStart(target.closest('p')!.firstChild!, 0);
			range.setEnd(glyph, glyph.nodeValue!.length);
			const selection = window.getSelection()!;
			selection.removeAllRanges();
			selection.addRange(range);
			document.dispatchEvent(new PointerEvent('pointerup', { pointerType: 'touch', bubbles: true }));
		});
		// Part of a longer passage, and the selection now ends past the formula.
		await expect(formula).toHaveAttribute('data-picked', 'part');
		await expect
			.poll(() => page.evaluate(() => !document.querySelector('#content-container .formula')!.contains(window.getSelection()!.getRangeAt(0).endContainer)))
			.toBe(true);
		expect(await copyOf(page)).toContain(`$${await formula.getAttribute('data-tex')}$`);
	});

	test('exercise runner: equal answers in one or two columns, then the summary sheet', async ({ page }) => {
		let user: TestUser | null = null;
		try {
			user = await createTestUser('mobile-lite', { subscription: 'lite' });
			await gotoHydrated(page, '/');
			await loginViaModal(page, user);
			await gotoHydrated(page, EXERCISES_PATH);
			await noHorizontalOverflow(page, 'exercise start');
			await page.getByRole('button', { name: 'Inizia gli esercizi' }).click();

			const grid = page.getByRole('group', { name: 'Risposte' });
			const answers = grid.locator('button');
			await expect(answers.first()).toBeVisible();
			await page.evaluate(() => document.fonts.ready);
			const count = await answers.count();
			expect(count).toBeGreaterThanOrEqual(2);
			const boxes = await Promise.all(Array.from({ length: count }, (_, i) => answers.nth(i).boundingBox()));
			const columns = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
			expect([1, 2]).toContain(columns);
			const vw = page.viewportSize()!.width;
			for (const b of boxes) {
				expect(b!.height, 'answer height').toBeGreaterThanOrEqual(44);
				// Every answer is the same height as the first.
				expect(Math.abs(b!.height - boxes[0]!.height), 'equal heights').toBeLessThanOrEqual(1);
				expect(b!.width, 'answer fills its column').toBeGreaterThan(vw * (columns === 2 ? 0.38 : 0.8));
			}
			if (columns === 2) expect(Math.abs(boxes[1]!.y - boxes[0]!.y)).toBeLessThanOrEqual(1);
			else expect(boxes[1]!.y).toBeGreaterThan(boxes[0]!.y + boxes[0]!.height - 1);
			// Nothing of the question is cut off.
			const clipped = await page.locator('#esercizi .scroll-x').first().evaluate((el) => el.scrollHeight - el.clientHeight);
			expect(clipped).toBeLessThanOrEqual(0);
			await noHorizontalOverflow(page, 'exercise runner');

			// Answer every question; the summary sheet appears at the end.
			const summary = page.getByRole('dialog');
			for (let i = 0; i < 12; i++) {
				if (await summary.isVisible().catch(() => false)) break;
				await answers.first().click();
				await page.waitForTimeout(1700);
			}
			await expect(summary.getByRole('img', { name: /risposte corrette su/ })).toBeVisible();
			await expect(summary.getByRole('link', { name: 'Torna alla teoria' })).toBeVisible();
			await noHorizontalOverflow(page, 'summary');

			// "Riprova" starts a fresh session from the first question.
			await summary.getByRole('button', { name: /Riprova/ }).click();
			await expect(summary).toBeHidden();
			await expect(answers.first()).toBeVisible();
			const answered = await page.locator('#esercizi > div:first-child > div').evaluateAll((els) => els.filter((e) => /bg-(green|red)/.test(e.className)).length);
			expect(answered).toBe(0);
		} finally {
			await deleteTestUser(user);
		}
	});
});

test.describe('tutors', () => {
	test('filters live in a sheet; the request form is a sheet too', async ({ page }) => {
		await gotoHydrated(page, '/ripetizioni');
		await page.getByRole('button', { name: /Filtri/ }).click();
		const sheet = page.getByRole('dialog', { name: 'Filtra i tutor' });
		await expect(sheet).toBeVisible();
		await sheet.getByLabel('Materia').selectOption({ index: 1 });
		await expect(page).toHaveURL(/materia=/);
		await sheet.getByRole('button', { name: /^Mostra \d+ tutor$/ }).click();
		await expect(sheet).toBeHidden();
		await expect(page.getByRole('button', { name: /Filtri/ })).toContainText('1');
		await expect(page.getByRole('button', { name: /Rimuovi il filtro/ })).toHaveCount(1);

		await page.getByRole('button', { name: 'Chiedi aiuto' }).first().click();
		const request = page.getByRole('dialog', { name: /Chiedi aiuto a/ });
		await expect(request).toBeVisible();
		await expect(request.getByRole('textbox', { name: 'Telefono' })).toBeVisible();
		await noHorizontalOverflow(page, 'request sheet');
		await request.getByRole('button', { name: 'Chiudi' }).click();
		await expect(request).toBeHidden();
	});
});

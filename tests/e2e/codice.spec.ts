import { test, expect, type Page } from '@playwright/test';

/**
 * The code editor on its trial page: Python run in the browser by Pyodide (src/components/codice). Each test loads
 * Python again, a few seconds from a warm cache.
 */
const log = (page: Page) => page.getByRole('log', { name: 'Console' });
const run = (page: Page) => page.getByRole('button', { name: 'Esegui' });
const answer = (page: Page) => page.getByLabel('Risposta al programma');

async function open(page: Page, example?: string) {
	await page.goto('/prova-python');
	await page.getByRole('button', { name: 'Rifiuta' }).click({ timeout: 2000 }).catch(() => {});
	await expect(page.locator('.cm-content')).toBeVisible();
	if (example) await page.getByLabel('Esempio').selectOption({ label: example });
}

/** Replaces the program in the editor; the text goes in as it is, without the editor's own indentation. */
async function write(page: Page, code: string) {
	await page.locator('.cm-content').click();
	await page.keyboard.press('ControlOrMeta+a');
	await page.keyboard.insertText(code);
}

async function reply(page: Page, line: string) {
	await answer(page).fill(line);
	await answer(page).press('Enter');
}

/** How many pixels of the turtle's canvas are not white. */
const drawn = (page: Page) =>
	page.locator('canvas').evaluate((canvas: HTMLCanvasElement) => {
		const { data } = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height);
		let count = 0;
		for (let i = 0; i < data.length; i += 4) if (data[i] < 240 || data[i + 1] < 240 || data[i + 2] < 240) count++;
		return count;
	});

test.describe('python editor', () => {
	test('answers typed in the console reach input(), and the program is not shown twice', async ({ page }) => {
		await open(page);
		await run(page).click();
		await expect(answer(page)).toBeVisible({ timeout: 90_000 });
		await reply(page, 'Ada');
		await reply(page, '2010');
		await expect(log(page)).toContainText('Programma finito');
		await expect(log(page)).toContainText('Come ti chiami? Ada');
		await expect(log(page)).toContainText('Ciao Ada!');
		await expect(log(page)).toContainText('Nel 2026 compi 16 anni.');
		expect((await log(page).innerText()).match(/Come ti chiami/g)).toHaveLength(1);
	});

	test('random numbers stay the same while the program is run again for each answer', async ({ page }) => {
		await open(page, 'Indovina il numero');
		await run(page).click();
		let low = 1;
		let high = 100;
		for (let turns = 1; ; turns++) {
			// a binary search ends in 7 guesses only if the secret never changes
			expect(turns).toBeLessThanOrEqual(7);
			const guess = Math.floor((low + high) / 2);
			await expect(answer(page)).toBeVisible({ timeout: 90_000 });
			await reply(page, String(guess));
			await expect.poll(async () => ((await log(page).innerText()).match(/Troppo|Indovinato/g) ?? []).length).toBe(turns);
			const last = (await log(page).innerText()).match(/Troppo piccolo|Troppo grande|Indovinato/g)!.pop();
			if (last === 'Troppo piccolo') low = guess + 1;
			else if (last === 'Troppo grande') high = guess - 1;
			else break;
		}
	});

	test('an error shows the lines of the program and nothing of the runner', async ({ page }) => {
		await open(page, 'Un errore');
		await run(page).click();
		await expect(log(page)).toContainText('ZeroDivisionError: division by zero', { timeout: 90_000 });
		await expect(log(page)).toContainText('File "programma.py", line 5');
		await expect(log(page)).not.toContainText(/pyodide|sapiens\.py|esegui/);
		await write(page, 'print("ciao"\n');
		await run(page).click();
		await expect(log(page)).toContainText('SyntaxError');
	});

	test('programs that never end are stopped: by their output, by hand, by the clock', async ({ page }) => {
		await open(page, 'Un ciclo che non finisce');
		await run(page).click();
		await expect(log(page)).toContainText('Fermato: il programma ha stampato troppo', { timeout: 90_000 });

		await write(page, 'while True:\n    pass\n');
		await run(page).click();
		await page.getByRole('button', { name: 'Ferma' }).click();
		await expect(log(page)).toContainText('Interrotto.');

		await run(page).click();
		await expect(log(page)).toContainText('Fermato dopo 10 secondi', { timeout: 30_000 });

		// the worker was ended: the next run loads Python again
		await write(page, 'print(6 * 7)\n');
		await run(page).click();
		await expect(log(page)).toContainText('42', { timeout: 90_000 });
	});

	test('changing the program while it waits for an answer ends the run', async ({ page }) => {
		await open(page, 'Tabellina');
		await run(page).click();
		await expect(answer(page)).toBeVisible({ timeout: 90_000 });
		await page.locator('.cm-content').click();
		await page.keyboard.type('# ');
		await expect(log(page)).toContainText('Hai cambiato il programma');
		await expect(answer(page)).toHaveCount(0);
	});

	test('matplotlib figures appear in the console, with and without show()', async ({ page }) => {
		await open(page, 'Grafico con matplotlib');
		await run(page).click();
		await expect(log(page)).toContainText('Programma finito', { timeout: 120_000 });
		await expect(log(page)).toContainText('Radici: [ 2.414 -0.414]');
		const figure = page.getByAltText('Grafico disegnato dal programma');
		await expect(figure).toHaveCount(1);
		expect(await figure.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(300);

		await write(page, 'import matplotlib.pyplot as plt\nplt.bar(["a", "b"], [3, 5])\n');
		await run(page).click();
		await expect(log(page)).toContainText('Programma finito');
		await expect(figure).toHaveCount(1);
	});

	test('the turtle draws on its canvas, step by step, and skips to the end', async ({ page }) => {
		await open(page, 'Tartaruga: stella');
		await run(page).click();
		const skip = page.getByRole('button', { name: 'Salta' });
		await expect(skip).toBeVisible({ timeout: 90_000 });
		await expect.poll(() => drawn(page)).toBeGreaterThan(0);
		const during = await drawn(page);
		await skip.click();
		await expect(skip).toHaveCount(0);
		expect(await drawn(page)).toBeGreaterThan(Math.max(during, 1000));

		await write(page, 'import turtle\nturtle.speed(0)\nn = int(input("Lati? "))\nfor _ in range(n):\n    turtle.forward(80)\n    turtle.left(360 / n)\n');
		await run(page).click();
		await expect(answer(page)).toBeVisible();
		await reply(page, '6');
		await expect(log(page)).toContainText('Programma finito');
		await expect.poll(() => drawn(page)).toBeGreaterThan(300);

		await write(page, 'import turtle\nturtle.onkey(print, "a")\n');
		await run(page).click();
		await expect(log(page)).toContainText('TurtleGraphicsError');
		await expect(page.locator('canvas')).toHaveCount(0);
	});

	test('the page does not scroll sideways', async ({ page }) => {
		await open(page, 'Tabellina');
		await run(page).click();
		await expect(answer(page)).toBeVisible({ timeout: 90_000 });
		await reply(page, '7');
		await expect(log(page)).toContainText('7 x 10 = 70');
		expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
	});
});

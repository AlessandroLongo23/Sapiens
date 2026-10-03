import { test, expect, type Page } from '@playwright/test';
import { createTestUser, deleteTestUser, gotoHydrated, loginViaModal, supabaseAdmin, type TestUser } from './helpers';

/**
 * The code editor on its page among the tools (src/components/codice): Python run in the browser by Pyodide, C and C++
 * compiled by Clang in WebAssembly. Each test loads its language again, a few seconds from a warm cache.
 */
const log = (page: Page) => page.getByRole('log', { name: 'Console' });
const run = (page: Page) => page.getByRole('button', { name: 'Esegui' });
const answer = (page: Page) => page.getByLabel('Risposta al programma');

async function open(page: Page, example?: string, language?: 'C' | 'C++') {
	await page.goto('/strumenti/editor-di-codice');
	await page.getByRole('button', { name: 'Rifiuta' }).click({ timeout: 2000 }).catch(() => {});
	await expect(page.locator('.cm-content')).toBeVisible();
	if (language) await page.getByLabel('Linguaggio').selectOption({ label: language });
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

test.describe('c and c++ editor', () => {
	/** The compiler is 105 MB: the first load of a cold cache is slow. */
	const COMPILER = 240_000;

	test('a C++ program reads the answers typed in the console', async ({ page }) => {
		await open(page, 'Saluto', 'C++');
		await run(page).click();
		await expect(answer(page)).toBeVisible({ timeout: COMPILER });
		await reply(page, 'Ada');
		await reply(page, '2010');
		await expect(log(page)).toContainText('Programma finito');
		await expect(log(page)).toContainText('Come ti chiami? Ada');
		await expect(log(page)).toContainText('Nel 2026 compi 16 anni.');
		expect((await log(page).innerText()).match(/Come ti chiami/g)).toHaveLength(1);
	});

	test('srand(time(0)) gives the same numbers while the program is run again for each answer', async ({ page }) => {
		await open(page, 'Indovina il numero', 'C++');
		await run(page).click();
		let low = 1;
		let high = 100;
		for (let turns = 1; ; turns++) {
			expect(turns).toBeLessThanOrEqual(7);
			const guess = Math.floor((low + high) / 2);
			await expect(answer(page)).toBeVisible({ timeout: COMPILER });
			await reply(page, String(guess));
			await expect.poll(async () => ((await log(page).innerText()).match(/Troppo|Indovinato/g) ?? []).length).toBe(turns);
			const last = (await log(page).innerText()).match(/Troppo piccolo|Troppo grande|Indovinato/g)!.pop();
			if (last === 'Troppo piccolo') low = guess + 1;
			else if (last === 'Troppo grande') high = guess - 1;
			else break;
		}
	});

	test('C: scanf, a compile error with its line, a division by zero in Italian', async ({ page }) => {
		await open(page, 'Tabellina', 'C');
		await run(page).click();
		await expect(answer(page)).toBeVisible({ timeout: COMPILER });
		await reply(page, '7');
		await expect(log(page)).toContainText('7 x 10 = 70');

		await page.getByLabel('Esempio').selectOption({ label: 'Un errore di compilazione' });
		await run(page).click();
		await expect(log(page)).toContainText("programma.c:4:14: error: expected ';'");

		await page.getByLabel('Esempio').selectOption({ label: 'Una divisione per zero' });
		await run(page).click();
		await expect(log(page)).toContainText('Calcolo 10 / 0...');
		await expect(log(page)).toContainText('divisione intera per zero');
	});

	test('C++: classes and the standard library; no exceptions, said in Italian', async ({ page }) => {
		await open(page, 'Classi ed ereditarietà', 'C++');
		await run(page).click();
		await expect(log(page)).toContainText('Rettangolo: area 12', { timeout: COMPILER });
		await expect(log(page)).toContainText('Cerchio: area 3.14159');

		await page.getByLabel('Esempio').selectOption({ label: 'Vettore ordinato' });
		await run(page).click();
		await expect(log(page)).toContainText('3 7 19 25 42');

		await write(page, '#include <stdexcept>\nint main() { try { throw std::runtime_error("x"); } catch (...) {} }\n');
		await run(page).click();
		await expect(log(page)).toContainText('il C++ non ha le eccezioni');
	});

	test('a C++ loop that never ends is stopped, and the compiler is still there', async ({ page }) => {
		await open(page, 'Un ciclo che non finisce', 'C++');
		await run(page).click();
		await expect(log(page)).toContainText('Fermato: il programma ha stampato troppo', { timeout: COMPILER });

		await write(page, 'int main() { while (true) {} }\n');
		await run(page).click();
		await expect(log(page)).toContainText('Fermato dopo 10 secondi', { timeout: 30_000 });

		await write(page, '#include <iostream>\nint main() { std::cout << 6 * 7 << std::endl; }\n');
		await run(page).click();
		// no download this time: only the compilation
		await expect(log(page)).toContainText('42', { timeout: 15_000 });
	});
});

test.describe('programs in a lesson', () => {
	const block = (page: Page, index: number) => page.locator('figure[data-codice]').nth(index);

	test('a block runs, a language tab changes every block, an exercise is checked against its tests', async ({ page }) => {
		// The blocks are shown by the trial page of lesson files, which exists only in development.
		const response = await page.goto('/prova-grafico/lezione?file=prove/codice.md');
		test.skip(response?.status() === 404, 'the trial page of lesson files is not in the production build');
		await page.getByRole('button', { name: 'Rifiuta' }).click({ timeout: 2000 }).catch(() => {});

		const example = block(page, 0);
		await example.scrollIntoViewIfNeeded();
		await example.getByRole('button', { name: 'Esegui' }).click();
		await expect(example.getByRole('log')).toContainText('5 al quadrato fa 25', { timeout: 90_000 });

		const exercise = block(page, 2);
		await exercise.scrollIntoViewIfNeeded();
		await exercise.getByRole('button', { name: 'Verifica' }).click();
		await expect(exercise.getByRole('log')).toContainText('1 prova superata su 4', { timeout: 90_000 });
		await expect(exercise.getByRole('log')).toContainText('Atteso');
		await exercise.getByRole('button', { name: 'Soluzione' }).click();
		await exercise.getByRole('button', { name: 'Verifica' }).click();
		await expect(exercise.getByRole('log')).toContainText('Tutte le 4 prove superate.');

		// the tab of one block is the language of all of them, and the same tests check the C++ program
		const both = block(page, 1);
		await both.scrollIntoViewIfNeeded();
		await both.getByRole('radio', { name: 'C++' }).click();
		await expect(exercise.locator('.cm-content')).toContainText('#include <iostream>');
		await exercise.scrollIntoViewIfNeeded();
		await exercise.getByRole('button', { name: 'Verifica' }).click();
		await expect(exercise.getByRole('log')).toContainText('1 prova superata su 4', { timeout: 240_000 });
		await exercise.getByRole('button', { name: 'Soluzione' }).click();
		await exercise.getByRole('button', { name: 'Verifica' }).click();
		await expect(exercise.getByRole('log')).toContainText('Tutte le 4 prove superate.');

		await both.scrollIntoViewIfNeeded();
		await both.getByRole('button', { name: 'Esegui' }).click();
		await both.getByLabel('Risposta al programma').fill('3');
		await both.getByLabel('Risposta al programma').press('Enter');
		await both.getByLabel('Risposta al programma').fill('8');
		await both.getByLabel('Risposta al programma').press('Enter');
		await expect(both.getByRole('log')).toContainText('Il più grande è 8');
	});
});

/**
 * A program is somebody's code: the student's own, or code a classmate told them to paste. It must not be able to do
 * on the site what the student can: read the account, write in the Zaino.
 */
test.describe('a program and the account of who runs it', () => {
	let user: TestUser | null = null;
	test.beforeAll(async () => {
		user = await createTestUser('codice');
	});
	test.afterAll(() => deleteTestUser(user));

	test('a Python program cannot read or write as the signed-in student', async ({ page, baseURL }) => {
		await gotoHydrated(page, '/');
		await page.getByRole('button', { name: 'Rifiuta' }).click({ timeout: 2000 }).catch(() => {});
		await loginViaModal(page, user!);
		// signing in refreshes the page, which in Firefox can cut a navigation started right after
		await expect(() => open(page)).toPass({ timeout: 30_000 });
		// the page itself is signed in
		expect(await page.evaluate(() => fetch('/api/me').then((r) => r.json()).then((me) => me.user?.email))).toBe(user!.email);

		await write(
			page,
			[
				'from js import XMLHttpRequest, self',
				`SITO = "${baseURL}"`,
				'def chiedi(metodo, indirizzo, corpo=None):',
				'    try:',
				'        x = XMLHttpRequest.new()',
				'        x.open(metodo, SITO + indirizzo, False)',
				'        x.withCredentials = True',
				'        if corpo:',
				'            x.setRequestHeader("Content-Type", "application/json")',
				'        x.send(corpo)',
				'        return f"{x.status} {x.responseText[:300]}"',
				'    except Exception as errore:',
				'        return "bloccata"',
				'print("origine:", self.origin)',
				'print("GET /api/me:", chiedi("GET", "/api/me"))',
				'print("POST /api/zaino/quaderni:", chiedi("POST", "/api/zaino/quaderni", \'{"title": "Scritto da un programma"}\'))',
				''
			].join('\n')
		);
		await run(page).click();
		await expect(log(page)).toContainText('Programma finito', { timeout: 90_000 });
		const printed = await log(page).innerText();
		expect(printed).toContain('origine: null');
		expect(printed).not.toContain(user!.email);
		expect(printed).not.toContain(user!.id);
		const { count } = await supabaseAdmin().from('notebooks').select('id', { count: 'exact', head: true }).eq('user_id', user!.id);
		expect(count).toBe(0);
	});

	test('the site refuses a write that does not come from one of its pages', async ({ request, baseURL }) => {
		// what Safari sends from the sandbox carries the session cookie: the server looks at where it comes from
		for (const origin of ['null', 'https://example.com']) {
			expect((await request.post('/api/zaino/quaderni', { headers: { Origin: origin }, data: {} })).status()).toBe(403);
		}
		expect((await request.post('/api/zaino/quaderni', { headers: { Origin: baseURL! }, data: {} })).status()).toBe(401);
	});
});

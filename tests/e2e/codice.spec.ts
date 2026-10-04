import { test, expect, type Page } from '@playwright/test';
import { createTestUser, deleteTestUser, gotoHydrated, loginViaModal, supabaseAdmin, type TestUser } from './helpers';

/**
 * The code editor on its page among the tools (src/components/codice): Python run in the browser by Pyodide, C and C++
 * compiled by Clang in WebAssembly, JavaScript, and web pages with their preview. Each test loads its language again, a few seconds from a warm cache.
 */
const log = (page: Page) => page.getByRole('log', { name: 'Console' });
const run = (page: Page) => page.getByRole('button', { name: 'Esegui' });
const answer = (page: Page) => page.getByLabel('Risposta al programma');

async function open(page: Page, example?: string, language?: 'C' | 'C++' | 'JavaScript' | 'Pagina web') {
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
	log(page).locator('canvas').evaluate((canvas: HTMLCanvasElement) => {
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
		await expect(log(page).locator('canvas')).toHaveCount(0);
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

test.describe('javascript', () => {
	test('prompt() reads from the console, an error says its line, a loop that never ends is stopped', async ({ page }) => {
		await open(page, undefined, 'JavaScript');
		await run(page).click();
		await reply(page, 'Ada');
		await reply(page, '2010');
		await expect(log(page)).toContainText('Ciao Ada!');
		await expect(log(page)).toContainText('Nel 2026 compi 16 anni.');
		await expect(log(page)).toContainText('Programma finito');
		expect((await log(page).innerText()).match(/Come ti chiami\?/g)).toHaveLength(1);

		await page.getByLabel('Esempio').selectOption({ label: 'Un errore' });
		await run(page).click();
		await expect(log(page)).toContainText('ReferenceError');
		await expect(log(page)).toContainText('alla riga 2');

		await page.getByLabel('Esempio').selectOption({ label: 'Un ciclo che non finisce' });
		await run(page).click();
		await expect(log(page)).toContainText('Fermato: il programma ha stampato troppo');

		await write(page, 'console.log("prima");\nsetTimeout(() => console.log("dopo", [1, { a: "x" }]), 200);\nwhile (true) {}\n');
		await run(page).click();
		await expect(log(page)).toContainText('Fermato dopo 10 secondi', { timeout: 30_000 });

		await write(page, 'setTimeout(() => console.log("dopo", [1, { a: "x" }]), 200);\nconsole.log("prima");\n');
		await run(page).click();
		await expect(log(page)).toContainText('prima\ndopo [1, { a: "x" }]');
	});
});

test.describe('web pages', () => {
	const shown = (page: Page) => page.frameLocator('iframe[title="Anteprima della pagina"]');
	const colour = (page: Page) => shown(page).locator('h1').evaluate((title) => getComputedStyle(title).color);

	test('the three files make the page, which follows the keys while it has no script', async ({ page }) => {
		await open(page, undefined, 'Pagina web');
		await expect(shown(page).locator('h1')).toHaveText('Ciao, mondo!');
		expect(await colour(page)).toBe('rgb(194, 65, 12)');

		await page.getByRole('tab', { name: 'style.css' }).click();
		await write(page, 'h1 { color: rgb(0, 0, 255); }\n');
		await expect.poll(() => colour(page)).toBe('rgb(0, 0, 255)');

		// the text of a tab is there when the tab is opened again
		await page.getByRole('tab', { name: 'index.html' }).click();
		await expect(page.locator('.cm-content')).toContainText('<h1>Ciao, mondo!</h1>');
		await page.getByRole('tab', { name: 'style.css' }).click();
		await expect(page.locator('.cm-content')).toContainText('rgb(0, 0, 255)');

		// a file that is not linked does nothing, and the editor says so
		await page.getByLabel('Esempio').selectOption({ label: 'Un foglio di stile dimenticato' });
		await expect(log(page)).toContainText('style.css non è collegato alla pagina');
		expect(await colour(page)).toBe('rgb(0, 0, 0)');
	});

	test('the script runs in the page: clicks, the console, an error with its line, a loop that is stopped', async ({ page }) => {
		await open(page, 'Un contatore', 'Pagina web');
		await shown(page).locator('#piu').click();
		await shown(page).locator('#piu').click();
		await shown(page).locator('#meno').click();
		await expect(shown(page).locator('#numero')).toHaveText('1');
		await expect(log(page)).toContainText('Il contatore vale 2\nIl contatore vale 1');

		// with a script the page waits for Esegui
		await page.getByRole('tab', { name: 'script.js' }).click();
		await write(page, 'document.querySelector("#numero").textContent = "nuovo";\nconst a = 1;\na.b.c = 2;\n');
		await expect(page.getByText('Esegui per aggiornare la pagina')).toBeVisible();
		await expect(shown(page).locator('#numero')).toHaveText('1');
		await run(page).click();
		await expect(shown(page).locator('#numero')).toHaveText('nuovo');
		await expect(log(page)).toContainText('TypeError');
		await expect(log(page)).toContainText('in script.js, riga 3');

		await write(page, 'let i = 0;\nwhile (i < 10) {\n}\ndocument.querySelector("#numero").textContent = "mai";\n');
		await run(page).click();
		await expect(log(page)).toContainText('Ciclo fermato: gira da più di 2 secondi senza finire.', { timeout: 20_000 });
		await expect(log(page)).toContainText('in script.js, riga 2');
		// the editor is still alive
		await write(page, 'document.querySelector("#numero").textContent = "vivo";\n');
		await run(page).click();
		await expect(shown(page).locator('#numero')).toHaveText('vivo');
	});
});

test.describe('the editor as the student wants it', () => {
	const setting = (page: Page, name: string, value: string) => page.getByRole('radiogroup', { name }).getByRole('radio', { name: value, exact: true }).click();
	const codeWidth = (page: Page) => page.locator('.cm-editor').evaluate((editor) => Math.round(editor.getBoundingClientRect().width));

	test('the handle gives the code more or less of the width, and the next visit finds it there', async ({ page, isMobile }) => {
		test.skip(isMobile, 'on a phone the code is above its output');
		await open(page);
		const handle = page.getByRole('separator', { name: 'Larghezza del codice' });
		const before = await codeWidth(page);
		const box = (await handle.boundingBox())!;
		await page.mouse.move(box.x, box.y + 80);
		await page.mouse.down();
		await page.mouse.move(box.x + 150, box.y + 90, { steps: 4 });
		await page.mouse.up();
		await expect.poll(() => codeWidth(page)).toBeGreaterThan(before + 120);
		const dragged = await codeWidth(page);

		await handle.focus();
		await page.keyboard.press('ArrowLeft');
		await expect.poll(() => codeWidth(page)).toBeLessThan(dragged);

		await open(page);
		await expect.poll(() => codeWidth(page)).toBeGreaterThan(before + 80);
		await page.getByRole('separator', { name: 'Larghezza del codice' }).dblclick();
		await expect.poll(() => codeWidth(page)).toBe(before);
	});

	test('the settings take the place of the output, change the open editor and are kept', async ({ page, isMobile }) => {
		await open(page);
		await write(page, 'for i in range(2):\n    if i:\n        print("resto qui")\n');
		const gear = page.getByRole('button', { name: 'Impostazioni dell’editor' });
		await gear.click();
		await expect(page.getByRole('region', { name: 'Impostazioni dell’editor' })).toBeVisible();
		await expect(log(page)).toBeHidden();

		const keyword = () => page.locator('.cm-line span').first().evaluate((token) => getComputedStyle(token).color);
		const modern = await keyword();
		await page.getByRole('radio', { name: /^GitHub/ }).click();
		await expect.poll(keyword).not.toBe(modern);
		// the size is a whole number of pixels between 10 and 28: typed, stepped, and put right when it is neither
		const size = page.getByLabel('Dimensione del testo in pixel');
		await size.fill('17');
		await expect(page.locator('.cm-editor')).toHaveCSS('font-size', '17px');
		await size.fill('99');
		await size.blur();
		await expect(size).toHaveValue('28');
		await expect(page.getByRole('button', { name: 'Testo più grande' })).toBeDisabled();
		await size.fill('16.6');
		await expect(page.locator('.cm-editor')).toHaveCSS('font-size', '28px');
		await size.blur();
		await expect(size).toHaveValue('17');
		await page.getByRole('button', { name: 'Testo più piccolo' }).click();
		await page.getByRole('button', { name: 'Testo più grande' }).click();
		await expect(page.locator('.cm-editor')).toHaveCSS('font-size', '17px');
		await setting(page, 'Numeri di riga', 'No');
		await expect(page.locator('.cm-lineNumbers')).toHaveCount(0);
		if (!isMobile) {
			await expect(page.locator('.cm-minimap-gutter')).toHaveCount(1);
			await setting(page, 'Minimappa', 'No');
			await expect(page.locator('.cm-minimap-gutter')).toHaveCount(0);
		}
		// the width of an indentation changes the lines already written
		const lines = () => page.locator('.cm-line').allTextContents();
		await setting(page, 'Larghezza del rientro', '2');
		await expect.poll(lines).toEqual(['for i in range(2):', '  if i:', '    print("resto qui")', '']);
		await setting(page, 'Larghezza del rientro', '8');
		await expect.poll(lines).toEqual(['for i in range(2):', '        if i:', '                print("resto qui")', '']);
		await setting(page, 'Larghezza del rientro', '2');

		// and Enter after a colon indents by two
		await page.locator('.cm-content').click();
		await page.keyboard.press('ControlOrMeta+End');
		await page.keyboard.type('if True:\nx = 1');
		await expect(page.locator('.cm-line').last()).toHaveText('  x = 1');

		// back to the console, where the program runs
		await gear.click();
		await expect(log(page)).toBeVisible();
		await run(page).click();
		await expect(log(page)).toContainText('resto qui', { timeout: 90_000 });

		// another visit: the same editor
		await open(page);
		await expect(page.locator('.cm-editor')).toHaveCSS('font-size', '17px');
		await expect(page.locator('.cm-lineNumbers')).toHaveCount(0);
		await page.getByRole('button', { name: 'Impostazioni dell’editor' }).click();
		await page.getByRole('region', { name: 'Impostazioni dell’editor' }).getByRole('button', { name: 'Ripristina' }).click();
		await expect(page.locator('.cm-editor')).toHaveCSS('font-size', '15px');
		await expect(page.locator('.cm-lineNumbers')).toHaveCount(1);
	});
});

test.describe('saved programs', () => {
	let user: TestUser | null = null;
	test.beforeAll(async () => {
		user = await createTestUser('programmi');
	});
	test.afterAll(() => deleteTestUser(user));

	const library = (page: Page) => page.getByRole('dialog', { name: 'I miei programmi' });
	const openLibrary = async (page: Page) => {
		// the button says the name of the program in the editor, once there is one
		if (!(await library(page).isVisible())) await page.getByTitle(/^I miei programmi/).click();
	};
	const saveAs = async (page: Page, name: string) => {
		await openLibrary(page);
		await library(page).getByLabel('Nome con cui salvare il programma').fill(name);
		await library(page).getByRole('button', { name: 'Salva con nome' }).click();
	};

	test('without an account the panel asks to sign in', async ({ page }) => {
		await open(page);
		await page.getByRole('button', { name: 'I miei programmi' }).click();
		await expect(library(page).getByRole('button', { name: 'Accedi o registrati' })).toBeVisible();
	});

	test('a program and a page are saved with a name, found again, written over and deleted', async ({ page }) => {
		await gotoHydrated(page, '/');
		await page.getByRole('button', { name: 'Rifiuta' }).click({ timeout: 2000 }).catch(() => {});
		await loginViaModal(page, user!);
		await expect(() => open(page)).toPass({ timeout: 30_000 });

		await write(page, 'print("salvato uno")\n');
		await saveAs(page, 'Il mio primo');
		await expect(library(page)).toContainText('Il mio primo, salvato.');
		// one name, one program (on a phone the panel is over the editor: Esc closes it)
		await page.keyboard.press('Escape');
		await write(page, 'print("un altro")\n');
		await saveAs(page, 'il mio PRIMO');
		await expect(library(page).getByRole('alert')).toContainText('Hai già un programma con questo nome.');

		// a page keeps its three files
		await page.keyboard.press('Escape');
		await page.getByLabel('Linguaggio').selectOption({ label: 'Pagina web' });
		await page.getByRole('tab', { name: 'style.css' }).click();
		await write(page, 'h1 { color: rgb(0, 128, 0); }\n');
		await saveAs(page, 'La mia pagina');
		await expect(library(page)).toContainText('La mia pagina, salvato.');

		// another visit: both are there, each opens in its language
		await open(page);
		await openLibrary(page);
		await expect(library(page).getByRole('listitem')).toHaveCount(2);
		await library(page).getByRole('button', { name: /^Il mio primo/ }).click();
		await expect(page.getByLabel('Linguaggio')).toHaveValue('python');
		await expect(page.locator('.cm-content')).toContainText('print("salvato uno")');
		await run(page).click();
		await expect(log(page)).toContainText('salvato uno', { timeout: 90_000 });

		// Salva writes over it
		await page.keyboard.press('Escape');
		await write(page, 'print("salvato due")\n');
		await openLibrary(page);
		await expect(library(page)).toContainText('con modifiche non salvate');
		await library(page).getByRole('button', { name: 'Salva', exact: true }).click();
		await expect(library(page)).toContainText('Il mio primo, salvato.');

		await library(page).getByRole('button', { name: /^La mia pagina/ }).click();
		await expect(page.getByLabel('Linguaggio')).toHaveValue('web');
		await expect(page.frameLocator('iframe[title="Anteprima della pagina"]').locator('h1')).toHaveCSS('color', 'rgb(0, 128, 0)');

		const { data } = await supabaseAdmin().from('programs').select('title,language,files').eq('user_id', user!.id).order('title');
		expect(data).toEqual([
			{ title: 'Il mio primo', language: 'python', files: { main: 'print("salvato due")\n' } },
			{ title: 'La mia pagina', language: 'web', files: expect.objectContaining({ css: 'h1 { color: rgb(0, 128, 0); }\n', html: expect.stringContaining('<h1>Ciao, mondo!</h1>') }) }
		]);

		await openLibrary(page);
		await library(page).getByRole('button', { name: 'Elimina il programma Il mio primo' }).click();
		await library(page).getByRole('button', { name: 'Elimina', exact: true }).click();
		await expect(library(page).getByRole('listitem')).toHaveCount(1);
	});

	test('the server refuses what is not a program', async ({ page }) => {
		await gotoHydrated(page, '/');
		await page.getByRole('button', { name: 'Rifiuta' }).click({ timeout: 2000 }).catch(() => {});
		await loginViaModal(page, user!);
		const post = (data: unknown) => page.request.post('/api/programmi', { data }).then((r) => r.status());
		expect(await post({ title: 'x', language: 'java', files: { main: 'x' } })).toBe(400);
		expect(await post({ title: 'x', language: 'python', files: { main: 'x', html: 'y' } })).toBe(400);
		expect(await post({ title: 'x', language: 'python', files: { main: '  ' } })).toBe(400);
		expect(await post({ title: '', language: 'python', files: { main: 'x' } })).toBe(400);
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

	test('a javascript exercise is checked on what it prints, a web page on what it is', async ({ page }) => {
		const response = await page.goto('/prova-grafico/lezione?file=prove/codice.md');
		test.skip(response?.status() === 404, 'the trial page of lesson files is not in the production build');
		await page.getByRole('button', { name: 'Rifiuta' }).click({ timeout: 2000 }).catch(() => {});

		const script = block(page, 3);
		await script.scrollIntoViewIfNeeded();
		await script.getByRole('button', { name: 'Verifica' }).click();
		await expect(script.getByRole('log')).toContainText('0 prove superate su 2', { timeout: 60_000 });
		await script.getByRole('button', { name: 'Soluzione' }).click();
		await script.getByRole('button', { name: 'Verifica' }).click();
		await expect(script.getByRole('log')).toContainText('Tutte le 2 prove superate.');

		const web = block(page, 4);
		await web.scrollIntoViewIfNeeded();
		const shown = web.frameLocator('iframe[title="Anteprima della pagina"]');
		await expect(shown.locator('li')).toHaveCount(2);
		await web.getByRole('button', { name: 'Verifica' }).click();
		await expect(web.getByRole('log')).toContainText('0 controlli superati su 3');
		await expect(web.getByRole('log')).toContainText('Di "ul > li" ne trovo 2, ne servono 3.');
		await web.getByRole('button', { name: 'Soluzione' }).click();
		await expect(shown.locator('h1')).toHaveText('Le mie materie');
		await web.getByRole('button', { name: 'Verifica' }).click();
		await expect(web.getByRole('log')).toContainText('Tutti i 3 controlli superati.');
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

		// the script of a web page runs in a page, not in a worker: it must be as far from the account
		await page.getByLabel('Linguaggio').selectOption({ label: 'Pagina web' });
		await page.getByLabel('Esempio').selectOption({ label: 'Un contatore' });
		await page.getByRole('tab', { name: 'script.js' }).click();
		await write(
			page,
			[
				`const SITO = "${baseURL}";`,
				'function chiedi(metodo, indirizzo, corpo) {',
				'    try {',
				'        const x = new XMLHttpRequest();',
				'        x.open(metodo, SITO + indirizzo, false);',
				'        x.withCredentials = true;',
				'        x.send(corpo);',
				'        return x.status + " " + x.responseText.slice(0, 300);',
				'    } catch (errore) {',
				'        return "bloccata";',
				'    }',
				'}',
				'console.log("origine:", self.origin);',
				'console.log("GET /api/me:", chiedi("GET", "/api/me"));',
				'console.log("POST /api/zaino/quaderni:", chiedi("POST", "/api/zaino/quaderni", \'{"title": "Scritto da una pagina"}\'));',
				'console.log("fine");',
				''
			].join('\n')
		);
		await run(page).click();
		await expect(log(page)).toContainText('fine');
		const shown = await log(page).innerText();
		expect(shown).toContain('origine: null');
		expect(shown).not.toContain(user!.email);
		expect(shown).not.toContain(user!.id);

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

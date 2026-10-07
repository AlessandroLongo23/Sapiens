import { test, expect, type Page } from '@playwright/test';
import { createTestUser, deleteTestUser, gotoHydrated, loginViaModal, supabaseAdmin, type TestUser } from './helpers';

/**
 * The code editor on its page among the tools (src/components/codice): Python run in the browser by Pyodide, C and C++
 * compiled by Clang in WebAssembly, JavaScript, and web pages with their preview. Each test loads its language again, a few seconds from a warm cache.
 */
const log = (page: Page) => page.getByRole('log', { name: 'Console' });
const run = (page: Page) => page.getByRole('button', { name: 'Esegui' });
const answer = (page: Page) => page.getByLabel('Risposta al programma');
/** A file in the list of a project's files. */
/** The button of a project's bar that shows and hides the output under the code. */
const output = (page: Page) => page.getByRole('button', { name: 'Uscita sotto il codice' });
const file = (page: Page, path: string) => page.getByRole('navigation', { name: 'File del progetto' }).getByTitle(path, { exact: true });

async function open(page: Page, example?: string, language?: 'C' | 'C++' | 'JavaScript' | 'Progetto') {
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

test.describe('projects: web pages', () => {
	const shown = (page: Page) => page.frameLocator('iframe[title="Anteprima della pagina"]');
	const colour = (page: Page) => shown(page).locator('h1').evaluate((title) => getComputedStyle(title).color);

	test('the three files make the page, which follows the keys while it has no script', async ({ page }) => {
		await open(page, undefined, 'Progetto');
		await expect(shown(page).locator('h1')).toHaveText('Ciao, mondo!');
		expect(await colour(page)).toBe('rgb(194, 65, 12)');

		await file(page, 'style.css').click();
		await write(page, 'h1 { color: rgb(0, 0, 255); }\n');
		await expect.poll(() => colour(page)).toBe('rgb(0, 0, 255)');

		// the text of a tab is there when the tab is opened again
		await file(page, 'index.html').click();
		await expect(page.locator('.cm-content')).toContainText('<h1>Ciao, mondo!</h1>');
		await file(page, 'style.css').click();
		await expect(page.locator('.cm-content')).toContainText('rgb(0, 0, 255)');

		// a file that is not linked does nothing, and the editor says so
		await page.getByLabel('Esempio').selectOption({ label: 'Un foglio di stile dimenticato' });
		await expect(log(page)).toContainText('style.css non è collegato alla pagina');
		expect(await colour(page)).toBe('rgb(0, 0, 0)');
	});

	test('the script runs in the page: clicks, the console, an error with its line, a loop that is stopped', async ({ page }) => {
		await open(page, 'Un contatore', 'Progetto');
		await shown(page).locator('#piu').click();
		await shown(page).locator('#piu').click();
		await shown(page).locator('#meno').click();
		await expect(shown(page).locator('#numero')).toHaveText('1');
		// what a page prints is under the code, behind its button until there is an error to read
		await expect(log(page)).toHaveCount(0);
		await output(page).click();
		await expect(log(page)).toContainText('Il contatore vale 2\nIl contatore vale 1');

		// with a script the page waits for Esegui
		await file(page, 'script.js').click();
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

test.describe('projects: more files', () => {
	const shown = (page: Page) => page.frameLocator('iframe[title="Anteprima della pagina"]');
	const files = (page: Page) => page.getByRole('navigation', { name: 'File del progetto' });

	test('a link opens the other page of the site, in the preview and in the editor, with the style of a folder', async ({ page }) => {
		await open(page, 'Un sito di due pagine', 'Progetto');
		await expect(shown(page).locator('h1')).toHaveText('Benvenuto nel mio sito');
		await shown(page).getByRole('link', { name: 'Chi sono' }).click();
		await expect(shown(page).locator('h1')).toHaveText('Chi sono');
		await expect(shown(page).locator('nav a').first()).toHaveCSS('color', 'rgb(194, 65, 12)');
		await expect(page.locator('.cm-content')).toContainText('<h1>Chi sono</h1>');
		await expect(file(page, 'chi-sono.html')).toHaveAttribute('aria-current', 'true');

		// a path that is no file of the project is said
		await file(page, 'index.html').click();
		await write(page, '<link rel="stylesheet" href="css/altro.css">\n<h1>Senza stile</h1>\n<img src="foto.png">\n');
		await expect(log(page)).toContainText('css/altro.css non esiste nel progetto');
		await expect(log(page)).toContainText('foto.png non esiste nel progetto');
	});

	test('a Python program imports the modules of its project and opens its files; files are made, renamed, deleted', async ({ page }) => {
		await open(page, 'Python con un modulo', 'Progetto');
		await run(page).click();
		await expect(log(page)).toContainText('raggio 2.5: area 19.63, circonferenza 15.71', { timeout: 90_000 });

		await page.getByRole('button', { name: 'Nuovo file' }).click();
		await page.getByLabel('Nome del nuovo file').fill('saluti.exe');
		await page.getByLabel('Nome del nuovo file').press('Enter');
		await expect(files(page).getByRole('alert')).toContainText('L’estensione deve essere una di queste');
		await page.getByLabel('Nome del nuovo file').fill('geometria.py');
		await page.getByLabel('Nome del nuovo file').press('Enter');
		await expect(files(page).getByRole('alert')).toContainText('C’è già un file con questo nome.');
		await page.getByLabel('Nome del nuovo file').fill('saluti.py');
		await page.getByLabel('Nome del nuovo file').press('Enter');
		await write(page, 'def ciao():\n    return "ciao dal modulo nuovo"\n');

		// main.py is still what Esegui runs: the module was only opened
		await file(page, 'main.py').click();
		await write(page, 'import saluti\nprint(saluti.ciao())\n');
		await run(page).click();
		await expect(log(page)).toContainText('ciao dal modulo nuovo');

		// a module that was changed is read again, and one that was renamed is not found under its old name
		await page.getByRole('button', { name: 'Rinomina saluti.py' }).click();
		await page.getByLabel('Nuovo nome del file').fill('parole.py');
		await page.getByLabel('Nuovo nome del file').press('Enter');
		await run(page).click();
		await expect(log(page)).toContainText("ModuleNotFoundError: No module named 'saluti'");

		await page.getByRole('button', { name: 'Elimina raggi.txt' }).click();
		await files(page).getByRole('button', { name: 'Elimina', exact: true }).click();
		await expect(file(page, 'raggi.txt')).toHaveCount(0);
		await expect(files(page).locator('[data-path]')).toHaveCount(3);
	});

	test('folders are made in the list, and a file dragged over one goes into it', async ({ page, isMobile, browserName }) => {
		await open(page, 'Python con un modulo', 'Progetto');
		const titles = () => files(page).locator('[data-path]').evaluateAll((rows) => rows.map((row) => (row as HTMLElement).dataset.path ?? ''));
		await page.getByRole('button', { name: 'Nuova cartella' }).click();
		await page.getByLabel('Nome della nuova cartella').fill('i miei moduli');
		await page.getByLabel('Nome della nuova cartella').press('Enter');
		await expect(files(page).getByRole('alert')).toContainText('solo lettere, cifre e trattini');
		await page.getByLabel('Nome della nuova cartella').fill('moduli');
		await page.getByLabel('Nome della nuova cartella').press('Enter');
		// a folder with nothing in it is there, before the files
		expect(await titles()).toEqual(['moduli/', 'geometria.py', 'main.py', 'raggi.txt']);

		if (!isMobile && browserName === 'chromium') {
			// dragged over the folder, the folder is marked as the place the file would go
			const from = (await file(page, 'geometria.py').boundingBox())!;
			const to = (await file(page, 'moduli/').boundingBox())!;
			await page.mouse.move(from.x + 30, from.y + 8);
			await page.mouse.down();
			await page.mouse.move(to.x + 40, to.y + 8, { steps: 8 });
			await expect(files(page).locator('[data-taking]')).toHaveCount(1);
			await page.mouse.up();
			await expect(files(page).locator('[data-taking]')).toHaveCount(0);
		} else {
			await page.getByRole('button', { name: 'Rinomina geometria.py' }).click();
			await page.getByLabel('Nuovo nome del file').fill('moduli/geometria.py');
			await page.getByLabel('Nuovo nome del file').press('Enter');
		}
		await expect.poll(titles).toEqual(['moduli/', 'moduli/geometria.py', 'main.py', 'raggi.txt']);

		// the module is imported from its folder
		await file(page, 'main.py').click();
		await write(page, 'from moduli import geometria\nprint(round(geometria.area_cerchio(1), 2))\n');
		await run(page).click();
		await expect(log(page)).toContainText('3.14', { timeout: 90_000 });

		// a new file in the folder, the folder renamed with what is in it, and deleted with it
		await page.getByRole('button', { name: 'Nuovo file in moduli' }).click();
		await expect(page.getByLabel('Nome del nuovo file')).toHaveValue('moduli/');
		await page.getByLabel('Nome del nuovo file').fill('moduli/note.txt');
		await page.getByLabel('Nome del nuovo file').press('Enter');
		await page.getByRole('button', { name: 'Rinomina la cartella moduli' }).click();
		await page.getByLabel('Nuovo nome della cartella').fill('libreria');
		await page.getByLabel('Nuovo nome della cartella').press('Enter');
		await expect.poll(titles).toEqual(['libreria/', 'libreria/geometria.py', 'libreria/note.txt', 'main.py', 'raggi.txt']);
		await expect(page.getByRole('tab', { name: 'note.txt' })).toHaveAttribute('title', 'libreria/note.txt');

		// closed, a folder hides what is in it
		await file(page, 'libreria/').click();
		await expect.poll(titles).toEqual(['libreria/', 'main.py', 'raggi.txt']);
		await file(page, 'libreria/').click();

		if (!isMobile && browserName === 'chromium') {
			// dragged onto the empty part of the list, a file leaves its folder, which stays
			const inside = (await file(page, 'libreria/note.txt').boundingBox())!;
			const list = (await files(page).locator('ul').boundingBox())!;
			await page.mouse.move(inside.x + 40, inside.y + 8);
			await page.mouse.down();
			await page.mouse.move(list.x + list.width / 2, list.y + list.height / 2, { steps: 8 });
			await page.mouse.up();
			await expect.poll(titles).toEqual(['libreria/', 'libreria/geometria.py', 'main.py', 'note.txt', 'raggi.txt']);
		}

		await page.getByRole('button', { name: 'Elimina la cartella libreria' }).click();
		await files(page).getByRole('button', { name: 'Elimina tutto' }).click();
		await expect.poll(async () => (await titles()).filter((title) => title.startsWith('libreria'))).toEqual([]);
	});

	test('a C++ program is compiled from all its sources', async ({ page }) => {
		await open(page, 'C++ in più file', 'Progetto');
		await run(page).click();
		await expect(log(page)).toContainText('1/2 + 1/3 = 5/6', { timeout: 240_000 });
	});

	test('a C++ program reads and writes the files of its project; a file it makes is in the list, and a rerun starts from the files in the editor', async ({ page }) => {
		await open(page, 'C++ in più file', 'Progetto');
		await page.getByRole('button', { name: 'Nuova cartella' }).click();
		await page.getByLabel('Nome della nuova cartella').fill('dati');
		await page.getByLabel('Nome della nuova cartella').press('Enter');
		await page.getByRole('button', { name: 'Nuovo file', exact: true }).click();
		await page.getByLabel('Nome del nuovo file').fill('dati/numeri.txt');
		await page.getByLabel('Nome del nuovo file').press('Enter');
		await write(page, '3\n4\n');

		// main.cpp is still what Esegui runs: it reads a file, writes one, appends to one and looks for one that is not there
		await file(page, 'main.cpp').click();
		await write(
			page,
			[
				'#include <fstream>',
				'#include <iostream>',
				'#include <string>',
				'#include "frazione.h"',
				'using namespace std;',
				'int main() {',
				'ifstream letto("dati/numeri.txt");',
				'int n, somma = 0;',
				'while (letto >> n) somma += n;',
				'cout << "somma " << somma << endl;',
				'ifstream manca("manca.txt");',
				'if (!manca) cout << "manca.txt non si apre" << endl;',
				'string nome;',
				'getline(cin, nome);',
				'ofstream scritto("dati/somma.txt");',
				'scritto << somma << endl;',
				'fstream registro("registro.txt", ios::out | ios::app);',
				'registro << nome << endl;',
				'cout << "fatto" << endl;',
				'}',
				''
			].join('\n')
		);
		await run(page).click();
		await expect(log(page)).toContainText('manca.txt non si apre', { timeout: 240_000 });
		await expect(log(page)).toContainText('somma 7');
		await reply(page, 'Ada');
		await expect(log(page)).toContainText('Programma finito');
		await expect(log(page)).toContainText('Il programma ha creato i file dati/somma.txt e registro.txt: li trovi nell’elenco dei file.');
		await file(page, 'dati/somma.txt').click();
		await expect(page.locator('.cm-content')).toHaveText('7');
		// the answer typed at the keyboard ran the program again: the name is there once
		await file(page, 'registro.txt').click();
		await expect(page.locator('.cm-content')).toHaveText('Ada');

		// the next run starts from the files in the editor: it appends to what is there, and the open file shows it
		await run(page).click();
		await reply(page, 'Bea');
		await expect(log(page)).toContainText('Il programma ha modificato il file registro.txt.');
		await expect(log(page)).not.toContainText('creato');
		await expect(page.locator('.cm-content')).toHaveText('AdaBea');
	});

	test('a Python program writes files into its project, and what cannot be a file of it is said', async ({ page }) => {
		await open(page, 'Python con un modulo', 'Progetto');
		await write(page, 'import os\nwith open("uscita.csv", "w") as f:\n    f.write("a;b\\n")\nopen("foto.bin", "wb").write(bytes([255, 0]))\nos.remove("raggi.txt")\nprint("ok")\n');
		await run(page).click();
		await expect(log(page)).toContainText('Programma finito', { timeout: 90_000 });
		await expect(log(page)).toContainText('Il programma ha creato il file uscita.csv: lo trovi nell’elenco dei file.');
		await expect(log(page)).toContainText('Il programma ha eliminato il file raggi.txt.');
		await expect(log(page)).toContainText('Il file foto.bin non è entrato nel progetto');
		await expect(file(page, 'raggi.txt')).toHaveCount(0);
		await file(page, 'uscita.csv').click();
		await expect(page.locator('.cm-content')).toHaveText('a;b');
	});

	test('a picture from the device is a file of the project, shown by the page that names it', async ({ page }) => {
		await open(page, undefined, 'Progetto');
		// one pixel
		const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
		await page.locator('input[type=file]').setInputFiles({ name: 'La mia foto.png', mimeType: 'image/png', buffer: png });
		await expect(file(page, 'La-mia-foto.png')).toHaveAttribute('aria-current', 'true');
		await expect(page.getByAltText('L’immagine La-mia-foto.png')).toBeVisible();

		await file(page, 'index.html').click();
		await write(page, '<h1>Foto</h1>\n<img id="foto" src="La-mia-foto.png" alt="">\n');
		await expect.poll(() => shown(page).locator('#foto').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(1);
	});
});

test.describe('projects: the layout', () => {
	const shown = (page: Page) => page.frameLocator('iframe[title="Anteprima della pagina"]');
	const tabs = (page: Page) => page.getByRole('tab').allInnerTexts();

	test('files open as tabs, the page is one more tab, beside the code or closed and opened again', async ({ page, isMobile }) => {
		await open(page, 'Un sito di due pagine', 'Progetto');
		expect(await tabs(page)).toEqual(['index.html', 'Anteprima']);
		await file(page, 'css/stile.css').click();
		await file(page, 'chi-sono.html').click();
		expect(await tabs(page)).toEqual(['index.html', 'stile.css', 'chi-sono.html', 'Anteprima']);
		await expect(shown(page).locator('h1')).toHaveText('Chi sono');

		await page.getByRole('button', { name: 'Chiudi stile.css' }).click();
		expect(await tabs(page)).toEqual(['index.html', 'chi-sono.html', 'Anteprima']);

		// the page closed: the code has all the room; Esegui opens it again
		await page.getByRole('button', { name: 'Chiudi Anteprima' }).click();
		await expect(page.locator('iframe[title="Anteprima della pagina"]')).toHaveCount(0);
		await run(page).click();
		await expect(shown(page).locator('h1')).toHaveText('Chi sono');

		if (!isMobile) {
			// a tab moved to the other column, where the page is
			await page.getByRole('tab', { name: 'index.html' }).click();
			await page.getByRole('button', { name: 'Sposta la scheda nell’altra colonna' }).first().click();
			await expect(page.getByRole('tablist')).toHaveCount(2);
			await expect(page.getByRole('tablist').last().getByRole('tab')).toHaveText(['Anteprima', 'index.html']);
		}
	});

	test('a dragged tab shows where it will go: a line among the tabs, a shade on the half it would take', async ({ page, isMobile, browserName }) => {
		test.skip(isMobile || browserName !== 'chromium', 'tabs are dragged with a mouse, and the test drives the drag as Chromium does');
		await open(page, 'Python con un modulo', 'Progetto');
		await file(page, 'geometria.py').click();
		await file(page, 'raggi.txt').click();
		const tab = (name: string) => page.getByRole('tab', { name });
		const bench = page.locator('section[aria-label^="Editor"]');
		/** How many places for the dragged tab are marked: the line among the tabs, the shade over the code. */
		const marks = () => bench.locator('[data-landing]').count();
		const drag = async (name: string, x: number, y: number) => {
			const from = (await tab(name).boundingBox())!;
			await page.mouse.move(from.x + 20, from.y + 10);
			await page.mouse.down();
			await page.mouse.move(x, y, { steps: 8 });
		};

		// to another place among the tabs
		const main = (await tab('main.py').boundingBox())!;
		await drag('raggi.txt', main.x + 6, main.y + 10);
		await expect.poll(marks).toBe(1);
		await page.mouse.up();
		await expect(page.getByRole('tab')).toHaveText(['raggi.txt', 'main.py', 'geometria.py']);
		await expect.poll(marks).toBe(0);

		// onto the right half of the code: a column of its own
		const code = (await page.locator('.cm-editor').first().boundingBox())!;
		await drag('geometria.py', code.x + code.width * 0.8, code.y + 120);
		await expect.poll(marks).toBe(1);
		await page.mouse.up();
		await expect(page.getByRole('tablist')).toHaveCount(2);
		await expect(page.getByRole('tablist').last().getByRole('tab')).toHaveText(['geometria.py']);

		// and back, onto the other column
		const first = (await page.locator('.cm-editor').first().boundingBox())!;
		await drag('geometria.py', first.x + 80, first.y + 120);
		await expect.poll(marks).toBe(1);
		await page.mouse.up();
		await expect(page.getByRole('tablist')).toHaveCount(1);
		await expect(page.getByRole('tab')).toHaveText(['raggi.txt', 'main.py', 'geometria.py']);
	});

	test('the output under the code is hidden by its button, a run shows it; the editor takes the whole screen', async ({ page }) => {
		await open(page, 'Python con un modulo', 'Progetto');
		await expect(log(page)).toBeVisible();
		await output(page).click();
		await expect(log(page)).toHaveCount(0);
		await run(page).click();
		await expect(log(page)).toContainText('raggio 10.0: area 314.16', { timeout: 90_000 });

		// a module is a program too: the one to run is chosen in the list
		await file(page, 'geometria.py').click();
		await run(page).click();
		await expect(log(page)).toContainText('raggio 10.0: area 314.16');
		await page.getByRole('button', { name: 'Avvia da geometria.py' }).click();
		await run(page).click();
		await expect(log(page)).toContainText('Programma finito');
		await expect(log(page)).not.toContainText('raggio');

		// the settings are a tab among the files', beside the code, and the output stays where it is
		const gear = page.getByRole('button', { name: 'Impostazioni dell’editor' });
		await gear.click();
		await expect(page.getByRole('tab', { name: 'Impostazioni' })).toHaveAttribute('aria-selected', 'true');
		await expect(page.getByRole('region', { name: 'Impostazioni dell’editor' })).toBeVisible();
		await expect(log(page)).toBeVisible();
		await page.getByLabel('Dimensione del testo in pixel').fill('18');
		await expect(page.locator('.cm-editor').first()).toHaveCSS('font-size', '18px');
		await page.getByRole('region', { name: 'Impostazioni dell’editor' }).getByRole('button', { name: 'Ripristina' }).click();
		await gear.click();
		await expect(page.getByRole('tab', { name: 'Impostazioni' })).toHaveCount(0);

		const bench = page.locator('section[aria-label^="Editor"]');
		await page.getByRole('button', { name: 'Schermo intero' }).click();
		await expect.poll(() => bench.evaluate((section) => section.getBoundingClientRect().height >= window.innerHeight - 1)).toBe(true);
		await page.getByRole('button', { name: 'Schermo intero' }).click();
		await expect.poll(() => bench.evaluate((section) => section.getBoundingClientRect().height < window.innerHeight)).toBe(true);
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
		// the size is a whole number of pixels between 10 and 20: typed, stepped, and put right when it is neither
		const size = page.getByLabel('Dimensione del testo in pixel');
		await size.fill('17');
		await expect(page.locator('.cm-editor')).toHaveCSS('font-size', '17px');
		await size.fill('99');
		await size.blur();
		await expect(size).toHaveValue('20');
		await expect(page.getByRole('button', { name: 'Testo più grande' })).toBeDisabled();
		await size.fill('16.6');
		await expect(page.locator('.cm-editor')).toHaveCSS('font-size', '20px');
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
		await expect(page.locator('.cm-editor')).toHaveCSS('font-size', '13px');
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
		await page.getByLabel('Linguaggio').selectOption({ label: 'Progetto' });
		await file(page, 'style.css').click();
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
		await expect(page.getByLabel('Linguaggio')).toHaveValue('project');
		await expect(page.frameLocator('iframe[title="Anteprima della pagina"]').locator('h1')).toHaveCSS('color', 'rgb(0, 128, 0)');

		const { data } = await supabaseAdmin().from('programs').select('title,language,files').eq('user_id', user!.id).order('title');
		expect(data).toEqual([
			{ title: 'Il mio primo', language: 'python', files: { main: 'print("salvato due")\n' } },
			{ title: 'La mia pagina', language: 'project', files: expect.objectContaining({ 'style.css': 'h1 { color: rgb(0, 128, 0); }\n', 'index.html': expect.stringContaining('<h1>Ciao, mondo!</h1>') }) }
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

	test('a project in a lesson has a tab for each file, and its pages link each other', async ({ page }) => {
		const response = await page.goto('/prova-grafico/lezione?file=prove/codice.md');
		test.skip(response?.status() === 404, 'the trial page of lesson files is not in the production build');
		await page.getByRole('button', { name: 'Rifiuta' }).click({ timeout: 2000 }).catch(() => {});

		const site = block(page, 5);
		await site.scrollIntoViewIfNeeded();
		await expect(site.getByRole('tab')).toHaveText(['index.html', 'contatti.html', 'stile.css']);
		const shown = site.frameLocator('iframe[title="Anteprima della pagina"]');
		await shown.getByRole('link', { name: 'Contatti' }).click();
		await expect(shown.locator('h1')).toHaveText('Contatti');
		await expect(site.getByRole('tab', { name: 'contatti.html' })).toHaveAttribute('aria-selected', 'true');

		const program = block(page, 6);
		await program.scrollIntoViewIfNeeded();
		await program.getByRole('button', { name: 'Verifica' }).click();
		await expect(program.getByRole('log')).toContainText('0 prove superate su 1', { timeout: 90_000 });
		await program.getByRole('button', { name: 'Soluzione' }).click();
		await expect(program.getByRole('tab', { name: 'conti.py' })).toBeVisible();
		await program.getByRole('button', { name: 'Verifica' }).click();
		await expect(program.getByRole('log')).toContainText('Prova 1: superata');
	});

	test('a program in a lesson reads the file beside it and writes files: a new tab, one append for a line typed, a file checked by Verifica', async ({ page }) => {
		const response = await page.goto('/prova-grafico/lezione?file=prove/codice.md');
		test.skip(response?.status() === 404, 'the trial page of lesson files is not in the production build');
		await page.getByRole('button', { name: 'Rifiuta' }).click({ timeout: 2000 }).catch(() => {});

		for (const [language, main] of [['Python', 'main.py'], ['C++', 'main.cpp']]) {
			// the file of data is the same for the two languages, in a tab after the program's
			const read = block(page, 7);
			await read.scrollIntoViewIfNeeded();
			await read.getByRole('radio', { name: language }).click();
			await expect(read.getByRole('tab')).toHaveText([main, 'dati.txt']);
			await read.getByRole('button', { name: 'Esegui' }).click();
			await expect(read.getByRole('log')).toContainText("Somma: 49\nmanca.txt non c'è", { timeout: 240_000 });
			await expect(read.getByRole('log')).not.toContainText('Il programma ha');

			// an exercise on a file: the starting program leaves it empty, the solution writes it
			const made = block(page, 8);
			await made.scrollIntoViewIfNeeded();
			await made.getByRole('button', { name: 'Verifica' }).click();
			await expect(made.getByRole('log')).toContainText('0 prove superate su 2', { timeout: 90_000 });
			await expect(made.getByRole('log')).toContainText('Atteso in uscita.txt');
			await made.getByRole('button', { name: 'Soluzione' }).click();
			await made.getByRole('button', { name: 'Verifica' }).click();
			await expect(made.getByRole('log')).toContainText('Tutte le 2 prove superate.');

			// the answer typed at the keyboard runs the program again from the start: it appends once
			const append = block(page, 9);
			await append.scrollIntoViewIfNeeded();
			for (const [name, lines] of [['Luca', 'AdaLuca'], ['Mia', 'AdaLucaMia']]) {
				await append.getByRole('button', { name: 'Esegui' }).click();
				await append.getByLabel('Risposta al programma').fill(name);
				await append.getByLabel('Risposta al programma').press('Enter');
				await expect(append.getByRole('log')).toContainText('Il programma ha modificato il file registro.txt.');
				await append.getByRole('tab', { name: 'registro.txt' }).click();
				await expect(append.locator('.cm-content')).toHaveText(lines);
				await append.getByRole('tab', { name: main }).click();
			}
			// every test starts from the files in the editor and leaves them as they are
			await append.getByRole('button', { name: 'Ripristina' }).click();
			await append.getByRole('button', { name: 'Verifica' }).click();
			await expect(append.getByRole('log')).toContainText('Tutte le 1 prove superate.');
			await append.getByRole('tab', { name: 'registro.txt' }).click();
			await expect(append.locator('.cm-content')).toHaveText('Ada');
		}
	});

	test('a check of a page acts on it before it looks: clicks, a form that is sent or stopped, the other actions', async ({ page }) => {
		const response = await page.goto('/prova-grafico/lezione?file=prove/codice.md');
		test.skip(response?.status() === 404, 'the trial page of lesson files is not in the production build');
		await page.getByRole('button', { name: 'Rifiuta' }).click({ timeout: 2000 }).catch(() => {});
		// a dialog that opens would stop the check, and fails the test
		let dialogs = 0;
		page.on('dialog', (dialog) => (dialogs++, void dialog.dismiss()));
		const put = async (figure: ReturnType<typeof block>, code: string) => {
			await figure.getByRole('tab', { name: 'script.js' }).click();
			await figure.locator('.cm-content').click();
			await page.keyboard.press('ControlOrMeta+a');
			await page.keyboard.insertText(code);
		};
		const verdicts = async (figure: ReturnType<typeof block>) => {
			await figure.getByRole('button', { name: 'Verifica' }).click();
			return figure.getByLabel('Esito dei controlli');
		};

		// no listener: the page as it is loaded is right, the clicks change nothing
		const counter = block(page, 10);
		await counter.scrollIntoViewIfNeeded();
		await expect(await verdicts(counter)).toContainText('1 controllo superato su 3.');
		await expect(counter.getByLabel('Esito dei controlli')).toContainText('Il testo di "#conta" è "0": dovrebbe essere "1".');
		// a counter that starts from 1 is wrong before any click, and after each: every check has the page loaded anew
		const names = 'const conta = document.querySelector("#conta");\nconst piu = document.querySelector("#piu");\n';
		await put(counter, `${names}let clic = 1;\nconta.textContent = clic;\npiu.addEventListener("click", () => {\nclic = clic + 1;\nconta.textContent = clic;\n});\n`);
		await expect(await verdicts(counter)).toContainText('0 controlli superati su 3.');
		await expect(counter.getByLabel('Esito dei controlli')).toContainText('Il testo di "#conta" è "4": dovrebbe essere "3".');
		// an error of the script while the check clicks is said with the verdict
		await put(counter, `${names}piu.addEventListener("click", () => {\nconta.textContent = mai;\n});\n`);
		await expect(await verdicts(counter)).toContainText('Lo script ha dato un errore: ReferenceError: mai is not defined in script.js, riga 4');
		await counter.getByRole('button', { name: 'Soluzione' }).click();
		await expect(await verdicts(counter)).toContainText('Tutti i 3 controlli superati.');
		// the student finds the page as it starts, and it still answers
		const shown = counter.frameLocator('iframe[title="Anteprima della pagina"]');
		await expect(shown.locator('#conta')).toHaveText('0');
		await shown.locator('#piu').click();
		await expect(shown.locator('#conta')).toHaveText('1');

		const form = block(page, 11);
		await form.scrollIntoViewIfNeeded();
		await expect(await verdicts(form)).toContainText('".errore" è nascosto, e dovrebbe vedersi.');
		const fields = 'const modulo = document.querySelector("#iscrizione");\nconst nome = document.querySelector("#nome");\nconst errore = document.querySelector(".errore");\n';
		// the error is shown and the form goes all the same
		await put(form, `${fields}modulo.addEventListener("submit", () => {\nif (nome.value === "") errore.hidden = false;\n});\n`);
		await expect(await verdicts(form)).toContainText('Il modulo "#iscrizione" è stato inviato lo stesso: l\'invio va fermato con preventDefault().');
		// stopped always: the form with a name must go
		await put(form, `${fields}modulo.addEventListener("submit", (evento) => {\nevento.preventDefault();\nerrore.hidden = nome.value !== "";\n});\n`);
		await expect(await verdicts(form)).toContainText('Il modulo "#iscrizione" non è stato inviato.');
		await form.getByRole('button', { name: 'Soluzione' }).click();
		await expect(await verdicts(form)).toContainText('Tutti i 2 controlli superati.');
		// a form the student sends by hand does not take the preview away
		const sent = form.frameLocator('iframe[title="Anteprima della pagina"]');
		await sent.locator('#nome').fill('Ugo');
		await sent.locator('button').click();
		await expect(sent.locator('#nome')).toHaveValue('Ugo');

		// a select, a checkbox, a key, a wait, and the message of an alert that does not open
		const others = block(page, 12);
		await others.scrollIntoViewIfNeeded();
		await expect(await verdicts(others)).toContainText('Tutti i 5 controlli superati.');
		await put(others, 'document.querySelector("#saluta").addEventListener("click", () => alert("Buongiorno"));\n');
		// only the check of the box that ends without its mark passes on a page that does nothing
		await expect(await verdicts(others)).toContainText('1 controllo superato su 5.');
		await expect(others.getByLabel('Esito dei controlli')).toContainText('L\'avviso della pagina dice "Buongiorno": dovrebbe contenere "Ciao".');
		await expect(others.getByLabel('Esito dei controlli')).toContainText('"#esito" non ha la classe ok.');
		expect(dialogs).toBe(0);
	});

	test('in the preview a form is checked and sent as in a real page and goes nowhere; styles, paths, widths and links to a point are checked', async ({ page }) => {
		const response = await page.goto('/prova-grafico/lezione?file=prove/codice.md');
		test.skip(response?.status() === 404, 'the trial page of lesson files is not in the production build');
		await page.getByRole('button', { name: 'Rifiuta' }).click({ timeout: 2000 }).catch(() => {});
		const preview = (figure: ReturnType<typeof block>) => figure.frameLocator('iframe[title="Anteprima della pagina"]');
		const verdicts = async (figure: ReturnType<typeof block>) => {
			await figure.getByRole('button', { name: 'Verifica' }).click();
			return figure.getByLabel('Esito dei controlli');
		};

		// a form with no script: the browser checks the fields, then the form is sent and stays where it is
		const form = block(page, 13);
		await form.scrollIntoViewIfNeeded();
		const fields = preview(form);
		await fields.locator('button').click();
		await expect(fields.locator('#nome')).toBeFocused();
		await expect(form.getByRole('log')).toHaveCount(0);
		await fields.locator('#nome').fill('Anna');
		await fields.locator('#email').fill('anna@scuola.example');
		await fields.locator('#email').press('Enter');
		await expect(form.getByRole('log')).toContainText('Modulo inviato con il metodo POST a iscrivi.php: nome=Anna, email=anna@scuola.example.');
		await expect(fields.locator('#nome')).toHaveValue('Anna');
		await expect(await verdicts(form)).toContainText('Tutti i 3 controlli superati.');

		// the width of a border, a shorthand, a media query below and above its threshold, a path written another way
		const styles = block(page, 14);
		await styles.scrollIntoViewIfNeeded();
		await expect(await verdicts(styles)).toContainText('4 controlli superati su 6.');
		await expect(styles.getByLabel('Esito dei controlli')).toContainText('Lo stile border-top-width di "h1" è 0px: dovrebbe essere 2px.');
		await expect(styles.getByLabel('Esito dei controlli')).toContainText('Lo stile color di "h1" è rgb(0, 0, 0): dovrebbe essere red.');
		await styles.getByRole('button', { name: 'Soluzione' }).click();
		await expect(await verdicts(styles)).toContainText('Tutti i 6 controlli superati.');
		// the width a check asked for ends with it; the student's own is kept
		await styles.getByRole('radio', { name: /Telefono/ }).click();
		await expect.poll(() => preview(styles).locator('body').evaluate(() => innerWidth)).toBe(375);
		await expect(await verdicts(styles)).toContainText('Tutti i 6 controlli superati.');
		await expect.poll(() => preview(styles).locator('body').evaluate(() => innerWidth)).toBe(375);

		// a link to a point of another page opens it there
		const links = block(page, 15);
		await links.scrollIntoViewIfNeeded();
		await preview(links).locator('#vai').click();
		await expect(links.getByRole('tab', { name: 'lunga.html' })).toHaveAttribute('aria-selected', 'true');
		await expect.poll(() => preview(links).locator('#fondo').evaluate((element) => Math.abs(Math.round(element.getBoundingClientRect().top)))).toBeLessThan(30);
		await preview(links).locator('#su').click();
		await expect.poll(() => preview(links).locator('body').evaluate(() => scrollY)).toBeLessThan(30);
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
		await page.getByLabel('Linguaggio').selectOption({ label: 'Progetto' });
		await page.getByLabel('Esempio').selectOption({ label: 'Un contatore' });
		await file(page, 'script.js').click();
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
		await output(page).click();
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

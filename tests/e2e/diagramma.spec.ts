import { test, expect, type Locator, type Page } from '@playwright/test';

/**
 * The flowcharts of a lesson (src/components/diagramma, a ```diagramma block): the drawing published with the page,
 * and the chart that runs one block at a time with its table of variables. The page of trial lessons exists in
 * development only, so against a build these tests are skipped.
 */
async function open(page: Page): Promise<boolean> {
	const response = await page.goto('/prova-grafico/lezione?file=prove/diagramma.md');
	if (response?.status() === 404) return false;
	await page
		.getByRole('button', { name: 'Rifiuta' })
		.click({ timeout: 2000 })
		.catch(() => {});
	return true;
}

/** The chart under a heading of the trial page, once it runs. */
async function chart(page: Page, heading: string, button = 'Passo'): Promise<Locator> {
	const figure = page.locator(`h2:text-is("${heading}") + figure[data-diagramma]`);
	await figure.scrollIntoViewIfNeeded();
	await expect(figure.getByRole('button', { name: button })).toBeVisible();
	return figure;
}

/** Adds a block in the gap at `place` (lib/diagramma/modifica.ts) without carrying it: a tap on the block, a tap on the gap. */
async function add(figure: Locator, place: string, kind: 'input' | 'output' | 'assign' | 'if' | 'while') {
	await figure.locator(`[data-block="${kind}"]`).click();
	await figure.locator(`[data-slot="${place}"]`).click();
	await expect(figure.locator(`[data-editor="${kind}"]`)).toBeVisible();
}

/** The middle of what a locator shows, on the page. */
async function middle(locator: Locator): Promise<{ x: number; y: number }> {
	const box = (await locator.boundingBox())!;
	return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

/** Carries what is at `from` to a point of the page, and holds it there: the test lets go with `page.mouse.up()`. */
async function carry(page: Page, from: Locator, to: { x: number; y: number }) {
	const start = await middle(from);
	await page.mouse.move(start.x, start.y);
	await page.mouse.down();
	await page.mouse.move(start.x + 12, start.y + 12, { steps: 3 });
	await page.mouse.move(to.x, to.y, { steps: 8 });
}

const step = (figure: Locator) => figure.getByRole('button', { name: 'Passo' }).click();
const told = (figure: Locator) => figure.locator('[data-told]');
const variable = (figure: Locator, name: string) => figure.locator(`[data-variable="${name}"]`);
const lit = (figure: Locator) => figure.locator('.fc-on');

test.describe('flowcharts in a lesson', () => {
	test('the page is published with the drawing of every chart', async ({ request }) => {
		const response = await request.get('/prova-grafico/lezione?file=prove/diagramma.md');
		test.skip(response.status() === 404, 'the trial page exists in development only');
		const html = await response.text();
		expect(html.match(/<svg class="flowchart"/g)?.length).toBe(7);
		expect(html).toContain('aria-label="Diagramma di flusso che somma i numeri da 1 a n"');
	});

	test('a chart runs one block at a time and fills its table of variables', async ({ page }) => {
		test.skip(!(await open(page)), 'the trial page exists in development only');
		const figure = await chart(page, 'Ciclo');
		await expect(lit(figure)).toContainText('inizio');
		await step(figure);
		// "leggi" waits with the value the lesson suggests
		await expect(told(figure)).toContainText('Scrivi un valore per n');
		await expect(figure.getByLabel('Valore di n')).toHaveValue('4');
		await figure.getByLabel('Valore di n').fill('2');
		await figure.getByLabel('Valore di n').press('Enter');
		await expect(variable(figure, 'n')).toContainText('2');
		await expect(variable(figure, 'n')).toHaveAttribute('data-marked', 'written');
		await step(figure);
		await step(figure);
		await step(figure);
		// on the condition the table marks the variables it compares, and the sentence shows their values
		await expect(lit(figure)).toContainText('i ≤ n?');
		await expect(told(figure)).toContainText('1 ≤ 2: è vera');
		await expect(variable(figure, 'i')).toHaveAttribute('data-marked', 'read');
		await expect(variable(figure, 'n')).toHaveAttribute('data-marked', 'read');
		await expect(variable(figure, 's')).not.toHaveAttribute('data-marked');
		await step(figure);
		await expect(lit(figure)).toContainText('s ← s + i');
		await expect(figure.locator('.fc-taken')).toContainText('sì');
		await expect(variable(figure, 's')).toHaveAttribute('data-marked', 'written');
		await expect(told(figure)).toContainText('Si calcola 0 + 1');
	});

	test('"Indietro" undoes a step and "Ricomincia" clears the run', async ({ page }) => {
		test.skip(!(await open(page)), 'the trial page exists in development only');
		const figure = await chart(page, 'Selezione a una via');
		await step(figure);
		await figure.getByLabel('Valore di spesa').press('Enter');
		await step(figure);
		await step(figure);
		await expect(variable(figure, 'spesa')).toContainText('70');
		await figure.getByRole('button', { name: 'Indietro' }).click();
		await expect(variable(figure, 'spesa')).toContainText('80');
		await expect(lit(figure)).toContainText('spesa > 50?');
		await figure.getByRole('button', { name: 'Ricomincia' }).click();
		await expect(lit(figure)).toContainText('inizio');
		await expect(figure.locator('[data-variable]')).toHaveCount(0);
	});

	test('"Esegui" runs to the end by itself, stopping for each value to read', async ({ page }) => {
		test.skip(!(await open(page)), 'the trial page exists in development only');
		const figure = await chart(page, 'Selezione a due vie');
		await figure.getByRole('button', { name: 'Esegui' }).click();
		await figure.getByLabel('Valore di voto').fill('8');
		await figure.getByLabel('Valore di voto').press('Enter');
		await expect(told(figure)).toContainText('Fine', { timeout: 10_000 });
		await expect(figure.locator('[data-output]')).toHaveText('promosso');
		await expect(lit(figure)).toContainText('fine');
	});

	test('a mistake stops the run on its block and says why', async ({ page }) => {
		test.skip(!(await open(page)), 'the trial page exists in development only');
		const figure = await chart(page, 'Un errore mentre gira');
		await step(figure);
		await figure.getByLabel('Valore di d').press('Enter');
		await step(figure);
		await expect(told(figure)).toContainText('non si può dividere per zero');
		await expect(figure.locator('.fc-wrong')).toContainText('q ← 10 / d');
		await expect(figure.getByRole('button', { name: 'Passo' })).toBeDisabled();
	});

	test('a chart is built from nothing, and the code beside it follows', async ({ page }) => {
		test.skip(!(await open(page)), 'the trial page exists in development only');
		const figure = await chart(page, 'Da costruire', 'Prova il diagramma');
		const code = figure.locator('[data-code] pre');
		await expect(code).toContainText('Il programma è ancora vuoto');
		await add(figure, ':0', 'input');
		await figure.getByLabel('Variabile da leggere').fill('n');
		await expect(code).toHaveText('n = int(input())');
		await add(figure, ':1', 'while');
		await figure.getByLabel('Condizione').fill('n > 0');
		await add(figure, '1b:0', 'output');
		await figure.getByLabel('Cosa scrivere').fill('n, "giri"');
		await add(figure, '1b:1', 'assign');
		await figure.getByLabel('Variabile', { exact: true }).fill('n');
		// while a field cannot be read the chart keeps the block it had, and says what is wrong
		await figure.getByLabel('Valore che prende').fill('n -');
		await expect(figure.getByRole('alert')).toContainText('incompleta');
		await expect(code).toContainText('n = 0');
		await figure.getByLabel('Valore che prende').fill('n - 1');
		await expect(figure.getByRole('alert')).toHaveCount(0);
		await expect(code).toHaveText(['n = int(input())', 'while n > 0:', '    print(n, "giri")', '    n = n - 1'].join(''));
		// the line of the block being written is lit
		await expect(code.locator('[data-on]')).toHaveText('    n = n - 1');
		await figure.getByRole('radio', { name: 'C++' }).click();
		await expect(code).toContainText('while (n > 0) {');
		await expect(code).toContainText('cout << n << " " << "giri" << endl;');

		await figure.getByRole('button', { name: 'Prova il diagramma' }).click();
		await figure.getByRole('button', { name: 'Esegui' }).click();
		await figure.getByLabel('Valore di n').fill('2');
		await figure.getByLabel('Valore di n').press('Enter');
		await expect(told(figure)).toContainText('Fine', { timeout: 15_000 });
		await expect(figure.locator('[data-output]')).toHaveText('2 giri\n1 giri');
	});

	test('a chart of a lesson is changed, and "Annulla" and "Ripristina" bring it back', async ({ page }) => {
		test.skip(!(await open(page)), 'the trial page exists in development only');
		const figure = await chart(page, 'Selezione a una via');
		await figure.getByRole('button', { name: 'Modifica' }).click();
		const code = figure.locator('[data-code] pre');
		await figure.getByRole('button', { name: 'Modifica il blocco spesa > 50?' }).click();
		await figure.getByLabel('Condizione').fill('spesa >= 100');
		await expect(figure.locator('.fc-picked')).toContainText('spesa ≥ 100?');
		await expect(code).toContainText('if spesa >= 100:');
		await figure.getByLabel('con il ramo «no»').check();
		await expect(code).toContainText('else:    pass');
		await add(figure, '1e:0', 'output');
		await figure.getByLabel('Cosa scrivere').fill('"niente sconto"');
		await expect(figure.locator('svg.flowchart[role="img"]')).toContainText('scrivi “niente sconto”');
		await figure.getByRole('button', { name: 'Elimina il blocco scrivi “niente sconto”' }).click();
		await expect(figure.locator('svg.flowchart[role="img"]')).not.toContainText('niente sconto');
		await figure.getByRole('button', { name: 'Annulla' }).click();
		await expect(figure.locator('svg.flowchart[role="img"]')).toContainText('niente sconto');
		await figure.getByRole('button', { name: 'Ripristina' }).click();
		await expect(code).toContainText('if spesa > 50:');
		await expect(code).not.toContainText('else');
		// from the keyboard too: a block is chosen, then the gap it goes in
		await figure.getByRole('button', { name: 'Blocco Ciclo' }).focus();
		await page.keyboard.press('Enter');
		await figure.locator('[data-slot=":0"]').focus();
		await page.keyboard.press('Enter');
		await expect(figure.locator('[data-editor="while"]')).toBeVisible();
		await expect(code).toContainText('while spesa > 0:');
	});

	test('a block is carried onto a line, which lights up where it will go', async ({ page }) => {
		test.skip(!(await open(page)), 'the trial page exists in development only');
		const figure = await chart(page, 'Selezione a una via');
		await figure.getByRole('button', { name: 'Modifica' }).click();
		const code = figure.locator('[data-code] pre');
		const block = (text: string) => figure.locator('svg.flowchart[role="img"] .fc-node', { hasText: text });

		// a new block from the row, held just above "fine"
		const end = (await block('fine').boundingBox())!;
		const above = { x: end.x + end.width / 2 + 30, y: end.y - 20 };
		await carry(page, figure.locator('[data-block="output"]'), above);
		await expect(figure.locator('.fc-hot')).toHaveAttribute('data-slot', ':3');
		await expect(figure.locator('.fc-hot .fc-stretch')).toHaveCount(1);
		// the block follows the pointer
		const held = await middle(page.locator('[data-carried="output"]'));
		expect(Math.abs(held.x - above.x) + Math.abs(held.y - above.y)).toBeLessThan(4);
		await page.mouse.up();
		// it lands open, with its text taken: typing writes it
		await expect(figure.locator('[data-editor="output"]')).toBeVisible();
		await page.keyboard.type('"fatto"');
		await page.keyboard.press('Enter');
		await expect(figure.locator('[data-editor]')).toHaveCount(0);
		await expect(code).toContainText('print(spesa)print("fatto")');

		// a block of the chart is carried to another line: into the branch "sì", before the block that is there
		const inside = (await block('spesa ← spesa − 10').boundingBox())!;
		await carry(page, block('“fatto”'), { x: inside.x + inside.width / 2, y: inside.y - 20 });
		await expect(figure.locator('.fc-hot')).toHaveAttribute('data-slot', '1t:0');
		await page.mouse.up();
		await expect(code).toContainText('if spesa > 50:    print("fatto")    spesa = spesa - 10print(spesa)');

		// let go away from every line, a block stays where it was
		await carry(page, block('“fatto”'), { x: inside.x - 300, y: inside.y });
		await expect(figure.locator('.fc-hot')).toHaveCount(0);
		await page.mouse.up();
		await expect(code).toContainText('if spesa > 50:    print("fatto")');

		// the bin at the corner of the block under the pointer takes it away
		await block('“fatto”').hover();
		await figure.getByRole('button', { name: 'Elimina il blocco scrivi “fatto”' }).click();
		await expect(code).not.toContainText('fatto');
		await expect(code).toContainText('if spesa > 50:    spesa = spesa - 10print(spesa)');
	});

	test('a "leggi" that asks for an integer does not take anything else', async ({ page }) => {
		test.skip(!(await open(page)), 'the trial page exists in development only');
		const figure = await chart(page, 'Da costruire', 'Prova il diagramma');
		await add(figure, ':0', 'input');
		await figure.getByLabel('Che cosa si legge').selectOption('int');
		await expect(figure.locator('[data-code] pre')).toHaveText('x = int(input())');
		await figure.getByRole('button', { name: 'Prova il diagramma' }).click();
		await step(figure);
		await figure.getByLabel('Valore di x').fill('due');
		await figure.getByLabel('Valore di x').press('Enter');
		await expect(figure.getByRole('alert')).toContainText('x vuole un numero intero');
		await figure.getByLabel('Valore di x').fill('2');
		await figure.getByLabel('Valore di x').press('Enter');
		await expect(variable(figure, 'x')).toContainText('2');
	});

	test('on a phone the chart fits the page', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 800 });
		test.skip(!(await open(page)), 'the trial page exists in development only');
		const figure = await chart(page, 'Ciclo con una selezione dentro');
		const wider = () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
		expect(await wider()).toBeLessThanOrEqual(0);
		// being changed, the chart is larger: it scrolls in its own box
		await figure.getByRole('button', { name: 'Modifica' }).click();
		await add(figure, ':0', 'while');
		expect(await wider()).toBeLessThanOrEqual(0);
	});
});

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

/** Adds a block of `kind` in the gap at `place` (lib/diagramma/modifica.ts) of a chart that is being changed. */
async function add(figure: Locator, place: string, kind: string) {
	await figure.locator(`[data-slot="${place}"]`).click();
	await figure.getByRole('button', { name: kind, exact: true }).click();
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
		await add(figure, ':0', 'Leggi');
		await figure.getByLabel('Variabile da leggere').fill('n');
		await expect(code).toHaveText('n = int(input())');
		await add(figure, ':1', 'Ciclo');
		await figure.getByLabel('Condizione: finché è vera si ripete').fill('n > 0');
		await add(figure, '1b:0', 'Scrivi');
		await figure.getByLabel('Cosa scrivere').fill('n, "giri"');
		await add(figure, '1b:1', 'Assegna');
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
		await figure.getByLabel('Con il ramo «no» (altrimenti)').check();
		await expect(code).toContainText('else:    pass');
		await add(figure, '1e:0', 'Scrivi');
		await figure.getByLabel('Cosa scrivere').fill('"niente sconto"');
		await expect(figure.locator('svg.flowchart')).toContainText('scrivi “niente sconto”');
		await figure.getByRole('button', { name: 'Elimina il blocco' }).click();
		await expect(figure.locator('svg.flowchart')).not.toContainText('niente sconto');
		await figure.getByRole('button', { name: 'Annulla' }).click();
		await expect(figure.locator('svg.flowchart')).toContainText('niente sconto');
		await figure.getByRole('button', { name: 'Ripristina' }).click();
		await expect(code).toContainText('if spesa > 50:');
		await expect(code).not.toContainText('else');
		// a block is reached and picked from the keyboard too
		await figure.locator('[data-slot=":0"]').focus();
		await page.keyboard.press('Enter');
		await expect(figure.getByRole('button', { name: 'Ciclo', exact: true })).toBeVisible();
	});

	test('a "leggi" that asks for an integer does not take anything else', async ({ page }) => {
		test.skip(!(await open(page)), 'the trial page exists in development only');
		const figure = await chart(page, 'Da costruire', 'Prova il diagramma');
		await add(figure, ':0', 'Leggi');
		await figure.getByLabel('Che cosa si legge').selectOption('int');
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
		await figure.locator('[data-slot=":0"]').click();
		await expect(figure.getByRole('button', { name: 'Ciclo', exact: true })).toBeVisible();
		expect(await wider()).toBeLessThanOrEqual(0);
	});
});

import { test, expect } from '@playwright/test';
import { createTestUser, deleteTestUser, gotoHydrated, loginViaModal, type TestUser } from './helpers';

/**
 * The exercises of the programming lessons of informatica, in a real run: a question shows its program in the
 * language chosen, and answering goes through the same route as every other exercise. What is new in them (charts
 * and programs as options, a chart to build, a program to write) is tried one exercise at a time on the trial page
 * of development, which a production build does not have.
 */
const EXERCISES = '/materiale/scuola-superiore/informatica/l-iterazione/il-ciclo-while/esercizi';

test.describe('exercises with programs and flowcharts', () => {
	let user: TestUser | null = null;
	test.beforeAll(async () => {
		user = await createTestUser('inf-esercizi', { subscription: 'base' });
	});
	test.afterAll(async () => {
		await deleteTestUser(user);
	});

	test('a run on a programming lesson shows the program and takes an answer', async ({ page }) => {
		await gotoHydrated(page, EXERCISES);
		await page.getByRole('button', { name: 'Rifiuta' }).click({ timeout: 2000 }).catch(() => {});
		await loginViaModal(page, user!);
		await page.getByRole('button', { name: 'Inizia il livello 1' }).click();
		const run = page.locator('#esercizi');
		await expect(run.locator('.code-pair pre[data-language="python"]')).toBeVisible();
		await expect(run.locator('.code-pair pre[data-language="cpp"]')).toBeHidden();
		// the language of the programs is chosen on the page, and kept
		await run.getByRole('radio', { name: 'C++' }).click();
		await expect(run.locator('.code-pair pre[data-language="cpp"]')).toContainText('int main()');
		await expect(run.locator('.code-pair pre[data-language="python"]')).toBeHidden();
		await run.getByRole('group', { name: 'Risposte' }).getByRole('button').first().click();
		// right or wrong, the answer is graded and counted
		await expect(run.getByRole('progressbar', { name: 'Avanzamento degli esercizi' })).toHaveAttribute('aria-valuenow', '1', { timeout: 20_000 });
	});

	test('on the trial page a chart is built and a program is written, and each is graded', async ({ page }) => {
		const response = await page.goto('/prova-grafico/esercizio?g=inf-ciclo-while&l=6&seed=3&open=1');
		test.skip(response?.status() === 404, 'the trial page exists in development only');
		await page.getByRole('button', { name: 'Rifiuta' }).click({ timeout: 2000 }).catch(() => {});
		await page.locator('[data-build="program"] .cm-content').click();
		await page.keyboard.press('ControlOrMeta+a');
		await page.keyboard.insertText('print(sum(range(1, 5)))\n');
		await page.getByRole('button', { name: 'Consegna' }).click();
		await expect(page.locator('[data-verdict]')).toHaveAttribute('data-verdict', 'correct', { timeout: 120_000 });

		await page.goto('/prova-grafico/esercizio?g=inf-ciclo-while&l=5&seed=3&open=1');
		const chart = page.locator('[data-build="chart"]');
		await chart.locator('[data-block="output"]').click();
		await chart.locator('[data-slot=":0"]').click();
		await chart.getByLabel('Cosa scrivere').fill('7');
		await page.keyboard.press('Enter');
		await page.getByRole('button', { name: 'Consegna il diagramma' }).click();
		await expect(page.locator('[data-verdict]')).toHaveAttribute('data-verdict', 'incorrect');
		await expect(page.locator('[data-verdict]')).toContainText('doveva scrivere «10»');
	});
});

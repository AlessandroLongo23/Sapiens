import { test, expect } from '@playwright/test';
import { createTestUser, deleteTestUser, gotoHydrated, loginViaModal, supabaseAdmin, type TestUser } from './helpers';

/**
 * The exercises of the programming lessons of informatica, in a real run: a question shows its program in the
 * language chosen, and answering goes through the same route as every other exercise. What is new in them (charts
 * and programs as options, a chart to build, a program to write) is tried one exercise at a time on the trial page
 * of development, which a production build does not have.
 */
const EXERCISES = '/materiale/scuola-superiore/informatica/l-iterazione/il-ciclo-while/esercizi';
const LESSON = 'high_school/computer-science/inf-iterazione/inf-ciclo-while';

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

	test('a level already passed asks to write the program, and reads it for the loop it names', async ({ page }) => {
		// The six levels passed, as runs of ten would have left them: a level passed again asks every question open.
		const db = supabaseAdmin();
		const runs = [1, 2, 3, 4, 5, 6].map((level) => ({ user_id: user!.id, lesson_path: LESSON, generator_id: 'inf-ciclo-while', kind: 'level', level, plan: Array(10).fill(level), answered: 10, correct: 10, finished_at: new Date().toISOString() }));
		expect((await db.from('exercise_sessions').insert(runs)).error).toBeNull();

		await gotoHydrated(page, EXERCISES);
		await page.getByRole('button', { name: 'Rifiuta' }).click({ timeout: 2000 }).catch(() => {});
		await loginViaModal(page, user!);
		await page.getByRole('button', { name: 'Ripassa il livello 6' }).click();
		const run = page.locator('#esercizi');
		await expect(run.locator('[data-build-needs]')).toHaveText('Nel programma deve esserci un ciclo while.');
		// a program that prints nothing of what is asked: the answer is taken, run and found wrong
		await run.locator('[data-build="program"] .cm-content').click();
		await page.keyboard.press('ControlOrMeta+a');
		await page.keyboard.insertText('n = int(input())\nfor i in range(n):\n    print("no")\n');
		await run.getByRole('button', { name: 'Consegna' }).click();
		await expect(run.getByRole('progressbar', { name: 'Avanzamento degli esercizi' })).toHaveAttribute('aria-valuenow', '1', { timeout: 120_000 });
	});

	test('on the trial page a chart is built and a program is written, and each is graded', async ({ page }) => {
		const LEVEL6 = '/prova-grafico/esercizio?g=inf-ciclo-while&l=6&seed=3&open=1';
		const response = await page.goto(LEVEL6);
		test.skip(response?.status() === 404, 'the trial page exists in development only');
		await page.getByRole('button', { name: 'Rifiuta' }).click({ timeout: 2000 }).catch(() => {});
		const hand = async (code: string) => {
			await page.locator('[data-build="program"] .cm-content').click();
			await page.keyboard.press('ControlOrMeta+a');
			await page.keyboard.insertText(code);
			await page.getByRole('button', { name: 'Consegna' }).click();
		};
		// the sum from 1 to n by its formula, and with a for: both write the right numbers, neither is the while asked for
		await hand('n = int(input())\nprint(n * (n + 1) // 2)  # while\n');
		await expect(page.locator('[data-verdict]')).toHaveAttribute('data-verdict', 'incorrect', { timeout: 120_000 });
		await expect(page.locator('[data-verdict]')).toContainText('chiede un ciclo while');
		await page.goto(LEVEL6);
		await hand('n = int(input())\nsomma = 0\nfor i in range(1, n + 1):\n    somma = somma + i\nprint(somma)\n');
		await expect(page.locator('[data-verdict]')).toHaveAttribute('data-verdict', 'incorrect', { timeout: 120_000 });
		await expect(page.locator('[data-verdict]')).toContainText('chiede un ciclo while');
		await page.goto(LEVEL6);
		await hand('n = int(input())\nsomma = 0\ni = 1\nwhile i <= n:\n    somma = somma + i\n    i = i + 1\nprint(somma)\n');
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

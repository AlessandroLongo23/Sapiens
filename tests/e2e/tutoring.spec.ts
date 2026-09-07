import { test, expect } from '@playwright/test';
import { createTestUser, deleteTestUser, loginViaModal, supabaseAdmin, type TestUser } from './helpers';

/**
 * The tutoring marketplace: list, filters in the URL, profile, and a request
 * sent by a signed-in student. Needs the demo tutors in the database
 * (`node scripts/seed-tutors.mjs`).
 */

test.describe('tutoring marketplace', () => {
	test('list renders, filters live in the URL and a shared URL filters on load', async ({ page }) => {
		await page.goto('/ripetizioni');
		await expect(page.locator('h1')).toHaveText('Ripetizioni');
		const cards = page.locator('ul[aria-label="Tutor disponibili"] > li');
		const total = await cards.count();
		expect(total).toBeGreaterThan(0);

		await page.selectOption('#filter-subject', 'analisi-1');
		await expect(page).toHaveURL(/materia=analisi-1/);
		const filtered = await cards.count();
		expect(filtered).toBeLessThan(total);
		expect(filtered).toBeGreaterThan(0);

		await page.getByRole('button', { name: 'Azzera filtri' }).click();
		await expect(page).toHaveURL(/\/ripetizioni$/);
		await expect(cards).toHaveCount(total);

		await page.goto('/ripetizioni?livello=university&modalita=online');
		await expect(page.locator('#filter-level')).toHaveValue('university');
		await expect(page.getByRole('button', { name: 'Online', exact: true })).toHaveAttribute('aria-pressed', 'true');
		expect(await cards.count()).toBeLessThan(total);
	});

	test('profile page renders and unknown slugs are 404', async ({ page, request }) => {
		const res = await page.goto('/ripetizioni/demo-giulia-d');
		expect(res?.status()).toBe(200);
		await expect(page.locator('h1')).toHaveCount(1);
		await expect(page.getByRole('heading', { name: /Chiedi aiuto a Giulia D\./ })).toBeVisible();
		expect((await request.get('/ripetizioni/does-not-exist')).status()).toBe(404);
	});

	test('anonymous requests are refused by the API and the form asks to log in', async ({ page, request }) => {
		expect((await request.post('/api/tutoring/requests', { data: {} })).status()).toBe(401);

		await page.goto('/ripetizioni');
		// The cookie banner is a dialog too: dismiss it so it neither matches nor overlaps.
		await page.getByRole('dialog', { name: 'Cookie e privacy' }).getByRole('button', { name: 'Rifiuta' }).click();
		await page.getByRole('button', { name: 'Chiedi aiuto' }).first().click();
		const dialog = page.getByRole('dialog', { name: /Chiedi aiuto a/ });
		await dialog.locator('#req-name').fill('Studente Anonimo');
		await dialog.locator('#req-phone').fill('+39 333 000 1111');
		await dialog.locator('#req-message').fill('Ho una verifica di matematica tra una settimana e vorrei ripassare.');
		await dialog.getByRole('checkbox').check();
		await dialog.getByRole('button', { name: 'Invia la richiesta' }).click();
		// The login modal opens instead of sending.
		await expect(page.getByRole('dialog').getByPlaceholder('Email')).toBeVisible();
	});

	test('a signed-in student sends a request and a second one to the same tutor is refused', async ({ page }) => {
		let user: TestUser | null = null;
		try {
			user = await createTestUser('tutoring');
			await page.goto('/ripetizioni/demo-marco-r');
			await loginViaModal(page, user);

			await expect(page.locator('#req-name')).toHaveValue('Test tutoring');
			await expect(page.locator('#req-email')).toHaveValue(user.email);
			await page.fill('#req-phone', '+39 333 123 4567');
			await page.fill('#req-message', 'Primo anno di ingegneria, esame di Analisi I tra tre settimane: vorrei tre lezioni.');
			await page.getByRole('checkbox').check();
			await page.getByRole('button', { name: 'Invia la richiesta' }).click();
			await expect(page.getByText('Richiesta inviata a Marco R.')).toBeVisible();

			const { data: rows } = await supabaseAdmin().from('tutor_requests').select('status, subject, contact_phone').eq('student_id', user.id);
			expect(rows).toHaveLength(1);
			expect(rows?.[0]).toMatchObject({ status: 'pending', subject: 'analisi-1', contact_phone: '+39 333 123 4567' });

			// Same tutor again: one pending request per pair.
			const { data: tutor } = await supabaseAdmin().from('tutors').select('id').eq('slug', 'demo-marco-r').single();
			const status = await page.evaluate(async (tutorId) => {
				const r = await fetch('/api/tutoring/requests', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						tutorId,
						subject: 'analisi-1',
						level: 'university',
						mode: 'online',
						requester: 'student',
						contactName: 'Test tutoring',
						contactPhone: '+39 333 123 4567',
						message: 'Seconda richiesta allo stesso tutor, deve essere rifiutata dal server.',
						consent: true
					})
				});
				return r.status;
			}, tutor!.id);
			expect(status).toBe(409);
		} finally {
			await deleteTestUser(user);
		}
	});
});

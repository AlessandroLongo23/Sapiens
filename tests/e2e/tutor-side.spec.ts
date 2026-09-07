import { test, expect, type Browser } from '@playwright/test';
import { createTestUser, deleteTestUser, loginViaModal, supabaseAdmin, THEORY_PATH, type TestUser } from './helpers';

/**
 * The tutor side of the marketplace, end to end: a tutor creates a profile,
 * staff publishes it, a student asks for help, the tutor accepts (contacts
 * revealed both ways), declines, the student cancels, an old request expires.
 * Three throwaway users, deleted at the end together with the profile.
 */

const PROFILE = {
	last: 'Tutorside',
	headline: 'Profilo di prova per i test end-to-end della piattaforma',
	bio: 'Questo è un profilo creato automaticamente dai test end-to-end. Non è un tutor reale e viene cancellato alla fine del test.',
	phone: '+39 333 987 6543'
};
const STUDENT_PHONE = '+39 333 111 2222';
const FIRST_MESSAGE = 'Richiesta di prova dai test end-to-end: esame di Analisi I tra due settimane.';
const SECOND_MESSAGE = 'Seconda richiesta di prova: vorrei lezioni di matematica a Bologna in presenza.';
const THIRD_MESSAGE = 'Terza richiesta di prova, che lo studente annulla subito dopo averla inviata.';
const OLD_MESSAGE = 'Richiesta vecchia di due giorni, deve risultare scaduta nella lista.';

async function signedIn(browser: Browser, user: TestUser, path: string) {
	const ctx = await browser.newContext();
	const page = await ctx.newPage();
	await page.goto('/');
	// The cookie banner has its own "Accetta" button: dismiss it before anything else.
	await page.getByRole('dialog', { name: 'Cookie e privacy' }).getByRole('button', { name: 'Rifiuta' }).click();
	await loginViaModal(page, user);
	await page.goto(path);
	return { ctx, page };
}

async function sendRequest(page: import('@playwright/test').Page, slug: string, subject: string, message: string) {
	await page.goto(`/ripetizioni/${slug}`);
	await page.selectOption('#req-subject', subject);
	await page.fill('#req-phone', STUDENT_PHONE);
	await page.fill('#req-message', message);
	await page.getByRole('checkbox').check();
	await page.getByRole('button', { name: 'Invia la richiesta' }).click();
	await expect(page.getByText(/Richiesta inviata a Test T\./)).toBeVisible();
}

test.describe.serial('tutor side', () => {
	let tutorUser: TestUser | null = null;
	let studentUser: TestUser | null = null;
	let adminUser: TestUser | null = null;
	let tutorSlug = '';
	let tutorId = '';

	test.beforeAll(async () => {
		tutorUser = await createTestUser('tutor');
		studentUser = await createTestUser('student');
		adminUser = await createTestUser('admin', { admin: true });
	});

	test.afterAll(async () => {
		if (tutorUser) await supabaseAdmin().from('tutors').delete().eq('user_id', tutorUser.id);
		await deleteTestUser(tutorUser);
		await deleteTestUser(studentUser);
		await deleteTestUser(adminUser);
	});

	test('a tutor creates a profile and it goes to review', async ({ browser }) => {
		const { ctx, page } = await signedIn(browser, tutorUser!, '/ripetizioni/diventa-tutor');
		await page.getByRole('button', { name: 'Crea il tuo profilo' }).first().click();
		await expect(page).toHaveURL(/\/profile-editor$/);
		await expect(page.locator('#first_name')).toHaveValue('Test');

		await page.fill('#last_name', PROFILE.last);
		await page.fill('#headline', PROFILE.headline);
		await page.fill('#bio', PROFILE.bio);
		await page.getByRole('button', { name: 'Matematica', exact: true }).click();
		await page.getByRole('button', { name: 'Analisi I', exact: true }).click();
		await page.getByRole('button', { name: 'Scuola superiore', exact: true }).click();
		await page.getByRole('button', { name: 'Università', exact: true }).click();
		await page.getByRole('button', { name: 'Online', exact: true }).click();
		await page.getByRole('button', { name: 'In presenza', exact: true }).click();
		await page.fill('#city', 'Bologna');
		await page.fill('#hourly_rate', '17');
		await page.fill('#education', 'Matematica, Università di Bologna');
		await page.fill('#years', '3');
		await page.fill('#contact_phone', PROFILE.phone);
		await page.getByRole('checkbox').check();
		await page.getByRole('button', { name: 'Invia il profilo in revisione' }).click();
		await expect(page.getByText('Profilo salvato')).toBeVisible();

		const { data } = await supabaseAdmin().from('tutors').select('id, slug, status, city, subjects, contact_email').eq('user_id', tutorUser!.id).single();
		expect(data?.status).toBe('pending');
		expect(data?.city).toBe('Bologna');
		expect(data?.subjects).toEqual(['matematica', 'analisi-1']);
		expect(data?.contact_email).toBe(tutorUser!.email);
		tutorSlug = data!.slug;
		tutorId = data!.id;

		// Not public until staff publishes it.
		expect((await page.request.get(`/ripetizioni/${tutorSlug}`)).status()).toBe(404);
		await page.goto('/dashboard');
		await expect(page.getByText('Profilo: In revisione')).toBeVisible();
		await ctx.close();
	});

	test('staff publishes and verifies the profile', async ({ browser }) => {
		const { ctx, page } = await signedIn(browser, adminUser!, '/admin/tutors');
		const row = page.locator(`[data-tutor="${tutorSlug}"]`);
		await expect(row).toBeVisible();
		await row.getByRole('button', { name: 'Pubblica' }).click();
		await page.getByRole('button', { name: /^Pubblicati/ }).click();
		await expect(row).toBeVisible();
		await row.getByRole('button', { name: 'Segna verificato' }).click();
		await expect(row.getByText('verificato', { exact: true })).toBeVisible();

		const res = await page.request.get(`/ripetizioni/${tutorSlug}`);
		expect(res.status()).toBe(200);
		expect(await res.text()).toContain('Identità verificata');
		await ctx.close();
	});

	test('a student sends a request and sees no tutor contacts yet', async ({ browser }) => {
		const { ctx, page } = await signedIn(browser, studentUser!, '/');
		await sendRequest(page, tutorSlug, 'analisi-1', FIRST_MESSAGE);
		await page.goto('/richieste');
		await expect(page.getByText('In attesa', { exact: true })).toBeVisible();
		await expect(page.getByText(PROFILE.phone)).toHaveCount(0);
		await ctx.close();
	});

	test('the tutor sees the message without contacts and accepts', async ({ browser }) => {
		const { ctx, page } = await signedIn(browser, tutorUser!, '/leads');
		await expect(page.getByText(FIRST_MESSAGE)).toBeVisible();
		await expect(page.getByText(STUDENT_PHONE)).toHaveCount(0);
		await expect(page.getByText('Test student')).toHaveCount(0);

		await page.locator('li', { hasText: FIRST_MESSAGE }).getByRole('button', { name: 'Accetta' }).click();
		await expect(page.getByText(STUDENT_PHONE)).toBeVisible();
		await expect(page.getByText(/Test student/)).toBeVisible();

		const { data } = await supabaseAdmin().from('tutor_requests').select('status').eq('student_id', studentUser!.id);
		expect(data?.map((r) => r.status)).toEqual(['accepted']);
		await ctx.close();
	});

	test('the student sees the tutor contacts once accepted', async ({ browser }) => {
		const { ctx, page } = await signedIn(browser, studentUser!, '/richieste');
		await expect(page.getByText('Accettata', { exact: true })).toBeVisible();
		await expect(page.getByText(PROFILE.phone)).toBeVisible();
		await expect(page.getByText(tutorUser!.email)).toBeVisible();
		await ctx.close();
	});

	test('a second request is declined and a third one cancelled by the student', async ({ browser }) => {
		const student = await signedIn(browser, studentUser!, '/');
		await sendRequest(student.page, tutorSlug, 'matematica', SECOND_MESSAGE);

		const tutor = await signedIn(browser, tutorUser!, '/leads');
		const card = tutor.page.locator('li', { hasText: SECOND_MESSAGE });
		await card.getByRole('button', { name: 'Rifiuta', exact: true }).click();
		await card.getByRole('button', { name: 'Sì, rifiuta' }).click();
		await expect(tutor.page.locator('li', { hasText: SECOND_MESSAGE }).getByText('Rifiutata')).toBeVisible();
		await tutor.ctx.close();

		await student.page.goto('/richieste');
		await expect(student.page.locator('li', { hasText: SECOND_MESSAGE }).getByText('Rifiutata')).toBeVisible();

		await sendRequest(student.page, tutorSlug, 'matematica', THIRD_MESSAGE);
		await student.page.goto('/richieste');
		const third = student.page.locator('li', { hasText: THIRD_MESSAGE });
		await third.getByRole('button', { name: 'Annulla richiesta' }).click();
		await third.getByRole('button', { name: 'Sì, annulla' }).click();
		await expect(student.page.locator('li', { hasText: THIRD_MESSAGE }).getByText('Annullata')).toBeVisible();
		await student.ctx.close();

		const { data } = await supabaseAdmin().from('tutor_requests').select('status').eq('student_id', studentUser!.id).order('created_at');
		expect(data?.map((r) => r.status)).toEqual(['accepted', 'declined', 'cancelled']);
	});

	test('an unanswered request expires after 48 hours', async ({ browser }) => {
		const admin = supabaseAdmin();
		const past = new Date(Date.now() - 49 * 3600 * 1000).toISOString();
		const { error } = await admin.from('tutor_requests').insert({
			tutor_id: tutorId,
			student_id: studentUser!.id,
			subject: 'matematica',
			level: 'high_school',
			mode: 'online',
			requester: 'student',
			contact_name: 'Test student',
			contact_phone: STUDENT_PHONE,
			message: OLD_MESSAGE,
			created_at: past,
			expires_at: past
		});
		expect(error).toBeNull();

		const { ctx, page } = await signedIn(browser, tutorUser!, '/leads');
		await expect(page.locator('li', { hasText: OLD_MESSAGE.slice(0, 20) }).getByText('Scaduta', { exact: true })).toBeVisible();
		const { data } = await admin.from('tutor_requests').select('status').eq('message', OLD_MESSAGE);
		expect(data?.[0]?.status).toBe('expired');
		await ctx.close();
	});
});

test.describe('entry points', () => {
	test('lesson pages link to the tutors of their subject and level', async ({ page }) => {
		await page.goto(THEORY_PATH);
		await expect(page.getByRole('link', { name: 'Chiedi aiuto a un tutor' })).toHaveAttribute(
			'href',
			'/ripetizioni?materia=matematica&livello=high_school'
		);
	});

	test('the phone header has a marketplace link', async ({ browser }) => {
		const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
		const page = await ctx.newPage();
		await page.goto('/');
		await expect(page.locator('header a[aria-label="Ripetizioni"]')).toBeVisible();
		await ctx.close();
	});

	test('the become-a-tutor page asks anonymous visitors to sign up', async ({ page }) => {
		await page.goto('/ripetizioni/diventa-tutor');
		await expect(page.locator('h1')).toHaveCount(1);
		await page.getByRole('button', { name: 'Crea il tuo profilo' }).first().click();
		await expect(page.getByRole('dialog').getByPlaceholder('Email')).toBeVisible();
	});
});

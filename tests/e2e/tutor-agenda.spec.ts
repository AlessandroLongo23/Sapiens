import { test, expect, type Browser, type Page } from '@playwright/test';
import { createTestUser, deleteTestUser, loginViaModal, supabaseAdmin, type TestUser } from './helpers';

/**
 * The tutor's agenda, end to end (vault/Prodotti/Tutor/Agenda tutor.md): a tutor adds a student and invites
 * them, the student accepts and shares their progress, the tutor assigns exercises and plans lessons, the
 * student proposes lessons, the two write to each other, the student reviews the tutor and leaves. Three
 * throwaway users and one tutor profile, deleted at the end with everything hanging from them.
 */

const LESSON = 'high_school/math/insiemi-e-logica/prime-definizioni';
const STUDENT_NAME = 'Giulia Prova';
const NOTE = 'Appunto privato del tutor: fa fatica con i segni.';
const TUTOR_MESSAGE = 'Ciao, ci vediamo giovedì: porta il libro di matematica.';
const STUDENT_MESSAGE = 'Va bene, ho anche una domanda sulle frazioni.';
const REVIEW = 'Spiega con calma e mi lascia provare da sola.';

const iso = (d: Date) => d.toISOString().slice(0, 10);
/** A day `n` days from now, as a date field takes it. */
const inDays = (n: number) => iso(new Date(Date.now() + n * 86_400_000));
/** The first Monday of next month: a lesson repeated weekly from it fills the month. */
function firstMondayNextMonth(): { day: string; count: number } {
	const now = new Date();
	const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
	while (d.getUTCDay() !== 1) d.setUTCDate(d.getUTCDate() + 1);
	const month = d.getUTCMonth();
	let count = 0;
	for (const x = new Date(d); x.getUTCMonth() === month; x.setUTCDate(x.getUTCDate() + 7)) count++;
	return { day: iso(d), count };
}

async function signedIn(browser: Browser, user: TestUser, path: string, viewport?: { width: number; height: number }) {
	const ctx = await browser.newContext(viewport ? { viewport } : {});
	const page = await ctx.newPage();
	await page.goto('/');
	await page.getByRole('region', { name: 'Cookie e privacy' }).getByRole('button', { name: 'Rifiuta' }).click();
	await loginViaModal(page, user);
	await page.goto(path);
	return { ctx, page };
}

/**
 * What sticks out past the right edge of the window. The page clips its overflow, so the document never scrolls
 * sideways: the elements themselves are measured. Rows meant to scroll and what is hidden from view are left out.
 */
function sideways(page: Page): Promise<string[]> {
	return page.evaluate(() =>
		[...document.querySelectorAll('main *')]
			.filter((el) => {
				if (el.closest('.scroll-x, .sr-only, [aria-hidden="true"]')) return false;
				const r = el.getBoundingClientRect();
				return r.width > 0 && r.right > window.innerWidth + 1;
			})
			.slice(0, 3)
			.map((el) => `${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim().slice(0, 40)}"`)
	);
}

/** Fills the lesson form of an open sheet. */
async function fillLesson(page: Page, day: string, time: string, note: string) {
	const dialog = page.getByRole('dialog');
	await dialog.locator('#lesson-day').fill(day);
	await dialog.locator('#lesson-time').fill(time);
	await dialog.locator('#lesson-note').fill(note);
	return dialog;
}

test.describe.serial('tutor agenda', () => {
	let tutorUser: TestUser | null = null;
	let studentUser: TestUser | null = null;
	let outsider: TestUser | null = null;
	let tutorId = '';
	let tutorSlug = '';
	let linkId = '';
	let inviteUrl = '';
	const db = supabaseAdmin();

	test.beforeAll(async () => {
		tutorUser = await createTestUser('agenda-tutor');
		studentUser = await createTestUser('agenda-student');
		outsider = await createTestUser('agenda-outsider');
		tutorSlug = `test-agenda-${Date.now()}`;
		const { data, error } = await db
			.from('tutors')
			.insert({
				user_id: tutorUser.id,
				slug: tutorSlug,
				first_name: 'Test',
				last_name: 'Agenda',
				headline: 'Profilo di prova per i test end-to-end della agenda',
				bio: 'Profilo creato dai test end-to-end della agenda del tutor. Non è un tutor reale e viene cancellato alla fine.',
				subjects: ['matematica', 'fisica'],
				levels: ['high_school'],
				modes: ['online'],
				contact_email: tutorUser.email,
				contact_phone: '+39 333 000 1111',
				status: 'published',
				terms_accepted_at: new Date().toISOString()
			})
			.select('id')
			.single();
		if (error) throw new Error(`could not create the test tutor: ${error.message}`);
		tutorId = data.id;
	});

	test.afterAll(async () => {
		// Diary entries written for the students go with their accounts; the rest hangs from the tutor row.
		if (tutorId) await db.from('tutors').delete().eq('id', tutorId);
		await deleteTestUser(tutorUser);
		await deleteTestUser(studentUser);
		await deleteTestUser(outsider);
	});

	test('a tutor adds a student and gets an invite to send', async ({ browser }) => {
		const { ctx, page } = await signedIn(browser, tutorUser!, '/studenti');
		await expect(page.getByRole('heading', { name: 'Ancora nessuno studente' })).toBeVisible();
		await page.getByRole('button', { name: 'Aggiungi uno studente' }).click();
		const dialog = page.getByRole('dialog');
		await dialog.locator('#student-name').fill(STUDENT_NAME);
		await dialog.locator('#student-subject').selectOption('matematica');
		await dialog.locator('#student-level').selectOption('high_school');
		await dialog.getByRole('button', { name: /Aggiungi e crea/ }).click();
		await expect(page).toHaveURL(/\/studenti\/[0-9a-f-]{36}$/);
		linkId = page.url().split('/').pop()!;

		await expect(page.getByRole('heading', { name: STUDENT_NAME, level: 1 })).toBeVisible();
		await expect(page.getByText('Invito da accettare')).toBeVisible();
		inviteUrl = await page.locator('[data-invite-link]').inputValue();
		await expect(page.locator('[data-invite-link]')).toHaveValue(/^http.*\/invito-tutor\/[a-z0-9]{24}$/);
		inviteUrl = await page.locator('[data-invite-link]').inputValue();
		// The WhatsApp link carries the whole address, not a path.
		expect(decodeURIComponent((await page.getByRole('link', { name: 'WhatsApp' }).getAttribute('href'))!)).toContain(inviteUrl);
		// Before the student joins: no assignments, no messages.
		await expect(page.getByRole('button', { name: 'Assegna esercizi' })).toHaveCount(0);
		await expect(page.getByText('Compiti, progressi e messaggi arrivano dopo.')).toBeVisible();
		await expect(page.getByRole('navigation', { name: 'Sezioni della scheda' }).getByRole('link', { name: /Messaggi/ })).toHaveCount(0);

		const { data } = await db.from('tutor_students').select('status, student_id, subject, level, origin').eq('id', linkId).single();
		expect(data).toEqual({ status: 'invited', student_id: null, subject: 'matematica', level: 'high_school', origin: 'invite' });
		await ctx.close();
	});

	test('the tutor plans a lesson before the student has joined', async ({ browser }) => {
		const { ctx, page } = await signedIn(browser, tutorUser!, `/studenti/${linkId}`);
		await page.getByRole('button', { name: 'Fissa una lezione' }).click();
		const dialog = await fillLesson(page, inDays(3), '16:00', 'Insiemi e prime definizioni');
		await dialog.getByRole('button', { name: 'Fissa la lezione' }).click();
		await expect(page.locator('[data-lesson]').getByText('Confermata')).toBeVisible();
		await expect(page.getByText('Insiemi e prime definizioni')).toBeVisible();
		await ctx.close();
	});

	test('an anonymous visitor sees who invites them and is asked to sign in', async ({ page }) => {
		await page.goto(inviteUrl);
		await expect(page.getByRole('heading', { name: 'Test A. ti invita su Sapiens' })).toBeVisible();
		await page.getByRole('button', { name: 'Accedi o registrati per accettare' }).click();
		await expect(page.getByRole('dialog').getByPlaceholder('Email')).toBeVisible();
	});

	test('the tutor cannot accept their own invite', async ({ browser }) => {
		const { ctx, page } = await signedIn(browser, tutorUser!, new URL(inviteUrl).pathname);
		await expect(page.getByText('Questo è un invito che hai creato tu')).toBeVisible();
		await expect(page.getByRole('button', { name: /Accetta/ })).toHaveCount(0);
		await ctx.close();
	});

	test('the student accepts the invite and shares their progress', async ({ browser }) => {
		const { ctx, page } = await signedIn(browser, studentUser!, new URL(inviteUrl).pathname);
		await page.getByRole('checkbox').check();
		await page.getByRole('button', { name: "Accetta l'invito" }).click();
		await expect(page).toHaveURL(new RegExp(`/il-mio-tutor/${linkId}$`));
		await expect(page.getByRole('heading', { name: 'Test A.' })).toBeVisible();
		await expect(page.getByText('Test vede i tuoi progressi')).toBeVisible();
		// The lesson planned before joining is there, and in the diary.
		await expect(page.locator('[data-lesson]').getByText('Confermata')).toBeVisible();

		const { data } = await db.from('tutor_students').select('status, student_id, progress_shared, invite_code').eq('id', linkId).single();
		expect(data).toEqual({ status: 'active', student_id: studentUser!.id, progress_shared: true, invite_code: null });
		const { data: entries } = await db.from('diary_entries').select('kind, source, text').eq('user_id', studentUser!.id);
		expect(entries).toEqual([{ kind: 'promemoria', source: 'tutor', text: 'Lezione con Test alle 16:00, online' }]);

		// The code works once.
		await page.goto(new URL(inviteUrl).pathname);
		await expect(page.getByRole('heading', { name: 'Questo invito non è più valido' })).toBeVisible();
		await ctx.close();
	});

	test('the tutor assigns exercises and they land in the student diary', async ({ browser }) => {
		const due = inDays(5);
		const { ctx, page } = await signedIn(browser, tutorUser!, `/studenti/${linkId}/progressi`);
		await expect(page.getByText(`${STUDENT_NAME} non ha ancora fatto esercizi su Sapiens.`)).toBeVisible();
		await page.getByRole('navigation', { name: 'Sezioni della scheda' }).getByRole('link', { name: 'Scheda' }).click();
		await page.getByRole('button', { name: 'Assegna esercizi' }).click();
		const dialog = page.getByRole('dialog');
		await dialog.locator('#assign-search').fill('prime definizioni');
		await dialog.locator('#assign-lesson').selectOption(LESSON);
		await dialog.locator('#assign-level').selectOption('1');
		await dialog.locator('#assign-due').fill(due);
		await dialog.locator('#assign-note').fill('Leggi bene le consegne.');
		await dialog.getByRole('button', { name: 'Assegna', exact: true }).click();
		const card = page.locator(`[data-assignment="${LESSON}"]`);
		await expect(card.getByText('Da fare')).toBeVisible();
		await expect(card.getByText(/Livello 1/)).toBeVisible();
		await ctx.close();

		const { data: entries } = await db.from('diary_entries').select('kind, source, topic, day, subject').eq('user_id', studentUser!.id).eq('kind', 'compito');
		expect(entries).toEqual([{ kind: 'compito', source: 'tutor', topic: LESSON, day: due, subject: 'matematica' }]);

		const student = await signedIn(browser, studentUser!, `/diario?giorno=${due}`);
		await expect(student.page.getByText('dal tutor').first()).toBeVisible();
		await student.page.goto('/il-mio-tutor');
		const own = student.page.locator(`[data-assignment="${LESSON}"]`);
		await expect(own.getByText('Da fare')).toBeVisible();
		await expect(own.getByRole('link', { name: 'Fai gli esercizi' })).toHaveAttribute('href', /prime-definizioni\/esercizi$/);
		await student.ctx.close();
	});

	test('a level passed turns the assignment done on both sides, and the tutor reads the progress', async ({ browser }) => {
		// A run of ten with ten right, as the exercises page would have saved it.
		const { error } = await db.from('exercise_sessions').insert({ user_id: studentUser!.id, lesson_path: LESSON, generator_id: 'prime-definizioni', kind: 'level', level: 1, plan: Array(10).fill(1), answered: 10, correct: 10, finished_at: new Date().toISOString() });
		expect(error).toBeNull();
		const day = await db.from('exercise_days').upsert({ user_id: studentUser!.id, day: inDays(0), answered: 10, correct: 10 });
		expect(day.error).toBeNull();

		const student = await signedIn(browser, studentUser!, `/il-mio-tutor/${linkId}/compiti`);
		// The only assignment is done: the list of done ones is open by itself.
		await expect(student.page.locator(`[data-assignment="${LESSON}"]`).getByText('Fatto', { exact: true })).toBeVisible();
		await student.ctx.close();

		const tutor = await signedIn(browser, tutorUser!, `/studenti/${linkId}/compiti`);
		await expect(tutor.page.locator(`[data-assignment="${LESSON}"]`).getByText('Fatto', { exact: true })).toBeVisible();
		await tutor.page.goto(`/studenti/${linkId}/progressi`);
		await expect(tutor.page.locator(`[data-progress-lesson="${LESSON}"]`).getByText(/1 di \d+ livelli/)).toBeVisible();
		await expect(tutor.page.getByText('esercizi fatti')).toBeVisible();
		await tutor.ctx.close();
	});

	test('a late assignment stays in view, and the tutor withdraws one after a confirmation', async ({ browser }) => {
		const LATE = 'high_school/math/insiemi-e-logica/insiemi-rappresentazione';
		// Assigned days ago and never done: only the database can make one that is already late.
		const { error } = await db.from('tutor_assignments').insert({ tutor_student_id: linkId, tutor_id: tutorId, student_id: studentUser!.id, assigned_by: tutorUser!.id, lesson_path: LATE, level: 1, due: inDays(-2) });
		expect(error).toBeNull();

		const student = await signedIn(browser, studentUser!, `/il-mio-tutor/${linkId}`);
		const late = student.page.locator(`[data-assignment="${LATE}"]`);
		await expect(late.getByText('In ritardo')).toBeVisible();
		await expect(late.getByRole('link', { name: 'Fai gli esercizi' })).toBeVisible();
		await student.ctx.close();

		const tutor = await signedIn(browser, tutorUser!, `/studenti/${linkId}/compiti`);
		const card = tutor.page.locator(`[data-assignment="${LATE}"]`);
		await expect(card.getByText('In ritardo')).toBeVisible();
		// A done assignment cannot be withdrawn; a late one can, after a second tap.
		await expect(tutor.page.locator(`[data-assignment="${LESSON}"]`).getByRole('button', { name: /Ritira/ })).toHaveCount(0);
		await card.getByRole('button', { name: /Ritira/ }).click();
		await card.getByRole('button', { name: 'No' }).click();
		await expect(card).toBeVisible();
		await card.getByRole('button', { name: /Ritira/ }).click();
		await card.getByRole('button', { name: 'Sì, ritira' }).click();
		await expect(card).toHaveCount(0);
		await tutor.ctx.close();
		const { data } = await db.from('tutor_assignments').select('status').eq('tutor_student_id', linkId).eq('lesson_path', LATE).single();
		expect(data?.status).toBe('cancelled');
	});

	test('the student stops sharing and the tutor no longer sees progress', async ({ browser }) => {
		const student = await signedIn(browser, studentUser!, `/il-mio-tutor/${linkId}/condivisione`);
		await student.page.getByRole('button', { name: 'Smetti di condividere' }).click();
		await expect(student.page.getByText('Test non vede i tuoi progressi')).toBeVisible();

		const tutor = await signedIn(browser, tutorUser!, `/studenti/${linkId}/progressi`);
		await expect(tutor.page.getByText(`${STUDENT_NAME} non condivide i progressi.`)).toBeVisible();
		await expect(tutor.page.locator('[data-progress-lesson]')).toHaveCount(0);
		await tutor.page.goto(`/studenti/${linkId}/compiti`);
		await expect(tutor.page.locator(`[data-assignment="${LESSON}"]`)).toBeVisible();
		await expect(tutor.page.locator(`[data-assignment="${LESSON}"]`).getByText('Fatto', { exact: true })).toHaveCount(0);
		await tutor.ctx.close();

		await student.page.getByRole('button', { name: 'Condividi i progressi' }).click();
		await expect(student.page.getByText('Test vede i tuoi progressi')).toBeVisible();
		await student.ctx.close();
	});

	test('the student proposes two lessons; the tutor accepts one and declines the other', async ({ browser }) => {
		const student = await signedIn(browser, studentUser!, `/il-mio-tutor/${linkId}/lezioni`);
		for (const [day, note] of [[inDays(6), 'Ripasso prima della verifica'], [inDays(7), 'Proposta da rifiutare']] as const) {
			await student.page.getByRole('button', { name: 'Chiedi una lezione' }).click();
			const dialog = await fillLesson(student.page, day, '17:30', note);
			await dialog.getByRole('button', { name: 'Proponi la lezione' }).click();
			await expect(student.page.locator('[data-lesson]', { hasText: note }).getByText('In attesa del tutor')).toBeVisible();
		}

		const tutor = await signedIn(browser, tutorUser!, '/calendario');
		await expect(tutor.page.getByRole('heading', { name: /Proposte da confermare/ })).toBeVisible();
		await expect(tutor.page.locator('[data-lesson]', { hasText: 'Ripasso prima della verifica' }).getByText('Da confermare')).toBeVisible();
		await tutor.page.locator('[data-lesson]', { hasText: 'Ripasso prima della verifica' }).getByRole('button', { name: 'Accetta' }).click();
		await expect(tutor.page.locator('[data-lesson]', { hasText: 'Ripasso prima della verifica' })).toHaveCount(0);
		await tutor.page.locator('[data-lesson]', { hasText: 'Proposta da rifiutare' }).getByRole('button', { name: 'Rifiuta' }).click();
		await expect(tutor.page.getByRole('heading', { name: /Proposte da confermare/ })).toHaveCount(0);
		await tutor.ctx.close();

		const { data } = await db.from('tutor_lessons').select('note, status, proposed_by, diary_entry_id').eq('tutor_student_id', linkId).eq('proposed_by', 'student').order('starts_at');
		expect(data?.map((l) => [l.note, l.status, !!l.diary_entry_id])).toEqual([
			['Ripasso prima della verifica', 'confirmed', true],
			['Proposta da rifiutare', 'declined', false]
		]);

		await student.page.reload();
		await expect(student.page.locator('[data-lesson]', { hasText: 'Ripasso prima della verifica' }).getByText('Confermata')).toBeVisible();
		await student.page.getByText(/Storico delle lezioni/).click();
		await expect(student.page.locator('[data-lesson]', { hasText: 'Proposta da rifiutare' }).getByText('Non accettata')).toBeVisible();
		await student.ctx.close();
	});

	test('a lesson repeated weekly fills the month, and the series is cancelled together', async ({ browser }) => {
		const { day, count } = firstMondayNextMonth();
		const { ctx, page } = await signedIn(browser, tutorUser!, `/calendario?settimana=${day}`);
		await page.getByRole('button', { name: 'Fissa una lezione' }).click();
		const dialog = await fillLesson(page, day, '15:00', 'Lezione ricorrente di prova');
		await dialog.getByRole('checkbox').check();
		await dialog.getByRole('button', { name: 'Fissa la lezione' }).click();
		await expect(page.locator(`[data-day="${day}"]`).getByText(STUDENT_NAME)).toBeVisible();

		const series = await db.from('tutor_lessons').select('series_id, status, diary_entry_id').eq('tutor_student_id', linkId).eq('note', 'Lezione ricorrente di prova');
		expect(series.data).toHaveLength(count);
		expect(new Set(series.data!.map((l) => l.series_id)).size).toBe(1);
		expect(series.data!.every((l) => l.status === 'confirmed' && l.diary_entry_id)).toBe(true);

		await page.locator(`[data-day="${day}"]`).getByRole('link').click();
		await expect(page).toHaveURL(new RegExp(`/studenti/${linkId}/lezioni$`));
		const first = page.locator('[data-lesson]', { hasText: 'Lezione ricorrente di prova' }).first();
		await first.getByRole('button', { name: 'Annulla la lezione' }).click();
		await first.getByRole('button', { name: 'Questa e le successive' }).click();
		await expect(page.locator('[data-lesson]', { hasText: 'Lezione ricorrente di prova' }).getByText('Confermata')).toHaveCount(0);
		await ctx.close();

		const after = await db.from('tutor_lessons').select('status').eq('tutor_student_id', linkId).eq('note', 'Lezione ricorrente di prova');
		expect(after.data!.every((l) => l.status === 'cancelled')).toBe(true);
		const diary = await db.from('diary_entries').select('id').eq('user_id', studentUser!.id).eq('text', 'Lezione con Test alle 15:00, online');
		expect(diary.data).toHaveLength(0);
	});

	test('tutor and student write to each other', async ({ browser }) => {
		const tutor = await signedIn(browser, tutorUser!, '/messaggi');
		await tutor.page.locator(`[data-conversation="${STUDENT_NAME}"]`).getByRole('link').click();
		await expect(tutor.page).toHaveURL(new RegExp(`/messaggi/${linkId}$`));
		await tutor.page.getByRole('textbox', { name: `Messaggio per ${STUDENT_NAME}` }).fill(TUTOR_MESSAGE);
		await tutor.page.getByRole('button', { name: 'Invia' }).click();
		await expect(tutor.page.getByText(TUTOR_MESSAGE)).toBeVisible();

		const student = await signedIn(browser, studentUser!, `/il-mio-tutor/${linkId}`);
		// The overview shows the new message under "Messaggi"; the conversation is a page of its own.
		await expect(student.page.getByRole('region', { name: 'Messaggi' }).getByText(TUTOR_MESSAGE)).toBeVisible();
		await student.page.getByRole('navigation', { name: 'Sezioni' }).getByRole('link', { name: /Messaggi/ }).click();
		await expect(student.page.getByText(TUTOR_MESSAGE)).toBeVisible();
		await student.page.getByRole('textbox', { name: 'Messaggio per Test' }).fill(STUDENT_MESSAGE);
		await student.page.getByRole('textbox', { name: 'Messaggio per Test' }).press('Enter');
		await expect(student.page.getByText(STUDENT_MESSAGE)).toBeVisible();
		await student.ctx.close();

		await tutor.page.goto('/studenti');
		await expect(tutor.page.locator(`[data-student="${STUDENT_NAME}"]`).getByText('1 messaggio nuovo')).toBeVisible();
		await tutor.page.locator(`[data-student="${STUDENT_NAME}"]`).getByRole('link').click();
		// The folder shows it without marking it read; opening the conversation does.
		await expect(tutor.page.getByText(STUDENT_MESSAGE)).toBeVisible();
		await tutor.page.getByRole('navigation', { name: 'Sezioni della scheda' }).getByRole('link', { name: /Messaggi/ }).click();
		await expect(tutor.page.getByRole('textbox', { name: `Messaggio per ${STUDENT_NAME}` })).toBeVisible();
		await tutor.page.goto('/studenti');
		await expect(tutor.page.locator(`[data-student="${STUDENT_NAME}"]`).getByText('messaggio nuovo')).toHaveCount(0);
		await tutor.ctx.close();
	});

	test('the tutor keeps private notes the student never receives', async ({ browser }) => {
		const tutor = await signedIn(browser, tutorUser!, `/studenti/${linkId}/appunti`);
		await tutor.page.locator('#student-notes').fill(NOTE);
		await tutor.page.getByRole('button', { name: 'Salva gli appunti' }).click();
		await expect(tutor.page.getByText('Salvati')).toBeVisible();
		await tutor.page.reload();
		await expect(tutor.page.locator('#student-notes')).toHaveValue(NOTE);
		await tutor.ctx.close();

		const student = await signedIn(browser, studentUser!, `/il-mio-tutor/${linkId}`);
		expect(await student.page.content()).not.toContain('Appunto privato');
		await student.ctx.close();
	});

	test('free hours and a review show on the public profile', async ({ browser }) => {
		const tutor = await signedIn(browser, tutorUser!, '/profile-editor');
		await tutor.page.getByRole('navigation', { name: 'Sezioni del profilo' }).getByRole('link', { name: 'Orari liberi' }).click();
		await tutor.page.getByRole('button', { name: 'Aggiungi una fascia di lunedì' }).click();
		await tutor.page.getByRole('button', { name: 'Aggiungi una fascia di giovedì' }).click();
		await tutor.page.getByLabel('Giovedì, dalle').fill('09:30');
		await tutor.page.getByLabel('Giovedì, alle').fill('12:00');
		await tutor.page.getByRole('button', { name: 'Salva gli orari' }).click();
		await expect(tutor.page.getByText('Orari salvati.')).toBeVisible();
		await tutor.ctx.close();

		const student = await signedIn(browser, studentUser!, `/il-mio-tutor/${linkId}/condivisione`);
		// The radio itself is visually hidden: its star is the label.
		await student.page.locator('label', { has: student.page.getByRole('radio', { name: /^5 su 5/ }) }).click();
		await expect(student.page.getByRole('radio', { name: /^5 su 5/ })).toBeChecked();
		await student.page.getByRole('textbox', { name: 'Recensione' }).fill(REVIEW);
		await student.page.getByRole('button', { name: 'Pubblica la recensione' }).click();
		await expect(student.page.getByText('Recensione pubblicata. Grazie.')).toBeVisible();

		await student.page.goto(`/ripetizioni/${tutorSlug}`);
		await expect(student.page.getByRole('heading', { name: 'Quando è libero' })).toBeVisible();
		await expect(student.page.getByText('15:00-17:00')).toBeVisible();
		await expect(student.page.getByText('09:30-12:00')).toBeVisible();
		await expect(student.page.getByRole('heading', { name: 'Recensioni' })).toBeVisible();
		await expect(student.page.getByText(REVIEW)).toBeVisible();
		// No name on a review.
		await expect(student.page.getByText('agenda-student')).toHaveCount(0);
		await student.ctx.close();
	});

	test('nobody else reaches the link: not its page, not its messages, not its consent', async ({ browser }) => {
		const { ctx, page } = await signedIn(browser, outsider!, `/studenti/${linkId}`);
		await expect(page.getByText(STUDENT_NAME)).toHaveCount(0);
		const post = (url: string, method: 'post' | 'patch' | 'delete', data: unknown) => page.request[method](url, { data, headers: { Origin: new URL(page.url()).origin } });
		expect((await page.request.get(`/api/tutoring/messages/${linkId}`)).status()).toBe(404);
		expect((await post(`/api/tutoring/messages/${linkId}`, 'post', { body: 'ciao' })).status()).toBe(404);
		expect((await post(`/api/tutoring/messages/${linkId}`, 'post', { as: 'tutor', body: 'ciao' })).status()).toBe(403);
		expect((await post(`/api/tutoring/links/${linkId}`, 'patch', { share: true })).status()).toBe(404);
		expect((await post(`/api/tutoring/links/${linkId}/review`, 'post', { rating: 1 })).status()).toBe(404);
		expect((await post(`/api/tutoring/students/${linkId}`, 'patch', { notes: 'x' })).status()).toBe(403);
		expect((await post('/api/tutoring/lessons', 'post', { linkId, day: inDays(2), time: '10:00', durationMin: 60, mode: 'online' })).status()).toBe(404);
		expect((await post('/api/tutoring/assignments', 'post', { linkId, lessonPath: LESSON, due: inDays(2) })).status()).toBe(403);
		await ctx.close();

		// Signed out: every endpoint asks to sign in.
		const anon = await browser.newContext();
		expect((await anon.request.get(`/api/tutoring/messages/${linkId}`)).status()).toBe(401);
		await anon.close();
	});

	test('an accepted request of the marketplace puts the student in the tutor list', async ({ browser }) => {
		const { error } = await db.from('tutor_requests').insert({ tutor_id: tutorId, student_id: outsider!.id, subject: 'fisica', level: 'high_school', mode: 'online', requester: 'student', contact_name: 'Marco Mercato', contact_phone: '+39 333 222 3333', message: 'Richiesta di prova per il collegamento tra marketplace e agenda.' });
		expect(error).toBeNull();
		const { ctx, page } = await signedIn(browser, tutorUser!, '/leads');
		await page.locator('li', { hasText: 'Richiesta di prova per il collegamento' }).getByRole('button', { name: 'Accetta' }).click();
		await expect(page.getByText('+39 333 222 3333')).toBeVisible();
		await page.goto('/studenti');
		// An active student carries no badge: only "Invitato" and "Interrotto" are marked.
		await expect(page.locator('[data-student="Marco Mercato"]')).toBeVisible();
		await expect(page.locator('[data-student="Marco Mercato"]').getByText('Invitato')).toHaveCount(0);
		await ctx.close();
		const { data } = await db.from('tutor_students').select('origin, status, progress_shared').eq('tutor_id', tutorId).eq('student_id', outsider!.id).single();
		expect(data).toEqual({ origin: 'request', status: 'active', progress_shared: false });
	});

	test('the dashboard counts students, lessons and the hours held', async ({ browser }) => {
		// A lesson held yesterday, ninety minutes.
		const { error } = await db.from('tutor_lessons').insert({ tutor_student_id: linkId, tutor_id: tutorId, starts_at: new Date(Date.now() - 26 * 3_600_000).toISOString(), duration_min: 90, status: 'confirmed', note: 'Lezione di ieri' });
		expect(error).toBeNull();
		const { ctx, page } = await signedIn(browser, tutorUser!, '/dashboard');
		await expect(page.getByText('Profilo: Pubblicato')).toBeVisible();
		const figures = page.getByRole('group', { name: 'In breve' });
		await expect(figures.getByRole('link', { name: /2\s*studenti seguiti/ })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Prossime lezioni' })).toBeVisible();
		await expect(page.getByText('1 lezione fatta, 1,5 h in tutto')).toBeVisible();
		await expect(page.getByRole('list', { name: 'Ore di lezione per mese, ultimi sei mesi' }).getByText('1,5 h')).toBeVisible();
		await page.goto('/studenti');
		await expect(page.locator(`[data-student="${STUDENT_NAME}"]`).getByText('1,5 h di lezione fatte')).toBeVisible();
		await ctx.close();
	});

	test('the tutor area fits a phone without scrolling sideways', async ({ browser }) => {
		const { ctx, page } = await signedIn(browser, tutorUser!, '/dashboard', { width: 390, height: 844 });
		for (const path of ['/dashboard', '/studenti', `/studenti/${linkId}`, `/studenti/${linkId}/compiti`, `/studenti/${linkId}/lezioni`, `/studenti/${linkId}/appunti`, '/messaggi', `/messaggi/${linkId}`, '/calendario', '/profile-editor/orari']) {
			await page.goto(path);
			await expect(page.getByRole('navigation', { name: 'Area tutor' })).toBeVisible();
			expect(await sideways(page), `${path} goes past the right edge`).toEqual([]);
		}
		await ctx.close();
		const student = await signedIn(browser, studentUser!, '/il-mio-tutor', { width: 390, height: 844 });
		for (const tab of ['', '/compiti', '/lezioni', '/messaggi', '/condivisione']) {
			await student.page.goto(`/il-mio-tutor/${linkId}${tab}`);
			await expect(student.page.getByRole('navigation', { name: 'Sezioni' })).toBeVisible();
			expect(await sideways(student.page), `il-mio-tutor${tab} goes past the right edge`).toEqual([]);
		}
		await student.ctx.close();
	});

	test('the student leaves: lessons to come are cancelled and nothing is shared any more', async ({ browser }) => {
		const { ctx, page } = await signedIn(browser, studentUser!, `/il-mio-tutor/${linkId}/condivisione`);
		await page.getByRole('button', { name: 'Interrompi le lezioni con questo tutor' }).click();
		await page.getByRole('button', { name: 'Sì, interrompi' }).click();
		await expect(page.getByRole('heading', { name: 'Nessun tutor ti segue su Sapiens' })).toBeVisible();
		await ctx.close();

		const { data } = await db.from('tutor_students').select('status, progress_shared').eq('id', linkId).single();
		expect(data).toEqual({ status: 'ended', progress_shared: false });
		const lessons = await db.from('tutor_lessons').select('status').eq('tutor_student_id', linkId).gt('starts_at', new Date().toISOString());
		expect(lessons.data!.every((l) => l.status === 'cancelled' || l.status === 'declined')).toBe(true);
		const entries = await db.from('diary_entries').select('id').eq('user_id', studentUser!.id).eq('source', 'tutor').gte('day', inDays(1));
		expect(entries.data).toHaveLength(0);

		const tutor = await signedIn(browser, tutorUser!, `/studenti/${linkId}`);
		await expect(tutor.page.getByText('Interrotto', { exact: true })).toBeVisible();
		await expect(tutor.page.getByRole('button', { name: 'Fissa una lezione' })).toHaveCount(0);
		await tutor.page.goto(`/messaggi/${linkId}`);
		await expect(tutor.page.getByText('Hai interrotto le lezioni con questo studente: non potete più scrivervi.')).toBeVisible();
		await expect(tutor.page.getByRole('textbox', { name: /Messaggio per/ })).toHaveCount(0);
		await tutor.ctx.close();
	});
});

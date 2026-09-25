import 'server-only';
import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from 'node:crypto';
import { configs, SESSION_LENGTH } from '@/lib/exercises/config';
import { romeDate } from '@/lib/stripe/config';
import { generators } from '@/lib/exercises';
import { JUMP_LENGTH, jumpPlan, pathState, skippedBy, type LevelStatus, type Run, type RunKind } from '@/lib/exercises/levels';
import { levelName } from '@/lib/exercises/level-names';
import { REVIEW_LENGTH, REVIEW_WINDOW_DAYS, isOpen, openMistakes, reviewPlan, type AnswerRecord, type ReviewItem } from '@/lib/exercises/review';
import { lessonIndex } from '@/lib/server/lessons';
import { createRng, deriveSeed } from '@/lib/exercises/v2/rng';
import type { ChoiceAnswer, Sample } from '@/lib/exercises/v2/types';
import { renderMath, renderTex } from '@/lib/content/markdown';
import { presentProblem, presentStep } from '@/lib/exercises/present';
import type { SupabaseClient } from '@supabase/supabase-js';
import { adminClient } from '@/lib/server/supabase';

/** A piece of a question, typeset: a paragraph, the question itself as a sentence, a row of givens, a formula on its own. */
export type QuestionBlock = { kind: 'text' | 'ask'; html: string } | { kind: 'givens'; items: string[] } | { kind: 'math'; html: string };

/** One exercise as sent to the browser: typeset, so the client ships no KaTeX, and without the right answer. */
export interface ExerciseView {
	/** The attempt row: the answer is sent back against it. */
	id: string;
	level: number;
	/** The instruction ("Scrivi l'unione per elencazione."), plain HTML; empty when the problem speaks for itself. */
	promptHtml: string;
	blocks: QuestionBlock[];
	/** `text` is the LaTeX, for the column-count guess and the screen reader. */
	options: { html: string; text: string }[];
	/** The verdict, sealed: the page sends it back with the answer and cannot read it. */
	key: string;
}

/** What the server says about an answer: whether it was right, which option was, and how to solve the exercise. */
export interface Verdict {
	correct: boolean;
	correctIndex: number;
	solutionHtml: string;
	stepsHtml: string[];
}

/** A request the service refuses on purpose, with the status to answer with. */
export class ExerciseError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

/** The exercise as stored in `exercise_attempts.exercise`: the generator's sample and the multiple choice shown. */
type Stored = Sample & { choice: ChoiceAnswer };

/** The service-role client: attempts are written only by the server, so a student cannot mark an answer right. */
const db = (): SupabaseClient => adminClient() as unknown as SupabaseClient;

/** Instructions that say nothing the question does not: dropped when the problem asks its own question. */
const GENERIC_PROMPTS = new Set(['Scegli la risposta corretta.']);
/** Instructions the problem already makes plain: an equation on its own is to be solved. */
const IMPLIED_PROMPTS = new Set(["Risolvi l'equazione."]);
/** A short sentence ending in "?" is the question, not context: it is set like one. */
const isAsk = (tex: string) => tex.trim().endsWith('?') && tex.length <= 100;

/** Whether a lesson (by database path) has exercises. */
export const hasExercises = (dbPath: string): boolean => {
	const config = configs[dbPath];
	return !!config && !!generators[config.generator];
};

/**
 * What the answer needs to be checked without reading the database, sealed with AES-256-GCM under a key derived
 * from the service-role key: the page carries it with the exercise and sends it back with the answer, but can
 * neither read the right option nor forge a verdict. The attempt row stays the record; the answer is written to
 * it after the verdict has gone out.
 */
interface Sealed {
	/** Attempt id, and the user it was issued to. */
	id: string;
	user: string;
	correct: number;
	options: number;
	solution: string;
	steps: string[];
}

let sealKey: Buffer | null = null;
const key = () => {
	const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!secret) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
	return (sealKey ??= Buffer.from(hkdfSync('sha256', secret, '', 'sapiens exercise verdict v1', 32)));
};

function seal(data: Sealed): string {
	const iv = randomBytes(12);
	const cipher = createCipheriv('aes-256-gcm', key(), iv);
	const body = Buffer.concat([cipher.update(JSON.stringify(data), 'utf8'), cipher.final()]);
	return Buffer.concat([iv, cipher.getAuthTag(), body]).toString('base64url');
}

/** The sealed verdict, or null when the key was not sealed here or was altered. */
function unseal(token: string): Sealed | null {
	try {
		const raw = Buffer.from(token, 'base64url');
		const decipher = createDecipheriv('aes-256-gcm', key(), raw.subarray(0, 12));
		decipher.setAuthTag(raw.subarray(12, 28));
		return JSON.parse(Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString('utf8')) as Sealed;
	} catch {
		return null;
	}
}

function view(id: string, userId: string, level: number, s: Stored): ExerciseView {
	const blocks = s.problem.trim()
		? presentProblem(s.problem).map((b): QuestionBlock =>
				b.kind === 'text' ? { kind: isAsk(b.tex) ? 'ask' : 'text', html: renderMath(b.tex) } : b.kind === 'givens' ? { kind: 'givens', items: b.items.map((t) => renderTex(t, false)) } : { kind: 'math', html: renderTex(b.tex, true) }
			)
		: [];
	const asks = blocks.some((b) => b.kind === 'ask');
	const prompt = IMPLIED_PROMPTS.has(s.prompt) || (asks && GENERIC_PROMPTS.has(s.prompt)) ? '' : s.prompt;
	return {
		id,
		level,
		promptHtml: prompt ? renderMath(prompt) : '',
		blocks,
		options: s.choice.options.map((o) => ({ html: renderMath(`$$${o.latex}$$`), text: o.latex })),
		key: seal({ id, user: userId, correct: s.choice.correct, options: s.choice.options.length, solution: s.solution, steps: s.steps })
	};
}

/** An answered attempt as read back from the database. */
type AnsweredRow = { id: string; user_id: string; position: number; level: number; correct: boolean; answer: { choice: number }; exercise: Stored };

/** An answered attempt as the page shows it again: the exercise as it was asked, the answer, the verdict. */
function answered(row: AnsweredRow): AnsweredView {
	const s = row.exercise;
	return {
		position: row.position,
		exercise: view(row.id, row.user_id, row.level, s),
		choice: row.answer.choice,
		verdict: { correct: row.correct, correctIndex: s.choice.correct, solutionHtml: renderMath(presentStep(s.solution)), stepsHtml: s.steps.map((step) => renderMath(presentStep(step))) }
	};
}

const verdict = (s: Sealed, correct: boolean): Verdict => ({
	correct,
	correctIndex: s.correct,
	solutionHtml: renderMath(presentStep(s.solution)),
	stepsHtml: s.steps.map((step) => renderMath(presentStep(step)))
});

/**
 * Questions left in today's free session: a Free account answers up to SESSION_LENGTH exercises a day, on any
 * lesson (vault/Decisioni/2026-09-23 Prova al contrario e sessione gratuita giornaliera.md). Read from the day's
 * row in exercise_days, which the database counts in Rome time as answers come in. Shown but unanswered
 * exercises do not count, so the limit never falls in the middle of one.
 */
export async function freeQuestionsLeft(userId: string): Promise<number> {
	const { data, error } = await db().from('exercise_days').select('answered').eq('user_id', userId).eq('day', romeDate()).maybeSingle();
	if (error) throw error;
	return Math.max(0, SESSION_LENGTH - ((data as { answered: number } | null)?.answered ?? 0));
}

/** Every kind of run: at a level or a jump test on a lesson's path, the daily practice, a review of mistakes. */
export type SessionKind = RunKind | 'practice' | 'review';

/** A question of a run that crosses lessons, as the page names it above the question. */
export interface ItemView {
	lessonTitleHtml: string;
	level: number;
	levelName: string | null;
}

/** A run as the page knows it: enough to ask its questions and to tell the result at the end. */
export interface SessionView {
	id: string;
	kind: SessionKind;
	level: number;
	length: number;
	/** For practice and reviews: the lesson and level of each question. */
	items?: ItemView[];
}

/** One level of the path as the page draws it. */
export interface PathLevel {
	level: number;
	name: string | null;
	status: LevelStatus;
	skipped: boolean;
	/** The last finished runs, newest first: right answers, questions, when. */
	runs: { correct: number; total: number; at: string }[];
	best: { correct: number; total: number } | null;
}

/** A run left halfway, to take up again: the run, and how each of its questions went. */
export interface UnfinishedRun {
	session: SessionView;
	progress: ('unanswered' | 'correct' | 'incorrect')[];
	/** The first question without an answer: where the run starts again. */
	next: number;
	/** The questions already answered wrong, for the summary at the end. */
	mistakes: AnsweredView[];
}

/** A question already answered: what was asked, the answer picked, and the verdict with the solution. */
export interface AnsweredView {
	position: number;
	exercise: ExerciseView;
	choice: number;
	verdict: Verdict;
}

export interface PathView {
	levels: PathLevel[];
	/** The level the path suggests: the first not passed. */
	current: number;
	/** The newest run on this lesson, when it was left halfway less than RESUME_DAYS ago. */
	unfinished: UnfinishedRun | null;
}

/** How long a run left halfway can be taken up again. Older ones stay in the history, not on the path. */
const RESUME_DAYS = 3;

/**
 * The run to take up again: the newest on the lesson, if it is not finished and not older than RESUME_DAYS. Only
 * the newest, so a run given up for a newer one is not offered back. Reads its attempts to know which questions
 * are done: one query, only when there is such a run.
 */
async function unfinishedRun(latest: RunRow | undefined): Promise<UnfinishedRun | null> {
	if (!latest || latest.answered >= latest.plan.length) return null;
	if (Date.now() - Date.parse(latest.started_at) > RESUME_DAYS * 86_400_000) return null;
	const { data, error } = await db().from('exercise_attempts').select('id, user_id, position, level, correct, answer, exercise').eq('session_id', latest.id).not('answered_at', 'is', null);
	if (error) throw error;
	const rows = (data ?? []) as AnsweredRow[];
	const progress = latest.plan.map((): UnfinishedRun['progress'][number] => 'unanswered');
	for (const a of rows) if (a.position < progress.length) progress[a.position] = a.correct ? 'correct' : 'incorrect';
	const next = progress.indexOf('unanswered');
	if (next < 0) return null;
	return {
		session: { id: latest.id, kind: latest.kind, level: latest.level, length: latest.plan.length },
		progress,
		next,
		mistakes: rows.filter((a) => !a.correct).map(answered)
	};
}

/** Runs shown under a level. */
const RUNS_SHOWN = 5;

type RunRow = { id: string; kind: RunKind; level: number; plan: number[]; answered: number; correct: number; started_at: string };

/** A run's row as the path reads it. */
const toRun = (r: RunRow): Run => ({ kind: r.kind, level: r.level, total: r.plan.length, answered: r.answered, correct: r.correct, at: r.started_at });

/**
 * The student's runs on a generator's path, with the counts the database keeps as answers come in. Only runs at a
 * level and jump tests: practice and reviews train, but never pass or open a level.
 */
async function runRows(userId: string, generatorId: string): Promise<RunRow[]> {
	const { data, error } = await db()
		.from('exercise_sessions')
		.select('id, kind, level, plan, answered, correct, started_at')
		.eq('user_id', userId)
		.eq('generator_id', generatorId)
		.in('kind', ['level', 'jump'])
		.order('started_at', { ascending: false })
		.limit(200);
	if (error) throw error;
	return (data ?? []) as RunRow[];
}

const runs = async (userId: string, generatorId: string): Promise<Run[]> => (await runRows(userId, generatorId)).map(toRun);

/** The path of a lesson for a student; without one (a visitor), the path of somebody who has not started. */
export async function lessonPath(userId: string | null, dbPath: string): Promise<PathView> {
	const config = configs[dbPath];
	if (!config) throw new ExerciseError(404, 'Esercizi non trovati.');
	const rows = userId ? await runRows(userId, config.generator) : [];
	const { states, current } = pathState(config.levels, rows.map(toRun));
	return {
		current,
		unfinished: await unfinishedRun(rows[0]),
		levels: states.map((s) => ({
			level: s.level,
			name: levelName(config.generator, s.level),
			status: s.status,
			skipped: s.skipped,
			runs: s.runs.slice(0, RUNS_SHOWN).map((r) => ({ correct: r.correct, total: r.total, at: r.at })),
			best: s.best && { correct: s.best.correct, total: s.best.total }
		}))
	};
}

/** Writes the exercise at `position` of a run; the same place asked twice returns the row written first. */
async function issueAt(userId: string, dbPath: string, generatorId: string, sessionId: string, position: number, level: number): Promise<ExerciseView> {
	const load = generators[generatorId];
	if (!load) throw new ExerciseError(404, 'Esercizi non trovati.');
	const generator = await load();
	const seed = crypto.getRandomValues(new Uint32Array(1))[0];
	const sample = generator.generate(createRng(seed), level);
	// Exercises born as multiple choice (true or false, pick the right set) are their own choice.
	const choice = sample.answer.kind === 'choice' ? sample.answer : generator.toChoice?.(sample, createRng(deriveSeed(seed, level)));
	if (!choice) throw new Error(`${generatorId}: level ${level} has no multiple-choice form`);
	const exercise: Stored = { ...sample, choice };

	const { data, error } = await db()
		.from('exercise_attempts')
		.insert({ user_id: userId, lesson_path: dbPath, generator_id: generatorId, level, seed, mode: 'choice', exercise, session_id: sessionId, position, build: process.env.VERCEL_GIT_COMMIT_SHA ?? null })
		.select('id')
		.single();
	if (!error) return view((data as { id: string }).id, userId, level, exercise);
	// 23505: this place of the run already has its exercise (a retry, or a prefetch fired twice).
	if (error.code !== '23505') throw error;
	const { data: first, error: readError } = await db().from('exercise_attempts').select('id, level, exercise').eq('session_id', sessionId).eq('position', position).single();
	if (readError) throw readError;
	const row = first as { id: string; level: number; exercise: Stored };
	return view(row.id, userId, row.level, row.exercise);
}

/**
 * Starts a run on a lesson and sends its first exercise. `level` is a run at an open level, `jump` a jump test
 * to a locked one. `limited` is a Free account: a run takes what is left of today's free session, and a jump
 * test needs all its questions.
 */
export async function startSession(userId: string, dbPath: string, kind: RunKind, level: number, limited = false): Promise<{ session: SessionView; exercise: ExerciseView }> {
	const config = configs[dbPath];
	if (!config || !generators[config.generator]) throw new ExerciseError(404, 'Esercizi non trovati.');
	if (!config.levels.includes(level)) throw new ExerciseError(400, 'Livello non valido.');
	const [past, left] = await Promise.all([runs(userId, config.generator), limited ? freeQuestionsLeft(userId) : Promise.resolve(SESSION_LENGTH)]);
	if (left === 0) throw new ExerciseError(403, FREE_SESSION_USED);

	const { states } = pathState(config.levels, past);
	let plan: number[];
	if (kind === 'level') {
		if (states.find((s) => s.level === level)?.status === 'locked') throw new ExerciseError(403, 'Questo livello si apre superando quello prima, o con la prova di salto.');
		plan = Array(Math.min(SESSION_LENGTH, left)).fill(level);
	} else {
		const skipped = skippedBy(states, level);
		if (skipped.length === 0) throw new ExerciseError(400, 'Questo livello è già aperto.');
		if (left < JUMP_LENGTH) throw new ExerciseError(403, `La prova di salto ha ${JUMP_LENGTH} domande e oggi te ne restano ${left}. Domani hai una sessione intera, oppure passa a Studio.`);
		plan = jumpPlan(skipped);
	}

	const { data, error } = await db().from('exercise_sessions').insert({ user_id: userId, lesson_path: dbPath, generator_id: config.generator, kind, level, plan }).select('id').single();
	if (error) throw error;
	const id = (data as { id: string }).id;
	const exercise = await issueAt(userId, dbPath, config.generator, id, 0, plan[0]);
	return { session: { id, kind, level, length: plan.length }, exercise };
}

/**
 * The exercise at `position` of a run. The page asks for it while the student is on the one before, so it is
 * ready when they move on. For a Free account (`limited`), only while today's free session has answers left.
 */
export async function sessionExercise(userId: string, sessionId: string, position: number, limited = false): Promise<ExerciseView> {
	const [{ data, error }, left] = await Promise.all([
		db().from('exercise_sessions').select('lesson_path, generator_id, plan, plan_lessons, plan_generators').eq('id', sessionId).eq('user_id', userId).maybeSingle(),
		limited ? freeQuestionsLeft(userId) : Promise.resolve(SESSION_LENGTH)
	]);
	if (error) throw error;
	if (!data) throw new ExerciseError(404, 'Prova non trovata.');
	const run = data as PlanRow;
	if (position >= run.plan.length) throw new ExerciseError(400, 'La prova è finita.');
	if (left === 0) throw new ExerciseError(403, FREE_SESSION_USED);
	const item = itemAt(run, position);
	return issueAt(userId, item.lesson, item.generator, sessionId, position, item.level);
}

/** The plan of a run as stored: one lesson and generator for a run on a path, one per question for the others. */
type PlanRow = { lesson_path: string | null; generator_id: string | null; plan: number[]; plan_lessons: string[] | null; plan_generators: string[] | null };

/** The lesson, generator and level of the question at `position`. */
function itemAt(run: PlanRow, position: number): ReviewItem {
	const lesson = run.plan_lessons?.[position] ?? run.lesson_path;
	const generator = run.plan_generators?.[position] ?? run.generator_id;
	if (!lesson || !generator) throw new Error(`run without lesson at position ${position}`);
	return { lesson, generator, level: run.plan[position] };
}

const FREE_SESSION_USED = "Hai fatto la sessione gratuita di oggi. Domani ne hai un'altra, oppure passa a Studio.";

/** The student's answers of the last REVIEW_WINDOW_DAYS, newest first: enough to know the mistakes still open. */
async function recentAnswers(userId: string): Promise<AnswerRecord[]> {
	const { data, error } = await db()
		.from('exercise_attempts')
		.select('lesson_path, generator_id, level, correct, answered_at, session_id')
		.eq('user_id', userId)
		.gte('answered_at', new Date(Date.now() - REVIEW_WINDOW_DAYS * 86_400_000).toISOString())
		.order('answered_at', { ascending: false })
		.limit(2000);
	if (error) throw error;
	return ((data ?? []) as { lesson_path: string; generator_id: string; level: number; correct: boolean; answered_at: string; session_id: string | null }[]).map((r) => ({ lesson: r.lesson_path, generator: r.generator_id, level: r.level, correct: r.correct, at: r.answered_at, run: r.session_id }));
}

/** How the page names the questions of a run across lessons. */
async function itemViews(items: ReviewItem[]): Promise<ItemView[]> {
	const index = await lessonIndex();
	return items.map((i) => ({ lessonTitleHtml: index.get(i.lesson)?.titleHtml ?? '', level: i.level, levelName: levelName(i.generator, i.level) }));
}

/** Writes a run that crosses lessons and sends its first exercise. */
async function startMixed(userId: string, kind: 'practice' | 'review', items: ReviewItem[]): Promise<{ session: SessionView; exercise: ExerciseView }> {
	const { data, error } = await db()
		.from('exercise_sessions')
		.insert({ user_id: userId, kind, level: items[0].level, plan: items.map((i) => i.level), plan_lessons: items.map((i) => i.lesson), plan_generators: items.map((i) => i.generator) })
		.select('id')
		.single();
	if (error) throw error;
	const id = (data as { id: string }).id;
	const [exercise, views] = await Promise.all([issueAt(userId, items[0].lesson, items[0].generator, id, 0, items[0].level), itemViews(items)]);
	return { session: { id, kind, level: items[0].level, length: items.length, items: views }, exercise };
}

/**
 * Starts a review: new exercises at the levels where the student erred, never the ones answered wrong. From a run
 * (`from`), the levels it got wrong; otherwise the mistakes still open across all lessons. For a Free account
 * (`limited`) as many questions as today's free session has left.
 */
export async function startReview(userId: string, from: string | null, limited = false): Promise<{ session: SessionView; exercise: ExerciseView }> {
	const left = limited ? await freeQuestionsLeft(userId) : REVIEW_LENGTH;
	if (left === 0) throw new ExerciseError(403, FREE_SESSION_USED);
	const length = Math.min(REVIEW_LENGTH, left);
	let slots: { lesson: string; generator: string; level: number }[];
	if (from) {
		const { data, error } = await db().from('exercise_attempts').select('lesson_path, generator_id, level, answered_at').eq('session_id', from).eq('user_id', userId).eq('correct', false).order('answered_at', { ascending: false });
		if (error) throw error;
		// Each level once, the newest mistake first.
		const bySlot = new Map<string, { lesson: string; generator: string; level: number }>();
		for (const r of (data ?? []) as { lesson_path: string; generator_id: string; level: number }[]) {
			const key = `${r.generator_id}#${r.level}`;
			if (configs[r.lesson_path] && !bySlot.has(key)) bySlot.set(key, { lesson: r.lesson_path, generator: r.generator_id, level: r.level });
		}
		slots = [...bySlot.values()];
	} else {
		slots = openMistakes(await recentAnswers(userId)).filter((s) => configs[s.lesson]);
	}
	const items = reviewPlan(slots, length);
	if (items.length === 0) throw new ExerciseError(400, 'Non hai errori da rifare.');
	return startMixed(userId, 'review', items);
}

/** A mistake as the list of mistakes shows it: the answer as it was given, where, when, and whether it is still to redo. */
export interface MistakeView extends AnsweredView {
	lesson: { titleHtml: string; url: string } | null;
	levelName: string | null;
	at: string;
	/** Still to redo, or redone; null past REVIEW_WINDOW_DAYS, when it is neither. */
	open: boolean | null;
}

/** Mistakes shown per page of the list. */
export const MISTAKES_PAGE = 20;

/**
 * The student's mistakes, newest first, a page at a time, with how many are still open to redo. Reading them costs
 * nothing: they are the exercises as they were asked, from the attempts.
 */
export async function mistakes(userId: string, page = 0): Promise<{ items: MistakeView[]; more: boolean; open: number }> {
	const [{ data, error }, recent, index] = await Promise.all([
		db()
			.from('exercise_attempts')
			.select('id, user_id, position, lesson_path, generator_id, level, correct, answer, exercise, answered_at')
			.eq('user_id', userId)
			.eq('correct', false)
			.order('answered_at', { ascending: false })
			.range(page * MISTAKES_PAGE, page * MISTAKES_PAGE + MISTAKES_PAGE),
		recentAnswers(userId),
		lessonIndex()
	]);
	if (error) throw error;
	const slots = openMistakes(recent).filter((s) => configs[s.lesson]);
	const rows = (data ?? []) as (AnsweredRow & { lesson_path: string; generator_id: string; answered_at: string })[];
	return {
		more: rows.length > MISTAKES_PAGE,
		open: slots.length,
		items: rows.slice(0, MISTAKES_PAGE).map((r) => {
			const lesson = index.get(r.lesson_path);
			return {
				...answered(r),
				lesson: lesson ? { titleHtml: lesson.titleHtml, url: lesson.exercisesUrl } : null,
				levelName: levelName(r.generator_id, r.level),
				at: r.answered_at,
				open: Date.parse(r.answered_at) < Date.now() - REVIEW_WINDOW_DAYS * 86_400_000 ? null : isOpen(slots, r.generator_id, r.level)
			};
		})
	};
}

/** Mistakes still open to redo, for the pages that offer a review. */
export async function openMistakeCount(userId: string): Promise<number> {
	return openMistakes(await recentAnswers(userId)).filter((s) => configs[s.lesson]).length;
}

/**
 * Checks a multiple-choice answer from the sealed verdict the page sent back: no session lookup and no database
 * read, so the verdict is back in the time of one request. `save` records the answer on the attempt; the route
 * runs it after responding. The attempt must belong to the user it was issued to and be unanswered, so a retried
 * request keeps the first answer.
 */
export function answerExercise(id: string, sealed: string, choice: number, activeMs: number | null): { verdict: Verdict; save: () => Promise<void> } {
	const s = unseal(sealed);
	if (!s || s.id !== id) throw new ExerciseError(404, 'Esercizio non trovato.');
	if (choice >= s.options) throw new ExerciseError(400, 'Risposta non valida.');
	const correct = choice === s.correct;
	return {
		verdict: verdict(s, correct),
		save: async () => {
			const { error } = await db()
				.from('exercise_attempts')
				.update({ answer: { choice }, correct, answered_at: new Date().toISOString(), active_ms: activeMs })
				.eq('id', id)
				.eq('user_id', s.user)
				.is('answered_at', null);
			if (error) throw error;
		}
	};
}

/** How far a student has got on a lesson's path: levels passed, out of the levels it offers. */
export interface LessonProgress {
	passed: number;
	total: number;
}

/**
 * The student's progress on every lesson they have started, by database path, for the badges on the pages of the
 * material: one query over their runs at a level and jump tests, each lesson's path worked out with pathState as on
 * the lesson itself. Lessons without runs are left out.
 */
export async function lessonProgress(userId: string): Promise<Record<string, LessonProgress>> {
	const { data, error } = await db()
		.from('exercise_sessions')
		.select('generator_id, kind, level, plan, answered, correct, started_at')
		.eq('user_id', userId)
		.in('kind', ['level', 'jump'])
		.order('started_at', { ascending: false })
		.limit(5000);
	if (error) throw error;
	const byGenerator = new Map<string, Run[]>();
	for (const r of (data ?? []) as (Omit<RunRow, 'id'> & { generator_id: string })[]) {
		byGenerator.set(r.generator_id, [...(byGenerator.get(r.generator_id) ?? []), toRun({ ...r, id: '' })]);
	}
	const progress: Record<string, LessonProgress> = {};
	for (const [path, config] of Object.entries(configs)) {
		const past = byGenerator.get(config.generator);
		if (!past) continue;
		const { states } = pathState(config.levels, past);
		progress[path] = { passed: states.filter((st) => st.status === 'passed').length, total: config.levels.length };
	}
	return progress;
}

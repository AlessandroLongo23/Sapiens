import 'server-only';
import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from 'node:crypto';
import { configs, SESSION_LENGTH } from '@/lib/exercises/config';
import { romeDate } from '@/lib/stripe/config';
import { generators } from '@/lib/exercises';
import { JUMP_LENGTH, jumpPlan, pathState, skippedBy, type LevelStatus, type Run, type RunKind } from '@/lib/exercises/levels';
import { levelName } from '@/lib/exercises/level-names';
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

const verdict = (s: Sealed, correct: boolean): Verdict => ({
	correct,
	correctIndex: s.correct,
	solutionHtml: renderMath(presentStep(s.solution)),
	stepsHtml: s.steps.map((step) => renderMath(presentStep(step)))
});

/**
 * Midnight in Rome today, as an instant. Uses the offset in force now, so on the two nights the clocks change
 * the day starts an hour early or late: a free session one hour longer or shorter, twice a year.
 */
function romeMidnight(now: Date = new Date()): string {
	const zone = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Rome', timeZoneName: 'shortOffset' }).formatToParts(now).find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+1';
	const hours = Number(/GMT([+-]\d+)/.exec(zone)?.[1] ?? 0);
	return new Date(Date.parse(`${romeDate(now)}T00:00:00Z`) - hours * 3_600_000).toISOString();
}

/**
 * Questions left in today's free session: a Free account answers up to SESSION_LENGTH exercises a day, on any
 * lesson (vault/Decisioni/2026-09-23 Prova al contrario e sessione gratuita giornaliera.md). Shown but unanswered
 * exercises do not count, so the limit never falls in the middle of one.
 */
export async function freeQuestionsLeft(userId: string): Promise<number> {
	const { count, error } = await db()
		.from('exercise_attempts')
		.select('id', { count: 'exact', head: true })
		.eq('user_id', userId)
		.gte('answered_at', romeMidnight());
	if (error) throw error;
	return Math.max(0, SESSION_LENGTH - (count ?? 0));
}


/** A run as the page knows it: enough to ask its questions and to tell the result at the end. */
export interface SessionView {
	id: string;
	kind: RunKind;
	level: number;
	length: number;
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

export interface PathView {
	levels: PathLevel[];
	/** The level the path suggests: the first not passed. */
	current: number;
}

/** Runs shown under a level. */
const RUNS_SHOWN = 5;

type RunRow = { kind: RunKind; level: number; plan: number[]; started_at: string; exercise_attempts: { correct: boolean | null }[] };

/** The student's runs on a generator, with their result from the attempts. */
async function runs(userId: string, generatorId: string): Promise<Run[]> {
	const { data, error } = await db()
		.from('exercise_sessions')
		.select('kind, level, plan, started_at, exercise_attempts(correct)')
		.eq('user_id', userId)
		.eq('generator_id', generatorId)
		.order('started_at', { ascending: false })
		.limit(200);
	if (error) throw error;
	return ((data ?? []) as RunRow[]).map((r) => ({
		kind: r.kind,
		level: r.level,
		total: r.plan.length,
		answered: r.exercise_attempts.filter((a) => a.correct !== null).length,
		correct: r.exercise_attempts.filter((a) => a.correct === true).length,
		at: r.started_at
	}));
}

/** The path of a lesson for a student; without one (a visitor), the path of somebody who has not started. */
export async function lessonPath(userId: string | null, dbPath: string): Promise<PathView> {
	const config = configs[dbPath];
	if (!config) throw new ExerciseError(404, 'Esercizi non trovati.');
	const { states, current } = pathState(config.levels, userId ? await runs(userId, config.generator) : []);
	return {
		current,
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
	if (left === 0) throw new ExerciseError(403, "Hai fatto la sessione gratuita di oggi. Domani ne hai un'altra, oppure passa a Studio.");

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
		db().from('exercise_sessions').select('lesson_path, generator_id, plan').eq('id', sessionId).eq('user_id', userId).maybeSingle(),
		limited ? freeQuestionsLeft(userId) : Promise.resolve(SESSION_LENGTH)
	]);
	if (error) throw error;
	if (!data) throw new ExerciseError(404, 'Prova non trovata.');
	const run = data as { lesson_path: string; generator_id: string; plan: number[] };
	if (position >= run.plan.length) throw new ExerciseError(400, 'La prova è finita.');
	if (left === 0) throw new ExerciseError(403, "Hai fatto la sessione gratuita di oggi. Domani ne hai un'altra, oppure passa a Studio.");
	return issueAt(userId, run.lesson_path, run.generator_id, sessionId, position, run.plan[position]);
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

import 'server-only';
import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from 'node:crypto';
import { configs, SESSION_LENGTH } from '@/lib/exercises/config';
import { romeDate } from '@/lib/stripe/config';
import { generators } from '@/lib/exercises';
import { JUMP_LENGTH, REPETITION_LENGTH, jumpPlan, nextStep, pathState, repetitionModes, runPassed, skippedBy, type LevelStatus, type QuestionMode, type Run, type RunKind } from '@/lib/exercises/levels';
import { levelName } from '@/lib/exercises/level-names';
import { REVIEW_LENGTH, REVIEW_WINDOW_DAYS, isOpen, openMistakes, reviewPlan, type AnswerRecord, type ReviewItem } from '@/lib/exercises/review';
import { lessonIndex } from '@/lib/server/lessons';
import { PRACTICE_LENGTH, practicePlan, practiceSeed, type StartedLesson } from '@/lib/exercises/practice';
import { STREAK_MIN_ANSWERS, previousDay, streakOf, type Streak } from '@/lib/exercises/streak';
import { createRng, deriveSeed } from '@/lib/exercises/v2/rng';
import type { Answer, ChartAnswer, ChoiceAnswer, CodeText, FigureRef, Generator, OpenGrading, ProgramAnswer, Sample, SceneRef } from '@/lib/exercises/v2/types';
import { openGrading } from '@/lib/exercises/v2/open-answers';
import { drawnScene, sceneOptionHtml } from '@/lib/exercises/v2/piano-svg';
import { chartConstructs, codeConstructs, missing, missingMessage, neededText } from '@/lib/exercises/v2/costrutti';
import { figureUrl } from '@/lib/content/figures';
import { escapeHtml } from '@/lib/utils/escape';
import { renderMath, renderTex } from '@/lib/content/markdown';
import { presentProblem, presentStep } from '@/lib/exercises/present';
import { tidy } from '@/lib/codice/blocco';
import { parseProgram } from '@/lib/diagramma/blocco';
import { buildChart, chartSvg } from '@/lib/diagramma/disegno';
import { runAll } from '@/lib/diagramma/esecuzione';
import type { SupabaseClient } from '@supabase/supabase-js';
import { adminClient } from '@/lib/server/supabase';

/** A piece of a question, typeset: a paragraph, the question itself as a sentence, a row of givens, a formula on its own. */
export type QuestionBlock =
	| { kind: 'text' | 'ask'; html: string }
	| { kind: 'givens'; items: string[] }
	| { kind: 'math'; html: string }
	| { kind: 'figure'; html: string }
	/** A program, in the two languages of the lessons: the page shows the one the student has chosen. */
	| { kind: 'code'; html: string }
	| { kind: 'scene'; scene: SceneRef };

/**
 * What an open question asks the student to make, when it is not a formula: a flowchart, from `start`, or a
 * program, from `start` in the language chosen. `inputs` are what each test gives the program to read: the page runs
 * the program on them and sends back what it printed, which only the server can tell from what was expected.
 */
export type BuildView = { kind: 'chart'; start: string; code: boolean } | { kind: 'program'; start: CodeText; inputs: string[]; needs?: string };

/** What a student hands in for a `BuildView`: the chart as the lines of its program, or the program and what it printed for each test. */
export type BuildResponse = { chart: string } | { language: 'python' | 'cpp'; code: string; outputs: { output: string; error?: string }[] };

/** One exercise as sent to the browser: typeset, so the client ships no KaTeX, and without the right answer. */
export interface ExerciseView {
	/** The attempt row: the answer is sent back against it. */
	id: string;
	level: number;
	/** The instruction ("Scrivi l'unione per elencazione."), plain HTML; empty when the problem speaks for itself. */
	promptHtml: string;
	blocks: QuestionBlock[];
	/** Multiple choice, or an open answer written in a formula field: `options` is then empty. */
	mode: QuestionMode;
	/** `text` is the LaTeX (or the plain label), for the column-count guess and the screen reader; `figure` marks a drawing. */
	options: { html: string; text: string; figure?: true; /** A graph: the answers are four small planes, two by two. */ scene?: true }[];
	/** An open question answered with a flowchart or a program, not with a formula. */
	build?: BuildView;
	/** The verdict, sealed: the page sends it back with the answer and cannot read it. */
	key: string;
}

/** What the server says about an answer: whether it was right, which option was, and how to solve the exercise. */
export interface Verdict {
	correct: boolean;
	/** The right option; -1 for an open answer. */
	correctIndex: number;
	/** An open answer: the right one, and the one the student wrote, typeset. */
	expectedHtml?: string;
	answerHtml?: string;
	/** The open answer was a flowchart or a program: `expectedHtml` and `answerHtml` are drawings, not formulas. */
	built?: true;
	/** An open answer: what the student reads about the form, or that a fraction could be reduced. */
	message?: string;
	solutionHtml: string;
	stepsHtml: string[];
	/** A drawing that goes with the solution, as an `<img>`. */
	figureHtml?: string;
	/** A drawing made from the exercise's data that goes with the solution. */
	scene?: SceneRef;
}

/** A request the service refuses on purpose, with the status to answer with. */
export class ExerciseError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

/**
 * The exercise as stored in `exercise_attempts.exercise`: the generator's sample, the multiple choice, and how it
 * was asked. An open question keeps its multiple choice too, unused.
 */
type Stored = Sample & { choice: ChoiceAnswer; mode?: QuestionMode };

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
	/** The sample's `format` and solution drawing: a reference, never the drawing itself. */
	format?: 'text';
	figure?: FigureRef;
	scene?: SceneRef;
	/** A flowchart or a program that goes with the solution. */
	drawn?: { chart?: string; code?: CodeText };
	/** An open question: what the grader needs, and the right answer to show. */
	open?: { answer: Answer; grading: OpenGrading; prompt: string; problem: string; expected: string };
	/** An open question answered with a flowchart or a program: its tests and a solution to show. */
	run?: ChartAnswer | ProgramAnswer;
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

/**
 * A compiled drawing as an `<img>` from the `figure` bucket. The drawings are made for a light page: in the dark
 * theme they are inverted and the hue turned back, as the lesson figures are (globals.css, .tikz-container).
 */
function figureHtml(ref: FigureRef): string {
	const supabase = process.env.PUBLIC_SUPABASE_URL ?? '';
	const width = Math.round(ref.width * FIGURE_SCALE);
	const height = Math.round(ref.height * FIGURE_SCALE);
	return `<img src="${figureUrl(supabase, ref.file)}" alt="${escapeHtml(ref.alt)}" width="${width}" height="${height}" class="mx-auto h-auto max-w-full dark:invert dark:hue-rotate-180" loading="lazy" decoding="async">`;
}
/** Molecules are drawn at screen size, a little small next to the answers' text. */
const FIGURE_SCALE = 1.3;

/**
 * A flowchart of an exercise, drawn as in the lessons (lib/diagramma/disegno.ts) from the lines of its program. A
 * chart that cannot be read is a mistake of its generator: the lines are shown as they are.
 */
export function chartHtml(source: string, alt = 'Diagramma di flusso'): string {
	const { program, errors } = parseProgram(source, true);
	if (errors.length) return `<pre class="code-block">${escapeHtml(source)}</pre>`;
	// centred when it fits; when it is wider than its place it starts from its left edge and scrolls, with nothing cut off
	return `<div class="chart-figure max-w-full overflow-x-auto"><div class="mx-auto w-max">${chartSvg(buildChart(program), alt)}</div></div>`;
}

/**
 * A program of an exercise in the two languages, one beside the other in the markup: the page shows the one the
 * student has chosen (`data-code-language` on a box around it, see globals.css).
 */
export function codeHtml(code: CodeText): string {
	const one = (language: 'python' | 'cpp') => `<pre class="code-block" data-language="${language}"><code>${escapeHtml(code[language].replace(/\n+$/, ''))}</code></pre>`;
	return `<div class="code-pair">${one('python')}${one('cpp')}</div>`;
}

/**
 * A text of more lines (pseudocode, what a program prints line by line) keeps its lines and their indentation, set
 * as code is; null for a text of one line, which is prose.
 */
export const listingHtml = (text: string): string | null => (text.includes('\n') ? `<pre class="code-block">${escapeHtml(text.replace(/\n+$/, ''))}</pre>` : null);

/** The lessons before the programming languages: a chart built there has no program in Python and C++ beside it. */
const BEFORE_LANGUAGES = new Set(['algoritmi', 'inf-problema-algoritmo', 'inf-pseudocodice', 'inf-bohm-jacopini', 'scratch']);

/** What a student handed in for a flowchart or a program, as the page shows it back. */
const builtHtml = (built: BuildResponse): string => ('chart' in built ? chartHtml(built.chart, 'Il tuo diagramma') : `<pre class="code-block"><code>${escapeHtml(built.code.replace(/\n+$/, ''))}</code></pre>`);

/** A solution of a flowchart or of a program to show after the answer. */
const solvedHtml = (answer: ChartAnswer | ProgramAnswer): string => (answer.kind === 'chart' ? chartHtml(answer.solution, 'Un diagramma che risolve l’esercizio') : codeHtml(answer.solution));

const sameLines = (a: string, b: string) => tidy(a) === tidy(b);

/**
 * Grades a flowchart or a program on the tests of the sample. A chart is run here, with the interpreter of the
 * lessons; a program was run in the student's browser on the inputs sent with the question, and what it printed is
 * compared here with what was expected, which the browser never had. An answer that writes the right things is then
 * read for the constructs the level asks for (v2/costrutti.ts).
 */
function gradeBuild(answer: ChartAnswer | ProgramAnswer, built: BuildResponse): { correct: boolean; message?: string } {
	if (answer.kind === 'chart') {
		if (!('chart' in built)) throw new ExerciseError(400, 'Risposta non valida.');
		const { program, errors } = parseProgram(built.chart, true);
		if (errors.length) throw new ExerciseError(400, 'Risposta non valida.');
		if (!program.length) return { correct: false, message: 'Il diagramma è vuoto.' };
		const chart = buildChart(program);
		for (const test of answer.tests) {
			const run = runAll(chart, test.inputs);
			const given = test.inputs.length ? `Con ${test.inputs.join(', ')} in ingresso` : 'Eseguito';
			if (run.error) return { correct: false, message: `${given} il diagramma si ferma: ${run.error}.` };
			if (!sameLines(run.output.join('\n'), test.output.join('\n'))) return { correct: false, message: `${given} il diagramma scrive ${run.output.length ? `«${run.output.join(', ')}»` : 'niente'}, e doveva scrivere «${test.output.join(', ')}».` };
		}
		const lacks = missing(answer.needs, chartConstructs(program));
		return lacks ? { correct: false, message: missingMessage(lacks, 'chart') } : { correct: true };
	}
	if (!('outputs' in built) || built.outputs.length !== answer.tests.length) throw new ExerciseError(400, 'Risposta non valida.');
	for (const [i, test] of answer.tests.entries()) {
		const got = built.outputs[i];
		const given = test.input.trim() ? `Con ${test.input.trim().split('\n').join(', ')} in ingresso` : 'Eseguito';
		if (got.error) return { correct: false, message: `${given} il programma non arriva in fondo: ${got.error.slice(0, 300)}` };
		if (!sameLines(got.output, test.output)) return { correct: false, message: `${given} il programma scrive ${got.output.trim() ? `«${tidy(got.output).trim().split('\n').join(', ')}»` : 'niente'}, e doveva scrivere «${tidy(test.output).trim().split('\n').join(', ')}».` };
	}
	const lacks = missing(answer.needs, codeConstructs(built.code, built.language));
	return lacks ? { correct: false, message: missingMessage(lacks, 'program') } : { correct: true };
}

/** Prose with inline `$…$`, for a sample written as text: the prose is escaped, the formulas typeset. */
const textHtml = (text: string) =>
	text
		.split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g)
		.map((part, i) => (i % 2 ? renderMath(part) : escapeHtml(part)))
		.join('');

function view(id: string, userId: string, level: number, s: Stored): ExerciseView {
	const text = s.format === 'text';
	const blocks: QuestionBlock[] = !s.problem.trim()
		? []
		: text
			? [{ kind: isAsk(s.problem) ? 'ask' : 'text', html: textHtml(s.problem) }]
			: presentProblem(s.problem).map((b): QuestionBlock =>
					b.kind === 'text' ? { kind: isAsk(b.tex) ? 'ask' : 'text', html: renderMath(b.tex) } : b.kind === 'givens' ? { kind: 'givens', items: b.items.map((t) => renderTex(t, false)) } : { kind: 'math', html: renderTex(b.tex, true) }
				);
	if (s.code) blocks.push({ kind: 'code', html: codeHtml(s.code) });
	if (s.chart) blocks.push({ kind: 'figure', html: chartHtml(s.chart) });
	if (s.figure) blocks.push({ kind: 'figure', html: figureHtml(s.figure) });
	if (s.scene) blocks.push({ kind: 'scene', scene: drawnScene(s.scene) });
	const asks = blocks.some((b) => b.kind === 'ask');
	const prompt = IMPLIED_PROMPTS.has(s.prompt) || (asks && GENERIC_PROMPTS.has(s.prompt)) ? '' : s.prompt;
	const made = s.answer.kind === 'chart' || s.answer.kind === 'program';
	// a question stored as open on a chart or a program is graded by running it, whatever the table says today
	const open: OpenGrading | null = s.mode === 'open' ? (made ? { grade: 'run' } : openGrading(s.generatorId, s.level)) : null;
	const run = open?.grade === 'run' && (s.answer.kind === 'chart' || s.answer.kind === 'program') ? s.answer : null;
	const drawn = { chart: s.solutionChart, code: s.solutionCode };
	return {
		id,
		level,
		mode: open ? 'open' : 'choice',
		...(run ? { build: run.kind === 'chart' ? { kind: 'chart' as const, start: run.start ?? '', code: !BEFORE_LANGUAGES.has(s.generatorId) } : { kind: 'program' as const, start: run.start, inputs: run.tests.map((t) => t.input), ...(neededText(run.needs) ? { needs: neededText(run.needs)! } : {}) } } : {}),
		promptHtml: prompt ? (text ? textHtml(prompt) : renderMath(prompt)) : '',
		blocks,
		options: open
			? []
			: s.choice.options.map((o) =>
			o.chart !== undefined
				? { html: chartHtml(o.chart, o.text ?? 'Diagramma di flusso'), text: o.text ?? 'un diagramma di flusso', figure: true as const }
				: o.code
					? { html: codeHtml(o.code), text: o.text ?? 'un programma', figure: true as const }
					: o.figure
				? { html: figureHtml(o.figure), text: o.text ?? o.figure.alt, figure: true as const }
				: o.scene
					? { html: sceneOptionHtml(o.scene), text: o.text ?? o.scene.alt, figure: true as const, scene: true as const }
				: text
					? { html: listingHtml(o.latex) ?? textHtml(o.latex), text: o.text ?? o.latex }
					: { html: renderMath(`$$${o.latex}$$`), text: o.latex }
		),
		key: seal({
			id,
			user: userId,
			correct: s.choice.correct,
			options: s.choice.options.length,
			solution: s.solution,
			steps: s.steps,
			format: s.format,
			figure: s.solutionFigure,
			scene: s.solutionScene,
			...(drawn.chart !== undefined || drawn.code ? { drawn } : {}),
			...(run ? { run } : open ? { open: { answer: s.answer, grading: open, prompt: s.prompt, problem: s.problem, expected: expectedLatex(s) } } : {})
		})
	};
}

/** The right answer of an open question as LaTeX: numbers carry only their value. */
function expectedLatex(s: Sample): string {
	if (s.answer.kind === 'choice' || s.answer.kind === 'chart' || s.answer.kind === 'program') return '';
	if (s.answer.kind !== 'number') return s.answer.latex;
	const [p, q = '1'] = s.answer.value.split('/');
	return q === '1' ? p : `${p.startsWith('-') ? '-' : ''}\\frac{${p.replace('-', '')}}{${q}}`;
}

/** Solution and steps typeset, from the sample or from the sealed key. */
function worked(w: { solution: string; steps: string[]; format?: 'text'; figure?: FigureRef; scene?: SceneRef; drawn?: { chart?: string; code?: CodeText } }) {
	const html = w.format === 'text' ? textHtml : (t: string) => renderMath(presentStep(t));
	const drawing = [w.drawn?.code ? codeHtml(w.drawn.code) : '', w.drawn?.chart !== undefined ? chartHtml(w.drawn.chart) : '', w.figure ? figureHtml(w.figure) : ''].join('');
	return { solutionHtml: html(w.solution), stepsHtml: w.steps.map(html), ...(drawing ? { figureHtml: drawing } : {}), ...(w.scene ? { scene: drawnScene(w.scene) } : {}) };
}

/** An answered attempt as read back from the database. */
type AnsweredRow = { id: string; user_id: string; position: number; level: number; correct: boolean; answer: { choice?: number; latex?: string; message?: string; built?: BuildResponse }; exercise: Stored };

/** An answered attempt as the page shows it again: the exercise as it was asked, the answer, the verdict. */
function answered(row: AnsweredRow): AnsweredView {
	const s = row.exercise;
	return {
		position: row.position,
		exercise: view(row.id, row.user_id, row.level, s),
		choice: row.answer.choice ?? -1,
		verdict: {
			correct: row.correct,
			correctIndex: s.mode === 'open' ? -1 : s.choice.correct,
			...(s.mode !== 'open'
				? {}
				: s.answer.kind === 'chart' || s.answer.kind === 'program'
					? { expectedHtml: solvedHtml(s.answer), answerHtml: row.answer.built ? builtHtml(row.answer.built) : '', built: true as const, ...(row.answer.message ? { message: row.answer.message } : {}) }
					: { expectedHtml: renderTex(expectedLatex(s), true), answerHtml: renderTex(row.answer.latex ?? '', true), ...(row.answer.message ? { message: row.answer.message } : {}) }),
			...worked({ ...s, figure: s.solutionFigure, scene: s.solutionScene, drawn: { chart: s.solutionChart, code: s.solutionCode } })
		}
	};
}

const verdict = (s: Sealed, correct: boolean, message?: string, latex?: string, built?: BuildResponse): Verdict => ({
	correct,
	correctIndex: s.open || s.run ? -1 : s.correct,
	...(s.run ? { expectedHtml: solvedHtml(s.run), answerHtml: built ? builtHtml(built) : '', built: true as const } : s.open ? { expectedHtml: renderTex(s.open.expected, true), answerHtml: renderTex(latex ?? '', true) } : {}),
	...(message ? { message } : {}),
	...worked(s)
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
	/** A run at a level: which repetition of it, from 1; past the level's last, practice on a passed level. */
	step?: number | null;
	/** For practice and reviews: the lesson and level of each question. */
	items?: ItemView[];
}

/** One level of the path as the page draws it. */
export interface PathLevel {
	level: number;
	name: string | null;
	status: LevelStatus;
	skipped: boolean;
	/** Repetitions that counted, and how many pass the level. */
	repetitions: number;
	steps: number;
	/** Open questions in the next run at this level, out of REPETITION_LENGTH. */
	openNext: number;
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
	/** The option picked; -1 for an open answer, which the verdict carries typeset. */
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
		session: { id: latest.id, kind: latest.kind, level: latest.level, step: latest.step ?? null, length: latest.plan.length },
		progress,
		next,
		mistakes: rows.filter((a) => !a.correct).map(answered)
	};
}

/** Runs shown under a level. */
const RUNS_SHOWN = 5;

type RunRow = { id: string; kind: RunKind; level: number; step: number | null; plan: number[]; answered: number; correct: number; started_at: string };

/** A run's row as the path reads it. */
const toRun = (r: RunRow): Run => ({ kind: r.kind, level: r.level, step: r.step ?? null, total: r.plan.length, answered: r.answered, correct: r.correct, at: r.started_at });

/**
 * The student's runs on a generator's path, with the counts the database keeps as answers come in. Only runs at a
 * level and jump tests: practice and reviews train, but never pass or open a level.
 */
async function runRows(userId: string, generatorId: string): Promise<RunRow[]> {
	const { data, error } = await db()
		.from('exercise_sessions')
		.select('id, kind, level, step, plan, answered, correct, started_at')
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
	const { states, current } = pathState(config.generator, config.levels, rows.map(toRun));
	return {
		current,
		unfinished: await unfinishedRun(rows[0]),
		levels: states.map((s) => ({
			level: s.level,
			name: levelName(config.generator, s.level),
			status: s.status,
			skipped: s.skipped,
			repetitions: s.repetitions,
			steps: s.steps,
			openNext: repetitionModes(config.generator, s.level, nextStep(s)).filter((m) => m === 'open').length,
			runs: s.runs.slice(0, RUNS_SHOWN).map((r) => ({ correct: r.correct, total: r.total, at: r.at })),
			best: s.best && { correct: s.best.correct, total: s.best.total }
		}))
	};
}

/** A finished run on a lesson, as its review page shows it: the run and every answer, right and wrong. */
export interface FinishedRun {
	session: SessionView;
	results: AnsweredView[];
}

/**
 * A run of this student on this lesson, if it is finished: what the review page (`?prova=<id>` on the exercises
 * page) needs to be opened again, after a reload or from a link. Null for a run that is not theirs, not on this
 * lesson, not at a level or a jump test, or not finished.
 */
export async function finishedRun(userId: string, dbPath: string, sessionId: string): Promise<FinishedRun | null> {
	if (!/^[0-9a-f-]{36}$/i.test(sessionId)) return null;
	const { data: run, error } = await db().from('exercise_sessions').select('id, user_id, lesson_path, kind, level, step, plan, answered').eq('id', sessionId).maybeSingle();
	if (error) throw error;
	const row = run as (RunRow & { user_id: string; lesson_path: string }) | null;
	if (!row || row.user_id !== userId || row.lesson_path !== dbPath || !['level', 'jump'].includes(row.kind) || row.answered < row.plan.length) return null;
	const { data, error: attemptsError } = await db().from('exercise_attempts').select('id, user_id, position, level, correct, answer, exercise').eq('session_id', sessionId).not('answered_at', 'is', null).order('position');
	if (attemptsError) throw attemptsError;
	return { session: { id: row.id, kind: row.kind, level: row.level, step: row.step ?? null, length: row.plan.length }, results: ((data ?? []) as AnsweredRow[]).map(answered) };
}

/**
 * An exercise outside every run, for the trial page of development (app/(site)/prova-grafico/esercizio): the sample
 * of a seed, asked as a choice or as an open question, with nothing written to the database. Its answer is graded
 * by `answerExercise` like any other; who calls leaves the saving out.
 */
export function previewExercise(generator: Generator, level: number, seed: number, asked: QuestionMode): ExerciseView {
	const generatorId = generator.id;
	const sample = generator.generate(createRng(seed), level);
	const choice = sample.answer.kind === 'choice' ? sample.answer : generator.toChoice?.(sample, createRng(deriveSeed(seed, level)));
	if (!choice) throw new Error(`${generatorId}: level ${level} has no multiple-choice form`);
	const made = sample.answer.kind === 'chart' || sample.answer.kind === 'program';
	const mode: QuestionMode = asked === 'open' && sample.answer.kind !== 'choice' && (made || openGrading(generatorId, level)) ? 'open' : 'choice';
	return view('preview', 'preview', level, { ...sample, choice, mode });
}

/** Writes the exercise at `position` of a run; the same place asked twice returns the row written first. */
async function issueAt(userId: string, dbPath: string, generatorId: string, sessionId: string, position: number, level: number, asked: QuestionMode = 'choice'): Promise<ExerciseView> {
	const load = generators[generatorId];
	if (!load) throw new ExerciseError(404, 'Esercizi non trovati.');
	const generator = await load();
	const seed = crypto.getRandomValues(new Uint32Array(1))[0];
	const sample = generator.generate(createRng(seed), level);
	// Exercises born as multiple choice (true or false, pick the right set) are their own choice.
	const choice = sample.answer.kind === 'choice' ? sample.answer : generator.toChoice?.(sample, createRng(deriveSeed(seed, level)));
	if (!choice) throw new Error(`${generatorId}: level ${level} has no multiple-choice form`);
	// open where the run asks for it and the level grades it; a sample born as multiple choice stays one
	const grading = openGrading(generatorId, level);
	const built = sample.answer.kind === 'chart' || sample.answer.kind === 'program';
	// a flowchart or a program is asked for only where the level grades by running; a formula only where it grades formulas
	const mode: QuestionMode = asked === 'open' && sample.answer.kind !== 'choice' && grading && built === (grading.grade === 'run') ? 'open' : 'choice';
	const exercise: Stored = { ...sample, choice, mode };

	const { data, error } = await db()
		.from('exercise_attempts')
		.insert({ user_id: userId, lesson_path: dbPath, generator_id: generatorId, level, seed, mode, exercise, session_id: sessionId, position, build: process.env.VERCEL_GIT_COMMIT_SHA ?? null })
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

	const { states } = pathState(config.generator, config.levels, past);
	let plan: number[];
	let step: number | null = null;
	if (kind === 'level') {
		const state = states.find((s) => s.level === level);
		if (!state || state.status === 'locked') throw new ExerciseError(403, 'Questo livello si apre superando quello prima, o con la prova di salto.');
		// the next repetition; a Free run cut short by the day's session trains but does not count
		step = nextStep(state);
		plan = Array(Math.min(REPETITION_LENGTH, left)).fill(level);
	} else {
		const skipped = skippedBy(states, level);
		if (skipped.length === 0) throw new ExerciseError(400, 'Questo livello è già aperto.');
		if (left < JUMP_LENGTH) throw new ExerciseError(403, `La prova di salto ha ${JUMP_LENGTH} domande e oggi te ne restano ${left}. Domani hai una sessione intera, oppure passa a Studio.`);
		plan = jumpPlan(skipped);
	}

	const { data, error } = await db().from('exercise_sessions').insert({ user_id: userId, lesson_path: dbPath, generator_id: config.generator, kind, level, step, plan }).select('id').single();
	if (error) throw error;
	const id = (data as { id: string }).id;
	const exercise = await issueAt(userId, dbPath, config.generator, id, 0, plan[0], step ? repetitionModes(config.generator, level, step)[0] : 'choice');
	return { session: { id, kind, level, step, length: plan.length }, exercise };
}

/**
 * The exercise at `position` of a run. The page asks for it while the student is on the one before, so it is
 * ready when they move on. For a Free account (`limited`), only while today's free session has answers left.
 */
export async function sessionExercise(userId: string, sessionId: string, position: number, limited = false): Promise<ExerciseView> {
	const [{ data, error }, left] = await Promise.all([
		db().from('exercise_sessions').select('lesson_path, generator_id, kind, level, step, plan, plan_lessons, plan_generators').eq('id', sessionId).eq('user_id', userId).maybeSingle(),
		limited ? freeQuestionsLeft(userId) : Promise.resolve(SESSION_LENGTH)
	]);
	if (error) throw error;
	if (!data) throw new ExerciseError(404, 'Prova non trovata.');
	const run = data as PlanRow;
	if (position >= run.plan.length) throw new ExerciseError(400, 'La prova è finita.');
	if (left === 0) throw new ExerciseError(403, FREE_SESSION_USED);
	const item = itemAt(run, position);
	const mode = run.kind === 'level' && run.step ? repetitionModes(item.generator, item.level, run.step)[position] : 'choice';
	return issueAt(userId, item.lesson, item.generator, sessionId, position, item.level, mode);
}

/** The plan of a run as stored: one lesson and generator for a run on a path, one per question for the others. */
type PlanRow = { lesson_path: string | null; generator_id: string | null; kind?: SessionKind; level?: number; step?: number | null; plan: number[]; plan_lessons: string[] | null; plan_generators: string[] | null };

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
	if (items.length === 0) throw new ExerciseError(400, 'Non hai errori da ripassare.');
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
 * Checks an answer from the sealed verdict the page sent back: no session lookup and no database read, so the
 * verdict is back in the time of one request. A multiple-choice answer is the option picked; an open answer is the
 * LaTeX the student wrote, graded as its level asks (src/lib/exercises/v2/grade/), with the grader loaded only
 * when the first open answer comes in. `save` records the answer on the attempt; the route runs it after
 * responding. The attempt must belong to the user it was issued to and be unanswered, so a retried request keeps
 * the first answer.
 */
export async function answerExercise(id: string, sealed: string, response: { choice?: number; latex?: string; built?: BuildResponse }, activeMs: number | null): Promise<{ verdict: Verdict; save: () => Promise<void> }> {
	const s = unseal(sealed);
	if (!s || s.id !== id) throw new ExerciseError(404, 'Esercizio non trovato.');
	let correct: boolean;
	let answer: { choice: number } | { latex: string; message?: string } | { built: BuildResponse; message?: string };
	let message: string | undefined;
	if (s.run) {
		if (!response.built) throw new ExerciseError(400, 'Risposta non valida.');
		const graded = gradeBuild(s.run, response.built);
		correct = graded.correct;
		message = graded.message;
		answer = { built: response.built, ...(message ? { message } : {}) };
	} else if (s.open) {
		if (typeof response.latex !== 'string') throw new ExerciseError(400, 'Risposta non valida.');
		const { gradeOpen } = await import('@/lib/exercises/v2/grade/grade');
		const sample = { answer: s.open.answer, prompt: s.open.prompt, problem: s.open.problem } as Sample;
		const graded = gradeOpen(sample, s.open.grading, response.latex);
		correct = graded.correct;
		message = graded.message;
		answer = { latex: response.latex, ...(message ? { message } : {}) };
	} else {
		const choice = response.choice;
		if (choice === undefined || choice >= s.options) throw new ExerciseError(400, 'Risposta non valida.');
		correct = choice === s.correct;
		answer = { choice };
	}
	return {
		verdict: verdict(s, correct, message, response.latex, response.built),
		save: async () => {
			const { error } = await db()
				.from('exercise_attempts')
				.update({ answer, correct, answered_at: new Date().toISOString(), active_ms: activeMs })
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
	/** The levels passed, for who needs to know about one (a tutor's assignment). */
	levels: number[];
}

/**
 * The student's progress on every lesson they have started, by database path, for the badges on the pages of the
 * material: one query over their runs at a level and jump tests, each lesson's path worked out with pathState as on
 * the lesson itself. Lessons without runs are left out.
 */
export async function lessonProgress(userId: string): Promise<Record<string, LessonProgress>> {
	const { data, error } = await db()
		.from('exercise_sessions')
		.select('generator_id, kind, level, step, plan, answered, correct, started_at')
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
		const { states } = pathState(config.generator, config.levels, past);
		const passed = states.filter((st) => st.status === 'passed').map((st) => st.level);
		progress[path] = { passed: passed.length, total: config.levels.length, levels: passed };
	}
	return progress;
}

/** Every run at a level or jump test of a student, newest first, with its generator: the paths of all lessons. */
async function allPathRuns(userId: string): Promise<(RunRow & { generator_id: string; lesson_path: string })[]> {
	const { data, error } = await db()
		.from('exercise_sessions')
		.select('id, generator_id, lesson_path, kind, level, step, plan, answered, correct, started_at')
		.eq('user_id', userId)
		.in('kind', ['level', 'jump'])
		.order('started_at', { ascending: false })
		.limit(5000);
	if (error) throw error;
	return (data ?? []) as (RunRow & { generator_id: string; lesson_path: string })[];
}

/** The lessons a student has started, with their path worked out: what the daily practice draws from. */
function startedLessons(rows: (RunRow & { generator_id: string })[]): StartedLesson[] {
	const byGenerator = new Map<string, (RunRow & { generator_id: string })[]>();
	for (const r of rows) byGenerator.set(r.generator_id, [...(byGenerator.get(r.generator_id) ?? []), r]);
	const lessons: StartedLesson[] = [];
	for (const [path, config] of Object.entries(configs)) {
		const past = byGenerator.get(config.generator);
		if (!past) continue;
		const { states, current } = pathState(config.generator, config.levels, past.map(toRun));
		lessons.push({ lesson: path, generator: config.generator, passed: states.filter((st) => st.status === 'passed').map((st) => st.level), current, lastAt: past[0].started_at });
	}
	return lessons;
}

/** Today's daily practice, when started: the run and where it stands. */
type PracticeRow = PlanRow & { id: string; answered: number; correct: number; finished_at: string | null };

async function todaysPractice(userId: string): Promise<PracticeRow | null> {
	const { data, error } = await db()
		.from('exercise_sessions')
		.select('id, lesson_path, generator_id, plan, plan_lessons, plan_generators, answered, correct, finished_at')
		.eq('user_id', userId)
		.eq('kind', 'practice')
		.eq('day', romeDate())
		.maybeSingle();
	if (error) throw error;
	return data as PracticeRow | null;
}

/** A run across lessons as the page takes it up: the run, how each question went, where to go on. */
async function resumeMixed(userId: string, kind: 'practice' | 'review', row: PracticeRow): Promise<{ session: SessionView; exercise: ExerciseView; startAt: number; progress: UnfinishedRun['progress']; mistakes: AnsweredView[] }> {
	const { data, error } = await db().from('exercise_attempts').select('id, user_id, position, level, correct, answer, exercise').eq('session_id', row.id).not('answered_at', 'is', null);
	if (error) throw error;
	const rows = (data ?? []) as AnsweredRow[];
	const progress = row.plan.map((): UnfinishedRun['progress'][number] => 'unanswered');
	for (const a of rows) if (a.position < progress.length) progress[a.position] = a.correct ? 'correct' : 'incorrect';
	const startAt = Math.max(0, progress.indexOf('unanswered'));
	const items = row.plan.map((_, i) => itemAt(row, i));
	const [exercise, views] = await Promise.all([issueAt(userId, items[startAt].lesson, items[startAt].generator, row.id, startAt, items[startAt].level), itemViews(items)]);
	return { session: { id: row.id, kind, level: row.plan[0], length: row.plan.length, items: views }, exercise, startAt, progress, mistakes: rows.filter((a) => !a.correct).map(answered) };
}

/**
 * Starts today's practice, or takes it up where it was left: one a day (the database allows no second one). Drawn
 * from the lessons started and the mistakes still open (see practicePlan). For a Free account (`limited`) as many
 * questions as today's free session has left.
 */
export async function startPractice(userId: string, limited = false): Promise<{ session: SessionView; exercise: ExerciseView; startAt: number; progress?: UnfinishedRun['progress']; mistakes?: AnsweredView[] }> {
	const [existing, left, rows, recent] = await Promise.all([todaysPractice(userId), limited ? freeQuestionsLeft(userId) : Promise.resolve(PRACTICE_LENGTH), allPathRuns(userId), recentAnswers(userId)]);
	if (existing) {
		if (existing.finished_at) throw new ExerciseError(400, 'Hai già fatto la pratica di oggi. Domani ne trovi una nuova.');
		if (left === 0) throw new ExerciseError(403, FREE_SESSION_USED);
		return resumeMixed(userId, 'practice', existing);
	}
	if (left === 0) throw new ExerciseError(403, FREE_SESSION_USED);
	const lessons = startedLessons(rows);
	const items = practicePlan(lessons, openMistakes(recent).filter((m) => configs[m.lesson]), createRng(practiceSeed(userId, romeDate())), Math.min(PRACTICE_LENGTH, left));
	if (items.length === 0) throw new ExerciseError(400, 'La pratica di ogni giorno parte dalle lezioni che hai cominciato: fai prima una prova in una lezione.');
	try {
		return { ...(await startMixed(userId, 'practice', items)), startAt: 0 };
	} catch (err) {
		// Another tab started today's practice a moment ago: take up that one.
		if ((err as { code?: string }).code !== '23505') throw err;
		const other = await todaysPractice(userId);
		if (!other) throw err;
		return resumeMixed(userId, 'practice', other);
	}
}

/** Where today's practice stands. */
export type PracticeState = { state: 'none' } | { state: 'todo' } | { state: 'doing'; answered: number; length: number } | { state: 'done'; correct: number; length: number };

/** The days a student has answered on, for the streak: the last 400, enough for any streak worth showing. */
async function answerDays(userId: string): Promise<{ day: string; answered: number }[]> {
	const { data, error } = await db().from('exercise_days').select('day, answered').eq('user_id', userId).order('day', { ascending: false }).limit(400);
	if (error) throw error;
	return (data ?? []) as { day: string; answered: number }[];
}

/** A day of the week shown by the streak: whether it counted. */
export interface WeekDay {
	day: string;
	counted: boolean;
	today: boolean;
}

/** A lesson on Oggi: where it is and how the student left it. */
export interface TodayLesson {
	titleHtml: string;
	exercisesUrl: string;
	chapterUrl: string;
}

/** Everything Oggi shows (vault/Decisioni/2026-09-25 Oggi è lo schermo iniziale dell'app.md). */
export interface TodayView {
	streak: Streak;
	week: WeekDay[];
	practice: PracticeState;
	/** The newest run on a lesson, left halfway today or yesterday. */
	resume: (TodayLesson & { kind: RunKind; level: number; answered: number; length: number }) | null;
	/** The lesson practised most recently and the level it suggests; `done` when every level is passed. */
	next: (TodayLesson & { level: number; levelName: string | null; done: boolean }) | null;
	/** Levels with a mistake still to redo. */
	openMistakes: number;
	/** Free questions left today; null on Studio. */
	freeLeft: number | null;
}

/** Runs left halfway are offered on Oggi for this long: today and yesterday. */
const TODAY_RESUME_MS = 48 * 3_600_000;

/** Oggi for a student, in one round of parallel queries. For a Free account (`limited`), with today's free questions. */
export async function todayView(userId: string, limited = false): Promise<TodayView> {
	const [days, practice, rows, recent, left, index] = await Promise.all([answerDays(userId), todaysPractice(userId), allPathRuns(userId), recentAnswers(userId), limited ? freeQuestionsLeft(userId) : Promise.resolve(null), lessonIndex()]);
	const today = romeDate();
	const streak = streakOf(days, today);
	const counted = new Set(days.filter((d) => d.answered >= STREAK_MIN_ANSWERS).map((d) => d.day));
	const week: WeekDay[] = [];
	for (let day = today, i = 0; i < 7; i++, day = previousDay(day)) week.unshift({ day, counted: counted.has(day), today: day === today });
	const practiceState: PracticeState = practice
		? practice.finished_at
			? { state: 'done', correct: practice.correct, length: practice.plan.length }
			: { state: 'doing', answered: practice.answered, length: practice.plan.length }
		: rows.length > 0
			? { state: 'todo' }
			: { state: 'none' };

	const lessonOf = (path: string): TodayLesson | null => {
		const info = index.get(path);
		return info ? { titleHtml: info.titleHtml, exercisesUrl: info.exercisesUrl, chapterUrl: info.chapterUrl } : null;
	};
	const latest = rows.find((r) => configs[r.lesson_path] && index.has(r.lesson_path));
	const resumeLesson = latest && latest.answered > 0 && latest.answered < latest.plan.length && Date.now() - Date.parse(latest.started_at) < TODAY_RESUME_MS ? lessonOf(latest.lesson_path) : null;
	let next: TodayView['next'] = null;
	if (latest) {
		const config = configs[latest.lesson_path];
		const { states, current } = pathState(config.generator, config.levels, rows.filter((r) => r.generator_id === config.generator).map(toRun));
		const lesson = lessonOf(latest.lesson_path);
		if (lesson) next = { ...lesson, level: current, levelName: levelName(config.generator, current), done: states.every((st) => st.status === 'passed') };
	}
	return {
		streak,
		week,
		practice: practiceState,
		resume: latest && resumeLesson ? { ...resumeLesson, kind: latest.kind, level: latest.level, answered: latest.answered, length: latest.plan.length } : null,
		next,
		openMistakes: openMistakes(recent).filter((m) => configs[m.lesson]).length,
		freeLeft: left
	};
}

/** A run of a past day, as the diary tells it: where, how it went, whether it passed its level. */
export interface LoggedRun {
	kind: SessionKind;
	/** The lesson, for a run on a lesson's path; practice and reviews cross lessons. */
	titleHtml: string | null;
	exercisesUrl: string | null;
	level: number;
	answered: number;
	length: number;
	correct: number;
	passed: boolean;
}

/** What a student did on a day, for the diary's page of that day: answers, and the runs started. */
export interface DayLog {
	answered: number;
	correct: number;
	runs: LoggedRun[];
}

/**
 * The diary writes a past day by itself from these (vault/Decisioni/2026-09-26 Il diario prende il posto di Oggi.md):
 * the day's answers as the trigger counted them, and the runs started that day in Rome, oldest first. Runs without an
 * answer are left out: opened and abandoned, they did not happen.
 */
export async function dayLog(userId: string, day: string): Promise<DayLog> {
	const [counts, runs, index] = await Promise.all([
		db().from('exercise_days').select('answered, correct').eq('user_id', userId).eq('day', day).maybeSingle(),
		db()
			.from('exercise_sessions')
			.select('kind, lesson_path, level, plan, answered, correct')
			.eq('user_id', userId)
			.eq('day', day)
			.gt('answered', 0)
			.order('started_at', { ascending: true })
			.limit(50),
		lessonIndex()
	]);
	if (counts.error) throw counts.error;
	if (runs.error) throw runs.error;
	const row = counts.data as { answered: number; correct: number } | null;
	return {
		answered: row?.answered ?? 0,
		correct: row?.correct ?? 0,
		runs: ((runs.data ?? []) as { kind: SessionKind; lesson_path: string | null; level: number; plan: number[]; answered: number; correct: number }[]).map((r) => {
			const lesson = r.lesson_path ? index.get(r.lesson_path) : undefined;
			const onPath = r.kind === 'level' || r.kind === 'jump';
			return {
				kind: r.kind,
				titleHtml: lesson?.titleHtml ?? null,
				exercisesUrl: lesson?.exercisesUrl ?? null,
				level: r.level,
				answered: r.answered,
				length: r.plan.length,
				correct: r.correct,
				passed: onPath && runPassed({ kind: r.kind as RunKind, total: r.plan.length, answered: r.answered, correct: r.correct })
			};
		})
	};
}

/** The days between `from` and `to` that counted for the streak: the diary's calendar ticks them. */
export async function studiedDays(userId: string, from: string, to: string): Promise<string[]> {
	const { data, error } = await db().from('exercise_days').select('day, answered').eq('user_id', userId).gte('day', from).lte('day', to).gte('answered', STREAK_MIN_ANSWERS);
	if (error) throw error;
	return ((data ?? []) as { day: string }[]).map((d) => d.day);
}

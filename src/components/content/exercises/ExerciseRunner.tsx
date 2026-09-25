'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, BookOpen, Check, RotateCcw, Route, X } from 'lucide-react';
import type { ExerciseView, PathView, QuestionBlock, SessionView, Verdict } from '@/lib/server/exercises';
import { SESSION_LENGTH } from '@/lib/exercises/config';
import { JUMP_LENGTH, passMark, runPassed, type RunKind } from '@/lib/exercises/levels';
import { cn } from '@/lib/utils/cn';
import { Html } from '@/components/ui/Html';
import { Button, LinkButton } from '@/components/ui/Button';
import { ExercisePath } from './ExercisePath';
import { SummarySheet } from './SummarySheet';

type Progress = 'unanswered' | 'correct' | 'incorrect';

const PROGRESS_CLASS: Record<Progress, string> = { unanswered: 'bg-surface-4', correct: 'bg-ok', incorrect: 'bg-accent' };

/** One segment per question, coloured as it is answered, the current one in ink, and the count beside it; the segments are one progress bar for assistive tech. */
function ProgressBar({ states, current }: { states: Progress[]; current: number }) {
	const answered = states.filter((s) => s !== 'unanswered').length;
	const pad = (n: number) => String(n).padStart(2, '0');
	return (
		<div className="flex min-w-0 flex-1 items-center gap-4">
			<div className="flex flex-1 gap-1.5" role="progressbar" aria-label="Avanzamento degli esercizi" aria-valuemin={0} aria-valuemax={states.length} aria-valuenow={answered} aria-valuetext={`${answered} di ${states.length} domande`}>
				{states.map((state, i) => (
					<div key={i} className={cn('h-1.5 flex-1 rounded-full transition-colors duration-500', state === 'unanswered' && i === current ? 'bg-fg-subtle' : PROGRESS_CLASS[state])} />
				))}
			</div>
			<span className="label-mono shrink-0 tabular-nums text-fg-subtle" aria-hidden="true">
				{pad(Math.min(current + 1, states.length))}
				<span className="text-fg-faint"> / {pad(states.length)}</span>
			</span>
		</div>
	);
}

/** The problem under the instruction: a paragraph of text, the givens in one row, a formula on its own. */
function Block({ block }: { block: QuestionBlock }) {
	if (block.kind === 'text') return <Html html={block.html} className="math-content mx-auto max-w-xl text-balance text-base leading-relaxed text-fg sm:text-lg" />;
	if (block.kind === 'ask') return <Html html={block.html} className="math-content text-balance font-display text-xl font-medium text-fg-strong sm:text-2xl" />;
	if (block.kind === 'givens')
		return (
			<div className="flex flex-wrap items-baseline justify-center gap-x-5 gap-y-2 text-lg sm:text-xl">
				{block.items.map((html, i) => (
					<span key={i} className="whitespace-nowrap">
						<Html as="span" html={html} className="math-content" />
						{i < block.items.length - 1 && <span className="text-fg-subtle">,</span>}
					</span>
				))}
			</div>
		);
	return <Html html={block.html} className="math-content scroll-x px-2 py-1 text-lg sm:text-xl [&_.katex-display]:overflow-visible" />;
}

/** How an answer looks: waiting, chosen and being checked, the right one (chosen or revealed after a mistake), the wrong one chosen, or set aside. */
type AnswerState = 'idle' | 'pending' | 'correct' | 'incorrect' | 'muted';

const ANSWER_CLASS: Record<AnswerState, string> = {
	idle: 'border-edge bg-surface shadow-paper hover:-translate-y-px hover:border-edge-strong hover:shadow-lift active:translate-y-0 active:bg-surface-2',
	// Marked the moment it is picked, before the server answers: the click never goes unanswered.
	pending: 'translate-y-px border-inverse bg-surface-2 shadow-none',
	correct: 'border-ok bg-ok-soft text-ok-fg shadow-paper',
	incorrect: 'animate-nudge border-danger bg-danger-soft text-danger-fg shadow-paper',
	muted: 'border-edge-soft bg-surface opacity-45'
};
const BADGE_CLASS: Record<AnswerState, string> = {
	idle: 'border-edge-strong text-fg-subtle',
	pending: 'border-inverse bg-inverse text-inverse-fg',
	correct: 'border-ok bg-ok text-white',
	incorrect: 'border-danger bg-danger text-white',
	muted: 'border-edge text-fg-faint'
};

/** A LaTeX answer read aloud: the few commands the generators use become words or symbols, the rest is stripped. */
export function speakable(latex: string): string {
	return latex
		.replace(/\$/g, '')
		.replace(/\\(?:d)?frac\{([^{}]*)\}\{([^{}]*)\}/g, '$1/$2')
		.replace(/\\sqrt\{([^{}]*)\}/g, 'radice di $1')
		.replace(/\\cdot|\\times/g, ' per ')
		.replace(/\\pm/g, ' più o meno ')
		.replace(/\\le(?:q)?\b/g, ' minore o uguale a ')
		.replace(/\\ge(?:q)?\b/g, ' maggiore o uguale a ')
		.replace(/\\ne(?:q)?\b/g, ' diverso da ')
		.replace(/\\(?:mathbb|text|mathrm)\{([^{}]*)\}/g, '$1')
		.replace(/\^\{([^{}]*)\}/g, ' alla $1')
		.replace(/\^(\S)/g, ' alla $1')
		.replace(/\\[a-zA-Z]+/g, ' ')
		.replace(/[{}]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * Fills its grid cell, so every answer of a question is the same size; a formula wider than the cell scrolls inside
 * it. The answer chosen and right swells once; the right one revealed after a mistake turns green a beat after the
 * wrong one shakes, so the eye goes from the mistake to the answer.
 */
function AnswerButton({ html, label, number, state, chosen, locked, onClick }: { html: string; label: string; number: number; state: AnswerState; chosen: boolean; locked: boolean; onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			aria-pressed={chosen}
			aria-disabled={locked || undefined}
			aria-keyshortcuts={String(number)}
			className={cn(
				'relative flex h-full min-h-[64px] w-full min-w-0 items-center justify-center break-words rounded-xl border px-12 py-3 text-base font-medium text-fg-strong transition-[transform,box-shadow,background-color,border-color,opacity] ease-out focus-ring sm:text-lg',
				ANSWER_CLASS[state],
				state === 'pending' ? 'duration-75' : 'duration-200',
				state === 'correct' && chosen && 'animate-answer-pop',
				state === 'correct' && !chosen && 'delay-150',
				locked && 'cursor-default hover:translate-y-0'
			)}
		>
			{/* The key that picks this answer, in a box to tick: it becomes the tick or the cross. The label already says which answer this is. */}
			<span className={cn('absolute left-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md border font-mono text-xs font-medium transition-colors', BADGE_CLASS[state], state === 'pending' ? 'duration-75' : 'duration-200', state === 'correct' && !chosen && 'delay-150')} aria-hidden="true">
				{state === 'correct' ? <Check className={cn('size-4 animate-badge-pop', !chosen && '[animation-delay:150ms]')} strokeWidth={3} /> : state === 'incorrect' ? <X className="size-4 animate-badge-pop" strokeWidth={3} /> : number}
			</span>
			<Html as="span" data-answer-content html={html} className="math-content block max-w-full scroll-x px-1 py-1 [&_.katex-display]:overflow-visible [&_.katex]:text-inherit" aria-hidden="true" />
		</button>
	);
}

const SHORT_ANSWER = 14;
/** Rough visible length of a LaTeX answer, to guess whether two fit side by side. */
const plainLength = (latex: string) =>
	latex
		.replace(/\$/g, '')
		.replace(/\\(?:frac|dfrac|sqrt|cdot|times|left|right|pm|mathbb|text)\b/g, '')
		.replace(/\\[a-zA-Z]+/g, 'x')
		.replace(/[{}^_\s]/g, '').length;

/** POSTs JSON and returns the JSON body, or throws the `{ error }` message the API sent. */
async function post<T>(url: string, body: unknown): Promise<T> {
	const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Servizio non disponibile. Riprova più tardi.');
	return data as T;
}

/** Milliseconds the page has been visible since `reset()`: the time spent on a question, not on another tab. */
function useActiveClock() {
	const since = useRef(0);
	const hiddenAt = useRef<number | null>(null);
	const hidden = useRef(0);
	useEffect(() => {
		const onChange = () => {
			if (document.hidden) hiddenAt.current = performance.now();
			else if (hiddenAt.current !== null) {
				hidden.current += performance.now() - hiddenAt.current;
				hiddenAt.current = null;
			}
		};
		document.addEventListener('visibilitychange', onChange);
		return () => document.removeEventListener('visibilitychange', onChange);
	}, []);
	return {
		reset: () => {
			since.current = performance.now();
			hidden.current = 0;
			hiddenAt.current = document.hidden ? since.current : null;
		},
		read: () => performance.now() - since.current - hidden.current - (hiddenAt.current !== null ? performance.now() - hiddenAt.current : 0)
	};
}

/** Steps after the first come in one after another; past this many they all share the last delay. */
const STAGGERED_STEPS = 8;
const stepDelay = (i: number) => ({ animationDelay: `${120 + Math.min(i, STAGGERED_STEPS) * 70}ms` });

/** How to solve the exercise, shown after a mistake: the card comes up under the answers, then the steps are written in order and the answer last. */
function Solution({ verdict }: { verdict: Verdict }) {
	return (
		<section aria-label="Come si risolve" className="w-full origin-top animate-panel-in overflow-hidden rounded-xl border border-edge bg-surface-2 text-left shadow-paper">
			<h3 className="label-mono flex items-center gap-2 border-b border-edge px-4 py-3 text-fg-subtle sm:px-5">
				<span className="flex size-5 items-center justify-center rounded-full bg-danger-soft text-danger-fg" aria-hidden="true">
					<X className="size-3" strokeWidth={3} />
				</span>
				Come si risolve
			</h3>
			<div className="p-4 sm:p-5">
				{verdict.stepsHtml.length > 0 && (
					<ol className="mb-3 flex flex-col gap-2">
						{verdict.stepsHtml.map((html, i) => (
							<li key={i} className="flex animate-step-in gap-3 text-base leading-relaxed text-fg" style={stepDelay(i)}>
								<span className="mt-0.5 font-mono text-xs text-fg-faint tabular-nums" aria-hidden="true">
									{String(i + 1).padStart(2, '0')}
								</span>
								<Html html={html} className="math-content min-w-0 flex-1 break-words" />
							</li>
						))}
					</ol>
				)}
				<p className="flex animate-step-in flex-wrap items-baseline gap-x-2 border-t border-edge pt-3 text-base font-medium text-fg-strong" style={stepDelay(verdict.stepsHtml.length)}>
					<span className="label-mono text-ok-fg">Soluzione</span>
					<Html as="span" html={verdict.solutionHtml} className="math-content min-w-0 break-words" />
				</p>
			</div>
		</section>
	);
}

interface Props {
	/** The lesson's database path, which the API knows its exercises by. */
	lesson: string;
	/** The lesson's path as the student left it. */
	path: PathView;
	/** A Free account on its daily session. */
	free?: boolean;
	/** Questions left today on Free; SESSION_LENGTH otherwise. */
	questionsLeft?: number;
	titleHtml: string;
	theoryHref: string;
	nextHref: string | null;
}

/**
 * A lesson's exercises (vault/Decisioni/2026-09-25 Gli esercizi sono un percorso di livelli.md): the path of
 * levels, then a run at the level picked, one question at a time. The server checks each answer; the right one
 * never reaches the page before the student answers. The next question is asked for while the student is on the
 * current one, so the click waits only for the verdict: the answer is marked at once, the verdict colours it. A
 * right answer moves on by itself; after a mistake the solution stays on screen until "Continua". Each question
 * takes focus as it appears and the verdict is announced, so a run works by keyboard and screen reader too.
 */
export function ExerciseRunner({ lesson, path, free = false, questionsLeft = SESSION_LENGTH, titleHtml, theoryHref, nextHref }: Props) {
	const router = useRouter();
	const [session, setSession] = useState<SessionView | null>(null);
	const [starting, setStarting] = useState<number | null>(null);
	const [left, setLeft] = useState(questionsLeft);
	const [exercise, setExercise] = useState<ExerciseView | null>(null);
	const [index, setIndex] = useState(0);
	const [progress, setProgress] = useState<Progress[]>([]);
	const [selected, setSelected] = useState<number | null>(null);
	const [verdict, setVerdict] = useState<Verdict | null>(null);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [summary, setSummary] = useState(false);
	// Answers wider than their cell send the set back to one column; measured after render.
	const [narrow, setNarrow] = useState(false);
	const grid = useRef<HTMLDivElement>(null);
	const question = useRef<HTMLDivElement>(null);
	const after = useRef<HTMLDivElement>(null);
	const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	// The run's exercises asked for ahead, by position: the requests, and the ones already here.
	const requests = useRef(new Map<number, Promise<ExerciseView>>());
	const arrived = useRef(new Map<number, ExerciseView>());
	const clock = useActiveClock();
	const length = session?.length ?? 0;
	const correct = progress.filter((p) => p === 'correct').length;
	const last = index === length - 1;
	const questionCount = free ? Math.min(SESSION_LENGTH, left) : SESSION_LENGTH;

	useEffect(() => () => {
		if (advanceTimer.current) clearTimeout(advanceTimer.current);
	}, []);

	const show = (next: ExerciseView) => {
		setExercise(next);
		setSelected(null);
		setVerdict(null);
		setNarrow(false);
		clock.reset();
	};

	/** The exercise at `position` of the run: asked for once, however many times it is wanted. */
	const request = (run: SessionView, position: number) => {
		let pending = requests.current.get(position);
		if (!pending) {
			pending = post<{ exercise: ExerciseView }>(`/api/esercizi/prove/${run.id}`, { position }).then(({ exercise: next }) => {
				arrived.current.set(position, next);
				return next;
			});
			// A failed request is asked again when the student gets there.
			pending.catch(() => requests.current.delete(position));
			requests.current.set(position, pending);
		}
		return pending;
	};

	const start = async (kind: RunKind, level: number) => {
		if (starting !== null) return;
		setStarting(level);
		setError(null);
		try {
			const res = await post<{ session: SessionView; exercise: ExerciseView }>('/api/esercizi', { lesson, kind, level });
			requests.current.clear();
			arrived.current.clear();
			setSession(res.session);
			setLeft((n) => Math.max(0, n - res.session.length));
			setIndex(0);
			setProgress(Array(res.session.length).fill('unanswered'));
			setSummary(false);
			show(res.exercise);
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setStarting(null);
		}
	};

	/** Back to the path, which the server draws again with the runs just made. */
	const leave = () => {
		if (advanceTimer.current) clearTimeout(advanceTimer.current);
		setSummary(false);
		setSession(null);
		setExercise(null);
		setError(null);
		router.refresh();
	};

	// While the student is on a question, the next one is asked for.
	useEffect(() => {
		if (session && exercise && index + 1 < session.length) request(session, index + 1).catch(() => {});
	}, [session, exercise, index]);

	/** The next question, usually here already; the summary after the last. */
	const advance = async () => {
		if (advanceTimer.current) clearTimeout(advanceTimer.current);
		advanceTimer.current = null;
		if (!session) return;
		if (last) {
			setSummary(true);
			return;
		}
		const position = index + 1;
		const here = arrived.current.get(position);
		if (here) {
			setIndex(position);
			show(here);
			return;
		}
		setBusy(true);
		setError(null);
		try {
			const next = await request(session, position);
			setIndex(position);
			show(next);
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setBusy(false);
		}
	};

	const answer = async (i: number) => {
		if (selected !== null || busy || !exercise) return;
		setSelected(i);
		setBusy(true);
		setError(null);
		try {
			const res = await post<{ verdict: Verdict }>(`/api/esercizi/${exercise.id}`, { key: exercise.key, choice: i, activeMs: clock.read() });
			setVerdict(res.verdict);
			setProgress((p) => p.map((s, k) => (k === index ? (res.verdict.correct ? 'correct' : 'incorrect') : s)));
		} catch (err) {
			setSelected(null);
			setError((err as Error).message);
		} finally {
			setBusy(false);
		}
	};

	// A right answer moves on by itself; a wrong one waits for "Continua", with the solution on screen.
	useEffect(() => {
		if (!verdict) return;
		if (!verdict.correct) {
			// On a phone the solution opens under the answers, below the fold: bring it up.
			const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			requestAnimationFrame(() => after.current?.scrollIntoView({ block: 'nearest', behavior: smooth ? 'smooth' : 'auto' }));
			return;
		}
		advanceTimer.current = setTimeout(advance, 1000);
		return () => {
			if (advanceTimer.current) clearTimeout(advanceTimer.current);
		};
		// `advance` reads the state set together with the verdict.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [verdict]);

	// From the keyboard: 1-4 pick an answer (the number on its box), and a-d too, the letters of a written test;
	// Enter goes on after a mistake. Not while typing somewhere else on the page, not with a modifier held.
	useEffect(() => {
		if (!session || summary || !exercise) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
			const target = e.target as HTMLElement | null;
			if (target?.closest('input, textarea, select, button, [contenteditable=""], [contenteditable="true"], [role="dialog"]')) return;
			if (verdict && !verdict.correct && e.key === 'Enter') {
				e.preventDefault();
				advance();
				return;
			}
			const key = e.key.toLowerCase();
			const i = /^[1-9]$/.test(key) ? Number(key) - 1 : /^[a-z]$/.test(key) ? key.charCodeAt(0) - 97 : -1;
			if (i < 0 || i >= exercise.options.length) return;
			e.preventDefault();
			answer(i);
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
		// `answer` and `advance` read the state listed here; re-subscribing on each change keeps them current.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session, summary, exercise, selected, verdict, busy, index]);

	// Every question, the first one included, starts with the focus on its text.
	useEffect(() => {
		if (session && !summary) question.current?.focus({ preventScroll: true });
	}, [session, summary, exercise]);

	// Answers sit in two columns when every one is short enough to share a row, otherwise in one. After rendering,
	// any answer wider than its cell sends the whole set back to one column, measured once the math fonts are in.
	const short = !!exercise && exercise.options.every((o) => plainLength(o.text) <= SHORT_ANSWER);
	const columns: 1 | 2 = short && !narrow ? 2 : 1;
	useEffect(() => {
		if (!short) return;
		let cancelled = false;
		const fit = async () => {
			await document.fonts?.ready;
			if (cancelled || !grid.current) return;
			const cells = Array.from(grid.current.querySelectorAll<HTMLElement>('[data-answer-content]'));
			if (cells.some((el) => el.scrollWidth > el.clientWidth + 1)) setNarrow(true);
		};
		fit();
		window.addEventListener('resize', fit);
		return () => {
			cancelled = true;
			window.removeEventListener('resize', fit);
		};
	}, [short, exercise]);

	const alert = error && (
		<p role="alert" className="px-4 text-center text-sm text-danger-fg">
			{error}
		</p>
	);

	if (!session || !exercise)
		return (
			<>
				{/* Keyed by the suggested level: back from a run that passed, the path opens on the level it unlocked. */}
				<ExercisePath key={path.current} titleHtml={titleHtml} path={path} questionCount={questionCount} onStart={start} starting={starting} />
				{alert}
				{free && !error && <p className="px-4 pb-6 text-center text-sm text-fg-muted">La sessione gratuita di oggi: {left} {left === 1 ? 'domanda' : 'domande'}. Con Studio ti eserciti senza limiti.</p>}
			</>
		);

	const levelIndex = path.levels.findIndex((l) => l.level === session.level);
	const levelName = path.levels[levelIndex]?.name;
	const following = path.levels[levelIndex + 1]?.level ?? null;
	const passed = runPassed({ total: length, answered: length, correct });
	const mark = passMark(length);
	// A Free account may have used its whole day on this run.
	const canGo = (kind: RunKind) => !free || left >= (kind === 'jump' ? JUMP_LENGTH : 1);
	const heading = session.kind === 'jump' ? `Prova di salto al livello ${session.level}` : `Livello ${session.level}`;
	const outcome =
		session.kind === 'jump'
			? passed
				? { title: `Si apre il livello ${session.level}`, detail: 'I livelli prima contano come superati.' }
				: { title: 'Non ancora', detail: `Per il salto servivano ${mark} risposte giuste. Puoi riprovarlo o passare dai livelli prima.` }
			: passed
				? { title: `Livello ${session.level} superato`, detail: following ? `Si apre il livello ${following}.` : 'Hai superato tutti i livelli di questa lezione.' }
				: { title: correct >= mark - 2 ? 'Ci sei quasi' : 'Continua ad allenarti', detail: `Per superare il livello servono ${mark} risposte giuste su ${length}.` };
	const retry = passed && session.kind === 'level' && following !== null ? { kind: 'level' as const, level: following, label: `Vai al livello ${following}` } : passed && session.kind === 'jump' ? { kind: 'level' as const, level: session.level, label: `Inizia il livello ${session.level}` } : passed ? null : { kind: session.kind, level: session.level, label: session.kind === 'jump' ? 'Riprova il salto' : 'Riprova il livello' };
	const actions = (
		<>
			{error && summary && alert}
			{retry && canGo(retry.kind) ? (
				<Button size="lg" className="w-full" onClick={() => start(retry.kind, retry.level)} loading={starting !== null}>
					{retry.kind === session.kind && retry.level === session.level ? <RotateCcw className="size-5" aria-hidden="true" /> : <ArrowRight className="size-5" aria-hidden="true" />}
					{retry.label}
				</Button>
			) : retry && free ? (
				<LinkButton href="/pricing" size="lg" className="w-full">
					Hai finito la sessione di oggi: passa a Studio
				</LinkButton>
			) : (
				nextHref && (
					<LinkButton href={nextHref} size="lg" className="w-full">
						Prossima lezione
						<ArrowRight className="size-5" aria-hidden="true" />
					</LinkButton>
				)
			)}
			<div className={cn('grid gap-2', passed ? 'grid-cols-1' : 'grid-cols-2')}>
				<Button variant="secondary" size="lg" onClick={leave}>
					<Route className="size-4 shrink-0" aria-hidden="true" />
					Torna al percorso
				</Button>
				{!passed && (
					<LinkButton href={theoryHref} variant="secondary" size="lg">
						<BookOpen className="size-4 shrink-0" aria-hidden="true" />
						Rileggi la teoria
					</LinkButton>
				)}
			</div>
		</>
	);

	const announced = !verdict ? '' : verdict.correct ? 'Risposta corretta.' : `Risposta sbagliata. Quella giusta era: ${speakable(exercise.options[verdict.correctIndex]?.text ?? '')}. Sotto c'è come si risolve.`;

	return (
		<>
			<div id="esercizi" className="flex h-full w-full flex-col items-center gap-6 px-4 pb-6 pt-3 sm:gap-10 sm:px-8 sm:pb-10 sm:pt-6 md:px-10">
				<div className="flex w-full max-w-2xl flex-col items-center gap-3">
					<div className="flex w-full items-center gap-3">
						<button type="button" onClick={leave} aria-label="Torna al percorso" className="-ml-2 flex size-9 shrink-0 items-center justify-center rounded-lg text-fg-subtle transition-colors hover:bg-surface-3 hover:text-fg focus-ring">
							<X className="size-5" aria-hidden="true" />
						</button>
						<ProgressBar states={progress} current={index} />
					</div>
					<p className="flex max-w-full items-baseline gap-2 truncate text-sm">
						<span className="label-mono shrink-0 text-fg-subtle">{heading}</span>
						{session.kind === 'level' && levelName && <span className="truncate text-fg-muted">{levelName}</span>}
					</p>
					{!summary && alert}
				</div>
				{/* The question at the top, the answers at the bottom of the page, the free space between them: a long problem
				    has all the room it needs and the answers never move (on phones they sit under the thumb). */}
				<div key={exercise.id} className="flex w-full max-w-2xl flex-1 flex-col justify-between gap-8 sm:gap-10 sm:pt-4">
					<div ref={question} tabIndex={-1} className="flex w-full animate-note-in flex-col gap-5 break-words text-center outline-none">
						<span className="sr-only">
							Domanda {index + 1} di {length}, livello {exercise.level}.{' '}
						</span>
						{exercise.promptHtml && (
							<h2 className="text-balance text-xl font-medium text-fg-strong sm:text-2xl">
								<Html as="span" html={exercise.promptHtml} />
							</h2>
						)}
						{exercise.blocks.length > 0 && (
							<div className="flex flex-col gap-4">
								{exercise.blocks.map((block, i) => (
									<Block key={i} block={block} />
								))}
							</div>
						)}
					</div>
					<div className="flex w-full flex-col gap-3">
						<div ref={grid} className={cn('grid w-full auto-rows-fr gap-3', columns === 2 ? 'grid-cols-2' : 'grid-cols-1')} role="group" aria-label="Risposte" aria-busy={busy || undefined}>
							{exercise.options.map((option, i) => {
								const state: AnswerState = !verdict ? (selected === i ? 'pending' : 'idle') : i === verdict.correctIndex ? 'correct' : selected === i ? 'incorrect' : 'muted';
								return (
									// An odd last answer takes the whole row instead of leaving a hole.
									<div key={i} className="h-full min-w-0 animate-step-in [&:nth-child(odd):last-child]:col-span-full" style={{ animationDelay: `${40 + i * 30}ms` }}>
										<AnswerButton html={option.html} number={i + 1} label={`Risposta ${i + 1}: ${speakable(option.text)}`} state={state} chosen={selected === i} locked={selected !== null || busy} onClick={() => answer(i)} />
									</div>
								);
							})}
						</div>
						{verdict && !verdict.correct && (
							<div ref={after} className="flex scroll-mb-4 flex-col gap-3">
								<Solution verdict={verdict} />
								<button type="button" onClick={advance} disabled={busy} className="flex min-h-[52px] w-full animate-step-in items-center justify-center gap-2 rounded-xl bg-inverse px-6 py-4 font-semibold text-inverse-fg shadow-key transition-transform hover:opacity-90 active:translate-y-px focus-ring-offset" style={stepDelay(verdict.stepsHtml.length + 1)}>
									<span>{last ? 'Vedi il riepilogo' : 'Continua'}</span>
									<ArrowRight className="size-5" aria-hidden="true" />
								</button>
							</div>
						)}
					</div>
				</div>
				<p className="sr-only" role="status" aria-live="assertive">
					{announced}
				</p>
			</div>
			<SummarySheet open={summary} correct={correct} total={length} passed={passed} title={outcome.title} detail={outcome.detail} actions={actions} onClose={leave} />
		</>
	);
}

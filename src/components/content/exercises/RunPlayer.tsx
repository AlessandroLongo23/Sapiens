'use client';

// Runs and mistakes are shown outside the lesson pages too (the list of mistakes, the diary), where the layout does not load KaTeX's styles.
import 'katex/dist/katex.min.css';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import type { BuildResponse, ExerciseView, QuestionBlock, SessionView, Verdict } from '@/lib/server/exercises';
import { cn } from '@/lib/utils/cn';
import { Html } from '@/components/ui/Html';
import { Button } from '@/components/ui/Button';
import { Sheet, sheetActions } from '@/components/ui/Sheet';
import { SceneFigure } from './scenes';
import { OpenAnswer, type OpenState } from './OpenAnswer';
import { BuildAnswer, CodeLanguageToggle, useCodeLanguage } from './BuildAnswer';

/** A question of a run: not answered yet, answered right, answered wrong. */
export type Progress = 'unanswered' | 'correct' | 'incorrect';

const PROGRESS_CLASS: Record<Progress, string> = { unanswered: 'bg-surface-4', correct: 'bg-ok', incorrect: 'bg-accent' };

/** One segment per question, coloured as it is answered, the current one in ink; the segments are one progress bar for assistive tech. */
function ProgressBar({ states, current }: { states: Progress[]; current: number }) {
	const answered = states.filter((s) => s !== 'unanswered').length;
	return (
		<div className="flex w-full gap-1.5" role="progressbar" aria-label="Avanzamento degli esercizi" aria-valuemin={0} aria-valuemax={states.length} aria-valuenow={answered} aria-valuetext={`${answered} di ${states.length} domande`}>
			{states.map((state, i) => (
				<div key={i} className={cn('h-1.5 flex-1 rounded-full transition-colors duration-500', state === 'unanswered' && i === current ? 'bg-fg-subtle' : PROGRESS_CLASS[state])} />
			))}
		</div>
	);
}

/** The problem under the instruction: a paragraph of text, the givens in one row, a formula on its own. */
export function Block({ block }: { block: QuestionBlock }) {
	if (block.kind === 'text') return <Html html={block.html} className="math-content mx-auto max-w-xl text-balance text-base leading-relaxed text-fg sm:text-lg" />;
	if (block.kind === 'ask') return <Html html={block.html} className="math-content text-balance font-display text-xl font-medium text-fg-strong sm:text-2xl" />;
	if (block.kind === 'figure') return <Html html={block.html} className="flex justify-center px-2" />;
	if (block.kind === 'code') return <Html html={block.html} className="mx-auto w-full max-w-xl text-left" />;
	if (block.kind === 'scene') return <SceneFigure scene={block.scene} className="px-2" />;
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
export type AnswerState = 'idle' | 'pending' | 'correct' | 'incorrect' | 'muted';

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
 * wrong one shakes, so the eye goes from the mistake to the answer. A graph (`scene`) takes the whole button, with
 * the number in the corner above it: four of them stand two by two on a phone.
 */
export function AnswerButton({ html, label, number, state, chosen, locked, onClick, scene = false }: { html: string; label: string; number: number; state: AnswerState; chosen: boolean; locked: boolean; onClick: () => void; scene?: boolean }) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			aria-pressed={chosen}
			aria-disabled={locked || undefined}
			aria-keyshortcuts={String(number)}
			className={cn(
				'relative flex h-full min-h-[64px] w-full min-w-0 items-center justify-center break-words rounded-xl border text-base font-medium text-fg-strong transition-[transform,box-shadow,background-color,border-color,opacity] ease-out focus-ring sm:text-lg',
				scene ? 'px-2 pb-2 pt-11' : 'px-12 py-3',
				ANSWER_CLASS[state],
				state === 'pending' ? 'duration-75' : 'duration-200',
				state === 'correct' && chosen && 'animate-answer-pop',
				state === 'correct' && !chosen && 'delay-150',
				locked && 'cursor-default hover:translate-y-0'
			)}
		>
			{/* The key that picks this answer, in a box to tick: it becomes the tick or the cross. The label already says which answer this is. */}
			<span className={cn('absolute flex size-7 items-center justify-center rounded-md border font-mono text-xs font-medium transition-colors', scene ? 'left-2 top-2' : 'left-3 top-1/2 -translate-y-1/2', BADGE_CLASS[state], state === 'pending' ? 'duration-75' : 'duration-200', state === 'correct' && !chosen && 'delay-150')} aria-hidden="true">
				{state === 'correct' ? <Check className={cn('size-4 animate-badge-pop', !chosen && '[animation-delay:150ms]')} strokeWidth={3} /> : state === 'incorrect' ? <X className="size-4 animate-badge-pop" strokeWidth={3} /> : number}
			</span>
			{scene ? (
				<Html as="span" data-answer-content html={html} className="mx-auto block w-full max-w-64 [&_svg]:w-full" aria-hidden="true" />
			) : (
				<Html as="span" data-answer-content html={html} className="math-content block max-w-full scroll-x px-1 py-1 [&_.katex-display]:overflow-visible [&_.katex]:text-inherit" aria-hidden="true" />
			)}
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
export async function post<T>(url: string, body: unknown): Promise<T> {
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
export function Solution({ verdict }: { verdict: Verdict }) {
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
				{verdict.figureHtml && <Html html={verdict.figureHtml} className="mb-3 flex animate-step-in justify-center" style={stepDelay(verdict.stepsHtml.length)} />}
				{verdict.scene && (
					<div className="mb-3 animate-step-in" style={stepDelay(verdict.stepsHtml.length)}>
						<SceneFigure scene={verdict.scene} />
					</div>
				)}
				<p className="flex animate-step-in flex-wrap items-baseline gap-x-2 border-t border-edge pt-3 text-base font-medium text-fg-strong" style={stepDelay(verdict.stepsHtml.length)}>
					<span className="label-mono text-ok-fg">Soluzione</span>
					<Html as="span" html={verdict.solutionHtml} className="math-content min-w-0 break-words" />
				</p>
			</div>
		</section>
	);
}


/** A question answered during this visit: what was asked, the answer picked, and the verdict with the solution. */
export interface RunResult {
	position: number;
	exercise: ExerciseView;
	choice: number;
	verdict: Verdict;
}

interface PlayerProps {
	session: SessionView;
	/** The exercise at `startAt`, sent with the run or asked for when it is taken up again. */
	first: ExerciseView;
	/** The place to start from: 0, or the first question left when a run is taken up again. */
	startAt?: number;
	/** The questions already answered before this visit, when a run is taken up again. */
	initial?: Progress[];
	/** The ones among them answered wrong, so the summary lists every mistake of the run. */
	earlier?: RunResult[];
	/** The time already spent on the questions answered before this visit, in ms. */
	elapsed?: number;
	/** What the run is, in the top left corner: the lesson's title, or "Ripasso degli errori". */
	title: ReactNode;
	/** Under the title: "Livello 3" and its name; for a run across lessons, per question. */
	label: ReactNode | ((index: number) => ReactNode);
	/** The run is over and its summary is on screen: the keys stop answering. */
	finished?: boolean;
	onLeave: () => void;
	/** After the last question: the answers of this visit, how every question of the run went, and the time spent answering, in ms. */
	onFinish: (results: RunResult[], progress: Progress[], activeMs: number) => void;
}

/**
 * The questions of a run, one at a time. The server checks each answer; the right one never reaches the page
 * before the student answers. The next question is asked for while the student is on the current one, so the
 * click waits only for the verdict: the answer is marked at once, the verdict colours it. A right answer moves on
 * by itself; after a mistake the solution stays on screen until "Continua". Each question takes focus as it
 * appears and the verdict is announced, so a run works by keyboard and screen reader too.
 *
 * A run takes the whole screen, over the site header and the page it started from: one row at the top with what
 * the run is, the progress and the way out, then only the question.
 */
export function RunPlayer({ session, first, startAt = 0, initial, earlier = [], elapsed = 0, title, label, finished = false, onLeave, onFinish }: PlayerProps) {
	const [exercise, setExercise] = useState<ExerciseView>(first);
	const [index, setIndex] = useState(startAt);
	const [progress, setProgress] = useState<Progress[]>(() => initial ?? Array(session.length).fill('unanswered'));
	const [selected, setSelected] = useState<number | null>(null);
	const [verdict, setVerdict] = useState<Verdict | null>(null);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);
	// The X, or Esc, asks before leaving a run under way.
	const [leaving, setLeaving] = useState(false);
	// Answers wider than their cell send the set back to one column; measured after render.
	const [narrow, setNarrow] = useState(false);
	const grid = useRef<HTMLDivElement>(null);
	const question = useRef<HTMLDivElement>(null);
	const after = useRef<HTMLDivElement>(null);
	const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const results = useRef<RunResult[]>(earlier);
	// The time on the questions answered so far: what the server saves with each answer, summed.
	const spent = useRef(elapsed);
	// The run's exercises asked for ahead, by position: the requests, and the ones already here.
	const requests = useRef(new Map<number, Promise<ExerciseView>>());
	const arrived = useRef(new Map<number, ExerciseView>());
	const clock = useActiveClock();
	const length = session.length;
	const last = index === length - 1;

	useEffect(() => {
		clock.reset();
		return () => {
			if (advanceTimer.current) clearTimeout(advanceTimer.current);
		};
		// Once, for the first question: `show` resets the clock for the others.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const show = (next: ExerciseView) => {
		setExercise(next);
		setSelected(null);
		setVerdict(null);
		setNarrow(false);
		clock.reset();
	};

	/** The exercise at `position` of the run: asked for once, however many times it is wanted. */
	const request = (position: number) => {
		let pending = requests.current.get(position);
		if (!pending) {
			pending = post<{ exercise: ExerciseView }>(`/api/esercizi/prove/${session.id}`, { position }).then(({ exercise: next }) => {
				arrived.current.set(position, next);
				return next;
			});
			// A failed request is asked again when the student gets there.
			pending.catch(() => requests.current.delete(position));
			requests.current.set(position, pending);
		}
		return pending;
	};

	// While the student is on a question, the next one is asked for.
	useEffect(() => {
		if (index + 1 < length) request(index + 1).catch(() => {});
		// `request` only reads refs and the run, which does not change.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [exercise, index, length]);

	/** The next question, usually here already; the summary after the last. */
	const advance = async () => {
		if (advanceTimer.current) clearTimeout(advanceTimer.current);
		advanceTimer.current = null;
		if (last) {
			onFinish(results.current, progress, spent.current);
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
			const next = await request(position);
			setIndex(position);
			show(next);
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setBusy(false);
		}
	};

	/** Sends an answer: the option `i`, or with `latex` an open answer (then `i` is -1). */
	const answer = async (i: number, latex?: string, built?: BuildResponse) => {
		if (selected !== null || busy || finished) return;
		setSelected(i);
		setBusy(true);
		setError(null);
		try {
			const activeMs = clock.read();
			const body = built ? { key: exercise.key, built, activeMs } : latex !== undefined ? { key: exercise.key, latex, activeMs } : { key: exercise.key, choice: i, activeMs };
			const res = await post<{ verdict: Verdict }>(`/api/esercizi/${exercise.id}`, body);
			spent.current += activeMs;
			results.current = [...results.current.filter((r) => r.position !== index), { position: index, exercise, choice: i, verdict: res.verdict }];
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
		// a right answer with a note ("si può ridurre") stays long enough to read it
	advanceTimer.current = setTimeout(advance, verdict.message ? 2600 : 1000);
		return () => {
			if (advanceTimer.current) clearTimeout(advanceTimer.current);
		};
		// `advance` reads the state set together with the verdict.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [verdict]);

	// Closing the tab or the browser, or reloading, asks too: there the browser shows its own dialog, the only one
	// a page may put up. Attached only while the run is under way, so the page keeps its place in the
	// back/forward cache afterwards.
	useEffect(() => {
		if (finished) return;
		const warn = (e: BeforeUnloadEvent) => e.preventDefault();
		window.addEventListener('beforeunload', warn);
		return () => window.removeEventListener('beforeunload', warn);
	}, [finished]);

	// The browser's Back asks as well. A page cannot stop it, so the run puts an entry of its own on the history
	// when it starts: Back takes that one, the page stays, the entry goes back on and the question comes up. The
	// entry is taken off again when the student leaves or the run ends, so Back then works as it always did.
	const guard = useRef<'on' | 'leaving' | 'dropping' | 'off'>('off');
	const leave = useRef(onLeave);
	useEffect(() => {
		leave.current = onLeave;
	});
	const guarding = () => guard.current === 'on' && window.history.state?.__run === session.id;
	const pushGuard = () => window.history.pushState({ ...window.history.state, __run: session.id }, '', window.location.href);
	useEffect(() => {
		if (finished) return;
		// Already there when the effect runs twice (development), or after Forward.
		if (window.history.state?.__run !== session.id) pushGuard();
		guard.current = 'on';
		const onPop = () => {
			if (guard.current === 'leaving') {
				guard.current = 'off';
				leave.current();
			} else if (guard.current === 'dropping') guard.current = 'off';
			else if (guard.current === 'on' && window.history.state?.__run !== session.id) {
				pushGuard();
				setLeaving(true);
			}
		};
		window.addEventListener('popstate', onPop);
		return () => window.removeEventListener('popstate', onPop);
		// `pushGuard` only reads the run's id.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [finished, session.id]);
	// The run is over: its entry goes, before the summary's buttons use the history themselves.
	useEffect(() => {
		if (!finished || !guarding()) return;
		const onPop = () => (guard.current = 'off');
		window.addEventListener('popstate', onPop, { once: true });
		guard.current = 'dropping';
		window.history.back();
		return () => window.removeEventListener('popstate', onPop);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [finished]);
	/** Out of the run for good: first its history entry, then the page it came from. */
	const exit = () => {
		if (!guarding()) return onLeave();
		guard.current = 'leaving';
		window.history.back();
	};

	// From the keyboard: 1-4 pick an answer (the number on its box), and a-d too, the letters of a written test;
	// Enter goes on after a mistake. Not while typing somewhere else on the page, not with a modifier held.
	useEffect(() => {
		if (finished) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
			const target = e.target as HTMLElement | null;
			if (e.key === 'Escape' && !target?.closest('math-field, [role="dialog"]')) {
				e.preventDefault();
				setLeaving(true);
				return;
			}
			if (target?.closest('input, textarea, select, button, math-field, [contenteditable=""], [contenteditable="true"], [role="dialog"]')) return;
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
	}, [finished, exercise, selected, verdict, busy, index]);

	// Every question, the first one included, starts with the focus on its text; an open question on its field
	// instead (OpenAnswer), which would otherwise lose it here without knowing, and take no typing.
	useEffect(() => {
		if (!finished && exercise.mode !== 'open') question.current?.focus({ preventScroll: true });
	}, [finished, exercise]);

	// Answers sit in two columns when every one is short enough to share a row, otherwise in one. After rendering,
	// any answer wider than its cell sends the whole set back to one column, measured once the math fonts are in.
	// A drawing always shares its row: two molecules side by side are easier to compare.
	const short = exercise.options.every((o) => o.figure || plainLength(o.text) <= SHORT_ANSWER);
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

	const open = exercise.mode === 'open';
	/** The question or its answers show a program: the student picks the language to read it in. */
	const coded = exercise.blocks.some((b) => b.kind === 'code' && b.html.includes('code-pair')) || exercise.options.some((o) => o.html.includes('code-pair'));
	const codeLanguage = useCodeLanguage();
	const openState: OpenState = !verdict ? (selected !== null ? 'pending' : 'idle') : verdict.correct ? 'correct' : 'incorrect';
	const announced = !verdict
		? ''
		: verdict.correct
			? `Risposta corretta.${verdict.message ? ` ${verdict.message}` : ''}`
			: open
				? `Risposta sbagliata.${verdict.message ? ` ${verdict.message}` : ''} Sotto ci sono la risposta giusta e come si risolve.`
				: `Risposta sbagliata. Quella giusta era: ${speakable(exercise.options[verdict.correctIndex]?.text ?? '')}. Sotto c'è come si risolve.`;

	return (
		<div id="esercizi" data-code-language={codeLanguage} className="fixed inset-0 z-50 flex flex-col items-center gap-6 overflow-y-auto overscroll-y-contain bg-surface px-4 pb-[calc(var(--safe-b)+1.5rem)] pt-3 text-fg sm:gap-10 sm:px-8 sm:pb-10 sm:pt-5 md:px-10">
			<div className="flex w-full flex-col items-center gap-3 pt-safe-t">
				{/* One row: what the run is on the left, the way out on the right, the progress between them, as wide as the
				    question below. On a phone the progress takes a row of its own under the title. */}
				<div className="flex w-full flex-wrap items-center gap-x-6 gap-y-3">
					<div className="flex min-w-0 flex-1 basis-0 flex-col gap-0.5">
						<p className="truncate font-display text-lg font-semibold leading-tight tracking-tight text-fg-strong">{title}</p>
						<p className="flex min-w-0 items-baseline gap-2 truncate text-sm">{typeof label === 'function' ? label(index) : label}</p>
					</div>
					<div className="order-last w-full md:order-none md:w-auto md:max-w-2xl md:flex-[2_1_0]">
						<ProgressBar states={progress} current={index} />
					</div>
					<div className="flex shrink-0 justify-end md:flex-1 md:basis-0">
						<button type="button" onClick={() => (finished ? exit() : setLeaving(true))} aria-label="Esci dalla prova" aria-haspopup="dialog" className="-mr-2 flex size-9 shrink-0 items-center justify-center rounded-lg text-fg-subtle transition-colors hover:bg-surface-3 hover:text-fg focus-ring">
							<X className="size-5" aria-hidden="true" />
						</button>
					</div>
				</div>
				{error && (
					<p role="alert" className="px-4 text-center text-sm text-danger-fg">
						{error}
					</p>
				)}
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
					{coded && !exercise.build && (
						<div className="flex justify-center">
							<CodeLanguageToggle />
						</div>
					)}
					{open && exercise.build && <BuildAnswer key={exercise.id} build={exercise.build} locked={selected !== null || busy || !!verdict} onSubmit={(built) => answer(-1, undefined, built)} />}
					{open && exercise.build && verdict?.correct && !verdict.message && <p className="animate-step-in text-center text-sm font-medium text-ok-fg">Giusto: supera tutte le prove.</p>}
					{open && !exercise.build && <OpenAnswer state={openState} locked={selected !== null || busy || !!verdict} onSubmit={(latex) => answer(-1, latex)} />}
					{open && verdict?.message && (
						<p className={cn('animate-step-in text-center text-sm', verdict.correct ? 'text-ok-fg' : 'text-fg-muted')}>{verdict.message}</p>
					)}
					{open && verdict && !verdict.correct && verdict.expectedHtml && verdict.built && (
						<div className="flex animate-step-in flex-col items-center gap-2">
							<span className="label-mono text-ok-fg">Una soluzione</span>
							<Html html={verdict.expectedHtml} className="w-full max-w-xl text-left" />
						</div>
					)}
					{open && verdict && !verdict.correct && verdict.expectedHtml && !verdict.built && (
						<p className="flex animate-step-in flex-wrap items-baseline justify-center gap-x-2 text-base">
							<span className="label-mono text-ok-fg">Risposta giusta</span>
							<Html as="span" html={verdict.expectedHtml} className="math-content min-w-0 scroll-x [&_.katex-display]:my-0 [&_.katex-display]:inline-block" />
						</p>
					)}
					<div ref={grid} hidden={open} className={cn('grid w-full auto-rows-fr gap-3', columns === 2 ? 'grid-cols-2' : 'grid-cols-1')} role="group" aria-label="Risposte" aria-busy={busy || undefined}>
						{exercise.options.map((option, i) => {
							const state: AnswerState = !verdict ? (selected === i ? 'pending' : 'idle') : i === verdict.correctIndex ? 'correct' : selected === i ? 'incorrect' : 'muted';
							return (
								// An odd last answer takes the whole row instead of leaving a hole.
								<div key={i} className="h-full min-w-0 animate-step-in [&:nth-child(odd):last-child]:col-span-full" style={{ animationDelay: `${40 + i * 30}ms` }}>
									<AnswerButton html={option.html} number={i + 1} label={`Risposta ${i + 1}: ${speakable(option.text)}`} state={state} chosen={selected === i} locked={selected !== null || busy} onClick={() => answer(i)} scene={option.scene} />
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
			<Sheet open={leaving && !finished} onClose={() => setLeaving(false)} title="Vuoi uscire dalla prova?" size="auto" width="sm" align="center">
				<p className="text-sm text-fg-muted">Le risposte che hai dato restano salvate, ma la prova resta a metà.</p>
				<div className={cn(sheetActions, 'mt-5')}>
					<Button variant="ghost" onClick={exit}>
						Esci
					</Button>
					<Button onClick={() => setLeaving(false)}>Continua la prova</Button>
				</div>
			</Sheet>
		</div>
	);
}

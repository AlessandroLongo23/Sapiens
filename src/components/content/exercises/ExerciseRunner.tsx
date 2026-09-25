'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import type { ExerciseView, QuestionBlock, Verdict } from '@/lib/server/exercises';
import { estimatedTime, SESSION_LENGTH } from '@/lib/exercises/config';
import { cn } from '@/lib/utils/cn';
import { Html } from '@/components/ui/Html';
import { StartScreen } from './StartScreen';
import { SummarySheet } from './SummarySheet';

type Progress = 'unanswered' | 'correct' | 'incorrect';

const PROGRESS_CLASS: Record<Progress, string> = { unanswered: 'bg-surface-4', correct: 'bg-ok', incorrect: 'bg-accent' };

/** One segment per question, coloured as it is answered, the current one in ink, and the count beside it; the segments are one progress bar for assistive tech. */
function ProgressBar({ states, current }: { states: Progress[]; current: number }) {
	const answered = states.filter((s) => s !== 'unanswered').length;
	const pad = (n: number) => String(n).padStart(2, '0');
	return (
		<div className="flex w-full max-w-2xl items-center gap-4">
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

/** How an answer looks: waiting, the right one (chosen or revealed after a mistake), the wrong one chosen, or set aside. */
type AnswerState = 'idle' | 'correct' | 'incorrect' | 'muted';

const ANSWER_CLASS: Record<AnswerState, string> = {
	idle: 'border-edge bg-surface shadow-paper hover:-translate-y-px hover:border-edge-strong hover:shadow-lift active:translate-y-0 active:bg-surface-2',
	correct: 'border-ok bg-ok-soft text-ok-fg shadow-paper',
	incorrect: 'animate-nudge border-danger bg-danger-soft text-danger-fg shadow-paper',
	muted: 'border-edge-soft bg-surface opacity-45'
};
const BADGE_CLASS: Record<AnswerState, string> = {
	idle: 'border-edge-strong text-fg-subtle',
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

/** Fills its grid cell, so every answer of a question is the same size; a formula wider than the cell scrolls inside it. */
function AnswerButton({ html, label, number, state, chosen, locked, onClick }: { html: string; label: string; number: number; state: AnswerState; chosen: boolean; locked: boolean; onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			aria-pressed={chosen}
			aria-disabled={locked || undefined}
			aria-keyshortcuts={String(number)}
			className={cn('relative flex h-full min-h-[64px] w-full min-w-0 items-center justify-center break-words rounded-xl border px-12 py-3 text-base font-medium text-fg-strong transition-[transform,box-shadow,background-color,border-color,opacity] duration-200 ease-out focus-ring sm:text-lg', ANSWER_CLASS[state], locked && 'cursor-default hover:translate-y-0')}
		>
			{/* The key that picks this answer, in a box to tick: it becomes the tick or the cross. The label already says which answer this is. */}
			<span className={cn('absolute left-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md border font-mono text-xs font-medium transition-colors duration-200', BADGE_CLASS[state])} aria-hidden="true">
				{state === 'correct' ? <Check className="size-4" strokeWidth={3} /> : state === 'incorrect' ? <X className="size-4" strokeWidth={3} /> : number}
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

interface Props {
	/** The lesson's database path, which the API knows its exercises by. */
	lesson: string;
	/** The levels the lesson offers, easiest first. */
	levels: number[];
	/** Questions in this session: SESSION_LENGTH, or what is left of today's free session. */
	sessionLength?: number;
	/** A Free account on its daily session. */
	free?: boolean;
	titleHtml: string;
	theoryHref: string;
	nextHref: string | null;
}

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

/** The levels as a row of keys: the one in play is inked; picking another asks the server for an exercise at that level. */
function LevelPicker({ levels, current, disabled, onPick }: { levels: number[]; current: number | null; disabled: boolean; onPick: (level: number) => void }) {
	return (
		<div className="flex items-center gap-2" role="group" aria-label="Livello">
			<span className="label-mono text-fg-subtle" aria-hidden="true">
				Livello
			</span>
			<div className="flex gap-1">
				{levels.map((level) => (
					<button
						key={level}
						type="button"
						onClick={() => onPick(level)}
						aria-label={`Livello ${level}`}
						aria-pressed={level === current}
						aria-disabled={disabled || undefined}
						className={cn(
							'flex size-8 items-center justify-center rounded-md border font-mono text-xs font-medium tabular-nums transition-colors duration-200 focus-ring',
							level === current ? 'border-inverse bg-inverse text-inverse-fg' : 'border-edge bg-surface text-fg-subtle hover:border-edge-strong hover:text-fg-strong',
							disabled && 'cursor-default opacity-60 hover:border-edge hover:text-fg-subtle'
						)}
					>
						{level}
					</button>
				))}
			</div>
		</div>
	);
}

/** How to solve the exercise, shown after a mistake: the steps in order, then the answer. */
function Solution({ verdict }: { verdict: Verdict }) {
	return (
		<section aria-label="Come si risolve" className="w-full animate-fade-in rounded-xl border border-edge bg-surface-2 p-4 text-left sm:p-5">
			<h3 className="label-mono mb-3 text-fg-subtle">Come si risolve</h3>
			{verdict.stepsHtml.length > 0 && (
				<ol className="mb-3 flex flex-col gap-2">
					{verdict.stepsHtml.map((html, i) => (
						<li key={i} className="flex gap-3 text-base leading-relaxed text-fg">
							<span className="mt-0.5 font-mono text-xs text-fg-faint tabular-nums" aria-hidden="true">
								{String(i + 1).padStart(2, '0')}
							</span>
							<Html html={html} className="math-content min-w-0 flex-1 break-words" />
						</li>
					))}
				</ol>
			)}
			<p className="flex flex-wrap items-baseline gap-x-2 border-t border-edge pt-3 text-base font-medium text-fg-strong">
				<span className="label-mono text-fg-subtle">Soluzione</span>
				<Html as="span" html={verdict.solutionHtml} className="math-content min-w-0 break-words" />
			</p>
		</section>
	);
}

/**
 * An exercise session of `sessionLength` questions, one at a time (vault/Decisioni/2026-09-24 Il livello degli
 * esercizi lo sceglie la pagina.md). The server picks the first exercise from the student's attempts, checks
 * each answer and sends the next exercise with the verdict, at the level the answer leads to; the right
 * answer never reaches the page before the student answers. A right answer moves on by itself; after a
 * mistake the solution stays on screen until "Continua". The level picker asks for an exercise at another
 * level in place of the current one. Each question takes focus as it appears and the verdict is announced,
 * so the session works by keyboard and screen reader too.
 */
export function ExerciseRunner({ lesson, levels, sessionLength = SESSION_LENGTH, free = false, titleHtml, theoryHref, nextHref }: Props) {
	const [started, setStarted] = useState(false);
	const [exercise, setExercise] = useState<ExerciseView | null>(null);
	const [queued, setQueued] = useState<ExerciseView | null>(null);
	const [index, setIndex] = useState(0);
	const [progress, setProgress] = useState<Progress[]>(() => Array(sessionLength).fill('unanswered'));
	const [selected, setSelected] = useState<number | null>(null);
	const [verdict, setVerdict] = useState<Verdict | null>(null);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [summary, setSummary] = useState(false);
	// Answers wider than their cell send the set back to one column; measured after render.
	const [narrow, setNarrow] = useState(false);
	const grid = useRef<HTMLDivElement>(null);
	const question = useRef<HTMLDivElement>(null);
	const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const clock = useActiveClock();
	const correct = progress.filter((p) => p === 'correct').length;
	const last = index === sessionLength - 1;

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

	/** A new exercise from the server: the first one of the session, or one at the level picked. */
	const fetchExercise = async (level?: number) => {
		setBusy(true);
		setError(null);
		try {
			const { exercise: next } = await post<{ exercise: ExerciseView }>('/api/esercizi', { lesson, level });
			show(next);
			return true;
		} catch (err) {
			setError((err as Error).message);
			return false;
		} finally {
			setBusy(false);
		}
	};

	const start = async () => {
		if (busy) return;
		setIndex(0);
		setProgress(Array(sessionLength).fill('unanswered'));
		setQueued(null);
		setSummary(false);
		if (await fetchExercise()) setStarted(true);
	};

	/** The next question: the one the server sent with the verdict, or a fresh one if that request failed. */
	const advance = () => {
		if (advanceTimer.current) clearTimeout(advanceTimer.current);
		advanceTimer.current = null;
		if (last) {
			setSummary(true);
			return;
		}
		setIndex((i) => i + 1);
		if (queued) {
			show(queued);
			setQueued(null);
		} else fetchExercise(exercise?.level);
	};

	const answer = async (i: number) => {
		if (selected !== null || busy || !exercise) return;
		setSelected(i);
		setBusy(true);
		setError(null);
		try {
			const res = await post<{ verdict: Verdict; next: ExerciseView | null }>(`/api/esercizi/${exercise.id}`, { choice: i, activeMs: clock.read(), next: !last });
			setVerdict(res.verdict);
			setQueued(res.next);
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
		if (!verdict?.correct) return;
		advanceTimer.current = setTimeout(advance, 1100);
		return () => {
			if (advanceTimer.current) clearTimeout(advanceTimer.current);
		};
		// `advance` reads the state set together with the verdict.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [verdict]);

	const pickLevel = (level: number) => {
		if (busy || verdict || level === exercise?.level) return;
		fetchExercise(level);
	};

	// From the keyboard: 1-4 pick an answer (the number on its box), and a-d too, the letters of a written test;
	// Enter goes on after a mistake. Not while typing somewhere else on the page, not with a modifier held.
	useEffect(() => {
		if (!started || summary || !exercise) return;
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
	}, [started, summary, exercise, selected, verdict, busy, index, queued]);

	// Every question, the first one included, starts with the focus on its text.
	useEffect(() => {
		if (started && !summary) question.current?.focus({ preventScroll: true });
	}, [started, summary, exercise]);

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
		<p role="alert" className="text-center text-sm text-danger-fg">
			{error}
		</p>
	);

	if (!started)
		return (
			<>
				<StartScreen titleHtml={titleHtml} questionCount={sessionLength} estimatedTime={estimatedTime(sessionLength)} onStart={start} />
				{free && !error && <p className="px-4 pb-6 text-center text-sm text-fg-muted">La sessione gratuita di oggi. Con Studio ti eserciti senza limiti.</p>}
				{alert}
			</>
		);

	const announced = !verdict || !exercise ? '' : verdict.correct ? 'Risposta corretta.' : `Risposta sbagliata. Quella giusta era: ${speakable(exercise.options[verdict.correctIndex]?.text ?? '')}. Sotto c'è come si risolve.`;

	return (
		<>
			<div id="esercizi" className="flex h-full w-full flex-col items-center gap-6 px-4 pb-6 pt-3 sm:gap-10 sm:px-8 sm:pb-10 sm:pt-6 md:px-10">
				<div className="flex w-full max-w-2xl flex-col items-center gap-4">
					<ProgressBar states={progress} current={index} />
					{levels.length > 1 && <LevelPicker levels={levels} current={exercise?.level ?? null} disabled={busy || !!verdict} onPick={pickLevel} />}
					{alert}
				</div>
				{exercise && (
					// The question at the top, the answers at the bottom of the page, the free space between them: a long problem
					// has all the room it needs and the answers never move (on phones they sit under the thumb).
					<div key={exercise.id} className="flex w-full max-w-2xl flex-1 flex-col justify-between gap-8 sm:gap-10 sm:pt-4">
						<div ref={question} tabIndex={-1} className="flex w-full animate-fade-in flex-col gap-5 break-words text-center outline-none">
							<span className="sr-only">
								Domanda {index + 1} di {sessionLength}, livello {exercise.level}.{' '}
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
							{verdict && !verdict.correct && <Solution verdict={verdict} />}
						</div>
						<div className="flex w-full flex-col gap-3">
							<div ref={grid} className={cn('grid w-full animate-fade-in auto-rows-fr gap-3', columns === 2 ? 'grid-cols-2' : 'grid-cols-1')} role="group" aria-label="Risposte" aria-busy={busy || undefined}>
								{exercise.options.map((option, i) => {
									const state: AnswerState = !verdict ? 'idle' : i === verdict.correctIndex ? 'correct' : selected === i ? 'incorrect' : 'muted';
									return (
										// An odd last answer takes the whole row instead of leaving a hole.
										<div key={i} className="h-full min-w-0 [&:nth-child(odd):last-child]:col-span-full">
											<AnswerButton html={option.html} number={i + 1} label={`Risposta ${i + 1}: ${speakable(option.text)}`} state={state} chosen={selected === i} locked={selected !== null || busy} onClick={() => answer(i)} />
										</div>
									);
								})}
							</div>
							{verdict && !verdict.correct && (
								<button type="button" onClick={advance} disabled={busy} className="flex min-h-[52px] w-full animate-fade-in items-center justify-center gap-2 rounded-xl bg-inverse px-6 py-4 font-semibold text-inverse-fg shadow-key transition-transform hover:opacity-90 active:translate-y-px focus-ring-offset">
									<span>{last ? 'Vedi il riepilogo' : 'Continua'}</span>
									<ArrowRight className="size-5" aria-hidden="true" />
								</button>
							)}
						</div>
					</div>
				)}
				<p className="sr-only" role="status" aria-live="assertive">
					{announced}
				</p>
			</div>
			<SummarySheet
				open={summary}
				correct={correct}
				total={sessionLength}
				theoryHref={theoryHref}
				nextHref={nextHref}
				onRetry={start}
				onClose={() => {
					setSummary(false);
					setStarted(false);
				}}
			/>
		</>
	);
}

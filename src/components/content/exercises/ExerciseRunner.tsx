'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ExerciseView, QuestionBlock } from '@/lib/server/exercises';
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
	exercises: ExerciseView[];
	titleHtml: string;
	theoryHref: string;
	nextHref: string | null;
}

/**
 * An exercise session: start card, one question at a time with immediate
 * correction, the summary at the end. "Riprova" asks the server for a fresh
 * set (every visit generates different numbers) and restarts from the first
 * question. Each question takes focus as it appears and the verdict is
 * announced, so the session works by keyboard and screen reader too.
 */
export function ExerciseRunner({ exercises, titleHtml, theoryHref, nextHref }: Props) {
	const router = useRouter();
	const [started, setStarted] = useState(false);
	const [index, setIndex] = useState(0);
	const [progress, setProgress] = useState<Progress[]>(() => Array(exercises.length).fill('unanswered'));
	const [selected, setSelected] = useState<number | null>(null);
	const [summary, setSummary] = useState(false);
	// Answers wider than their cell send the set back to one column; measured after render.
	const [narrow, setNarrow] = useState(false);
	const [current, setCurrent] = useState(exercises);
	const grid = useRef<HTMLDivElement>(null);
	const question = useRef<HTMLDivElement>(null);
	const exercise = exercises[index] ?? null;
	const correct = progress.filter((p) => p === 'correct').length;
	const estimated = exercises.length ? `${Math.max(5, Math.ceil(exercises.length * 1.5))} min` : '10 min';

	const reset = () => {
		setIndex(0);
		setProgress(Array(exercises.length).fill('unanswered'));
		setSelected(null);
		setSummary(false);
		setNarrow(false);
	};

	// A new set from the server (a retry) starts over from the first question.
	if (exercises !== current) {
		setCurrent(exercises);
		reset();
	}

	const start = () => {
		reset();
		setStarted(true);
	};
	const retry = () => {
		reset();
		router.refresh();
	};

	const answer = (i: number) => {
		if (selected !== null || !exercise) return;
		setSelected(i);
		setProgress((p) => p.map((s, k) => (k === index ? (exercise.options[i].isCorrect ? 'correct' : 'incorrect') : s)));
		// A mistake stays on screen longer: the right answer is shown next to it.
		setTimeout(() => {
			setSelected(null);
			if (index < exercises.length - 1) setIndex(index + 1);
			else setSummary(true);
		}, exercise.options[i].isCorrect ? 1100 : 2200);
	};

	// From the keyboard: 1-4 pick an answer (the number on its box), and a-d too, the letters of a written test.
	// Not while typing somewhere else on the page, not with a modifier held, not after the answer is given.
	useEffect(() => {
		if (!started || summary || !exercise) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
			const target = e.target as HTMLElement | null;
			if (target?.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"], [role="dialog"]')) return;
			const key = e.key.toLowerCase();
			const i = /^[1-9]$/.test(key) ? Number(key) - 1 : /^[a-z]$/.test(key) ? key.charCodeAt(0) - 97 : -1;
			if (i < 0 || i >= exercise.options.length) return;
			e.preventDefault();
			answer(i);
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
		// `answer` reads the state listed here; re-subscribing on each question keeps it current.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [started, summary, exercise, selected, index]);

	// Every question, the first one included, starts with the focus on its text.
	useEffect(() => {
		if (started && !summary) question.current?.focus({ preventScroll: true });
	}, [started, summary, index]);

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

	if (!started) return <StartScreen titleHtml={titleHtml} questionCount={exercises.length} estimatedTime={estimated} onStart={start} />;

	const verdict =
		selected === null || !exercise
			? ''
			: exercise.options[selected].isCorrect
				? 'Risposta corretta.'
				: `Risposta sbagliata. Quella giusta era: ${speakable(exercise.options.find((o) => o.isCorrect)?.text ?? '')}.`;

	return (
		<>
			<div id="esercizi" className="flex h-full w-full flex-col items-center gap-6 px-4 pb-6 pt-3 sm:gap-10 sm:px-8 sm:pb-10 sm:pt-6 md:px-10">
				<ProgressBar states={progress} current={index} />
				{exercise && (
					// The question at the top, the answers at the bottom of the page, the free space between them: a long problem
					// has all the room it needs and the answers never move (on phones they sit under the thumb).
					<div key={exercise.id} className="flex w-full max-w-2xl flex-1 flex-col justify-between gap-8 sm:gap-10 sm:pt-4">
						<div ref={question} tabIndex={-1} className="flex w-full animate-fade-in flex-col gap-5 break-words text-center outline-none">
							<span className="sr-only">
								Domanda {index + 1} di {exercises.length}.{' '}
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
						<div ref={grid} className={cn('grid w-full animate-fade-in auto-rows-fr gap-3', columns === 2 ? 'grid-cols-2' : 'grid-cols-1')} role="group" aria-label="Risposte">
							{exercise.options.map((option, i) => {
								const state: AnswerState = selected === null ? 'idle' : option.isCorrect ? 'correct' : selected === i ? 'incorrect' : 'muted';
								return (
									// An odd last answer takes the whole row instead of leaving a hole.
									<div key={i} className="h-full min-w-0 [&:nth-child(odd):last-child]:col-span-full">
										<AnswerButton html={option.html} number={i + 1} label={`Risposta ${i + 1}: ${speakable(option.text)}`} state={state} chosen={selected === i} locked={selected !== null} onClick={() => answer(i)} />
									</div>
								);
							})}
						</div>
					</div>
				)}
				<p className="sr-only" role="status" aria-live="assertive">
					{verdict}
				</p>
			</div>
			<SummarySheet open={summary} correct={correct} total={exercises.length} theoryHref={theoryHref} nextHref={nextHref} onRetry={retry} onClose={() => { setSummary(false); setStarted(false); }} />
		</>
	);
}

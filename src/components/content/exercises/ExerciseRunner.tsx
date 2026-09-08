'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ExerciseView } from '@/lib/server/exercises';
import { cn } from '@/lib/utils/cn';
import { Html } from '@/components/ui/Html';
import { StartScreen } from './StartScreen';
import { SummarySheet } from './SummarySheet';

type Progress = 'unanswered' | 'correct' | 'incorrect';

const PROGRESS_CLASS: Record<Progress, string> = { unanswered: 'bg-surface-4', correct: 'bg-ok', incorrect: 'bg-danger' };

/** One segment per question, coloured as it is answered; the whole row is one progress bar for assistive tech. */
function ProgressBar({ states }: { states: Progress[] }) {
	const answered = states.filter((s) => s !== 'unanswered').length;
	return (
		<div className="flex w-full gap-2 p-1" role="progressbar" aria-label="Avanzamento degli esercizi" aria-valuemin={0} aria-valuemax={states.length} aria-valuenow={answered} aria-valuetext={`${answered} di ${states.length} domande`}>
			{states.map((state, i) => (
				<div key={i} className={cn('h-2.5 flex-1 rounded-full transition-colors duration-500', PROGRESS_CLASS[state])} />
			))}
		</div>
	);
}

const ANSWER_CLASS: Record<Progress, string> = {
	unanswered: 'bg-surface border-edge hover:bg-surface-3 active:bg-surface-3',
	correct: 'z-10 scale-105 animate-pulse border-ok bg-ok text-white shadow-lg',
	incorrect: 'z-10 scale-105 animate-shake border-danger bg-danger text-white shadow-lg'
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
function AnswerButton({ html, label, state, locked, onClick }: { html: string; label: string; state: Progress; locked: boolean; onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			aria-pressed={state !== 'unanswered'}
			aria-disabled={locked || undefined}
			className={cn('relative flex h-full min-h-[56px] w-full min-w-0 items-center justify-center break-words rounded-xl border-2 px-3 py-3 text-base font-semibold transition-all duration-300 ease-in-out focus-ring sm:px-6 sm:py-4 sm:text-lg', ANSWER_CLASS[state])}
		>
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
	const question = useRef<HTMLHeadingElement>(null);
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
		setTimeout(() => {
			setSelected(null);
			if (index < exercises.length - 1) setIndex(index + 1);
			else setSummary(true);
		}, 1500);
	};

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
			<div id="esercizi" className="flex h-full w-full flex-col items-center justify-between gap-6 p-4 sm:p-8 md:px-10">
				<ProgressBar states={progress} />
				{exercise && (
					<div key={exercise.id} className="contents">
						<h2 ref={question} tabIndex={-1} className="w-full max-w-2xl animate-fade-in break-words text-lg font-bold text-fg outline-none sm:text-2xl">
							<span className="sr-only">
								Domanda {index + 1} di {exercises.length}.{' '}
							</span>
							{/* Long formulas scroll sideways inside this box; the padding leaves room for tall exponents and fractions. */}
							<Html html={exercise.questionHtml} className="math-content scroll-x px-2 py-3 text-center [&_.katex-display]:overflow-visible" />
						</h2>
						<div ref={grid} className={cn('mx-auto grid w-full max-w-2xl auto-rows-fr gap-3 sm:gap-4', columns === 2 ? 'grid-cols-2' : 'grid-cols-1')} role="group" aria-label="Risposte">
							{exercise.options.map((option, i) => (
								// An odd last answer takes the whole row instead of leaving a hole.
								<div key={i} className="h-full min-w-0 [&:nth-child(odd):last-child]:col-span-full">
									<AnswerButton html={option.html} label={`Risposta ${i + 1}: ${speakable(option.text)}`} state={selected === i ? (option.isCorrect ? 'correct' : 'incorrect') : 'unanswered'} locked={selected !== null} onClick={() => answer(i)} />
								</div>
							))}
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

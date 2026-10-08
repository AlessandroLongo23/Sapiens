'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, RotateCcw, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { buttonClass } from '@/components/ui/Button';
import type { DemoQuestion } from './data';

/*
 * A short run of exercises a visitor can do on the landing page, without an account: it
 * looks and answers like the real player (components/content/exercises/RunPlayer.tsx),
 * with the numbered answers, the keys 1 to 4 and the working after a mistake, but the
 * questions are a fixed handful checked in the browser.
 */

export type DemoResult = 'correct' | 'incorrect' | null;

type AnswerState = 'idle' | 'correct' | 'incorrect' | 'muted';

const ANSWER: Record<AnswerState, string> = {
	idle: 'border-edge bg-surface shadow-paper hover:-translate-y-px hover:border-edge-strong hover:shadow-lift active:translate-y-0 active:bg-surface-2',
	correct: 'border-ok bg-ok-soft text-ok-fg shadow-paper',
	incorrect: 'animate-nudge border-danger bg-danger-soft text-danger-fg shadow-paper',
	muted: 'border-edge-soft bg-surface opacity-45'
};
const BADGE: Record<AnswerState, string> = {
	idle: 'border-edge-strong text-fg-subtle',
	correct: 'border-ok bg-ok text-white',
	incorrect: 'border-danger bg-danger text-white',
	muted: 'border-edge text-fg-faint'
};
const BAR: Record<'correct' | 'incorrect' | 'current' | 'todo', string> = {
	correct: 'bg-ok',
	incorrect: 'bg-danger',
	current: 'bg-fg-subtle',
	todo: 'bg-surface-4'
};

const pad = (n: number) => String(n).padStart(2, '0');

export function MiniExercise({
	questions,
	onChange,
	className,
	ctaHref = '/pricing',
	ctaLabel = 'Continua con un account'
}: {
	questions: DemoQuestion[];
	/** Told after every answer and on a restart: the results so far, one per question. */
	onChange?: (results: DemoResult[]) => void;
	className?: string;
	ctaHref?: string;
	ctaLabel?: string;
}) {
	const box = useRef<HTMLDivElement>(null);
	const onScreen = useRef(false);
	const [index, setIndex] = useState(0);
	const [picked, setPicked] = useState<number | null>(null);
	const [results, setResults] = useState<DemoResult[]>(() => questions.map(() => null));
	const [done, setDone] = useState(false);
	const question = questions[index];
	const right = picked != null && picked === question.answer;
	const score = results.filter((r) => r === 'correct').length;

	const advance = useCallback(() => {
		setPicked(null);
		if (index + 1 < questions.length) setIndex(index + 1);
		else setDone(true);
	}, [index, questions.length]);

	const pick = useCallback(
		(i: number) => {
			if (picked != null || done) return;
			setPicked(i);
			const next = results.map((r, k) => (k === index ? (i === question.answer ? 'correct' : 'incorrect') : r));
			setResults(next);
			onChange?.(next);
		},
		[picked, done, results, index, question, onChange]
	);

	const restart = () => {
		const blank = questions.map(() => null);
		setIndex(0);
		setPicked(null);
		setDone(false);
		setResults(blank);
		onChange?.(blank);
	};

	// A right answer moves on by itself; a wrong one waits on the working.
	useEffect(() => {
		if (!right) return;
		const timer = setTimeout(advance, 1100);
		return () => clearTimeout(timer);
	}, [right, advance]);

	// The keys 1 to 4 answer and Enter moves on, while the exercise is on screen and nobody is typing elsewhere.
	useEffect(() => {
		const node = box.current;
		if (!node) return;
		const io = new IntersectionObserver(([entry]) => (onScreen.current = entry.isIntersecting), { threshold: 0.6 });
		io.observe(node);
		const onKey = (e: KeyboardEvent) => {
			if (!onScreen.current || e.metaKey || e.ctrlKey || e.altKey) return;
			const target = e.target as HTMLElement | null;
			if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
			if (/^[1-4]$/.test(e.key)) pick(Number(e.key) - 1);
			else if (e.key === 'Enter' && picked != null && !done && !(target && /^(BUTTON|A)$/.test(target.tagName))) advance();
		};
		window.addEventListener('keydown', onKey);
		return () => {
			io.disconnect();
			window.removeEventListener('keydown', onKey);
		};
	}, [pick, advance, picked, done]);

	const state = (i: number): AnswerState => {
		if (picked == null) return 'idle';
		if (i === question.answer) return 'correct';
		return i === picked ? 'incorrect' : 'muted';
	};

	return (
		<div ref={box} className={cn('flex w-full flex-col gap-6', className)}>
			<div className="flex items-center gap-4">
				<div className="flex flex-1 gap-1.5" role="progressbar" aria-label="Avanzamento della prova" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={results.filter(Boolean).length}>
					{results.map((r, i) => (
						<div key={i} className={cn('h-1.5 flex-1 rounded-full transition-colors duration-500', BAR[r ?? (i === index && !done ? 'current' : 'todo')])} />
					))}
				</div>
				<span className="label-mono shrink-0 tabular-nums text-fg-subtle" aria-hidden="true">
					{pad(done ? questions.length : index + 1)}
					<span className="text-fg-faint"> / {pad(questions.length)}</span>
				</span>
			</div>

			{done ? (
				<div className="flex animate-note-in flex-col items-center gap-5 py-4 text-center">
					<p className="label-mono text-fg-subtle">Prova finita</p>
					<p className="font-display text-5xl font-medium tracking-tight text-fg-strong tabular-nums">
						{score}
						<span className="text-fg-faint"> / {questions.length}</span>
					</p>
					<p className="max-w-sm text-base leading-relaxed text-fg-muted">
						{score === questions.length ? 'Tutte giuste. ' : score >= questions.length - 1 ? 'Quasi tutte. ' : ''}
						Nel percorso vero le domande cambiano a ogni ripetizione e i progressi restano salvati: la prossima volta riparti da qui.
					</p>
					<div className="flex flex-wrap items-center justify-center gap-3">
						<Link href={ctaHref} className={buttonClass('primary', 'lg', 'no-underline')}>
							{ctaLabel}
							<ArrowRight className="size-5" aria-hidden="true" />
						</Link>
						<button type="button" onClick={restart} className={buttonClass('ghost', 'lg')}>
							<RotateCcw className="size-4" aria-hidden="true" />
							Rifai
						</button>
					</div>
				</div>
			) : (
				<div key={index} className="flex flex-col gap-6">
					<div className="flex animate-note-in flex-col items-center gap-3 text-center">
						<p className="text-sm text-fg-muted">Risolvi l&apos;equazione</p>
						<p className="math-content font-display text-3xl font-medium text-fg-strong sm:text-4xl" dangerouslySetInnerHTML={{ __html: question.ask }} />
					</div>
					<div className="grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2" role="group" aria-label="Risposte">
						{question.options.map((html, i) => {
							const s = state(i);
							return (
								<div key={i} className="min-w-0 animate-step-in" style={{ animationDelay: `${40 + i * 30}ms` }}>
									<button
										type="button"
										onClick={() => pick(i)}
										aria-pressed={picked === i}
										aria-disabled={picked != null || undefined}
										aria-keyshortcuts={String(i + 1)}
										className={cn(
											'relative flex h-full min-h-[60px] w-full items-center justify-center rounded-xl border px-12 py-3 text-base font-medium text-fg-strong transition-[transform,box-shadow,background-color,border-color,opacity] duration-200 ease-out focus-ring sm:text-lg',
											ANSWER[s],
											s === 'correct' && picked === i && 'animate-answer-pop',
											s === 'correct' && picked !== i && 'delay-150',
											picked != null && 'cursor-default hover:translate-y-0'
										)}
									>
										<span className={cn('absolute left-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md border font-mono text-xs font-medium transition-colors duration-200', BADGE[s])} aria-hidden="true">
											{s === 'correct' ? <Check className="size-4 animate-badge-pop" strokeWidth={3} /> : s === 'incorrect' ? <X className="size-4 animate-badge-pop" strokeWidth={3} /> : i + 1}
										</span>
										<span className="math-content [&_.katex]:text-inherit" dangerouslySetInnerHTML={{ __html: html }} />
									</button>
								</div>
							);
						})}
					</div>
					{picked != null && !right && (
						<div className="flex flex-col gap-3">
							<section aria-label="Come si risolve" className="origin-top animate-panel-in overflow-hidden rounded-xl border border-edge bg-surface-2 text-left shadow-paper">
								<h3 className="label-mono flex items-center gap-2 border-b border-edge px-4 py-3 text-fg-subtle">
									<span className="flex size-5 items-center justify-center rounded-full bg-danger-soft text-danger-fg" aria-hidden="true">
										<X className="size-3" strokeWidth={3} />
									</span>
									Come si risolve
								</h3>
								<div className="p-4">
									<ol className="mb-3 flex flex-col gap-2">
										{question.steps.map((html, i) => (
											<li key={i} className="flex animate-step-in gap-3 text-base text-fg" style={{ animationDelay: `${250 + i * 220}ms` }}>
												<span className="mt-1 font-mono text-xs text-fg-faint tabular-nums" aria-hidden="true">
													{i + 1}
												</span>
												<span className="math-content" dangerouslySetInnerHTML={{ __html: html }} />
											</li>
										))}
									</ol>
									<p className="flex animate-step-in flex-wrap items-baseline gap-x-2 border-t border-edge pt-3 text-base font-medium text-fg-strong" style={{ animationDelay: `${250 + question.steps.length * 220}ms` }}>
										<span className="label-mono text-ok-fg">Soluzione</span>
										<span className="math-content" dangerouslySetInnerHTML={{ __html: question.solution }} />
									</p>
								</div>
							</section>
							<button type="button" onClick={advance} className="flex min-h-[52px] w-full animate-step-in items-center justify-center gap-2 rounded-xl bg-inverse px-6 py-3 font-semibold text-inverse-fg shadow-key transition-transform hover:opacity-90 active:translate-y-px focus-ring-offset" style={{ animationDelay: `${250 + (question.steps.length + 1) * 220}ms` }}>
								{index + 1 < questions.length ? 'Prossima domanda' : 'Vedi il risultato'}
								<ArrowRight className="size-5" aria-hidden="true" />
							</button>
						</div>
					)}
				</div>
			)}
			<p className="sr-only" role="status" aria-live="polite">
				{picked == null ? '' : right ? 'Risposta giusta.' : 'Risposta sbagliata: sotto trovi come si risolve.'}
			</p>
		</div>
	);
}

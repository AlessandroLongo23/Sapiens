'use client';

// Opened after a reload too, on pages whose layout may not load KaTeX's styles.
import 'katex/dist/katex.min.css';
import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { AnsweredView } from '@/lib/server/exercises';
import { Html } from '@/components/ui/Html';
import { Button } from '@/components/ui/Button';
import { Block } from './RunPlayer';

interface Props {
	/** What the run was: "Livello 3 · Sostituenti diversi", "Ripasso degli errori". */
	heading: ReactNode;
	correct: number;
	total: number;
	/** What the run meant: "Ci sei quasi", "Livello 3 superato". */
	outcome: string;
	results: AnsweredView[];
	backLabel: string;
	onBack: () => void;
	/** The buttons at the bottom, as in the summary: what to do next, the main one first. */
	actions: ReactNode;
}

/**
 * The mistakes of a finished run, with the whole page to themselves: the summary only says how the run went, and
 * sends here to look back at what went wrong. Each mistake is one row, the question on the left and on the right
 * the answer picked, the right one and the steps, already open: on a page there is room for them. On phones the
 * two halves stack.
 */
export function RunReview({ heading, correct, total, outcome, results, backLabel, onBack, actions }: Props) {
	const wrong = results.filter((r) => !r.verdict.correct).sort((a, b) => a.position - b.position);
	return (
		// data-wide-page: the lesson frame widens its middle column for this page (LessonFrame).
		<div data-wide-page className="mx-auto flex w-full max-w-5xl animate-note-in flex-col gap-6 px-4 pb-10 pt-4 sm:px-6">
			<header className="flex flex-wrap items-end justify-between gap-4 border-b border-edge pb-5">
				<div className="flex min-w-0 flex-col gap-1">
					<p className="flex min-w-0 items-baseline gap-2 text-sm">{heading}</p>
					<h2 className="font-display text-2xl font-semibold text-fg-strong sm:text-3xl">{wrong.length === 1 ? "L'errore della prova" : `Gli errori della prova (${wrong.length})`}</h2>
					<p className="text-fg-muted">
						<span className="font-medium text-fg tabular-nums">
							{correct}/{total}
						</span>{' '}
						risposte giuste · {outcome}
					</p>
				</div>
				<Button variant="secondary" onClick={onBack}>
					<ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
					{backLabel}
				</Button>
			</header>

			<ol className="flex flex-col gap-4">
				{wrong.map((mistake) => (
					<li key={mistake.position}>
						<MistakeRow mistake={mistake} />
					</li>
				))}
			</ol>

			<footer className="mx-auto flex w-full max-w-md flex-col gap-2 pt-2">{actions}</footer>
		</div>
	);
}

function MistakeRow({ mistake: { position, exercise, choice, verdict } }: { mistake: AnsweredView }) {
	return (
		<article className="overflow-hidden rounded-xl border border-edge bg-surface shadow-paper lg:grid lg:grid-cols-2">
			<div className="flex flex-col gap-3 p-4 sm:p-5">
				<p className="label-mono text-fg-faint">Domanda {position + 1}</p>
				{exercise.promptHtml && <Html html={exercise.promptHtml} className="math-content font-medium text-fg-strong" />}
				{exercise.blocks.length > 0 && (
					<div className="flex flex-col gap-2 text-center [&_.katex-display]:my-1">
						{exercise.blocks.map((block, i) => (
							<Block key={i} block={block} />
						))}
					</div>
				)}
			</div>
			<div className="flex flex-col gap-4 border-t border-edge bg-surface-2 p-4 sm:p-5 lg:border-l lg:border-t-0">
				<dl className="grid grid-cols-2 gap-2 text-sm">
					<div className="flex min-w-0 flex-col gap-1 rounded-lg border border-danger/40 bg-danger-soft px-3 py-2">
						<dt className="label-mono text-danger-fg">La tua risposta</dt>
						<dd className="min-w-0">
							<Html html={exercise.options[choice]?.html ?? ''} className="math-content scroll-x text-danger-fg [&_.katex-display]:my-0 [&_.katex]:text-inherit" />
						</dd>
					</div>
					<div className="flex min-w-0 flex-col gap-1 rounded-lg border border-ok/40 bg-ok-soft px-3 py-2">
						<dt className="label-mono text-ok-fg">Quella giusta</dt>
						<dd className="min-w-0">
							<Html html={exercise.options[verdict.correctIndex]?.html ?? ''} className="math-content scroll-x text-ok-fg [&_.katex-display]:my-0 [&_.katex]:text-inherit" />
						</dd>
					</div>
				</dl>
				<section aria-label="Come si risolve" className="flex flex-col gap-2">
					<h3 className="label-mono text-fg-subtle">Come si risolve</h3>
					{verdict.stepsHtml.length > 0 && (
						<ol className="flex flex-col gap-2">
							{verdict.stepsHtml.map((html, i) => (
								<li key={i} className="flex gap-3 text-sm leading-relaxed text-fg">
									<span className="mt-0.5 font-mono text-xs text-fg-faint tabular-nums" aria-hidden="true">
										{String(i + 1).padStart(2, '0')}
									</span>
									<Html html={html} className="math-content min-w-0 flex-1 break-words" />
								</li>
							))}
						</ol>
					)}
					{verdict.figureHtml && <Html html={verdict.figureHtml} className="flex justify-center py-1" />}
					<p className="flex flex-wrap items-baseline gap-x-2 border-t border-edge pt-2 text-sm font-medium text-fg-strong">
						<span className="label-mono text-ok-fg">Soluzione</span>
						<Html as="span" html={verdict.solutionHtml} className="math-content min-w-0 break-words" />
					</p>
				</section>
			</div>
		</article>
	);
}

'use client';

// Runs and mistakes are shown outside the lesson pages too (the list of mistakes, Oggi), where the layout does not load KaTeX's styles.
import 'katex/dist/katex.min.css';
import type { ReactNode } from 'react';
import { ChevronDown, X } from 'lucide-react';
import type { AnsweredView } from '@/lib/server/exercises';
import { Html } from '@/components/ui/Html';
import { Block } from './RunPlayer';

/**
 * One question answered wrong: the question, the answer picked, the right one, and the steps behind a tap, so a
 * list of them can be read through without scrolling past every solution. `heading` says where it comes from.
 */
export function MistakeCard({ mistake: { exercise, choice, verdict }, heading }: { mistake: AnsweredView; heading: ReactNode }) {
	return (
		<article className="overflow-hidden rounded-xl border border-edge bg-surface-2">
			<div className="flex flex-col gap-3 px-4 pb-3 pt-4">
				{heading}
				{exercise.promptHtml && <Html html={exercise.promptHtml} className="text-sm font-medium text-fg-strong" />}
				{exercise.blocks.length > 0 && (
					<div className="flex flex-col gap-2 text-center [&_.katex-display]:my-1">
						{exercise.blocks.map((block, i) => (
							<Block key={i} block={block} />
						))}
					</div>
				)}
				<dl className="grid gap-2 text-sm sm:grid-cols-2">
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
			</div>
			{verdict.stepsHtml.length > 0 && (
				<details className="group border-t border-edge">
					<summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-fg-muted transition-colors hover:text-fg focus-ring [&::-webkit-details-marker]:hidden">
						<span className="flex items-center gap-2">
							<span className="flex size-5 items-center justify-center rounded-full bg-danger-soft text-danger-fg" aria-hidden="true">
								<X className="size-3" strokeWidth={3} />
							</span>
							Come si risolve
						</span>
						<ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
					</summary>
					<ol className="flex flex-col gap-2 px-4 pb-4">
						{verdict.stepsHtml.map((html, i) => (
							<li key={i} className="flex gap-3 text-sm leading-relaxed text-fg">
								<span className="mt-0.5 font-mono text-xs text-fg-faint tabular-nums" aria-hidden="true">
									{String(i + 1).padStart(2, '0')}
								</span>
								<Html html={html} className="math-content min-w-0 flex-1 break-words" />
							</li>
						))}
						{verdict.figureHtml && (
							<li>
								<Html html={verdict.figureHtml} className="flex justify-center" />
							</li>
						)}
						<li className="flex flex-wrap items-baseline gap-x-2 border-t border-edge pt-2 text-sm font-medium text-fg-strong">
							<span className="label-mono text-ok-fg">Soluzione</span>
							<Html as="span" html={verdict.solutionHtml} className="math-content min-w-0 break-words" />
						</li>
					</ol>
				</details>
			)}
		</article>
	);
}

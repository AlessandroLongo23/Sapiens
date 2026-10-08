'use client';

import { useState } from 'react';
import { Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { MiniExercise, type DemoResult } from '../MiniExercise';
import type { DemoQuestion } from '../data';

/** The levels of the lesson the trial is taken from, as its exercise page lists them. */
const LEVELS = ['Equazioni pure e spurie', 'Coefficiente di x² uguale a 1', 'Coefficiente di x² diverso da 1', 'Il delta non è un quadrato', 'Termini in tutti e due i membri', 'Il delta è zero o negativo'];
const PASS = 4;

/**
 * The exercise of the hero and, under it, the path of the lesson's levels: the stretch
 * from the first level to the second fills with every right answer, and a run with
 * enough of them ticks the first level, as a repetition does in the real path.
 */
export function TrialSheet({ questions }: { questions: DemoQuestion[] }) {
	const [results, setResults] = useState<DemoResult[]>(() => questions.map(() => null));
	const right = results.filter((r) => r === 'correct').length;
	const over = results.every(Boolean);
	const passed = over && right >= PASS;
	return (
		<div className="lp-sheet relative">
			{/* a second sheet under the first, and the tape that holds them */}
			<span className="absolute inset-0 -z-10 rotate-[1.6deg] rounded-3xl border border-edge bg-surface-2 shadow-paper" aria-hidden="true" />
			<span className="absolute -top-3 left-14 z-10 h-6 w-28 rotate-[-3deg] bg-[#f3e2a6]/80 shadow-[0_1px_2px_rgba(60,50,20,0.15)] mix-blend-multiply dark:bg-[#e9d9a0]/60 dark:mix-blend-normal" aria-hidden="true" />
			<div className="rounded-3xl border border-edge-strong bg-surface shadow-lift">
				<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-edge px-5 py-3.5 sm:px-7">
					<p className="label-mono text-fg-subtle">
						Equazioni di secondo grado <span className="text-fg-faint">/</span> <span className="text-accent-fg">livello 1</span>
					</p>
					<p className="label-mono text-fg-faint">senza account</p>
				</div>
				<div className="px-5 pb-6 pt-5 sm:px-7 sm:pb-7">
					<MiniExercise questions={questions} onChange={setResults} />
				</div>
				<div className="grid-paper rounded-b-3xl border-t border-edge px-5 py-5 sm:px-7">
					<div className="flex items-center justify-between gap-4">
						<p className="label-mono text-fg-subtle">Il percorso della lezione</p>
						<p className="label-mono tabular-nums text-fg-subtle" aria-live="polite">
							{passed ? 'ripetizione superata' : `${right} giuste`}
						</p>
					</div>
					<ol className="mt-4 flex items-start">
						{LEVELS.map((name, i) => {
							const done = i === 0 && passed;
							const here = passed ? i === 1 : i === 0;
							return (
								<li key={name} className="relative flex min-w-0 flex-1 flex-col items-center gap-2 last:flex-none">
									{i < LEVELS.length - 1 && (
										<span className="absolute left-[calc(50%+1.25rem)] right-[calc(-50%+1.25rem)] top-[1.125rem] h-0.5 rounded-full bg-surface-4" aria-hidden="true">
											{i === 0 && <span className="block h-full origin-left rounded-full bg-ok transition-transform duration-500 ease-out-soft" style={{ transform: `scaleX(${passed ? 1 : right / questions.length})` }} />}
										</span>
									)}
									<span
										className={cn(
											'relative flex size-9 items-center justify-center rounded-xl border font-display text-base font-semibold transition-colors duration-300',
											done ? 'border-ok bg-ok text-white' : here ? 'border-inverse bg-inverse text-inverse-fg shadow-key' : 'border-dashed border-edge-strong bg-surface-2 text-fg-faint'
										)}
									>
										{done ? <Check className="size-4 animate-badge-pop" strokeWidth={3} aria-hidden="true" /> : here || i === 0 ? i + 1 : <Lock className="size-3.5" aria-hidden="true" />}
									</span>
									<span className={cn('label-mono hidden text-center sm:block', here ? 'text-accent-fg' : 'text-fg-faint')}>{here ? 'sei qui' : `liv. ${i + 1}`}</span>
									<span className="sr-only">
										Livello {i + 1}: {name}
										{done ? ', superato' : ''}
									</span>
								</li>
							);
						})}
					</ol>
				</div>
			</div>
		</div>
	);
}

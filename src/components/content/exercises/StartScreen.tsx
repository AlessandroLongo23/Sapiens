'use client';

import { Clock, FileQuestion, PenLine, Play } from 'lucide-react';
import { Html } from '@/components/ui/Html';
import { Sticker } from '@/components/ui/Sticker';

/** The card before an exercise session: what it is, how many questions, how long, and the start button. */
export function StartScreen({ titleHtml, questionCount, estimatedTime, onStart }: { titleHtml: string; questionCount: number; estimatedTime: string; onStart?: () => void }) {
	const figures = [
		{ icon: FileQuestion, value: questionCount, label: 'Domande' },
		{ icon: Clock, value: estimatedTime, label: 'Tempo stimato' }
	];
	return (
		<div className="flex h-full min-h-[60dvh] w-full flex-col items-center justify-center p-4 sm:p-6">
			<div className="w-full max-w-md animate-rise-in overflow-hidden rounded-2xl border border-edge bg-surface text-center shadow-lift">
				{/* The top of a test sheet: squared paper under the title. */}
				<div className="grid-paper flex flex-col items-center px-6 pb-6 pt-8 sm:px-8 md:px-10 md:pt-10">
					<Sticker icon={PenLine} className="mb-6" />
					<h2 className="mb-3 text-3xl font-semibold text-fg-strong">
						<Html as="span" html={titleHtml} className="math-inline" />
					</h2>
					<p className="leading-relaxed text-fg-subtle">Mettiti alla prova con questi esercizi. Non preoccuparti se sbagli, sei qui per imparare!</p>
				</div>
				<div className="grid grid-cols-2 border-y border-edge">
					{figures.map(({ icon: Icon, value, label }) => (
						<div key={label} className="flex flex-col items-center gap-1 p-4 first:border-r first:border-edge">
							<Icon className="mb-1 size-4 text-fg-faint" aria-hidden="true" />
							<span className="font-display text-3xl font-medium leading-none tracking-tight text-fg-strong tabular-nums">{value}</span>
							<span className="label-mono text-fg-subtle">{label}</span>
						</div>
					))}
				</div>
				<div className="p-6 sm:p-8">
					<button type="button" onClick={onStart} className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-inverse px-6 py-4 font-semibold text-inverse-fg shadow-key transition-transform hover:opacity-90 active:translate-y-px focus-ring-offset">
						<Play className="size-5 fill-current" aria-hidden="true" />
						<span>Inizia Esercizi</span>
					</button>
				</div>
			</div>
		</div>
	);
}

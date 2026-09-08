'use client';

import { Clock, FileQuestion, Play, Zap } from 'lucide-react';
import { Html } from '@/components/ui/Html';

/** The card before an exercise session: what it is, how many questions, how long, and the start button. */
export function StartScreen({ titleHtml, questionCount, estimatedTime, onStart }: { titleHtml: string; questionCount: number; estimatedTime: string; onStart?: () => void }) {
	const figures = [
		{ icon: FileQuestion, value: questionCount, label: 'Domande' },
		{ icon: Clock, value: estimatedTime, label: 'Tempo stimato' }
	];
	return (
		<div className="flex h-full min-h-[60dvh] w-full flex-col items-center justify-center p-4 sm:p-6">
			<div className="w-full max-w-md animate-rise-in overflow-hidden rounded-3xl border border-edge-soft bg-surface p-6 text-center shadow-xl sm:p-8 md:p-10">
				<div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-yellow-500/10">
					<Zap className="size-10 text-yellow-500" strokeWidth={2.5} aria-hidden="true" />
				</div>
				<h2 className="mb-3 text-2xl font-bold tracking-tight text-fg-strong sm:text-3xl">
					<Html as="span" html={titleHtml} className="math-inline" />
				</h2>
				<p className="mb-8 leading-relaxed text-fg-subtle">Mettiti alla prova con questi esercizi. Non preoccuparti se sbagli, sei qui per imparare!</p>
				<div className="mb-8 grid grid-cols-2 gap-4">
					{figures.map(({ icon: Icon, value, label }) => (
						<div key={label} className="flex flex-col items-center rounded-2xl border border-edge-soft bg-surface-2 p-4">
							<Icon className="mb-2 size-5 text-fg-faint" aria-hidden="true" />
							<span className="text-xl font-bold text-fg-strong">{value}</span>
							<span className="text-xs font-medium uppercase tracking-wider text-fg-subtle">{label}</span>
						</div>
					))}
				</div>
				<button type="button" onClick={onStart} className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-inverse px-6 py-4 font-semibold text-inverse-fg shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] focus-ring-offset">
					<Play className="size-5 fill-current" aria-hidden="true" />
					<span>Inizia Esercizi</span>
				</button>
			</div>
		</div>
	);
}

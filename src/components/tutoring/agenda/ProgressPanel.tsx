import Link from 'next/link';
import { EyeOff } from 'lucide-react';
import { WEEKDAYS_SHORT, weekdayOf } from '@/lib/tutoring/agenda';
import type { SharedProgress } from '@/lib/server/tutor-agenda';
import { Card } from '@/components/ui/Card';
import { Empty, Figure, Figures } from './Paper';

/** The last seven days as the squares of a register: a red tick where the student studied. */
export function WeekTicks({ week }: { week: SharedProgress['week'] }) {
	return (
		<ol className="flex gap-2" aria-label="Giorni di studio dell'ultima settimana">
			{week.map((d) => (
				<li key={d.day} className="relative flex flex-col items-center gap-1.5">
					<span className="relative flex size-9 items-center justify-center rounded-md border border-edge-strong bg-surface" aria-hidden="true">
						{d.counted && (
							<svg viewBox="0 0 24 24" className="absolute -top-1 left-0.5 size-9 text-accent" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
								<path d="M4 13.5c2 1.5 3.6 3.4 5 5.5C12 12 16 7.5 21 4" />
							</svg>
						)}
					</span>
					<span className="label-mono !text-[0.6rem] text-fg-subtle">{WEEKDAYS_SHORT[weekdayOf(d.day)]}</span>
					<span className="sr-only">{d.counted ? 'ha studiato' : 'non ha studiato'}</span>
				</li>
			))}
		</ol>
	);
}

/** The figures of a student's practice. */
export function ProgressFigures({ progress, compact }: { progress: SharedProgress; compact?: boolean }) {
	const rate = progress.answered > 0 ? Math.round((100 * progress.correct) / progress.answered) : null;
	return (
		<Figures label="Progressi in breve" compact={compact}>
			<Figure value={progress.streak} label={progress.streak === 1 ? 'giorno di fila' : 'giorni di fila'} />
			<Figure value={progress.daysStudied} label="giorni di studio" />
			<Figure value={progress.answered} label="esercizi fatti" />
			<Figure value={rate === null ? 'n.d.' : `${rate}%`} label="risposte giuste" />
		</Figures>
	);
}

/** Why there is nothing to read. */
export function NotShared({ name, joined }: { name: string; joined: boolean }) {
	return (
		<Card tone="dashed" className="flex items-start gap-3 p-6">
			<EyeOff className="mt-0.5 size-4 shrink-0 text-fg-faint" aria-hidden="true" />
			<div>
				<p className="text-sm font-medium text-fg">{joined ? `${name} non condivide i progressi.` : `I progressi arrivano quando ${name} accetta l'invito.`}</p>
				{joined && <p className="mt-1 text-sm text-fg-muted">Può attivarli dalla sua pagina &quot;Il mio tutor&quot;: la scelta è sua, e la può cambiare quando vuole.</p>}
			</div>
		</Card>
	);
}

/** The lessons a student has worked on, as a numbered index with the levels passed as squares filled in. */
export function ProgressLessons({ progress, name, limit }: { progress: SharedProgress; name: string; limit?: number }) {
	if (progress.lessons.length === 0) return <Empty>{name} non ha ancora fatto esercizi su Sapiens.</Empty>;
	return (
		<ol className="divide-y divide-edge">
			{progress.lessons.slice(0, limit ?? 50).map((l, i) => (
				<li key={l.path} className="flex items-center gap-4 py-3" data-progress-lesson={l.path}>
					<span className="label-mono w-5 shrink-0 text-fg-faint">{String(i + 1).padStart(2, '0')}</span>
					<div className="min-w-0 flex-1">
						<Link href={l.url} className="block truncate font-medium text-fg-strong hover:text-accent-fg">{l.title}</Link>
						<p className="truncate text-sm text-fg-subtle">{l.chapter}</p>
					</div>
					<div className="shrink-0 text-right">
						<div className="flex justify-end gap-1" aria-hidden="true">
							{Array.from({ length: l.total }, (_, n) => <span key={n} className={`size-3 rounded-[3px] border ${n < l.passed ? 'border-accent bg-accent' : 'border-edge-strong bg-surface'}`} />)}
						</div>
						<p className="label-mono mt-1 text-fg-subtle">{l.passed} di {l.total} livelli</p>
					</div>
				</li>
			))}
		</ol>
	);
}

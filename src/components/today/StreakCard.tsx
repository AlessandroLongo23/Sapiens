import { Check } from 'lucide-react';
import type { Streak } from '@/lib/exercises/streak';
import { STREAK_MIN_ANSWERS } from '@/lib/exercises/streak';
import type { WeekDay } from '@/lib/server/exercises';
import { cn } from '@/lib/utils/cn';

const WEEKDAY = new Intl.DateTimeFormat('it-IT', { weekday: 'narrow', timeZone: 'UTC' });

/** What the streak means today, in one line, without blame: a streak only ever asks for today's answers. */
function line(streak: Streak): string {
	const missing = Math.max(0, STREAK_MIN_ANSWERS - streak.todayAnswered);
	if (streak.today) return streak.best > streak.current ? `Oggi fatto. Il tuo record è di ${streak.best} giorni.` : 'Oggi fatto: è il tuo record.';
	if (streak.atRisk) return `Rispondi ad altre ${missing} ${missing === 1 ? 'domanda' : 'domande'} oggi per tenere la serie.`;
	return streak.todayAnswered > 0 ? `Ancora ${missing} ${missing === 1 ? 'domanda' : 'domande'} e oggi conta per la serie.` : `Rispondi a ${STREAK_MIN_ANSWERS} domande oggi per cominciare una serie.`;
}

/** The streak of days: how many in a row, the last seven days as boxes to tick, and what today still asks. */
export function StreakCard({ streak, week }: { streak: Streak; week: WeekDay[] }) {
	return (
		<section aria-labelledby="streak-title" className="rounded-2xl border border-edge bg-surface p-5 shadow-paper sm:p-6">
			<div className="flex items-baseline justify-between gap-4">
				<h2 id="streak-title" className="label-mono text-fg-subtle">
					Serie di giorni
				</h2>
				{streak.best > streak.current && <span className="label-mono text-fg-faint">Record {streak.best}</span>}
			</div>
			<p className="mt-2 flex items-baseline gap-2">
				<span className="font-display text-5xl font-semibold leading-none tracking-tight text-fg-strong tabular-nums">{streak.current}</span>
				<span className="text-lg text-fg-muted">{streak.current === 1 ? 'giorno' : 'giorni'} di fila</span>
			</p>
			<ol className="mt-5 grid grid-cols-7 gap-1.5" aria-label="Ultimi sette giorni">
				{week.map((d) => (
					<li key={d.day} className="flex flex-col items-center gap-1.5">
						<span className={cn('flex size-9 items-center justify-center rounded-lg border', d.counted ? 'border-ok bg-ok text-white' : d.today ? 'border-dashed border-edge-strong bg-surface-2' : 'border-edge bg-surface-2')} aria-label={`${d.day}: ${d.counted ? 'fatto' : d.today ? 'oggi, da fare' : 'no'}`}>
							{d.counted && <Check className="size-4" strokeWidth={3} aria-hidden="true" />}
						</span>
						<span className={cn('label-mono', d.today ? 'text-fg-strong' : 'text-fg-faint')} aria-hidden="true">
							{WEEKDAY.format(new Date(`${d.day}T12:00:00Z`))}
						</span>
					</li>
				))}
			</ol>
			<p className="mt-4 text-sm text-fg-muted">{line(streak)}</p>
		</section>
	);
}

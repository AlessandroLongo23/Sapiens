'use client';

import { Check } from 'lucide-react';
import type { DiaryView } from '@/lib/server/diary';
import type { DiaryEntry } from '@/lib/diary/entries';
import { daysBetween, dayOfMonth, monthName, relativeDay, weekdayName, type Day } from '@/lib/diary/dates';
import { Html } from '@/components/ui/Html';
import { cn } from '@/lib/utils/cn';
import { EntryList } from './Entries';
import { PlannedReview, SapiensNotes, StreakLine } from './SapiensNotes';
import type { useRuns } from './useRuns';

interface Props {
	view: DiaryView;
	entries: DiaryEntry[];
	runs: ReturnType<typeof useRuns>;
	fresh: string | null;
	error: string | null;
	onAdd: (input: Pick<DiaryEntry, 'day' | 'kind' | 'subject' | 'text' | 'topic'>) => Promise<boolean>;
	onPatch: (id: string, change: Partial<DiaryEntry>) => void;
	onDelete: (id: string) => void;
	onGo: (day: Day) => void;
}

/**
 * The page of a day, top to bottom: the date, what there is for school, what Sapiens suggests (today) or has
 * planned (a day to come), and what the student did (today and the days before), which the diary writes by itself.
 */
export function DayPage({ view, entries, runs, fresh, error, onAdd, onPatch, onDelete, onGo }: Props) {
	const { day, today, now, log, reviews, topics } = view;
	const ahead = daysBetween(today, day);
	const studied = view.studied.includes(day);
	const showLog = log && (ahead < 0 || log.answered > 0);

	return (
		<div className="flex flex-col gap-8">
			{/* The same height on every day, stamp or not, so nothing below moves when the page turns. */}
			<header className="relative flex h-[4.75rem] shrink-0 items-end border-b-[3px] border-double border-edge-strong pb-3 sm:h-[6.25rem] sm:pb-4">
				<div className="flex min-w-0 items-end gap-3 pr-20 sm:pr-24">
					<span className="font-display text-6xl font-semibold leading-[0.8] tracking-tight text-fg-strong tabular-nums sm:text-8xl">{dayOfMonth(day)}</span>
					<div className="flex min-w-0 flex-col gap-1">
						<span className="diary-pen text-[1.75rem] capitalize leading-none sm:text-[2rem]">{weekdayName(day)}</span>
						<span className="flex flex-wrap items-baseline gap-x-2">
							<span className="label-mono text-fg-subtle">
								{monthName(day)} {day.slice(0, 4)}
							</span>
							{ahead !== 0 && Math.abs(ahead) < 14 && <span className="pencil text-lg leading-none">{relativeDay(day, today)}</span>}
						</span>
					</div>
				</div>
				{now && now.streak.current > 0 ? (
					<span className="diary-stamp absolute right-0 top-0 origin-top-right max-sm:-top-2 max-sm:scale-[0.74]">
						<span>Serie</span>
						<span className="font-display text-2xl leading-none tracking-normal">{now.streak.current}</span>
						<span>{now.streak.current === 1 ? 'giorno' : 'giorni'}</span>
					</span>
				) : (
					studied && (
						<span className="diary-stamp absolute right-0 top-0 origin-top-right max-sm:-top-2 max-sm:scale-[0.74]">
							<Check className="size-6" strokeWidth={3} aria-hidden="true" />
							<span>Studiato</span>
						</span>
					)
				)}
			</header>

			<EntryList day={day} today={today} entries={entries} topics={topics} fresh={fresh} error={error} onAdd={onAdd} onPatch={onPatch} onDelete={onDelete} onGo={onGo} />

			{now && <SapiensNotes now={now} reviews={reviews} runs={runs} today={today} />}
			{!now && reviews.length > 0 && (
				<section aria-labelledby="planned-title" className="flex flex-col gap-4">
					<h2 id="planned-title" className="label-mono text-fg-subtle">
						Da Sapiens
					</h2>
					{reviews.map((r, i) => (
						<PlannedReview key={r.entry.id} review={r} day={day} tilt={i % 2 ? 1 : -1} />
					))}
				</section>
			)}

			{showLog && (
				<section aria-labelledby="log-title" className="postit mx-1 mt-1 pt-5" data-tone="paper" style={{ ['--tilt' as string]: '0.6deg' }}>
					<span className="diary-tape" aria-hidden="true" />
					<h2 id="log-title" className="label-mono mb-2 text-fg-subtle">
						{ahead === 0 ? 'Finora, oggi' : 'Com’è andata'}
					</h2>
					{log.answered === 0 ? (
						<p className="pencil text-xl">Nessun esercizio quel giorno.</p>
					) : (
						<ul className="flex flex-col gap-1.5 font-mono text-[0.8rem] leading-5 text-fg">
							<li className={cn('flex justify-between gap-3', log.runs.length > 0 && 'border-b border-dashed border-edge-strong pb-1.5')}>
								<span>Risposte</span>
								<span className="tabular-nums">
									{log.correct} giuste su {log.answered}
								</span>
							</li>
							{log.runs.map((r, i) => (
								<li key={i} className="flex items-baseline justify-between gap-3">
									<span className="min-w-0">
										{r.kind === 'practice' ? (
											'Pratica del giorno'
										) : r.kind === 'review' ? (
											'Ripasso degli errori'
										) : r.titleHtml ? (
											<Html as="span" html={r.titleHtml} className="math-inline" />
										) : (
											'Lezione'
										)}
										{(r.kind === 'level' || r.kind === 'jump') && <span className="text-fg-subtle">{r.kind === 'jump' ? ` · salto al liv. ${r.level}` : ` · liv. ${r.level}`}</span>}
									</span>
									<span className="shrink-0 tabular-nums">
										{r.passed ? (
											<span className="inline-flex items-center gap-1 font-semibold text-ok-fg">
												<Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> superato
											</span>
										) : r.answered < r.length ? (
											`${r.answered}/${r.length}`
										) : (
											`${r.correct}/${r.length}`
										)}
									</span>
								</li>
							))}
						</ul>
					)}
				</section>
			)}

			{now && <StreakLine streak={now.streak} />}
		</div>
	);
}

'use client';

import { CalendarDays, ChevronLeft, ChevronRight, Undo2 } from 'lucide-react';
import type { DiaryEntry } from '@/lib/diary/entries';
import { addDays, dayOfMonth, monthName, weekOf, weekdayShort, type Day } from '@/lib/diary/dates';
import { cn } from '@/lib/utils/cn';
import { HandCircle } from './Ink';
import { EntryDots } from './EntryDots';

/**
 * The week of the day open, above the diary: seven days with a dot for each thing written on them and a tick for
 * the days studied.
 */
export function WeekStrip({
	day,
	today,
	entries,
	studied,
	onGo,
}: {
	day: Day;
	today: Day;
	entries: DiaryEntry[];
	studied: Day[];
	onGo: (day: Day, dir?: 'next' | 'prev' | 'jump') => void;
}) {
	const week = weekOf(day);
	const arrow = 'flex size-[44px] shrink-0 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg focus-ring';
	return (
		<nav aria-label="Settimana">
			<div className="flex items-center gap-1">
				<button type="button" className={arrow} onClick={() => onGo(addDays(day, -7), 'prev')} aria-label="Settimana prima">
					<ChevronLeft className="size-5" aria-hidden="true" />
				</button>
				<ol className="grid flex-1 grid-cols-7 gap-1">
					{week.map((d) => {
						const selected = d === day;
						const own = entries.filter((e) => e.day === d && !e.hidden);
						return (
							<li key={d}>
								<button
									type="button"
									onClick={() => onGo(d)}
									aria-current={selected ? 'date' : undefined}
									aria-label={`${weekdayShort(d)} ${dayOfMonth(d)}${own.length ? `, ${own.length} ${own.length === 1 ? 'voce' : 'voci'}` : ''}${studied.includes(d) ? ', studiato' : ''}`}
									className={cn(
										'relative flex min-h-[3.75rem] w-full flex-col items-center justify-center gap-1.5 rounded-xl border pb-1.5 pt-1 transition-[background-color,box-shadow,transform] duration-200 focus-ring',
										selected ? '-translate-y-0.5 border-edge-strong bg-surface shadow-lift' : 'border-transparent hover:bg-surface/70'
									)}
								>
									<span className={cn('label-mono text-[0.6rem]', d === today ? 'text-accent-fg' : 'text-fg-subtle')}>{weekdayShort(d)}</span>
									<span className={cn('relative font-display text-lg leading-6 tabular-nums sm:text-xl', selected ? 'font-semibold text-fg-strong' : 'text-fg')}>
										{dayOfMonth(d)}
										{d === today && <HandCircle className="text-accent" />}
									</span>
									<EntryDots entries={own} studied={studied.includes(d)} />
								</button>
							</li>
						);
					})}
				</ol>
				<button type="button" className={arrow} onClick={() => onGo(addDays(day, 7), 'next')} aria-label="Settimana dopo">
					<ChevronRight className="size-5" aria-hidden="true" />
				</button>
			</div>
		</nav>
	);
}

/** The month of the day open, which opens the calendar, and the way back to today when away from it. */
export function MonthBar({ day, today, onGo, onCalendar, pending }: { day: Day; today: Day; onGo: (day: Day, dir?: 'next' | 'prev' | 'jump') => void; onCalendar: () => void; pending: boolean }) {
	return (
		<div className="flex flex-nowrap items-center gap-1">
			{pending && <span className="size-2 animate-pulse rounded-full bg-accent" aria-hidden="true" />}
			<button type="button" onClick={onCalendar} aria-haspopup="dialog" className="group flex min-h-[44px] items-center gap-2 rounded-lg px-2 focus-ring">
				<span className="flex items-baseline gap-1.5">
					<span className="font-display text-xl font-semibold capitalize leading-none text-fg-strong sm:text-2xl">{monthName(day)}</span>
					<span className="label-mono leading-none text-fg-subtle">{day.slice(0, 4)}</span>
				</span>
				<CalendarDays className="size-[1.1rem] text-fg-subtle transition-colors group-hover:text-accent-fg" aria-hidden="true" />
				<span className="sr-only">Apri il calendario</span>
			</button>
			{day !== today && (
				<button
					type="button"
					onClick={() => onGo(today, 'jump')}
					aria-label="Torna a oggi"
					title="Torna a oggi"
					className="flex size-[44px] shrink-0 items-center justify-center rounded-full border border-edge-strong bg-surface text-fg shadow-paper transition-colors hover:bg-surface-2 focus-ring"
				>
					<Undo2 className="size-4" aria-hidden="true" />
				</button>
			)}
		</div>
	);
}

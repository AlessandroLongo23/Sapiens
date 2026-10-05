import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { WEEKDAYS, WEEKDAYS_SHORT, addDay, romeParts, shortDay, type AgendaLesson } from '@/lib/tutoring/agenda';
import { buttonClass } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { HandCircle } from '@/components/diary/Ink';
import { subjectTone } from './Paper';

/**
 * The tutor's week as a planner on squared paper: a column a day (a list on a phone), today circled in red pen.
 * A lesson is a slip in the colour of its subject and opens the folder of its student; a proposal is a sticky note.
 */
export function WeekCalendar({ monday, today, lessons, now, subjects }: { monday: string; today: string; lessons: AgendaLesson[]; now: number; /** The subject of each link, for the colour of its slips. */ subjects: Record<string, string | null> }) {
	const days = Array.from({ length: 7 }, (_, i) => addDay(monday, i));
	const byDay = new Map<string, AgendaLesson[]>(days.map((d) => [d, []]));
	for (const lesson of lessons) byDay.get(romeParts(lesson.startsAt).day)?.push(lesson);
	const href = (day: string) => `/calendario?settimana=${day}`;
	return (
		<section aria-labelledby="settimana">
			<div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-edge-strong pb-2.5">
				<h2 id="settimana" className="text-2xl font-semibold text-fg-strong">
					{shortDay(days[0])} - {shortDay(days[6])} <span className="label-mono ml-1 text-fg-subtle">{days[6].slice(0, 4)}</span>
				</h2>
				<nav aria-label="Settimane" className="flex items-center gap-1">
					<Link href={href(addDay(monday, -7))} aria-label="Settimana precedente" className={buttonClass('ghost', 'icon')}><ChevronLeft className="size-4" aria-hidden="true" /></Link>
					<Link href="/calendario" className={buttonClass('secondary', 'sm', 'min-h-[44px]')}>Oggi</Link>
					<Link href={href(addDay(monday, 7))} aria-label="Settimana successiva" className={buttonClass('ghost', 'icon')}><ChevronRight className="size-4" aria-hidden="true" /></Link>
				</nav>
			</div>
			<ol className="overflow-hidden rounded-2xl border border-edge-strong bg-surface shadow-paper md:grid md:grid-cols-7 md:divide-x md:divide-edge max-md:divide-y max-md:divide-edge">
				{days.map((day, i) => {
					const list = byDay.get(day) ?? [];
					const isToday = day === today;
					return (
						<li key={day} className={cn('note-paper px-2 pb-3 pt-2 md:min-h-64', list.length === 0 && 'max-md:pb-2')} data-day={day}>
							<p className="flex items-center gap-2 px-1 md:mb-3 md:flex-col md:gap-1 md:pt-1">
								<span className={cn('label-mono', isToday ? 'text-accent-fg' : 'text-fg-subtle')}>
									<span className="md:hidden">{WEEKDAYS[i]}</span>
									<span className="max-md:hidden">{WEEKDAYS_SHORT[i]}</span>
								</span>
								<span className="relative flex size-9 items-center justify-center font-display text-xl font-semibold text-fg-strong tabular-nums">
									{Number(day.slice(8))}
									{isToday && (
										<HandCircle className="text-accent" />
									)}
								</span>
								{isToday && <span className="sr-only">oggi</span>}
								{list.length === 0 && <span className="ml-auto text-sm text-fg-subtle md:hidden">libero</span>}
							</p>
							{list.length > 0 && (
								<ul className="mt-2 space-y-2 md:mt-0">
									{list.map((l) => {
										const over = Date.parse(l.startsAt) + l.durationMin * 60_000 <= now;
										const end = romeParts(new Date(Date.parse(l.startsAt) + l.durationMin * 60_000)).time;
										return (
											<li key={l.id}>
												<Link
													href={`/studenti/${l.linkId}/lezioni`}
													data-subject={subjectTone(subjects[l.linkId] ?? null)}
													className={cn(
														'block rounded-md px-2.5 py-2 text-sm transition-transform hover:-translate-y-0.5 focus-ring',
														l.status === 'proposed' ? 'border border-dashed border-warn-edge bg-warn-soft' : 'border-l-[3px] border-tint-fg bg-tint-soft shadow-paper',
														over && 'opacity-60'
													)}
												>
													<span className="label-mono block text-fg-strong">{romeParts(l.startsAt).time}-{end}</span>
													<span className="block truncate font-medium text-fg-strong">{l.with}</span>
													{l.status === 'proposed' && <span className="block text-xs font-medium text-warn-fg">da confermare</span>}
												</Link>
											</li>
										);
									})}
								</ul>
							)}
						</li>
					);
				})}
			</ol>
		</section>
	);
}

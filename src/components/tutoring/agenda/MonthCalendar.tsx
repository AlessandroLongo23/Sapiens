'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { WEEKDAYS_SHORT, longDay, monthGrid, romeParts, shiftMonth, weekdayOf, type AgendaLesson } from '@/lib/tutoring/agenda';
import { subjectName } from '@/lib/tutoring/config';
import { HandCircle } from '@/components/diary/Ink';
import { buttonClass } from '@/components/ui/Button';
import { fieldClass } from '@/components/ui/Field';
import { Sheet } from '@/components/ui/Sheet';
import { cn } from '@/lib/utils/cn';
import { LessonForm, type LessonChoices } from './LessonForm';
import { Empty, subjectTone } from './Paper';

const MONTHS = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
/** How many lessons a square of the month shows before "+N". */
const SHOWN = 3;

/**
 * The tutor's month, as wide as the page: a square a day with its lessons, each in the colour of its subject.
 * The arrows move a month, the two menus jump to any month of any year, "Oggi" comes back. A click on a day
 * plans a lesson on it; a lesson opens the student's lessons. On a phone the month is the list of its days
 * with a lesson.
 */
export function MonthCalendar({ month, today, lessons, now, students, choices, years }: { month: string; today: string; lessons: AgendaLesson[]; now: number; students: { id: string; name: string; subject?: string | null }[]; choices: LessonChoices; /** The years the menu offers. */ years: number[] }) {
	const router = useRouter();
	const [adding, setAdding] = useState<string | null>(null);
	const days = monthGrid(month);
	const byDay = new Map<string, AgendaLesson[]>();
	for (const lesson of lessons) {
		const { day } = romeParts(lesson.startsAt);
		byDay.set(day, [...(byDay.get(day) ?? []), lesson]);
	}
	const href = (m: string) => `/calendario?mese=${m}`;
	const year = Number(month.slice(0, 4));
	const monthIndex = Number(month.slice(5, 7)) - 1;
	const canAdd = students.length > 0;
	const busyDays = days.filter((d) => d.startsWith(month) && byDay.has(d));

	const slip = (l: AgendaLesson, compact: boolean) => {
		const end = Date.parse(l.startsAt) + l.durationMin * 60_000;
		return (
			<Link
				key={l.id}
				href={`/studenti/${l.linkId}/lezioni`}
				data-subject={subjectTone(l.subject)}
				data-lesson={l.id}
				title={`${romeParts(l.startsAt).time}-${romeParts(new Date(end)).time} · ${l.with}${l.subject ? ` · ${subjectName(l.subject)}` : ''}`}
				className={cn(
					'block truncate rounded-md px-1.5 py-1 text-xs transition-colors focus-ring',
					l.status === 'proposed' ? 'border border-dashed border-warn-edge bg-warn-soft' : 'border-l-[3px] border-tint-fg bg-tint-soft hover:bg-tint-edge',
					end <= now && 'opacity-70',
					!compact && 'px-2.5 py-2 text-sm'
				)}
			>
				<span className="font-mono tabular-nums text-fg-strong">{romeParts(l.startsAt).time}</span> <span className="font-medium text-fg-strong">{l.with}</span>
				{!compact && l.subject && <span className="text-fg-muted"> · {subjectName(l.subject)}</span>}
				{l.status === 'proposed' && <span className="sr-only"> (da confermare)</span>}
			</Link>
		);
	};

	return (
		<section aria-labelledby="mese">
			<div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-edge-strong pb-3">
				<h2 id="mese" className="text-2xl font-semibold text-fg-strong">
					{MONTHS[monthIndex]} <span className="label-mono ml-1 text-fg-subtle">{year}</span>
				</h2>
				<nav aria-label="Mesi" className="flex flex-wrap items-center gap-2">
					<select aria-label="Vai al mese" value={monthIndex} onChange={(e) => router.push(href(`${year}-${String(Number(e.target.value) + 1).padStart(2, '0')}`))} className={cn(fieldClass, 'min-h-[44px] !w-auto py-1.5 pr-9 text-sm')}>
						{MONTHS.map((name, i) => <option key={name} value={i}>{name}</option>)}
					</select>
					<select aria-label="Vai all'anno" value={year} onChange={(e) => router.push(href(`${e.target.value}-${month.slice(5, 7)}`))} className={cn(fieldClass, 'min-h-[44px] !w-auto py-1.5 pr-9 text-sm')}>
						{[...new Set([...years, year])].sort().map((y) => <option key={y} value={y}>{y}</option>)}
					</select>
					<span className="flex items-center gap-1">
						<Link href={href(shiftMonth(month, -1))} aria-label="Mese precedente" className={buttonClass('ghost', 'icon')}><ChevronLeft className="size-4" aria-hidden="true" /></Link>
						<Link href="/calendario" className={buttonClass('secondary', 'sm', 'min-h-[44px]')}>Oggi</Link>
						<Link href={href(shiftMonth(month, 1))} aria-label="Mese successivo" className={buttonClass('ghost', 'icon')}><ChevronRight className="size-4" aria-hidden="true" /></Link>
					</span>
				</nav>
			</div>

			{/* A computer: the page of the month. */}
			<div className="hidden overflow-hidden rounded-2xl border border-edge-strong bg-surface shadow-paper md:block">
				<ol className="grid grid-cols-7 border-b border-edge-strong bg-surface-2" aria-hidden="true">
					{WEEKDAYS_SHORT.map((d, i) => <li key={d} className={cn('label-mono py-2 text-center', i > 4 ? 'text-accent-fg' : 'text-fg-subtle')}>{d}</li>)}
				</ol>
				<ol className="grid grid-cols-7">
					{days.map((day, i) => {
						const list = byDay.get(day) ?? [];
						const inMonth = day.startsWith(month);
						const isToday = day === today;
						return (
							<li key={day} data-day={day} className={cn('group relative min-h-28 border-edge p-1.5 xl:min-h-32', i % 7 !== 6 && 'border-r', i < days.length - 7 && 'border-b', !inMonth && 'bg-surface-2', i % 7 > 4 && inMonth && 'bg-surface-2/60')}>
								<div className="mb-1 flex items-center justify-between">
									<span className={cn('relative flex h-7 min-w-7 items-center justify-center px-1 font-display text-base font-semibold tabular-nums', inMonth ? 'text-fg-strong' : 'text-fg-faint')}>
										<span className="sr-only">{longDay(day)}{isToday ? ', oggi' : ''}: </span>
										<span aria-hidden="true">{Number(day.slice(8))}</span>
										{isToday && <HandCircle className="text-accent" />}
									</span>
									{canAdd && (
										<button type="button" aria-label={`Fissa una lezione ${longDay(day)}`} onClick={() => setAdding(day)} className="flex size-7 items-center justify-center rounded-md text-fg-subtle opacity-0 transition hover:bg-surface-3 hover:text-accent-fg focus-visible:opacity-100 group-hover:opacity-100 focus-ring">
											<Plus className="size-4" aria-hidden="true" />
										</button>
									)}
								</div>
								{list.length > 0 && (
									<ul className={cn('space-y-1', !inMonth && 'opacity-60')}>
										{list.slice(0, SHOWN).map((l) => <li key={l.id}>{slip(l, true)}</li>)}
										{list.length > SHOWN && <li className="px-1.5 text-xs text-fg-subtle">+{list.length - SHOWN} {list.length - SHOWN === 1 ? 'altra' : 'altre'}</li>}
									</ul>
								)}
							</li>
						);
					})}
				</ol>
			</div>

			{/* A phone: the days of the month that have a lesson. */}
			<div className="md:hidden">
				{busyDays.length === 0 ? (
					<Empty>Nessuna lezione in questo mese.</Empty>
				) : (
					<ol className="divide-y divide-edge border-y border-edge">
						{busyDays.map((day) => (
							<li key={day} className="flex gap-3 py-3">
								<p className="w-12 shrink-0 text-center">
									<span className={cn('label-mono block text-[0.6rem]', day === today ? 'text-accent-fg' : 'text-fg-subtle')}>{WEEKDAYS_SHORT[weekdayOf(day)]}</span>
									<span className="font-display text-xl font-semibold text-fg-strong tabular-nums">{Number(day.slice(8))}</span>
								</p>
								<ul className="min-w-0 flex-1 space-y-1.5">{(byDay.get(day) ?? []).map((l) => <li key={l.id}>{slip(l, false)}</li>)}</ul>
							</li>
						))}
					</ol>
				)}
			</div>

			<Sheet open={adding !== null} onClose={() => setAdding(null)} title="Fissa una lezione" align="center" width="md">
				{adding && <LessonForm side="tutor" students={students} today={today} day={adding} choices={choices} onDone={() => setAdding(null)} />}
			</Sheet>
		</section>
	);
}

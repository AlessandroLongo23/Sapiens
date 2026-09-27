'use client';

import type { DiaryEntry } from '@/lib/diary/entries';
import { KIND_LABEL } from '@/lib/diary/entries';
import { SUBJECT_BY_KEY, subjectStyle } from '@/lib/diary/subjects';
import { dayOfMonth, monthShort, relativeDay, schoolMonths, schoolYear, type Day } from '@/lib/diary/dates';
import { cn } from '@/lib/utils/cn';

/**
 * The tests to come as flags stuck out of the top edge, as a student marks the days to be ready for: the dates a
 * student wants to jump to, and few enough to fit on a phone.
 */
export function Flags({ tests, today, current, onGo }: { tests: DiaryEntry[]; today: Day; current: Day; onGo: (day: Day) => void }) {
	if (tests.length === 0) return null;
	return (
		<ul className="absolute bottom-full left-5 flex gap-1.5 sm:left-8 lg:left-10" aria-label="Verifiche in arrivo">
			{tests.map((t, i) => {
				const subject = t.subject ? SUBJECT_BY_KEY.get(t.subject) : undefined;
				const label = `${KIND_LABEL[t.kind]}${subject ? ` di ${subject.label.toLowerCase()}` : ''}, ${relativeDay(t.day, today)}`;
				return (
					<li key={t.id} className={cn(i === 2 && 'max-sm:hidden')}>
						<button
							type="button"
							data-subject
							style={subjectStyle(t.subject ?? 'matematica')}
							onClick={() => onGo(t.day)}
							aria-label={label}
							aria-current={t.day === current ? 'date' : undefined}
							title={label}
							className={cn('diary-flag focus-ring', t.day === current && '-translate-y-1.5')}
						>
							<span className="font-hand truncate text-lg font-semibold leading-6">{subject ? subject.label : KIND_LABEL[t.kind]}</span>
							<span className="label-mono shrink-0 pt-1 text-[0.6rem] opacity-80">
								{dayOfMonth(t.day)} {monthShort(t.day)}
							</span>
						</button>
					</li>
				);
			})}
		</ul>
	);
}

/** Hues of the month tabs, September to June: the colours of a paper diary's index. */
const MONTH_HUES = [18, 50, 85, 140, 190, 230, 262, 300, 340, 110];

/** A tab for every month of the school year on the right edge, from a wide screen up: one tap to any month. */
export function MonthTabs({ day, today, onGo }: { day: Day; today: Day; onGo: (day: Day) => void }) {
	const months = schoolMonths(schoolYear(day));
	const month = day.slice(0, 7);
	return (
		<nav aria-label="Mesi" className="diary-months">
			{months.map((m, i) => {
				const here = m.slice(0, 7) === month;
				// The month of today opens on today, any other on its first day.
				const target = m.slice(0, 7) === today.slice(0, 7) ? today : m;
				return (
					<button
						key={m}
						type="button"
						onClick={() => onGo(target)}
						aria-current={here ? 'true' : undefined}
						style={{ ['--h' as string]: MONTH_HUES[i] }}
						className="diary-month label-mono text-[0.6rem] focus-ring"
					>
						{monthShort(m)}
					</button>
				);
			})}
		</nav>
	);
}

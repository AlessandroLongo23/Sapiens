'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DiaryEntry } from '@/lib/diary/entries';
import { addMonths, dayOfMonth, monthGrid, monthName, weekOf, weekdayShort, type Day } from '@/lib/diary/dates';
import { cn } from '@/lib/utils/cn';
import { Sheet } from '@/components/ui/Sheet';
import { HandCircle } from './Ink';
import { EntryDots } from './EntryDots';
import { send } from './api';

/**
 * The month at a glance: where the tests fall, where there is room to review. A day opens its page. The month's
 * entries are asked for when it is shown, so the calendar reaches any month, not only the weeks the page loaded.
 */
export function CalendarSheet({ open, onClose, day, today, onGo }: { open: boolean; onClose: () => void; day: Day; today: Day; onGo: (day: Day) => void }) {
	const [month, setMonth] = useState(day.slice(0, 7) + '-01');
	const [data, setData] = useState<{
		month: Day;
		entries: DiaryEntry[];
		studied: Day[];
	} | null>(null);
	/** The month whose entries could not be read. */
	const [failedMonth, setFailedMonth] = useState<Day | null>(null);
	const [wasOpen, setWasOpen] = useState(open);
	const grid = monthGrid(month);

	// Opened again, it starts from the day open.
	if (open !== wasOpen) {
		setWasOpen(open);
		if (open) setMonth(day.slice(0, 7) + '-01');
	}

	useEffect(() => {
		if (!open) return;
		let live = true;
		const days = monthGrid(month);
		send<{ entries: DiaryEntry[]; studied: Day[] }>('GET', `/api/diario?da=${days[0]}&a=${days[days.length - 1]}`)
			.then((res) => live && setData({ month, ...res }))
			.catch(() => live && setFailedMonth(month));
		return () => {
			live = false;
		};
	}, [open, month]);

	const ready = data?.month === month ? data : null;
	const failed = failedMonth === month && !ready;
	const arrow = 'flex size-10 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg focus-ring';

	return (
		<Sheet open={open} onClose={onClose} title="Calendario" description="Tocca un giorno per aprire la sua pagina.">
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<button type="button" className={arrow} onClick={() => setMonth(addMonths(month, -1))} aria-label="Mese prima">
						<ChevronLeft className="size-5" aria-hidden="true" />
					</button>
					<p className="font-display text-2xl font-semibold capitalize text-fg-strong" aria-live="polite">
						{monthName(month)} <span className="label-mono align-middle text-fg-subtle">{month.slice(0, 4)}</span>
					</p>
					<button type="button" className={arrow} onClick={() => setMonth(addMonths(month, 1))} aria-label="Mese dopo">
						<ChevronRight className="size-5" aria-hidden="true" />
					</button>
				</div>
				<div className="grid grid-cols-7 gap-1 text-center" aria-busy={!ready && !failed}>
					{weekOf(month).map((d) => (
						<span key={d} className="label-mono pb-1 text-[0.6rem] text-fg-subtle">
							{weekdayShort(d)}
						</span>
					))}
					{grid.map((d) => {
						const inMonth = d.slice(0, 7) === month.slice(0, 7);
						const own = ready?.entries.filter((e) => e.day === d && !e.hidden) ?? [];
						return (
							<button
								key={d}
								type="button"
								onClick={() => onGo(d)}
								aria-current={d === day ? 'date' : undefined}
								className={cn(
									'flex min-h-[3.25rem] flex-col items-center justify-start gap-1 rounded-xl pt-1.5 transition-colors focus-ring',
									d === day ? 'bg-surface-3' : 'hover:bg-surface-2',
									!inMonth && 'opacity-35'
								)}
							>
								<span className={cn('relative font-display text-lg leading-6 tabular-nums', d === today ? 'font-semibold text-accent-fg' : 'text-fg')}>
									{dayOfMonth(d)}
									{d === today && <HandCircle className="text-accent" />}
								</span>
								<EntryDots entries={own} studied={!!ready?.studied.includes(d)} />
							</button>
						);
					})}
				</div>
				{failed && (
					<p role="alert" className="text-sm text-danger-fg">
						Il calendario non si è caricato. Riprova tra poco.
					</p>
				)}
				<ul className="flex flex-wrap gap-x-4 gap-y-1 border-t border-edge pt-3 text-xs text-fg-muted" aria-label="Legenda">
					<li className="flex items-center gap-1.5">
						<span className="size-2 rounded-full bg-accent" /> Verifica
					</li>
					<li className="flex items-center gap-1.5">
						<span className="size-2 rounded-full bg-warn" /> Interrogazione
					</li>
					<li className="flex items-center gap-1.5">
						<span className="size-2 rounded-full bg-[var(--pen)]" /> Compito
					</li>
					<li className="flex items-center gap-1.5">
						<span className="size-2 rounded-full bg-fg-faint" /> Promemoria
					</li>
				</ul>
			</div>
		</Sheet>
	);
}

import { Clock } from 'lucide-react';
import { WEEKDAYS, slotsByDay, type Slot } from '@/lib/tutoring/agenda';

/** The tutor's free hours of the week on the public profile. Days without any are left out. */
export function Availability({ slots }: { slots: Slot[] }) {
	if (slots.length === 0) return null;
	const days = slotsByDay(slots);
	return (
		<section aria-labelledby="orari" className="space-y-3">
			<h2 id="orari" className="flex items-center gap-2 text-lg font-semibold text-fg">
				<Clock className="size-5 text-fg-faint" aria-hidden="true" />
				Quando è libero
			</h2>
			<dl className="divide-y divide-edge overflow-hidden rounded-2xl border border-edge bg-surface text-sm">
				{days.map((list, weekday) =>
					list.length === 0 ? null : (
						<div key={weekday} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-4 py-2.5">
							<dt className="w-24 font-medium text-fg">{WEEKDAYS[weekday]}</dt>
							<dd className="flex flex-wrap gap-2 text-fg-muted tabular-nums">{list.map((s) => <span key={s.start}>{s.start}-{s.end}</span>)}</dd>
						</div>
					)
				)}
			</dl>
			<p className="text-xs text-fg-subtle">Orari indicativi: giorno e ora si concordano con il tutor.</p>
		</section>
	);
}

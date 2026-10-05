'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { MAX_SLOTS, WEEKDAYS, type Slot } from '@/lib/tutoring/agenda';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { useApi } from './useApi';

/**
 * The tutor's week as the timetable at the back of a school diary: a column a day on squared paper (a row a day
 * on a phone), each free stretch a slip as in the week's calendar with its two times to set. Saved as a whole and shown
 * on the public profile.
 */
export function AvailabilityEditor({ slots: initial }: { slots: Slot[] }) {
	const { busy, error, call } = useApi();
	const [slots, setSlots] = useState(initial);
	const [saved, setSaved] = useState(false);
	const change = (next: Slot[]) => {
		setSlots(next);
		setSaved(false);
	};
	const add = (weekday: number) => {
		const last = slots.filter((s) => s.weekday === weekday).at(-1);
		const start = last && last.end < '21:00' ? last.end : '15:00';
		const end = `${String(Math.min(Number(start.slice(0, 2)) + 2, 23)).padStart(2, '0')}:${start.slice(3)}`;
		change([...slots, { weekday, start, end }]);
	};
	const save = async () => {
		const done = await call<{ slots: Slot[] }>('availability', '/api/tutoring/availability', 'PUT', { slots });
		if (!done) return;
		setSlots(done.slots);
		setSaved(true);
	};
	// Not `fieldClass`, which is full width: a time is five figures in the mono, written on the block.
	const time = 'w-[5.4rem] rounded border border-transparent bg-transparent px-1 py-1 font-mono text-sm font-medium text-fg-strong tabular-nums outline-none transition hover:border-edge-strong focus:border-accent focus:bg-surface focus:ring-3 focus:ring-accent/20';
	const total = slots.reduce((sum, s) => sum + (Number(s.end.slice(0, 2)) * 60 + Number(s.end.slice(3)) - Number(s.start.slice(0, 2)) * 60 - Number(s.start.slice(3))) / 60, 0);

	return (
		<section className="space-y-5" aria-labelledby="orari-liberi">
			<div className="flex flex-wrap items-end justify-between gap-3 border-b border-edge-strong pb-2.5">
				<div>
					<h2 id="orari-liberi" className="text-2xl font-semibold text-fg-strong">Quando sei libero</h2>
					<p className="mt-1 text-sm text-fg-muted">Compare sul profilo pubblico, così chi ti scrive sa già se gli orari combaciano.</p>
				</div>
				{total > 0 && <p className="label-mono text-fg-subtle">{total.toLocaleString('it-IT', { maximumFractionDigits: 1 })} ore a settimana</p>}
			</div>
			{error && <Alert tone="error">{error}</Alert>}
			{saved && <Alert tone="success">Orari salvati.</Alert>}
			<ul className="overflow-hidden rounded-2xl border border-edge-strong bg-surface shadow-paper max-lg:divide-y max-lg:divide-edge lg:grid lg:grid-cols-7 lg:divide-x lg:divide-edge">
				{WEEKDAYS.map((name, weekday) => {
					const own = slots.map((slot, index) => ({ slot, index })).filter((x) => x.slot.weekday === weekday);
					return (
						<li key={name} className="note-paper flex gap-3 px-3 py-3 max-lg:items-start lg:min-h-72 lg:flex-col lg:px-2" data-weekday={weekday}>
							<p className="label-mono w-20 shrink-0 pt-2 text-fg-muted lg:w-auto lg:pb-1 lg:pt-1 lg:text-center">
								<span className="lg:hidden">{name}</span>
								<span className="max-lg:hidden">{name.slice(0, 3)}</span>
							</p>
							<div className="flex min-w-0 flex-1 flex-col gap-2">
								{own.length === 0 && <p className="pt-2 text-sm text-fg-subtle lg:pt-1 lg:text-center">non disponibile</p>}
								{own.map(({ slot, index }) => (
									<div key={index} className="relative rounded-md border-l-[3px] border-tint-fg bg-tint-soft px-1.5 py-1.5 shadow-paper">
										<div className="flex items-center gap-1 lg:flex-col lg:items-start lg:gap-0">
											<input type="time" step={900} aria-label={`${name}, dalle`} value={slot.start} onChange={(e) => change(slots.map((s, i) => (i === index ? { ...s, start: e.target.value } : s)))} className={time} />
											<span className="px-1 text-xs text-fg-muted" aria-hidden="true">fino alle</span>
											<input type="time" step={900} aria-label={`${name}, alle`} value={slot.end} onChange={(e) => change(slots.map((s, i) => (i === index ? { ...s, end: e.target.value } : s)))} className={time} />
										</div>
										<button type="button" aria-label={`Togli la fascia ${slot.start}-${slot.end} di ${name.toLowerCase()}`} onClick={() => change(slots.filter((_, i) => i !== index))} className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full border border-edge-strong bg-surface text-fg-muted shadow-paper hover:text-accent-fg focus-ring">
											<X className="size-3.5" aria-hidden="true" />
										</button>
									</div>
								))}
							</div>
							<button type="button" aria-label={`Aggiungi una fascia di ${name.toLowerCase()}`} disabled={slots.length >= MAX_SLOTS} onClick={() => add(weekday)} className="flex min-h-[44px] shrink-0 items-center justify-center gap-1 rounded-md border border-dashed border-edge-strong px-3 text-fg-muted transition-colors hover:border-accent-edge hover:text-accent-fg focus-ring disabled:opacity-50 lg:mt-auto">
								<Plus className="size-4" aria-hidden="true" />
								<span className="label-mono max-lg:sr-only">fascia</span>
							</button>
						</li>
					);
				})}
			</ul>
			<div className="flex justify-end">
				<Button loading={busy === 'availability'} onClick={save}>Salva gli orari</Button>
			</div>
		</section>
	);
}

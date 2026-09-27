'use client';

import { useCallback, useEffect, useRef, useState, useTransition, type PointerEvent as ReactPointerEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { DiaryView } from '@/lib/server/diary';
import type { DiaryEntry } from '@/lib/diary/entries';
import { isTest } from '@/lib/diary/entries';
import { addDays, daysBetween, type Day } from '@/lib/diary/dates';
import { DIARIO_ROOT } from '@/lib/config/site';
import { useLg } from '@/lib/hooks/use-media';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRuns } from './useRuns';
import { send } from './api';
import { MonthBar, WeekStrip } from './WeekStrip';
import { PenStroke } from '@/components/content/PageHeader';
import { CalendarSheet } from './CalendarSheet';
import { DayPage } from './DayPage';
import { OwnPage } from './OwnPage';
import { Flags, MonthTabs } from './BookEdges';
import './diary.css';

type Turn = 'next' | 'prev' | 'jump';

/** A drag across the page this long turns it. */
const TURN_DISTANCE = 70;

export const diaryUrl = (day: Day, today: Day) => (day === today ? DIARIO_ROOT : `${DIARIO_ROOT}?giorno=${day}`);

/**
 * The diary open on a day (vault/Decisioni/2026-09-26 Il diario prende il posto di Oggi.md). The server draws each
 * day; turning the page asks for the next one while the page turns. Entries change here first and on the server
 * right after, and go back if the server refuses.
 */
export function DiaryScreen({ view }: { view: DiaryView }) {
	const router = useRouter();
	const [pending, startTransition] = useTransition();
	const runs = useRuns();
	const [entries, setEntries] = useState<DiaryEntry[]>(view.entries);
	const [source, setSource] = useState(view);
	const [turn, setTurn] = useState<{ day: Day; dir: Turn } | null>(null);
	const [calendar, setCalendar] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [fresh, setFresh] = useState<string | null>(null);
	/** On a phone, which side of the sheet is up: the day, or the student's own page on the back. */
	const [side, setSide] = useState<'front' | 'back'>('front');
	const wide = useLg();
	const { day, today } = view;

	// A new day from the server replaces the entries kept here.
	if (source !== view) {
		setSource(view);
		setEntries(view.entries);
	}

	const go = useCallback(
		(target: Day, dir?: Turn) => {
			if (target === day) return;
			const n = daysBetween(day, target);
			setTurn({
				day: target,
				dir: dir ?? (Math.abs(n) === 1 ? (n > 0 ? 'next' : 'prev') : 'jump')
			});
			startTransition(() => router.push(diaryUrl(target, today), { scroll: false }));
		},
		[day, today, router]
	);

	// Arrows turn the page, unless the student is writing.
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.defaultPrevented || e.altKey || e.metaKey || e.ctrlKey) return;
			const target = e.target as HTMLElement | null;
			if (target?.closest('input, textarea, select, [contenteditable], [role="dialog"]')) return;
			if (e.key === 'ArrowRight') go(nextDay(day), 'next');
			else if (e.key === 'ArrowLeft') go(prevDay(day), 'prev');
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [day, go]);

	/* -------------------------------------------------------------- entries */

	const add = async (input: Pick<DiaryEntry, 'day' | 'kind' | 'subject' | 'text' | 'topic'>) => {
		const temp: DiaryEntry = {
			...input,
			id: `new-${Date.now()}`,
			done: false,
			hidden: false,
			source: 'studente'
		};
		setEntries((all) => [...all, temp]);
		setFresh(temp.id);
		setError(null);
		try {
			const { entry } = await send<{ entry: DiaryEntry }>('POST', '/api/diario/voci', input);
			setEntries((all) => all.map((e) => (e.id === temp.id ? entry : e)));
			setFresh(entry.id);
			return true;
		} catch (err) {
			setEntries((all) => all.filter((e) => e.id !== temp.id));
			setError((err as Error).message);
			return false;
		}
	};

	const patch = async (id: string, change: Partial<DiaryEntry>) => {
		const before = entries.find((e) => e.id === id);
		if (!before || id.startsWith('new-')) return;
		setEntries((all) => all.map((e) => (e.id === id ? { ...e, ...change } : e)));
		setError(null);
		try {
			const { entry } = await send<{ entry: DiaryEntry }>('PATCH', `/api/diario/voci/${id}`, change);
			setEntries((all) => all.map((e) => (e.id === id ? entry : e)));
		} catch (err) {
			setEntries((all) => all.map((e) => (e.id === id ? before : e)));
			setError((err as Error).message);
		}
	};

	const remove = async (id: string) => {
		const before = entries;
		setEntries((all) => all.filter((e) => e.id !== id));
		setError(null);
		try {
			await send('DELETE', `/api/diario/voci/${id}`);
		} catch (err) {
			setEntries(before);
			setError((err as Error).message);
		}
	};

	/* -------------------------------------------------------------- swipe */

	const leaves = useRef<HTMLDivElement>(null);
	const drag = useRef<{
		id: number;
		x: number;
		y: number;
		dx: number;
		locked: boolean;
	} | null>(null);
	const setShift = (dx: number, settle = false) => {
		const node = leaves.current;
		if (!node) return;
		node.style.transition = settle ? 'transform 0.3s var(--ease-out-soft)' : 'none';
		node.style.transform = dx ? `translateX(${dx * 0.45}px) rotate(${dx * 0.004}deg)` : '';
	};
	const onPointerDown = (e: ReactPointerEvent) => {
		if (e.pointerType === 'mouse' || drag.current) return;
		const target = e.target as HTMLElement;
		// A drag that starts on an entry still turns the page: once it is a drag the pointer is captured and no click follows.
		if (target.closest('input, textarea, select, .sticker, .diary-own.is-holding, .diary-curl, [role="dialog"]')) return;
		drag.current = {
			id: e.pointerId,
			x: e.clientX,
			y: e.clientY,
			dx: 0,
			locked: false
		};
	};
	const onPointerMove = (e: ReactPointerEvent) => {
		const d = drag.current;
		if (!d || d.id !== e.pointerId) return;
		const dx = e.clientX - d.x;
		const dy = e.clientY - d.y;
		if (!d.locked) {
			if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) return void (drag.current = null);
			if (Math.abs(dx) < 12) return;
			d.locked = true;
			(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		}
		d.dx = dx;
		setShift(dx);
	};
	const onPointerEnd = (e: ReactPointerEvent) => {
		const d = drag.current;
		if (!d || d.id !== e.pointerId) return;
		drag.current = null;
		setShift(0, true);
		if (d.locked && Math.abs(d.dx) >= TURN_DISTANCE) go(d.dx < 0 ? nextDay(day) : prevDay(day), d.dx < 0 ? 'next' : 'prev');
	};

	if (runs.player) return <div className="-mx-4 min-h-[70dvh] sm:mx-0">{runs.player}</div>;

	const tests = entries.filter((e) => isTest(e.kind) && !e.done && !e.hidden && daysBetween(today, e.day) >= 0).slice(0, 3);
	const dir = turn?.day === day ? turn.dir : undefined;

	return (
		<div className="flex flex-col gap-3">
			<header className="flex items-end justify-between gap-3 lg:justify-start lg:gap-8">
				<h1 className="w-fit shrink-0 font-display text-3xl font-semibold leading-none text-fg-strong sm:text-4xl">
					Diario
					<PenStroke className="mt-1" />
				</h1>
				<MonthBar day={day} today={today} onGo={go} onCalendar={() => setCalendar(true)} pending={pending} />
			</header>
			<WeekStrip day={day} today={today} entries={entries} studied={view.studied} onGo={go} />

			<div className="diary-book lg:mr-10">
				<div className="diary-cover" aria-hidden="true" />
				<Flags tests={tests} today={today} current={day} onGo={go} />
				<MonthTabs day={day} today={today} onGo={go} />

				<div ref={leaves} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd} aria-busy={pending}>
					<div className="diary-spread">
						<div className="diary-sheet" data-side={side}>
							<section aria-label="Il giorno" className="diary-leaf diary-leaf--left" inert={!wide && side === 'back'}>
								<div key={day} className="diary-turn diary-scroll px-4 pb-16 pt-5 sm:px-8 sm:pt-7" data-turn={dir}>
									<DayPage view={view} entries={entries} runs={runs} fresh={fresh} error={error} onAdd={add} onPatch={patch} onDelete={remove} onGo={go} />
								</div>
							</section>
							<section aria-label="La tua pagina" className="diary-leaf diary-leaf--right" inert={!wide && side === 'front'}>
								<div key={day} className="diary-turn diary-scroll" data-turn={dir}>
									<OwnPage day={day} today={today} page={view.page} />
								</div>
							</section>
						</div>
						<button type="button" className="diary-curl group focus-ring" onClick={() => setSide(side === 'front' ? 'back' : 'front')}>
							<span className="pencil absolute -bottom-8 right-1 whitespace-nowrap text-lg group-hover:text-fg">{side === 'front' ? 'la mia pagina' : 'il giorno'}</span>
						</button>
					</div>
				</div>
				<span className="diary-ribbon diary-ribbon--spine" aria-hidden="true" />
				<span className="diary-ribbon diary-ribbon--tail" aria-hidden="true" />
			</div>

			<p className="mt-10 flex items-center justify-center gap-1.5 text-xs text-fg-faint max-lg:hidden">
				<kbd className="flex size-5 items-center justify-center rounded border border-edge bg-surface shadow-paper">
					<ArrowLeft className="size-3" aria-label="Freccia a sinistra" />
				</kbd>
				<kbd className="flex size-5 items-center justify-center rounded border border-edge bg-surface shadow-paper">
					<ArrowRight className="size-3" aria-label="Freccia a destra" />
				</kbd>
				per sfogliare i giorni
			</p>
			<p className="mt-9 text-center text-xs text-fg-faint lg:hidden">Scorri la pagina di lato per cambiare giorno.</p>

			<CalendarSheet open={calendar} onClose={() => setCalendar(false)} day={day} today={today} onGo={(d) => (setCalendar(false), go(d, 'jump'))} />
		</div>
	);
}

const nextDay = (day: Day) => addDays(day, 1);
const prevDay = (day: Day) => addDays(day, -1);

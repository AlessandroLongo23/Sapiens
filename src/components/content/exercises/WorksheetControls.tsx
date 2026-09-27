'use client';

import { createContext, useContext, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CalendarDays, ChevronLeft, ChevronRight, Eye, EyeOff, FileCheck2, FileText, Printer } from 'lucide-react';
import { addDays, dayName, dayShort, FIRST_SHEET_DAY } from '@/lib/exercises/sheet-day';
import { cn } from '@/lib/utils/cn';
import { Html } from '@/components/ui/Html';
import { PeelSticker } from '@/components/content/flashcards/PeelSticker';

/**
 * The interactive parts of the worksheet (Worksheet.tsx renders the rest on the server): the results under their
 * stickers, the switch that uncovers them all, the index of the levels, the days and the printed copy.
 */

// ---------------------------------------------------------------------------------------------------------------
// Results

/** `all`: every sticker is off. `round` grows when they all go back on, so each result starts covered again. */
const Answers = createContext({ all: false, round: 0, setAll: (() => {}) as (all: boolean) => void });

export function SheetAnswers({ children }: { children: ReactNode }) {
	const [state, setState] = useState({ all: false, round: 0 });
	const setAll = (all: boolean) => setState((s) => ({ all, round: all ? s.round : s.round + 1 }));
	return <Answers.Provider value={{ ...state, setAll }}>{children}</Answers.Provider>;
}

/** The result under an exercise, covered by a sticker to peel, as on a flashcard. */
export function SheetAnswer({ number, html }: { number: number; html: string }) {
	const { all, round } = useContext(Answers);
	const [own, setOwn] = useState({ round, revealed: false });
	// Everything went back on: this one too.
	if (own.round !== round) setOwn({ round, revealed: false });
	const revealed = all || (own.round === round && own.revealed);
	return (
		// As wide as the result, and at least as a label: the sticker over it stays a sticker, not a bar across the page.
		<div data-answer className="relative mt-1 w-fit min-w-[min(100%,15rem)] max-w-full print:hidden">
			<div inert={!revealed} aria-hidden={!revealed} className="flex min-h-11 flex-wrap items-baseline gap-x-3 gap-y-1 rounded-lg border border-dashed border-edge-strong bg-surface-2/60 px-3 py-2.5">
				<span className="label-mono text-fg-subtle">Soluzione</span>
				<span className="sr-only">dell&apos;esercizio {number}: </span>
				<Html data-answer-html html={html} className="math-content min-w-0 break-words text-fg-strong" />
			</div>
			<PeelSticker key={round} size="strip" revealed={revealed} onPeel={() => setOwn({ round, revealed: true })} label={`Mostra la soluzione dell'esercizio ${number}`} />
		</div>
	);
}

/** Uncovers every result at once, to check a whole sheet; and covers them again. */
export function RevealAll({ className }: { className?: string }) {
	const { all, setAll } = useContext(Answers);
	const Icon = all ? EyeOff : Eye;
	return (
		<button type="button" onClick={() => setAll(!all)} aria-pressed={all} className={cn('inline-flex min-h-10 items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-3 hover:text-fg focus-ring', className)}>
			<Icon className="size-4 shrink-0" aria-hidden="true" />
			{all ? 'Ricopri le soluzioni' : 'Scopri tutte le soluzioni'}
		</button>
	);
}

// ---------------------------------------------------------------------------------------------------------------
// Index of the levels

export interface IndexLevel {
	level: number;
	name: string | null;
}

/** The levels beside the sheet, the one being read lit, each a jump to its section. */
export function LevelIndex({ levels }: { levels: IndexLevel[] }) {
	const [active, setActive] = useState(levels[0]?.level ?? 0);
	useEffect(() => {
		const sections = levels.map((l) => document.getElementById(`livello-${l.level}`)).filter((el): el is HTMLElement => !!el);
		// The one being read: the last to have started above the upper third of the screen, or the first.
		const update = () => {
			const line = window.innerHeight * 0.35;
			const current = sections.filter((s) => s.getBoundingClientRect().top < line).pop() ?? sections[0];
			if (current) setActive(Number(current.dataset.level));
		};
		update();
		window.addEventListener('scroll', update, { capture: true, passive: true });
		return () => window.removeEventListener('scroll', update, { capture: true });
	}, [levels]);

	return (
		<nav aria-label="Livelli della scheda">
			<p className="label-mono mb-3 text-fg-subtle">Livelli</p>
			<ol className="flex flex-col gap-0.5 border-l border-edge">
				{levels.map((l) => {
					const on = l.level === active;
					return (
						<li key={l.level}>
							<a
								href={`#livello-${l.level}`}
								aria-current={on ? 'location' : undefined}
								className={cn('-ml-px flex items-baseline gap-2.5 border-l-2 py-1.5 pl-3 pr-1 text-sm leading-snug transition-colors focus-ring', on ? 'border-fg-strong font-medium text-fg-strong' : 'border-transparent text-fg-muted hover:border-edge-strong hover:text-fg')}
							>
								<span className="w-3 shrink-0 font-mono text-xs tabular-nums text-fg-subtle">{l.level}</span>
								<span className="min-w-0 flex-1 text-pretty">{l.name ?? `Livello ${l.level}`}</span>
							</a>
						</li>
					);
				})}
			</ol>
		</nav>
	);
}

// ---------------------------------------------------------------------------------------------------------------
// Days

const dayHref = (path: string, day: string, today: string) => (day === today ? path : `${path}?giorno=${day}`);

/**
 * Yesterday, a calendar, tomorrow. The days behind today are the archive; there is no sheet ahead of today.
 * `nofollow`: one more page a day per lesson is not something for a crawler to walk.
 */
export function DayNav({ day, today, path }: { day: string; today: string; path: string }) {
	const prev = addDays(day, -1);
	const next = addDays(day, 1);
	const isToday = day === today;
	const step = 'flex size-10 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-3 hover:text-fg focus-ring';
	const off = 'flex size-10 items-center justify-center rounded-lg text-fg-faint opacity-40';

	return (
		<div role="group" aria-label="Giorno della scheda" className="relative flex items-center rounded-xl border border-edge bg-surface p-0.5 shadow-paper">
			{prev >= FIRST_SHEET_DAY ? (
				<Link href={dayHref(path, prev, today)} rel="nofollow" scroll={false} className={step} aria-label="Scheda del giorno prima" title="Il giorno prima">
					<ChevronLeft className="size-5" aria-hidden="true" />
				</Link>
			) : (
				<span className={off} aria-hidden="true">
					<ChevronLeft className="size-5" />
				</span>
			)}
			<DayCalendar day={day} today={today} path={path} />
			{isToday ? (
				<span className={off} aria-hidden="true">
					<ChevronRight className="size-5" />
				</span>
			) : (
				<Link href={dayHref(path, next, today)} rel="nofollow" scroll={false} className={step} aria-label="Scheda del giorno dopo" title="Il giorno dopo">
					<ChevronRight className="size-5" aria-hidden="true" />
				</Link>
			)}
		</div>
	);
}

const MONTH = new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const WEEKDAYS = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
const WEEKDAY_NAMES = ['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'];

/** `2026-09` plus `n` months. */
function addMonths(month: string, n: number): string {
	const d = new Date(`${month}-01T12:00:00Z`);
	d.setUTCMonth(d.getUTCMonth() + n);
	return d.toISOString().slice(0, 7);
}

/** The month's days in weeks from Monday, with nulls before the 1st and after the last. */
function weeks(month: string): (string | null)[][] {
	const first = new Date(`${month}-01T12:00:00Z`);
	const lead = (first.getUTCDay() + 6) % 7;
	const length = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
	const cells: (string | null)[] = [...Array(lead).fill(null), ...Array.from({ length }, (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`)];
	while (cells.length % 7) cells.push(null);
	return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
}

/**
 * The day of the sheet, on a month of the calendar: from the first sheet to today, the others out of reach.
 * The arrows move between days, Page Up and Page Down between months, Enter opens the day's sheet.
 */
function DayCalendar({ day, today, path }: { day: string; today: string; path: string }) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [focus, setFocus] = useState(day);
	const box = useRef<HTMLDivElement>(null);
	const trigger = useRef<HTMLButtonElement>(null);
	const grid = useRef<HTMLTableElement>(null);
	const month = focus.slice(0, 7);
	const inRange = (d: string) => d >= FIRST_SHEET_DAY && d <= today;
	const clamp = (d: string) => (d < FIRST_SHEET_DAY ? FIRST_SHEET_DAY : d > today ? today : d);

	const close = (refocus: boolean) => {
		setOpen(false);
		if (refocus) trigger.current?.focus();
	};
	const pick = (d: string) => {
		close(false);
		if (d !== day) router.push(dayHref(path, d, today), { scroll: false });
	};

	useEffect(() => {
		if (!open) return;
		const outside = (e: PointerEvent) => {
			if (!box.current?.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener('pointerdown', outside);
		return () => document.removeEventListener('pointerdown', outside);
	}, [open]);

	// The focused day takes the keyboard focus as it moves.
	useEffect(() => {
		if (open) grid.current?.querySelector<HTMLButtonElement>(`[data-day="${focus}"]`)?.focus();
	}, [open, focus]);

	const onKey = (e: ReactKeyboardEvent) => {
		const moves: Record<string, () => string> = {
			ArrowLeft: () => addDays(focus, -1),
			ArrowRight: () => addDays(focus, 1),
			ArrowUp: () => addDays(focus, -7),
			ArrowDown: () => addDays(focus, 7),
			PageUp: () => addMonths(focus, -1),
			PageDown: () => addMonths(focus, 1),
			Home: () => addDays(focus, -((new Date(`${focus}T12:00:00Z`).getUTCDay() + 6) % 7)),
			End: () => addDays(focus, 6 - ((new Date(`${focus}T12:00:00Z`).getUTCDay() + 6) % 7))
		};
		if (e.key === 'Escape') {
			e.preventDefault();
			close(true);
		} else if (moves[e.key]) {
			e.preventDefault();
			setFocus(clamp(moves[e.key]()));
		}
	};

	const canBack = addMonths(month, -1) >= FIRST_SHEET_DAY.slice(0, 7);
	const canForward = addMonths(month, 1) <= today.slice(0, 7);
	const arrow = 'flex size-9 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-3 hover:text-fg focus-ring disabled:pointer-events-none disabled:opacity-30';

	return (
		<div ref={box}>
			<button
				ref={trigger}
				type="button"
				onClick={() => {
					setFocus(day);
					setOpen(!open);
				}}
				aria-haspopup="dialog"
				aria-expanded={open}
				className={cn('flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-fg-strong transition-colors hover:bg-surface-3 focus-ring', open && 'bg-surface-3')}
			>
				<CalendarDays className="size-4 text-fg-subtle" aria-hidden="true" />
				<span className="tabular-nums">{day === today ? 'Oggi' : dayShort(day)}</span>
				<span className="sr-only">, scegli un altro giorno</span>
			</button>
			{open && (
				<div role="dialog" aria-label="Scegli il giorno della scheda" onKeyDown={onKey} className="absolute left-0 top-full z-30 mt-2 w-[18.5rem] animate-note-in rounded-2xl border border-edge bg-surface p-3 shadow-lift @3xl:left-auto @3xl:right-0">
					<div className="mb-2 flex items-center justify-between gap-2 pl-2">
						<p className="font-display text-lg font-semibold capitalize text-fg-strong" aria-live="polite">
							{MONTH.format(new Date(`${month}-01T12:00:00Z`))}
						</p>
						<div className="flex">
							<button type="button" className={arrow} disabled={!canBack} onClick={() => setFocus(clamp(addMonths(focus, -1)))} aria-label="Mese prima">
								<ChevronLeft className="size-4" aria-hidden="true" />
							</button>
							<button type="button" className={arrow} disabled={!canForward} onClick={() => setFocus(clamp(addMonths(focus, 1)))} aria-label="Mese dopo">
								<ChevronRight className="size-4" aria-hidden="true" />
							</button>
						</div>
					</div>
					<table ref={grid} role="grid" className="w-full border-separate border-spacing-0.5">
						<thead>
							<tr>
								{WEEKDAYS.map((w, i) => (
									<th key={i} scope="col" abbr={WEEKDAY_NAMES[i]} className="label-mono h-7 font-medium text-fg-faint">
										{w}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{weeks(month).map((week, w) => (
								<tr key={w}>
									{week.map((d, i) =>
										!d ? (
											<td key={i} />
										) : (
											<td key={d}>
												<button
													type="button"
													data-day={d}
													tabIndex={d === focus ? 0 : -1}
													disabled={!inRange(d)}
													aria-current={d === day ? 'date' : undefined}
													aria-label={`${dayName(d, true)}${d === today ? ', oggi' : ''}`}
													onClick={() => pick(d)}
													className={cn(
														'relative flex size-9 w-full items-center justify-center rounded-lg text-sm tabular-nums transition-colors focus-ring disabled:cursor-default disabled:text-fg-faint disabled:opacity-40',
														d === day ? 'bg-inverse font-semibold text-inverse-fg' : 'text-fg hover:bg-surface-3 disabled:hover:bg-transparent'
													)}
												>
													{Number(d.slice(8))}
													{/* Today: a dot under the number, as on a wall calendar. */}
													{d === today && <span className={cn('absolute bottom-1 size-1 rounded-full', d === day ? 'bg-inverse-fg' : 'bg-accent')} aria-hidden="true" />}
												</button>
											</td>
										)
									)}
								</tr>
							))}
						</tbody>
					</table>
					<div className="mt-2 flex items-center justify-between border-t border-edge-soft pl-2 pt-2">
						<p className="text-xs text-fg-subtle">Una scheda al giorno, dal {dayShort(FIRST_SHEET_DAY)}</p>
						<button type="button" onClick={() => pick(today)} className="min-h-9 rounded-lg px-3 text-sm font-medium text-fg-strong transition-colors hover:bg-surface-3 focus-ring">
							Oggi
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

// ---------------------------------------------------------------------------------------------------------------
// Printing

type PrintMode = 'none' | 'end';

export interface PrintMeta {
	/** The lesson, plain. */
	title: string;
	/** Subject and chapter, plain: "Matematica · Insiemi". */
	context: string;
	day: string;
	/** "domenica 27 settembre 2026". */
	dayName: string;
	count: number;
	/** The sheet's address for this day, relative. */
	href: string;
}

const node = (tag: string, className: string, text?: string) => {
	const el = document.createElement(tag);
	el.className = className;
	if (text) el.textContent = text;
	return el;
};

/**
 * The copy that goes to the printer, on <body> next to the app (print CSS in globals.css): a header with room for a
 * name, the sheet as it is on screen without stickers and results, and with `end` the results on a page of their
 * own, as at the back of a textbook. Built from the page itself, so it costs the page nothing until it is printed.
 */
function buildPrint(mode: PrintMode, meta: PrintMeta): HTMLElement | null {
	const source = document.querySelector('[data-sheet-content]');
	if (!source) return null;
	const root = node('div', 'paper-light');
	root.id = 'sheet-print';

	const head = node('header', 'sp-head');
	const titles = node('div', 'sp-titles');
	titles.append(node('p', 'sp-kicker', `Sapiens · ${meta.context}`), node('h1', 'sp-title', meta.title), node('p', 'sp-meta', `Scheda di ${meta.dayName} · ${meta.count} esercizi`));
	const fields = node('div', 'sp-fields');
	for (const label of ['Nome', 'Classe', 'Data']) {
		const field = node('p', 'sp-field');
		field.append(node('span', '', label), node('span', 'sp-line'));
		fields.append(field);
	}
	head.append(titles, fields);

	const body = source.cloneNode(true) as HTMLElement;
	body.removeAttribute('data-sheet-content');
	body.className = 'sp-body';
	body.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
	body.querySelectorAll('[data-no-print]').forEach((el) => el.remove());

	const solutions = node('section', 'sp-solutions');
	solutions.append(node('h2', 'sp-solutions-title', 'Soluzioni'), node('p', 'sp-meta', `${meta.title} · scheda di ${meta.dayName}`));
	body.querySelectorAll<HTMLElement>('[data-sheet-level]').forEach((level) => {
		const group = node('div', 'sp-solutions-level');
		group.append(node('h3', '', level.dataset.levelLabel ?? ''));
		const list = node('ol', '');
		level.querySelectorAll<HTMLElement>('[data-sheet-item]').forEach((item) => {
			const answer = item.querySelector('[data-answer-html]');
			if (!answer) return;
			const row = node('li', '');
			row.append(node('span', 'sp-num', `${item.dataset.number}.`), answer.cloneNode(true));
			list.append(row);
		});
		group.append(list);
		solutions.append(group);
	});
	body.querySelectorAll('[data-answer]').forEach((el) => el.remove());

	// The page has no margin, so the browser has no room for its own header and footer (address, date, page
	// number). The top and bottom margins are a table's head and foot, which the printer repeats on every page.
	const frame = node('table', 'sp-frame');
	const band = (tag: string) => {
		const part = node(tag, '');
		const row = node('tr', '');
		row.append(node('td', 'sp-band'));
		part.append(row);
		return part;
	};
	const content = node('td', '');
	content.append(head, body);
	if (mode === 'end') content.append(solutions);
	content.append(node('p', 'sp-foot', `Questa scheda e le altre, con la teoria: ${location.origin}${meta.href}`));
	const main = node('tbody', '');
	const row = node('tr', '');
	row.append(content);
	main.append(row);
	frame.append(band('thead'), main, band('tfoot'));
	root.append(frame);
	document.body.append(root);
	return root;
}

/**
 * Print or save as PDF, with or without the results. The PDF is the printer the browser offers ("Salva come PDF"):
 * the file gets the sheet's name from the page title, swapped for the occasion. Ctrl+P prints the sheet too, with
 * the results at the back.
 */
export function PrintMenu({ meta }: { meta: PrintMeta }) {
	const [open, setOpen] = useState(false);
	const box = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const close = (e: PointerEvent | KeyboardEvent) => {
			if (e instanceof KeyboardEvent ? e.key === 'Escape' : !box.current?.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener('pointerdown', close);
		document.addEventListener('keydown', close);
		return () => {
			document.removeEventListener('pointerdown', close);
			document.removeEventListener('keydown', close);
		};
	}, [open]);

	// The copy lives from `beforeprint` to `afterprint`, whatever started the printing.
	const metaRef = useRef(meta);
	useEffect(() => {
		metaRef.current = meta;
	});
	const mode = useRef<PrintMode>('end');
	useEffect(() => {
		let copy: HTMLElement | null = null;
		let title = '';
		const before = () => {
			if (copy || document.getElementById('note-print')) return;
			copy = buildPrint(mode.current, metaRef.current);
			title = document.title;
			const [y, m, d] = metaRef.current.day.split('-');
			document.title = `Scheda ${metaRef.current.title} ${d}-${m}-${y}${mode.current === 'end' ? ' con soluzioni' : ''}`;
		};
		const after = () => {
			copy?.remove();
			copy = null;
			if (title) document.title = title;
			mode.current = 'end';
		};
		window.addEventListener('beforeprint', before);
		window.addEventListener('afterprint', after);
		return () => {
			window.removeEventListener('beforeprint', before);
			window.removeEventListener('afterprint', after);
			after();
		};
	}, []);

	const print = (m: PrintMode) => {
		setOpen(false);
		mode.current = m;
		// After the menu has closed, so it is not in the way of the dialog.
		requestAnimationFrame(() => window.print());
	};

	const option = 'flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-surface-2 focus-ring';
	return (
		<div ref={box} className="relative">
			<button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="menu" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-edge bg-surface px-4 text-sm font-medium text-fg-strong shadow-paper transition-colors hover:border-edge-strong focus-ring">
				<Printer className="size-4" aria-hidden="true" />
				Stampa o PDF
			</button>
			{open && (
				<div role="menu" aria-label="Stampa la scheda" className="absolute right-0 top-full z-30 mt-2 w-[min(20rem,calc(100vw-2rem))] animate-note-in rounded-xl border border-edge bg-surface p-1.5 shadow-lift">
					<button type="button" role="menuitem" onClick={() => print('none')} className={option}>
						<FileText className="mt-0.5 size-5 shrink-0 text-fg-subtle" aria-hidden="true" />
						<span className="flex flex-col">
							<span className="font-medium text-fg-strong">Senza soluzioni</span>
							<span className="text-sm text-fg-muted">Solo gli esercizi, con lo spazio per il nome.</span>
						</span>
					</button>
					<button type="button" role="menuitem" onClick={() => print('end')} className={option}>
						<FileCheck2 className="mt-0.5 size-5 shrink-0 text-fg-subtle" aria-hidden="true" />
						<span className="flex flex-col">
							<span className="font-medium text-fg-strong">Con le soluzioni in fondo</span>
							<span className="text-sm text-fg-muted">Su una pagina a parte, come in fondo al libro.</span>
						</span>
					</button>
					<p className="mt-1 border-t border-edge-soft px-3 pb-1.5 pt-2.5 text-xs leading-relaxed text-fg-subtle">Per avere il PDF, nella finestra di stampa scegli «Salva come PDF» come stampante.</p>
				</div>
			)}
		</div>
	);
}

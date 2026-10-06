'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { tell, PAD } from '../engine/pad';
import { parseNumber, type Block, type BookPage, type FieldDef, type KitItem, type Notebook, type NotebookPage } from '../engine/notebook';
import { BuretteLens } from './BuretteLens';
import { TapedPhoto } from '../menu/TapedPhoto';

/*
 * The lab notebook on screen: two A5 pages side by side over the scene, scaled to fit the window. The mouse is a
 * cursor here: the tabs and the arrows turn the pages, the blanks are written in. What is written goes to the
 * notebook's model (engine/notebook.ts), which asks the experiment what it makes of it.
 *
 * With a controller: the bumpers turn the pages, the d-pad goes from blank to blank (up, down) and changes a number
 * or a choice (left, right); circle or B, or the button that opened it, closes it. Free text needs a keyboard.
 */

const PAGE = { w: 560, h: 792 };
const KIT_PER_PAGE = 4;

/** One A5 page of the book, as it is drawn. */
type Sheet =
	| { t: 'kit'; key: string; section: string; title: string; items: KitItem[]; n: number; of: number }
	| { t: 'outline'; key: string; section: string }
	| { t: 'step'; key: string; section: string }
	| { t: 'form'; key: string; section: string; page: Extract<BookPage, { kind: 'form' }> }
	| { t: 'free'; key: string; section: string; id: string; title: string }
	| { t: 'blank'; key: string; section: string };

function sheetsOf(pages: BookPage[]): Sheet[] {
	const out: Sheet[] = [];
	for (const p of pages) {
		if (p.kind === 'kit') {
			const n = Math.max(1, Math.ceil(p.items.length / KIT_PER_PAGE));
			for (let i = 0; i < n; i++) out.push({ t: 'kit', key: `kit${i}`, section: 'Strumenti', title: p.title, items: p.items.slice(i * KIT_PER_PAGE, (i + 1) * KIT_PER_PAGE), n: i + 1, of: n });
		} else if (p.kind === 'steps') {
			// a spread of its own: it starts on a left page
			if (out.length % 2) out.push({ t: 'blank', key: `blank${out.length}`, section: out[out.length - 1].section });
			out.push({ t: 'outline', key: 'steps', section: 'Procedimento' }, { t: 'step', key: 'step', section: 'Procedimento' });
		} else if (p.kind === 'form') out.push({ t: 'form', key: p.id, section: p.tab, page: p });
		else out.push({ t: 'free', key: p.id, section: 'Appunti', id: p.id, title: p.title });
	}
	if (out.length % 2) out.push({ t: 'blank', key: 'blank-end', section: out[out.length - 1]?.section ?? '' });
	return out;
}

export function Quaderno({ book, font, message, onClose }: { book: Notebook; font: string; message?: string | null; onClose: () => void }) {
	const snap = useSyncExternalStore(book.subscribe, book.getSnapshot, book.getSnapshot);
	const sheets = useMemo(() => sheetsOf(book.pages), [book.pages]);
	const sections = useMemo(() => [...new Set(sheets.map((s) => s.section))], [sheets]);
	const first = (key: string) => Math.max(0, sheets.findIndex((s) => s.key === key || s.section === key));
	// where the student was, unless the experiment asks for a page
	const [spread, setSpreadState] = useState(() => (book.goto ? Math.floor(first(book.goto.page) / 2) : (book.lastSpread ?? Math.floor(first('steps') / 2))));
	const [picked, setPicked] = useState<string | null>(null);
	const pendingFocus = useRef<string | null>(null);
	const [scale, setScale] = useState(1);
	const root = useRef<HTMLDivElement>(null);
	const last = Math.max(0, sheets.length / 2 - 1);
	// a page turned: what was being typed is judged, and the place is remembered
	const setSpread = (to: number | ((s: number) => number)) => {
		book.settle();
		setSpreadState((s) => {
			const n = Math.max(0, Math.min(last, typeof to === 'number' ? to : to(s)));
			book.lastSpread = n;
			return n;
		});
	};
	const turn = (by: number) => setSpread((s) => s + by);

	useLayoutEffect(() => {
		const fit = () => setScale(Math.max(0.55, Math.min(1.4, (window.innerWidth - 130) / (PAGE.w * 2), (window.innerHeight - 96) / PAGE.h)));
		fit();
		window.addEventListener('resize', fit);
		return () => window.removeEventListener('resize', fit);
	}, []);

	// the experiment may open it at a page, with the cursor in a blank
	useEffect(() => {
		const g = book.take();
		if (!g) return;
		pendingFocus.current = g.field ?? null;
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setSpread(Math.floor(first(g.page) / 2));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [snap.version]);
	// the cursor goes in the blank asked for, once its page is drawn
	useEffect(() => {
		const id = pendingFocus.current;
		if (!id) return;
		const el = root.current?.querySelector<HTMLElement>(`[data-field="${id}"]`);
		if (el) {
			pendingFocus.current = null;
			el.focus();
		}
	});

	// the keys: Esc or B closes (B only when it is not being typed), the arrows turn the pages
	useEffect(() => {
		const typing = (e: KeyboardEvent) => {
			const t = e.target as HTMLElement | null;
			return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT');
		};
		const key = (e: KeyboardEvent) => {
			if (e.code === 'Escape') {
				e.preventDefault();
				return onClose();
			}
			if (typing(e)) return;
			if (e.code === 'KeyB' && !e.repeat) onClose();
			else if (e.code === 'ArrowRight' || e.code === 'PageDown') turn(1);
			else if (e.code === 'ArrowLeft' || e.code === 'PageUp') turn(-1);
		};
		window.addEventListener('keydown', key);
		return () => window.removeEventListener('keydown', key);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onClose, last]);

	// the controller
	useEffect(() => {
		let raf = 0;
		let was: boolean[] | null = null;
		let held = 0;
		let next = 0;
		const blanks = () => [...(root.current?.querySelectorAll<HTMLElement>('[data-field]:not(:disabled)') ?? [])];
		const loop = () => {
			raf = requestAnimationFrame(loop);
			const pads = [...(navigator.getGamepads?.() ?? [])].filter((x): x is Gamepad => !!x && x.connected);
			const g = pads.find((x) => x.mapping === 'standard') ?? pads[0];
			if (!g) return;
			const down = g.buttons.map((b) => b.pressed);
			// the button that opened it is still down in the first frame
			if (!was) return void (was = down);
			const hit = (i: number) => down[i] && !was![i];
			if (hit(PAD.east) || hit(PAD.select) || hit(PAD.start)) onClose();
			if (hit(PAD.r1)) turn(1);
			if (hit(PAD.l1)) turn(-1);
			const dir = (hit(PAD.down) ? 1 : 0) - (hit(PAD.up) ? 1 : 0);
			const el = document.activeElement as HTMLElement | null;
			if (dir) {
				const all = blanks();
				const i = all.indexOf(el as HTMLElement);
				(i < 0 ? all[dir > 0 ? 0 : all.length - 1] : all[(i + dir + all.length) % all.length])?.focus();
			}
			// cross (A): the value is written
			if (hit(PAD.south) && el?.dataset.field) el.blur();
			// left and right change a value: one step at a press, then faster and faster while held
			const side = (down[PAD.right] ? 1 : 0) - (down[PAD.left] ? 1 : 0);
			const now = performance.now();
			if (!side) held = 0;
			else if (hit(PAD.right) || hit(PAD.left)) {
				held = now;
				next = now + 350;
				if (el?.dataset.field) el.dispatchEvent(new CustomEvent('nudge', { detail: side }));
			} else if (now >= next && el?.dataset.field) {
				const t = (now - held) / 1000;
				// a tenth of a second apart at first, then in steps of 2, 5, 20
				el.dispatchEvent(new CustomEvent('nudge', { detail: side * (t < 1.2 ? 1 : t < 2.4 ? 2 : t < 3.6 ? 5 : 20) }));
				next = now + 90;
			}
			was = down;
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onClose, last]);

	// what goes on at the bench while the eyes are here (a stopcock left open)
	const [, tick] = useState(0);
	useEffect(() => {
		const t = setInterval(() => tick((n) => n + 1), 300);
		return () => clearInterval(t);
	}, []);
	const warn = book.live.warn?.() ?? '';
	const left = sheets[spread * 2];
	const right = sheets[spread * 2 + 1];
	// one tab is lit: the one chosen, if its page is in sight, or the left page's
	const lit = picked && (left?.section === picked || right?.section === picked) ? picked : left?.section;
	const draw = (s: Sheet | undefined, side: 'l' | 'r') =>
		s ? (
			<Paper side={side} n={sheets.indexOf(s) + 1} key={s.key}>
				{s.t === 'kit' && <KitPage title={s.title} items={s.items} n={s.n} of={s.of} />}
				{s.t === 'outline' && book.steps && <Outline page={book.steps} />}
				{s.t === 'step' && book.steps && <Step page={book.steps} />}
				{s.t === 'form' && <Form book={book} page={s.page} />}
				{s.t === 'free' && <Free book={book} id={s.id} title={s.title} />}
			</Paper>
		) : null;

	return (
		<div
			ref={root}
			role="dialog"
			aria-modal="true"
			aria-label="Quaderno di laboratorio"
			className="absolute inset-0 z-30 flex items-center justify-center bg-[#15121f]/55 pt-6 backdrop-blur-[2px] select-text"
			style={{ ['--hand' as string]: font }}
			onMouseDown={(e) => e.button === 0 && e.target === e.currentTarget && onClose()}
		>
			<div style={{ width: PAGE.w * 2 * scale, height: PAGE.h * scale }} className="relative">
				{/* the tabs, on the top edge */}
				<div className="absolute bottom-full left-6 flex items-end gap-1.5">
					{sections.map((s) => (
						<button
							key={s}
							onClick={() => {
								setPicked(s);
								setSpread(Math.floor(first(s) / 2));
							}}
							aria-current={lit === s ? 'page' : undefined}
							className={`rounded-t-lg px-3.5 pb-1.5 pt-2 text-[13px] font-semibold tracking-wide ${lit === s ? 'bg-[#fbf8ef] text-[#2c3340]' : 'bg-[#d9d2bf] text-[#5b6170] hover:bg-[#ece6d6]'}`}
						>
							{s}
						</button>
					))}
					{snap.readOnly && <span className="mb-1 ml-2 rounded-md bg-[#c23b33] px-2.5 py-1 text-[12px] font-bold tracking-[0.14em] text-white uppercase">sola lettura</span>}
				</div>
				<button onClick={onClose} aria-label="Chiudi il quaderno" className="absolute -right-11 -top-1 grid size-9 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/30">
					<X className="size-5" />
				</button>
				<div style={{ width: PAGE.w * 2, height: PAGE.h, transform: `scale(${scale})`, transformOrigin: '0 0' }} className="flex overflow-hidden rounded-[10px] shadow-[0_18px_60px_rgba(8,6,16,0.6)]">
					{draw(left, 'l')}
					{draw(right, 'r')}
				</div>
				{spread > 0 && (
					<button onClick={() => turn(-1)} aria-label="Pagina prima" className="absolute -left-12 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/30">
						<ChevronLeft className="size-6" />
					</button>
				)}
				{spread < last && (
					<button onClick={() => turn(1)} aria-label="Pagina dopo" className="absolute -right-12 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/30">
						<ChevronRight className="size-6" />
					</button>
				)}
				<div className="absolute left-0 top-full flex w-full items-start justify-between gap-6 pt-2.5 text-[13px] text-white/85">
					<div role="status" aria-live="polite" className="min-h-[20px] max-w-[72%] text-[14px] leading-snug">
						{warn && <span className="mr-2 rounded bg-[#8a5a12] px-1.5 py-0.5 text-[12.5px] font-semibold">{warn}</span>}
						{tell(book.hint) || message || (snap.readOnly ? 'Sola lettura: per scrivere servono tutte e due le mani libere.' : '')}
					</div>
					<div className="shrink-0 text-white/60">B o Esc per chiudere · frecce per sfogliare</div>
				</div>
			</div>
		</div>
	);
}

/** An A5 page of squared paper. */
function Paper({ side, n, children }: { side: 'l' | 'r'; n: number; children: React.ReactNode }) {
	return (
		<div
			style={{ width: PAGE.w, height: PAGE.h, backgroundImage: 'linear-gradient(#dfe6ec 1px, transparent 1px), linear-gradient(90deg, #dfe6ec 1px, transparent 1px)', backgroundSize: '24px 24px', backgroundPosition: '-1px -1px' }}
			className={`relative shrink-0 bg-[#fbf8ef] text-[#2c3340] ${side === 'l' ? 'shadow-[inset_-18px_0_22px_-18px_rgba(60,50,30,0.35)]' : 'shadow-[inset_18px_0_22px_-18px_rgba(60,50,30,0.35)]'}`}
		>
			<div className="absolute inset-0 px-9 pb-10 pt-8">{children}</div>
			<div className={`absolute bottom-3 text-[12px] text-[#9aa1ab] ${side === 'l' ? 'left-9' : 'right-9'}`}>{n}</div>
		</div>
	);
}

const H1 = 'font-display text-[27px] font-semibold leading-tight text-[#1f2f52]';
const KICKER = 'text-[11px] font-semibold tracking-[0.2em] text-[#8a6f3c] uppercase';
const HAND = { fontFamily: 'var(--hand), cursive' };

/** The bench, a thing a row: its photo taped to the page, and beside it, written on the paper, what it is. */
function KitPage({ title, items, n, of }: { title: string; items: KitItem[]; n: number; of: number }) {
	return (
		<>
			<div className={KICKER}>Sul banco{of > 1 ? ` · ${n} di ${of}` : ''}</div>
			<h2 className={H1}>{title}</h2>
			<div className="mt-6 flex flex-col gap-[26px]">
				{items.map((it, i) => (
					<div key={it.name} className="flex items-center gap-6">
						<TapedPhoto src={it.image} alt="" small ratio="aspect-[4/3]" tilt={i % 2 ? 1.6 : -1.8} sizes="200px" className="w-[168px] shrink-0" />
						<div className="min-w-0">
							<div className="font-display text-[21px] font-semibold leading-[24px] text-[#1f2f52]">{it.name}</div>
							{it.formula && <div className="mt-0.5 font-mono text-[13px] leading-[24px] text-[#1d4f91]">{it.formula}</div>}
							<div className="text-[14.5px] leading-[24px] text-[#3a4250]">{it.text}</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
}

/** The left page of the steps' spread: every step, and where the work is. */
function Outline({ page }: { page: NotebookPage }) {
	return (
		<>
			<div className={KICKER}>{page.kicker ?? ''}</div>
			<h2 className={H1}>{page.title}</h2>
			<p className="mt-3 text-[15px] leading-[24px] text-[#3a4250]">{page.intro}</p>
			{page.rows && (
				<table className="mt-4 w-full text-[14.5px] leading-[24px]" style={HAND}>
					<tbody>
						{page.rows.map(([a, b]) => (
							<tr key={a} className="border-b border-[#c9d3dc]">
								<td className="pr-3 text-[17px] text-[#3a4250]">{a}</td>
								<td className="text-right text-[18px] font-bold text-[#1f2f6f]">{b}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
			{page.outline && !page.rows && (
				<ol className="mt-5 space-y-[3px]">
					{page.outline.map((o, i) => (
						<li key={i} className={`flex items-baseline gap-2.5 text-[15px] leading-[24px] ${o.state === 'now' ? 'font-semibold text-[#1f2f52]' : o.state === 'done' ? 'text-[#7d8591]' : 'text-[#4a5260]'}`}>
							<span className={`grid size-[18px] shrink-0 translate-y-[3px] place-items-center rounded-full border text-[11px] leading-none ${o.state === 'done' ? 'border-[#2e7d4f] bg-[#2e7d4f] text-white' : o.state === 'now' ? 'border-[#c23b33] text-[#c23b33]' : 'border-[#9aa1ab] text-[#9aa1ab]'}`}>
								{o.state === 'done' ? '✓' : i + 1}
							</span>
							<span className={o.state === 'done' ? 'line-through decoration-[#9aa1ab]' : ''}>{o.title}</span>
						</li>
					))}
				</ol>
			)}
		</>
	);
}

/** The right page: the step in hand, task by task, or how it went. */
function Step({ page }: { page: NotebookPage }) {
	return (
		<>
			<div className={KICKER}>{page.steps ?? 'Procedimento'}</div>
			<ul className="mt-3 space-y-2">
				{page.tasks.map((t, i) => (
					<li key={i} className="flex items-start gap-2.5 text-[19px] leading-[24px]" style={HAND}>
						<span className={`mt-[3px] grid size-[17px] shrink-0 place-items-center rounded-[4px] border-2 text-[13px] font-bold ${t.state === 'done' ? 'border-[#2e7d4f] text-[#2e7d4f]' : t.state === 'bad' ? 'border-[#c23b33] text-[#c23b33]' : t.state === 'now' ? 'border-[#1f2f6f]' : 'border-[#9aa1ab]'}`}>
							{t.state === 'done' ? '✓' : t.state === 'bad' ? '✗' : ''}
						</span>
						<span className={t.state === 'done' && !page.keep && !page.rows ? 'text-[#8a919c] line-through' : t.state === 'now' ? 'font-bold text-[#1f2f6f]' : t.state === 'todo' ? 'text-[#5b6370]' : ''}>{t.text}</span>
					</li>
				))}
			</ul>
			{page.hint && (
				<p className="absolute inset-x-9 bottom-12 border-t border-dashed border-[#b9c2cc] pt-2 text-[19px] leading-[24px] text-[#4f5765]" style={HAND}>
					{tell(page.hint)}
				</p>
			)}
		</>
	);
}

function Form({ book, page }: { book: Notebook; page: Extract<BookPage, { kind: 'form' }> }) {
	return (
		<>
			<div className={KICKER}>Da compilare</div>
			<h2 className={H1}>{page.title}</h2>
			<div className="mt-3 space-y-3">
				{page.blocks.map((b, i) => (
					<BlockView key={i} book={book} block={b} />
				))}
			</div>
		</>
	);
}

function BlockView({ book, block }: { book: Notebook; block: Block }) {
	if (block.type === 'text') return <p className="text-[14px] leading-[24px] text-[#3a4250]">{block.text}</p>;
	if (block.type === 'heading') return <h3 className="pt-1 text-[12px] font-semibold tracking-[0.16em] text-[#8a6f3c] uppercase">{block.text}</h3>;
	if (block.type === 'table')
		return (
			<table className="w-full border-collapse bg-white/60 text-[13.5px]">
				<thead>
					<tr>
						{block.head.map((h) => (
							<th key={h} className="border border-[#9fb0bf] bg-[#e9eef2] px-2 py-1 text-left text-[12px] font-semibold leading-tight">
								{h}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{block.rows.map((row, r) => (
						<tr key={r}>
							{row.map((cell, c) => (
								<td key={c} className="h-[34px] border border-[#9fb0bf] px-2 py-0.5">
									{typeof cell === 'string' ? cell : <Field book={book} def={cell} fill label={`${typeof row[0] === 'string' ? row[0] : ''}, ${block.head[c] ?? ''}`} />}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		);
	if (block.type === 'fields')
		return (
			<div className="space-y-1.5">
				{block.items.map((it) => (
					<label key={it.field.id} className="flex items-baseline justify-between gap-3 text-[14px] leading-[24px]">
						<span>{it.label}</span>
						<Field book={book} def={it.field} label={it.label} />
					</label>
				))}
			</div>
		);
	if (block.type === 'swatches')
		return (
			<div>
				<div className="mb-1 text-[12px] font-semibold tracking-[0.16em] text-[#8a6f3c] uppercase">{block.title}</div>
				<div className="flex flex-wrap gap-x-3 gap-y-2">
					{block.items.map((s) => (
						<div key={s.label} className="flex w-[110px] flex-col items-center text-center">
							<div className="h-9 w-full rounded-md border border-black/15 shadow-inner" style={{ background: s.color }} />
							<div className="mt-0.5 text-[12px] font-semibold leading-tight">{s.label}</div>
							{s.note && <div className="text-[11px] leading-tight text-[#6b7280]">{s.note}</div>}
						</div>
					))}
				</div>
			</div>
		);
	if (block.type === 'burette') return <Burette book={book} />;
	return <Lines book={book} id={block.id} rows={block.rows} placeholder={block.placeholder} />;
}

/** The burette as it stands now, beside the table its readings go in. */
function Burette({ book }: { book: Notebook }) {
	const [, tick] = useState(0);
	useEffect(() => {
		const t = setInterval(() => tick((n) => n + 1), 120);
		return () => clearInterval(t);
	}, []);
	const now = book.live.burette?.();
	if (!now) return null;
	return (
		<div className="flex items-center gap-4">
			{'level' in now ? <BuretteLens level={now.level} /> : <div className="grid h-[300px] w-[190px] shrink-0 place-items-center rounded-[20px] border-2 border-dashed border-[#9fb0bf] px-3 text-center text-[13px] leading-snug text-[#6b7280]">{now.why}</div>}
			<p className="text-[13.5px] leading-[22px] text-[#3a4250]">
				La buretta, com&apos;è adesso. Il valore è dove il <b>fondo del menisco</b> tocca la scala. I numeri crescono verso il basso; ogni tacca vale 0,1 mL, e tra due tacche si stima la metà: 0,05 mL.
			</p>
		</div>
	);
}

function Field({ book, def, fill, label }: { book: Notebook; def: FieldDef; fill?: boolean; label?: string }) {
	const ref = useRef<HTMLInputElement & HTMLSelectElement>(null);
	const acc = useRef(0);
	const value = book.values[def.id] ?? '';
	const mark = book.marks[def.id];
	const inked = book.inked.has(def.id);
	// not its turn (a reading of a titration not begun), or the bench does not allow it now: closed, with the reason
	const why = inked || book.readOnly ? '' : book.blocked(def.id);
	const off = book.readOnly || inked || !!why;
	// a notch of the wheel, or the controller's d-pad: a number goes up or down a step, a choice to the next one
	const nudge = (by: number) => {
		if (off) return;
		if (def.kind === 'number') {
			const step = def.step ?? 1;
			const now = parseNumber(value) ?? (def.seed ? parseNumber(book.values[def.seed]) : null) ?? 0;
			book.type(def.id, Math.max(0, Math.round((now + by * step) / step) * step).toFixed(def.decimals ?? 0).replace('.', ','));
		} else if (def.kind === 'choice' && def.options) {
			const i = def.options.findIndex((o) => o.value === value);
			const n = def.options.length;
			book.type(def.id, def.options[i < 0 ? (by > 0 ? 0 : n - 1) : (((i + by) % n) + n) % n].value);
			book.commit(def.id);
		}
	};
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const onNudge = (e: Event) => nudge((e as CustomEvent<number>).detail);
		const onWheel = (e: WheelEvent) => {
			if (document.activeElement !== el || def.kind !== 'number') return;
			e.preventDefault();
			// a notch of a wheel is a step; a trackpad's stream of small moves adds up to one
			acc.current += e.deltaY;
			if (Math.abs(acc.current) < 40) return;
			nudge(acc.current < 0 ? 1 : -1);
			acc.current = 0;
		};
		el.addEventListener('nudge', onNudge);
		el.addEventListener('wheel', onWheel, { passive: false });
		return () => {
			el.removeEventListener('nudge', onNudge);
			el.removeEventListener('wheel', onWheel);
		};
	});
	const ink = mark === 'ok' ? 'text-[#1f2f6f]' : mark === 'wrong' ? 'text-[#c23b33] decoration-wavy underline decoration-[#c23b33]' : 'text-[#4a5260]';
	const box = `rounded-[3px] border-0 bg-transparent p-0 text-[19px] font-bold leading-[26px] shadow-none outline-none ring-0 transition focus:bg-[#fff3c4]/70 focus:ring-0 disabled:opacity-100 ${ink} ${inked || book.readOnly ? '' : why ? 'cursor-not-allowed border-b-2 border-dotted border-[#c9d1d9]' : 'border-b-2 border-dotted border-[#8fa0b0]'}`;
	const swatch = def.kind === 'choice' ? def.options?.find((o) => o.value === value)?.color : undefined;
	return (
		<span className={`inline-flex items-baseline gap-1.5 ${fill ? 'w-full' : ''}`}>
			{swatch && <span className="size-3.5 shrink-0 translate-y-[2px] rounded-full border border-black/20" style={{ background: swatch }} />}
			{def.kind === 'choice' ? (
				<select
					ref={ref}
					data-field={def.id}
					disabled={off}
					title={why || undefined}
					aria-label={label}
					aria-invalid={mark === 'wrong' || undefined}
					value={value}
					onChange={(e) => {
						book.type(def.id, e.target.value);
						book.commit(def.id);
					}}
					className={`${box} ${fill ? 'w-full' : ''} cursor-pointer appearance-none pr-1`}
					style={HAND}
				>
					<option value="">{def.placeholder ?? '…'}</option>
					{def.options?.map((o) => (
						<option key={o.value} value={o.value}>
							{o.label}
						</option>
					))}
				</select>
			) : (
				<input
					ref={ref}
					data-field={def.id}
					disabled={off}
					title={why || undefined}
					aria-label={label}
					aria-invalid={mark === 'wrong' || undefined}
					value={value}
					inputMode={def.kind === 'number' ? 'decimal' : 'text'}
					placeholder={why ? '–' : (def.placeholder ?? '')}
					autoComplete="off"
					spellCheck={false}
					onChange={(e) => book.type(def.id, def.kind === 'number' ? e.target.value.replace(/[^0-9.,-]/g, '') : e.target.value)}
					onBlur={() => book.commit(def.id)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') e.currentTarget.blur();
					}}
					className={`${box} ${def.kind === 'number' ? 'pr-2.5 text-right' : 'px-1'} placeholder:font-normal placeholder:text-[#b3bac3]`}
					style={{ ...HAND, width: fill ? '100%' : `${def.width ?? 7}ch` }}
				/>
			)}
			{def.unit && <span className="shrink-0 text-[12.5px] text-[#5b6370]">{def.unit}</span>}
			{mark === 'ok' && <span className="shrink-0 text-[13px] font-bold text-[#2e7d4f]">✓</span>}
		</span>
	);
}

/** Room to write freely, on the page's own squares: as many lines as it has, no more (the page is what is saved). */
function Lines({ book, id, rows, placeholder }: { book: Notebook; id: string; rows: number; placeholder?: string }) {
	return (
		<textarea
			data-field={id}
			disabled={book.readOnly}
			aria-label={placeholder ?? 'Appunti'}
			value={book.values[id] ?? ''}
			onChange={(e) => {
				const el = e.currentTarget;
				// what does not fit in the lines is not written
				if (el.scrollHeight > el.clientHeight + 2) return;
				book.type(id, el.value);
			}}
			placeholder={placeholder}
			spellCheck={false}
			rows={rows}
			className="block w-full resize-none overflow-hidden rounded-[4px] border-0 bg-white/35 px-1 py-0 text-[20px] leading-[24px] text-[#1f2f6f] shadow-none outline-none ring-0 placeholder:text-[#a9b1bb] focus:bg-[#fff3c4]/40 focus:ring-0 disabled:opacity-100"
			style={{ ...HAND, height: rows * 24 }}
		/>
	);
}

function Free({ book, id, title }: { book: Notebook; id: string; title: string }) {
	return (
		<>
			<div className={KICKER}>Appunti</div>
			<h2 className={H1}>{title}</h2>
			<div className="mt-3">
				<Lines book={book} id={id} rows={26} placeholder="Scrivi qui…" />
			</div>
		</>
	);
}

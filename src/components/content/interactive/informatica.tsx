'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode, type RefObject } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Shuffle } from 'lucide-react';
import { Button, type ButtonVariant } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { MAX_CELLE, MIN_CELLE, leggiValori, mescola, type Cella, type Chiamata, type Puntatore, type Stato, type Variabile } from '@/lib/informatica/tracce';
import { Caption, Figure, clamp, useReducedMotion } from './kit';

/**
 * The computer science pieces of the kit (docs/lezioni/informatica/README.md, "Figure interattive"): the cells of an
 * array, a matrix and a string, the commands that walk through a trace, the counters, the boxes of the variables
 * and the stack of the calls, and the fields where the student changes the data.
 *
 * Unlike the geometry and physics figures these are not TikZ drawings, so they are HTML in the site's own tokens and
 * need no inversion in the dark theme: paper and ink for what is at rest, the subject's orange (`--tint`, from
 * `data-subject="cs"` on <Figura>) for what the algorithm is doing, green for what is settled. Values, indices and
 * names are in the monospaced font, like code. The layout comes from kit.tsx (Figure, Caption).
 *
 * What a figure shows is one step of a trace computed beforehand (src/lib/informatica/tracce.ts).
 */

// ---------------------------------------------------------------- frame

/** The whole figure: kit's Figure, wearing the subject's colour. Everything else goes inside it. */
export function Figura({ children }: { children: ReactNode }) {
	return (
		<div data-subject="cs" className="w-full">
			<Figure>{children}</Figure>
		</div>
	);
}

/** The width of an element, followed as it changes: 0 until it has been measured. */
function useWidth<T extends HTMLElement>(): [RefObject<T | null>, number] {
	const ref = useRef<T>(null);
	const [width, setWidth] = useState(0);
	useLayoutEffect(() => {
		const node = ref.current;
		if (!node) return;
		// the observer reports once when it starts, before the first paint
		const observer = new ResizeObserver(() => setWidth(node.clientWidth));
		observer.observe(node);
		return () => observer.disconnect();
	}, []);
	return [ref, width];
}

// ---------------------------------------------------------------- cells

/**
 * How each state looks. Fill and border weight change with the colour, so a state does not rest on hue alone.
 * The orange is the subject's, from `--hue` and `--chroma`, at a lightness where it is still orange and not brown.
 */
const STILE: Record<Stato, string> = {
	normale: 'border-edge-strong bg-surface text-fg-strong shadow-paper',
	esame: 'border-[oklch(0.64_var(--chroma)_var(--hue))] bg-tint-soft text-fg-strong ring-[3px] ring-tint/20',
	confronto: 'border-fg-strong bg-surface text-fg-strong ring-[3px] ring-fg-strong/10',
	scambio: 'border-[oklch(0.64_var(--chroma)_var(--hue))] bg-[oklch(0.75_var(--chroma)_var(--hue))] text-ink-950',
	ordinata: 'border-ok/45 bg-ok-soft text-ok-fg',
	trovata: 'border-ok-fg bg-ok-fg text-surface ring-[3px] ring-ok/25',
	scartata: 'border-dashed border-edge bg-transparent text-fg-faint',
	sollevata: 'border-[oklch(0.64_var(--chroma)_var(--hue))] bg-tint-soft text-fg-strong shadow-lift'
};
/** The names of the states in a legend, unless the figure gives its own. */
const NOME_STATO: Record<Stato, string> = {
	normale: 'da guardare',
	esame: 'in esame',
	confronto: 'confrontato',
	scambio: 'scambiato',
	ordinata: 'al suo posto',
	trovata: 'trovato',
	scartata: 'scartato',
	sollevata: 'tenuto da parte'
};

const MOVE = 380; // ms, a swap
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'; // --ease-out-soft
const CH = 7.25; // the advance of a 12px monospaced letter
const LANE = 21; // the height a row of pointer names takes
const INDEX = 18; // the height of the row of indices

type Placed = { p: Puntatore; lane: number; x: number; w: number; bare: boolean };

/**
 * Where the pointers' names go on one side of the row: each under (or above) its cell, kept inside the figure, and
 * moved one row further when it would run into a name already placed. They are placed in the order given, so the
 * first pointer of a trace keeps the nearest row.
 */
function lanes(puntatori: readonly Puntatore[], lato: 'sopra' | 'sotto', centre: (i: number) => number, width: number): Placed[] {
	const placed: Placed[] = [];
	for (const p of puntatori) {
		if ((p.lato ?? 'sotto') !== lato) continue;
		const w = p.nome.length * CH + 2;
		const x = w >= width ? width / 2 : clamp(centre(p.su), w / 2, width - w / 2);
		let lane = 0;
		while (placed.some((q) => q.lane === lane && Math.abs(q.x - x) < (q.w + w) / 2 + 5)) lane++;
		// a name moved further out is tied to its cell by a line, unless a name of the same cell is in between
		placed.push({ p, lane, x, w, bare: lane > 0 && !placed.some((q) => q.p.su === p.su && q.lane < lane) });
	}
	return placed;
}

/** The size of the cells of a row of n in `width` pixels, and the space between them. */
function fit(n: number, width: number, max: number, unite: boolean) {
	const gap = unite ? -1.5 : n > 9 ? 3 : n > 6 ? 4 : 6;
	const size = clamp(Math.floor((width - gap * (n - 1)) / Math.max(n, 1)), 16, max);
	const rowWidth = n * size + (n - 1) * gap;
	const x0 = Math.round(((width - rowWidth) / 2) * 2) / 2;
	return { gap, size, x0, pitch: size + gap, font: size >= 44 ? 17 : size >= 33 ? 15 : size >= 26 ? 13 : 11.5, radius: size >= 40 ? 9 : size >= 28 ? 7 : 5 };
}

/**
 * One cell, at its place. The outer box slides to a new place; the inner one hops over (or under) the cell it is
 * swapped with, so the two do not pass through each other.
 */
function Casella({ cella, x, y, size, font, radius, hop, animate, corners, onClick, label }: { cella: Cella; x: number; y: number; size: number; font: number; radius: number | string; hop: number; animate: boolean; corners?: string; onClick?: () => void; label: string }) {
	const inner = useRef<HTMLDivElement & HTMLButtonElement>(null);
	useLayoutEffect(() => {
		if (!hop || !animate) return;
		const animation = inner.current?.animate?.([{ transform: 'translateY(0)' }, { transform: `translateY(${hop}px)` }, { transform: 'translateY(0)' }], { duration: MOVE, easing: 'ease-in-out' });
		return () => animation?.cancel();
		// x changes with every move, also when two moves in a row hop the same way
	}, [x, hop, animate]);
	const moving = cella.stato === 'scambio' || cella.stato === 'sollevata' || hop !== 0;
	const Tag = onClick ? 'button' : 'div';
	return (
		<div className="absolute top-0 left-0" style={{ width: size, height: size, transform: `translate(${x}px, ${y}px)`, transition: animate ? `transform ${MOVE}ms ${EASE}` : undefined, zIndex: moving ? 2 : cella.stato === 'normale' || cella.stato === 'scartata' ? 0 : 1 }}>
			<Tag
				ref={inner}
				type={onClick ? 'button' : undefined}
				onClick={onClick}
				aria-label={onClick ? label : undefined}
				data-stato={cella.stato}
				className={cn('flex size-full items-center justify-center border-[1.5px] p-0 font-mono font-semibold tabular-nums', animate && 'transition-[background-color,border-color,color,box-shadow] duration-200', STILE[cella.stato], onClick && 'cursor-pointer focus-ring hover:border-tint', corners)}
				style={{ fontSize: font, borderRadius: corners ? undefined : radius, lineHeight: 1 }}
			>
				{cella.valore === ' ' ? <span className="font-normal text-fg-faint">␣</span> : cella.valore}
			</Tag>
		</div>
	);
}

/** The cells of the step before, kept to know which cells a step has moved. */
function useMoved(celle: readonly Cella[]) {
	const [seen, setSeen] = useState({ before: celle, now: celle });
	if (seen.now !== celle) setSeen({ before: seen.now, now: celle });
	const was = new Map(seen.before.map((cella, i) => [cella.id, i]));
	const moved = celle.flatMap((cella, i) => (was.has(cella.id) && was.get(cella.id) !== i ? [{ id: cella.id, from: was.get(cella.id)!, to: i, stato: cella.stato }] : []));
	const lifted = (cs: readonly Cella[], id: number) => cs.find((cella) => cella.id === id)?.stato === 'sollevata';
	// a swap: two cells that trade places, neither of them held out of the row
	const swap = moved.length === 2 && seen.before.length === celle.length && !moved.some((m) => lifted(celle, m.id) || lifted(seen.before, m.id));
	return (id: number) => {
		const m = swap ? moved.find((x) => x.id === id) : undefined;
		return m ? (m.to > m.from ? -1 : 1) : 0;
	};
}

/**
 * A row of cells with the value inside and the index (from 0) under each, and the pointers by name under or above
 * the cells they are on. It takes the width it is given: eight cells fit 330 px, twelve a wide screen.
 *
 * `celle` and `puntatori` are those of one step of a trace. Pass the whole trace as `passi` too, and the row keeps
 * the height of its tallest step, so the page does not move while the student steps through it.
 * With `unite` the cells touch, for the characters of a string (see <Stringa>). `onCella` makes them buttons.
 */
export function Celle({
	celle,
	puntatori = [],
	passi,
	label,
	max = 52,
	indici = true,
	unite = false,
	onCella
}: {
	celle: readonly Cella[];
	puntatori?: readonly Puntatore[];
	/** Every step the row will show, for a height that does not change. */
	passi?: readonly { celle: readonly Cella[]; puntatori: readonly Puntatore[] }[];
	/** What the row is, for a screen reader: "Il vettore". */
	label?: string;
	/** The largest side of a cell, in pixels. */
	max?: number;
	indici?: boolean;
	unite?: boolean;
	onCella?: (indice: number, cella: Cella) => void;
}) {
	const [box, measured] = useWidth<HTMLDivElement>();
	const reduced = useReducedMotion();
	const hopOf = useMoved(celle);
	const width = measured || 330;
	const n = celle.length;
	const { size, x0, pitch, font, radius } = fit(n, width, max, unite);
	const centre = (i: number) => x0 + i * pitch + size / 2;

	const all = passi ?? [{ celle, puntatori }];
	const count = (lato: 'sopra' | 'sotto') => Math.max(0, ...all.map((step) => Math.max(0, ...lanes(step.puntatori, lato, centre, width).map((q) => q.lane + 1))));
	const above = count('sopra');
	const below = count('sotto');
	const lift = all.some((step) => step.celle.some((cella) => cella.stato === 'sollevata')) ? size + 8 : 0;
	const rowY = above * LANE + lift;
	const underY = rowY + size + (indici ? INDEX : 2);
	const height = underY + below * LANE;
	const move = !reduced && measured > 0;
	const slide: CSSProperties = { transition: move ? `transform ${MOVE}ms ${EASE}` : undefined };

	const names = [...lanes(puntatori, 'sopra', centre, width), ...lanes(puntatori, 'sotto', centre, width)];
	const said = celle.map((cella, i) => `${i}: ${cella.valore}${cella.stato === 'normale' ? '' : ` (${NOME_STATO[cella.stato]})`}`).join(', ');
	const pointed = puntatori.map((p) => `${p.nome} all'indice ${p.su}`).join(', ');

	return (
		<div ref={box} className="relative w-full select-none" style={{ height }} role={onCella ? 'group' : 'img'} aria-label={`${label ?? 'Le celle'}, dall'indice 0. ${said}.${pointed ? ` ${pointed}.` : ''}`} data-celle>
			{/* the free place under a cell held out of the row */}
			{celle.map((cella, i) => cella.stato === 'sollevata' && <div key={`posto-${cella.id}`} className="absolute top-0 left-0 border-[1.5px] border-dashed border-edge-strong" style={{ width: size, height: size, borderRadius: radius, transform: `translate(${x0 + i * pitch}px, ${rowY}px)` }} />)}
			{/* in the order of the ids, so that a cell is the same element wherever a step puts it, and can slide there */}
			{celle
				.map((cella, i) => ({ cella, i }))
				.sort((a, b) => a.cella.id - b.cella.id)
				.map(({ cella, i }) => (
					<Casella
						key={cella.id}
						cella={cella}
						x={x0 + i * pitch}
						y={cella.stato === 'sollevata' ? rowY - lift : rowY}
						size={size}
						font={font}
						radius={radius}
						hop={hopOf(cella.id) * size * 0.55}
						animate={move}
						corners={unite ? cn('rounded-none', i === 0 && 'rounded-l-lg', i === n - 1 && 'rounded-r-lg') : undefined}
						onClick={onCella ? () => onCella(i, cella) : undefined}
						label={`Indice ${i}, valore ${cella.valore}`}
					/>
				))}
			{indici &&
				celle.map((_, i) => (
					<span key={i} aria-hidden="true" className="absolute top-0 left-0 text-center font-mono text-[11px] leading-none text-fg-subtle tabular-nums" style={{ width: pitch, transform: `translate(${x0 + i * pitch - (pitch - size) / 2}px, ${rowY + size + 5}px)` }}>
						{i}
					</span>
				))}
			{names.map(({ p, lane, x, w, bare }) => {
				const up = p.lato === 'sopra';
				// where the mark touches the row: over the cell, wherever a step holds it
				const tip = up ? rowY - (celle[p.su]?.stato === 'sollevata' ? lift : 0) - 3 : underY;
				const cx = centre(p.su);
				return (
					<div key={`${p.lato ?? 'sotto'}-${p.nome}`} aria-hidden="true" data-puntatore={p.nome}>
						<span className="absolute top-0 left-0 block text-[oklch(0.64_var(--chroma)_var(--hue))]" style={{ ...slide, transform: `translate(${cx - 4}px, ${up ? tip - 5 : tip}px)` }}>
							<svg width="8" height="5" viewBox="0 0 8 5" className="block" style={{ transform: up ? 'rotate(180deg)' : undefined }}>
								<path d="M4 0 8 5H0Z" fill="currentColor" />
							</svg>
						</span>
						{bare && <span className="absolute top-0 left-0 block w-px bg-tint-edge" style={{ ...slide, height: lane * LANE, transform: `translate(${cx - 0.5}px, ${up ? tip - 5 - lane * LANE : tip + 5}px)` }} />}
						<span className="absolute top-0 left-0 block text-center font-mono text-xs leading-none font-semibold whitespace-nowrap text-tint-fg" style={{ ...slide, width: w, transform: `translate(${x - w / 2}px, ${up ? tip - 19 - lane * LANE : tip + 8 + lane * LANE}px)` }}>
							{p.nome}
						</span>
					</div>
				);
			})}
		</div>
	);
}

/** The characters of a string in cells that touch, with their indices. `stati` and `puntatori` as in a row of cells. */
export function Stringa({ testo, stato, puntatori, label, max = 40, onCella }: { testo: string; stato?: (indice: number, carattere: string) => Stato; puntatori?: readonly Puntatore[]; label?: string; max?: number; onCella?: (indice: number, cella: Cella) => void }) {
	const celle: Cella[] = [...testo].map((valore, id) => ({ id, valore, stato: stato?.(id, valore) ?? 'normale' }));
	return <Celle celle={celle} puntatori={puntatori} label={label ?? `La stringa ${testo}`} max={max} unite onCella={onCella} />;
}

/**
 * A matrix: rows and columns of cells, with the row indices on the left and the column indices above, both from 0.
 * `stato(r, c)` colours a cell; `riga` and `colonna` put a name (i, j) beside the index of the row and of the column
 * the program is on. `onCella` makes the cells buttons.
 */
export function Matrice({
	valori,
	stato,
	riga,
	colonna,
	label,
	max = 44,
	onCella
}: {
	valori: readonly (readonly (number | string)[])[];
	stato?: (r: number, c: number) => Stato;
	riga?: { nome: string; su: number };
	colonna?: { nome: string; su: number };
	label?: string;
	max?: number;
	onCella?: (r: number, c: number) => void;
}) {
	const [box, measured] = useWidth<HTMLDivElement>();
	const reduced = useReducedMotion();
	const width = measured || 330;
	const rows = valori.length;
	const cols = Math.max(0, ...valori.map((r) => r.length));
	const side = 22 + (riga ? riga.nome.length * CH + 12 : 0); // the row indices, and the name beside them
	const top = 18 + (colonna ? LANE - 3 : 0);
	const gap = cols > 8 ? 3 : 4;
	const size = clamp(Math.floor((width - 2 * side - gap * (cols - 1)) / Math.max(cols, 1)), 16, max);
	const pitch = size + gap;
	// centred on the cells: the room taken by the row indices on the left is left empty on the right too
	const x0 = Math.round((width - cols * size - (cols - 1) * gap) / 2);
	const font = size >= 40 ? 16 : size >= 30 ? 14 : 12;
	const radius = size >= 36 ? 7 : 5;
	const slide: CSSProperties = { transition: !reduced && measured > 0 ? `transform ${MOVE}ms ${EASE}` : undefined };
	const Tag = onCella ? 'button' : 'div';
	return (
		<div ref={box} className="relative w-full select-none" style={{ height: top + rows * pitch - gap }} role={onCella ? 'group' : 'img'} aria-label={`${label ?? 'La matrice'}: ${rows} righe e ${cols} colonne, contate da 0. ${valori.map((r, i) => `Riga ${i}: ${r.join(', ')}`).join('. ')}.`} data-matrice>
			{Array.from({ length: cols }, (_, c) => (
				<span key={`c${c}`} aria-hidden="true" className={cn('absolute left-0 text-center font-mono text-[11px] leading-none tabular-nums', colonna?.su === c ? 'font-semibold text-tint-fg' : 'text-fg-subtle')} style={{ width: size, top: top - 15, transform: `translateX(${x0 + c * pitch}px)` }}>
					{c}
				</span>
			))}
			{Array.from({ length: rows }, (_, r) => (
				<span key={`r${r}`} aria-hidden="true" className={cn('absolute left-0 text-right font-mono text-[11px] leading-none tabular-nums', riga?.su === r ? 'font-semibold text-tint-fg' : 'text-fg-subtle')} style={{ width: 16, top: top + r * pitch + size / 2 - 5, transform: `translateX(${x0 - 22}px)` }}>
					{r}
				</span>
			))}
			{colonna && colonna.su >= 0 && colonna.su < cols && (
				<span aria-hidden="true" className="absolute top-0 left-0 text-center font-mono text-xs leading-none font-semibold text-tint-fg" style={{ ...slide, width: size, transform: `translate(${x0 + colonna.su * pitch}px, 0px)` }}>
					{colonna.nome}
				</span>
			)}
			{riga && riga.su >= 0 && riga.su < rows && (
				<span aria-hidden="true" className="absolute top-0 left-0 text-right font-mono text-xs leading-none font-semibold text-tint-fg" style={{ ...slide, width: riga.nome.length * CH + 2, transform: `translate(${x0 - 20 - riga.nome.length * CH - 2}px, ${top + riga.su * pitch + size / 2 - 6}px)` }}>
					{riga.nome}
				</span>
			)}
			{valori.map((row, r) =>
				row.map((valore, c) => {
					const s = stato?.(r, c) ?? 'normale';
					return (
						<Tag
							key={`${r}-${c}`}
							type={onCella ? 'button' : undefined}
							onClick={onCella ? () => onCella(r, c) : undefined}
							aria-label={onCella ? `Riga ${r}, colonna ${c}, valore ${valore}` : undefined}
							data-stato={s}
							className={cn('absolute left-0 flex items-center justify-center border-[1.5px] p-0 font-mono font-semibold tabular-nums', !reduced && 'transition-[background-color,border-color,color,box-shadow] duration-200', STILE[s], s !== 'normale' && s !== 'scartata' && 'z-[1]', onCella && 'cursor-pointer focus-ring hover:border-tint')}
							style={{ width: size, height: size, top: top + r * pitch, transform: `translateX(${x0 + c * pitch}px)`, fontSize: font, borderRadius: radius, lineHeight: 1 }}
						>
							{valore}
						</Tag>
					);
				})
			)}
		</div>
	);
}

/** What the colours of the cells mean: one small cell per state, with its name (the figure's own, or the usual one). */
export function Legenda({ stati }: { stati: Partial<Record<Stato, string | true>> }) {
	return (
		<div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-fg-muted" data-legenda>
			{(Object.keys(stati) as Stato[]).map((stato) => (
				<span key={stato} className="inline-flex items-center gap-1.5">
					<span aria-hidden="true" className={cn('inline-block size-3.5 rounded-[4px] border-[1.5px] shadow-none ring-0', STILE[stato].replace(/\b(ring|shadow)-\S+/g, ''))} />
					{stati[stato] === true ? NOME_STATO[stato] : stati[stato]}
				</span>
			))}
		</div>
	);
}

// ---------------------------------------------------------------- steps

export type Passi = ReturnType<typeof usePassi>;

/**
 * Where the student is in a trace of `quanti` steps: `passo` (from 0), and what moves it. `esegui` walks on by
 * itself, one step every `ritmo` milliseconds, until the end or until it is called again.
 * Call `ricomincia` when the data change and the trace is computed again.
 */
export function usePassi(quanti: number, { ritmo = 1100 }: { ritmo?: number } = {}) {
	const [at, setAt] = useState(0);
	const [playing, setPlaying] = useState(false);
	const ultimo = Math.max(0, quanti - 1);
	const passo = Math.min(at, ultimo);
	const inCorso = playing && passo < ultimo;
	useEffect(() => {
		if (!inCorso) return;
		const timer = setTimeout(() => {
			setAt(passo + 1);
			if (passo + 1 >= ultimo) setPlaying(false);
		}, ritmo);
		return () => clearTimeout(timer);
	}, [inCorso, passo, ultimo, ritmo]);
	const vai = (k: number) => {
		setPlaying(false);
		setAt(clamp(k, 0, ultimo));
	};
	return {
		passo,
		quanti,
		inCorso,
		inizio: passo === 0,
		fine: passo >= ultimo,
		vai,
		avanti: () => vai(passo + 1),
		indietro: () => vai(passo - 1),
		ricomincia: () => vai(0),
		esegui: () => {
			// from the last step it starts over, as a player does
			if (!inCorso && passo >= ultimo) setAt(0);
			setPlaying(!inCorso);
		}
	};
}

/** A button that stays in the Tab order when it has nothing to do, so the keyboard does not lose its place at the first and last step. */
function Tasto({ off = false, onClick, variant = 'secondary', label, children }: { off?: boolean; onClick: () => void; variant?: ButtonVariant; label?: string; children: ReactNode }) {
	return (
		<Button variant={variant} size="sm" aria-disabled={off || undefined} aria-label={label} title={label} onClick={off ? undefined : onClick} className="aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:shadow-none">
			{children}
		</Button>
	);
}

/**
 * The commands of a trace: run or pause, back, forward, start again, and which step this is. From the keyboard,
 * with the focus on any of them: the left and right arrows go back and forward, Home and End to the first and last step.
 */
export function ComandiPassi({ passi }: { passi: Passi }) {
	const keys = (e: KeyboardEvent<HTMLDivElement>) => {
		const go = { ArrowLeft: passi.indietro, ArrowRight: passi.avanti, Home: passi.ricomincia, End: () => passi.vai(passi.quanti - 1) }[e.key];
		if (!go || e.altKey || e.ctrlKey || e.metaKey) return;
		e.preventDefault();
		go();
	};
	return (
		<div className="flex w-full flex-col items-center gap-2.5" data-comandi>
			<div role="group" aria-label="Comandi dei passi: con le frecce sinistra e destra vai indietro e avanti" onKeyDown={keys} className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
				<Tasto variant="primary" onClick={passi.esegui}>
					{passi.inCorso ? <Pause className="size-3.5" aria-hidden="true" /> : <Play className="size-3.5" aria-hidden="true" />}
					{passi.inCorso ? 'Pausa' : 'Esegui'}
				</Tasto>
				<Tasto off={passi.inizio} onClick={passi.indietro}>
					<ChevronLeft className="size-3.5" aria-hidden="true" />
					Indietro
				</Tasto>
				<Tasto off={passi.fine} onClick={passi.avanti}>
					Avanti
					<ChevronRight className="size-3.5" aria-hidden="true" />
				</Tasto>
				<Tasto off={passi.inizio} onClick={passi.ricomincia} label="Ricomincia">
					<RotateCcw className="size-3.5" aria-hidden="true" />
					<span className="max-sm:sr-only">Ricomincia</span>
				</Tasto>
			</div>
			<div className="flex w-full max-w-64 items-center gap-2.5">
				<div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-3" aria-hidden="true">
					<div className="h-full origin-left rounded-full bg-[oklch(0.7_var(--chroma)_var(--hue))] motion-safe:transition-transform motion-safe:duration-300" style={{ transform: `scaleX(${passi.quanti > 1 ? passi.passo / (passi.quanti - 1) : 1})` }} />
				</div>
				<span className="label-mono shrink-0 text-fg-subtle tabular-nums" data-passo>
					Passo {passi.passo + 1} di {passi.quanti}
				</span>
			</div>
		</div>
	);
}

/**
 * What happens in the step, in a sentence: kit's Caption, which a screen reader reads when it changes. With `tutte`
 * (the sentences of every step) it keeps the height of the longest, so what is under it stays where it is.
 */
export function Frase({ children, tutte }: { children: ReactNode; tutte?: readonly string[] }) {
	const longest = tutte?.reduce((a, b) => (b.length > a.length ? b : a), '');
	return (
		<div className="grid w-full justify-items-center" data-frase>
			{longest && (
				<p aria-hidden="true" className="invisible col-start-1 row-start-1 m-0 max-w-xl text-center text-sm">
					{longest}
				</p>
			)}
			<div className="col-start-1 row-start-1 flex justify-center">
				<Caption>{children}</Caption>
			</div>
		</div>
	);
}

/** The counters of a trace beside each other: the number, and under it what it counts (confronti, scambi, passi). */
export function Contatori({ voci }: { voci: Record<string, number | string> }) {
	return (
		<dl className="m-0 flex flex-wrap items-stretch justify-center divide-x divide-edge" data-contatori>
			{Object.entries(voci).map(([nome, valore]) => (
				<div key={nome} className="flex min-w-20 flex-col items-center gap-0.5 px-4" data-contatore={nome}>
					<dd className="m-0 font-mono text-xl leading-none font-semibold text-fg-strong tabular-nums">{valore}</dd>
					<dt className="label-mono m-0 text-fg-subtle">{nome}</dt>
				</div>
			))}
		</dl>
	);
}

// ---------------------------------------------------------------- the student's data

const CAMPO = 'min-h-9 min-w-0 rounded-lg border bg-surface px-2.5 font-mono text-sm text-fg-strong shadow-paper outline-none transition focus:ring-3';
const CAMPO_OK = 'border-edge-strong focus:border-[oklch(0.64_var(--chroma)_var(--hue))] focus:ring-tint/20';
const CAMPO_ERRORE = 'border-danger focus:ring-danger/20';

/**
 * Where the student changes the data of a figure: the values of the array, written with spaces between them (whole
 * numbers from 0 to 99, at most `max`), a button that shuffles them, and with `cerca` the value to look for.
 * A list that cannot be read is not applied, and a line says why. With `ordinati` the values are kept sorted (binary
 * search) and the button draws new ones.
 */
export function Dati({
	valori,
	onValori,
	cerca,
	onCerca,
	ordinati = false,
	min = MIN_CELLE,
	max = MAX_CELLE
}: {
	valori: readonly number[];
	onValori: (valori: number[]) => void;
	cerca?: number;
	onCerca?: (valore: number) => void;
	ordinati?: boolean;
	min?: number;
	max?: number;
}) {
	const id = useId();
	const shown = valori.join(' ');
	// what is being typed, tied to the values it started from: values changed from outside (the shuffle) replace it
	const [typed, setTyped] = useState<{ text: string; from: string } | null>(null);
	const draft = typed && typed.from === shown ? typed.text : null;
	const read = draft === null ? null : leggiValori(draft, { min, max });
	const sorted = (xs: number[]) => (ordinati ? [...xs].sort((a, b) => a - b) : xs);
	const commit = () => {
		if (read?.valori) {
			onValori(sorted(read.valori));
			setTyped(null);
		}
	};
	const again = () => {
		setTyped(null);
		// sorted values cannot be shuffled: new ones are drawn, different from each other so the search has one answer
		if (!ordinati) return onValori(mescola(valori));
		const pool = mescola(Array.from({ length: 60 }, (_, i) => i + 1));
		onValori(sorted(pool.slice(0, valori.length)));
	};
	const [number, setNumber] = useState<{ text: string; from: number } | null>(null);
	const numberDraft = number && number.from === cerca ? number.text : null;
	const setCerca = (text: string) => {
		setNumber({ text, from: cerca ?? 0 });
		if (/^\d{1,2}$/.test(text.trim())) onCerca?.(Number(text));
	};
	return (
		<div className="flex w-full max-w-lg flex-col gap-1.5" data-dati>
			<div className="flex flex-wrap items-end justify-center gap-x-3 gap-y-2">
				<label htmlFor={id} className="flex min-w-0 flex-1 basis-40 flex-col gap-1">
					<span className="label-mono text-fg-subtle">{ordinati ? 'I valori, in ordine' : 'I valori del vettore'}</span>
					<input
						id={id}
						type="text"
						inputMode="numeric"
						autoComplete="off"
						spellCheck={false}
						value={draft ?? shown}
						onChange={(e) => setTyped({ text: e.target.value, from: shown })}
						onBlur={commit}
						onKeyDown={(e) => {
							if (e.key === 'Enter') commit();
							else if (e.key === 'Escape') setTyped(null);
						}}
						aria-invalid={read?.errore ? true : undefined}
						aria-describedby={read?.errore ? `${id}-errore` : undefined}
						className={cn(CAMPO, 'w-full', read?.errore ? CAMPO_ERRORE : CAMPO_OK)}
					/>
				</label>
				{cerca !== undefined && (
					<label className="flex flex-col gap-1">
						<span className="label-mono text-fg-subtle">Cerca</span>
						<input
							type="text"
							inputMode="numeric"
							autoComplete="off"
							value={numberDraft ?? String(cerca)}
							onChange={(e) => setCerca(e.target.value)}
							onBlur={() => setNumber(null)}
							onKeyDown={(e) => {
								if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
								e.preventDefault();
								setNumber(null);
								onCerca?.(clamp(cerca + (e.key === 'ArrowUp' ? 1 : -1), 0, 99));
							}}
							aria-label="Il valore da cercare, da 0 a 99"
							className={cn(CAMPO, CAMPO_OK, 'w-16 text-center')}
						/>
					</label>
				)}
				<Button variant="secondary" size="sm" onClick={again} title={ordinati ? 'Nuovi valori' : 'Mescola'}>
					<Shuffle className="size-3.5" aria-hidden="true" />
					{/* beside the field of the value to look for, a phone has room for the icon only */}
					<span className={cn(cerca !== undefined && 'max-sm:sr-only')}>{ordinati ? 'Nuovi valori' : 'Mescola'}</span>
				</Button>
			</div>
			{read?.errore && (
				<p id={`${id}-errore`} role="alert" className="m-0 text-center text-xs text-danger-fg">
					{read.errore}
				</p>
			)}
		</div>
	);
}

// ---------------------------------------------------------------- variables and calls

const STILE_VARIABILE: Record<NonNullable<Variabile['stato']>, string> = { normale: STILE.normale, letta: STILE.confronto, scritta: STILE.scambio, nuova: STILE.esame };

/** A variable: its value in a box and its name under it, as a cell has its index. A reference says what it stands for. */
export function Scatola({ variabile }: { variabile: Variabile }) {
	const { nome, valore, stato = 'normale', rif } = variabile;
	return (
		<div className="flex min-w-12 flex-col items-center gap-1" data-variabile={nome} data-stato={stato}>
			<div className={cn('flex h-10 min-w-12 items-center justify-center rounded-lg border-[1.5px] px-2 font-mono text-[15px] leading-none font-semibold tabular-nums motion-safe:transition-[background-color,border-color,color,box-shadow] motion-safe:duration-200', STILE_VARIABILE[stato], rif && 'border-dashed')}>{valore}</div>
			<div className="font-mono text-xs leading-none font-medium text-fg">{nome}</div>
			{rif && <div className="font-mono text-[11px] leading-none whitespace-nowrap text-tint-fg">→ {rif}</div>}
		</div>
	);
}

/** Some variables in a row, outside any call (the variables of a program without functions). */
export function Variabili({ variabili, label = 'Le variabili' }: { variabili: readonly Variabile[]; label?: string }) {
	return (
		<div role="group" aria-label={label} className="flex flex-wrap items-start justify-center gap-x-4 gap-y-3" data-variabili>
			{variabili.map((variabile) => (
				<Scatola key={variabile.nome} variabile={variabile} />
			))}
		</div>
	);
}

function Riquadro({ chiamata, top, fresh }: { chiamata: Chiamata; top: boolean; fresh: boolean }) {
	return (
		<section aria-label={`${chiamata.nome}, ${top ? 'in esecuzione' : 'in attesa'}`} className={cn('rounded-xl border px-3 pt-2 pb-3', top ? 'border-tint-edge bg-surface shadow-paper' : 'border-edge bg-surface-2', fresh && 'motion-safe:animate-drop-in')} data-chiamata={chiamata.nome}>
			<div className="mb-2.5 flex items-baseline justify-between gap-3">
				<span className="font-mono text-sm font-semibold text-fg-strong">{chiamata.nome}</span>
				<span className={cn('label-mono', top ? 'text-tint-fg' : 'text-fg-subtle')}>{top ? 'in esecuzione' : 'in attesa'}</span>
			</div>
			{chiamata.variabili.length ? (
				<div className="flex flex-wrap items-start justify-center gap-x-4 gap-y-3">
					{chiamata.variabili.map((variabile) => (
						<Scatola key={variabile.nome} variabile={variabile} />
					))}
				</div>
			) : (
				<div className="text-center text-xs text-fg-subtle">nessuna variabile</div>
			)}
		</section>
	);
}

/**
 * The stack of the calls: one frame per function that has been called and has not finished, `main` at the bottom
 * and the function running now on top, each with its parameters and local variables. A frame appears when its
 * function is called and goes when it returns. With `passi` (every stack the figure will show) it keeps the height
 * of the tallest, growing upwards from `main`.
 */
export function Pila({ pila, passi }: { pila: readonly Chiamata[]; passi?: readonly (readonly Chiamata[])[] }) {
	const weight = (p: readonly Chiamata[]) => p.reduce((s, c) => s + 3 + (c.variabili.some((x) => x.rif) ? 1 : 0), 0);
	const tallest = passi?.reduce((a, b) => (weight(b) > weight(a) ? b : a), pila);
	// a frame is new when the stack is taller than at the step before
	const [seen, setSeen] = useState({ before: pila.length, now: pila });
	if (seen.now !== pila) setSeen({ before: seen.now.length, now: pila });
	const stack = (p: readonly Chiamata[], live: boolean) => (
		<div className="flex w-full flex-col-reverse gap-2">
			{p.map((chiamata, i) => (
				<Riquadro key={`${i}-${chiamata.nome}`} chiamata={chiamata} top={i === p.length - 1} fresh={live && i === p.length - 1 && i >= seen.before} />
			))}
		</div>
	);
	return (
		<div className="grid w-full max-w-sm items-end" data-pila>
			{tallest && tallest !== pila && (
				<div aria-hidden="true" className="invisible col-start-1 row-start-1">
					{stack(tallest, false)}
				</div>
			)}
			<div role="group" aria-label="La pila delle chiamate, dalla funzione in esecuzione fino a main" className="col-start-1 row-start-1">
				{stack(pila, true)}
			</div>
		</div>
	);
}

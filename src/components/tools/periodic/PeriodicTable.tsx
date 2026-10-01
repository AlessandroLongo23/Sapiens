'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import {
	BLOCKS,
	ELEMENTI,
	FAMILIES,
	SERIES_CELLS,
	STATES,
	TRENDS,
	ZERO_CELSIUS,
	elementBySymbol,
	familyName,
	gridPlace,
	num,
	stateAt,
	stateName,
	trendById,
	trendRange,
	trendRanks,
	trendText,
	withUnit,
	type ChemElement,
	type TrendId
} from '@/lib/tools/tavola-periodica';
import { useToolState } from '@/components/tools/ToolSheet';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { cn } from '@/lib/utils/cn';
import { Config, ElementPanel, massText } from './ElementPanel';

/**
 * The periodic table (vault/Prodotti/Studenti/Tavola periodica interattiva.md). The grid is the classic one, 18
 * columns with the two series underneath; the empty space above the transition metals shows the element under the
 * pointer, and a click pins it and opens its card beside the table. A view chooses what the colours say: families,
 * state at a temperature, a periodic trend, blocks. View and element live in the address, so a card can be shared.
 */

type View = 'famiglie' | 'stato' | 'andamenti' | 'blocchi';

const VIEWS: { value: View; label: string }[] = [
	{ value: 'famiglie', label: 'Famiglie' },
	{ value: 'stato', label: 'Stato fisico' },
	{ value: 'andamenti', label: 'Andamenti' },
	{ value: 'blocchi', label: 'Blocchi' }
];

/** vista, proprietà, temperatura in °C, simbolo dell'elemento aperto. */
const DEFAULTS = { vista: 'famiglie', p: 'raggio', t: '25', elemento: '' };

/** Asks the table on the page to open an element's card: the list under the table is outside this component. */
export const OPEN_ELEMENT_EVENT = 'ptable:open';

const T_MIN = -273;
const T_MAX = 6000;
const T_PRESETS = [
	{ t: -196, label: '−196 °C', note: 'azoto liquido' },
	{ t: -39, label: '−39 °C', note: 'il mercurio solidifica' },
	{ t: 25, label: '25 °C', note: 'temperatura ambiente' },
	{ t: 30, label: '30 °C', note: 'il gallio fonde' },
	{ t: 100, label: '100 °C', note: 'l’acqua bolle' },
	{ t: 1538, label: '1538 °C', note: 'il ferro fonde' }
];
/**
 * The slider is not linear: school chemistry happens between −273 and a few hundred degrees, which on a straight
 * scale to 6000 °C would be a twentieth of the track. A power curve gives that range the first third.
 */
const T_TRACK = 1000;
const T_CURVE = 2.5;
const toTrack = (degrees: number) => Math.round(T_TRACK * ((degrees - T_MIN) / (T_MAX - T_MIN)) ** (1 / T_CURVE));
const fromTrack = (u: number) => Math.round(T_MIN + (T_MAX - T_MIN) * (u / T_TRACK) ** T_CURVE);

/** What a view says about one element: the key of its legend entry, its colour, the line under the name, and the same in words. */
interface Reading {
	key: string;
	fill: string | undefined;
	line: string;
	fact: string;
}

const PLACES = new Map(ELEMENTI.map((el) => [`${gridPlace(el).row}:${gridPlace(el).col}`, el]));

/**
 * The element an arrow key leads to: the nearest one in that direction, skipping the empty cells. Where a row ends,
 * left and right go on in order of atomic number (barium to lanthanum, lutetium to hafnium); where a column ends,
 * down goes to the nearest element of the series underneath.
 */
function neighbour(el: ChemElement, dRow: number, dCol: number): ChemElement | undefined {
	let { row, col } = gridPlace(el);
	// Barium and radium lead into the series, hafnium and rutherfordium back out of them: the order of the atomic numbers.
	if (dCol !== 0 && (el.period === 6 || el.period === 7) && el.group === (dCol > 0 ? 2 : 4)) return ELEMENTI[el.z - 1 + dCol];
	for (let i = 0; i < 18; i++) {
		row += dRow;
		col += dCol;
		if (row < 1 || row > 10 || col < 1 || col > 18) break;
		const found = PLACES.get(`${row}:${col}`);
		if (found) return found;
	}
	if (dCol !== 0) return ELEMENTI[el.z - 1 + dCol];
	const start = gridPlace(el);
	const target = start.row + (dRow > 0 ? (start.row === 7 ? 2 : 1) : start.row === 9 ? -2 : -1);
	return ELEMENTI.filter((e) => gridPlace(e).row === target).sort((a, b) => Math.abs(gridPlace(a).col - start.col) - Math.abs(gridPlace(b).col - start.col))[0];
}

const cellText = 'text-[clamp(0.5rem,0.74cqw,0.68rem)]';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function PeriodicTable() {
	const [state, set] = useToolState(DEFAULTS);
	const [hovered, setHovered] = useState<ChemElement | null>(null);
	const [legendHover, setLegendHover] = useState<string | null>(null);
	const [legendPin, setLegendPin] = useState<string | null>(null);
	// The cell the Tab key comes back to: the last one that had the focus.
	const [lastFocused, setLastFocused] = useState<number | null>(null);
	// The card slides only after the student has opened or closed one: a card that is in the address is just there.
	const [moves, setMoves] = useState(false);
	const grid = useRef<HTMLDivElement>(null);
	const cardBox = useRef<HTMLDivElement>(null);
	// What is being typed in the temperature field, until it is a number.
	const [typed, setTyped] = useState<string | null>(null);

	const view: View = VIEWS.some((v) => v.value === state.vista) ? (state.vista as View) : 'famiglie';
	const trend = trendById(state.p);
	const range = useMemo(() => trendRange(trend), [trend]);
	const ranks = useMemo(() => trendRanks(trend), [trend]);
	const degrees = Number.isFinite(Number(state.t)) && state.t.trim() !== '' ? Math.min(T_MAX, Math.max(T_MIN, Math.round(Number(state.t)))) : 25;
	const kelvin = degrees + ZERO_CELSIUS;
	const selected = (state.elemento && elementBySymbol(state.elemento)) || null;
	const shown = hovered ?? selected;
	const focusKey = legendHover ?? legendPin;
	// The element in the card: the open one, or the last one while the card closes.
	const [card, setCard] = useState<ChemElement | null>(selected);
	if (selected && selected !== card) setCard(selected);
	// Once closed the card is taken away, or its height would stay under the table as an empty band.
	useEffect(() => {
		if (selected) return;
		const timer = setTimeout(() => setCard(null), 320);
		return () => clearTimeout(timer);
	}, [selected]);
	// Under the table (narrower screens) a card that opens may be below the fold: it is brought into view.
	useEffect(() => {
		if (!selected || !moves || window.matchMedia('(min-width: 80rem)').matches) return;
		const timer = setTimeout(() => cardBox.current?.scrollIntoView({ block: 'nearest', behavior: reducedMotion() ? 'auto' : 'smooth' }), 320);
		return () => clearTimeout(timer);
	}, [selected, moves]);

	const read = (el: ChemElement): Reading => {
		if (view === 'famiglie') return { key: el.family, fill: `var(--pt-${el.family})`, line: el.mass, fact: familyName(el.family) };
		if (view === 'blocchi') return { key: el.block, fill: `var(--pt-blocco-${el.block})`, line: el.mass, fact: BLOCKS.find((b) => b.id === el.block)!.name };
		if (view === 'stato') {
			const s = stateAt(el, kelvin);
			return { key: s, fill: s === '?' ? undefined : `var(--pt-stato-${s})`, line: el.mass, fact: s === '?' ? `Stato non noto a ${num(degrees)} °C` : `${stateName(s)} a ${num(degrees)} °C` };
		}
		const value = trend.value(el);
		if (value === null) return { key: 'nd', fill: undefined, line: 'n.d.', fact: `${trend.name}: non disponibile` };
		return {
			key: 'valore',
			fill: `color-mix(in oklab, var(--pt-trend) ${Math.round(10 + 90 * ranks.get(el.z)!)}%, var(--surface))`,
			line: trendText(trend, value),
			fact: `${trend.name}: ${withUnit(trend, value)}`
		};
	};

	const setView = (vista: View) => {
		setLegendPin(null);
		setLegendHover(null);
		set({ vista });
	};
	const open = (symbol: string) => {
		setMoves(true);
		set({ elemento: symbol });
	};
	const close = () => {
		open('');
		// The focus goes back to the cell the card was opened from, not to the top of the page.
		if (selected) grid.current?.querySelector<HTMLButtonElement>(`[data-z="${selected.z}"]`)?.focus();
	};

	useEffect(() => {
		const onOpen = (e: Event) => {
			const el = elementBySymbol((e as CustomEvent<string>).detail);
			if (!el) return;
			setMoves(true);
			set({ elemento: el.symbol });
			// The focus follows to the element's cell, so the keyboard goes on from the table.
			grid.current?.querySelector<HTMLButtonElement>(`[data-z="${el.z}"]`)?.focus({ preventScroll: true });
			grid.current?.scrollIntoView({ block: 'center', behavior: reducedMotion() ? 'auto' : 'smooth' });
		};
		window.addEventListener(OPEN_ELEMENT_EVENT, onOpen);
		return () => window.removeEventListener(OPEN_ELEMENT_EVENT, onOpen);
		// `set` only wraps a state setter.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// One Tab stop for the whole table; the arrows move between elements (the grid pattern).
	const tabStop = lastFocused ?? selected?.z ?? 1;
	const keys = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Escape' && selected && !(e.target instanceof HTMLInputElement)) {
			e.preventDefault();
			close();
			return;
		}
		const step = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
		const z = Number((e.target as HTMLElement).dataset.z);
		if (!step || !z) return;
		e.preventDefault();
		const next = neighbour(ELEMENTI[z - 1], step[0], step[1]);
		if (next) grid.current?.querySelector<HTMLButtonElement>(`[data-z="${next.z}"]`)?.focus();
	};

	const counts = useMemo(() => {
		const out: Record<string, number> = {};
		for (const el of ELEMENTI) {
			const s = stateAt(el, kelvin);
			out[s] = (out[s] ?? 0) + 1;
		}
		return out;
	}, [kelvin]);

	const legend: { key: string; label: string; fill?: string; note?: string }[] =
		view === 'famiglie'
			? FAMILIES.map((f) => ({ key: f.id, label: f.name, fill: `var(--pt-${f.id})` }))
			: view === 'blocchi'
				? BLOCKS.map((b) => ({ key: b.id, label: b.name, fill: `var(--pt-blocco-${b.id})`, note: b.note }))
				: view === 'stato'
					? STATES.map((s) => ({ key: s.id, label: `${s.name}: ${counts[s.id] ?? 0}`, fill: s.id === '?' ? undefined : `var(--pt-stato-${s.id})` }))
					: [];

	const track = toTrack(degrees);
	const setDegrees = (t: number) => set({ t: String(Math.min(T_MAX, Math.max(T_MIN, Math.round(t)))) });
	// On the keyboard the slider moves by degrees (ten with Shift): a step of the curved track is less than a degree
	// at the cold end, and would round back to where it was.
	const sliderKeys = (e: KeyboardEvent<HTMLInputElement>) => {
		const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 100, PageDown: -100 }[e.key];
		if (step === undefined) return;
		e.preventDefault();
		setDegrees(degrees + step * (e.shiftKey ? 10 : 1));
	};
	const commitTyped = () => {
		const x = Number((typed ?? '').replace(',', '.').replace('−', '-').trim());
		if (typed !== null && typed.trim() !== '' && Number.isFinite(x)) setDegrees(x);
		setTyped(null);
	};

	return (
		<div className="ptable flex flex-col gap-3" onKeyDown={keys}>
			<div className="flex flex-col gap-3 rounded-2xl border border-edge bg-surface p-3 shadow-paper">
				<div className="flex flex-wrap items-center gap-x-4 gap-y-3">
					<div className="max-w-full overflow-x-auto">
						<ToggleGroup options={VIEWS} value={view} onChange={setView} label="Cosa mostrano i colori" />
					</div>
					{view === 'andamenti' && (
						<div className="max-w-full overflow-x-auto">
							<ToggleGroup options={TRENDS.map((t) => ({ value: t.id, label: t.label }))} value={trend.id} onChange={(p: TrendId) => set({ p })} label="Proprietà periodica" compact />
						</div>
					)}
					{view === 'stato' && (
						<div className="flex min-w-0 flex-1 basis-80 items-center gap-3">
							<label htmlFor="ptable-t" className="text-sm font-medium text-fg-muted">
								Temperatura
							</label>
							<input
								id="ptable-t"
								type="range"
								min={0}
								max={T_TRACK}
								step={1}
								value={track}
								aria-valuetext={`${degrees} gradi Celsius`}
								onKeyDown={sliderKeys}
								onChange={(e) => setDegrees(fromTrack(Number(e.target.value)))}
								className="slider min-w-0 flex-1"
								style={{ '--fill': `${(track / T_TRACK) * 100}%` } as CSSProperties}
							/>
							<span className="relative shrink-0">
								<input
									type="text"
									inputMode="numeric"
									aria-label="Temperatura in gradi Celsius"
									value={typed ?? String(degrees)}
									onChange={(e) => setTyped(e.target.value)}
									onBlur={commitTyped}
									onKeyDown={(e) => {
										if (e.key === 'Enter') commitTyped();
										else if (e.key === 'Escape') setTyped(null);
									}}
									className="w-24 rounded-lg border border-edge bg-surface py-1 pr-8 pl-2.5 text-right font-mono text-sm text-fg tabular-nums shadow-paper outline-none transition focus:border-accent focus:ring-3 focus:ring-accent/20"
								/>
								<span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-xs text-fg-subtle">°C</span>
							</span>
							<span className="shrink-0 font-mono text-xs text-fg-subtle">{num(Math.round(kelvin))} K</span>
						</div>
					)}
				</div>

				{view === 'stato' && (
					<div className="flex flex-wrap items-center gap-2 text-sm">
						<span className="text-fg-subtle">Prova:</span>
						{T_PRESETS.map((preset) => (
							<button
								key={preset.t}
								type="button"
								title={preset.note}
								aria-label={`${preset.label}, ${preset.note}`}
								aria-pressed={degrees === preset.t}
								onClick={() => set({ t: String(preset.t) })}
								className={cn(
									'rounded-full border px-3 py-1 font-mono transition-colors focus-ring',
									degrees === preset.t ? 'border-fg-subtle bg-surface-3 text-fg-strong' : 'border-edge bg-surface text-fg-muted hover:border-edge-strong hover:text-fg'
								)}
							>
								{preset.label}
							</button>
						))}
					</div>
				)}

				{view === 'andamenti' ? (
					<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
						<span className="flex items-center gap-2 font-mono text-xs text-fg-muted">
							{withUnit(trend, range.min)}
							<span className="h-3 w-32 rounded-full border border-edge" style={{ background: 'linear-gradient(90deg, color-mix(in oklab, var(--pt-trend) 10%, var(--surface)), var(--pt-trend))' }} aria-hidden="true" />
							{withUnit(trend, range.max)}
						</span>
						<p className="min-w-0 flex-1 basis-96 text-fg-muted">
							<span className="font-medium text-fg">{trend.name}.</span> {trend.note} Il colore segue l’ordine dei valori, dal più basso al più alto.
						</p>
					</div>
				) : (
					<ul className="flex flex-wrap gap-1.5" aria-label="Legenda">
						{legend.map((item) => (
							<li key={item.key}>
								<button
									type="button"
									aria-pressed={legendPin === item.key}
									title={item.note}
									onClick={() => setLegendPin(legendPin === item.key ? null : item.key)}
									onPointerEnter={(e) => e.pointerType === 'mouse' && setLegendHover(item.key)}
									onPointerLeave={() => setLegendHover(null)}
									className={cn(
										'flex items-center gap-1.5 rounded-full border py-1 pr-3 pl-1.5 text-sm transition-colors focus-ring',
										legendPin === item.key ? 'border-fg-subtle bg-surface-3 text-fg-strong' : 'border-edge text-fg-muted hover:border-edge-strong hover:text-fg'
									)}
								>
									<span className={cn('ptable-cell size-4 rounded-full border', item.fill ? 'border-edge-strong' : 'border-dashed border-fg-muted')} style={{ '--pt-fill': item.fill } as CSSProperties} aria-hidden="true" />
									{item.label}
								</button>
							</li>
						))}
					</ul>
				)}
			</div>

			<div className="flex flex-col xl:flex-row xl:items-start">
				{/* On a narrow screen the table keeps its width and scrolls sideways. A scrolling box clips what
				    leaves it, so it is padded by what a cell on the edge grows under the pointer. */}
				<div className="-mx-4 -my-3 min-w-0 flex-1 overflow-x-auto px-4 py-3 sm:-mx-3 sm:px-3">
					<div className="@container min-w-[54rem]">
						<div
							ref={grid}
							role="group"
							aria-label="Tavola periodica degli elementi"
							onPointerLeave={() => setHovered(null)}
							className="grid gap-[0.28cqw]"
							style={{ gridTemplateColumns: '1.1rem repeat(18, minmax(0, 1fr))', gridTemplateRows: 'auto repeat(7, auto) 0.9cqw auto auto' }}
						>
							{Array.from({ length: 18 }, (_, i) => (
								<span key={i} className="text-center font-mono text-[0.65rem] leading-tight text-fg-subtle" style={{ gridColumn: i + 2, gridRow: 1 }} aria-hidden="true">
									{i + 1}
								</span>
							))}
							{Array.from({ length: 7 }, (_, i) => (
								<span key={i} className="flex items-center font-mono text-[0.65rem] text-fg-subtle" style={{ gridColumn: 1, gridRow: i + 2 }} aria-hidden="true">
									{i + 1}
								</span>
							))}

							<Preview el={shown} reading={shown ? read(shown) : null} />

							{SERIES_CELLS.map((cell) => (
								<span
									key={cell.label}
									className={cn('ptable-cell flex items-center justify-center rounded-[0.4cqw] border border-dashed border-edge-strong font-mono transition-opacity', cellText, view !== 'famiglie' && 'opacity-60', focusKey && focusKey !== cell.family && 'opacity-25')}
									style={{ gridColumn: cell.col + 1, gridRow: cell.row + 1, '--pt-fill': view === 'famiglie' ? `var(--pt-${cell.family})` : undefined } as CSSProperties}
									title={cell.name}
								>
									{cell.label}
								</span>
							))}

							{ELEMENTI.map((el) => {
								const { row, col } = gridPlace(el);
								const reading = read(el);
								const isSelected = selected?.z === el.z;
								return (
									<button
										key={el.z}
										type="button"
										data-z={el.z}
										tabIndex={tabStop === el.z ? 0 : -1}
										aria-pressed={isSelected}
										aria-label={`${el.name}, numero atomico ${el.z}. ${reading.fact}`}
										onClick={() => open(isSelected ? '' : el.symbol)}
										onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(el)}
										onFocus={() => {
											setHovered(el);
											setLastFocused(el.z);
										}}
										onBlur={() => setHovered(null)}
										className={cn(
											'ptable-cell relative flex aspect-[13/14] min-w-0 flex-col items-center justify-between rounded-[0.4cqw] border px-[0.2cqw] pt-[0.25cqw] pb-[0.3cqw] leading-none transition-[opacity,transform,box-shadow] duration-150',
											'hover:z-10 hover:scale-110 hover:shadow-lift focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg-strong motion-reduce:hover:scale-100',
											reading.fill ? 'border-edge' : 'border-dashed border-fg-muted',
											isSelected && 'z-10 ring-2 ring-accent',
											focusKey && focusKey !== reading.key && 'opacity-25'
										)}
										style={{ gridColumn: col + 1, gridRow: row + 1, '--pt-fill': reading.fill } as CSSProperties}
									>
										<span className={cn('self-start pl-[0.15cqw] font-mono', cellText)}>{el.z}</span>
										<span className="font-display text-[clamp(0.85rem,1.75cqw,1.6rem)] font-semibold">{el.symbol}</span>
										<span className={cn('hidden w-full truncate text-center leading-tight @[60rem]:block', cellText)}>{el.name}</span>
										<span className={cn('font-mono', cellText)}>{reading.line}</span>
									</button>
								);
							})}
						</div>
					</div>
				</div>

				{/* The card opens and closes by growing: sideways beside the table, downwards under it on a narrower
				    screen. The element just closed stays drawn while it shrinks. */}
				<div
					inert={!selected}
					className={cn(
						'grid xl:sticky xl:top-24 xl:block xl:shrink-0 xl:overflow-hidden',
						moves && 'transition-[grid-template-rows,width,opacity] duration-300 ease-out-soft motion-reduce:transition-none',
						selected ? 'grid-rows-[1fr] opacity-100 xl:w-[21rem] 2xl:w-[22.25rem]' : 'grid-rows-[0fr] opacity-0 xl:w-0'
					)}
				>
					<div ref={cardBox} className="min-h-0 scroll-mb-4 overflow-hidden xl:w-[21rem] 2xl:w-[22.25rem]">
						<div className="pt-5 pb-1 xl:pt-0 xl:pl-5">{card && <ElementPanel el={card} fill={read(card).fill} onClose={close} />}</div>
					</div>
				</div>
				<p className="sr-only" aria-live="polite">
					{selected ? `Scheda aperta: ${selected.name}` : ''}
				</p>
			</div>
		</div>
	);
}

/** The space above the transition metals: the element under the pointer, large, with what the view says about it. */
function Preview({ el, reading }: { el: ChemElement | null; reading: Reading | null }) {
	const place = { gridColumn: '4 / 14', gridRow: '2 / 5' };
	if (!el || !reading) {
		return (
			<p className="pencil flex items-center justify-center px-[2cqw] text-center text-[clamp(1rem,1.9cqw,1.6rem)] text-fg-subtle" style={place} aria-hidden="true">
				Passa su un elemento per vederlo qui, clicca per aprire la sua scheda.
			</p>
		);
	}
	const small = 'text-[clamp(0.68rem,1.02cqw,0.95rem)]';
	return (
		<div className="flex items-center gap-[1.6cqw] px-[1.5cqw]" style={place} aria-hidden="true">
			<div className="ptable-cell flex aspect-square h-[82%] shrink-0 flex-col items-center justify-center gap-[0.7cqw] rounded-[0.8cqw] border border-edge-strong leading-none shadow-paper" style={{ '--pt-fill': reading.fill } as CSSProperties}>
				<span className={cn('font-mono', small)}>{el.z}</span>
				<span className="font-display text-[clamp(1.6rem,4.4cqw,4rem)] font-semibold">{el.symbol}</span>
				<span className={cn('font-mono', small)}>{el.mass}</span>
			</div>
			<div className="flex min-w-0 flex-1 flex-col gap-[0.3cqw]">
				<p className="truncate font-display text-[clamp(1.1rem,2.4cqw,2.2rem)] font-semibold leading-tight text-fg-strong">{el.name}</p>
				<p className={cn('font-medium text-fg', small)}>{reading.fact}</p>
				<p className={cn('text-fg-muted', small)}>
					<Config el={el} />
				</p>
				<p className={cn('text-fg-muted', small)}>Massa atomica: {massText(el)}</p>
				{el.oxidation.length > 0 && (
					<p className={cn('truncate text-fg-muted', small)}>
						Numeri di ossidazione: {el.oxidation.join(', ')}
						{el.oxidationPredicted && ' (previsti)'}
					</p>
				)}
			</div>
		</div>
	);
}

'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Slider } from '@/components/ui/Slider';
import { binderLabelClass, binderRowClass, binderTabClass } from '@/components/ui/binder-tabs';

/*
 * Three things of the site to try on the landing page, behind the tabs of a binder: the
 * graph of a parabola to drag about, a deck of flashcards, the periodic
 * table. Each is a small copy written for this page; the link under it opens the real one.
 */

export interface BenchCard {
	tone: string;
	subject: string;
	front: string;
	back: string;
}
export interface BenchElement {
	z: number;
	symbol: string;
	name: string;
	mass: string;
	family: string;
	familyName: string;
	config: string;
	/** Column and row in the grid, with the two series under the table. */
	col: number;
	row: number;
}

const TABS = [
	{ id: 'grafico', label: 'Grafico', tone: 'math' },
	{ id: 'flashcard', label: 'Flashcard', tone: 'physics' },
	{ id: 'tavola', label: 'Tavola periodica', tone: 'chemistry' }
] as const;
type TabId = (typeof TABS)[number]['id'];

export function Bench({ cards, elements }: { cards: BenchCard[]; elements: BenchElement[] }) {
	const [tab, setTab] = useState<TabId>('grafico');
	const tone = TABS.find((t) => t.id === tab)!.tone;
	return (
		<div data-subject={tone}>
			<div role="tablist" aria-label="Cosa provare" className={cn(binderRowClass, 'scroll-x border-b border-edge-strong px-2 sm:px-4')}>
				{TABS.map((t) => (
					<button key={t.id} type="button" role="tab" id={`banco-${t.id}`} aria-selected={tab === t.id} aria-controls="banco-pannello" data-subject={t.tone} onClick={() => setTab(t.id)} className={binderTabClass(tab === t.id, tab === t.id ? '!border-b-surface !bg-surface' : '')}>
						<span className={binderLabelClass(tab === t.id)}>{t.label}</span>
					</button>
				))}
			</div>
			<div id="banco-pannello" role="tabpanel" aria-labelledby={`banco-${tab}`} className="rounded-b-3xl border border-t-0 border-edge-strong bg-surface p-5 shadow-lift sm:p-8">
				<div key={tab} className="animate-note-in">
					{tab === 'grafico' && <Plot />}
					{tab === 'flashcard' && <Deck cards={cards} />}
					{tab === 'tavola' && <Table elements={elements} />}
				</div>
			</div>
		</div>
	);
}

function More({ href, children }: { href: string; children: string }) {
	return (
		<Link href={href} className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-tint-fg no-underline focus-ring">
			<span className="underline decoration-tint-edge decoration-2 underline-offset-4 group-hover:decoration-tint">{children}</span>
			<ArrowRight className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-1" aria-hidden="true" />
		</Link>
	);
}

/* ---- the graph ---- */

const U = 30; // one unit of the plane, in viewBox units
const HALF_X = 7;
const HALF_Y = 5;
const num = (v: number, digits = 2) => {
	const s = (Math.round(v * 10 ** digits) / 10 ** digits).toString().replace('.', ',').replace('-', '−');
	return s === '−0' ? '0' : s;
};

const A_MAX = 2;
const BC_MAX = 8;
const tenth = (v: number) => Math.round(v * 10) / 10;
const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));

/** What is being dragged, and the vertex as it was when the drag began: the opening changes about that point. */
type Grip = { kind: 'vertex' } | { kind: 'arm'; side: 1 | -1; h: number; k: number };

/**
 * A parabola to move with the hands. The vertex drags the curve about (b and c); the two
 * rings one unit either side of it, which show when the curve is under the mouse, open and close it (a). The three coefficients move in
 * tenths, on the drawing as on the sliders, so the point under the finger lands on the
 * nearest curve the sliders can make. `compact` is one column without the readings, for a narrow place.
 */
export function Plot({ compact = false }: { compact?: boolean }) {
	const [a, setA] = useState(1);
	const [b, setB] = useState(-2);
	const [c, setC] = useState(-3);
	const svg = useRef<SVGSVGElement>(null);
	const grip = useRef<Grip | null>(null);
	const [held, setHeld] = useState<Grip['kind'] | null>(null);
	const f = (x: number) => a * x * x + b * x + c;
	const X = (x: number) => x * U;
	const Y = (y: number) => -y * U;
	const path = useMemo(() => {
		let d = '';
		for (let i = 0; i <= 140; i++) {
			const x = -HALF_X + (2 * HALF_X * i) / 140;
			const y = Math.max(-HALF_Y - 2, Math.min(HALF_Y + 2, a * x * x + b * x + c));
			d += `${i ? 'L' : 'M'}${(x * U).toFixed(1)} ${(-y * U).toFixed(1)}`;
		}
		return d;
	}, [a, b, c]);
	const delta = b * b - 4 * a * c;
	const vertex = a !== 0 ? { x: -b / (2 * a), y: f(-b / (2 * a)) } : null;
	const zeros = a === 0 ? (b !== 0 ? [-c / b] : []) : delta > 0 ? [(-b - Math.sqrt(delta)) / (2 * a), (-b + Math.sqrt(delta)) / (2 * a)].sort((p, q) => p - q) : delta === 0 ? [-b / (2 * a)] : [];
	const inside = (x: number, y: number) => Math.abs(x) <= HALF_X && Math.abs(y) <= HALF_Y;

	/** The curve with opening `opening` and vertex (h, k), on the tenths. */
	const place = (opening: number, h: number, k: number) => {
		setA(opening);
		setB(tenth(clamp(-2 * opening * h, BC_MAX)));
		setC(tenth(clamp(k + opening * h * h, BC_MAX)));
	};
	const grab = (e: React.PointerEvent<SVGGElement>, g: Grip) => {
		e.currentTarget.setPointerCapture(e.pointerId);
		grip.current = g;
		setHeld(g.kind);
	};
	const drag = (e: React.PointerEvent<SVGGElement>) => {
		const g = grip.current;
		const m = svg.current?.getScreenCTM();
		if (!g || !m) return;
		const x = clamp((e.clientX - m.e) / m.a / U, HALF_X);
		const y = clamp(-(e.clientY - m.f) / m.d / U, HALF_Y);
		if (g.kind === 'vertex') place(a, x, y);
		else {
			// the arm stands one unit from the vertex, so its height over the vertex is the opening; a flat line has no vertex to hold
			const opening = tenth(clamp(y - g.k, A_MAX));
			place(opening === 0 ? (y >= g.k ? 0.1 : -0.1) : opening, g.h, g.k);
		}
	};
	const drop = () => {
		grip.current = null;
		setHeld(null);
	};
	const handle = { onPointerMove: drag, onPointerUp: drop, onPointerCancel: drop, onLostPointerCapture: drop, style: { touchAction: 'none' } as const };

	const term = (k: number, body: React.ReactNode, first = false) =>
		k === 0 ? null : (
			<>
				{k < 0 ? (first ? '−' : ' − ') : first ? '' : ' + '}
				{Math.abs(k) === 1 && body ? '' : num(Math.abs(k))}
				{body}
			</>
		);
	const x2 = (
		<>
			<i>x</i>
			<sup className="-top-[0.6em] ml-[0.22em] mr-[0.1em] text-[0.5em] not-italic tracking-normal">2</sup>
		</>
	);
	return (
		<div className={cn('grid items-center', compact ? 'gap-4' : 'gap-8 lg:grid-cols-[1.25fr_1fr]')}>
			<figure className={cn(compact && 'mx-auto w-full max-w-[23rem]')}>
				<svg ref={svg} viewBox={`${-HALF_X * U - 14} ${-HALF_Y * U - 14} ${2 * HALF_X * U + 28} ${2 * HALF_Y * U + 28}`} className="w-full select-none rounded-2xl border border-edge bg-page" role="img" aria-label={`Grafico della parabola con a = ${num(a)}, b = ${num(b)}, c = ${num(c)}`}>
					<defs>
						<clipPath id="banco-piano">
							<rect x={-HALF_X * U} y={-HALF_Y * U} width={2 * HALF_X * U} height={2 * HALF_Y * U} />
						</clipPath>
					</defs>
					<g stroke="var(--grid)" strokeWidth="1">
						{Array.from({ length: 2 * HALF_X + 1 }, (_, i) => (
							<path key={`v${i}`} d={`M${X(i - HALF_X)} ${Y(HALF_Y)}V${Y(-HALF_Y)}`} />
						))}
						{Array.from({ length: 2 * HALF_Y + 1 }, (_, i) => (
							<path key={`h${i}`} d={`M${X(-HALF_X)} ${Y(i - HALF_Y)}H${X(HALF_X)}`} />
						))}
					</g>
					<g stroke="var(--fg-muted)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
						<path d={`M${X(-HALF_X) - 8} 0H${X(HALF_X) + 8}m-6 -4l6 4l-6 4`} />
						<path d={`M0 ${Y(-HALF_Y) + 8}V${Y(HALF_Y) - 8}m-4 6l4 -6l4 6`} />
					</g>
					<g className="font-mono" fontSize="9" fill="var(--fg-subtle)" textAnchor="middle">
						{[-6, -4, -2, 2, 4, 6].map((x) => (
							<text key={x} x={X(x)} y={13}>
								{num(x)}
							</text>
						))}
						{[-4, -2, 2, 4].map((y) => (
							<text key={y} x={-9} y={Y(y) + 3}>
								{num(y)}
							</text>
						))}
					</g>
					<g clipPath="url(#banco-piano)">
						{vertex && inside(vertex.x, vertex.y) && <path d={`M${X(vertex.x)} ${Y(HALF_Y)}V${Y(-HALF_Y)}`} stroke="var(--fg-faint)" strokeWidth="1" strokeDasharray="4 4" />}
						<path d={path} fill="none" stroke="var(--tint)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
						{zeros.filter((x) => inside(x, 0)).map((x, i) => (
							<circle key={i} cx={X(x)} cy={0} r="4.5" fill="var(--tint)" stroke="var(--surface)" strokeWidth="1.5" />
						))}
					</g>
					{/* The grips, over everything and never clipped: each is a wide target for a finger around a small mark.
					    The two that open the curve show while the curve is under the mouse or one of them is held; where
					    there is no mouse they are always there. */}
					{vertex && (
						<g aria-hidden="true">
							<g className="group/curve">
								<path d={path} clipPath="url(#banco-piano)" fill="none" stroke="transparent" strokeWidth="26" />
								{([-1, 1] as const).map((side) => {
									const at = { x: vertex.x + side, y: vertex.y + a };
									if (!inside(at.x, at.y)) return null;
									return (
										<g key={side} onPointerDown={(e) => grab(e, { kind: 'arm', side, h: vertex.x, k: vertex.y })} {...handle} className={cn('cursor-ns-resize transition-opacity duration-200 handheld:opacity-100', held === 'arm' ? 'opacity-100' : 'opacity-0 group-hover/curve:opacity-100')}>
											<circle cx={X(at.x)} cy={Y(at.y)} r="16" fill="transparent" />
											<circle cx={X(at.x)} cy={Y(at.y)} r="6" fill="var(--surface)" stroke="var(--tint)" strokeWidth="2.2" className="transition-[r] duration-150 hover:[r:7.5px]" />
										</g>
									);
								})}
							</g>
							{inside(vertex.x, vertex.y) && (
								<g onPointerDown={(e) => grab(e, { kind: 'vertex' })} {...handle} className={held === 'vertex' ? 'cursor-grabbing' : 'cursor-grab'}>
									<circle cx={X(vertex.x)} cy={Y(vertex.y)} r="18" fill="transparent" />
									<circle cx={X(vertex.x)} cy={Y(vertex.y)} r={held === 'vertex' ? 11 : 9} fill="var(--tint)" fillOpacity="0.18" className="transition-[r] duration-150" />
									<circle cx={X(vertex.x)} cy={Y(vertex.y)} r="5" fill="var(--fg-strong)" stroke="var(--surface)" strokeWidth="1.5" />
								</g>
							)}
						</g>
					)}
				</svg>
				<figcaption className={cn('label-mono mt-3 flex-wrap items-center gap-x-5 gap-y-1 text-fg-subtle', compact ? 'hidden' : 'flex')}>
					<span className="flex items-center gap-2">
						<span className="size-2.5 rounded-full bg-fg-strong" aria-hidden="true" />
						trascina il vertice
					</span>
					<span className="flex items-center gap-2">
						<span className="size-2.5 rounded-full border-2 border-tint bg-surface" aria-hidden="true" />
						<span className="handheld:hidden">passa sulla curva per aprirla o chiuderla</span>
						<span className="desk:hidden">apri o chiudi la curva</span>
					</span>
				</figcaption>
			</figure>
			<div>
				<p className={cn('font-display font-medium tracking-tight text-fg-strong', compact ? 'text-center text-2xl' : 'text-3xl sm:text-4xl')}>
					<i>y</i> = {a === 0 && b === 0 && c === 0 ? '0' : null}
					{term(a, x2, true)}
					{term(b, <i>x</i>, a === 0)}
					{term(c, null, a === 0 && b === 0)}
				</p>
				<div className={cn('flex flex-col', compact ? 'mt-3 gap-1.5' : 'mt-6 gap-3')}>
					<Slider label="a, l'apertura" value={a} min={-A_MAX} max={A_MAX} step={0.1} onChange={(v) => setA(tenth(v))} />
					<Slider label="b" value={b} min={-BC_MAX} max={BC_MAX} step={0.1} onChange={(v) => setB(tenth(v))} />
					<Slider label="c, dove taglia l'asse y" value={c} min={-BC_MAX} max={BC_MAX} step={0.1} onChange={(v) => setC(tenth(v))} />
				</div>
				{!compact && (
					<>
						<dl className="mt-6 grid grid-cols-3 gap-3 border-t border-edge pt-5">
							{[
								['Delta', a === 0 ? 'non c’è' : num(delta)],
								['Vertice', vertex ? `(${num(vertex.x)}; ${num(vertex.y)})` : 'non c’è'],
								['Zeri', zeros.length ? zeros.map((z) => num(z)).join(' e ') : 'nessuno']
							].map(([label, value]) => (
								<div key={label}>
									<dt className="label-mono text-fg-subtle">{label}</dt>
									<dd className="mt-1 font-mono text-sm tabular-nums text-fg-strong">{value}</dd>
								</div>
							))}
						</dl>
						<More href="/strumenti/grafico-di-funzione">Apri il grafico di funzione</More>
					</>
				)}
			</div>
		</div>
	);
}

/* ---- the flashcards ---- */

function Deck({ cards }: { cards: BenchCard[] }) {
	const [index, setIndex] = useState(0);
	const [turned, setTurned] = useState(false);
	const [known, setKnown] = useState(0);
	const over = index >= cards.length;
	const card = cards[Math.min(index, cards.length - 1)];
	const next = (knew: boolean) => {
		if (knew) setKnown(known + 1);
		setTurned(false);
		setIndex(index + 1);
	};
	const again = () => {
		setIndex(0);
		setKnown(0);
		setTurned(false);
	};
	return (
		<div className="grid items-center gap-8 lg:grid-cols-[1.25fr_1fr]">
			<div className="relative mx-auto w-full max-w-xl">
				{/* the cards still to come, under the one in hand */}
				{[2, 1].map((k) => index + k < cards.length && <span key={k} className="absolute inset-0 rounded-2xl border border-edge bg-surface-2 shadow-paper" style={{ transform: `translateY(${k * 7}px) rotate(${k % 2 ? 1.2 : -1}deg)` }} aria-hidden="true" />)}
				{over ? (
					<div className="relative flex min-h-72 flex-col items-center justify-center gap-4 rounded-2xl border border-edge-strong bg-surface p-8 text-center shadow-lift">
						<p className="label-mono text-fg-subtle">Mazzo finito</p>
						<p className="font-display text-4xl font-medium text-fg-strong tabular-nums">
							{known} <span className="text-fg-faint">/ {cards.length}</span>
						</p>
						<p className="text-sm text-fg-muted">Quelle da ripassare tornano al giro dopo.</p>
						<button type="button" onClick={again} className="inline-flex items-center gap-2 rounded-xl border border-edge-strong bg-surface px-4 py-2 text-sm font-semibold text-fg shadow-paper hover:bg-surface-2 focus-ring">
							<RotateCcw className="size-4" aria-hidden="true" />
							Ricomincia
						</button>
					</div>
				) : (
					<div key={index} data-subject={card.tone} className="lp-card relative min-h-72 animate-note-in" data-turned={turned ? '' : undefined}>
						<button type="button" onClick={() => setTurned(!turned)} aria-label={turned ? 'Torna alla domanda' : 'Gira la carta'} className="lp-card-inner block w-full rounded-2xl text-left focus-ring-offset">
							<span className="lp-card-face flex flex-col rounded-2xl border border-edge-strong bg-surface shadow-lift">
								<span className="flex items-center justify-between border-b-2 border-(--grid-margin) px-6 py-3">
									<span className="label-mono text-tint-fg">{card.subject}</span>
									<span className="label-mono text-fg-faint">domanda {String(index + 1).padStart(2, '0')}</span>
								</span>
								<span className="ruled-paper flex flex-1 items-center justify-center rounded-b-2xl px-6 py-8 text-center font-display text-2xl font-medium leading-8 text-fg-strong">
									<span className="block" dangerouslySetInnerHTML={{ __html: card.front }} />
								</span>
							</span>
							<span className="lp-card-face lp-card-back flex flex-col rounded-2xl border border-edge-strong bg-surface shadow-lift" aria-hidden={!turned}>
								<span className="flex items-center justify-between border-b-2 border-(--grid-margin) px-6 py-3">
									<span className="label-mono text-accent-fg">Risposta</span>
									<span className="label-mono text-fg-faint">{card.subject}</span>
								</span>
								<span className="ruled-paper math-content flex flex-1 items-center justify-center rounded-b-2xl px-6 py-8 text-center text-lg leading-8 text-fg">
									<span className="block" dangerouslySetInnerHTML={{ __html: card.back }} />
								</span>
							</span>
						</button>
					</div>
				)}
			</div>
			<div>
				<h3 className="font-display text-3xl font-medium tracking-tight text-fg-strong">Un mazzo per ogni lezione</h3>
				<p className="mt-3 text-base leading-relaxed text-fg-muted">Definizioni, regole ed errori frequenti, da ripassare in pochi minuti prima di una verifica. Tocca la carta per girarla, poi di’ se la sapevi.</p>
				<div className="mt-6 flex flex-wrap gap-3">
					<button type="button" disabled={!turned || over} onClick={() => next(false)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-edge-strong bg-surface px-4 py-2 text-sm font-semibold text-fg shadow-paper transition hover:bg-surface-2 disabled:opacity-45 focus-ring">
						<RotateCcw className="size-4" aria-hidden="true" />
						Da ripassare
					</button>
					<button type="button" disabled={!turned || over} onClick={() => next(true)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-inverse px-4 py-2 text-sm font-semibold text-inverse-fg shadow-key transition hover:opacity-90 disabled:opacity-45 focus-ring-offset">
						<Check className="size-4" strokeWidth={2.5} aria-hidden="true" />
						La sapevo
					</button>
				</div>
				<p className="mt-6 text-sm text-fg-subtle">Le flashcard fanno parte del piano Studio, compreso nella prova gratuita.</p>
			</div>
		</div>
	);
}

/* ---- the periodic table ---- */

/** A hue for each family, on the scale of the subject colours. */
const FAMILY_HUE: Record<string, [number, number]> = {
	alcalini: [18, 0.15],
	'alcalino-terrosi': [52, 0.14],
	transizione: [252, 0.1],
	'altri-metalli': [205, 0.09],
	semimetalli: [158, 0.1],
	'non-metalli': [130, 0.13],
	alogeni: [300, 0.12],
	'gas-nobili': [330, 0.12],
	lantanidi: [85, 0.12],
	attinidi: [95, 0.07]
};

function Table({ elements }: { elements: BenchElement[] }) {
	const [z, setZ] = useState(6);
	const chosen = elements.find((e) => e.z === z) ?? elements[0];
	const [hue, chroma] = FAMILY_HUE[chosen.family] ?? [265, 0.03];
	return (
		<div className="grid items-center gap-8 lg:grid-cols-[1.6fr_1fr]">
			<div className="scroll-x">
				<div className="grid min-w-[34rem] gap-[3px]" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }} role="group" aria-label="Tavola periodica degli elementi">
					{elements.map((e) => {
						const [h, k] = FAMILY_HUE[e.family] ?? [265, 0.03];
						const on = e.z === z;
						return (
							<button
								key={e.z}
								type="button"
								onPointerEnter={(ev) => ev.pointerType === 'mouse' && setZ(e.z)}
								onFocus={() => setZ(e.z)}
								onClick={() => setZ(e.z)}
								aria-label={`${e.name}, numero atomico ${e.z}`}
								aria-pressed={on}
								className={cn('lp-element flex aspect-square items-center justify-center rounded-[5px] text-[0.68rem] font-semibold leading-none transition-transform duration-150 focus-ring', on && 'z-10 scale-125 shadow-lift')}
								style={{ gridColumn: e.col, gridRow: e.row, '--h': h, '--k': k } as React.CSSProperties}
							>
								{e.symbol}
							</button>
						);
					})}
				</div>
			</div>
			<div>
				<div className="flex items-start gap-5">
					<div className="lp-element flex size-28 shrink-0 flex-col justify-between rounded-2xl p-3 shadow-lift" style={{ '--h': hue, '--k': chroma } as React.CSSProperties}>
						<span className="font-mono text-xs font-medium tabular-nums">{chosen.z}</span>
						<span className="font-display text-5xl font-semibold leading-none">{chosen.symbol}</span>
						<span className="font-mono text-xs tabular-nums">{chosen.mass}</span>
					</div>
					<div className="min-w-0 pt-1">
						<p className="label-mono text-fg-subtle">{chosen.familyName}</p>
						<h3 className="mt-1 font-display text-3xl font-medium tracking-tight text-fg-strong">{chosen.name}</h3>
						<p className="mt-2 font-mono text-sm text-fg-muted">{chosen.config}</p>
					</div>
				</div>
				<p className="mt-6 text-base leading-relaxed text-fg-muted">Sulla tavola vera ogni elemento ha la scheda completa, lo stato fisico a una temperatura scelta, gli andamenti periodici e gli isotopi.</p>
				<More href="/strumenti/tavola-periodica">Apri la tavola periodica</More>
			</div>
		</div>
	);
}

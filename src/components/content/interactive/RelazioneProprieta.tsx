'use client';

import { useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Check, Eraser, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { frame, Drawing, Figure, Caption, ButtonRow, Tex, INK, TINT, THIN, DASH, v, add, sub, scale, unit, ang, dist, type V, FONT } from './kit';
import { tipStealth, edge, loop, curvePath, endDir, type Curve } from './insiemi';

/**
 * Lesson 41, "Come si controlla una proprietà": a relation on three or four elements, built by tapping. Tap an element
 * and then another for the arrow between them, the same element twice for its loop; the same gesture takes an arrow
 * away. Four lights say whether the relation is reflexive, symmetric, antisymmetric, transitive; the one chosen (or
 * the first that is off) shows its counterexample in the diagram: the missing loops, return arrows or shortcuts
 * dashed, or the pair of arrows that breaks antisymmetry.
 */

const f = frame(-1.2, 4.2, -1.15, 3.55);
const NODE = 0.22;
const PLACES: Record<3 | 4, V[]> = {
	3: [v(0, 0), v(1.5, 2), v(3, 0)],
	4: [v(0, 0), v(0, 2.4), v(3, 2.4), v(3, 0)]
};
const START = ['0,0', '1,1', '2,2', '0,1', '1,2'];

type Prop = 'riflessiva' | 'simmetrica' | 'antisimmetrica' | 'transitiva';
const PROPS: Prop[] = ['riflessiva', 'simmetrica', 'antisimmetrica', 'transitiva'];
const k = (a: number, b: number) => `${a},${b}`;

/** What breaks each property: arrows to add (missing) or arrows that clash, and the sentence that says it. */
function analyse(n: number, R: Set<string>) {
	const has = (a: number, b: number) => R.has(k(a, b));
	const els = Array.from({ length: n }, (_, i) => i);
	const name = (i: number) => `${i + 1}`;
	const pair = (a: number, b: number) => `(${name(a)}, ${name(b)})`;

	const noLoop = els.filter((a) => !has(a, a));
	const noReturn = els.flatMap((a) => els.filter((b) => a !== b && has(a, b) && !has(b, a)).map((b) => [b, a] as [number, number]));
	const both = els.flatMap((a) => els.filter((b) => a < b && has(a, b) && has(b, a)).map((b) => [a, b] as [number, number]));
	const paths = els.flatMap((a) => els.flatMap((b) => els.filter((c) => has(a, b) && has(b, c) && !has(a, c)).map((c) => [a, b, c] as [number, number, number])));
	const shortcuts = [...new Set(paths.map(([a, , c]) => k(a, c)))].map((s) => s.split(',').map(Number) as [number, number]);

	const ok: Record<Prop, boolean> = { riflessiva: !noLoop.length, simmetrica: !noReturn.length, antisimmetrica: !both.length, transitiva: !paths.length };
	const why: Record<Prop, string> = {
		riflessiva: ok.riflessiva ? 'Riflessiva: c’è il cappio su ogni elemento.' : `Riflessiva: no, ${noLoop.length === 1 ? `manca il cappio su ${name(noLoop[0])}, tratteggiato` : `mancano i cappi su ${noLoop.slice(0, -1).map(name).join(', ')} e ${name(noLoop[noLoop.length - 1])}, tratteggiati`}.`,
		simmetrica: ok.simmetrica ? 'Simmetrica: ogni freccia tra elementi diversi ha quella di ritorno.' : `Simmetrica: no, $${name(noReturn[0][1])} \\mathrel{\\mathcal{R}} ${name(noReturn[0][0])}$ ma manca ${pair(...noReturn[0])}${noReturn.length > 1 ? '; tutte le frecce di ritorno mancanti sono tratteggiate' : ', tratteggiata'}.`,
		antisimmetrica: ok.antisimmetrica ? 'Antisimmetrica: nessuna freccia tra elementi diversi ha quella di ritorno.' : `Antisimmetrica: no, ci sono ${pair(...both[0])} e ${pair(both[0][1], both[0][0])} con $${name(both[0][0])} \\neq ${name(both[0][1])}$ (in rosso): togline una.`,
		transitiva: ok.transitiva
			? 'Transitiva: ogni percorso di due frecce ha la sua scorciatoia.'
			: `Transitiva: no, $${name(paths[0][0])} \\mathrel{\\mathcal{R}} ${name(paths[0][1])}$ e $${name(paths[0][1])} \\mathrel{\\mathcal{R}} ${name(paths[0][2])}$ ma manca ${pair(paths[0][0], paths[0][2])}${shortcuts.length > 1 ? '; tutte le scorciatoie mancanti sono tratteggiate' : ', tratteggiata'}.`
	};
	const missing: Record<Prop, [number, number][]> = { riflessiva: noLoop.map((a) => [a, a]), simmetrica: noReturn, antisimmetrica: [], transitiva: shortcuts };
	const clash: [number, number][] = both.flatMap(([a, b]) => [[a, b], [b, a]] as [number, number][]);
	const antiriflessiva = els.every((a) => !has(a, a));
	return { ok, why, missing, clash, antiriflessiva };
}

/** The curve of an arrow from a to b in the diagram, bent when the return arrow is there too. */
function curveOf(ps: V[], a: number, b: number, twoWay: boolean): Curve {
	if (a === b) {
		const c = scale(ps.reduce(add, v(0, 0)), 1 / ps.length);
		return loop(ps[a], ang(sub(ps[a], c)), NODE);
	}
	return edge(ps[a], ps[b], NODE + 0.06, twoWay ? 20 : 0);
}

function Arrow({ c, color = '#000', dashed = false, width = THIN }: { c: Curve; color?: string; dashed?: boolean; width?: number }) {
	return (
		<g pointerEvents="none">
			<path d={curvePath(f, c)} fill="none" stroke={color} strokeWidth={width} strokeDasharray={dashed ? DASH : undefined} />
			<path d={tipStealth(f, c.p1, endDir(c))} fill={color} />
		</g>
	);
}

export default function RelazioneProprieta({ alt }: { alt?: string }) {
	const [n, setN] = useState<3 | 4>(3);
	const [R, setR] = useState(() => new Set(START));
	const [sel, setSel] = useState<number | null>(null);
	const [pointer, setPointer] = useState<V | null>(null);
	const [chosen, setChosen] = useState<Prop | null>(null);
	const ps = PLACES[n];

	const toggle = (a: number, b: number) =>
		setR((s) => {
			const next = new Set(s);
			if (next.has(k(a, b))) next.delete(k(a, b));
			else next.add(k(a, b));
			return next;
		});
	/** A tap on element i: pick it; with one picked, join the two (the same one twice is its loop). */
	const tap = (i: number) => {
		if (sel === null) {
			setSel(i);
			return true;
		}
		toggle(sel, i);
		setSel(null);
		return false;
	};
	const down = (i: number) => (e: PointerEvent<SVGGElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (tap(i)) {
			e.currentTarget.setPointerCapture(e.pointerId);
			const svg = e.currentTarget.ownerSVGElement;
			if (svg) setPointer(f.toTikz(e, svg));
		}
	};
	const move = (e: PointerEvent<SVGGElement>) => {
		const svg = e.currentTarget.ownerSVGElement;
		if (pointer && svg) setPointer(f.toTikz(e, svg));
	};
	const up = () => {
		if (pointer && sel !== null) {
			// Dropped on another element: that is the arrow. Dropped back on the same one, it stays picked.
			const hit = ps.findIndex((p, j) => j !== sel && dist(p, pointer) < 0.45);
			if (hit >= 0) tap(hit);
		}
		setPointer(null);
	};
	const key = (i: number) => (e: KeyboardEvent<SVGGElement>) => {
		if (e.key === 'Escape') setSel(null);
		if (e.key !== 'Enter' && e.key !== ' ') return;
		e.preventDefault();
		tap(i);
	};

	const setSize = (m: '3' | '4') => {
		const size = Number(m) as 3 | 4;
		setN(size);
		setSel(null);
		setR((s) => new Set([...s].filter((p) => p.split(',').every((x) => Number(x) < size))));
	};

	const A = analyse(n, R);
	const focus: Prop | null = chosen ?? PROPS.find((p) => !A.ok[p]) ?? null;
	const missing = focus ? A.missing[focus] : [];
	const clash = focus === 'antisimmetrica' ? A.clash : [];
	// Drawn bent when the return arrow is drawn too, existing or dashed.
	const shown = new Set([...R, ...missing.map(([a, b]) => k(a, b))]);
	const pairs = [...R].map((s) => s.split(',').map(Number) as [number, number]).sort((x, y) => x[0] - y[0] || x[1] - y[1]);

	const equivalence = A.ok.riflessiva && A.ok.simmetrica && A.ok.transitiva;
	const order = A.ok.antisimmetrica && A.ok.transitiva && (A.ok.riflessiva || A.antiriflessiva) && R.size > 0;
	const kind = [equivalence && 'di equivalenza', order && (A.ok.riflessiva ? 'd’ordine largo' : 'd’ordine stretto')].filter(Boolean).join(' e ');

	const caption = sel !== null ? `Hai scelto ${sel + 1}: tocca un altro elemento per la freccia da ${sel + 1}, o di nuovo ${sel + 1} per il cappio.` : focus ? A.why[focus] : 'Valgono tutte e quattro le proprietà: tocca una spia per vedere perché.';

	return (
		<Figure>
			<ToggleGroup label="Elementi dell’insieme" options={[{ value: '3', label: '3 elementi' }, { value: '4', label: '4 elementi' }]} value={`${n}` as '3' | '4'} onChange={setSize} />
			<Drawing f={f} label={alt ?? 'Diagramma di una relazione da costruire con frecce e cappi'}>
				<rect x={0} y={0} width={f.W} height={f.H} fill="transparent" onPointerDown={() => setSel(null)} />
				{pairs.map(([a, b]) => {
					const bad = clash.some(([x, y]) => x === a && y === b);
					return <Arrow key={k(a, b)} c={curveOf(ps, a, b, a !== b && shown.has(k(b, a)))} color={bad ? INK.red : '#000'} width={bad ? 1.2 : THIN} />;
				})}
				{missing.map(([a, b]) => (
					<Arrow key={`m${k(a, b)}`} c={curveOf(ps, a, b, a !== b && shown.has(k(b, a)))} color={INK.red} dashed />
				))}
				{sel !== null && pointer && dist(pointer, ps[sel]) > 0.3 && (() => {
					const a = f.px(add(ps[sel], scale(unit(sub(pointer, ps[sel])), NODE))), b = f.px(pointer);
					return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} pointerEvents="none" />;
				})()}
				{ps.map((p, i) => {
					const q = f.px(p);
					const picked = sel === i;
					return (
						<g
							key={i}
							role="button"
							tabIndex={0}
							aria-pressed={picked}
							aria-label={`Elemento ${i + 1}: premi per sceglierlo, poi un altro elemento per la freccia o di nuovo questo per il cappio`}
							className="group cursor-pointer outline-none"
							style={{ touchAction: 'none' }}
							onPointerDown={down(i)}
							onPointerMove={move}
							onPointerUp={up}
							onPointerCancel={up}
							onKeyDown={key(i)}
						>
							<circle cx={q.x} cy={q.y} r={18} fill="transparent" />
							<circle cx={q.x} cy={q.y} r={11} fill={picked ? TINT.orange : 'none'} stroke="#000" strokeWidth={1} className={picked ? '' : 'opacity-0 transition-opacity group-hover:opacity-30 group-focus-visible:opacity-80'} />
							<text x={q.x} y={q.y} dy="0.35em" textAnchor="middle" fontSize={15} fontFamily={FONT} fill="#000" pointerEvents="none">
								{i + 1}
							</text>
						</g>
					);
				})}
			</Drawing>
			<div className="flex max-w-lg flex-wrap justify-center gap-x-1.5 gap-y-1 text-sm text-fg">
				<Tex>{'\\mathcal{R} = \\{'}</Tex>
				{pairs.length === 0 && <Tex>{'\\,'}</Tex>}
				{pairs.map(([a, b], i) => (
					<Tex key={k(a, b)}>{`(${a + 1}, ${b + 1})${i < pairs.length - 1 ? ',' : ''}`}</Tex>
				))}
				<Tex>{'\\}'}</Tex>
			</div>
			<div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Proprietà: scegline una per vedere perché vale o no">
				{PROPS.map((p) => (
					<button
						key={p}
						type="button"
						aria-pressed={focus === p}
						onClick={() => setChosen(chosen === p ? null : p)}
						className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-ring ${A.ok[p] ? 'border-ok-edge bg-ok-soft text-ok-fg' : 'border-danger-edge bg-danger-soft text-danger-fg'} ${focus === p ? 'ring-2 ring-accent/60' : ''}`}
					>
						{A.ok[p] ? <Check className="size-4" aria-hidden="true" /> : <X className="size-4" aria-hidden="true" />}
						{p}: {A.ok[p] ? 'sì' : 'no'}
					</button>
				))}
			</div>
			<Caption>
				{caption.split('$').map((part, i) => (i % 2 ? <Tex key={i}>{part}</Tex> : <span key={i}>{part}</span>))}
				{kind && sel === null ? ` È una relazione ${kind}.` : ''}
			</Caption>
			<ButtonRow>
				{missing.length > 0 && (
					<Button variant="secondary" size="sm" onClick={() => setR((s) => new Set([...s, ...missing.map(([a, b]) => k(a, b))]))}>
						<Plus className="size-4" aria-hidden="true" />
						{focus === 'riflessiva' ? (missing.length === 1 ? 'Aggiungi il cappio' : 'Aggiungi i cappi') : missing.length === 1 ? 'Aggiungi la freccia tratteggiata' : 'Aggiungi le frecce tratteggiate'}
					</Button>
				)}
				<Button variant="secondary" size="sm" onClick={() => { setR(new Set()); setSel(null); }} disabled={!R.size}>
					<Eraser className="size-4" aria-hidden="true" />
					Cancella tutto
				</Button>
			</ButtonRow>
		</Figure>
	);
}

'use client';

import { useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Check, Eraser, Minus, Shuffle, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';
import { frame, Drawing, Figure, Caption, Controls, ButtonRow, Label, Tex, INK, TINT, THIN, K, v, dist, type V, FONT, FONT_MATH } from './kit';
import { tipTo, edge, curvePath, endDir } from './insiemi';

/**
 * Lesson 18, "Esempi con insiemi finiti": an arrow diagram the student builds. Tap an element of A and then one of B
 * (or drag from one to the other) to draw the arrow, again to take it away. Beside every element is the number of
 * arrows that leave it (A) or reach it (B); the ones that break a property are circled, and the labels function,
 * injective, surjective, bijective follow.
 */

const f = frame(-1.3, 4.3, -3.05, 3.5);
const GAP = 0.9;
const NODE = 0.25;
const LETTERS = 'abcde';
const ry = (n: number) => 0.5 * n + 0.4;
const at = (side: 0 | 1, i: number, n: number) => v(side * 3, ((n - 1) / 2) * GAP - i * GAP);

type Pick = { side: 0 | 1; i: number };
const keyOf = (i: number, j: number) => `${i},${j}`;

function randomFunction(nA: number, nB: number) {
	return new Set(Array.from({ length: nA }, (_, i) => keyOf(i, Math.floor(Math.random() * nB))));
}

export default function FrecceFunzione({ alt }: { alt?: string }) {
	const [nA, setNA] = useState(3);
	const [nB, setNB] = useState(4);
	const [arrows, setArrows] = useState(() => new Set([keyOf(0, 0), keyOf(1, 1), keyOf(2, 2)]));
	const [sel, setSel] = useState<Pick | null>(null);
	const [pointer, setPointer] = useState<V | null>(null);

	const name = (p: Pick) => (p.side === 0 ? `${p.i + 1}` : LETTERS[p.i]);
	const toggle = (a: number, b: number) =>
		setArrows((s) => {
			const next = new Set(s);
			const k = keyOf(a, b);
			if (next.has(k)) next.delete(k);
			else next.add(k);
			return next;
		});

	/** A tap (or Enter) on an element: pick it, or join it to the element picked on the other side. */
	const tap = (p: Pick) => {
		if (sel && sel.side !== p.side) {
			const [a, b] = sel.side === 0 ? [sel.i, p.i] : [p.i, sel.i];
			toggle(a, b);
			setSel(null);
			return false;
		}
		if (sel && sel.i === p.i) {
			setSel(null);
			return false;
		}
		setSel(p);
		return true;
	};
	const down = (p: Pick) => (e: PointerEvent<SVGGElement>) => {
		e.preventDefault();
		if (tap(p)) {
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
		if (pointer && sel) {
			// Released on an element of the other side: that is the arrow.
			const other = (1 - sel.side) as 0 | 1;
			const n = other === 0 ? nA : nB;
			const hit = Array.from({ length: n }, (_, i) => i).find((i) => dist(at(other, i, n), pointer) < 0.45);
			if (hit !== undefined) tap({ side: other, i: hit });
		}
		setPointer(null);
	};
	const key = (p: Pick) => (e: KeyboardEvent<SVGGElement>) => {
		if (e.key === 'Escape') setSel(null);
		if (e.key !== 'Enter' && e.key !== ' ') return;
		e.preventDefault();
		tap(p);
	};

	const resize = (side: 0 | 1) => (x: number) => {
		const n = Math.round(x);
		if (side === 0) setNA(n);
		else setNB(n);
		setSel(null);
		setArrows((s) => new Set([...s].filter((k) => { const [a, b] = k.split(',').map(Number); return side === 0 ? a < n : b < n; })));
	};

	const list = [...arrows].map((k) => k.split(',').map(Number) as [number, number]);
	const out = Array.from({ length: nA }, (_, i) => list.filter(([a]) => a === i).length);
	const inn = Array.from({ length: nB }, (_, j) => list.filter(([, b]) => b === j).length);
	const isFunction = out.every((c) => c === 1);
	const injective = isFunction && inn.every((c) => c <= 1);
	const surjective = isFunction && inn.every((c) => c >= 1);
	const bijective = injective && surjective;

	const noArrow = out.map((c, i) => (c === 0 ? i : -1)).filter((i) => i >= 0);
	const manyOut = out.map((c, i) => (c > 1 ? i : -1)).filter((i) => i >= 0);
	const manyIn = inn.map((c, j) => (c > 1 ? j : -1)).filter((j) => j >= 0);
	const noneIn = inn.map((c, j) => (c === 0 ? j : -1)).filter((j) => j >= 0);
	const letters = (js: number[]) => (js.length === 1 ? `all'elemento $${LETTERS[js[0]]}$` : `agli elementi ${js.slice(0, -1).map((j) => `$${LETTERS[j]}$`).join(', ')} e $${LETTERS[js[js.length - 1]]}$`);
	const numbers = (is: number[]) => (is.length === 1 ? `${is[0] + 1}` : `${is.slice(0, -1).map((i) => i + 1).join(', ')} e ${is[is.length - 1] + 1}`);

	let caption: string;
	if (sel) caption = `Hai scelto ${sel.side === 0 ? name(sel) : `$${name(sel)}$`}: ora tocca un elemento di ${sel.side === 0 ? 'B' : 'A'} per tracciare la freccia, o per toglierla se c'è già.`;
	else if (manyOut.length) caption = `Da ${numbers(manyOut)} partono più frecce: una funzione associa a ogni elemento di A un solo elemento di B, quindi questa non è una funzione.`;
	else if (noArrow.length) caption = `Da ${numbers(noArrow)} non parte nessuna freccia: finché ogni elemento di A non ha la sua, non è una funzione.`;
	else if (bijective) caption = 'A ogni elemento di B arriva esattamente una freccia: la funzione è biettiva.';
	else {
		const parts = [];
		if (manyIn.length) parts.push(`${letters(manyIn)} arrivano due o più frecce, quindi non è iniettiva`);
		else parts.push('a ogni elemento di B arriva al massimo una freccia, quindi è iniettiva');
		if (noneIn.length) parts.push(`${letters(noneIn)} non arriva nessuna freccia, quindi non è suriettiva`);
		else parts.push('a ogni elemento di B arriva almeno una freccia, quindi è suriettiva');
		caption = `È una funzione: ${parts.join('; ')}.`;
	}

	const spy = (label: string, on: boolean, applies = true) => (
		<Badge key={label} tone={!applies ? 'neutral' : on ? 'ok' : 'danger'} icon={!applies ? Minus : on ? Check : X}>
			{label}: {!applies ? 'non si applica' : on ? 'sì' : 'no'}
		</Badge>
	);

	const r = Math.max(nA, nB);
	const node = (side: 0 | 1, i: number, n: number) => {
		const p = at(side, i, n);
		const q = f.px(p);
		const count = side === 0 ? out[i] : inn[i];
		const bad = side === 0 ? count !== 1 : count !== 1 && isFunction;
		const picked = sel?.side === side && sel.i === i;
		const label = side === 0 ? `${i + 1}` : LETTERS[i];
		const c = f.px(v(side === 0 ? -0.95 : 3.95, p.y));
		return (
			<g
				key={`${side}${i}`}
				role="button"
				tabIndex={0}
				aria-pressed={picked}
				aria-label={`${side === 0 ? 'Elemento di A' : 'Elemento di B'} ${label}, ${count} ${count === 1 ? 'freccia' : 'frecce'} ${side === 0 ? 'in partenza' : 'in arrivo'}`}
				className="group cursor-pointer outline-none"
				style={{ touchAction: 'none' }}
				onPointerDown={down({ side, i })}
				onPointerMove={move}
				onPointerUp={up}
				onPointerCancel={up}
				onKeyDown={key({ side, i })}
			>
				<circle cx={q.x} cy={q.y} r={18} fill="transparent" />
				<circle cx={q.x} cy={q.y} r={12} fill={picked ? TINT.orange : 'none'} stroke="#000" strokeWidth={1} className={picked ? '' : 'opacity-0 transition-opacity group-hover:opacity-30 group-focus-visible:opacity-80'} />
				{bad && <circle cx={q.x} cy={q.y} r={12} fill="none" stroke={INK.red} strokeWidth={1.5} />}
				<text x={q.x} y={q.y} dy="0.35em" textAnchor="middle" fontSize={15} fontStyle={side === 0 ? 'normal' : 'italic'} fontFamily={side === 0 ? FONT : FONT_MATH} fill="#000" pointerEvents="none">
					{label}
				</text>
				<text x={c.x} y={c.y} dy="0.35em" textAnchor="middle" fontSize={12} fontFamily={FONT} fill={bad ? INK.red : INK.gray} fontWeight={bad ? 700 : 400} pointerEvents="none">
					{count}
				</text>
			</g>
		);
	};

	return (
		<Figure>
			<Drawing f={f} label={alt ?? 'Diagramma a frecce da costruire tra A e B'}>
				{[0, 3].map((x) => {
					const c = f.px(v(x, 0));
					return <ellipse key={x} cx={c.x} cy={c.y} rx={0.7 * K} ry={ry(r) * K} fill="none" stroke="#000" strokeWidth={THIN} />;
				})}
				<Label f={f} at={v(0, ry(r) + 0.35)}>A</Label>
				<Label f={f} at={v(3, ry(r) + 0.35)}>B</Label>
				{list.map(([a, b]) => {
					const c = edge(at(0, a, nA), at(1, b, nB), NODE + 0.05);
					return (
						<g key={keyOf(a, b)} fill="none" stroke="#000" strokeWidth={THIN} pointerEvents="none">
							<path d={curvePath(f, c)} />
							<path d={tipTo(f, c.p1, endDir(c))} />
						</g>
					);
				})}
				{sel && pointer && dist(pointer, at(sel.side, sel.i, sel.side === 0 ? nA : nB)) > 0.3 && (
					<line {...(() => { const a = f.px(at(sel.side, sel.i, sel.side === 0 ? nA : nB)), b = f.px(pointer); return { x1: a.x, y1: a.y, x2: b.x, y2: b.y }; })()} stroke="#000" strokeWidth={THIN} strokeDasharray="4.5 4.5" pointerEvents="none" />
				)}
				{Array.from({ length: nA }, (_, i) => node(0, i, nA))}
				{Array.from({ length: nB }, (_, j) => node(1, j, nB))}
			</Drawing>
			<div className="flex flex-wrap justify-center gap-2" aria-live="polite">
				{spy('funzione', isFunction)}
				{spy('iniettiva', injective, isFunction)}
				{spy('suriettiva', surjective, isFunction)}
				{spy('biettiva', bijective, isFunction)}
			</div>
			<Caption>{caption.split('$').map((part, i) => (i % 2 ? <Tex key={i}>{part}</Tex> : <span key={i}>{part}</span>))}</Caption>
			<Controls>
				<Slider label="Elementi di A" value={nA} min={1} max={5} step={1} onChange={resize(0)} />
				<Slider label="Elementi di B" value={nB} min={1} max={5} step={1} onChange={resize(1)} />
			</Controls>
			<ButtonRow>
				<Button variant="secondary" size="sm" onClick={() => { setArrows(new Set()); setSel(null); }} disabled={!arrows.size}>
					<Eraser className="size-4" aria-hidden="true" />
					Cancella le frecce
				</Button>
				<Button variant="secondary" size="sm" onClick={() => { setArrows(randomFunction(nA, nB)); setSel(null); }}>
					<Shuffle className="size-4" aria-hidden="true" />
					Funzione a caso
				</Button>
			</ButtonRow>
		</Figure>
	);
}

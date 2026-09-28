'use client';

import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { frame, Drawing, Figure, Caption, ButtonRow, Readout, Tex, TINT, THIN, K, v, add, sub, clamp, type V, Label } from './kit';

/**
 * Lesson 5, "Numero di elementi dell'unione": the elements of A and B are points, and the circle B is dragged onto A.
 * The points sit on a triangular grid and B moves by whole steps of the grid, so it always holds 7 points and A 19:
 * what changes is how many of B's points are also A's. Those are counted twice in |A| + |B|, and the formula takes
 * them away once.
 */

const f = frame(-3.05, 3.05, -2.05, 2.05);
const S = 0.6; // grid step
const H = (S * Math.sqrt(3)) / 2;
const RA = 1.4, RB = 0.85;
const CA = v(-1.2, 0); // A's centre is the grid's origin
/** Axial grid coordinates to TikZ centimetres. */
const pos = (q: number, r: number) => v(CA.x + q * S + r * (S / 2), CA.y + r * H);
/** The grid point nearest to p. */
function snap(p: V): [number, number] {
	const r0 = Math.round((p.y - CA.y) / H);
	let best: [number, number] = [0, r0], d = Infinity;
	for (const r of [r0 - 1, r0, r0 + 1]) {
		const q = Math.round((p.x - CA.x - r * (S / 2)) / S);
		const e = Math.hypot(pos(q, r).x - p.x, pos(q, r).y - p.y);
		if (e < d) [best, d] = [[q, r], e];
	}
	return best;
}
/** The grid points within a radius of the origin (none close to the circle: the radii sit between grid distances). */
function disk(radius: number): [number, number][] {
	const out: [number, number][] = [];
	for (let q = -4; q <= 4; q++) for (let r = -4; r <= 4; r++) if (Math.hypot(pos(q, r).x - CA.x, pos(q, r).y - CA.y) < radius) out.push([q, r]);
	return out;
}
const PA = disk(RA), PB = disk(RB);
const keyOf = (q: number, r: number) => `${q},${r}`;
const SETA = new Set(PA.map(([q, r]) => keyOf(q, r)));

/** Where B's centre may go: B stays inside U. */
function allowed([q, r]: [number, number]) {
	const c = pos(q, r);
	// Clear of the letter U in the corner too.
	return Math.abs(c.x) <= 3 - RB - 0.05 && Math.abs(c.y) <= 2 - RB - 0.05 && Math.hypot(c.x - 2.7, c.y - 1.7) > RB + 0.3;
}
/** The allowed grid point nearest to p. */
function place(p: V): [number, number] {
	p = v(clamp(p.x, -3 + RB, 3 - RB), clamp(p.y, -2 + RB, 2 - RB));
	const [q0, r0] = snap(p);
	let best: [number, number] = [q0, r0], d = Infinity;
	for (let q = q0 - 3; q <= q0 + 3; q++)
		for (let r = r0 - 3; r <= r0 + 3; r++) {
			const e = Math.hypot(pos(q, r).x - p.x, pos(q, r).y - p.y);
			if (allowed([q, r]) && e < d) [best, d] = [[q, r], e];
		}
	return best;
}

const PRESETS: { label: string; at: [number, number] }[] = [
	{ label: 'Separati', at: place(v(1.6, 0)) },
	{ label: 'Sovrapposti', at: place(v(0.1, 0.3)) },
	{ label: 'B dentro A', at: place(v(-0.9, 0.5)) }
];

export default function UnioneConta({ alt }: { alt?: string }) {
	const id = useId().replace(/:/g, '');
	const [b, setB] = useState<[number, number]>(PRESETS[0].at);
	const grab = useRef<V | null>(null);
	const [dragging, setDragging] = useState(false);

	const cB = pos(...b);
	const pb = PB.map(([q, r]) => [q + b[0], r + b[1]] as [number, number]);
	const common = pb.filter(([q, r]) => SETA.has(keyOf(q, r)));
	const union = new Set([...PA.map(([q, r]) => keyOf(q, r)), ...pb.map(([q, r]) => keyOf(q, r))]).size;
	const nA = PA.length, nB = pb.length, k = common.length;
	const inCommon = new Set(common.map(([q, r]) => keyOf(q, r)));

	const down = (e: PointerEvent<SVGGElement>) => {
		const svg = e.currentTarget.ownerSVGElement;
		if (!svg) return;
		e.preventDefault();
		e.currentTarget.setPointerCapture(e.pointerId);
		grab.current = sub(cB, f.toTikz(e, svg));
		setDragging(true);
	};
	const move = (e: PointerEvent<SVGGElement>) => {
		const svg = e.currentTarget.ownerSVGElement;
		if (!grab.current || !svg) return;
		const g = place(add(f.toTikz(e, svg), grab.current));
		if (g[0] !== b[0] || g[1] !== b[1]) setB(g);
	};
	const up = () => {
		grab.current = null;
		setDragging(false);
	};
	const key = (e: KeyboardEvent<SVGGElement>) => {
		const [q, r] = b;
		// Up and down zigzag between the two nearest points of the next row, so B stays in its column.
		const side = r % 2 === 0 ? 0 : -1;
		const next: Record<string, [number, number]> = { ArrowLeft: [q - 1, r], ArrowRight: [q + 1, r], ArrowUp: [q + side, r + 1], ArrowDown: [q + 1 + side, r - 1] };
		const g = next[e.key];
		if (!g) return;
		e.preventDefault();
		if (allowed(g)) setB(g);
	};

	const pa = f.px(CA), pbx = f.px(cB);
	const tl = f.px(v(-3, 2)), br = f.px(v(3, -2));

	let caption: string;
	if (k === 0) caption = `A e B sono disgiunti: nessun punto sta in tutti e due, $|A \\cap B| = 0$ e $|A \\cup B|$ è semplicemente $|A| + |B|$. Trascina il cerchio B verso A.`;
	else if (k === nB) caption = `Tutti i punti di B stanno anche in A: $B \\subseteq A$, e l'unione ha gli stessi elementi di A.`;
	else caption = `${k === 1 ? 'Il punto cerchiato sta' : `I ${k} punti cerchiati stanno`} sia in A sia in B: in $|A| + |B|$ ${k === 1 ? 'è contato' : 'sono contati'} due volte, e per questo si toglie $|A \\cap B| = ${k}$.`;

	return (
		<Figure>
			<Drawing f={f} label={alt ?? 'Diagramma di Eulero-Venn con il cerchio B da trascinare verso A'}>
				<defs>
					<clipPath id={`${id}a`}>
						<circle cx={pa.x} cy={pa.y} r={RA * K} />
					</clipPath>
				</defs>
				<rect x={tl.x} y={tl.y} width={br.x - tl.x} height={br.y - tl.y} fill="none" stroke="#000" strokeWidth={THIN} />
				<Label f={f} at={v(2.85, 1.72)} dir={v(-1, 0)}>U</Label>
				<circle cx={pa.x} cy={pa.y} r={RA * K} fill={TINT.blue} />
				<circle cx={pbx.x} cy={pbx.y} r={RB * K} fill={TINT.blue} />
				<circle cx={pbx.x} cy={pbx.y} r={RB * K} fill={TINT.orange} clipPath={`url(#${id}a)`} />
				<circle cx={pa.x} cy={pa.y} r={RA * K} fill="none" stroke="#000" strokeWidth={THIN} />
				<Label f={f} at={add(CA, v(-1.1, 1.35))}>A</Label>
				<Label f={f} at={add(cB, v(cB.x > 1.5 ? -0.85 : 0.85, cB.y > 0.5 ? -0.8 : 0.8))}>B</Label>
				{[...PA, ...pb.filter(([q, r]) => !SETA.has(keyOf(q, r)))].map(([q, r]) => {
					const p = f.px(pos(q, r));
					const both = inCommon.has(keyOf(q, r));
					return (
						<g key={keyOf(q, r)} pointerEvents="none">
							<circle cx={p.x} cy={p.y} r={2.4} fill="#000" />
							{both && <circle cx={p.x} cy={p.y} r={5.5} fill="none" stroke="#000" strokeWidth={0.9} />}
						</g>
					);
				})}
				<g
					role="button"
					tabIndex={0}
					aria-label={`Cerchio B, con ${k} elementi in comune con A: trascinalo, oppure usa le frecce`}
					className="group cursor-grab outline-none active:cursor-grabbing"
					style={{ touchAction: 'none' }}
					onPointerDown={down}
					onPointerMove={move}
					onPointerUp={up}
					onPointerCancel={up}
					onKeyDown={key}
				>
					<circle cx={pbx.x} cy={pbx.y} r={RB * K + 6} fill="transparent" />
					<circle cx={pbx.x} cy={pbx.y} r={RB * K} fill="none" stroke="#000" strokeWidth={THIN} />
					<circle cx={pbx.x} cy={pbx.y} r={RB * K + 4} fill="none" stroke="#000" strokeWidth={1} className={dragging ? 'opacity-50' : 'opacity-0 transition-opacity group-hover:opacity-30 group-focus-visible:opacity-80'} />
				</g>
			</Drawing>
			<Readout>
				<Tex>{`|A| = ${nA}`}</Tex>
				<Tex>{`|B| = ${nB}`}</Tex>
				<Tex>{`|A \\cap B| = ${k}`}</Tex>
			</Readout>
			<div className="text-center text-fg">
				<Tex>{`|A \\cup B| = ${nA} + ${nB} - ${k} = ${nA + nB - k}`}</Tex>
			</div>
			<Caption>
				{caption.split('$').map((part, i) => (i % 2 ? <Tex key={i}>{part}</Tex> : <span key={i}>{part}</span>))}{' '}
				Contando i punti uno per uno se ne trovano {union}.
			</Caption>
			<ButtonRow>
				{PRESETS.map((p) => (
					<Button key={p.label} variant="secondary" size="sm" onClick={() => setB(p.at)} aria-pressed={p.at[0] === b[0] && p.at[1] === b[1]}>
						{p.label}
					</Button>
				))}
			</ButtonRow>
		</Figure>
	);
}

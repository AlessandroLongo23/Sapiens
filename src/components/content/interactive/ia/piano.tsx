'use client';

import type { ReactNode } from 'react';
import { Label, v, add, INK, TINT, THICK, THIN, type Frame, type V } from '../kit';
import type { Pesi } from './regola';

/**
 * The plane of two inputs, as the figures of the artificial intelligence lessons draw it: the unit square with its
 * four corners, the points of the two classes (full dot for 1, hollow for 0), the decision line of a threshold unit
 * and the half-plane where it answers 1. Coordinates are in units of the inputs; `o` is where (0, 0) sits in the
 * frame and `u` how many TikZ centimetres a unit takes.
 */

/** How far the plane goes past 0 and 1 on each side. */
export const BORDO = 0.38;
const LO = -BORDO, HI = 1 + BORDO;

/** A letter with its index, as $x_1$: SVG text has no KaTeX. */
export const pedice = (lettera: string, n: number | string) => (
	<>
		{lettera}
		<tspan baselineShift="sub" fontSize="70%" fontStyle="normal">{n}</tspan>
	</>
);

export type Punto = { x: number; y: number; classe: number; sbagliato?: boolean; acceso?: boolean };

export function makePiano(o: V, u: number) {
	/** Units of the inputs to TikZ centimetres. */
	const at = (x: number, y: number) => add(o, v(x * u, y * u));
	/** And back. */
	const unita = (p: V) => v((p.x - o.x) / u, (p.y - o.y) / u);
	return { at, unita, o, u };
}
export type PianoGeo = ReturnType<typeof makePiano>;

const s = (p: Pesi, q: V) => p.w1 * q.x + p.w2 * q.y + p.b;

/** The part of the drawn square where the unit answers 1 (s > 0), as a polygon in units; empty when there is none. */
export function semipiano(p: Pesi): V[] {
	const quadro = [v(LO, LO), v(HI, LO), v(HI, HI), v(LO, HI)];
	const out: V[] = [];
	quadro.forEach((a, i) => {
		const b = quadro[(i + 1) % 4];
		const sa = s(p, a), sb = s(p, b);
		if (sa > 0) out.push(a);
		if ((sa > 0) !== (sb > 0)) {
			const t = sa / (sa - sb);
			out.push(v(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t));
		}
	});
	return out;
}

/** Where the decision line crosses the drawn square, or null (no line: both weights are zero, or it misses the square). */
export function tratto(p: Pesi): [V, V] | null {
	if (p.w1 === 0 && p.w2 === 0) return null;
	const quadro = [v(LO, LO), v(HI, LO), v(HI, HI), v(LO, HI)];
	const tagli: V[] = [];
	quadro.forEach((a, i) => {
		const b = quadro[(i + 1) % 4];
		const sa = s(p, a), sb = s(p, b);
		if (sa === sb) return;
		const t = sa / (sa - sb);
		if (t >= 0 && t < 1) tagli.push(v(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t));
	});
	return tagli.length >= 2 ? [tagli[0], tagli[1]] : null;
}

export function Piano({ f, g, pesi, punti, assi = [pedice('x', 1), pedice('x', 2)], children }: { f: Frame; g: PianoGeo; pesi?: Pesi; punti: Punto[]; assi?: [ReactNode, ReactNode]; children?: ReactNode }) {
	const zona = pesi ? semipiano(pesi) : [];
	const linea = pesi ? tratto(pesi) : null;
	return (
		<g>
			{zona.length > 2 && <polygon points={f.pts(...zona.map((q) => g.at(q.x, q.y)))} fill={TINT.blue} />}
			{/* axes with their arrows, as TikZ's `->` */}
			<path d={f.path([g.at(LO, 0), g.at(HI, 0)])} stroke="#000" strokeWidth={THIN} />
			<path d={f.path([g.at(0, LO), g.at(0, HI)])} stroke="#000" strokeWidth={THIN} />
			<polygon points={f.pts(add(g.at(HI, 0), v(0.14, 0)), add(g.at(HI, 0), v(0, 0.06)), add(g.at(HI, 0), v(0, -0.06)))} fill="#000" />
			<polygon points={f.pts(add(g.at(0, HI), v(0, 0.14)), add(g.at(0, HI), v(0.06, 0)), add(g.at(0, HI), v(-0.06, 0)))} fill="#000" />
			<Label f={f} at={add(g.at(HI, 0), v(0.12, 0))} dir={v(1, 0)}>{assi[0]}</Label>
			<Label f={f} at={add(g.at(0, HI), v(0, 0.12))} dir={v(0, 1)}>{assi[1]}</Label>
			{/* the ticks at 1 */}
			<path d={f.path([add(g.at(1, 0), v(0, 0.07)), add(g.at(1, 0), v(0, -0.07))])} stroke="#000" strokeWidth={THIN} />
			<path d={f.path([add(g.at(0, 1), v(0.07, 0)), add(g.at(0, 1), v(-0.07, 0))])} stroke="#000" strokeWidth={THIN} />
			<Label f={f} at={add(g.at(1, 0), v(0, -0.26))} dir={v(0, -1)} upright size={13}>1</Label>
			<Label f={f} at={add(g.at(0, 1), v(-0.26, 0))} dir={v(-1, 0)} upright size={13}>1</Label>
			<Label f={f} at={add(g.at(0, 0), v(-0.2, -0.2))} dir={v(-1, -1)} upright size={13}>0</Label>
			{linea && <path d={f.path([g.at(linea[0].x, linea[0].y), g.at(linea[1].x, linea[1].y)])} stroke={INK.blue} strokeWidth={THICK} />}
			{punti.map((q, i) => {
				const c = f.px(g.at(q.x, q.y));
				return (
					<g key={i}>
						{q.acceso && <circle cx={c.x} cy={c.y} r={13} fill="none" stroke={INK.orange} strokeWidth={2} />}
						{q.sbagliato && <circle cx={c.x} cy={c.y} r={9.5} fill="none" stroke={INK.red} strokeWidth={1.6} />}
						<circle cx={c.x} cy={c.y} r={5.5} fill={q.classe === 1 ? '#000' : '#fff'} stroke="#000" strokeWidth={THICK} />
					</g>
				);
			})}
			{children}
		</g>
	);
}

/** The key under a plane: which dot is which class, and what the red ring means. */
export function Legenda({ sbagliati = true }: { sbagliati?: boolean }) {
	const dot = 'inline-block size-2.5 rounded-full border border-fg align-middle';
	return (
		<p className="m-0 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-fg-muted">
			<span><span className={`${dot} bg-fg`} /> deve dare 1</span>
			<span><span className={dot} /> deve dare 0</span>
			<span>zona colorata: risponde 1</span>
			{sbagliati && <span>anello rosso: sbagliato</span>}
		</p>
	);
}

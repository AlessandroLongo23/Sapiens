'use client';

import { useState } from 'react';
import { Drawing, Figure, Caption, Readout, Tex, Handle, frame, v, len, num, THIN, DASH, type V } from '../kit';
import { Arrow, Axes, QTY } from '../fisica';
import { Grid, snap, cm, NamedVec, placeNames, type Seg } from './griglia';

/**
 * Lesson "Seno e coseno per scomporre un vettore", section "I segni delle componenti": the tip of v is dragged on
 * the grid of the Cartesian axes (one square is 1 m) and snaps to the crossings, so the components are whole
 * numbers. The dashed component vectors and projections follow, and an arc marks the angle α from the positive x
 * semi-axis, counterclockwise. Under the drawing the modulus, the angle, the components written as v·cos α and
 * v·sin α with their sign, and the quadrant.
 */

const U = 0.5;
const G = { x0: -5, x1: 5, y0: -4, y1: 4 };
const TIP = { x0: -4, x1: 4, y0: -3, y1: 3 };
const f = frame(G.x0 * U - 0.35, G.x1 * U + 0.45, G.y0 * U - 0.3, G.y1 * U + 0.45);
const O = v(0, 0);
const ARC = 0.42; // radius of the angle mark, cm

const QUADRANT = ['primo', 'secondo', 'terzo', 'quarto'];

export default function ComponentiVettore({ alt }: { alt?: string }) {
	const [p, setP] = useState(v(4, 3));
	const move = (q: V) => {
		const w = snap(v(q.x / U, q.y / U), TIP);
		if (w.x !== 0 || w.y !== 0) setP(w);
	};

	const P = cm(p, U);
	const Px = v(P.x, 0), Py = v(0, P.y);
	const modulus = len(p);
	let deg = (Math.atan2(p.y, p.x) * 180) / Math.PI;
	if (deg < 0) deg += 360;
	const onAxis = p.x === 0 || p.y === 0;
	const quadrant = onAxis ? -1 : p.x > 0 ? (p.y > 0 ? 0 : 3) : p.y > 0 ? 1 : 2;

	const tt = (deg * Math.PI) / 180;
	const axes: Seg[] = [
		{ a: v(G.x0 * U, 0), b: v(G.x1 * U, 0) },
		{ a: v(0, G.y0 * U), b: v(0, G.y1 * U) }
	];
	// The arc as a polyline, so no name lands on it.
	const arcSegs: Seg[] = Array.from({ length: 8 }, (_, i) => {
		const a0 = (tt * i) / 8, a1 = (tt * (i + 1)) / 8;
		return { a: v(ARC * Math.cos(a0), ARC * Math.sin(a0)), b: v(ARC * Math.cos(a1), ARC * Math.sin(a1)) };
	});
	const segs: Seg[] = [{ a: O, b: P }, { a: O, b: Px }, { a: O, b: Py }, { a: P, b: Px }, { a: P, b: Py }, ...axes, ...arcSegs];
	const reqs = [{ seg: 0, chars: 1 }, ...(p.x !== 0 ? [{ seg: 1, chars: 1.7 }] : []), ...(p.y !== 0 ? [{ seg: 2, chars: 1.7 }] : [])];
	// The angle mark, with α written in the middle of it when the angle is wide enough to hold the letter.
	const t = (deg * Math.PI) / 180;
	const arcEnd = v(ARC * Math.cos(t), ARC * Math.sin(t));
	const mid = t / 2;
	const alphaAt = v((ARC + 0.25) * Math.cos(mid), (ARC + 0.25) * Math.sin(mid));

	const names = placeNames(f, segs, reqs, deg >= 28 ? [P, alphaAt] : [P]);
	const nx = p.x !== 0 ? names[1] : null;
	const ny = p.y !== 0 ? names[p.x !== 0 ? 2 : 1] : null;

	const deg1 = num(deg, 1).replace(',', '{,}');
	const exact = Math.abs(modulus - Math.round(modulus)) < 1e-9;
	const vTex = exact ? `${Math.round(modulus)}` : `${num(modulus, 2).replace(',', '{,}')}`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Grid f={f} u={U} {...G} />
				<Axes f={f} x0={G.x0 * U} x1={G.x1 * U} y0={G.y0 * U} y1={G.y1 * U} />
				<path d={f.path([P, Px])} stroke={QTY.vettore} strokeWidth={THIN} strokeDasharray={DASH} opacity={0.7} fill="none" />
				<path d={f.path([P, Py])} stroke={QTY.vettore} strokeWidth={THIN} strokeDasharray={DASH} opacity={0.7} fill="none" />
				{p.x !== 0 && <Arrow f={f} from={O} to={Px} color={QTY.vettore} dashed />}
				{p.y !== 0 && <Arrow f={f} from={O} to={Py} color={QTY.vettore} dashed />}
				<path d={f.arc(O, v(1, 0), arcEnd, ARC)} stroke="#000" strokeWidth={THIN} fill="none" />
				<Arrow f={f} from={O} to={P} color={QTY.vettore} />
				{deg >= 28 && (
					<text x={f.px(alphaAt).x} y={f.px(alphaAt).y} dy="0.35em" textAnchor="middle" fontSize={13} fontStyle="italic" fontFamily="KaTeX_Math, 'Times New Roman', serif" pointerEvents="none">
						α
					</text>
				)}
				<NamedVec f={f} at={names[0]} dir={v(0, 0)} name="v" color={QTY.vettore} />
				{nx && <NamedVec f={f} at={nx} dir={v(0, 0)} name="v" sub="x" bare color={QTY.vettore} />}
				{ny && <NamedVec f={f} at={ny} dir={v(0, 0)} name="v" sub="y" bare color={QTY.vettore} />}
				<Handle f={f} at={P} onMove={move} label="Punta del vettore v" color={QTY.vettore} step={U} />
			</Drawing>
			<Readout>
				<Tex>{`v ${exact ? '=' : '\\approx'} ${vTex}\\,\\text{m}`}</Tex>
				<Tex>{`\\alpha ${Number.isInteger(deg) ? '=' : '\\approx'} ${deg1}^\\circ`}</Tex>
				<Tex>{`v_x = v\\cos\\alpha = ${p.x}\\,\\text{m}`}</Tex>
				<Tex>{`v_y = v\\sin\\alpha = ${p.y}\\,\\text{m}`}</Tex>
			</Readout>
			<Caption>
				{onAxis ? (
					<>
						Il vettore sta su un asse: la componente sull&apos;altro asse è zero.
					</>
				) : (
					<>
						Punta nel {QUADRANT[quadrant]} quadrante: <Tex>{`v_x ${p.x > 0 ? '> 0' : '< 0'}`}</Tex> e <Tex>{`v_y ${p.y > 0 ? '> 0' : '< 0'}`}</Tex>. Ogni quadretto è lungo 1 m.
					</>
				)}
			</Caption>
		</Figure>
	);
}

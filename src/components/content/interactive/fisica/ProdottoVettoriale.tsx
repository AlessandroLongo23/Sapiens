'use client';

import { useState } from 'react';
import { Drawing, Figure, Caption, Readout, Tex, Handle, Label, frame, v, add, sub, scale, len, cross, dot, ang, polar, num, THIN, THICK, TINT, type V } from '../kit';
import { Arrow, VecLabel, QTY } from '../fisica';
import { Grid, snap, cm } from './griglia';

/**
 * Lesson 71 (Prodotto scalare e prodotto vettoriale), "Direzione e verso": two vectors a and b from the same point on
 * a grid, both tips dragged on the crossings. The parallelogram on them is filled: its area is the modulus of a × b.
 * A curved arrow turns from a to b the shorter way; beside the drawing the symbol ⊙ (out of the page, anticlockwise
 * from a to b) or ⊗ (into the page, clockwise). Under the drawing the components, the angle, c_z = a_x b_y − a_y b_x
 * with its sign and the modulus.
 */

const U = 0.5;
const G = { x0: -5, x1: 6, y0: -4, y1: 4 };
const TIP = { x0: -4, x1: 5, y0: -3, y1: 3 };
const O = v(0, 0);
const ARC = 0.55;
const SYM = v(G.x0 * U + 0.4, G.y1 * U + 0.45); // the ⊙ / ⊗ symbol, above the grid on the left
const f = frame(G.x0 * U - 0.15, G.x1 * U + 0.15, G.y0 * U - 0.15, G.y1 * U + 0.85);

const par = (n: number) => (n < 0 ? `(${n})` : `${n}`);

export default function ProdottoVettoriale({ alt }: { alt?: string }) {
	const [a, setA] = useState(v(4, 0));
	const [b, setB] = useState(v(2, 3));
	const move = (set: (p: V) => void) => (q: V) => {
		const w = snap(v(q.x / U, q.y / U), TIP);
		if (w.x !== 0 || w.y !== 0) set(w);
	};

	const A = cm(a, U), B = cm(b, U);
	const cz = cross(a, b);
	const deg = (Math.acos(Math.max(-1, Math.min(1, dot(a, b) / (len(a) * len(b))))) * 180) / Math.PI;
	const whole = Math.abs(deg - Math.round(deg)) < 1e-9;
	const out = cz > 0;
	const sym = f.px(SYM);
	const R = 0.2 * (f.W / (f.x1 - f.x0)); // the symbol's radius in pixels
	// The arrowhead of the turn from a to b: at b's end of the arc, along the tangent.
	const tb = ang(b);
	const end = polar(ARC, tb);
	const tangent = out ? v(-Math.sin(tb), Math.cos(tb)) : v(Math.sin(tb), -Math.cos(tb));
	const sideOf = (p: V, other: V) => {
		const c = cross(p, other);
		const n = scale(v(-p.y, p.x), 1 / len(p));
		const u = scale(p, 1 / len(p));
		return add(scale(u, 0.7), scale(n, c > 0 ? -0.7 : 0.7));
	};

	let caption: string;
	if (cz === 0) caption = 'I due vettori sono paralleli: il parallelogramma è schiacciato su un segmento, e il prodotto vettoriale è il vettore nullo.';
	else if (out) caption = `Da a verso b si ruota in senso antiorario: il prodotto vettoriale esce dal foglio, e il suo modulo è l’area del parallelogramma, ${cz} quadretti.`;
	else caption = `Da a verso b si ruota in senso orario: il prodotto vettoriale entra nel foglio, e il suo modulo è l’area del parallelogramma, ${-cz} quadretti.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Grid f={f} u={U} {...G} />
				{cz !== 0 && <path d={f.path([O, A, add(A, B), B], true)} fill={TINT.orange} stroke="#000" strokeWidth={THIN} strokeOpacity={0.4} />}
				{cz !== 0 && deg > 12 && (
					<>
						<path d={out ? f.arc(O, a, b, ARC) : f.arc(O, b, a, ARC)} stroke="#000" strokeWidth={THIN} fill="none" />
						<Arrow f={f} from={sub(end, scale(tangent, 0.16))} to={add(end, scale(tangent, 0.02))} weight="thin" />
					</>
				)}
				<Arrow f={f} from={O} to={A} color={QTY.vettore} />
				<VecLabel f={f} at={A} dir={sideOf(a, b)} name="a" color={QTY.vettore} />
				<Arrow f={f} from={O} to={B} color={QTY.vettore} />
				<VecLabel f={f} at={B} dir={sideOf(b, a)} name="b" color={QTY.vettore} />

				{cz !== 0 && (
					<g pointerEvents="none">
						<circle cx={sym.x} cy={sym.y} r={R} fill="none" stroke={QTY.risultante} strokeWidth={THICK} />
						{out ? (
							<circle cx={sym.x} cy={sym.y} r={2.4} fill={QTY.risultante} />
						) : (
							<path d={`M${sym.x - R * 0.7},${sym.y - R * 0.7} L${sym.x + R * 0.7},${sym.y + R * 0.7} M${sym.x - R * 0.7},${sym.y + R * 0.7} L${sym.x + R * 0.7},${sym.y - R * 0.7}`} stroke={QTY.risultante} strokeWidth={THICK} />
						)}
					</g>
				)}
				<VecLabel f={f} at={add(SYM, v(0.38, 0))} dir={v(1, 0)} name="a" />
				<Label f={f} at={add(SYM, v(0.77, 0))} dir={v(1, 0)} upright>
					×
				</Label>
				<VecLabel f={f} at={add(SYM, v(1.1, 0))} dir={v(1, 0)} name="b" />
				<Label f={f} at={add(SYM, v(1.5, 0))} dir={v(1, 0)} upright size={13}>
					{cz === 0 ? 'è nullo' : out ? 'esce dal foglio' : 'entra nel foglio'}
				</Label>

				<Handle f={f} at={A} onMove={move(setA)} label="Punta del vettore a" color={QTY.vettore} step={U} />
				<Handle f={f} at={B} onMove={move(setB)} label="Punta del vettore b" color={QTY.vettore} step={U} />
			</Drawing>
			<Readout>
				<Tex>{`\\vec a = (${a.x};\\ ${a.y})`}</Tex>
				<Tex>{`\\vec b = (${b.x};\\ ${b.y})`}</Tex>
				<Tex>{`\\alpha ${whole ? '=' : '\\approx'} ${num(deg, 1).replace(',', '{,}')}^\\circ`}</Tex>
			</Readout>
			<Readout>
				<Tex>{`c_z = a_x b_y - a_y b_x = ${par(a.x)} \\cdot ${par(b.y)} - ${par(a.y)} \\cdot ${par(b.x)} = ${cz}`}</Tex>
				<Tex>{`|\\vec a \\times \\vec b| = a\\,b\\sin\\alpha = ${Math.abs(cz)}`}</Tex>
			</Readout>
			<Caption>{caption} Trascina le punte dei due vettori.</Caption>
		</Figure>
	);
}

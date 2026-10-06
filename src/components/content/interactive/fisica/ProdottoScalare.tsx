'use client';

import { useState } from 'react';
import { Drawing, Figure, Caption, Readout, Tex, Handle, frame, v, len, num, THIN, DASH, FONT_MATH, type V } from '../kit';
import { Arrow, VecLabel, QTY } from '../fisica';
import { Grid, snap, cm, valueTex } from './griglia';

/**
 * Lesson 71 (Prodotto scalare e prodotto vettoriale), "Il segno e il coseno di un angolo ottuso": a is fixed, 4 squares
 * along x; the tip of b is dragged on the crossings of the grid. The dashed perpendicular from the tip of b falls on
 * the line of a, and the orange segment is the projection b cos α: to the right of the origin for an acute angle, gone
 * at 90°, to the left for an obtuse one. Under the drawing the moduli, the angle, the projection and the scalar
 * product, written both as a b cos α and with the components.
 */

const U = 0.5;
const G = { x0: -5, x1: 6, y0: -4, y1: 4 };
const TIP = { x0: -4, x1: 5, y0: -3, y1: 3 };
const A = v(4, 0);
const O = v(0, 0);
const ARC = 0.45;
const f = frame(G.x0 * U - 0.15, G.x1 * U + 0.15, G.y0 * U - 0.15, G.y1 * U + 0.15);

export default function ProdottoScalare({ alt }: { alt?: string }) {
	const [b, setB] = useState(v(3, 3));
	const move = (q: V) => {
		const w = snap(v(q.x / U, q.y / U), TIP);
		if (w.x !== 0 || w.y !== 0) setB(w);
	};

	const B = cm(b, U);
	const foot = v(B.x, 0);
	const product = A.x * b.x + A.y * b.y;
	const deg = (Math.acos(Math.max(-1, Math.min(1, product / (len(A) * len(b))))) * 180) / Math.PI;
	const whole = Math.abs(deg - Math.round(deg)) < 1e-9;
	// The projection is drawn beside the line of a, on the side away from b, so it does not hide under the arrow.
	const off = b.y >= 0 ? -0.13 : 0.13;
	const up = b.y >= 0;
	const mid = ((up ? 1 : -1) * deg * Math.PI) / 360;
	const alphaAt = v((ARC + 0.25) * Math.cos(mid), (ARC + 0.25) * Math.sin(mid));
	const bDir = v(b.x >= 0 ? 0.6 : -0.6, b.y >= 0 ? 0.8 : -0.8);

	let caption: string;
	if (b.y === 0 && b.x > 0) caption = 'I due vettori sono paralleli e concordi: tutto b va lungo a, e il prodotto scalare è il prodotto dei moduli.';
	else if (b.y === 0) caption = 'I due vettori sono paralleli e discordi: il prodotto scalare è il prodotto dei moduli con il segno meno.';
	else if (b.x === 0) caption = 'I due vettori sono perpendicolari: b non ha nessuna parte lungo a, e il prodotto scalare è zero.';
	else if (b.x > 0) caption = 'L’angolo è acuto: la proiezione di b va nel verso di a, e il prodotto scalare è positivo.';
	else caption = 'L’angolo è ottuso: la proiezione di b cade dalla parte opposta ad a, e il prodotto scalare è negativo.';

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Grid f={f} u={U} {...G} />
				<path d={f.path([v(G.x0 * U, 0), v(G.x1 * U, 0)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} opacity={0.35} fill="none" />
				{b.y !== 0 && <path d={f.path([B, foot])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} opacity={0.7} fill="none" />}
				{b.x !== 0 && <path d={f.path([v(0, off), v(B.x, off)])} stroke={QTY.risultante} strokeWidth={3} fill="none" />}
				{deg > 1 && <path d={up ? f.arc(O, A, B, ARC) : f.arc(O, B, A, ARC)} stroke="#000" strokeWidth={THIN} fill="none" />}
				{deg >= 25 && (
					<text x={f.px(alphaAt).x} y={f.px(alphaAt).y} dy="0.35em" textAnchor="middle" fontSize={13} fontStyle="italic" fontFamily={FONT_MATH} pointerEvents="none">
						α
					</text>
				)}
				<Arrow f={f} from={O} to={cm(A, U)} color={QTY.vettore} />
				<VecLabel f={f} at={v(A.x * U, off > 0 ? -0.1 : 0.1)} dir={v(0.9, off > 0 ? -0.6 : 0.6)} name="a" color={QTY.vettore} />
				<Arrow f={f} from={O} to={B} color={QTY.vettore} />
				<VecLabel f={f} at={B} dir={bDir} name="b" color={QTY.vettore} />
				<Handle f={f} at={B} onMove={move} label="Punta del vettore b" color={QTY.vettore} step={U} />
			</Drawing>
			<Readout>
				<Tex>{`a = 4`}</Tex>
				<Tex>{`b ${valueTex(len(b), 2)}`}</Tex>
				<Tex>{`\\alpha ${whole ? '=' : '\\approx'} ${num(deg, 1).replace(',', '{,}')}^\\circ`}</Tex>
				<Tex>{`b\\cos\\alpha = ${b.x}`}</Tex>
			</Readout>
			<Readout>
				<Tex>{`\\vec a \\cdot \\vec b = a\\,b\\cos\\alpha = 4 \\cdot ${b.x < 0 ? `(${b.x})` : b.x} = ${product}`}</Tex>
				<Tex>{`a_x b_x + a_y b_y = 4 \\cdot ${b.x < 0 ? `(${b.x})` : b.x} + 0 \\cdot ${b.y < 0 ? `(${b.y})` : b.y} = ${product}`}</Tex>
			</Readout>
			<Caption>{caption} Trascina la punta di b.</Caption>
		</Figure>
	);
}

'use client';

import { useState } from 'react';
import { Caption, clamp, Drawing, Figure, FONT, frame, Readout, Tex, v } from './kit';
import { EndDot, gcd, Grip, HLine, Line, n, texFrac, Text, Tick, xc } from './retta';

/**
 * Lesson 77, "Scrivere un'equazione date le soluzioni": the student drags the two solutions x₁ and x₂ along the line
 * (in halves) and reads s, p and the equation x² − sx + p = 0, also with whole coefficients, then the signs of the
 * coefficients with Descartes' rule, which the section "Segni delle soluzioni senza risolvere" explains.
 */

const U = 0.6; // cm per unit
const R = 6;
const X = (t: number) => t * U;
const f = frame(X(-R - 0.6), X(R + 0.6) + 0.4, -0.6, 1.2);
const ONE = xc('blue', 60);
const TWO = xc('orange', 80, 'black');

/** A number in halves or quarters as TeX: −3, \frac{3}{2}, -\frac{1}{4}. */
const q = (x: number) => texFrac(Math.round(x * 4), 4);
/** The same in brackets when negative, for a product or a sum. */
const qp = (x: number) => (x < 0 ? `\\left(${q(x)}\\right)` : q(x));

/** ax² + bx + c = 0 as TeX, with the terms that are 0 left out and a coefficient 1 not written. */
function equation(a: number, b: number, c: number) {
	const coef = (k: number, first: boolean) => {
		const sign = k < 0 ? '-' : first ? '' : '+';
		const abs = Math.abs(k);
		return `${sign}${first ? '' : ' '}${abs === 1 ? '' : q(abs)}`;
	};
	let s = `${coef(a, true)}x^2`;
	if (b !== 0) s += ` ${coef(b, false)}x`;
	if (c !== 0) s += ` ${c < 0 ? '-' : '+'} ${q(Math.abs(c))}`;
	return `${s} = 0`;
}

export default function EquazioneDaSoluzioni({ alt }: { alt?: string }) {
	const [x1, setX1] = useState(-3);
	const [x2, setX2] = useState(5);
	const snap = (x: number) => clamp(Math.round((x / U) * 2) / 2, -R, R);
	const s = x1 + x2;
	const p = x1 * x2;
	const b = -s, c = p;

	// Whole coefficients: multiply by the least common denominator (1, 2 or 4) and simplify.
	const L = [s, p].reduce((l, x) => Math.max(l, Number.isInteger(x) ? 1 : Number.isInteger(2 * x) ? 2 : 4), 1);
	const g = gcd(gcd(L, Math.round(b * L)), Math.round(c * L)) || 1;
	const [A, B, C] = [L / g, (b * L) / g, (c * L) / g];

	const sg = (k: number) => (k > 0 ? '+' : '−');
	let rule: string;
	if (b === 0 && c === 0) rule = 'Mancano il termine in x e il termine noto: l’equazione è x² = 0, e le due soluzioni coincidono in 0.';
	else if (b === 0) rule = 'Manca il termine in x, perché s = 0: la regola di Cartesio non si applica; l’equazione è pura e le soluzioni sono opposte.';
	else if (c === 0) rule = 'Manca il termine noto, perché p = 0: la regola di Cartesio non si applica; l’equazione è spuria e una soluzione è 0.';
	else {
		const first = b < 0 ? 'V' : 'P'; // a is positive
		const second = Math.sign(b) === Math.sign(c) ? 'P' : 'V';
		const signs = `I segni dei coefficienti sono + ${sg(b)} ${sg(c)}: `;
		const same = x1 === x2 ? ' (qui coincidono)' : '';
		if (first === 'V' && second === 'V') rule = `${signs}due variazioni, quindi due soluzioni positive${same}.`;
		else if (first === 'P' && second === 'P') rule = `${signs}due permanenze, quindi due soluzioni negative${same}.`;
		else if (first === 'V') rule = `${signs}prima una variazione, poi una permanenza: soluzioni discordi, e ha valore assoluto maggiore la positiva.`;
		else rule = `${signs}prima una permanenza, poi una variazione: soluzioni discordi, e ha valore assoluto maggiore la negativa.`;
	}

	const close = Math.abs(X(x1) - X(x2)) < 0.7;
	const ticks = Array.from({ length: 2 * R + 1 }, (_, i) => i - R);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<HLine f={f} x0={X(-R - 0.5)} x1={X(R + 0.6)} arrow />
				<Text f={f} at={v(X(R + 0.6) + 0.08, 0)} anchor="start" italic>
					x
				</Text>
				{ticks.map((t) => (
					<g key={t}>
						<Tick f={f} x={X(t)} h={0.08} />
						<Text f={f} at={v(X(t), -0.16)} baseline="top" size={13.5}>
							{n(t)}
						</Text>
					</g>
				))}
				<Line f={f} from={v(X(x1), 0.12)} to={v(X(x1), 0.38)} color={ONE} />
				<Text f={f} at={v(X(x1), 0.42)} baseline="bottom" italic color={ONE}>
					x
					<tspan fontSize="0.7em" dy="0.25em" fontStyle="normal" fontFamily={FONT}>
						1
					</tspan>
				</Text>
				<Line f={f} from={v(X(x2), 0.12)} to={v(X(x2), close ? 0.78 : 0.38)} color={TWO} />
				<Text f={f} at={v(X(x2), close ? 0.82 : 0.42)} baseline="bottom" italic color={TWO}>
					x
					<tspan fontSize="0.7em" dy="0.25em" fontStyle="normal" fontFamily={FONT}>
						2
					</tspan>
				</Text>
				<Grip f={f} at={v(X(x1), 0)} onMove={(pt) => setX1(snap(pt.x))} label={`Soluzione x1, ${n(x1)}`} step={U / 2} color={ONE}>
					<EndDot f={f} at={v(X(x1), 0)} filled color={ONE} />
				</Grip>
				<Grip f={f} at={v(X(x2), 0)} onMove={(pt) => setX2(snap(pt.x))} label={`Soluzione x2, ${n(x2)}`} step={U / 2} color={TWO}>
					<EndDot f={f} at={v(X(x2), 0)} filled color={TWO} />
				</Grip>
			</Drawing>
			<Readout>
				<Tex>{`s = ${q(x1)} + ${qp(x2)} = ${q(s)}`}</Tex>
				<Tex>{`p = ${qp(x1)} \\cdot ${qp(x2)} = ${q(p)}`}</Tex>
			</Readout>
			<Readout>
				<Tex>{equation(1, b, c)}</Tex>
				{L > 1 && (
					<span>
						con coefficienti interi: <Tex>{equation(A, B, C)}</Tex>
					</span>
				)}
			</Readout>
			<Caption>Trascina le due soluzioni sulla retta. {rule}</Caption>
		</Figure>
	);
}

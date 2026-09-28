'use client';

import { useState } from 'react';
import { Circle, Rows3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { add, Caption, clamp, Controls, Drawing, Figure, FONT_MATH, frame, K, Label, num, polar, Readout, THICK, THIN, Tex, useTween, v, type V } from './kit';

/** A number for KaTeX: {,} keeps the decimal comma from being set as punctuation, with a space after it. */
const tn = (x: number, digits?: number) => num(x, digits).replace(',', '{,}');

/**
 * Lesson 99, area of the circle: the circle cut into n equal sectors, which slide into a row, alternately up and
 * down, as in the TikZ figure `cerchio-settori-riordinati`. The upper half of the circle gives the sectors with the
 * arc on top, the lower half those with the arc below, so each long side of the row is half the circumference.
 *
 * The row's corners are the sectors' vertices: a parallelogram with base n·r·sin(180°/n) (half the perimeter of the
 * inscribed n-gon) and height r·cos(180°/n) (its apothem), the same numbers as the polygon argument just above in the
 * lesson. As n grows they tend to πr and r, and the scalloped row to the parallelogram.
 */

const R = 1.9;
const CENTER = v(0, R / 2);
// blue!18 and orange!22, the tints of the TikZ figure.
const UP = '#d1d1ff';
const DOWN = '#ffe3c7';
const f = frame(-3.75, 4.3, -1.45, CENTER.y + R + 0.15);

type Sector = { apex: V; dir: number; up: boolean };

/** Sector j of each half, in the circle and in the row. */
function layout(n: number) {
	const theta = (2 * Math.PI) / n;
	const half = n / 2;
	const s = R * Math.sin(theta / 2);
	const w = 2 * s;
	const width = half * w + s;
	const x0 = -width / 2 + s;
	const hApex = R * Math.cos(theta / 2);
	const sectors: { from: Sector; to: Sector }[] = [];
	for (let j = 0; j < half; j++) {
		// Upper half, read from left to right: from angle π down to 0. Arc on top in the row.
		sectors.push({ from: { apex: CENTER, dir: Math.PI - (j + 0.5) * theta, up: true }, to: { apex: v(x0 + j * w, 0), dir: Math.PI / 2, up: true } });
		// Lower half, from angle π up to 2π. Arc below, vertex on top, between two of the others.
		sectors.push({ from: { apex: CENTER, dir: Math.PI + (j + 0.5) * theta, up: false }, to: { apex: v(x0 + j * w + s, hApex), dir: (3 * Math.PI) / 2, up: false } });
	}
	return { theta, sectors, x0, w, s, hApex, right: x0 - s + width };
}

function sectorPath(apex: V, dir: number, theta: number) {
	const a = f.px(add(apex, polar(R, dir - theta / 2)));
	const b = f.px(add(apex, polar(R, dir + theta / 2)));
	const o = f.px(apex);
	const r = R * K;
	return `M${o.x.toFixed(2)},${o.y.toFixed(2)} L${a.x.toFixed(2)},${a.y.toFixed(2)} A${r.toFixed(2)},${r.toFixed(2)} 0 0 0 ${b.x.toFixed(2)},${b.y.toFixed(2)} Z`;
}

export default function CerchioSettori({ alt }: { alt?: string }) {
	const [n, setN] = useState(12);
	const [t, go] = useTween(0, 1800);
	const { theta, sectors, x0, w, hApex, right } = layout(n);
	const half = n / 2;
	const start = t === 0;
	const done = t === 1;
	const base = n * Math.sin(Math.PI / n);
	const height = Math.cos(Math.PI / n);

	// Each pair of sectors leaves a little after the one on its left.
	const lag = 0.35;
	const at = (j: number) => {
		const u = clamp((t - (lag * j) / Math.max(1, half - 1)) / (1 - lag), 0, 1);
		return u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2;
	};

	const yArrow = hApex - R - 0.3;
	const arrow = (P: V, Q: V) => {
		const p = f.px(P), q = f.px(Q);
		return <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#000" strokeWidth={THIN} markerStart="url(#settori-freccia)" markerEnd="url(#settori-freccia)" />;
	};

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<defs>
					<marker id="settori-freccia" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
						<path d="M0,1 L9,5 L0,9" fill="none" stroke="#000" strokeWidth={1.2} />
					</marker>
				</defs>
				{sectors.map(({ from, to }, i) => {
					const u = at(Math.floor(i / 2));
					const apex = v(from.apex.x + (to.apex.x - from.apex.x) * u, from.apex.y + (to.apex.y - from.apex.y) * u);
					// The shorter way round: from its place in the circle to straight up or straight down.
					const dir = from.dir + (to.dir - from.dir) * u;
					return <path key={i} d={sectorPath(apex, dir, theta)} fill={to.up ? UP : DOWN} stroke="#000" strokeWidth={start ? 0 : THIN} strokeLinejoin="round" />;
				})}
				{start && (
					<>
						{sectors.map(({ from }, i) => {
							const p = f.px(add(CENTER, polar(R, from.dir - theta / 2)));
							const o = f.px(CENTER);
							return <line key={i} x1={o.x} y1={o.y} x2={p.x} y2={p.y} stroke="#000" strokeWidth={THIN} />;
						})}
						<circle cx={f.px(CENTER).x} cy={f.px(CENTER).y} r={R * K} fill="none" stroke="#000" strokeWidth={THICK} />
					</>
				)}
				{done && (
					<>
						{arrow(v(x0, yArrow), v(x0 + half * w, yArrow))}
						<Label f={f} at={v(x0 + (half * w) / 2, yArrow)} dir={v(0, -1)} upright size={13}>
							base ≈ π<tspan fontStyle="italic" fontFamily={FONT_MATH}>r</tspan>
						</Label>
						{arrow(v(right + 0.25, 0), v(right + 0.25, hApex))}
						<Label f={f} at={v(right + 0.25, hApex / 2)} dir={v(1, 0)} upright size={13}>
							≈ <tspan fontStyle="italic" fontFamily={FONT_MATH}>r</tspan>
						</Label>
					</>
				)}
			</Drawing>

			<Caption>
				{done
					? n >= 40
						? `Con ${n} settori la fila è quasi un parallelogramma con la base πr e l'altezza r: la sua area, e quella del cerchio, è πr · r = πr².`
						: `Con ${n} settori i lati lunghi sono ondulati: aumenta i settori e la fila si avvicina a un parallelogramma con la base πr e l'altezza r.`
					: 'Premi il bottone: i settori della metà di sopra e di quella di sotto si mettono in fila, alternati in su e in giù.'}
			</Caption>

			<Readout>
				<Tex>{`\\text{base} = ${tn(base, 4)}\\,r`}</Tex>
				<Tex>{`\\text{altezza} = ${tn(height, 4)}\\,r`}</Tex>
				<Tex>{`\\text{base} \\cdot \\text{altezza} = ${tn(base * height, 4)}\\,r^2`}</Tex>
				<Tex>{`\\pi \\approx ${tn(Math.PI, 4)}`}</Tex>
			</Readout>

			<Button variant="secondary" size="sm" onClick={() => void go(t > 0.5 ? 0 : 1)}>
				{t > 0.5 ? <Circle className="size-4" aria-hidden="true" /> : <Rows3 className="size-4" aria-hidden="true" />}
				{t > 0.5 ? 'Ricomponi il cerchio' : 'Metti in fila i settori'}
			</Button>

			<Controls>
				<Slider label="Numero di settori" value={n} min={4} max={64} step={2} onChange={(x) => setN(clamp(Math.round(x / 2) * 2, 4, 64))} />
			</Controls>
		</Figure>
	);
}

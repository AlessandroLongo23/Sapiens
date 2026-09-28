'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ButtonRow, Caption, clamp, Controls, DASH, Drawing, Figure, frame, Readout, Tex, THICK, v } from './kit';
import { Formula, fracItems, Grip, Line, n, PT, texFrac, Text, Tick, xc } from './retta';

/**
 * Lesson 56, "Proprietà della media": three equal weights on a rod, which balances on a support at the mean. The
 * student drags the weights; the support follows the mean, and the deviations from it, drawn as arrows from the
 * mean, keep adding up to 0. Drawn like `media-punto-di-equilibrio`. The mean of three whole numbers is often a
 * third, so the mean and the deviations are written as fractions: exact, and their sum visibly 0.
 */

const U = 0.7; // cm per unit, as in the TikZ figure
const LO = 2, HI = 11;
const X = (t: number) => t * U;
const START = [3, 5, 10];
const ROWS = [0.75, 1.3, 1.85];
const f = frame(X(1.2), X(11.8), -1.25, 2.45);
const WEIGHT = xc('blue', 45);
const R = 5; // weight radius in pt

/** a/3 as TeX. */
const third = (a: number) => texFrac(a, 3);

export default function MediaEquilibrio({ alt }: { alt?: string }) {
	const [xs, setXs] = useState(START);
	const S = xs[0] + xs[1] + xs[2];
	const m = S / 3;
	const d = xs.map((x) => 3 * x - S); // three times each deviation, a whole number
	const move = (i: number, x: number) => setXs((a) => a.map((y, j) => (j === i ? clamp(Math.round(x / U), LO, HI) : y)));

	// Equal data are stacked, as weights on the same spot.
	const level = xs.map((x, i) => xs.slice(0, i).filter((y) => y === x).length);
	const labels = [...new Set(xs)].filter((x) => Math.abs(X(x) - X(m)) > 0.3);

	const sum = d.map((a, i) => {
		const t = third(a);
		return i === 0 ? t : a < 0 ? ` - ${third(-a)}` : ` + ${t}`;
	});
	const mean = `\\bar{x} = \\frac{${xs.join(' + ')}}{3} = \\frac{${S}}{3}${S % 3 === 0 ? ` = ${S / 3}` : ''}`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Line f={f} from={v(X(1.6), 0)} to={v(X(11.4), 0)} width={THICK} />
				{Array.from({ length: HI - LO + 1 }, (_, i) => i + LO).map((t) => (
					<Tick key={t} f={f} x={X(t)} />
				))}
				{labels.map((x) => (
					<Text key={x} f={f} at={v(X(x), -0.16)} baseline="top">
						{n(x)}
					</Text>
				))}
				<polygon points={f.pts(v(X(m), 0), v(X(m) - 0.196, -0.5), v(X(m) + 0.196, -0.5))} fill={xc('orange', 40)} stroke="#000" strokeWidth={0.6} strokeLinejoin="round" />
				<Formula f={f} at={v(X(m), -0.82)} items={[{ xbar: true }, ' = ', ...fracItems(S, 3)]} size={15} />
				<Line f={f} from={v(X(m), 0.1)} to={v(X(m), 2.15)} dash={DASH} />
				{xs.map((x, i) =>
					d[i] === 0 ? (
						<Text key={i} f={f} at={v(X(m) + 0.12, ROWS[i])} anchor="start">
							0
						</Text>
					) : (
						<g key={i}>
							<Line f={f} from={v(X(m), ROWS[i])} to={v(X(x), ROWS[i])} arrow />
							<Formula f={f} at={v((X(m) + X(x)) / 2, ROWS[i] + (d[i] % 3 ? 0.32 : 0.2))} items={fracItems(d[i], 3, 'signed')} size={14} />
						</g>
					)
				)}
				{xs.map((x, i) => {
					const c = v(X(x), 0.2 + level[i] * 0.36);
					return (
						<Grip key={i} f={f} at={c} onMove={(p) => move(i, p.x)} label={`Peso sul ${n(x)}`} step={U} ring={R * PT + 4}>
							<circle cx={f.px(c).x} cy={f.px(c).y} r={R * PT} fill={WEIGHT} />
						</Grip>
					);
				})}
			</Drawing>
			<Readout>
				<Tex>{mean}</Tex>
				<span>
					somma degli scarti: <Tex>{`${sum.join('')} = 0`}</Tex>
				</span>
			</Readout>
			<Caption>
				Trascina i pesi sull’asta: il sostegno si sposta nella media, dove l’asta sta in equilibrio. Gli scarti dei dati a sinistra della media sono negativi, quelli a destra positivi, e la loro
				somma è sempre 0.
			</Caption>
			<Controls>
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={() => setXs(START)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Torna a 3, 5 e 10
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}

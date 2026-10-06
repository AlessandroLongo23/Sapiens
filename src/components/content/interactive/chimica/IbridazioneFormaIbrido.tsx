'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, Readout, frame, v, num, DASH, THICK, THIN, type V } from '../kit';
import { Pills, SIGN_FILL } from './chim3-g-pezzi';

/**
 * Lesson 71 (L'ibridazione degli orbitali): the shape of an orbital made by mixing an s orbital and a p orbital, as
 * the share of p goes from 0 (the s orbital, a circle) to 100% (the p orbital, two equal lobes). In between, one lobe
 * grows and the other shrinks: at 50% it is an sp hybrid, at 67% an sp², at 75% an sp³.
 *
 * What is drawn is the angular part of the mixture, as a polar plot: with a share f of p, the amplitude in the
 * direction θ is √(1 − f) + √(3f)·cos θ (an s orbital is 1 in every direction, a p orbital √3·cos θ, both
 * normalised), and the distance from the nucleus is its absolute value. The two tints are the two signs. It is a
 * sketch of the shape, like the lobes of the books, not a map of probability.
 */

const f = frame(-2.0, 2.45, -1.45, 1.45);
const R0 = 0.82;

const MARKS = [
	{ value: '0', label: 's', p: 0 },
	{ value: '50', label: 'sp', p: 50 },
	{ value: '67', label: 'sp²', p: 67 },
	{ value: '75', label: 'sp³', p: 75 },
	{ value: '100', label: 'p', p: 100 },
];

/** The outline of the part of the plot between the angles t0 and t1 (radians), closed at the nucleus. */
function outline(share: number, t0: number, t1: number): string {
	const a = Math.sqrt(1 - share), b = Math.sqrt(3 * share);
	const pts: V[] = [];
	const n = 120;
	for (let i = 0; i <= n; i++) {
		const t = t0 + ((t1 - t0) * i) / n;
		const r = R0 * Math.abs(a + b * Math.cos(t));
		pts.push(v(r * Math.cos(t), r * Math.sin(t)));
	}
	return f.path(pts, true);
}

export default function IbridazioneFormaIbrido({ alt }: { alt?: string }) {
	const [pct, setPct] = useState(75);
	const share = pct / 100;
	// the amplitude changes sign where cos θ = −√((1 − f) / (3f)): only when the share of p is above a quarter
	const k = share > 0 ? Math.sqrt((1 - share) / (3 * share)) : Infinity;
	const t0 = k < 1 ? Math.acos(-k) : Math.PI;
	const mark = MARKS.find((m) => m.p === pct);
	const nome = pct === 0 ? 'un orbitale s' : pct === 100 ? 'un orbitale p' : mark ? `un ibrido ${mark.label}` : null;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={f.path([v(f.x0 + 0.1, 0), v(f.x1 - 0.1, 0)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
				<path d={outline(share, -t0, t0)} fill={SIGN_FILL.plus} stroke="#000" strokeWidth={THICK} />
				{k < 1 && <path d={outline(share, t0, 2 * Math.PI - t0)} fill={SIGN_FILL.minus} stroke="#000" strokeWidth={THICK} />}
				<circle cx={f.px(v(0, 0)).x} cy={f.px(v(0, 0)).y} r={2.4} fill="#000" />
			</Drawing>
			<Readout>
				<span>parte di s: {num(100 - pct, 0)}%</span>
				<span>parte di p: {num(pct, 0)}%</span>
				{nome && <span>{nome}</span>}
			</Readout>
			<Caption>
				{pct === 0
					? "Senza orbitale p la forma è quella dell'orbitale s: uguale in tutte le direzioni."
					: pct === 100
						? "Senza orbitale s la forma è quella dell'orbitale p: due lobi uguali, di segno opposto."
						: pct <= 25
							? "Con poco orbitale p la forma si sposta da un lato, ma non compare ancora un secondo lobo."
							: `Da un lato l'orbitale s e l'orbitale p si sommano, dall'altro si sottraggono: un lobo grande e uno piccolo di segno opposto.${mark ? ` Con il ${pct}% di p è ${nome}.` : ''}`}
			</Caption>
			<Controls>
				<Slider label="Parte di p" value={pct} min={0} max={100} step={1} unit="%" onChange={setPct} />
				<Pills label="Orbitale" options={MARKS.map((m) => ({ value: m.value, label: m.label }))} value={mark ? mark.value : null} onChange={(x) => setPct(Number(x))} />
			</Controls>
		</Figure>
	);
}

'use client';

import { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Drawing, Figure, Caption, Controls, ButtonRow, Label, Tex, frame, v, useTween, num, THICK, THIN, INK, TINT, type V } from '../kit';
import { Block, Ground, Spring, Thread } from '../fisica';

/**
 * Physics lesson 10 (Tabelle e grafici cartesiani), example 1: a spring hanging next to a ruler. The student hangs
 * 50 g weights one at a time (up to five); the spring stretches by the lesson's measured values (2,1 cm, 3,9 cm,
 * 6,0 cm, 8,1 cm, 9,9 cm), the red index slides down the ruler, and the row of the table beside the drawing fills
 * in. The ruler's zero is where the index stands with no weights, so the reading is the elongation Δl.
 * Not a graph: the graph of the same data is the TikZ figure right after, until the kit has a cartesian plane.
 */

const MASS = 50;
/** Measured elongations in cm, from the lesson's table, for 0 to 5 weights. */
const DL = [0, 2.1, 3.9, 6.0, 8.1, 9.9];
/** Drawing centimetres per real centimetre of elongation. */
const S = 0.3;
const REST = -2.3; // where the index is with no weights
const RULER_X = 0.95;
const RULER_W = 0.45;
const RULER_CM = 12;
const W_H = 0.2; // a weight's thickness
const W_W = 0.6;

const f = frame(-0.95, 2.05, REST - RULER_CM * S - 1.35, 0.4);

export default function MollaPesetti({ alt }: { alt?: string }) {
	const [n, setN] = useState(0);
	// The spring's elongation in real centimetres, animated towards the reading for n weights.
	const [dl, go] = useTween(0, 500);
	useEffect(() => {
		void go(DL[n]);
	}, [n, go]);

	const end: V = v(0, REST - dl * S); // bottom of the spring, where the index is
	const hook = v(0, end.y - 0.25);
	const ticks: string[] = [];
	for (let k = 0; k <= RULER_CM * 2; k++) {
		const y = REST - (k / 2) * S;
		const l = k % 2 === 0 ? 0.16 : 0.09;
		ticks.push(f.path([v(RULER_X, y), v(RULER_X + l, y)]));
	}

	return (
		<Figure>
			<div className="flex flex-wrap items-center justify-center gap-6">
				<Drawing f={f} label={alt}>
					<Ground f={f} from={v(1.6, 0)} to={v(-0.8, 0)} />
					<Spring f={f} from={v(0, 0)} to={end} coils={14} />
					<Thread f={f} from={end} to={hook} />
					{Array.from({ length: n }, (_, i) => (
						<Block key={i} f={f} at={v(0, hook.y - (i + 1) * W_H)} w={W_W} h={W_H} fill={TINT.gray} />
					))}
					<path d={f.path([v(RULER_X, 0.2 + REST), v(RULER_X + RULER_W, 0.2 + REST), v(RULER_X + RULER_W, REST - RULER_CM * S - 0.2), v(RULER_X, REST - RULER_CM * S - 0.2)], true)} fill={TINT.yellow} stroke="#000" strokeWidth={THICK} />
					<path d={ticks.join(' ')} stroke="#000" strokeWidth={THIN} fill="none" />
					{[0, 2, 4, 6, 8, 10, 12].map((c) => (
						<Label key={c} f={f} at={v(RULER_X + RULER_W, REST - c * S)} dir={v(1, 0)} upright size={11}>
							{c}
						</Label>
					))}
					<Label f={f} at={v(RULER_X + RULER_W / 2, REST - RULER_CM * S - 0.2)} dir={v(0, -1)} upright size={11}>
						cm
					</Label>
					<path d={f.path([end, v(RULER_X, end.y)])} stroke={INK.red} strokeWidth={THICK} />
				</Drawing>

				<table className="m-0 border-collapse text-center text-sm" style={{ width: 'auto', tableLayout: 'auto', marginBottom: 0 }}>
					<thead>
						<tr>
							<th className="border-b border-edge px-3 py-1 font-normal"><Tex>{'m\\ (\\text{g})'}</Tex></th>
							<th className="border-b border-edge px-3 py-1 font-normal"><Tex>{'\\Delta l\\ (\\text{cm})'}</Tex></th>
						</tr>
					</thead>
					<tbody>
						{DL.map((x, i) => (
							<tr key={i} className={i === n ? 'font-semibold' : ''} style={i === n ? { background: 'var(--accent-soft)' } : undefined}>
								<td className="px-3 py-0.5">{i <= n ? i * MASS : ''}</td>
								<td className="px-3 py-0.5">{i <= n ? num(x, 1).replace(/^(\d+)$/, '$1,0') : ''}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<Caption>
				{n === 0
					? 'Senza pesetti l’indice rosso è sullo zero del righello. Aggiungi un pesetto da 50 g.'
					: `Con ${n} ${n === 1 ? 'pesetto' : 'pesetti'} (${n * MASS} g) l’indice segna ${num(DL[n], 1).replace(/^(\d+)$/, '$1,0')} cm: è l’allungamento della molla, e la riga va nella tabella.`}
			</Caption>

			<Controls>
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={n >= DL.length - 1} onClick={() => setN((k) => Math.min(DL.length - 1, k + 1))}>
						<Plus className="size-4" aria-hidden="true" />
						Aggiungi un pesetto
					</Button>
					<Button variant="secondary" size="sm" disabled={n === 0} onClick={() => setN((k) => Math.max(0, k - 1))}>
						<Minus className="size-4" aria-hidden="true" />
						Togli un pesetto
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}

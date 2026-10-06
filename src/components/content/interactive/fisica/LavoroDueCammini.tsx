'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, Handle, Dot, frame, v, dist, mid, clamp, THIN, VERY_THIN, DASH, FONT_SIZE, type V } from '../kit';
import { Arrow, Ball, Vector, QTY } from '../fisica';

/**
 * Lesson 78 (Forze conservative ed energia potenziale), "Lo stesso spostamento lungo due cammini": a body of 2,0 kg
 * goes from A (0; 3 m) to B (4 m; 0) in a vertical plane along two straight stretches that meet at C, which the
 * student drags (it snaps to a quarter of a metre). The readout gives the length of the path, the work of the weight on
 * each stretch and in all, m g (hA − hB) = 58,8 J wherever C is, and the work of a friction of constant modulus 5,0 N,
 * −5,0 N times the length. Drawn at 1 cm per metre; the starting C is the midpoint of AB (the straight path, 5,0 m).
 */

const M = 2;
const G = 9.8;
const FD = 5;
const A = v(0, 3);
const B = v(4, 0);
const C0 = mid(A, B);
const f = frame(-2.0, 5.75, -1.05, 5.05);
/** A number with a fixed count of decimals, the Italian way; `tex` writes the comma for KaTeX. */
const fx = (x: number, d: number) => (Math.abs(x) < 0.5 * 10 ** -d ? 0 : x).toFixed(d).replace('.', ',').replace('-', '−');
const tex = (x: number, d: number) => (Math.abs(x) < 0.5 * 10 ** -d ? 0 : x).toFixed(d).replace('.', '{,}');

export default function LavoroDueCammini({ alt }: { alt?: string }) {
	const [C, setC] = useState<V>(C0);
	const l = dist(A, C) + dist(C, B);
	const w1 = M * G * (A.y - C.y);
	const w2 = M * G * (C.y - B.y);
	const wa = -FD * l;
	const straight = Math.abs(l - 5) < 1e-9;
	const snap = (p: V) => v(clamp(Math.round(p.x * 4) / 4, -0.5, 5), clamp(Math.round(p.y * 4) / 4, -0.5, 4.5));

	const grid: string[] = [];
	for (let x = 0; x <= 5; x++) grid.push(f.path([v(x, -0.5), v(x, 4.5)]));
	for (let y = 0; y <= 4; y++) grid.push(f.path([v(-0.5, y), v(5, y)]));

	const caption = straight
		? "Sul cammino diritto, lungo 5,0 m, l'attrito compie −25 J. Trascina il punto C per allungare il cammino."
		: `Il cammino ora è lungo ${fx(l, 2)} m: il lavoro dell'attrito è diventato ${fx(wa, 1)} J, quello del peso è rimasto 58,8 J${C.y > A.y ? ', anche se nel primo tratto il corpo sale e il peso compie un lavoro negativo' : ''}.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={grid.join(' ')} stroke="#d6d6d6" strokeWidth={VERY_THIN} fill="none" />
				{/* the two levels */}
				<path d={f.path([v(-0.5, A.y), v(5, A.y)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.6} />
				<path d={f.path([v(-0.5, B.y), v(5, B.y)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.6} />
				<Arrow f={f} from={v(-0.75, B.y)} to={v(-0.75, A.y)} weight="thin" />
				<Arrow f={f} from={v(-0.75, A.y)} to={v(-0.75, B.y)} weight="thin" />
				<Label f={f} at={v(-0.8, 1.5)} dir={v(-1, 0)} upright size={FONT_SIZE * 0.85}>
					3,0 m
				</Label>
				{/* the straight path, for comparison */}
				{!straight && <path d={f.path([A, B])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.45} />}
				<Vector f={f} from={A} to={C} color={QTY.vettore} />
				<Vector f={f} from={C} to={B} color={QTY.vettore} />
				<Ball f={f} at={A} r={0.16} />
				<Arrow f={f} from={A} to={v(A.x, A.y - 0.95)} color={QTY.forza} />
				<Label f={f} at={v(A.x - 0.05, A.y - 0.7)} dir={v(-1, 0)} color={QTY.forza} size={FONT_SIZE * 0.9}>
					mg
				</Label>
				<Label f={f} at={A} dir={v(-0.8, 0.9)}>
					A
				</Label>
				<Dot f={f} at={B} />
				<Label f={f} at={B} dir={v(0.8, -0.8)}>
					B
				</Label>
				<Label f={f} at={C} dir={v(0.8, 0.9)} color={QTY.risultante}>
					C
				</Label>
				<Handle f={f} at={C} label="Punto C" color={QTY.risultante} step={0.25} onMove={(p) => setC(snap(p))} />
			</Drawing>

			<Readout>
				<Tex>{`l = ${tex(dist(A, C), 2)}\\,\\text{m} + ${tex(dist(C, B), 2)}\\,\\text{m} = ${tex(l, 2)}\\,\\text{m}`}</Tex>
				<Tex>{`W_P = ${tex(w1, 1)}\\,\\text{J} ${w2 < 0 ? '-' : '+'} ${tex(Math.abs(w2), 1)}\\,\\text{J} = ${tex(w1 + w2, 1)}\\,\\text{J}`}</Tex>
				<Tex>{`W_{attrito} = -5{,}0\\,\\text{N} \\cdot ${tex(l, 2)}\\,\\text{m} = ${tex(wa, 1)}\\,\\text{J}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={straight && C.x === C0.x} onClick={() => setC(C0)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Cammino diritto
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}

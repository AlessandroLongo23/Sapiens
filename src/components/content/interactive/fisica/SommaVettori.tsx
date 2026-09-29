'use client';

import { useState } from 'react';
import { ArrowRightLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Handle, frame, useTween, v, add, sub, scale, cross, dot, len, THIN, DASH, type V } from '../kit';
import { Arrow, QTY } from '../fisica';
import { Grid, snap, cm, NamedVec, placeNames, lengthTex, valueTex, digitsFor, same, type Seg } from './griglia';

/**
 * Lesson "Somma e differenza di vettori", sections on the two rules: a and b start from O on a grid and the student
 * drags their tips, which snap to the crossings. The dashed sides complete the parallelogram and the sum is its
 * diagonal, in orange. The button slides b onto the tip of a (tip-to-tail rule) and back: the sum does not move.
 * Under the drawing the moduli of a, b and a + b, and the sum of the moduli, which is larger unless a and b have the
 * same direction and verso. Tips stay where the sum fits the grid; each name sits on the side of its arrow away
 * from the other arrows.
 */

const U = 0.5;
const G = { x0: -4, x1: 8, y0: -3, y1: 6 };
const TIPS = { x0: -3, x1: 5, y0: -3, y1: 5 };
const f = frame(G.x0 * U - 0.45, G.x1 * U + 0.45, G.y0 * U - 0.45, G.y1 * U + 0.45);
const START = { a: v(4, 1), b: v(1, 3) };
const inside = (p: V) => p.x >= G.x0 && p.x <= G.x1 && p.y >= G.y0 && p.y <= G.y1;

export default function SommaVettori({ alt }: { alt?: string }) {
	const [p, setP] = useState(START);
	const [t, go, running] = useTween(0, 900);
	const chained = t >= 0.5;

	const move = (key: 'a' | 'b') => (q: V) =>
		setP((old) => {
			// In the tip-to-tail rule the handle of b sits on the tip of the sum.
			const raw = snap(v(q.x / U, q.y / U), key === 'b' && chained ? { x0: G.x0, x1: G.x1, y0: G.y0, y1: G.y1 } : TIPS);
			const w = key === 'b' && chained ? sub(raw, old.a) : raw;
			const next = { ...old, [key]: w };
			const ok = len(w) >= 1.9 && w.x >= TIPS.x0 && w.x <= TIPS.x1 && w.y >= TIPS.y0 && w.y <= TIPS.y1 && inside(add(next.a, next.b));
			return ok ? next : old;
		});

	const { a, b } = p;
	const s = add(a, b);
	const parallel = cross(a, b) === 0;
	const zero = same(s, v(0, 0));
	// b slides from O to the tip of a.
	const bFrom = scale(a, t);
	const A = cm(a, U), B0 = cm(bFrom, U), B1 = cm(add(bFrom, b), U), S = cm(s, U), O = v(0, 0);

	const dashed = t < 0.5 && !parallel;
	const segs: Seg[] = [{ a: O, b: A }, { a: B0, b: B1 }, { a: O, b: S }, ...(dashed ? [{ a: A, b: S }, { a: cm(b, U), b: S }] : [])];
	const names = placeNames(f, segs, [{ seg: 2, chars: 1 }, { seg: 0, chars: 1 }, { seg: 1, chars: 1 }], [A, B1]);
	const dg = digitsFor(len(s), len(a) + len(b));
	const sameVerso = parallel && dot(a, b) > 0;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Grid f={f} u={U} {...G} />
				{dashed && (
					<g opacity={1 - 2 * t}>
						<path d={f.path([A, S])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
						<path d={f.path([cm(b, U), S])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
					</g>
				)}
				{!zero && <Arrow f={f} from={O} to={S} color={QTY.risultante} />}
				<Arrow f={f} from={O} to={A} color={QTY.vettore} />
				<Arrow f={f} from={B0} to={B1} color={QTY.vettore} />
				<NamedVec f={f} at={names[1]} dir={v(0, 0)} name="a" color={QTY.vettore} />
				<NamedVec f={f} at={names[2]} dir={v(0, 0)} name="b" color={QTY.vettore} />
				{!zero && <NamedVec f={f} at={names[0]} dir={v(0, 0)} name="s" color={QTY.risultante} />}
				{!running && <Handle f={f} at={A} onMove={move('a')} label="Punta del vettore a" color={QTY.vettore} step={U} />}
				{!running && <Handle f={f} at={B1} onMove={move('b')} label="Punta del vettore b" color={QTY.vettore} step={U} />}
			</Drawing>
			<Readout>
				<Tex>{`a ${lengthTex(a)}`}</Tex>
				<Tex>{`b ${lengthTex(b)}`}</Tex>
				<Tex>{`s = |\\vec{a} + \\vec{b}| ${lengthTex(s, dg)}`}</Tex>
				<Tex>{`a + b ${valueTex(len(a) + len(b), dg)}`}</Tex>
			</Readout>
			<Caption>
				{zero ? (
					<>
						<Tex>{'\\vec{b}'}</Tex> è l&apos;opposto di <Tex>{'\\vec{a}'}</Tex>: la somma è il vettore nullo.
					</>
				) : sameVerso ? (
					<>Stessa direzione e stesso verso: solo in questo caso il modulo della somma è la somma dei moduli.</>
				) : chained ? (
					<>
						Regola punta-coda: <Tex>{'\\vec{b}'}</Tex> parte dalla punta di <Tex>{'\\vec{a}'}</Tex>, e la somma va dall&apos;origine di <Tex>{'\\vec{a}'}</Tex> alla punta di <Tex>{'\\vec{b}'}</Tex>.
					</>
				) : parallel ? (
					<>Versi opposti: il modulo della somma è la differenza dei moduli, e il verso è quello del vettore più lungo.</>
				) : (
					<>
						Regola del parallelogramma: la somma è la diagonale che parte dall&apos;origine comune. Il suo modulo è minore di <Tex>{'a + b'}</Tex>.
					</>
				)}
			</Caption>
			<Controls>
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={running} onClick={() => void go(chained ? 0 : 1)}>
						<ArrowRightLeft className="size-4" aria-hidden="true" />
						{chained ? 'Torna al parallelogramma' : 'Metti b sulla punta di a'}
					</Button>
					<Button variant="secondary" size="sm" disabled={running || (same(a, START.a) && same(b, START.b))} onClick={() => setP(START)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}

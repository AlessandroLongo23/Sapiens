'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Handle, frame, v, sub, len, type V } from '../kit';
import { Arrow, QTY } from '../fisica';
import { Grid, snap, cm, NamedVec, placeNames, lengthTex, valueTex, digitsFor, same, type Seg } from './griglia';

/**
 * Lesson "Somma e differenza di vettori", section "Il vettore opposto e la differenza", as the TikZ figure beside it:
 * a and b start from O and the student drags their tips on the grid. The opposite of b, dashed, hangs from the tip
 * of a, and a − b (orange, named d) goes from O to its tip; a thin orange copy goes from the tip of b to the tip of
 * a, the shortcut the lesson points out. Under the drawing the moduli of a, b and a − b, and the difference of the
 * moduli, which is not the modulus of the difference.
 */

const U = 0.45;
const G = { x0: -5, x1: 7, y0: -5, y1: 5 };
const TIPS = { x0: -3, x1: 6, y0: -3, y1: 4 };
const f = frame(G.x0 * U - 0.45, G.x1 * U + 0.45, G.y0 * U - 0.45, G.y1 * U + 0.45);
const START = { a: v(5, 1), b: v(1, 4) };
const inside = (p: V) => p.x >= G.x0 && p.x <= G.x1 && p.y >= G.y0 && p.y <= G.y1;

export default function DifferenzaVettori({ alt }: { alt?: string }) {
	const [p, setP] = useState(START);
	const move = (key: 'a' | 'b') => (q: V) =>
		setP((old) => {
			const w = snap(v(q.x / U, q.y / U), TIPS);
			const next = { ...old, [key]: w };
			return len(w) >= 1.9 && inside(sub(next.a, next.b)) ? next : old;
		});

	const { a, b } = p;
	const d = sub(a, b);
	const zero = same(a, b);
	const dg = digitsFor(len(d), Math.abs(len(a) - len(b)));
	const O = v(0, 0), A = cm(a, U), B = cm(b, U), D = cm(d, U);

	const segs: Seg[] = [{ a: O, b: A }, { a: O, b: B }, { a: A, b: D }, { a: O, b: D }, { a: B, b: A }];
	const names = placeNames(f, segs, [{ seg: 3, chars: 1 }, { seg: 2, chars: 2 }, { seg: 0, chars: 1 }, { seg: 1, chars: 1 }], [A, B]);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Grid f={f} u={U} {...G} />
				{!zero && <Arrow f={f} from={B} to={A} color={QTY.risultante} weight="thin" />}
				{!zero && <Arrow f={f} from={O} to={D} color={QTY.risultante} />}
				<Arrow f={f} from={A} to={D} color={QTY.vettore} dashed />
				<Arrow f={f} from={O} to={A} color={QTY.vettore} />
				<Arrow f={f} from={O} to={B} color={QTY.vettore} />
				<NamedVec f={f} at={names[2]} dir={v(0, 0)} name="a" color={QTY.vettore} />
				<NamedVec f={f} at={names[3]} dir={v(0, 0)} name="b" color={QTY.vettore} />
				{!zero && <NamedVec f={f} at={names[1]} dir={v(0, 0)} name="b" minus color={QTY.vettore} />}
				{!zero && <NamedVec f={f} at={names[0]} dir={v(0, 0)} name="d" color={QTY.risultante} />}
				<Handle f={f} at={A} onMove={move('a')} label="Punta del vettore a" color={QTY.vettore} step={U} />
				<Handle f={f} at={B} onMove={move('b')} label="Punta del vettore b" color={QTY.vettore} step={U} />
			</Drawing>
			<Readout>
				<Tex>{`a ${lengthTex(a)}`}</Tex>
				<Tex>{`b ${lengthTex(b)}`}</Tex>
				<Tex>{`d = |\\vec{a} - \\vec{b}| ${lengthTex(d, dg)}`}</Tex>
				<Tex>{`a - b ${valueTex(len(a) - len(b), dg)}`}</Tex>
			</Readout>
			<Caption>
				{zero ? (
					<>
						<Tex>{'\\vec{a} = \\vec{b}'}</Tex>: la differenza è il vettore nullo.
					</>
				) : (
					<>
						<Tex>{'\\vec{d} = \\vec{a} - \\vec{b} = \\vec{a} + (-\\vec{b})'}</Tex>. La copia sottile va dalla punta di <Tex>{'\\vec{b}'}</Tex> alla punta di <Tex>{'\\vec{a}'}</Tex>.
					</>
				)}
			</Caption>
			<Controls>
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={same(a, START.a) && same(b, START.b)} onClick={() => setP(START)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}

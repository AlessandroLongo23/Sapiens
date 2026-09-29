'use client';

import { useState, type ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Handle, frame, v, add, sub, cross, dot, len, type V } from '../kit';
import { Arrow, QTY } from '../fisica';
import { Grid, snap, cm, NamedVec, placeNames, lengthTex, same } from './griglia';

/**
 * Lesson "Grandezze scalari e grandezze vettoriali", section "Vettori uguali e vettori opposti": on a grid, the
 * vector a is fixed (three squares right, two up, as in the TikZ figure beside it) and the student drags the origin
 * and the tip of b, which snap to the crossings. Under the drawing the two moduli, and whether direction and verso
 * are the same; a sentence says whether b is equal to a, opposite to it, or only shares its modulus or direction.
 * b lives in the right part of the grid, a in the left, so the two arrows and their names never meet.
 */

const U = 0.6; // TikZ scale=0.6 of the static figure
const GRID = { x0: 0, x1: 12, y0: 0, y1: 5 };
const BOX_B = { x0: 6, x1: 12, y0: 0, y1: 5 };
const A0 = v(1, 1), A1 = v(4, 3);
const f = frame(-0.55, GRID.x1 * U + 0.55, -0.55, GRID.y1 * U + 0.55);
const START = { tail: v(7, 1), tip: v(9, 4) };

type Verdict = 'uguale' | 'opposto' | 'stessoVerso' | 'versoOpposto' | 'stessoModulo' | 'diverso';

function verdict(a: V, b: V): Verdict {
	const parallel = cross(a, b) === 0;
	const equalModulus = Math.abs(len(a) - len(b)) < 1e-9;
	if (parallel && dot(a, b) > 0) return equalModulus ? 'uguale' : 'stessoVerso';
	if (parallel) return equalModulus ? 'opposto' : 'versoOpposto';
	return equalModulus ? 'stessoModulo' : 'diverso';
}

export default function VettoriConfronto({ alt }: { alt?: string }) {
	const [b, setB] = useState(START);
	const a = sub(A1, A0);
	const d = sub(b.tip, b.tail);
	const kind = verdict(a, d);

	/** Moves one end of b; the two ends never meet. */
	const move = (end: 'tail' | 'tip') => (p: V) =>
		setB((old) => {
			let q = snap(v(p.x / U, p.y / U), BOX_B);
			const other = end === 'tail' ? old.tip : old.tail;
			// Landing on the other end, the point jumps one square further the way it was going (the arrows keep going).
			if (same(q, other)) q = snap(add(q, v(Math.sign(q.x - old[end].x), Math.sign(q.y - old[end].y))), BOX_B);
			const next = { ...old, [end]: q };
			return same(next.tail, next.tip) ? old : next;
		});

	const parallel = cross(a, d) === 0;
	const caption: Record<Verdict, ReactNode> = {
		uguale: (
			<>
				<Tex>{'\\vec{b} = \\vec{a}'}</Tex>: stesso modulo, stessa direzione, stesso verso. Non conta da dove parte la freccia.
			</>
		),
		opposto: (
			<>
				<Tex>{'\\vec{b} = -\\vec{a}'}</Tex>: stesso modulo e stessa direzione, ma verso opposto.
			</>
		),
		stessoVerso: <>Stessa direzione e stesso verso, ma modulo diverso: i due vettori non sono uguali.</>,
		versoOpposto: <>Stessa direzione, verso opposto e modulo diverso: non sono né uguali né opposti.</>,
		stessoModulo: <>Stesso modulo, ma direzione diversa: i due vettori non sono uguali.</>,
		diverso: <>Modulo e direzione diversi. Trascina l&apos;origine e la punta di <Tex>{'\\vec{b}'}</Tex> per renderlo uguale ad <Tex>{'\\vec{a}'}</Tex>.</>
	};

	const bTail = cm(b.tail, U), bTip = cm(b.tip, U);
	const names = placeNames(f, [{ a: cm(A0, U), b: cm(A1, U) }, { a: bTail, b: bTip }], [{ seg: 0, chars: 1 }, { seg: 1, chars: 1 }], [bTail, bTip]);
	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Grid f={f} u={U} {...GRID} />
				<Arrow f={f} from={cm(A0, U)} to={cm(A1, U)} color={QTY.vettore} />

				<Arrow f={f} from={bTail} to={bTip} color={QTY.vettore} />
				<NamedVec f={f} at={names[0]} dir={v(0, 0)} name="a" color={QTY.vettore} />
				<NamedVec f={f} at={names[1]} dir={v(0, 0)} name="b" color={QTY.vettore} />
				<Handle f={f} at={bTail} onMove={move('tail')} label="Origine del vettore b" color={QTY.vettore} step={U} />
				<Handle f={f} at={bTip} onMove={move('tip')} label="Punta del vettore b" color={QTY.vettore} step={U} />
			</Drawing>
			<Readout>
				<Tex>{`a ${lengthTex(a)}`}</Tex>
				<Tex>{`b ${lengthTex(d)}`}</Tex>
				<span>direzione: {parallel ? 'la stessa' : 'diversa'}</span>
				{parallel && <span>verso: {dot(a, d) > 0 ? 'lo stesso' : 'opposto'}</span>}
				<span className="text-fg-muted">(moduli in quadretti)</span>
			</Readout>
			<Caption>{caption[kind]}</Caption>
			<Controls>
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={same(b.tail, START.tail) && same(b.tip, START.tip)} onClick={() => setB(START)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}

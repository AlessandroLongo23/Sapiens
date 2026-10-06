'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Drawing, Figure, Caption, Controls, ButtonRow, Tex, Label, frame, v, texNum } from '../kit';
import { Piano, makePiano, pedice } from './piano';
import { Rete, type Arco, type Unita } from './rete';

/**
 * The lesson "Il percettrone", last section: two hidden threshold units (an OR and an AND of the inputs) and an
 * output unit compute XOR. On the left the network, with the weights read from the lines; on the right the plane of
 * the two hidden units, where the four inputs land on three points that one line does separate.
 */

const ARCHI: Arco[] = [
	{ da: 'x1', a: 'h1', peso: 1 },
	{ da: 'x2', a: 'h1', peso: 1 },
	{ da: 'x1', a: 'h2', peso: 1 },
	{ da: 'x2', a: 'h2', peso: 1 },
	{ da: 'h1', a: 'y', peso: 1 },
	{ da: 'h2', a: 'y', peso: -2 }
];
const B1 = -0.5, B2 = -1.5, BY = -0.5;
const soglia = (s: number) => (s > 0 ? 1 : 0);

const f = frame(-0.35, 10.55, -0.85, 4.25);
const bias = (b: string) => (
	<>
		<tspan fontStyle="italic">b</tspan> = {b}
	</>
);
const g = makePiano(v(7.15, 0.45), 1.95);
/** The output unit on the plane of h1 and h2: h1 − 2·h2 − 0,5 > 0. */
const USCITA = { w1: 1, w2: -2, b: BY };

export default function ReteXor({ alt }: { alt?: string }) {
	const [x1, setX1] = useState(0);
	const [x2, setX2] = useState(1);
	const s1 = x1 + x2 + B1, s2 = x1 + x2 + B2;
	const h1 = soglia(s1), h2 = soglia(s2);
	const sy = h1 - 2 * h2 + BY;
	const y = soglia(sy);

	const unita: Unita[] = [
		{ id: 'x1', at: v(0.45, 2.75), nome: pedice('x', 1), lato: v(0, 1), valore: x1, dentro: String(x1) },
		{ id: 'x2', at: v(0.45, 0.65), nome: pedice('x', 2), lato: v(0, 1), valore: x2, dentro: String(x2) },
		{ id: 'h1', at: v(2.85, 2.75), nome: pedice('h', 1), lato: v(0, 1), valore: h1, dentro: String(h1), sotto: bias('−0,5') },
		{ id: 'h2', at: v(2.85, 0.65), nome: pedice('h', 2), lato: v(0, 1), valore: h2, dentro: String(h2), sotto: bias('−1,5') },
		{ id: 'y', at: v(5.2, 1.7), nome: 'y', lato: v(0, 1), valore: y, dentro: String(y), sotto: bias('−0,5') }
	];
	// the four inputs give three points: (0,1) and (1,0) both land on (1,0)
	const punti = [
		{ x: 0, y: 0, classe: 0, acceso: h1 === 0 && h2 === 0 },
		{ x: 1, y: 0, classe: 1, acceso: h1 === 1 && h2 === 0 },
		{ x: 1, y: 1, classe: 0, acceso: h1 === 1 && h2 === 1 }
	];

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Rete f={f} unita={unita} archi={ARCHI} pesi />
				<Piano f={f} g={g} pesi={USCITA} punti={punti} assi={[pedice('h', 1), pedice('h', 2)]} />
				<Label f={f} at={v(2.85, 4.02)} upright size={12}>strato nascosto</Label>
			</Drawing>
			<Caption>
				Con <Tex>{`x = (${x1},\\,${x2})`}</Tex>: <Tex>{`h_1 = ${h1}`}</Tex> perché <Tex>{`${x1} + ${x2} - 0{,}5 = ${texNum(s1, 1)}`}</Tex>, <Tex>{`h_2 = ${h2}`}</Tex> perché <Tex>{`${x1} + ${x2} - 1{,}5 = ${texNum(s2, 1)}`}</Tex>, e in uscita <Tex>{`${h1} - 2 \\cdot ${h2} - 0{,}5 = ${texNum(sy, 1)}`}</Tex>, quindi <Tex>{`y = ${y}`}</Tex>. Linea spessa e scura: peso grande; tratteggiata: peso negativo.
			</Caption>
			<Controls>
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={() => setX1(1 - x1)} aria-pressed={x1 === 1}>
						Cambia x₁
					</Button>
					<Button variant="secondary" size="sm" onClick={() => setX2(1 - x2)} aria-pressed={x2 === 1}>
						Cambia x₂
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}

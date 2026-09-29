'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, Readout, Tex, frame, v, add, scale, polar, texNum, THIN, DASH, FONT, K, type V } from '../kit';
import { Arrow, VecLabel, QTY } from '../fisica';
import { placeNames } from './griglia';

/**
 * Lesson "Somma e differenza di vettori", section "Il prodotto di un vettore per un numero": the vector a, 2 m at
 * 30°, stays top left; a slider moves k from −3 to 3 in steps of 0.5 and k·a (orange) is drawn from its own origin on
 * the dashed line of a's direction: it stretches, shrinks, vanishes at k = 0 and turns round for k < 0. Under the
 * drawing k, the modulus |k|·a and the verso.
 */

const UNIT = 0.5; // centimetres per metre
const A_LEN = 2; // metres
const DIR = Math.PI / 6;
const aVec = polar(A_LEN * UNIT, DIR);
const A0 = v(-3.1, 1.15);
const O = v(0, 0);
const REACH = 3 * A_LEN * UNIT; // the longest k·a
const f = frame(-3.45, 3.45, -1.95, 2.15);

export default function VettorePerScalare({ alt }: { alt?: string }) {
	const [k, setK] = useState(2);
	const ka = scale(aVec, k);
	const modulus = Math.abs(k) * A_LEN;
	const n = v(-Math.sin(DIR), Math.cos(DIR)); // left of a
	const lineEnd = polar(REACH + 0.25, DIR);
	const kTex = texNum(k, 1);
	const coeff = k === 1 ? '' : k === -1 ? '-' : kTex;
	const kaName = placeNames(f, [{ a: O, b: ka }, { a: A0, b: add(A0, aVec) }, { a: scale(lineEnd, -1), b: lineEnd }], [{ seg: 0, chars: coeff.replace('{,}', ',').length + 1 }])[0];

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={f.path([scale(lineEnd, -1), lineEnd])} stroke="#999" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<Arrow f={f} from={A0} to={add(A0, aVec)} color={QTY.vettore} />
				<VecLabel f={f} at={add(A0, scale(aVec, 0.5))} dir={n} name="a" color={QTY.vettore} />
				{k !== 0 && <Arrow f={f} from={O} to={ka} color={QTY.risultante} />}
				<circle cx={f.px(O).x} cy={f.px(O).y} r={2.2} fill="#000" />
				{k !== 0 && <KName at={kaName} coeff={coeff} />}
			</Drawing>
			<Readout>
				<Tex>{`k = ${kTex}`}</Tex>
				<Tex>{`a = ${A_LEN}\\,\\text{m}`}</Tex>
				<Tex>{`|k\\vec{a}| = |{${kTex}}| \\cdot ${A_LEN} = ${texNum(modulus, 1)}\\,\\text{m}`}</Tex>
			</Readout>
			<Caption>
				{k === 0 ? (
					<>
						Con <Tex>{'k = 0'}</Tex> il prodotto è il vettore nullo: non c&apos;è più la freccia.
					</>
				) : k > 0 ? (
					<>
						<Tex>{'k'}</Tex> è positivo: <Tex>{`${coeff}\\vec{a}`}</Tex> ha la direzione e il verso di <Tex>{'\\vec{a}'}</Tex>{k > 1 ? ', ed è più lungo' : k < 1 ? ', ed è più corto' : ''}.
					</>
				) : (
					<>
						<Tex>{'k'}</Tex> è negativo: <Tex>{`${coeff}\\vec{a}`}</Tex> ha la direzione di <Tex>{'\\vec{a}'}</Tex> ma il verso opposto. Il modulo resta positivo.
					</>
				)}
			</Caption>
			<Controls>
				<Slider label="Il numero k" value={k} min={-3} max={3} step={0.5} onChange={(x) => setK(Math.round(x * 2) / 2)} />
			</Controls>
		</Figure>
	);
}

/** The name k·a centred at `at`: the number upright, then the vector's letter with its arrow. */
function KName({ at, coeff }: { at: V; coeff: string }) {
	const p = f.px(at);
	const shown = coeff.replace('{,}', ',').replace('-', '−');
	const wNum = shown.length * 7.5, wLetter = 9.3;
	const left = p.x - (wNum + wLetter) / 2;
	return (
		<g pointerEvents="none">
			<text x={left} y={p.y + 5} fontSize={15} fontFamily={FONT} fill={QTY.risultante}>
				{shown}
			</text>
			<VecLabel f={f} at={add(at, v((wNum + 1) / 2 / K, 0))} dir={v(0, 0)} name="a" color={QTY.risultante} />
		</g>
	);
}

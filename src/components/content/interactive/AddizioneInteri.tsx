'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ButtonRow, Caption, clamp, Controls, DASH, Drawing, Figure, frame, Readout, Tex, THICK, useTween, v } from './kit';
import { EndDot, Grip, HLine, Line, n, signed, Text, Tick, texSigned } from './retta';

/**
 * Lesson 21, "Addizione" and "Sottrazione": a + b on the number line as a step of |b| units from a, to the right when
 * b is positive and to the left when it is negative. With "Sottrai" the step becomes −b and the arrow turns over,
 * so that subtracting a negative number visibly moves to the right. Drawn like `addizione-interi-retta-dei-numeri`,
 * with a slightly narrower unit so that the line reaches ±8.
 */

const U = 0.55; // cm per unit (the TikZ figure uses 0.8 for ±6)
const MAX = 8;
const X = (t: number) => t * U;
const Y = 0.65; // height of the arrow
const f = frame(X(-MAX) - 0.45, X(MAX) + 0.45, -0.6, 1.35);

export default function AddizioneInteri({ alt }: { alt?: string }) {
	const [a, setA] = useState(-3);
	const [b, setB] = useState(5);
	const [minus, setMinus] = useState(false);
	// 0 while adding, 1 while subtracting: the arrow is b·(1 − 2t), so it shrinks, passes through 0 and turns over.
	const [t, go] = useTween(0, 700);

	const w = minus ? -b : b; // the step actually taken
	const r = a + w;
	const shown = b * (1 - 2 * t);

	const moveA = (x: number) => setA(clamp(Math.round(x / U), Math.max(-MAX, -MAX - w), Math.min(MAX, MAX - w)));
	const moveTip = (x: number) => {
		const step = clamp(Math.round(x / U), -MAX, MAX) - a;
		setB(clamp(minus ? -step : step, -MAX, MAX));
	};
	const setMode = (m: boolean) => {
		if (m === minus) return;
		// Keep the result on the line: a − b and a + b are both between −8 and 8 only if b is small enough.
		const nb = m ? clamp(b, Math.max(-MAX, a - MAX), Math.min(MAX, a + MAX)) : clamp(b, Math.max(-MAX, -MAX - a), Math.min(MAX, MAX - a));
		setB(nb);
		setMinus(m);
		void go(m ? 1 : 0);
	};

	const sa = texSigned(a), sb = texSigned(b), sr = texSigned(r, false);
	const eq = minus ? `${sa} - ${sb} = ${sa} + ${texSigned(-b)} = ${sr}` : `${sa} + ${sb} = ${sr}`;
	const par = (x: number) => (x === 0 ? '0' : `(${signed(x)})`);
	const label = `${par(a)} ${minus ? '−' : '+'} ${par(b)} = ${signed(r)}`;
	const labelW = label.length * 0.17; // cm, about 7 px per character at 15 px
	const labelX = clamp(X(a + shown / 2), f.x0 + labelW / 2, f.x1 - labelW / 2);

	let what: string;
	if (b === 0) what = minus ? 'Sottrarre 0 non sposta: il risultato è a.' : 'Sommare 0 non sposta: il risultato è a.';
	else if (!minus) what = b > 0 ? `Sommare ${signed(b)} vuol dire fare ${b} passi verso destra.` : `Sommare ${signed(b)} vuol dire fare ${-b} passi verso sinistra.`;
	else what = `Sottrarre ${signed(b)} vuol dire sommare il suo opposto, ${signed(-b)}: la freccia si ribalta e va verso ${b > 0 ? 'sinistra' : 'destra'}${b < 0 ? ', e il risultato è maggiore del punto di partenza' : ''}.`;

	const ticks = Array.from({ length: 2 * MAX + 1 }, (_, i) => i - MAX);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<HLine f={f} x0={X(-MAX - 0.6)} x1={X(MAX + 0.6)} arrow />
				{ticks.map((k) => (
					<g key={k}>
						<Tick f={f} x={X(k)} />
						<Text f={f} at={v(X(k), -0.16)} baseline="top" weight={k === r ? 700 : undefined}>
							{n(k)}
						</Text>
					</g>
				))}
				<Line f={f} from={v(X(a), 0)} to={v(X(a), Y)} dash={DASH} />
				<Line f={f} from={v(X(a + shown), 0)} to={v(X(a + shown), Y)} dash={DASH} />
				<Line f={f} from={v(X(a), Y)} to={v(X(a + shown), Y)} width={THICK} arrow />
				<Text f={f} at={v(labelX, Y + 0.14)} baseline="bottom">
					{label}
				</Text>
				<EndDot f={f} at={v(X(r), 0)} filled r={1.8} />
				<Grip f={f} at={v(X(a), 0)} onMove={(p) => moveA(p.x)} label={`Punto di partenza, ${n(a)}`} step={U}>
					<EndDot f={f} at={v(X(a), 0)} filled r={2.5} />
				</Grip>
				<Grip f={f} at={v(X(a + shown), Y)} onMove={(p) => moveTip(p.x)} label={`Punta della freccia, che arriva a ${n(r)}`} step={U}>
					<circle cx={f.px(v(X(a + shown), Y)).x} cy={f.px(v(X(a + shown), Y)).y} r={2.5} fill="#000" />
				</Grip>
			</Drawing>
			<Readout>
				<Tex>{eq}</Tex>
			</Readout>
			<Caption>Trascina il punto di partenza e la punta della freccia. {what}</Caption>
			<Controls>
				<ButtonRow>
					<Button variant={minus ? 'secondary' : 'primary'} size="sm" aria-pressed={!minus} onClick={() => setMode(false)}>
						<Plus className="size-4" aria-hidden="true" />
						Somma b
					</Button>
					<Button variant={minus ? 'primary' : 'secondary'} size="sm" aria-pressed={minus} onClick={() => setMode(true)}>
						<Minus className="size-4" aria-hidden="true" />
						Sottrai b
					</Button>
				</ButtonRow>
				<Slider label="Partenza a" value={a} min={Math.max(-MAX, -MAX - w)} max={Math.min(MAX, MAX - w)} step={1} onChange={setA} />
				<Slider label="Numero b" value={b} min={Math.max(-MAX, minus ? a - MAX : -MAX - a)} max={Math.min(MAX, minus ? a + MAX : MAX - a)} step={1} onChange={setB} />
			</Controls>
		</Figure>
	);
}

'use client';

import { useState } from 'react';
import { Eraser, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ButtonRow, Caption, clamp, Controls, Drawing, Figure, frame, INK, Readout, Tex, texNum, v } from './kit';
import { EndDot, Grip, HLine, Line, n, PT, Text, Tick, xc } from './retta';

/**
 * Lesson 52, "Disuguaglianze e disequazioni": is x a solution of 2x + 1 > 7? The student moves x along the line and
 * reads the two members; every value tried leaves a mark above the line (a full dot if it is a solution, a cross if
 * it is not), and the marks draw the set of solutions, which then appears as in `intervallo-illimitato-retta`: the
 * half line right of 3 with an empty dot in 3.
 */

const U = 0.8; // cm per unit, as in the TikZ figure
const LO = -1, HI = 6;
const X = (t: number) => t * U;
const f = frame(X(LO - 0.6), X(HI + 0.75) + 0.35, -0.6, 0.75);
const AXIS = xc('black', 70);
const BAND = xc('blue', 45);
const TRACE_Y = 0.42;
const GAP = 0.13 * U; // the axis breaks around the empty dot

/** 2x + 1 > 7 at x: the first member, and whether it is a solution. */
const test = (x: number) => {
	const m = Math.round((2 * x + 1) * 10) / 10;
	return { m, ok: m > 7 };
};
/** Tenths, pulled onto a whole number when close to it: 3 is the value to land on. */
const snap = (x: number) => {
	const r = Math.round(x);
	return clamp(Math.abs(x - r) < 0.15 ? r : Math.round(x * 10) / 10, LO, HI);
};

export default function DisequazioneProva({ alt }: { alt?: string }) {
	const [x, setX] = useState(4);
	const [tried, setTried] = useState<number[]>([4]);
	const [show, setShow] = useState(false);
	const put = (y: number) => {
		const s = snap(y);
		setX(s);
		setTried((t) => (t.includes(s) ? t : [...t, s]));
	};

	const { m, ok } = test(x);
	const tx = x < 0 ? `(${texNum(x)})` : texNum(x);
	const eq = `2 \\cdot ${tx} + 1 = ${texNum(m)}`;
	const cross = (t: number, s = 2.2 * PT) => {
		const c = f.px(v(X(t), TRACE_Y));
		return `M${c.x - s},${c.y - s} L${c.x + s},${c.y + s} M${c.x - s},${c.y + s} L${c.x + s},${c.y - s}`;
	};

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<HLine f={f} x0={X(LO - 0.6)} x1={X(HI + 0.75)} color={AXIS} holes={show ? [X(3)] : []} gap={GAP} arrow />
				<Text f={f} at={v(X(HI + 0.75) + 0.08, 0)} anchor="start" italic>
					x
				</Text>
				{show && <HLine f={f} x0={X(3) + GAP} x1={X(HI + 0.45)} color={BAND} width={2 * PT} />}
				{Array.from({ length: HI - LO + 1 }, (_, i) => i + LO).map((t) => (
					<g key={t}>
						<Tick f={f} x={X(t)} h={0.1} />
						<Text f={f} at={v(X(t), -0.19)} baseline="top">
							{n(t)}
						</Text>
					</g>
				))}
				{show && <EndDot f={f} at={v(X(3), 0)} filled={false} />}
				{tried.map((t) =>
					test(t).ok ? (
						<circle key={t} cx={f.px(v(X(t), TRACE_Y)).x} cy={f.px(v(X(t), TRACE_Y)).y} r={1.6 * PT} fill={INK.green} />
					) : (
						<path key={t} d={cross(t)} stroke={INK.red} strokeWidth={1} />
					)
				)}
				<Line f={f} from={v(X(x), 0)} to={v(X(x), TRACE_Y)} color={ok ? INK.green : INK.red} />
				<Grip f={f} at={v(X(x), 0)} onMove={(p) => put(p.x / U)} label={`Il numero x, ora ${n(x)}`} step={0.1 * U} color={ok ? INK.green : INK.red}>
					<circle cx={f.px(v(X(x), 0)).x} cy={f.px(v(X(x), 0)).y} r={3 * PT} fill={ok ? INK.green : INK.red} />
				</Grip>
			</Drawing>
			<Readout>
				<Tex>{eq}</Tex>
				<span>
					<Tex>{`${texNum(m)} > 7`}</Tex> è {ok ? 'vera' : 'falsa'}
				</span>
				{show && <Tex>{'S = \\mathopen{]}3, +\\infty\\mathclose{[}'}</Tex>}
			</Readout>
			<Caption>
				Trascina x e prova diversi numeri: {ok ? `${n(x)} è una soluzione` : `${n(x)} non è una soluzione`}. Ogni numero provato lascia un segno, un pallino verde se è una
				soluzione e una crocetta rossa se non lo è.{show ? ' Le soluzioni sono tutti i numeri maggiori di 3; il 3 no, perché dà 7 > 7, che è falsa.' : ''}
			</Caption>
			<Controls>
				<Slider label="x" value={x} min={LO} max={HI} step={0.1} onChange={put} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={() => setShow((s) => !s)} aria-pressed={show}>
						{show ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
						{show ? 'Nascondi le soluzioni' : 'Mostra tutte le soluzioni'}
					</Button>
					<Button variant="secondary" size="sm" onClick={() => setTried([x])}>
						<Eraser className="size-4" aria-hidden="true" />
						Cancella i segni
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}

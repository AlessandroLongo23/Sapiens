'use client';

import { RotateCcw, Play } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { add, ButtonRow, Caption, Controls, DASH, Drawing, Figure, FONT, frame, INK, K, polar, Readout, scale, Tex, THICK, THIN, TINT, useTween, v, type V } from './kit';
import { Line, n, Text, Tick, xc } from './retta';

/**
 * Lesson 71, "La retta reale": the point √n on the real line with ruler and compass. The student picks the two legs
 * of a right triangle (the base on the line, from 0, and the height); the diagonal of the rectangle is √(a² + b²).
 * The button turns the compass, pointed in 0, from the end of the diagonal down to the line, and the arc lands on
 * √n, between the two whole numbers whose squares hold n. Drawn like `costruzione-radice-5-retta`, at scale 1.1.
 */

const S = 1.1; // cm per unit, as in the TikZ figure of √5
const A_MAX = 4, B_MAX = 3;
const P = (x: number, y: number) => v(x * S, y * S);
const f = frame(-0.55 * S, 5.75 * S, -0.5 * S, 3.55 * S);
const DIAG = xc('blue', 60);

/** √n with its bar, as TikZ sets $\sqrt{5}$ in a node. */
function Root({ at, value, anchor = 'start' }: { at: V; value: number; anchor?: 'start' | 'end' }) {
	const p = f.px(at);
	const w = String(value).length * 7.5;
	const x0 = anchor === 'start' ? p.x : p.x - w - 10;
	return (
		<g pointerEvents="none" fontFamily={FONT} fontSize={15}>
			<text x={x0} y={p.y}>
				√
			</text>
			<line x1={x0 + 9.5} x2={x0 + 11 + w} y1={p.y - 12.5} y2={p.y - 12.5} stroke="#000" strokeWidth={0.7} />
			<text x={x0 + 10.5} y={p.y}>
				{value}
			</text>
		</g>
	);
}

export default function RadiceRetta({ alt }: { alt?: string }) {
	const [a, setA] = useState(1);
	const [b, setB] = useState(1);
	const [t, go, running] = useTween(0, 1600);
	const nn = a * a + b * b;
	const d = Math.sqrt(nn);
	const k = Math.floor(d + 1e-9);
	const whole = k * k === nn;
	const t0 = Math.atan2(b, a);
	const th = t0 * (1 - t);
	const tip = P(d * Math.cos(th), d * Math.sin(th));
	const done = t > 0.999;

	const change = (set: (x: number) => void) => (x: number) => {
		set(x);
		void go(0, 0);
	};

	// The arc drawn so far, from the corner of the rectangle down to the pencil.
	const arcPath = () => {
		const s = f.px(P(a, b)), e = f.px(tip);
		return `M${s.x},${s.y} A${d * S * K},${d * S * K} 0 0 0 ${e.x},${e.y}`;
	};
	// The compass: the needle in 0, the pencil on the arc, the hinge above the middle of the two.
	const hinge = add(scale(tip, 0.5), scale(polar(1, th + Math.PI / 2), Math.max(0.55, 0.28 * d * S)));
	const knob = add(hinge, scale(polar(1, th + Math.PI / 2), 0.28));
	const seg = (p: V, q: V, w: number, c = INK.gray) => {
		const A = f.px(p), B = f.px(q);
		return <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={c} strokeWidth={w} strokeLinecap="round" />;
	};

	const readout = whole ? `d = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${nn}} = ${k}` : `d = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${nn}}`;
	const between = whole ? '' : `${k}^2 = ${k * k} < ${nn} < ${(k + 1) ** 2} = ${k + 1}^2`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<rect x={f.px(P(0, b)).x} y={f.px(P(0, b)).y} width={a * S * K} height={b * S * K} fill={TINT.blue} stroke="#000" strokeWidth={THIN} />
				<Line f={f} from={P(-0.4, 0)} to={P(5.6, 0)} arrow />
				{[0, 1, 2, 3, 4, 5].map((x) => (
					<g key={x}>
						<Tick f={f} x={x * S} h={0.07 * S} />
						<Text f={f} at={P(x, -0.1)} baseline="top">
							{x}
						</Text>
					</g>
				))}
				<Text f={f} at={P(-0.08, b / 2)} anchor="end">
					{b}
				</Text>
				<Line f={f} from={P(0, 0)} to={P(a, b)} color={DIAG} width={THICK} />
				<Root at={add(P(a / 2, b / 2), v(-0.12, 0.12))} value={nn} anchor="end" />
				{t > 0 && <path d={arcPath()} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />}
				{t > 0 && !done && <Line f={f} from={P(0, 0)} to={tip} color={DIAG} width={THIN} dash={DASH} />}
				{/* The compass is out only while it turns: at rest it would cover the diagonal and its label. */}
				{t > 0 && !done && (
					<g opacity={0.9}>
						{seg(P(0, 0), hinge, 1.6)}
						{seg(hinge, tip, 1.6)}
						{seg(hinge, knob, 2.6)}
						<circle cx={f.px(hinge).x} cy={f.px(hinge).y} r={2.2} fill={INK.gray} />
					</g>
				)}
				{done && (
					<>
						<circle cx={f.px(P(d, 0)).x} cy={f.px(P(d, 0)).y} r={0.055 * S * K} fill="#000" />
						<Root at={add(P(d, 0), v(0.06, 0.12))} value={nn} />
					</>
				)}
			</Drawing>
			<Readout>
				<Tex>{readout}</Tex>
				{done && between && <Tex>{between}</Tex>}
			</Readout>
			<Caption>
				{done
					? whole
						? `Il compasso porta la diagonale sulla retta: questa volta √${nn} = ${k}, un numero intero.`
						: `Il compasso porta la diagonale sulla retta: il punto √${nn} ≈ ${n(d, 2)} cade tra ${k} e ${k + 1}, perché ${k}² = ${k * k} è minore di ${nn} e ${k + 1}² = ${(k + 1) ** 2} è maggiore.`
					: 'Scegli i cateti del triangolo con i cursori, poi premi il bottone: il compasso, puntato in 0, porta la diagonale sulla retta.'}
			</Caption>
			<Controls>
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={() => void go(done ? 0 : 1)} disabled={running}>
						{done ? <RotateCcw className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{done ? 'Ricomincia' : 'Riporta con il compasso'}
					</Button>
				</ButtonRow>
				<Slider label="Base" value={a} min={1} max={A_MAX} step={1} onChange={change(setA)} />
				<Slider label="Altezza" value={b} min={1} max={B_MAX} step={1} onChange={change(setB)} />
			</Controls>
		</Figure>
	);
}

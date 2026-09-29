'use client';

import { useRef, useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ButtonRow, Caption, Controls, Drawing, Figure, FONT, frame, INK, Readout, Tex, THICK, THIN, v } from '../kit';
import { QTY } from '../fisica';

/**
 * Lesson "Valore medio e incertezza di una serie di misure" (fis-valore-medio): the time of 10 swings of a pendulum,
 * measured with a stopwatch of sensitivity 0.01 s. It starts from the six measures of the lesson (12.46, 12.56,
 * 12.51, 12.44, 12.53, 12.50 s, the figure `misure-pendolo-semidispersione`); each new measure is 12.50 s plus a
 * normal random error of 0.05 s (the reaction time), read to the hundredth. Measures are dots stacked over their
 * value; an orange line marks the mean and a bracket the interval from mean − Δt to mean + Δt, Δt the half range.
 * Under the drawing: n, the mean, the half range and the result rounded with the lesson's rules (the uncertainty to
 * one significant figure, never below the sensitivity; the mean to the same decimal place), all in integer
 * hundredths so no rounding is left to floating point.
 */

const START = [1246, 1256, 1251, 1244, 1253, 1250]; // hundredths of a second
const LO = 1230, HI = 1270;
const U = 0.15; // cm per hundredth
const X = (h: number) => (h - LO) * U;
const f = frame(-0.35, X(HI) + 1.3, -0.75, 3.85);
const STACK_TOP = 2.75; // cm available for the stacks
const BRACKET = 3.2;
const MAX = 300;
const SMALL = 13.5;

function makeRandom(seed: number) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function measure(rand: () => number) {
	const z = Math.sqrt(-2 * Math.log(Math.max(rand(), 1e-12))) * Math.cos(2 * Math.PI * rand());
	return Math.min(HI, Math.max(LO, Math.round(1250 + 5 * z)));
}

/** Hundredths as seconds with `d` decimals and the decimal comma for KaTeX: 1250 → 12{,}50. */
const sec = (h: number, d = 2) => (h / 100).toFixed(d).replace('.', '{,}');

/**
 * The result rounded as the lesson does, from integer hundredths: the sum S of n measures and their range D.
 * Returns the step P of the last digit (1 = hundredths, 10 = tenths) and the rounded mean and uncertainty in hundredths.
 */
function rounded(S: number, n: number, D: number) {
	let P = 1;
	let du: number;
	if (D <= 1) du = 1; // the half range is below the sensitivity (0.01 s)
	else if (D < 20) {
		du = (D + 1) >> 1; // D/2 hundredths, rounded half up
		if (du === 10) P = 10;
	} else {
		P = 10;
		du = Math.floor((D + 10) / 20) * 10; // D/2 hundredths to one figure in tenths
	}
	const mean = Math.floor((2 * S + n * P) / (2 * n * P)) * P;
	return { P, mean, du };
}

export default function MisureRipetute({ alt }: { alt?: string }) {
	const [xs, setXs] = useState<number[]>(START);
	const rand = useRef(makeRandom(12345));
	const add = (k: number) => {
		const more = Array.from({ length: k }, () => measure(rand.current));
		setXs((a) => [...a, ...more].slice(0, MAX));
	};

	const n = xs.length;
	const S = xs.reduce((s, x) => s + x, 0);
	const min = Math.min(...xs), max = Math.max(...xs);
	const D = max - min;
	const mean = S / n;
	const r = rounded(S, n, D);
	const d = r.P === 1 ? 2 : 1;

	// Stacks: the k-th measure with the same value sits k steps up; the step shrinks when a stack gets tall.
	const count = new Map<number, number>();
	const level = xs.map((x) => {
		const k = count.get(x) ?? 0;
		count.set(x, k + 1);
		return k;
	});
	const tallest = Math.max(...count.values());
	const step = Math.min(0.16, (STACK_TOP - 0.2) / tallest);
	const dotR = Math.min(2.6, (step * f.W) / (f.x1 - f.x0) / 2 + 0.4);

	const xm = X(mean);
	const half = D / 2;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={f.path([v(X(LO) - 0.2, 0), v(X(HI) + 0.3, 0)])} stroke="#000" strokeWidth={THIN} />
				<path d={f.path([v(X(HI) + 0.3, 0.07), v(X(HI) + 0.42, 0), v(X(HI) + 0.3, -0.07)])} stroke="#000" strokeWidth={THIN} fill="none" />
				<text x={f.px(v(X(HI) + 0.5, 0)).x} y={f.px(v(0, 0)).y} dy="0.35em" fontSize={SMALL} fontFamily={FONT}>
					<tspan fontStyle="italic">t</tspan> (s)
				</text>
				{Array.from({ length: (HI - LO) / 2 + 1 }, (_, i) => LO + 2 * i).map((h) => {
					const major = h % 10 === 0;
					return (
						<g key={h}>
							<path d={f.path([v(X(h), major ? -0.1 : -0.05), v(X(h), major ? 0.1 : 0.05)])} stroke="#000" strokeWidth={THIN} />
							{major && (
								<text x={f.px(v(X(h), 0)).x} y={f.px(v(0, -0.18)).y} dy="0.75em" textAnchor="middle" fontSize={12} fontFamily={FONT}>
									{(h / 100).toFixed(2).replace('.', ',')}
								</text>
							)}
						</g>
					);
				})}
				<path d={f.path([v(xm, -0.05), v(xm, BRACKET - 0.15)])} stroke={QTY.risultante} strokeWidth={THICK} />
				{xs.map((x, i) => {
					const p = f.px(v(X(x), 0.22 + level[i] * step));
					return <circle key={i} cx={p.x} cy={p.y} r={dotR} fill={INK.blue} />;
				})}
				{half > 0 && (
					<path
						d={f.path([v(X(mean - half), BRACKET - 0.1), v(X(mean - half), BRACKET), v(X(mean + half), BRACKET), v(X(mean + half), BRACKET - 0.1)])}
						stroke="#000"
						strokeWidth={THICK}
						fill="none"
					/>
				)}
				<text x={f.px(v(xm, BRACKET)).x} y={f.px(v(0, BRACKET + 0.12)).y} textAnchor="middle" fontSize={SMALL} fontFamily={FONT}>
					<tspan fontStyle="italic">t̄</tspan> ± <tspan fontStyle="italic">Δt</tspan>
				</text>
			</Drawing>
			<Readout>
				<span>
					<Tex>{`n = ${n}`}</Tex>
				</span>
				<span>
					<Tex>{`\\bar{t} ${(S * 10) % n === 0 ? '=' : '\\approx'} ${(mean / 100).toFixed(3).replace('.', '{,}')}\\,\\text{s}`}</Tex>
				</span>
				<span>
					<Tex>{`\\Delta t = \\dfrac{${sec(max)} - ${sec(min)}}{2} = ${sec(D / 2, D % 2 ? 3 : 2)}\\,\\text{s}`}</Tex>
				</span>
				<span>
					<Tex>{`t = (${sec(r.mean, d)} \\pm ${sec(r.du, d)})\\,\\text{s}`}</Tex>
				</span>
			</Readout>
			<Caption>
				{n === START.length && xs.every((x, i) => x === START[i])
					? 'Le sei misure del gruppo. Aggiungi misure: il valore medio si assesta, la semidispersione no.'
					: D <= 1
						? "La semidispersione è più piccola della sensibilità del cronometro: l'incertezza è 0,01 s."
						: `Con ${n} misure il valore medio si muove sempre meno a ogni misura nuova; la semidispersione dipende solo dalla misura più grande e dalla più piccola.`}
			</Caption>
			<Controls>
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={n >= MAX} onClick={() => add(1)}>
						<Plus className="size-4" aria-hidden="true" />
						Una misura
					</Button>
					<Button variant="secondary" size="sm" disabled={n >= MAX} onClick={() => add(10)}>
						<Plus className="size-4" aria-hidden="true" />
						10 misure
					</Button>
					<Button
						variant="secondary"
						size="sm"
						disabled={n === START.length}
						onClick={() => {
							rand.current = makeRandom(12345);
							setXs(START);
						}}
					>
						<RotateCcw className="size-4" aria-hidden="true" />
						Torna alle sei misure
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}

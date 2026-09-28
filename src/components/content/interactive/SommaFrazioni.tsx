'use client';

import { useState } from 'react';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ButtonRow, Caption, Controls, DASH, Drawing, Figure, Readout, Tex, THICK, THIN, TINT, VERY_THIN, clamp, frame, useTween, v } from './kit';
import { MathRow, gcd, lcm } from './numeri';

/**
 * Lesson 24, "Addizione e sottrazione con denominatori diversi": a/b and c/d as two bars of the same whole. The button
 * "Denominatore comune" cuts every part of both into pieces of 1/m, m the least common multiple of b and d (t from 0
 * to 1); the next one moves the coloured pieces onto one bar, one after the other (t from 1 to 2), where they can be
 * counted: (a·m/b + c·m/d)/m.
 */

const U = 3.8; // the whole, in TikZ cm
const H = 0.6;
const f = frame(-0.35, 8.05, -0.75, 4.25);
const BAR1 = 3.3;
const BAR2 = 2.2;
const SUM = 0.45;

export default function SommaFrazioni({ alt }: { alt?: string }) {
	const [a, setA] = useState(1);
	const [b, setB] = useState(2);
	const [c, setC] = useState(1);
	const [d, setD] = useState(3);
	const [t, go, running] = useTween(0, 1400);

	const m = lcm(b, d);
	const p = (a * m) / b; // pieces of 1/m in a/b
	const q = (c * m) / d;
	const s = p + q;
	const g = gcd(s, m);
	const cut = clamp(t, 0, 1);
	const move1 = clamp((t - 1) * 2, 0, 1);
	const move2 = clamp((t - 1) * 2 - 1, 0, 1);

	const box = (x0: number, y0: number, x1: number, y1: number) => f.pts(v(x0, y0), v(x1, y0), v(x1, y1), v(x0, y1));

	/** The lines of a bar from x0 to x1 (TikZ cm) at y: `den` parts of the whole, and the pieces of 1/m cut to depth `cutDepth`. */
	const lines = (x0: number, x1: number, y: number, den: number, cutDepth: number, key: string) => {
		const out = [];
		for (let j = 1; j * (U / m) < x1 - x0 - 1e-9; j++) {
			const x = x0 + j * (U / m);
			const whole = ((j * den) % m) === 0; // a line of the bar's own parts
			if (whole) out.push(<polyline key={`${key}${j}`} points={f.pts(v(x, y), v(x, y + H))} stroke="#000" strokeWidth={THIN} />);
			else if (cutDepth > 0) out.push(<polyline key={`${key}${j}`} points={f.pts(v(x, y + H), v(x, y + H - H * cutDepth))} stroke="#000" strokeWidth={VERY_THIN} />);
		}
		return out;
	};

	/** A coloured piece `len` long that slides from (x0, y0) to (x1, y1) as u goes from 0 to 1. */
	const piece = (len: number, from: [number, number], to: [number, number], u: number, fill: string, den: number, key: string) => {
		const x = from[0] + (to[0] - from[0]) * u;
		const y = from[1] + (to[1] - from[1]) * u;
		return (
			<g key={key}>
				<polygon points={box(x, y, x + len, y + H)} fill={fill} />
				{lines(x, x + len, y, den, 1, key)}
				<polygon points={box(x, y, x + len, y + H)} fill="none" stroke="#000" strokeWidth={THICK} />
			</g>
		);
	};

	const reset = (set: (x: number) => void) => (x: number) => {
		set(x);
		void go(0, 0);
	};
	const setDen = (set: (x: number) => void, setNum: (f: (y: number) => number) => void) => (x: number) => {
		set(x);
		setNum((y) => Math.min(y, x));
		void go(0, 0);
	};

	const len1 = (a / b) * U;
	const len2 = (c / d) * U;
	const two = s > m; // the sum is more than a whole

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* The two addends. */}
				<polygon points={box(0, BAR1, len1, BAR1 + H)} fill={TINT.blue20} />
				{lines(0, U, BAR1, b, cut, 'a')}
				<polygon points={box(0, BAR1, U, BAR1 + H)} fill="none" stroke="#000" strokeWidth={THICK} />
				<MathRow f={f} at={v(U + 0.35, BAR1 + H / 2)} anchor="start" items={t >= 1 && b !== m ? [[a, b], ' = ', [p, m]] : [[a, b]]} />

				<polygon points={box(0, BAR2, len2, BAR2 + H)} fill={TINT.orange} />
				{lines(0, U, BAR2, d, cut, 'c')}
				<polygon points={box(0, BAR2, U, BAR2 + H)} fill="none" stroke="#000" strokeWidth={THICK} />
				<MathRow f={f} at={v(U + 0.35, BAR2 + H / 2)} anchor="start" items={t >= 1 && d !== m ? [[c, d], ' = ', [q, m]] : [[c, d]]} />

				{/* The bar where they go: one whole, and a second one dashed if the sum is more than a whole. */}
				<polygon points={box(0, SUM, U, SUM + H)} fill="none" stroke="#000" strokeWidth={THICK} />
				{two && <polyline points={f.pts(v(U, SUM), v(2 * U, SUM), v(2 * U, SUM + H), v(U, SUM + H))} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />}
				{[0, 1, ...(two ? [2] : [])].map((i) => (
					<MathRow key={i} f={f} at={v(i * U, SUM - 0.35)} items={[String(i)]} />
				))}

				{t > 1 && piece(len1, [0, BAR1], [0, SUM], move1, TINT.blue20, b, 'p')}
				{t > 1 && piece(len2, [0, BAR2], [len1, SUM], move2, TINT.orange, d, 'q')}
				{t >= 2 && <MathRow f={f} at={v(len1 + len2, SUM + H + 0.5)} items={[[s, m]]} />}
			</Drawing>

			<Caption>
				{t < 1 ? (
					<>
						Le parti delle due barre hanno grandezze diverse, quindi i pezzi colorati non si possono ancora contare insieme: <Tex>{`\\frac{${a}}{${b}} + \\frac{${c}}{${d}}`}</Tex> non è <Tex>{`\\frac{${a + c}}{${b + d}}`}</Tex>.
					</>
				) : t < 2 ? (
					b === d ? (
						<>Le due frazioni hanno già lo stesso denominatore: le parti hanno la stessa grandezza.</>
					) : (
						<>
							<Tex>{`\\text{MCM}(${b}, ${d}) = ${m}`}</Tex>: ogni parte della prima barra si divide in <Tex>{String(m / b)}</Tex>, ogni parte della seconda in <Tex>{String(m / d)}</Tex>. Ora tutti i pezzi valgono <Tex>{`\\frac{1}{${m}}`}</Tex>.
						</>
					)
				) : (
					<>
						Pezzi da <Tex>{`\\frac{1}{${m}}`}</Tex>: <Tex>{`${p} + ${q} = ${s}`}</Tex>{s > m ? ', più di un intero' : s === m ? ', esattamente un intero' : ''}.
					</>
				)}
			</Caption>
			<Readout>
				<Tex>{`\\frac{${a}}{${b}} + \\frac{${c}}{${d}} = ${t < 1 ? '\\ ?' : `\\frac{${p}}{${m}} + \\frac{${q}}{${m}}${t < 2 ? ' = \\ ?' : ` = \\frac{${s}}{${m}}${g > 1 ? ` = ${m / g === 1 ? s / g : `\\frac{${s / g}}{${m / g}}`}` : ''}`}`}`}</Tex>
			</Readout>
			<ButtonRow>
				{t < 2 ? (
					<Button variant="secondary" size="sm" disabled={running} onClick={() => void go(t < 1 ? 1 : 2)}>
						<ChevronRight className="size-4" aria-hidden="true" />
						{t < 1 ? 'Denominatore comune' : 'Metti i pezzi in fila'}
					</Button>
				) : (
					<Button variant="secondary" size="sm" disabled={running} onClick={() => void go(0, 600)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				)}
			</ButtonRow>
			<Controls>
				<Slider label="Numeratore a" value={a} min={1} max={b} step={1} onChange={reset(setA)} />
				<Slider label="Denominatore b" value={b} min={2} max={6} step={1} onChange={setDen(setB, setA)} />
				<Slider label="Numeratore c" value={c} min={1} max={d} step={1} onChange={reset(setC)} />
				<Slider label="Denominatore d" value={d} min={2} max={6} step={1} onChange={setDen(setD, setC)} />
			</Controls>
		</Figure>
	);
}

'use client';

import { useState } from 'react';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ButtonRow, Caption, Controls, Drawing, Figure, FONT, Label, Readout, Tex, THICK, THIN, TINT, clamp, frame, useTween, v } from './kit';

/**
 * Lesson 7, "Algoritmo di Euclide": from the rectangle a × b the button cuts as many squares of side b as fit, which
 * is the division a = b·q + r; what is left is the rectangle b × r, and the next press cuts that one. The last
 * squares fill what is left exactly: their side divides every side before it, and is MCD(a, b).
 */

const f = frame(-1.05, 7.75, -0.7, 4.7);
const WIDE = 7.6; // the most the rectangle may take, in TikZ cm
const TALL = 4.5;
const COLOURS = [TINT.blue20, TINT.orange, TINT.green, TINT.yellow, TINT.red, TINT.blue, TINT.gray];

/** Below a tenth of a, the squares of side 1 would be too thin to see. */
const minB = (a: number) => Math.max(1, Math.ceil(a / 10));

type Step = { a: number; b: number; q: number; r: number; x: number; y: number; along: 'x' | 'y' };

/** The divisions of Euclid's algorithm, each with where its squares go: from (x, y), along x or along y. */
function euclid(a: number, b: number): Step[] {
	const steps: Step[] = [];
	let [x, y, w, h] = [0, 0, a, b];
	while (w > 0 && h > 0) {
		const along = w >= h ? 'x' : 'y';
		const [big, small] = along === 'x' ? [w, h] : [h, w];
		const q = Math.floor(big / small);
		const r = big - q * small;
		steps.push({ a: big, b: small, q, r, x, y, along });
		if (along === 'x') [x, w] = [x + q * small, r];
		else [y, h] = [y + q * small, r];
	}
	return steps;
}

export default function EuclideRettangolo({ alt }: { alt?: string }) {
	const [a, setA] = useState(84);
	const [b, setB] = useState(66);
	const [t, go, running] = useTween(0, 900);

	const steps = euclid(a, b);
	const n = steps.length;
	const done = Math.floor(t + 1e-6); // divisions finished
	const g = steps[n - 1].b;
	const sc = Math.min(WIDE / a, TALL / b); // TikZ cm per unit
	const dy = (TALL - b * sc) / 2; // the rectangle sits in the middle of the frame's height
	const P = (x: number, y: number) => v(x * sc, y * sc + dy);
	const box = (x0: number, y0: number, x1: number, y1: number) => f.pts(P(x0, y0), P(x1, y0), P(x1, y1), P(x0, y1));

	const setSides = (next: { a?: number; b?: number }) => {
		const A = next.a ?? a;
		setA(A);
		setB(clamp(next.b ?? b, minB(A), A));
		void go(0, 0);
	};
	const next = () => void go(Math.min(n, done + 1), 350 + 120 * Math.min(steps[done]?.q ?? 1, 12));

	// What is left to cut after the finished divisions.
	const left = done < n ? steps[done] : null;
	const rest = left && (left.along === 'x' ? [left.x, left.y, left.x + left.a, left.y + left.b] : [left.x, left.y, left.x + left.b, left.y + left.a]);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{steps.map((s, k) =>
					Array.from({ length: s.q }, (_, i) => {
						// The squares of a division appear one after the other while t goes from k to k + 1.
						const shown = clamp((t - k) * s.q - i, 0, 1);
						if (shown <= 0) return null;
						const [x0, y0] = s.along === 'x' ? [s.x + i * s.b, s.y] : [s.x, s.y + i * s.b];
						const side = s.b * sc;
						const c = f.px(P(x0 + s.b / 2, y0 + s.b / 2));
						const size = Math.min(14, side * 12);
						return (
							<g key={`${k}-${i}`} opacity={shown}>
								<polygon points={box(x0, y0, x0 + s.b, y0 + s.b)} fill={COLOURS[k % COLOURS.length]} stroke="#000" strokeWidth={THIN} />
								{i === 0 && side > 0.55 && (
									<text x={c.x} y={c.y} dy="0.35em" textAnchor="middle" fontFamily={FONT} fontSize={size} pointerEvents="none">
										{s.b}
									</text>
								)}
							</g>
						);
					})
				)}
				{rest && t === done && <polygon points={box(rest[0], rest[1], rest[2], rest[3])} fill="none" stroke="#000" strokeWidth={THICK} />}
				<polygon points={box(0, 0, a, b)} fill="none" stroke="#000" strokeWidth={THICK} />
				<Label f={f} at={P(a / 2, 0)} dir={v(0, -1)} upright>{String(a)}</Label>
				<Label f={f} at={P(0, b / 2)} dir={v(-1, 0)} upright>{String(b)}</Label>
			</Drawing>

			<Caption>
				{done === 0 ? (
					<>
						Premi &laquo;Passo successivo&raquo;: dal rettangolo <Tex>{`${a} \\times ${b}`}</Tex> si tagliano quanti più quadrati di lato <Tex>{String(b)}</Tex> ci stanno.
					</>
				) : done < n ? (
					<>
						Tagliati <Tex>{String(steps[done - 1].q)}</Tex> quadrati di lato <Tex>{String(steps[done - 1].b)}</Tex>: resta il rettangolo <Tex>{`${steps[done - 1].b} \\times ${steps[done - 1].r}`}</Tex>, contornato, e si ripete con lui.
					</>
				) : (
					<>
						Resto <Tex>0</Tex>: gli ultimi quadrati riempiono esattamente ciò che restava. Il loro lato sta un numero intero di volte in tutti i lati, anche in <Tex>{String(a)}</Tex> e <Tex>{String(b)}</Tex>: <Tex>{`\\text{MCD}(${a}, ${b}) = ${g}`}</Tex>.
					</>
				)}
			</Caption>
			<Readout>
				{done > 0 && <Tex>{`\\begin{aligned} ${steps.slice(0, done).map((s) => `${s.a} &= ${s.b} \\cdot ${s.q} + ${s.r}`).join(' \\\\ ')} \\end{aligned}`}</Tex>}
			</Readout>
			<ButtonRow>
				<Button variant="secondary" size="sm" disabled={running || done >= n} onClick={next}>
					<ChevronRight className="size-4" aria-hidden="true" />
					Passo successivo
				</Button>
				<Button variant="secondary" size="sm" disabled={running || t === 0} onClick={() => void go(0, 0)}>
					<RotateCcw className="size-4" aria-hidden="true" />
					Ricomincia
				</Button>
			</ButtonRow>
			<Controls>
				<Slider label="Lato maggiore a" value={a} min={2} max={100} step={1} onChange={(x) => setSides({ a: x })} />
				<Slider label="Lato minore b" value={b} min={minB(a)} max={a} step={1} onChange={(x) => setSides({ b: x })} />
			</Controls>
		</Figure>
	);
}

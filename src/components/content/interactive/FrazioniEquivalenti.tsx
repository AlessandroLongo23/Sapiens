'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Caption, Controls, ButtonRow, DASH, Drawing, Figure, INK, Readout, Tex, THICK, THIN, TINT, VERY_THIN, frame, v } from './kit';
import { MathRow } from './numeri';

/**
 * Lesson 23, "Frazioni equivalenti" and "Proprietà invariantiva": the bar a/b of the TikZ figure over a second bar where
 * every part is cut into k pieces, so a/b becomes ak/bk and the coloured part does not move; under them, the number
 * line with the point of the fraction, which does not move either. Switched to "aggiungi k", the second bar shows
 * (a + k)/(b + k), the mistake of the lesson's warning: its coloured part and its point move away.
 */

const W = 7; // the whole, in TikZ cm
const f = frame(-1.35, 7.35, -0.85, 3.75);
const TOP = { y0: 2.55, y1: 3.35 };
const LOW = { y0: 1.35, y1: 2.15 };
const AXIS = 0.3;

export default function FrazioniEquivalenti({ alt }: { alt?: string }) {
	const [a, setA] = useState(2);
	const [b, setB] = useState(3);
	const [k, setK] = useState(2);
	const [add, setAdd] = useState(false);

	// The second fraction, and whether it is the same number: the cross products (lesson 23, "Il controllo in croce").
	const n = add ? a + k : a * k;
	const d = add ? b + k : b * k;
	const same = a * d === b * n;
	const x = (t: number) => t * W;

	const box = (x0: number, y0: number, x1: number, y1: number) => f.pts(v(x0, y0), v(x1, y0), v(x1, y1), v(x0, y1));
	/** A bar of `den` parts with `num` coloured; with `fine` > 1 every `fine`th line is a line of the original parts. */
	const bar = (y0: number, y1: number, num: number, den: number, fill: string, fine = 1) => (
		<g>
			<polygon points={box(0, y0, x(num / den), y1)} fill={fill} />
			{Array.from({ length: den - 1 }, (_, i) => {
				const at = x((i + 1) / den);
				const major = (i + 1) % fine === 0;
				return <polyline key={i} points={f.pts(v(at, y0), v(at, y1))} stroke="#000" strokeWidth={major ? THIN : VERY_THIN} />;
			})}
			<polygon points={box(0, y0, W, y1)} fill="none" stroke="#000" strokeWidth={THICK} />
		</g>
	);

	const setDen = (x: number) => {
		setB(x);
		setA((y) => Math.min(y, x));
	};

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{bar(TOP.y0, TOP.y1, a, b, TINT.blue20)}
				{bar(LOW.y0, LOW.y1, n, d, same ? TINT.blue20 : TINT.orange, add ? 1 : k)}
				<MathRow f={f} at={v(-0.25, (TOP.y0 + TOP.y1) / 2)} anchor="end" items={[[a, b]]} />
				<MathRow f={f} at={v(-0.25, (LOW.y0 + LOW.y1) / 2)} anchor="end" items={[[n, d]]} />

				{/* Where a/b ends, down to the number line, dashed as in the TikZ figure. */}
				<polyline points={f.pts(v(x(a / b), AXIS - 0.15), v(x(a / b), TOP.y1 + 0.2))} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />

				{/* The number line from 0 to 1, with the ticks of the bth parts. */}
				<polyline points={f.pts(v(-0.3, AXIS), v(W + 0.3, AXIS))} stroke="#000" strokeWidth={THIN} />
				{Array.from({ length: b + 1 }, (_, i) => {
					const h = i === 0 || i === b ? 0.18 : 0.08;
					return <polyline key={i} points={f.pts(v(x(i / b), AXIS - h), v(x(i / b), AXIS + h))} stroke="#000" strokeWidth={THIN} />;
				})}
				<MathRow f={f} at={v(0, AXIS - 0.42)} items={['0']} />
				<MathRow f={f} at={v(W, AXIS - 0.42)} items={['1']} />
				<circle cx={f.px(v(x(a / b), AXIS)).x} cy={f.px(v(0, AXIS)).y} r={3} fill="#000" />
				{!same && <circle cx={f.px(v(x(n / d), AXIS)).x} cy={f.px(v(0, AXIS)).y} r={3} fill={INK.orange} stroke="#000" strokeWidth={THIN} />}
				<MathRow
					f={f}
					at={v(Math.min(Math.max(x(a / b), 0.6), W - 0.6), AXIS - 0.62)}
					items={same ? [[a, b], ' = ', [n, d]] : [[a, b]]}
					size={13}
				/>
				{!same && <MathRow f={f} at={v(Math.min(Math.max(x(n / d), 0.4), W - 0.4), AXIS + 0.5)} items={[[n, d]]} size={13} color="#000" />}
			</Drawing>

			<Caption>
				{add ? (
					same ? (
						<>Qui aggiungere <Tex>{String(k)}</Tex> dà ancora lo stesso numero perché <Tex>{`\\frac{${a}}{${b}} = 1`}</Tex>: succede solo quando il numeratore è uguale al denominatore.</>
					) : (
						<>Aggiungendo <Tex>{String(k)}</Tex> sopra e sotto la parte colorata cambia e il punto si sposta: <Tex>{`\\frac{${n}}{${d}}`}</Tex> non è equivalente a <Tex>{`\\frac{${a}}{${b}}`}</Tex>.</>
					)
				) : k === 1 ? (
					<>Sposta il cursore <Tex>k</Tex>: ogni parte della barra sotto si divide in <Tex>k</Tex> pezzi.</>
				) : (
					<>Ogni parte è divisa in <Tex>{String(k)}</Tex> pezzi: i pezzi colorati sono <Tex>{`${a} \\cdot ${k} = ${n}`}</Tex> su <Tex>{`${b} \\cdot ${k} = ${d}`}</Tex>, ma la parte colorata e il punto sulla retta non si spostano.</>
				)}
			</Caption>
			<Readout>
				<span>
					Controllo in croce: <Tex>{`${a} \\cdot ${d} = ${a * d}`}</Tex> e <Tex>{`${b} \\cdot ${n} = ${b * n}`}</Tex>, {same ? 'uguali: sono equivalenti' : 'diversi: non sono equivalenti'}
				</span>
			</Readout>
			<ButtonRow>
				<Button variant={add ? 'secondary' : 'primary'} size="sm" aria-pressed={!add} onClick={() => setAdd(false)}>
					Moltiplica per k
				</Button>
				<Button variant={add ? 'primary' : 'secondary'} size="sm" aria-pressed={add} onClick={() => setAdd(true)}>
					Aggiungi k
				</Button>
			</ButtonRow>
			<Controls>
				<Slider label="Numeratore a" value={a} min={0} max={b} step={1} onChange={setA} />
				<Slider label="Denominatore b" value={b} min={1} max={10} step={1} onChange={setDen} />
				<Slider label="k" value={k} min={1} max={5} step={1} onChange={setK} />
			</Controls>
		</Figure>
	);
}

'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, TINT, THICK, THIN, DASH, FONT_SIZE } from '../kit';
import { Arrow, Ground, VecLabel, QTY } from '../fisica';

/**
 * Lesson 80 (La quantità di moto), "La quantità di moto di un sistema": two carts on a rail, each with its mass (1 to
 * 6 kg) and its velocity along the rail (−5 to 5 m/s, positive to the right). Above each cart the arrow of its
 * velocity (0,25 cm per m/s); under the rail the arrows of the two momenta and, on a third line, of their sum, all at
 * 0,06 cm per kg·m/s and all starting from the same dashed line, so that the sum can be read as p1 followed by p2. The
 * starting values are a cart of 2 kg at 3 m/s and one of 6 kg at −0,5 m/s; with the second at −1 m/s the total is zero,
 * as the lesson says.
 */

const KV = 0.25; // cm per m/s
const KP = 0.06; // cm per kg·m/s
const X1 = -2.3, X2 = 2.3;
const f = frame(-5.4, 4.05, -3.05, 1.75);
const fx = (x: number, d: number) => (Math.abs(x) < 0.5 * 10 ** -d ? 0 : x).toFixed(d).replace('.', ',').replace('-', '−');
const tex = (x: number, d: number) => (Math.abs(x) < 0.5 * 10 ** -d ? 0 : x).toFixed(d).replace('.', '{,}');

function Cart({ x, m, name }: { x: number; m: number; name: string }) {
	const w = 0.7 + 0.13 * m, h = 0.38 + 0.05 * m;
	const a = f.px(v(x - w / 2, 0.14 + h)), b = f.px(v(x + w / 2, 0.14));
	const wheel = (cx: number) => {
		const c = f.px(v(cx, 0.12));
		return <circle cx={c.x} cy={c.y} r={0.11 * (f.W / (f.x1 - f.x0))} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />;
	};
	return (
		<g pointerEvents="none">
			<rect x={a.x} y={a.y} width={b.x - a.x} height={b.y - a.y} fill={TINT.blue} stroke="#000" strokeWidth={THICK} />
			{wheel(x - w / 2 + 0.2)}
			{wheel(x + w / 2 - 0.2)}
			<Label f={f} at={v(x, 0.14 + h / 2)} upright size={FONT_SIZE * 0.8}>
				{name}
			</Label>
		</g>
	);
}

export default function QuantitaMotoCarrelli({ alt }: { alt?: string }) {
	const [m1, setM1] = useState(2);
	const [v1, setV1] = useState(3);
	const [m2, setM2] = useState(6);
	const [v2, setV2] = useState(-0.5);
	const p1 = m1 * v1, p2 = m2 * v2, pt = p1 + p2;
	const start = m1 === 2 && v1 === 3 && m2 === 6 && v2 === -0.5;
	const top = (m: number) => 0.14 + 0.38 + 0.05 * m;
	const side = (x: number) => (x > 0 ? 'verso destra' : 'verso sinistra');

	let caption: string;
	if (Math.abs(pt) < 1e-9 && (p1 !== 0 || p2 !== 0)) caption = 'Le due quantità di moto sono uguali e opposte: la quantità di moto totale è zero, anche se i due carrelli si muovono.';
	else if (p1 === 0 && p2 === 0) caption = 'I due carrelli sono fermi: tutte le quantità di moto sono zero.';
	else if (p1 * p2 < 0) caption = `I carrelli vanno in versi opposti e le quantità di moto in parte si cancellano: la totale è ${fx(Math.abs(pt), 1)} kg·m/s ${side(pt)}.`;
	else caption = `Le quantità di moto hanno lo stesso verso e i moduli si sommano: la totale è ${fx(Math.abs(pt), 1)} kg·m/s ${side(pt)}.`;

	const row = (y: number, x0: number, p: number, name: string, sub: string, color: string) => (
		<>
			{Math.abs(p) > 1e-9 && <Arrow f={f} from={v(x0, y)} to={v(x0 + p * KP, y)} color={color} />}
			{Math.abs(p) <= 1e-9 && <circle cx={f.px(v(x0, y)).x} cy={f.px(v(x0, y)).y} r={2.4} fill={color} />}
			<VecLabel f={f} at={v(-5.2, y)} dir={v(1, 0)} name={name} sub={sub} color={color} />
		</>
	);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(-4.3, 0)} to={v(3.9, 0)} />
				<Cart x={X1} m={m1} name={`${m1} kg`} />
				<Cart x={X2} m={m2} name={`${m2} kg`} />
				{v1 !== 0 && <Arrow f={f} from={v(X1, top(m1) + 0.3)} to={v(X1 + v1 * KV, top(m1) + 0.3)} color={QTY.velocita} />}
				{v2 !== 0 && <Arrow f={f} from={v(X2, top(m2) + 0.3)} to={v(X2 + v2 * KV, top(m2) + 0.3)} color={QTY.velocita} />}
				<VecLabel f={f} at={v(X1, top(m1) + 0.42)} dir={v(0, 1)} name="v" sub="1" color={QTY.velocita} />
				<VecLabel f={f} at={v(X2, top(m2) + 0.42)} dir={v(0, 1)} name="v" sub="2" color={QTY.velocita} />

				{/* the momenta, from a common line: p1, then p2 from its tip, and their sum */}
				<path d={f.path([v(0, -0.6), v(0, -2.85)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.5} />
				{row(-1.0, 0, p1, 'p', '1', QTY.vettore)}
				{row(-1.65, p1 * KP, p2, 'p', '2', QTY.vettore)}
				{row(-2.45, 0, pt, 'p', 'tot', QTY.risultante)}
				{Math.abs(p1) > 1e-9 && <path d={f.path([v(p1 * KP, -1.0), v(p1 * KP, -1.65)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.5} />}
				{Math.abs(pt) > 1e-9 && <path d={f.path([v(pt * KP, -1.65), v(pt * KP, -2.45)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.5} />}
			</Drawing>

			<Readout>
				<Tex>{`p_1 = ${tex(p1, 1)}\\,\\text{kg}\\cdot\\text{m/s}`}</Tex>
				<Tex>{`p_2 = ${tex(p2, 1)}\\,\\text{kg}\\cdot\\text{m/s}`}</Tex>
				<Tex>{`p_{tot} = ${tex(pt, 1)}\\,\\text{kg}\\cdot\\text{m/s}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Massa 1" unit="kg" value={m1} min={1} max={6} step={1} onChange={(x) => setM1(Math.round(x))} />
				<Slider label="Velocità 1 (m/s)" value={v1} min={-5} max={5} step={0.5} onChange={(x) => setV1(Math.round(x * 2) / 2)} />
				<Slider label="Massa 2" unit="kg" value={m2} min={1} max={6} step={1} onChange={(x) => setM2(Math.round(x))} />
				<Slider label="Velocità 2 (m/s)" value={v2} min={-5} max={5} step={0.5} onChange={(x) => setV2(Math.round(x * 2) / 2)} />
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={start} onClick={() => { setM1(2); setV1(3); setM2(6); setV2(-0.5); }}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Valori di partenza
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}

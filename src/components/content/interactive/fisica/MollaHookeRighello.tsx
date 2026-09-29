'use client';

import { useEffect, useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Label, frame, v, num, texNum, useTween, TINT, THICK, THIN, FONT, DASH } from '../kit';
import { Ground, Spring } from '../fisica';

/**
 * Lesson 18 (La forza elastica e la legge di Hooke), "Una massa appesa alla molla": a spring hangs from the ceiling
 * beside a ruler in centimetres, with a body of mass m at its end. The student sets m (0 to 300 g) and the elastic
 * constant k (20 to 100 N/m); the spring stretches by Δl = mg/k (g = 9,8 N/kg), and its end is read on the ruler.
 * The dashed line marks where the spring ends at rest (l₀ = 8 cm). Drawn at a quarter of real size: 1 cm of ruler
 * is 0,25 cm of drawing, so the longest spring (8 + 14,7 cm) fits the 25 cm ruler.
 */

const G = 9.8;
const L0 = 8; // cm
const S = 0.25; // drawing cm per real cm
const RULER = 25; // cm
const f = frame(-1.35, 1.95, -RULER * S - 0.75, 0.5);
const BLOCK = { w: 0.7, h: 0.5 };

export default function MollaHookeRighello({ alt }: { alt?: string }) {
	const [grams, setGrams] = useState(200);
	const [k, setK] = useState(50);
	const P = (grams / 1000) * G;
	const dl = (P / k) * 100; // cm
	const [shown, go] = useTween(dl, 450);
	useEffect(() => {
		void go(dl);
	}, [dl, go]);

	const end = -(L0 + shown) * S;
	const ticks: string[] = [];
	for (let c = 0; c <= RULER; c++) ticks.push(f.path([v(0.55, -c * S), v(0.55 + (c % 5 === 0 ? 0.25 : 0.14), -c * S)]));
	const labels = [];
	for (let c = 0; c <= RULER; c += 5) {
		const p = f.px(v(0.88, -c * S));
		labels.push(
			<text key={c} x={p.x} y={p.y} dy="0.35em" fontSize={10.5} fontFamily={FONT}>
				{c}
			</text>
		);
	}
	const unit = f.px(v(1.3, -RULER * S));

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(0.55, 0)} to={v(-1.1, 0)} />
				{/* the ruler, its zero at the ceiling */}
				<path d={f.path([v(0.55, 0), v(1.25, 0), v(1.25, -RULER * S), v(0.55, -RULER * S)], true)} fill={TINT.yellow} stroke="#000" strokeWidth={THIN} />
				<path d={ticks.join(' ')} stroke="#000" strokeWidth={THIN} fill="none" />
				{labels}
				<text x={unit.x} y={unit.y} dy="1.1em" textAnchor="middle" fontSize={10.5} fontFamily={FONT}>
					cm
				</text>
				{/* where the spring ends at rest */}
				<path d={f.path([v(-0.9, -L0 * S), v(0.55, -L0 * S)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<Label f={f} at={v(-1.4, -L0 * S)} dir={v(0.7, 0.7)} upright size={10.5}>
					a riposo
				</Label>
				<Spring f={f} from={v(0, 0)} to={v(0, end)} coils={14} />
				<circle cx={f.px(v(0, end)).x} cy={f.px(v(0, end)).y} r={2.2} fill="#000" />
				<path d={f.path([v(0, end), v(0.55, end)])} stroke="#000" strokeWidth={THIN} fill="none" />
				{grams > 0 && (
					<>
						<path d={f.path([v(-BLOCK.w / 2, end), v(BLOCK.w / 2, end), v(BLOCK.w / 2, end - BLOCK.h), v(-BLOCK.w / 2, end - BLOCK.h)], true)} fill={TINT.blue} stroke="#000" strokeWidth={THICK} />
						<Label f={f} at={v(0, end - BLOCK.h / 2)}>
							m
						</Label>
					</>
				)}
			</Drawing>

			<Readout>
				<span>
					<Tex>{`P = m \\cdot g = ${texNum(P, 2)}`}</Tex> N
				</span>
				<span>
					<Tex>{`\\Delta l = P / k = ${texNum(dl, 1)}`}</Tex> cm
				</span>
				<span>
					<Tex>{`l = l_0 + \\Delta l = ${texNum(L0 + dl, 1)}`}</Tex> cm
				</span>
			</Readout>
			<Caption>
				{grams === 0
					? 'Senza niente appeso la molla è lunga 8 cm, la sua lunghezza a riposo. Appendi una massa.'
					: `Il peso di ${num(P, 2)} N allunga la molla di ${num(dl, 1)} cm: la sua fine scende da 8 cm a ${num(L0 + dl, 1)} cm sul righello. Con una molla più rigida (k più grande) lo stesso peso la allunga di meno.`}
			</Caption>
			<Controls>
				<Slider label="Massa m (g)" value={grams} min={0} max={300} step={10} onChange={setGrams} />
				<Slider label="Costante k (N/m)" value={k} min={20} max={100} step={5} onChange={setK} />
			</Controls>
		</Figure>
	);
}

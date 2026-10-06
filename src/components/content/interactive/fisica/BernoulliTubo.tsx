'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Label, frame, v, THIN, THICK, DASH, TINT, type V } from '../kit';
import { Arrow, VecLabel, QTY } from '../fisica';
import { LIQUID, Liquid, Vessel } from './liquidi';

/**
 * Lesson 99, "L'equazione di Bernoulli", example 3: water enters a pipe 4,0 cm across at 3,00 · 10⁵ Pa and climbs to
 * a stretch h2 higher (0 to 8 m) and D2 across (2 to 4 cm). Beside the pipe two stacked columns, one per section,
 * show the three terms of Bernoulli's equation in scale (1 cm for 10⁵ Pa): the pressure, ½ d v² and d g h. The two
 * columns are always as tall as each other; what the pressure loses the other two gain. It starts on the data of
 * example 3 (1,5 m/s, 5 m, 2 cm: 6,0 m/s and 2,34 · 10⁵ Pa).
 */

const D = 1000; // kg/m³
const G = 9.8;
const P1 = 300000; // Pa
const D1 = 4; // cm
const CM = 0.225; // drawing centimetres per centimetre of diameter
const M = 0.3; // drawing centimetres per metre of height
const BAR = 1 / 100000; // drawing centimetres per pascal
const Y1 = 0.5; // the axis of the lower stretch
const X = { a: 2, b: 3.6, end: 5.4, bar1: 6.4, bar2: 8.0, w: 0.75 };

const f = frame(-0.3, 9.9, -0.75, 3.85);

const fix = (x: number, d: number) => x.toFixed(d).replace('.', '{,}');
const FILL = { p: TINT.blue, k: TINT.orange, u: TINT.green };

function Column({ x, parts }: { x: number; parts: { value: number; fill: string }[] }) {
	const rects = parts.reduce<{ y: number; h: number; fill: string }[]>((acc, p) => [...acc, { y: acc.length ? acc[acc.length - 1].y + acc[acc.length - 1].h : 0, h: p.value * BAR, fill: p.fill }], []);
	return (
		<g>
			{rects.map((r, i) => {
				if (r.h < 0.004) return null;
				const a = f.px(v(x, r.y + r.h)), b = f.px(v(x + X.w, r.y));
				return <rect key={i} x={a.x} y={a.y} width={b.x - a.x} height={b.y - a.y} fill={r.fill} stroke="#000" strokeWidth={THIN} />;
			})}
		</g>
	);
}

export default function BernoulliTubo({ alt }: { alt?: string }) {
	const [v1, setV1] = useState(1.5);
	const [h2, setH2] = useState(5);
	const [d2, setD2] = useState(2);

	const v2 = v1 * (D1 / d2) ** 2;
	const k1 = 0.5 * D * v1 * v1, k2 = 0.5 * D * v2 * v2;
	const u2 = D * G * h2;
	const total = P1 + k1;
	const p2 = total - k2 - u2;

	const a = (D1 * CM) / 2, b = (d2 * CM) / 2;
	const y2 = Y1 + h2 * M;
	const lower: V[] = [v(0, Y1 - a), v(X.a, Y1 - a), v(X.b, y2 - b), v(X.end, y2 - b)];
	const upper: V[] = [v(0, Y1 + a), v(X.a, Y1 + a), v(X.b, y2 + b), v(X.end, y2 + b)];
	const top = total * BAR;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Liquid f={f} pts={[...upper, ...[...lower].reverse()]} fill={LIQUID.acqua} />
				<Vessel f={f} paths={[lower, upper]} />
				<Arrow f={f} from={v(0.5, Y1)} to={v(0.5 + v1 * 0.19, Y1)} color={QTY.velocita} />
				{/* one scale for the two speeds, 0,19 cm per m/s, with no ceiling: a faster stream has a longer arrow */}
				<Arrow f={f} from={v(X.b + 0.15, y2)} to={v(X.b + 0.15 + v2 * 0.19, y2)} color={QTY.velocita} />
				<Label f={f} at={v(1.0, Y1 - a - 0.05)} dir={v(0, -1)} upright size={14}>
					1
				</Label>
				<Label f={f} at={v(4.5, y2 + b + 0.05)} dir={v(0, 1)} upright size={14}>
					2
				</Label>
				{h2 > 0 && (
					<>
						<path d={f.path([v(X.a, Y1), v(X.end + 0.45, Y1)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.55} />
						<path d={f.path([v(X.end, y2), v(X.end + 0.45, y2)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.55} />
						<Arrow f={f} from={v(X.end + 0.3, (Y1 + y2) / 2)} to={v(X.end + 0.3, y2)} weight="thin" />
						<Arrow f={f} from={v(X.end + 0.3, (Y1 + y2) / 2)} to={v(X.end + 0.3, Y1)} weight="thin" />
						<VecLabel f={f} at={v(X.end + 0.3, (Y1 + y2) / 2)} dir={v(-1, 0)} name="h" sub="2" bare size={13} />
					</>
				)}
				{/* the two columns */}
				<path d={f.path([v(X.bar1 - 0.25, 0), v(X.bar2 + X.w + 0.25, 0)])} stroke="#000" strokeWidth={THICK} fill="none" />
				<Column x={X.bar1} parts={[{ value: P1, fill: FILL.p }, { value: k1, fill: FILL.k }]} />
				<Column x={X.bar2} parts={[{ value: Math.max(p2, 0), fill: FILL.p }, { value: k2, fill: FILL.k }, { value: u2, fill: FILL.u }]} />
				<path d={f.path([v(X.bar1 - 0.25, top), v(X.bar2 + X.w + 0.25, top)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<Label f={f} at={v(X.bar1 + X.w / 2, -0.02)} dir={v(0, -1)} upright size={14}>
					1
				</Label>
				<Label f={f} at={v(X.bar2 + X.w / 2, -0.02)} dir={v(0, -1)} upright size={14}>
					2
				</Label>
				<VecLabel f={f} at={v(X.bar1 + X.w / 2, 1.5)} name="p" sub="1" bare />
				<VecLabel f={f} at={v(X.bar2 + X.w / 2, Math.max(p2 * BAR, 0.5) / 2)} name="p" sub="2" bare />
			</Drawing>

			<Readout>
				<span>
					<Tex>{`v_2 = ${fix(v2, 1)}\\,\\text{m/s}`}</Tex>
				</span>
				<span>
					<span className="mr-1 inline-block size-2.5 border border-black/60 align-baseline" style={{ background: FILL.k }} />
					<Tex>{`\\tfrac{1}{2} d\\,v_2^2 = ${fix(k2 / 1e5, 2)}`}</Tex>
				</span>
				<span>
					<span className="mr-1 inline-block size-2.5 border border-black/60 align-baseline" style={{ background: FILL.u }} />
					<Tex>{`d\\,g\\,h_2 = ${fix(u2 / 1e5, 2)}`}</Tex>
				</span>
				<span className="font-medium">
					<span className="mr-1 inline-block size-2.5 border border-black/60 align-baseline" style={{ background: FILL.p }} />
					<Tex>{`p_2 = ${fix(p2 / 1e5, 2)} \\cdot 10^5\\,\\text{Pa}`}</Tex>
				</span>
			</Readout>
			<Caption>
				L’acqua entra nella sezione 1 (diametro 4 cm) a <Tex>{'3{,}00 \\cdot 10^5\\,\\text{Pa}'}</Tex>. I termini sono in unità di <Tex>{'10^5\\,\\text{Pa}'}</Tex>: {h2 === 0 && d2 === D1 ? 'senza salita e senza strozzatura la pressione non cambia.' : u2 >= k2 - k1 ? 'qui costa più pressione la salita.' : 'qui costa più pressione l’accelerazione.'}
			</Caption>

			<Controls>
				<Slider label="Velocità v₁ (m/s)" value={v1} min={0.5} max={2} step={0.5} onChange={setV1} />
				<Slider label="Dislivello h₂ (m)" value={h2} min={0} max={8} step={1} onChange={setH2} />
				<Slider label="Diametro D₂ (cm)" value={d2} min={2} max={4} step={0.5} onChange={setD2} />
			</Controls>
		</Figure>
	);
}

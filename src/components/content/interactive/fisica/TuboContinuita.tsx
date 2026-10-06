'use client';

import { useMemo, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, useFrameLoop, useReducedMotion, texNum, THIN, DASH, type V } from '../kit';
import { Arrow, VecLabel, QTY } from '../fisica';
import { LIQUID, Liquid, Vessel } from './liquidi';

/**
 * Lesson 98, "La portata e l'equazione di continuità": a horizontal pipe whose first stretch is 4 cm across and whose
 * second stretch the student narrows from 4 cm down to 1 cm, with water entering at v1 (0,2 to 0,6 m/s). Marked drops
 * move with the local speed, v1·(D1/D)², so they crawl in the wide stretch and rush in the narrow one; the two
 * velocity arrows are in scale (0,45 cm per m/s). The readout gives the two sections, the two speeds and the flow
 * rate, which is the same in both stretches. Halving the diameter makes the speed four times as large.
 */

const D1 = 4; // cm
const CM = 0.45; // drawing centimetres per real centimetre of diameter
const H1 = (D1 * CM) / 2;
const X_WIDE = 3; // the wide stretch ends
const X_NARROW = 4.2; // the narrow stretch begins
const X_END = 8.8;
const ARROW = 0.45; // drawing centimetres per m/s
const PACE = 1; // drawing centimetres per second for 1 m/s
const N_DROPS = 9;
const LANES = [-0.55, 0, 0.55];

const Y_ARROW = H1 + 0.3; // the velocity arrows run above the pipe

const f = frame(-0.25, X_END + 0.25, -H1 - 0.75, H1 + 0.95);

/** A number with exactly d decimals and the decimal comma, for KaTeX. */
const fix = (x: number, d: number) => x.toFixed(d).replace('.', '{,}');

/** Half the height of the pipe at x, for a narrow stretch of half height h2. */
const half = (x: number, h2: number) => (x <= X_WIDE ? H1 : x >= X_NARROW ? h2 : H1 + ((h2 - H1) * (x - X_WIDE)) / (X_NARROW - X_WIDE));

export default function TuboContinuita({ alt }: { alt?: string }) {
	const [d2, setD2] = useState(2);
	const [v1, setV1] = useState(0.5);
	const [phase, setPhase] = useState(0);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();

	const h2 = (d2 * CM) / 2;
	/** x → the volume of pipe before x, in units where the wide stretch has section 1: a drop advances in it at a constant rate. */
	const table = useMemo(() => {
		const xs: number[] = [], us: number[] = [];
		const n = 400;
		let u = 0;
		for (let i = 0; i <= n; i++) {
			const x = (X_END * i) / n;
			if (i > 0) {
				const xm = x - X_END / n / 2;
				u += (half(xm, h2) / H1) ** 2 * (X_END / n);
			}
			xs.push(x);
			us.push(u);
		}
		return { xs, us, total: u };
	}, [h2]);
	const xOf = (u: number) => {
		const { xs, us } = table;
		let lo = 0, hi = us.length - 1;
		while (hi - lo > 1) {
			const m = (lo + hi) >> 1;
			if (us[m] <= u) lo = m;
			else hi = m;
		}
		const t = us[hi] > us[lo] ? (u - us[lo]) / (us[hi] - us[lo]) : 0;
		return xs[lo] + (xs[hi] - xs[lo]) * t;
	};

	useFrameLoop(playing && !reduced, (dt) => setPhase((p) => (p + v1 * PACE * dt) % 1000));

	const v2 = v1 * (D1 / d2) ** 2;
	const s1 = (Math.PI * D1 ** 2) / 4, s2 = (Math.PI * d2 ** 2) / 4; // cm²
	const q = (s1 * v1) / 10; // cm² · m/s = 10⁻⁴ m³/s = 0,1 L/s

	const top: V[] = [v(0, H1), v(X_WIDE, H1), v(X_NARROW, h2), v(X_END, h2)];
	const bottom: V[] = [v(0, -H1), v(X_WIDE, -H1), v(X_NARROW, -h2), v(X_END, -h2)];
	const drops: V[] = [];
	for (let i = 0; i < N_DROPS; i++) {
		const u = (phase + (i * table.total) / N_DROPS) % table.total;
		const x = xOf(u);
		for (const lane of LANES) drops.push(v(x, lane * half(x, h2)));
	}

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Liquid f={f} pts={[...top, ...[...bottom].reverse()]} fill={LIQUID.acqua} />
				<Vessel f={f} paths={[top, bottom]} />
				{drops.map((p, i) => {
					const c = f.px(p);
					return <circle key={i} cx={c.x} cy={c.y} r={2.4} fill="#3a7ca5" opacity={0.75} />;
				})}
				{/* the two diameters, with their dimension lines */}
				<path d={f.path([v(0.6, -H1), v(0.6, H1)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.6} />
				<path d={f.path([v(X_NARROW + 0.5, -h2), v(X_NARROW + 0.5, h2)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.6} />
				<Label f={f} at={v(0.6, -H1 - 0.05)} dir={v(0, -1)} upright size={13}>
					4 cm
				</Label>
				<Label f={f} at={v(X_NARROW + 0.5, -h2 - 0.05)} dir={v(0, -1)} upright size={13}>
					{texNum(d2, 1).replace('{,}', ',')} cm
				</Label>
				{/* the two velocities above the pipe, in scale */}
				<Arrow f={f} from={v(0.6, Y_ARROW)} to={v(0.6 + v1 * ARROW, Y_ARROW)} color={QTY.velocita} />
				<VecLabel f={f} at={v(0.6 + Math.max(v1 * ARROW, 0.5) / 2, Y_ARROW)} dir={v(0, 1)} name="v" sub="1" color={QTY.velocita} />
				<Arrow f={f} from={v(X_NARROW + 0.5, Y_ARROW)} to={v(X_NARROW + 0.5 + v2 * ARROW, Y_ARROW)} color={QTY.velocita} />
				<VecLabel f={f} at={v(X_NARROW + 0.5 + Math.max(v2 * ARROW, 0.5) / 2, Y_ARROW)} dir={v(0, 1)} name="v" sub="2" color={QTY.velocita} />
			</Drawing>

			<Readout>
				<span>
					<Tex>{`S_1 = ${fix(s1, 1)}\\,\\text{cm}^2`}</Tex>
				</span>
				<span>
					<Tex>{`S_2 = ${fix(s2, s2 < 9.95 ? 2 : 1)}\\,\\text{cm}^2`}</Tex>
				</span>
				<span className="font-medium">
					<Tex>{`v_2 = ${fix(v2, v2 < 9.95 ? 2 : 1)}\\,\\text{m/s}`}</Tex>
				</span>
				<span>
					<Tex>{`q = S_1 v_1 = S_2 v_2 = ${fix(q, 2)}\\,\\text{L/s}`}</Tex>
				</span>
			</Readout>
			<Caption>
				{d2 === D1 ? (
					'Il tubo ha la stessa sezione dappertutto, e l’acqua la stessa velocità. Stringi il secondo tratto.'
				) : (
					<>
						Nel tratto stretto la sezione è <Tex>{texNum(s1 / s2, 1)}</Tex> volte più piccola e la velocità <Tex>{texNum(s1 / s2, 1)}</Tex> volte più grande: passa la stessa acqua ogni secondo.
					</>
				)}
			</Caption>

			<Controls>
				<Slider label="Tratto stretto (cm)" value={d2} min={1} max={4} step={0.5} onChange={setD2} />
				<Slider label="Velocità v₁ (m/s)" value={v1} min={0.2} max={0.6} step={0.1} onChange={setV1} />
				{!reduced && (
					<ButtonRow>
						<Button variant="secondary" size="sm" onClick={() => setPlaying((p) => !p)}>
							{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
							{playing ? 'Ferma' : 'Avvia'}
						</Button>
					</ButtonRow>
				)}
			</Controls>
		</Figure>
	);
}

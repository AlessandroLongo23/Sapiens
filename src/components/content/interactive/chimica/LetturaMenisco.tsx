'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Handle, Dot, frame, v, clamp, THIN, DASH, INK, FONT } from '../kit';
import { LIQUID, Liquid, Vessel } from '../fisica/liquidi';

/**
 * Chemistry lesson "Massa, volume e densità", reading the meniscus: a stretch of a graduated cylinder (ticks every
 * 1 mL, numbers growing upwards) or of a burette (ticks every 0,1 mL, numbers growing downwards), seen up close as in
 * the TikZ figure `menisco-buretta-cilindro` of the same lesson, with the water's meniscus. The eye on the left moves
 * up and down (slider or drag); the dashed line of sight goes from the eye to the bottom of the meniscus and meets the
 * scale, on the near wall, at the point read. The reading is the tick nearest to that point: it is right only with the
 * eye level with the bottom of the meniscus. Looking from above, the cylinder reads more than the true volume and the
 * burette less, because their scales run opposite ways.
 */

type Kind = 'cilindro' | 'buretta';

const W = 1.6; // the tube's inner width
const H = 3.2; // the stretch drawn
const STEP = 0.25; // cm of drawing between two ticks
const Y0 = 0.25; // height of tick 0
const EYE_X = -1.35; // the eye's centre
const EYE_TIP = EYE_X + 0.2; // where the line of sight starts
const RISE = 0.22; // how much the meniscus climbs at the glass
const MAX = 5; // the eye goes at most this many ticks above or below the meniscus

// tick k (0 at the bottom of the stretch) → value; the meniscus sits on tick `level`
const SCALE: Record<Kind, { value: (k: number) => number; level: number; long: number[]; unit: string; digits: number }> = {
	cilindro: { value: (k) => 30 + k, level: 6, long: [0, 5, 10], unit: 'mL', digits: 0 },
	buretta: { value: (k) => 13.1 - 0.1 * k, level: 7, long: [1, 6, 11], unit: 'mL', digits: 1 },
};

const f = frame(-1.75, W + 1.9, -0.15, H + 0.2);
const yOf = (k: number) => Y0 + k * STEP;

export default function LetturaMenisco({ alt }: { alt?: string }) {
	const [kind, setKind] = useState<Kind>('cilindro');
	const [eye, setEye] = useState(3); // ticks above the bottom of the meniscus
	const s = SCALE[kind];
	const yb = yOf(s.level);
	const ye = yb + eye * STEP;
	// the line of sight from the eye's tip to the meniscus's bottom at the middle, where it crosses the near wall x = 0
	const t = (0 - EYE_TIP) / (W / 2 - EYE_TIP);
	const yc = ye + (yb - ye) * t;
	const kRead = clamp(Math.round((yc - Y0) / STEP), 0, 11);
	const read = s.value(kRead);
	const truth = s.value(s.level);
	const right = kRead === s.level;

	// the meniscus: from the glass down to its bottom in the middle and up again
	const meniscus = (x: number) => {
		const u = Math.abs(x - W / 2) / (W / 2); // 0 in the middle, 1 at the glass
		return yb + RISE * u ** 4;
	};
	const xs = Array.from({ length: 33 }, (_, i) => (i / 32) * W);
	const top = xs.map((x) => v(x, meniscus(x)));
	const fmt = (x: number) => x.toFixed(s.digits).replace('.', '{,}');

	const eyePath = f.path([v(EYE_X - 0.25, ye), v(EYE_X - 0.05, ye + 0.13), v(EYE_X + 0.2, ye), v(EYE_X - 0.05, ye - 0.13)], true);

	let caption: string;
	if (right) caption = "L'occhio è all'altezza del fondo del menisco: la lettura è giusta.";
	else if (eye > 0) caption = kind === 'cilindro' ? "L'occhio guarda dall'alto: la linea di vista incontra la scala più in alto del menisco, e nel cilindro si legge un volume più grande di quello vero." : "L'occhio guarda dall'alto: la linea di vista incontra la scala più in alto del menisco, e nella buretta, dove i numeri crescono verso il basso, si legge un volume più piccolo di quello vero.";
	else caption = kind === 'cilindro' ? "L'occhio guarda dal basso: la linea di vista incontra la scala più in basso del menisco, e nel cilindro si legge un volume più piccolo di quello vero." : "L'occhio guarda dal basso: la linea di vista incontra la scala più in basso del menisco, e nella buretta si legge un volume più grande di quello vero.";

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Liquid f={f} pts={[v(0, 0), ...top, v(W, 0)]} fill={LIQUID.acqua} />
				<path d={f.path(top)} stroke="#000" strokeWidth={THIN} fill="none" />
				{Array.from({ length: 12 }, (_, k) => (
					<path key={k} d={f.path([v(0, yOf(k)), v(s.long.includes(k) ? 0.35 : 0.15, yOf(k))])} stroke="#000" strokeWidth={THIN} />
				))}
				{s.long.map((k) => {
					const p = f.px(v(0.42, yOf(k)));
					return (
						<text key={k} x={p.x} y={p.y} dy="0.35em" fontSize={12} fontFamily={FONT} pointerEvents="none">
							{s.value(k).toFixed(s.digits).replace('.', ',')}
						</text>
					);
				})}
				<Vessel f={f} paths={[[v(0, H), v(0, 0)], [v(W, H), v(W, 0)]]} />
				<path d={f.path([v(EYE_TIP, ye), v(W / 2, yb)])} stroke={right ? '#000' : INK.red} strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<path d={f.path([v(-0.12, yOf(kRead)), v(0, yOf(kRead))])} stroke={INK.red} strokeWidth={1.6} />
				<Dot f={f} at={v(0, yc)} r={2.6} color={INK.red} />
				<path d={eyePath} stroke="#000" strokeWidth={1.2} fill="none" strokeLinejoin="round" />
				<Handle f={f} at={v(EYE_X, ye)} label="Occhio" step={STEP} onMove={(p) => setEye(clamp(Math.round(((p.y - yb) / STEP) * 2) / 2, -MAX, MAX))} />
				{(() => {
					const p = f.px(v(W + 0.15, H - 0.05));
					return (
						<text x={p.x} y={p.y} dy="0.35em" fontSize={13} fontFamily={FONT} pointerEvents="none">
							mL
						</text>
					);
				})()}
			</Drawing>

			<Readout>
				<span>
					Lettura: <Tex>{`${fmt(read)}\\,\\text{mL}`}</Tex>
				</span>
				<span className="font-medium">
					Volume vero: <Tex>{`${fmt(truth)}\\,\\text{mL}`}</Tex>
				</span>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup
						label="Strumento"
						options={[
							{ value: 'cilindro', label: 'Cilindro graduato' },
							{ value: 'buretta', label: 'Buretta' },
						]}
						value={kind}
						onChange={setKind}
					/>
				</div>
				<Slider label="Occhio (tacche sopra il menisco)" value={eye} min={-MAX} max={MAX} step={0.5} onChange={setEye} />
			</Controls>
		</Figure>
	);
}

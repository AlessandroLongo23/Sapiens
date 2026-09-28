'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { add, Caption, Controls, DASH, Dot, Drawing, Figure, frame, Handle, INK, Label, lerp, Readout, scale, sub, Tex, texNum, THICK, THIN, TINT, type V, unit, v } from './kit';

/**
 * Lesson 104, "L'omotetia": the triangle ABC and its image A'B'C' in the homothety of centre O and ratio k, with
 * k from −3 to 3 on a slider and O dragged by the student. The image grows, shrinks, collapses into O at k = 0
 * (which the lesson excludes: an homothety has k ≠ 0) and turns over to the other side of O for negative k.
 * O is kept where the image fits in the drawing; at the ends of the slider it may leave it.
 */

const f = frame(-4.7, 4.1, -2.85, 2.65);
// A, B, C: the lesson's triangle at 0.7 of its size; with O where it starts, every image of the slider fits.
const TRI: V[] = [v(0.7, 0.14), v(0.98, 0.35), v(0.63, 0.63)];
/** Where the labels go, as in the TikZ figure: A below, B right, C above left (turned over with k < 0). */
const DIRS: V[] = [v(0, -1), v(1, 0), v(-0.7, 0.7)];
const NAMES = ['A', 'B', 'C'];
const BLUE = '#d9d9ff'; // blue!15
const K_MAX = 3;
const MARGIN = 0.55; // room for the labels

const image = (P: V, O: V, k: number) => add(O, scale(sub(P, O), k));
/** How far the image for this O and k sticks out of the drawing (0 if it fits). */
const overflow = (O: V, k: number) =>
	Math.max(
		0,
		...TRI.map((P) => {
			const q = image(P, O, k);
			return Math.max(f.x0 + MARGIN - q.x, q.x - f.x1 + MARGIN, f.y0 + MARGIN - q.y, q.y - f.y1 + MARGIN);
		})
	);

export default function Omotetia({ alt }: { alt?: string }) {
	const [k, setK] = useState(2);
	const [O, setO] = useState(v(-0.3, -0.1));

	/**
	 * Towards the pointer as far as the image still fits in the drawing. With a large |k| the slider can push the
	 * image partly out (O cannot be kept where every image of the slider fits: the region would be tiny); then O
	 * moves freely as long as the image does not stick out further.
	 */
	const moveO = (p: V) => {
		const q = v(Math.round(p.x * 20) / 20, Math.round(p.y * 20) / 20);
		const ok = (o: V) => overflow(o, k) <= overflow(O, k) + 1e-9 && o.x > f.x0 + MARGIN && o.x < f.x1 - MARGIN && o.y > f.y0 + MARGIN && o.y < f.y1 - MARGIN;
		if (ok(q)) return setO(q);
		let lo = 0, hi = 1;
		for (let i = 0; i < 20; i++) {
			const m = (lo + hi) / 2;
			if (ok(lerp(O, q, m))) lo = m;
			else hi = m;
		}
		setO(lerp(O, q, lo));
	};

	const img = TRI.map((P) => image(P, O, k));
	const g = scale(add(add(TRI[0], TRI[1]), TRI[2]), 1 / 3);
	// The dashed lines through O: from the farther of P and P' on one side to the farther on the other.
	const rays = TRI.map((P, i) => {
		const u = unit(sub(P, O));
		const ends = [0, 1, k].map((t) => t * Math.hypot(P.x - O.x, P.y - O.y));
		const lo = Math.min(...ends), hi = Math.max(...ends);
		return [add(O, scale(u, lo)), add(O, scale(u, hi)), i] as const;
	});
	// Across the lines through O, so that the letter sits on none of them.
	const across = unit(v(g.y - O.y, O.x - g.x));
	const oDir = across.y > 0 ? scale(across, -1) : across;
	const abs = Math.abs(k);
	const zero = k === 0;
	const insideO = TRI.every((P, i) => {
		const Q = TRI[(i + 1) % 3];
		return (Q.x - P.x) * (O.y - P.y) - (Q.y - P.y) * (O.x - P.x) > 0;
	});

	const kText = texNum(k, 1).replace('{,}', ',');
	let what: string;
	if (zero) what = 'Con k = 0 ogni punto va in O e il triangolo si riduce a un punto: non è un’omotetia, che chiede k diverso da zero.';
	else if (k === 1) what = 'Con k = 1 ogni punto resta dov’è: è l’identità.';
	else if (k === -1) what = 'Con k = −1 l’immagine è la simmetrica di ABC rispetto a O: è la simmetria centrale.';
	else
		what =
			(k < 0 ? `Con k = ${kText.replace('-', '−')} l’immagine sta dalla parte opposta di O ed è capovolta` : `Con k = ${kText} l’immagine sta dalla stessa parte di O`) +
			`, ${abs > 1 ? 'più grande' : 'più piccola'}, con i lati paralleli a quelli di ABC. Trascina O e cambia k.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{rays.map(([p, q, i]) => (
					<path key={i} d={f.path([p, q])} stroke={INK.gray} strokeWidth={THIN} strokeDasharray={DASH} />
				))}
				<polygon points={f.pts(...TRI)} fill={BLUE} />
				<polygon points={f.pts(...TRI)} fill="none" stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
				{!zero && (
					<>
						<polygon points={f.pts(...img)} fill={TINT.orange} fillOpacity={0.85} />
						<polygon points={f.pts(...img)} fill="none" stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
					</>
				)}
				{TRI.map((P, i) => (
					<Label key={NAMES[i]} f={f} at={P} dir={DIRS[i]}>
						{NAMES[i]}
					</Label>
				))}
				{!zero &&
					img.map((P, i) => (
						<Label key={NAMES[i] + '′'} f={f} at={P} dir={scale(DIRS[i], Math.sign(k))}>
							{NAMES[i] + '′'}
						</Label>
					))}
				<Dot f={f} at={O} r={zero ? 3.2 : 2.2} />
				<Label f={f} at={O} dir={insideO ? v(0, -1) : oDir}>
					O
				</Label>
				<Handle f={f} at={O} onMove={moveO} label="Centro O" step={0.05} />
			</Drawing>
			<Readout>
				{zero ? (
					<Tex>{"k = 0:\\ A' = B' = C' = O"}</Tex>
				) : (
					<>
						<Tex>{`\\overline{A'B'} = |k| \\cdot \\overline{AB} = ${texNum(abs, 1)} \\cdot \\overline{AB}`}</Tex>
						<span>
							aree moltiplicate per <Tex>{`k^2 = ${texNum(k * k, 2)}`}</Tex>
						</span>
					</>
				)}
			</Readout>
			<Caption>{what}</Caption>
			<Controls>
				<Slider label="Rapporto k" value={k} min={-K_MAX} max={K_MAX} step={0.1} onChange={(x) => setK(Math.round(x * 10) / 10)} />
			</Controls>
		</Figure>
	);
}

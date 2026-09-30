'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Handle, Label, frame, v, clamp, THICK, TINT, type V } from '../kit';
import { RAY, RAY2 } from './ottica';
import { Raggio as Ray } from './raggi';

/**
 * Lesson "I raggi di luce e la propagazione rettilinea", section "Ombra e penombra": a source on the left, an opaque
 * card in the middle that is dragged along the axis, a screen on the right. The rays from the two ends of the source
 * that graze the two ends of the card bound the shadow (dark grey: no point of the source reaches it) and the
 * penumbra (light grey: only part of the source reaches it). A slider changes the size of the source, from a point
 * (no penumbra) to an extended source. Under the drawing the widths on the screen, from the similar triangles of the
 * lesson: shadow 2(s + (w − s)X/a), penumbra outer edge 2(−s + (w + s)X/a).
 */

const X = 6; // the screen
const W = 0.4; // half the card
const HALF = 2.5; // half the screen
const f = frame(-0.9, 6.7, -3.05, 3.1);
/** One decimal, zeros kept: 1,0. */
const dec1 = (x: number) => x.toFixed(1).replace('.', '{,}');

/** A polygon cut to the band −HALF ≤ y ≤ HALF (Sutherland-Hodgman on two edges). */
function clipBand(ps: V[]): V[] {
	const cut = (pts: V[], inside: (p: V) => boolean, y: number) => {
		const out: V[] = [];
		pts.forEach((p, i) => {
			const q = pts[(i + 1) % pts.length];
			const pin = inside(p), qin = inside(q);
			if (pin) out.push(p);
			if (pin !== qin) out.push(v(p.x + ((q.x - p.x) * (y - p.y)) / (q.y - p.y), y));
		});
		return out;
	};
	return cut(cut(ps, (p) => p.y <= HALF, HALF), (p) => p.y >= -HALF, -HALF);
}

/** Where the line from p through q reaches the screen, or the edge of the screen's band before it. */
function toScreen(p: V, q: V): V {
	const y = p.y + ((q.y - p.y) * (X - p.x)) / (q.x - p.x);
	if (Math.abs(y) <= HALF) return v(X, y);
	const yy = Math.sign(y) * HALF;
	return v(p.x + ((q.x - p.x) * (yy - p.y)) / (q.y - p.y), yy);
}

export default function OmbraPenombra({ alt }: { alt?: string }) {
	const [a, setA] = useState(2.2);
	const [s, setS] = useState(0.3);

	const top = v(0, s), bottom = v(0, -s);
	const cTop = v(a, W), cBottom = v(a, -W);
	const umbra = s + ((W - s) * X) / a; // half-width of the shadow on the screen
	const outer = -s + ((W + s) * X) / a; // half-width of shadow and penumbra together
	const pen = clipBand([cTop, v(X, outer), v(X, -outer), cBottom]);
	const dark = clipBand([cTop, v(X, umbra), v(X, -umbra), cBottom]);
	const point = s < 0.005;

	const move = (p: V) => setA(clamp(Math.round(p.x * 10) / 10, 1.8, 4.5));
	const shadowW = 2 * umbra, penW = 2 * (outer - umbra);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{!point && <path d={f.path(pen, true)} fill={TINT.gray} stroke="none" />}
				<path d={f.path(dark, true)} fill="#b3b3b3" stroke="none" />
				{/* The rays from each end of the source that graze the two ends of the card. */}
				<Ray f={f} from={top} to={toScreen(top, cTop)} color={RAY} />
				<Ray f={f} from={bottom} to={toScreen(bottom, cBottom)} color={point ? RAY : RAY2} />
				{!point && <Ray f={f} from={bottom} to={toScreen(bottom, cTop)} color={RAY2} />}
				{!point && <Ray f={f} from={top} to={toScreen(top, cBottom)} color={RAY} />}
				{/* The screen: a thin grey slab with its front line. */}
				<path d={f.path([v(X, -HALF), v(X + 0.12, -HALF), v(X + 0.12, HALF), v(X, HALF)], true)} fill={TINT.gray} stroke="none" />
				<path d={f.path([v(X, -HALF), v(X, HALF)])} stroke="#000" strokeWidth={THICK} />
				{/* The source: a bright bar, or a dot when it is a point. */}
				{point ? <circle cx={f.px(top).x} cy={f.px(top).y} r={3} fill={RAY} /> : <path d={f.path([v(-0.08, -s), v(0.08, -s), v(0.08, s), v(-0.08, s)], true)} fill="#ffff99" stroke="#000" strokeWidth={THICK} />}
				<path d={f.path([cBottom, cTop])} stroke="#000" strokeWidth={3} />
				<Label f={f} at={v(0, -Math.max(s, 0.1) - 0.05)} dir={v(0, -1)} upright size={13}>
					sorgente
				</Label>
				<Label f={f} at={v(X, HALF)} dir={v(0, 1)} upright size={13}>
					schermo
				</Label>
				<Handle f={f} at={v(a, 0)} onMove={move} label="Ostacolo" step={0.1} />
			</Drawing>
			<Readout>
				<Tex>{`\\text{ombra: } ${dec1(shadowW)}\\,\\text{cm}`}</Tex>
				<Tex>{`\\text{penombra: } ${point ? '0' : `2 \\cdot ${dec1(penW / 2)}`}\\,\\text{cm}`}</Tex>
			</Readout>
			<Caption>
				{point
					? 'Sorgente puntiforme: l’ombra ha il contorno netto e non c’è penombra.'
					: `Le fasce di penombra sono due, una sopra e una sotto l’ombra. Avvicina l’ostacolo allo schermo: ombra e penombra si stringono.`}{' '}
				Le misure sono quelle del disegno.
			</Caption>
			<Controls>
				<Slider label="Altezza della sorgente" value={Math.round(2 * s * 10) / 10} min={0} max={1} step={0.1} unit="cm" onChange={(x) => setS(clamp(x, 0, 1) / 2)} />
			</Controls>
		</Figure>
	);
}

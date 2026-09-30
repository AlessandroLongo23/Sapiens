'use client';

import { useState } from 'react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Handle, frame, v, add, scale, clamp, texNum, type V } from '../kit';
import { Ray, RAY, RAY2, OpticalAxis, ThinLens, AxisPoint, Arrowhead, imageDistance, magnification } from './ottica';

/**
 * Lesson 36 (Le lenti sottili), after example 5: a thin lens with focal length 10 cm (converging) or −10 cm
 * (diverging), drawn at 0,12 cm of drawing per real cm, and an object 6 cm tall that the student drags along the axis,
 * from 3 to 40 cm. From its tip the principal rays: parallel to the axis (then through F′, or away from F for the
 * diverging lens), through the centre (straight), towards F (then parallel; towards F′ for the diverging lens). The
 * image is where they meet, or where their backward extensions (dashed) meet: real and upside down, or virtual and
 * upright. p, q and G = −q/p under the drawing, with the lessons' signs (imageDistance and magnification of ottica.tsx).
 */

const S = 0.12; // drawing cm per real cm
const F_REAL = 10;
const H = 0.75; // object height in the drawing (6,25 cm)
const HALF = 1.8; // half-height of the lens
const f = frame(-5.3, 5.3, -2.3, 2.3);
const O = v(0, 0);

/** From `a` along `d` to the edge of the frame. */
function toEdge(a: V, d: V): V {
	const ts = [d.x > 1e-9 ? (f.x1 - a.x) / d.x : Infinity, d.x < -1e-9 ? (f.x0 - a.x) / d.x : Infinity, d.y > 1e-9 ? (f.y1 - a.y) / d.y : Infinity, d.y < -1e-9 ? (f.y0 - a.y) / d.y : Infinity];
	return add(a, scale(d, Math.max(0, Math.min(...ts))));
}
const inside = (p: V) => p.x >= f.x0 && p.x <= f.x1 && p.y >= f.y0 && p.y <= f.y1;

export default function LenteOggettoImmagine({ alt }: { alt?: string }) {
	const [p, setP] = useState(30); // cm
	const [kind, setKind] = useState<'convergente' | 'divergente'>('convergente');
	const fr = kind === 'convergente' ? F_REAL : -F_REAL;
	const q = imageDistance(p, fr);
	const atFocus = !Number.isFinite(q);
	const G = atFocus ? Infinity : magnification(p, q);
	const fd = fr * S;

	const T = v(-p * S, H);
	const move = (w: V) => setP(Math.round(clamp(-w.x / S, 3, 40)));

	// The principal rays: where they meet the lens, and their direction after it.
	const y3 = atFocus ? null : (-H * fr) / (p - fr); // the ray through (or towards) the focus reaches the lens here
	const rays: { from: V; at: V; out: V; color: string }[] = [
		{ from: T, at: v(0, H), out: v(1, -H / fd), color: RAY },
		{ from: T, at: O, out: v(1, -H / (p * S)), color: RAY2 }
	];
	if (y3 !== null && Math.abs(y3) < HALF) rays.push({ from: T, at: v(0, y3), out: v(1, 0), color: RAY });

	const I = atFocus ? null : v(q * S, G * H);
	const real = !atFocus && q > 0;
	const shown = I !== null && inside(I);

	let caption: string;
	if (atFocus) caption = "L'oggetto è nel fuoco: dopo la lente i raggi escono paralleli e non si incontrano. Non si forma nessuna immagine.";
	else {
		const size = Math.abs(G) > 1.005 ? 'più grande' : Math.abs(G) < 0.995 ? 'più piccola' : "grande come l'oggetto";
		caption = `Immagine ${real ? 'reale' : 'virtuale'}, ${G < 0 ? 'capovolta' : 'diritta'} e ${size}${real ? ", dall'altra parte della lente" : ", dalla parte dell'oggetto: la vedi guardando attraverso la lente"}.`;
		if (!shown) caption += ' Qui è così lontana, o così grande, che esce dalla figura.';
	}

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<OpticalAxis f={f} x0={f.x0} x1={f.x1} />
				<ThinLens f={f} at={O} half={HALF} converging={kind === 'convergente'} />
				<AxisPoint f={f} at={v(-Math.abs(fd), 0)} name="F" />
				<AxisPoint f={f} at={v(Math.abs(fd), 0)} name="F′" />
				<AxisPoint f={f} at={v(-2 * Math.abs(fd), 0)} name="2F" />
				<AxisPoint f={f} at={v(2 * Math.abs(fd), 0)} name="2F′" />
				{rays.map((r, i) => (
					<g key={i}>
						<Ray f={f} from={r.from} to={r.at} color={r.color} />
						<Ray f={f} from={r.at} to={toEdge(r.at, r.out)} color={r.color} arrowAt={0.25} />
						{/* A virtual image: the backward extension of the outgoing ray, dashed, up to the image. */}
						{!real && I && <Ray f={f} from={r.at} to={shown ? I : toEdge(r.at, v(-r.out.x, -r.out.y))} color={r.color} virtual />}
					</g>
				))}
				<Arrowhead f={f} foot={v(-p * S, 0)} h={H} />
				{I && shown && <Arrowhead f={f} foot={v(I.x, 0)} h={I.y} image virtual={!real} />}
				<Handle f={f} at={T} onMove={move} label="Punta dell'oggetto" step={S} />
			</Drawing>
			<Readout>
				<Tex>{`p = ${p}\\,\\text{cm}`}</Tex>
				<Tex>{`f = ${fr}\\,\\text{cm}`}</Tex>
				<Tex>{atFocus ? 'q:\\ \\text{nessuna immagine}' : `q ${Number.isInteger(q) ? '=' : '\\approx'} ${texNum(q, 1)}\\,\\text{cm}`}</Tex>
				{!atFocus && <Tex>{`G = -\\frac{q}{p} ${Number.isInteger(G * 100) ? '=' : '\\approx'} ${texNum(G, 2)}`}</Tex>}
			</Readout>
			<Caption>{caption}</Caption>
			<Controls>
				<ToggleGroup
					label="Tipo di lente"
					options={[
						{ value: 'convergente', label: 'convergente' },
						{ value: 'divergente', label: 'divergente' }
					]}
					value={kind}
					onChange={setKind}
				/>
			</Controls>
		</Figure>
	);
}


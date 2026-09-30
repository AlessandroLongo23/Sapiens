'use client';

import { useState } from 'react';
import { Drawing, Figure, Caption, Readout, Tex, Handle, Label, frame, v, add, scale, clamp, THIN, type V } from '../kit';
import { Normal, PlaneMirror, reflect, RAY } from './ottica';
import { Raggio as Ray } from './raggi';

/**
 * Lesson "La riflessione e gli specchi piani", section "Le leggi della riflessione": a horizontal plane mirror, the
 * normal at the point of incidence, and the point the incident ray starts from, dragged around the point of
 * incidence (it snaps to whole degrees). The reflected ray is computed with `reflect`, and two arcs mark the angle of
 * incidence i and the angle of reflection r, both from the normal. Under the drawing i, r and the angle between the
 * ray and the mirror's surface, the one students mistake for i.
 */

const L = 2.2; // length of the rays, cm
const ARC = 0.6;
const f = frame(-2.9, 2.9, -0.35, 2.6);
const O = v(0, 0);
const N = v(0, 1);

export default function RiflessioneSpecchio({ alt }: { alt?: string }) {
	const [deg, setDeg] = useState(-40); // the start of the incident ray, degrees from the normal (negative: on the left)

	const t = (deg * Math.PI) / 180;
	const S = v(L * Math.sin(t), L * Math.cos(t));
	const d = scale(S, -1 / L); // direction of the incident ray, towards the mirror
	const out = reflect(d, N);
	const R = add(O, scale(out, L));
	const i = Math.abs(deg);

	const move = (p: V) => {
		const a = (Math.atan2(p.x, Math.max(p.y, 0.05)) * 180) / Math.PI;
		setDeg(clamp(Math.round(a), -85, 85));
	};

	// The arcs from the normal to each ray; kit's arc goes counterclockwise from the first direction to the second.
	const left = deg <= 0;
	const arcI = left ? f.arc(O, N, S, ARC) : f.arc(O, S, N, ARC);
	const arcR = left ? f.arc(O, R, N, ARC) : f.arc(O, N, R, ARC);
	const mid = (a: V) => { const m = add(scale(N, 1), scale(a, 1 / L)); const l = Math.hypot(m.x, m.y) || 1; return scale(m, (ARC + 0.28) / l); };

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<PlaneMirror f={f} from={v(-2.7, 0)} to={v(2.7, 0)} />
				<Normal f={f} at={v(0, 1.1)} n={N} length={1.1} />
				<Ray f={f} from={S} to={O} color={RAY} />
				<Ray f={f} from={O} to={R} color={RAY} />
				{i >= 1 && <path d={arcI} stroke="#000" strokeWidth={THIN} fill="none" />}
				{i >= 1 && <path d={arcR} stroke="#000" strokeWidth={THIN} fill="none" />}
				{i >= 12 && (
					<>
						<Label f={f} at={mid(S)}>i</Label>
						<Label f={f} at={mid(R)}>r</Label>
					</>
				)}
				<circle cx={f.px(O).x} cy={f.px(O).y} r={2.25} fill="#000" />
				<Handle f={f} at={S} onMove={move} label="Inizio del raggio incidente" color={RAY} step={0.1} />
			</Drawing>
			<Readout>
				<Tex>{`i = ${i}^\\circ`}</Tex>
				<Tex>{`r = ${i}^\\circ`}</Tex>
				<Tex>{`\\text{angolo con lo specchio} = ${90 - i}^\\circ`}</Tex>
			</Readout>
			<Caption>
				{i === 0
					? 'Il raggio arriva lungo la normale e torna indietro sulla stessa retta.'
					: `Gli angoli si misurano dalla normale: l’angolo di riflessione è sempre uguale a quello di incidenza. L’angolo con lo specchio è il loro complementare.`}
			</Caption>
		</Figure>
	);
}

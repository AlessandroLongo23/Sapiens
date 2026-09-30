'use client';

import { useState } from 'react';
import { Drawing, Figure, Caption, Readout, Tex, Handle, frame, v, clamp, type V } from '../kit';
import { PlaneMirror, Arrowhead, RAY, RAY2 } from './ottica';
import { Raggio as Ray, Occhio as Eye } from './raggi';

const dec1 = (x: number) => x.toFixed(1).replace('.', '{,}');

/**
 * Lesson "La riflessione e gli specchi piani", section "Com'è l'immagine di un oggetto": a vertical plane mirror of
 * finite length, an object (an upright arrow) and an eye in front of it, both dragged. The image is the object's
 * mirror image, dashed behind the mirror. The rays that reach the eye are found backwards, as the lesson says: the
 * line from the eye to the image of a point cuts the mirror at the point of incidence; the ray from the real point
 * goes there and is reflected into the eye, and its dashed extension reaches the image. When that point falls off
 * the mirror the eye does not see that point, and the ray is not drawn. Under the drawing the two distances from the
 * mirror, always equal.
 */

const M0 = 0.2, M1 = 1.8; // the mirror, on x = 0
const H = 1.0; // the object's height
const f = frame(-4.3, 3.9, -0.55, 2.55);

export default function ImmagineSpecchioPiano({ alt }: { alt?: string }) {
	const [obj, setObj] = useState(v(-1.4, 0.2)); // the object's foot
	const [eye, setEye] = useState(v(-3.2, 2.0));

	const tip = v(obj.x, obj.y + H);
	const img = (p: V) => v(-p.x, p.y);
	/** Where the line from the eye to the image of p crosses the mirror, or null off the mirror. */
	const hit = (p: V): V | null => {
		const q = img(p);
		const y = eye.y + ((q.y - eye.y) * (0 - eye.x)) / (q.x - eye.x);
		return y >= M0 && y <= M1 ? v(0, y) : null;
	};
	const hTip = hit(tip), hFoot = hit(obj);

	const moveObj = (p: V) => setObj(v(clamp(Math.round(p.x * 10) / 10, -3.3, -0.5), clamp(Math.round(p.y * 10) / 10, -0.3, 1.3)));
	const moveEye = (p: V) => setEye(v(clamp(Math.round(p.x * 10) / 10, -3.9, -0.5), clamp(Math.round(p.y * 10) / 10, -0.3, 2.3)));
	const d = -obj.x;

	let caption: string;
	if (hTip && hFoot) caption = 'L’occhio vede tutta l’immagine: i raggi riflessi sembrano venire da dietro lo specchio, dove però la luce non arriva.';
	else if (hTip || hFoot) caption = `L’occhio vede solo ${hTip ? 'la cima' : 'la base'} dell’oggetto: il raggio che viene ${hTip ? 'dalla base' : 'dalla cima'} cadrebbe fuori dallo specchio.`;
	else caption = 'Da qui l’occhio non vede l’immagine: i raggi cadrebbero fuori dallo specchio.';

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<PlaneMirror f={f} from={v(0, M0)} to={v(0, M1)} />
				{hTip && (
					<>
						<Ray f={f} from={tip} to={hTip} color={RAY} />
						<Ray f={f} from={hTip} to={eye} color={RAY} />
						<Ray f={f} from={hTip} to={img(tip)} color={RAY} virtual />
					</>
				)}
				{hFoot && (
					<>
						<Ray f={f} from={obj} to={hFoot} color={RAY2} />
						<Ray f={f} from={hFoot} to={eye} color={RAY2} />
						<Ray f={f} from={hFoot} to={img(obj)} color={RAY2} virtual />
					</>
				)}
				<Arrowhead f={f} foot={obj} h={H} />
				<Arrowhead f={f} foot={img(obj)} h={H} image virtual />
				<Eye f={f} at={eye} />
				<Handle f={f} at={obj} onMove={moveObj} label="Base dell'oggetto" step={0.1} />
				<Handle f={f} at={eye} onMove={moveEye} label="Occhio" step={0.1} />
			</Drawing>
			<Readout>
				<Tex>{`\\text{oggetto: } d = ${dec1(d)}\\,\\text{cm}`}</Tex>
				<Tex>{`\\text{immagine: } d = ${dec1(d)}\\,\\text{cm}`}</Tex>
			</Readout>
			<Caption>{caption} Le distanze sono quelle del disegno, dallo specchio.</Caption>
		</Figure>
	);
}

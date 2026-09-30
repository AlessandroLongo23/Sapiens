'use client';

import { useState } from 'react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Handle, Label, frame, v, sub, scale, unit, add, clamp, type V } from '../kit';
import { OpticalAxis, SphericalMirror, AxisPoint, Arrowhead, imageDistance, magnification, RAY, RAY2 } from './ottica';
import { Raggio, bendOnMirror, mirrorX } from './raggi';

/**
 * Lesson "Gli specchi sferici", section "La costruzione dell'immagine": a concave (or, with the toggle, convex)
 * mirror with its focus and centre; the object, an upright arrow, is dragged along the axis. From its tip three
 * principal rays: parallel to the axis (orange), through the focus (blue), to the vertex (green). With the lesson's
 * sign convention (p > 0; q > 0 for a real image; f > 0 concave, < 0 convex) `imageDistance` and `magnification`
 * give the image, drawn blue, dashed when virtual, with the dashed backward extensions of the rays. The mirror is
 * drawn less curved than its real radius (3R), as in the lesson's figures, and each reflected ray is aimed at the
 * image the equation gives (paraxial rays), so the drawing and the numbers agree. Under it p, q and G.
 */

const FOC = 1.6; // focal length, cm
const RD = 6 * FOC; // drawn radius of the mirror: three times the real one
const HALF = 1.9;
const H = 0.6; // the object's height
const VERT = '#008000'; // TikZ green!50!black, the third ray
const X0 = -6.4, X1 = 3.6, Y0 = -2.15, Y1 = 2.15;
const f = frame(X0, X1, Y0, Y1);
const O = v(0, 0);

const dec = (x: number, d = 1) => (Object.is(Number(x.toFixed(d)), -0) ? 0 : Number(x.toFixed(d))).toFixed(d).replace('.', '{,}');
/** A point far along the ray from a in direction d: the SVG clips it at the frame. */
const far = (a: V, d: V) => add(a, scale(unit(d), 14));

export default function SpecchioSferico({ alt }: { alt?: string }) {
	const [p, setP] = useState(4.0);
	const [kind, setKind] = useState<'concavo' | 'convesso'>('concavo');
	const concave = kind === 'concavo';
	const fs = concave ? FOC : -FOC;
	const Fp = v(-fs, 0), Cp = v(-2 * fs, 0);
	const tip = v(-p, H);
	const atFocus = concave && Math.abs(p - FOC) < 0.05;
	const q = atFocus ? Infinity : imageDistance(p, fs);
	const G = atFocus ? Infinity : magnification(p, q);
	const I = atFocus ? null : v(-q, G * H);
	const real = q > 0;

	/** The reflected ray from the bend point A: towards the image if real, away from it if virtual, along `dir` at the focus. */
	const outgoing = (A: V, dirAtFocus: V) => (I ? (real ? far(A, sub(I, A)) : far(A, sub(A, I))) : far(A, dirAtFocus));

	// Ray 1: parallel to the axis.
	const A1 = v(mirrorX(0, RD, concave, H), H);
	const E1 = outgoing(A1, sub(Fp, A1));
	// Ray 2: through the focus (or towards it, or as if from it); none when the object is in the focus.
	const A2 = atFocus ? null : bendOnMirror(tip, Fp, 0, RD, concave);
	const ray2 = A2 && Math.abs(A2.y) <= HALF;
	const E2 = A2 ? outgoing(A2, v(-1, 0)) : null;
	// Ray 3: to the vertex, reflected symmetric about the axis.
	const E3 = outgoing(O, v(-p, -H));

	const move = (pt: V) => setP(clamp(Math.round(-pt.x * 10) / 10, 0.3, 6.0));
	const imageIn = I && I.x > X0 + 0.1 && I.x < X1 - 0.1 && Math.abs(I.y) < Y1 - 0.1;

	let words: string;
	if (atFocus) words = 'L’oggetto è nel fuoco: i raggi riflessi escono paralleli e l’immagine non si forma.';
	else {
		const size = Math.abs(Math.abs(G) - 1) < 0.02 ? 'grande quanto l’oggetto' : Math.abs(G) > 1 ? 'più grande dell’oggetto' : 'più piccola dell’oggetto';
		words = `Immagine ${real ? 'reale' : 'virtuale'}, ${G < 0 ? 'capovolta' : 'diritta'}, ${size}${real ? '' : ', dietro lo specchio'}.`;
		if (!imageIn) words += ' È fuori dal disegno: l’oggetto è vicino al fuoco.';
	}

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<OpticalAxis f={f} x0={X0 + 0.1} x1={X1 - 0.1} />
				<SphericalMirror f={f} vertex={O} R={RD} half={HALF} concave={concave} />
				{Cp.x > X0 && Cp.x < X1 && <AxisPoint f={f} at={Cp} name="C" />}
				<AxisPoint f={f} at={Fp} name="F" />
				<Label f={f} at={v(concave ? 0.08 : -0.08, 0)} dir={v(concave ? 0.7 : -0.7, -0.7)}>
					V
				</Label>
				{/* Ray 1 */}
				<Raggio f={f} from={tip} to={A1} color={RAY} />
				<Raggio f={f} from={A1} to={E1} color={RAY} arrowAt={0.06} />
				{I && !real && <Raggio f={f} from={A1} to={I} color={RAY} virtual />}
				{!concave && <Raggio f={f} from={A1} to={Fp} color={RAY} virtual />}
				{/* Ray 2 */}
				{ray2 && A2 && E2 && (
					<>
						<Raggio f={f} from={tip} to={A2} color={RAY2} />
						<Raggio f={f} from={A2} to={E2} color={RAY2} arrowAt={0.06} />
						{I && !real && <Raggio f={f} from={A2} to={I} color={RAY2} virtual />}
						{concave && p < FOC && <Raggio f={f} from={Fp} to={tip} color={RAY2} virtual />}
						{!concave && <Raggio f={f} from={A2} to={Fp} color={RAY2} virtual />}
					</>
				)}
				{/* Ray 3 */}
				<Raggio f={f} from={tip} to={O} color={VERT} />
				<Raggio f={f} from={O} to={E3} color={VERT} arrowAt={0.06} />
				{I && !real && <Raggio f={f} from={O} to={I} color={VERT} virtual />}
				<Arrowhead f={f} foot={v(-p, 0)} h={H} />
				{I && imageIn && <Arrowhead f={f} foot={v(I.x, 0)} h={I.y} image virtual={!real} />}
				<Handle f={f} at={v(-p, 0)} onMove={move} label="Oggetto" step={0.1} />
			</Drawing>
			<Readout>
				<Tex>{`f = ${concave ? '' : '-'}${dec(FOC)}\\,\\text{cm}`}</Tex>
				<Tex>{`p = ${dec(p)}\\,\\text{cm}`}</Tex>
				<Tex>{atFocus ? 'q \\to \\infty' : `q ${Math.abs(q * 10 - Math.round(q * 10)) < 1e-6 ? '=' : '\\approx'} ${dec(q)}\\,\\text{cm}`}</Tex>
				{!atFocus && <Tex>{`G ${Math.abs(G * 100 - Math.round(G * 100)) < 1e-6 ? '=' : '\\approx'} ${dec(G, 2)}`}</Tex>}
			</Readout>
			<Caption>{words} Distanze nella scala del disegno.</Caption>
			<Controls>
				<ToggleGroup
					label="Specchio"
					value={kind}
					onChange={(k) => setKind(k)}
					options={[
						{ value: 'concavo', label: 'Concavo' },
						{ value: 'convesso', label: 'Convesso' }
					]}
				/>
			</Controls>
		</Figure>
	);
}

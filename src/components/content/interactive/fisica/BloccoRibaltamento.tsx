'use client';

import { useRef, useState } from 'react';
import { Hand, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { add, ang, ButtonRow, Caption, clamp, Controls, DASH, Drawing, Figure, frame, Handle, Label, Readout, rot, sub, Tex, THIN, useFrameLoop, useReducedMotion, v, type V } from '../kit';
import { Block, Ground, Point } from '../fisica';

/**
 * Lesson 25 (Il baricentro e la stabilità dell'equilibrio), "I corpi appoggiati e il ribaltamento": a homogeneous
 * block on the floor, tilted about its lower right edge C with a slider or by dragging its upper left corner. Its
 * centre of mass G is marked with the vertical through it. Let go, the block falls back onto its base if that vertical
 * is on the side of the base (left of C), and tips over onto its right side if it is past C: the angle where it
 * changes is θ = arctan(w / h), shown under the drawing. Sliders change the width and the height.
 *
 * No physics engine: the block is a rigid body with one degree of freedom, its angle θ about C, so one hand-written
 * integration step is enough (as in TrapezioTriangolo.tsx): gravity's torque about C is proportional to the
 * horizontal distance of G from C, the moment of inertia about an edge is (w² + h²)/3 per unit mass, and the block
 * rests against two contacts, its base (θ = 0) and its right side (θ = 90°).
 *
 * Scale: 1 cm of the drawing per 25 cm of block.
 */

const S = 25; // real cm per drawing cm
const C = v(0, 0);
const f = frame(-2.75, 4.05, -0.55, 4.55);
const G_ACC = 40; // cm/s², so the fall reads as a fall at this size
const STEP = 1 / 240;
const END = Math.PI / 2;
const BOUNCE = 0.25;
const DEG = 180 / Math.PI;

/** Horizontal distance of G from C (positive: past the edge), with the block turned clockwise by t. */
const gx = (w: number, h: number, t: number) => (-w / 2) * Math.cos(t) + (h / 2) * Math.sin(t);
/** A point of the block given in its own frame (C at the origin, the block to the left of it), turned by t. */
const place = (p: V, t: number) => add(C, rot(p, -t));

export default function BloccoRibaltamento({ alt }: { alt?: string }) {
	const [wcm, setW] = useState(40);
	const [hcm, setH] = useState(80);
	const w = wcm / S, h = hcm / S;
	const [theta, setTheta] = useState(0);
	const [running, setRunning] = useState(false);
	const body = useRef({ t: 0, om: 0 });
	const spare = useRef(0);
	const reduced = useReducedMotion();
	const limit = Math.atan(w / h);

	const hold = (t: number) => {
		setRunning(false);
		body.current = { t: clamp(t, 0, END), om: 0 };
		setTheta(body.current.t);
	};
	const release = () => {
		const b = body.current;
		if (reduced) {
			b.t = gx(w, h, b.t) > 0 ? END : 0;
			b.om = 0;
			setTheta(b.t);
			return;
		}
		spare.current = 0;
		setRunning(true);
	};

	useFrameLoop(running, (dt) => {
		const b = body.current;
		const I = (w * w + h * h) / 3;
		spare.current += dt;
		for (; spare.current >= STEP; spare.current -= STEP) {
			b.om += ((G_ACC * gx(w, h, b.t)) / I - 0.2 * b.om) * STEP;
			b.t += b.om * STEP;
			if (b.t < 0) {
				b.t = 0;
				b.om = Math.abs(b.om) < 0.3 ? 0 : -BOUNCE * b.om;
			} else if (b.t > END) {
				b.t = END;
				b.om = Math.abs(b.om) < 0.3 ? 0 : -BOUNCE * b.om;
			}
		}
		setTheta(b.t);
		const resting = b.om === 0 && ((b.t === 0 && gx(w, h, 0) < 0) || (b.t === END && gx(w, h, END) > 0));
		// Balanced exactly on the edge: a breath of air decides.
		if (!resting && Math.abs(b.om) < 1e-4 && Math.abs(gx(w, h, b.t)) < 1e-4) b.om += 0.05;
		if (resting) setRunning(false);
	});

	const corner = place(v(-w, h), theta);
	const G = place(v(-w / 2, h / 2), theta);
	const past = gx(w, h, theta) > 1e-9;
	const onEdge = Math.abs(gx(w, h, theta)) <= 1e-9;
	const lying = theta >= END - 1e-9;
	const grab = (p: V) => {
		const q = sub(p, C);
		if (Math.hypot(q.x, q.y) < 0.3) return;
		// The corner starts at angle ang(-w, h) from C, and turning the block clockwise by t lowers that angle by t.
		hold(ang(v(-w, h)) - ang(q));
	};

	const deg = (x: number) => Math.round(x * DEG);
	const change = (set: (x: number) => void) => (x: number) => {
		set(Math.round(x));
		// A new shape may tip the block over, or bring it back: it gets to move.
		if (!running && theta > 0 && theta < END) release();
	};

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(-2.65, 0)} to={v(3.95, 0)} />
				<Block f={f} at={place(v(-w / 2, 0), theta)} w={w} h={h} angle={-theta} />
				<path d={f.path([G, v(G.x, 0)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<Point f={f} at={G} />
				<Label f={f} at={G} dir={v(-1, 0.4)}>
					G
				</Label>
				<Point f={f} at={C} r={1.8} />
				<Label f={f} at={C} dir={v(0.8, -1)}>
					C
				</Label>
				{!lying && <Handle f={f} at={corner} onMove={grab} onEnd={release} label="Spigolo in alto del blocco: inclinalo" />}
			</Drawing>

			<Readout>
				<span>
					inclinazione <Tex>{`${deg(theta)}^\\circ`}</Tex>
				</span>
				<span>
					angolo limite <Tex>{`\\tan^{-1}\\frac{${wcm}}{${hcm}} \\approx ${deg(limit)}^\\circ`}</Tex>
				</span>
			</Readout>
			<Caption>
				{lying
					? 'Il blocco si è ribaltato: ora è appoggiato sul fianco. Rimettilo in piedi.'
					: theta === 0
						? 'Il blocco è appoggiato sulla base, e la verticale di G cade in mezzo alla base. Inclinalo sullo spigolo C e lascialo andare.'
						: onEdge
							? 'La verticale di G passa esattamente per lo spigolo C: è l’angolo limite, e basta un soffio per decidere da che parte cade.'
							: past
								? 'La verticale di G cade oltre lo spigolo C, fuori dalla base: lasciato andare, il blocco si ribalta.'
								: 'La verticale di G cade dalla parte della base, prima dello spigolo C: lasciato andare, il blocco torna giù sulla base.'}
			</Caption>

			<Controls>
				<Slider label="Inclinazione" value={deg(theta)} min={0} max={90} step={1} unit="°" onChange={(x) => hold(x / DEG)} />
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={running || theta === 0 || lying} onClick={release}>
						<Hand className="size-4" aria-hidden="true" />
						Lascia andare
					</Button>
					<Button variant="secondary" size="sm" disabled={theta === 0 && !running} onClick={() => hold(0)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Rimetti in piedi
					</Button>
				</ButtonRow>
				<Slider label="Larghezza" value={wcm} min={20} max={60} step={5} unit="cm" onChange={change(setW)} />
				<Slider label="Altezza" value={hcm} min={30} max={90} step={5} unit="cm" onChange={change(setH)} />
			</Controls>
		</Figure>
	);
}

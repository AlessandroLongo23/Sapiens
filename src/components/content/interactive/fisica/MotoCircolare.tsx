'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, scale, polar, useFrameLoop, useReducedMotion, texNum, num, THIN, THICK, DASH } from '../kit';
import { Vector, Point, QTY } from '../fisica';

/**
 * A point in uniform circular motion, counterclockwise (group 14). Two figures share this file:
 *
 * - lesson 47 (Il moto circolare uniforme), `radianti`: the radius to the point sweeps an angle, marked by an orange arc
 *   on the circle from the start; the readout gives the angle in radians and degrees, the arc θ·r, ω = 2π/T and
 *   v = ωr. Only the velocity is drawn (tangent).
 * - lesson 48 (L'accelerazione centripeta), `accelerazione`: the velocity (tangent, dark blue) and the centripetal
 *   acceleration (towards the centre, green) follow the point, their lengths to scale; the readout gives v, ω and
 *   a_c = v²/r = ω²r.
 *
 * The student sets the radius (0,5 to 2,0 m, one centimetre of drawing per metre) and the period (2,0 to 10 s), and
 * plays or stops the motion, in real time. Scales: 0,35 cm per m/s, 0,1 cm per m/s² (with T ≥ 2 s the acceleration's
 * arrow never passes the centre).
 */

export type Mode = 'radianti' | 'accelerazione';

const R_MAX = 2;
const KV = 0.35;
const KA = 0.1;
const f = frame(-3.05, 3.05, -3.05, 3.05);
const GRAY = '#999999'; // gray!60

export function MotoCircolareFigura({ alt, mode }: { alt?: string; mode: Mode }) {
	const [r, setR] = useState(1.5);
	const [T, setT] = useState(2.5);
	const [theta, setTheta] = useState(mode === 'radianti' ? 0 : Math.PI / 6);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();

	const w = (2 * Math.PI) / T;
	const vel = w * r;
	const acc = w * w * r;
	useFrameLoop(playing, (dt) => setTheta((th) => th + w * dt));
	const play = () => {
		if (reduced) return setTheta((th) => th + Math.PI / 2);
		setPlaying((p) => !p);
	};

	const O = v(0, 0);
	const P = polar(r, theta);
	const tang = polar(1, theta + Math.PI / 2);
	const inward = polar(1, theta + Math.PI);
	const vTip = add(P, scale(tang, vel * KV));
	const aTip = add(P, scale(inward, acc * KA));
	// The swept angle within the current turn, for the arc; the whole angle for the readout.
	const turns = Math.floor(theta / (2 * Math.PI) + 1e-9);
	const within = theta - turns * 2 * Math.PI;
	const arcPts = Array.from({ length: 61 }, (_, i) => polar(r, (within * i) / 60));
	const markPts = Array.from({ length: 31 }, (_, i) => polar(0.35, (within * i) / 30));
	// Where to write O: the direction farthest from the lines out of the centre (OP, and in radianti the start ray
	// and the θ label).
	const avoid = mode === 'radianti' ? [0, within, within / 2] : [theta];
	const gap = (x: number, y: number) => Math.abs(((x - y + 3 * Math.PI) % (2 * Math.PI)) - Math.PI);
	let oAngle = 0, best = -1;
	for (let i = 0; i < 16; i++) {
		const c = (i * Math.PI) / 8 + Math.PI / 16;
		const m = Math.min(...avoid.map((x) => gap(c, x)));
		if (m > best) {
			best = m;
			oAngle = c;
		}
	}

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<circle cx={f.px(O).x} cy={f.px(O).y} r={r * (f.W / (f.x1 - f.x0))} fill="none" stroke={GRAY} strokeWidth={THICK} />
				{mode === 'radianti' && (
					<>
						<path d={f.path([O, v(r, 0)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
						{within > 0.02 && <path d={f.path(arcPts)} stroke={QTY.risultante} strokeWidth={2.2} fill="none" />}
						{within > 0.02 && <path d={f.path(markPts)} stroke="#000" strokeWidth={THIN} fill="none" />}
						{within > 0.5 && <Label f={f} at={polar(0.62, within / 2)} size={13}>θ</Label>}
					</>
				)}
				<path d={f.path([O, P])} stroke="#000" strokeWidth={THIN} fill="none" />
				<Point f={f} at={O} />
				<Label f={f} at={polar(0.3, oAngle)} dir={polar(1, oAngle)}>O</Label>
				{mode === 'accelerazione' && acc * KA > 0.06 && <Vector f={f} from={P} to={aTip} color={QTY.accelerazione} name="a" sub="c" labelAt={0.55} labelDir={scale(tang, -1)} />}
				<Vector f={f} from={P} to={vTip} color={QTY.velocita} name="v" labelDir={polar(1, theta + Math.PI / 4)} />
				<Point f={f} at={P} r={3} />
				<Label f={f} at={P} dir={polar(1, theta - Math.PI / 4)}>P</Label>
				<path d={f.path([v(-R_MAX - 0.8, -2.75), v(-R_MAX + 0.2, -2.75)])} stroke="#000" strokeWidth={THIN} fill="none" />
				<path d={`${f.path([v(-R_MAX - 0.8, -2.68), v(-R_MAX - 0.8, -2.82)])} ${f.path([v(-R_MAX + 0.2, -2.68), v(-R_MAX + 0.2, -2.82)])}`} stroke="#000" strokeWidth={THIN} fill="none" />
				<Label f={f} at={v(-R_MAX - 0.3, -2.75)} dir={v(0, 1)} upright size={12}>1 m</Label>
			</Drawing>

			<Readout>
				{mode === 'radianti' ? (
					<>
						<Tex>{`\\theta = ${texNum(theta, 2)}\\,\\text{rad} = ${texNum((theta * 180) / Math.PI, 0)}^\\circ`}</Tex>
						<Tex>{`l = \\theta\\,r = ${texNum(theta * r, 2)}\\,\\text{m}`}</Tex>
						<Tex>{`\\omega = \\dfrac{2\\pi}{T} = ${texNum(w, 2)}\\,\\text{rad/s}`}</Tex>
						<Tex>{`v = \\omega\\,r = ${texNum(vel, 2)}\\,\\text{m/s}`}</Tex>
					</>
				) : (
					<>
						<Tex>{`v = \\dfrac{2\\pi r}{T} = ${texNum(vel, 2)}\\,\\text{m/s}`}</Tex>
						<Tex>{`\\omega = ${texNum(w, 2)}\\,\\text{rad/s}`}</Tex>
						<Tex>{`a_c = \\dfrac{v^2}{r} = \\omega^2 r = ${texNum(acc, 2)}\\,\\text{m/s}^2`}</Tex>
					</>
				)}
			</Readout>
			<Caption>
				{mode === 'radianti'
					? turns > 0
						? `Il punto ha fatto ${turns} ${turns === 1 ? 'giro' : 'giri'}, ${num(turns * 2, 0)}π rad, e altri ${num(within, 2)} rad: l'angolo continua a crescere di ω = ${num(w, 2)} rad ogni secondo.`
						: `Il raggio OP ha spazzato ${num(theta, 2)} rad: l'arco arancione è lungo θ volte il raggio.`
					: `La velocità è tangente e l'accelerazione punta verso il centro, perpendicolare alla velocità. Con il raggio doppio e lo stesso periodo velocità e accelerazione raddoppiano; con il periodo dimezzato la velocità raddoppia e l'accelerazione quadruplica.`}
			</Caption>

			<Controls>
				<Slider label="Raggio r (m)" value={r} min={0.5} max={R_MAX} step={0.1} onChange={setR} />
				<Slider label="Periodo T (s)" value={T} min={2} max={10} step={0.5} onChange={setT} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{playing ? 'Ferma' : 'Avvia'}
					</Button>
					{mode === 'radianti' && (
						<Button variant="secondary" size="sm" disabled={theta === 0} onClick={() => { setPlaying(false); setTheta(0); }}>
							<RotateCcw className="size-4" aria-hidden="true" />
							Azzera l’angolo
						</Button>
					)}
				</ButtonRow>
			</Controls>
		</Figure>
	);
}

export default function MotoCircolareAccelerazione({ alt }: { alt?: string }) {
	return <MotoCircolareFigura alt={alt} mode="accelerazione" />;
}

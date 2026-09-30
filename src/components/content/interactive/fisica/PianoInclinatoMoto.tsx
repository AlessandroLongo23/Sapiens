'use client';

import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, scale, polar, num, texNum, useFrameLoop, useReducedMotion, THICK } from '../kit';
import { Arrow, Block, Ground, Incline, Vector, blockCentre, onIncline, QTY } from '../fisica';

/**
 * Lesson 54 (Il moto lungo un piano inclinato): a block on an incline 2,0 m long, whose angle (0° to 45°) and
 * coefficient of kinetic friction (0 to 0,80) the student sets. The block is held at the top; a button gives it a push
 * of 1,0 m/s down the slope, and from then on it moves with a = g (sin α − μd cos α), the closed law of the lesson:
 * s = v0 t + a t²/2, v = v0 + a t. It speeds up if tan α > μd, keeps its speed if tan α = μd (to the hundredth, the
 * slider's step: then a is taken as zero), slows down and stops if tan α < μd, and stays stopped (μs ≥ μd). It stops
 * at the foot too. Under the incline a velocity-time graph traces v(t), a straight line whose slope is a.
 *
 * Drawn at 2,4 cm per metre of slope; forces from the block's centre at 0,025 cm per newton for a 5,0 kg block
 * (weight, the plane's reaction, kinetic friction while it moves), the acceleration in green beside the block.
 */

const G = 9.8;
const M = 5;
const S = 2.4; // drawing cm per metre
const L = 2.0; // slope, m
const LD = L * S;
const BW = 0.7, BH = 0.5; // block, drawing cm
const START = LD - BW / 2 - 0.25; // middle of the block's base, from the foot (cm)
const TRAVEL = (START - BW / 2 - 0.05) / S; // metres it can slide
const V0 = 1.0;
const KF = 0.025; // cm per newton
// The v-t graph under the incline: t from 0 to 2 s, v from 0 to 5 m/s.
const GO = v(0.4, -4.3);
const GT = 2.2; // cm per second
const GV = 0.5; // cm per m/s
const T_MAX = 2;
const f = frame(-1.35, LD + 0.9, -4.95, LD * Math.sin(Math.PI / 4) + 0.75);

type Run = { t: number; done: boolean };

export default function PianoInclinatoMoto({ alt }: { alt?: string }) {
	const [deg, setDeg] = useState(30);
	const [mu, setMu] = useState(0.3);
	const [run, setRun] = useState<Run | null>(null);
	const reduced = useReducedMotion();

	const alpha = (deg * Math.PI) / 180;
	const tan = Math.tan(alpha);
	const steady = Math.abs(tan - mu) < 0.005;
	const a = steady ? 0 : G * (Math.sin(alpha) - mu * Math.cos(alpha));
	/** When the run ends: at the foot, or when the block stops. */
	const tFoot = a === 0 ? TRAVEL / V0 : (-V0 + Math.sqrt(Math.max(0, V0 * V0 + 2 * a * TRAVEL))) / a;
	const tEnd = a < 0 && V0 * V0 + 2 * a * TRAVEL < 0 ? -V0 / a : tFoot;

	useFrameLoop(!!run && !run.done, (dt) => {
		setRun((r) => {
			if (!r) return r;
			const t = Math.min(tEnd, r.t + dt);
			return { t, done: t >= tEnd };
		});
	});

	const change = (set: (x: number) => void) => (x: number) => {
		setRun(null);
		set(x);
	};
	const push = () => setRun(reduced ? { t: tEnd, done: true } : { t: 0, done: false });

	const t = run?.t ?? 0;
	const s = run ? V0 * t + 0.5 * a * t * t : 0;
	const vel = run ? V0 + a * t : 0;
	const moving = !!run && !run.done;
	const stopped = !!run && run.done && a < 0 && tEnd < tFoot;

	const base = LD * Math.cos(alpha);
	const corner = v(base, 0);
	const { at, rotation } = onIncline(corner, base, alpha, START - s * S);
	const c = blockCentre(at, BH, rotation);
	const up = polar(1, alpha), out = polar(1, alpha + Math.PI / 2);
	const P = M * G, Fv = P * Math.cos(alpha), Fd = mu * Fv;
	// the acceleration, 0,25 cm per m/s², drawn inside the incline under the block, clear of the forces
	const accMid = add(at, scale(out, -0.4));
	const accHalf = scale(up, 0.125 * a);

	// the graph: the line from (0, v0) to (t, v)
	const gp = (tt: number, vv: number) => add(GO, v(tt * GT, vv * GV));
	const ticksT = [0.5, 1, 1.5, 2];
	const ticksV = [1, 2, 3, 4, 5];

	let caption: string;
	if (!run) caption = `Il blocco è tenuto fermo in cima al piano. tan α = ${num(tan, 2)} e μd = ${mu.toFixed(2).replace('.', ',')}: premi Spingi per lanciarlo in discesa a 1 m/s.`;
	else if (steady) caption = `tan α = μd: la componente del peso lungo il piano e l'attrito dinamico si bilanciano, e il blocco scende a velocità costante.`;
	else if (a > 0) caption = `tan α = ${num(tan, 2)} è maggiore di μd = ${mu.toFixed(2).replace('.', ',')}: la componente del peso vince l'attrito, e il blocco accelera di ${num(a, 2)} m/s².`;
	else if (stopped) caption = `tan α = ${num(tan, 2)} è minore di μd = ${mu.toFixed(2).replace('.', ',')}: l'attrito vince, il blocco rallenta di ${num(-a, 2)} m/s² e si ferma dopo ${num(s, 2)} m.`;
	else caption = `tan α = ${num(tan, 2)} è minore di μd = ${mu.toFixed(2).replace('.', ',')}: il blocco rallenta di ${num(-a, 2)} m/s², ma arriva in fondo prima di fermarsi.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{deg > 0 ? <Incline f={f} corner={corner} base={base} angle={alpha} /> : <Ground f={f} from={v(-0.3, 0)} to={v(LD + 0.3, 0)} />}
				{deg >= 8 && <Label f={f} at={polar(0.95, alpha / 2)} size={13}>α</Label>}
				<Block f={f} at={at} w={BW} h={BH} angle={rotation} />
				<Vector f={f} from={c} to={add(c, v(0, -P * KF))} color={QTY.forza} name="P" labelDir={v(-1, 0)} />
				<Vector f={f} from={c} to={add(c, scale(out, Fv * KF))} color={QTY.forza} name="F" sub="v" />
				{moving && Fd * KF > 0.05 && <Vector f={f} from={c} to={add(c, scale(up, Fd * KF))} color={QTY.forza} name="F" sub="d" labelDir={out} />}
				{moving && Math.abs(a) > 0.05 && (
					<Vector f={f} from={add(accMid, accHalf)} to={add(accMid, scale(accHalf, -1))} color={QTY.accelerazione} name="a" labelDir={scale(out, -1)} />
				)}

				{/* the velocity-time graph */}
				{ticksT.map((x) => (
					<path key={`gt${x}`} d={f.path([gp(x, 0), gp(x, 5)])} stroke="#d6d6d6" strokeWidth={0.3} fill="none" />
				))}
				{ticksV.map((y) => (
					<path key={`gv${y}`} d={f.path([gp(0, y), gp(T_MAX, y)])} stroke="#d6d6d6" strokeWidth={0.3} fill="none" />
				))}
				<Arrow f={f} from={add(GO, v(-0.15, 0))} to={gp(T_MAX + 0.25, 0)} weight="thin" />
				<Arrow f={f} from={add(GO, v(0, -0.15))} to={gp(0, 5.6)} weight="thin" />
				<Label f={f} at={gp(T_MAX + 0.25, 0)} dir={v(0, -1)} upright size={13}>
					<tspan fontStyle="italic">t</tspan> (s)
				</Label>
				<Label f={f} at={gp(0, 5.6)} dir={v(1, 0)} upright size={13}>
					<tspan fontStyle="italic">v</tspan> (m/s)
				</Label>
				{ticksT.map((x) => (
					<Label key={`lt${x}`} f={f} at={gp(x, 0)} dir={v(0, -1)} upright size={12}>{num(x, 1)}</Label>
				))}
				{ticksV.map((y) => (
					<Label key={`lv${y}`} f={f} at={gp(0, y)} dir={v(-1, 0)} upright size={12}>{String(y)}</Label>
				))}
				{run && <path d={f.path([gp(0, V0), gp(Math.min(t, T_MAX), Math.max(0, V0 + a * Math.min(t, T_MAX)))])} stroke={QTY.velocita} strokeWidth={THICK} fill="none" />}
				{run && t <= T_MAX && <circle cx={f.px(gp(t, Math.max(0, vel))).x} cy={f.px(gp(t, Math.max(0, vel))).y} r={2.5} fill={QTY.velocita} />}
			</Drawing>

			<Readout>
				<Tex>{`\\alpha = ${deg}^\\circ`}</Tex>
				<Tex>{`\\tan\\alpha = ${texNum(tan, 2)}`}</Tex>
				<Tex>{`\\mu_d = ${mu.toFixed(2).replace('.', '{,}')}`}</Tex>
				<Tex>{`a = g\\,(\\sin\\alpha - \\mu_d\\cos\\alpha) = ${texNum(a, 2)}\\,\\text{m/s}^2`}</Tex>
			</Readout>
			<Readout>
				<Tex>{`t = ${texNum(t, 2)}\\,\\text{s}`}</Tex>
				<Tex>{`v = ${texNum(Math.max(0, vel), 2)}\\,\\text{m/s}`}</Tex>
				<Tex>{`s = ${texNum(s, 2)}\\,\\text{m}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Inclinazione α" unit="°" value={deg} min={0} max={45} step={1} onChange={change(setDeg)} />
				<Slider label="Attrito dinamico μd" value={mu} min={0} max={0.8} step={0.01} onChange={change(setMu)} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={push} disabled={moving}>
						<Play className="size-4" aria-hidden="true" />
						Spingi
					</Button>
					<Button variant="secondary" size="sm" onClick={() => change(setMu)(Math.min(0.8, Math.round(tan * 100) / 100))} disabled={tan > 0.805}>
						μd = tan α
					</Button>
					<Button variant="secondary" size="sm" disabled={!run} onClick={() => setRun(null)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Rimetti in cima
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}

'use client';

import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, add, scale, num, texNum, useFrameLoop, useReducedMotion, TINT, THIN, DASH, DOTTED, type V } from '../kit';
import { Ball, Vector, VecLabel, QTY } from '../fisica';

/**
 * Lesson 84 (Gli urti elastici), in the plane: the white ball comes from the left at 2 m/s and hits a ball of the
 * same mass at rest, seen from above. The slider moves the white ball's line sideways, by a fraction s of the two
 * radii (0: head-on; near 1: a graze). With smooth equal balls the struck one leaves along the line of the centres,
 * at θ₂ below the incoming direction with sin θ₂ = s and V₂ = v₁ cos θ₂, and the white one at right angles to it, at
 * θ₁ = 90° − θ₂ with V₁ = v₁ sin θ₂: the two angles always add up to 90°. Uniform motion, 1,5 cm of drawing per
 * metre; velocities 0,8 cm per m/s.
 */

const V0 = 2; // m/s
const R = 0.3; // the balls' radius in the drawing, cm
const KS = 1.5, KV = 0.8;
const T0 = v(5.2, -0.3); // the ball at rest
const X_START = 1.0;
const f = frame(0, 10, -2.6, 2.6);
const deg = (x: number) => (x * 180) / Math.PI;

/** How long a ball at P with velocity (cm/s) w can run before the tip of its arrow (a) leaves the figure. */
function room(P: V, w: V, a: V) {
	let t = Infinity;
	const lim = (pos: number, vel: number, tip: number, lo: number, hi: number) => {
		if (vel > 1e-9) t = Math.min(t, (hi - pos - tip) / vel);
		if (vel < -1e-9) t = Math.min(t, (pos + tip - lo) / -vel);
	};
	lim(P.x, w.x, a.x, 0.3, 9.6);
	lim(P.y, w.y, a.y, -2.3, 2.2);
	return Math.max(0.2, t);
}

export default function BiliardoUrtoAngoli({ alt }: { alt?: string }) {
	const [s, setS] = useState(0.5);
	const [t, setT] = useState(0);
	const [running, setRunning] = useState(false);
	const reduced = useReducedMotion();

	const phi = Math.asin(s); // θ₂
	const d2 = v(Math.cos(phi), -Math.sin(phi)); // the struck ball's direction
	const d1 = v(Math.sin(phi), Math.cos(phi)); // the white ball's direction after the collision
	const V2 = V0 * Math.cos(phi), V1 = V0 * Math.sin(phi);
	const P1 = add(T0, scale(d2, -2 * R)); // the white ball's centre at the contact
	const tHit = (P1.x - X_START) / (V0 * KS);
	const after1 = room(P1, scale(d1, V1 * KS), scale(d1, V1 * KV + 0.45));
	const after2 = room(T0, scale(d2, V2 * KS), scale(d2, V2 * KV + 0.45));
	const END = tHit + Math.min(1.4, s > 0 ? after1 : Infinity, after2);

	useFrameLoop(running, (dt) => {
		const next = Math.min(END, t + dt);
		setT(next);
		if (next >= END) setRunning(false);
	});
	const reset = () => {
		setRunning(false);
		setT(0);
	};
	const play = () => {
		if (reduced) return setT(END);
		setT(0);
		setRunning(true);
	};

	const after = t >= tHit;
	const dtA = Math.max(0, t - tHit);
	const white = after ? add(P1, scale(d1, V1 * KS * dtA)) : v(X_START + V0 * KS * t, P1.y);
	const struck = after ? add(T0, scale(d2, V2 * KS * dtA)) : T0;
	const theta1 = 90 - deg(phi), theta2 = deg(phi);

	let caption: string;
	if (!after) caption = s === 0 ? 'Urto in pieno: la bianca punta al centro della boccia ferma. Premi Colpisci.' : 'La bianca passa di lato rispetto al centro della boccia ferma. Premi Colpisci.';
	else if (s === 0) caption = 'Urto in pieno: la bianca si ferma e la boccia colpita parte a 2 m/s, come in una dimensione.';
	else caption = `La bianca devia di ${num(theta1, 0)}° e la boccia colpita parte a ${num(theta2, 0)}° dall'altra parte: le due direzioni sono perpendicolari.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={f.path([v(0.2, P1.y), v(9.8, P1.y)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DOTTED} fill="none" />
				{after && s > 0 && <path d={f.path([P1, white])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />}
				{after && <path d={f.path([T0, struck])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />}
				{after && <path d={f.path([T0, v(T0.x + 1.6, T0.y)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DOTTED} fill="none" />}
				{after && s > 0 && dtA > 0.25 && (
					<>
						<path d={f.arc(P1, v(1, 0), d1, 0.6)} stroke="#000" strokeWidth={THIN} fill="none" />
						<VecLabel f={f} at={add(P1, scale(v(Math.cos((Math.PI / 2 - phi) / 2), Math.sin((Math.PI / 2 - phi) / 2)), 0.92))} name="θ" sub="1" bare size={13} />
						<path d={f.arc(T0, d2, v(1, 0), 0.6)} stroke="#000" strokeWidth={THIN} fill="none" />
						<VecLabel f={f} at={add(T0, scale(v(Math.cos(phi / 2), -Math.sin(phi / 2)), 0.92))} name="θ" sub="2" bare size={13} />
					</>
				)}
				<Ball f={f} at={struck} r={R} fill={TINT.orange} />
				<Ball f={f} at={white} r={R} fill="#fff" />
				{!after && <Vector f={f} from={white} to={add(white, v(V0 * KV, 0))} color={QTY.velocita} name="v" sub="1" labelDir={v(0, 1)} labelAt={0.6} />}
				{after && V1 > 0.05 && <Vector f={f} from={white} to={add(white, scale(d1, V1 * KV))} color={QTY.velocita} name="V" sub="1" />}
				{after && <Vector f={f} from={struck} to={add(struck, scale(d2, V2 * KV))} color={QTY.velocita} name="V" sub="2" />}
			</Drawing>

			<Readout>
				{s > 0 ? (
					<>
						<Tex>{`\\theta_1 = ${texNum(theta1, 0)}^\\circ`}</Tex>
						<Tex>{`\\theta_2 = ${texNum(theta2, 0)}^\\circ`}</Tex>
						<Tex>{'\\theta_1 + \\theta_2 = 90^\\circ'}</Tex>
					</>
				) : (
					<Tex>{'\\theta_2 = 0^\\circ'}</Tex>
				)}
				<Tex>{`V_1 = ${texNum(V1, 2)}\\,\\text{m/s}`}</Tex>
				<Tex>{`V_2 = ${texNum(V2, 2)}\\,\\text{m/s}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider
					label="Quanto di striscio (0 in pieno)"
					value={s}
					min={0}
					max={0.95}
					step={0.05}
					onChange={(x) => {
						setS(x);
						reset();
					}}
				/>
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play} disabled={running}>
						<Play className="size-4" aria-hidden="true" />
						Colpisci
					</Button>
					<Button variant="secondary" size="sm" disabled={t === 0} onClick={reset}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Da capo
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}

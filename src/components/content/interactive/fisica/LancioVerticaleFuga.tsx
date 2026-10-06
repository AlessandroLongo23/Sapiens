'use client';

import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, useFrameLoop, useReducedMotion, texNum, num, INK, TINT, THICK, THIN, DASH } from '../kit';
import { Arrow, Point, QTY } from '../fisica';
import { GM_T, R_T, km, kmText } from './gravita';

/**
 * Lesson 97 (L'energia potenziale gravitazionale e la velocità di fuga, group 37): a projectile fired straight up
 * from the Earth's surface at a speed the student sets, 2 to 12 km/s, without air. Above, the energy diagram per
 * kilogram: the curve U/m = −G M / r from the surface outwards, and the horizontal line of the total energy
 * E/m = v0²/2 − G M / R_T, drawn as far as the point where it meets the curve, which is the largest distance the
 * projectile reaches, r_max = −G M / (E/m). From 11,2 km/s the line is at or above zero and never meets the curve.
 * Below, on the same r axis, the Earth and the projectile; the button makes it rise and fall back, by steps of
 * r'' = −G M / r² written by hand, 1500 times faster than real.
 *
 * Drawn at 0,8 cm per Earth radius and 3 cm for G M / R_T = 62,5 MJ/kg.
 */

const SX = 0.8 / R_T; // centimetres per metre
const U0 = GM_T / R_T; // J/kg, 6,25·10^7
const SE = 3 / U0; // centimetres per J/kg
const SPEED = 1500;
const X_MAX = 8.3; // Earth radii shown
const Y_STRIP = -4.3;
const f = frame(-1.3, 7.2, -5.3, 1.0);
const curve = Array.from({ length: 121 }, (_, i) => {
	const n = 1 + ((X_MAX - 1) * i) / 120;
	return v(n * 0.8, -3 / n);
});

export default function LancioVerticaleFuga({ alt }: { alt?: string }) {
	const [kms, setKms] = useState(6);
	const [state, setState] = useState({ r: R_T, vr: 0 });
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();

	const v0 = kms * 1000;
	const E = (v0 * v0) / 2 - U0; // J/kg
	const bound = E < 0;
	const rMax = bound ? -GM_T / E : Infinity;
	const nMax = rMax / R_T;

	useFrameLoop(playing, (dt) => {
		let { r, vr } = state;
		const steps = 40;
		const h = (dt * SPEED) / steps;
		for (let i = 0; i < steps; i++) {
			vr -= (GM_T / (r * r)) * h;
			r += vr * h;
		}
		if (r <= R_T && vr < 0) {
			setPlaying(false);
			return setState({ r: R_T, vr: 0 });
		}
		if (r > (X_MAX + 0.6) * R_T) setPlaying(false);
		setState({ r, vr });
	});

	const change = (x: number) => {
		setPlaying(false);
		setState({ r: R_T, vr: 0 });
		setKms(x);
	};
	const launch = () => {
		if (reduced) return setState({ r: Math.min(rMax, (X_MAX + 0.6) * R_T), vr: 0 });
		setState({ r: R_T, vr: v0 });
		setPlaying(true);
	};

	const yE = E * SE;
	const xEnd = Math.min(nMax, X_MAX) * 0.8;
	const ball = v(state.r * SX, Y_STRIP);
	const moved = state.r > R_T * 1.0001;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* the energy diagram */}
				<Arrow f={f} from={v(-0.2, 0)} to={v(7.0, 0)} weight="thin" />
				<Arrow f={f} from={v(0, -3.4)} to={v(0, 0.85)} weight="thin" />
				<Label f={f} at={v(7.0, -0.05)} dir={v(0, -1)}>r</Label>
				<Label f={f} at={v(0.05, 0.85)} dir={v(1, 0)} upright size={11}>energia per kilogrammo (MJ/kg)</Label>
				{[-20, -40, -60].map((e) => (
					<g key={e}>
						<path d={f.path([v(-0.07, e * 1e6 * SE), v(0.07, e * 1e6 * SE)])} stroke="#000" strokeWidth={THIN} />
						<Label f={f} at={v(-0.07, e * 1e6 * SE)} dir={v(-1, 0)} upright size={11}>{`−${-e}`}</Label>
					</g>
				))}
				{[1, 2, 4, 6, 8].map((k) => (
					<g key={k}>
						<path d={f.path([v(k * 0.8, -0.07), v(k * 0.8, 0.07)])} stroke="#000" strokeWidth={THIN} />
						<Label f={f} at={v(k * 0.8, 0.05)} dir={v(0, 1)} upright size={11}>
							{k === 1 ? '' : k} R<tspan fontSize={8} dy={3}>T</tspan>
						</Label>
					</g>
				))}
				<path d={f.path(curve)} stroke={INK.blue} strokeWidth={THICK} fill="none" />
				<Label f={f} at={v(1.25, -2.75)} color={INK.blue}>U</Label>
				<path d={f.path([v(0.8, yE), v(xEnd, yE)])} stroke={INK.red} strokeWidth={THICK} fill="none" />
				<Label f={f} at={v(xEnd, yE)} dir={v(1, 0)} color={INK.red}>E</Label>
				<path d={f.path([v(0.8, -3), v(0.8, yE)])} stroke={QTY.velocita} strokeWidth={THICK} fill="none" />
				<Label f={f} at={v(0.8, (yE - 3) / 2)} dir={v(-1, 0)} color={QTY.velocita}>K</Label>
				{bound && nMax < X_MAX && (
					<>
						<Point f={f} at={v(xEnd, yE)} r={2.6} />
						<path d={f.path([v(xEnd, yE), v(xEnd, Y_STRIP)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
					</>
				)}
				{/* the Earth and the projectile, on the same r axis */}
				<path d={f.path([v(0, Y_STRIP), v(7.0, Y_STRIP)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<circle cx={f.px(v(0, Y_STRIP)).x} cy={f.px(v(0, Y_STRIP)).y} r={0.8 * (f.W / (f.x1 - f.x0))} fill={TINT.blue} stroke="#000" strokeWidth={THICK} />
				<Label f={f} at={v(0, Y_STRIP)} upright size={12}>Terra</Label>
				{!moved && <Arrow f={f} from={v(0.8, Y_STRIP)} to={v(0.8 + kms * 0.1, Y_STRIP)} color={QTY.velocita} />}
				<Point f={f} at={ball} r={3.2} />
			</Drawing>

			<Readout>
				<Tex>{`v_0 = ${texNum(kms, 1)}\\,\\text{km/s}`}</Tex>
				<Tex>{`\\dfrac{E}{m} = ${texNum(E / 1e6, 1)}\\,\\text{MJ/kg}`}</Tex>
				{bound ? (
					<>
						<Tex>{`r_{max} = ${texNum(nMax, nMax < 10 ? 2 : 0)}\\,R_T`}</Tex>
						<Tex>{`h_{max} = ${km((rMax - R_T) / 1000)}\\,\\text{km}`}</Tex>
					</>
				) : (
					<Tex>{`E \\ge 0`}</Tex>
				)}
			</Readout>
			<Caption>
				{bound
					? `A ${num(kms, 1)} km/s l'energia totale è negativa: il proiettile si ferma dove la retta rossa incontra la curva, a ${num(nMax, nMax < 10 ? 2 : 0)} raggi terrestri dal centro (${kmText((rMax - R_T) / 1000)} km di quota), e ricade.`
					: `A ${num(kms, 1)} km/s l'energia totale non è più negativa: la retta rossa non incontra la curva, e il proiettile non si ferma a nessuna distanza. Ha superato la velocità di fuga, 11,2 km/s.`}
			</Caption>

			<Controls>
				<Slider label="Velocità di lancio (km/s)" value={kms} min={2} max={12} step={0.1} onChange={change} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={launch} disabled={playing}>
						<Play className="size-4" aria-hidden="true" />
						Lancia
					</Button>
					<Button variant="secondary" size="sm" disabled={!moved} onClick={() => { setPlaying(false); setState({ r: R_T, vr: 0 }); }}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Riporta al suolo
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}

'use client';

import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, polar, useFrameLoop, useReducedMotion, texNum, num, TINT, THICK, DASH, type V } from '../kit';
import { Vector, Point, QTY } from '../fisica';
import { GM_T, R_T, km, kmText } from './gravita';

/**
 * Lesson 96 (Il moto dei satelliti, group 37): Newton's cannon. A projectile is fired horizontally from a mountain
 * 640 km high (r0 = 1,1 Earth radii, above the air) at a speed the student sets, 4 to 11 km/s. Its path is the conic
 * of the two-body problem, r(θ) = p / (1 + e cos θ) with θ from the launch point, p = (r0 v0)² / (G M) and
 * e = p / r0 − 1: negative e means the launch point is the farthest one (the projectile falls back if the nearest
 * point is under the ground), 0 the circle, between 0 and 1 an ellipse with the launch point as the nearest, 1 or
 * more an open curve. The whole path is drawn dashed, so the figure answers without pressing anything; the button
 * moves the projectile along it, by steps of dθ/dt = r0 v0 / r², a thousand times faster than real.
 *
 * Drawn at 1,2 cm per Earth radius; large ellipses leave the drawing and come back.
 */

const S = 1.2 / R_T; // centimetres per metre
const R0 = 1.1 * R_T;
const V_CIRC = Math.sqrt(GM_T / R0);
const V_ESC = Math.SQRT2 * V_CIRC;
const SPEED = 1000;
const f = frame(-3.2, 3.2, -4.3, 1.9);
const O = v(0, 0);

type Fate = 'cade' | 'cerchio' | 'ellisse' | 'fuga';

function orbit(v0: number) {
	const p = (R0 * v0) ** 2 / GM_T;
	const e = p / R0 - 1;
	const r = (th: number) => p / (1 + e * Math.cos(th));
	let fate: Fate = 'ellisse';
	let end = 2 * Math.PI;
	if (e >= 1) {
		fate = 'fuga';
		// Up to the angle where the projectile is 12 Earth radii away, well outside the drawing.
		end = Math.acos(Math.max(-1, (p / (12 * R_T) - 1) / e));
	} else if (e < 0 && p / (1 - e) < R_T) {
		fate = 'cade';
		end = Math.acos((p / R_T - 1) / e);
	} else if (Math.abs(v0 - V_CIRC) < 60) fate = 'cerchio';
	const at = (th: number): V => polar(r(th) * S, Math.PI / 2 - th);
	const a = p / (1 - e * e);
	return { p, e, r, fate, end, at, period: e < 1 ? 2 * Math.PI * Math.sqrt(a ** 3 / GM_T) : Infinity, far: e >= 0 && e < 1 ? p / (1 - e) : R0 };
}

export default function CannoneNewton({ alt }: { alt?: string }) {
	const [kms, setKms] = useState(6);
	const [theta, setTheta] = useState(0);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();

	const v0 = kms * 1000;
	const o = orbit(v0);

	useFrameLoop(playing, (dt) => {
		let th = theta;
		const steps = 20;
		const h = (dt * SPEED) / steps;
		for (let i = 0; i < steps; i++) th += ((R0 * v0) / o.r(th) ** 2) * h;
		if (o.fate === 'cade' || o.fate === 'fuga') {
			if (th >= o.end) {
				th = o.end;
				setPlaying(false);
			}
		}
		setTheta(th);
	});

	const change = (x: number) => {
		setPlaying(false);
		setTheta(0);
		setKms(x);
	};
	const launch = () => {
		if (reduced) return setTheta(o.fate === 'cade' || o.fate === 'fuga' ? o.end : Math.PI);
		setTheta(0);
		setPlaying(true);
	};

	const path = Array.from({ length: 181 }, (_, i) => o.at((o.end * i) / 180));
	const top = v(0, R0 * S);
	const ball = o.at(theta);
	const range = o.fate === 'cade' ? R_T * o.end : 0;
	const hours = o.period / 3600;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<circle cx={f.px(O).x} cy={f.px(O).y} r={R_T * S * (f.W / (f.x1 - f.x0))} fill={TINT.blue} stroke="#000" strokeWidth={THICK} />
				<Label f={f} at={O} upright>Terra</Label>
				<path d={f.path([v(-0.1, 1.196), top, v(0.1, 1.196)])} fill={TINT.gray} stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
				<path d={f.path(path)} stroke={o.fate === 'cerchio' ? QTY.risultante : QTY.vettore} strokeWidth={THICK} strokeDasharray={DASH} fill="none" />
				{theta === 0 && <Vector f={f} from={top} to={v(kms * 0.13, top.y)} color={QTY.velocita} name="v" labelDir={v(0, 1)} />}
				<Point f={f} at={ball} r={3.2} />
			</Drawing>

			<Readout>
				<Tex>{`v_0 = ${texNum(kms, 1)}\\,\\text{km/s}`}</Tex>
				<Tex>{`\\sqrt{\\dfrac{G M_T}{r}} = ${texNum(V_CIRC / 1000, 1)}\\,\\text{km/s}`}</Tex>
				{o.fate === 'cade' && <Tex>{`\\text{arco al suolo} = ${km(range / 1000)}\\,\\text{km}`}</Tex>}
				{(o.fate === 'ellisse' || o.fate === 'cerchio') && <Tex>{`T = ${hours < 3 ? `${texNum(o.period / 60, 0)}\\,\\text{min}` : `${texNum(hours, 1)}\\,\\text{h}`}`}</Tex>}
			</Readout>
			<Caption>
				{o.fate === 'cade'
					? `A ${num(kms, 1)} km/s il proiettile ricade: tocca il suolo dopo aver sorvolato ${kmText(range / 1000)} km di superficie.`
					: o.fate === 'cerchio'
						? `A ${num(kms, 1)} km/s il proiettile scende di quanto si incurva la Terra: l'orbita è una circonferenza, e il proiettile torna al cannone dopo ${num(o.period / 60, 0)} minuti.`
						: o.fate === 'ellisse'
							? kms * 1000 < V_CIRC
								? `A ${num(kms, 1)} km/s il proiettile sfiora il suolo dall'altra parte della Terra senza toccarlo: l'orbita è un'ellisse, e il cannone è il suo punto più lontano.`
								: `A ${num(kms, 1)} km/s l'orbita è un'ellisse: il cannone è il punto più vicino alla Terra, e quello più lontano è a ${num(o.far / R_T, 1)} raggi terrestri dal centro.`
							: `A ${num(kms, 1)} km/s il proiettile supera la velocità di fuga da quella quota, ${num(V_ESC / 1000, 1)} km/s: si allontana e non torna.`}
			</Caption>

			<Controls>
				<Slider label="Velocità di lancio (km/s)" value={kms} min={4} max={11} step={0.1} onChange={change} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={launch} disabled={playing}>
						<Play className="size-4" aria-hidden="true" />
						Lancia
					</Button>
					<Button variant="secondary" size="sm" disabled={theta === 0} onClick={() => { setPlaying(false); setTheta(0); }}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricarica
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}

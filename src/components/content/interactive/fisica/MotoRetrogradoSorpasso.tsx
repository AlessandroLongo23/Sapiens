'use client';

import { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, sub, scale, unit, len, polar, useFrameLoop, useReducedMotion, texNum, K, THIN, DASH, TINT, INK } from '../kit';
import { Arrow, Ball, QTY } from '../fisica';

/**
 * Lesson 92 (Dal sistema tolemaico al sistema copernicano), group 36: the retrograde motion of Mars as an overtaking.
 * The Sun is at the centre, the Earth (1 AU, 365,25 days) and Mars (1,52 AU, 687 days) on circular orbits, both
 * counterclockwise; on day 150 they are lined up with the Sun (opposition), pointing up. The line of sight from the
 * Earth through Mars gives the direction in which Mars is seen; the strip at the top stands for the fixed stars, so
 * far away that only that direction counts: the dot is at 0,08 cm per degree from the direction of the opposition,
 * to the left when the direction turns counterclockwise (direct motion). The trace climbs a little with time, so
 * that the way back does not cover the way out: it draws the Z of the lesson's first figure, orange where the motion
 * is retrograde (from 36,5 days before the opposition to 36,5 days after).
 */

const RE = 1.2;
const RM = RE * 1.52;
const T_E = 365.25;
const T_M = 687;
const OPP = 150;
const DAYS = 300;
const SKY = 3.0; // the strip's middle line
const DEG = 0.08; // cm of strip per degree
const f = frame(-3.45, 3.45, -2.1, 3.95);
const PLAY = 20; // days per second

const earth = (t: number) => polar(RE, Math.PI / 2 + (2 * Math.PI * (t - OPP)) / T_E);
const mars = (t: number) => polar(RM, Math.PI / 2 + (2 * Math.PI * (t - OPP)) / T_M);
/** The direction of Mars seen from the Earth, in degrees from the direction of the opposition (counterclockwise). */
const direction = (t: number) => {
	const d = sub(mars(t), earth(t));
	return (Math.atan2(d.y, d.x) * 180) / Math.PI - 90;
};
const onSky = (t: number) => v(-direction(t) * DEG, SKY + ((t - OPP) / OPP) * 0.3);
const STARS = [v(-2.9, 3.35), v(-2.1, 2.72), v(-1.2, 3.42), v(-0.2, 2.62), v(0.9, 3.4), v(1.7, 2.75), v(2.6, 3.3), v(3.0, 2.68)];

export default function MotoRetrogradoSorpasso({ alt }: { alt?: string }) {
	const [day, setDay] = useState(90);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();

	useFrameLoop(playing, (dt) => {
		const next = day + PLAY * dt;
		if (next >= DAYS) {
			setDay(DAYS);
			setPlaying(false);
		} else setDay(next);
	});
	const play = () => {
		if (reduced) return setDay((d) => (d >= DAYS ? 0 : Math.min(DAYS, d + 30)));
		if (!playing && day >= DAYS) setDay(0);
		setPlaying((p) => !p);
	};

	const O = v(0, 0);
	const E = earth(day);
	const M = mars(day);
	const u = unit(sub(M, E));
	const retro = direction(day + 0.5) < direction(day - 0.5);
	const n = Math.max(1, Math.round(day / 2));
	const trace = Array.from({ length: n + 1 }, (_, i) => (day * i) / n);
	const back = trace.filter((t) => direction(t + 0.5) < direction(t - 0.5));
	const dot = onSky(day);
	const gap = len(sub(M, E)) / RE;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={f.path([v(-3.3, SKY - 0.55), v(3.3, SKY - 0.55), v(3.3, SKY + 0.55), v(-3.3, SKY + 0.55)], true)} fill={TINT.gray} opacity={0.5} stroke="none" />
				{STARS.map((s, i) => (
					<circle key={i} cx={f.px(s).x} cy={f.px(s).y} r={1.2} fill={INK.gray} />
				))}
				<Label f={f} at={v(0, SKY + 0.55)} dir={v(0, 1)} upright size={13}>stelle fisse</Label>
				<path d={f.path(trace.map(onSky))} stroke={QTY.velocita} strokeWidth={1.5} fill="none" />
				{back.length > 1 && <path d={f.path(back.map(onSky))} stroke={QTY.risultante} strokeWidth={2.4} fill="none" />}
				<circle cx={f.px(dot).x} cy={f.px(dot).y} r={3.2} fill={retro ? QTY.risultante : QTY.velocita} />

				<circle cx={f.px(O).x} cy={f.px(O).y} r={RE * K} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
				<circle cx={f.px(O).x} cy={f.px(O).y} r={RM * K} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
				<Arrow f={f} from={E} to={add(M, scale(u, 0.7))} color={INK.blue} weight="thin" />
				<Ball f={f} at={O} r={0.15} fill={TINT.yellow} />
				<Label f={f} at={v(0, -0.15)} dir={v(0, -1)}>S</Label>
				<Ball f={f} at={E} r={0.1} />
				<Label f={f} at={E} dir={scale(unit(E), -1.1)}>T</Label>
				<Ball f={f} at={M} r={0.085} fill={TINT.red} />
				<Label f={f} at={M} dir={v(u.y, -u.x)}>M</Label>
			</Drawing>

			<Readout>
				<Tex>{`t = ${texNum(day, 0)}\\,\\text{d}`}</Tex>
				<Tex>{`\\text{distanza Terra-Marte} = ${texNum(gap, 2)}\\,\\text{UA}`}</Tex>
			</Readout>
			<Caption>
				{retro
					? 'La Terra sta superando Marte: la direzione in cui lo si vede torna indietro tra le stelle. Il moto apparente è retrogrado, e Marte è vicino alla Terra.'
					: day < OPP
						? 'La Terra, più veloce, si avvicina a Marte. La direzione in cui lo si vede avanza tra le stelle, verso sinistra: moto diretto.'
						: 'La Terra ha superato Marte e se ne allontana: la direzione in cui lo si vede ha ripreso ad avanzare verso sinistra. Moto diretto.'}
			</Caption>

			<Controls>
				<Slider label="Giorno t" value={Math.round(day)} min={0} max={DAYS} step={1} onChange={(x) => { setPlaying(false); setDay(x); }} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{playing ? 'Ferma' : 'Avvia'}
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}

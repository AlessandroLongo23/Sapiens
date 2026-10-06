'use client';

import { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, scale, unit, useFrameLoop, useReducedMotion, texNum, num, THICK, THIN, DASH, TINT } from '../kit';
import { Ball, Vector, QTY } from '../fisica';

/**
 * Lesson 93 (Le leggi di Keplero), group 36: an elliptical orbit with the Sun in the left focus, cut into twelve
 * sectors that the planet sweeps in equal times (second law). The semi-major axis is fixed (2,6 cm, standing for
 * 1 AU, so the period is one year) and the student sets the eccentricity from 0 to 0,8. The planet follows Kepler's
 * equation M = E − e sin E, solved by Newton's method: position (−a cos E, −b sin E), counterclockwise from the
 * perihelion on the left. The sector the planet is in is orange, the others alternate blue and empty; all have the
 * area π a b / 12. The velocity is drawn tangent, 0,6 cm for the speed of the circular orbit (29,8 km/s), from
 * v² = v₀² (2a/r − 1). One turn takes 12 seconds.
 */

const A = 2.6;
const N = 12;
const V0 = 29.8; // km/s on the circular orbit of 1 AU
const KV = 0.6;
const TURN = 12;
const f = frame(-3.3, 3.3, -3.0, 3.0);

/** The eccentric anomaly for the mean anomaly M. */
function eccentric(M: number, e: number) {
	let E = M + e * Math.sin(M);
	for (let i = 0; i < 20; i++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
	return E;
}

export default function OrbitaAree({ alt }: { alt?: string }) {
	const [e, setE] = useState(0.5);
	const [M, setM] = useState(0.35);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();

	useFrameLoop(playing, (dt) => setM((m) => (m + (2 * Math.PI * dt) / TURN) % (2 * Math.PI)));
	const play = () => {
		if (reduced) return setM((m) => (m + (2 * Math.PI) / N) % (2 * Math.PI));
		setPlaying((p) => !p);
	};

	const b = A * Math.sqrt(1 - e * e);
	const c = A * e;
	const S = v(-c, 0);
	const at = (E: number) => v(-A * Math.cos(E), -b * Math.sin(E));
	const E = eccentric(M, e);
	const P = at(E);
	const r = 1 - e * Math.cos(E); // in AU
	const speed = V0 * Math.sqrt(2 / r - 1);
	const tangent = unit(v(A * Math.sin(E), -b * Math.cos(E)));
	const current = Math.min(N - 1, Math.floor((M / (2 * Math.PI)) * N));
	const sectors = Array.from({ length: N }, (_, k) => {
		const E0 = eccentric((2 * Math.PI * k) / N, e);
		const E1 = k === N - 1 ? 2 * Math.PI : eccentric((2 * Math.PI * (k + 1)) / N, e);
		return [S, ...Array.from({ length: 25 }, (_, i) => at(E0 + ((E1 - E0) * i) / 24))];
	});
	const orbit = Array.from({ length: 181 }, (_, i) => at((2 * Math.PI * i) / 180));

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{sectors.map((pts, k) => (
					<path key={k} d={f.path(pts, true)} fill={k === current ? TINT.orange : k % 2 ? TINT.blue : 'none'} stroke="#000" strokeWidth={0.3} />
				))}
				<path d={f.path(orbit, true)} stroke="#000" strokeWidth={THICK} fill="none" />
				<path d={f.path([S, P])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<Ball f={f} at={S} r={0.16} fill={TINT.yellow} />
				<Vector f={f} from={P} to={add(P, scale(tangent, (speed / V0) * KV))} color={QTY.velocita} name="v" />
				<Ball f={f} at={P} r={0.1} />
				<Label f={f} at={v(-A, 0)} dir={v(-1, 0)} upright size={12}>P</Label>
				<Label f={f} at={v(A, 0)} dir={v(1, 0)} upright size={12}>A</Label>
			</Drawing>

			<Readout>
				<Tex>{`e = ${texNum(e, 2)}`}</Tex>
				<Tex>{`r = ${texNum(r, 2)}\\,\\text{UA}`}</Tex>
				<Tex>{`v = ${texNum(speed, 1)}\\,\\text{km/s}`}</Tex>
			</Readout>
			<Caption>
				{e < 0.001
					? 'Orbita circolare: i dodici settori sono spicchi uguali e la velocità non cambia.'
					: `I dodici settori hanno la stessa area e il pianeta li percorre nello stesso tempo, un mese ciascuno. Al perielio P dista ${num(1 - e, 2)} UA dal Sole e va a ${num(V0 * Math.sqrt((1 + e) / (1 - e)), 1)} km/s; all'afelio A dista ${num(1 + e, 2)} UA e va a ${num(V0 * Math.sqrt((1 - e) / (1 + e)), 1)} km/s.`}
			</Caption>

			<Controls>
				<Slider label="Eccentricità e" value={e} min={0} max={0.8} step={0.05} onChange={setE} />
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

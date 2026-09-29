'use client';

import { useState } from 'react';
import { Play, Pause, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, polar, useFrameLoop, useReducedMotion, THIN, DASH } from '../kit';
import { Ground, Thread, Ball } from '../fisica';

/**
 * Lesson "Il metodo sperimentale", example 1: a pendulum whose length, mass and amplitude the student changes one at
 * a time, recording each trial in a table. The period is the small-oscillation law with its first correction for the
 * amplitude, T = 2π √(L/g) (1 + θ₀²/16), g = 9,8 m/s²: with the thread of 1 m it gives 2,01 s at 5° and 10° and
 * 2,02 s at 20°, the numbers of the lesson; the mass never enters. The swing is θ₀ cos(2πt/T), in real time.
 *
 * Drawn at 3 cm per metre of thread, the ceiling hatched like the lessons' `Ground` (drawn right to left, so the
 * ticks go up), the ball's size growing with the cube root of its mass.
 */

const G = 9.8;
const S = 3; // centimetres of drawing per metre of thread
const L_MAX = 1.2;
const f = frame(-2.3, 2.3, -(L_MAX * S + 0.55), 0.45);
const PIVOT = v(0, 0);

const period = (L: number, deg: number) => {
	const t = (deg * Math.PI) / 180;
	return 2 * Math.PI * Math.sqrt(L / G) * (1 + (t * t) / 16);
};

type Trial = { L: number; m: number; deg: number; T: number };

export default function PendoloPeriodo({ alt }: { alt?: string }) {
	const [L, setL] = useState(1);
	const [m, setM] = useState(100);
	const [deg, setDeg] = useState(10);
	const [playing, setPlaying] = useState(false);
	const [t, setT] = useState(0);
	const [trials, setTrials] = useState<Trial[]>([]);
	const reduced = useReducedMotion();

	const T = period(L, deg);
	useFrameLoop(playing, (dt) => setT((x) => x + dt));

	const change = (set: (x: number) => void) => (x: number) => {
		setPlaying(false);
		setT(0);
		set(x);
	};
	const toggle = () => {
		if (playing) {
			setPlaying(false);
			setT(0);
		} else if (!reduced) setPlaying(true);
	};
	const record = () => setTrials((xs) => [...xs, { L, m, deg, T }].slice(-6));

	const theta0 = (deg * Math.PI) / 180;
	const theta = playing ? theta0 * Math.cos((2 * Math.PI * t) / T) : theta0;
	const r = 0.12 + 0.13 * Math.cbrt(m / 500);
	const bob = add(PIVOT, polar(L * S, -Math.PI / 2 + theta));
	const labelAt = add(PIVOT, polar(L * S * 0.62, -Math.PI / 2 + theta0));

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(1.3, 0)} to={v(-1.3, 0)} />
				<path d={f.path([PIVOT, v(0, -L * S - 0.35)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.6} />
				{!playing && (
					<>
						<path d={f.arc(PIVOT, v(0, -1), polar(1, -Math.PI / 2 + theta0), 0.9)} stroke="#000" strokeWidth={THIN} fill="none" />
						<Label f={f} at={add(PIVOT, polar(0.9, -Math.PI / 2 + theta0))} dir={v(1, 0)} upright size={13}>
							{`${deg}°`}
						</Label>
						<Label f={f} at={labelAt} dir={v(1, 0)}>
							L
						</Label>
					</>
				)}
				<Thread f={f} from={PIVOT} to={bob} />
				<Ball f={f} at={bob} r={r} />
				<circle cx={f.px(PIVOT).x} cy={f.px(PIVOT).y} r={2} fill="#000" />
			</Drawing>

			<Readout>
				<span>
					<Tex>{`L = ${L.toFixed(2).replace('.', '{,}')}\\,\\text{m}`}</Tex>
				</span>
				<span>
					<Tex>{`m = ${m}\\,\\text{g}`}</Tex>
				</span>
				<span>
					ampiezza {deg}°
				</span>
				<span className="font-medium">
					periodo <Tex>{`T = ${T.toFixed(2).replace('.', '{,}')}\\,\\text{s}`}</Tex>
				</span>
			</Readout>

			{trials.length > 0 && (
				<table className="border-collapse text-sm text-fg">
					<thead>
						<tr className="border-b border-edge text-fg-muted">
							<th className="px-2 py-1 font-normal">prova</th>
							<th className="px-2 py-1 font-normal">L (m)</th>
							<th className="px-2 py-1 font-normal">m (g)</th>
							<th className="px-2 py-1 font-normal">ampiezza</th>
							<th className="px-2 py-1 font-normal">T (s)</th>
						</tr>
					</thead>
					<tbody>
						{trials.map((x, i) => (
							<tr key={i} className="border-b border-edge-soft text-center tabular-nums">
								<td className="px-2 py-0.5">{i + 1}</td>
								<td className="px-2 py-0.5">{x.L.toFixed(2).replace('.', ',')}</td>
								<td className="px-2 py-0.5">{x.m}</td>
								<td className="px-2 py-0.5">{x.deg}°</td>
								<td className="px-2 py-0.5">{x.T.toFixed(2).replace('.', ',')}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}

			<Caption>
				{trials.length === 0
					? 'Cambia una grandezza alla volta e registra ogni prova: così sai quale delle tre fa cambiare il periodo.'
					: 'Confronta due prove in cui è cambiata una sola grandezza: la massa non cambia il periodo, la lunghezza sì.'}
			</Caption>

			<Controls>
				<Slider label="Lunghezza L" unit="m" value={L} min={0.2} max={L_MAX} step={0.05} onChange={change(setL)} />
				<Slider label="Massa m" unit="g" value={m} min={50} max={500} step={50} onChange={change(setM)} />
				<Slider label="Ampiezza" unit="°" value={deg} min={5} max={20} step={1} onChange={change(setDeg)} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={toggle} disabled={reduced}>
						{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{playing ? 'Ferma' : 'Avvia'}
					</Button>
					<Button variant="secondary" size="sm" onClick={record}>
						<Plus className="size-4" aria-hidden="true" />
						Registra la prova
					</Button>
					<Button variant="secondary" size="sm" disabled={trials.length === 0} onClick={() => setTrials([])}>
						<Trash2 className="size-4" aria-hidden="true" />
						Cancella
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}

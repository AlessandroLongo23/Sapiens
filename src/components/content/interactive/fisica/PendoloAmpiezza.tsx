'use client';

import { useMemo, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, polar, useFrameLoop, useReducedMotion, THIN, DASH } from '../kit';
import { Ground, Thread, Ball } from '../fisica';

/**
 * Lesson 58 (Il pendolo e la molla): a simple pendulum whose length (0,2 to 2,0 m), mass (50 to 500 g) and amplitude
 * (5° to 80°) the student sets. Built on PendoloPeriodo.tsx of lesson 01 (which uses the small-angle law with its
 * first correction), but here the swing comes from a hand-written integration step with no small-angle
 * approximation: θ'' = −(g/l) sin θ, one fourth-order Runge-Kutta step every millisecond. The period is found the
 * same way, by integrating from the release (ω = 0) to the next turning point (ω = 0 again), half a period; the
 * readout compares it with 2π √(l/g) and gives the difference in percent, which grows with the amplitude (0,2 % at
 * 10°, 7,3 % at 60°, as the table of the lesson). The mass never enters. The swing plays in real time, and a counter
 * times the oscillations as they happen, from one turning point on the right to the next.
 *
 * Drawn at 1,8 cm per metre of thread; the ball grows with the cube root of its mass.
 */

const G = 9.8;
const S = 1.8;
const H = 0.001; // integration step, s
const f = frame(-3.95, 3.95, -2.0 * S - 0.45, 0.5);

/** One Runge-Kutta step of θ'' = −(g/l) sin θ. */
function step(th: number, om: number, l: number, h: number): [number, number] {
	const k = G / l;
	const a = (x: number) => -k * Math.sin(x);
	const k1t = om, k1o = a(th);
	const k2t = om + (h / 2) * k1o, k2o = a(th + (h / 2) * k1t);
	const k3t = om + (h / 2) * k2o, k3o = a(th + (h / 2) * k2t);
	const k4t = om + h * k3o, k4o = a(th + h * k3t);
	return [th + (h / 6) * (k1t + 2 * k2t + 2 * k3t + k4t), om + (h / 6) * (k1o + 2 * k2o + 2 * k3o + k4o)];
}

/** The period from the integration: from the release to the next turning point is half of it. */
function periodOf(l: number, theta0: number) {
	let th = theta0, om = 0, t = 0;
	for (;;) {
		const [t1, o1] = step(th, om, l, H);
		if (o1 >= 0 && t > 0.01) {
			// ω went from negative to zero between t and t + H: interpolate
			return 2 * (t + (H * -om) / (o1 - om));
		}
		th = t1;
		om = o1;
		t += H;
	}
}

export default function PendoloAmpiezza({ alt }: { alt?: string }) {
	const [l, setL] = useState(1);
	const [m, setM] = useState(200);
	const [deg, setDeg] = useState(10);
	const [playing, setPlaying] = useState(false);
	// the simulation lives in a ref, stepped on each frame; `view` is what the render shows
	const sim = useRef({ th: (10 * Math.PI) / 180, om: 0, t: 0, count: 0, spare: 0 });
	const [view, setView] = useState({ th: (10 * Math.PI) / 180, t: 0, count: 0 });
	const reduced = useReducedMotion();

	const theta0 = (deg * Math.PI) / 180;
	const T0 = 2 * Math.PI * Math.sqrt(l / G);
	const T = useMemo(() => periodOf(l, theta0), [l, theta0]);
	const diff = ((T - T0) / T0) * 100;

	useFrameLoop(playing, (dt) => {
		const s0 = sim.current;
		s0.spare += dt;
		while (s0.spare >= H) {
			const [t1, o1] = step(s0.th, s0.om, l, H);
			// a turning point on the release side (θ > 0, ω from positive to not positive) closes an oscillation
			if (s0.th > 0 && s0.om > 0 && o1 <= 0) s0.count += 1;
			s0.th = t1;
			s0.om = o1;
			s0.t += H;
			s0.spare -= H;
		}
		setView({ th: s0.th, t: s0.t, count: s0.count });
	});

	const release = (x: number) => {
		sim.current = { th: x, om: 0, t: 0, count: 0, spare: 0 };
		setView({ th: x, t: 0, count: 0 });
	};
	const onLength = (x: number) => {
		setPlaying(false);
		setL(x);
		release(theta0);
	};
	const onMass = (x: number) => {
		setPlaying(false);
		setM(x);
		release(theta0);
	};
	const onAmplitude = (x: number) => {
		setPlaying(false);
		setDeg(x);
		release((x * Math.PI) / 180);
	};
	const toggle = () => {
		release(theta0);
		if (playing) setPlaying(false);
		else if (!reduced) setPlaying(true);
	};

	const theta = playing ? view.th : theta0;
	const pivot = v(0, 0);
	const bob = add(pivot, polar(l * S, -Math.PI / 2 + theta));
	const r = 0.1 + 0.12 * Math.cbrt(m / 500);
	const fmt = (x: number, d = 2) => x.toFixed(d).replace('.', '{,}');

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(1.4, 0)} to={v(-1.4, 0)} />
				<path d={f.path([pivot, v(0, -l * S - 0.3)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.6} />
				<path d={f.arc(pivot, polar(1, -Math.PI / 2 - theta0), polar(1, -Math.PI / 2 + theta0), l * S)} stroke="#000" strokeWidth={THIN} strokeDasharray="0.6 2.4" fill="none" opacity={0.7} />
				{!playing && (
					<>
						<path d={f.arc(pivot, v(0, -1), polar(1, -Math.PI / 2 + theta0), 0.7)} stroke="#000" strokeWidth={THIN} fill="none" />
						<Label f={f} at={add(pivot, polar(0.75, -Math.PI / 2 + theta0 / 2))} dir={v(0.3, -1)} upright size={12}>
							{`${deg}°`}
						</Label>
					</>
				)}
				<Thread f={f} from={pivot} to={bob} />
				<Ball f={f} at={bob} r={r} />
				<circle cx={f.px(pivot).x} cy={f.px(pivot).y} r={2} fill="#000" />
			</Drawing>

			<Readout>
				<Tex>{`l = ${fmt(l)}\\,\\text{m}`}</Tex>
				<Tex>{`m = ${m}\\,\\text{g}`}</Tex>
				<span>ampiezza {deg}°</span>
			</Readout>
			<Readout>
				<span className="font-medium">
					periodo <Tex>{`T = ${fmt(T, 3)}\\,\\text{s}`}</Tex>
				</span>
				<Tex>{`2\\pi\\sqrt{l/g} = ${fmt(T0, 3)}\\,\\text{s}`}</Tex>
				<span>
					differenza <Tex>{`${fmt(diff, 1)}\\,\\%`}</Tex>
				</span>
			</Readout>
			{playing && (
				<Readout>
					<span>
						<Tex>{`t = ${fmt(view.t, 1)}\\,\\text{s}`}</Tex>, oscillazioni complete: {view.count}
					</span>
				</Readout>
			)}
			<Caption>
				{deg <= 20
					? `Con ${deg}° la formula delle piccole oscillazioni sbaglia di meno dell'1 %. Cambia la massa: il periodo non si muove. Cambia la lunghezza: con un filo quattro volte più lungo il periodo raddoppia.`
					: `Con ${deg}° l'approssimazione sin θ ≈ θ non vale più: il pendolo impiega il ${diff.toFixed(1).replace('.', ',')} % di tempo in più di quanto dice 2π√(l/g).`}
			</Caption>

			<Controls>
				<Slider label="Lunghezza l" unit="m" value={l} min={0.2} max={2} step={0.05} onChange={onLength} />
				<Slider label="Massa m" unit="g" value={m} min={50} max={500} step={50} onChange={onMass} />
				<Slider label="Ampiezza" unit="°" value={deg} min={5} max={80} step={1} onChange={onAmplitude} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={toggle} disabled={reduced}>
						{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{playing ? 'Ferma' : 'Lascia andare'}
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}

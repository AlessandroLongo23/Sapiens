'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, num, texNum, useFrameLoop, useReducedMotion, THICK, DASH, type V } from '../kit';
import { Axes, Block, Ground, Vector, QTY } from '../fisica';

/**
 * Lesson 19 (Le forze di attrito): a block of 5 kg on a level floor, pushed to the right by a horizontal force F that
 * the student raises with a slider (or lets grow by itself). The model of the lesson, in closed form: F⊥ = mg; while
 * the block is still, the static friction equals F, up to μs F⊥; once F goes past it the block slides and the friction
 * is μd F⊥ whatever F is; if F drops under μd F⊥ the sliding block stops (at once: the deceleration is the next
 * year's topic) and static friction takes over again. Under the block, the graph of the friction against F is drawn
 * as the student goes: the diagonal while still, the drop at μs F⊥, the flat line while sliding.
 * The sliding is shown by the floor running backwards under the block, at a steady pace (no dynamics).
 */

const M = 5;
const G = 9.8;
const FN = M * G; // 49 N
const MAX_F = 40;
type Pair = 'a' | 'b';
const PAIRS: Record<Pair, { mus: number; mud: number; label: string }> = {
	a: { mus: 0.4, mud: 0.3, label: 'μs 0,40, μd 0,30' },
	b: { mus: 0.62, mud: 0.48, label: 'legno su legno' }
};

const f = frame(-3.3, 3.75, -5.25, 1.25);
const K = 0.07; // arrow cm per newton
const BW = 1, BH = 0.7;
// the graph: origin, and cm per newton on each axis
const O = v(-2.6, -4.55);
const GX = 0.14, GY = 0.08;
const gp = (F: number, a: number): V => add(O, v(F * GX, a * GY));
const PACE = 1.6; // cm/s of the floor under a sliding block
const RAMP = 5; // N/s when the force grows by itself

export default function AttritoBloccoSpinta({ alt }: { alt?: string }) {
	const [pair, setPair] = useState<Pair>('a');
	const [F, setF] = useState(0);
	const [sliding, setSliding] = useState(false);
	const [trace, setTrace] = useState<V[]>([v(0, 0)]);
	const [shift, setShift] = useState(0);
	const [ramping, setRamping] = useState(false);
	const reduced = useReducedMotion();
	const { mus, mud } = PAIRS[pair];
	const smax = mus * FN, fd = mud * FN;

	/** The new state for a force x, from the current one, and the points it adds to the graph. */
	const apply = (x: number) => {
		x = Math.min(MAX_F, Math.max(0, x));
		const pts: V[] = [];
		let s = sliding;
		if (!s && x > smax + 1e-9) {
			s = true;
			pts.push(v(smax, smax), v(smax, fd), v(x, fd));
		} else if (s && x < fd - 1e-9) {
			s = false;
			pts.push(v(x, x));
		} else pts.push(v(x, s ? fd : x));
		setF(x);
		setSliding(s);
		setTrace((t) => [...t, ...pts].slice(-400));
	};
	const reset = (p: Pair = pair) => {
		setPair(p);
		setF(0);
		setSliding(false);
		setTrace([v(0, 0)]);
		setRamping(false);
	};

	useFrameLoop(sliding && !reduced, (dt) => setShift((s) => (s + PACE * dt) % 0.15));
	useFrameLoop(ramping, (dt) => {
		const next = F + RAMP * dt;
		apply(next);
		if (next >= MAX_F) setRamping(false);
	});

	const friction = sliding ? fd : F;
	const c = v(0, BH / 2);
	const kind = sliding ? 'd' : 's';

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(-3.6 - shift, 0)} to={v(3.9 - shift, 0)} />
				<Block f={f} at={v(0, 0)} w={BW} h={BH} />
				{F > 0.01 && <Vector f={f} from={c} to={add(c, v(F * K, 0))} color={QTY.forza} name="F" />}
				{friction > 0.01 && <Vector f={f} from={c} to={add(c, v(-friction * K, 0))} color={QTY.forza} name="F" sub={kind} />}

				<Axes f={f} o={O} x0={O.x} x1={O.x + MAX_F * GX + 0.35} y0={O.y} y1={O.y + 40 * GY + 0.3} xName="F" yName="" />
				{[10, 20, 30, 40].map((x) => (
					<Label key={`x${x}`} f={f} at={gp(x, 0)} dir={v(0, -1)} upright size={10.5}>
						{x}
					</Label>
				))}
				{[10, 20, 30].map((y) => (
					<Label key={`y${y}`} f={f} at={gp(0, y)} dir={v(-1, 0)} upright size={10.5}>
						{y}
					</Label>
				))}
				<Label f={f} at={add(O, v(0.1, 40 * GY + 0.3))} dir={v(1, 0)} upright size={12}>
					attrito (N)
				</Label>
				<path d={[10, 20, 30, 40].map((x) => f.path([gp(x, 0), gp(x, 40)])).join(' ') + ' ' + [10, 20, 30, 40].map((y) => f.path([gp(0, y), gp(40, y)])).join(' ')} stroke="#d6d6d6" strokeWidth={0.3} fill="none" />
				<path d={f.path([gp(0, smax), gp(40, smax)])} stroke={QTY.risultante} strokeWidth={0.8} strokeDasharray={DASH} fill="none" />
				<Label f={f} at={gp(40, smax)} dir={v(1, 0)} size={11} color={QTY.risultante}>
					μsF⊥
				</Label>
				<path d={f.path(trace.map((p) => gp(p.x, p.y)))} stroke={QTY.vettore} strokeWidth={THICK} fill="none" strokeLinejoin="round" />
				<circle cx={f.px(gp(F, friction)).x} cy={f.px(gp(F, friction)).y} r={3} fill={QTY.vettore} />
			</Drawing>

			<Readout>
				<span>
					<Tex>{`F = ${texNum(F, 1)}`}</Tex> N
				</span>
				<span>
					<Tex>{`\\mu_s F_\\perp = ${texNum(smax, 2)}`}</Tex> N
				</span>
				<span>
					<Tex>{`\\mu_d F_\\perp = ${texNum(fd, 2)}`}</Tex> N
				</span>
				<span>
					attrito <Tex>{`F_${kind} = ${texNum(friction, 2)}`}</Tex> N
				</span>
			</Readout>
			<Caption>
				{sliding
					? `Il blocco scivola: l'attrito è dinamico e vale ${num(fd, 2)} N, qualunque sia la spinta. Se la spinta scende sotto ${num(fd, 2)} N il blocco si ferma.`
					: F === 0
						? `Nessuna spinta, nessun attrito. Il blocco di ${M} kg preme sul pavimento con ${num(FN, 1)} N: aumenta la spinta.`
						: `Il blocco è fermo: l'attrito statico è uguale alla spinta, ${num(F, 1)} N, e può arrivare al massimo a ${num(smax, 2)} N.`}
			</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup label="Superfici" options={(Object.keys(PAIRS) as Pair[]).map((k) => ({ value: k, label: PAIRS[k].label }))} value={pair} onChange={(p) => reset(p)} />
				</div>
				<Slider label="Spinta F (N)" value={F} min={0} max={MAX_F} step={0.5} onChange={(x) => { setRamping(false); apply(x); }} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={() => { if (ramping) return setRamping(false); if (F >= MAX_F) reset(); setRamping(true); }}>
						{ramping ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{ramping ? 'Ferma' : 'Aumenta piano'}
					</Button>
					<Button variant="secondary" size="sm" disabled={F === 0 && trace.length === 1} onClick={() => reset()}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}

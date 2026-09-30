'use client';

import { useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, num, useFrameLoop, useReducedMotion, THICK, THIN, TINT } from '../kit';
import { Words } from '../fisica/calore';
import { PARTICLE, STATE_TINT, mulberry32, gauss, signed } from './particelle-materia';

/**
 * Chemistry lesson 15 (Il modello particellare della materia): thirty particles of one substance in a closed vessel,
 * at a temperature the student picks from -220 to 150 °C. The state comes from the substance's melting and boiling
 * points at 1 atm (water 0 and 100 °C, ethanol -114 and 78, nitrogen -210 and -196), and the particles move as the
 * state asks, with a step of integration written by hand (no physics engine):
 * - solid: each particle sits on a site of a lattice at the bottom and vibrates around it, sin(ω t + φ) on each axis,
 *   with an amplitude ∝ √T (T in kelvin);
 * - liquid: gravity, a stiff short-range repulsion that keeps the particles in contact without overlapping, and a
 *   Langevin thermostat (damping plus random kicks ∝ √T): they pile at the bottom and slide over each other;
 * - gas: no gravity, the same repulsion as collisions, walls that reflect, and the mean kinetic energy pulled towards
 *   a target ∝ T: they fly across the whole vessel.
 * The agitation scales with the absolute temperature only, the same for the three substances, as the lesson says
 * (equal temperatures, equal mean agitation); the real speeds would also depend on the mass of the particles.
 * On the right, the temperature scale of the substance, with its three ranges and a pointer at the chosen t.
 */

type Sub = 'acqua' | 'etanolo' | 'azoto';
type State = 'solido' | 'liquido' | 'aeriforme';
const SUBS: Record<Sub, { nome: string; label: string; tf: number; teb: number; o: string }> = {
	acqua: { nome: "l'acqua", label: 'Acqua', tf: 0, teb: 100, o: 'a' },
	etanolo: { nome: "l'etanolo", label: 'Etanolo', tf: -114, teb: 78, o: 'o' },
	azoto: { nome: "l'azoto", label: 'Azoto', tf: -210, teb: -196, o: 'o' },
};
const stateOf = (t: number, s: { tf: number; teb: number }): State => (t < s.tf ? 'solido' : t < s.teb ? 'liquido' : 'aeriforme');

const TMIN = -220, TMAX = 150;
const N = 30, R = 0.17, W = 5, H = 3.4;
const COLS = 6, S = 0.37; // the lattice: six columns, five rows
const DMIN = 2 * R + 0.02; // closest approach of two particle centres
const SITES = Array.from({ length: N }, (_, i) => v(W / 2 - ((COLS - 1) * S) / 2 + (i % COLS) * S, R + 0.03 + Math.floor(i / COLS) * S));
const AMP = 0.035; // cm of vibration at 300 K
const K_REP = 1200, G = 6, GAMMA = 4, SIGMA = 1.4, VGAS = 2.4;

type P = { x: number; y: number; vx: number; vy: number; site: number; a: number; b: number; wa: number; wb: number };
type Sim = { ps: P[]; state: State | null; time: number; blend: { from: { x: number; y: number }[]; t0: number } | null; rnd: () => number };

function makeSim(): Sim {
	const rnd = mulberry32(22);
	const ps = SITES.map((s, i) => ({ x: s.x, y: s.y, vx: 0, vy: 0, site: i, a: rnd() * 6.28, b: rnd() * 6.28, wa: 9 + rnd() * 6, wb: 9 + rnd() * 6 }));
	return { ps, state: null, time: 0, blend: null, rnd };
}

/** Each particle gets a lattice site: the lowest six go to the bottom row, left to right, and so on up. */
function assignSites(sim: Sim) {
	const order = sim.ps.map((_, i) => i).sort((i, j) => sim.ps[i].y - sim.ps[j].y);
	for (let row = 0; row * COLS < N; row++) {
		const group = order.slice(row * COLS, row * COLS + COLS).sort((i, j) => sim.ps[i].x - sim.ps[j].x);
		group.forEach((pi, k) => (sim.ps[pi].site = row * COLS + k));
	}
}

function enter(sim: Sim, state: State, theta: number) {
	if (state === 'solido') {
		assignSites(sim);
		sim.blend = { from: sim.ps.map((p) => ({ x: p.x, y: p.y })), t0: sim.time };
	} else {
		sim.blend = null;
		if (state === 'aeriforme' && sim.state !== 'aeriforme') {
			// Boiling: every particle leaves with the gas speed in a random direction.
			for (const p of sim.ps) {
				const ang = sim.rnd() * 2 * Math.PI;
				p.vx = VGAS * theta * Math.cos(ang);
				p.vy = VGAS * theta * Math.sin(ang);
			}
		}
		if (state === 'liquido' && sim.state === 'solido') {
			for (const p of sim.ps) {
				p.vx = 0;
				p.vy = 0;
			}
		}
	}
	sim.state = state;
}

function walls(p: P) {
	if (p.x < R) {
		p.x = R;
		p.vx = Math.abs(p.vx);
	}
	if (p.x > W - R) {
		p.x = W - R;
		p.vx = -Math.abs(p.vx);
	}
	if (p.y < R) {
		p.y = R;
		p.vy = Math.abs(p.vy);
	}
	if (p.y > H - R) {
		p.y = H - R;
		p.vy = -Math.abs(p.vy);
	}
}

function step(sim: Sim, dt: number, state: State, theta: number) {
	// requestAnimationFrame's first timestamp can come before the loop started: nothing to do for a step of zero or less.
	if (!(dt > 0)) return;
	if (sim.state !== state) enter(sim, state, theta);
	sim.time += dt;
	const ps = sim.ps;
	if (state === 'solido') {
		const k = sim.blend ? Math.min(1, (sim.time - sim.blend.t0) / 0.8) : 1;
		const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
		ps.forEach((p, i) => {
			const s = SITES[p.site];
			const tx = s.x + theta * AMP * Math.sin(p.wa * sim.time + p.a);
			const ty = s.y + theta * AMP * Math.sin(p.wb * sim.time + p.b);
			const nx = sim.blend ? sim.blend.from[i].x + (tx - sim.blend.from[i].x) * e : tx;
			const ny = sim.blend ? sim.blend.from[i].y + (ty - sim.blend.from[i].y) * e : ty;
			p.vx = (nx - p.x) / dt;
			p.vy = (ny - p.y) / dt;
			p.x = nx;
			p.y = ny;
		});
		if (k >= 1) sim.blend = null;
		return;
	}
	const liquid = state === 'liquido';
	const n = Math.max(1, Math.ceil(dt / (1 / 120)));
	const h = dt / n;
	for (let it = 0; it < n; it++) {
		for (let i = 0; i < N; i++) {
			for (let j = i + 1; j < N; j++) {
				const dx = ps[j].x - ps[i].x, dy = ps[j].y - ps[i].y;
				const d = Math.hypot(dx, dy);
				if (d >= DMIN || d < 1e-9) continue;
				const f = (K_REP * (DMIN - d)) / d;
				ps[i].vx -= f * dx * h;
				ps[i].vy -= f * dy * h;
				ps[j].vx += f * dx * h;
				ps[j].vy += f * dy * h;
			}
		}
		for (const p of ps) {
			if (liquid) {
				p.vy -= G * h;
				p.vx += -GAMMA * p.vx * h + SIGMA * Math.sqrt(theta) * Math.sqrt(h) * gauss(sim.rnd);
				p.vy += -GAMMA * p.vy * h + SIGMA * Math.sqrt(theta) * Math.sqrt(h) * gauss(sim.rnd);
			}
			p.x += p.vx * h;
			p.y += p.vy * h;
			walls(p);
		}
	}
	if (!liquid) {
		// The thermostat of the gas: the mean square speed drifts towards (VGAS·θ)².
		const m2 = ps.reduce((s, p) => s + p.vx * p.vx + p.vy * p.vy, 0) / N;
		const target = (VGAS * theta) ** 2;
		if (m2 > 1e-9) {
			const k = 1 + (Math.sqrt(target / m2) - 1) * Math.min(1, 3 * dt);
			for (const p of ps) {
				p.vx *= k;
				p.vy *= k;
			}
		}
	}
}

// ---------------------------------------------------------------------------- drawing

const BX0 = 5.75, BX1 = 6.15; // the temperature scale
const yOfT = (t: number) => ((t - TMIN) / (TMAX - TMIN)) * H;
const f = frame(-0.3, 7.75, -0.85, H + 0.55);

/** Three seconds of the simulation at once: what a paused figure shows after a change of state. */
function settle(sm: Sim, state: State, theta: number) {
	for (let i = 0; i < 180; i++) step(sm, 1 / 60, state, theta);
}
const thetaOf = (t: number) => Math.sqrt((t + 273.15) / 300);

export default function ParticelleStatiTemperatura({ alt }: { alt?: string }) {
	const [sub, setSub] = useState<Sub>('acqua');
	const [t, setT] = useState(20);
	const reduced = useReducedMotion();
	const [running, setRunning] = useState<boolean | null>(null);
	const moving = running ?? !reduced;
	const [, setTick] = useState(0);
	const [sm] = useState(() => {
		const s0 = makeSim();
		settle(s0, stateOf(20, SUBS.acqua), thetaOf(20));
		return s0;
	});

	const s = SUBS[sub];
	const state = stateOf(t, s);
	const TK = t + 273.15;
	const theta = thetaOf(t);

	// Paused, a change of state still has to show.
	const change = (nt: number, ns: Sub) => {
		if (!moving) {
			settle(sm, stateOf(nt, SUBS[ns]), thetaOf(nt));
			setTick((x) => x + 1);
		}
	};

	useFrameLoop(moving, (dt) => {
		step(sm, dt, state, theta);
		setTick((x) => x + 1);
	});

	const ps = sm.ps;
	const segs: [number, number, string][] = [
		[TMIN, Math.max(TMIN, s.tf), STATE_TINT.solido],
		[Math.max(TMIN, s.tf), Math.min(TMAX, s.teb), STATE_TINT.liquido],
		[Math.min(TMAX, s.teb), TMAX, STATE_TINT.aeriforme],
	];
	const close = yOfT(s.teb) - yOfT(s.tf) < 0.4;
	const px = (x: number) => f.px(v(x, 0)).x;
	const legend: [string, string, number][] = [
		['solido', STATE_TINT.solido, 0],
		['liquido', STATE_TINT.liquido, 1.75],
		['aeriforme', STATE_TINT.aeriforme, 3.5],
	];

	let caption: string;
	if (state === 'solido') caption = `A ${signed(num(t, 0))} °C ${s.nome} è solid${s.o}: ogni particella resta al suo posto e vibra, tanto più quanto più la temperatura è alta.`;
	else if (state === 'liquido') caption = `A ${signed(num(t, 0))} °C ${s.nome} è liquid${s.o}: le particelle restano a contatto, sul fondo, ma scorrono le une sulle altre.`;
	else caption = `A ${signed(num(t, 0))} °C ${s.nome} è aeriforme: le particelle sono lontane, corrono in linea retta, si urtano e rimbalzano sulle pareti, e occupano tutto il recipiente.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* the vessel, closed by a lid */}
				<path d={f.path([v(0, 0), v(W, 0), v(W, H), v(0, H)], true)} fill="none" stroke="#000" strokeWidth={THICK} />
				<path d={f.path([v(-0.1, H), v(W + 0.1, H), v(W + 0.1, H + 0.18), v(-0.1, H + 0.18)], true)} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />
				{ps.map((p, i) => {
					const q = f.px(v(p.x, p.y));
					return <circle key={i} cx={q.x} cy={q.y} r={R * (f.W / (f.x1 - f.x0))} fill={PARTICLE.a} stroke="#000" strokeWidth={THIN} />;
				})}

				{/* the temperature scale of the substance */}
				{segs.map(([a, b, fill], i) =>
					b > a ? <path key={i} d={f.path([v(BX0, yOfT(a)), v(BX1, yOfT(a)), v(BX1, yOfT(b)), v(BX0, yOfT(b))], true)} fill={fill} stroke="none" /> : null,
				)}
				<path d={f.path([v(BX0, 0), v(BX1, 0), v(BX1, H), v(BX0, H)], true)} fill="none" stroke="#000" strokeWidth={THIN} />
				{[s.tf, s.teb].map((x, i) => (
					<g key={i}>
						<path d={f.path([v(BX1, yOfT(x)), v(BX1 + 0.12, yOfT(x))])} stroke="#000" strokeWidth={THIN} />
						<Words f={f} at={v(BX1 + 0.17, yOfT(x) + (close ? (i ? 0.13 : -0.13) : 0))} anchor="start" size={11}>
							{`${signed(num(x, 0))} °C`}
						</Words>
					</g>
				))}
				<path d={f.path([v(BX0 - 0.05, yOfT(t)), v(BX0 - 0.3, yOfT(t) + 0.13), v(BX0 - 0.3, yOfT(t) - 0.13)], true)} fill="#000" stroke="none" />
				<Words f={f} at={v((BX0 + BX1) / 2, H + 0.3)} size={11}>
					t (°C)
				</Words>

				{/* the legend of the scale */}
				{legend.map(([name, fill, x]) => (
					<g key={name}>
						<rect x={px(x)} y={f.px(v(0, -0.42)).y} width={0.35 * (f.W / (f.x1 - f.x0))} height={0.22 * (f.W / (f.x1 - f.x0))} fill={fill} stroke="#000" strokeWidth={THIN} />
						<Words f={f} at={v(x + 0.45, -0.53)} anchor="start" size={11}>
							{name}
						</Words>
					</g>
				))}
			</Drawing>

			<Readout>
				<Tex>{`t = ${num(t, 0).replace(',', '{,}')}\\,^\\circ\\text{C}`}</Tex>
				<Tex>{`T = ${num(TK, 0)}\\,\\text{K}`}</Tex>
				<span>
					stato: <strong className="font-medium">{state}</strong>
				</span>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup label="Sostanza" options={(Object.keys(SUBS) as Sub[]).map((k) => ({ value: k, label: SUBS[k].label }))} value={sub} onChange={(x) => { setSub(x); change(t, x); }} />
				</div>
				<Slider label="Temperatura t (°C)" value={t} min={TMIN} max={TMAX} step={1} onChange={(x) => { setT(x); change(x, sub); }} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={() => setRunning(!moving)}>
						{moving ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{moving ? 'Ferma' : 'Fai muovere'}
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}

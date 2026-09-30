'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, useFrameLoop, useReducedMotion, THICK, type V } from '../kit';
import { HydrogenBond, WaterMolecule, gauss, hydrogens, seeded } from './acqua';

/**
 * Lesson 44 (La molecola d'acqua e il legame a idrogeno): 24 water molecules in a box, and a slider for the
 * temperature from -20 to 120 °C.
 *
 * - Below 0 °C (ice) every molecule is pulled by a spring to its site of a flat honeycomb, the picture of ice seen
 *   along its hexagonal rings: molecules of sublattice A give their two hydrogens to the two B below them, those of
 *   B give one hydrogen to the A under them and point the other out of the drawing (towards the viewer, drawn short
 *   and pale), as in real ice, where the fourth bond goes to the next layer. The bonds are the lattice's.
 * - From 0 to 100 °C (liquid) the molecules are free: a hand-written step moves them with a Langevin thermostat
 *   (friction and random kicks growing with the absolute temperature), springs hold the hydrogen bonds, and the
 *   oxygens push each other away. A free hydrogen that comes within 0,7 cm of an oxygen with fewer than two bonds
 *   forms a bond (5 per second); a bond breaks at the rate A·e^(-E/T), 0,27 per second at 0 °C and 3 per second at
 *   100 °C, or when it is stretched beyond 0,95 cm. The numbers are chosen to be seen, not measured: in real water
 *   bonds live about a picosecond.
 * - Above 100 °C (vapour) no bond forms, and the molecules fly faster with little friction.
 *
 * The count of hydrogen bonds is read under the drawing. Seeded random numbers: the figure starts the same way.
 */

const W = 7.0, H = 4.75;
const f = frame(-0.05, W + 0.05, -0.05, H + 0.05);
const A = 0.95; // lattice bond, cm
const COLS = 4, ROWS = 3;
const DT = 1 / 120;
const DEG = Math.PI / 180;

type Mol = { x: number; y: number; vx: number; vy: number; th: number; w: number; sx: number; sy: number; sth: number; back: boolean };
type Bond = { d: number; k: 0 | 1; a: number };

/** The honeycomb: A at the bottom of each pair, B above it; rows shifted by half a column. */
function lattice() {
	const mols: Mol[] = [];
	const x0 = 0.6, y0 = 0.55;
	for (let r = 0; r < ROWS; r++)
		for (let c = 0; c < COLS; c++) {
			const x = x0 + c * Math.sqrt(3) * A + (r % 2) * (Math.sqrt(3) / 2) * A;
			const y = y0 + r * 1.5 * A;
			mols.push({ x, y, vx: 0, vy: 0, th: -90 * DEG, w: 0, sx: x, sy: y, sth: -90 * DEG, back: false });
			mols.push({ x, y: y + A, vx: 0, vy: 0, th: (-90 + 52.25) * DEG, w: 0, sx: x, sy: y + A, sth: (-90 + 52.25) * DEG, back: true });
		}
	const bonds: Bond[] = [];
	const near = (x: number, y: number) => mols.findIndex((m) => Math.hypot(m.sx - x, m.sy - y) < 0.05);
	mols.forEach((m, i) => {
		if (m.back) bonds.push({ d: i, k: 0, a: i - 1 });
		else
			[-1, 1].forEach((s, k) => {
				const j = near(m.sx + (s * Math.sqrt(3) * A) / 2, m.sy - A / 2);
				if (j >= 0) bonds.push({ d: i, k: k as 0 | 1, a: j });
			});
	});
	return { mols, bonds };
}
const LATTICE = lattice();

type Phase = 'ghiaccio' | 'liquido' | 'vapore';
const phaseOf = (t: number): Phase => (t < 0 ? 'ghiaccio' : t > 100 ? 'vapore' : 'liquido');

const R0 = 0.6; // rest length H···O, cm
const R_FORM = 0.7, R_BREAK = 0.95;
const K_BOND = 40, K_REP = 260, K_SITE = 60, K_ANG = 20;
const INERTIA = 0.05;
const breakRate = (tK: number) => 2120 * Math.exp(-2448 / tK); // per second
const FORM_RATE = 5; // per second

function makeSim() {
	const rnd = seeded(29);
	const mols = LATTICE.mols.map((m) => ({ ...m }));
	let bonds: Bond[] = LATTICE.bonds.map((b) => ({ ...b }));
	let phase: Phase = 'ghiaccio';

	const hOf = (i: number, k: 0 | 1) => hydrogens({ at: v(mols[i].x, mols[i].y), th: mols[i].th })[k];

	function step(t: number) {
		const p = phaseOf(t);
		const tK = t + 273;
		if (p !== phase) {
			if (p === 'vapore') bonds = [];
			if (p === 'ghiaccio') bonds = [];
			phase = p;
		}
		const kT = (tK / 293) * (p === 'vapore' ? 6 : 0.36);
		const gamma = p === 'vapore' ? 0.3 : p === 'ghiaccio' ? 6 : 2;
		const n = mols.length;
		const fx = new Array(n).fill(0), fy = new Array(n).fill(0), tq = new Array(n).fill(0);

		// oxygens push each other away; a hydrogen pushes a foreign oxygen
		for (let i = 0; i < n; i++)
			for (let j = i + 1; j < n; j++) {
				const dx = mols[j].x - mols[i].x, dy = mols[j].y - mols[i].y;
				const d = Math.hypot(dx, dy);
				if (d < 0.62 && d > 1e-6) {
					const F = K_REP * (0.62 - d);
					fx[i] -= (F * dx) / d;
					fy[i] -= (F * dy) / d;
					fx[j] += (F * dx) / d;
					fy[j] += (F * dy) / d;
				}
			}

		if (p === 'ghiaccio') {
			// every molecule to its site, and the lattice bonds whose ends are close
			mols.forEach((m, i) => {
				fx[i] += K_SITE * (m.sx - m.x);
				fy[i] += K_SITE * (m.sy - m.y);
				let da = m.sth - m.th;
				da = Math.atan2(Math.sin(da), Math.cos(da));
				tq[i] += K_ANG * INERTIA * 20 * da;
			});
			bonds = LATTICE.bonds.filter((b) => {
				const h = hOf(b.d, b.k);
				return Math.hypot(h.x - mols[b.a].x, h.y - mols[b.a].y) < R_BREAK;
			});
		} else if (p === 'liquido') {
			// break, then springs, then form
			const pb = breakRate(tK) * DT;
			bonds = bonds.filter((b) => {
				const h = hOf(b.d, b.k);
				const d = Math.hypot(h.x - mols[b.a].x, h.y - mols[b.a].y);
				return d < R_BREAK && rnd() >= pb;
			});
			for (const b of bonds) {
				const h = hOf(b.d, b.k);
				const o = mols[b.a];
				const dx = h.x - o.x, dy = h.y - o.y;
				const d = Math.hypot(dx, dy) || 1e-6;
				const F = K_BOND * (d - R0);
				const Fx = (F * dx) / d, Fy = (F * dy) / d;
				fx[b.a] += Fx;
				fy[b.a] += Fy;
				fx[b.d] -= Fx;
				fy[b.d] -= Fy;
				const rx = h.x - mols[b.d].x, ry = h.y - mols[b.d].y;
				tq[b.d] += rx * -Fy - ry * -Fx;
				// the acceptor turns its back (its lone pairs) towards the hydrogen
				const want = Math.atan2(dy, dx) + Math.PI;
				let da = want - o.th;
				da = Math.atan2(Math.sin(da), Math.cos(da));
				tq[b.a] += 0.6 * da;
			}
			const used = new Set(bonds.map((b) => `${b.d}:${b.k}`));
			const accepted = new Array(n).fill(0);
			bonds.forEach((b) => accepted[b.a]++);
			const pf = FORM_RATE * DT;
			for (let i = 0; i < n; i++)
				for (const k of [0, 1] as const) {
					if (used.has(`${i}:${k}`) || rnd() >= pf) continue;
					const h = hOf(i, k);
					let best = -1, bd = R_FORM;
					for (let j = 0; j < n; j++) {
						if (j === i || accepted[j] >= 2) continue;
						const d = Math.hypot(h.x - mols[j].x, h.y - mols[j].y);
						if (d < bd) {
							bd = d;
							best = j;
						}
					}
					if (best >= 0) {
						bonds.push({ d: i, k, a: best });
						accepted[best]++;
						used.add(`${i}:${k}`);
					}
				}
		}

		// Langevin step, walls
		const sv = Math.sqrt(2 * gamma * kT * DT), sw = Math.sqrt((2 * gamma * kT * DT) / INERTIA);
		mols.forEach((m, i) => {
			m.vx += (fx[i] - gamma * m.vx) * DT + sv * gauss(rnd);
			m.vy += (fy[i] - gamma * m.vy) * DT + sv * gauss(rnd);
			m.w += (tq[i] / INERTIA - gamma * m.w) * DT + sw * gauss(rnd);
			m.x += m.vx * DT;
			m.y += m.vy * DT;
			m.th += m.w * DT;
			const lo = 0.42, hx = W - 0.42, hy = H - 0.42;
			if (m.x < lo || m.x > hx) {
				m.x = Math.min(hx, Math.max(lo, m.x));
				m.vx = m.x === lo ? Math.abs(m.vx) : -Math.abs(m.vx);
			}
			if (m.y < lo || m.y > hy) {
				m.y = Math.min(hy, Math.max(lo, m.y));
				m.vy = m.y === lo ? Math.abs(m.vy) : -Math.abs(m.vy);
			}
		});
	}

	return {
		step,
		get mols() {
			return mols;
		},
		get bonds() {
			return bonds;
		},
		get phase() {
			return phase;
		},
		hOf,
	};
}

export default function LegamiIdrogenoTemperatura({ alt }: { alt?: string }) {
	const [t, setT] = useState(20);
	const reduced = useReducedMotion();
	const [paused, setPaused] = useState(false);
	const [, setTick] = useState(0);
	const tRef = useRef(t);
	useEffect(() => {
		tRef.current = t;
	}, [t]);
	const sim = useMemo(() => {
		const s = makeSim();
		for (let i = 0; i < 1500; i++) s.step(20);
		return s;
	}, []);
	const running = !paused && !reduced;

	useFrameLoop(running, (dt) => {
		const steps = Math.max(1, Math.round(dt / DT));
		for (let i = 0; i < steps; i++) sim.step(tRef.current);
		setTick((x) => x + 1);
	});
	const change = (x: number) => {
		setT(x);
		if (!running) {
			// without animation, show the state the temperature leads to
			for (let i = 0; i < 600; i++) sim.step(x);
			setTick((y) => y + 1);
		}
	};

	const phase = phaseOf(t);
	const nb = sim.bonds.length;
	const n = sim.mols.length;
	const inIce = sim.phase === 'ghiaccio';

	let caption: string;
	if (phase === 'ghiaccio') caption = `Ghiaccio: ogni molecola sta al suo posto nella rete a esagoni e vibra appena. Nel disegno piatto ogni molecola ha fino a tre legami a idrogeno; nel ghiaccio vero sono quattro, e il quarto va verso lo strato sopra o sotto (gli idrogeni più chiari puntano fuori dal disegno, verso di te).`;
	else if (phase === 'vapore') caption = `Vapore: le molecole si muovono veloci e separate, e i legami a idrogeno non fanno in tempo a formarsi. Nel vapore vero le molecole sono anche molto più lontane di così.`;
	else if (t === 0) caption = `A 0 °C il ghiaccio fonde: la rete si rompe, le molecole si muovono, e i legami a idrogeno si formano e si rompono di continuo.`;
	else if (t === 100) caption = `A 100 °C l'acqua bolle: ancora un po' di energia e le molecole si separano del tutto.`;
	else caption = `Acqua liquida: le molecole si muovono, e i legami a idrogeno si rompono e si riformano di continuo; più la temperatura sale, più breve è la loro vita. Nell'acqua vera durano un milionesimo di milionesimo di secondo: qui sono rallentati per vederli.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<rect x={f.px(v(0, H)).x} y={f.px(v(0, H)).y} width={W * (f.W / (f.x1 - f.x0))} height={H * (f.W / (f.x1 - f.x0))} fill="none" stroke="#000" strokeWidth={THICK} />
				{sim.bonds.map((b, i) => {
					const h: V = sim.hOf(b.d, b.k);
					const o = sim.mols[b.a];
					return <HydrogenBond key={`b${i}`} f={f} h={h} o={v(o.x, o.y)} />;
				})}
				{sim.mols.map((m, i) => (
					<WaterMolecule key={i} f={f} w={{ at: v(m.x, m.y), th: m.th }} back={inIce && m.back} />
				))}
			</Drawing>
			<Readout>
				<Tex>{`t = ${t}\\,^\\circ\\text{C}`}</Tex>
				<span>{phase === 'ghiaccio' ? 'ghiaccio' : phase === 'liquido' ? 'acqua liquida' : 'vapore'}</span>
				<span>
					legami a idrogeno in questo istante: <strong>{nb}</strong> ({n} molecole)
				</span>
			</Readout>
			<Caption>{caption}</Caption>
			<Controls>
				<Slider label="Temperatura (°C)" value={t} min={-20} max={120} step={1} onChange={change} />
				{!reduced && (
					<ButtonRow>
						<Button variant="secondary" size="sm" onClick={() => setPaused((x) => !x)}>
							{paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
							{paused ? 'Riprendi' : 'Ferma'}
						</Button>
					</ButtonRow>
				)}
			</Controls>
		</Figure>
	);
}


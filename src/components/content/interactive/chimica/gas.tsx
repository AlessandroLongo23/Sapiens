'use client';

import { FONT, THICK, THIN, INK, add, polar, v, type Frame, type V } from '../kit';

/**
 * Pieces shared by the gas figures of chemistry (group 26: lessons 29-34, teoria cinetica, pressione, Boyle, Charles
 * e Gay-Lussac, equazione generale, Avogadro): particles that move in straight lines and bounce, written by hand
 * (no physics engine: a step of integration per frame, reflections on the walls, elastic collisions between discs),
 * and a pressure gauge with a needle. Everything in TikZ centimetres, y upwards, like the rest of the kit.
 */

export type Particle = { x: number; y: number; vx: number; vy: number };
export type Box = { x0: number; x1: number; y0: number; y1: number };

/** A standard normal number (Box-Muller), from Math.random. */
export function gauss() {
	const u = 1 - Math.random();
	return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random());
}

/**
 * A particle at a random place in the box (kept `r` from the walls), with a velocity drawn from the two-dimensional
 * Maxwell distribution whose mean speed is `mean` (cm/s): each component normal with σ = mean · √(2/π).
 */
export function particle(box: Box, r: number, mean: number): Particle {
	const s = mean * Math.sqrt(2 / Math.PI);
	return {
		x: box.x0 + r + Math.random() * (box.x1 - box.x0 - 2 * r),
		y: box.y0 + r + Math.random() * Math.max(0, box.y1 - box.y0 - 2 * r),
		vx: gauss() * s,
		vy: gauss() * s,
	};
}

export type Wall = 'x0' | 'x1' | 'y0' | 'y1';

/**
 * Moves a particle by dt and bounces it off the walls of the box (radius r). Returns the wall it hit, if any, so a
 * figure can mark the hit. A particle left outside by a wall that moved (a piston pushed down) is put back inside,
 * moving away from that wall.
 */
export function step(p: Particle, box: Box, r: number, dt: number): Wall | null {
	p.x += p.vx * dt;
	p.y += p.vy * dt;
	let hit: Wall | null = null;
	if (p.x < box.x0 + r) {
		p.x = box.x0 + r;
		p.vx = Math.abs(p.vx);
		hit = 'x0';
	} else if (p.x > box.x1 - r) {
		p.x = box.x1 - r;
		p.vx = -Math.abs(p.vx);
		hit = 'x1';
	}
	if (p.y < box.y0 + r) {
		p.y = box.y0 + r;
		p.vy = Math.abs(p.vy);
		hit = 'y0';
	} else if (p.y > box.y1 - r) {
		p.y = Math.max(box.y0 + r, box.y1 - r);
		p.vy = -Math.abs(p.vy);
		hit = 'y1';
	}
	return hit;
}

/**
 * Elastic collision of two discs of radii ra, rb and masses ma, mb, if they overlap and are approaching: the velocity
 * components along the line of centres are exchanged as in a head-on elastic collision, and the discs are pushed apart
 * so they no longer overlap. Momentum and kinetic energy are kept.
 */
export function collide(a: Particle, b: Particle, ra: number, rb: number, ma: number, mb: number) {
	const dx = b.x - a.x, dy = b.y - a.y;
	const d2 = dx * dx + dy * dy;
	const rr = ra + rb;
	if (d2 >= rr * rr || d2 < 1e-12) return;
	const d = Math.sqrt(d2);
	const nx = dx / d, ny = dy / d;
	const va = a.vx * nx + a.vy * ny, vb = b.vx * nx + b.vy * ny;
	if (va - vb > 0) {
		const ua = (va * (ma - mb) + 2 * mb * vb) / (ma + mb);
		const ub = (vb * (mb - ma) + 2 * ma * va) / (ma + mb);
		a.vx += (ua - va) * nx;
		a.vy += (ua - va) * ny;
		b.vx += (ub - vb) * nx;
		b.vy += (ub - vb) * ny;
	}
	const push = (rr - d) / 2;
	a.x -= nx * push;
	a.y -= ny * push;
	b.x += nx * push;
	b.y += ny * push;
}

/** Multiplies every velocity by k (a temperature changed: speeds go as √T). */
export function scaleSpeeds(ps: Particle[], k: number) {
	for (const p of ps) {
		p.vx *= k;
		p.vy *= k;
	}
}

/** The mean speed of the particles. */
export const meanSpeed = (ps: Particle[]) => (ps.length ? ps.reduce((s, p) => s + Math.hypot(p.vx, p.vy), 0) / ps.length : 0);

/**
 * A pressure gauge: a dial of radius `r` centred at `at`, with ticks from 0 to `max` over 270° (0 at the bottom left,
 * `max` at the bottom right, clockwise), numbers every `every`, the unit under the pivot and a red needle at `value`.
 */
export function Gauge({ f, at, r, value, max, every, minor, unit }: { f: Frame; at: V; r: number; value: number; max: number; every: number; minor: number; unit: string }) {
	const angle = (x: number) => ((225 - (270 * Math.min(Math.max(x, 0), max * 1.04)) / max) * Math.PI) / 180;
	const ticks: string[] = [];
	for (let q = 0; q <= max + 1e-9; q += minor) {
		const big = Math.abs(q / every - Math.round(q / every)) < 1e-6;
		ticks.push(f.path([add(at, polar(r - (big ? 0.16 : 0.09), angle(q))), add(at, polar(r, angle(q)))]));
	}
	const c = f.px(at);
	const numbers: number[] = [];
	for (let q = 0; q <= max + 1e-9; q += every) numbers.push(q);
	return (
		<g pointerEvents="none">
			<circle cx={c.x} cy={c.y} r={r * (f.W / (f.x1 - f.x0))} fill="#fff" stroke="#000" strokeWidth={THICK} />
			<path d={ticks.join(' ')} stroke="#000" strokeWidth={THIN} fill="none" />
			{numbers.map((q) => {
				const p = f.px(add(at, polar(r - 0.3, angle(q))));
				return (
					<text key={q} x={p.x} y={p.y} dy="0.35em" textAnchor="middle" fontSize={9} fontFamily={FONT}>
						{q}
					</text>
				);
			})}
			<text x={c.x} y={f.px(add(at, v(0, -r * 0.55))).y} dy="0.35em" textAnchor="middle" fontSize={9} fontFamily={FONT}>
				{unit}
			</text>
			<path d={f.path([at, add(at, polar(r - 0.12, angle(value)))])} stroke={INK.red} strokeWidth={THICK} strokeLinecap="round" />
			<circle cx={c.x} cy={c.y} r={2} fill="#000" />
		</g>
	);
}

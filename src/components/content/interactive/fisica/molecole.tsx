'use client';

import { K, THIN, v, type Frame, type V } from '../kit';
import { Arrow, QTY } from '../fisica';

/**
 * The gas of the kinetic theory, for the figures of the third year (group 40: lessons 105-108): point-like molecules
 * of equal mass in a box, moving in straight lines between elastic collisions with the walls and with each other.
 * The box is three-dimensional (x to the right, y up, z into the page) and is drawn from the front, so the right
 * wall is the wall perpendicular to x of the lessons' derivation, and the speeds follow Maxwell's distribution in
 * three dimensions. Lengths are TikZ centimetres and speeds centimetres per second on the screen: each figure says
 * what a screen speed stands for. The mass of a molecule is 1.
 *
 * No physics engine: a fixed step of straight motion, then the reflections.
 */

/** The radius of a molecule, as the lessons' TikZ draws it (circle (0.09)). */
export const R_MOL = 0.09;
export const MOL_FILL = '#b3b3ff'; // blue!30

export type Hit = { wall: 'left' | 'right' | 'bottom' | 'top'; at: number; t: number };

export type Gas = {
	/** The box the centres of the molecules move in: 0..W along x, 0..H along y, 0..D along z. */
	W: number;
	H: number;
	D: number;
	x: number[];
	y: number[];
	z: number[];
	vx: number[];
	vy: number[];
	vz: number[];
	/** Seconds simulated so far. */
	time: number;
	/** The hits on the four walls one sees, to flash them; the old ones are dropped. */
	hits: Hit[];
	/** Impulse given to the six walls since it was last read (mass 1): 2·|v_n| per hit. */
	impulse: number;
	/** The state of the random generator. */
	seed: number;
};

/** A small seeded generator (mulberry32), its state kept in the gas: the same figure starts the same way every time. */
function rand(g: Gas) {
	g.seed = (g.seed + 0x6d2b79f5) >>> 0;
	let t = g.seed;
	t = Math.imul(t ^ (t >>> 15), t | 1);
	t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/**
 * A copy to change. A figure keeps its gas in React state and never changes it in place: each frame it copies the
 * gas, advances the copy and stores it.
 */
export function cloneGas(g: Gas): Gas {
	return { ...g, x: [...g.x], y: [...g.y], z: [...g.z], vx: [...g.vx], vy: [...g.vy], vz: [...g.vz], hits: [...g.hits] };
}

/** erf, Abramowitz and Stegun 7.1.26 (error under 1.5e-7). */
function erf(x: number) {
	const s = Math.sign(x);
	const a = Math.abs(x);
	const t = 1 / (1 + 0.3275911 * a);
	const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
	return s * y;
}

/**
 * Maxwell's distribution of the speeds for a root-mean-square speed `vqm`: the density f(v), whose integral is 1,
 * and the fraction of molecules slower than v.
 */
export function maxwell(vqm: number) {
	const a = vqm / Math.sqrt(3);
	const density = (s: number) => Math.sqrt(2 / Math.PI) * ((s * s) / (a * a * a)) * Math.exp(-(s * s) / (2 * a * a));
	const below = (s: number) => erf(s / (Math.SQRT2 * a)) - Math.sqrt(2 / Math.PI) * (s / a) * Math.exp(-(s * s) / (2 * a * a));
	/** The speed under which a fraction u of the molecules lies. */
	const quantile = (u: number) => {
		let lo = 0, hi = 6 * a;
		for (let i = 0; i < 40; i++) {
			const m = (lo + hi) / 2;
			if (below(m) < u) lo = m;
			else hi = m;
		}
		return (lo + hi) / 2;
	};
	return { density, below, quantile, mostProbable: a * Math.SQRT2, mean: a * Math.sqrt(8 / Math.PI) };
}

/** The root-mean-square speed of the gas as it is now. */
export function rms(g: Gas) {
	let s = 0;
	for (let i = 0; i < g.x.length; i++) s += g.vx[i] ** 2 + g.vy[i] ** 2 + g.vz[i] ** 2;
	return g.x.length ? Math.sqrt(s / g.x.length) : 0;
}

/** Multiplies every velocity so that the root-mean-square speed becomes `vqm`. */
export function setRms(g: Gas, vqm: number) {
	const now = rms(g);
	if (!now) return;
	const k = vqm / now;
	for (let i = 0; i < g.x.length; i++) {
		g.vx[i] *= k;
		g.vy[i] *= k;
		g.vz[i] *= k;
	}
}

/**
 * Adds a molecule with the given speed, in a random direction. With `cell` (k of n) it goes in the k-th cell of a
 * grid that fills the front of the box up to xMax, so the molecules start spread out; otherwise anywhere.
 */
function push(g: Gas, speed: number, xMax = g.W, cell?: { k: number; n: number }) {
	const cosT = 2 * rand(g) - 1;
	const sinT = Math.sqrt(1 - cosT * cosT);
	const phi = 2 * Math.PI * rand(g);
	let fx = rand(g), fy = rand(g);
	if (cell) {
		const cols = Math.ceil(Math.sqrt((cell.n * xMax) / g.H));
		const rows = Math.ceil(cell.n / cols);
		fx = ((cell.k % cols) + 0.2 + 0.6 * fx) / cols;
		fy = (Math.floor(cell.k / cols) + 0.2 + 0.6 * fy) / rows;
	}
	g.x.push(fx * xMax);
	g.y.push(fy * g.H);
	g.z.push(rand(g) * g.D);
	g.vx.push(speed * sinT * Math.cos(phi));
	g.vy.push(speed * sinT * Math.sin(phi));
	g.vz.push(speed * cosT);
}

/**
 * A gas of n molecules in the box, with speeds spread as Maxwell's distribution wants (one molecule per slice of
 * equal probability, so even a few dozen draw the curve) and root-mean-square speed exactly `vqm`. With `xMax` the
 * molecules start in the part of the box left of it.
 */
export function makeGas(n: number, box: { W: number; H: number; D: number }, vqm: number, seed = 7, xMax = box.W): Gas {
	const g: Gas = { ...box, x: [], y: [], z: [], vx: [], vy: [], vz: [], time: 0, hits: [], impulse: 0, seed: seed >>> 0 };
	const mx = maxwell(vqm);
	// 7919 is prime: k runs over all the cells, so that the speeds, sorted by i, are scattered over the box
	for (let i = 0; i < n; i++) push(g, mx.quantile((i + 0.5) / n), xMax, { k: (i * 7919) % n, n });
	setRms(g, vqm);
	return g;
}

/** Brings the number of molecules to n, keeping the root-mean-square speed. */
export function setCount(g: Gas, n: number, vqm: number) {
	const mx = maxwell(vqm);
	while (g.x.length > n) for (const a of [g.x, g.y, g.z, g.vx, g.vy, g.vz]) a.pop();
	while (g.x.length < n) push(g, mx.quantile(0.02 + 0.96 * rand(g)));
	setRms(g, vqm);
}

/** Moves the right wall to W: the molecules beyond it are put back just inside, moving left. */
export function setWidth(g: Gas, W: number) {
	g.W = W;
	for (let i = 0; i < g.x.length; i++) {
		if (g.x[i] > W) {
			g.x[i] = W - rand(g) * 0.05;
			g.vx[i] = -Math.abs(g.vx[i]);
		}
	}
}

const SUB = 1 / 120;
/**
 * Two molecules collide when their centres are closer than this. Half the drawn diameter: with the whole of it the
 * eighty molecules of the densest figure would take up enough room to push the pressure some 8% above the perfect
 * gas's, which is the gas of the lessons.
 */
const REACH = R_MOL;

/**
 * Advances the gas by dt seconds, in steps of 1/120 s. `wall` is the speed of the right wall, when it moves (a
 * piston): the wall is then at g.W, which the caller changes, and a molecule that meets it bounces as on a moving
 * wall, v_x → 2u − v_x, if `elastic`; otherwise it only turns back, keeping its speed (a wall kept at the gas's
 * temperature). Hits on the piston are not counted in the impulse.
 */
export function advance(g: Gas, dt: number, piston?: { u: number; elastic: boolean }) {
	const n = g.x.length;
	let left = dt;
	while (left > 1e-9) {
		const h = Math.min(SUB, left);
		left -= h;
		g.time += h;
		for (let i = 0; i < n; i++) {
			g.x[i] += g.vx[i] * h;
			g.y[i] += g.vy[i] * h;
			g.z[i] += g.vz[i] * h;
		}
		// molecule against molecule: equal masses exchange the components along the line of the centres
		for (let i = 0; i < n; i++) {
			for (let j = i + 1; j < n; j++) {
				const dx = g.x[j] - g.x[i];
				if (dx > REACH || dx < -REACH) continue;
				const dy = g.y[j] - g.y[i], dz = g.z[j] - g.z[i];
				const d2 = dx * dx + dy * dy + dz * dz;
				if (d2 >= REACH * REACH || d2 < 1e-12) continue;
				const along = ((g.vx[j] - g.vx[i]) * dx + (g.vy[j] - g.vy[i]) * dy + (g.vz[j] - g.vz[i]) * dz) / d2;
				if (along >= 0) continue; // already moving apart
				g.vx[i] += along * dx;
				g.vy[i] += along * dy;
				g.vz[i] += along * dz;
				g.vx[j] -= along * dx;
				g.vy[j] -= along * dy;
				g.vz[j] -= along * dz;
			}
		}
		// walls: the centres stay in the box (a figure draws its walls a radius further out)
		for (let i = 0; i < n; i++) {
			if (g.x[i] < 0 && g.vx[i] < 0) {
				g.impulse += -2 * g.vx[i];
				g.vx[i] = -g.vx[i];
				g.x[i] = -g.x[i];
				g.hits.push({ wall: 'left', at: g.y[i], t: g.time });
			}
			const u = piston?.u ?? 0;
			if (g.x[i] > g.W && g.vx[i] > u) {
				if (!piston) g.impulse += 2 * g.vx[i];
				g.vx[i] = piston?.elastic ? 2 * u - g.vx[i] : -g.vx[i];
				g.x[i] = Math.max(0, Math.min(g.W, 2 * g.W - g.x[i]));
				g.hits.push({ wall: 'right', at: g.y[i], t: g.time });
			} else if (g.x[i] > g.W) g.x[i] = g.W;
			if (g.y[i] < 0 && g.vy[i] < 0) {
				g.impulse += -2 * g.vy[i];
				g.vy[i] = -g.vy[i];
				g.y[i] = -g.y[i];
				g.hits.push({ wall: 'bottom', at: g.x[i], t: g.time });
			}
			if (g.y[i] > g.H && g.vy[i] > 0) {
				g.impulse += 2 * g.vy[i];
				g.vy[i] = -g.vy[i];
				g.y[i] = 2 * g.H - g.y[i];
				g.hits.push({ wall: 'top', at: g.x[i], t: g.time });
			}
			if (g.z[i] < 0 && g.vz[i] < 0) {
				g.impulse += -2 * g.vz[i];
				g.vz[i] = -g.vz[i];
				g.z[i] = -g.z[i];
			}
			if (g.z[i] > g.D && g.vz[i] > 0) {
				g.impulse += 2 * g.vz[i];
				g.vz[i] = -g.vz[i];
				g.z[i] = 2 * g.D - g.z[i];
			}
		}
	}
	const cut = g.time - FLASH;
	if (g.hits.length && g.hits[0].t < cut) g.hits = g.hits.filter((hit) => hit.t >= cut);
}

/** The area of the six walls and the volume of the box, in the figure's centimetres. */
export const wallArea = (g: Gas) => 2 * (g.W * g.H + g.W * g.D + g.H * g.D);
export const volume = (g: Gas) => g.W * g.H * g.D;
/** The pressure the kinetic theory gives, p = N m v_qm² / (3V), with m = 1 and the figure's units. */
export const kineticPressure = (g: Gas) => (g.x.length * rms(g) ** 2) / (3 * volume(g));

/** How long a hit stays lit, in seconds. */
const FLASH = 0.3;
const ORANGE = '#e67300'; // orange!90!black

/** The molecules, drawn from the front with the box's lower left corner at `at`; with `arrows`, their velocities. */
export function Molecules({ f, g, at = v(0, 0), arrows = false, fill = MOL_FILL, r = R_MOL }: { f: Frame; g: Gas; at?: V; arrows?: boolean; fill?: string; r?: number }) {
	const K_ARROW = 0.17; // seconds of motion an arrow shows
	return (
		<g pointerEvents="none">
			{arrows &&
				g.x.map((x, i) => {
					const from = v(at.x + x, at.y + g.y[i]);
					return <Arrow key={`a${i}`} f={f} from={from} to={v(from.x + g.vx[i] * K_ARROW, from.y + g.vy[i] * K_ARROW)} color={QTY.velocita} weight="thin" />;
				})}
			{g.x.map((x, i) => {
				const p = f.px(v(at.x + x, at.y + g.y[i]));
				return <circle key={i} cx={p.x} cy={p.y} r={r * K} fill={fill} stroke="#000" strokeWidth={THIN} />;
			})}
		</g>
	);
}

/** The four walls one sees, a radius outside the box of the centres: the points of a path, anticlockwise from the lower left. */
export const wallPoints = (g: { W: number; H: number }, at: V = v(0, 0)) => [v(at.x - R_MOL, at.y - R_MOL), v(at.x + g.W + R_MOL, at.y - R_MOL), v(at.x + g.W + R_MOL, at.y + g.H + R_MOL), v(at.x - R_MOL, at.y + g.H + R_MOL)];

/** The hits of the last instants, as short orange marks on the walls that fade. */
export function Flashes({ f, g, at = v(0, 0), walls = ['left', 'right', 'bottom', 'top'] }: { f: Frame; g: Gas; at?: V; walls?: Hit['wall'][] }) {
	const half = 0.14;
	return (
		<g pointerEvents="none">
			{g.hits
				.filter((hit) => walls.includes(hit.wall))
				.map((hit, i) => {
					const a = hit.wall === 'left' ? v(-R_MOL, hit.at - half) : hit.wall === 'right' ? v(g.W + R_MOL, hit.at - half) : hit.wall === 'bottom' ? v(hit.at - half, -R_MOL) : v(hit.at - half, g.H + R_MOL);
					const b = hit.wall === 'left' || hit.wall === 'right' ? v(a.x, a.y + 2 * half) : v(a.x + 2 * half, a.y);
					return <path key={i} d={f.path([v(at.x + a.x, at.y + a.y), v(at.x + b.x, at.y + b.y)])} stroke={ORANGE} strokeWidth={3.2} strokeLinecap="round" opacity={Math.max(0, 1 - (g.time - hit.t) / FLASH)} fill="none" />;
				})}
		</g>
	);
}

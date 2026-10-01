/**
 * The orbitals of the hydrogen atom as clouds of points (vault/Prodotti/Studenti/Orbitali atomici interattivi.md). The wave
 * function is ψ = R_nl(r) · Θ_lm(θ) · Φ_m(φ), so the probability splits into three factors and each coordinate is
 * drawn on its own, exactly, from a table of its cumulative distribution. Lengths are in Bohr radii.
 *
 * Two kinds of orbital. `reale` is the one in the school books (p_x, d_xy): the sum of m and −m, standing still,
 * with a sign that changes from lobe to lobe. `complesso` is the state with a definite m: its density does not depend
 * on φ, and the probability flows around the z axis.
 */

export type OrbitalKind = 'reale' | 'complesso';

export interface Orbital {
	n: number;
	l: number;
	/** −l to l. For a real orbital, m > 0 is the cosine combination (p_x), m < 0 the sine one (p_y). */
	m: number;
	kind: OrbitalKind;
}

/** Seven levels: those of the periodic table, up to 7s and 7p. */
export const N_MAX = 7;
export const SUBLEVELS = ['s', 'p', 'd', 'f', 'g', 'h', 'i'];

/** The orbital brought back inside the rules: l from 0 to n − 1, m from −l to l. */
export function clampOrbital(o: Orbital): Orbital {
	const n = Math.min(N_MAX, Math.max(1, Math.round(o.n)));
	const l = Math.min(n - 1, Math.max(0, Math.round(o.l)));
	const m = Math.min(l, Math.max(-l, Math.round(o.m)));
	return { n, l, m, kind: o.kind };
}

/** Spherical surfaces where ψ is zero. */
export const radialNodes = (o: Orbital): number => o.n - o.l - 1;
/** Planes and cones through the nucleus where ψ is zero. */
export const angularNodes = (o: Orbital): number => o.l;

const REAL_NAMES: Record<string, string> = {
	'1:0': 'z',
	'1:1': 'x',
	'1:-1': 'y',
	'2:0': 'z²',
	'2:1': 'xz',
	'2:-1': 'yz',
	'2:2': 'x²−y²',
	'2:-2': 'xy'
};

/** "3d", with the direction of a real orbital where the books name it: "2p x", "3d xy". */
export function orbitalName(o: Orbital): { level: string; direction: string | null } {
	const level = `${o.n}${SUBLEVELS[o.l]}`;
	if (o.kind === 'complesso') return { level, direction: null };
	return { level, direction: REAL_NAMES[`${o.l}:${o.m}`] ?? null };
}

/**
 * The values of m of a sublevel in the order they are shown, in the table of sublevels and in the selector alike.
 * The real orbitals go as the books name them (x, y, z; xy, xz, yz, x²−y², z²), which is not the order of m; the
 * states in motion, and the sublevels with no names for their orbitals, go from −l to +l.
 */
export function orientationOrder(l: number, kind: OrbitalKind): number[] {
	const byM = Array.from({ length: 2 * l + 1 }, (_, i) => i - l);
	if (kind === 'complesso') return byM;
	if (l === 1) return [1, -1, 0];
	if (l === 2) return [-2, 1, -1, 2, 0];
	return byM;
}

// ---------------------------------------------------------------------------------------------------------------
// The three factors of the wave function, not normalised: only their shape and their sign are used.

/** Associated Laguerre polynomial L_k^a(x), by recurrence. */
function laguerre(k: number, a: number, x: number): number {
	let prev = 1;
	if (k === 0) return prev;
	let cur = 1 + a - x;
	for (let i = 1; i < k; i++) {
		const next = ((2 * i + 1 + a - x) * cur - (i + a) * prev) / (i + 1);
		prev = cur;
		cur = next;
	}
	return cur;
}

/** The radial part R_nl(r), up to a positive constant. */
export function radial(n: number, l: number, r: number): number {
	const rho = (2 * r) / n;
	return Math.exp(-rho / 2) * rho ** l * laguerre(n - l - 1, 2 * l + 1, rho);
}

/** Associated Legendre function P_l^m(u) for m ≥ 0, u = cos θ, without the Condon-Shortley sign. */
export function legendre(l: number, m: number, u: number): number {
	// P_m^m = (2m − 1)!! (1 − u²)^(m/2), then upwards in l.
	let pmm = 1;
	const root = Math.sqrt(Math.max(0, 1 - u * u));
	for (let i = 1; i <= m; i++) pmm *= (2 * i - 1) * root;
	if (l === m) return pmm;
	let pm1 = u * (2 * m + 1) * pmm;
	if (l === m + 1) return pm1;
	let out = 0;
	for (let k = m + 2; k <= l; k++) {
		out = ((2 * k - 1) * u * pm1 - (k + m - 1) * pmm) / (k - m);
		pmm = pm1;
		pm1 = out;
	}
	return out;
}

/** The factor in φ of a real orbital: cos(mφ) for m > 0, sin(|m|φ) for m < 0, 1 for m = 0. */
export const azimuthal = (m: number, phi: number): number => (m > 0 ? Math.cos(m * phi) : m < 0 ? Math.sin(-m * phi) : 1);

/** Where the radial probability r²R² has faded to nothing, in Bohr radii. */
export const cloudRadius = (n: number): number => 3.2 * n * n + 12;

// ---------------------------------------------------------------------------------------------------------------
// Drawing points.

/** A small seeded generator (mulberry32): the same orbital always gives the same cloud. */
export function random(seed: number): () => number {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * A sampler for a density on [a, b]: the cumulative distribution on a grid, inverted by bisection and interpolated
 * inside a step. `steps` is fine enough for the thinnest shell of n = 6.
 */
export function sampler(density: (x: number) => number, a: number, b: number, steps = 4096): (u: number) => number {
	const cdf = new Float64Array(steps + 1);
	const h = (b - a) / steps;
	let prev = density(a);
	for (let i = 1; i <= steps; i++) {
		const cur = density(a + i * h);
		cdf[i] = cdf[i - 1] + (prev + cur) / 2;
		prev = cur;
	}
	const total = cdf[steps];
	return (u) => {
		const target = u * total;
		let lo = 0;
		let hi = steps;
		while (hi - lo > 1) {
			const mid = (lo + hi) >> 1;
			if (cdf[mid] <= target) lo = mid;
			else hi = mid;
		}
		const span = cdf[hi] - cdf[lo];
		return a + (lo + (span > 0 ? (target - cdf[lo]) / span : 0.5)) * h;
	};
}

export interface Cloud {
	/** x, y, z of each point, z along the orbital's axis. */
	positions: Float32Array;
	/**
	 * +1 or −1, changing across every node, so that two neighbouring shells or lobes never have the same value. For a
	 * real orbital it is the sign of ψ. A state with a definite m has a phase that turns with φ and no sign: there it
	 * is the sign of the radial part times the polar one, which changes across the same spheres and cones.
	 */
	signs: Float32Array;
	/** The radius that holds nearly all the points, for framing the cloud. */
	extent: number;
}

/** `count` points drawn from |ψ|² of the orbital. */
export function sampleCloud(orbital: Orbital, count: number, seed = 1): Cloud {
	const { n, l, m, kind } = clampOrbital(orbital);
	const am = Math.abs(m);
	const rand = random(seed + n * 1000 + l * 100 + (m + l) * 10 + (kind === 'reale' ? 1 : 0));
	const drawR = sampler((r) => (r * radial(n, l, r)) ** 2, 0, cloudRadius(n));
	const drawU = sampler((u) => legendre(l, am, u) ** 2, -1, 1);
	const real = kind === 'reale' && m !== 0;
	const drawPhi = real ? sampler((phi) => azimuthal(m, phi) ** 2, 0, 2 * Math.PI) : null;

	const positions = new Float32Array(count * 3);
	const signs = new Float32Array(count);
	const radii = new Float64Array(count);
	for (let i = 0; i < count; i++) {
		const r = drawR(rand());
		const u = drawU(rand());
		const phi = drawPhi ? drawPhi(rand()) : rand() * 2 * Math.PI;
		const s = Math.sqrt(Math.max(0, 1 - u * u));
		positions[3 * i] = r * s * Math.cos(phi);
		positions[3 * i + 1] = r * s * Math.sin(phi);
		positions[3 * i + 2] = r * u;
		radii[i] = r;
		signs[i] = Math.sign(radial(n, l, r) * legendre(l, am, u) * (kind === 'reale' ? azimuthal(m, phi) : 1)) || 1;
	}
	const sorted = Float64Array.from(radii).sort();
	return { positions, signs, extent: sorted[Math.min(count - 1, Math.floor(count * 0.985))] };
}

/**
 * How fast the probability of a state with a definite m turns around the z axis, at a distance `rho` from it: the
 * velocity field of the de Broglie-Bohm picture, v = ħm / (mₑρ) along φ, so the angular velocity is ħm / (mₑρ²).
 * In units of ħ / (mₑa₀²), with `rho` in Bohr radii.
 */
export const flowRate = (m: number, rho: number): number => m / (rho * rho);

// ---------------------------------------------------------------------------------------------------------------
// The nodes: where the wave function is zero.

export interface NodeSurfaces {
	/** Radii of the spheres where the radial part is zero. */
	spheres: number[];
	/** Polar angles θ of the cones around z where the angular part is zero; π/2 is the plane z = 0. */
	cones: number[];
	/** Azimuths φ of the planes through the z axis where a real orbital is zero. A state with a definite m has none. */
	planes: number[];
}

/** The zeros of f on (a, b), found by a scan and refined by bisection. */
function roots(f: (x: number) => number, a: number, b: number, steps = 4000): number[] {
	const out: number[] = [];
	const h = (b - a) / steps;
	let x0 = a + h / 2;
	let f0 = f(x0);
	for (let i = 1; i < steps; i++) {
		const x1 = a + (i + 0.5) * h;
		const f1 = f(x1);
		if (f0 * f1 < 0) {
			let lo = x0;
			let hi = x1;
			let flo = f0;
			for (let k = 0; k < 50; k++) {
				const mid = (lo + hi) / 2;
				const fm = f(mid);
				if (flo * fm <= 0) hi = mid;
				else {
					lo = mid;
					flo = fm;
				}
			}
			out.push((lo + hi) / 2);
		}
		x0 = x1;
		f0 = f1;
	}
	return out;
}

/** The surfaces where ψ is zero: n − l − 1 spheres, and l cones and planes between them. */
export function nodeSurfaces(orbital: Orbital): NodeSurfaces {
	const { n, l, m, kind } = clampOrbital(orbital);
	const am = Math.abs(m);
	const spheres = roots((r) => radial(n, l, r), 1e-6, cloudRadius(n));
	const cones = roots((u) => legendre(l, am, u), -1, 1)
		.map((u) => Math.acos(u))
		.sort((a, b) => a - b);
	const planes: number[] = [];
	if (kind === 'reale') {
		// cos(mφ) = 0 or sin(|m|φ) = 0; a plane through the axis covers φ and φ + π.
		for (let k = 0; k < am; k++) planes.push(m > 0 ? ((2 * k + 1) * Math.PI) / (2 * am) : (k * Math.PI) / am);
	}
	return { spheres, cones, planes };
}

/** The radius that holds nearly all the points of the s orbital of a level: the frame for comparing the levels up to it. */
const references = new Map<number, number>();
export function referenceExtent(level = N_MAX): number {
	if (!references.has(level)) references.set(level, sampleCloud({ n: level, l: 0, m: 0, kind: 'reale' }, 6000).extent);
	return references.get(level)!;
}

// ---------------------------------------------------------------------------------------------------------------
// A section: the points of the cloud that lie in a plane through the nucleus.

/** The plane of a section: two through the z axis, one across it. */
export type SectionPlane = 'xz' | 'yz' | 'xy';

export interface Section {
	/** Across and up of each point in the plane: (x, z), (y, z) or (x, y). */
	positions: Float32Array;
	/** As in a cloud: +1 or −1, changing across every node. */
	signs: Float32Array;
	extent: number;
	/** The whole plane is a node of the orbital: nothing to draw. */
	empty: boolean;
}

/** `count` points drawn from |ψ|² restricted to a plane through the nucleus: a slice of the cloud, not its shadow. */
export function sampleSection(orbital: Orbital, plane: SectionPlane, count: number, seed = 1): Section {
	const { n, l, m, kind } = clampOrbital(orbital);
	const am = Math.abs(m);
	const real = kind === 'reale';
	const rand = random(seed + n * 1000 + l * 100 + (m + l) * 10 + (real ? 1 : 0) + plane.charCodeAt(0) * 7 + plane.charCodeAt(1) * 13);
	const positions = new Float32Array(count * 2);
	const signs = new Float32Array(count).fill(1);
	const none: Section = { positions: new Float32Array(0), signs: new Float32Array(0), extent: 1, empty: true };
	// In a plane the element of area is r dr dθ (or r dr dφ): one power of r less than in space.
	const drawR = sampler((r) => r * radial(n, l, r) ** 2, 0, cloudRadius(n));
	const radii = new Float64Array(count);
	const TINY = 1e-12;

	if (plane === 'xy') {
		const polar = legendre(l, am, 0);
		if (polar * polar < TINY) return none;
		const drawPhi = real && m !== 0 ? sampler((phi) => azimuthal(m, phi) ** 2, 0, 2 * Math.PI) : null;
		for (let i = 0; i < count; i++) {
			const r = drawR(rand());
			const phi = drawPhi ? drawPhi(rand()) : rand() * 2 * Math.PI;
			positions[2 * i] = r * Math.cos(phi);
			positions[2 * i + 1] = r * Math.sin(phi);
			radii[i] = r;
			signs[i] = Math.sign(radial(n, l, r) * polar * (real ? azimuthal(m, phi) : 1)) || 1;
		}
	} else {
		// The two halves of the plane, at φ₀ and φ₀ + π, each with the weight the orbital has there.
		const phi0 = plane === 'xz' ? 0 : Math.PI / 2;
		const weight = (phi: number) => (real && m !== 0 ? azimuthal(m, phi) ** 2 : 1);
		const w0 = weight(phi0);
		const w1 = weight(phi0 + Math.PI);
		if (w0 + w1 < TINY) return none;
		const drawTheta = sampler((theta) => legendre(l, am, Math.cos(theta)) ** 2, 0, Math.PI);
		for (let i = 0; i < count; i++) {
			const r = drawR(rand());
			const theta = drawTheta(rand());
			const front = rand() * (w0 + w1) < w0;
			positions[2 * i] = (front ? 1 : -1) * r * Math.sin(theta);
			positions[2 * i + 1] = r * Math.cos(theta);
			radii[i] = r;
			signs[i] = Math.sign(radial(n, l, r) * legendre(l, am, Math.cos(theta)) * (real ? azimuthal(m, front ? phi0 : phi0 + Math.PI) : 1)) || 1;
		}
	}
	const sorted = Float64Array.from(radii).sort();
	return { positions, signs, extent: sorted[Math.min(count - 1, Math.floor(count * 0.985))], empty: false };
}

// ---------------------------------------------------------------------------------------------------------------
// Opening the cloud to see inside: what is taken away follows the symmetry of the orbital.

export type CutShape = 'ottavo' | 'spicchio' | 'meta';

export interface Cut {
	shape: CutShape;
	/** A point is taken away when it is on the positive side of every plane: unit normals, through the nucleus. */
	normals: [number, number, number][];
}

/** The azimuth the cloud is looked at from when the page opens: the cut faces it. */
const VIEW_AZIMUTH = -Math.PI / 4;

/**
 * How an orbital is opened. A sphere is the same in every direction, so an eighth is enough: its three faces show the
 * shells. An orbital that is the same all around the z axis loses a wedge of a quarter turn, whose two faces show the
 * same profile. A real orbital with lobes around the axis is cut in half along the vertical plane through a lobe, a
 * plane of symmetry of the cloud, so the face of the cut shows the lobes whole.
 */
export function cutFor(orbital: Orbital): Cut {
	const { l, m, kind } = clampOrbital(orbital);
	if (l === 0)
		return {
			shape: 'ottavo',
			normals: [
				[1, 0, 0],
				[0, -1, 0],
				[0, 0, 1]
			]
		};
	if (kind === 'complesso' || m === 0)
		return {
			shape: 'spicchio',
			normals: [
				[1, 0, 0],
				[0, -1, 0]
			]
		};
	// cos(mφ) is largest at φ = 0, sin(|m|φ) at φ = π / (2|m|): the plane at that azimuth holds a lobe.
	const phi = m > 0 ? 0 : Math.PI / (2 * -m);
	let normal: [number, number, number] = [-Math.sin(phi), Math.cos(phi), 0];
	// Of the two halves, the one towards the viewer goes.
	if (normal[0] * Math.cos(VIEW_AZIMUTH) + normal[1] * Math.sin(VIEW_AZIMUTH) < 0) normal = [-normal[0], -normal[1], 0];
	return { shape: 'meta', normals: [normal] };
}

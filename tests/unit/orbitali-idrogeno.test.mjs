// The hydrogen orbitals drawn as clouds of points: the wave function's factors and the sampling.
// Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { N_MAX, angularNodes, azimuthal, clampOrbital, cloudRadius, cutFor, flowRate, legendre, nodeSurfaces, orbitalName, orientationOrder, radial, radialNodes, random, referenceExtent, sampleCloud, sampleSection, sampler } =
	await jiti.import(
	'../../src/lib/orbitali/idrogeno.ts'
);

/** Sign changes of f on (a, b). */
function signChanges(f, a, b, steps = 20000) {
	let changes = 0;
	let prev = Math.sign(f(a + (b - a) / steps / 2));
	for (let i = 1; i < steps; i++) {
		const s = Math.sign(f(a + ((i + 0.5) * (b - a)) / steps));
		if (s !== 0 && prev !== 0 && s !== prev) changes++;
		if (s !== 0) prev = s;
	}
	return changes;
}

test('the radial part has n − l − 1 nodes, and the angular part l − |m|', () => {
	for (let n = 1; n <= N_MAX; n++)
		for (let l = 0; l < n; l++) {
			assert.equal(signChanges((r) => radial(n, l, r), 1e-6, cloudRadius(n)), n - l - 1, `R ${n}${l}`);
			assert.equal(radialNodes({ n, l, m: 0, kind: 'reale' }), n - l - 1);
			assert.equal(angularNodes({ n, l, m: 0, kind: 'reale' }), l);
			for (let m = 0; m <= l; m++) assert.equal(signChanges((u) => legendre(l, m, u), -1, 1), l - m, `P ${l} ${m}`);
		}
});

test('known shapes: 1s decays as exp(−r), 2s changes sign at r = 2, P₂⁰ is (3u² − 1)/2', () => {
	assert.ok(Math.abs(radial(1, 0, 2) / radial(1, 0, 1) - Math.exp(-1)) < 1e-12);
	assert.ok(Math.abs(radial(2, 0, 2)) < 1e-12);
	for (const u of [-0.9, -0.3, 0, 0.4, 1]) {
		assert.ok(Math.abs(legendre(2, 0, u) - (3 * u * u - 1) / 2) < 1e-12);
		assert.ok(Math.abs(legendre(1, 0, u) - u) < 1e-12);
		assert.ok(Math.abs(legendre(1, 1, u) - Math.sqrt(1 - u * u)) < 1e-12);
		assert.ok(Math.abs(legendre(2, 1, u) - 3 * u * Math.sqrt(1 - u * u)) < 1e-12);
	}
	assert.equal(azimuthal(0, 1.3), 1);
	assert.ok(Math.abs(azimuthal(2, 0.4) - Math.cos(0.8)) < 1e-12);
	assert.ok(Math.abs(azimuthal(-2, 0.4) - Math.sin(0.8)) < 1e-12);
});

test('the sampler follows the density', () => {
	// A triangle on [0, 1]: the mean is 2/3, the median √½.
	const draw = sampler((x) => x, 0, 1);
	assert.ok(Math.abs(draw(0.5) - Math.SQRT1_2) < 1e-3);
	const rand = random(7);
	let sum = 0;
	for (let i = 0; i < 40000; i++) sum += draw(rand());
	assert.ok(Math.abs(sum / 40000 - 2 / 3) < 0.01);
});

test('the mean radius of a cloud is [3n² − l(l + 1)] / 2 Bohr radii', () => {
	for (const [n, l, m] of [
		[1, 0, 0],
		[2, 0, 0],
		[2, 1, 1],
		[3, 2, -2],
		[4, 1, 0],
		[5, 3, 2],
		[6, 0, 0]
	]) {
		for (const kind of ['reale', 'complesso']) {
			const { positions, extent } = sampleCloud({ n, l, m, kind }, 40000);
			let sum = 0;
			for (let i = 0; i < 40000; i++) sum += Math.hypot(positions[3 * i], positions[3 * i + 1], positions[3 * i + 2]);
			const expected = (3 * n * n - l * (l + 1)) / 2;
			assert.ok(Math.abs(sum / 40000 / expected - 1) < 0.03, `${n} ${l} ${m} ${kind}: ${sum / 40000} vs ${expected}`);
			assert.ok(extent > expected && extent < cloudRadius(n));
		}
	}
});

test('real orbitals point where the books say, with the two signs in the two lobes', () => {
	const share = (o, inside) => {
		const { positions, signs } = sampleCloud(o, 20000);
		let hit = 0;
		for (let i = 0; i < 20000; i++) if (inside(positions[3 * i], positions[3 * i + 1], positions[3 * i + 2], signs[i])) hit++;
		return hit / 20000;
	};
	// 2p_x: along x, positive where x > 0, nothing on the plane x = 0.
	assert.ok(share({ n: 2, l: 1, m: 1, kind: 'reale' }, (x, y, z) => Math.abs(x) > Math.abs(y) && Math.abs(x) > Math.abs(z)) > 0.55);
	assert.equal(share({ n: 2, l: 1, m: 1, kind: 'reale' }, (x, y, z, s) => Math.sign(x) === s), 1);
	assert.equal(share({ n: 2, l: 1, m: -1, kind: 'reale' }, (x, y, z, s) => Math.sign(y) === s), 1);
	assert.equal(share({ n: 2, l: 1, m: 0, kind: 'reale' }, (x, y, z, s) => Math.sign(z) === s), 1);
	// 3d_xy: the sign is the sign of xy.
	assert.equal(share({ n: 3, l: 2, m: -2, kind: 'reale' }, (x, y, z, s) => Math.sign(x * y) === s), 1);
	// 3d_z²: positive along z, negative in the ring.
	assert.equal(share({ n: 3, l: 2, m: 0, kind: 'reale' }, (x, y, z, s) => Math.sign(3 * z * z - (x * x + y * y + z * z)) === s), 1);
	// 2s: positive inside the node at r = 2, negative outside.
	assert.equal(share({ n: 2, l: 0, m: 0, kind: 'reale' }, (x, y, z, s) => Math.sign(2 - Math.hypot(x, y, z)) === s), 1);
	// A state with a definite m is the same all around the axis: a quarter of the points in each quadrant.
	const quadrant = share({ n: 3, l: 2, m: 2, kind: 'complesso' }, (x, y) => x > 0 && y > 0);
	assert.ok(Math.abs(quadrant - 0.25) < 0.015);
});

test('names, limits and the flow', () => {
	assert.deepEqual(clampOrbital({ n: 9, l: 7, m: -9, kind: 'reale' }), { n: N_MAX, l: N_MAX - 1, m: -(N_MAX - 1), kind: 'reale' });
	assert.deepEqual(clampOrbital({ n: 2, l: 3, m: 2, kind: 'complesso' }), { n: 2, l: 1, m: 1, kind: 'complesso' });
	assert.deepEqual(orbitalName({ n: 2, l: 1, m: 1, kind: 'reale' }), { level: '2p', direction: 'x' });
	assert.deepEqual(orbitalName({ n: 3, l: 2, m: -2, kind: 'reale' }), { level: '3d', direction: 'xy' });
	assert.deepEqual(orbitalName({ n: 3, l: 2, m: 2, kind: 'complesso' }), { level: '3d', direction: null });
	assert.deepEqual(orbitalName({ n: 4, l: 3, m: 1, kind: 'reale' }), { level: '4f', direction: null });
	// The order of the orientations, in the table and in the selector: x, y, z and xy, xz, yz, x²−y², z² for the orbitals of the books.
	const names = (l, kind) => orientationOrder(l, kind).map((m) => orbitalName({ n: 4, l, m, kind }).direction);
	assert.deepEqual(names(1, 'reale'), ['x', 'y', 'z']);
	assert.deepEqual(names(2, 'reale'), ['xy', 'xz', 'yz', 'x²−y²', 'z²']);
	assert.deepEqual(orientationOrder(2, 'complesso'), [-2, -1, 0, 1, 2]);
	assert.deepEqual(orientationOrder(3, 'reale'), [-3, -2, -1, 0, 1, 2, 3]);
	assert.deepEqual(orientationOrder(0, 'reale'), [0]);
	// Twice as far from the axis, four times slower; the other way round for −m; still for m = 0.
	assert.equal(flowRate(1, 2), flowRate(1, 1) / 4);
	assert.equal(flowRate(-2, 3), -flowRate(2, 3));
	assert.equal(flowRate(0, 1), 0);
	// The same orbital gives the same cloud.
	assert.deepEqual(sampleCloud({ n: 3, l: 1, m: 0, kind: 'reale' }, 50).positions, sampleCloud({ n: 3, l: 1, m: 0, kind: 'reale' }, 50).positions);
});

test('the node surfaces: n − l − 1 spheres, l cones and planes for a real orbital', () => {
	for (let n = 1; n <= N_MAX; n++)
		for (let l = 0; l < n; l++)
			for (let m = -l; m <= l; m++) {
				const real = nodeSurfaces({ n, l, m, kind: 'reale' });
				assert.equal(real.spheres.length, n - l - 1, `${n} ${l} ${m}`);
				assert.equal(real.cones.length + real.planes.length, l, `${n} ${l} ${m}`);
				assert.equal(real.planes.length, Math.abs(m));
				for (const r of real.spheres) assert.ok(Math.abs(radial(n, l, r)) < 1e-9 * Math.abs(radial(n, l, r + 0.3)));
				// The state with a definite m has the same spheres and cones, and no plane: its density is the same all around the axis.
				const complex = nodeSurfaces({ n, l, m, kind: 'complesso' });
				assert.deepEqual(complex.spheres, real.spheres);
				assert.deepEqual(complex.cones, real.cones);
				assert.equal(complex.planes.length, 0);
			}
	// 2s: one sphere at 2 Bohr radii. 2p_z: the plane z = 0. 2p_x: the plane x = 0, at φ = 90°. 3d_z²: two cones at 54,7° from the axis.
	assert.ok(Math.abs(nodeSurfaces({ n: 2, l: 0, m: 0, kind: 'reale' }).spheres[0] - 2) < 1e-9);
	assert.ok(Math.abs(nodeSurfaces({ n: 2, l: 1, m: 0, kind: 'reale' }).cones[0] - Math.PI / 2) < 1e-9);
	assert.ok(Math.abs(nodeSurfaces({ n: 2, l: 1, m: 1, kind: 'reale' }).planes[0] - Math.PI / 2) < 1e-12);
	assert.equal(nodeSurfaces({ n: 2, l: 1, m: -1, kind: 'reale' }).planes[0], 0);
	const magic = Math.acos(1 / Math.sqrt(3));
	const dz2 = nodeSurfaces({ n: 3, l: 2, m: 0, kind: 'reale' }).cones;
	assert.ok(Math.abs(dz2[0] - magic) < 1e-9 && Math.abs(dz2[1] - (Math.PI - magic)) < 1e-9);
	// No point of a cloud sits on a node sphere's wrong side: inside the first sphere of 3s the sign is one, between the two the other.
	const [r1, r2] = nodeSurfaces({ n: 3, l: 0, m: 0, kind: 'reale' }).spheres;
	for (const kind of ['reale', 'complesso']) {
		// Also a state in motion, which has no sign, changes ink from one shell to the next.
		const { positions, signs } = sampleCloud({ n: 3, l: 0, m: 0, kind }, 5000);
		for (let i = 0; i < 5000; i++) {
			const r = Math.hypot(positions[3 * i], positions[3 * i + 1], positions[3 * i + 2]);
			assert.equal(signs[i], r < r1 || r > r2 ? 1 : -1);
		}
		const slice = sampleSection({ n: 3, l: 0, m: 0, kind }, 'xz', 3000);
		for (let i = 0; i < 3000; i++) {
			const r = Math.hypot(slice.positions[2 * i], slice.positions[2 * i + 1]);
			assert.equal(slice.signs[i], r < r1 || r > r2 ? 1 : -1);
		}
	}
	// In motion the ink changes across the cones too, and not around the axis: 3d with m = 1 has the plane z = 0 as a node.
	const turning = sampleCloud({ n: 3, l: 2, m: 1, kind: 'complesso' }, 5000);
	for (let i = 0; i < 5000; i++) assert.equal(turning.signs[i], Math.sign(turning.positions[3 * i + 2]));
	assert.ok(referenceExtent() > 40 && referenceExtent() < cloudRadius(N_MAX));
});

test('a section is a slice of the cloud: empty on a nodal plane, with the right signs elsewhere', () => {
	const N = 8000;
	// p_z has nothing in the plane z = 0, p_y nothing in the plane y = 0, p_x nothing in the plane x = 0.
	assert.ok(sampleSection({ n: 2, l: 1, m: 0, kind: 'reale' }, 'xy', N).empty);
	assert.ok(sampleSection({ n: 2, l: 1, m: -1, kind: 'reale' }, 'xz', N).empty);
	assert.ok(sampleSection({ n: 2, l: 1, m: 1, kind: 'reale' }, 'yz', N).empty);
	// d_xy lives in the plane xy and is zero on both vertical planes.
	assert.ok(sampleSection({ n: 3, l: 2, m: -2, kind: 'reale' }, 'xz', N).empty);
	assert.ok(sampleSection({ n: 3, l: 2, m: -2, kind: 'reale' }, 'yz', N).empty);
	const all = (section, rule) => {
		assert.ok(!section.empty);
		for (let i = 0; i < N; i++) assert.ok(rule(section.positions[2 * i], section.positions[2 * i + 1], section.signs[i]), `point ${i}`);
	};
	all(sampleSection({ n: 2, l: 1, m: 0, kind: 'reale' }, 'xz', N), (x, z, s) => Math.sign(z) === s);
	all(sampleSection({ n: 2, l: 1, m: 1, kind: 'reale' }, 'xz', N), (x, z, s) => Math.sign(x) === s);
	all(sampleSection({ n: 2, l: 1, m: -1, kind: 'reale' }, 'yz', N), (y, z, s) => Math.sign(y) === s);
	all(sampleSection({ n: 3, l: 2, m: -2, kind: 'reale' }, 'xy', N), (x, y, s) => Math.sign(x * y) === s);
	all(sampleSection({ n: 3, l: 2, m: 2, kind: 'reale' }, 'xy', N), (x, y, s) => Math.sign(x * x - y * y) === s);
	all(sampleSection({ n: 2, l: 0, m: 0, kind: 'reale' }, 'xz', N), (x, z, s) => Math.sign(2 - Math.hypot(x, z)) === s);
	// A state with a definite m is never empty on a vertical plane, and is the same on both sides of the axis.
	const flow = sampleSection({ n: 3, l: 2, m: 2, kind: 'complesso' }, 'xz', N);
	let right = 0;
	for (let i = 0; i < N; i++) if (flow.positions[2 * i] > 0) right++;
	assert.ok(!flow.empty && Math.abs(right / N - 0.5) < 0.03);
	// In a plane the mean radius of 1s is 1 Bohr radius (in space it is 1,5): the density r·exp(−2r) has mean 1.
	const s = sampleSection({ n: 1, l: 0, m: 0, kind: 'reale' }, 'xy', 40000);
	let sum = 0;
	for (let i = 0; i < 40000; i++) sum += Math.hypot(s.positions[2 * i], s.positions[2 * i + 1]);
	assert.ok(Math.abs(sum / 40000 - 1) < 0.02);
});

test('the cut follows the symmetry: an eighth for a sphere, a wedge around the axis, a half through the lobes', () => {
	for (let n = 1; n <= N_MAX; n++)
		for (let l = 0; l < n; l++)
			for (let m = -l; m <= l; m++)
				for (const kind of ['reale', 'complesso']) {
					const cut = cutFor({ n, l, m, kind });
					const expected = l === 0 ? 'ottavo' : kind === 'complesso' || m === 0 ? 'spicchio' : 'meta';
					assert.equal(cut.shape, expected, `${n} ${l} ${m} ${kind}`);
					assert.equal(cut.normals.length, { ottavo: 3, spicchio: 2, meta: 1 }[expected]);
					for (const [x, y, z] of cut.normals) assert.ok(Math.abs(Math.hypot(x, y, z) - 1) < 1e-12);
					if (expected !== 'meta') continue;
					// The plane of the cut holds the z axis and the direction where the orbital is largest, and the half
					// taken away is the one towards the viewer, at an azimuth of −45°.
					const [x, y, z] = cut.normals[0];
					assert.equal(z, 0);
					const phi = Math.atan2(-x, y);
					assert.ok(Math.abs(azimuthal(m, phi) ** 2 - 1) < 1e-9, `${l} ${m}: ${phi}`);
					assert.ok(x * Math.SQRT1_2 - y * Math.SQRT1_2 > -1e-12);
				}
	// An eighth of 1s: one point in eight is taken away. Half of 2p_x: one in two, and what is left is still both lobes.
	const share = (o) => {
		const { positions } = sampleCloud(o, 20000);
		const { normals } = cutFor(o);
		let gone = 0;
		for (let i = 0; i < 20000; i++) if (normals.every(([a, b, c]) => a * positions[3 * i] + b * positions[3 * i + 1] + c * positions[3 * i + 2] > 0)) gone++;
		return gone / 20000;
	};
	assert.ok(Math.abs(share({ n: 1, l: 0, m: 0, kind: 'reale' }) - 1 / 8) < 0.01);
	assert.ok(Math.abs(share({ n: 2, l: 1, m: 0, kind: 'reale' }) - 1 / 4) < 0.012);
	assert.ok(Math.abs(share({ n: 2, l: 1, m: 1, kind: 'reale' }) - 1 / 2) < 0.012);
	assert.ok(Math.abs(share({ n: 3, l: 2, m: -2, kind: 'reale' }) - 1 / 2) < 0.012);
	assert.deepEqual(cutFor({ n: 2, l: 1, m: 1, kind: 'reale' }).normals, [[0, -1, 0]]);
});

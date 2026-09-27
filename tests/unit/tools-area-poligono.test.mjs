// The area of a polygon from its vertices (shoelace formula) and its perimeter: exact values, orientation, crossing
// sides, brute force against the float formula on random polygons.
// Run with `node --test tests/unit/tools-area-poligono.test.mjs`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { areaPoligono } = await jiti.import('../../src/lib/tools/area-poligono.ts');

const close = (a, b, what = '') => assert.ok(Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)), `${what}: ${a} ≠ ${b}`);
const V = (...pairs) => pairs.map(([x, y]) => ({ x: String(x), y: String(y) }));
const ok = (res, name) => {
	assert.ok(res.outcome.ok, `${name}: ${res.outcome.error}`);
	assertReadable(res.outcome, name);
	return res;
};
const bad = (res, pattern) => {
	assert.equal(res.outcome.ok, false);
	assert.equal(res.plot, null);
	if (pattern) assert.match(res.outcome.error, pattern);
	assert.ok(!res.outcome.error.includes('$'), res.outcome.error);
};
const text = (res) => JSON.stringify(res.outcome);

test('the example of the page: a pentagon', () => {
	const p = ok(areaPoligono(V([-2, 1], [3, -1], [6, 2], [4, 5], [0, 4])), 'default');
	assert.equal(p.outcome.rows[0].value, '$A = \\frac{57}{2}$ $= 28{,}5$');
	assert.equal(p.outcome.rows[1].value, '$2p = 3\\sqrt{2} + 2\\sqrt{13} + \\sqrt{17} + \\sqrt{29}$ $\\approx 20{,}96$');
	assert.equal(p.outcome.copy, 'A = 57/2 = 28,5; 2p = 3√2 + 2√13 + √17 + √29 ≈ 20,96');
	assert.equal(p.check.sum, 57);
	assert.match(text(p), /antiorario/);
	assert.equal(p.outcome.steps[0].table.rows.length, 6, 'the first vertex again at the end');
	assert.equal(p.plot.segments.length, 5);
});

test('a right triangle clockwise, a square, fractions, decimals', () => {
	const t = ok(areaPoligono(V([0, 0], [0, 3], [4, 0])), 'clockwise');
	assert.equal(t.outcome.copy, 'A = 6; 2p = 12');
	assert.match(text(t), /senso orario/);
	const sq = ok(areaPoligono(V([1, 1], [4, 1], [4, 4], [1, 4])), 'square');
	assert.equal(sq.outcome.copy, 'A = 9; 2p = 12');
	const f = ok(areaPoligono(V([0, 0], ['1/2', 0], [0, '1/3'])), 'fractions');
	close(f.check.area, 1 / 12, 'area');
	assert.match(f.outcome.rows[0].value, /\\frac\{1\}\{12\}\$ \$\\approx 0\{,\}083/);
	const d = ok(areaPoligono(V([0, 0], ['2,5', 0], ['2,5', '1,5'], [0, '1,5'])), 'decimals');
	assert.equal(d.outcome.copy, 'A = 3,75; 2p = 8');
	// Three vertices in a row on one side are fine.
	const row = ok(areaPoligono(V([0, 0], [2, 0], [4, 0], [4, 3], [0, 3])), 'collinear side');
	close(row.check.area, 12, 'area');
});

test('empty rows are skipped; wrong inputs say what to write', () => {
	const skip = ok(areaPoligono([...V([0, 0], [4, 0]), { x: '', y: '' }, ...V([0, 3])]), 'empty row');
	close(skip.check.area, 6, 'area');
	bad(areaPoligono(V([0, 0], [1, 1])), /almeno tre vertici/);
	bad(areaPoligono(V(...Array.from({ length: 13 }, (_, i) => [Math.cos(i), Math.sin(i)]))), /al massimo 12/);
	bad(areaPoligono([...V([0, 0], [4, 0]), { x: '1', y: '' }]), /Scrivi l'ordinata di C/);
	bad(areaPoligono(V([0, 0], [4, 'a'], [0, 3])), /ordinata di B non è un numero/);
	bad(areaPoligono(V([0, 0], [4, 0], [4, 0], [0, 3])), /B e C coincidono/);
	bad(areaPoligono(V([0, 0], [4, 0], [0, 3], [0, 0])), /D e A coincidono/);
	bad(areaPoligono(V([0, 0], [1, 1], [2, 2])), /su una retta/);
	bad(areaPoligono(V([0, 0], [2, 2], [2, 0], [0, 2])), /AB e CD si incrociano/);
	bad(areaPoligono(V([0, 0], [4, 0], [2, 0], [2, 3])), /tornano indietro|si incrociano/);
	bad(areaPoligono(V([0, 0], [100000, 0], [0, 3])), /troppo grande/);
});

/** A random polygon around the origin (star-shaped, so simple): points on an ellipse at sorted random angles, rounded. */
function convex(seed, n) {
	let s = seed;
	const rand = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
	const angles = Array.from({ length: n }, () => rand() * 2 * Math.PI).sort((a, b) => a - b);
	const pts = [];
	for (const t of angles) {
		const p = [Math.round(20 * Math.cos(t)), Math.round(15 * Math.sin(t))];
		if (!pts.some((q) => q[0] === p[0] && q[1] === p[1])) pts.push(p);
	}
	return pts;
}

const shoelace = (pts) => Math.abs(pts.reduce((s, [x, y], i) => s + x * pts[(i + 1) % pts.length][1] - pts[(i + 1) % pts.length][0] * y, 0)) / 2;
const perimeter = (pts) => pts.reduce((s, [x, y], i) => s + Math.hypot(pts[(i + 1) % pts.length][0] - x, pts[(i + 1) % pts.length][1] - y), 0);

test('brute force: random star-shaped polygons, any starting vertex, both orientations', () => {
	let checked = 0;
	for (let seed = 1; seed <= 300; seed++) {
		const pts = convex(seed, 3 + (seed % 8));
		if (pts.length < 3 || shoelace(pts) === 0) continue;
		const res = areaPoligono(V(...pts));
		// Rounding can put three vertices on a line and make a side fold back: then the refusal is right.
		if (!res.outcome.ok) {
			assert.match(res.outcome.error, /retta|indietro|incrociano/, `seed ${seed}`);
			continue;
		}
		close(res.check.area, shoelace(pts), `area ${seed}`);
		close(res.check.perimeter, perimeter(pts), `perimeter ${seed}`);
		const turned = [...pts.slice(2), ...pts.slice(0, 2)];
		close(areaPoligono(V(...turned)).check.area, res.check.area, `turned ${seed}`);
		const back = areaPoligono(V(...[...pts].reverse()));
		close(back.check.area, res.check.area, `reversed ${seed}`);
		assert.equal(Math.sign(back.check.sum), -Math.sign(res.check.sum), `orientation ${seed}`);
		if (checked++ % 20 === 0) assertReadable(res.outcome, `seed ${seed}`);
	}
	assert.ok(checked > 200, `only ${checked} polygons checked`);
});

test('brute force: swapping two vertices of a convex quadrilateral makes the sides cross', () => {
	for (let seed = 1; seed <= 100; seed++) {
		const pts = convex(seed, 4);
		if (pts.length !== 4) continue;
		// Rounding to integers can spoil the convexity: only strictly convex quadrilaterals.
		const turns = pts.map(([x, y], i) => {
			const [b, c] = [pts[(i + 1) % 4], pts[(i + 2) % 4]];
			return Math.sign((b[0] - x) * (c[1] - b[1]) - (b[1] - y) * (c[0] - b[0]));
		});
		if (turns.some((t) => t !== turns[0] || t === 0)) continue;
		const crossed = [pts[0], pts[2], pts[1], pts[3]];
		bad(areaPoligono(V(...crossed)), /si incrociano/);
	}
});

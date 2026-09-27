// Solving triangles: the right triangle from two elements, any triangle with the laws of sines and cosines.
// Run with `node --test tests/unit/tools-triangoli.test.mjs`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { triangoloRettangolo, triangoloQualsiasi } = await jiti.import('../../src/lib/tools/triangoli.ts');

const DEG = Math.PI / 180;
const right = (mode, x, y, u = '') => {
	const r = triangoloRettangolo(mode, String(x).replace('.', ','), String(y).replace('.', ','), u);
	assert.ok(r.outcome.ok, `${mode} ${x} ${y}: ${r.outcome.error}`);
	return r;
};
const any = (mode, x, y, z, u = '') => {
	const r = triangoloQualsiasi(mode, String(x).replace('.', ','), String(y).replace('.', ','), String(z).replace('.', ','), u);
	assert.ok(r.outcome.ok, `${mode} ${x} ${y} ${z}: ${r.outcome.error}`);
	return r;
};

/** The values of the copy text by name: "a = 10 cm; β ≈ 36,87° ≈ 36° 52′ 12″" → { a: 10, β: 36.87 }. */
function values(copy) {
	const out = {};
	for (const item of copy.split('; ')) {
		const name = item.split(' ')[0];
		const deg = item.includes('°');
		const s = deg ? item.slice(item.search(/[=≈]/) + 1).split('≈')[0] : item.includes('≈') ? item.slice(item.lastIndexOf('≈') + 1) : item.slice(item.indexOf('=') + 1);
		out[name] = Number(
			s
				.replace(/°|mm|cm|dm|km|m/g, '')
				.replace(/\s/g, '')
				.replace(',', '.')
		);
	}
	return out;
}
const close = (a, b, tol, what) => assert.ok(Math.abs(a - b) <= tol, `${what}: ${a} ≠ ${b}`);
/** Sides are rounded to two decimals, angles to two decimals of a degree. */
const side = (a, b, what) => close(a, b, 5e-3 + 1e-9 * b, what);
const angle = (a, b, what) => close(a, b, 5e-3 + 1e-9, what);

/** The drawn triangle has the sides of the result. */
function checkSketch(sketch, a, b, c) {
	const d = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
	close(d(sketch.B, sketch.C), a, 1e-6, 'sketch a');
	close(d(sketch.C, sketch.A), b, 1e-6, 'sketch b');
	close(d(sketch.A, sketch.B), c, 1e-6, 'sketch c');
}

test('right triangle: exact results for the notable angles', () => {
	assert.equal(right('cateti', 6, 8, 'cm').outcome.copy, 'a = 10 cm; β ≈ 36,87° ≈ 36° 52′ 12″; γ ≈ 53,13° ≈ 53° 7′ 48″');
	assert.equal(right('ipotenusa-cateto', 10, 5, 'cm').outcome.copy, 'c = 5√3 cm ≈ 8,66 cm; β = 30°; γ = 60°');
	assert.equal(right('ipotenusa-angolo', 12, 30, 'cm').outcome.copy, 'γ = 60°; b = 6 cm; c = 6√3 cm ≈ 10,39 cm');
	assert.equal(right('ipotenusa-angolo', 8, 45).outcome.copy, 'γ = 45°; b = 4√2 ≈ 5,66; c = 4√2 ≈ 5,66');
	assert.equal(right('cateto-opposto', 5, 30).outcome.copy, 'γ = 60°; a = 10; c = 5√3 ≈ 8,66');
	assert.equal(right('cateto-adiacente', 9, 60, 'm').outcome.copy, 'β = 30°; a = 18 m; c = 9√3 m ≈ 15,59 m');
	assert.equal(right('cateti', 4, 4).outcome.copy, 'a = 4√2 ≈ 5,66; β = 45°; γ = 45°');
	// 36° 52′ 12″ is 36,87° exactly; 36° 52′ is 36,8666…°, kept in primes.
	assert.equal(right('ipotenusa-angolo', 10, "36° 52' 12''").outcome.copy.split('; ')[0], 'γ = 53,13°');
	assert.equal(right('ipotenusa-angolo', 10, "36° 52'").outcome.copy.split('; ')[0], 'γ = 53° 8′ 0″ ≈ 53,13°');
});

test('right triangle: every mode agrees with the formulas', () => {
	for (let b = 1; b <= 25; b += 2)
		for (let c = 1; c <= 25; c += 3) {
			const a = Math.hypot(b, c);
			const beta = Math.atan(b / c) / DEG;
			let r = right('cateti', b, c);
			let v = values(r.outcome.copy);
			side(v.a, a, `a ${b} ${c}`);
			angle(v['β'], beta, `β ${b} ${c}`);
			angle(v['γ'], 90 - beta, `γ ${b} ${c}`);
			checkSketch(r.sketch, a, b, c);
			if (b < c) {
				r = right('ipotenusa-cateto', c, b);
				v = values(r.outcome.copy);
				side(v.c, Math.sqrt(c * c - b * b), `c ${c} ${b}`);
				angle(v['β'], Math.asin(b / c) / DEG, `β ${c} ${b}`);
			}
		}
	for (let a = 1; a <= 40; a += 3.5)
		for (let deg = 1; deg < 90; deg += 7) {
			let v = values(right('ipotenusa-angolo', a, deg).outcome.copy);
			side(v.b, a * Math.sin(deg * DEG), `b ${a} ${deg}`);
			side(v.c, a * Math.cos(deg * DEG), `c ${a} ${deg}`);
			v = values(right('cateto-opposto', a, deg).outcome.copy);
			side(v.a, a / Math.sin(deg * DEG), `a from b ${a} ${deg}`);
			side(v.c, a / Math.tan(deg * DEG), `c from b ${a} ${deg}`);
			v = values(right('cateto-adiacente', a, deg).outcome.copy);
			side(v.a, a / Math.cos(deg * DEG), `a from b, γ ${a} ${deg}`);
			side(v.c, a * Math.tan(deg * DEG), `c from b, γ ${a} ${deg}`);
			angle(v['β'], 90 - deg, `β ${deg}`);
		}
});

test('any triangle: the four cases', () => {
	assert.equal(any('lll', 7, 5, 8).outcome.copy, 'α = 60°; β ≈ 38,21° ≈ 38° 12′ 48″; γ ≈ 81,79° ≈ 81° 47′ 12″');
	assert.equal(any('lal', 5, 8, 60, 'cm').outcome.copy, 'a = 7 cm; β ≈ 38,21° ≈ 38° 12′ 48″; γ ≈ 81,79° ≈ 81° 47′ 12″');
	assert.equal(any('lal', 3, 3, 120).outcome.copy, 'a = 3√3 ≈ 5,20; β = 30°; γ = 30°');
	assert.equal(any('ala', 10, 45, 105).outcome.copy, 'α = 30°; b = 10√2 ≈ 14,14; c ≈ 19,32');
	assert.equal(any('lll', 3, 4, 5).outcome.copy, 'α ≈ 36,87° ≈ 36° 52′ 12″; β ≈ 53,13° ≈ 53° 7′ 48″; γ = 90°');
	assert.equal(any('lla', 5, 10, 30).outcome.copy, 'β = 90°; γ = 60°; c = 5√3 ≈ 8,66');
	const two = any('lla', 6, 8, 40).outcome;
	assert.equal(two.rows.length, 6);
	assert.match(two.copy, /^β1 ≈ 58,99° .*; β2 ≈ 121,01° /);
	assert.equal(any('lla', 10, 5, 120).outcome.rows.length, 3);
	assert.equal(any('lla', 5, 5, 50).outcome.rows.length, 3);
});

test('any triangle: random triangles solved back', () => {
	let seed = 7;
	const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
	for (let i = 0; i < 300; i++) {
		const al = 5 + rnd() * 150;
		const be = 5 + rnd() * (170 - al);
		const ga = 180 - al - be;
		const k = 1 + rnd() * 20;
		const [a, b, c] = [al, be, ga].map((x) => Math.round(k * Math.sin(x * DEG) * 100) / 100);
		if (a + b <= c + 0.02 || a + c <= b + 0.02 || b + c <= a + 0.02) continue;
		// Angles from the rounded sides.
		const A = Math.acos((b * b + c * c - a * a) / (2 * b * c)) / DEG;
		const B = Math.acos((a * a + c * c - b * b) / (2 * a * c)) / DEG;
		let r = any('lll', a, b, c);
		let v = values(r.outcome.copy);
		angle(v['α'], A, `α ${a} ${b} ${c}`);
		angle(v['β'], B, `β ${a} ${b} ${c}`);
		angle(v['γ'], 180 - A - B, `γ ${a} ${b} ${c}`);
		checkSketch(r.sketch, a, b, c);

		const alpha = Math.round(A * 100) / 100;
		r = any('lal', b, c, alpha);
		v = values(r.outcome.copy);
		const a2 = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(alpha * DEG));
		side(v.a, a2, `lal a ${b} ${c} ${alpha}`);
		angle(v['β'], Math.acos((a2 * a2 + c * c - b * b) / (2 * a2 * c)) / DEG, `lal β`);

		const [b1, g1] = [Math.round(be * 100) / 100, Math.round(ga * 100) / 100];
		if (b1 + g1 < 180) {
			v = values(any('ala', a, b1, g1).outcome.copy);
			const a1 = 180 - b1 - g1;
			side(v.b, (a * Math.sin(b1 * DEG)) / Math.sin(a1 * DEG), `ala b`);
			side(v.c, (a * Math.sin(g1 * DEG)) / Math.sin(a1 * DEG), `ala c`);
		}

		// Two sides and the angle opposite a: count the triangles.
		const s = (b * Math.sin(alpha * DEG)) / a;
		const out = triangoloQualsiasi('lla', String(a).replace('.', ','), String(b).replace('.', ','), String(alpha).replace('.', ','));
		if (s > 1 + 1e-9) assert.equal(out.outcome.ok, false);
		else if (out.outcome.ok) {
			const b1s = Math.asin(Math.min(1, s)) / DEG;
			const expected = (alpha + b1s < 180 ? 1 : 0) + (Math.abs(s - 1) > 1e-9 && alpha + 180 - b1s < 180 ? 1 : 0);
			assert.equal(out.outcome.rows.length, 3 * expected, `lla ${a} ${b} ${alpha}`);
		}
	}
});

test('every string typesets and every sentence is short', () => {
	for (const [m, x, y] of [
		['cateti', 6, 8],
		['cateti', 1, 1],
		['ipotenusa-cateto', 10, 5],
		['ipotenusa-cateto', 13, 12],
		['ipotenusa-angolo', 12, 30],
		['ipotenusa-angolo', 7, "22° 30'"],
		['cateto-opposto', 5, 40],
		['cateto-adiacente', 9, 60],
		['cateto-adiacente', 2.5, 45]
	])
		assertReadable(right(m, x, y, 'cm').outcome, `${m} ${x} ${y}`);
	for (const [m, x, y, z] of [
		['lll', 7, 5, 8],
		['lll', 3, 4, 5],
		['lll', 2, 2, 2],
		['lal', 5, 8, 60],
		['lal', 5, 8, 45],
		['lal', 3, 3, 120],
		['lal', 4, 6, 90],
		['ala', 10, 45, 105],
		['ala', 7, 30, 30],
		['lla', 6, 8, 40],
		['lla', 5, 10, 30],
		['lla', 10, 5, 120],
		['lla', 5, 5, 50]
	])
		assertReadable(any(m, x, y, z, 'm').outcome, `${m} ${x} ${y} ${z}`);
});

test('wrong input', () => {
	const bad = (r) => {
		assert.equal(r.outcome.ok, false);
		assert.match(r.outcome.error, /[a-z]/);
		assertReadable(r.outcome);
	};
	bad(triangoloRettangolo('ipotenusa-cateto', '5', '10'));
	bad(triangoloRettangolo('ipotenusa-cateto', '5', '5'));
	bad(triangoloRettangolo('ipotenusa-angolo', '5', '90'));
	bad(triangoloRettangolo('ipotenusa-angolo', '5', '0'));
	bad(triangoloRettangolo('cateto-opposto', '5', 'abc'));
	bad(triangoloRettangolo('cateti', '', '5'));
	bad(triangoloRettangolo('cateti', '-3', '5'));
	bad(triangoloRettangolo('boh', '3', '5'));
	bad(triangoloQualsiasi('lll', '1', '2', '3'));
	bad(triangoloQualsiasi('lll', '1', '2', '10'));
	bad(triangoloQualsiasi('lal', '1', '2', '180'));
	bad(triangoloQualsiasi('ala', '1', '100', '80'));
	bad(triangoloQualsiasi('lla', '4', '8', '40'));
	bad(triangoloQualsiasi('lla', '5', '8', '120'));
	bad(triangoloQualsiasi('lla', '5', '5', '90'));
});

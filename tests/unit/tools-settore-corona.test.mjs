// The circular sector and the annulus: exact values with π, degrees and radians, brute force against the float
// formulas, wrong inputs. Run with `node --test tests/unit/tools-settore-corona.test.mjs`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { settore, corona, parseRadians } = await jiti.import('../../src/lib/tools/settore-corona.ts');

const close = (a, b, what = '') => assert.ok(Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)), `${what}: ${a} ≠ ${b}`);
const ok = (res, name) => {
	assert.ok(res.outcome.ok, `${name}: ${res.outcome.error}`);
	assertReadable(res.outcome, name);
	return res;
};
const bad = (res, pattern) => {
	assert.equal(res.outcome.ok, false);
	if (pattern) assert.match(res.outcome.error, pattern);
	assert.ok(!res.outcome.error.includes('$'), res.outcome.error);
};
const text = (res) => JSON.stringify(res.outcome);
const deg = (r, a, u = '') => settore({ r, a, unit: 'gradi', u });
const rad = (r, a, u = '') => settore({ r, a, unit: 'radianti', u });

test('sector in degrees: the example of the page', () => {
	const s = ok(deg('6', '60', 'cm'), 'default');
	assert.deepEqual(
		s.outcome.rows.map((r) => r.value),
		['$\\ell = 2\\pi\\,\\text{cm}$ $\\approx 6{,}28\\,\\text{cm}$', '$A = 6\\pi\\,\\text{cm}^2$ $\\approx 18{,}85\\,\\text{cm}^2$', '$2p = (12 + 2\\pi)\\,\\text{cm}$ $\\approx 18{,}28\\,\\text{cm}$']
	);
	assert.equal(s.outcome.copy, 'ℓ = 2π cm ≈ 6,28 cm; A = 6π cm² ≈ 18,85 cm²');
	assert.match(text(s), /Il settore è \$\\\\frac\{1\}\{6\}\$ del cerchio/);
	assert.equal(s.sketch.caption.text, 'α = 60°');
});

test('sector in degrees: quarter, whole circle, decimals, an awkward angle', () => {
	const q = ok(deg('10', '90'), 'quarter');
	close(q.check.A, 25 * Math.PI, 'A');
	assert.match(q.outcome.rows[1].value, /25\\pi/);
	const whole = ok(deg('5', '360', 'm'), 'whole');
	assert.match(text(whole), /È il cerchio intero/);
	close(whole.check.p, 10 * Math.PI, 'p is the circumference');
	const d = ok(deg('7,5', '22,5'), 'decimals');
	close(d.check.l, (22.5 / 360) * 2 * Math.PI * 7.5, 'l');
	const odd = ok(deg('3', '37,1234'), 'awkward');
	close(odd.check.A, (37.1234 / 360) * Math.PI * 9, 'A');
	assert.doesNotMatch(text(odd), /Trova che parte/);
});

test('sector in radians: with π, a plain number, in degrees too', () => {
	const s = ok(rad('6', 'π/3', 'cm'), 'pi/3');
	assert.equal(s.outcome.copy, 'ℓ = 2π cm ≈ 6,28 cm; A = 6π cm² ≈ 18,85 cm²');
	assert.match(text(s), /misura \$60\^\\\\circ\$/);
	const plain = ok(rad('4', '1,5'), 'plain');
	assert.equal(plain.outcome.copy, 'ℓ = 6; A = 12');
	assert.equal(plain.outcome.rows[2].value, '$2p = 14$');
	ok(rad('6', '2π/3'), '2pi/3');
	ok(rad('6', '2pi/3'), '2pi/3 typed');
	ok(rad('6', '3/4π'), '3/4 pi');
	const whole = ok(rad('2', '2π'), 'whole');
	close(whole.check.p, 4 * Math.PI, 'p');
});

test('parseRadians', () => {
	const x = (s) => parseRadians(s)?.x;
	close(x('π/3'), Math.PI / 3);
	close(x('2π/3'), (2 * Math.PI) / 3);
	close(x('2/3π'), (2 * Math.PI) / 3);
	close(x('0,5π'), Math.PI / 2);
	close(x('pi/4'), Math.PI / 4);
	close(x('π'), Math.PI);
	close(x('1,2'), 1.2);
	close(x('3/4'), 0.75);
	for (const s of ['', 'ππ', 'π/0', 'abc', '2π3', '-π']) assert.equal(parseRadians(s), null, s);
});

test('sector: wrong inputs', () => {
	bad(deg('', '60'), /Scrivi il raggio/);
	bad(deg('0', '60'), /maggiore di zero/);
	bad(deg('6', ''), /Scrivi l'angolo/);
	bad(deg('6', '0'), /maggiore di zero: scrivi per esempio 60/);
	bad(deg('6', '400'), /al massimo 360°/);
	bad(rad('6', ''), /radianti/);
	bad(rad('6', 'abc'), /non è un numero di radianti/);
	bad(rad('6', '3π'), /al massimo 2π/);
	bad(rad('6', '7'), /al massimo 2π/);
	bad(rad('6', '0'), /maggiore di zero/);
});

test('sector: brute force against the float formulas, degrees and radians agree', () => {
	let n = 0;
	for (const r of ['1', '2,5', '6', '12', '0,75'])
		for (let a = 5; a <= 360; a += 5) {
			const R = Number(r.replace(',', '.'));
			const s = deg(r, String(a));
			assert.ok(s.outcome.ok);
			close(s.check.l, (a / 360) * 2 * Math.PI * R, `l ${r} ${a}`);
			close(s.check.A, (a / 360) * Math.PI * R * R, `A ${r} ${a}`);
			close(s.check.p, a === 360 ? 2 * Math.PI * R : 2 * R + (a / 360) * 2 * Math.PI * R, `p ${r} ${a}`);
			const t = rad(r, `${a}/180π`);
			assert.ok(t.outcome.ok, `${a}/180π`);
			close(t.check.A, s.check.A, `radians ${a}`);
			if (n++ % 25 === 0) {
				assertReadable(s.outcome, `${r} ${a}`);
				assertReadable(t.outcome, `${r} ${a} rad`);
			}
		}
});

test('annulus: the example of the page and the diameters', () => {
	const c = ok(corona({ mode: 'raggi', a: '10', b: '6', u: 'cm' }), 'default');
	assert.equal(c.outcome.rows[0].value, '$A = 64\\pi\\,\\text{cm}^2$ $\\approx 201{,}06\\,\\text{cm}^2$');
	assert.equal(c.outcome.rows[1].value, '$2p = 32\\pi\\,\\text{cm}$ $\\approx 100{,}53\\,\\text{cm}$');
	assert.equal(c.outcome.copy, 'A = 64π cm² ≈ 201,06 cm²');
	assert.deepEqual([c.ring.R, c.ring.r, c.ring.outer, c.ring.inner], [10, 6, 'R = 10 cm', 'r = 6 cm']);
	const d = ok(corona({ mode: 'diametri', a: '13', b: '5', u: '' }), 'diameters');
	close(d.check.A, 36 * Math.PI, 'A');
	assert.match(text(d), /Dividi i due diametri/);
	const dec = ok(corona({ mode: 'raggi', a: '2,5', b: '1,5', u: 'm' }), 'decimals');
	close(dec.check.A, 4 * Math.PI, 'A');
});

test('annulus: wrong inputs', () => {
	bad(corona({ mode: 'raggi', a: '5', b: '5', u: '' }), /non ha spessore/);
	bad(corona({ mode: 'raggi', a: '3', b: '5', u: '' }), /più lungo del raggio interno.*scambia/);
	bad(corona({ mode: 'diametri', a: '3', b: '5', u: '' }), /del diametro interno/);
	bad(corona({ mode: 'raggi', a: '', b: '5', u: '' }), /Scrivi il raggio esterno/);
	bad(corona({ mode: 'raggi', a: '5', b: 'x', u: '' }), /scrivi un numero/);
	bad(corona({ mode: 'raggi', a: '5', b: '-1', u: '' }), /maggiore di zero/);
});

test('annulus: brute force against π(R² − r²) and 2π(R + r)', () => {
	for (let R = 2; R <= 30; R += 1)
		for (let r = 1; r < R; r += 3) {
			const c = corona({ mode: 'raggi', a: String(R), b: String(r), u: '' });
			assert.ok(c.outcome.ok);
			close(c.check.A, Math.PI * (R * R - r * r), `A ${R} ${r}`);
			close(c.check.p, 2 * Math.PI * (R + r), `p ${R} ${r}`);
			const d = corona({ mode: 'diametri', a: String(2 * R), b: String(2 * r), u: '' });
			close(d.check.A, c.check.A, `diameters ${R} ${r}`);
		}
});

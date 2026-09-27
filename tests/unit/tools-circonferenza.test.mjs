// The circle in the Cartesian plane: from centre and radius (or a point) to the equation, and back. Exact values,
// brute force on grids, the cases that are not a circle, wrong inputs.
// Run with `node --test tests/unit/tools-circonferenza.test.mjs`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { circonferenza, parseCircleEquation } = await jiti.import('../../src/lib/tools/circonferenza.ts');

const close = (a, b, what = '') => assert.ok(Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)), `${what}: ${a} ≠ ${b}`);
const base = { mode: 'centro-raggio', xc: '', yc: '', r: '', xp: '', yp: '', eq: '' };
const run = (patch) => circonferenza({ ...base, ...patch });
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

test('centre and radius: the example of the page', () => {
	const r = ok(run({ xc: '2', yc: '-3', r: '5' }), 'default');
	assert.equal(r.outcome.rows[0].value, '$x^2 + y^2 - 4x + 6y - 12 = 0$');
	assert.equal(r.outcome.rows[1].value, '$(x - 2)^2 + (y + 3)^2 = 25$');
	assert.equal(r.outcome.copy, 'x² + y² - 4x + 6y - 12 = 0');
	assert.match(text(r), /x\^2 - 4x \+ 4/);
	assert.match(text(r), /y\^2 \+ 6y \+ 9/);
	assert.ok(r.plot.segments.length > 100, 'the circle is drawn');
});

test('centre and radius: the origin, a circle through the origin, decimals, fractions', () => {
	const o = ok(run({ xc: '0', yc: '0', r: '3' }), 'origin');
	assert.equal(o.outcome.copy, 'x² + y² - 9 = 0');
	assert.doesNotMatch(text(o), /Sviluppa/);
	const through = ok(run({ xc: '3', yc: '4', r: '5' }), 'through the origin');
	assert.equal(through.outcome.copy, 'x² + y² - 6x - 8y = 0');
	assert.match(text(through), /passa per l’origine/);
	const dec = ok(run({ xc: '0,5', yc: '0', r: '1,5' }), 'decimals');
	assert.equal(dec.outcome.copy, 'x² + y² - x - 2 = 0');
	const frac = ok(run({ xc: '1/2', yc: '-1/3', r: '1' }), 'fractions');
	close(frac.check.c, 1 / 4 + 1 / 9 - 1, 'c');
	assert.match(frac.outcome.rows[0].value, /\\frac\{2\}\{3\}y/);
});

test('centre and a point: r² from the distance, then the radius', () => {
	const r = ok(run({ mode: 'centro-punto', xc: '1', yc: '2', xp: '3', yp: '-2' }), 'point');
	assert.equal(r.outcome.copy, 'x² + y² - 2x - 4y - 15 = 0');
	assert.equal(r.outcome.rows[2].value, '$r = 2\\sqrt{5}$ $\\approx 4{,}47$');
	const whole = ok(run({ mode: 'centro-punto', xc: '1', yc: '2', xp: '4', yp: '6' }), 'whole radius');
	assert.equal(whole.outcome.rows[2].value, '$r = 5$');
	bad(run({ mode: 'centro-punto', xc: '1', yc: '2', xp: '1', yp: '2' }), /coincide/);
});

test('from the equation: centre and radius, dividing first', () => {
	const r = ok(run({ mode: 'equazione', eq: '2x^2 + 2y^2 - 8x + 4y - 10 = 0' }), 'divide');
	assert.equal(r.outcome.copy, 'C(2, -1); r = √10 ≈ 3,16');
	assert.match(text(r), /Dividi tutti i termini per \$2\$/);
	const plain = ok(run({ mode: 'equazione', eq: 'x²+y²-4x+6y-12=0' }), 'plain');
	assert.equal(plain.outcome.copy, 'C(2, -3); r = 5');
	assert.doesNotMatch(text(plain), /Porta tutto a sinistra/);
	const minus = ok(run({ mode: 'equazione', eq: '-x^2 - y^2 + 2x + 3 = 0' }), 'negative');
	assert.equal(minus.outcome.copy, 'C(1, 0); r = 2');
	const moved = ok(run({ mode: 'equazione', eq: 'x^2 + y^2 = 6x - 5' }), 'moved');
	assert.equal(moved.outcome.copy, 'C(3, 0); r = 2');
	assert.match(text(moved), /Porta tutto a sinistra/);
	const binom = ok(run({ mode: 'equazione', eq: '(x - 1)^2 + (y + 2)^2 = 7' }), 'binomials');
	assert.equal(binom.outcome.copy, 'C(1, -2); r = √7 ≈ 2,65');
	assert.match(text(binom), /Sviluppa i quadrati/);
	const half = ok(run({ mode: 'equazione', eq: 'x^2 + y^2 - x = 0' }), 'half');
	assert.equal(half.outcome.copy, 'C(1/2, 0); r = 1/2');
	assert.match(half.outcome.rows[1].value, /\\approx|\\frac\{1\}\{2\}/);
	const dec = ok(run({ mode: 'equazione', eq: 'x^2 + y^2 - 3x - 1,75 = 0' }), 'decimals');
	assert.equal(dec.outcome.copy, 'C(1,5; 0); r = 2');
	const irr = ok(run({ mode: 'equazione', eq: 'x^2 + y^2 - 5 = 0' }), 'root 5');
	assert.equal(irr.outcome.copy, 'C(0, 0); r = √5 ≈ 2,24');
	const frac = ok(run({ mode: 'equazione', eq: 'x^2 + y^2 - 5/2 = 0' }), 'fraction radius');
	assert.match(frac.outcome.copy, /√10\/2 ≈ 1,58/);
});

test('from the equation: the cases that are not a circle', () => {
	const diff = ok(run({ mode: 'equazione', eq: 'x^2 + 2y^2 = 4' }), 'different');
	assert.equal(diff.outcome.rows[0].value, 'Non è una circonferenza');
	assert.equal(diff.plot, null);
	assert.equal(diff.check.circle, false);
	const xy = ok(run({ mode: 'equazione', eq: 'x^2 + y^2 + xy - 1 = 0' }), 'xy');
	assert.match(text(xy), /termine in \$xy\$/);
	const none = ok(run({ mode: 'equazione', eq: 'x^2 + y^2 + 2x + 10 = 0' }), 'no points');
	assert.equal(none.outcome.rows[0].value, 'Non è una circonferenza: nessun punto');
	assert.equal(none.check.r2, -9);
	const point = ok(run({ mode: 'equazione', eq: 'x^2 + y^2 - 2x + 1 = 0' }), 'point');
	assert.equal(point.outcome.copy, 'Solo il punto C(1, 0)');
	assert.equal(point.plot.points.length, 1);
	bad(run({ mode: 'equazione', eq: '2x + 3y = 1' }), /mancano x² e y²/);
});

test('wrong inputs: a message that says what to write', () => {
	bad(run({ xc: '', yc: '1', r: '2' }), /Scrivi l'ascissa del centro/);
	bad(run({ xc: 'a', yc: '1', r: '2' }), /non è un numero/);
	bad(run({ xc: '1', yc: '1', r: '0' }), /maggiore di zero/);
	bad(run({ xc: '1', yc: '1', r: '-3' }), /maggiore di zero/);
	bad(run({ xc: '100000', yc: '1', r: '2' }), /troppo grande/);
	for (const eq of ['', 'x^3 + y^2 = 1', 'x^2 + y^2 == 1', 'x^2 y^2 = 1', 'hello', 'x^2 + z^2 = 4', 'x^2 + y^2 = '])
		bad(run({ mode: 'equazione', eq }), /Non riesco a leggere|mancano/);
});

test('the parser: terms in any order, both sides, squares of binomials', () => {
	const p = parseCircleEquation('3 + y^2 = -x^2 + 2y');
	assert.equal(p.coef.x2.toString(), '1');
	assert.equal(p.coef.y2.toString(), '1');
	assert.equal(p.coef.y.toString(), '-2');
	assert.equal(p.coef['1'].toString(), '3');
	assert.equal(p.normal, false);
	assert.equal(parseCircleEquation('x^2+y^2-4x+6y-12=0').normal, true);
	assert.equal(parseCircleEquation('x^2+y^2-4x+6y-12').normal, true);
	const b = parseCircleEquation('(x + 1/2)^2 + (y - 3)^2 = 4');
	assert.equal(b.coef.x.toString(), '1');
	assert.equal(b.coef['1'].toString(), '21/4');
	assert.equal(parseCircleEquation('x^2 + 2xy').coef.xy.toString(), '2');
	assert.equal(parseCircleEquation('2x3'), null);
});

test('brute force: centre and radius to the equation and back, also scaled', () => {
	let n = 0;
	for (let xc = -4; xc <= 4; xc++)
		for (let yc = -3; yc <= 3; yc++)
			for (const r of [1, 2, 3, 5, 7]) {
				const there = run({ xc: String(xc), yc: String(yc), r: String(r) });
				assert.ok(there.outcome.ok);
				close(there.check.a, -2 * xc, 'a');
				close(there.check.b, -2 * yc, 'b');
				close(there.check.c, xc * xc + yc * yc - r * r, 'c');
				for (const k of [1, 3, -2]) {
					const t = (v) => (v < 0 ? ` - ${-v}` : ` + ${v}`);
					const eq = `${k}x^2${t(k)}y^2${t(k * there.check.a)}x${t(k * there.check.b)}y${t(k * there.check.c)} = 0`;
					const back = run({ mode: 'equazione', eq });
					assert.ok(back.outcome.ok && back.check.circle, eq);
					close(back.check.xc, xc, `xc of ${eq}`);
					close(back.check.yc, yc, `yc of ${eq}`);
					close(back.check.r, r, `r of ${eq}`);
					if (n++ % 40 === 0) assertReadable(back.outcome, eq);
				}
			}
});

test('brute force: centre and a point, the radius is the distance', () => {
	for (let xc = -3; xc <= 3; xc++)
		for (let yc = -2; yc <= 2; yc++)
			for (let xp = -3; xp <= 3; xp += 2)
				for (let yp = -3; yp <= 3; yp += 3) {
					if (xp === xc && yp === yc) continue;
					const res = run({ mode: 'centro-punto', xc: String(xc), yc: String(yc), xp: String(xp), yp: String(yp) });
					assert.ok(res.outcome.ok);
					close(res.check.r, Math.hypot(xp - xc, yp - yc), 'r');
					// P satisfies the equation.
					close(xp * xp + yp * yp + res.check.a * xp + res.check.b * yp + res.check.c, 0, 'P on the circle');
				}
});

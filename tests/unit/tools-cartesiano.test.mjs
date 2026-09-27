// The Cartesian plane: distance, midpoint, line, parabola. Exact values, brute force on grids, wrong inputs.
// Run with `node --test tests/unit/tools-cartesiano.test.mjs`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { distanza, puntoMedio, retta, parabola, parseLine } = await jiti.import('../../src/lib/tools/cartesiano.ts');

const close = (a, b, what = '') => assert.ok(Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)), `${what}: ${a} ≠ ${b}`);
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const ok = (res, name) => {
	assert.ok(res.outcome.ok, `${name}: ${res.outcome.error}`);
	assertReadable(res.outcome, name);
	return res;
};
const bad = (res, pattern) => {
	assert.equal(res.outcome.ok, false);
	assert.equal(res.plot, null);
	if (pattern) assert.match(res.outcome.error, pattern);
	assertReadable(res.outcome);
};
const text = (res) => JSON.stringify(res.outcome);
const pts = (xa, ya, xb, yb) => ({ xa: String(xa), ya: String(ya), xb: String(xb), yb: String(yb) });

test('distance: the examples of the page and of the lesson', () => {
	const d = ok(distanza(pts(-2, 1, 4, 4)), 'default');
	assert.equal(d.outcome.copy, '3√5 ≈ 6,71');
	assert.equal(d.outcome.rows[0].value, '$\\overline{AB} = 3\\sqrt{5}$ $\\approx 6{,}71$');
	assert.match(text(d), /9 \\\\cdot 5/);
	// Lesson il-piano-cartesiano, example 3.
	const f = ok(distanza(pts('1/2', '1/3', -1, 1)), 'fractions');
	assert.equal(f.outcome.copy, '√97/6 ≈ 1,64');
	assert.match(text(f), /81 \+ 16/);
	assert.equal(ok(distanza(pts(1, 2, 4, 6)), 'triple').outcome.copy, '5');
	assert.equal(ok(distanza(pts(0, 0, 3, 3)), 'diagonal').outcome.copy, '3√2 ≈ 4,24');
	// A denominator that is not a square is rationalised: √(1/2) = √2/2.
	const r = ok(distanza(pts(0, 0, '1/2', '1/2')), 'rationalised');
	assert.equal(r.outcome.copy, '√2/2 ≈ 0,71');
	assert.match(text(r), /razionalizza/);
});

test('distance: vertical, horizontal, the same point, decimals', () => {
	const v = ok(distanza(pts(2, 5, 2, -1)), 'vertical');
	assert.equal(v.outcome.copy, '6');
	assert.match(text(v), /verticale/);
	const h = ok(distanza(pts(-3, 4, 5, 4)), 'horizontal');
	assert.equal(h.outcome.copy, '8');
	assert.match(text(h), /orizzontale/);
	assert.equal(ok(distanza(pts(1, 1, 1, 1)), 'same').outcome.copy, '0');
	const dec = ok(distanza(pts('1,5', 2, 3, 4)), 'decimals');
	assert.equal(dec.outcome.copy, '2,5');
	assert.match(text(dec), /2\{,\}25 \+ 4/);
});

test('distance: brute force on a grid, against Math.hypot', () => {
	let i = 0;
	for (let xa = -4; xa <= 4; xa++)
		for (let ya = -4; ya <= 4; ya += 2)
			for (let xb = -5; xb <= 5; xb++)
				for (let yb = -5; yb <= 5; yb++) {
					const res = distanza(pts(xa, ya, xb, yb));
					assert.ok(res.outcome.ok);
					close(res.check.d, Math.hypot(xb - xa, yb - ya), `${xa} ${ya} ${xb} ${yb}`);
					if (i++ % 23 === 0) assertReadable(res.outcome, `${xa} ${ya} ${xb} ${yb}`);
				}
	for (const [a, b] of [
		[2, 3],
		[3, 4],
		[5, 7],
		[1, 6]
	])
		for (let n = -6; n <= 6; n++) {
			const res = ok(distanza(pts(`${n}/${a}`, `1/${b}`, `${a}/${b}`, `${-n}/${b}`)), `fractions ${n}`);
			close(res.check.d, Math.hypot(a / b - n / a, -n / b - 1 / b));
		}
});

test('midpoint', () => {
	const m = ok(puntoMedio(pts(-3, 2, 5, 7)), 'default');
	assert.equal(m.outcome.copy, 'M(1, 9/2)');
	assert.equal(m.outcome.rows[0].value, '$M\\left(1, \\frac{9}{2}\\right)$');
	assert.equal(ok(puntoMedio(pts(2, 4, 6, 8)), 'whole').outcome.copy, 'M(4, 6)');
	assert.equal(ok(puntoMedio(pts('1/2', 1, '3/2', -1)), 'fractions').outcome.copy, 'M(1, 0)');
	// Decimals in, decimals out, and a semicolon between the coordinates.
	const d = ok(puntoMedio(pts('1,5', 2, '-2,5', 3)), 'decimals');
	assert.equal(d.outcome.copy, 'M(-0,5; 2,5)');
	assert.equal(d.outcome.rows[0].value, '$M(-0{,}5;\\ 2{,}5)$');
	assert.match(text(ok(puntoMedio(pts(1, 1, 1, 1)), 'same')), /coincidono/);
	for (let xa = -5; xa <= 5; xa++)
		for (let xb = -5; xb <= 5; xb++)
			for (const [ya, yb] of [
				[0, 3],
				[-7, 2],
				['1/3', '1/2']
			]) {
				const res = ok(puntoMedio(pts(xa, ya, xb, yb)), `${xa} ${ya} ${xb} ${yb}`);
				close(res.check.x, (xa + xb) / 2);
				close(res.check.y, (eval(String(ya)) + eval(String(yb))) / 2);
				assert.ok(res.plot.points.some((p) => p.name === 'M' && p.main));
			}
});

test('points: wrong inputs say what to write', () => {
	bad(distanza(pts('', 1, 2, 3)), /Scrivi l'ascissa di A/);
	bad(distanza(pts(1, 'abc', 2, 3)), /L'ordinata di A non è un numero/);
	bad(puntoMedio(pts(1, 2, 3, '1/0')), /non è un numero/);
	bad(distanza(pts(1, 2, 3, 99999)), /troppo grande/);
});

/** Checks a line result: integer coefficients without common factors, a (or b) positive, through the given points. */
function checkLine(res, points, name) {
	const { a, b, c } = res.check;
	for (const k of [a, b, c]) assert.ok(Number.isInteger(k), `${name}: integer coefficients`);
	assert.equal(gcd(gcd(a, b), c), 1, `${name}: no common factor`);
	assert.ok(a > 0 || (a === 0 && b > 0), `${name}: a positive`);
	for (const [x, y] of points) close(a * x + b * y + c, 0, `${name}: through (${x}, ${y})`);
	assert.ok(res.plot.lines[0].main);
}

test('line through two points: the lesson examples', () => {
	const r = ok(retta({ mode: 'punti', ...pts(1, 1, 4, 3), m: '', r: '' }), 'default');
	assert.equal(r.outcome.copy, 'y = 2/3x + 1/3; 2x - 3y + 1 = 0');
	assert.deepEqual(
		r.outcome.rows.map((x) => x.value),
		['$m = \\frac{2}{3}$', '$y = \\frac{2}{3}x + \\frac{1}{3}$', '$2x - 3y + 1 = 0$']
	);
	assert.equal(ok(retta({ mode: 'punti', ...pts(-1, 3, 2, -3), m: '', r: '' }), 'negative').outcome.copy, 'y = -2x + 1; 2x + y - 1 = 0');
	const v = ok(retta({ mode: 'punti', ...pts(2, 5, 2, -1), m: '', r: '' }), 'vertical');
	assert.equal(v.outcome.copy, 'x = 2; x - 2 = 0');
	assert.match(v.outcome.rows[0].value, /Non esiste/);
	assert.equal(ok(retta({ mode: 'punti', ...pts(-3, 4, 5, 4), m: '', r: '' }), 'horizontal').outcome.copy, 'y = 4; y - 4 = 0');
	assert.equal(ok(retta({ mode: 'punti', ...pts(0, 0, 3, 0), m: '', r: '' }), 'x axis').outcome.copy, 'y = 0; y = 0');
	assert.equal(ok(retta({ mode: 'punti', ...pts('1/2', 1, -1, '3/2'), m: '', r: '' }), 'fractions').outcome.rows[0].value, '$m = -\\frac{1}{3}$');
	bad(retta({ mode: 'punti', ...pts(1, 2, 1, 2), m: '', r: '' }), /coincidono/);
});

test('line through two points: brute force', () => {
	let i = 0;
	for (let xa = -3; xa <= 3; xa++)
		for (let ya = -3; ya <= 3; ya++)
			for (let xb = -3; xb <= 3; xb++)
				for (let yb = -3; yb <= 3; yb += 2) {
					if (xa === xb && ya === yb) continue;
					const res = retta({ mode: 'punti', ...pts(xa, ya, xb, yb), m: '', r: '' });
					const name = `${xa} ${ya} ${xb} ${yb}`;
					assert.ok(res.outcome.ok, name);
					checkLine(res, [
						[xa, ya],
						[xb, yb]
					], name);
					if (i++ % 17 === 0) assertReadable(res.outcome, name);
				}
	for (const [xa, ya, xb, yb] of [
		['1/2', '1/3', '5/4', '-2/3'],
		['1,5', '2', '3', '2,5'],
		['-7/3', '0', '2/9', '4']
	]) {
		const res = ok(retta({ mode: 'punti', ...pts(xa, ya, xb, yb), m: '', r: '' }), `${xa} ${ya}`);
		const n = (s) => eval(s.replace(',', '.'));
		checkLine(res, [
			[n(xa), n(ya)],
			[n(xb), n(yb)]
		], xa);
	}
});

test('line through a point with a given slope', () => {
	const r = ok(retta({ mode: 'pendenza', xa: '2', ya: '-1', xb: '', yb: '', m: '1/2', r: '' }), 'default');
	assert.equal(r.outcome.copy, 'y = 1/2x - 2; x - 2y - 4 = 0');
	for (const m of ['0', '1', '-1', '3', '-2/5', '7/4', '0,25'])
		for (const [x, y] of [
			[0, 0],
			[2, -1],
			[-3, 4]
		]) {
			const res = ok(retta({ mode: 'pendenza', xa: String(x), ya: String(y), xb: '', yb: '', m, r: '' }), `${m} ${x} ${y}`);
			const slope = eval(m.replace(',', '.'));
			checkLine(res, [[x, y]], m);
			close(-res.check.a / res.check.b, slope, `slope ${m}`);
		}
	bad(retta({ mode: 'pendenza', xa: '1', ya: '1', xb: '', yb: '', m: '', r: '' }), /coefficiente angolare/);
});

test('the given line r is read in any usual form', () => {
	const coef = (s) => {
		const p = parseLine(s);
		assert.ok(p, s);
		let [a, b, c] = [0, 0, 0];
		for (const [ts, k] of [
			[p.lhs, 1],
			[p.rhs, -1]
		])
			for (const t of ts) {
				const v = (t.c.num / t.c.den) * k;
				if (t.v === 'x') a += v;
				else if (t.v === 'y') b += v;
				else c += v;
			}
		return [a, b, c];
	};
	assert.deepEqual(coef('y = 2x + 1'), [-2, 1, -1]);
	assert.deepEqual(coef('3x - 2y + 6 = 0'), [3, -2, 6]);
	assert.deepEqual(coef('r: y = -x/2 + 3'), [0.5, 1, -3]);
	assert.deepEqual(coef('2/3x − y = 1'), [2 / 3, -1, -1]);
	assert.deepEqual(coef('x = 4'), [1, 0, -4]);
	assert.deepEqual(coef('Y = 1,5X'), [-1.5, 1, 0]);
	assert.deepEqual(coef('2*x + 3*y = 0'), [2, 3, 0]);
	for (const s of ['', 'y', 'y = 2x +', 'y = 2xx', 'y == 3', '2x + 3', 'y = 2z', 'y = /2']) assert.equal(parseLine(s), null, s);
});

test('parallel and perpendicular lines', () => {
	const par = ok(retta({ mode: 'parallela', xa: '1', ya: '4', xb: '', yb: '', m: '', r: '2x + y - 3 = 0' }), 'parallel');
	assert.equal(par.outcome.copy, 'y = -2x + 6; 2x + y - 6 = 0');
	assert.equal(par.plot.lines.length, 2);
	const per = ok(retta({ mode: 'perpendicolare', xa: '3', ya: '1', xb: '', yb: '', m: '', r: '3x - 2y + 6 = 0' }), 'perpendicular');
	assert.equal(per.outcome.copy, 'y = -2/3x + 3; 2x + 3y - 9 = 0');
	assert.match(text(per), /antireciproco/);
	assert.equal(ok(retta({ mode: 'perpendicolare', xa: '4', ya: '1', xb: '', yb: '', m: '', r: 'y = 2x + 1' }), 'explicit').outcome.copy, 'y = -1/2x + 3; x + 2y - 6 = 0');
	// Vertical and horizontal r.
	assert.equal(ok(retta({ mode: 'parallela', xa: '4', ya: '1', xb: '', yb: '', m: '', r: 'x = 3' }), 'par vertical').outcome.copy, 'x = 4; x - 4 = 0');
	assert.equal(ok(retta({ mode: 'perpendicolare', xa: '4', ya: '1', xb: '', yb: '', m: '', r: 'x = 3' }), 'perp vertical').outcome.copy, 'y = 1; y - 1 = 0');
	assert.equal(ok(retta({ mode: 'parallela', xa: '4', ya: '1', xb: '', yb: '', m: '', r: 'y = -2' }), 'par horizontal').outcome.copy, 'y = 1; y - 1 = 0');
	assert.equal(ok(retta({ mode: 'perpendicolare', xa: '4', ya: '1', xb: '', yb: '', m: '', r: '2y + 4 = 0' }), 'perp horizontal').outcome.copy, 'x = 4; x - 4 = 0');
	// P on r: the parallel is r itself.
	assert.match(text(ok(retta({ mode: 'parallela', xa: '1', ya: '1', xb: '', yb: '', m: '', r: 'y = -x/2 + 3/2' }), 'itself')), /stessa/);
	bad(retta({ mode: 'parallela', xa: '1', ya: '1', xb: '', yb: '', m: '', r: '' }), /Scrivi la retta r/);
	bad(retta({ mode: 'parallela', xa: '1', ya: '1', xb: '', yb: '', m: '', r: 'y = 2x +' }), /Non riesco a leggere/);
	bad(retta({ mode: 'perpendicolare', xa: '1', ya: '1', xb: '', yb: '', m: '', r: 'x - x = 3' }), /non è una retta/);

	// Brute force: every r with small integer coefficients, through a few points.
	let i = 0;
	const term = (k, v, first) => (k === 0 ? '' : `${k < 0 ? (first ? '-' : ' - ') : first ? '' : ' + '}${Math.abs(k) === 1 && v ? '' : Math.abs(k)}${v}`);
	for (let a = -3; a <= 3; a++)
		for (let b = -3; b <= 3; b++)
			for (let c = -2; c <= 2; c += 2) {
				if (a === 0 && b === 0) continue;
				let eq = term(a, 'x', true);
				eq += term(b, 'y', !eq);
				eq += term(c, '', !eq);
				eq += ' = 0';
				for (const [x, y] of [
					[0, 0],
					[2, -1],
					['1/2', 3]
				])
					for (const mode of ['parallela', 'perpendicolare']) {
						const name = `${mode} ${eq} (${x}, ${y})`;
						const res = retta({ mode, xa: String(x), ya: String(y), xb: '', yb: '', m: '', r: eq });
						assert.ok(res.outcome.ok, `${name}: ${res.outcome.error}`);
						checkLine(res, [[eval(String(x)), y]], name);
						const { a: A, b: B } = res.check;
						if (mode === 'parallela') assert.ok(A * b - a * B === 0, `${name}: parallel`);
						else assert.ok(A * a + B * b === 0, `${name}: perpendicular`);
						if (i++ % 7 === 0) assertReadable(res.outcome, name);
					}
			}
});

test('parabola: the lesson example', () => {
	const p = ok(parabola({ a: '1', b: '-4', c: '3' }), 'default');
	assert.deepEqual(
		p.outcome.rows.map((r) => r.value),
		['Verso l’alto', '$V(2, -1)$', '$x = 2$', '$F\\left(2, -\\frac{3}{4}\\right)$', '$y = -\\frac{5}{4}$', '$(0, 3)$', '$(1, 0)$ e $(3, 0)$']
	);
	assert.ok(p.outcome.steps[0].group, 'grouped');
	const down = ok(parabola({ a: '-1', b: '2', c: '3' }), 'down');
	assert.equal(down.outcome.rows[0].value, 'Verso il basso');
	assert.equal(down.outcome.rows[1].value, '$V(1, 4)$');
	assert.doesNotMatch(text(down), /-1\^2/);
	assert.equal(ok(parabola({ a: '1', b: '2', c: '5' }), 'no roots').outcome.rows[6].value, 'Nessuna: la parabola non taglia l’asse x');
	assert.match(ok(parabola({ a: '-1', b: '2', c: '-1' }), 'tangent').outcome.rows[6].value, /nel vertice/);
	assert.equal(ok(parabola({ a: '1', b: '-4', c: '2' }), 'radicals').outcome.rows[6].value, '$\\left(2 - \\sqrt{2}, 0\\right)$ e $\\left(2 + \\sqrt{2}, 0\\right)$');
	const frac = ok(parabola({ a: '1/2', b: '-1', c: '-4' }), 'fractions');
	assert.equal(frac.outcome.copy, 'V(1, -9/2); F(1, -4); direttrice y = -5; asse x = 1');
	assert.match(text(frac), /x\^2 - 2x - 8 = 0/);
	const dec = ok(parabola({ a: '0,5', b: '1,5', c: '-2' }), 'decimals');
	assert.equal(dec.outcome.rows[1].value, '$V(-1{,}5;\\ -3{,}125)$');
	assert.equal(ok(parabola({ a: '2', b: '', c: '' }), 'empty fields').outcome.rows[1].value, '$V(0, 0)$');
	bad(parabola({ a: '0', b: '1', c: '1' }), /retta/);
	bad(parabola({ a: '', b: '1', c: '1' }), /Scrivi il coefficiente a/);
	bad(parabola({ a: '1', b: 'x', c: '1' }), /non è un numero/);
});

test('parabola: brute force, with the focus and directrix property', () => {
	let i = 0;
	for (const a of ['1', '-1', '2', '-3', '1/2', '-1/4', '3/2'])
		for (let b = -5; b <= 5; b++)
			for (let c = -4; c <= 4; c++) {
				const name = `${a} ${b} ${c}`;
				const res = parabola({ a, b: String(b), c: String(c) });
				assert.ok(res.outcome.ok, name);
				const A = eval(a);
				const at = (x) => A * x * x + b * x + c;
				const { xv, yv, yf, yd, delta, roots } = res.check;
				close(xv, -b / (2 * A), `${name} xv`);
				close(yv, at(xv), `${name} yv`);
				close(delta, b * b - 4 * A * c, `${name} delta`);
				assert.equal(roots, delta > 0 ? 2 : delta === 0 ? 1 : 0, `${name} roots`);
				// Every point of the parabola is as far from the focus as from the directrix.
				for (const x of [xv - 2, xv + 1, xv + 3]) close(Math.hypot(x - xv, at(x) - yf), Math.abs(at(x) - yd), `${name} focus at ${x}`);
				// The intersections with the x axis are zeros.
				for (const p of res.plot.points.filter((p) => p.name === '' && p.y === 0 && p.x !== 0)) assert.ok(Math.abs(at(p.x)) < 1e-9, `${name} zero ${p.x}`);
				if (i++ % 11 === 0) assertReadable(res.outcome, name);
			}
});

test('numbers too large for exact arithmetic fail gently', () => {
	const huge = distanza(pts('9999/997', '9998/991', '-9997/983', '9996/977'));
	assert.ok(huge.outcome.ok || /troppo grandi/.test(huge.outcome.error));
	const big = parabola({ a: '9999/997', b: '9998/991', c: '9997/983' });
	assert.ok(big.outcome.ok || /troppo grandi/.test(big.outcome.error));
	if (big.outcome.ok) assertReadable(big.outcome, 'big parabola');
});

// The linear systems tools: two equations in x, y (substitution, reduction, Cramer) and three in x, y, z (Cramer with
// Sarrus, reduction). Run with `node --test tests/unit/tools-sistemi.test.mjs` (jiti loads the TypeScript sources).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { sistema2x2, sistema3x3, parseLinear, previewLinear, classify, det3 } = await jiti.import('../../src/lib/tools/sistemi-lineari.ts');
const { q } = await jiti.import('../../src/lib/exercises/v2/rational.ts');

/** Deterministic random numbers, so a failure can be reproduced. */
function rng(seed) {
	let s = seed >>> 0;
	return (a, b) => {
		s = (s * 1664525 + 1013904223) >>> 0;
		return a + (s % (b - a + 1));
	};
}

// ---------------------------------------------------------------------------
// An independent solver on BigInt fractions, for the brute-force checks

const bgcd = (a, b) => {
	a = a < 0n ? -a : a;
	b = b < 0n ? -b : b;
	while (b) [a, b] = [b, a % b];
	return a;
};
/** A fraction as the tools print it: "3", "-5/2". */
function frac(n, d) {
	if (d < 0n) [n, d] = [-n, -d];
	const g = bgcd(n, d) || 1n;
	[n, d] = [n / g, d / g];
	return d === 1n ? `${n}` : `${n}/${d}`;
}

/** Rank of an integer matrix, by fraction-free elimination. */
function rank(m) {
	const a = m.map((r) => r.map(BigInt));
	let r = 0;
	for (let c = 0; c < a[0].length && r < a.length; c++) {
		const p = a.findIndex((row, i) => i >= r && row[c] !== 0n);
		if (p < 0) continue;
		[a[r], a[p]] = [a[p], a[r]];
		for (let i = 0; i < a.length; i++) {
			if (i === r || a[i][c] === 0n) continue;
			const [x, y] = [a[i][c], a[r][c]];
			a[i] = a[i].map((v, j) => v * y - a[r][j] * x);
		}
		r++;
	}
	return r;
}

/** Determinant by cofactor expansion (not Sarrus), for n = 2, 3. */
function det(m) {
	if (m.length === 2) return BigInt(m[0][0]) * BigInt(m[1][1]) - BigInt(m[0][1]) * BigInt(m[1][0]);
	return [0, 1, 2].reduce((s, j) => {
		const minor = m.slice(1).map((r) => r.filter((_, k) => k !== j));
		return s + (j % 2 ? -1n : 1n) * BigInt(m[0][j]) * det(minor);
	}, 0n);
}

/** The expected copy text of a system with integer rows [a, b, (c,) d]. */
function expected(rows) {
	const n = rows.length;
	const A = rows.map((r) => r.slice(0, n));
	const D = det(A);
	if (D !== 0n) {
		const names = ['x', 'y', 'z'];
		return names
			.slice(0, n)
			.map((v, j) => `${v} = ${frac(det(A.map((r, i) => r.map((c, k) => (k === j ? rows[i][n] : c)))), D)}`)
			.join('; ');
	}
	const rA = rank(A);
	const rAb = rank(rows);
	if (rA < rAb) return 'Sistema impossibile: nessuna soluzione';
	return rA === 0 ? `Sistema indeterminato: ogni ${n === 2 ? 'coppia' : 'terna'} di numeri è una soluzione` : 'Sistema indeterminato: infinite soluzioni';
}

const coefOf = (rows) => rows.flat().map(String);

// ---------------------------------------------------------------------------
// The parser

test('the parser reads linear equations in x and y', () => {
	const row = (s, vars = ['x', 'y']) => {
		const r = parseLinear(s, vars);
		assert.ok(r.ok, `${s}: ${r.error}`);
		return [...r.eq.row.c.map((c) => c.toString()), r.eq.row.d.toString()].join(' ');
	};
	assert.equal(row('2x + 3y = 7'), '2 3 7');
	assert.equal(row('3(x - 1) = 2y + 1'), '3 -2 4');
	assert.equal(row('x/2 + y/3 = 1'), '1/2 1/3 1');
	assert.equal(row('y = 2x - 1'), '-2 1 -1');
	assert.equal(row('0,5x - 1.5y = -2'), '1/2 -3/2 -2');
	assert.equal(row('-(x - y) = [2 - (y + 1)] · 3'), '-1 4 3');
	assert.equal(row('2X + Y = 1'), '2 1 1');
	assert.equal(row('x + y - z = 4', ['x', 'y', 'z']), '1 1 -1 4');
	assert.equal(previewLinear('x/2 + y = 1', ['x', 'y']), '\\dfrac{x}{2} + y = 1');
});

test('the parser refuses what is not a linear equation, saying what to write', () => {
	const cases = {
		'x^2 + y = 1': /esponenti/,
		'xy = 2': /non si moltiplicano/,
		'x + z = 1': /x e y/,
		'2x + 3y': /Manca il segno =/,
		'x = y = 1': /più di un segno =/,
		'1/x + y = 2': /denominatore/,
		'3 = 3': /nessuna incognita/,
		'x + (y = 2': /parentesi/,
		'2x + = 3': /incompleta/,
		'2x + * y = 3': /manca un numero/,
		'': /Scrivi l'equazione/
	};
	for (const [s, re] of Object.entries(cases)) {
		const r = parseLinear(s, ['x', 'y']);
		assert.equal(r.ok, false, s);
		assert.match(r.error, re, s);
	}
});

// ---------------------------------------------------------------------------
// Two equations

test('the three methods solve the lesson examples with exact fractions', () => {
	for (const method of ['sostituzione', 'riduzione', 'cramer']) {
		const a = sistema2x2({ mode: 'coef', method, coef: ['1', '1', '5', '2', '3', '12'] });
		assert.equal(a.copy, 'x = 3; y = 2', method);
		const b = sistema2x2({ mode: 'eq', method, eqs: ['3(x - 1) = 2y + 1', 'x/2 + y/3 = 1'] });
		assert.equal(b.copy, 'x = 5/3; y = 1/2', method);
		assert.match(b.rows[0].value, /\\frac\{5\}\{3\}\$ \$\\approx 1\{,\}6667/);
		const c = sistema2x2({ mode: 'eq', method, eqs: ['y = 2x - 1', 'y = 4 - x'] });
		assert.equal(c.copy, 'x = 5/3; y = 7/3', method);
		for (const o of [a, b, c]) assertReadable(o, method);
	}
});

test('substitution isolates the unknown with coefficient 1 and hands the rest to the equation tool', () => {
	const o = sistema2x2({ mode: 'coef', method: 'sostituzione', coef: ['2', '1', '7', '3', '-2', '0'] });
	assert.equal(o.copy, 'x = 2; y = 3');
	const steps = o.steps;
	assert.equal(steps[1].say, 'Ricava $y$ dalla prima equazione.');
	assert.deepEqual(steps[1].math, ['2x + y = 7', 'y = \\hl{7 - 2x}']);
	assert.equal(steps[2].math[0], '3x - 2\\left( 7 - 2x \\right) = 0');
	assert.ok(steps.some((s) => s.say === 'Togli le parentesi.'));
	assert.ok(!steps.some((s) => /Controlla: sostituisci la soluzione nell'equazione/.test(s.say)), 'the check of the inner equation is dropped');
	assert.equal(steps.at(-1).group, 'La verifica');
	// Isolating x leaves an equation in y: every x of the equation tool's steps is renamed.
	const p = sistema2x2({ mode: 'coef', method: 'sostituzione', coef: ['1', '3', '5', '2', '5', '7'] });
	assert.equal(p.copy, 'x = -4; y = 3');
	assert.equal(p.steps[1].say, 'Ricava $x$ dalla prima equazione.');
	const inner = p.steps.filter((s) => s.group === 'Il valore di y' || /\by\b/.test(s.say));
	assert.ok(inner.length > 0);
	for (const s of p.steps.slice(2, -2)) for (const line of s.math ?? []) assert.doesNotMatch(line, /(?<![A-Za-z\\])x(?![A-Za-z])/, line);
	assertReadable(p, 'isolate x');
});

test('reduction multiplies to make a coefficient opposite, then adds', () => {
	const o = sistema2x2({ mode: 'coef', method: 'riduzione', coef: ['3', '4', '2', '2', '-5', '9'] });
	assert.equal(o.copy, 'x = 2; y = -1');
	assert.equal(o.steps[1].say, 'Moltiplica la prima equazione per $5$ e la seconda per $4$.');
	assert.equal(o.steps[2].say, 'Somma le due equazioni membro a membro.');
	assert.deepEqual(o.steps[2].math, ['(15x + 20y) + (8x - 20y) = 10 + 36', '\\hl{23x = 46}']);
	// An equation without y gives x at once.
	const p = sistema2x2({ mode: 'eq', method: 'riduzione', eqs: ['x = 3', 'x + y = 5'] });
	assert.equal(p.copy, 'x = 3; y = 2');
	assert.match(p.steps[1].say, /la \$y\$ non c'è/);
});

test('Cramer shows the three determinants and divides', () => {
	const o = sistema2x2({ mode: 'coef', method: 'cramer', coef: ['2', '3', '7', '1', '-1', '1'] });
	assert.equal(o.copy, 'x = 2; y = 1');
	assert.deepEqual(o.steps[1].math, ['D = \\begin{vmatrix} 2 & 3 \\\\ 1 & -1 \\end{vmatrix}', '= 2 \\cdot (-1) - 1 \\cdot 3', '= -2 - 3', '= \\hl{-5}']);
	assert.equal(o.steps[4].math[0], 'x = \\dfrac{D_x}{D} = \\dfrac{-10}{-5} = \\hl{2}');
});

test('impossible and indeterminate systems, by every method', () => {
	const impossible = ['2', '-4', '3', '1', '-2', '1'];
	const indeterminate = ['2', '-4', '2', '1', '-2', '1'];
	for (const method of ['sostituzione', 'riduzione', 'cramer']) {
		const a = sistema2x2({ mode: 'coef', method, coef: impossible });
		assert.equal(a.copy, 'Sistema impossibile: nessuna soluzione', method);
		assert.equal(a.rows[1].value, '$S = \\emptyset$');
		const b = sistema2x2({ mode: 'coef', method, coef: indeterminate });
		assert.equal(b.copy, 'Sistema indeterminato: infinite soluzioni', method);
		assert.equal(b.rows[1].value, '$x - 2y = 1$', method);
		assertReadable(a, method);
		assertReadable(b, method);
	}
	// Cramer's table is wrong when every coefficient is zero: 0 = 3 is impossible.
	const zero = sistema2x2({ mode: 'coef', method: 'cramer', coef: ['0', '0', '3', '0', '0', '0'] });
	assert.equal(zero.copy, 'Sistema impossibile: nessuna soluzione');
	const all = sistema2x2({ mode: 'coef', method: 'riduzione', coef: ['0', '0', '0', '0', '0', '0'] });
	assert.equal(all.copy, 'Sistema indeterminato: ogni coppia di numeri è una soluzione');
	assert.equal(all.rows[1].value, '$S = \\mathbb{R}^2$');
});

test('an unknown missing from both equations', () => {
	for (const method of ['sostituzione', 'riduzione', 'cramer']) {
		assert.equal(sistema2x2({ mode: 'coef', method, coef: ['2', '0', '4', '3', '0', '6'] }).copy, 'Sistema indeterminato: infinite soluzioni', method);
		assert.equal(sistema2x2({ mode: 'coef', method, coef: ['2', '0', '4', '3', '0', '7'] }).copy, 'Sistema impossibile: nessuna soluzione', method);
		assert.equal(sistema2x2({ mode: 'coef', method, coef: ['0', '2', '4', '0', '1', '2'] }).copy, 'Sistema indeterminato: infinite soluzioni', method);
	}
});

test('coefficients with fractions and decimals are made whole first', () => {
	const o = sistema2x2({ mode: 'coef', method: 'riduzione', coef: ['1/2', '1/3', '1', '0,5', '-1', '-3'] });
	assert.equal(o.copy, expected([[3, 2, 6], [1, -2, -6]]));
	assert.equal(o.steps[1].say, 'Moltiplica ogni equazione per il mcm dei suoi denominatori.');
	assert.equal(o.steps[1].then, 'La prima per $6$, la seconda per $2$.');
});

test('wrong input gives an error that says what to write', () => {
	const bad = [
		sistema2x2({ mode: 'coef', method: 'cramer', coef: ['', '', '', '', '', ''] }),
		sistema2x2({ mode: 'coef', method: 'cramer', coef: ['a', '1', '1', '1', '1', '1'] }),
		sistema2x2({ mode: 'eq', method: 'cramer', eqs: ['x + y = 1', 'x^2 = 4'] }),
		sistema2x2({ mode: 'eq', method: 'cramer', eqs: ['x + y = 1', ''] })
	];
	for (const o of bad) {
		assert.equal(o.ok, false);
		assert.ok(o.error.length > 20, o.error);
	}
	assert.match(bad[2].error, /^Seconda equazione\./);
	const big = sistema2x2({ mode: 'coef', method: 'sostituzione', coef: ['123456789', '987654321', '1', '192837465', '918273645', '2'] });
	assert.ok(big.ok || /troppo grandi/.test(big.error));
});

test('brute force: 2 × 2 systems with small integers, every method agrees with an independent solver', () => {
	const r = rng(2026);
	for (let n = 0; n < 400; n++) {
		// Some systems made dependent on purpose, so that D = 0 comes up often.
		let rows = [
			[r(-7, 7), r(-7, 7), r(-9, 9)],
			[r(-7, 7), r(-7, 7), r(-9, 9)]
		];
		if (n % 4 === 0) {
			const k = r(-3, 3) || 2;
			rows[1] = [rows[0][0] * k, rows[0][1] * k, n % 8 === 0 ? rows[0][2] * k : r(-9, 9)];
		}
		const want = expected(rows);
		for (const method of ['sostituzione', 'riduzione', 'cramer']) {
			const o = sistema2x2({ mode: 'coef', method, coef: coefOf(rows) });
			assert.ok(o.ok, `${JSON.stringify(rows)} ${method}: ${o.error}`);
			assert.equal(o.copy, want, `${JSON.stringify(rows)} ${method}`);
			if (n % 10 === 0) assertReadable(o, `${JSON.stringify(rows)} ${method}`);
		}
	}
});

test('brute force: typed systems give the same answer as their coefficients', () => {
	const r = rng(7);
	const sign = (v, first) => (v < 0 ? (first ? `-${-v}` : ` - ${-v}`) : first ? `${v}` : ` + ${v}`);
	for (let n = 0; n < 150; n++) {
		const rows = [
			[r(-6, 6) || 1, r(-6, 6) || 1, r(-9, 9)],
			[r(-6, 6) || 1, r(-6, 6) || 1, r(-9, 9)]
		];
		// Written with the y term moved to the right: a x = c - b y.
		const eqs = rows.map(([a, b, c]) => `${a}x = ${c}${sign(-b, false)}y`);
		const o = sistema2x2({ mode: 'eq', method: 'sostituzione', eqs });
		assert.equal(o.copy, expected(rows), eqs.join(' ; '));
	}
});

// ---------------------------------------------------------------------------
// Three equations

test('Sarrus agrees with the cofactor expansion', () => {
	const r = rng(3);
	for (let n = 0; n < 300; n++) {
		const m = [0, 1, 2].map(() => [r(-9, 9), r(-9, 9), r(-9, 9)]);
		assert.equal(det3(m.map((row) => row.map((v) => q(v)))).toString(), det(m).toString());
	}
});

test('three equations: the lesson examples, by Cramer and by reduction', () => {
	const lesson7 = ['1', '2', '-1', '-1', '2', '-1', '1', '6', '1', '1', '2', '3'];
	for (const method of ['cramer', 'riduzione']) {
		const o = sistema3x3({ mode: 'coef', method, coef: lesson7 });
		assert.equal(o.copy, 'x = 2; y = -1; z = 1', method);
		const p = sistema3x3({ mode: 'eq', method, eqs: ['x + y + z = 6', '2x - y + z = 3', 'x + 2y - z = 2'] });
		assert.equal(p.copy, 'x = 1; y = 2; z = 3', method);
		assertReadable(o, method);
		assertReadable(p, method);
	}
	const o = sistema3x3({ mode: 'coef', method: 'cramer', coef: lesson7 });
	const table = o.steps.find((s) => s.table)?.table;
	assert.deepEqual(table.head, ['Diagonali verso destra', 'Diagonali verso sinistra']);
	assert.deepEqual(table.rows.at(-1), ['Somma: $-2$', 'Somma: $10$']);
	assert.ok(o.steps.some((s) => s.math?.[1] === '= \\hl{-12}'));
	assert.equal(o.steps[0].group, 'La forma normale');
});

test('three equations: D = 0 is not enough, the reduction decides', () => {
	// The lesson: D = Dx = Dy = Dz = 0 and yet impossible.
	const a = sistema3x3({ mode: 'coef', method: 'cramer', coef: ['1', '1', '1', '1', '1', '1', '1', '2', '1', '1', '1', '3'] });
	assert.equal(a.copy, 'Sistema impossibile: nessuna soluzione');
	assert.ok(a.steps.some((s) => /Risolvi il sistema per riduzione/.test(s.then ?? '')));
	const b = sistema3x3({ mode: 'coef', method: 'riduzione', coef: ['1', '1', '1', '1', '2', '2', '2', '2', '1', '-1', '0', '0'] });
	assert.equal(b.copy, 'Sistema indeterminato: infinite soluzioni');
	assert.match(b.rows[1].value, /begin\{cases\}/);
	const c = sistema3x3({ mode: 'coef', method: 'riduzione', coef: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'] });
	assert.equal(c.copy, 'Sistema indeterminato: ogni terna di numeri è una soluzione');
	for (const o of [a, b, c]) assertReadable(o, 'D = 0');
});

test('the examples of the page work', () => {
	const rows = [
		['2', '1', '-1', '1', '1', '-3', '2', '0', '3', '2', '1', '4'],
		['1', '1', '1', '1', '1', '1', '1', '2', '1', '-1', '0', '0'],
		['1', '1', '1', '1', '2', '2', '2', '2', '1', '-1', '0', '0']
	];
	for (const coef of rows) for (const method of ['cramer', 'riduzione']) assertReadable(sistema3x3({ mode: 'coef', method, coef }), coef.join(' '));
	const typed = sistema3x3({ mode: 'eq', method: 'riduzione', eqs: ['2(x - y) + z = 3', 'x + y = z + 1', 'x/2 + y = 2'] });
	assert.ok(typed.ok, typed.error);
	assertReadable(typed, 'typed 3x3');
	for (const method of ['sostituzione', 'riduzione', 'cramer']) assertReadable(sistema2x2({ mode: 'eq', method, eqs: ['x + y = 5', '2x + 3y = 12'] }), method);
});

test('brute force: 3 × 3 systems, Cramer and reduction agree with an independent solver', () => {
	const r = rng(11);
	for (let n = 0; n < 300; n++) {
		const rows = [0, 1, 2].map(() => [r(-5, 5), r(-5, 5), r(-5, 5), r(-9, 9)]);
		if (n % 3 === 0) {
			// The third equation a combination of the first two, with its known term kept or changed.
			const [h, k] = [r(-2, 2), r(-2, 2)];
			rows[2] = rows[0].map((v, j) => h * v + k * rows[1][j]);
			if (n % 6 === 0) rows[2][3] += r(1, 4);
		}
		const want = expected(rows);
		for (const method of ['cramer', 'riduzione']) {
			const o = sistema3x3({ mode: 'coef', method, coef: coefOf(rows) });
			assert.ok(o.ok, `${JSON.stringify(rows)} ${method}: ${o.error}`);
			assert.equal(o.copy, want, `${JSON.stringify(rows)} ${method}`);
			if (n % 15 === 0) assertReadable(o, `${JSON.stringify(rows)} ${method}`);
		}
	}
});

test('classify is exact on a hand-made case', () => {
	const row = (c, d) => ({ c: c.map((v) => q(v)), d: q(d) });
	const r = classify([row([1, 1], 3), row([1, -1], 1)]);
	assert.equal(r.case, 'determinato');
	assert.deepEqual(r.x.map(String), ['2', '1']);
});

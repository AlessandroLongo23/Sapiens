// The inequality tools: first degree (with the sign that turns when dividing by a negative) and second degree (the
// associated equation, the sign of the parabola, the intervals). Run with
// `node --test tests/unit/tools-disequazioni.test.mjs` (jiti loads the TypeScript sources).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { risolviDisequazionePrimoGrado, risolviDisequazioneSecondoGrado, previewInequality, quadIneqDegree } = await jiti.import('../../src/lib/tools/disequazioni.ts');
const { Rational, q } = await jiti.import('../../src/lib/exercises/v2/rational.ts');

const first = (s) => risolviDisequazionePrimoGrado(s);
const second = (input) => risolviDisequazioneSecondoGrado(input);

function rng(seed) {
	let s = seed >>> 0;
	return (a, b) => {
		s = (s * 1664525 + 1013904223) >>> 0;
		return a + (s % (b - a + 1));
	};
}

const holds = (l, rel, r) => (rel === '>' ? l > r : rel === '>=' ? l >= r : rel === '<' ? l < r : l <= r);
const signed = (n) => (n < 0 ? `- ${-n}` : `+ ${n}`);

// ---------------------------------------------------------------------------
// First degree

test('first degree: the sign turns when dividing by a negative number', () => {
	const { outcome: o, line } = first('3(x - 2) + 1 > 5x - 1');
	assert.equal(o.copy, 'x < -2');
	assert.equal(o.rows[1].value, '$S = \\left] -\\infty, -2 \\right[$');
	const divide = o.steps.find((s) => s.say.startsWith('Dividi'));
	assert.equal(divide.say, 'Dividi entrambi i membri per $-2$, che è negativo.');
	assert.match(divide.math[1], /\\mathrel\{\\hl\{<\}\}/);
	assert.equal(divide.then, 'Hai diviso per un numero negativo: il verso cambia, da $>$ a $<$.');
	assert.deepEqual(line, { points: [{ label: '−2', inSet: false }], stretches: [true, false], caption: 'I numeri minori di −2.' });
	assertReadable(o, 'default');
});

test('first degree: the lesson examples', () => {
	assert.equal(first('3x - 5 > 7').outcome.copy, 'x > 4');
	assert.equal(first('2 - 5x >= 17').outcome.copy, 'x ≤ -3');
	assert.equal(first('-3x < 12').outcome.copy, 'x > -4');
	assert.equal(first('3x > -6').outcome.copy, 'x > -2');
	assert.equal(first('3x ≤ 20').outcome.copy, 'x ≤ 20/3');
	const frac = first('x/2 - 1/3 <= x');
	assert.equal(frac.outcome.copy, 'x ≥ -2/3');
	assert.equal(frac.outcome.rows[1].value, '$S = \\left[ -\\frac{2}{3}, +\\infty \\right[$');
	assert.equal(frac.outcome.steps[0].group, 'I denominatori');
	assert.ok(frac.outcome.steps.some((s) => s.then === 'Il $6$ è positivo: il verso non cambia.'));
	for (const s of ['3x - 5 > 7', '2 - 5x >= 17', 'x/2 - 1/3 <= x', '0,5x + 1 => 2', '2(x + 1) < 2x + 1']) assertReadable(first(s).outcome, s);
});

test('first degree: 0x on the left, always true or never', () => {
	const all = first('2x + 1 >= 2(x - 1)');
	assert.equal(all.outcome.copy, 'Ogni numero reale è una soluzione');
	assert.equal(all.outcome.rows[1].value, '$S = \\mathbb{R}$');
	assert.deepEqual(all.line.stretches, [true]);
	const none = first('2(x + 1) < 2x + 1');
	assert.equal(none.outcome.copy, 'Nessuna soluzione');
	assert.equal(none.outcome.rows[1].value, '$S = \\emptyset$');
	assert.deepEqual(none.line, { points: [], stretches: [false], caption: 'Nessun punto: la disequazione non ha soluzioni.' });
	// 0 > 0 is false, 0 >= 0 true.
	assert.equal(first('x > x').outcome.copy, 'Nessuna soluzione');
	assert.equal(first('x >= x').outcome.copy, 'Ogni numero reale è una soluzione');
});

test('first degree: the signs as students type them', () => {
	for (const [s, rel] of [
		['x >= 1', '≥'],
		['x => 1', '≥'],
		['x ≥ 1', '≥'],
		['x ⩾ 1', '≥'],
		['x <= 1', '≤'],
		['x =< 1', '≤'],
		['x ≤ 1', '≤'],
		['x > 1', '>'],
		['x < 1', '<']
	])
		assert.equal(first(s).outcome.copy, `x ${rel} 1`, s);
	assert.equal(previewInequality('2x/3 >= 1'), '\\dfrac{2x}{3} \\geq 1');
});

test('first degree: wrong input says what to write', () => {
	const cases = {
		'2x + 3 = 7': /è un'equazione/,
		'2x + 3': /Manca il segno/,
		'1 < x < 3': /più di un segno/,
		'x >= = 2': /un solo segno/,
		'y > 2': /Usa la x/,
		'3 > 2': /Nella disequazione non c'è la x/,
		'x^2 > 4': /secondo grado/,
		'x^3 > 1': /grado 3/,
		'1/x > 2': /disequazione fratta/,
		'2x + > 1': /La disequazione è incompleta/,
		'': /Manca il segno/
	};
	for (const [s, re] of Object.entries(cases)) {
		const o = first(s).outcome;
		assert.equal(o.ok, false, s);
		assert.match(o.error, re, `${s}: ${o.error}`);
		assert.doesNotMatch(o.error, /2x \+ 3 = 7/, s);
	}
});

test('brute force: a x + b REL c x + d, checked at points around the answer', () => {
	const r = rng(5);
	const rels = ['>', '>=', '<', '<='];
	for (let n = 0; n < 500; n++) {
		const [a, b, c, d] = [r(-9, 9), r(-9, 9), r(-9, 9), r(-9, 9)];
		const rel = rels[n % 4];
		const text = `${a}x ${signed(b)} ${rel} ${c}x ${signed(d)}`;
		const { outcome: o, line } = first(text);
		assert.ok(o.ok, `${text}: ${o.error}`);
		const lhs = (x) => q(a).mul(x).add(q(b));
		const rhs = (x) => q(c).mul(x).add(q(d));
		const truth = (x) => holds(lhs(x).compare(rhs(x)), rel, 0);
		let member;
		if (o.copy === 'Ogni numero reale è una soluzione') member = () => true;
		else if (o.copy === 'Nessuna soluzione') member = () => false;
		else {
			const m = /^x (<|>|≤|≥) (-?\d+(?:\/\d+)?)$/.exec(o.copy);
			assert.ok(m, `${text}: ${o.copy}`);
			const x0 = Rational.parse(m[2]);
			const op = { '<': '<', '>': '>', '≤': '<=', '≥': '>=' }[m[1]];
			member = (x) => holds(x.compare(x0), op, 0);
			assert.equal(line.points.length, 1);
			// The sketch agrees with the answer: the end is in the set when included, the stretches on the right side.
			assert.equal(line.points[0].inSet, op.includes('='), text);
			assert.deepEqual(line.stretches, op.startsWith('<') ? [true, false] : [false, true], text);
			for (const x of [x0, x0.add(q(1, 1000)), x0.sub(q(1, 1000))]) assert.equal(member(x), truth(x), `${text} at ${x}`);
		}
		for (const x of [-20, -3, 0, 1, 7, 25].map((v) => q(v))) assert.equal(member(x), truth(x), `${text} at ${x}`);
		if (n % 25 === 0) assertReadable(o, text);
	}
});

// ---------------------------------------------------------------------------
// Second degree

test('second degree: the default, with a negative a turned positive and the sign changed', () => {
	const { outcome: o, line } = second({ mode: 'coef', a: '-1', b: '2', c: '3', rel: '<' });
	assert.equal(o.copy, 'x < -1 oppure x > 3');
	assert.equal(o.rows[0].value, '$x < -1$ oppure $x > 3$');
	assert.equal(o.rows[1].value, '$S = \\left] -\\infty, -1 \\right[ \\cup \\left] 3, +\\infty \\right[$');
	const flip = o.steps.find((s) => s.say === 'Moltiplica entrambi i membri per $-1$.');
	assert.deepEqual(flip.math, ['x^2 - 2x - 3 \\mathrel{\\hl{>}} 0']);
	assert.match(flip.then, /il verso cambia, da \$<\$ a \$>\$/);
	const sign = o.steps.find((s) => s.say === 'Studia il segno del trinomio.');
	assert.deepEqual(sign.table.rows[0], ['Segno', '$+$', '$0$', '$-$', '$0$', '$+$']);
	assert.deepEqual(line.stretches, [true, false, true]);
	assert.deepEqual(
		line.points.map((p) => p.inSet),
		[false, false]
	);
	assert.deepEqual(
		[...new Set(o.steps.map((s) => s.group).filter(Boolean))],
		['La forma normale', "L'equazione associata", 'Il segno del trinomio']
	);
	assertReadable(o, 'default');
});

test('second degree: the four cases of the table, with Δ > 0, Δ = 0 and Δ < 0', () => {
	const copy = (a, b, c, rel) => second({ mode: 'coef', a, b, c, rel }).outcome.copy;
	// Δ > 0: roots -2 and 3.
	assert.equal(copy('1', '-1', '-6', '>'), 'x < -2 oppure x > 3');
	assert.equal(copy('1', '-1', '-6', '>='), 'x ≤ -2 oppure x ≥ 3');
	assert.equal(copy('1', '-1', '-6', '<'), '-2 < x < 3');
	assert.equal(copy('1', '-1', '-6', '<='), '-2 ≤ x ≤ 3');
	// Δ = 0: the root 2.
	assert.equal(copy('1', '-4', '4', '>'), 'x ≠ 2');
	assert.equal(copy('1', '-4', '4', '>='), 'Ogni numero reale');
	assert.equal(copy('1', '-4', '4', '<'), 'Nessuna soluzione');
	assert.equal(copy('1', '-4', '4', '<='), 'x = 2');
	// Δ < 0.
	assert.equal(copy('1', '1', '1', '>'), 'Ogni numero reale');
	assert.equal(copy('1', '1', '1', '<='), 'Nessuna soluzione');
	const neq = second({ mode: 'coef', a: '1', b: '-4', c: '4', rel: '>' }).outcome;
	assert.equal(neq.rows[1].value, '$S = \\mathbb{R} \\setminus \\{2\\}$');
	const only = second({ mode: 'coef', a: '1', b: '-4', c: '4', rel: '<=' });
	assert.equal(only.outcome.rows[1].value, '$S = \\{2\\}$');
	assert.deepEqual(only.line.points, [{ label: '2', inSet: true }]);
	for (const rel of ['>', '>=', '<', '<='])
		for (const [a, b, c] of [
			['1', '-1', '-6'],
			['1', '-4', '4'],
			['1', '1', '1'],
			['2', '0', '-8'],
			['1', '-3', '0']
		])
			assertReadable(second({ mode: 'coef', a, b, c, rel }).outcome, `${a} ${b} ${c} ${rel}`);
});

test('second degree: exact roots with radicals, and their decimal values', () => {
	const { outcome: o, line } = second({ mode: 'eq', eq: 'x^2 < 2x + 1' });
	assert.equal(o.copy, '1 - √2 < x < 1 + √2');
	assert.equal(o.rows[1].value, '$S = \\left] 1 - \\sqrt{2}, 1 + \\sqrt{2} \\right[$');
	assert.equal(o.rows[2].value, '$x_1 \\approx -0{,}4142$ $x_2 \\approx 2{,}4142$');
	assert.deepEqual(
		line.points.map((p) => p.label),
		['1 − √2', '1 + √2']
	);
	const frac = second({ mode: 'coef', a: '2', b: '-6', c: '1', rel: '>=' }).outcome;
	assert.equal(frac.copy, 'x ≤ (3 - √7)/2 oppure x ≥ (3 + √7)/2');
	assertReadable(o, 'radicals');
	assertReadable(frac, 'fraction radicals');
});

test('second degree: typed in full, with the lesson examples', () => {
	const copy = (eq) => second({ mode: 'eq', eq }).outcome.copy;
	assert.equal(copy('x^2 - x - 6 <= 0'), '-2 ≤ x ≤ 3');
	assert.equal(copy('2x^2 - 3x - 2 > 0'), 'x < -1/2 oppure x > 2');
	assert.equal(copy('-x^2 + 4x - 3 >= 0'), '1 ≤ x ≤ 3');
	assert.equal(copy('x^2 <= 9'), '-3 ≤ x ≤ 3');
	assert.equal(copy('x(x - 4) >= -4'), 'Ogni numero reale');
	assert.equal(copy('x^2 > 0'), 'x ≠ 0');
	assert.equal(copy('(x - 1)^2 < 0'), 'Nessuna soluzione');
	assert.equal(copy('x^2/2 - 8 >= 0'), 'x ≤ -4 oppure x ≥ 4');
	for (const eq of ['x^2 - x - 6 <= 0', '-x^2 + 4x - 3 >= 0', 'x(x - 4) >= -4', '(x + 1)^2 > 2x + 5', 'x^2/2 - 8 >= 0']) assertReadable(second({ mode: 'eq', eq }).outcome, eq);
});

test('second degree: wrong input says what to write', () => {
	const bad = {
		'2x > 1': /primo grado/,
		'x^3 > 1': /grado 3/,
		'x^2 = 4': /è un'equazione/,
		'x^2 - 5x + 6': /Manca il segno/
	};
	for (const [eq, re] of Object.entries(bad)) {
		const o = second({ mode: 'eq', eq }).outcome;
		assert.equal(o.ok, false, eq);
		assert.match(o.error, re, `${eq}: ${o.error}`);
	}
	assert.match(second({ mode: 'coef', a: '0', b: '1', c: '1', rel: '>' }).outcome.error, /primo grado/);
	assert.match(second({ mode: 'coef', a: '', b: '1', c: '1', rel: '>' }).outcome.error, /coefficiente a/);
	assert.match(second({ mode: 'coef', a: 'x', b: '1', c: '1', rel: '>' }).outcome.error, /come numeri/);
	assert.match(second({ mode: 'coef', a: '1', b: '1', c: '1', rel: '=' }).outcome.error, /verso/);
	assert.equal(quadIneqDegree({ mode: 'eq', eq: '2x > 1' }), 1);
	assert.equal(quadIneqDegree({ mode: 'coef', a: '0' }), 1);
});

test('brute force: a x² + b x + c REL 0, the number line agrees with the trinomial at sample points', () => {
	const r = rng(9);
	const rels = ['>', '>=', '<', '<='];
	for (let n = 0; n < 500; n++) {
		const a = r(-6, 6) || 1;
		const [b, c] = [r(-9, 9), r(-9, 9)];
		const rel = rels[n % 4];
		const { outcome: o, line } = second({ mode: 'coef', a: String(a), b: String(b), c: String(c), rel });
		const label = `${a} ${b} ${c} ${rel}`;
		assert.ok(o.ok, `${label}: ${o.error}`);
		const D = b * b - 4 * a * c;
		let roots = D < 0 ? [] : D === 0 ? [-b / (2 * a)] : [(-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)].sort((u, v) => u - v);
		// A double root is drawn only when it matters: x ≠ r or x = r. For every x, or for none, the line is plain.
		const leadingSign = Math.sign(a);
		const sameSide = (leadingSign > 0) === (rel === '>=' || rel === '>');
		if (D === 0 && (rel.includes('=') ? sameSide : !sameSide)) roots = [];
		assert.equal(line.points.length, roots.length, label);
		const f = (x) => a * x * x + b * x + c;
		// At each root the trinomial is zero: in the set when the sign admits equality.
		line.points.forEach((p) => assert.equal(p.inSet, rel.includes('='), label));
		// Between and around the roots, the stretch is in the set exactly when the trinomial has the right sign.
		const cuts = [-1e3, ...roots, 1e3];
		for (let k = 0; k <= roots.length; k++) {
			const x = (Math.max(cuts[k], -50) + Math.min(cuts[k + 1], 50)) / 2;
			assert.equal(line.stretches[k], holds(f(x), rel, 0), `${label} at ${x}`);
		}
		if (n % 25 === 0) assertReadable(o, label);
	}
});

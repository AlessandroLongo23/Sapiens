// The tools for the other equations and inequalities: fractional equations (C.E., lcm, the solutions that are not
// acceptable), biquadratic equations (t = x²), equations with an absolute value (the two cases) and fractional
// inequalities (the table of signs). Run with `node --test tests/unit/tools-equazioni-altre.test.mjs`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { risolviEquazioneFratta, previewFratta, factorLow, factoredLatex } = await jiti.import('../../src/lib/tools/equazioni-fratte.ts');
const { equazioneBiquadratica } = await jiti.import('../../src/lib/tools/equazioni-biquadratiche.ts');
const { risolviValoreAssoluto, previewValoreAssoluto } = await jiti.import('../../src/lib/tools/equazioni-valore-assoluto.ts');
const { risolviDisequazioneFratta, previewDisequazioneFratta } = await jiti.import('../../src/lib/tools/disequazioni-fratte.ts');
const { writeSet } = await jiti.import('../../src/lib/tools/intervalli.ts');
const { Rational, q } = await jiti.import('../../src/lib/exercises/v2/rational.ts');
const { Surd } = await jiti.import('../../src/lib/exercises/v2/surd.ts');

function rng(seed) {
	let s = seed >>> 0;
	return (a, b) => {
		s = (s * 1664525 + 1013904223) >>> 0;
		return a + (s % (b - a + 1));
	};
}

/** "3x - 2", "-x", "0" from integer coefficients, highest first. */
function polyStr(cs) {
	const d = cs.length - 1;
	let out = '';
	cs.forEach((c, i) => {
		const k = d - i;
		if (c === 0) return;
		const x = k === 0 ? '' : k === 1 ? 'x' : `x^${k}`;
		const abs = Math.abs(c);
		const body = k > 0 && abs === 1 ? x : `${abs}${x}`;
		out += out ? (c < 0 ? ` - ${body}` : ` + ${body}`) : `${c < 0 ? '-' : ''}${body}`;
	});
	return out || '0';
}
const polyAt = (cs, x) => cs.reduce((acc, c) => acc * x + c, 0);
const ratAt = (cs, x) => cs.reduce((acc, c) => acc.mul(x).add(q(c)), q(0));

/** Is x (a Rational) in the set? Exact. */
function inSet(set, x) {
	const s = Surd.rational(x);
	const i = set.points.findIndex((p) => p.equals(s));
	if (i >= 0) return set.pointIn[i];
	const j = set.points.filter((p) => p.compare(s) < 0).length;
	return set.stretchIn[j];
}

// ---------------------------------------------------------------------------
// Fractional equations

const fr = (s) => risolviEquazioneFratta(s);
const xs = (r) => r.solution.candidates.filter((c) => c.ok).map((c) => c.x.toString());

test('fractional equations: the lesson examples', () => {
	const e1 = fr('3/(x - 2) = 5/x');
	assert.deepEqual(xs(e1), ['5']);
	assert.deepEqual(e1.solution.excluded.map(String), ['0', '2']);
	assert.equal(e1.outcome.rows[0].value, '$x \\neq 0$ e $x \\neq 2$');
	assert.ok(e1.outcome.steps.some((s) => s.math?.includes('\\text{mcm} = \\hl{x(x - 2)}')));
	assert.deepEqual(xs(fr('2/x + 1/(2x) = 5/4')), ['2']);
	assert.ok(fr('2/x + 1/(2x) = 5/4').outcome.steps.some((s) => s.math?.includes('\\text{mcm} = \\hl{4x}')));
	assert.deepEqual(xs(fr('1/(x - 2) + 2/(x + 2) = 6/(x^2 - 4)')), ['8/3']);
	const e4 = fr('x/(x - 1) + 2/(1 - x) = 3');
	assert.deepEqual(xs(e4), ['1/2']);
	assert.ok(e4.outcome.steps[0].table.rows.some((r) => r[1] === '$-(x - 1)$'));
	assert.deepEqual(xs(fr('(x - 1)/(x + 1) = (x + 2)/(x + 3)')), ['-5']);
	for (const s of ['3/(x - 2) = 5/x', '2/x + 1/(2x) = 5/4', '1/(x - 2) + 2/(x + 2) = 6/(x^2 - 4)', 'x/(x - 1) + 2/(1 - x) = 3', '(x - 1)/(x + 1) = (x + 2)/(x + 3)']) assertReadable(fr(s).outcome, s);
});

test('fractional equations: a solution that is not acceptable is discarded, highlighted', () => {
	const a = fr('x/(x - 2) = 2/(x - 2)');
	assert.equal(a.outcome.copy, 'Nessuna soluzione');
	assert.deepEqual(a.solution.candidates.map((c) => [c.x.toString(), c.ok]), [['2', false]]);
	const cmp = a.outcome.steps.find((s) => s.say.startsWith('Confronta'));
	assert.equal(cmp.table.rows[0][0], '$\\hl{x = 2}$');
	assert.match(cmp.table.rows[0][1], /Non accettabile/);
	assert.equal(a.outcome.rows.at(-1).value, '$S = \\emptyset$');
	// Simplifying first would give x = 2: the C.E. come from the equation as typed.
	assert.equal(fr('(x^2 - 4)/(x - 2) = 4').outcome.copy, 'Nessuna soluzione');
	// Two solutions of the integer equation, one discarded.
	const b = fr('x/(x - 1) = 1/(x - 1) + x');
	assert.deepEqual(b.solution.candidates.map((c) => [c.x.toString(), c.ok]), [['1', false]]);
	const c = fr('x/(x+1) - 1/(x-1) = 2/(x^2-1)');
	assert.deepEqual(c.solution.candidates.map((k) => [k.x.toString(), k.ok]), [['-1', false], ['3', true]]);
	assert.equal(c.outcome.rows.find((r) => r.label === 'Soluzione non accettabile').value, '$x = -1$');
	for (const s of ['x/(x - 2) = 2/(x - 2)', '(x^2 - 4)/(x - 2) = 4', 'x/(x - 1) = 1/(x - 1) + x']) assertReadable(fr(s).outcome, s);
});

test('fractional equations: impossible, indeterminate, second degree, irrational', () => {
	assert.equal(fr('1/x = 0').outcome.copy, 'Nessuna soluzione');
	const all = fr('(x + 1)/(x - 1) - 2 = (3 - x)/(x - 1)');
	assert.equal(all.solution.kind, 'indeterminata');
	assert.equal(all.outcome.rows.at(-1).value, '$S = \\mathbb{R} \\setminus \\left\\{ 1 \\right\\}$');
	assert.deepEqual(xs(fr('1/(x^2 + 1) = 1/2')), ['-1', '1']);
	assert.equal(fr('1/(x^2 + 1) = 1/2').outcome.rows[0].value, 'Nessuna: i denominatori non si annullano mai');
	const irr = fr('3/(x - 2) = 5/x + 1');
	assert.deepEqual(xs(irr), ['-sqrt(10)', 'sqrt(10)']);
	assert.match(irr.outcome.rows[1].value, /\\approx -3\{,\}1623/);
	// Irrational C.E.
	assert.deepEqual(fr('x/(x^2 - 2) = 1').solution.excluded.map(String), ['-sqrt(2)', 'sqrt(2)']);
	assert.deepEqual(xs(fr('2/(x-1)^2 = 1/(x-1)')), ['3']);
	for (const s of ['1/x = 0', '(x + 1)/(x - 1) - 2 = (3 - x)/(x - 1)', '1/(x^2 + 1) = 1/2', '3/(x - 2) = 5/x + 1', 'x/(x^2 - 2) = 1', '2/(x-1)^2 = 1/(x-1)']) assertReadable(fr(s).outcome, s);
});

test('fractional equations: how students type them', () => {
	assert.deepEqual(xs(fr('1/2x = 3')), ['1/6']);
	assert.equal(previewFratta('1/2x = 3'), '\\dfrac{1}{2x} = 3');
	assert.equal(previewFratta('(x+1)/(x-1) = 2'), '\\dfrac{x + 1}{x - 1} = 2');
	assert.deepEqual(xs(fr('x/2 + 1/x = 3/2')), ['1', '2']);
	assert.deepEqual(xs(fr('−3/(x − 2) = 1')), ['-1']);
	assert.deepEqual(xs(fr('3 = 6/x')), ['2']);
});

test('fractional equations: wrong inputs give a sentence that says what to write', () => {
	for (const s of ['', '3/(x - 2)', '1/x = 2 = 3', '3x + 1 = 2', 'x/(x^3 - 1) = 1', '1/(x-1) + 1/(x-2) + 1/(x-3) = 1', '1/0 = x', '3/(x-2)*2 = 1', '1/(x-1)/2 = 1', '3/ = 1', '1/(x = 2', '1/y = 2', '(1/x + 1)*2 = 3']) {
		const o = fr(s).outcome;
		assert.equal(o.ok, false, s);
		assert.ok(o.error.length > 20 && !/polinomio/.test(o.error), `${s}: ${o.error}`);
	}
	assert.match(fr('3x + 1 = 2').outcome.error, /equazione intera/);
});

test('fractional equations: brute force, every solution solves the equation and none is lost', () => {
	const r = rng(7);
	let checked = 0;
	for (let n = 0; n < 400; n++) {
		// a/(x - p) + b = c/(x - s)  or  (x + a)/(x - p) = c/(x^2 - s^2)
		const [a, b, c, p, s] = [r(-5, 5), r(-3, 3), r(-5, 5), r(-4, 4), r(-4, 4)];
		const kind = r(0, 1);
		const text = kind ? `${a}/(${polyStr([1, -p])}) + ${b} = ${c}/(${polyStr([1, -s])})` : `(${polyStr([1, a])})/(${polyStr([1, -p])}) = ${c}/(${polyStr([1, 0, -s * s])})`;
		const res = fr(text);
		if (!res.outcome.ok) continue;
		checked++;
		const f = kind ? (x) => a / (x - p) + b - c / (x - s) : (x) => (x + a) / (x - p) - c / (x * x - s * s);
		const dens = kind ? [p, s] : [p, s, -s];
		for (const k of res.solution.candidates) {
			const x = k.x.value();
			if (k.ok) {
				assert.ok(!dens.some((d) => Math.abs(d - x) < 1e-9), `${text}: ${x} is excluded`);
				assert.ok(Math.abs(f(x)) < 1e-6, `${text}: ${x} does not solve it`);
			} else assert.ok(dens.some((d) => Math.abs(d - x) < 1e-9), `${text}: ${x} was discarded`);
		}
		// No solution lost: scan for sign changes of the numerator of f away from the excluded values.
		if (res.solution.kind === 'determinata') {
			const found = res.solution.candidates.filter((k) => k.ok).map((k) => k.x.value());
			for (let x = -10; x <= 10; x += 0.25) if (!dens.some((d) => Math.abs(d - x) < 1e-9) && Math.abs(f(x)) < 1e-12) assert.ok(found.some((y) => Math.abs(y - x) < 1e-9), `${text}: lost ${x}`);
		}
		assertReadable(res.outcome, text);
	}
	assert.ok(checked > 250, `only ${checked} checked`);
});

test('fractional equations: factoring of the denominators', () => {
	const f = (cs) => factoredLatex(factorLow(cs.map((c) => q(c)).reverse()));
	assert.equal(f([1, 0, -4]), '(x + 2)(x - 2)');
	assert.equal(f([-1, 1]), '-(x - 1)');
	assert.equal(f([2, 0]), '2x');
	assert.equal(f([1, -2, 0]), 'x(x - 2)');
	assert.equal(f([1, -2, 1]), '(x - 1)^{2}');
	assert.equal(f([1, 0, 1]), 'x^2 + 1');
	assert.equal(f([4, 0, -1]), '(2x + 1)(2x - 1)');
	assert.equal(f([6, 1, -1]), '(2x + 1)(3x - 1)');
	assert.equal(f([2, -2]), '2(x - 1)');
});

// ---------------------------------------------------------------------------
// Biquadratic equations

const bq = (a, b, c) => equazioneBiquadratica({ mode: 'coef', a: String(a), b: String(b), c: String(c) });

test('biquadratic: four, two, one, no solutions', () => {
	assert.equal(bq(1, -5, 4).copy, 'x = -2; x = -1; x = 1; x = 2');
	assert.equal(bq(4, -17, 4).copy, 'x = -2; x = -1/2; x = 1/2; x = 2');
	assert.equal(bq(1, 3, -4).copy, 'x = -1; x = 1');
	assert.equal(bq(2, 0, -8).copy, 'x = -√2; x = √2');
	assert.equal(bq(1, 2, 5).copy, 'Nessuna soluzione reale');
	assert.equal(bq(1, 5, 4).copy, 'Nessuna soluzione reale');
	assert.equal(bq(1, 0, 0).copy, 'x = 0');
	const disc = bq(1, 3, -4).steps.find((s) => s.math?.[0] === '\\hl{x^2 = -4}');
	assert.match(disc.then, /si scarta/);
	const eq = equazioneBiquadratica({ mode: 'eq', eq: 'x^4 = 3x^2' });
	assert.equal(eq.copy, 'x = -√3; x = 0; x = √3');
	// The steps in t: no x left in the part solved by the second-degree tool.
	const o = bq(1, -5, 4);
	const inT = o.steps.filter((s, i) => i > 0 && !s.say.includes('x^2 ='));
	for (const s of inT) for (const l of s.math ?? []) assert.ok(!/(?<![a-zA-Z\\])x(?![a-zA-Z])/.test(l), l);
	for (const [a, b, c] of [[1, -5, 4], [4, -17, 4], [1, 3, -4], [2, 0, -8], [1, 2, 5], [1, -3, 1], [1, 0, 0], [1, -2, 1], [-1, 5, -4], [1, 0, -16], [0.5, -2, 0]]) assertReadable(bq(a, b, c), `${a} ${b} ${c}`);
	assertReadable(eq, 'x^4 = 3x^2');
});

test('biquadratic: wrong inputs', () => {
	assert.equal(bq(0, 1, 1).ok, false);
	for (const eq of ['x^3 - x = 0', 'x^4 + x = 1', 'x^2 = 4', 'x^4 = ', 'y^4 = 1']) {
		const o = equazioneBiquadratica({ mode: 'eq', eq });
		assert.equal(o.ok, false, eq);
		assert.ok(o.error.length > 20, eq);
	}
	assert.match(equazioneBiquadratica({ mode: 'eq', eq: 'x^2 = 4' }).error, /secondo grado/);
	assert.equal(equazioneBiquadratica({ mode: 'coef', a: 'x', b: '1', c: '1' }).ok, false);
});

test('biquadratic: brute force against a (x² − t1)(x² − t2)', () => {
	const r = rng(11);
	for (let n = 0; n < 300; n++) {
		const [a, t1, t2] = [r(1, 3) * (r(0, 1) ? 1 : -1), r(-9, 9), r(-9, 9)];
		const o = bq(a, -a * (t1 + t2), a * t1 * t2);
		assert.ok(o.ok);
		const expect = [...new Set([t1, t2].filter((t) => t >= 0).flatMap((t) => [Math.sqrt(t), -Math.sqrt(t)]))].sort((u, v) => u - v);
		const got = o.rows.filter((row) => row.label.includes('oluzione') && row.label !== 'Soluzioni').map((row) => row.value);
		if (!expect.length) {
			assert.equal(o.copy, 'Nessuna soluzione reale');
			continue;
		}
		assert.equal(got.length, expect.length, `${a} ${t1} ${t2}: ${o.copy}`);
		const values = o.copy.split('; ').map((s) => {
			const v = s.slice(4);
			const neg = v.startsWith('-');
			const body = v.replace('-', '');
			const [k, root] = body.split('√');
			const val = root === undefined ? Number(k) : (k ? Number(k) : 1) * Math.sqrt(Number(root));
			return neg ? -val : val;
		});
		values.forEach((v, i) => assert.ok(Math.abs(v - expect[i]) < 1e-9, `${a} ${t1} ${t2}: ${o.copy}`));
		assertReadable(o, `${a} ${t1} ${t2}`);
	}
});

// ---------------------------------------------------------------------------
// Absolute value

const av = (s) => risolviValoreAssoluto(s);

test('absolute value: a number on the other side', () => {
	assert.equal(av('|2x - 3| = 5').outcome.copy, 'x = -1 oppure x = 4');
	assert.equal(av('|2x - 3| = 5').outcome.rows[1].value, '$S = \\left\\{ -1,\\ 4 \\right\\}$');
	assert.equal(av('|x + 2| = -3').outcome.copy, 'Nessuna soluzione');
	assert.equal(av('|x - 2| = 0').outcome.copy, 'x = 2');
	assert.equal(av('5 = |x|').outcome.copy, 'x = -5 oppure x = 5');
	for (const s of ['|2x - 3| = 5', '|x + 2| = -3', '|x - 2| = 0', '5 = |x|', '|x/2 + 1| = 3/2']) assertReadable(av(s).outcome, s);
});

test('absolute value: the two cases, with the discarded solution and the check', () => {
	const o = av('|2x - 3| = x + 1').outcome;
	assert.equal(o.copy, 'x = 2/3 oppure x = 4');
	assert.equal(o.steps[0].math[0], '2x - 3 \\geq 0 \\;\\Rightarrow\\; x \\geq \\frac{3}{2}');
	const disc = av('|3 - x| = 2x').outcome;
	assert.equal(disc.copy, 'x = 1');
	assert.ok(disc.steps.some((s) => s.then === 'Il $-3$ non rispetta la condizione $x > 3$: si scarta.'));
	const check = disc.steps.at(-1);
	assert.deepEqual(check.math, ['\\left| 3 - 1 \\right| = \\left| 2 \\right| = 2', '2 \\cdot 1 = 2']);
	// A case true for every x gives a half-line.
	assert.equal(av('|x - 1| = x - 1').outcome.rows[1].value, '$S = \\left[ 1, +\\infty \\right[$');
	assert.equal(av('|x - 1| = 1 - x').outcome.rows[1].value, '$S = \\left] -\\infty, 1 \\right]$');
	assert.equal(av('|x| = x - 4').outcome.copy, 'Nessuna soluzione');
	assert.equal(av('2x = |x - 3|').outcome.copy, 'x = 1');
	for (const s of ['|2x - 3| = x + 1', '|3 - x| = 2x', '|x - 1| = x - 1', '|x - 1| = 1 - x', '|x| = x - 4', '2x = |x - 3|', '|x| = -x']) assertReadable(av(s).outcome, s);
});

test('absolute value: wrong inputs', () => {
	for (const s of ['', '|x - 1|', 'x = 2', '|x| + 1 = 3', '|x^2 - 1| = 3', '|x - 1| = x^2', '|2| = x', '|x| = |x - 1|', '|x - 1 = 2', '|| = 2']) {
		const o = av(s).outcome;
		assert.equal(o.ok, false, s);
		assert.ok(o.error.length > 20, `${s}: ${o.error}`);
	}
	assert.equal(previewValoreAssoluto('|2x - 3| = x + 1'), '\\left| 2x - 3 \\right| = x + 1');
	assert.equal(av('abs(x - 1) = 2').outcome.copy, 'x = -1 oppure x = 3');
});

test('absolute value: brute force on a grid of rationals', () => {
	const r = rng(3);
	for (let n = 0; n < 400; n++) {
		const [a, b] = [r(-3, 3) || 1, r(-6, 6)];
		const [c, d] = [r(-3, 3), r(-6, 6)];
		const text = `|${polyStr([a, b])}| = ${polyStr([c, d])}`;
		const res = av(text);
		assert.ok(res.outcome.ok, text);
		for (let k = -48; k <= 48; k++) {
			const x = q(k, 4);
			const holds = ratAt([a, b], x).abs().equals(ratAt([c, d], x));
			assert.equal(inSet(res.set, x), holds, `${text} at ${x}`);
		}
		// Also at the solution points exactly.
		for (const [i, p] of res.set.points.entries())
			if (p.isRational()) assert.equal(res.set.pointIn[i], ratAt([a, b], p.toRational()).abs().equals(ratAt([c, d], p.toRational())), `${text} at ${p}`);
		assertReadable(res.outcome, text);
	}
});

// ---------------------------------------------------------------------------
// Fractional inequalities

const di = (n, d, rel) => risolviDisequazioneFratta({ n, d, rel });

test('fractional inequalities: the lesson examples', () => {
	assert.equal(di('x - 1', 'x + 2', '>=').outcome.copy, 'x < -2 oppure x ≥ 1');
	assert.equal(di('x^2 - 2x - 3', 'x - 2', '>=').outcome.rows[2].value, '$S = \\left[ -1, 2 \\right[ \\cup \\left[ 3, +\\infty \\right[$');
	assert.equal(di('4 - x^2', 'x', '>').outcome.copy, 'x < -2 oppure 0 < x < 2');
	assert.equal(di('x^2 - 6x + 9', 'x^2 - 5x + 4', '<').outcome.copy, '1 < x < 3 oppure 3 < x < 4');
	assert.equal(di('x^2 - 6x + 9', 'x^2 - 5x + 4', '<=').outcome.copy, '1 < x < 4');
	assert.equal(di('x + 2', 'x(x - 1)', '>=').outcome.copy, '-2 ≤ x < 0 oppure x > 1');
	assert.equal(di('x + 4', 'x - 3', '<').outcome.copy, '-4 < x < 3');
	for (const [n, d, v] of [['x - 1', 'x + 2', '>='], ['x^2 - 2x - 3', 'x - 2', '>='], ['4 - x^2', 'x', '>'], ['x^2 - 6x + 9', 'x^2 - 5x + 4', '<'], ['x + 2', 'x(x - 1)', '>=']]) assertReadable(di(n, d, v).outcome, `${n} / ${d}`);
});

test('fractional inequalities: the table has one row per factor and the fraction', () => {
	const o = di('x + 2', 'x(x - 1)', '>=').outcome;
	const t = o.steps.find((s) => s.table).table;
	assert.deepEqual(t.head, ['$x$', '$x < -2$', '$-2$', '$-2 < x < 0$', '$0$', '$0 < x < 1$', '$1$', '$x > 1$']);
	assert.deepEqual(
		t.rows.map((r) => r.join(' ')),
		['$x + 2$ $-$ $0$ $+$ $+$ $+$ $+$ $+$', '$x$ $-$ $-$ $-$ $0$ $+$ $+$ $+$', '$x - 1$ $-$ $-$ $-$ $-$ $-$ $0$ $+$', 'Frazione $-$ $0$ $+$ $\\nexists$ $-$ $\\nexists$ $+$']
	);
	// A negative number in front gets its own row.
	const neg = di('-(x - 1)(x + 3)', '2x - 4', '>');
	assert.ok(neg.outcome.steps.find((s) => s.table).table.rows.some((r) => r[0] === '$-1$'));
	assert.equal(neg.outcome.copy, 'x < -3 oppure 1 < x < 2');
	assert.deepEqual(neg.line.stretches, [true, false, true, false]);
});

test('fractional inequalities: always, never, irrational ends', () => {
	assert.equal(di('-2', 'x^2 + 1', '<').outcome.copy, 'Ogni numero reale');
	assert.equal(di('x^2 + 1', 'x^2 + x + 1', '<=').outcome.copy, 'Nessuna soluzione');
	assert.equal(di('1', 'x^2 - 4', '<').outcome.copy, '-2 < x < 2');
	assert.equal(di('(x - 1)^2', 'x + 1', '<=').outcome.copy, 'x < -1 oppure x = 1');
	const irr = di('x^2 - 2', '3 - x', '<=');
	assert.equal(irr.outcome.copy, '-√2 ≤ x ≤ √2 oppure x > 3');
	assert.match(irr.outcome.rows.at(-1).value, /1\{,\}4142/);
	for (const [n, d, v] of [['-2', 'x^2 + 1', '<'], ['x^2 + 1', 'x^2 + x + 1', '<='], ['1', 'x^2 - 4', '<'], ['(x - 1)^2', 'x + 1', '<='], ['x^2 - 2', '3 - x', '<=']]) assertReadable(di(n, d, v).outcome, `${n} / ${d}`);
});

test('fractional inequalities: wrong inputs', () => {
	for (const [n, d, v] of [['', 'x', '>'], ['x', '', '>'], ['x', '3', '>'], ['x^3', 'x', '>'], ['x', 'x^3 + 1', '>'], ['0', 'x', '>'], ['x', '0', '>'], ['x', 'x + 1', '='], ['y', 'x', '>'], ['x +', 'x', '>']]) {
		const o = di(n, d, v).outcome;
		assert.equal(o.ok, false, `${n} / ${d} ${v}`);
		assert.ok(o.error.length > 20, o.error);
	}
	assert.equal(previewDisequazioneFratta({ n: 'x - 1', d: 'x + 2', rel: '>=' }), '\\dfrac{x - 1}{x + 2} \\geq 0');
});

test('fractional inequalities: brute force against the sign of N/D', () => {
	const r = rng(5);
	const rels = ['>', '>=', '<', '<='];
	for (let n = 0; n < 500; n++) {
		const N = r(0, 1) ? [r(-2, 2), r(-4, 4), r(-6, 6)] : [r(-3, 3), r(-6, 6)];
		const D = r(0, 1) ? [r(-2, 2) || 1, r(-4, 4), r(-6, 6)] : [r(-3, 3) || 1, r(-6, 6)];
		const rel = rels[r(0, 3)];
		const res = di(polyStr(N), polyStr(D), rel);
		if (!res.outcome.ok) {
			assert.ok(N.every((c) => c === 0) || D.slice(0, -1).every((c) => c === 0), `${polyStr(N)} / ${polyStr(D)}: ${res.outcome.error}`);
			continue;
		}
		const holds = (x) => {
			const d = ratAt(D, x);
			if (d.isZero()) return false;
			const v = ratAt(N, x).div(d).sign();
			return rel === '>' ? v > 0 : rel === '>=' ? v >= 0 : rel === '<' ? v < 0 : v <= 0;
		};
		for (let k = -40; k <= 40; k++) {
			const x = q(k, 4);
			assert.equal(inSet(res.set, x), holds(x), `${polyStr(N)} / ${polyStr(D)} ${rel} 0 at ${x}`);
		}
		// Between and at irrational ends, numerically.
		for (const [i, p] of res.set.points.entries()) {
			if (p.isRational()) continue;
			const v = p.value();
			const sgn = (x) => Math.sign(polyAt(N, x) / polyAt(D, x));
			for (const x of [v - 1e-4, v + 1e-4]) {
				const s = sgn(x);
				const want = rel === '>' || rel === '>=' ? s > 0 : s < 0;
				assert.equal(inSet(res.set, Rational.of(Math.round(x * 1e6), 1e6)), want, `${polyStr(N)} / ${polyStr(D)} near ${v}`);
			}
			void i;
		}
		assertReadable(res.outcome, `${polyStr(N)} / ${polyStr(D)}`);
	}
});

test('intervals: points only, the whole line, a line without a point', () => {
	const s = (xs) => xs.map((x) => Surd.rational(q(x)));
	assert.equal(writeSet({ points: s([-1, 4]), pointIn: [true, true], stretchIn: [false, false, false] }).set, '\\left\\{ -1,\\ 4 \\right\\}');
	assert.equal(writeSet({ points: s([2]), pointIn: [false], stretchIn: [true, true] }).set, '\\mathbb{R} \\setminus \\left\\{ 2 \\right\\}');
	assert.equal(writeSet({ points: s([1, 3]), pointIn: [true, true], stretchIn: [false, false, true] }).set, '\\left\\{ 1 \\right\\} \\cup \\left[ 3, +\\infty \\right[');
	assert.equal(writeSet({ points: [], pointIn: [], stretchIn: [false] }).set, '\\emptyset');
});

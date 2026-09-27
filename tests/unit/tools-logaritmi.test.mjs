// The tools on logarithms and exponentials: the logarithm of a number, exponential and logarithmic equations.
// Run with `node --test tests/unit/tools-logaritmi.test.mjs` (jiti loads the TypeScript sources).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { logaritmo, logValue, parseNumberNode, pnumTex, commonBase } = await jiti.import('../../src/lib/tools/logaritmi.ts');
const { equazioneEsponenziale, solveExponential, previewEsponenziale } = await jiti.import('../../src/lib/tools/equazioni-esponenziali.ts');
const { equazioneLogaritmica, solveLogarithmic, previewLogaritmica } = await jiti.import('../../src/lib/tools/equazioni-logaritmiche.ts');

/** Deterministic random numbers, so a failure can be reproduced. */
function rng(seed) {
	let s = seed >>> 0;
	return (a, b) => {
		s = (s * 1664525 + 1013904223) >>> 0;
		return a + (s % (b - a + 1));
	};
}
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const frac = (n, d) => {
	const g = gcd(n, d) * Math.sign(d);
	return [n / g, d / g];
};
const fracStr = ([n, d]) => (d === 1 ? `${n}` : `${n}/${d}`);
const all = (o) => JSON.stringify(o);

test('reading numbers: fractions, decimals, roots, powers, e', () => {
	const t = (s) => pnumTex(parseNumberNode(s).val);
	assert.equal(t('8'), '8');
	assert.equal(t('0,25'), '\\dfrac{1}{4}');
	assert.equal(t('sqrt(8)'), '2\\sqrt{2}');
	assert.equal(t('2√2'), '2\\sqrt{2}');
	assert.equal(t('∛4'), '\\sqrt[3]{4}');
	assert.equal(t('2^(-3/2)'), '\\dfrac{\\sqrt{2}}{4}');
	assert.equal(t('e^2'), 'e^{2}');
	assert.equal(t('(2/3)^-2'), '\\dfrac{9}{4}');
	assert.equal(t('-8'), '-8');
	assert.throws(() => parseNumberNode('2 + 3'), /senza somme/);
	assert.throws(() => parseNumberNode('√(-4)'), /positivo/);
	assert.throws(() => parseNumberNode('abc'), /Non riconosco/);
	assert.equal(parseNumberNode(''), null);
	// The smallest common base.
	const base = (s) => {
		const { w, r } = commonBase(parseNumberNode(s).val);
		return `${pnumTex({ sign: 1, v: w })}^${r.toString()}`;
	};
	assert.equal(base('8'), '2^3');
	assert.equal(base('1/8'), '2^-3');
	assert.equal(base('4/9'), '\\dfrac{2}{3}^2');
	assert.equal(base('√8'), '2^3/2');
	assert.equal(base('36'), '6^2');
});

test('the logarithm: exact cases', () => {
	const cases = [
		['4', '8', '3/2'],
		['1/2', '8', '-3'],
		['2', '32', '5'],
		['9', '√3', '1/4'],
		['9', '27', '3/2'],
		['0,5', '0,25', '2'],
		['4/9', '27/8', '-3/2'],
		['8', '1/4', '-2/3'],
		['2', '1', '0'],
		['7', '7', '1'],
		['e', 'e^3', '3'],
		['√2', '8', '6'],
		['1/8', '∛4', '-2/9'],
		['10', '0,001', '-3'],
		['6', '216', '3']
	];
	for (const [b, a, v] of cases) {
		const o = logaritmo(b, a);
		assert.ok(o.ok, `${b} ${a}`);
		assert.equal(o.copy, v, `log_${b} ${a}`);
		assertReadable(o, `log_${b} ${a}`);
	}
	const o = logaritmo('4', '8');
	assert.deepEqual(o.rows, [{ label: 'Valore del logaritmo', value: '$\\log_{4} 8 = \\frac{3}{2}$ $= 1{,}5$' }]);
	assert.deepEqual(o.steps[0].math, ['4 = \\hl{2^{2}}']);
	assert.deepEqual(o.steps.at(-1).math, ['2y = 3', 'y = \\hl{\\frac{3}{2}}']);
	assert.deepEqual(logaritmo('2', '2√2').steps[0].math, ['2\\sqrt{2} = 2 \\cdot 2^{\\frac{1}{2}} = \\hl{2^{\\frac{3}{2}}}']);
});

test('the logarithm: change of base when it is not a fraction', () => {
	const o = logaritmo('3', '5');
	assert.equal(o.copy, '1,4650');
	assert.deepEqual(o.steps[1].math, ['\\log_{3} 5 = \\dfrac{\\ln 5}{\\ln 3}']);
	assert.match(all(o), /1\{,\}609438/);
	assertReadable(o, 'log_3 5');
	assert.equal(logaritmo('e', '5').copy, '1,6094');
	assert.equal(logaritmo('2', 'e').copy, '1,4427');
	assert.equal(logaritmo('10', '2').copy, '0,3010');
	assert.equal(logaritmo('4', '6').copy, '1,2925');
	for (const [b, a] of [
		['e', '5'],
		['2', 'e'],
		['1/3', '10']
	])
		assertReadable(logaritmo(b, a), `log_${b} ${a}`);
});

test('the logarithm: cases where it does not exist, and wrong input', () => {
	for (const [b, a, what] of [
		['1', '5', /diversa da \$1\$/],
		['-2', '8', /positiva/],
		['0', '8', /positiva/],
		['2', '0', /positivo/],
		['2', '-4', /positivo/]
	]) {
		const o = logaritmo(b, a);
		assert.ok(o.ok);
		assert.equal(o.copy, 'non esiste');
		assert.match(all(o.steps), what, `${b} ${a}`);
		assertReadable(o, `${b} ${a}`);
	}
	assert.equal(logaritmo('', '8').ok, false);
	assert.equal(logaritmo('2', '').ok, false);
	assert.match(logaritmo('2', 'x').error, /Qui non serve la x/);
	assert.match(logaritmo('2', '3 + 1').error, /senza somme/);
	assert.match(logaritmo('2', '10000000000000').error, /troppo grandi/);
});

test('the logarithm: brute force against floating point', () => {
	const r = rng(7);
	const bases = [2, 3, 5, 6, 10];
	for (let i = 0; i < 400; i++) {
		const c = bases[r(0, bases.length - 1)];
		const [rn, rd] = frac(r(1, 4) * (r(0, 1) ? 1 : -1), r(1, 3));
		const [sn, sd] = frac(r(-6, 6), r(1, 3));
		const b = `${c}^(${fracStr([rn, rd])})`;
		const a = `${c}^(${fracStr([sn, sd])})`;
		const v = logValue(b, a);
		const [en, ed] = frac(sn * rd, sd * rn);
		assert.equal(v.exact.toString(), fracStr([en, ed]), `log_${b} ${a}`);
		const o = logaritmo(b, a);
		assert.equal(o.copy, fracStr([en, ed]));
		assertReadable(o, `log_${b} ${a}`);
	}
	for (let i = 0; i < 200; i++) {
		const b = r(2, 50);
		const a = r(2, 500);
		const v = logValue(String(b), String(a));
		assert.ok(Math.abs(v.value - Math.log(a) / Math.log(b)) < 1e-9);
		if (v.exact) assert.ok(Math.abs((v.exact.num / v.exact.den) * Math.log(b) - Math.log(a)) < 1e-9, `${b} ${a}`);
		assertReadable(logaritmo(String(b), String(a)), `log_${b} ${a}`);
	}
});

test('exponential equations: same base', () => {
	const cases = [
		['4^(x - 1) = 8', '5/2'],
		['2^(x+1) = 8', '2'],
		['9^x = 27', '3/2'],
		['(1/2)^x = 8', '-3'],
		['8 = 2^x', '3'],
		['2^x = 1', '0'],
		['(√2)^x = 4', '4'],
		['3*2^x = 24', '3'],
		['3 · 2^(x-1) = 12', '3'],
		['2^(3x) = 4^(x+1)', '2'],
		['e^(2x) = e^(x+1)', '1'],
		['25^(x+1) = 1/5', '-3/2'],
		['0,5^x = 4', '-2'],
		['4^x = 8^(x - 1)', '3'],
		['2 * 4^x = 8^x', '1']
	];
	for (const [eq, x] of cases) {
		const o = equazioneEsponenziale(eq);
		assert.ok(o.ok, `${eq}: ${o.error}`);
		assert.equal(o.copy, `x = ${x}`, eq);
		assertReadable(o, eq);
	}
	const o = equazioneEsponenziale('4^(x - 1) = 8');
	assert.deepEqual(o.steps[0].math, ['4^{x - 1} = 8', '\\left(2^{2}\\right)^{x - 1} = 2^{3}', '2^{\\hl{2\\left(x - 1\\right)}} = 2^{3}']);
	assert.deepEqual(o.steps[1].math, ['2\\left(x - 1\\right) = 3']);
	assert.deepEqual(o.steps.at(-1).math, ['4^{\\frac{5}{2} - 1} = 4^{\\frac{3}{2}} = 8']);
	assert.equal(previewEsponenziale('2^(x+1) = 8'), '2^{x + 1} = 8');
	assert.equal(previewEsponenziale('2^(x+1'), null);
});

test('exponential equations: with the logarithm, impossible and indeterminate', () => {
	const near = (eq, v) => {
		const s = solveExponential(eq);
		assert.equal(s.kind, 'una', eq);
		assert.ok(Math.abs(s.approx - v) < 1e-4, `${eq}: ${s.approx} vs ${v}`);
		assertReadable(equazioneEsponenziale(eq), eq);
	};
	near('3^x = 5', Math.log(5) / Math.log(3));
	near('e^x = 5', Math.log(5));
	near('5 * 2^x = 3', Math.log(3 / 5) / Math.log(2));
	near('2^(2x - 1) = 3', (Math.log(3) / Math.log(2) + 1) / 2);
	near('2^x = 3^(x-1)', Math.log(3) / (Math.log(3) - Math.log(2)));
	near('5^(1 - x) = 2^(x + 2)', (Math.log(5) - 2 * Math.log(2)) / (Math.log(5) + Math.log(2)));
	assert.deepEqual(equazioneEsponenziale('3^x = 5').rows, [{ label: 'Soluzione', value: '$x = \\log_{3} 5$ $\\approx 1{,}4650$' }]);
	assert.match(equazioneEsponenziale('2^x = 3^(x-1)').rows[0].value, /\\dfrac\{\\ln 3\}\{\\ln 3 - \\ln 2\}/);
	assert.equal(equazioneEsponenziale('2^x = 3^x').copy, 'x = 0');
	for (const eq of ['2^x = -4', '3 * 2^x = 0', '1^x = 5', '2^x = 4^(x/2 + 1)']) {
		const o = equazioneEsponenziale(eq);
		assert.equal(solveExponential(eq).kind, 'impossibile', eq);
		assertReadable(o, eq);
	}
	for (const eq of ['1^x = 1', '2^x = 4^(x/2)']) {
		assert.equal(solveExponential(eq).kind, 'indeterminata', eq);
		assertReadable(equazioneEsponenziale(eq), eq);
	}
});

test('exponential equations: what the tool does not solve', () => {
	const err = (eq, re) => {
		const o = equazioneEsponenziale(eq);
		assert.equal(o.ok, false, eq);
		assert.match(o.error, re, `${eq}: ${o.error}`);
	};
	err('', /Scrivi/);
	err('2^x', /Manca il segno =/);
	err('2^x = 8 = 8', /più di un segno/);
	err('2^x+1 = 5', /tra parentesi/);
	err('2^x + 2^(x+1) = 12', /una sola potenza/);
	err('2^(x^2) = 16', /prima potenza/);
	err('2x = 8', /all'esponente/);
	err('8 = 8', /non c'è la x/);
	err('(-2)^x = 4', /positiva/);
	err('3 * 2^x = 5^x', /non è tra i casi/);
	err('√2^x = 4', /tra parentesi/);
	err('2^(x = 8', /parentesi/);
});

test('exponential equations: brute force with a common base', () => {
	const r = rng(11);
	for (let i = 0; i < 300; i++) {
		const c = [2, 3, 5][r(0, 2)];
		const k = r(1, 3) * (r(0, 1) ? 1 : -1);
		const p = r(1, 4) * (r(0, 1) ? 1 : -1);
		const q = r(-5, 5);
		const x0 = frac(r(-6, 6), r(1, 3));
		// Right side: c^(k(p x0 + q)), written as a power of c.
		const [en, ed] = frac(k * (p * x0[0] + q * x0[1]), x0[1]);
		// Powers that fit in safe integers, so the check by substitution can write them out.
		if (Math.abs(en / ed) * Math.log(c) > 25) continue;
		const base = k > 0 ? `${c ** k}` : `(1/${c ** -k})`;
		const eq = `${base}^(${p}x ${q < 0 ? '-' : '+'} ${Math.abs(q)}) = ${c}^(${fracStr([en, ed])})`;
		const o = equazioneEsponenziale(eq);
		assert.ok(o.ok, `${eq}: ${o.error}`);
		assert.equal(o.copy, `x = ${fracStr(x0)}`, eq);
		assertReadable(o, eq);
	}
});

test('logarithmic equations: the two forms, with the conditions of existence', () => {
	const cases = [
		['log_2(3x - 1) = log_2(x + 5)', '3'],
		['log_2(x + 1) = 3', '7'],
		['log_3(2x - 1) = 2', '5'],
		['log_(1/2)(x - 1) = -2', '5'],
		['log(x) = 2', '100'],
		['log_2 x = 5', '32'],
		['3 = log_2(x)', '8'],
		['log2(x-4) = 3', '12'],
		['log_2(1-x) = 3', '-7'],
		['log_2(x) = log_2 8', '8'],
		['log_5(x/2 + 1) = 0', '0'],
		['log_4(x) = 1/2', '2'],
		['log_9(3x) = -1/2', '1/9']
	];
	for (const [eq, x] of cases) {
		const o = equazioneLogaritmica(eq);
		assert.ok(o.ok, `${eq}: ${o.error}`);
		assert.equal(o.copy, `x = ${x}`, eq);
		assertReadable(o, eq);
	}
	const o = equazioneLogaritmica('log_2(3x - 1) = log_2(x + 5)');
	assert.deepEqual(o.rows, [
		{ label: 'Soluzione', value: '$x = 3$' },
		{ label: 'Condizioni di esistenza', value: '$x > \\frac{1}{3}$' }
	]);
	assert.deepEqual(o.steps[0].math, ['3x - 1 > 0 \\quad\\Rightarrow\\quad x > \\frac{1}{3}', 'x + 5 > 0 \\quad\\Rightarrow\\quad x > -5']);
	assert.deepEqual(o.steps.at(-1).math, ['3 \\cdot 3 - 1 = 8 > 0', '3 + 5 = 8 > 0']);
	assert.equal(previewLogaritmica('ln(x) = 2'), '\\ln x = 2');
	assert.equal(previewLogaritmica('log(x - 1) = 2'), '\\log \\left(x - 1\\right) = 2');
});

test('logarithmic equations: solutions that are not accepted, irrational solutions', () => {
	const rejected = equazioneLogaritmica('log(x - 3) = log(2x + 1)');
	assert.equal(rejected.copy, 'Impossibile: nessuna soluzione');
	assert.match(rejected.rows[0].value, /x = -4/);
	assert.match(rejected.steps.at(-1).then, /non è accettabile/);
	assertReadable(rejected, 'rejected');
	const empty = equazioneLogaritmica('log_2(5 - x) = log_2(x - 7)');
	assert.equal(empty.copy, 'Impossibile: nessuna soluzione');
	assertReadable(empty, 'empty');
	assert.equal(solveLogarithmic('log_2(x) = log_2(x+1)').kind, 'impossibile');
	assert.equal(solveLogarithmic('log_2(2x) = log_2(x+x)').kind, 'indeterminata');
	assertReadable(equazioneLogaritmica('log_2(2x) = log_2(x+x)'), 'indeterminate');
	const ln = equazioneLogaritmica('ln(x) = 2');
	assert.deepEqual(ln.rows[0], { label: 'Soluzione', value: '$x = e^{2}$ $\\approx 7{,}3891$' });
	assertReadable(ln, 'ln');
	const root = equazioneLogaritmica('log_2(2x + 1) = 1/2');
	assert.equal(root.rows[0].value, '$x = \\dfrac{\\sqrt{2} - 1}{2}$ $\\approx 0{,}2071$');
	assertReadable(root, 'root');
	assert.ok(Math.abs(solveLogarithmic('ln(3x - 1) = 1').approx - (Math.E + 1) / 3) < 1e-4);
});

test('logarithmic equations: what the tool does not solve', () => {
	const err = (eq, re) => {
		const o = equazioneLogaritmica(eq);
		assert.equal(o.ok, false, eq);
		assert.match(o.error, re, `${eq}: ${o.error}`);
	};
	err('log_2(x) + log_2(x-1) = 1', /un solo logaritmo/);
	err('2log_2(x) = 3', /un solo logaritmo/);
	err('log_2 x + 1 = 3', /tra parentesi/);
	err('log_2(x^2) = 3', /prima potenza/);
	err('log_2(x) = log_3(x)', /stessa base/);
	err('log_1(x) = 2', /diversa da 1/);
	err('log_(-2)(x) = 2', /positiva/);
	err('log_2(x) = √2', /un numero intero, decimale o una frazione/);
	err('log_2(8) = 3', /non c'è la x/);
	err('log_2(x) = log_2(-3)', /non esiste/);
	err('x = 3', /dentro il logaritmo/);
	err('log_2(x + 1 = 3', /parentesi/);
});

test('logarithmic equations: brute force', () => {
	const r = rng(5);
	for (let i = 0; i < 300; i++) {
		// log_a(px + q) = c with a^c a whole number or a fraction.
		const a = [2, 3, 5, 10][r(0, 3)];
		const c = r(-2, 3);
		const p = r(1, 5) * (r(0, 1) ? 1 : -1);
		const q = r(-9, 9);
		const eq = `log_${a}(${p}x ${q < 0 ? '-' : '+'} ${Math.abs(q)}) = ${c}`;
		const [tn, td] = c >= 0 ? [a ** c, 1] : [1, a ** -c];
		const x = frac(tn - q * td, p * td);
		const o = equazioneLogaritmica(eq);
		assert.equal(o.copy, `x = ${fracStr(x)}`, eq);
		assertReadable(o, eq);
	}
	for (let i = 0; i < 300; i++) {
		// log(p1 x + q1) = log(p2 x + q2): the solution is accepted exactly when both arguments are positive there.
		const p1 = r(1, 4) * (r(0, 1) ? 1 : -1);
		const p2 = r(1, 4) * (r(0, 1) ? 1 : -1);
		const q1 = r(-9, 9);
		const q2 = r(-9, 9);
		const eq = `log(${p1}x ${q1 < 0 ? '-' : '+'} ${Math.abs(q1)}) = log(${p2}x ${q2 < 0 ? '-' : '+'} ${Math.abs(q2)})`;
		const s = solveLogarithmic(eq);
		if (p1 === p2) {
			assert.equal(s.kind, q1 === q2 ? 'indeterminata' : 'impossibile', eq);
			continue;
		}
		const x = frac(q2 - q1, p1 - p2);
		const v = (p1 * x[0]) / x[1] + q1;
		if (v > 0) assert.equal(s.x.toString(), fracStr(x), eq);
		else assert.equal(s.kind, 'impossibile', eq);
		assertReadable(equazioneLogaritmica(eq), eq);
	}
});

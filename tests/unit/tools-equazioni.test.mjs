// The equation tools: the parser of typed equations, first-degree and second-degree equations with their steps.
// Run with `node --test tests/unit/tools-equazioni.test.mjs` (jiti loads the TypeScript sources).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import katex from 'katex';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { parseEquation, previewLatex, parseConstant, polyAt } = await jiti.import('../../src/lib/tools/equazione.ts');
const { equazionePrimoGrado, solveLinear } = await jiti.import('../../src/lib/tools/equazioni-primo-grado.ts');
const { equazioneSecondoGrado, quadraticRoots, quadraticDegree } = await jiti.import('../../src/lib/tools/equazioni-secondo-grado.ts');
const { Rational, q } = await jiti.import('../../src/lib/exercises/v2/rational.ts');

const polyStr = (p) => p.map((c) => c.toString()).join(' ');
/** Every string a student reads: the rows, the steps (sentence, lines, table cells, conclusion), or the error. */
const texts = (o) =>
	o.ok
		? [
				...o.rows.flatMap((r) => [r.label, r.value]),
				o.copy,
				...o.steps.flatMap((s) => [s.group, s.say, ...(s.math ?? []), ...(s.table?.head ?? []), ...(s.table?.rows.flat() ?? []), s.then].filter(Boolean))
			]
		: [o.error];
/** The steps as one string, to look for a calculation. */
const all = (o) => JSON.stringify(o.steps);
const rowsText = (o) => o.rows.map((r) => `${r.label}: ${r.value}`).join(' | ');

/** KaTeX as the tools set it (src/lib/tools/tex.ts), but failing loudly. */
const KATEX = { throwOnError: true, strict: 'ignore', macros: { '\\hl': '\\htmlClass{hl}{#1}' }, trust: (c) => c.command === '\\htmlClass' };
/** Every formula of an outcome typesets: each `math` line whole, and each `$…$` or `$$…$$` in the prose. */
function assertTypesets(o, label) {
	if (!o.ok) return;
	for (const line of o.steps.flatMap((s) => s.math ?? [])) assert.doesNotThrow(() => katex.renderToString(`{\\displaystyle ${line}}`, KATEX), `${label}: ${line}`);
	const prose = [...o.rows.flatMap((r) => [r.label, r.value]), ...o.steps.flatMap((s) => [s.say, ...(s.table?.head ?? []), ...(s.table?.rows.flat() ?? []), s.then].filter(Boolean))];
	for (const text of prose) {
		assert.equal(text.replace(/\$\$[\s\S]+?\$\$/g, '').split('$').length % 2, 1, `${label}: unbalanced $ in ${text}`);
		for (const m of text.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g)) assert.doesNotThrow(() => katex.renderToString(m[1] ?? m[2], { ...KATEX, displayMode: !!m[1] }), `${label}: ${m[0]}`);
	}
}
/** A step's sentence is short and holds no calculation: no display formula, at most one "=". */
function assertSays(o, label) {
	if (!o.ok) return;
	for (const s of o.steps) {
		assert.doesNotMatch(s.say, /\$\$/, `${label}: ${s.say}`);
		assert.ok((s.say.match(/=/g) ?? []).length <= 1, `${label}: ${s.say}`);
		assert.ok(s.say.replace(/\$[^$]*\$/g, 'N').split(/\s+/).length <= 15, `${label}: too long: ${s.say}`);
	}
}

/** Deterministic random numbers, so a failure can be reproduced. */
function rng(seed) {
	let s = seed >>> 0;
	return (a, b) => {
		s = (s * 1664525 + 1013904223) >>> 0;
		return a + (s % (b - a + 1));
	};
}
const nonZero = (r, a, b) => {
	for (;;) {
		const v = r(a, b);
		if (v !== 0) return v;
	}
};
const signed = (n) => (n < 0 ? `- ${-n}` : `+ ${n}`);

test('the parser reads equations as students type them', () => {
	const sides = (s) => {
		const r = parseEquation(s);
		assert.ok(r.ok, `${s}: ${r.error}`);
		return [polyStr(r.eq.L), polyStr(r.eq.R)];
	};
	assert.deepEqual(sides('3(x - 2) + 5 = 2x - 1'), ['-1 3', '-1 2']);
	assert.deepEqual(sides('x/2 + 1/3 = x - 1'), ['1/3 1/2', '-1 1']);
	assert.deepEqual(sides('0,5x + 1.5 = 2'), ['3/2 1/2', '2']);
	assert.deepEqual(sides('2x(x+1) = (x - 1)(x + 1)'), ['0 2 2', '-1 0 1']);
	assert.deepEqual(sides('(x+1)^2 = x²'), ['1 2 1', '0 0 1']);
	assert.deepEqual(sides('-[2 - (x + 1)] = 3 · x'), ['-1 1', '0 3']);
	assert.deepEqual(sides('{x : 2} = −x'), ['0 1/2', '0 -1']);
	assert.deepEqual(sides('1/2x = 3'), ['0 1/2', '3']);
	assert.deepEqual(sides('2x/3 = -(-x)'), ['0 2/3', '0 1']);
	assert.deepEqual(sides('3X = 6'), ['0 3', '6']);
	assert.equal(parseEquation('3(x - 2) = 1').eq.degree, 1);
	assert.equal(parseEquation('x(x - 2) = x^2').eq.degree, 1);
	assert.equal(parseEquation('x^3 = 1').eq.degree, 3);
	assert.equal(parseEquation('x = x').eq.degree, -1);
});

test('the parser says what is wrong, kindly', () => {
	const err = (s) => {
		const r = parseEquation(s);
		assert.equal(r.ok, false, s);
		return r.error;
	};
	assert.match(err(''), /Scrivi un'equazione in x/);
	assert.match(err('2x + 3'), /Manca il segno =/);
	assert.match(err('x = 2 = 3'), /più di un segno =/);
	assert.match(err('2x + 3 ='), /prima e dopo/);
	assert.match(err('2(x + 1 = 3'), /parentesi/);
	assert.match(err('2x) = 3'), /parentesi/);
	assert.match(err('2y = 3'), /lettera y/);
	assert.match(err('2x + $ = 3'), /simbolo \$/);
	assert.match(err('1/x = 2'), /fratta/);
	assert.match(err('x/(x - 1) = 2'), /fratta/);
	assert.match(err('x/0 = 2'), /divisione per zero/);
	assert.match(err('2 = 3'), /non c'è la x/);
	assert.match(err('2 3x = 1'), /Tra due numeri/);
	assert.match(err('x^20 = 1'), /troppo alto/);
	assert.match(err('x + * 2 = 1'), /segni/);
	assert.equal(err('x'.repeat(201) + '=1').includes('troppo lunga'), true);
});

test('the preview shows the equation as typed', () => {
	assert.equal(previewLatex('3(x - 2) + 5 = 2x - 1'), '3\\left( x - 2 \\right) + 5 = 2x - 1');
	assert.equal(previewLatex('x/2 + 1/3 = x - 1'), '\\dfrac{x}{2} + \\dfrac{1}{3} = x - 1');
	assert.equal(previewLatex('(x+1)/3 = 0,5x'), '\\dfrac{x + 1}{3} = 0{,}5x');
	assert.equal(previewLatex('2·3x = x^2'), '2 \\cdot 3x = x^{2}');
	assert.equal(previewLatex('1/x = 2'), '\\dfrac{1}{x} = 2');
	assert.equal(previewLatex('2x + '), null);
});

test('constants in the coefficient fields', () => {
	assert.equal(parseConstant('-1,5').toString(), '-3/2');
	assert.equal(parseConstant('2/3').toString(), '2/3');
	assert.equal(parseConstant(' -(1/4) ').toString(), '-1/4');
	assert.equal(parseConstant(''), null);
	assert.equal(parseConstant('2x'), 'error');
	assert.equal(parseConstant('abc'), 'error');
	assert.equal(parseConstant('1/0'), 'error');
});

test('first degree: determined equations with brackets, fractions, decimals', () => {
	const cases = [
		['3(x - 2) + 5 = 2x - 1', 'x = 0'],
		['2x + 3 = 7', 'x = 2'],
		['x/2 + 1/3 = x - 1', 'x = 8/3'],
		['(x+1)/3 - x/2 = 1', 'x = -4'],
		['0,5x + 1,2 = 3', 'x = 18/5'],
		['-2[x - (3 - x)] = 4', 'x = 1/2'],
		['5 = x', 'x = 5'],
		['x = 5', 'x = 5'],
		['x(x + 1) = x^2 + 3', 'x = 3'],
		['(x + 2)^2 = (x - 1)^2', 'x = -1/2'],
		['2(3 - x) = 4 - (x + 1)', 'x = 3'],
		['x/3 - (x - 1)/4 = 1', 'x = 9'],
		['1,25x = 0,5', 'x = 2/5'],
		['-x = 7', 'x = -7'],
		['7x = 0', 'x = 0']
	];
	for (const [eq, copy] of cases) {
		const o = equazionePrimoGrado(eq);
		assert.ok(o.ok, `${eq}: ${o.error}`);
		assert.equal(o.copy, copy, eq);
		assert.match(o.steps.at(-1).say, /^Controlla/);
		assert.equal(o.rows[0].label, 'Soluzione');
	}
	const brackets = equazionePrimoGrado('3(x - 2) + 5 = 2x - 1');
	assert.deepEqual(brackets.steps[0], { say: 'Togli le parentesi.', math: ['3\\left( x - 2 \\right) + 5 = 2x - 1', '\\hl{3x - 6} + 5 = 2x - 1'] });
	// The moved terms are highlighted, with their new sign.
	assert.deepEqual(brackets.steps[1].math, ['3x \\hl{{} - 2x} = -1 \\hl{{} + 6 - 5}']);
	assert.match(brackets.steps[1].then, /cambia segno/);
	assert.deepEqual(brackets.steps.at(-1).math, ['3\\left( 0 - 2 \\right) + 5 = -1', '2 \\cdot 0 - 1 = -1']);

	const mcm = equazionePrimoGrado('x/2 + 1/3 = x - 1');
	assert.deepEqual(mcm.steps[0].math, ['\\text{mcm}(2,\\ 3) = \\hl{6}']);
	assert.equal(mcm.steps[1].say, 'Moltiplica tutti i termini per $6$.');
	assert.deepEqual(mcm.steps[1].math, ['\\hl{6} \\cdot \\dfrac{x}{2} + \\hl{6} \\cdot \\dfrac{1}{3} = \\hl{6} \\cdot x - \\hl{6} \\cdot 1', '3x + 2 = 6x - 6']);
	const divide = mcm.steps.find((s) => s.say.startsWith('Dividi'));
	assert.equal(divide.say, 'Dividi entrambi i membri per $-3$.');
	assert.deepEqual(divide.math, ['\\dfrac{-3x}{\\hl{-3}} = \\dfrac{-8}{\\hl{-3}}', 'x = \\dfrac{-8}{-3}', 'x = \\hl{\\frac{8}{3}}']);
	assert.match(divide.then, /meno diviso meno dà più/);
	assert.match(equazionePrimoGrado('-x = 7').steps.at(-2).then, /più diviso meno dà meno/);
	assert.deepEqual(mcm.rows, [{ label: 'Soluzione', value: '$x = \\frac{8}{3}$ $\\approx 2{,}6667$' }]);
	// Six steps: grouped.
	assert.deepEqual(
		mcm.steps.map((s) => s.group ?? null),
		['I denominatori', null, "L'incognita da una parte", null, null, 'Il controllo']
	);

	const dec = equazionePrimoGrado('0,5x + 1,2 = 3');
	assert.equal(dec.steps[0].say, 'Scrivi i numeri decimali come frazioni.');
	assert.deepEqual(dec.rows, [{ label: 'Soluzione', value: '$x = \\frac{18}{5}$ $= 3{,}6$' }]);
	// A numerator in brackets: simplified first, then the brackets go.
	const frac = equazionePrimoGrado('(x+1)/3 - x/2 = 1');
	assert.deepEqual(frac.steps[1].math, ['\\hl{6} \\cdot \\dfrac{x + 1}{3} - \\hl{6} \\cdot \\dfrac{x}{2} = \\hl{6} \\cdot 1', '2\\left(x + 1\\right) - 3x = 6', '2x + 2 - 3x = 6']);
	// A side that is already a number needs no line in the check.
	assert.deepEqual(frac.steps.at(-1).math, ['\\dfrac{\\left(-4\\right) + 1}{3} - \\dfrac{\\left(-4\\right)}{2} = 1']);
	// Nothing to do but the check.
	const done = equazionePrimoGrado('x = 5');
	assert.equal(done.steps.length, 1);
	assert.deepEqual(done.steps[0].math, ['5 = 5']);
	// Few steps: no groups.
	assert.ok(equazionePrimoGrado('2x + 3 = 7').steps.every((s) => !s.group));
});

test('first degree: impossible and indeterminate', () => {
	for (const eq of ['2(x + 1) = 2x + 5', 'x = x + 1', '3x - (x - 1) = 2x', '0x = 4', 'x/2 = 0,5x + 1']) {
		const o = equazionePrimoGrado(eq);
		assert.ok(o.ok, eq);
		assert.equal(o.copy, 'Impossibile: nessuna soluzione', eq);
		assert.match(rowsText(o), /impossibile.*\\emptyset/);
		assert.match(all(o), /0x\}? = /);
		assert.match(o.steps.at(-1).then, /impossibile/);
		assert.deepEqual(solveLinear(eq), { case: 'impossibile' });
	}
	for (const eq of ['2(x + 1) = 2x + 2', 'x = x', '0x = 0', 'x/2 + x/2 = x', '3(x - 1) - x = 2x - 3']) {
		const o = equazionePrimoGrado(eq);
		assert.ok(o.ok, eq);
		assert.equal(o.copy, 'Indeterminata: ogni numero reale è soluzione', eq);
		assert.match(rowsText(o), /indeterminata.*\\mathbb\{R\}/);
		assert.match(o.steps.at(-1).then, /indeterminata/);
		assert.deepEqual(solveLinear(eq), { case: 'indeterminata' });
	}
});

test('first degree: other degrees and bad input', () => {
	assert.match(equazionePrimoGrado('x^2 = 4').error, /secondo grado/);
	assert.match(equazionePrimoGrado('x(x - 1) = 0').error, /secondo grado/);
	assert.match(equazionePrimoGrado('x^3 = x').error, /grado 3/);
	assert.deepEqual(solveLinear('x^2 = 4'), { degree: 2 });
	assert.equal(equazionePrimoGrado('2x +').ok, false);
	assert.equal(equazionePrimoGrado('').ok, false);
	assert.match(equazionePrimoGrado('99999999999x = 99999999999999 + 999999999999999x^2 · 99999').error, /troppo grandi|grado/);
});

test('first degree: random equations, checked by substitution and by hand', () => {
	const r = rng(12345);
	for (let i = 0; i < 400; i++) {
		// k(ax + b)/d + c = ex + f/g, solved independently: (ka/d - e) x = f/g - c - kb/d.
		const k = nonZero(r, -6, 6), a = nonZero(r, -5, 5), b = r(-9, 9), d = r(1, 6), c = r(-9, 9), e = r(-6, 6), f = r(-9, 9), g = r(1, 5);
		const left = `${k}(${a}x ${signed(b)})${d > 1 ? `/${d}` : ''} ${signed(c)}`;
		const right = `${e}x ${signed(f)}${g > 1 ? `/${g}` : ''}`;
		const eq = `${left} = ${right}`;
		const A = q(k * a, d).sub(q(e));
		const B = q(f, g).sub(q(c)).sub(q(k * b, d));
		const o = equazionePrimoGrado(eq);
		assert.ok(o.ok, `${eq}: ${o.error}`);
		if (A.isZero()) {
			assert.equal(o.copy.split(':')[0], B.isZero() ? 'Indeterminata' : 'Impossibile', eq);
			continue;
		}
		const x = B.div(A);
		assert.equal(o.copy, `x = ${x}`, eq);
		const { L, R } = parseEquation(eq).eq;
		assert.ok(polyAt(L, x).equals(polyAt(R, x)), `${eq} at ${x}`);
		// Decimal coefficients too: 0,5 is 1/2.
		const dec = `${a},5x ${signed(b)} = ${c}`;
		const xd = q(c - b).div(q(2 * a + Math.sign(a), 2));
		assert.equal(equazionePrimoGrado(dec).copy, `x = ${xd}`, dec);
	}
});

test('second degree: coefficients', () => {
	const solve = (a, b, c) => equazioneSecondoGrado({ mode: 'coef', a, b, c });
	assert.equal(solve('1', '-5', '6').copy, 'x1 = 2; x2 = 3');
	assert.equal(solve('1', '-3', '1').copy, 'x1 = (3-√5)/2; x2 = (3+√5)/2');
	assert.deepEqual(solve('1', '-3', '1').rows, [
		{ label: 'Prima soluzione', value: '$x_1 = \\frac{3 - \\sqrt{5}}{2}$ $\\approx 0{,}382$' },
		{ label: 'Seconda soluzione', value: '$x_2 = \\frac{3 + \\sqrt{5}}{2}$ $\\approx 2{,}618$' }
	]);
	assert.deepEqual(solve('4', '-4', '1').rows, [{ label: 'Due soluzioni coincidenti', value: '$x_1 = x_2 = \\frac{1}{2}$ $= 0{,}5$' }]);
	assert.equal(solve('1', '2', '5').rows[0].value, 'Nessuna soluzione reale');
	assert.equal(solve('1', '-2', '-1').copy, 'x1 = 1-√2; x2 = 1+√2');
	assert.equal(solve('4', '-4', '1').copy, 'x1 = x2 = 1/2');
	assert.equal(solve('1', '2', '5').copy, 'Nessuna soluzione reale');
	assert.equal(solve('2', '0', '-8').copy, 'x1 = -2; x2 = 2');
	assert.equal(solve('1', '0', '4').copy, 'Nessuna soluzione reale');
	assert.equal(solve('3', '', '-5').copy, 'x1 = -√15/3; x2 = √15/3');
	assert.equal(solve('1/2', '1,5', '').copy, 'x1 = -3; x2 = 0');
	assert.equal(solve('5', '0', '0').copy, 'x1 = x2 = 0');
	assert.equal(solve('-1', '1', '6').copy, 'x1 = -2; x2 = 3');
	assert.equal(solve('6', '-5', '1').copy, 'x1 = 1/3; x2 = 1/2');
	assert.equal(solve('2', '-4', '-3').copy, 'x1 = (2-√10)/2; x2 = (2+√10)/2');
	assert.equal(solve('0,5', '-1', '-1').copy, 'x1 = 1-√3; x2 = 1+√3');

	// The discriminant line by line, then the radical simplified and the 2 collected.
	const surd = solve('2', '-4', '-3').steps;
	const delta = surd.find((s) => s.say === 'Calcola il discriminante.');
	assert.deepEqual(delta.math, ['\\Delta = b^2 - 4ac', '= (-4)^2 - 4 \\cdot 2 \\cdot (-3)', '= 16 + 24', '= \\hl{40}']);
	assert.match(delta.then, /positivo/);
	assert.deepEqual(surd.find((s) => s.say === 'Individua i coefficienti.').table, { head: ['$a$', '$b$', '$c$'], rows: [['$2$', '$-4$', '$-3$']] });
	assert.deepEqual(surd.find((s) => s.say.startsWith('Sostituisci')).math, ['x_{1,2} = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}', '= \\frac{-(-4) \\pm \\sqrt{40}}{2 \\cdot 2}', '= \\frac{4 \\pm \\sqrt{40}}{4}']);
	assert.deepEqual(surd.find((s) => s.say === 'Semplifica la radice.').math, ['\\sqrt{40} = \\sqrt{4 \\cdot 10}', '= \\hl{2\\sqrt{10}}']);
	assert.deepEqual(surd.find((s) => s.say.startsWith('Raccogli')).math, ['x_{1,2} = \\frac{\\hl{2}\\left(2 \\pm \\sqrt{10}\\right)}{\\hl{2} \\cdot 2}', '= \\frac{2 \\pm \\sqrt{10}}{2}']);
	assert.deepEqual(surd.at(-1).math, ['x_1 = \\frac{2 - \\sqrt{10}}{2}', 'x_2 = \\frac{2 + \\sqrt{10}}{2}']);
	assert.deepEqual(
		surd.map((s) => s.group ?? null),
		['La forma normale', 'Il discriminante', null, 'Le soluzioni', null, null, null, null]
	);
	assert.match(all(solve('1', '-2', '-1')), /Dividi|Raccogli \$2\$/);
	// A perfect square: each solution on its own.
	const whole = solve('1', '-5', '6').steps;
	assert.deepEqual(whole.at(-2).math, ['x_1 = \\frac{5 - 1}{2}', '= \\frac{4}{2}', '= \\hl{2}']);
	assert.deepEqual(whole.at(-1).math, ['x_2 = \\frac{5 + 1}{2}', '= \\frac{6}{2}', '= \\hl{3}']);
	// Incomplete equations the quick way.
	assert.match(all(solve('2', '0', '-8')), /equazione pura/);
	assert.deepEqual(solve('2', '0', '-8').steps.at(-1).math, ['x = \\pm \\sqrt{4}', '= \\pm \\hl{2}']);
	assert.deepEqual(solve('3', '', '-5').steps.at(-1).math, ['x = \\pm \\sqrt{\\frac{5}{3}}', '= \\pm \\frac{\\sqrt{5}}{\\sqrt{3}}', '= \\pm \\frac{\\sqrt{5} \\cdot \\sqrt{3}}{3}', '= \\pm \\hl{\\frac{\\sqrt{15}}{3}}']);
	assert.deepEqual(solve('1', '0', '12').steps.at(-1).then, "Un quadrato non è mai negativo: l'equazione non ha soluzioni reali.");
	assert.deepEqual(solve('1', '0', '-12').steps.at(-1).math, ['x = \\pm \\sqrt{12}', '= \\pm \\sqrt{4 \\cdot 3}', '= \\pm \\hl{2\\sqrt{3}}']);
	assert.match(all(solve('1/2', '1,5', '')), /equazione spuria.*Raccogli/);
	assert.match(all(solve('1/2', '1,5', '')), /il mcm dei denominatori/);
	assert.match(all(solve('-1', '1', '6')), /per \$-1\$/);
	assert.match(all(solve('1', '2', '5')), /negativo/);
	assert.match(all(solve('4', '-4', '1')), /zero: le due soluzioni coincidono/);
	assert.deepEqual(solve('4', '-4', '1').steps.at(-1).math, ['x_1 = x_2 = \\frac{-b}{2a}', '= \\frac{-(-4)}{2 \\cdot 4}', '= \\frac{4}{8}', '= \\hl{\\frac{1}{2}}']);

	assert.match(solve('0', '2', '1').error, /primo grado/);
	assert.match(solve('', '2', '1').error, /coefficiente a.*per esempio/i);
	assert.match(solve('1', 'x', '1').error, /numeri/);
	assert.equal(quadraticDegree({ mode: 'coef', a: '0' }), 1);
	assert.equal(quadraticDegree({ mode: 'coef', a: '2' }), 2);
});

test('second degree: typed equations', () => {
	const solve = (eq) => equazioneSecondoGrado({ mode: 'eq', eq });
	assert.equal(solve('x^2 - 5x + 6 = 0').copy, 'x1 = 2; x2 = 3');
	assert.equal(solve('(x - 1)^2 = 3 - x').copy, 'x1 = -1; x2 = 2');
	assert.equal(solve('x(x + 2) = 3').copy, 'x1 = -3; x2 = 1');
	assert.equal(solve('3x^2 = 5').copy, 'x1 = -√15/3; x2 = √15/3');
	assert.equal(solve('x² = 2x').copy, 'x1 = 0; x2 = 2');
	assert.equal(solve('x^2/2 - x = 1/2').copy, 'x1 = 1-√2; x2 = 1+√2');
	assert.equal(solve('(2x - 1)(x + 3) = 0').copy, 'x1 = -3; x2 = 1/2');
	const steps = solve('(x - 1)^2 = 3 - x').steps;
	assert.deepEqual(steps[0], { group: 'La forma normale', say: 'Togli le parentesi.', math: ['\\left( x - 1 \\right)^{2} = 3 - x', '\\hl{x^2 - 2x + 1} = 3 - x'] });
	assert.deepEqual(steps[1].math, ['x^2 - 2x + 1 \\hl{{} - 3 + x} = 0']);
	assert.deepEqual(steps[2].math, ['x^2 \\hl{{} - x - 2} = 0']);
	assert.match(steps[2].then, /forma normale/);
	// Already in normal form: straight to the coefficients.
	assert.equal(solve('x^2 - 5x + 6 = 0').steps[0].say, 'Individua i coefficienti.');

	assert.match(solve('2x + 1 = 0').error, /primo grado/);
	assert.match(solve('x(x + 1) = x^2 + 3').error, /primo grado/);
	assert.match(solve('x^3 = 1').error, /grado 3/);
	assert.match(solve('').error, /x\^2 - 5x \+ 6 = 0/);
	assert.equal(quadraticDegree({ mode: 'eq', eq: '2x = 1' }), 1);
});

test('second degree: random equations, checked by substitution', () => {
	const r = rng(777);
	for (let i = 0; i < 600; i++) {
		const a = q(nonZero(r, -9, 9), r(1, 4));
		const b = q(r(-12, 12), r(1, 3));
		const c = q(r(-15, 15), r(1, 3));
		const o = equazioneSecondoGrado({ mode: 'coef', a: a.toString(), b: b.toString(), c: c.toString() });
		assert.ok(o.ok, `${a} ${b} ${c}: ${o.error}`);
		const roots = quadraticRoots([c, b, a]);
		const delta = b.mul(b).sub(q(4).mul(a).mul(c));
		assert.equal(roots.length, delta.sign() + 1, `${a} ${b} ${c}`);
		for (const x of roots) {
			if (x.isRational()) {
				const v = x.toRational();
				assert.ok(a.mul(v).mul(v).add(b.mul(v)).add(c).isZero(), `${a} ${b} ${c} at ${v}`);
			} else {
				const v = x.value();
				const f = (t) => t.num / t.den;
				assert.ok(Math.abs(f(a) * v * v + f(b) * v + f(c)) < 1e-9 * (1 + Math.abs(f(a)) + Math.abs(f(b)) + Math.abs(f(c))), `${a} ${b} ${c} at ${x}`);
			}
		}
		if (roots.length === 2) assert.ok(roots[0].value() < roots[1].value());
		if (roots.length) assert.ok(o.rows[0].value.includes(roots[0].toLatex()));
		if (i % 20 === 0) {
			assertTypesets(o, `${a} ${b} ${c}`);
			assertSays(o, `${a} ${b} ${c}`);
		}
	}
	// Typed as a product: the roots are known.
	for (let i = 0; i < 300; i++) {
		const p = nonZero(r, -5, 5), s = r(-9, 9), u = nonZero(r, -5, 5), t = r(-9, 9);
		const eq = `(${p}x ${signed(s)})(${u}x ${signed(t)}) = 0`;
		const o = equazioneSecondoGrado({ mode: 'eq', eq });
		assert.ok(o.ok, `${eq}: ${o.error}`);
		const expected = [q(-s, p), q(-t, u)].sort((x, y) => x.compare(y));
		const copy = expected[0].equals(expected[1]) ? `x1 = x2 = ${expected[0]}` : `x1 = ${expected[0]}; x2 = ${expected[1]}`;
		assert.equal(o.copy, copy, eq);
	}
});

test('the texts follow the writing rules', () => {
	const outs = [
		...['3(x - 2) + 5 = 2x - 1', 'x/2 + 1/3 = x - 1', '2(x + 1) = 2x + 5', '2(x + 1) = 2x + 2', 'x^2 = 1', ''].map(equazionePrimoGrado),
		...[
			['1', '-3', '1'],
			['2', '0', '-8'],
			['1', '3', '0'],
			['1', '2', '5'],
			['0', '1', '1']
		].map(([a, b, c]) => equazioneSecondoGrado({ mode: 'coef', a, b, c })),
		equazioneSecondoGrado({ mode: 'eq', eq: '(x - 1)^2 = 3 - x' })
	];
	for (const t of outs.flatMap(texts)) {
		assert.doesNotMatch(t, /—|piuttosto che/, t);
		// Balanced dollars: every formula is closed.
		assert.equal((t.match(/\$/g) ?? []).length % 2, 0, t);
	}
	// Errors say what to write, with an example.
	for (const o of outs.filter((o) => !o.ok)) assert.match(o.error, /per esempio|Risolvila/i, o.error);
	assert.ok(Rational);
});

test('every formula typesets in KaTeX, and every sentence is short', () => {
	const first = ['3(x - 2) + 1 = x/2 + 4', '2x + 3 = 7', 'x/2 + 1/3 = x - 1', '(x+1)/3 - x/2 = 1', '2(x + 1) = 2x + 5', '2(x + 1) = 2x + 2', '0,5x - 1 = 3(x - 2)', '-[2 - (x + 1)] = 3 · x', '{x : 2} = −x', 'x(x + 1) = x^2 + 3', '(x + 2)^2 = (x - 1)^2', 'x/3 - (x - 1)/4 = 1', '1,25x = 0,5', '-x = 7', '5 = x', '2x/3 = -(-x)', 'x = 5'];
	const second = [
		...[
			['2', '-4', '-3'],
			['1', '-5', '6'],
			['1', '-3', '1'],
			['4', '-4', '1'],
			['1', '2', '5'],
			['2', '0', '-8'],
			['3', '', '-5'],
			['1', '0', '-12'],
			['5', '0', '-12'],
			['1', '0', '4'],
			['1/2', '1,5', ''],
			['5', '0', '0'],
			['-1', '1', '6'],
			['0,5', '-1', '-1'],
			['-3', '7', '0']
		].map(([a, b, c]) => ({ mode: 'coef', a, b, c })),
		...['x^2 - 5x + 6 = 0', '3x^2 = 5', 'x(x + 2) = 3', '(x - 1)^2 = 3 - x', 'x^2/2 - x = 1/2', '(2x - 1)(x + 3) = 0', 'x² = 2x', '0,5x^2 = 2'].map((eq) => ({ mode: 'eq', eq }))
	];
	const outs = [...first.map((eq) => [eq, equazionePrimoGrado(eq)]), ...second.map((i) => [JSON.stringify(i), equazioneSecondoGrado(i)])];
	for (const [label, o] of outs) {
		assert.ok(o.ok, `${label}: ${o.error}`);
		assertTypesets(o, label);
		assertSays(o, label);
	}
	// The random first-degree equations too.
	const r = rng(99);
	for (let i = 0; i < 60; i++) {
		const eq = `${nonZero(r, -6, 6)}(${nonZero(r, -5, 5)}x ${signed(r(-9, 9))})/${r(1, 6)} ${signed(r(-9, 9))} = ${r(-6, 6)}x ${signed(r(-9, 9))}/${r(1, 5)}`;
		const o = equazionePrimoGrado(eq);
		assertTypesets(o, eq);
		assertSays(o, eq);
	}
});

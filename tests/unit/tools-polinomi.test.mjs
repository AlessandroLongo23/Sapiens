// The polynomial tools: special products, division in column, Ruffini's rule, factoring.
// Run with `node --test tests/unit/tools-polinomi.test.mjs` (jiti loads the TypeScript sources).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { parsePolynomial, divisionePolinomi, regolaRuffini, longDivision, polyAt, polyMul, polyAdd, polyText } = await jiti.import('../../src/lib/tools/polinomi.ts');
const { prodottiNotevoli } = await jiti.import('../../src/lib/tools/prodotti-notevoli.ts');
const { scomposizionePolinomi } = await jiti.import('../../src/lib/tools/scomposizione-polinomi.ts');
const { q } = await jiti.import('../../src/lib/exercises/v2/rational.ts');

/** A polynomial typed as text, as exact coefficients from the constant up: "1 0 -4". */
const coeffs = (s) => {
	const r = parsePolynomial(s);
	assert.ok(r.ok, `${s}: ${r.error}`);
	return r.p.map(String).join(' ');
};
/** Every string a student reads. */
const texts = (o) =>
	o.ok ? [...o.rows.flatMap((r) => [r.label, r.value]), o.copy, ...o.steps.flatMap((s) => [s.group, s.say, ...(s.math ?? []), ...(s.table?.head ?? []), ...(s.table?.rows.flat() ?? []), s.then].filter(Boolean))] : [o.error];
const clean = (o, name) => {
	assertReadable(o, name);
	for (const t of texts(o)) {
		assert.ok(!t.includes('—'), `${name}: em dash in ${t}`);
		assert.ok(!/piuttosto che/.test(t), `${name}: "piuttosto che" in ${t}`);
		assert.ok(!/equazion/i.test(t), `${name}: "equazione" in ${t}`);
	}
};
const rnd = (seed) => () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const term = (c, k) => (k === 0 ? `${c}` : `${c}x^${k}`);

test('reading polynomials', () => {
	assert.equal(coeffs('x^2 - 5x + 6'), '6 -5 1');
	assert.equal(coeffs('(x - 1)(x + 1)'), '-1 0 1');
	assert.equal(coeffs('1/2 x^2 - 2'), '-2 0 1/2');
	assert.equal(coeffs('0,5x + 1'), '1 1/2');
	assert.equal(coeffs('3'), '3');
	const bad = (s, re) => {
		const r = parsePolynomial(s);
		assert.equal(r.ok, false, s);
		assert.match(r.error, re, s);
		assert.ok(!/equazion|=/.test(r.error.replace(/senza il segno =/, '')), `${s}: ${r.error}`);
	};
	bad('', /Scrivi un polinomio/);
	bad('x^2 + 2y', /lettera y/);
	bad('x^2 +', /incompleto/);
	bad('(x + 1', /parentesi/);
	bad('1/x', /denominatore/);
	bad('x = 2', /senza il segno =/);
	bad('x^2 + 1/0', /divisione per zero/);
	bad('x'.repeat(200), /troppo lungo/);
});

test('special products', () => {
	const cases = {
		'(2x - 3)^2': ['4x^2 - 12x + 9', 'Quadrato di un binomio'],
		'(x + 5)(x - 5)': ['x^2 - 25', 'Somma per differenza'],
		'(5 + x)(x - 5)': ['x^2 - 25', 'Somma per differenza'],
		'(x - 2)^3': ['x^3 - 6x^2 + 12x - 8', 'Cubo di un binomio'],
		'(2x + 1)^3': ['8x^3 + 12x^2 + 6x + 1', 'Cubo di un binomio'],
		'(x^2 + x - 1)^2': ['x^4 + 2x^3 - x^2 - 2x + 1', 'Quadrato di un trinomio'],
		'(1/2 x + 4)^2': ['(1/4)x^2 + 4x + 16', 'Quadrato di un binomio'],
		'(-x - 3)^2': ['x^2 + 6x + 9', 'Quadrato di un binomio'],
		'(x + 1)(x + 1)': ['x^2 + 2x + 1', 'Quadrato di un binomio'],
		'(3x^2 - 2x)(3x^2 + 2x)': ['9x^4 - 4x^2', 'Somma per differenza']
	};
	for (const [input, [copy, kind]] of Object.entries(cases)) {
		const o = prodottiNotevoli(input);
		assert.ok(o.ok, `${input}: ${o.error}`);
		assert.equal(o.copy, copy, input);
		assert.match(o.rows[1].value, new RegExp(kind), input);
		clean(o, input);
	}
	// (a - b): b without its sign, and the minus in the rule.
	const sq = prodottiNotevoli('(2x - 3)^2');
	assert.match(JSON.stringify(sq.steps), /\(a - b\)\^2 = a\^2 - 2ab \+ b\^2/);
	assert.match(JSON.stringify(sq.steps), /Doppio prodotto.*-2 \\\\cdot 2x \\\\cdot 3/);
	for (const input of ['(x + 1)(x + 2)', '2x + 1', '(x + 1)^4', '(x + 1)', '(x^2 + 1 + x + 2)^2', '((x + 1)(x - 1) + 2)^2', 'x^2 + 2y', '(x + 1)(x - 1)(x + 2)']) {
		const o = prodottiNotevoli(input);
		assert.equal(o.ok, false, input);
		clean(o, input);
	}
	// Brute force: every square, cube and sum-by-difference of two small monomials against multiplying out.
	const r = rnd(7);
	for (let i = 0; i < 300; i++) {
		const A = term(int(r, 1, 5), int(r, 0, 3));
		const b = int(r, -6, 6) || 1;
		const B = term(Math.abs(b), int(r, 0, 3));
		const s = b < 0 ? '-' : '+';
		for (const input of [`(${A} ${s} ${B})^2`, `(${A} ${s} ${B})^3`, `(${A} + ${B})(${A} - ${B})`]) {
			const o = prodottiNotevoli(input);
			const expanded = input.replace(/\^2$/, '').replace(/\^3$/, '');
			const times = input.endsWith('^2') ? 2 : input.endsWith('^3') ? 3 : 1;
			const expected = times === 1 ? coeffs(input) : coeffs(Array(times).fill(expanded).join(''));
			if (!o.ok) {
				// Like terms in the bracket, (x + 2x)^2: still a binomial, so it must work.
				assert.fail(`${input}: ${o.error}`);
			}
			assert.equal(coeffs(o.copy), expected, input);
			if (i < 30) clean(o, input);
		}
	}
});

test('division in column', () => {
	const o = divisionePolinomi('6x^3 - 5x^2 + 4', '2x - 3');
	assert.equal(o.copy, 'Q(x) = 3x^2 + 2x + 3; R(x) = 13');
	clean(o, 'division');
	assert.match(JSON.stringify(o.steps), /mancano delle potenze/);
	const small = divisionePolinomi('x^2 + 1', 'x^3');
	assert.equal(small.copy, 'Q(x) = 0; R(x) = x^2 + 1');
	clean(small, 'small');
	const ex = divisionePolinomi('x^4 - 3x^2 + 2x - 5', 'x^2 + x - 1');
	assert.equal(ex.copy, 'Q(x) = x^2 - x - 1; R(x) = 2x - 6');
	clean(ex, 'default');
	assert.equal(divisionePolinomi('x^3 - 1', '2x').copy, 'Q(x) = (1/2)x^2; R(x) = -1');
	for (const [a, b] of [
		['x^2', '0'],
		['x^2', '3'],
		['0', 'x - 1'],
		['x^2 +', 'x'],
		['x^2', 'y']
	]) {
		const bad = divisionePolinomi(a, b);
		assert.equal(bad.ok, false, `${a} : ${b}`);
		clean(bad, `${a} : ${b}`);
	}
	// Brute force: A = B · Q + R with deg R < deg B, checked at several points.
	const r = rnd(11);
	for (let i = 0; i < 300; i++) {
		const n = int(r, 0, 5);
		const m = int(r, 1, 3);
		const A = Array.from({ length: n + 1 }, (_, k) => term(int(r, -9, 9), n - k)).join(' + ');
		const B = [term(int(r, 1, 4) * (r() < 0.5 ? -1 : 1), m), ...Array.from({ length: m }, (_, k) => term(int(r, -5, 5), m - 1 - k))].join(' + ');
		const PA = parsePolynomial(A);
		if (!PA.ok || PA.p.every((c) => c.isZero())) continue;
		const PB = parsePolynomial(B).p;
		const o = divisionePolinomi(A, B);
		assert.ok(o.ok, `${A} : ${B}: ${o.error}`);
		const { Q, R } = longDivision(PA.p, PB);
		assert.equal(o.copy, `Q(x) = ${polyText(Q)}; R(x) = ${polyText(R)}`);
		const degR = R.findLastIndex((c) => !c.isZero());
		assert.ok(degR < PB.findLastIndex((c) => !c.isZero()), `${A} : ${B}`);
		for (const x of [-2, -1, 0, 1, 3].map((v) => q(v))) assert.ok(polyAt(PA.p, x).equals(polyAt(polyAdd(polyMul(PB, Q), R), x)), `${A} : ${B} at ${x}`);
		if (i < 40) clean(o, `${A} : ${B}`);
	}
});

test("Ruffini's rule", () => {
	const o = regolaRuffini('2x^3 - 7x^2 + 5', 'x - 3');
	assert.equal(o.copy, 'Q(x) = 2x^2 - x - 3; R = -4');
	clean(o, 'ruffini');
	assert.ok(o.steps[0].group, 'groups');
	const exact = regolaRuffini('x^3 - 6x^2 + 11x - 6', 'x - 1');
	assert.equal(exact.copy, 'Q(x) = x^2 - 5x + 6; R = 0');
	assert.match(JSON.stringify(exact.steps), /divisibile per/);
	const frac = regolaRuffini('x^3 - 8', 'x - 1/2');
	assert.equal(frac.copy, 'Q(x) = x^2 + (1/2)x + 1/4; R = -63/8');
	clean(frac, 'fraction');
	for (const [a, b] of [
		['x^3', 'x^2 - 1'],
		['x^3', '2x - 1'],
		['x^3', '0'],
		['5', 'x - 1'],
		['x^3 + ', 'x - 1']
	]) {
		const bad = regolaRuffini(a, b);
		assert.equal(bad.ok, false, `${a} : ${b}`);
		clean(bad, `${a} : ${b}`);
	}
	// Brute force: the remainder is P(a), the quotient is the one of the long division.
	const r = rnd(5);
	for (let i = 0; i < 300; i++) {
		const n = int(r, 1, 6);
		const P = Array.from({ length: n + 1 }, (_, k) => term(k === 0 ? int(r, 1, 6) : int(r, -9, 9), n - k)).join(' + ');
		const a = int(r, -4, 4);
		const div = a < 0 ? `x + ${-a}` : `x - ${a}`;
		const o = regolaRuffini(P, div);
		assert.ok(o.ok, `${P} : ${div}: ${o.error}`);
		const PP = parsePolynomial(P).p;
		const { Q, R } = longDivision(PP, parsePolynomial(div).p);
		assert.equal(o.copy, `Q(x) = ${polyText(Q)}; R = ${polyText(R)}`, `${P} : ${div}`);
		assert.ok(polyAt(PP, q(a)).equals(R[0]), `${P} : ${div}`);
		if (i < 40) clean(o, `${P} : ${div}`);
	}
});

test('factoring', () => {
	const cases = {
		'x^3 - 2x^2 - 5x + 6': '(x - 1)(x - 3)(x + 2)',
		'3x^3 - 12x': '3x(x - 2)(x + 2)',
		'x^4 - 16': '(x - 2)(x + 2)(x^2 + 4)',
		'4x^2 - 12x + 9': '(2x - 3)^2',
		'2x^2 + x - 1': '(x + 1)(2x - 1)',
		'-x^2 + 4': '-(x - 2)(x + 2)',
		'1/2x^2 - 2': '(1/2)(x - 2)(x + 2)',
		'x^2 + 2x': 'x(x + 2)',
		'2x - 4': '2(x - 2)',
		'x^5': 'x^5',
		'(x - 1)^2(x + 2)': '(x - 1)^2(x + 2)',
		'x^4 - 5x^2 + 4': '(x - 2)(x + 2)(x - 1)(x + 1)',
		'6x^3 + 7x^2 - x - 2': '(x + 1)(2x - 1)(3x + 2)',
		'x^3 - 8': '(x - 2)(x^2 + 2x + 4)',
		'8x^3 + 27': '(2x + 3)(4x^2 - 6x + 9)',
		'x^6 - 1': '(x - 1)(x + 1)(x^2 + x + 1)(x^2 - x + 1)',
		'x^2 + 1': 'x^2 + 1',
		'x^2 - 2': 'x^2 - 2',
		'x^3 + x + 1': 'x^3 + x + 1',
		'x^4 - 2x^2 + 1': '(x - 1)^2(x + 1)^2'
	};
	for (const [input, copy] of Object.entries(cases)) {
		const o = scomposizionePolinomi(input);
		assert.ok(o.ok, `${input}: ${o.error}`);
		assert.equal(o.copy, copy, input);
		assert.equal(coeffs(o.copy), coeffs(input), input);
		clean(o, input);
	}
	// Each method is named in its step.
	const said = (input) => JSON.stringify(scomposizionePolinomi(input).steps);
	assert.match(said('3x^3 - 12x'), /Raccoglimento totale/);
	assert.match(said('3x^3 - 12x'), /Differenza di quadrati/);
	assert.match(said('4x^2 - 12x + 9'), /Quadrato di binomio/);
	assert.match(said('x^2 - 5x + 6'), /Trinomio notevole/);
	assert.match(said('x^3 - 2x^2 - 5x + 6'), /Regola di Ruffini/);
	assert.match(said('x^2 + 1'), /discriminante è negativo/);
	assert.match(said('x^3 + x + 1'), /non ha zeri razionali/);
	// Honest when it cannot finish: x^4 + x^2 + 1 = (x^2 + x + 1)(x^2 - x + 1) needs a trick the tool does not know.
	const hard = scomposizionePolinomi('x^4 + x^2 + 1');
	assert.ok(hard.ok);
	assert.match(hard.rows[0].label, /non sa scomporre/);
	assert.match(said('x^4 + x^2 + 1'), /non sa trovarli/);
	clean(hard, 'hard');
	const partial = scomposizionePolinomi('(x - 1)(x^4 + x^2 + 1)');
	assert.match(partial.rows[0].label, /non completa/);
	assert.equal(partial.copy, '(x - 1)(x^4 + x^2 + 1)');
	for (const input of ['', '0', '7', 'x^2 + y', '1/x']) {
		const o = scomposizionePolinomi(input);
		assert.equal(o.ok, false, input);
		clean(o, input);
	}
	// Brute force: products of random linear factors (with a content) split completely into linear factors.
	const r = rnd(3);
	for (let i = 0; i < 300; i++) {
		const k = int(r, 1, 4);
		const factors = Array.from({ length: k }, () => {
			const a = int(r, 1, 3);
			const b = int(r, -6, 6) || 1;
			return `(${a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)})`;
		});
		const c = int(r, 1, 3) * (r() < 0.3 ? -1 : 1);
		const withX = r() < 0.3 ? 'x' : '';
		const input = `${c}${withX}${factors.join('')}`;
		const o = scomposizionePolinomi(input);
		assert.ok(o.ok, `${input}: ${o.error}`);
		assert.equal(o.rows[0].label, 'Polinomio scomposto', input);
		assert.equal(coeffs(o.copy), coeffs(input), input);
		// Every factor left is of degree 1: no x^2 inside a bracket.
		assert.ok(!/\([^)]*x\^/.test(o.copy), `${input} → ${o.copy}`);
		if (i < 40) clean(o, input);
	}
	// Brute force: with an irreducible quadratic factor, it still ends with a correct product.
	for (let i = 0; i < 100; i++) {
		const input = `(x^2 + ${int(r, 1, 5)})(x ${r() < 0.5 ? '-' : '+'} ${int(r, 1, 5)})(${int(r, 1, 3)}x + ${int(r, 1, 5)})`;
		const o = scomposizionePolinomi(input);
		assert.ok(o.ok, `${input}: ${o.error}`);
		assert.equal(coeffs(o.copy), coeffs(input), input);
		assert.equal(o.rows[0].label, 'Polinomio scomposto', input);
	}
});

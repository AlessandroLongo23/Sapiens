// The expression calculator: parsing, the order of the steps, the mistakes in words, and random expressions checked
// against an independent evaluator on BigInt fractions.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import katex from 'katex';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { espressione, expressionPreview } = await jiti.import('../../src/lib/tools/espressioni.ts');

const value = (s) => {
	const o = espressione(s);
	assert.ok(o.ok, `${s}: ${o.error}`);
	return o.copy;
};
const error = (s) => {
	const o = espressione(s);
	assert.equal(o.ok, false, `${s} should fail`);
	return o.error;
};

test('priorities, brackets and signs', () => {
	assert.equal(value('2 + 3 * 4'), '14');
	assert.equal(value('(2 + 3) * 4'), '20');
	assert.equal(value('12 : 4 : 3'), '1');
	assert.equal(value('12 : 4 * 3'), '9');
	assert.equal(value('10 - 4 - 3'), '3');
	assert.equal(value('2 + 3 * (4 - 1)^2'), '29');
	assert.equal(value('{[(2 + 3) * 2 - 4] : 3}^2'), '4');
	assert.equal(value('-2^2'), '-4');
	assert.equal(value('(-2)^2'), '4');
	assert.equal(value('(-2)^3'), '-8');
	assert.equal(value('2 - -3'), '5');
	assert.equal(value('2 * -3'), '-6');
	assert.equal(value('-(3 - 5)'), '2');
	assert.equal(value('2(3 + 1)'), '8');
	assert.equal(value('(1 + 1)(2 + 1)'), '6');
	assert.equal(value('2^0'), '1');
	assert.equal(value('2^-2'), '1/4');
	assert.equal(value('(2/3)^-2'), '9/4');
	assert.equal(value('2^(-1)'), '1/2');
	assert.equal(value('3²'), '9');
	assert.equal(value('5'), '5');
	assert.equal(value('((7))'), '7');
});

test('fractions, decimals and the ways to write the operations', () => {
	assert.equal(value('1/2 + 1/3'), '5/6');
	assert.equal(value('1/2 : 3/4'), '2/3');
	assert.equal(value('2/3^2'), '2/9');
	assert.equal(value('1/2/2'), '1/4');
	assert.equal(value('7 : 2'), '7/2');
	assert.equal(value('0,5 + 0.25'), '3/4');
	assert.equal(value('1,5 x 4'), '6');
	assert.equal(value('3 · 4 × 2 ÷ 6'), '4');
	assert.equal(value('5 − 7'), '-2');
	assert.equal(value('4/6'), '2/3');
	assert.equal(value('{[(2/3 + 1/6) : 5/4 - 1/3]^2 + 1/2} x 3'), '11/6');
});

test('steps in the order of the lesson', () => {
	const o = espressione('{[(2/3 + 1/6) : 5/4 - 1/3]^2 + 1/2} x 3');
	assert.deepEqual(
		o.steps.map((st) => st.group ?? ''),
		['Parentesi tonde', 'Parentesi quadre', '', '', 'Parentesi graffe', '', 'Moltiplicazioni e divisioni']
	);
	assert.deepEqual(
		o.steps.map((st) => st.say),
		[
			'Calcola la parentesi tonda: usa il denominatore comune $6$.',
			'Trasforma la divisione in una moltiplicazione per il reciproco.',
			'Esegui la moltiplicazione.',
			'Esegui la sottrazione: usa il denominatore comune $3$.',
			'Calcola la potenza.',
			'Esegui l’addizione: usa il denominatore comune $18$.',
			'Esegui la moltiplicazione.'
		]
	);
	// The bracket being calculated is highlighted before, its result after, and every line is the whole expression.
	assert.deepEqual(o.steps[0].math, [
		'\\left\\{\\left[\\hl{\\left(\\dfrac{2}{3} + \\dfrac{1}{6}\\right)} : \\dfrac{5}{4} - \\dfrac{1}{3}\\right]^{2} + \\dfrac{1}{2}\\right\\} \\cdot 3',
		'= \\left\\{\\left[\\hl{\\dfrac{4 + 1}{6}} : \\dfrac{5}{4} - \\dfrac{1}{3}\\right]^{2} + \\dfrac{1}{2}\\right\\} \\cdot 3',
		'= \\left\\{\\left[\\hl{\\dfrac{5}{6}} : \\dfrac{5}{4} - \\dfrac{1}{3}\\right]^{2} + \\dfrac{1}{2}\\right\\} \\cdot 3'
	]);
	assert.match(o.steps[1].math[1], /\\dfrac\{5\}\{6\} \\cdot \\hl\{\\dfrac\{4\}\{5\}\}/);
	assert.equal(o.steps[6].math.at(-1), '= \\hl{\\dfrac{11}{6}}');
	assert.deepEqual(o.rows, [
		{ label: 'Risultato', value: '$\\dfrac{11}{6}$' },
		{ label: 'In decimali', value: '$1{,}8\\overline{3}$' }
	]);
	assert.deepEqual(espressione('2 + 3 * 4').rows, [{ label: 'Risultato', value: '$14$' }]);

	// Five steps or fewer: no groups, and the sentence names the bracket.
	const few = espressione('[20 - (3 + 2) * 2] : 5');
	assert.ok(few.steps.every((st) => !st.group));
	assert.deepEqual(few.steps.map((st) => st.say), ['Calcola la parentesi tonda.', 'Nella parentesi quadra, esegui la moltiplicazione.', 'Nella parentesi quadra, esegui la sottrazione.', 'Esegui la divisione.']);

	const powers = espressione('2 + 3 * 2^2 - 1');
	assert.deepEqual(
		powers.steps.map((st) => st.say),
		['Calcola la potenza.', 'Esegui la moltiplicazione.', 'Esegui le addizioni e le sottrazioni.']
	);
	assert.deepEqual(powers.steps[0].math, ['2 + 3 \\cdot \\hl{2^{2}} - 1', '= 2 + 3 \\cdot \\hl{4} - 1']);

	// Left to right, one operation at a time: a line for each.
	const chain = espressione('12 : 4 * 3');
	assert.deepEqual(chain.steps[0].math, ['\\hl{12 : 4} \\cdot 3', '= \\hl{3} \\cdot 3', '= \\hl{9}']);
	assert.match(chain.steps[0].then, /da sinistra a destra/);

	const two = espressione('(1 + 2) * (5 - 3)');
	assert.deepEqual(two.steps[0].math, ['\\hl{\\left(1 + 2\\right)} \\cdot \\left(5 - 3\\right)', '= \\hl{3} \\cdot \\left(5 - 3\\right)']);
	assert.deepEqual(two.steps[1].math, ['3 \\cdot \\hl{\\left(5 - 3\\right)}', '= 3 \\cdot \\hl{2}']);

	const signs = espressione('2 + (-3) - (-4)');
	assert.equal(signs.steps[0].math.at(-1), '= 2 - 3 + 4');
	assert.match(signs.steps[0].then, /regola dei segni/i);

	const dec = espressione('0,5 + 4/6');
	assert.deepEqual(dec.steps[0].table.rows, [
		['$0{,}5$', '$\\dfrac{5}{10} = \\dfrac{1}{2}$'],
		['$\\dfrac{4}{6}$', '$\\dfrac{2}{3}$']
	]);
	assert.deepEqual(dec.steps[0].math, ['\\hl{0{,}5} + \\hl{\\dfrac{4}{6}}', '= \\hl{\\dfrac{1}{2}} + \\hl{\\dfrac{2}{3}}']);

	const sign = espressione('5 - (2 - 7)');
	assert.deepEqual(sign.steps[0].math, ['5 - \\hl{\\left(2 - 7\\right)}', '= 5 - \\hl{(-5)}', '= 5 + \\hl{5}']);

	assert.match(espressione('7').steps[0].say, /già un numero/);
});

test('the preview of the input', () => {
	for (const s of ['{[(2/3 + 1/6) : 5/4 - 1/3]^2 + 1/2} x 3', '-2^2 + (-2)^2 * 0,5', '2 * -(1/2)^-3']) katex.renderToString(expressionPreview(s), { throwOnError: true, strict: 'ignore' });
	assert.equal(expressionPreview('2 + 3 * 4'), '2 + 3 \\cdot 4');
	assert.equal(expressionPreview('1/2 : 0,5'), '\\dfrac{1}{2} : 0{,}5');
	assert.equal(expressionPreview('[(1 + 2) * 3]^2'), '\\left[\\left(1 + 2\\right) \\cdot 3\\right]^{2}');
	assert.equal(expressionPreview('2 * -3'), '2 \\cdot (-3)');
	assert.equal(expressionPreview('(2 + 3'), null);
});

test('mistakes in words', () => {
	assert.match(error(''), /Scrivi un'espressione/);
	assert.match(error('(2 + 3'), /senza chiuderla: manca "\)", come in \(2 \+ 3\) \* 4/);
	assert.match(error('2 + 3)'), /chiusa che non era stata aperta/);
	assert.match(error('[2 + 3)'), /è chiusa con "\)": chiudila con "\]"/);
	assert.match(error('5 : (3 - 3)'), /divisione per zero/);
	assert.match(error('5 / 0'), /zero/);
	assert.match(error('1/0 + 2'), /denominatore 0/);
	assert.match(error('0^0'), /0\^0/);
	assert.match(error('0^-1'), /esponente negativo/);
	assert.match(error('2 + a'), /lettere/);
	assert.match(error('2 # 3'), /simbolo "#"/);
	assert.match(error('2 3'), /Tra 2 e 3 manca un'operazione/);
	assert.match(error('2 +'), /incompleta/);
	assert.match(error('* 2'), /non può cominciare/);
	assert.match(error('2 + * 3'), /Dopo "\+" manca un numero/);
	assert.match(error('()'), /parentesi vuote/);
	assert.match(error('2^3^2'), /potenza di potenza/);
	assert.match(error('2^0,5'), /esponente deve essere un numero intero/);
	assert.match(error('2^(1/2)'), /esponente deve essere un numero intero/);
	assert.match(error('1,2,3'), /non è scritto bene/);
	assert.match(error('1'.repeat(13)), /troppo lungo/);
	assert.match(error('1+'.repeat(100) + '1'), /troppo lunga/);
	assert.match(error(Array(45).fill('1').join('+')), /Al massimo 40 operazioni/);
	assert.match(error('99^99'), /troppo grandi/);
});

// ---------------------------------------------------------------------------
// Random expressions. Each is built as a string together with its value, computed on BigInt fractions, so the
// check does not share the parser or the arithmetic of the tool.

const bgcd = (a, b) => {
	a = a < 0n ? -a : a;
	b = b < 0n ? -b : b;
	while (b) [a, b] = [b, a % b];
	return a;
};
/** A fraction on BigInt, or null for "undefined" (a zero divisor somewhere), which spreads. */
const F = (n, d = 1n) => {
	if (d === 0n) return null;
	if (d < 0n) [n, d] = [-n, -d];
	const g = bgcd(n, d) || 1n;
	return { n: n / g, d: d / g };
};
const lift = (f) => (a, b) => (a && b ? f(a, b) : null);
const add = lift((a, b) => F(a.n * b.d + b.n * a.d, a.d * b.d));
const sub = lift((a, b) => F(a.n * b.d - b.n * a.d, a.d * b.d));
const mul = lift((a, b) => F(a.n * b.n, a.d * b.d));
const div = lift((a, b) => F(a.n * b.d, a.d * b.n));
const pow = (a, e) => {
	if (!a || (a.n === 0n && e <= 0)) return null;
	const base = e < 0 ? F(a.d, a.n) : a;
	let r = F(1n);
	for (let i = 0; i < Math.abs(e); i++) r = mul(r, base);
	return r;
};
const show = ({ n, d }) => (d === 1n ? `${n}` : `${n}/${d}`);

function rng(seed) {
	let s = seed >>> 0;
	return () => {
		s = (s * 1664525 + 1013904223) >>> 0;
		return s / 2 ** 32;
	};
}

/** Random expressions as { s, v }: kind is 'atom' (a number or a bracket), 'prod' or 'sum'; h the bracket height. */
function generator(r) {
	const int = (a, b) => a + Math.floor(r() * (b - a + 1));
	const pick = (xs) => xs[int(0, xs.length - 1)];
	const BR = [
		['(', ')'],
		['[', ']'],
		['{', '}']
	];
	const wrap = (e) => {
		const [o, c] = r() < 0.85 ? BR[Math.min(e.h, 2)] : pick(BR);
		return { s: `${o}${e.s}${c}`, v: e.v, kind: 'atom', h: e.h + 1 };
	};
	const number = () => {
		const t = r();
		if (t < 0.5) {
			const n = int(0, 12);
			return { s: String(n), v: F(BigInt(n)), kind: 'atom', h: 0 };
		}
		if (t < 0.75) {
			const n = int(1, 9), d = int(1, 9);
			return { s: `${n}/${d}`, v: F(BigInt(n), BigInt(d)), kind: 'atom', h: 0, plain: false };
		}
		if (t < 0.88) {
			const a = int(0, 5), b = String(int(1, 99));
			return { s: `${a}${pick([',', '.'])}${b}`, v: F(BigInt(a + b), 10n ** BigInt(b.length)), kind: 'atom', h: 0, plain: false };
		}
		const n = int(1, 9);
		return { s: `(-${n})`, v: F(BigInt(-n)), kind: 'atom', h: 0 };
	};
	const gen = (depth) => {
		if (depth === 0) return number();
		const t = r();
		if (t < 0.15) {
			// a power: fractions and decimals as a base go in brackets, like the negative numbers
			let b = r() < 0.4 ? wrap(gen(depth - 1)) : number();
			if (b.plain === false) b = wrap(b);
			const e = int(-2, 3);
			return { s: `${b.s}^${e < 0 && r() < 0.5 ? `(${e})` : e}`, v: pow(b.v, e), kind: 'atom', h: b.h };
		}
		if (t < 0.25) return wrap(gen(depth - 1));
		const l = gen(depth - 1), rr = gen(depth - 1);
		if (t < 0.6) {
			const op = pick(['+', '-']);
			const R = rr.kind === 'sum' ? wrap(rr) : rr;
			return { s: `${l.s} ${op} ${R.s}`, v: op === '+' ? add(l.v, R.v) : sub(l.v, R.v), kind: 'sum', h: Math.max(l.h, R.h) };
		}
		const op = pick(['*', 'x', '·', ':', '/']);
		const L = l.kind === 'sum' ? wrap(l) : l;
		let R = rr.kind === 'atom' ? rr : wrap(rr);
		// After "/" a whole number would make a fraction with the number before it: the divisor goes in brackets.
		if (op === '/' && !/^[([{]/.test(R.s)) R = wrap(R);
		const v = op === ':' || op === '/' ? div(L.v, R.v) : mul(L.v, R.v);
		return { s: `${L.s} ${op} ${R.s}`, v, kind: 'prod', h: Math.max(L.h, R.h) };
	};
	return gen;
}

test('random expressions against BigInt fractions', () => {
	let checked = 0, undef = 0, big = 0;
	for (let seed = 1; seed <= 4000; seed++) {
		const e = generator(rng(seed))(1 + (seed % 4));
		const o = espressione(e.s);
		if (!e.v) {
			// a zero divisor or 0 to a power not above zero: the tool must say so in words
			assert.equal(o.ok, false, e.s);
			assert.match(o.error, /zero|0\^0/, e.s);
			undef++;
			continue;
		}
		if (!o.ok && /troppo grandi/.test(o.error)) {
			big++;
			continue;
		}
		assert.ok(o.ok, `${e.s}: ${o.error}`);
		assert.equal(o.copy, show(e.v), e.s);
		assert.ok(o.steps.length > 0);
		typesets(o);
		for (const st of o.steps) for (const m of st.math ?? []) assert.equal((m.match(/\{/g) ?? []).length, (m.match(/\}/g) ?? []).length, m);
		// Each step keeps the whole expression: its last line is the one the next step starts from.
		for (let i = 1; i < o.steps.length; i++) assert.equal(bare(o.steps[i].math[0]), bare(o.steps[i - 1].math.at(-1)), e.s);
		assert.equal(bare(o.steps.at(-1).math?.at(-1) ?? o.rows[0].value), bare(o.rows[0].value), e.s);
		checked++;
	}
	assert.ok(checked > 2500, `checked ${checked}`);
	assert.ok(undef > 10, `undefined ${undef}`);
	assert.ok(big < 40, `too many overflows: ${big}`);
});

/** A line without highlights, leading "=", dollars and bracket sizes: "= \hl{3} \cdot 3" is "3 \cdot 3". */
const bare = (m) => m.replace(/\\hl\{/g, '{').replace(/[{}$]/g, '').replace(/\\(left|right)/g, '').replace(/^= /, '').replace(/\s+/g, '');

/**
 * Every string a result shows typesets in KaTeX without errors, with the `\hl` of the tools: the rows, and each
 * step's sentence, lines, table and conclusion. The sentence is a sentence: no display formula, at most one "=".
 */
const KATEX = { throwOnError: true, strict: 'ignore', macros: { '\\hl': '\\htmlClass{hl}{#1}' }, trust: (c) => c.command === '\\htmlClass' };
const inline = (text) => {
	assert.equal((text.match(/\$/g) ?? []).length % 2, 0, text);
	for (const m of text.matchAll(/\$([^$]+)\$/g)) assert.doesNotThrow(() => katex.renderToString(m[1], KATEX), m[1]);
};
function typesets(o) {
	assert.ok(o.rows.length > 0);
	for (const r of o.rows) {
		inline(r.label);
		inline(r.value);
		assert.match(r.value, /^\$[^$]+\$$/, r.value);
	}
	for (const st of o.steps) {
		assert.ok(!st.say.includes('$$'), st.say);
		assert.ok((st.say.match(/=/g) ?? []).length <= 1, st.say);
		assert.ok(st.say.split(/\s+/).length <= 16, st.say);
		inline(st.say);
		for (const m of st.math ?? []) assert.doesNotThrow(() => katex.renderToString(m, KATEX), m);
		for (const c of [...(st.table?.head ?? []), ...(st.table?.rows.flat() ?? [])]) inline(c);
		if (st.then) inline(st.then);
	}
}

test('every string typesets, and each sentence stays a sentence', () => {
	for (const s of ['{[(2/3 + 1/6) : 5/4 - 1/3]^2 + 1/2} * 3', '2 + 3 * (4 - 1)^2', '[20 - (3 + 2) * 2] : 5', '1/2 + 2/3 - 0,5', '(-2)^3 - 2^2 : (-4)', '2 * -(1/2)^-3', '-2^2 + (-2)^2 * 0,5', '7', '((7))', '4/6']) typesets(espressione(s));
	for (const s of ['', '(2 + 3', '2 + 3)', '[2 + 3)', '5 : (3 - 3)', '2 + a', '2 # 3', '2 3', '2 +', '* 2', '(* 2)', '()', '0^0', '0^-1', '2^100', '99^99']) {
		const o = espressione(s);
		assert.equal(o.ok, false, s);
		assert.match(o.error, /per esempio|come in|come 0,5/, `${s}: ${o.error}`);
	}
});

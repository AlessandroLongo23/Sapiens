// Media geometrica, armonica e quadratica: the calculator's pure logic.
// Run with `node --test tests/unit/tools-medie-speciali.test.mjs` (jiti loads the TypeScript sources).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { medieSpeciali, rootDecimal, iroot } = await jiti.import('../../src/lib/tools/medie-speciali.ts');

const rows = (o) => Object.fromEntries(o.rows.map((r) => [r.label, r.value]));
const lines = (o) => o.steps.flatMap((s) => s.math ?? []);
const num = (s) => Number(s.replace(/ /g, '').replace(',', '.'));

test('geometric mean: exact, simplified, decimal', () => {
	const exact = medieSpeciali('geometrica', '4 9');
	assert.equal(rows(exact)['Media geometrica'], '$6$');
	assert.equal(rows(exact)['Media aritmetica, per confronto'], '$6{,}5$');
	assert.deepEqual(lines(exact).slice(0, 3), ['4 \\cdot 9 = \\hl{36}', 'G = \\sqrt{36}', '= \\hl{6}']);
	const cube = medieSpeciali('geometrica', '2 6 9');
	assert.equal(rows(cube)['Media geometrica'], '$3\\sqrt[3]{4} \\approx 4{,}7622$');
	assert.deepEqual(cube.steps[1].math, ['G = \\sqrt[3]{108}', '= \\sqrt[3]{3^{3} \\cdot 4}', '= 3\\sqrt[3]{4}', '\\approx \\hl{4{,}7622}']);
	assert.equal(cube.copy, 'media geometrica 4,7622; media aritmetica 5,6667');
	assert.equal(rows(medieSpeciali('geometrica', '2 3'))['Media geometrica'], '$\\sqrt{6} \\approx 2{,}4495$');
	// Decimals: 1,1 · 1,5 · 1,2 = 1,98.
	const growth = medieSpeciali('geometrica', '1,1 1,5 1,2');
	assert.match(lines(growth)[0], /= \\hl\{1\{,\}98\}$/);
	assert.equal(rows(growth)['Media geometrica'], '$\\approx 1{,}2557$');
	// A rational root: 0,25 and 1 give 0,5.
	assert.equal(rows(medieSpeciali('geometrica', '0,25 1'))['Media geometrica'], '$0{,}5$');
	assert.match(medieSpeciali('geometrica', '5 5 5').steps.at(-1).then, /tutti uguali/);
});

test('harmonic mean: the average speed, fractions', () => {
	const speed = medieSpeciali('armonica', '60 40');
	assert.equal(rows(speed)['Media armonica'], '$48$');
	assert.deepEqual(speed.steps[1].math, ['\\dfrac{1}{60} + \\dfrac{1}{40} = \\dfrac{2 + 3}{120}', '= \\dfrac{5}{120}', '= \\hl{\\dfrac{1}{24}}']);
	assert.deepEqual(speed.steps[2].math, ['H = 2 : \\dfrac{1}{24}', '= 2 \\cdot 24', '= \\hl{48}']);
	const three = medieSpeciali('armonica', '2 3 6');
	assert.equal(rows(three)['Media armonica'], '$3$');
	const q = medieSpeciali('armonica', '1 2 4');
	assert.equal(rows(q)['Media armonica'], '$\\dfrac{12}{7} \\approx 1{,}7143$');
	// A decimal value: the reciprocal of 2,5 is 2/5.
	assert.deepEqual(medieSpeciali('armonica', '2,5 10').steps[0].table.rows[0], ['$2{,}5$', '$\\dfrac{1}{2{,}5} = \\dfrac{2}{5}$']);
	assert.equal(rows(medieSpeciali('armonica', '0,5 2'))['Media armonica'], '$\\dfrac{4}{5} = 0{,}8$');
});

test('quadratic mean: negatives, simplified roots', () => {
	const o = medieSpeciali('quadratica', '-4 2 6 8');
	assert.equal(rows(o)['Media quadratica'], '$\\sqrt{30} \\approx 5{,}4772$');
	assert.equal(rows(o)['Media aritmetica, per confronto'], '$3$');
	assert.deepEqual(o.steps[0].table.rows[0], ['$-4$', '$(-4)^2 = 16$']);
	assert.equal(rows(medieSpeciali('quadratica', '4 4 8 8'))['Media quadratica'], '$2\\sqrt{10} \\approx 6{,}3246$');
	assert.equal(rows(medieSpeciali('quadratica', '1 7'))['Media quadratica'], '$5$');
	assert.equal(rows(medieSpeciali('quadratica', '-1 1'))['Media quadratica'], '$1$');
	assert.equal(rows(medieSpeciali('quadratica', '0 0'))['Media quadratica'], '$0$');
	// A mean of squares that is a fraction: (1 + 4 + 16) / 3 = 7.
	assert.equal(rows(medieSpeciali('quadratica', '1 2 4'))['Media quadratica'], '$\\sqrt{7} \\approx 2{,}6458$');
	assert.equal(rows(medieSpeciali('quadratica', '1 2'))['Media quadratica'], '$\\approx 1{,}5811$');
});

test('wrong inputs fail with a sentence', () => {
	for (const [mode, input] of [
		['geometrica', ''],
		['geometrica', '5'],
		['geometrica', '3 0 4'],
		['armonica', '-2 4'],
		['armonica', '2 x'],
		['quadratica', Array.from({ length: 31 }, () => '1').join(' ')]
	]) {
		const o = medieSpeciali(mode, input);
		assert.equal(o.ok, false, `${mode} ${input}`);
		assert.match(o.error, /per esempio|Al massimo/, o.error);
	}
});

test('roots to four decimals', () => {
	assert.equal(iroot(10n ** 30n, 3), 10n ** 10n);
	assert.equal(iroot(26n, 3), 2n);
	assert.deepEqual(rootDecimal(8n, 1n, 3), { tex: '2', text: '2', exact: true });
	assert.equal(rootDecimal(2n, 1n, 2).text, '1,4142');
	assert.equal(rootDecimal(1n, 4n, 2).text, '0,5');
	for (let a = 1; a < 3000; a += 13)
		for (const k of [2, 3, 5]) {
			const r = num(rootDecimal(BigInt(a), 7n, k).text);
			assert.ok(Math.abs(r - Math.round((a / 7) ** (1 / k) * 1e4) / 1e4) < 1.1e-4, `${a}/7 root ${k}`);
		}
});

test('checked against floating point on random lists, and readable', () => {
	let seed = 7;
	const rnd = () => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
	for (let i = 0; i < 300; i++) {
		const n = 2 + Math.floor(rnd() * 12);
		const xs = Array.from({ length: n }, () => 1 + Math.floor(rnd() * 60) + (rnd() < 0.3 ? 0.5 : 0));
		const input = xs.map((x) => String(x).replace('.', ',')).join(' ');
		const g = medieSpeciali('geometrica', input);
		const h = medieSpeciali('armonica', input);
		const signed = xs.map((x, j) => (j % 3 === 0 ? -x : x));
		const q = medieSpeciali('quadratica', signed.map((x) => String(x).replace('.', ',')).join(' '));
		for (const o of [g, h, q]) {
			assert.equal(o.ok, true, input);
			assertReadable(o, input);
		}
		const value = (o) => num(o.copy.match(/^media \w+ ([^;]+);/)[1]);
		const G = Math.exp(xs.reduce((a, x) => a + Math.log(x), 0) / n);
		const H = n / xs.reduce((a, x) => a + 1 / x, 0);
		const Q = Math.sqrt(signed.reduce((a, x) => a + x * x, 0) / n);
		assert.ok(Math.abs(value(g) - G) < 6e-5, `G ${input}: ${value(g)} ${G}`);
		assert.ok(Math.abs(value(h) - H) < 6e-5, `H ${input}: ${value(h)} ${H}`);
		assert.ok(Math.abs(value(q) - Q) < 6e-5, `Q ${input}: ${value(q)} ${Q}`);
		assert.ok(value(h) <= value(g) + 1e-4 && value(g) <= xs.reduce((a, b) => a + b) / n + 1e-4);
	}
	// Thirty values: long products and sums still come out exact and readable.
	const thirty = Array.from({ length: 30 }, (_, i) => String(2 + (i % 9))).join(' ');
	for (const mode of ['geometrica', 'armonica', 'quadratica']) assertReadable(medieSpeciali(mode, thirty), `${mode} thirty`);
});

// Area and perimeter of the plane figures: exact values, every mode, round trips and wrong inputs.
// Run with `node --test tests/unit/tools-geometria.test.mjs`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { figura, FIGURES, FIGURE_EXAMPLES, squareFree, shown, valueText, sqrt, int, mul, div, PI } = await jiti.import('../../src/lib/tools/geometria.ts');

/** The measures of a result, read back from the copy text as numbers: "A = 25 cm²; d = 5√2 cm ≈ 7,0711 cm". */
function measures(res) {
	assert.ok(res.outcome.ok, res.outcome.error);
	const out = {};
	for (const part of res.outcome.copy.split('; ')) {
		const [, sym, rest] = /^(\S+) [=≈] ?(.*)$/.exec(part);
		const last = rest.includes('≈') ? rest.slice(rest.lastIndexOf('≈') + 1) : rest;
		const n = Number(last.replace(/ (mm|cm|dm|m|km)²?$/, '').replace(/\s/g, '').replace(',', '.'));
		assert.ok(Number.isFinite(n), `not a number: ${part}`);
		out[sym] = n;
	}
	return out;
}

const close = (actual, expected, what = '') => assert.ok(Math.abs(actual - expected) <= 1e-4 * Math.max(1, Math.abs(expected)) + 5e-5, `${what}: ${actual} ≠ ${expected}`);
const it = (n) => String(n).replace('.', ',');
const bad = (res, pattern) => {
	assert.equal(res.outcome.ok, false);
	if (pattern) assert.match(res.outcome.error, pattern);
};

test('exact values: radicals, π and their text', () => {
	assert.deepEqual(squareFree(50), { k: 5, r: 2 });
	assert.deepEqual(squareFree(72), { k: 6, r: 2 });
	assert.deepEqual(squareFree(13), { k: 1, r: 13 });
	assert.equal(valueText(sqrt(int(50))), '5√2 ≈ 7,0711');
	assert.equal(valueText(sqrt(int(49))), '7');
	assert.equal(valueText(mul(int(25), PI), 'cm', 2), '25π cm² ≈ 78,5398 cm²');
	assert.equal(shown(div(sqrt(int(3)), int(2))).exact.tex, '\\dfrac{\\sqrt{3}}{2}');
	assert.equal(shown(div(int(10), mul(int(2), PI))).exact.text, '5/π');
	assert.equal(shown(div(int(10), int(3))).exact.tex, '\\dfrac{10}{3}');
	assert.equal(valueText(div(int(10), int(4))), '2,5');
});

test('every mode opens on a correct example, and every clickable example works', () => {
	for (const [figure, spec] of Object.entries(FIGURES)) {
		for (const mode of spec.modes) {
			const res = figura(figure, mode.value, mode.example, 'cm');
			assert.ok(res.outcome.ok, `${figure}/${mode.value}: ${res.outcome.error}`);
			assert.ok(res.sketch, `${figure}/${mode.value} has a drawing`);
			assert.ok(!res.outcome.steps.some((s) => s.startsWith('Attenzione')), `${figure}/${mode.value}: the example must be consistent`);
		}
		for (const ex of FIGURE_EXAMPLES[figure]) assert.ok(figura(figure, ex.mode, ex.values, 'cm').outcome.ok, `${figure} ${ex.label}`);
	}
});

test('square: every mode, round trips from the other measures back to the side', () => {
	for (let i = 1; i <= 60; i++) {
		const l = i / 2;
		const m = measures(figura('quadrato', 'lato', { a: it(l) }));
		close(m.A, l * l, 'A');
		close(m['2p'], 4 * l, '2p');
		close(m.d, l * Math.SQRT2, 'd');
		close(measures(figura('quadrato', 'area', { a: it(l * l) })).l, l, 'l from A');
		close(measures(figura('quadrato', 'perimetro', { a: it(4 * l) })).l, l, 'l from 2p');
		const fromD = measures(figura('quadrato', 'diagonale', { a: it(l) }));
		close(fromD.l, l / Math.SQRT2, 'l from d');
		close(fromD.A, (l * l) / 2, 'A from d');
	}
	const r = figura('quadrato', 'area', { a: '50' }, 'cm').outcome;
	assert.match(r.result, /l = 5\\sqrt\{2\}/);
	assert.match(r.result, /d = 10\\,\\text\{cm\}/);
	assert.equal(figura('quadrato', 'lato', { a: '5' }, 'cm').outcome.copy, 'A = 25 cm²; 2p = 20 cm; d = 5√2 cm ≈ 7,0711 cm');
	assert.equal(figura('quadrato', 'lato', { a: '5' }).outcome.copy, 'A = 25; 2p = 20; d = 5√2 ≈ 7,0711');
});

test('rectangle: sides, diagonal, area and perimeter back to the height', () => {
	for (let b = 1; b <= 15; b++)
		for (let h = 1; h <= 15; h++) {
			const m = measures(figura('rettangolo', 'lati', { a: it(b), b: it(h) }));
			close(m.A, b * h, 'A');
			close(m['2p'], 2 * (b + h), '2p');
			close(m.d, Math.hypot(b, h), 'd');
			close(measures(figura('rettangolo', 'area', { a: it(b * h), b: it(b) })).h, h, 'h from A');
			close(measures(figura('rettangolo', 'perimetro', { a: it(2 * (b + h)), b: it(b) })).h, h, 'h from 2p');
			const d = Math.hypot(b, h);
			if (Number.isInteger(d)) close(measures(figura('rettangolo', 'diagonale', { a: it(b), b: it(d) })).h, h, 'h from d');
		}
	assert.match(figura('rettangolo', 'lati', { a: '4', b: '4' }).outcome.steps.join(' '), /quadrato/);
	bad(figura('rettangolo', 'diagonale', { a: '10', b: '10' }), /diagonale/);
	bad(figura('rettangolo', 'diagonale', { a: '10', b: '6' }));
	bad(figura('rettangolo', 'perimetro', { a: '20', b: '10' }), /perimetro/);
});

test("triangle: Heron's formula against coordinates, the triangle inequality, base and height", () => {
	for (let a = 1; a <= 12; a++)
		for (let b = 1; b <= 12; b++)
			for (let c = 1; c <= 12; c++) {
				const res = figura('triangolo', 'lati', { a: it(a), b: it(b), c: it(c) });
				const [x, y, z] = [a, b, c].sort((p, q) => p - q);
				if (z >= x + y) {
					bad(res, /non formano un triangolo/);
					continue;
				}
				const s = (a + b + c) / 2;
				const m = measures(res);
				close(m['2p'], a + b + c, '2p');
				close(m.A, Math.sqrt(s * (s - a) * (s - b) * (s - c)), `A ${a},${b},${c}`);
				const steps = res.outcome.steps.join(' ');
				if (x * x + y * y === z * z) assert.match(steps, /rettangolo/);
				else if (x * x + y * y < z * z) assert.match(steps, /ottusangolo/);
			}
	assert.match(figura('triangolo', 'lati', { a: '5', b: '6', c: '7' }).outcome.result, /6\\sqrt\{6\}/);
	assert.match(figura('triangolo', 'lati', { a: '1', b: '2', c: '3' }).outcome.error, /uguale alla somma/);
	assert.match(figura('triangolo', 'lati', { a: '2', b: '2', c: '2' }).outcome.steps.join(' '), /equilatero/);
	for (let l = 1; l <= 30; l++) {
		const m = measures(figura('triangolo', 'equilatero', { a: it(l) }));
		close(m.A, (l * l * Math.sqrt(3)) / 4, 'A equilatero');
		close(m.h, (l * Math.sqrt(3)) / 2, 'h equilatero');
		close(m['2p'], 3 * l, '2p equilatero');
	}
	for (let b = 1; b <= 20; b++) for (let h = 1; h <= 20; h += 3) close(measures(figura('triangolo', 'base', { a: it(b), b: it(h) })).A, (b * h) / 2, 'A = bh/2');
	const withSides = measures(figura('triangolo', 'base', { a: '14', b: '12', c: '13', d: '15' }));
	assert.deepEqual(withSides, { A: 84, '2p': 42 });
	bad(figura('triangolo', 'base', { a: '14', b: '12', c: '13', d: '' }), /tutti e due/);
	bad(figura('triangolo', 'base', { a: '10', b: '12', c: '11', d: '15' }), /più corto/);
	bad(figura('triangolo', 'base', { a: '10', b: '1', c: '2', d: '3' }), /non formano un triangolo/);
	assert.match(figura('triangolo', 'base', { a: '10', b: '4', c: '5', d: '7' }).outcome.steps.join(' '), /Attenzione/);
});

test('trapezoid: generic, isosceles and right', () => {
	for (let B = 2; B <= 20; B++)
		for (let b = 1; b < B; b += 2)
			for (let h = 1; h <= 9; h += 2) {
				close(measures(figura('trapezio', 'generico', { a: it(B), b: it(b), c: it(h) })).A, ((B + b) * h) / 2, 'A');
				const iso = measures(figura('trapezio', 'isoscele', { a: it(B), b: it(b), c: it(h) }));
				const l = Math.hypot(h, (B - b) / 2);
				close(iso.l, l, 'l isoscele');
				close(iso['2p'], B + b + 2 * l, '2p isoscele');
				const ret = measures(figura('trapezio', 'rettangolo', { a: it(B), b: it(b), c: it(h) }));
				const lr = Math.hypot(h, B - b);
				close(ret.l, lr, 'l rettangolo');
				close(ret['2p'], B + b + h + lr, '2p rettangolo');
				close(ret.A, ((B + b) * h) / 2, 'A rettangolo');
			}
	assert.deepEqual(measures(figura('trapezio', 'generico', { a: '24', b: '10', c: '12', d: '13', e: '15' })), { A: 204, '2p': 62 });
	bad(figura('trapezio', 'isoscele', { a: '6', b: '10', c: '4' }), /base maggiore/);
	bad(figura('trapezio', 'isoscele', { a: '6', b: '6', c: '4' }), /parallelogramma/);
	bad(figura('trapezio', 'generico', { a: '24', b: '10', c: '12', d: '10', e: '15' }), /più corto/);
	bad(figura('trapezio', 'generico', { a: '24', b: '10', c: '12', d: '13', e: '' }), /tutti e due/);
});

test('rhombus: diagonals, side and diagonal, side and height', () => {
	for (let d1 = 1; d1 <= 20; d1++)
		for (let d2 = 1; d2 <= 20; d2 += 3) {
			const m = measures(figura('rombo', 'diagonali', { a: it(d1), b: it(d2) }));
			const l = Math.hypot(d1 / 2, d2 / 2);
			close(m.A, (d1 * d2) / 2, 'A');
			close(m.l, l, 'l');
			close(m['2p'], 4 * l, '2p');
			// Back from the side and one diagonal to the other diagonal, when the side is a whole number.
			if (Number.isInteger(l)) close(measures(figura('rombo', 'lato-diagonale', { a: it(l), b: it(d1) })).d2, d2, 'd2');
		}
	assert.deepEqual(measures(figura('rombo', 'lato-diagonale', { a: '5', b: '8' })), { A: 24, '2p': 20, d2: 6 });
	assert.deepEqual(measures(figura('rombo', 'lato-altezza', { a: '12', b: '9' })), { A: 108, '2p': 48 });
	bad(figura('rombo', 'lato-diagonale', { a: '5', b: '10' }), /doppio del lato/);
	bad(figura('rombo', 'lato-altezza', { a: '5', b: '6' }), /altezza/);
	assert.match(figura('rombo', 'diagonali', { a: '6', b: '6' }).outcome.steps.join(' '), /quadrato/);
});

test('parallelogram: base and height, area back to the height', () => {
	for (let b = 1; b <= 15; b++)
		for (let h = 1; h <= 15; h += 2) {
			close(measures(figura('parallelogramma', 'base', { a: it(b), b: it(h) })).A, b * h, 'A');
			close(measures(figura('parallelogramma', 'area', { a: it(b * h), b: it(b) })).h, h, 'h from A');
			const l = h + 1.5;
			const m = measures(figura('parallelogramma', 'base', { a: it(b), b: it(h), c: it(l) }));
			close(m['2p'], 2 * (b + l), '2p');
		}
	bad(figura('parallelogramma', 'base', { a: '10', b: '6', c: '5' }), /più corto/);
	assert.match(figura('parallelogramma', 'base', { a: '10', b: '4', c: '5' }).outcome.steps.join(' '), /h_l = \\dfrac\{A\}\{l\} = \\dfrac\{40\}\{5\} = 8/);
});

test('circle: π kept exact, every mode back to the radius', () => {
	for (let i = 1; i <= 40; i++) {
		const r = i / 2;
		const m = measures(figura('cerchio', 'raggio', { a: it(r) }));
		close(m.d, 2 * r, 'd');
		close(m.C, 2 * Math.PI * r, 'C');
		close(m.A, Math.PI * r * r, 'A');
		close(measures(figura('cerchio', 'diametro', { a: it(2 * r) })).r, r, 'r from d');
		close(measures(figura('cerchio', 'circonferenza', { a: `${it(2 * r)}π` })).r, r, 'r from C with π');
		close(measures(figura('cerchio', 'area', { a: `${it(r * r)}pi` })).r, r, 'r from A with π');
		close(measures(figura('cerchio', 'circonferenza', { a: it(Math.round(2 * Math.PI * r * 1e4) / 1e4) })).r, r, 'r from C decimal');
		close(measures(figura('cerchio', 'area', { a: it(Math.round(Math.PI * r * r * 1e4) / 1e4) })).r, r, 'r from A decimal');
	}
	const five = figura('cerchio', 'raggio', { a: '5' }, 'cm').outcome;
	assert.match(five.result, /C = 10\\pi\\,\\text\{cm\} \\approx 31\{,\}4159/);
	assert.match(five.result, /A = 25\\pi\\,\\text\{cm\}\^2/);
	assert.equal(figura('cerchio', 'area', { a: '49π' }).outcome.copy, 'r = 7; d = 14; C = 14π ≈ 43,9823');
	assert.match(figura('cerchio', 'circonferenza', { a: '31,4' }).outcome.copy, /^r = 15,7\/π ≈ 4,9975/);
	assert.match(figura('cerchio', 'area', { a: '50' }).outcome.copy, /^r ≈ 3,9894/);
});

test('wrong inputs give a sentence, never an exception', () => {
	bad(figura('quadrato', 'lato', { a: '' }), /Scrivi il lato/);
	bad(figura('quadrato', 'lato', { a: '0' }), /maggiore di zero/);
	bad(figura('quadrato', 'lato', { a: '-3' }), /maggiore di zero/);
	bad(figura('quadrato', 'lato', { a: 'abc' }), /scrivi un numero/);
	bad(figura('quadrato', 'lato', { a: '1000000' }), /100 000/);
	bad(figura('quadrato', 'lato', { a: '0,123456' }), /quattro cifre/);
	bad(figura('rettangolo', 'lati', { a: '5', b: '' }), /Scrivi l'altezza/);
	bad(figura('cerchio', 'raggio', { a: '5π' }), /scrivi un numero/);
	bad(figura('cerchio', 'circonferenza', { a: '-2π' }), /maggiore di zero/);
	// Large and awkward values still give an answer, exact or rounded.
	assert.ok(figura('triangolo', 'lati', { a: '99999,9999', b: '99999,9998', c: '99999,9997' }).outcome.ok);
	assert.ok(figura('quadrato', 'diagonale', { a: '99999,9999' }).outcome.ok);
	assert.ok(figura('cerchio', 'area', { a: '99999,9999' }).outcome.ok);
	// An unknown mode falls back to the first one.
	assert.ok(figura('quadrato', 'boh', { a: '5' }).outcome.ok);
});

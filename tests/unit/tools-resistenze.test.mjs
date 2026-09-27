// Resistors in series and in parallel, with exact fractions. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { resistenze, readResistors, resistorLabel } = await jiti.import('../../src/lib/tools/resistenze.ts');

const UNIT = { Ω: 1, kΩ: 1e3, MΩ: 1e6 };
/** A copied resistance in ohm: "103,06 Ω" → 103.06, "1 004 920 Ω" → 1004920, "4,7 kΩ ±5%" → 4700. */
function ohm(copy) {
	const m = /^(-?\d{1,3}(?: \d{3})+|-?\d+)(?:,(\d+))? (Ω|kΩ|MΩ)/.exec(copy);
	assert.ok(m, `not a resistance: ${copy}`);
	return Number(`${m[1].replace(/ /g, '')}.${m[2] ?? '0'}`) * UNIT[m[3]];
}
const ok = (o, name) => {
	assert.ok(o.ok, o.error);
	assertReadable(o, name);
	return o;
};
const close = (a, b, what = '') => assert.ok(Math.abs(a - b) <= 1e-3 * Math.abs(b), `${what}: ${a} vs ${b}`);

test('parallel with the sum of the inverses, exact', () => {
	const o = ok(resistenze({ modo: 'parallelo', r: '220;330;470', u: 'ohm;ohm;ohm' }));
	assert.equal(o.copy, '103,06 Ω');
	assert.match(o.rows[0].value, /\\dfrac\{31\\,020\}\{301\}/);
	const lcm = o.steps.find((s) => s.say.startsWith('Scrivi le frazioni'));
	assert.ok(lcm.math.at(-1).includes('\\dfrac{301}{31\\,020\\ \\Omega}'));
	// Whole results, and a fraction that simplifies.
	assert.equal(ok(resistenze({ modo: 'parallelo', r: '6;3', u: 'ohm;ohm', metodo: 'inversi' })).copy, '2 Ω');
	assert.ok(ok(resistenze({ modo: 'parallelo', r: '6;3', u: 'ohm;ohm', metodo: 'inversi' })).steps.some((s) => s.say === 'Semplifica la frazione.'));
	assert.equal(ok(resistenze({ modo: 'parallelo', r: '1;1;1', u: 'kohm;kohm;kohm' })).copy, '333,33 Ω');
	assert.equal(ok(resistenze({ modo: 'parallelo', r: '0,5;1;2', u: 'ohm;ohm;ohm' })).copy, '0,2857 Ω');
});

test('two in parallel: the product over the sum', () => {
	const o = ok(resistenze({ modo: 'parallelo', r: '6;3', u: 'ohm;ohm' }));
	assert.equal(o.copy, '2 Ω');
	assert.equal(o.steps[0].math[0], 'R_{eq} = \\dfrac{R_1 \\cdot R_2}{R_1 + R_2}');
	const k = ok(resistenze({ modo: 'parallelo', r: '4,7;10', u: 'kohm;kohm' }));
	assert.equal(k.copy, '3,197 kΩ');
	// Worked in ohm, so the numbers are whole.
	assert.ok(k.steps.some((s) => s.table?.rows.some((r) => r[3] === '$4700\\ \\Omega$')));
	assert.ok(k.steps.some((s) => s.math?.some((m) => m.includes('\\Omega^2'))));
});

test('series, with mixed units', () => {
	const o = ok(resistenze({ modo: 'serie', r: '4,7;220;1', u: 'kohm;ohm;Mohm' }));
	assert.equal(o.copy, '1,00492 MΩ');
	assert.equal(o.rows[1].value, '$1\\,004\\,920\\ \\Omega$');
	assert.equal(ok(resistenze({ modo: 'serie', r: '4,7;10', u: 'kohm;kohm' })).copy, '14,7 kΩ');
	assert.equal(ok(resistenze({ modo: 'serie', r: '100;220', u: 'ohm;ohm' })).copy, '320 Ω');
});

test('resistors against floating point', () => {
	const units = ['ohm', 'kohm', 'Mohm'];
	const f = { ohm: 1, kohm: 1e3, Mohm: 1e6 };
	let seed = 7;
	const rnd = (n) => ((seed = (seed * 16807) % 2147483647), seed % n);
	for (let i = 0; i < 400; i++) {
		const k = 2 + rnd(5);
		const vs = Array.from({ length: k }, () => (1 + rnd(999)) / (rnd(3) === 0 ? 10 : 1));
		const us = Array.from({ length: k }, () => units[rnd(2)]);
		const ohms = vs.map((v, j) => v * f[us[j]]);
		const r = vs.map((v) => String(v).replace('.', ',')).join(';');
		const u = us.join(';');
		const serie = ok(resistenze({ modo: 'serie', r, u }), 'serie');
		close(ohm(serie.copy), ohms.reduce((a, b) => a + b), `serie ${r} ${u}`);
		const par = ok(resistenze({ modo: 'parallelo', r, u, metodo: 'inversi' }), 'parallelo');
		const expected = 1 / ohms.reduce((a, b) => a + 1 / b, 0);
		close(ohm(par.copy), expected, `parallelo ${r} ${u}`);
		assert.ok(ohm(par.copy) <= Math.min(...ohms) * 1.0001);
		if (k === 2) close(ohm(ok(resistenze({ modo: 'parallelo', r, u }), 'prodotto').copy), expected, `prodotto ${r} ${u}`);
	}
});

test('resistors: wrong inputs', () => {
	for (const [r, u] of [
		['220', 'ohm'],
		['220;', 'ohm;ohm'],
		['220;abc', 'ohm;ohm'],
		['220;0', 'ohm;ohm'],
		['220;-3', 'ohm;ohm'],
		['1;1;1;1;1;1;1;1;1;1;1', 'ohm'],
		['1e20;1', 'ohm;ohm']
	]) {
		const o = resistenze({ modo: 'parallelo', r, u });
		assert.equal(o.ok, false, `${r}`);
		assertReadable(o);
	}
	assert.equal(typeof readResistors('220;330', 'ohm;kohm'), 'object');
	assert.equal(resistorLabel('4,7', 'kohm'), '4,7 kΩ');
	assert.equal(resistorLabel('1000000', 'ohm'), '1 000 000 Ω');
	assert.equal(resistorLabel('', 'ohm'), '');
});

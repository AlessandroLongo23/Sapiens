// The gas laws: pV = nRT with R chosen by the units, and the transformations between two states, the temperature
// always in kelvin. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { gas, LAWS } = await jiti.import('../../src/lib/tools/gas.ts');

/** The number at the start of a copied result: "48,96 L" → 48.96, "124 710 Pa" → 124710, "1,2 · 10^5 Pa" → 120000. */
function num(copy) {
	const m = /^(-?\d{1,3}(?: \d{3})+|-?\d+)(?:,(\d+))?(?: · 10\^(-?\d+))?/.exec(copy);
	assert.ok(m, `not a number: ${copy}`);
	return Number(`${m[1].replace(/ /g, '')}.${m[2] ?? '0'}`) * 10 ** Number(m[3] ?? 0);
}
const ok = (o, name) => {
	assert.ok(o.ok, `${name}: ${o.error}`);
	assertReadable(o, name);
	return o;
};
const close = (a, b, what = '', tol = 1e-3) => assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), `${what}: ${a} vs ${b}`);
const kelvinStep = (o) => o.steps.find((s) => /kelvin/.test(s.say));

test('pV = nRT: the examples', () => {
	const v = ok(gas({ modo: 'pvnrt', trova: 'V', p: '1', up: 'atm', n: '2', un: 'mol', T: '25', uT: 'C', uV: 'L' }));
	assert.equal(v.copy, '48,96 L');
	// With atm, R in L·atm/(mol·K).
	assert.ok(v.steps.some((s) => s.math?.[0] === 'R = 0{,}0821\\ \\tfrac{\\text{L} \\cdot \\text{atm}}{\\text{mol} \\cdot \\text{K}}'));
	// The temperature to kelvin, highlighted.
	const k = kelvinStep(v);
	assert.deepEqual(k.math, ['T = (25 + 273{,}15)\\ \\text{K}', '= \\hl{298{,}15\\ \\text{K}}']);
	// With pascal, R = 8,314 J/(mol·K), and the litres to cubic metres.
	const n = ok(gas({ modo: 'pvnrt', trova: 'n', p: '101325', up: 'Pa', V: '22,4', uV: 'L', T: '0', uT: 'C', un: 'mol' }));
	assert.equal(n.copy, '0,9994 mol');
	assert.ok(n.steps.some((s) => s.math?.[0]?.startsWith('R = 8{,}314')));
	assert.ok(n.steps.some((s) => s.table?.rows.some((r) => r[3] === '$0{,}0224\\ \\text{m}^3$')));
	const p = ok(gas({ modo: 'pvnrt', trova: 'p', V: '10', uV: 'L', n: '0,5', un: 'mol', T: '300', uT: 'K', up: 'kPa' }));
	assert.equal(p.copy, '124,71 kPa');
	// Given in kelvin: the step is there all the same.
	assert.deepEqual(kelvinStep(p).math, ['T = \\hl{300\\ \\text{K}}']);
	const t = ok(gas({ modo: 'pvnrt', trova: 'T', p: '200', up: 'kPa', V: '10', uV: 'L', n: '0,5', un: 'mol', uT: 'C' }));
	assert.equal(t.copy, '207,97 °C');
	assert.equal(t.rows[1].value, '$\\approx 481{,}12\\ \\text{K}$');
	assert.ok(t.steps.at(-1).math.at(-1).includes('^\\circ\\text{C}'));
	// mmHg goes with atm too.
	assert.equal(ok(gas({ modo: 'pvnrt', trova: 'V', p: '760', up: 'mmHg', n: '1', un: 'mol', T: '273,15', uT: 'K', uV: 'L' })).copy, '22,43 L');
});

test('pV = nRT against floating point, every unknown', () => {
	const PA = { Pa: 1, kPa: 1e3, bar: 1e5, atm: 101325, mmHg: 101325 / 760 };
	const M3 = { m3: 1, L: 1e-3, mL: 1e-6 };
	for (const up of Object.keys(PA))
		for (const uV of Object.keys(M3))
			for (const uT of ['K', 'C'])
				for (const [p, V, n, T] of [
					['1', '22,4', '1', '0'],
					['2,5', '3', '0,4', '350'],
					['750', '0,5', '0,02', '27']
				]) {
					const tK = Number(T.replace(',', '.')) + (uT === 'C' ? 273.15 : 0);
					if (tK <= 0) continue;
					const atm = up === 'atm' || up === 'mmHg';
					const R = atm ? 0.0821 : 8.314;
					// In the units of R.
					const pv = Number(p.replace(',', '.')) * (atm ? PA[up] / 101325 : PA[up]);
					const vv = Number(V.replace(',', '.')) * (atm ? M3[uV] * 1000 : M3[uV]);
					const nv = Number(n.replace(',', '.'));
					const base = { modo: 'pvnrt', p, up, V, uV, n, un: 'mol', T, uT };
					const what = `${p} ${up} ${V} ${uV} ${n} ${T} ${uT}`;
					close(num(ok(gas({ ...base, trova: 'n' }), what).copy), (pv * vv) / (R * tK), `n ${what}`, 2e-3);
					close(num(ok(gas({ ...base, trova: 'V' }), what).copy), ((nv * R * tK) / pv) / (atm ? M3[uV] * 1000 : M3[uV]), `V ${what}`, 2e-3);
					close(num(ok(gas({ ...base, trova: 'p' }), what).copy), ((nv * R * tK) / vv) / (atm ? PA[up] / 101325 : PA[up]), `p ${what}`, 2e-3);
					const tRes = (pv * vv) / (nv * R);
					close(num(ok(gas({ ...base, trova: 'T' }), what).copy), uT === 'C' ? tRes - 273.15 : tRes, `T ${what}`, 2e-3);
				}
});

test('transformations: the examples', () => {
	const b = ok(gas({ modo: 'boyle', trova: 'V2', p1: '1', up1: 'atm', V1: '3', uV1: 'L', p2: '2,5', up2: 'atm', uV2: 'L' }));
	assert.equal(b.copy, '1,2 L');
	assert.equal(kelvinStep(b), undefined);
	assert.equal(ok(gas({ modo: 'boyle', trova: 'p2', p1: '1', up1: 'atm', V1: '3', uV1: 'L', V2: '500', uV2: 'mL', up2: 'kPa' })).copy, '607,95 kPa');
	const c = ok(gas({ modo: 'charles', trova: 'V2', V1: '2', uV1: 'L', T1: '20', uT1: 'C', T2: '80', uT2: 'C', uV2: 'L' }));
	assert.equal(c.copy, '2,409 L');
	assert.equal(kelvinStep(c).math.filter((m) => m.includes('\\hl')).length, 2);
	assert.equal(ok(gas({ modo: 'charles', trova: 'T2', V1: '2', uV1: 'L', T1: '300', uT1: 'K', V2: '3', uV2: 'L', uT2: 'C' })).copy, '176,85 °C');
	assert.equal(ok(gas({ modo: 'gaylussac', trova: 'T1', p1: '1', up1: 'atm', T2: '100', uT2: 'C', p2: '2', up2: 'atm', uT1: 'C' })).copy, '-86,575 °C');
	assert.equal(ok(gas({ modo: 'gaylussac', trova: 'p2', p1: '200', up1: 'kPa', T1: '20', uT1: 'C', T2: '80', uT2: 'C', up2: 'kPa' })).copy, '240,93 kPa');
	const g = ok(gas({ modo: 'generale', trova: 'V2', p1: '1', up1: 'atm', V1: '10', uV1: 'L', T1: '27', uT1: 'C', p2: '2', up2: 'atm', T2: '127', uT2: 'C', uV2: 'L' }));
	assert.equal(g.copy, '6,666 L');
	assert.equal(g.steps[1].math[0], '\\hl{V_2} = \\dfrac{p_1 V_1 T_2}{p_2 T_1}');
	// The inverse formulas when the unknown is in a denominator.
	const t1 = ok(gas({ modo: 'generale', trova: 'T1', p1: '1', up1: 'atm', V1: '10', uV1: 'L', p2: '2', up2: 'atm', V2: '6', uV2: 'L', T2: '400', uT2: 'K', uT1: 'K' }));
	assert.equal(t1.steps[1].math[0], '\\hl{T_1} = \\dfrac{p_1 V_1 T_2}{p_2 V_2}');
	assert.equal(t1.copy, '333,33 K');
});

test('transformations against floating point, every law and every unknown', () => {
	const PA = { Pa: 1, kPa: 1e3, atm: 101325, bar: 1e5 };
	const L = { L: 1, mL: 1e-3, m3: 1e3 };
	const state = { p1: ['1,5', 'atm'], V1: ['4', 'L'], T1: ['20', 'C'], p2: ['120', 'kPa'], V2: ['2500', 'mL'], T2: ['350', 'K'] };
	const si = (key) => {
		const [v, u] = state[key];
		const x = Number(v.replace(',', '.'));
		if (key[0] === 'p') return x * PA[u];
		if (key[0] === 'V') return x * L[u];
		return u === 'C' ? x + 273.15 : x;
	};
	for (const law of LAWS.filter((l) => l.id !== 'pvnrt')) {
		const keys = law.vars.map((x) => x.key);
		for (const unknown of keys) {
			// The expected value from the other ones, with the law as num1·den2 = num2·den1.
			const [n1, d1, n2, d2] = law.sides;
			const prod = (ks) => ks.reduce((a, k) => a * (k === unknown ? 1 : si(k)), 1);
			const left = [...n1, ...d2];
			const right = [...n2, ...d1];
			const inLeft = left.includes(unknown);
			const expected = inLeft ? prod(right) / prod(left) : prod(left) / prod(right);
			const input = { modo: law.id, trova: unknown };
			for (const k of keys) {
				input[`u${k}`] = state[k][1];
				if (k !== unknown) input[k] = state[k][0];
			}
			// The result in the unit of the unknown's select.
			const [, u] = state[unknown];
			const scale = unknown[0] === 'p' ? PA[u] : unknown[0] === 'V' ? L[u] : 1;
			const shift = unknown[0] === 'T' && u === 'C' ? 273.15 : 0;
			const o = ok(gas(input), `${law.id} ${unknown}`);
			close(num(o.copy), expected / scale - shift, `${law.id} ${unknown}`, 2e-3);
			if (law.vars.some((x) => x.kind === 'T' && x.key !== unknown)) assert.ok(kelvinStep(o), `${law.id} ${unknown}: kelvin step`);
		}
	}
});

test('gas laws: wrong inputs', () => {
	for (const input of [
		{ modo: 'pvnrt', trova: 'V', p: '', up: 'atm', n: '2', un: 'mol', T: '25', uT: 'C' },
		{ modo: 'pvnrt', trova: 'V', p: '1', up: 'atm', n: '-2', un: 'mol', T: '25', uT: 'C' },
		{ modo: 'pvnrt', trova: 'V', p: '1', up: 'atm', n: '2', un: 'mol', T: '-300', uT: 'C' },
		{ modo: 'pvnrt', trova: 'V', p: '1', up: 'atm', n: '2', un: 'mol', T: '0', uT: 'K' },
		{ modo: 'charles', trova: 'V2', V1: '2', uV1: 'L', T1: 'abc', uT1: 'C', T2: '80', uT2: 'C' },
		{ modo: 'boyle', trova: 'V2', p1: '0', up1: 'atm', V1: '3', uV1: 'L', p2: '2', up2: 'atm' }
	]) {
		const o = gas(input);
		assert.equal(o.ok, false, JSON.stringify(input));
		assertReadable(o);
	}
	// An unknown not in the law falls back to the last quantity.
	assert.ok(gas({ modo: 'boyle', trova: 'n', p1: '1', up1: 'atm', V1: '3', uV1: 'L', p2: '2', up2: 'atm', uV2: 'L' }).ok);
});

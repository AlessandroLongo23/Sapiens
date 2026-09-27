// Physics formulas: the shared quantities engine (numbers, scientific notation, units), uniform and accelerated
// motion, density, energies, Ohm's law. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { parseNumber, fmt, q, howTex, sqrtVal, exact } = await jiti.import('../../src/lib/tools/grandezze.ts');
const { motoUniforme, densita, ohm, energiaCinetica, energiaPotenziale, motoAccelerato } = await jiti.import('../../src/lib/tools/fisica.ts');

/** The number at the start of a copied result: "150 000 m" → 150000, "1,203 · 10^24" → 1.203e24. */
function num(copy) {
	const m = /^(-?\d{1,3}(?: \d{3})+|-?\d+)(?:,(\d+))?(?: · 10\^(-?\d+))?/.exec(copy);
	assert.ok(m, `not a number: ${copy}`);
	return Number(`${m[1].replace(/ /g, '')}.${m[2] ?? '0'}`) * 10 ** Number(m[3] ?? 0);
}
const ok = (o) => {
	assert.ok(o.ok, o.error);
	assertReadable(o);
	return o;
};
const close = (a, b, what = '') => assert.ok(Math.abs(a - b) <= 1e-3 * Math.max(1, Math.abs(b)), `${what}: ${a} vs ${b}`);

test('numbers in, with scientific notation', () => {
	assert.equal(parseNumber('12,5').toString(), '25/2');
	assert.equal(parseNumber('1.000').toString(), '1000');
	assert.equal(parseNumber('-3').toString(), '-3');
	assert.equal(parseNumber('6,022e23').toString(), '602200000000000000000000');
	assert.equal(parseNumber('3·10^8').toString(), '300000000');
	assert.equal(parseNumber('3*10^-4').toString(), '3/10000');
	assert.equal(parseNumber('3 x 10^8').toString(), '300000000');
	assert.equal(parseNumber('1,5E-3').toString(), '3/2000');
	assert.equal(parseNumber('10^3').toString(), '1000');
	assert.equal(parseNumber('−2').toString(), '-2');
	assert.equal(parseNumber(''), null);
	assert.equal(parseNumber('abc'), null);
	assert.equal(parseNumber('1e999'), null);
	assert.equal(parseNumber('2,5,3'), null);
});

test('numbers out: decimals, rounding, scientific notation', () => {
	const f = (s) => fmt(parseNumber(s));
	assert.deepEqual(f('12,5'), { tex: '12{,}5', text: '12,5', exact: true });
	assert.deepEqual(f('150000'), { tex: '150\\,000', text: '150 000', exact: true });
	assert.equal(f('1234').text, '1234');
	assert.equal(fmt(q(1, 3)).text, '0,3333');
	assert.equal(fmt(q(1, 3)).exact, false);
	assert.equal(fmt(q(250, 9)).text, '27,78');
	assert.equal(fmt(q(3000, 7)).text, '428,57');
	assert.equal(f('0,002553').text, '0,002553');
	assert.equal(f('1000000').text, '1 · 10^6');
	assert.equal(f('6,022e23').tex, '6{,}022 \\cdot 10^{23}');
	assert.equal(f('6,02214076e23').text, '6,022 · 10^23');
	assert.equal(f('6,02214076e23').exact, false);
	assert.equal(f('0,0001').text, '1 · 10^-4');
	assert.equal(f('0,00099996').text, '1 · 10^-3');
	assert.equal(f('-0,5').text, '-0,5');
	assert.equal(f('0').text, '0');
	assert.equal(f('999999,9999').text, '999 999,9999');
	assert.equal(f('999999,9999999').text, '1 000 000');
	// Every value between 10^-8 and 10^9 reads back within the rounding.
	for (let i = 0; i < 2000; i++) {
		const x = Math.exp((Math.random() * 38 - 18) * Math.LN10 * 0.5) * (Math.random() < 0.2 ? -1 : 1);
		const v = q(BigInt(Math.round(x * 1e9)), 1_000_000_000n);
		if (v.isZero()) continue;
		const back = num(fmt(v).text);
		assert.ok(Math.abs(back - v.toNumber()) <= 5.01e-4 * Math.abs(v.toNumber()) + 1e-12, `${v} → ${fmt(v).text}`);
	}
});

test('conversions and roots', () => {
	assert.equal(howTex(q(1000)), '\\cdot 1000');
	assert.equal(howTex(q(1, 1000)), ': 1000');
	assert.equal(howTex(q(5, 18)), ': 3{,}6');
	assert.equal(howTex(q(18, 5)), '\\cdot 3{,}6');
	assert.equal(howTex(q(1, 1_000_000)), ': 10^{6}');
	assert.equal(howTex(q(1)), '');
	assert.equal(sqrtVal(exact(q(225, 4))).q.toString(), '15/2');
	assert.equal(sqrtVal(exact(q(2))).approx, true);
	close(sqrtVal(exact(q(2))).q.toNumber(), Math.SQRT2);
});

test('uniform motion', () => {
	const o = ok(motoUniforme({ trova: 'v', s: '150', us: 'km', t: '2', ut: 'h', uv: 'kmh' }));
	assert.equal(o.copy, '75 km/h');
	assert.match(o.rows[1].value, /20\{,\}83/);
	assert.equal(ok(motoUniforme({ trova: 's', v: '12', uv: 'ms', t: '30', ut: 's', us: 'm' })).copy, '360 m');
	assert.equal(ok(motoUniforme({ trova: 't', s: '300', us: 'km', v: '120', uv: 'kmh', ut: 'h' })).copy, '2,5 h');
	assert.equal(ok(motoUniforme({ trova: 't', s: '300', us: 'km', v: '120', uv: 'kmh', ut: 'min' })).copy, '150 min');
	assert.equal(ok(motoUniforme({ trova: 'v', s: '100', us: 'm', t: '9,58', ut: 's', uv: 'ms' })).copy, '10,44 m/s');
	// Brute force: s = v · t in every direction and unit.
	for (let v = 1; v <= 30; v += 3)
		for (let t = 1; t <= 50; t += 7) {
			assert.equal(num(motoUniforme({ trova: 's', v: String(v), uv: 'ms', t: String(t), ut: 's', us: 'm' }).copy), v * t);
			assert.equal(num(motoUniforme({ trova: 'v', s: String(v * t), us: 'm', t: String(t), ut: 's', uv: 'ms' }).copy), v);
			close(num(motoUniforme({ trova: 't', s: String(v * t), us: 'km', v: String(v), uv: 'kmh', ut: 'h' }).copy), t);
		}
	for (const bad of [
		{ trova: 'v', s: '', t: '2' },
		{ trova: 'v', s: '150', t: '0' },
		{ trova: 'v', s: '-5', t: '2' },
		{ trova: 'v', s: 'abc', t: '2' }
	]) {
		const o = motoUniforme(bad);
		assert.equal(o.ok, false);
		assertReadable(o);
	}
	assert.match(motoUniforme({ trova: 'v', s: '150', t: '0' }).error, /maggiore di zero/);
});

test('density', () => {
	const o = ok(densita({ trova: 'd', m: '540', um: 'g', V: '200', uV: 'cm3', ud: 'gcm3' }));
	assert.equal(o.copy, '2,7 g/cm³');
	assert.match(o.rows[1].value, /2700/);
	assert.equal(ok(densita({ trova: 'm', d: '7870', ud: 'kgm3', V: '2', uV: 'dm3', um: 'kg' })).copy, '15,74 kg');
	assert.equal(ok(densita({ trova: 'V', d: '1000', ud: 'kgm3', m: '1', um: 'kg', uV: 'L' })).copy, '1 L');
	assert.equal(ok(densita({ trova: 'V', d: '920', ud: 'kgm3', m: '1', um: 'kg', uV: 'L' })).copy, '1,087 L');
	assert.equal(ok(densita({ trova: 'd', m: '50', um: 'g', V: '25', uV: 'mL', ud: 'gmL' })).copy, '2 g/mL');
	assert.equal(ok(densita({ trova: 'd', m: '1,2', um: 'g', V: '1', uV: 'L', ud: 'gL' })).copy, '1,2 g/L');
	// The inverse steps.
	const v = ok(densita({ trova: 'V', d: '1000', ud: 'kgm3', m: '1', um: 'kg', uV: 'm3' }));
	assert.match(JSON.stringify(v.steps), /Moltiplica i due membri per \$V\$, poi dividili per \$d\$/);
	assert.equal(densita({ trova: 'd', m: '5', V: '0' }).ok, false);
});

test("Ohm's law and power", () => {
	const o = ok(ohm({ trova: 'I', V: '12', uV: 'V', R: '240', uR: 'ohm', uI: 'mA' }));
	assert.equal(o.copy, '50 mA');
	assert.equal(o.rows.at(-1).label, 'Potenza elettrica');
	assert.equal(o.rows.at(-1).value, '$0{,}6\\ \\text{W}$');
	assert.equal(ok(ohm({ trova: 'R', V: '230', uV: 'V', I: '2', uI: 'A', uR: 'ohm' })).copy, '115 Ω');
	assert.equal(ok(ohm({ trova: 'V', I: '20', uI: 'mA', R: '470', uR: 'ohm', uV: 'V' })).copy, '9,4 V');
	assert.equal(ok(ohm({ trova: 'I', V: '9', uV: 'V', R: '4,7', uR: 'kohm', uI: 'mA' })).copy, '1,915 mA');
	assert.equal(ok(ohm({ trova: 'R', V: '5', uV: 'kV', I: '1', uI: 'mA', uR: 'Mohm' })).copy, '5 MΩ');
	// Six steps or more are grouped.
	const g = ok(ohm({ trova: 'I', V: '9', uV: 'V', R: '4,7', uR: 'kohm', uI: 'mA' }));
	assert.ok(g.steps.length > 5 && g.steps[0].group);
});

test('kinetic energy', () => {
	const o = ok(energiaCinetica({ trova: 'K', m: '1200', um: 'kg', v: '90', uv: 'kmh', uK: 'J' }));
	assert.equal(o.copy, '375 000 J');
	assert.equal(ok(energiaCinetica({ trova: 'K', m: '1200', um: 'kg', v: '90', uv: 'kmh', uK: 'kJ' })).copy, '375 kJ');
	assert.equal(ok(energiaCinetica({ trova: 'K', m: '450', um: 'g', v: '20', uv: 'ms', uK: 'J' })).copy, '90 J');
	assert.equal(ok(energiaCinetica({ trova: 'v', m: '2', um: 'kg', K: '100', uK: 'J', uv: 'ms' })).copy, '10 m/s');
	assert.equal(ok(energiaCinetica({ trova: 'm', v: '36', uv: 'kmh', K: '5', uK: 'kJ', um: 'kg' })).copy, '100 kg');
	const root = ok(energiaCinetica({ trova: 'v', m: '3', um: 'kg', K: '100', uK: 'J', uv: 'ms' }));
	assert.equal(root.copy, '8,165 m/s');
	assert.match(root.rows[0].value, /approx/);
	for (let m = 1; m < 50; m += 7)
		for (let v = 1; v < 40; v += 5) {
			const K = num(energiaCinetica({ trova: 'K', m: String(m), um: 'kg', v: String(v), uv: 'ms' }).copy);
			assert.equal(K, (m * v * v) / 2);
			close(num(energiaCinetica({ trova: 'v', m: String(m), um: 'kg', K: String(K), uK: 'J', uv: 'ms' }).copy), v);
			close(num(energiaCinetica({ trova: 'm', v: String(v), uv: 'ms', K: String(K), uK: 'J', um: 'kg' }).copy), m);
		}
});

test('gravitational potential energy', () => {
	assert.equal(ok(energiaPotenziale({ trova: 'U', m: '500', um: 'g', h: '80', uh: 'cm', g: '9,8', uU: 'J' })).copy, '3,92 J');
	assert.equal(ok(energiaPotenziale({ trova: 'U', m: '60', um: 'kg', h: '3', uh: 'm', g: '9,81', uU: 'J' })).copy, '1765,8 J');
	assert.equal(ok(energiaPotenziale({ trova: 'h', m: '2', um: 'kg', U: '196', uU: 'J', g: '9,8', uh: 'm' })).copy, '10 m');
	assert.equal(ok(energiaPotenziale({ trova: 'm', h: '10', uh: 'm', U: '196', uU: 'J', g: '9,8', um: 'kg' })).copy, '2 kg');
	const moon = ok(energiaPotenziale({ trova: 'U', m: '60', um: 'kg', h: '3', uh: 'm', g: '1,62', uU: 'J' }));
	assert.equal(moon.copy, '291,6 J');
	assert.match(moon.steps[0].then, /Qui/);
	assert.equal(energiaPotenziale({ trova: 'U', m: '60', h: '3', g: '' }).ok, false);
	assert.equal(energiaPotenziale({ trova: 'U', m: '60', h: '-3', g: '9,8' }).ok, false);
});

test('uniformly accelerated motion: examples', () => {
	const s = ok(motoAccelerato({ f: 's', trova: 's', v0: '36', uv0: 'kmh', a: '2', t: '5', ut: 's', us: 'm' }));
	assert.equal(s.copy, '75 m');
	assert.equal(ok(motoAccelerato({ f: 'v', trova: 'a', v0: '0', uv0: 'kmh', v: '100', uv: 'kmh', t: '8', ut: 's' })).copy, '3,472 m/s²');
	assert.equal(ok(motoAccelerato({ f: 'v2', trova: 's', v0: '90', uv0: 'kmh', v: '0', uv: 'kmh', a: '-5', us: 'm' })).copy, '62,5 m');
	const t = ok(motoAccelerato({ f: 's', trova: 't', v0: '5', uv0: 'ms', a: '2', s: '50', us: 'm', ut: 's' }));
	assert.equal(t.copy, '5 s');
	assert.ok(t.steps[0].group);
	assert.equal(ok(motoAccelerato({ f: 's', trova: 't', v0: '3', uv0: 'ms', a: '2', s: '12', us: 'm', ut: 's' })).copy, '2,275 s');
	assert.equal(ok(motoAccelerato({ f: 's', trova: 't', v0: '4', uv0: 'ms', a: '0', s: '12', us: 'm', ut: 's' })).copy, '3 s');
	assert.equal(ok(motoAccelerato({ f: 'v2', trova: 'v', v0: '0', uv0: 'ms', a: '3', s: '24', us: 'm', uv: 'kmh' })).copy, '43,2 km/h');
	// Braking to a stop, then a distance beyond it.
	assert.match(motoAccelerato({ f: 'v2', trova: 'v', v0: '10', uv0: 'ms', a: '-2', s: '30', us: 'm' }).error, /si ferma prima/);
	assert.match(motoAccelerato({ f: 's', trova: 't', v0: '10', uv0: 'ms', a: '-2', s: '9', us: 'm' }).error, /due volte/);
	assert.match(motoAccelerato({ f: 's', trova: 't', v0: '10', uv0: 'ms', a: '-2', s: '30', us: 'm' }).error, /non arriva mai/);
	assert.match(motoAccelerato({ f: 'v', trova: 't', v0: '10', v: '5', a: '2' }).error, /negativo/);
	assert.match(motoAccelerato({ f: 'v', trova: 't', v0: '10', v: '5', a: '0' }).error, /uniforme/);
	assert.match(motoAccelerato({ f: 'v2', trova: 's', v0: '20', v: '0', a: '5' }).error, /negativ/);
	assert.equal(motoAccelerato({ f: 'v2', trova: 'a', v0: '20', v: '0', s: '0' }).ok, false);
	assert.equal(motoAccelerato({ f: 'v', trova: 'v', v0: '1', a: '2', t: '0' }).ok, false);
});

test('uniformly accelerated motion: every formula, every unknown, against brute force', () => {
	let checked = 0;
	for (let v0 = -4; v0 <= 12; v0 += 2)
		for (let a = -3; a <= 3; a++)
			for (let t = 1; t <= 9; t += 2) {
				const v = v0 + a * t;
				const s = v0 * t + (a * t * t) / 2;
				const base = { uv0: 'ms', uv: 'ms', ua: 'ms2', ut: 's', us: 'm' };
				const D = { v0: String(v0), v: String(v), a: String(a), t: String(t), s: String(s).replace('.', ',') };
				const run = (f, trova) => {
					const o = motoAccelerato({ ...base, ...D, f, trova, [trova]: '' });
					if (o.ok && checked++ % 7 === 0) assertReadable(o);
					return o;
				};
				assert.equal(num(run('v', 'v').copy), v);
				assert.equal(num(run('v', 'v0').copy), v0);
				close(num(run('v', 'a').copy), a);
				if (a !== 0) close(num(run('v', 't').copy), t);
				close(num(run('s', 's').copy), s);
				close(num(run('s', 'v0').copy), v0);
				close(num(run('s', 'a').copy), a);
				const ts = run('s', 't');
				if (ts.ok) close(num(ts.copy), t, `t from s, v0=${v0} a=${a} t=${t}`);
				else assert.match(ts.error, /due volte|negativo|fermo/, `v0=${v0} a=${a} t=${t}: ${ts.error}`);
				if (v >= 0) close(num(run('v2', 'v').copy), v);
				if (v0 >= 0) {
					const r = run('v2', 'v0');
					if (r.ok) close(num(r.copy), v0);
				}
				if (s !== 0) close(num(run('v2', 'a').copy), a);
				if (a !== 0) {
					const r = run('v2', 's');
					if (s >= 0) close(num(r.copy), s);
				}
			}
	assert.ok(checked > 100);
});

// Degrees, primes and seconds to decimal degrees and back, with the divisions and multiplications by 60.
// Run with `node --test tests/unit/tools-gradi-sessagesimali.test.mjs`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { gradiSessagesimali, angleFromFloat } = await jiti.import('../../src/lib/tools/gradi-sessagesimali.ts');

const toDec = (g, p, s) => {
	const o = gradiSessagesimali('dms', String(g), String(p), String(s), '');
	assert.ok(o.ok, `${g} ${p} ${s}: ${o.error}`);
	return o;
};
const toDms = (n) => {
	const o = gradiSessagesimali('dec', '', '', '', String(n).replace('.', ','));
	assert.ok(o.ok, `${n}: ${o.error}`);
	return o;
};
const stepText = (o) => o.steps.flatMap((s) => [s.say, ...(s.math ?? []), s.then ?? '']).join(' ');

test('degrees, primes and seconds to decimal degrees', () => {
	assert.equal(toDec(23, 15, 36).copy, '23,26°');
	assert.equal(toDec(22, 30, '').copy, '22,5°');
	assert.equal(toDec(10, 20, '').copy, '10,3333°');
	assert.match(toDec(10, 20, '').rows[0].value, /\\approx 10\{,\}3333/);
	assert.equal(toDec(-10, 30, '').copy, '-10,5°');
	assert.equal(toDec(45, '', '').copy, '45°');
	assert.equal(toDec(0, 0, 36).copy, '0,01°');
	assert.equal(toDec(12, 0, '7,2').copy, '12,002°');
	const t = stepText(toDec(23, 15, 36));
	assert.match(t, /36'' = \\dfrac\{36\}\{60\}'/);
	assert.match(t, /15' \+ 0\{,\}6' = \\hl\{15\{,\}6'\}/);
	assert.match(t, /\\dfrac\{15\{,\}6\}\{60\}\^\\circ/);
	assert.match(t, /23\^\\circ \+ 0\{,\}26\^\\circ = \\hl\{23\{,\}26\^\\circ\}/);
});

test('decimal degrees to degrees, primes and seconds', () => {
	assert.equal(toDms('23,26').copy, '23° 15′ 36″');
	assert.equal(toDms('22,5').copy, '22° 30′ 0″');
	assert.equal(toDms('77,1429').copy, '77° 8′ 34″');
	assert.match(toDms('77,1429').rows[0].value, /\\approx 77/);
	assert.equal(toDms('-3,5').copy, '-3° 30′ 0″');
	assert.equal(toDms('45').copy, '45° 0′ 0″');
	assert.equal(toDms('23,26°').copy, '23° 15′ 36″');
	// Rounded seconds that make 60 carry into the primes.
	const carry = toDms('10,99999');
	assert.equal(carry.copy, '11° 0′ 0″');
	assert.match(stepText(carry), /un primo in più/);
	const t = stepText(toDms('23,26'));
	assert.match(t, /0\{,\}26 \\cdot 60 = \\hl\{15\{,\}6'\}/);
	assert.match(t, /0\{,\}6 \\cdot 60 = \\hl\{36''\}/);
});

test('round trips on many angles', () => {
	for (let g = 0; g <= 359; g += 17)
		for (let p = 0; p < 60; p += 7)
			for (let s = 0; s < 60; s += 11) {
				const exact = g + p / 60 + s / 3600;
				const dec = Number(toDec(g, p, s).copy.replace('°', '').replace(',', '.'));
				assert.ok(Math.abs(dec - exact) <= 5e-5 + 1e-12, `${g} ${p} ${s}: ${dec}`);
				// Back from the value to eight decimals: the same three numbers.
				const back = toDms(exact.toFixed(8));
				const [bg, bp, bs] = back.copy.match(/\d+/g).map(Number);
				assert.deepEqual([bg, bp, bs], [g, p, s], `${g} ${p} ${s} → ${back.copy}`);
			}
	for (let x = 0; x < 400; x += 1.2345) {
		const v = Number(x.toFixed(4));
		const t = Math.round(v * 3600);
		const [bg, bp, bs] = toDms(String(v)).copy.match(/\d+/g).map(Number);
		assert.deepEqual([bg, bp, bs], [Math.floor(t / 3600), Math.floor((t % 3600) / 60), t % 60], `${v}`);
	}
});

test('angles found by a calculation', () => {
	assert.deepEqual(angleFromFloat(36.86989764584402), { dec: { tex: '36{,}87^\\circ', text: '36,87°' }, dms: { tex: "36^\\circ\\, 52'\\, 12''", text: '36° 52′ 12″' } });
	assert.equal(angleFromFloat(59.99999).dms.text, '60° 0′ 0″');
});

test('every string typesets and every sentence is short', () => {
	for (const [g, p, s] of [
		[23, 15, 36],
		[10, 20, ''],
		[-10, 30, ''],
		[45, '', ''],
		[0, 0, 36],
		[12, 0, '7,2'],
		[359, 59, 59]
	])
		assertReadable(toDec(g, p, s), `${g} ${p} ${s}`);
	for (const n of ['23,26', '22,5', '77,1429', '-3,5', '45', '10,99999', '0,0001']) assertReadable(toDms(n), n);
});

test('wrong input', () => {
	const bad = (o) => {
		assert.equal(o.ok, false);
		assertReadable(o);
	};
	bad(gradiSessagesimali('dms', '', '15', '36', ''));
	bad(gradiSessagesimali('dms', '23,5', '15', '36', ''));
	bad(gradiSessagesimali('dms', '23', '60', '', ''));
	bad(gradiSessagesimali('dms', '23', '15,5', '', ''));
	bad(gradiSessagesimali('dms', '23', '15', '60', ''));
	bad(gradiSessagesimali('dms', '23', '-5', '', ''));
	bad(gradiSessagesimali('dms', 'abc', '', '', ''));
	bad(gradiSessagesimali('dec', '', '', '', ''));
	bad(gradiSessagesimali('dec', '', '', '', 'abc'));
	bad(gradiSessagesimali('dec', '', '', '', "23° 15'"));
	bad(gradiSessagesimali('boh', '', '', '', '23'));
	assert.match(gradiSessagesimali('dms', '23', '60', '', '').error, /60 primi fanno già un grado/);
});

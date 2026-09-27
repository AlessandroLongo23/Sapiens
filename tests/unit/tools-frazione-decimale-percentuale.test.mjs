// One number as a fraction, a decimal and a percentage: exact, periodic kept periodic, checked on many fractions.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { frazioneDecimalePercentuale: fdp } = await jiti.import('../../src/lib/tools/frazione-decimale-percentuale.ts');

const gcd = (a, b) => (b ? gcd(b, a % b) : a);

/** a/b as the books write it with the period in brackets: 0,58(3). */
function periodic(a, b) {
	const int = Math.floor(a / b);
	let r = a % b;
	const seen = new Map();
	let digits = '';
	while (r && !seen.has(r)) {
		seen.set(r, digits.length);
		r *= 10;
		digits += Math.floor(r / b);
		r %= b;
	}
	if (!r) return `${int}${digits ? `,${digits}` : ''}`;
	const k = seen.get(r);
	return `${int},${digits.slice(0, k)}(${digits.slice(k)})`;
}

test('from a fraction', () => {
	const cases = { '3/8': '3/8 = 0,375 = 37,5 %', '6/8': '3/4 = 0,75 = 75 %', '1/3': '1/3 = 0,(3) = 33,(3) %', '7/12': '7/12 = 0,58(3) = 58,(3) %', '-5/6': '-5/6 = -0,8(3) = -83,(3) %', '12/4': '3 = 3 = 300 %', '0/5': '0 = 0 = 0 %', '5/-4': '-5/4 = -1,25 = -125 %' };
	for (const [x, copy] of Object.entries(cases)) {
		const o = fdp(x, 'frazione');
		assert.equal(o.copy, copy, x);
		assertReadable(o, x);
	}
	assert.match(fdp('7/12', 'frazione').steps[0].then, /periodico misto/);
	assert.match(fdp('1/3', 'frazione').steps[0].then, /periodico semplice/);
	assert.match(fdp('3/8', 'frazione').steps[0].then, /limitato/);
	// A long period is rounded, and said.
	const long = fdp('1/97', 'frazione');
	assertReadable(long, '1/97');
	assert.equal(long.rows[1].value, '$\\approx 0{,}0103092784$');
});

test('from a decimal', () => {
	const cases = { '0,375': '3/8 = 0,375 = 37,5 %', '0,1(6)': '1/6 = 0,1(6) = 16,(6) %', '2,3(18)': '51/22 = 2,3(18) = 231,(81) %', '5': '5 = 5 = 500 %', '-0,08': '-2/25 = -0,08 = -8 %', '0,(9)': '1 = 1 = 100 %' };
	for (const [x, copy] of Object.entries(cases)) {
		const o = fdp(x, 'decimale');
		assert.equal(o.copy, copy, x);
		assertReadable(o, x);
	}
	assert.equal(fdp('0,5%', 'decimale').ok, false);
});

test('from a percentage', () => {
	const cases = { '37,5': '3/8 = 0,375 = 37,5 %', '12,5 %': '1/8 = 0,125 = 12,5 %', '33,(3)': '1/3 = 0,(3) = 33,(3) %', '150': '3/2 = 1,5 = 150 %', '7': '7/100 = 0,07 = 7 %', '-20': '-1/5 = -0,2 = -20 %', '0': '0 = 0 = 0 %', '0,0(3)': '1/3000 = 0,000(3) = 0,0(3) %' };
	for (const [x, copy] of Object.entries(cases)) {
		const o = fdp(x, 'percentuale');
		assert.equal(o.copy, copy, x);
		assertReadable(o, x);
	}
});

test('wrong inputs', () => {
	for (const [x, from] of [
		['', 'frazione'],
		['3/0', 'frazione'],
		['1,5/2', 'frazione'],
		['abc', 'decimale'],
		['0,1(', 'decimale'],
		['x', 'percentuale'],
		['2000000000/3', 'frazione']
	]) {
		const o = fdp(x, from);
		assert.equal(o.ok, false, x);
		assertReadable(o, x);
	}
});

test('all fractions a/b up to 60, through the three forms and back', () => {
	for (let b = 1; b <= 60; b++)
		for (let a = 0; a <= 2 * b; a++) {
			const g = gcd(a, b) || 1;
			const [n, d] = [a / g, b / g];
			const frac = d === 1 ? `${n}` : `${n}/${d}`;
			const dec = periodic(n, d);
			const pct = periodic(100 * n, d);
			const expected = `${frac} = ${dec} = ${pct} %`;
			const o = fdp(`${a}/${b}`, 'frazione');
			const period = (s) => (/\((\d+)\)/.exec(s)?.[1].length ?? 0);
			if (period(dec) > 24) {
				// A period longer than 24 digits is shown rounded to 10 decimals.
				assert.equal(o.rows[1].value, `$\\approx ${(n / d).toFixed(10).replace('.', '{,}')}$`, `${a}/${b}`);
				continue;
			}
			assert.equal(o.copy, expected, `${a}/${b}`);
			// The decimal field takes up to 12 digits, as the generating fraction tool.
			const short = (s) => s.replace(/\D/g, '').length <= 12;
			if (short(dec)) assert.equal(fdp(dec, 'decimale').copy, expected, dec);
			if (short(pct)) assert.equal(fdp(pct, 'percentuale').copy, expected, pct);
			if ((a * 7 + b) % 41 === 0 && dec.length < 12 && pct.length < 12) {
				assertReadable(o, `${a}/${b}`);
				assertReadable(fdp(dec, 'decimale'), dec);
				assertReadable(fdp(pct, 'percentuale'), pct);
			}
		}
});

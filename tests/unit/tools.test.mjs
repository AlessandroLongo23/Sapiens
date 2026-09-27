// The calculators' pure logic: Italian numbers, mcm and MCD, percentages.
// Run with `npm run test:unit` (jiti loads the TypeScript sources and their extensionless imports).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { parseDecimal, decimal, parseNaturalList } = await jiti.import('../../src/lib/tools/numbers.ts');
const { mcmMcd } = await jiti.import('../../src/lib/tools/mcm-mcd.ts');
const { percentuale } = await jiti.import('../../src/lib/tools/percentuale.ts');

const str = (r) => (r ? r.toString() : null);

test('numbers as Italians write them', () => {
	assert.equal(str(parseDecimal('12,5')), '25/2');
	assert.equal(str(parseDecimal('12.5')), '25/2');
	assert.equal(str(parseDecimal('1.000')), '1000');
	assert.equal(str(parseDecimal('12.500,5')), '25001/2');
	assert.equal(str(parseDecimal('0.750')), '3/4');
	assert.equal(str(parseDecimal('-3')), '-3');
	assert.equal(str(parseDecimal(',5')), '1/2');
	assert.equal(parseDecimal('abc'), null);
	assert.equal(parseDecimal(''), null);
	assert.deepEqual(parseNaturalList('12, 18 30'), [12, 18, 30]);
	assert.equal(parseNaturalList('12, -3'), null);
});

test('decimals, exact and rounded', () => {
	const r = (s) => parseDecimal(s);
	assert.deepEqual(decimal(r('12,5')), { text: '12,5', tex: '12{,}5', exact: true });
	assert.equal(decimal(r('1').div(r('3')), 4).text, '0,3333');
	assert.equal(decimal(r('2').div(r('3')), 4).text, '0,6667');
	assert.equal(decimal(r('2').div(r('3')), 4).exact, false);
	assert.equal(decimal(r('12345')).text, '12 345');
	assert.equal(decimal(r('12345')).tex, '12\\,345');
	assert.equal(decimal(r('-0,5')).text, '-0,5');
	assert.equal(decimal(r('0,99999999'), 4).text, '1');
});

test('mcm and MCD', () => {
	const mcm = mcmMcd('12, 18, 30', 'mcm');
	assert.equal(mcm.ok && mcm.copy, '180');
	const mcd = mcmMcd('36 48 60', 'mcd');
	assert.equal(mcd.ok && mcd.copy, '12');
	const coprime = mcmMcd('8, 15', 'mcd');
	assert.equal(coprime.ok && coprime.copy, '1');
	assert.match(coprime.steps.join(' '), /primi tra loro/);
	assert.equal(mcmMcd('8, 15', 'mcm').copy, '120');
	assert.equal(mcmMcd('1, 7', 'mcm').copy, '7');
	assert.equal(mcmMcd('12', 'mcm').ok, false);
	assert.equal(mcmMcd('0, 5', 'mcm').ok, false);
	assert.equal(mcmMcd('12, x', 'mcm').ok, false);
	// Checked against brute force.
	const gcd = (a, b) => (b ? gcd(b, a % b) : a);
	for (let a = 1; a <= 40; a++)
		for (let b = 1; b <= 40; b++) {
			assert.equal(mcmMcd(`${a}, ${b}`, 'mcd').copy, String(gcd(a, b)));
			assert.equal(mcmMcd(`${a}, ${b}`, 'mcm').copy, String((a * b) / gcd(a, b)));
		}
});

test('percentages', () => {
	assert.equal(percentuale({ mode: 'di', a: '15', b: '80' }).copy, '12');
	assert.equal(percentuale({ mode: 'di', a: '12,5', b: '40' }).copy, '5');
	assert.equal(percentuale({ mode: 'quale', a: '12', b: '80' }).copy, '15 %');
	assert.equal(percentuale({ mode: 'quale', a: '1', b: '3' }).copy, '33,3333 %');
	assert.equal(percentuale({ mode: 'variazione', a: '80', b: '92' }).copy, '+15 %');
	assert.equal(percentuale({ mode: 'variazione', a: '80', b: '68' }).copy, '-15 %');
	assert.equal(percentuale({ mode: 'sconto', a: '80', b: '15' }).copy, '68');
	assert.equal(percentuale({ mode: 'sconto', a: '80', b: '15', up: true }).copy, '92');
	assert.equal(percentuale({ mode: 'quale', a: '5', b: '0' }).ok, false);
	assert.equal(percentuale({ mode: 'variazione', a: '0', b: '5' }).ok, false);
	assert.equal(percentuale({ mode: 'di', a: 'x', b: '5' }).ok, false);
});

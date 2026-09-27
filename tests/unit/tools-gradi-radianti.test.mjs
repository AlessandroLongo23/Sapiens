// Degrees and radians, with π kept exact.
// Run with `npm run test:unit` (jiti loads the TypeScript sources and their extensionless imports).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { gradiRadianti, parseDegrees, parseRadians } = await jiti.import('../../src/lib/tools/gradi-radianti.ts');
const { assertReadable, rowText, stepText } = await import('./converters-check.mjs');

const conv = (v, a, b) => {
	const o = gradiRadianti(v, a, b);
	assert.ok(o.ok, o.error);
	return o;
};

test('degrees to radians, π exact', () => {
	assert.equal(conv('180', 'gradi', 'rad').copy, 'π rad ≈ 3,1416 rad');
	assert.equal(conv('45', 'gradi', 'rad').copy, 'π/4 rad ≈ 0,7854 rad');
	assert.equal(conv('30', 'gradi', 'rad').copy, 'π/6 rad ≈ 0,5236 rad');
	assert.equal(conv('270', 'gradi', 'rad').copy, '3π/2 rad ≈ 4,7124 rad');
	assert.equal(conv('360', 'gradi', 'rad').copy, '2π rad ≈ 6,2832 rad');
	assert.equal(conv('-60', 'gradi', 'rad').copy, '-π/3 rad ≈ -1,0472 rad');
	assert.equal(conv('22,5', 'gradi', 'rad').copy, 'π/8 rad ≈ 0,3927 rad');
	assert.equal(conv('1', 'gradi', 'rad').copy, 'π/180 rad ≈ 0,0175 rad');
	assert.equal(conv('0', 'gradi', 'rad').copy, '0 rad');
	assert.equal(conv("22° 30'", 'gradi', 'rad').copy, 'π/8 rad ≈ 0,3927 rad');
	assert.equal(conv('22°30′', 'gradi', 'rad').copy, 'π/8 rad ≈ 0,3927 rad');
	assert.match(conv('45', 'gradi', 'rad').rows[0].value, /\\dfrac\{\\pi\}\{4\}/);
	assert.match(stepText(conv('45', 'gradi', 'rad')), /\\dfrac\{45\\pi\}\{180\} = \\hl\{\\dfrac\{\\pi\}\{4\}\}/);
});

test('radians to degrees', () => {
	assert.equal(conv('π', 'rad', 'gradi').copy, '180°');
	assert.equal(conv('pi', 'rad', 'gradi').copy, '180°');
	assert.equal(conv('3π/4', 'rad', 'gradi').copy, '135°');
	assert.equal(conv('3/4 π', 'rad', 'gradi').copy, '135°');
	assert.equal(conv('0,25π', 'rad', 'gradi').copy, '45°');
	assert.equal(conv('-π/6', 'rad', 'gradi').copy, '-30°');
	assert.equal(conv('2π', 'rad', 'gradi').copy, '360°');
	assert.equal(conv('1', 'rad', 'gradi').copy, '57,2958°');
	assert.match(rowText(conv('1', 'rad', 'gradi')), /57\^\\circ\\, 17'\\, 45''/);
	assert.match(rowText(conv('3π/7', 'rad', 'gradi')), /77\^\\circ\\, 8'\\, 34''/);
	assert.deepEqual(
		conv('π/8', 'rad', 'gradi').rows.map((r) => r.value),
		['$22{,}5^\\circ$', "$22^\\circ\\, 30'$"]
	);
	assert.match(stepText(conv('π/8', 'rad', 'gradi')), /22\{,\}5\^\\circ = \\hl\{22\^\\circ\\, 30'\}/);
});

test('sexagesimal degrees', () => {
	assert.equal(parseDegrees("22° 30' 15''").value.toString(), '5401/240');
	assert.equal(parseDegrees('10°').value.toString(), '10');
	assert.equal(parseDegrees('-10° 30′').value.toString(), '-21/2');
	assert.equal(parseDegrees("10° 60'"), null);
	assert.equal(parseDegrees("10,5° 30'"), null);
	assert.equal(conv('22,5', 'gradi', 'gradi').copy, '22° 30′');
	assert.equal(conv("22° 30' 15''", 'gradi', 'gradi').copy, '22,5042°');
	assert.match(conv("22° 30' 15''", 'gradi', 'rad').steps[0].math[0], /\\dfrac\{30\}\{60\}/);
});

test('every string typesets and every sentence is short', () => {
	for (const v of ['45', '0', '1', '-60', '22,5', "22° 30' 15''", "-10° 30'", '77,1429', '720'])
		for (const b of ['gradi', 'rad']) assertReadable(gradiRadianti(v, 'gradi', b), `${v}° → ${b}`);
	for (const v of ['π', '3π/4', '-π/6', '3π/7', '0', '1', '1,5', '-2', '0,25π', '1/2'])
		for (const b of ['gradi', 'rad']) assertReadable(gradiRadianti(v, 'rad', b), `${v} rad → ${b}`);
	for (const bad of [gradiRadianti('abc', 'gradi', 'rad'), gradiRadianti('', 'rad', 'gradi'), gradiRadianti('45', 'gradi', 'giri')]) assertReadable(bad);
});

test('wrong input', () => {
	assert.equal(gradiRadianti('abc', 'gradi', 'rad').ok, false);
	assert.equal(gradiRadianti('', 'rad', 'gradi').ok, false);
	assert.equal(gradiRadianti('π/0', 'rad', 'gradi').ok, false);
	assert.equal(gradiRadianti('45', 'gradi', 'giri').ok, false);
	assert.equal(parseRadians('2ππ'), null);
});

test('round trips on many angles', () => {
	for (let d = -720; d <= 720; d += 7.5) {
		const v = String(d).replace('.', ',');
		const there = conv(v, 'gradi', 'rad');
		const piPart = there.copy.split(' rad')[0];
		const back = conv(piPart, 'rad', 'gradi');
		assert.equal(back.copy, `${v}°`, `${v}° → ${piPart} → ${back.copy}`);
		// The decimal against Math.PI.
		const dec = Number(there.copy.split('≈ ')[1]?.replace(' rad', '').replace(',', '.') ?? 0);
		assert.ok(Math.abs(dec - (d * Math.PI) / 180) < 5e-5, `${v}°: ${dec}`);
	}
	for (let r = -6; r <= 6; r += 0.25) {
		const deg = Number(conv(String(r).replace('.', ','), 'rad', 'gradi').copy.replace('°', '').replace(/ /g, '').replace(',', '.'));
		assert.ok(Math.abs(deg - (r * 180) / Math.PI) < 5e-5, `${r} rad: ${deg}`);
	}
});

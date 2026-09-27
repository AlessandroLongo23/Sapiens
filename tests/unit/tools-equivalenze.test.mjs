// Equivalenze: the comma moved along the scale, exact on the digits.
// Run with `npm run test:unit` (jiti loads the TypeScript sources and their extensionless imports).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { equivalenza, QUANTITIES, QUANTITY_IDS, formatScaled } = await jiti.import('../../src/lib/tools/equivalenze.ts');

const conv = (quantity, value, from, to) => equivalenza({ quantity, value, from, to });
const copy = (...args) => {
	const o = conv(...args);
	assert.ok(o.ok, o.error);
	return o.copy;
};

test('known equivalences', () => {
	assert.equal(copy('lunghezza', '3,5', 'km', 'm'), '3500 m');
	assert.equal(copy('lunghezza', '250', 'cm', 'm'), '2,5 m');
	assert.equal(copy('lunghezza', '7', 'mm', 'km'), '0,000007 km');
	assert.equal(copy('massa', '1,2', 'q', 'kg'), '120 kg');
	assert.equal(copy('massa', '1', 't', 'q'), '10 q');
	assert.equal(copy('massa', '2,3', 'q', 'g'), '230 000 g');
	assert.equal(copy('massa', '500', 'mg', 'g'), '0,5 g');
	assert.equal(copy('capacita', '1,5', 'l', 'ml'), '1500 ml');
	assert.equal(copy('capacita', '3', 'hl', 'l'), '300 l');
	assert.equal(copy('superficie', '1', 'm2', 'cm2'), '10 000 cm²');
	assert.equal(copy('superficie', '3', 'ha', 'm2'), '30 000 m²');
	assert.equal(copy('superficie', '1', 'km2', 'ha'), '100 ha');
	assert.equal(copy('superficie', '5', 'a', 'ca'), '500 ca');
	assert.equal(copy('superficie', '25', 'dm2', 'm2'), '0,25 m²');
	assert.equal(copy('volume', '2,5', 'dm3', 'l'), '2,5 l');
	assert.equal(copy('volume', '1', 'm3', 'l'), '1000 l');
	assert.equal(copy('volume', '1', 'ml', 'cm3'), '1 cm³');
	assert.equal(copy('volume', '1', 'm3', 'cm3'), '1 000 000 cm³');
	assert.equal(copy('volume', '1', 'km3', 'mm3'), '1 000 000 000 000 000 000 mm³');
	assert.equal(copy('tempo', '2,5', 'h', 'min'), '150 min');
	assert.equal(copy('tempo', '90', 'min', 'h'), '1,5 h');
	assert.equal(copy('tempo', '1', 'h', 's'), '3600 s');
	assert.equal(copy('tempo', '100', 's', 'h'), '0,027778 h');
});

test('the steps count the steps of the scale', () => {
	const o = conv('lunghezza', '3,5', 'km', 'm');
	assert.match(o.steps.join(' '), /3 gradini verso destra/);
	assert.match(o.steps.join(' '), /moltiplica per \$10\^\{3\} = 1000\$/);
	const d = conv('superficie', '25', 'dm2', 'm2');
	assert.match(d.steps.join(' '), /1 gradino verso sinistra/);
	assert.match(d.steps.join(' '), /Dividi per 100/);
	assert.match(conv('massa', '1', 'q', 'kg').steps.join(' '), /quadratino/);
	assert.match(conv('superficie', '3', 'ha', 'm2').steps.join(' '), /1\\ \\text\{ha\} = 1\\ \\text\{hm\}\^2/);
	assert.match(conv('tempo', '100', 's', 'min').steps.join(' '), /1\\ \\text\{min\}\\ 40\\ \\text\{s\}/);
	assert.match(conv('tempo', '100', 's', 'min').result, /\\approx/);
});

test('very large and very small results', () => {
	assert.equal(formatScaled({ m: 35n, e: 30 }).text, '3,5 · 10^31');
	assert.equal(formatScaled({ m: 1n, e: -30 }).text, '1 · 10^-30');
	assert.equal(formatScaled({ m: 1n, e: -5 }).text, '0,00001');
	assert.equal(formatScaled({ m: 0n, e: 7 }).text, '0');
	assert.equal(copy('volume', '123456789012345', 'km3', 'mm3'), '1,23456789012345 · 10^32 mm³');
});

test('wrong input', () => {
	assert.equal(conv('lunghezza', 'abc', 'km', 'm').ok, false);
	assert.equal(conv('lunghezza', '', 'km', 'm').ok, false);
	assert.equal(conv('lunghezza', '-3', 'km', 'm').ok, false);
	assert.equal(conv('lunghezza', '3', 'kg', 'm').ok, false);
	assert.equal(conv('boh', '3', 'km', 'm').ok, false);
});

test('round trips and powers of ten on every pair of units', () => {
	const values = ['0', '1', '3,5', '0,007', '1234,5678', '42', '0,1'];
	for (const quantity of QUANTITY_IDS.filter((q) => q !== 'tempo')) {
		const { units, per } = QUANTITIES[quantity];
		for (const a of units)
			for (const b of units)
				for (const v of values) {
					const there = conv(quantity, v, a.id, b.id);
					assert.ok(there.ok);
					if (there.copy.includes('·') || there.copy.replace(/\D/g, '').length > 15) continue; // too long to type back in
					const back = conv(quantity, there.copy.slice(0, -b.text.length - 1).replace(/ /g, ''), b.id, a.id);
					assert.ok(back.ok, `${quantity} ${v} ${a.id} → ${b.id} → ${a.id}: ${back.error}`);
					assert.equal(back.copy, conv(quantity, v, a.id, a.id).copy, `${quantity} ${v} ${a.id} → ${b.id} → ${a.id}`);
					// Against floating point, where it is precise enough.
					const expected = Number(v.replace(',', '.')) * 10 ** (per * (a.pos - b.pos));
					const got = Number(there.copy.slice(0, -b.text.length - 1).replace(/ /g, '').replace(',', '.'));
					assert.ok(Math.abs(got - expected) <= 1e-9 * Math.max(1, Math.abs(expected)), `${quantity} ${v} ${a.id} → ${b.id}: ${got} vs ${expected}`);
				}
	}
});

test('time round trips', () => {
	for (const v of ['1', '2,5', '90', '3600', '0,75'])
		for (const a of ['h', 'min', 's'])
			for (const b of ['h', 'min', 's']) {
				const there = conv('tempo', v, a, b);
				if (!there.result.includes('\\approx')) assert.equal(conv('tempo', there.copy.slice(0, there.copy.lastIndexOf(' ')).replace(/ /g, ''), b, a).copy, `${v} ${a}`);
			}
});

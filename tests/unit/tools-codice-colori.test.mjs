// The colour code of resistors, both ways, against every 4-band code. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { COLORS, coloriValore, valoreColori, valueBands, bandRoles, colorsFor } = await jiti.import('../../src/lib/tools/codice-colori.ts');

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

test('colour code: from the colours', () => {
	const o = ok(coloriValore(4, ['giallo', 'viola', 'rosso', 'oro']));
	assert.equal(o.copy, '4,7 kΩ ±5%');
	assert.equal(o.rows[1].value, '$4{,}465\\ \\text{k}\\Omega$');
	assert.equal(o.rows[2].value, '$4{,}935\\ \\text{k}\\Omega$');
	assert.equal(ok(coloriValore(5, ['marrone', 'nero', 'nero', 'marrone', 'marrone'])).copy, '1 kΩ ±1%');
	assert.equal(ok(coloriValore(4, ['marrone', 'nero', 'nero', 'argento'])).copy, '10 Ω ±10%');
	assert.equal(ok(coloriValore(4, ['giallo', 'viola', 'oro', 'oro'])).copy, '4,7 Ω ±5%');
	assert.equal(ok(coloriValore(5, ['arancione', 'arancione', 'bianco', 'argento', 'verde'])).copy, '3,39 Ω ±0,5%');
	assert.equal(ok(coloriValore(4, ['marrone', 'nero', 'verde', 'marrone'])).copy, '1 MΩ ±1%');
	// Every colour is named in words in the table, never only drawn.
	assert.deepEqual(
		o.steps[0].table.rows.map((r) => r[1]),
		['giallo', 'viola', 'rosso', 'oro']
	);
	for (const bad of [
		['nero', 'viola', 'rosso', 'oro'],
		['oro', 'viola', 'rosso', 'oro'],
		['giallo', 'viola', 'rosso', 'arancione'],
		['giallo', 'viola', 'rosso'],
		['giallo', 'viola', 'rosa', 'oro']
	]) {
		const e = coloriValore(4, bad);
		assert.equal(e.ok, false, bad.join());
		assertReadable(e);
	}
});

test('colour code: from the value', () => {
	assert.equal(ok(valoreColori(4, '4,7', 'kohm', '5')).copy, 'giallo, viola, rosso, oro');
	assert.equal(ok(valoreColori(4, '220', 'ohm', '5')).copy, 'rosso, rosso, marrone, oro');
	assert.equal(ok(valoreColori(4, '1', 'ohm', '5')).copy, 'marrone, nero, oro, oro');
	assert.equal(ok(valoreColori(4, '0,47', 'ohm', '10')).copy, 'giallo, viola, argento, argento');
	assert.equal(ok(valoreColori(5, '10', 'kohm', '1')).copy, 'marrone, nero, nero, rosso, marrone');
	assert.equal(ok(valoreColori(5, '4,75', 'kohm', '1')).copy, 'giallo, viola, verde, marrone, marrone');
	assert.equal(ok(valoreColori(4, '1', 'Mohm', '2')).copy, 'marrone, nero, verde, rosso');
	for (const [n, v, u] of [
		[4, '4,75', 'kohm'],
		[5, '4,751', 'kohm'],
		[4, '0,01', 'ohm'],
		[4, '100000', 'Mohm'],
		[4, '0', 'ohm'],
		[4, 'abc', 'ohm'],
		[4, '-10', 'ohm']
	]) {
		const e = valoreColori(n, v, u, '5');
		assert.equal(e.ok, false, `${n} ${v} ${u}`);
		assertReadable(e);
	}
});

test('colour code: every 4-band resistor, both ways', () => {
	const roles = bandRoles(4);
	for (const a of colorsFor(roles[0], true))
		for (const b of colorsFor(roles[1]))
			for (const m of colorsFor(roles[2]))
				for (const t of colorsFor(roles[3])) {
					const o = coloriValore(4, [a.id, b.id, m.id, t.id]);
					assert.ok(o.ok, o.error);
					const expected = (a.digit * 10 + b.digit) * 10 ** m.exp;
					close(ohm(o.copy), expected, `${a.id} ${b.id} ${m.id}`);
					// Back to the colours, from the value in ohm.
					const digits = `${a.digit}${b.digit}`;
					const written = m.exp >= 0 ? digits + '0'.repeat(m.exp) : m.exp === -1 ? `${a.digit},${b.digit}` : `0,${digits}`;
					const vb = valueBands(4, written, 'ohm', t.tol);
					assert.equal(typeof vb, 'object', `${expected}`);
					assert.deepEqual(
						vb.colors.map((c) => c.id),
						[a.id, b.id, m.id, t.id]
					);
				}
	for (const c of COLORS) assert.ok(c.name && c.hex);
	// Readability on a sample of five-band codes.
	for (const m of colorsFor('mult')) {
		assertReadable(coloriValore(5, ['rosso', 'nero', 'viola', m.id, 'marrone']));
		assertReadable(valoreColori(5, '207', 'ohm', '0,25'));
	}
});

// Bases 2, 8, 10 and 16, checked against Number.prototype.toString.
// Run with `npm run test:unit` (jiti loads the TypeScript sources and their extensionless imports).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { convertiBase, parseInBase } = await jiti.import('../../src/lib/tools/binario.ts');
const { assertReadable, stepText } = await import('./converters-check.mjs');

const BASES = [2, 8, 10, 16];
const copy = (v, a, b) => {
	const o = convertiBase(v, a, b);
	assert.ok(o.ok, o.error);
	return o.copy;
};

test('known values', () => {
	assert.equal(copy('25', 10, 2), '11001');
	assert.equal(copy('11001', 2, 10), '25');
	assert.equal(copy('255', 10, 16), 'FF');
	assert.equal(copy('ff', 16, 10), '255');
	assert.equal(copy('0xFF', 16, 2), '11111111');
	assert.equal(copy('0b1010', 2, 8), '12');
	assert.equal(copy('777', 8, 16), '1FF');
	assert.equal(copy('1FF', 16, 8), '777');
	assert.equal(copy('1.000', 10, 2), '1111101000');
	assert.equal(copy('1010 1010', 2, 16), 'AA');
	assert.equal(copy('0', 10, 2), '0');
	assert.equal(copy('00101', 2, 10), '5');
	assert.equal(copy('9007199254740992', 10, 2), '1' + '0'.repeat(53));
});

test('steps as in the lessons', () => {
	const o = convertiBase('25', 10, 2);
	assert.deepEqual(o.rows, [{ label: '25 in binario', value: '$\\mathtt{11001}_{2}$' }]);
	const div = o.steps[0].table;
	assert.deepEqual(div.head, ['Numero', 'Diviso per 2', 'Resto']);
	assert.deepEqual(div.rows, [
		['$25$', '$12$', '$\\hl{1}$'],
		['$12$', '$6$', '$\\hl{0}$'],
		['$6$', '$3$', '$\\hl{0}$'],
		['$3$', '$1$', '$\\hl{1}$'],
		['$1$', '$0$', '$\\hl{1}$']
	]);
	assert.match(o.steps[1].say, /dal basso verso l'alto/);
	assert.match(stepText(convertiBase('171', 10, 16)), /11 = \\hl\{\\mathtt\{B\}\}/);
	const sum = convertiBase('11001', 2, 10);
	assert.deepEqual(sum.steps[0].table.head, ['Cifra', 'Potenza di 2', 'Valore']);
	assert.deepEqual(sum.steps[0].table.rows[0], ['$\\mathtt{1}$', '$2^{4} = 16$', '$1 \\cdot 16 = \\hl{16}$']);
	assert.equal(sum.steps[0].table.rows.length, 5);
	assert.match(stepText(sum), /16 \+ 8 \+ 1 = \\hl\{25\}/);
	assert.match(stepText(convertiBase('11001', 2, 16)), /\$\\mathtt\{0001\}\$ \$\\mathtt\{1001\}\$/);
	assert.match(stepText(convertiBase('1FF', 16, 2)), /\\mathtt\{0001\}\}\$ \$\\hl\{\\mathtt\{1111\}\}\$ \$\\hl\{\\mathtt\{1111\}\}/);
	assert.deepEqual(convertiBase('BEEF', 16, 10).steps[0].table.rows[0].slice(0, 3), ['Valore', '$10$', '$11$']);
	// Long numbers are grouped so they can be read: bits by four, decimals by thousands.
	assert.equal(convertiBase('156', 10, 2).rows[0].value, '$\\mathtt{1001\\,1100}_{2}$');
	assert.equal(convertiBase('11111111111111111', 2, 10).rows[0].value, '$131\\,071_{10}$');
	// A long sum goes on several lines, each with its running total.
	assert.ok(convertiBase(String(2 ** 53 - 1), 10, 2).steps.length === 2);
	assert.ok(convertiBase((2 ** 53 - 1).toString(2), 2, 10).steps[1].math.length > 5);
});

test('every string typesets and every sentence is short', () => {
	const samples = [0, 1, 5, 25, 156, 171, 255, 256, 48879, 2 ** 31, 2 ** 53 - 1, 2 ** 53];
	for (const n of samples)
		for (const a of BASES) for (const b of BASES) assertReadable(convertiBase(n.toString(a), a, b), `${n} (${a}) → ${b}`);
	for (const bad of [convertiBase('102', 2, 10), convertiBase('', 10, 2), convertiBase('-5', 10, 2), convertiBase('G1', 16, 10)]) {
		assertReadable(bad);
		assert.match(bad.error, /per esempio|togli/);
	}
});

test('wrong input', () => {
	assert.match(convertiBase('102', 2, 10).error, /0 e 1/);
	assert.match(convertiBase('89', 8, 10).error, /da 0 a 7/);
	assert.match(convertiBase('G1', 16, 10).error, /da A a F/);
	assert.equal(convertiBase('12,5', 10, 2).ok, false);
	assert.equal(convertiBase('-5', 10, 2).ok, false);
	assert.equal(convertiBase('', 10, 2).ok, false);
	assert.match(convertiBase('9007199254740993', 10, 2).error, /troppo grande/);
	assert.equal(convertiBase('5', 10, 3).ok, false);
	assert.equal(parseInBase('20000000000000', 16), 2n ** 53n);
	assert.equal(typeof parseInBase('20000000000001', 16), 'string');
});

test('many random numbers on every pair of bases, against toString', () => {
	const samples = [0, 1, 2, 7, 8, 15, 16, 255, 256, 2 ** 31, 2 ** 32 - 1, 2 ** 53 - 1, 2 ** 53];
	for (let i = 0; i < 400; i++) samples.push(Math.floor(Math.random() * 2 ** (1 + Math.floor(Math.random() * 53))));
	for (const n of samples)
		for (const a of BASES)
			for (const b of BASES) {
				const written = n.toString(a);
				const got = copy(written, a, b);
				assert.equal(got, n.toString(b).toUpperCase(), `${written} (${a}) → ${b}`);
				assert.equal(copy(got, b, a), written.toUpperCase(), `round trip ${written} (${a}) → ${b} → ${a}`);
			}
});

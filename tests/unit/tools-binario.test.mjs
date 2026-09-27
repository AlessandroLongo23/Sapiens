// Bases 2, 8, 10 and 16, checked against Number.prototype.toString.
// Run with `npm run test:unit` (jiti loads the TypeScript sources and their extensionless imports).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { convertiBase, parseInBase } = await jiti.import('../../src/lib/tools/binario.ts');

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
	const div = convertiBase('25', 10, 2).steps.join(' ');
	assert.match(div, /\\begin\{array\}\{r\|l\} 25 & 1 \\\\ 12 & 0 \\\\ 6 & 0 \\\\ 3 & 1 \\\\ 1 & 1 \\\\ 0 & \\end\{array\}/);
	assert.match(div, /dal basso verso l'alto/);
	assert.match(convertiBase('171', 10, 16).steps.join(' '), /11 \\to \\mathtt\{B\}/);
	const sum = convertiBase('11001', 2, 10).steps.join(' ');
	assert.match(sum, /1 \\cdot 2\^\{4\} \+ 1 \\cdot 2\^\{3\} \+ 0 \\cdot 2\^\{2\} \+ 0 \\cdot 2\^\{1\} \+ 1 \\cdot 2\^\{0\}/);
	assert.match(sum, /16 \+ 8 \+ 1 = 25/);
	assert.match(convertiBase('11001', 2, 16).steps.join(' '), /\\mathtt\{0001\} & \\mathtt\{1001\}/);
	assert.match(convertiBase('1FF', 16, 2).steps.join(' '), /\\mathtt\{0001\} & \\mathtt\{1111\} & \\mathtt\{1111\}/);
	assert.match(convertiBase('BEEF', 16, 10).steps[0], /\\mathtt\{B\} = 11/);
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

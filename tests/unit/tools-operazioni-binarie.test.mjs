// Addition, subtraction and multiplication in base 2, in column: the bits, the carries and borrows, and brute force.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { operazioniBinarie: op } = await jiti.import('../../src/lib/tools/operazioni-binarie.ts');

const bin = (n) => n.toString(2);

test('addition with carries', () => {
	const o = op('1011', '110', 'somma');
	assertReadable(o, 'somma');
	assert.equal(o.copy, '10001');
	assert.equal(o.rows[1].value, '$17$');
	const detail = o.steps[1].table.rows;
	assert.deepEqual(detail[0], ['$1$', '$1 + 0 = 1$', '$\\hl{1}$', '$0$']);
	assert.deepEqual(detail[2], ['$3$', '$0 + 1 + 1 = 2$', '$\\hl{0}$', '$1$']);
	// The carries sit over the column they go into.
	assert.deepEqual(o.steps[2].table.rows[0], ['Riporti', '$1$', '$1$', '$1$', '', '']);
	assert.equal(op('1111', '1', 'somma').copy, '10000');
	assert.equal(op('0', '0', 'somma').copy, '0');
});

test('subtraction with borrows', () => {
	const o = op('1101', '111', 'sottrazione');
	assertReadable(o, 'sottrazione');
	assert.equal(o.copy, '110');
	assert.deepEqual(o.steps[1].table.rows[1], ['$2$', '$0 - 1 \\to 2 - 1 = 1$', '$\\hl{1}$', 'sì']);
	assert.deepEqual(o.steps[2].table.rows[0], ['Prestiti', '$-1$', '$-1$', '', '']);
	assert.equal(op('10000', '1', 'sottrazione').copy, '1111');
	assert.equal(op('101', '101', 'sottrazione').copy, '0');
	assert.equal(op('101', '1101', 'sottrazione').ok, false);
});

test('multiplication', () => {
	const o = op('1011', '101', 'moltiplicazione');
	assertReadable(o, 'moltiplicazione');
	assert.equal(o.copy, '110111');
	assert.equal(o.steps[1].table.rows.length, 6);
	assert.equal(op('1', '0', 'moltiplicazione').copy, '0');
});

test('wrong inputs', () => {
	for (const [a, b, o] of [
		['12', '1', 'somma'],
		['', '1', 'somma'],
		['1', 'x', 'somma'],
		['-101', '1', 'somma'],
		['1'.repeat(33), '1', 'somma'],
		['1'.repeat(17), '1', 'moltiplicazione'],
		['1', '1', 'divisione']
	]) {
		const out = op(a, b, o);
		assert.equal(out.ok, false, `${a} ${o} ${b}`);
		assertReadable(out, `${a} ${o} ${b}`);
	}
	// Spaces, a 0b prefix and leading zeros are fine.
	assert.equal(op('0b0101 1010', '0011', 'somma').copy, bin(0b01011010 + 3));
});

test('brute force on 0 to 70', () => {
	for (let a = 0; a <= 70; a++)
		for (let b = 0; b <= 70; b++) {
			const s = op(bin(a), bin(b), 'somma');
			assert.equal(s.copy, bin(a + b), `${a} + ${b}`);
			const m = op(bin(a), bin(b), 'moltiplicazione');
			assert.equal(m.copy, bin(a * b), `${a} · ${b}`);
			if (a >= b) {
				const d = op(bin(a), bin(b), 'sottrazione');
				assert.equal(d.copy, bin(a - b), `${a} - ${b}`);
				// The grid: the result row read back is the difference.
				const row = d.steps[2].table.rows[3].slice(1).map((c) => (c.match(/\{(\d)\}/) ?? [, ''])[1]).join('');
				assert.equal(row, bin(a - b), `${a} - ${b} grid`);
				if ((a + b) % 23 === 0) assertReadable(d, `${a} - ${b}`);
			}
			if ((a * b) % 31 === 1) {
				assertReadable(s, `${a} + ${b}`);
				assertReadable(m, `${a} · ${b}`);
			}
		}
});

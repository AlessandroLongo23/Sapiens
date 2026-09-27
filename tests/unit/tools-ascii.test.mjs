// Text and ASCII codes, both ways, checked on every printable character against charCodeAt.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { ascii, testoAAscii, asciiATesto } = await jiti.import('../../src/lib/tools/ascii.ts');

const PRINTABLE = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('');

test('known values', () => {
	assert.equal(testoAAscii('Ciao').copy, '67 105 97 111');
	assert.equal(testoAAscii('A a').copy, '65 32 97');
	assert.equal(asciiATesto('67 105 97 111', 'dec').copy, 'Ciao');
	assert.equal(asciiATesto('01000011 01101001 01100001 01101111', 'bin').copy, 'Ciao');
	assert.equal(asciiATesto('43 69 61 6f', 'hex').copy, 'Ciao');
	assert.equal(asciiATesto('0x41, 0x42', 'hex').copy, 'AB');
	assert.equal(asciiATesto('1000001', 'bin').copy, 'A');
	const o = testoAAscii('A');
	assert.deepEqual(o.steps.at(-1).table.rows[0], ['$\\texttt{A}$', '$65$', '$\\mathtt{0100\\,0001}$', '$\\mathtt{41}$']);
	assert.deepEqual(o.steps[1].math, ['65 = 64 + 1', '65 = \\hl{\\mathtt{0100\\,0001}}_2']);
});

test('characters outside ASCII: the code point and a word on UTF-8', () => {
	const o = testoAAscii('però');
	assert.ok(o.ok);
	assert.equal(o.copy, '112 101 114 242');
	const row = o.steps.at(-1).table.rows[3];
	assert.deepEqual(row, ['ò', '$242$', 'non è ASCII', '$\\texttt{U+00F2}$']);
	assert.match(o.steps.at(-1).then, /Unicode.*UTF-8/);
	assert.match(asciiATesto('200', 'dec').error, /arriva a 127/);
	assert.match(asciiATesto('E8', 'hex').error, /arriva a 127/);
	assertReadable(testoAAscii('città è 😀'));
});

test('every string typesets and every sentence is short', () => {
	for (let i = 0; i < PRINTABLE.length; i += 10) {
		const chunk = PRINTABLE.slice(i, i + 10);
		assertReadable(testoAAscii(chunk), chunk);
		const codes = [...chunk].map((c) => c.charCodeAt(0));
		assertReadable(asciiATesto(codes.join(' '), 'dec'), chunk);
		assertReadable(asciiATesto(codes.map((c) => c.toString(2)).join(' '), 'bin'), chunk);
		assertReadable(asciiATesto(codes.map((c) => c.toString(16)).join(' '), 'hex'), chunk);
	}
	assertReadable(asciiATesto('9 10 65', 'dec'));
	assertReadable(testoAAscii('a\tb'));
});

test('wrong input', () => {
	assert.match(testoAAscii('').error, /per esempio/);
	assert.match(testoAAscii('x'.repeat(41)).error, /Al massimo 40/);
	assert.match(asciiATesto('', 'dec').error, /per esempio 67/);
	assert.match(asciiATesto('65 abc', 'dec').error, /"abc" non è un numero/);
	assert.match(asciiATesto('102', 'bin').error, /byte/);
	assert.match(asciiATesto('1G', 'hex').error, /esadecimali/);
	assert.match(asciiATesto('1234', 'dec').error, /da 0 a 127/);
	assert.equal(ascii('65', 'codici', 'boh').copy, 'A');
});

test('every printable character, there and back in every base', () => {
	for (const c of PRINTABLE) {
		const code = c.charCodeAt(0);
		const o = testoAAscii(c);
		assert.equal(o.copy, String(code));
		for (const [base, written] of [['dec', String(code)], ['bin', code.toString(2).padStart(8, '0')], ['hex', code.toString(16)]]) {
			assert.equal(asciiATesto(written, base).copy, c, `${written} (${base})`);
		}
	}
	assert.equal(asciiATesto(testoAAscii(PRINTABLE.slice(0, 40)).copy, 'dec').copy, PRINTABLE.slice(0, 40));
});

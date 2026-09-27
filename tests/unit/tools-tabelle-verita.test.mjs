// Truth tables, checked against a direct evaluation of random propositions and the classic laws of the lesson.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { tabellaVerita, parseProp, propText, propTex, evaluate, letters, assignment } = await jiti.import('../../src/lib/tools/tabelle-verita.ts');

const kind = (s) => {
	const o = tabellaVerita(s);
	assert.ok(o.ok, `${s}: ${o.error}`);
	return o.rows[1].value;
};
const lastColumn = (s) => {
	const o = tabellaVerita(s);
	return o.copy.split('\n').slice(1).map((r) => r.split('\t').at(-1)).join('');
};

test('the connectives as in the lesson', () => {
	assert.equal(lastColumn('¬p'), 'FV');
	assert.equal(lastColumn('p ∧ q'), 'VFFF');
	assert.equal(lastColumn('p ∨ q'), 'VVVF');
	assert.equal(lastColumn('p → q'), 'VFVV');
	assert.equal(lastColumn('p ↔ q'), 'VFFV');
	assert.equal(lastColumn('p ⊻ q'), 'FVVF');
	// Example 2 and 3 of the lesson.
	assert.equal(lastColumn('(p ∨ q) ∧ ¬p'), 'FFVF');
	assert.equal(lastColumn('(p ∧ q) ∨ ¬r'), 'VVFVFVFV');
});

test('keyboard symbols and words', () => {
	const same = (a, b) => assert.equal(lastColumn(a), lastColumn(b), `${a} vs ${b}`);
	same('!p & q', '¬p ∧ q');
	same('~p && q', '¬p ∧ q');
	same('non p e q', '¬p ∧ q');
	same('not p and q', '¬p ∧ q');
	same('p | q', 'p ∨ q');
	same('p o q', 'p ∨ q');
	same('p v q', 'p ∨ q');
	same('p -> q', 'p → q');
	same('p => q', 'p → q');
	same('p implica q', 'p → q');
	same('p <-> q', 'p ↔ q');
	same('p se e solo se q', 'p ↔ q');
	same('p sse q', 'p ↔ q');
	same('p xor q', 'p ⊻ q');
	same('p aut q', 'p ⊻ q');
	same('[p ∨ q] ∧ {¬p}', '(p ∨ q) ∧ ¬p');
	same('p ∧ V', 'p');
	same('p ∨ 0', 'p');
	assert.equal(propText(parseProp('!(p&q)')), '¬(p ∧ q)');
	assert.equal(propTex(parseProp('p xor q')), 'p \\mathbin{\\dot{\\vee}} q');
});

test('tautologies, contradictions and the rest', () => {
	assert.equal(kind('p ∨ ¬p'), 'una tautologia');
	assert.equal(kind('p ∧ ¬p'), 'una contraddizione');
	assert.equal(kind('((p → q) ∧ p) → q'), 'una tautologia');
	assert.equal(kind('((p → q) ∧ ¬q) → ¬p'), 'una tautologia');
	assert.equal(kind('¬(p ∧ q) ↔ (¬p ∨ ¬q)'), 'una tautologia');
	assert.equal(kind('¬(p ∨ q) ↔ (¬p ∧ ¬q)'), 'una tautologia');
	assert.equal(kind('(p → q) ↔ (¬q → ¬p)'), 'una tautologia');
	assert.equal(kind('(p ∨ q) ∧ (¬p ∧ ¬q)'), 'una contraddizione');
	assert.match(kind('(p ∨ q) ∧ ¬p'), /soddisfacibile/);
	assert.equal(tabellaVerita('(p ∨ q) ∧ ¬p').rows[2].value, '$1$ su $4$');
	// → binds less than ∧, as in every book; the table brackets it.
	assert.equal(kind('(p → q) ∧ ¬q → ¬p'), 'una tautologia');
	assert.equal(propText(parseProp('p ∧ q → r')), '(p ∧ q) → r');
});

test('the steps', () => {
	const o = tabellaVerita('(p → q) ∧ ¬q');
	assert.equal(o.steps[0].math[0], '2^{2} = \\hl{4}');
	assert.deepEqual(o.steps[1].table.rows.map((r) => r[1]), ['$p \\to q$', '$\\neg q$', '$(p \\to q) \\wedge \\neg q$']);
	const full = o.steps.find((s) => s.table?.rows.length === 4 && s.table.head.length === 5);
	assert.deepEqual(full.table.rows[1], ['V', 'F', 'F', 'V', '$\\hl{\\text{F}}$']);
	assert.equal(o.copy.split('\n')[0], 'p\tq\tp → q\t¬q\t(p → q) ∧ ¬q');
	const five = tabellaVerita('(p ∧ q) ∨ (r ∧ s) ∨ t');
	assert.ok(five.ok);
	assert.equal(five.copy.split('\n').length, 33);
	assert.equal(tabellaVerita('p').rows[1].value, 'soddisfacibile (né tautologia né contraddizione)');
	assert.equal(tabellaVerita('V').rows[1].value, 'una tautologia');
});

test('wrong input', () => {
	assert.match(tabellaVerita('').error, /per esempio/);
	assert.match(tabellaVerita('p ∧ q ∨ r').error, /parentesi/);
	assert.match(tabellaVerita('p -> q -> r').error, /parentesi tra due frecce/);
	assert.match(tabellaVerita('(p ∧ q').error, /parentesi chiusa/);
	assert.match(tabellaVerita('p ∧ q)').error, /di troppo/);
	assert.match(tabellaVerita('p ∧').error, /manca una lettera/);
	assert.match(tabellaVerita('∧ p').error, /Prima di/);
	assert.match(tabellaVerita('p q').error, /manca un connettivo/);
	assert.match(tabellaVerita('pq').error, /p ∧ q/);
	assert.match(tabellaVerita('p ∧ ciao').error, /non è una lettera/);
	assert.match(tabellaVerita('p # q').error, /simbolo/);
	assert.match(tabellaVerita('()').error, /niente/);
	assert.match(tabellaVerita('a ∧ b ∧ c ∧ d ∧ f ∧ g').error, /Al massimo 5/);
	for (const bad of ['', 'p ∧ q ∨ r', '(p', 'p q', 'a ∧ b ∧ c ∧ d ∧ f ∧ g']) assertReadable(tabellaVerita(bad), bad);
});

/** A random proposition on up to four letters. */
function random(depth) {
	const r = Math.random();
	if (depth === 0 || r < 0.25) return { k: 'var', name: 'pqrs'[Math.floor(Math.random() * 4)] };
	if (r < 0.4) return { k: 'not', a: random(depth - 1) };
	const op = ['and', 'or', 'imp', 'iff', 'xor'][Math.floor(Math.random() * 5)];
	return { k: 'bin', op, a: random(depth - 1), b: random(depth - 1) };
}

test('random propositions: printed, parsed back and evaluated on every row', () => {
	for (let i = 0; i < 400; i++) {
		const p = random(4);
		const text = propText(p);
		const back = parseProp(text);
		assert.equal(typeof back, 'object', `${text}: ${back}`);
		const names = letters(p);
		const o = tabellaVerita(text);
		assert.ok(o.ok, `${text}: ${o.error}`);
		const got = o.copy.split('\n').slice(1).map((r) => r.split('\t').at(-1));
		const want = Array.from({ length: 2 ** names.length }, (_, j) => (evaluate(p, assignment(names, j)) ? 'V' : 'F'));
		assert.deepEqual(got, want, text);
		const all = want.every((v) => v === 'V') ? 'una tautologia' : want.every((v) => v === 'F') ? 'una contraddizione' : 'soddisfacibile (né tautologia né contraddizione)';
		assert.equal(o.rows[1].value, all, text);
		if (i < 150) assertReadable(o, text);
	}
});

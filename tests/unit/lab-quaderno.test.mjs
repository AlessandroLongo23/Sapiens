// The lab notebook's model (src/components/lab/engine/notebook.ts): what is written, what the experiment makes of it.
// Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { Notebook, parseNumber } = await jiti.import('../../src/components/lab/engine/notebook.ts');

test('numbers as a student writes them', () => {
	assert.equal(parseNumber('12,35'), 12.35);
	assert.equal(parseNumber('12.35'), 12.35);
	assert.equal(parseNumber(' 0,0522 mol/L'), 0.0522);
	assert.equal(parseNumber('-1,5'), -1.5);
	assert.equal(parseNumber('dodici'), null);
	assert.equal(parseNumber(''), null);
	assert.equal(parseNumber(undefined), null);
});

test('a value is judged when the field is left, taken in ink when right', () => {
	const nb = new Notebook();
	nb.verify = (id, v) => (id === 'x' ? { ok: parseNumber(v) === 2, hint: 'due' } : null);
	nb.type('x', '3');
	assert.equal(nb.marks.x, undefined, 'not while typing');
	nb.commit('x');
	assert.equal(nb.marks.x, 'wrong');
	assert.equal(nb.number('x'), null);
	assert.equal(nb.hint, 'due');
	nb.type('x', '2,0');
	assert.equal(nb.marks.x, undefined, 'typing again clears the mark');
	nb.commit('x');
	assert.equal(nb.marks.x, 'ok');
	assert.equal(nb.number('x'), 2);
	nb.type('x', '9');
	assert.equal(nb.values.x, '2,0', 'ink is not written over');
	nb.clear('x');
	assert.equal(nb.values.x, undefined);
	nb.type('x', '2');
	nb.commit('x');
	assert.equal(nb.number('x'), 2, 'after the experiment takes it back it can be written again');
});

test('free fields are never judged, blocked ones are not kept, read only writes nothing', () => {
	const nb = new Notebook();
	nb.blocked = (id) => (id === 'later' ? 'non ancora' : '');
	nb.type('note', 'rosa pallido');
	nb.commit('note');
	assert.equal(nb.marks.note, undefined);
	assert.equal(nb.values.note, 'rosa pallido');
	nb.type('later', '1');
	nb.commit('later');
	assert.equal(nb.values.later, undefined);
	assert.equal(nb.hint, 'non ancora');
	nb.readOnly = true;
	nb.type('note', 'altro');
	assert.equal(nb.values.note, 'rosa pallido');
});

test('it opens where it is asked, tells who listens, and what is written can be saved', () => {
	const nb = new Notebook();
	const seen = [];
	nb.onToggle = (open) => seen.push(open);
	let n = 0;
	nb.subscribe(() => n++);
	nb.show('letture', 'vi1');
	assert.equal(nb.open, true);
	assert.deepEqual(nb.take(), { page: 'letture', field: 'vi1' });
	assert.equal(nb.take(), null);
	nb.readOnly = true;
	nb.close();
	assert.equal(nb.readOnly, false, 'read only is for one opening');
	assert.deepEqual(seen, [true, false]);
	assert.ok(n >= 2);
	nb.type('a', '1');
	assert.deepEqual(JSON.parse(JSON.stringify(nb)), { values: { a: '1' }, marks: {} });
});

test('closing the notebook judges what was being typed; the hint does not outlive it', () => {
	const nb = new Notebook();
	nb.verify = (id, v) => ({ ok: parseNumber(v) === 0.3, hint: 'letto' });
	nb.open = true;
	nb.type('vi1', '0,30');
	nb.close();
	assert.equal(nb.marks.vi1, 'ok', 'Esc while typing is not a value lost');
	assert.equal(nb.hint, '');
	nb.open = true;
	nb.type('vi2', ',5');
	nb.settle();
	assert.equal(nb.marks.vi2, 'wrong');
	assert.equal(parseNumber(',5'), 0.5);
});

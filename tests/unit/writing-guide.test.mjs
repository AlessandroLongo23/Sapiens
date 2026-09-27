// The writing guide and the slash menu: every formula in the guide typesets in KaTeX, the library that draws the
// notes, and the slash menu finds its commands the way a student would ask for them.
// Run with `npm run test:unit` (jiti loads the TypeScript sources).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import katex from 'katex';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { DELIMITERS, EXAMPLES, MISTAKES, RULES, SECTIONS } = await jiti.import('../../src/lib/guide/writing.ts');
const { filterSlash, SLASH_ITEMS } = await jiti.import('../../src/lib/zaino/slash-items.ts');

test('every formula of the guide typesets', () => {
	const all = [
		...DELIMITERS,
		...EXAMPLES,
		...SECTIONS.flatMap((s) => s.examples),
		...RULES.map((r) => ({ tex: r.tex })),
		...MISTAKES.flatMap((m) => [{ tex: m.wrong }, { tex: m.right }])
	];
	assert.ok(all.length > 80);
	for (const e of all) {
		assert.doesNotThrow(() => katex.renderToString(e.tex, { displayMode: !!e.display, throwOnError: true, strict: 'ignore' }), e.tex);
	}
});

test('section ids are unique', () => {
	const ids = SECTIONS.map((s) => s.id);
	assert.equal(new Set(ids).size, ids.length);
});

test('slash menu: nothing typed lists every command', () => {
	assert.equal(filterSlash('').length, SLASH_ITEMS.length);
});

test('slash menu: the name first, then its words, then other names', () => {
	const ids = (q) => filterSlash(q).map((i) => i.id);
	assert.deepEqual(ids('tit').slice(0, 2), ['h1', 'h3']);
	assert.equal(ids('sotto')[0], 'h2');
	assert.equal(ids('h2')[0], 'h2');
	assert.equal(ids('elenco')[0], 'ul');
	assert.equal(ids('num')[0], 'ol');
	assert.equal(ids('formula')[0], 'math');
	assert.ok(ids('latex').includes('math'));
	assert.ok(ids('LaTeX').includes('guide'));
	assert.equal(ids('pagina')[0], 'page');
	assert.deepEqual(ids('zzz'), []);
});

test('slash menu: accents and capitals do not matter', () => {
	const custom = [{ id: 'p', title: 'Città', description: '', group: 'Testo', aliases: [] }];
	assert.equal(filterSlash('citta', custom).length, 1);
	assert.equal(filterSlash('CIT', custom).length, 1);
});

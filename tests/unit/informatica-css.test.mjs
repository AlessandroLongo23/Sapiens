// The selectors and the cascade of the CSS lessons (src/lib/informatica/css.ts), on cases worked out by hand.
// Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { leggiSelettore, presi, elementi, peso, confronta, cascata } = await jiti.import('../../src/lib/informatica/css.ts');

// body(0) header(1) h1(2) nav(3) a(4) a(5) main(6) h2(7) p.avviso(8) ul#date(9) li.prossimo(10) li(11) li(12) p(13) a(14)
const pagina = {
	tag: 'body',
	figli: [
		{ tag: 'header', figli: [{ tag: 'h1' }, { tag: 'nav', figli: [{ tag: 'a' }, { tag: 'a' }] }] },
		{
			tag: 'main',
			figli: [{ tag: 'h2' }, { tag: 'p', classi: ['avviso'] }, { tag: 'ul', id: 'date', figli: [{ tag: 'li', classi: ['prossimo'] }, { tag: 'li' }, { tag: 'li' }] }, { tag: 'p', figli: [{ tag: 'a' }] }]
		}
	]
};
const sel = (text) => leggiSelettore(text).selettori[0];

test('a selector takes the elements counted by hand', () => {
	assert.equal(elementi(pagina).length, 15);
	assert.deepEqual(presi(pagina, 'a'), [4, 5, 14]);
	assert.deepEqual(presi(pagina, 'nav a'), [4, 5]);
	assert.deepEqual(presi(pagina, 'main a'), [14]);
	assert.deepEqual(presi(pagina, 'body a'), [4, 5, 14]);
	assert.deepEqual(presi(pagina, '.prossimo'), [10]);
	assert.deepEqual(presi(pagina, 'li.prossimo'), [10]);
	assert.deepEqual(presi(pagina, 'p.prossimo'), []);
	assert.deepEqual(presi(pagina, '#date'), [9]);
	assert.deepEqual(presi(pagina, '#date li'), [10, 11, 12]);
	assert.deepEqual(presi(pagina, 'h1, h2'), [2, 7]);
	assert.deepEqual(presi(pagina, 'LI'), [10, 11, 12]);
	assert.deepEqual(presi(pagina, 'main > a'), []);
	assert.deepEqual(presi(pagina, 'main > p'), [8, 13]);
	assert.deepEqual(presi(pagina, 'header main'), []);
});

test('a name without its dot or hash is the name of an element', () => {
	assert.deepEqual(presi(pagina, 'prossimo'), []);
	assert.deepEqual(presi(pagina, 'date'), []);
	assert.deepEqual(presi(pagina, '.date'), []);
	assert.deepEqual(presi(pagina, '#prossimo'), []);
	assert.deepEqual(presi(pagina, '.Prossimo'), []);
});

test('what is not a selector of the lesson is an error with a sentence', () => {
	for (const text of ['', '<p>', 'p { color: red; }', 'a:hover', 'p + p', '. nota', 'p,', '> p', 'ul >', '#a#b']) {
		const read = leggiSelettore(text);
		assert.ok('errore' in read && read.errore.length > 10, text);
		assert.ok(!/—|undefined/.test(read.errore));
	}
	assert.equal(leggiSelettore('  nav   a ').selettori[0].testo, 'nav a');
	assert.equal(leggiSelettore('ul>li').selettori[0].testo, 'ul > li');
});

test('ids weigh more than classes, classes more than element names', () => {
	assert.deepEqual(peso(sel('p')), [0, 0, 1]);
	assert.deepEqual(peso(sel('main p')), [0, 0, 2]);
	assert.deepEqual(peso(sel('.nota')), [0, 1, 0]);
	assert.deepEqual(peso(sel('p.nota')), [0, 1, 1]);
	assert.deepEqual(peso(sel('#avviso')), [1, 0, 0]);
	assert.deepEqual(peso(sel('#date li.prossimo')), [1, 1, 1]);
	assert.ok(confronta(peso(sel('.nota')), peso(sel('body main section p'))) > 0);
	assert.ok(confronta(peso(sel('#a')), peso(sel('.x.y.z p'))) > 0);
	assert.equal(confronta(peso(sel('nav a')), peso(sel('main p'))), 0);
});

test('the cascade: the heaviest selector, then the last written, then inheritance', () => {
	const p = { tag: 'p', id: 'avviso', classi: ['nota'] };
	const path = [{ tag: 'body' }, { tag: 'main' }, p];
	const rules = (...texts) => texts.map((selettore, i) => ({ selettore, valore: `c${i}` }));
	assert.equal(cascata(rules('main', 'p', '.nota', '#avviso', 'p'), path).vince, 3);
	assert.deepEqual(cascata(rules('main', 'p', '.nota', '#avviso', 'p'), path).esiti, ['non lo prende', 'battuta', 'battuta', 'vince', 'battuta']);
	assert.equal(cascata(rules('main', 'p', '.nota', 'p'), path).vince, 2);
	assert.equal(cascata(rules('main', 'p', 'p'), path).vince, 2);
	assert.equal(cascata(rules('p', 'main p', 'p'), path).vince, 1);
	const inherited = cascata(rules('body', 'main', 'li'), path);
	assert.deepEqual([inherited.vince, inherited.ereditata], [1, true]);
	assert.deepEqual(inherited.esiti, ['non lo prende', 'ereditata', 'non lo prende']);
	// a rule on the element beats what it would inherit, however heavy the ancestor's selector
	assert.equal(cascata([{ selettore: '#pagina', valore: 'a' }, { selettore: 'p', valore: 'b' }], [{ tag: 'body', id: 'pagina' }, p]).vince, 1);
	assert.equal(cascata(rules('li', 'h1'), path).vince, -1);
	assert.equal(cascata(rules('h1, p', '.nota, li'), path).vince, 1);
});

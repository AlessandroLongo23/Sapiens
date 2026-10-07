// The tree a browser makes of an HTML file, and the paths between the files of a site
// (src/lib/informatica/albero-documento.ts, percorsi-sito.ts): known cases, worked out by hand.
// Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { leggi, disponi, dentro, testoDi, figliDi } = await jiti.import('../../src/lib/informatica/albero-documento.ts');
const { relativo, risolvi, cartelle, cartellaDi, dallaRadice } = await jiti.import('../../src/lib/informatica/percorsi-sito.ts');

const PAGINA = ['<html lang="it">', '  <head>', '    <title>I Fuori Tempo</title>', '  </head>', '  <body>', '    <header>', '      <h1>I Fuori Tempo</h1>', '    </header>', '    <main>', '      <h2>Chi siamo</h2>', '      <p>Quattro amici e una sala prove.</p>', '    </main>', '    <footer>Liceo Volta, 3B</footer>', '  </body>', '</html>'];
const shape = (nodi) => nodi.map((n) => `${n.tag}<${n.genitore === null ? '' : nodi[n.genitore].tag}`).join(' ');

test('a well written page: each element is the child of the one it is written in', () => {
	const { nodi, passi } = leggi(PAGINA);
	assert.equal(shape(nodi), 'html< head<html title<head body<html header<body h1<header main<body h2<main p<main footer<body');
	assert.ok(nodi.every((n) => n.chiuso === 'tag'));
	assert.equal(passi.length, PAGINA.length + 2);
	assert.equal(testoDi(nodi[7]), 'Chi siamo');
	assert.deepEqual(figliDi(nodi[3]).map((id) => nodi[id].tag), ['header', 'main', 'footer']);
	// after "<header>" three elements are open, and header is the innermost
	assert.deepEqual(passi[6].aperti.map((id) => nodi[id].tag), ['html', 'body', 'header']);
	assert.equal(passi[6].nati, 5);
	// the title line opens and closes: head stays the innermost
	assert.deepEqual(passi[3].aperti.map((id) => nodi[id].tag), ['html', 'head']);
	assert.deepEqual(passi[passi.length - 1].aperti, []);
	for (const p of passi) assert.ok(p.frase.length > 20 && !/undefined|NaN|—/.test(p.frase), p.frase);
	assert.ok(dentro(nodi, 8, 3) && !dentro(nodi, 8, 1));
});

test('a heading left open takes the paragraph that follows, and is closed by the browser with its parent', () => {
	const rotta = PAGINA.map((riga) => riga.replace('<h2>Chi siamo</h2>', '<h2>Chi siamo'));
	const { nodi, passi } = leggi(rotta);
	const p = nodi.find((n) => n.tag === 'p');
	const h2 = nodi.find((n) => n.tag === 'h2');
	assert.equal(p.genitore, h2.id);
	assert.equal(h2.chiuso, 'browser');
	assert.equal(h2.fine, 11);
	assert.match(passi[10].frase, /resta aperto/);
	assert.match(passi[11].frase, /figlio di h2/);
	assert.match(passi[12].frase, /lo chiude da sé/);
	assert.equal(nodi.find((n) => n.tag === 'footer').genitore, nodi.find((n) => n.tag === 'body').id);
});

test('the other rules: a heading in a heading, an end tag of nothing, an element with no end tag, the end of the file', () => {
	const a = leggi(['<body>', '<h2>Uno', '<h2>Due</h2>', '</body>']).nodi;
	assert.equal(shape(a), 'body< h2<body h2<body');
	const b = leggi(['<body>', '<p>Uno</p></em>', '<meta charset="utf-8">', '<p>Due']);
	assert.equal(shape(b.nodi), 'body< p<body meta<body p<body');
	assert.match(b.passi[2].frase, /non chiude niente/);
	assert.equal(b.nodi[2].chiuso, 'vuoto');
	assert.equal(b.nodi[3].chiuso, 'browser');
	assert.match(b.passi[b.passi.length - 1].frase, /mancava il tag di chiusura/);
});

test('the drawing: leaves side by side, a parent over the middle of its children', () => {
	const { nodi } = leggi(PAGINA);
	const { x, y, foglie, livelli } = disponi(nodi);
	assert.equal(foglie, 5);
	assert.equal(livelli, 4);
	assert.deepEqual(y, [0, 1, 2, 1, 2, 3, 2, 3, 3, 2]);
	assert.deepEqual([x[2], x[5], x[7], x[8], x[9]], [0, 1, 2, 3, 4]);
	assert.equal(x[6], 2.5); // main over h2 and p
	assert.equal(x[3], 2.5); // body over header (1), main (2.5) and footer (4)
	assert.equal(x[0], 1.25); // html over head (0) and body (2.5)
});

const SITO = ['index.html', 'contatti.html', 'concerti/date.html', 'concerti/natale/scaletta.html', 'img/logo.png', 'img/palco.jpg'];

test('the relative path: as many .. as folders to leave', () => {
	assert.equal(relativo('index.html', 'contatti.html'), 'contatti.html');
	assert.equal(relativo('index.html', 'img/logo.png'), 'img/logo.png');
	assert.equal(relativo('concerti/date.html', 'index.html'), '../index.html');
	assert.equal(relativo('concerti/date.html', 'concerti/natale/scaletta.html'), 'natale/scaletta.html');
	assert.equal(relativo('concerti/natale/scaletta.html', 'img/logo.png'), '../../img/logo.png');
	assert.equal(relativo('concerti/natale/scaletta.html', 'concerti/date.html'), '../date.html');
	assert.equal(dallaRadice('img/logo.png'), '/img/logo.png');
	assert.deepEqual(cartelle(SITO), ['concerti', 'concerti/natale', 'img']);
	assert.equal(cartellaDi('index.html'), '');
});

test('every relative path leads back to its file, from every page', () => {
	for (const da of SITO.filter((f) => f.endsWith('.html')))
		for (const a of SITO) {
			const esito = risolvi(SITO, da, relativo(da, a));
			assert.equal(esito.tipo, 'file');
			assert.equal(esito.percorso, a);
			assert.deepEqual(risolvi(SITO, da, dallaRadice(a)).percorso, a);
		}
});

test('where a written path leads, and why it leads nowhere', () => {
	const su = risolvi(SITO, 'concerti/natale/scaletta.html', '../../img/logo.png');
	assert.deepEqual(su.mosse.map((m) => `${m.tipo}:${m.in}`), ['parti:concerti/natale', 'su:concerti', 'su:', 'giu:img', 'file:img']);
	assert.deepEqual(risolvi(SITO, 'concerti/date.html', 'img/logo.png'), { tipo: 'manca', manca: 'img', in: 'concerti', mosse: [{ tipo: 'parti', in: 'concerti', pezzo: 'concerti' }] });
	assert.equal(risolvi(SITO, 'index.html', '../index.html').tipo, 'fuori');
	assert.equal(risolvi(SITO, 'index.html', 'concerti').tipo, 'cartella');
	assert.equal(risolvi(SITO, 'index.html', 'concerti/').tipo, 'cartella');
	assert.equal(risolvi(SITO, 'index.html', 'https://www.esempio.it/logo.png').tipo, 'esterno');
	assert.equal(risolvi(SITO, 'index.html', '  ').tipo, 'vuoto');
	assert.equal(risolvi(SITO, 'concerti/date.html', './natale/scaletta.html#brani').percorso, 'concerti/natale/scaletta.html');
	assert.equal(risolvi(SITO, 'index.html', 'Contatti.html').tipo, 'manca');
	assert.equal(risolvi(SITO, 'index.html', 'index.html/altro').tipo, 'manca');
});

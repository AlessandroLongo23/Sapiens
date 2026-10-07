// What a form sends, for the figure of the lesson on forms (src/lib/informatica/modulo-inviato.ts): the pairs and
// the request, on cases written by hand and against URLSearchParams. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { coppie, escluso, codifica, unite, richiesta } = await jiti.import('../../src/lib/informatica/modulo-inviato.ts');

const campi = (over = {}) => [
	{ tipo: 'text', id: 'nome', name: 'nome', valore: 'Anna' },
	{ tipo: 'email', id: 'email', name: 'email', valore: 'anna@esempio.it' },
	{ tipo: 'text', id: 'classe', name: null, valore: '3B' },
	{ tipo: 'checkbox', id: 'notizie', name: 'notizie', value: 'si', spuntata: false, ...over }
];

test('a field without name and a checkbox that is not ticked send nothing', () => {
	assert.deepEqual(coppie(campi()), [
		{ name: 'nome', value: 'Anna' },
		{ name: 'email', value: 'anna@esempio.it' }
	]);
	assert.deepEqual(campi().map(escluso), [null, null, 'senza name', 'non spuntata']);
});

test('a ticked checkbox sends its value, or "on" when it has none', () => {
	assert.deepEqual(coppie(campi({ spuntata: true })).at(-1), { name: 'notizie', value: 'si' });
	assert.deepEqual(coppie(campi({ spuntata: true, value: null })).at(-1), { name: 'notizie', value: 'on' });
});

test('an empty field with a name is sent, empty', () => {
	assert.deepEqual(coppie([{ tipo: 'text', id: 'nome', name: 'nome', valore: '' }]), [{ name: 'nome', value: '' }]);
	assert.equal(unite([{ name: 'nome', value: '' }]), 'nome=');
});

test('the writing is the one of a form: what URLSearchParams writes', () => {
	for (const text of ['Anna', 'Anna Rossi', 'anna@esempio.it', 'perché no?', "l'una & l'altra", '3 + 2 = 5', 'a*b-c.d_e~f', '(ciao)!', '100%', 'è già']) {
		assert.equal(codifica(text), new URLSearchParams({ x: text }).toString().slice(2), text);
	}
	assert.equal(codifica('anna@esempio.it'), 'anna%40esempio.it');
	assert.equal(codifica('Anna Rossi'), 'Anna+Rossi');
});

test('GET puts the pairs in the address, POST in the body', () => {
	const cs = coppie(campi());
	assert.deepEqual(richiesta('get', '/iscrizione', cs), { metodo: 'GET', indirizzo: '/iscrizione?nome=Anna&email=anna%40esempio.it', corpo: null });
	assert.deepEqual(richiesta('post', '/iscrizione', cs), { metodo: 'POST', indirizzo: '/iscrizione', corpo: 'nome=Anna&email=anna%40esempio.it' });
	assert.equal(richiesta('get', '/iscrizione', []).indirizzo, '/iscrizione?');
});

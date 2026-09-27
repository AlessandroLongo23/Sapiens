// The diary's pure logic: dates, the line a student writes, the topic it is about.
// Run with `npm run test:unit` (jiti loads the TypeScript sources and their extensionless imports).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { parseLine } = await jiti.import('../../src/lib/diary/entries.ts');
const { matchTopic } = await jiti.import('../../src/lib/diary/topics.ts');
const { monthGrid, schoolYear, weekOf, relativeDay, isDay } = await jiti.import('../../src/lib/diary/dates.ts');

// Saturday 26 September 2026.
const TODAY = '2026-09-26';

test('kind, subject and weekday', () => {
	const p = parseLine('verifica mate giovedì', TODAY);
	assert.equal(p.kind, 'verifica');
	assert.equal(p.subject, 'matematica');
	assert.equal(p.day, '2026-10-01');
	assert.equal(p.text, 'verifica mate');
});

test('the same weekday is a week away', () => {
	assert.equal(parseLine('ita sabato', TODAY).day, '2026-10-03');
	assert.equal(parseLine('interrogazione storia lunedì prossimo', TODAY).day, '2026-09-28');
});

test('domani, dopodomani, tra N giorni', () => {
	assert.equal(parseLine('compiti fisica per domani', TODAY).day, '2026-09-27');
	assert.equal(parseLine('compiti fisica per domani', TODAY).text, 'compiti fisica');
	assert.equal(parseLine('dopodomani tema', TODAY).day, '2026-09-28');
	assert.equal(parseLine('ricerca scienze tra 3 giorni', TODAY).day, '2026-09-29');
	assert.equal(parseLine('versione latino fra una settimana', TODAY).day, '2026-10-03');
});

test('written dates', () => {
	assert.equal(parseLine('verifica inglese il 12/10', TODAY).day, '2026-10-12');
	assert.equal(parseLine('verifica inglese 12 ottobre', TODAY).day, '2026-10-12');
	assert.equal(parseLine('simulazione 5 giu', TODAY).day, '2027-06-05');
	assert.equal(parseLine('orale filo il 3', TODAY).day, '2026-10-03');
	assert.equal(parseLine('orale filo il 30', TODAY).day, '2026-09-30');
});

test('numbers that are not dates', () => {
	const p = parseLine('mate pag 45 es 3-7', TODAY, '2026-09-28');
	assert.equal(p.kind, 'compito');
	assert.equal(p.dayFound, false);
	assert.equal(p.day, '2026-09-28');
	assert.equal(p.text, 'mate pag 45 es 3-7');
});

test('longer subjects first, and a plain reminder', () => {
	assert.equal(parseLine('scienze motorie tuta', TODAY).subject, 'motoria');
	assert.equal(parseLine('ed fisica scarpe', TODAY).subject, 'motoria');
	const p = parseLine('portare la gita firmata', TODAY);
	assert.equal(p.kind, 'promemoria');
	assert.equal(p.subject, null);
});

test('a line of only a date keeps its words', () => {
	assert.equal(parseLine('domani', TODAY).text, 'domani');
});

const TOPICS = [
	{ path: 'high_school/math/monomi-polinomi', title: 'Monomi e polinomi', kind: 'chapter' },
	{ path: 'high_school/math/monomi-polinomi/monomi', title: 'Monomi: operazioni', kind: 'lesson', chapter: 'high_school/math/monomi-polinomi' },
	{ path: 'high_school/math/monomi-polinomi/prodotti-notevoli', title: 'Prodotti notevoli', kind: 'lesson', chapter: 'high_school/math/monomi-polinomi' },
	{ path: 'high_school/math/equazioni-sistemi', title: 'Equazioni di primo grado', kind: 'chapter' },
	{ path: 'high_school/math/equazioni-2', title: 'Equazioni di secondo grado', kind: 'chapter' },
	{ path: 'high_school/math/numeri-naturali', title: 'Numeri naturali \\mathbb{N}', kind: 'chapter' }
];

test('topics', () => {
	assert.equal(matchTopic('verifica mate monomi', TOPICS)?.path, 'high_school/math/monomi-polinomi');
	assert.equal(matchTopic('verifica sui prodotti notevoli', TOPICS)?.path, 'high_school/math/monomi-polinomi/prodotti-notevoli');
	assert.equal(matchTopic('verifica equazioni di secondo grado', TOPICS)?.path, 'high_school/math/equazioni-2');
	assert.equal(matchTopic('verifica sulle equazioni', TOPICS), null);
	assert.equal(matchTopic('numeri naturali', TOPICS)?.path, 'high_school/math/numeri-naturali');
	assert.equal(matchTopic('verifica mate', TOPICS), null);
});

test('dates', () => {
	assert.equal(isDay('2026-02-30'), false);
	assert.deepEqual(weekOf(TODAY)[0], '2026-09-21');
	const grid = monthGrid('2026-10-15');
	assert.equal(grid[0], '2026-09-28');
	assert.equal(grid.length % 7, 0);
	assert.equal(grid.at(-1), '2026-11-01');
	assert.equal(schoolYear('2027-03-01'), 2026);
	assert.equal(schoolYear('2026-09-01'), 2026);
	assert.equal(relativeDay('2026-10-01', TODAY), 'tra 5 giorni');
});

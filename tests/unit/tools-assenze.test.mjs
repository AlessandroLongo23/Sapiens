// Absences: at least three quarters of the annual hours must be attended (DPR 122/2009 art. 14 c. 7), so the limit
// is a quarter of them, rounded down; 33 weeks when only the weekly hours are known.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { calcoloAssenze } = await jiti.import('../../src/lib/tools/assenze.ts');

const week = (ore, fatte = '', giorni = '5') => calcoloAssenze({ modo: 'settimana', ore: String(ore), giorni, fatte: String(fatte) });
const year = (ore, fatte = '', giorni = '5') => calcoloAssenze({ modo: 'anno', ore: String(ore), giorni, fatte: String(fatte) });
const row = (o, label) => o.rows.find((r) => r.label === label)?.value;

test('absences: the limit from the weekly hours', () => {
	const o = week(27, 60);
	assert.ok(o.ok, o.error);
	assert.equal(row(o, 'Ore di assenza massime nell’anno'), '$222$ ore');
	assert.equal(row(o, 'Ore di assenza che ti restano'), '$162$ ore');
	// 27 hours in 5 days: 5,4 hours a day; 162 / 5,4 = 30.
	assert.equal(row(o, 'In giorni di scuola, circa'), '$30$ giorni');
	assert.equal(row(o, 'Assenze fatte, sul monte ore'), '$\\approx 6{,}7\\%$');
	assert.equal(o.copy, '162 ore');
	assert.match(o.steps[0].math[0], /27 \\cdot 33 = \\hl\{891\}/);
	// 30 hours: 990, a quarter is 247,5, rounded down.
	assert.equal(row(week(30), 'Ore di assenza massime nell’anno'), '$247$ ore');
	assert.equal(row(week(30, '', '6'), 'In giorni di scuola, circa'), '$49$ giorni');
	assert.equal(row(week(32), 'Ore di assenza massime nell’anno'), '$264$ ore');
});

test('absences: from the annual hours, and over the limit', () => {
	const o = year(1056, 250);
	assert.equal(row(o, 'Ore di assenza che ti restano'), '$14$ ore');
	assert.equal(row(o, 'In giorni di scuola, circa'), '$2$ giorni');
	assert.equal(row(year(1056), 'In giorni di scuola, circa'), '$41$ giorni');
	const over = week(32, 280);
	assert.equal(row(over, 'Ore oltre il limite'), '$16$ ore');
	assert.match(over.copy, /superato/);
	assert.match(over.steps.at(-1).say, /deroghe/);
	const exact = week(32, 264);
	assert.equal(row(exact, 'Ore di assenza che ti restano'), '$0$ ore');
	assert.equal(row(week(32, 265), 'Ore oltre il limite'), '$1$ ora');
	assert.equal(row(week(27, '10,5'), 'Ore di assenza che ti restano'), '$211{,}5$ ore');
});

test('absences: brute force on the limit and the days', () => {
	for (let w = 10; w <= 45; w++)
		for (const g of ['5', '6'])
			for (const f of [0, 17, 100, 300]) {
				const o = week(w, f, g);
				const monte = w * 33;
				const max = Math.floor(monte / 4);
				assert.equal(row(o, 'Ore di assenza massime nell’anno'), `$${max}$ ore`);
				// The limit keeps three quarters: max hours missed, never one more.
				assert.ok(monte - max >= (3 * monte) / 4 && monte - max - 1 < (3 * monte) / 4);
				const left = max - f;
				if (left >= 0) {
					const days = Math.floor((left * Number(g)) / w);
					assert.equal(row(o, 'In giorni di scuola, circa'), `$${days}$ ${days === 1 ? 'giorno' : 'giorni'}`, `${w} ${g} ${f}`);
				} else assert.ok(row(o, 'Ore oltre il limite'));
				if (w % 7 === 0) assertReadable(o, `${w} ${g} ${f}`);
			}
});

test('absences: wrong input', () => {
	assert.match(week('').error, /ore di lezione/);
	assert.match(week(8).error, /da 10 a 45/);
	assert.match(week('27,5').error, /intero/);
	assert.match(year(100).error, /da 300 a 2000/);
	assert.match(week(27, '-3').error, /da 0 in su/);
	assert.match(week(27, 'tante').error, /da 0 in su/);
	assert.match(week(27, 1000).error, /non possono superare/);
	assert.match(week(27, '', '7').error, /5 o 6/);
	for (const o of [week(''), year(1056, 250), week(32, 280), week(32, 264), year(990)]) assertReadable(o);
});

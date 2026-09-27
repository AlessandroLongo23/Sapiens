// School credit, the maturità mark and mark conversion, checked against the tables and rules as written in
// Allegato A of D.Lgs. 62/2017 and OM 54 of 26 March 2026.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { creditiScolastici } = await jiti.import('../../src/lib/tools/crediti-scolastici.ts');
const { votoMaturita } = await jiti.import('../../src/lib/tools/voto-maturita.ts');
const { convertiVoto, SCALES } = await jiti.import('../../src/lib/tools/conversione-voti.ts');

const years = (m3 = '', m4 = '', m5 = '', c3 = '', c4 = '', c5 = '') => ({ 3: { media: m3, condotta: c3 }, 4: { media: m4, condotta: c4 }, 5: { media: m5, condotta: c5 } });

/** The table of Allegato A, written out independently: [lower bound exclusive, upper inclusive] → points. */
function expected(m, year) {
	const rows = [
		[6, 6, { 3: [7, 8], 4: [8, 9], 5: [9, 10] }],
		[6, 7, { 3: [8, 9], 4: [9, 10], 5: [10, 11] }],
		[7, 8, { 3: [9, 10], 4: [10, 11], 5: [11, 12] }],
		[8, 9, { 3: [10, 11], 4: [11, 12], 5: [13, 14] }],
		[9, 10, { 3: [11, 12], 4: [12, 13], 5: [14, 15] }]
	];
	if (m < 6) return year === 5 ? [7, 8] : null;
	if (m === 6) return rows[0][2][year];
	return rows.find(([lo, hi]) => m > lo && m <= hi)[2][year];
}

test('credit: the bands of Allegato A', () => {
	const o = creditiScolastici(years('7,4', '8', '8,5'));
	assert.ok(o.ok, o.error);
	assert.deepEqual(o.rows.map((r) => r.value), ['$9$ o $10$ punti', '$10$ o $11$ punti', '$13$ o $14$ punti', 'da $32$ a $35$ punti su $40$']);
	assert.equal(o.copy, 'da 32 a 35');
	// M = 6 exactly, and just above.
	assert.equal(creditiScolastici(years('6')).rows[0].value, '$7$ o $8$ punti');
	assert.equal(creditiScolastici(years('6,01')).rows[0].value, '$8$ o $9$ punti');
	assert.equal(creditiScolastici(years('10', '10', '10')).rows[3].value, 'da $37$ a $40$ punti su $40$');
	// Under 6 only in the fifth year.
	assert.equal(creditiScolastici(years('', '', '5,8')).rows[0].value, '$7$ o $8$ punti');
	assert.match(creditiScolastici(years('5,8')).error, /sotto 6/);
});

test('credit: behaviour under 9 keeps the lower point', () => {
	const o = creditiScolastici(years('7,4', '8', '8,5', '9', '8', '10'));
	assert.deepEqual(o.rows.map((r) => r.value), ['$9$ o $10$ punti', '$10$ punti', '$13$ o $14$ punti', 'da $32$ a $34$ punti su $40$']);
	const low = creditiScolastici(years('7,4', '8', '8,5', '8', '8', '8'));
	assert.equal(low.rows[3].value, '$32$ punti su $40$');
	assert.equal(low.copy, '32');
	assert.match(creditiScolastici(years('7', '', '', '5')).error, /meno di 6/);
	assert.match(creditiScolastici(years('7', '', '', '6')).steps.at(-1).then, /elaborato/);
	assert.match(creditiScolastici(years('', '', '7', '', '', '6')).steps.at(-1).then, /all’esame/);
	assert.match(creditiScolastici(years('7')).steps[1].then, /almeno 9/);
});

test('credit: every average from 6 to 10 in hundredths, in every year', () => {
	for (let c = 600; c <= 1000; c++) {
		const m = c / 100;
		const text = String(m).replace('.', ',');
		for (const y of [3, 4, 5]) {
			const input = years(y === 3 ? text : '', y === 4 ? text : '', y === 5 ? text : '');
			const o = creditiScolastici(input);
			const [lo, hi] = expected(m, y);
			assert.equal(o.rows[0].value, `$${lo}$ o $${hi}$ punti`, `${text} in year ${y}`);
		}
	}
});

test('credit: wrong input and readability', () => {
	assert.match(creditiScolastici(years()).error, /almeno un anno/);
	assert.match(creditiScolastici(years('11')).error, /da 1 a 10/);
	assert.match(creditiScolastici(years('sette')).error, /da 1 a 10/);
	assert.match(creditiScolastici(years('', '', '', '9')).error, /Scrivi la media del terzo/);
	assert.match(creditiScolastici(years('7', '', '', '8,5')).error, /intero/);
	for (const o of [
		creditiScolastici(years('7,4', '8', '8,5')),
		creditiScolastici(years('7,4', '8', '8,5', '9', '8', '6')),
		creditiScolastici(years('6', '6')),
		creditiScolastici(years('', '', '5,5', '', '', '7')),
		creditiScolastici(years('11'))
	])
		assertReadable(o);
});

test('maturità: the sum, the pass mark, the bonus and the lode', () => {
	const m = (c, a, b, o) => votoMaturita({ credito: String(c), scritto1: String(a), scritto2: String(b), orale: String(o) });
	const base = m(32, 15, 14, 16);
	assert.equal(base.rows[0].value, '$77$ su $100$');
	assert.equal(base.copy, '77/100');
	assert.match(base.steps.at(-1).then, /non può aggiungere/);
	assert.match(m(20, 12, 13, 14).rows[1].value, /non superato/);
	assert.ok(m(20, 13, 13, 14).rows.length === 1);
	const ninety = m(36, 18, 18, 18);
	assert.equal(ninety.rows[1].value, 'fino a $93$ su $100$');
	assert.equal(m(39, 20, 20, 19).rows[1].value, 'fino a $100$ su $100$');
	assert.equal(m(40, 20, 20, 20).rows[1].label, 'Lode');
	assert.equal(m(36, 18, 17, 18).rows.length, 1);
	for (let c = 0; c <= 40; c += 1)
		for (const p of [0, 7, 13, 20])
			for (const o of [0, 10, 20]) {
				const r = m(c, p, 20 - p, o);
				const t = c + 20 + o;
				assert.equal(r.rows[0].value, `$${t}$ su $100$`);
				assert.equal(r.rows.some((x) => x.label === 'Esito'), t < 60);
				assert.equal(r.rows.some((x) => x.label === 'Con il bonus della commissione'), t >= 90 && t < 100);
				if (c % 8 === 0) assertReadable(r, `${c} ${p} ${o}`);
			}
	assert.match(m(41, 10, 10, 10).error, /da 0 a 40/);
	assert.match(m(30, 21, 10, 10).error, /da 0 a 20/);
	assert.match(m(30, '14,5', 10, 10).error, /intero/);
	assert.match(votoMaturita({ credito: '30', scritto1: '', scritto2: '10', orale: '10' }).error, /prima prova/);
	assertReadable(m(41, 10, 10, 10));
});

test('marks between scales: the proportion', () => {
	assert.equal(convertiVoto('7', 10, 15).copy, '10,5');
	assert.equal(convertiVoto('6', 10, 20).copy, '12');
	assert.equal(convertiVoto('18', 30, 10).copy, '6');
	assert.equal(convertiVoto('10', 15, 10).copy, '6,67');
	assert.equal(convertiVoto('10', 15, 10).rows[0].value, '$\\approx 6{,}67$ su $10$');
	assert.equal(convertiVoto('7,5', 10, 100).copy, '75');
	assert.equal(convertiVoto('7', 10, 10).copy, '7');
	assert.deepEqual(convertiVoto('7', 10, 15).steps[1].math, ['x = \\dfrac{7 \\cdot 15}{10}', 'x = \\dfrac{105}{10}', 'x = \\hl{10{,}5}']);
	assert.match(convertiVoto('7', 10, 15).steps.at(-1).then, /non sono sempre proporzionali/);
	assert.match(convertiVoto('11', 10, 15).error, /da 0 a 10/);
	assert.match(convertiVoto('-1', 10, 15).error, /da 0 a 10/);
	assert.match(convertiVoto('abc', 10, 15).error, /numero/);
	assert.match(convertiVoto('', 15, 10).error, /quindicesimi/);
	assert.equal(convertiVoto('7', 10, 12).ok, false);
	for (const a of SCALES)
		for (const b of SCALES)
			for (let k = 0; k <= 20; k++) {
				const v = (a * k) / 20;
				const o = convertiVoto(String(v).replace('.', ','), a, b);
				assert.ok(o.ok, `${v} ${a} ${b}: ${o.error}`);
				const want = Math.round(((v * b) / a) * 100) / 100;
				assert.equal(Number(o.copy.replace(/\s/g, '').replace(',', '.')), want, `${v}/${a} → ${b}`);
				if (k % 5 === 0) assertReadable(o, `${v}/${a} → ${b}`);
			}
});

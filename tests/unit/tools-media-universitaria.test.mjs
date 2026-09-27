// University averages on CFU and the degree mark: weighted mean · 110/30, plus the thesis points, rounded half up.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { mediaUniversitaria, votoLaurea, parseExams } = await jiti.import('../../src/lib/tools/media-universitaria.ts');

const EXAMS = '28 9\n30L 6\n25 12\n27 6\n30 9\n24 6';
const row = (o, label) => o.rows.find((r) => r.label === label)?.value;
const laurea = (p) => votoLaurea({ modo: 'esami', esami: EXAMS, lode: '30', media: '', tesi: '', ...p });

test('university: weighted and plain mean', () => {
	const o = mediaUniversitaria(EXAMS, '30');
	assert.ok(o.ok, o.error);
	// 252 + 180 + 300 + 162 + 270 + 144 = 1308, over 48 CFU.
	assert.equal(row(o, 'Media ponderata'), '$27{,}25$');
	assert.equal(row(o, 'Media aritmetica'), '$\\approx 27{,}33$');
	assert.equal(row(o, 'CFU con voto'), '$48$');
	// 27,25 · 110 / 30 = 99,91666…
	assert.equal(row(o, 'Base di laurea in centodecimi'), '$\\approx 99{,}92$');
	assert.equal(o.copy, '27,25');
	assert.equal(o.steps[0].group, 'La media ponderata');
	// The lode as 33: 1308 + 3 · 6 = 1326, over 48 = 27,625.
	assert.equal(mediaUniversitaria(EXAMS, '33').copy, '27,63');
	assert.equal(mediaUniversitaria(EXAMS, '').copy, '27,25');
	// One exam.
	const one = mediaUniversitaria('26 6');
	assert.equal(one.copy, '26');
	assert.equal(row(one, 'Media aritmetica'), undefined);
});

test('university: the ways to write an exam', () => {
	const forms = ['30L 6', '30 L 6', '30 e lode 6', '30elode 6', '30 lode 6', '30/30 e lode 6 cfu', '30l 6 CFU'];
	for (const f of forms) {
		const e = parseExams(f);
		assert.ok(Array.isArray(e), `${f}: ${e}`);
		assert.equal(e[0].mark, 30);
		assert.equal(e[0].lode, true, f);
		assert.equal(e[0].cfu.num, 6);
	}
	assert.equal(parseExams('28/30 9')[0].mark, 28);
	assert.equal(parseExams('28 7,5')[0].cfu.den, 2);
	assert.equal(parseExams('28 9; 27 6').length, 2);
	assert.match(parseExams('17 6'), /da 18 a 30/);
	assert.match(parseExams('28L 6'), /solo con 30/);
	assert.match(parseExams('28'), /non si capisce/);
	assert.match(parseExams('28 0'), /CFU/);
	assert.match(parseExams(''), /Scrivi i tuoi esami/);
	assert.match(mediaUniversitaria(EXAMS, '29').error, /da 30 a 34/);
});

test('university: brute force against a direct computation', () => {
	let seed = 7;
	const rnd = (n) => ((seed = (seed * 1103515245 + 12345) % 2147483648) % n);
	for (let k = 0; k < 300; k++) {
		const n = 1 + rnd(20);
		const exams = Array.from({ length: n }, () => ({ mark: 18 + rnd(13), cfu: [3, 5, 6, 8, 9, 12, 15][rnd(7)] }));
		const lodes = exams.map((e) => e.mark === 30 && rnd(2) === 0);
		const lodeValue = [30, 31, 33][rnd(3)];
		const text = exams.map((e, i) => `${e.mark}${lodes[i] ? 'L' : ''} ${e.cfu}`).join('\n');
		const val = exams.map((e, i) => (lodes[i] ? lodeValue : e.mark));
		const S = val.reduce((a, v, i) => a + v * exams[i].cfu, 0);
		const W = exams.reduce((a, e) => a + e.cfu, 0);
		const o = mediaUniversitaria(text, String(lodeValue));
		assert.equal(o.copy, (Math.round((S / W) * 100 + 1e-9) / 100).toFixed(2).replace(/\.?0+$/, '').replace('.', ','), text);
		const tesi = rnd(9);
		const l = votoLaurea({ modo: 'esami', esami: text, lode: String(lodeValue), media: '', tesi: String(tesi) });
		// Exact: (S · 110 + tesi · 30W) / 30W, rounded half up, at most 110.
		const want = Math.min(110, Math.floor((2 * (S * 110 + tesi * 30 * W) + 30 * W) / (60 * W)));
		assert.equal(l.copy, `${want}/110`, `${text} + ${tesi}`);
		assert.equal(l.rows.some((r) => r.label === 'Lode'), want === 110);
		if (k % 20 === 0) {
			assertReadable(o, text);
			assertReadable(l, text);
		}
	}
});

test('degree mark: from the mean, rounding and the cap', () => {
	const m = (media, tesi) => votoLaurea({ modo: 'media', esami: '', lode: '', media, tesi });
	// 27 · 110 / 30 = 99 exactly.
	assert.equal(m('27', '').rows[0].value, '$99$ su $110$');
	assert.equal(m('27', '').copy, '99/110');
	assert.equal(m('27', '4').copy, '103/110');
	assert.match(m('27', '4').steps.at(-2).say, /già intero/);
	// 24,8 → 90,9333 + 3 = 93,93 → 94.
	assert.equal(m('24,8', '3').copy, '94/110');
	// 29,5 → 108,1666 + 6 = 114,17 → 110, lode possible.
	const top = m('29,5', '6');
	assert.equal(top.copy, '110/110');
	assert.equal(top.rows.at(-1).label, 'Lode');
	assert.match(top.steps.at(-2).say, /non supera mai/);
	// 0 points still rounds.
	assert.equal(m('25,1', '0').copy, '92/110');
	assert.equal(laurea({ tesi: '5' }).copy, '105/110');
	assert.equal(laurea({ tesi: '5' }).steps.find((s) => s.group === 'Il voto di laurea').say, 'Porta la media ponderata in centodecimi.');
	assert.match(m('', '').error, /media ponderata/);
	assert.match(m('17', '').error, /da 18 a 30/);
	assert.match(m('27', '-1').error, /da 0 a 30/);
	assert.match(m('27', 'tanti').error, /da 0 a 30/);
	for (const o of [m('27', ''), m('27', '4'), m('24,8', '3'), top, laurea({}), laurea({ tesi: '5' }), m('17', '')]) assertReadable(o);
});

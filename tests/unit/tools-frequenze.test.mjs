// Tabella delle frequenze: the calculator's pure logic.
// Run with `node --test tests/unit/tools-frequenze.test.mjs` (jiti loads the TypeScript sources).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { frequenze } = await jiti.import('../../src/lib/tools/frequenze.ts');

const rows = (o) => Object.fromEntries(o.rows.map((r) => [r.label, r.value]));
const full = (o) => o.steps.at(-1).table;

test('the brothers and sisters of the lesson: 4, 9, 5, 2', () => {
	const o = frequenze('1 0 2 1 1 3 0 1 2 1 0 1 2 1 1 0 3 2 1 2');
	assert.equal(o.ok, true);
	assert.equal(rows(o)['Numero dei dati'], '$20$');
	assert.equal(rows(o)['Valori diversi'], '$4$');
	assert.equal(rows(o)['Moda'], '$1$, 9 volte');
	const t = full(o);
	assert.deepEqual(t.head, ['Valore', '$f_a$', '$f_r$', 'Percentuale', 'Cumulata']);
	assert.deepEqual(t.rows[0], ['$0$', '$4$', '$0{,}2$', '$20\\%$', '$4$']);
	assert.deepEqual(t.rows[1], ['$1$', '$9$', '$0{,}45$', '$45\\%$', '$13$']);
	assert.deepEqual(t.rows[3], ['$3$', '$2$', '$0{,}1$', '$10\\%$', '$20$']);
	assert.deepEqual(t.rows.at(-1), ['Totale', '$20$', '$1$', '$100\\%$', '']);
	const cum = o.steps.find((s) => s.group === 'Le frequenze cumulate').table.rows;
	assert.equal(cum[1][2], '$4 + 9 = 13$');
	assert.equal(o.copy.split('\n')[1], '0\t4\t0,2\t20 %\t4');
});

test('the heights in classes of width 10', () => {
	const heights = '172 158 165 181 169 174 160 155 177 163 188 170 166 172 152 183 161 176 168 179 165 159 185 171 164 178 167 180 175 162';
	const o = frequenze(heights, '10');
	assert.equal(rows(o)['Classi'], '$4$');
	assert.equal(rows(o)['Classe modale'], '$160 \\vdash 170$, 11 volte');
	assert.deepEqual(
		full(o).rows.map((r) => r.slice(0, 5)),
		[
			['$150 \\vdash 160$', '$4$', '$\\approx 0{,}133$', '$\\approx 13{,}3\\%$', '$4$'],
			['$160 \\vdash 170$', '$11$', '$\\approx 0{,}367$', '$\\approx 36{,}7\\%$', '$15$'],
			['$170 \\vdash 180$', '$10$', '$\\approx 0{,}333$', '$\\approx 33{,}3\\%$', '$25$'],
			['$180 \\vdash 190$', '$5$', '$\\approx 0{,}167$', '$\\approx 16{,}7\\%$', '$30$'],
			['Totale', '$30$', '$1$', '$100\\%$', '']
		]
	);
	assert.match(o.steps[0].then, /\$160\$ va nella classe/);
	// A chosen start, and an empty class in the middle.
	const gap = frequenze('1 2 3 21 22', '5', '0');
	assert.deepEqual(full(gap).rows.map((r) => r[1]), ['$3$', '$0$', '$0$', '$0$', '$2$', '$5$']);
	assert.equal(frequenze('1 2 3', '1', '2').ok, false);
	// Decimal widths.
	assert.equal(full(frequenze('0,1 0,25 0,4 0,45', '0,2')).rows[0][0], '$0 \\vdash 0{,}2$');
});

test('words: modalities without order, no cumulative column', () => {
	const o = frequenze('rosso blu verde blu Rosso blu giallo');
	assert.equal(rows(o)['Modalità diverse'], '$4$');
	assert.equal(rows(o)['Moda'], 'blu, 3 volte');
	assert.equal(full(o).head.length, 4);
	assert.deepEqual(full(o).rows[0], ['rosso', '$2$', '$\\approx 0{,}286$', '$\\approx 28{,}6\\%$']);
	assert.match(o.steps.at(-1).then, /non hanno un ordine/);
	assert.match(o.steps.at(-1).then, /100\{,\}1\\%/);
	assert.ok(!o.steps.some((s) => s.group === 'Le frequenze cumulate'));
	// Several words per datum, separated by commas.
	const eyes = frequenze('occhi azzurri, occhi neri, occhi azzurri');
	assert.deepEqual(full(eyes).rows.map((r) => r[0]), ['occhi azzurri', 'occhi neri', 'Totale']);
	assert.equal(rows(frequenze('a b c'))['Moda'], 'nessuna: tutte hanno la stessa frequenza');
	assert.equal(rows(frequenze('calcio, nuoto, calcio, nuoto, tennis'))['Mode'], 'calcio e nuoto, ciascuna due volte');
	// Numbers separated by commas without spaces are still numbers.
	assert.equal(rows(frequenze('1,2,3,3'))['Valori diversi'], '$3$');
});

test('wrong inputs fail with a sentence', () => {
	for (const [d, c, da] of [
		['', '', ''],
		['5', '', ''],
		['rosso $x blu', '', ''],
		['rosso blu', '10', ''],
		['1 2 3', '0', ''],
		['1 2 3', '-2', ''],
		['1 2 300', '1', ''],
		[Array.from({ length: 70 }, (_, i) => String(i)).join(' '), '', ''],
		[Array.from({ length: 501 }, () => '1').join(' '), '', '']
	]) {
		const o = frequenze(d, c, da);
		assert.equal(o.ok, false, `${d.slice(0, 20)} ${c}`);
		assert.ok(o.error.length > 20, o.error);
	}
});

test('checked by brute force on random data, and readable', () => {
	let seed = 5;
	const rnd = () => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
	for (let i = 0; i < 200; i++) {
		const n = 2 + Math.floor(rnd() * 60);
		const xs = Array.from({ length: n }, () => Math.floor(rnd() * 12) * (rnd() < 0.2 ? 0.5 : 1));
		const input = xs.map((x) => String(x).replace('.', ',')).join(' ');
		const withClasses = i % 2 === 1;
		const o = frequenze(input, withClasses ? '3' : '');
		assert.equal(o.ok, true, input);
		assertReadable(o, input);
		const t = full(o).rows.slice(0, -1);
		const counts = t.map((r) => Number(r[1].slice(1, -1)));
		assert.equal(counts.reduce((a, b) => a + b), n);
		if (withClasses) {
			const start = Math.floor(Math.min(...xs) / 3) * 3;
			t.forEach((_, k) => assert.equal(counts[k], xs.filter((x) => x >= start + 3 * k && x < start + 3 * k + 3).length));
		}
		else {
			const distinct = [...new Set(xs)].sort((a, b) => a - b);
			assert.equal(t.length, distinct.length);
			distinct.forEach((v, k) => assert.equal(counts[k], xs.filter((x) => x === v).length));
		}
		// The cumulative column ends at n.
		assert.equal(t.at(-1)[4], `$${n}$`);
	}
	assertReadable(frequenze('calcio, pallavolo, calcio, basket, nuoto'), 'sport');
});

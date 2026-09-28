// Grafico a torta: the calculator's pure logic and the SVG of the chart.
// Run with `node --test tests/unit/tools-grafico-a-torta.test.mjs` (jiti loads the TypeScript sources).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, {
	alias: { '@': new URL('../../src', import.meta.url).pathname }
});
const { graficoATorta, pieSvg, splitLine, PRINT_INK, PAGE_INK, PALETTE } = await jiti.import('../../src/lib/tools/grafico-a-torta.ts');

const rows = (o) => Object.fromEntries(o.rows.map((r) => [r.label, r.value]));
const group = (o, name) => o.steps.find((s) => s.group === name);
const full = (o) => group(o, 'La tabella completa').table;
const SCHOOL = 'Autobus; 9\nA piedi; 6\nAuto; 5\nBici; 3\nTreno; 2';

test('the way to school of a class of 25: exact percentages and angles', () => {
	const { outcome: o, chart } = graficoATorta(SCHOOL);
	assert.equal(o.ok, true);
	assertReadable(o, 'scuola');
	assert.equal(rows(o)['Totale'], '$25$');
	assert.equal(rows(o)['Spicchio più grande'], 'Autobus, $36\\%$');
	assert.deepEqual(full(o).head, ['Voce', 'Valore', '$f_r$', 'Percentuale', 'Angolo']);
	assert.deepEqual(full(o).rows[0], ['Autobus', '$9$', '$0{,}36$', '$36\\%$', '$129{,}6^\\circ$']);
	assert.deepEqual(full(o).rows[4], ['Treno', '$2$', '$0{,}08$', '$8\\%$', '$28{,}8^\\circ$']);
	assert.deepEqual(full(o).rows.at(-1), ['Totale', '$25$', '$1$', '$100\\%$', '$360^\\circ$']);
	assert.equal(o.steps[0].math[0], '9 + 6 + 5 + 3 + 2 = \\hl{25}');
	const angles = group(o, 'Gli angoli al centro').table.rows;
	assert.equal(angles[0][1], '$0{,}36 \\cdot 360^\\circ = \\hl{129{,}6^\\circ}$');
	const check = group(o, 'Il controllo');
	assert.equal(check.math[0], '36\\% + 24\\% + 20\\% + 12\\% + 8\\% = \\hl{100\\%}');
	assert.equal(check.math[1], '129{,}6^\\circ + 86{,}4^\\circ + 72^\\circ + 43{,}2^\\circ + 28{,}8^\\circ = \\hl{360^\\circ}');
	assert.match(check.then, /il cerchio è completo/);
	assert.equal(o.copy.split('\n')[1], 'Autobus\t9\t0,36\t36 %\t129,6°');
	assert.deepEqual(
		chart.slices.map((s) => [s.n, s.name, s.pct, s.small]),
		[
			[1, 'Autobus', '36', false],
			[2, 'A piedi', '24', false],
			[3, 'Auto', '20', false],
			[4, 'Bici', '12', false],
			[5, 'Treno', '8', false]
		]
	);
	assert.equal(chart.total, '25');
});

test('rounded percentages: declared, and the sums checked', () => {
	const { outcome: o } = graficoATorta('A; 1\nB; 1\nC; 1');
	assertReadable(o, 'terzi');
	assert.deepEqual(full(o).rows[0], ['A', '$1$', '$\\approx 0{,}333$', '$\\approx 33{,}3\\%$', '$120^\\circ$']);
	// The percentage comes from the exact fraction, not from the rounded 0,333.
	assert.equal(group(o, 'Le percentuali').table.rows[0][1], '$\\dfrac{1}{3} \\approx 0{,}333$');
	assert.equal(o.steps[2].table.rows[0][1], '$\\dfrac{1}{3} \\cdot 100 \\approx \\hl{33{,}3\\%}$');
	const check = group(o, 'Il controllo');
	assert.match(check.math[0], /= \\hl\{99\{,\}9\\%\}$/);
	assert.match(check.then, /le percentuali sommano a \$99\{,\}9\\%\$ invece di \$100\\%\$/);
	assert.doesNotMatch(check.then, /gli angoli/);
	// Both sums off.
	const seven = graficoATorta('A; 1\nB; 1\nC; 1\nD; 1\nE; 1\nF; 1\nG; 1').outcome;
	assert.match(group(seven, 'Il controllo').then, /le percentuali sommano a \$100\{,\}1\\%\$ invece di \$100\\%\$ e gli angoli a \$359\{,\}8\^\\circ\$ invece di/);
	// Rounded values that still add up.
	const ok = graficoATorta('A; 1\nB; 2\nC; 3').outcome;
	assert.match(group(ok, 'Il controllo').then, /anche con gli arrotondamenti/);
});

test('decimal values and the largest slice', () => {
	const { outcome: o } = graficoATorta('Sonno; 8\nScuola; 6\nStudio; 2,5\nSport; 1,5\nPasti; 2\nTempo libero; 4');
	assertReadable(o, 'ore');
	assert.equal(rows(o)['Totale'], '$24$');
	assert.equal(o.steps[0].math[0], '8 + 6 + 2{,}5 + 1{,}5 + 2 + 4 = \\hl{24}');
	assert.equal(group(o, 'Le percentuali').table.rows[2][1], '$\\dfrac{2{,}5}{24} \\approx 0{,}104$');
	assert.equal(rows(o)['Spicchio più grande'], 'Sonno, $\\approx 33{,}3\\%$');
	const tie = graficoATorta('Calcio; 5\nNuoto; 5\nTennis; 2').outcome;
	assert.equal(rows(tie)['Spicchi più grandi'], 'Calcio e Nuoto, $\\approx 41{,}7\\%$ ciascuno');
});

test('sorted from the largest, stable on ties', () => {
	const { outcome: o, chart } = graficoATorta('Treno; 2\nAutobus; 9\nBici; 3\nAuto; 3', true);
	assertReadable(o, 'ordinati');
	assert.deepEqual(
		chart.slices.map((s) => s.name),
		['Autobus', 'Bici', 'Auto', 'Treno']
	);
	assert.match(o.steps[0].then, /in ordine dalla più grande/);
});

test('zeros are left out with a note; small slices get only a number', () => {
	const { outcome: o, chart } = graficoATorta('Cioccolato; 42\nFragola; 30\nPistacchio; 25\nLimone; 18\nNocciola; 12\nMenta; 3\nLiquirizia; 2\nAmarena; 0');
	assertReadable(o, 'gelati');
	assert.equal(rows(o)['Voce senza spicchio'], 'Amarena (valore $0$)');
	assert.match(o.steps[0].then, /"Amarena" vale \$0\$: nel grafico non ha uno spicchio/);
	assert.equal(chart.slices.length, 7);
	assert.deepEqual(
		chart.slices.map((s) => s.small),
		[false, false, false, false, false, true, true]
	);
	assert.match(full(o).rows.length && group(o, 'La tabella completa').then, /sotto il \$3\\%\$/);
	const { svg } = pieSvg(chart, { title: 'Gelati' });
	// Small slices: the number in a circle beside the slice, the name only in the legend.
	assert.equal((svg.match(/>Menta</g) ?? []).length, 1);
	assert.equal((svg.match(/<circle /g) ?? []).length, 2);
	// Exactly 3 % is not small.
	assert.equal(graficoATorta('A; 97\nB; 3').chart.slices[1].small, false);
	// Two zeros.
	const two = graficoATorta('A; 5\nB; 0\nC; 0').outcome;
	assert.equal(rows(two)['Voci senza spicchio'], 'B e C (valore $0$)');
});

test('one item is the whole circle', () => {
	const { outcome: o, chart } = graficoATorta('Promossi; 24');
	assertReadable(o, 'uno');
	assert.deepEqual(full(o).rows[0], ['Promossi', '$24$', '$1$', '$100\\%$', '$360^\\circ$']);
	assert.equal(group(o, 'Gli angoli al centro').then, 'Una voce sola occupa tutto il cerchio.');
	assert.equal(chart.slices[0].frac, 1);
	for (const donut of [false, true]) {
		const { svg } = pieSvg(chart, { donut });
		// Two half arcs make the circle; the ring has a second pair for the hole.
		const d = /<path d="([^"]+)"/.exec(svg)[1];
		assert.equal((d.match(/A/g) ?? []).length, donut ? 4 : 2);
		assert.doesNotMatch(d, /NaN/);
	}
});

test('pasted tables: tabs, headings, totals and other separators', () => {
	// The copy of the frequency table: a heading, four columns, the total.
	const freq = 'Modalità\tFrequenza assoluta\tFrequenza relativa\tPercentuale\nrosso\t2\t0,286\t28,6 %\nblu\t3\t0,429\t42,9 %\nverde\t2\t0,286\t28,6 %\nTotale\t7\t1\t100 %';
	const { outcome: o, chart } = graficoATorta(freq);
	assertReadable(o, 'frequenze');
	assert.deepEqual(
		chart.slices.map((s) => [s.name, s.pct]),
		[
			['rosso', '28,6'],
			['blu', '42,9'],
			['verde', '28,6']
		]
	);
	assert.match(o.steps[0].then, /La prima riga, "Modalità", è l'intestazione/);
	assert.match(o.steps[0].then, /La riga "Totale" è la somma/);
	assert.equal(rows(o)['Totale'], '$7$');
	// Classes of the frequency table: the semicolon inside the cell is not a separator when there are tabs.
	assert.deepEqual(splitLine('[150; 160[\t4\t0,133'), ['[150; 160[', '4']);
	assert.deepEqual(splitLine('Bus: 12'), ['Bus', '12']);
	assert.deepEqual(splitLine('Ore di sport; 1,5'), ['Ore di sport', '1,5']);
	assert.deepEqual(splitLine('A piedi 6'), ['A piedi', '6']);
	assert.deepEqual(splitLine('A piedi, 6'), ['A piedi', '6']);
	assert.deepEqual(splitLine('Studio; 25 %'), ['Studio', '25 %']);
	assert.deepEqual(splitLine('Solo un nome'), ['Solo un nome', '']);
	assert.deepEqual(
		graficoATorta('Studio; 25 %\nGioco; 75 %').chart.slices.map((s) => s.pct),
		['25', '75']
	);
	// Windows line ends and empty rows of the editor.
	assert.equal(graficoATorta('A; 1\r\n; \r\nB; 3\n\n').chart.slices.length, 2);
});

test('wrong inputs get a sentence that says what to write', () => {
	const bad = {
		'': /almeno una voce/,
		'; ': /almeno una voce/,
		'Autobus; -3': /non possono essere negativi/,
		'Autobus; −3': /non possono essere negativi/,
		'A; 0\nB; 0': /Tutti i valori sono zero/,
		Autobus: /Manca il valore di "Autobus"/,
		'Autobus; tanti': /non è un numero/,
		'; 9': /manca il nome/,
		'Costo in $; 9': /contiene \$/,
		[`${'x'.repeat(41)}; 3`]: /troppo lungo/,
		[Array.from({ length: 13 }, (_, i) => `V${i}; 1`).join('\n')]: /al massimo 12/,
		'A; 99999999999999\nB; 0,000000000001': /troppo grandi/
	};
	for (const [input, re] of Object.entries(bad)) {
		const { outcome, chart } = graficoATorta(input);
		assert.equal(outcome.ok, false, input);
		assert.match(outcome.error, re, input);
		assert.equal(chart, null);
		assertReadable(outcome, input);
	}
	// A first row with a word for value is a heading only when more rows follow.
	assert.match(graficoATorta('Autobus; tanti\nAuto; 3').outcome.ok ? 'ok' : '', /ok/);
});

test('the SVG: every slice drawn, labelled and in the legend; names escaped', () => {
	const { chart } = graficoATorta("Pane & <burro>; 3\nL'olio; 1");
	const { svg, width, height } = pieSvg(chart, {
		title: 'Colazione "vera"',
		ink: PRINT_INK
	});
	assert.ok(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'));
	assert.equal(width, 500);
	assert.ok(height > 300);
	assert.match(svg, /Pane &amp; &lt;burro&gt;/);
	assert.doesNotMatch(svg, /<burro>/);
	assert.match(svg, /Colazione &quot;vera&quot;/);
	assert.match(svg, /<rect width="500" height="\d+" fill="#ffffff"\/>/);
	assert.match(svg, /<title>Colazione &quot;vera&quot;\. Grafico a torta: Pane &amp; &lt;burro&gt; 75 %; L&#39;olio 25 %\.<\/title>/);
	// On the page: no background, the site's tokens.
	const page = pieSvg(chart, { ink: PAGE_INK }).svg;
	assert.doesNotMatch(page, /fill="#ffffff"/);
	assert.match(page, /var\(--fg-strong\)/);
	// Twelve items: stripes from the ninth, all twelve in the legend, no NaN anywhere.
	const many = graficoATorta(Array.from({ length: 12 }, (_, i) => `Voce ${i + 1}; ${i + 1}`).join('\n')).chart;
	const big = pieSvg(many, { donut: true }).svg;
	assert.equal((big.match(/<pattern /g) ?? []).length, 4);
	assert.equal((big.match(/<rect x=/g) ?? []).length, 12);
	assert.doesNotMatch(big, /NaN|undefined/);
	assert.match(big, />Totale</);
	assert.equal(PALETTE.length, 8);
});

test('labels on one side never overlap, even with many thin slices together', () => {
	const input = ['Grande; 60', ...'BCDEFGHILMN'.split('').map((c) => `${c}; ${c < 'I' ? 4 : 3}`)].join('\n');
	const { chart } = graficoATorta(input);
	const { svg } = pieSvg(chart, {});
	// The label lines end at the text: their last point, by side.
	const ends = [...svg.matchAll(/<polyline points="[^"]* ([\d.]+),([\d.]+)"/g)].map((m) => [Number(m[1]), Number(m[2])]);
	assert.equal(ends.length, 12);
	for (const side of [(x) => x < 250, (x) => x > 250]) {
		const ys = ends
			.filter(([x]) => side(x))
			.map(([, y]) => y)
			.sort((a, b) => a - b);
		for (let i = 1; i < ys.length; i++) assert.ok(ys[i] - ys[i - 1] >= 21.9, `${ys[i - 1]} → ${ys[i]}`);
	}
});

test('brute force: the angles of random data close the circle and the table adds up', () => {
	let seed = 7;
	const rand = () => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
	for (let k = 0; k < 300; k++) {
		const n = 1 + Math.floor(rand() * 12);
		const values = Array.from({ length: n }, () => (rand() < 0.1 ? 0 : Math.round(rand() * 1000) / 10));
		if (values.every((v) => v === 0)) values[0] = 1;
		const input = values.map((v, i) => `Voce ${i + 1}; ${String(v).replace('.', ',')}`).join('\n');
		const { outcome: o, chart } = graficoATorta(input, rand() < 0.5);
		assert.equal(o.ok, true, input);
		if (k < 40) assertReadable(o, input);
		const positive = values.filter((v) => v > 0);
		assert.equal(chart.slices.length, positive.length);
		assert.ok(Math.abs(chart.slices.reduce((a, s) => a + s.frac, 0) - 1) < 1e-9, input);
		const total = positive.reduce((a, b) => a + b, 0);
		for (const s of chart.slices) {
			const v = values[Number(s.name.slice(5)) - 1];
			assert.ok(Math.abs(s.frac - v / total) < 1e-12);
			const pct = Number(s.pct.replace(',', '.').replace('< 0.1', '0'));
			assert.ok(Math.abs(pct - (v / total) * 100) <= 0.05 + 1e-9, `${s.name}: ${s.pct} vs ${(v / total) * 100}`);
			assert.equal(s.small, (v / total) * 100 < 3 - 1e-12);
		}
		// The rounded sums differ from 100 and 360 by at most half a unit of the last digit per slice.
		const check = o.steps.find((s) => s.group === 'Il controllo');
		const sum = (line) => Number(/\\hl\{([\d{},]+)/.exec(line)[1].replace('{,}', '.'));
		assert.ok(Math.abs(sum(check.math[0]) - 100) <= 0.05 * n + 1e-9);
		assert.ok(Math.abs(sum(check.math[1]) - 360) <= 0.05 * n + 1e-9);
		const { svg } = pieSvg(chart, { donut: rand() < 0.5, title: 'Prova' });
		assert.doesNotMatch(svg, /NaN|undefined|Infinity/);
	}
});

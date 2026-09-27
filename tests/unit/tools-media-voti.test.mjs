// Calcolo della media dei voti: grade notation, averages, the grade you need.
// Run with `node --test tests/unit/tools-media-voti.test.mjs` (jiti loads the TypeScript sources).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import katex from 'katex';

/** Every string the page shows: the rows, and each step's sentence, lines, table and conclusion. */
const texts = (o) => [
	...o.rows.flatMap((r) => [r.label, r.value]),
	...o.steps.flatMap((s) => [s.group ?? '', s.say, ...(s.table?.head ?? []), ...(s.table?.rows.flat() ?? []), s.then ?? ''])
];
const all = (o) => [...texts(o), ...o.steps.flatMap((s) => s.math ?? [])].join(' ');

/** KaTeX as the tools set it (src/lib/tools/tex.ts), but throwing on any error. */
const KATEX = { throwOnError: true, strict: 'ignore', macros: { '\\hl': '\\htmlClass{hl}{#1}' }, trust: (c) => c.command === '\\htmlClass' };

/** Everything typesets, and every sentence follows the readability rules: short, no calculation inside. */
function assertReadable(o) {
	if (!o.ok) return;
	for (const text of texts(o))
		for (const m of text.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g)) {
			const src = m[1] ?? m[2];
			assert.doesNotThrow(() => katex.renderToString(src, { ...KATEX, displayMode: !!m[1] }), src);
		}
	for (const s of o.steps) {
		for (const line of s.math ?? []) assert.doesNotThrow(() => katex.renderToString(`{\\displaystyle ${line}}`, KATEX), line);
		assert.ok(!s.say.includes('$$'), s.say);
		assert.ok((s.say.match(/=/g) ?? []).length <= 1, s.say);
		assert.ok(s.say.split(/\s+/).length <= 15, s.say);
		assert.ok(s.math || s.table || s.then, `a step with nothing under it: ${s.say}`);
	}
	assert.ok(o.steps.length <= 5 || o.steps[0].group, 'more than five steps need groups');
	assert.ok(o.rows.length > 0);
}

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { parseGrade, parseGrades, mediaVoti, votoCheServe, quarterGrade } = await jiti.import('../../src/lib/tools/media-voti.ts');
const { parseDecimal } = await jiti.import('../../src/lib/tools/numbers.ts');

const value = (s) => {
	const g = parseGrade(s);
	return typeof g === 'string' ? g : g.value.toString();
};

test('grade notation', () => {
	assert.equal(value('6'), '6');
	assert.equal(value('7,5'), '15/2');
	assert.equal(value('7.5'), '15/2');
	assert.equal(value('6+'), '25/4');
	assert.equal(value('6-'), '23/4');
	assert.equal(value('6½'), '13/2');
	assert.equal(value('6 e mezzo'), '13/2');
	assert.equal(value('6 E MEZZO'), '13/2');
	assert.equal(value('7/8'), '15/2');
	assert.equal(value('7-8'), '15/2');
	assert.equal(value('5/6'), '11/2');
	assert.equal(value('10 e lode'), '10');
	assert.equal(value('10L'), '10');
	assert.equal(value('1-'), '3/4');
	assert.equal(value('0'), '0');
	assert.equal(value('10'), '10');
	assert.equal(value('9½'), '19/2');
	assert.equal(parseGrade('6+').notation, true);
	assert.equal(parseGrade('6,5').notation, false);
});

test('grades that are not grades', () => {
	for (const s of ['10+', '11', '10½', '-2', '6--', '6++', '7/9', '8/7', 'sei', '6+-', '', '6,25+']) assert.equal(typeof parseGrade(s), 'string', s);
	assert.match(parseGrade('6--'), /5,5/);
	assert.match(parseGrade('6++'), /6,5/);
	assert.match(parseGrade('10+'), /da 0 a 10/);
	assert.match(parseGrade('7/9'), /due voti vicini/);
});

test('lists of grades, with every notation', () => {
	const gs = parseGrades('6+ 7- 5½ 7/8 6 e mezzo 10 e lode');
	assert.deepEqual(
		gs.map((g) => g.value.toString()),
		['25/4', '27/4', '11/2', '15/2', '13/2', '10']
	);
	assert.equal(parseGrades('6, 7, 8').length, 3);
	assert.equal(parseGrades('6; 7,5; 8').length, 3);
	assert.equal(parseGrades('6 - 7 8')[0].value.toString(), '13/2');
	assert.equal(parseGrades('6- 7').length, 2);
	assert.equal(typeof parseGrades(''), 'string');
	assert.equal(typeof parseGrades('6 x'), 'string');
});

test('simple average', () => {
	const o = mediaVoti('6+ 7- 5½ 7/8 6 e mezzo 10 e lode');
	assert.equal(o.copy, '7,08');
	assert.deepEqual(o.rows, [{ label: 'Media dei voti', value: '$\\approx 7{,}08$' }]);
	// The grades as written and what they are worth, in a table.
	assert.deepEqual(o.steps[0].table.head, ['Voto scritto', 'Vale']);
	assert.deepEqual(o.steps[0].table.rows.slice(0, 3), [
		['$\\text{6+}$', '$\\hl{6{,}25}$'],
		['$\\text{7-}$', '$\\hl{6{,}75}$'],
		['$5\\tfrac{1}{2}$', '$\\hl{5{,}5}$']
	]);
	assert.deepEqual(o.steps[1].math, ['6{,}25 + 6{,}75 + 5{,}5 = 18{,}5', '7{,}5 + 6{,}5 + 10 = 24', '18{,}5 + 24 = \\hl{42{,}5}']);
	assert.deepEqual(o.steps[2].math, ['\\dfrac{42{,}5}{6} \\approx \\hl{7{,}08}']);
	// The report card note is the last step.
	assert.match(o.steps[o.steps.length - 1].then, /consiglio di classe/);
	assert.deepEqual(mediaVoti('6+ 7- 5½ 7/8 8').rows, [{ label: 'Media dei voti', value: '$6{,}8$' }]);
	assert.match(all(o), /\\dfrac\{42\{,\}5\}\{6\}/);
	assert.match(all(o), /consiglio di classe/);
	assert.equal(mediaVoti('6 7 8').copy, '7');
	assert.equal(mediaVoti('6 7').copy, '6,5');
	assert.equal(mediaVoti('5 5 6').copy, '5,33');
	assert.equal(mediaVoti('6 6 7').copy, '6,33');
	assert.equal(mediaVoti('6 7 7').copy, '6,67');
	assert.equal(mediaVoti('8').copy, '8');
	// Plain numbers: no conversion step.
	assert.doesNotMatch(all(mediaVoti('6 7 8')), /Trasforma/);
});

test('weighted average', () => {
	const o = mediaVoti('6 7 8', '1 1 2');
	assert.equal(o.copy, '7,25');
	assert.match(all(o), /somma dei pesi/);
	assert.deepEqual(o.steps[0].math, ['6 \\cdot 1 = 6', '7 \\cdot 1 = 7', '8 \\cdot 2 = 16']);
	assert.deepEqual(o.steps[1].math, ['6 + 7 + 16 = \\hl{29}']);
	assert.deepEqual(o.steps[3].math, ['\\dfrac{29}{4} = \\hl{7{,}25}']);
	// With notation and weights, the table has the weights too; six steps or more are grouped.
	const both = mediaVoti('6+ 7-', '2 2');
	assert.deepEqual(both.steps[0].table.head, ['Voto scritto', 'Vale', 'Peso']);
	assert.equal(both.steps[0].group, 'La media ponderata');
	assert.equal(mediaVoti('6 8', '50% 100%').copy, '7,33');
	assert.equal(mediaVoti('5 7', '30 70').copy, '6,4');
	assert.equal(mediaVoti('6+ 7-', '2 2').copy, '6,5');
	assert.equal(mediaVoti('6 7', '1').ok, false);
	assert.equal(mediaVoti('6 7', '1 0').ok, false);
	assert.equal(mediaVoti('6 7', '1 x').ok, false);
});

test('the grade you need', () => {
	const one = votoCheServe({ grades: '5 6+ 5½', target: '6', count: '1' });
	assert.equal(one.copy, 'almeno 7,25');
	assert.deepEqual(one.rows, [
		{ label: 'Voto che ti serve', value: 'almeno $7{,}25$' },
		{ label: 'Scritto sul registro', value: 'almeno $\\text{7+}$' },
		{ label: 'Media di adesso', value: '$\\approx 5{,}58$' }
	]);
	assert.match(all(one), /\\hl\{\\text\{7\+\}\} = 7\{,\}25/);
	assert.ok(one.steps.some((s) => s.math?.includes('\\dfrac{16{,}75 + x}{4} = 6')));
	assert.ok(one.steps.some((s) => s.math?.includes('x = \\hl{7{,}25}')));
	assert.deepEqual(
		one.steps.map((s) => s.group).filter(Boolean),
		['La media di adesso', 'Il voto che serve', 'Il voto in pagella']
	);
	// Rounded up, never down: 4 5 → 6 needs 9 with one grade.
	assert.equal(votoCheServe({ grades: '4 5', target: '6', count: '1' }).copy, 'almeno 9');
	// 5 5 5 → 6 needs 9; 5 5 → 6 with two grades needs a mean of 7.
	assert.equal(votoCheServe({ grades: '5 5 5', target: '6', count: '1' }).copy, 'almeno 9');
	const two = votoCheServe({ grades: '5 5', target: '6', count: '2' });
	assert.equal(two.copy, 'almeno 7');
	assert.deepEqual(two.rows[0], { label: 'Media che ti serve nei prossimi 2 voti', value: 'almeno $7$' });
	assert.match(all(two), /2 voti con media \$x\$ sommano \$2x\$/);
	// (5 + 6 + x)/3 = 6,5 → x = 8,5; (5 + 5 + 6 + x)/4 = 6,1 → x = 8,4.
	assert.equal(votoCheServe({ grades: '5 6', target: '6,5', count: '1' }).copy, 'almeno 8,5');
	assert.equal(votoCheServe({ grades: '5 5 6', target: '6,1', count: '1' }).copy, 'almeno 8,4');
	const odd = votoCheServe({ grades: '5 6 6', target: '6', count: '3' });
	// (17 + 3x)/6 = 6 → x = 19/3 = 6,333… → at least 6,34.
	assert.equal(odd.copy, 'almeno 6,34');
	assert.match(all(odd), /Arrotonda per eccesso/);
	// The quarter grade that is enough: 6,34 → 6½.
	assert.equal(quarterGrade(parseDecimal('6,34')).text, '6½');
	assert.equal(quarterGrade(parseDecimal('6,6')).text, '7-');
	assert.equal(quarterGrade(parseDecimal('7')).text, '7');
	assert.equal(quarterGrade(parseDecimal('7,01')).text, '7+');
	assert.equal(quarterGrade(parseDecimal('9,9')).text, '10');
	// Weighted: 6 (peso 1), 5 (peso 2), next grade peso 2, target 6 → (16 + 2x)/5 = 6 → x = 7.
	assert.equal(votoCheServe({ grades: '6 5', weights: '1 2', target: '6', count: '1', nextWeight: '2' }).copy, 'almeno 7');
	// The target in school notation.
	assert.equal(votoCheServe({ grades: '6 6', target: '6+', count: '1' }).copy, 'almeno 6,75');
});

test('impossible or already safe', () => {
	const no = votoCheServe({ grades: '4 4 5', target: '7', count: '1' });
	assert.equal(no.copy, 'impossibile (servirebbe 15)');
	assert.match(no.rows[0].value, /Impossibile/);
	assert.match(all(no), /più di 10/);
	// Exactly 10 is still possible.
	assert.equal(votoCheServe({ grades: '8', target: '9', count: '1' }).copy, 'almeno 10');
	assert.match(votoCheServe({ grades: '4 4', target: '6,5', count: '1' }).copy, /impossibile/);
	const any = votoCheServe({ grades: '9 10', target: '6', count: '1' });
	assert.equal(any.copy, 'qualsiasi voto');
	assert.equal(any.rows[0].value, 'Qualsiasi voto');
	assert.equal(votoCheServe({ grades: '9 10', target: '6', count: '2' }).copy, 'almeno 2,5');
});

test('the grade found gives the target back', () => {
	for (const grades of ['5 6', '4 6+ 7', '3 5- 6½ 8', '7 7 8/9']) {
		for (const target of ['5', '6', '6,5', '7']) {
			for (const count of [1, 2, 3]) {
				const o = votoCheServe({ grades, target, count: String(count) });
				assert.equal(o.ok, true);
				assertReadable(o);
				if (!o.copy.startsWith('almeno')) continue;
				const x = parseDecimal(o.copy.replace('almeno ', ''));
				const vs = parseGrades(grades).map((g) => g.value);
				const mean = vs.reduce((a, b) => a.add(b)).add(x.mul(parseDecimal(String(count)))).div(parseDecimal(String(vs.length + count)));
				const t = parseDecimal(target);
				assert.ok(mean.compare(t) >= 0, `${grades} → ${target}`);
				// And one hundredth less is not enough.
				const less = vs.reduce((a, b) => a.add(b)).add(x.sub(parseDecimal('0,01')).mul(parseDecimal(String(count)))).div(parseDecimal(String(vs.length + count)));
				assert.ok(less.compare(t) < 0, `${grades} → ${target} minimal`);
			}
		}
	}
});

test('every example reads well and typesets', () => {
	for (const [voti, pesi] of [
		['6+ 7- 5½ 7/8 8', ''],
		['6+ 7- 5½', ''],
		['6 e mezzo 7/8 5-', ''],
		['4 6 7', '1 1 2'],
		['6+ 7-', '2 2'],
		['10 e lode 8', ''],
		['8', ''],
		['6 7 8 5 4 9 7 6 5 8 7 6', '']
	])
		assertReadable(mediaVoti(voti, pesi));
	for (const input of [
		{ grades: '6+ 7- 5½ 7/8 8', target: '7', count: '1' },
		{ grades: '4 5', target: '6', count: '1' },
		{ grades: '5 5½ 6-', target: '6', count: '2' },
		{ grades: '3 4', target: '7', count: '1' },
		{ grades: '9 10', target: '6', count: '1' },
		{ grades: '6 5', weights: '1 2', target: '6', count: '1', nextWeight: '2' },
		{ grades: '6 5', weights: '1 2', target: '6', count: '3', nextWeight: '2' },
		{ grades: '5 6', target: '6', count: '3', nextWeight: '1,5' },
		{ grades: '8', target: '9', count: '1' }
	])
		assertReadable(votoCheServe(input));
});

test('wrong inputs for the grade you need', () => {
	for (const input of [
		{ grades: '', target: '6', count: '1' },
		{ grades: '6', target: '', count: '1' },
		{ grades: '6', target: '11', count: '1' },
		{ grades: '6', target: '0', count: '1' },
		{ grades: '6', target: '6', count: '0' },
		{ grades: '6', target: '6', count: '21' },
		{ grades: '6', target: '6', count: '1,5' },
		{ grades: '6', target: '6', count: '1', nextWeight: '0' },
		{ grades: '6 7', weights: '1', target: '6', count: '1' }
	]) {
		const o = votoCheServe(input);
		assert.equal(o.ok, false, JSON.stringify(input));
		assert.ok(o.error.length > 10);
		assert.match(o.error, /per esempio/, o.error);
	}
});

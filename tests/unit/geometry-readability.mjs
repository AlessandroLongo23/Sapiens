// Checks shared by the geometry and Pythagoras tests: every string of an Outcome goes through KaTeX, and the steps follow
// the readability rules for students with DSA (docs/strumenti.md, "Leggibilità").
import assert from 'node:assert/strict';
import katex from 'katex';

/** The options of src/lib/tools/tex.ts, but throwing, so a broken formula fails the test. */
const OPTIONS = { throwOnError: true, strict: 'ignore', output: 'htmlAndMathml', macros: { '\\hl': '\\htmlClass{hl}{#1}' }, trust: (c) => c.command === '\\htmlClass' };

const formula = (source, where) => {
	try {
		katex.renderToString(`{\\displaystyle ${source}}`, OPTIONS);
	} catch (e) {
		assert.fail(`${where}: ${source}\n${e.message}`);
	}
};

/** Prose with `$…$` and `$$…$$`, split as mathText does. */
const prose = (text, where) => {
	const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g);
	parts.forEach((part, i) => {
		if (i % 2 === 0) assert.ok(!part.includes('$'), `${where}: a lone $ in "${text}"`);
		else formula(part.startsWith('$$') ? part.slice(2, -2) : part.slice(1, -1), where);
	});
};

/** Every rendered string of an Outcome, checked; the rules on `say`. */
export function checkReadable(outcome, where) {
	assert.ok(outcome.ok, `${where}: ${outcome.error}`);
	assert.ok(outcome.rows.length > 0, `${where}: no rows`);
	for (const row of outcome.rows) {
		assert.ok(row.label && !row.label.includes('$'), `${where}: a row label in words`);
		prose(row.value, `${where} row ${row.label}`);
		// One quantity per row: a single symbol before a single "=" or "≈".
		assert.ok((row.value.match(/=/g) ?? []).length <= 1, `${where}: two quantities in "${row.value}"`);
	}
	outcome.steps.forEach((s, i) => {
		const at = `${where} step ${i + 1}`;
		prose(s.say, `${at} say`);
		assert.ok(!s.say.includes('$$'), `${at}: $$ in say`);
		assert.ok((s.say.match(/=/g) ?? []).length <= 1, `${at}: a calculation in say "${s.say}"`);
		const words = s.say.replace(/\$[^$]+\$/g, 'x').split(/\s+/).length;
		assert.ok(words <= 16, `${at}: ${words} words in "${s.say}"`);
		for (const line of s.math ?? []) formula(line, `${at} math`);
		for (const row of [...(s.table?.head ? [s.table.head] : []), ...(s.table?.rows ?? [])]) for (const cell of row) prose(cell, `${at} table`);
		if (s.then) prose(s.then, `${at} then`);
		if (s.group) assert.ok(!s.group.includes('$'), `${at}: group in words`);
	});
	if (outcome.steps.length > 5) assert.ok(outcome.steps[0].group, `${where}: more than five steps need groups`);
}

/** All the text of the steps, for the tests that look for a word. */
export const stepsText = (outcome) => outcome.steps.flatMap((s) => [s.say, ...(s.math ?? []), ...(s.table?.rows.flat() ?? []), s.then ?? '']).join(' ');

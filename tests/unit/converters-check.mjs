// Shared by the converter tests (equivalenze, temperatura, gradi e radianti, basi): every string an Outcome shows
// must typeset in KaTeX with the tools' options (the `\hl` macro included), and each step's sentence stays a sentence.
import assert from 'node:assert/strict';
import katex from 'katex';

const OPTIONS = { throwOnError: true, strict: 'ignore', macros: { '\\hl': '\\htmlClass{hl}{#1}' }, trust: (c) => c.command === '\\htmlClass' };

const typeset = (src, display = false) => assert.doesNotThrow(() => katex.renderToString(src, { ...OPTIONS, displayMode: display }), src);

/** Prose with `$…$` and `$$…$$`: each formula typesets, and no LaTeX is left in the prose around them. */
function prose(text, where) {
	const rest = text.replace(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g, (_, d, i) => {
		typeset(d ?? i, !!d);
		return '';
	});
	assert.ok(!/[\\$^_{}]/.test(rest), `${where}: LaTeX outside a formula in "${text}"`);
}

/** Checks a successful Outcome; failures only need an error in words. */
export function assertReadable(o, context = '') {
	if (!o.ok) {
		assert.ok(o.error.length > 10 && !o.error.includes('\\'), `${context}: ${o.error}`);
		return;
	}
	assert.ok(o.rows.length > 0, `${context}: no rows`);
	for (const r of o.rows) {
		prose(r.label, `${context} label`);
		prose(r.value, `${context} value`);
	}
	for (const s of o.steps) {
		prose(s.say, `${context} say`);
		assert.ok(!s.say.includes('$$'), `${context}: $$ in "${s.say}"`);
		assert.ok((s.say.match(/=/g) ?? []).length <= 1, `${context}: more than one "=" in "${s.say}"`);
		assert.ok(s.say.split(/\s+/).length <= 18, `${context}: long sentence "${s.say}"`);
		for (const m of s.math ?? []) typeset(`{\\displaystyle ${m}}`);
		for (const cell of [...(s.table?.head ?? []), ...(s.table?.rows.flat() ?? [])]) prose(cell, `${context} table`);
		if (s.then) prose(s.then, `${context} then`);
	}
}

/** All the text of the steps in one string, for matching: sentences, formulas, table cells, conclusions. */
export const stepText = (o) =>
	o.steps.flatMap((s) => [s.say, ...(s.math ?? []), ...(s.table?.head ?? []), ...(s.table?.rows.flat() ?? []), s.then ?? '']).join(' ');

/** The values of the result rows in one string. */
export const rowText = (o) => o.rows.map((r) => r.value).join(' ');

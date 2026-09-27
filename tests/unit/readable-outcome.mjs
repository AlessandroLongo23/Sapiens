// Shared checks for a tool's Outcome against the readability rules (docs/strumenti.md, "Leggibilità: le regole per
// i DSA"): every rendered string typesets in KaTeX with the tools' options, and every `say` is one short sentence
// with no calculation in it. Not a test file itself: the tool tests import it.
import assert from 'node:assert/strict';
import katex from 'katex';

/** The options of src/lib/tools/tex.ts, with errors thrown. */
const OPTIONS = {
	throwOnError: true,
	strict: 'ignore',
	macros: { '\\hl': '\\htmlClass{hl}{#1}' },
	trust: (context) => context.command === '\\htmlClass'
};

const render = (src, display) => katex.renderToString(src, { ...OPTIONS, displayMode: display });

/** Prose with `$…$` and `$$…$$` formulas, as `mathText` reads it: each formula must typeset. */
function assertText(text, where) {
	assert.equal(typeof text, 'string', where);
	for (const m of text.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g)) {
		const src = (m[1] ?? m[2]).trim();
		assert.doesNotThrow(() => render(m[1] ? src : `{\\displaystyle ${src}}`, !!m[1]), `${where}: ${src}`);
	}
	// A lone dollar would print as text.
	const rest = text.replace(/\$\$[\s\S]+?\$\$|\$[^$\n]+?\$/g, '');
	assert.ok(!rest.includes('$'), `${where}: unmatched $ in ${text}`);
}

/** Every string the tool sheet renders typesets; each `say` is short, with at most one "=" and no display formula. */
export function assertReadable(o, name = '') {
	if (!o.ok) {
		assert.ok(o.error.length > 10, name);
		return;
	}
	assert.ok(Array.isArray(o.rows) && o.rows.length > 0, `${name}: rows`);
	for (const r of o.rows) {
		assert.ok(r.label && !r.label.includes('$'), `${name}: label in words: ${r.label}`);
		assertText(r.value, `${name} value`);
	}
	assert.ok(o.steps.length > 0, `${name}: steps`);
	for (const s of o.steps) {
		assertText(s.say, `${name} say`);
		assert.ok(!s.say.includes('$$'), `${name}: $$ in say: ${s.say}`);
		assert.ok((s.say.match(/=/g) ?? []).length <= 1, `${name}: more than one = in say: ${s.say}`);
		const words = s.say.replace(/\$[^$]+\$/g, 'N').split(/\s+/).filter(Boolean).length;
		assert.ok(words <= 16, `${name}: say too long (${words} words): ${s.say}`);
		for (const line of s.math ?? []) assert.doesNotThrow(() => render(`{\\displaystyle ${line}}`, false), `${name} math: ${line}`);
		if (s.table) for (const cell of [...(s.table.head ?? []), ...s.table.rows.flat()]) assertText(cell, `${name} table`);
		if (s.then) assertText(s.then, `${name} then`);
	}
	if (o.steps.length > 5) assert.ok(o.steps[0].group, `${name}: more than five steps need groups`);
}

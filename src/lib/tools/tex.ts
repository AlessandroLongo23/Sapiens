import katex from 'katex';
import { escapeHtml } from '@/lib/utils/escape';

/**
 * Typesetting for the tools, safe in the browser: KaTeX only, without the lesson markdown pipeline. Output is HTML
 * and MathML, so screen readers read the formulas.
 *
 * `\hl{…}` marks what changes in a step: a class the step list tints and underlines. It is the only command allowed
 * to add markup, and the tools write their LaTeX themselves (user input is parsed and re-printed, never passed
 * through), so no input can inject classes.
 */
const OPTIONS = {
	throwOnError: false,
	strict: 'ignore' as const,
	output: 'htmlAndMathml' as const,
	macros: { '\\hl': '\\htmlClass{hl}{#1}' },
	trust: (context: { command: string }) => context.command === '\\htmlClass'
};

export function tex(source: string, display = false): string {
	return katex.renderToString(source, { ...OPTIONS, displayMode: display });
}

/**
 * A formula as one unbreakable unit, in display style (full-size fractions), left-aligned. KaTeX would otherwise break
 * an inline formula after "=" or "+" at the end of a line; wrapped in a group, it scrolls sideways instead.
 */
export function mathLine(source: string): string {
	return tex(`{\\displaystyle ${source}}`);
}

/**
 * Prose with `$…$` inline formulas: the prose escaped, the formulas typeset. In a sentence (`display` false) a
 * formula is set in text style, so a fraction does not stretch the line, and it is kept on one line together with
 * the punctuation that follows it (no line ever starts with ": la soluzione…"). In a result or a table cell
 * (`display` true) formulas are full size. `$$…$$` is set as a line of its own.
 */
export function mathText(text: string, display = false): string {
	return text
		.split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$[.,;:!?)]*)/g)
		.map((part, i) => {
			if (i % 2 === 0) return escapeHtml(part);
			if (part.startsWith('$$')) return tex(part.slice(2, -2).trim(), true);
			const end = part.lastIndexOf('$');
			const formula = part.slice(1, end).trim();
			const html = display ? mathLine(formula) : tex(`{${formula}}`);
			const after = part.slice(end + 1);
			return after ? `<span class="whitespace-nowrap">${html}${escapeHtml(after)}</span>` : html;
		})
		.join('');
}

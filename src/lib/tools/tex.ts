import katex from 'katex';
import { escapeHtml } from '@/lib/utils/escape';

/**
 * Typesetting for the tools, safe in the browser: KaTeX only, without the lesson markdown pipeline. Output is HTML
 * and MathML, so screen readers read the formulas.
 */

export function tex(source: string, display = false): string {
	return katex.renderToString(source, { displayMode: display, throwOnError: false, strict: 'ignore', output: 'htmlAndMathml' });
}

/** Prose with `$…$` inline and `$$…$$` display formulas: the prose escaped, the formulas typeset. */
export function mathText(text: string): string {
	return text
		.split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g)
		.map((part, i) => {
			if (i % 2 === 0) return escapeHtml(part);
			return part.startsWith('$$') ? tex(part.slice(2, -2).trim(), true) : tex(part.slice(1, -1).trim());
		})
		.join('');
}

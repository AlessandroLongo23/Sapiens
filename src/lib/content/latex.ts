import katex from 'katex';
import { plainTitle } from '@/lib/seo/slug';

import { escapeHtml } from '@/lib/utils/escape';

export { escapeHtml };

/**
 * A title that may contain LaTeX commands (`Numeri naturali \mathbb{N}`),
 * typeset on the server. Only the HTML output is emitted (no MathML twin);
 * the wrapper carries the readable form so the accessible text is "ℕ".
 * Returns null for a plain title, which costs nothing to render.
 */
export function latexToHtml(content: string): string | null {
	const text = content.replace(/\\\\/g, '\\');
	if (!/\\[a-zA-Z]/.test(text)) return null;
	return text
		.split(/(\\[a-zA-Z]+(?:\{[^}]+\})?)/g)
		.map((part, i) => {
			if (i % 2 === 0) return escapeHtml(part);
			try {
				const html = katex.renderToString(part, { displayMode: false, throwOnError: false, output: 'html' });
				return `<span role="math" aria-label="${escapeHtml(plainTitle(part))}">${html}</span>`;
			} catch {
				return escapeHtml(plainTitle(part));
			}
		})
		.join('');
}

/** HTML for a title: typeset when it holds LaTeX, escaped text otherwise. */
export const titleHtml = (content: string): string => latexToHtml(content) ?? escapeHtml(content);

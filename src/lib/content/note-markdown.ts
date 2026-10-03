import markdownit from 'markdown-it';
import type katexType from 'katex';
import { escapeHtml } from '@/lib/utils/escape';

/**
 * Student-written markdown → HTML. Deliberately not the lesson pipeline in
 * ./markdown: that one runs `html: true`, which is right for content we author
 * and stored XSS for a note anybody can type into. It also drops the first two
 * lines, which a note does not have.
 *
 * KaTeX is injected rather than imported, so the browser can load it lazily the
 * way ChatMessage does; the server passes its own copy. The protect/restore
 * placeholder dance is copied from ./markdown rather than shared: that version
 * also lifts TikZ blocks and imports KaTeX statically, and neither belongs here.
 */

type Katex = typeof katexType;

const md = markdownit({ html: false, linkify: false, typographer: true });

// A graph of the plotter (lib/zaino/plot-block.ts) is a fenced block whose first line is the graph. Here it becomes
// a box that says so, with the graph in an attribute: the reading view draws the plane in it (StaticPage), the
// thumbnails and the print copy show the box.
const fence = md.renderer.rules.fence!;
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
	const token = tokens[idx];
	if (token.info.trim() !== 'plotter') return fence(tokens, idx, options, env, self);
	const [code = '', origin = ''] = token.content.split('\n');
	if (!/^[A-Za-z0-9_-]*$/.test(code)) return fence(tokens, idx, options, env, self);
	const name = /^da [0-9a-f-]{36} (.+)$/.exec(origin)?.[1];
	return `<div class="note-plot-static" data-plot="${code}"><span>${escapeHtml(name ?? 'Grafico')}</span></div>\n`;
};

/** Whether a document contains anything KaTeX would have to typeset. */
export const hasMath = (markdown: string): boolean => markdown.includes('$');

function renderTex(katex: Katex | null, tex: string, display: boolean): string {
	// Before KaTeX arrives the source stands in, so the text never disappears mid-load.
	if (!katex) return `<span class="text-fg-subtle">${escapeHtml(tex)}</span>`;
	try {
		return katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: 'ignore', output: 'htmlAndMathml' });
	} catch {
		return escapeHtml(tex);
	}
}

type Placeholder = { display: boolean; content: string };

/** Math is lifted out before markdown-it runs, so underscores and asterisks inside formulas survive. */
function protect(markdown: string) {
	const math: Placeholder[] = [];
	// Private-use characters bracket the index, so nothing typed is mistaken for a placeholder.
	const keep = (display: boolean, content: string) => `\uE000${math.push({ display, content: content.trim() }) - 1}\uE001`;
	const text = markdown
		.replace(/\$\$([\s\S]+?)\$\$/g, (_, content: string) => keep(true, content))
		.replace(/\$([^$\n]+?)\$/g, (m, content: string) => (/^\d+$/.test(content.trim()) ? m : keep(false, content)));
	return { text, math };
}

function restore(html: string, math: Placeholder[], katex: Katex | null): string {
	return html.replace(/\uE000(\d+)\uE001/g, (_, i: string) => {
		const { display, content } = math[Number(i)];
		return display ? `<div class="katex-display">${renderTex(katex, content, true)}</div>` : renderTex(katex, content, false);
	});
}

/** The note as HTML. Pass `null` for KaTeX to render everything but the formulas. */
export function renderNoteMarkdown(markdown: string, katex: Katex | null): string {
	const { text, math } = protect(markdown);
	return restore(md.render(text), math, katex);
}

/** One line of a note, a title for instance, as HTML with no block around it. */
export function renderNoteInline(markdown: string, katex: Katex | null): string {
	const { text, math } = protect(markdown);
	return restore(md.renderInline(text), math, katex);
}

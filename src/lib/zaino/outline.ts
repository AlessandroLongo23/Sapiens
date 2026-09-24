/**
 * The outline of a note: its titles, in order, with the page each is on.
 * Read with markdown-it, the parser that draws the preview, the reading view
 * and the thumbnails, so the n-th `h1`–`h3` of a page here is the n-th
 * heading element of that page on screen (see ./outline-dom), wherever it
 * sits: at the top level, in a list or in a quote. No DOM, no TipTap.
 */
import markdownit from 'markdown-it';
import { splitPages } from './pages';

export interface OutlineEntry {
	level: 1 | 2 | 3;
	text: string;
	page: number;
	/** Its place among the titles of its page, from 0. */
	index: number;
	/** Its line within its page's text, from 0. */
	line: number;
}

const md = markdownit({ html: false, linkify: false });

/** Inline markup as plain text; formulas are kept as written. */
function plain(children: { type: string; content: string }[] | null, fallback: string): string {
	if (!children) return fallback.trim();
	return children
		.filter((t) => t.type === 'text' || t.type === 'code_inline')
		.map((t) => t.content)
		.join('')
		.trim();
}

export function outline(markdown: string): OutlineEntry[] {
	const out: OutlineEntry[] = [];
	splitPages(markdown).forEach((text, page) => {
		const tokens = md.parse(text, {});
		let index = 0;
		tokens.forEach((token, i) => {
			if (token.type !== 'heading_open' || !['h1', 'h2', 'h3'].includes(token.tag)) return;
			const inline = tokens[i + 1];
			const title = plain(inline?.children ?? null, inline?.content ?? '');
			out.push({ level: Number(token.tag[1]) as 1 | 2 | 3, text: title || 'Titolo senza testo', page, index, line: token.map?.[0] ?? 0 });
			index++;
		});
	});
	return out;
}

/**
 * Where a title starts in the whole document, as a character offset: for the
 * Advanced editor, whose source is the document with its page breaks. A page's
 * text is its lines between two breaks without the blank lines around it
 * (splitPages), so its first line is found the same way here.
 */
export function titleOffset(markdown: string, page: number, line: number): number {
	const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
	let current = 0;
	let fenced = false;
	let offset = 0;
	let start = page === 0 ? 0 : -1;
	for (let i = 0; i < lines.length; i++) {
		const l = lines[i];
		if (start === -1 && current === page) start = i;
		if (/^[ \t]*```/.test(l)) fenced = !fenced;
		if (!fenced && /^[ \t]*<!--[ \t]*pagina[ \t]*-->[ \t]*$/.test(l)) current++;
	}
	if (start < 0) return markdown.length;
	// Skip the blank lines splitPages drops at the top of a page.
	while (start < lines.length && lines[start].trim() === '') start++;
	const target = Math.min(start + line, lines.length - 1);
	for (let i = 0; i < target; i++) offset += lines[i].length + 1;
	return offset;
}

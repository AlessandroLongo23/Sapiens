import markdownit, { type MarkdownIt, type RendererRule, type StateCore } from 'markdown-it';
import anchor from 'markdown-it-anchor';
import katex from 'katex';
import { titleHtml } from './latex';
import { escapeHtml } from '@/lib/utils/escape';

/**
 * Lesson markdown → HTML, on the server only. Math is typeset with KaTeX at
 * render time, so the response already contains the formula (no client-side
 * KaTeX, readable by crawlers). The MathML twin is kept for assistive
 * technology; its TeX annotation is dropped so raw LaTeX never ends up in
 * the page text. TikZ blocks become `<script type="text/tikz">` for TikZJax.
 */

const slugifyHeading = (s: string) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');


export function renderTex(tex: string, displayMode: boolean): string {
	try {
		return katex
			.renderToString(tex, { displayMode, throwOnError: false, strict: 'ignore', output: 'htmlAndMathml' })
			.replace(/<annotation encoding="application\/x-tex">[\s\S]*?<\/annotation>/g, '');
	} catch (e) {
		console.error('KaTeX rendering error:', e);
		return escapeHtml(tex);
	}
}

/** `$$…$$` and `$…$` in a short text (exercise questions, answers, chat) → HTML. */
export function renderMath(text: string): string {
	return text
		.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex: string) => renderTex(tex.trim(), true))
		.replace(/\$([^$\n]+?)\$/g, (_, tex: string) => renderTex(tex.trim(), false));
}

type Placeholder = { display: boolean; content: string };

/** Math and TikZ are lifted out before markdown-it runs, so underscores and asterisks inside formulas survive. */
function protect(markdown: string) {
	const math: Placeholder[] = [];
	const tikz: string[] = [];
	let text = markdown.replace(/```tikz\n([\s\S]+?)```/g, (_, code: string) => {
		tikz.push(code);
		return `\n\n<div data-tikz="${tikz.length - 1}"></div>\n\n`;
	});
	text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, content: string) => {
		math.push({ display: true, content: content.trim() });
		return `MATHPLACEHOLDER${math.length - 1}END`;
	});
	text = text.replace(/\$([^$]+?)\$/g, (m, content: string) => {
		if (m.includes('MATHPLACEHOLDER') || m.includes('data-tikz')) return m;
		math.push({ display: false, content: content.trim() });
		return `MATHPLACEHOLDER${math.length - 1}END`;
	});
	return { text, math, tikz };
}

/**
 * Every formula is wrapped, and the wrapper carries its source. The reader
 * treats a formula as one object: click it and the whole thing is taken, drag
 * through it and it comes along entire. What a selection then hands the
 * assistant or the clipboard is `$a^{-n}$`, not the `a−n` its glyph spans
 * spell out. The MathML twin cannot supply it, since its TeX annotation is
 * stripped so raw LaTeX never lands in the page text.
 */
function formula(tex: string, display: boolean): string {
	const source = escapeHtml(tex);
	return display
		? `<div class="katex-display formula" data-tex="${source}" data-block>${renderTex(tex, true)}</div>`
		: `<span class="formula" data-tex="${source}">${renderTex(tex, false)}</span>`;
}

function restore(html: string, math: Placeholder[], tikz: string[]): string {
	return html
		.replace(/MATHPLACEHOLDER(\d+)END/g, (_, i: string) => {
			const { display, content } = math[Number(i)];
			return formula(content, display);
		})
		.replace(/<div data-tikz="(\d+)"><\/div>/g, (_, i: string) => `<div class="tikz-container my-6 flex justify-center"><script type="text/tikz">\n${tikz[Number(i)]}\n</script></div>`);
}

const ADMONITIONS: Record<string, { color: string; title: string; icon: string }> = {
	note: { color: 'blue', title: 'Nota', icon: 'M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z M15 3v6h6' },
	tip: { color: 'teal', title: 'Suggerimento', icon: 'M12 2v8 m4.93 10.93 1.41 1.41 M2 18h2 M20 18h2 m19.07 10.93-1.41 1.41 M22 22H2 M12 10v12' },
	warning: { color: 'amber', title: 'Attenzione', icon: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z M12 9v4 M12 17h.01' },
	error: { color: 'red', title: 'Errore', icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z m15 9-6 6 m9 9 6 6' },
	example: { color: 'purple', title: 'Esempio', icon: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z M14 2v6h6' },
	info: { color: 'teal', title: 'Info', icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z M12 16v-4 M12 8h.01' }
};

/** ```ad-note / ad-tip / … fences → callout boxes. The first line, when plain, is the title. */
function admonitionPlugin(md: MarkdownIt) {
	md.core.ruler.after('block', 'admonitions', (state: StateCore) => {
		state.tokens.forEach((token, i) => {
			if (token.type !== 'fence' || !token.info.trim().startsWith('ad-')) return;
			const type = token.info.trim().slice(3).trim().toLowerCase();
			const kind = ADMONITIONS[type] ?? ADMONITIONS.note;
			const lines = token.content.trim().split(/\r?\n/);
			const first = lines[0]?.trim() ?? '';
			const title = first && !first.startsWith('#') && !first.startsWith('-') ? lines.shift()!.trim() : '';
			const html = new state.Token('html_block', '', 0);
			html.content = `<div class="admonition admonition-${kind.color}"><div class="admonition-header"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5 mr-2" aria-hidden="true"><path d="${kind.icon}"/></svg><span class="font-medium capitalize">${escapeHtml(title || kind.title)}</span></div><div class="admonition-body">${md.render(lines.join('\n'))}</div></div>`;
			state.tokens[i] = html;
		});
		return true;
	});
}

/** Animated GIFs load lazily, once scrolled near. */
function gifPlugin(md: MarkdownIt) {
	const base: RendererRule = md.renderer.rules.image ?? ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
	md.renderer.rules.image = (tokens, idx, options, env, self) => {
		const token = tokens[idx];
		const src = String(token.attrGet('src') ?? '');
		if (src.toLowerCase().endsWith('.gif')) {
			token.attrJoin('class', 'markdown-gif lazy-gif');
			token.attrSet('loading', 'lazy');
			token.attrSet('decoding', 'async');
			token.attrSet('data-src', src);
			token.attrSet('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
		}
		return base(tokens, idx, options, env, self);
	};
}

/** A paragraph `{.cols-3}` right before a table becomes a class on that table. */
function tableClassPlugin(md: MarkdownIt) {
	md.core.ruler.after('block', 'table_class_marker', (state: StateCore) => {
		const tokens = state.tokens;
		for (let i = 0; i < tokens.length - 3; i++) {
			const m = tokens[i].type === 'paragraph_open' && tokens[i + 1].type === 'inline' && tokens[i + 1].content.match(/^\{\.([a-zA-Z0-9-]+)\}$/);
			if (!m || tokens[i + 3]?.type !== 'table_open') continue;
			tokens[i + 3].attrJoin('class', m[1]);
			tokens.splice(i, 3);
			i--;
		}
		return true;
	});
}

const md = markdownit({ html: true, linkify: false, typographer: true })
	.use(anchor, { slugify: slugifyHeading })
	.use(tableClassPlugin)
	.use(admonitionPlugin)
	.use(gifPlugin);

// Code blocks scroll sideways on phones, so they take keyboard focus like any scrollable region.
for (const rule of ['fence', 'code_block'] as const) {
	const render = md.renderer.rules[rule]!;
	md.renderer.rules[rule] = (tokens, idx, options, env, self) => render(tokens, idx, options, env, self).replace('<pre', '<pre tabindex="0"');
}

/** The lesson body as HTML. The first two lines (the H1 title and a blank) are dropped: the page has its own title. */
/** Editors save with either line ending; the fence and heading regexes expect `\n`. */
const normalize = (markdown: string) => markdown.replace(/\r\n?/g, '\n');

export function renderMarkdown(markdown: string): string {
	const { text, math, tikz } = protect(normalize(markdown).split('\n').slice(2).join('\n'));
	return restore(md.render(text), math, tikz);
}

export interface ContentSection {
	id: string;
	/** Raw heading text, may contain LaTeX. */
	title: string;
	/** Heading level: 1 for `##`, 2 for `###`, 3 for `####`. */
	level: number;
	subsections: ContentSection[];
}

/** Headings `##` to `####` as a nested outline; `#` is the document title and is skipped. */
export function tableOfContents(markdown: string): ContentSection[] {
	markdown = normalize(markdown);
	const sections: ContentSection[] = [];
	let h2: ContentSection | null = null;
	let h3: ContentSection | null = null;
	for (const raw of markdown.split(/\r?\n/)) {
		const m = raw.trim().match(/^(#{2,4})\s+(.+)$/);
		if (!m) continue;
		const section: ContentSection = { id: slugifyHeading(m[2].trim()), title: m[2].trim(), level: m[1].length - 1, subsections: [] };
		if (section.level === 1) {
			sections.push(section);
			h2 = section;
			h3 = null;
		} else if (section.level === 2) {
			(h2?.subsections ?? sections).push(section);
			h3 = section;
		} else if (h3) {
			h3.subsections.push(section);
		}
	}
	return sections;
}

export interface TocSection {
	id: string;
	titleHtml: string;
	level: number;
	subsections: TocSection[];
}

/** The outline with every title typeset, so the table of contents needs no KaTeX in the browser. */
export function tocWithHtml(sections: ContentSection[]): TocSection[] {
	return sections.map((s) => ({ id: s.id, level: s.level, titleHtml: titleHtml(s.title), subsections: tocWithHtml(s.subsections) }));
}

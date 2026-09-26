import { slugifyHeading } from '@/lib/content/markdown';
import { plainTitle } from '@/lib/seo/slug';
import { terms } from './text';
import type { SearchSection } from './rank';

/**
 * A lesson cut into the sections the site search can point to: each `##` and
 * `###` heading with the id the lesson page gives it (so a result opens the
 * lesson at that paragraph), the section's first paragraph as a preview, and
 * the distinct stems of its text for matching.
 */

const SNIPPET = 240;

const SUP: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻', n: 'ⁿ' };

/** `x^2` and `x^{-1}` as the reader sees them: x² and x⁻¹. */
const superscripts = (text: string) => text.replace(/\^\{?([-\dn]+)\}?/g, (m, exp: string) => ([...exp].every((c) => SUP[c]) ? [...exp].map((c) => SUP[c]).join('') : m));

/** Markdown to the text a reader sees: no figures, fences, links or emphasis, formulas as plain symbols. */
function plain(markdown: string): string {
	return (
		markdown
			// Figures, chemistry and code blocks say nothing searchable; callouts keep their body, not their title line.
			.replace(/```(?:tikz|molecola|reazione|chem|mermaid|python|js|ts)[\s\S]*?```/g, ' ')
			.replace(/```ad-\w+\n[^\n]*\n([\s\S]*?)```/g, '$1')
			.replace(/```[\s\S]*?```/g, ' ')
			.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
			.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
			.replace(/\$\$([\s\S]*?)\$\$|\$([^$\n]+)\$/g, (_m, block: string | undefined, inline: string | undefined) => superscripts(plainTitle(`$${block ?? inline}$`)))
			.replace(/[*_`>|#]+/g, ' ')
			.replace(/^\s*(?:[-+]|\d+\.)\s+/gm, '')
			.replace(/[ \t]+/g, ' ')
	);
}

function firstParagraph(text: string): string {
	const para = text.split(/\n\s*\n/).map((p) => p.replace(/\s+/g, ' ').trim()).find((p) => p.length > 30) ?? '';
	if (para.length <= SNIPPET) return para;
	const cut = para.slice(0, SNIPPET);
	return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

/** A section with its whole text as the reader sees it, for computing its embedding. */
export interface SectionText extends SearchSection {
	text: string;
}

/** One lesson's sections with their text, split on its `##` and `###` headings (the same ones its table of contents shows). */
export function lessonSectionTexts(topic: string, markdown: string): SectionText[] {
	const out: SectionText[] = [];
	let current: { id: string; title: string; parent: string | null; body: string[] } | null = null;
	let h2: string | null = null;
	let fence = false;
	const flush = () => {
		if (!current) return;
		const text = plain(current.body.join('\n'));
		out.push({
			topic,
			id: current.id,
			title: plainTitle(current.title),
			parent: current.parent,
			snippet: firstParagraph(text),
			words: [...new Set(terms(text))].join(' '),
			text: text.replace(/\n{3,}/g, '\n\n').trim()
		});
	};
	for (const line of markdown.replace(/\r\n?/g, '\n').split('\n')) {
		if (/^\s*```/.test(line)) fence = !fence;
		const m = !fence && line.trim().match(/^(#{2,3})\s+(.+)$/);
		if (m) {
			flush();
			const title = m[2].trim();
			if (m[1].length === 2) h2 = plainTitle(title);
			current = { id: slugifyHeading(title), title, parent: m[1].length === 3 ? h2 : null, body: [] };
		} else current?.body.push(line);
	}
	flush();
	return out;
}

/** One lesson's sections as the site search receives them (no text). */
export function lessonSections(topic: string, markdown: string): SearchSection[] {
	return lessonSectionTexts(topic, markdown).map(({ text: _text, ...section }) => section);
}

/** The model the sections and the questions are embedded with; both sides must use the same one. */
export const EMBEDDING_MODEL = 'text-embedding-3-small';

/**
 * What is embedded for a section: where it sits (lesson, chapter, heading)
 * and then its text, cut well inside the model's limit. The place matters: a
 * section titled "Definizioni" means nothing without its lesson.
 */
export function embeddingInput(section: SectionText, lesson: string, chapter: string): string {
	const heading = section.parent ? `${section.parent} > ${section.title}` : section.title;
	return `${plainTitle(lesson)} (${plainTitle(chapter)})\n${heading}\n\n${section.text.slice(0, 6000)}`;
}

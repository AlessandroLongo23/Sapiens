import { SITE_NAME } from '@/lib/config/site';
import { plainTitle } from '@/lib/seo/slug';
import { countByType, type ContentNode } from '@/lib/utils/tree';

/**
 * Title and description templates per node type (Tasks 3, 4 and 18).
 * Every function works on plain-text titles; LaTeX never reaches the head.
 */

const LEVEL_LONG: Record<string, string> = {
	middle_school: 'la scuola media',
	high_school: 'la scuola superiore',
	university: "l'università"
};

/** Short forms used inside titles only; URLs derive from the level title (see $lib/seo/slug). */
const LEVEL_SHORT: Record<string, string> = {
	middle_school: 'medie',
	high_school: 'superiori',
	university: 'università'
};

const LEVEL_SCHEMA: Record<string, string> = {
	middle_school: 'Scuola secondaria di primo grado',
	high_school: 'Scuola secondaria di secondo grado',
	university: 'Università'
};

const MAX_TITLE = 60;

export function levelLong(level: ContentNode | undefined): string {
	if (!level) return '';
	return LEVEL_LONG[level.slug] ?? plainTitle(level.title).toLowerCase();
}

export function levelShort(level: ContentNode | undefined): string {
	if (!level) return '';
	return LEVEL_SHORT[level.slug] ?? plainTitle(level.title).toLowerCase();
}

/** Value for schema.org `educationalLevel`. */
export function levelSchemaLabel(level: ContentNode | undefined): string {
	if (!level) return '';
	return LEVEL_SCHEMA[level.slug] ?? plainTitle(level.title);
}

function plural(n: number, one: string, many: string): string {
	return `${n} ${n === 1 ? one : many}`;
}

function joinList(items: string[]): string {
	if (items.length <= 1) return items.join('');
	return items.slice(0, -1).join(', ') + ' e ' + items[items.length - 1];
}

/**
 * Titles, per node type, kept under ~60 characters by dropping the least
 * important segment first. The lesson name is never cut.
 *
 *   Level:   Materiale didattico per <Livello> — Sapiens
 *   Subject: <Materia> per <Livello>: teoria ed esercizi — Sapiens
 *   Chapter: <Capitolo> — <Materia> <Livello> | Sapiens
 *   Lesson:  <Lezione> — <Capitolo>, <Materia> | Sapiens
 */
export function nodeTitle(node: ContentNode, ancestors: ContentNode[]): string {
	const [level, subject, chapter] = ancestors;
	const name = plainTitle(node.title);

	const pick = (candidates: string[]): string =>
		candidates.find((c) => c.length <= MAX_TITLE) ?? candidates[candidates.length - 1];

	switch (node.type) {
		case 'level':
			return pick([
				`Materiale didattico per ${levelLong(node)} — ${SITE_NAME}`,
				`Materiale per ${levelShort(node)} — ${SITE_NAME}`
			]);
		case 'subject':
			return pick([
				`${name} per ${levelShort(level)}: teoria ed esercizi — ${SITE_NAME}`,
				`${name} per ${levelShort(level)}: teoria ed esercizi`,
				`${name} ${levelShort(level)} — ${SITE_NAME}`
			]);
		case 'chapter':
			return pick([
				`${name} — ${plainTitle(subject?.title)} ${levelShort(level)} | ${SITE_NAME}`,
				`${name} — ${plainTitle(subject?.title)} | ${SITE_NAME}`,
				`${name} | ${SITE_NAME}`,
				name
			]);
		case 'topic':
			return pick([
				`${name} — ${plainTitle(chapter?.title)}, ${plainTitle(subject?.title)} | ${SITE_NAME}`,
				`${name} — ${plainTitle(chapter?.title)} | ${SITE_NAME}`,
				`${name} | ${SITE_NAME}`,
				name
			]);
	}
}

/** Title for a lesson sub-view (esercizi, formulario, flashcards). */
export function subviewTitle(label: string, node: ContentNode, ancestors: ContentNode[]): string {
	const [, subject, chapter] = ancestors;
	const name = plainTitle(node.title);
	const candidates = [
		`${label}: ${name} — ${plainTitle(chapter?.title)}, ${plainTitle(subject?.title)} | ${SITE_NAME}`,
		`${label}: ${name} — ${plainTitle(chapter?.title)} | ${SITE_NAME}`,
		`${label}: ${name} | ${SITE_NAME}`,
		`${label}: ${name}`
	];
	return candidates.find((c) => c.length <= MAX_TITLE) ?? candidates[candidates.length - 1];
}

function clamp(text: string, max = 158): string {
	const t = text.replace(/\s+/g, ' ').trim();
	if (t.length <= max) return t;
	const cut = t.slice(0, max - 1);
	return cut.slice(0, Math.max(cut.lastIndexOf(' '), 80)).replace(/[,;:]$/, '') + '…';
}

/** Distinct description per node type, interpolating real names and counts. */
export function nodeDescription(node: ContentNode, ancestors: ContentNode[]): string {
	const [level, subject, chapter] = ancestors;
	const name = plainTitle(node.title);
	const counts = countByType(node.children);

	switch (node.type) {
		case 'level': {
			const subjects = node.children.map((s) => plainTitle(s.title));
			return clamp(
				`Teoria, formulari ed esercizi per ${levelLong(node)}: ${plural(counts.subject, 'materia', 'materie')} (${joinList(subjects)}), ${plural(counts.chapter, 'capitolo', 'capitoli')} e ${plural(counts.topic, 'lezione', 'lezioni')} da consultare online gratuitamente.`
			);
		}
		case 'subject': {
			const chapters = node.children.map((c) => plainTitle(c.title));
			const range =
				chapters.length > 1
					? ` da ${chapters[0]} a ${chapters[chapters.length - 1]}`
					: chapters.length === 1
						? `: ${chapters[0]}`
						: '';
			return clamp(
				`${name} per ${levelLong(level)}: ${plural(counts.chapter, 'capitolo', 'capitoli')} e ${plural(counts.topic, 'lezione', 'lezioni')} con teoria ed esercizi,${range}. Materiale gratuito su ${SITE_NAME}.`
			);
		}
		case 'chapter': {
			const lessons = node.children.map((t) => plainTitle(t.title));
			const preview = lessons.length ? ` Lezioni: ${joinList(lessons.slice(0, 4))}${lessons.length > 4 ? ' e altre' : ''}.` : '';
			return clamp(
				`${name}, capitolo di ${plainTitle(subject?.title)} per ${levelLong(level)}: ${plural(counts.topic, 'lezione', 'lezioni')} con teoria, formulario ed esercizi.${preview}`
			);
		}
		case 'topic':
			return clamp(
				`${name}: lezione di ${plainTitle(subject?.title)} per ${levelLong(level)}, nel capitolo ${plainTitle(chapter?.title)}. Teoria spiegata passo passo, formulario ed esercizi su ${SITE_NAME}.`
			);
	}
}

/**
 * First paragraph of a markdown document as plain text, for lesson descriptions
 * when real theory exists. Skips the title line, headings, math blocks and admonitions.
 */
export function markdownExcerpt(markdown: string | null | undefined, max = 158): string | null {
	if (!markdown) return null;
	const lines = markdown.replace(/\r/g, '').split('\n');
	let inFence = false;
	const paragraph: string[] = [];

	for (const raw of lines) {
		const line = raw.trim();
		if (line.startsWith('```')) {
			inFence = !inFence;
			continue;
		}
		if (inFence || line.startsWith('#') || line === '$$' || line.startsWith('|')) {
			if (paragraph.length) break;
			continue;
		}
		if (!line) {
			if (paragraph.length) break;
			continue;
		}
		// List items right after an intro line are part of the same thought.
		paragraph.push(line.replace(/^(?:[-+*]|\d+[.)])\s+/, ''));
	}

	if (!paragraph.length) return null;

	const text = paragraph
		.join(' ')
		.replace(/\$\$[^$]*\$\$/g, '')
		.replace(/\$([^$]*)\$/g, (_m, inner: string) => plainTitle(inner))
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/[*_`>]/g, '')
		.replace(/\s+/g, ' ')
		.trim();

	return text.length >= 40 ? clamp(text, max) : null;
}

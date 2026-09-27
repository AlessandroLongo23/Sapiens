/**
 * Which chapter or lesson of the material an entry is about, read from its words: "verifica sui monomi" is about
 * the chapter "Monomi e polinomi", "verifica prodotti notevoli" about that lesson. The student sees the link before
 * saving and can drop it. Pure.
 */

export interface Topic {
	/** Database path. */
	path: string;
	title: string;
	kind: 'chapter' | 'lesson';
	/** For a lesson, its chapter's path. */
	chapter?: string;
}

/** A title as plain words, without its LaTeX: `Numeri naturali \\mathbb{N}` is "Numeri naturali". */
export const plainTitle = (title: string) => title.replace(/\$[^$]*\$/g, ' ').replace(/\\[a-zA-Z]+(\{[^}]*\})?/g, ' ').replace(/\s+/g, ' ').trim();

const STOP = new Set(['di', 'e', 'ed', 'del', 'della', 'dello', 'dei', 'degli', 'delle', 'in', 'con', 'a', 'al', 'alla', 'le', 'la', 'il', 'lo', 'gli', 'i', 'un', 'una', 'per', 'tra', 'fra', 'su', 'sui', 'sulle', 'sul', 'sugli', 'come']);

/** Words that name many chapters: alone they do not pick one. */
const GENERIC = new Set(['numer', 'opera', 'propr', 'primo', 'secon', 'grado', 'calco', 'espre', 'probl', 'intro', 'rappr', 'confr', 'defin', 'prime', 'equaz', 'disug', 'diseq', 'teore', 'appli']);

const fold = (s: string) =>
	s
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '');

/** A title's words, LaTeX taken out (`Numeri naturali \mathbb{N}`), cut to a stem: "monomio" and "monomi" are one word. */
function stems(text: string): string[] {
	const words = fold(text.replace(/\$[^$]*\$/g, ' ').replace(/\\[a-zA-Z]+(\{[^}]*\})?/g, ' '))
		.split(/[^a-z]+/)
		.filter((w) => w.length >= 3 && !STOP.has(w));
	return words.map((w) => (w.length >= 5 ? w.slice(0, 5) : w));
}

/**
 * The topic an entry's text is about, or null. A topic counts when one of its specific words is in the text, or all
 * its words are; the one with most words found wins, a chapter over a lesson when they tie, so "monomi" is the whole
 * chapter and "prodotti notevoli" the lesson.
 */
export function matchTopic(text: string, topics: readonly Topic[]): Topic | null {
	const words = new Set(stems(text));
	if (words.size === 0) return null;
	let best: { topic: Topic; score: number; size: number } | null = null;
	for (const topic of topics) {
		const own = [...new Set(stems(topic.title))];
		if (own.length === 0) continue;
		const found = own.filter((w) => words.has(w));
		if (found.length === 0) continue;
		if (found.length < own.length && found.every((w) => GENERIC.has(w))) continue;
		const better =
			!best ||
			found.length > best.score ||
			(found.length === best.score && ((topic.kind === 'chapter' && best.topic.kind === 'lesson') || (topic.kind === best.topic.kind && own.length < best.size)));
		if (better) best = { topic, score: found.length, size: own.length };
	}
	return best?.topic ?? null;
}

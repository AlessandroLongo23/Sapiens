import type { ContentNode } from '@/lib/utils/tree';
import { nodePath, plainTitle } from '@/lib/seo/slug';
import { distance, fold, queryTerms, stem, terms, type QueryTerm } from './text';

/**
 * The site search, run in the browser on every keystroke. Lessons match on
 * their title, chapter and subject; sections (the paragraphs inside a lesson,
 * see server/search-index.ts) match on their heading, with the lesson title and
 * the words of the section as support. Typing mistakes of a letter or two are
 * forgiven, the last word counts while half typed, and a question in plain
 * Italian loses its question words ("non ho capito…", "come si calcola…").
 */

/** A section of a lesson as the server sends it. */
export interface SearchSection {
	/** The lesson's node id. */
	topic: string;
	/** The heading's anchor on the lesson page. */
	id: string;
	title: string;
	/** For a `###` section, the `##` it sits under. */
	parent: string | null;
	snippet: string;
	/** Distinct stems of the section text, space separated. */
	words: string;
}

export interface Lesson {
	topic: ContentNode;
	chapter: ContentNode;
	subject: ContentNode;
	href: string;
}

export interface LessonHit extends Lesson {
	score: number;
}

export interface SectionHit {
	section: SearchSection;
	lesson: Lesson;
	href: string;
	score: number;
	/** Found by meaning (the embeddings), not only by its words. */
	semantic?: boolean;
}

/** A section near a question in meaning, as /api/search/semantic returns it. */
export interface SemanticHit {
	topic: string;
	id: string;
	/** Cosine similarity, 1 for the same meaning. */
	similarity: number;
}

/** A subject or a chapter whose title the query names: a shortcut to its index page. */
export interface PlaceHit {
	node: ContentNode;
	/** The level for a subject, the subject for a chapter. */
	parent: ContentNode;
	href: string;
	score: number;
}

export interface Results {
	places: PlaceHit[];
	lessons: LessonHit[];
	sections: SectionHit[];
	/** The query reads as a question: the paragraph that answers it goes first. */
	question: boolean;
	/** Every stem the query can match, for highlighting. */
	stems: string[];
}

interface PreparedLesson extends Lesson {
	title: string[];
	chapterTerms: string[];
	subjectTerms: string[];
	order: number;
}

interface PreparedSection {
	section: SearchSection;
	lesson: PreparedLesson;
	title: string[];
	parent: string[];
	words: string[];
	wordSet: Set<string>;
}

interface PreparedPlace {
	node: ContentNode;
	parent: ContentNode;
	href: string;
	title: string[];
	order: number;
}

export interface SearchIndex {
	places: PreparedPlace[];
	lessons: PreparedLesson[];
	sections: PreparedSection[];
	byKey: Map<string, PreparedSection>;
}

export function buildIndex(tree: ContentNode[], sections: SearchSection[]): SearchIndex {
	const lessons: PreparedLesson[] = [];
	const places: PreparedPlace[] = [];
	for (const level of tree)
		for (const subject of level.children) {
			places.push({ node: subject, parent: level, href: nodePath([level, subject]), title: terms(subject.title), order: places.length });
			for (const chapter of subject.children) {
				places.push({ node: chapter, parent: subject, href: nodePath([level, subject, chapter]), title: terms(chapter.title), order: places.length });
				for (const topic of chapter.children)
					lessons.push({
						topic,
						chapter,
						subject,
						href: nodePath([level, subject, chapter, topic]),
						title: terms(topic.title),
						chapterTerms: terms(chapter.title),
						subjectTerms: terms(subject.title),
						order: lessons.length
					});
			}
		}
	const byId = new Map(lessons.map((l) => [l.topic.id, l]));
	const prepared: PreparedSection[] = [];
	for (const section of sections) {
		const lesson = byId.get(section.topic);
		if (!lesson) continue;
		const words = section.words.split(' ');
		prepared.push({ section, lesson, title: terms(section.title), parent: section.parent ? terms(section.parent) : [], words, wordSet: new Set(words) });
	}
	return { places, lessons, sections: prepared, byKey: new Map(prepared.map((p) => [`${p.section.topic}/${p.section.id}`, p])) };
}

/** How well one stem of the query matches a list of stems: 1 exact, less for a prefix or a typo, 0 for nothing. */
function matchStem(q: string, field: string[], fuzzy: boolean): number {
	let best = 0;
	for (const f of field) {
		if (f === q) return 1;
		if (q.length >= 3 && f.startsWith(q)) best = Math.max(best, 0.85);
		else if (f.length >= 4 && q.startsWith(f)) best = Math.max(best, 0.8);
		else if (fuzzy && q.length >= 4 && best < 0.75) {
			const max = q.length >= 7 ? 2 : 1;
			const d = distance(q, f, max);
			if (d <= max) best = Math.max(best, d === 1 ? 0.75 : 0.6);
		}
	}
	return best;
}

/** A query word against a field: the best of its alternatives. A written-out abbreviation counts only when all its words are there. */
function matchTerm(term: QueryTerm, field: string[], fuzzy = true): number {
	let best = 0;
	for (const alt of term.alternatives) {
		let sum = 0;
		for (const q of alt) {
			const m = matchStem(q, field, fuzzy);
			if (!m) {
				sum = 0;
				break;
			}
			sum += m;
		}
		best = Math.max(best, sum / alt.length);
	}
	return best;
}

/** The section text only matches exactly or by prefix: it is long, and a typo there would match anything. */
function matchWords(term: QueryTerm, s: PreparedSection): number {
	let best = 0;
	for (const alt of term.alternatives) {
		let sum = 0;
		for (const q of alt) {
			const m = s.wordSet.has(q) ? 1 : q.length >= 4 && s.words.some((w) => w.startsWith(q)) ? 0.8 : 0;
			if (!m) {
				sum = 0;
				break;
			}
			sum += m;
		}
		best = Math.max(best, sum / alt.length);
	}
	return best;
}

const QUESTION = /^(?:come|cosa|cos|che|perche|quando|qual|quale|quali|quanto|dove|chi|non|mi|spiega|spiegami|aiuto)\b|\?\s*$/;

export function search(index: SearchIndex, query: string): Results {
	const qt = queryTerms(query);
	const question = QUESTION.test(fold(query)) || /\?\s*$/.test(query);
	const stems = [...new Set(qt.flatMap((t) => t.alternatives.flat()))];
	if (!qt.length) return { places: [], lessons: [], sections: [], question, stems };
	const n = qt.length;
	// With one or two words all must match; a longer question may miss one.
	const needed = n <= 2 ? 1 : 0.6;

	// A place is named, not described: every query word must be in its title, and most of its title in the query.
	const places: PlaceHit[] = [];
	for (const p of index.places) {
		let score = 0;
		for (const t of qt) {
			const m = matchTerm(t, p.title);
			if (!m) {
				score = 0;
				break;
			}
			score += m;
		}
		const named = p.title.filter((w) => stems.some((q) => q === w || w.startsWith(q) || distance(q, w, 1) <= 1)).length;
		if (score && named / p.title.length >= 0.5) places.push({ node: p.node, parent: p.parent, href: p.href, score: score + named / p.title.length - p.order * 1e-6 });
	}
	places.sort((a, b) => b.score - a.score);

	const lessons: LessonHit[] = [];
	for (const l of index.lessons) {
		let score = 0;
		let matched = 0;
		let own = false;
		for (const t of qt) {
			const titled = Math.max(3 * matchTerm(t, l.title), 1.5 * matchTerm(t, l.chapterTerms));
			if (titled > 0) own = true;
			const s = Math.max(titled, matchTerm(t, l.subjectTerms));
			if (s > 0) matched++;
			score += s;
		}
		const coverage = matched / n;
		// The subject alone ("fisica") names the subject, not every lesson in it.
		if (!own || coverage < needed) continue;
		// A title the query covers entirely is the lesson being asked for.
		const whole = l.title.length > 0 && l.title.every((w) => qt.some((t) => t.alternatives.some((alt) => alt.includes(w))));
		lessons.push({ topic: l.topic, chapter: l.chapter, subject: l.subject, href: l.href, score: score * coverage * coverage + (whole ? 1.5 : 0) + l.order * -1e-6 });
	}
	lessons.sort((a, b) => b.score - a.score);

	const sections: SectionHit[] = [];
	for (const s of index.sections) {
		let score = 0;
		let matched = 0;
		let heading = false;
		for (const t of qt) {
			const h = Math.max(2.5 * matchTerm(t, s.title), 1.2 * matchTerm(t, s.parent));
			if (h > 0) heading = true;
			const v = Math.max(h, 1.2 * matchTerm(t, s.lesson.title, false), 0.6 * matchWords(t, s));
			if (v > 0) matched++;
			score += v;
		}
		const coverage = matched / n;
		// A section is found for its heading; the lesson title and the text only back it up.
		if (!heading || coverage < needed) continue;
		sections.push({ section: s.section, lesson: s.lesson, href: `${s.lesson.href}#${encodeURIComponent(s.section.id)}`, score: score * coverage * coverage + s.lesson.order * -1e-6 });
	}
	sections.sort((a, b) => b.score - a.score);

	return { places: places.slice(0, 4), lessons: lessons.slice(0, 12), sections: sections.slice(0, 6), question, stems };
}

/** A text split into runs, marking the words the query matched. */
export function highlight(text: string, stems: string[]): { text: string; hit: boolean }[] {
	if (!stems.length) return [{ text, hit: false }];
	const out: { text: string; hit: boolean }[] = [];
	for (const part of text.split(/([\p{L}\p{N}]+)/u)) {
		if (!part) continue;
		const w = stem(fold(part));
		const hit = w.length > 1 && stems.some((q) => q === w || (q.length >= 3 && w.startsWith(q)) || (q.length >= 5 && distance(q, w, 1) <= 1));
		const last = out[out.length - 1];
		if (last && last.hit === hit && !hit) last.text += part;
		else out.push({ text: part, hit });
	}
	return out;
}

/** Below this similarity a section is not about the question (text-embedding-3-small; tuned on scripts/search/domande.json). */
export const SEMANTIC_FLOOR = 0.35;

/**
 * The sections found by words and those found by meaning, in one ranking
 * (reciprocal rank fusion: a section high in both lists beats one high in a
 * single list). A section found only by meaning joins the list, so a
 * question that shares no word with the lesson still reaches its paragraph.
 */
export function fuse(index: SearchIndex, results: Results, semantic: SemanticHit[]): Results {
	const near = semantic.filter((h) => h.similarity >= SEMANTIC_FLOOR);
	if (!near.length) return results;
	const K = 5;
	const fused = new Map<string, SectionHit>();
	results.sections.forEach((hit, rank) => fused.set(`${hit.section.topic}/${hit.section.id}`, { ...hit, score: 1 / (K + rank) }));
	near.forEach((h, rank) => {
		const key = `${h.topic}/${h.id}`;
		const known = fused.get(key);
		if (known) known.score += 1 / (K + rank);
		else {
			const s = index.byKey.get(key);
			if (s) fused.set(key, { section: s.section, lesson: s.lesson, href: `${s.lesson.href}#${encodeURIComponent(s.section.id)}`, score: 1 / (K + rank), semantic: true });
		}
	});
	const sections = [...fused.values()].sort((a, b) => b.score - a.score).slice(0, 6);
	// Words found nothing and meaning found something: that is the answer, shown first.
	return { ...results, sections, question: results.question || (!results.lessons.length && !results.sections.length) };
}

export const titleOf = (node: ContentNode) => plainTitle(node.title);

import 'server-only';
import katex from 'katex';
import { getContentTree } from '@/lib/server/content';
import { nodePath, plainTitle } from '@/lib/seo/slug';
import { toneFor, type SubjectTone } from '@/lib/utils/icons';
import { TOOLS } from '@/lib/tools/registry';
import type { ContentNode } from '@/lib/utils/tree';

/*
 * What the three trial landing pages (/prova-home) say with numbers: read from the
 * content table, so a page never claims a lesson that is not online. The pages sell
 * the high school first (vault/Decisioni/2026-09-23 Superiori STEM come segmento
 * iniziale.md); the other levels are one line.
 */

export interface LandingSubject {
	slug: string;
	tone: SubjectTone;
	title: string;
	/** Its object in public/materie, without the extension. */
	object: string;
	href: string;
	chapters: number;
	/** Lessons with theory text today. */
	lessons: number;
	/** The first chapters, in the order of the programme. */
	firstChapters: string[];
}

export interface LandingData {
	subjects: LandingSubject[];
	/** Lessons online in the high school, all subjects. */
	lessons: number;
	/** Of those, how many have a deck of flashcards. */
	withFlashcards: number;
	/** Lessons online on the whole site. */
	allLessons: number;
	tools: number;
	/** The lesson shown as an example for each subject, by the subject's slug: where it is and the chapter it is in. */
	examples: Record<string, { href: string; chapter: string }>;
}

/** The lesson each subject shows on the scrolling landing page, by its title in the tree. */
export const EXAMPLE_LESSONS: Record<string, string> = {
	math: 'La parabola nel piano cartesiano',
	physics: 'Il moto lungo un piano inclinato',
	chemistry: 'Orbitali e numeri quantici',
	'computer-science': 'I diagrammi di flusso'
};

/** What each subject says about itself, in the words of its chapters. */
export const SUBJECT_COPY: Record<string, { name: string; inside: string }> = {
	math: { name: 'Matematica', inside: 'Algebra, geometria, funzioni, probabilità' },
	physics: { name: 'Fisica', inside: 'Moto, forze, energia, termodinamica' },
	chemistry: { name: 'Chimica', inside: 'Atomi, legami, reazioni, nomenclatura' },
	'computer-science': { name: 'Informatica', inside: 'Codifica, reti, algoritmi, programmazione' }
};

const ORDER = ['math', 'physics', 'chemistry', 'computer-science'];

const topics = (node: ContentNode): ContentNode[] => (node.type === 'topic' ? [node] : node.children.flatMap(topics));

export async function landingData(): Promise<LandingData> {
	const empty: LandingData = { subjects: [], lessons: 0, withFlashcards: 0, allLessons: 0, tools: TOOLS.length, examples: {} };
	let tree: ContentNode[];
	try {
		tree = await getContentTree();
	} catch (err) {
		console.error('landing data unavailable:', err);
		return empty;
	}
	const high = tree.find((level) => level.slug === 'high_school');
	if (!high) return empty;
	const subjects = ORDER.flatMap((slug): LandingSubject[] => {
		const subject = high.children.find((s) => s.slug === slug);
		if (!subject) return [];
		const online = topics(subject).filter((t) => t.has_theory);
		return [
			{
				slug,
				tone: toneFor(subject),
				title: SUBJECT_COPY[slug]?.name ?? subject.title,
				object: `high_school-${slug}`,
				href: nodePath([high, subject]),
				chapters: subject.children.length,
				lessons: online.length,
				firstChapters: subject.children.slice(0, 6).map((c) => plainTitle(c.title))
			}
		];
	});
	const online = topics(high).filter((t) => t.has_theory);
	const examples: LandingData['examples'] = {};
	for (const subject of high.children) {
		for (const chapter of subject.children) {
			const lesson = chapter.children.find((t) => plainTitle(t.title) === EXAMPLE_LESSONS[subject.slug]);
			if (lesson) examples[subject.slug] = { href: nodePath([high, subject, chapter, lesson]), chapter: plainTitle(chapter.title) };
		}
	}
	return {
		subjects,
		examples,
		lessons: online.length,
		withFlashcards: online.filter((t) => t.has_flashcards).length,
		allLessons: tree.flatMap(topics).filter((t) => t.has_theory).length,
		tools: TOOLS.length
	};
}

/** A formula typeset on the server; the pages pass the HTML down to their client parts. */
export const tex = (latex: string, display = false): string => katex.renderToString(latex, { displayMode: display, throwOnError: false, output: 'html' });

export interface DemoQuestion {
	/** The question, typeset. */
	ask: string;
	options: string[];
	answer: number;
	/** The working shown after a mistake, one line a step. */
	steps: string[];
	solution: string;
}

/**
 * The questions of the exercise a visitor can try on the page: level 1 of "Equazioni di
 * secondo grado" (pure and spurious equations), written and checked by hand. They are not
 * drawn from the generators, which correct on the server and need an account.
 */
export function demoQuestions(): DemoQuestion[] {
	const q = (ask: string, options: string[], answer: number, steps: string[], solution: string): DemoQuestion => ({
		ask: tex(ask),
		options: options.map((o) => tex(o)),
		answer,
		steps: steps.map((s) => tex(s)),
		solution: tex(solution)
	});
	const none = '\\text{nessuna soluzione reale}';
	return [
		q('x^2 - 9 = 0', ['x = 3', 'x = \\pm 3', 'x = \\pm 9', none], 1, ['x^2 = 9', 'x = \\pm\\sqrt{9}'], 'x = \\pm 3'),
		q('x^2 - 5x = 0', ['x = 5', 'x = \\pm 5', 'x = 0 \\,\\lor\\, x = 5', 'x = 0 \\,\\lor\\, x = -5'], 2, ['x\\,(x - 5) = 0', 'x = 0 \\;\\lor\\; x - 5 = 0'], 'x = 0 \\,\\lor\\, x = 5'),
		q('2x^2 - 8 = 0', ['x = \\pm 4', 'x = 2', 'x = \\pm 2\\sqrt{2}', 'x = \\pm 2'], 3, ['2x^2 = 8', 'x^2 = 4'], 'x = \\pm 2'),
		q('x^2 + 4 = 0', [none, 'x = \\pm 2', 'x = -2', 'x = -4'], 0, ['x^2 = -4', '\\text{un quadrato non è mai negativo}'], none),
		q('3x^2 + 6x = 0', ['x = 0 \\,\\lor\\, x = 2', 'x = 0 \\,\\lor\\, x = -2', 'x = -2', 'x = \\pm 2'], 1, ['3x\\,(x + 2) = 0', 'x = 0 \\;\\lor\\; x + 2 = 0'], 'x = 0 \\,\\lor\\, x = -2')
	];
}

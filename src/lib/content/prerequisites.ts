import type { ContentNode } from '@/lib/utils/tree';
import { walkTree } from '@/lib/utils/tree';
import { nodePath } from '@/lib/seo/slug';
import edges from './prerequisiti.json';

/**
 * The prerequisite graph of the high-school maths lessons, written in docs/lezioni/prerequisiti.md
 * and generated into prerequisiti.json by scripts/lezioni/prerequisiti.mts --write. One kind of
 * edge, read both ways: what a lesson needs, and where it is used.
 */

const PREREQS: Record<string, string[]> = edges;
const USED_IN: Record<string, string[]> = {};
for (const [lesson, needs] of Object.entries(PREREQS)) for (const p of needs) (USED_IN[p] ??= []).push(lesson);

const SCOPE = ['high_school', 'math'];

export interface LessonLink {
	title: string;
	url: string;
	/** False for a lesson whose theory is not written yet: shown, not linked. */
	written: boolean;
}

/** A lesson's direct prerequisites and the lessons that build on it, in tree order. */
export function lessonNeighbours(tree: ContentNode[], ancestors: Pick<ContentNode, 'slug'>[]): { needs: LessonLink[]; usedIn: LessonLink[] } {
	const empty = { needs: [], usedIn: [] };
	if (ancestors.length < 2 || ancestors[0].slug !== SCOPE[0] || ancestors[1].slug !== SCOPE[1]) return empty;
	const slug = ancestors.at(-1)!.slug;
	const needs = PREREQS[slug] ?? [];
	const usedIn = USED_IN[slug] ?? [];
	if (!needs.length && !usedIn.length) return empty;

	const wanted = new Set([...needs, ...usedIn]);
	const found = new Map<string, LessonLink & { order: number }>();
	let order = 0;
	walkTree(tree, (node, chain) => {
		order++;
		if (node.type !== 'topic' || !wanted.has(node.slug)) return;
		if (chain[0]?.slug !== SCOPE[0] || chain[1]?.slug !== SCOPE[1]) return;
		found.set(node.slug, { title: node.title, url: nodePath(chain), written: !!node.has_theory, order });
	});
	const pick = (slugs: string[]) =>
		slugs
			.map((s) => found.get(s))
			.filter((l) => l !== undefined)
			.sort((a, b) => a.order - b.order)
			.map(({ title, url, written }) => ({ title, url, written }));
	return { needs: pick(needs), usedIn: pick(usedIn) };
}

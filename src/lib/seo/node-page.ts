import { findNodeById, type ContentNode } from '@/lib/utils/tree';
import { nodePath, subviewPath } from '@/lib/seo/slug';
import { nodeTitle, nodeDescription, markdownExcerpt } from '@/lib/seo/meta';
import { lessonNavigation, type LessonNavigation } from '@/lib/utils/lesson-navigation';
import { CONTENT_ROOT } from '@/lib/config/site';
import type { Flashcard } from '@/lib/content/flashcards';

export interface NodePageServerData {
	nodeId: string;
	ancestorIds: string[];
	dbPath: string;
	theory: string | null;
	formulary: string | null;
	flashcards: Flashcard[] | null;
	updatedAt: string | null;
}

export interface NodePageData extends NodePageServerData {
	node: ContentNode;
	ancestors: ContentNode[];
	path: string;
	paths: { theory: string; exercises: string; formulary: string; flashcards: string };
	parentLink: { url: string; label: string };
	navigation: LessonNavigation | null;
	seo: { title: string; description: string };
}

/**
 * Turns the ids resolved on the server into the node, its ancestors, every
 * path the page links to, prev/next navigation and the title/description.
 * Returns null when an id is no longer in the tree.
 */
export function buildNodePage(tree: ContentNode[], data: NodePageServerData): NodePageData | null {
	const ancestors = data.ancestorIds.map((id) => findNodeById(tree, id)).filter((n): n is ContentNode => n !== null);
	const node = ancestors[ancestors.length - 1];
	if (!node || ancestors.length !== data.ancestorIds.length) return null;

	const path = nodePath(ancestors);
	const parentNode = ancestors.length > 1 ? ancestors[ancestors.length - 2] : null;

	return {
		...data,
		node,
		ancestors,
		path,
		paths: {
			theory: path,
			exercises: subviewPath(ancestors, 'exercises'),
			formulary: subviewPath(ancestors, 'formulary'),
			flashcards: subviewPath(ancestors, 'flashcards')
		},
		parentLink: parentNode ? { url: nodePath(ancestors.slice(0, -1)), label: parentNode.title } : { url: CONTENT_ROOT, label: 'Materiale didattico' },
		navigation: node.type === 'topic' ? lessonNavigation(ancestors) : null,
		seo: {
			title: nodeTitle(node, ancestors),
			description: node.type === 'topic' ? (markdownExcerpt(data.theory) ?? nodeDescription(node, ancestors)) : nodeDescription(node, ancestors)
		}
	};
}

import 'server-only';
import { configs } from '@/lib/exercises/config';
import { getContentTree } from '@/lib/server/content';
import { dbPath, nodePath, subviewPath } from '@/lib/seo/slug';
import { walkTree } from '@/lib/utils/tree';
import { titleHtml } from '@/lib/content/latex';

/** A lesson with exercises, as the progress pages name and link it. */
export interface LessonInfo {
	dbPath: string;
	title: string;
	/** The title typeset: lesson titles can hold formulas. */
	titleHtml: string;
	/** The lesson's theory page and its exercises page. */
	url: string;
	exercisesUrl: string;
	chapterTitle: string;
	chapterTitleHtml: string;
	/** The chapter's database path and page. */
	chapter: string;
	chapterUrl: string;
}

/**
 * Every lesson with exercises, by database path, read from the content tree (cached by getContentTree). Runs and
 * attempts store the lesson's database path; this is how the progress pages turn it into a title and a link.
 * A lesson moved in the tree since a run was made is simply not found: the caller skips it.
 */
export async function lessonIndex(): Promise<Map<string, LessonInfo>> {
	const index = new Map<string, LessonInfo>();
	walkTree(await getContentTree(), (node, ancestors) => {
		if (node.type !== 'topic') return;
		const path = dbPath(ancestors);
		if (!configs[path]) return;
		const chapter = ancestors[ancestors.length - 2];
		index.set(path, {
			dbPath: path,
			title: node.title,
			titleHtml: titleHtml(node.title),
			url: nodePath(ancestors),
			exercisesUrl: subviewPath(ancestors, 'exercises'),
			chapterTitle: chapter?.title ?? '',
			chapterTitleHtml: titleHtml(chapter?.title ?? ''),
			chapter: dbPath(ancestors.slice(0, -1)),
			chapterUrl: nodePath(ancestors.slice(0, -1))
		});
	});
	return index;
}

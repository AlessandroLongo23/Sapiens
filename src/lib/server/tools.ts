import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getContentTree } from '@/lib/server/content';
import { configs } from '@/lib/exercises/config';
import { dbPath, nodePath, plainTitle, worksheetPath } from '@/lib/seo/slug';
import { renderMarkdown } from '@/lib/content/markdown';
import { walkTree, type ContentNode } from '@/lib/utils/tree';
import type { ToolMeta } from '@/lib/tools/types';
import type { ToolLesson } from '@/components/tools/ToolPage';

/** The lessons on a tool's topic that are published, with the way to their exercises. */
export async function toolLessons(tool: ToolMeta): Promise<ToolLesson[]> {
	if (!tool.lessons?.length) return [];
	const tree = await getContentTree();
	const found = new Map<string, ContentNode[]>();
	walkTree(tree, (node, ancestors) => {
		if (node.type === 'topic' && node.has_theory) found.set(dbPath(ancestors), ancestors);
	});
	return tool.lessons.flatMap((key) => {
		const ancestors = found.get(key);
		if (!ancestors) return [];
		return [{ title: plainTitle(ancestors[ancestors.length - 1].title), theory: nodePath(ancestors), exercises: configs[key] ? worksheetPath(ancestors) : null }];
	});
}

/** The article under a tool (src/content/strumenti/<slug>.md), as HTML; null when not written yet. */
export async function toolArticle(slug: string): Promise<string | null> {
	try {
		const markdown = await readFile(path.join(process.cwd(), 'src/content/strumenti', `${slug}.md`), 'utf8');
		return renderMarkdown(markdown);
	} catch {
		return null;
	}
}

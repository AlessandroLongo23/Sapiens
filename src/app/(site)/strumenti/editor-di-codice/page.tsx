import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/config/site';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { toolBySlug } from '@/lib/tools/registry';
import { toolArticle, toolLessons } from '@/lib/server/tools';
import { EDITOR_PATH, EDITOR_SLUG, EditorPage } from '@/components/codice/EditorPage';

/**
 * The code editor (vault/Prodotti/Studenti/Editor di codice.md): a tool with a page of its own. Static: the page is
 * the editor's frame and its article, and the languages are downloaded by the browser when a program is run.
 */

// The links to lessons follow the content tree: a publish refreshes them through /api/revalidate, with no timer.
export const revalidate = false;

export function generateMetadata(): Metadata {
	const tool = toolBySlug(EDITOR_SLUG)!;
	return pageMetadata({ title: `Editor di codice online: Python, C e C++ nel browser | ${SITE_NAME}`, description: tool.description, path: EDITOR_PATH });
}

export default async function EditorRoute() {
	const tool = toolBySlug(EDITOR_SLUG)!;
	const [lessons, articleHtml] = await Promise.all([toolLessons(tool), toolArticle(tool.slug)]);
	return <EditorPage tool={tool} lessons={lessons} articleHtml={articleHtml} />;
}

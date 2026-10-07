import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/config/site';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { toolBySlug } from '@/lib/tools/registry';
import { toolArticle, toolLessons } from '@/lib/server/tools';
import { SANDBOX_PATH, SANDBOX_SLUG, SandboxPage } from '@/components/sandbox/SandboxPage';

/**
 * The physics sandbox (vault/Prodotti/Studenti/Sandbox di fisica.md): a tool with a page of its own. Static: the page
 * is the editor's frame and its article; the scene it opens with is built in the browser, and a scene a student
 * shares lives after the # of the address, so the canonical is the plain address.
 */

// The links to lessons follow the content tree: a publish refreshes them through /api/revalidate, with no timer.
export const revalidate = false;

export function generateMetadata(): Metadata {
	const tool = toolBySlug(SANDBOX_SLUG)!;
	return pageMetadata({ title: `Sandbox di fisica: simulatore di meccanica con forze e grafici | ${SITE_NAME}`, description: tool.description, path: SANDBOX_PATH });
}

export default async function SandboxRoute() {
	const tool = toolBySlug(SANDBOX_SLUG)!;
	const [lessons, articleHtml] = await Promise.all([toolLessons(tool), toolArticle(tool.slug)]);
	return <SandboxPage tool={tool} lessons={lessons} articleHtml={articleHtml} />;
}

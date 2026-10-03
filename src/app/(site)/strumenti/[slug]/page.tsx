import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE_NAME } from '@/lib/config/site';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { TOOLS, TOOLS_ROOT, toolBySlug } from '@/lib/tools/registry';
import { toolArticle, toolLessons } from '@/lib/server/tools';
import { ToolPage } from '@/components/tools/ToolPage';
import { TOOL_COMPONENTS } from '@/components/tools/registry';

/**
 * A free calculator or converter (vault/Prodotti/Studenti/Calcolatori e convertitori.md). Static: the example it
 * opens with is computed at build time, so the result and its steps are in the HTML; the inputs a student types
 * live in the query string and never make a page of their own (the canonical is the plain address).
 */

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
// Built once per deployment. The links to lessons follow the content tree, but with `dynamicParams = false` Next
// does not render these pages again on demand (tried with /api/revalidate), so a newly published lesson shows
// here from the next deploy.
export const revalidate = false;

export function generateStaticParams() {
	return TOOLS.filter((t) => !t.ownPage).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const tool = toolBySlug((await params).slug);
	if (!tool) return {};
	return pageMetadata({ title: `${tool.title} online, con i passaggi | ${SITE_NAME}`, description: tool.description, path: `${TOOLS_ROOT}/${tool.slug}` });
}

export default async function ToolRoute({ params }: Params) {
	const { slug } = await params;
	const tool = toolBySlug(slug);
	const Tool = TOOL_COMPONENTS[slug];
	if (!tool || !Tool) notFound();
	const [lessons, articleHtml] = await Promise.all([toolLessons(tool), toolArticle(slug)]);
	return (
		<ToolPage tool={tool} lessons={lessons} articleHtml={articleHtml}>
			<Tool />
		</ToolPage>
	);
}

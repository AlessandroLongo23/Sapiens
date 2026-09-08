import { cache } from 'react';
import { loadNodePage } from '@/lib/server/node-page';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { nodePath } from '@/lib/seo/slug';
import { titleHtml } from '@/lib/content/latex';
import { renderMarkdown, tableOfContents, tocWithHtml } from '@/lib/content/markdown';
import { CONTENT_ROOT } from '@/lib/config/site';

export type LessonParams = { params: Promise<{ level: string; subject: string; chapter: string; topic: string }> };

/** The lesson node for the four sub-view pages, resolved once per request (metadata and page share the lookup). */
export async function loadLesson({ params }: LessonParams, suffix = '') {
	const { level, subject, chapter, topic } = await params;
	return loadLessonAt([level, subject, chapter, topic].join('/'), suffix);
}

const loadLessonAt = cache(async (path: string, suffix: string) => {
	const page = await loadNodePage(path, 'topic', suffix);
	return {
		...page,
		titleHtml: titleHtml(page.node.title),
		// Lesson pages have no visual trail (the header shows the way back), but the breadcrumb structured data is emitted.
		breadcrumb: breadcrumbJsonLd([
			{ name: 'Home', path: '/' },
			{ name: 'Materiale didattico', path: CONTENT_ROOT },
			...page.ancestors.map((n, i) => ({ name: n.title, path: nodePath(page.ancestors.slice(0, i + 1)) }))
		])
	};
});

/** A markdown document as HTML plus its typeset outline, or null when it is not written yet. */
export function renderDocument(markdown: string | null) {
	if (!markdown) return null;
	return { html: renderMarkdown(markdown), sections: tocWithHtml(tableOfContents(markdown)) };
}

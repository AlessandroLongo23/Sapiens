import type { Metadata } from 'next';
import { metadataOr404, pageMetadata } from '@/lib/seo/page-metadata';
import { learningResourceJsonLd } from '@/lib/seo/jsonld';
import { tutoringSearchHref } from '@/lib/tutoring/content-link';
import { JsonLd } from '@/components/seo/JsonLd';
import { plainTitle } from '@/lib/seo/slug';
import { LessonFrame } from '@/components/content/lesson/LessonFrame';
import { LessonReader } from '@/components/content/lesson/LessonReader';
import { TableOfContents } from '@/components/content/lesson/TableOfContents';
import { ComingSoon } from '@/components/content/ComingSoon';
import { NavigationButtons } from '@/components/content/NavigationButtons';
import { TutorCta } from '@/components/content/TutorCta';
import { loadLesson, renderDocument, type LessonParams } from './lesson';

/** No params are prerendered at build; each address renders on first request and is then served from the cache (see `revalidate` in the layout). */
export function generateStaticParams() {
	return [];
}

export function generateMetadata(props: LessonParams): Promise<Metadata> {
	return metadataOr404(async () => {
		const { seo, path, theory } = await loadLesson(props);
		// A lesson whose theory is still being written stays reachable and linked, but out of the index.
		return pageMetadata({ title: seo.title, description: seo.description, path, type: 'article', noindex: !theory });
	});
}

/** The lesson's theory, typeset on the server, with its table of contents and the assistant beside it. */
export default async function TheoryPage(props: LessonParams) {
	const lesson = await loadLesson(props);
	const { node, ancestors, paths, parentLink, navigation, seo, updatedAt, breadcrumb, titleHtml } = lesson;
	const doc = renderDocument(lesson.theory);
	const tutorHref = tutoringSearchHref(ancestors);
	const footer = (
		<>
			{tutorHref && <TutorCta href={tutorHref} />}
			<NavigationButtons navigation={navigation} />
		</>
	);
	return (
		<>
			<JsonLd data={[breadcrumb, learningResourceJsonLd(node, ancestors, { description: seo.description, resourceType: 'Lezione', free: true, dateModified: updatedAt })]} />
			<LessonFrame titleHtml={titleHtml} note={{ path: paths.theory, title: plainTitle(node.title) }} parentLink={parentLink} paths={paths} withAssistant left={doc && <TableOfContents sections={doc.sections} />}>
				{doc ? <LessonReader html={doc.html} sections={doc.sections} footer={footer} /> : <ComingSoon kind="theory" chapterUrl={parentLink.url} theoryUrl={paths.theory} footer={<NavigationButtons navigation={navigation} />} />}
			</LessonFrame>
		</>
	);
}

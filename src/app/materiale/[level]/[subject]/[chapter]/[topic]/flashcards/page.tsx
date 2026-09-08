import type { Metadata } from 'next';
import { metadataOr404, pageMetadata } from '@/lib/seo/page-metadata';
import { subviewTitle } from '@/lib/seo/meta';
import { plainTitle } from '@/lib/seo/slug';
import { JsonLd } from '@/components/seo/JsonLd';
import { LessonFrame } from '@/components/content/lesson/LessonFrame';
import { ComingSoon } from '@/components/content/ComingSoon';
import { NavigationButtons } from '@/components/content/NavigationButtons';
import { loadLesson, type LessonParams } from '../lesson';

const load = (props: LessonParams) => loadLesson(props, '/flashcards');

/** No params are prerendered at build; each address renders on first request and is then served from the cache (see `revalidate` in the layout). */
export function generateStaticParams() {
	return [];
}

export function generateMetadata(props: LessonParams): Promise<Metadata> {
	return metadataOr404(async () => {
		const { node, ancestors, paths } = await load(props);
		// No flashcards exist yet: the page stays reachable but out of the index.
		return pageMetadata({ title: subviewTitle('Flashcards', node, ancestors), description: `Flashcards su ${plainTitle(node.title)} in preparazione. Nel frattempo leggi la teoria della lezione.`, path: paths.flashcards, noindex: true });
	});
}

export default async function FlashcardsPage(props: LessonParams) {
	const { paths, parentLink, navigation, breadcrumb, titleHtml } = await load(props);
	return (
		<>
			<JsonLd data={breadcrumb} />
			<LessonFrame titleHtml={titleHtml} parentLink={parentLink} paths={paths}>
				<ComingSoon kind="flashcards" chapterUrl={parentLink.url} theoryUrl={paths.theory} footer={<NavigationButtons navigation={navigation} />} />
			</LessonFrame>
		</>
	);
}

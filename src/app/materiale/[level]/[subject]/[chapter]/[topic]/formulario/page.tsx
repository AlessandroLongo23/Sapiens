import type { Metadata } from 'next';
import { metadataOr404, pageMetadata } from '@/lib/seo/page-metadata';
import { learningResourceJsonLd } from '@/lib/seo/jsonld';
import { subviewTitle } from '@/lib/seo/meta';
import { plainTitle } from '@/lib/seo/slug';
import { JsonLd } from '@/components/seo/JsonLd';
import { LessonFrame } from '@/components/content/lesson/LessonFrame';
import { LessonReader } from '@/components/content/lesson/LessonReader';
import { TableOfContents } from '@/components/content/lesson/TableOfContents';
import { ComingSoon } from '@/components/content/ComingSoon';
import { NavigationButtons } from '@/components/content/NavigationButtons';
import { loadLesson, renderDocument, type LessonParams } from '../lesson';

const load = (props: LessonParams) => loadLesson(props, '/formulario');

/** No params are prerendered at build; each address renders on first request and is then served from the cache (see `revalidate` in the layout). */
export function generateStaticParams() {
	return [];
}

const description = ({ node, ancestors, formulary }: Awaited<ReturnType<typeof load>>) =>
	formulary
		? `Formulario di ${plainTitle(node.title)} (${plainTitle(ancestors[2]?.title)}, ${plainTitle(ancestors[1]?.title)}): le formule essenziali della lezione raccolte in una pagina.`
		: `Formulario di ${plainTitle(node.title)} in preparazione. Nel frattempo leggi la teoria della lezione.`;

export function generateMetadata(props: LessonParams): Promise<Metadata> {
	return metadataOr404(async () => {
		const lesson = await load(props);
		return pageMetadata({ title: subviewTitle('Formulario', lesson.node, lesson.ancestors), description: description(lesson), path: lesson.paths.formulary, noindex: !lesson.formulary });
	});
}

export default async function FormularyPage(props: LessonParams) {
	const lesson = await load(props);
	const { node, ancestors, paths, parentLink, navigation, updatedAt, breadcrumb, titleHtml } = lesson;
	const doc = renderDocument(lesson.formulary);
	return (
		<>
			<JsonLd data={[breadcrumb, ...(doc ? [learningResourceJsonLd(node, ancestors, { description: description(lesson), resourceType: 'Formulario', free: true, dateModified: updatedAt, path: paths.formulary })] : [])]} />
			<LessonFrame titleHtml={titleHtml} note={{ path: paths.theory, title: plainTitle(node.title) }} parentLink={parentLink} paths={paths} left={doc && <TableOfContents sections={doc.sections} />}>
				{doc ? <LessonReader html={doc.html} sections={doc.sections} footer={<NavigationButtons navigation={navigation} />} /> : <ComingSoon kind="formulary" chapterUrl={parentLink.url} theoryUrl={paths.theory} footer={<NavigationButtons navigation={navigation} />} />}
			</LessonFrame>
		</>
	);
}

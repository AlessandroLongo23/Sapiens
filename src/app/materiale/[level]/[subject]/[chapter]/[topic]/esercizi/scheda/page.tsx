import type { Metadata } from 'next';
import { metadataOr404, pageMetadata } from '@/lib/seo/page-metadata';
import { learningResourceJsonLd } from '@/lib/seo/jsonld';
import { subviewTitle } from '@/lib/seo/meta';
import { plainTitle } from '@/lib/seo/slug';
import { worksheet } from '@/lib/server/worksheet';
import { JsonLd } from '@/components/seo/JsonLd';
import { toneFor } from '@/lib/utils/icons';
import { LessonFrame } from '@/components/content/lesson/LessonFrame';
import { ComingSoon } from '@/components/content/ComingSoon';
import { ExerciseModes } from '@/components/content/exercises/ExerciseModes';
import { Worksheet } from '@/components/content/exercises/Worksheet';
import { NavigationButtons } from '@/components/content/NavigationButtons';
import { loadLesson, type LessonParams } from '../../lesson';

/**
 * The lesson's worksheet: exercises to do on paper, with the results, the same for every visitor
 * (vault/Decisioni/2026-09-26 Una scheda di esercizi gratuita e indicizzata per ogni lezione.md). The page the
 * lesson's exercises are indexed by; the quick path next door (esercizi) is not.
 */

type Props = LessonParams & { searchParams: Promise<{ numero?: string | string[] }> };

const load = (props: LessonParams) => loadLesson(props, '/esercizi/scheda');

/** The sheet asked for with `?numero=<n>`; 1, the one indexed, without it. */
const sheetNumber = async ({ searchParams }: Props) => {
	const { numero } = await searchParams;
	return typeof numero === 'string' && /^\d+$/.test(numero) ? Number(numero) : 1;
};

const description = ({ node, ancestors }: Awaited<ReturnType<typeof load>>, count: number) =>
	count
		? `${count} esercizi su ${plainTitle(node.title)} (${plainTitle(ancestors[2]?.title)}, ${plainTitle(ancestors[1]?.title)}) da fare sul quaderno, divisi per livello, con i risultati.`
		: `Esercizi su ${plainTitle(node.title)} in preparazione. Nel frattempo leggi la teoria della lezione.`;

export function generateMetadata(props: Props): Promise<Metadata> {
	return metadataOr404(async () => {
		const lesson = await load(props);
		const [sheet, n] = await Promise.all([worksheet(lesson.dbPath), sheetNumber(props)]);
		// Only the first sheet is indexed: the others are the same exercises with other numbers.
		return pageMetadata({ title: subviewTitle('Esercizi', lesson.node, lesson.ancestors), description: description(lesson, sheet?.count ?? 0), path: lesson.paths.worksheet, noindex: !sheet || n !== 1 });
	});
}

export default async function WorksheetPage(props: Props) {
	const lesson = await load(props);
	const { node, ancestors, paths, parentLink, navigation, dbPath, breadcrumb, titleHtml } = lesson;
	const sheet = await worksheet(dbPath, await sheetNumber(props));

	return (
		<>
			<JsonLd data={[breadcrumb, ...(sheet ? [learningResourceJsonLd(node, ancestors, { description: description(lesson, sheet.count), resourceType: 'Esercizi', free: true, path: paths.worksheet })] : [])]} />
			{/* The frame's exercise tab points here while the sheet is open, so it stays the one lit. */}
			<LessonFrame tone={toneFor(...ancestors)} titleHtml={titleHtml} note={{ path: paths.theory, title: plainTitle(node.title) }} parentLink={parentLink} paths={{ ...paths, exercises: paths.worksheet }}>
				{!sheet ? (
					<ComingSoon kind="exercises" chapterUrl={parentLink.url} theoryUrl={paths.theory} footer={<NavigationButtons navigation={navigation} />} />
				) : (
					<>
						<ExerciseModes current="sheet" paths={paths} />
						<Worksheet sheet={sheet} path={paths.worksheet} first />
						<NavigationButtons navigation={navigation} />
					</>
				)}
			</LessonFrame>
		</>
	);
}

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { metadataOr404, pageMetadata } from '@/lib/seo/page-metadata';
import { learningResourceJsonLd } from '@/lib/seo/jsonld';
import { subviewTitle } from '@/lib/seo/meta';
import { plainTitle } from '@/lib/seo/slug';
import { worksheet } from '@/lib/server/worksheet';
import { FIRST_SHEET_DAY, isDay, today } from '@/lib/exercises/sheet-day';
import { JsonLd } from '@/components/seo/JsonLd';
import { toneFor } from '@/lib/utils/icons';
import { LessonFrame } from '@/components/content/lesson/LessonFrame';
import { ComingSoon } from '@/components/content/ComingSoon';
import { ExerciseModes } from '@/components/content/exercises/ExerciseModes';
import { Worksheet } from '@/components/content/exercises/Worksheet';
import { NavigationButtons } from '@/components/content/NavigationButtons';
import { loadLesson, type LessonParams } from '../../lesson';

/**
 * The lesson's worksheet of the day: exercises to do on paper, with the results, the same for every visitor on a
 * given day and new the next (vault/Decisioni/2026-09-27 La scheda degli esercizi è giornaliera.md). Today's is the
 * page the lesson's exercises are indexed by; past days (`?giorno=2026-09-26`) and the quick path next door are not.
 */

type Props = LessonParams & { searchParams: Promise<{ giorno?: string | string[] }> };

const load = (props: LessonParams) => loadLesson(props, '/esercizi/scheda');

/** The past day asked for with `?giorno=<date>`, or null for today's sheet, the one at the plain address. */
const pastDay = async ({ searchParams }: Props): Promise<string | null> => {
	const { giorno } = await searchParams;
	return isDay(giorno) && giorno >= FIRST_SHEET_DAY && giorno < today() ? giorno : null;
};

/** Stable across days, so the snippet a search shows stays true of the page. */
const description = ({ node, ancestors }: Awaited<ReturnType<typeof load>>, count: number) =>
	count
		? `Ogni giorno una scheda nuova di ${count} esercizi su ${plainTitle(node.title)} (${plainTitle(ancestors[2]?.title)}, ${plainTitle(ancestors[1]?.title)}) da fare sul quaderno, divisi per livello, con le soluzioni. Si stampa anche in PDF.`
		: `Esercizi su ${plainTitle(node.title)} in preparazione. Nel frattempo leggi la teoria della lezione.`;

export function generateMetadata(props: Props): Promise<Metadata> {
	return metadataOr404(async () => {
		const lesson = await load(props);
		const past = await pastDay(props);
		const sheet = await worksheet(lesson.dbPath, past ?? today());
		// Only today's sheet is indexed: past days are the same exercises with other numbers, one more page a day.
		const path = past ? `${lesson.paths.worksheet}?giorno=${past}` : lesson.paths.worksheet;
		return pageMetadata({ title: subviewTitle('Esercizi', lesson.node, lesson.ancestors), description: description(lesson, sheet?.count ?? 0), path, noindex: !sheet || !!past, follow: true });
	});
}

export default async function WorksheetPage(props: Props) {
	const lesson = await load(props);
	const { node, ancestors, paths, parentLink, navigation, dbPath, breadcrumb, titleHtml } = lesson;
	const { giorno } = await props.searchParams;
	const past = await pastDay(props);
	// Today, a day to come, or not a day: the plain address, which is today's sheet.
	if (giorno !== undefined && !past) redirect(paths.worksheet);
	const day = past ?? today();
	const sheet = await worksheet(dbPath, day);

	return (
		<>
			<JsonLd data={[breadcrumb, ...(sheet ? [learningResourceJsonLd(node, ancestors, { description: description(lesson, sheet.count), resourceType: 'Esercizi', free: true, path: paths.worksheet })] : [])]} />
			{/* The frame's exercise tab points here while the sheet is open, so it stays the one lit. */}
			<LessonFrame tone={toneFor(...ancestors)} titleHtml={titleHtml} note={{ path: paths.theory, title: plainTitle(node.title) }} parentLink={parentLink} paths={{ ...paths, exercises: paths.worksheet }}>
				{!sheet ? (
					<ComingSoon kind="exercises" chapterUrl={parentLink.url} theoryUrl={paths.theory} footer={<NavigationButtons navigation={navigation} />} />
				) : (
					<>
						<Worksheet sheet={sheet} today={today()} path={paths.worksheet} lesson={{ title: plainTitle(node.title), context: [ancestors[1]?.title, ancestors[2]?.title].filter(Boolean).map(plainTitle).join(' · ') }} modes={<ExerciseModes current="sheet" paths={paths} inCard />} />
						<NavigationButtons navigation={navigation} />
					</>
				)}
			</LessonFrame>
		</>
	);
}

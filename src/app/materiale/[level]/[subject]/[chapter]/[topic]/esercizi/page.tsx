import type { Metadata } from 'next';
import { metadataOr404, pageMetadata } from '@/lib/seo/page-metadata';
import { learningResourceJsonLd } from '@/lib/seo/jsonld';
import { subviewTitle } from '@/lib/seo/meta';
import { plainTitle } from '@/lib/seo/slug';
import { titleHtml as toHtml } from '@/lib/content/latex';
import { Features, SUBSCRIPTION_PLANS } from '@/lib/stripe/config';
import { hasFeature } from '@/lib/auth/entitlements';
import { currentUser } from '@/lib/server/auth';
import { generateExercises, hasExercises } from '@/lib/server/exercises';
import { JsonLd } from '@/components/seo/JsonLd';
import { LessonFrame } from '@/components/content/lesson/LessonFrame';
import { ComingSoon } from '@/components/content/ComingSoon';
import { Paywall } from '@/components/subscription/Paywall';
import { ExerciseRunner } from '@/components/content/exercises/ExerciseRunner';
import { StartScreen } from '@/components/content/exercises/StartScreen';
import { NavigationButtons } from '@/components/content/NavigationButtons';
import { loadLesson, type LessonParams } from '../lesson';

/** Exercises are part of the paid plans: rendered per request, generated only for visitors whose plan includes them. */
export const dynamic = 'force-dynamic';

const load = (props: LessonParams) => loadLesson(props, '/esercizi');

const description = ({ node, ancestors, dbPath }: Awaited<ReturnType<typeof load>>) =>
	hasExercises(dbPath, node.slug)
		? `Esercizi interattivi su ${plainTitle(node.title)} (${plainTitle(ancestors[2]?.title)}, ${plainTitle(ancestors[1]?.title)}) con correzione immediata. Ripassa la teoria e mettiti alla prova.`
		: `Esercizi su ${plainTitle(node.title)} in preparazione. Nel frattempo leggi la teoria della lezione.`;

export function generateMetadata(props: LessonParams): Promise<Metadata> {
	return metadataOr404(async () => {
		const lesson = await load(props);
		return pageMetadata({ title: subviewTitle('Esercizi', lesson.node, lesson.ancestors), description: description(lesson), path: lesson.paths.exercises, noindex: !hasExercises(lesson.dbPath, lesson.node.slug) });
	});
}

export default async function ExercisesPage(props: LessonParams) {
	const lesson = await load(props);
	const { node, ancestors, paths, parentLink, navigation, dbPath, breadcrumb, titleHtml } = lesson;
	const available = hasExercises(dbPath, node.slug);
	const unlocked = available && hasFeature(await currentUser(), Features.EXERCISES);
	const exercises = unlocked ? await generateExercises(dbPath, node.slug) : [];
	// A set that could not be generated is shown as not written yet.
	const broken = unlocked && exercises.length === 0;
	// Exercises are part of the paid plans (see the plan config); the markup declares the gated part.
	const free = SUBSCRIPTION_PLANS.FREE.access[Features.EXERCISES];
	const title = toHtml(`Esercizi: ${node.title}`);

	return (
		<>
			<JsonLd data={[breadcrumb, ...(available ? [learningResourceJsonLd(node, ancestors, { description: description(lesson), resourceType: 'Esercizi', free, gatedSelector: free ? undefined : '#esercizi', path: paths.exercises })] : [])]} />
			<LessonFrame titleHtml={titleHtml} note={{ path: paths.theory, title: plainTitle(node.title) }} parentLink={parentLink} paths={paths}>
				{!available || broken ? (
					<ComingSoon kind="exercises" chapterUrl={parentLink.url} theoryUrl={paths.theory} footer={<NavigationButtons navigation={navigation} />} />
				) : !unlocked ? (
					<div id="esercizi" className="h-full">
						<Paywall
							feature={Features.EXERCISES}
							returnTo={paths.exercises}
							backUrl={paths.theory}
							benefit="Esercizi generati ogni volta diversi, con correzione immediata: il modo più rapido per scoprire se la teoria è chiara davvero."
							preview={<StartScreen titleHtml={title} questionCount={10} estimatedTime="15 min" />}
						/>
					</div>
				) : (
					<ExerciseRunner exercises={exercises} titleHtml={title} theoryHref={paths.theory} nextHref={navigation?.next?.url ?? null} />
				)}
			</LessonFrame>
		</>
	);
}

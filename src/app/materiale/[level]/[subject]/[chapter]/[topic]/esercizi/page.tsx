import type { Metadata } from 'next';
import { metadataOr404, pageMetadata } from '@/lib/seo/page-metadata';
import { learningResourceJsonLd } from '@/lib/seo/jsonld';
import { subviewTitle } from '@/lib/seo/meta';
import { plainTitle } from '@/lib/seo/slug';
import { titleHtml as toHtml } from '@/lib/content/latex';
import { Features, SUBSCRIPTION_PLANS } from '@/lib/stripe/config';
import { hasFeature } from '@/lib/auth/entitlements';
import { currentUser } from '@/lib/server/auth';
import { finishedRun, freeQuestionsLeft, hasExercises, lessonPath } from '@/lib/server/exercises';
import { SESSION_LENGTH } from '@/lib/exercises/config';
import { JsonLd } from '@/components/seo/JsonLd';
import { toneFor } from '@/lib/utils/icons';
import { LessonFrame } from '@/components/content/lesson/LessonFrame';
import { ComingSoon } from '@/components/content/ComingSoon';
import { Paywall } from '@/components/subscription/Paywall';
import { ExerciseRunner } from '@/components/content/exercises/ExerciseRunner';
import { ExercisePath } from '@/components/content/exercises/ExercisePath';
import { NavigationButtons } from '@/components/content/NavigationButtons';
import { loadLesson, type LessonParams } from '../lesson';

/** Rendered per request: the page depends on the visitor's plan and, on Free, on today's session. */
export const dynamic = 'force-dynamic';

const load = (props: LessonParams) => loadLesson(props, '/esercizi');

const description = ({ node, ancestors, dbPath }: Awaited<ReturnType<typeof load>>) =>
	hasExercises(dbPath)
		? `Esercizi interattivi su ${plainTitle(node.title)} (${plainTitle(ancestors[2]?.title)}, ${plainTitle(ancestors[1]?.title)}) con correzione immediata. Ripassa la teoria e mettiti alla prova.`
		: `Esercizi su ${plainTitle(node.title)} in preparazione. Nel frattempo leggi la teoria della lezione.`;

export function generateMetadata(props: LessonParams): Promise<Metadata> {
	return metadataOr404(async () => {
		const lesson = await load(props);
		return pageMetadata({ title: subviewTitle('Esercizi', lesson.node, lesson.ancestors), description: description(lesson), path: lesson.paths.exercises, noindex: !hasExercises(lesson.dbPath) });
	});
}

export default async function ExercisesPage(props: LessonParams & { searchParams: Promise<{ prova?: string | string[] }> }) {
	const lesson = await load(props);
	const { node, ancestors, paths, parentLink, navigation, dbPath, breadcrumb, titleHtml } = lesson;
	const available = hasExercises(dbPath);
	const user = await currentUser();
	// Studio exercises without limits; a Free account has one session a day, across all lessons.
	const full = available && hasFeature(user, Features.EXERCISES);
	const [left, path] = await Promise.all([available && user && !full ? freeQuestionsLeft(user.id) : 0, available ? lessonPath(user?.id ?? null, dbPath) : null]);
	// `?prova=<id>`: the mistakes of a finished run, opened again after a reload or from a link. Looking back at a
	// run costs no questions, so it opens on Free after today's session too.
	const { prova } = await props.searchParams;
	const finished = available && user && typeof prova === 'string' ? await finishedRun(user.id, dbPath, prova) : null;
	const unlocked = full || left > 0 || !!finished;
	// Exercises are part of the paid plans (see the plan config); the markup declares the gated part.
	const free = SUBSCRIPTION_PLANS.FREE.access[Features.EXERCISES];
	const title = toHtml(`Esercizi: ${node.title}`);

	return (
		<>
			<JsonLd data={[breadcrumb, ...(available ? [learningResourceJsonLd(node, ancestors, { description: description(lesson), resourceType: 'Esercizi', free, gatedSelector: free ? undefined : '#esercizi', path: paths.exercises })] : [])]} />
			<LessonFrame tone={toneFor(...ancestors)} titleHtml={titleHtml} note={{ path: paths.theory, title: plainTitle(node.title) }} parentLink={parentLink} paths={paths}>
				{!available ? (
					<ComingSoon kind="exercises" chapterUrl={parentLink.url} theoryUrl={paths.theory} footer={<NavigationButtons navigation={navigation} />} />
				) : !unlocked ? (
					<div id="esercizi" className="h-full">
						<Paywall
							feature={Features.EXERCISES}
							returnTo={paths.exercises}
							backUrl={paths.theory}
							title={user ? "Hai fatto la sessione di oggi" : 'Crea un account per fare gli esercizi'}
							benefit={
								user
									? "Domani hai un'altra sessione gratuita. Con Studio ti eserciti senza limiti, su tutte le lezioni, con i progressi salvati."
									: 'Con un account gratuito hai una sessione di esercizi al giorno, generati ogni volta diversi, con correzione immediata e progressi salvati.'
							}
							preview={path && <ExercisePath titleHtml={title} path={path} questionCount={SESSION_LENGTH} />}
						/>
					</div>
				) : (
					path && <ExerciseRunner lesson={dbPath} path={path} free={!full} questionsLeft={full ? SESSION_LENGTH : left} titleHtml={title} theoryHref={paths.theory} nextHref={navigation?.next?.url ?? null} finished={finished} />
				)}
			</LessonFrame>
		</>
	);
}

import type { Metadata } from 'next';
import { metadataOr404, pageMetadata } from '@/lib/seo/page-metadata';
import { learningResourceJsonLd } from '@/lib/seo/jsonld';
import { subviewTitle } from '@/lib/seo/meta';
import { plainTitle } from '@/lib/seo/slug';
import { renderMarkdown } from '@/lib/content/markdown';
import { Features, SUBSCRIPTION_PLANS } from '@/lib/stripe/config';
import { hasFeature } from '@/lib/auth/entitlements';
import { currentUser } from '@/lib/server/auth';
import { hasExercises } from '@/lib/server/exercises';
import { JsonLd } from '@/components/seo/JsonLd';
import { LessonFrame } from '@/components/content/lesson/LessonFrame';
import { ComingSoon } from '@/components/content/ComingSoon';
import { Paywall } from '@/components/subscription/Paywall';
import { Html } from '@/components/ui/Html';
import { FlashcardDeck, type FlashcardView } from '@/components/content/flashcards/FlashcardDeck';
import { NavigationButtons } from '@/components/content/NavigationButtons';
import { loadLesson, type LessonParams } from '../lesson';

/** Flashcards are part of the paid plans: rendered per request, sent only to visitors whose plan includes them. */
export const dynamic = 'force-dynamic';

const load = (props: LessonParams) => loadLesson(props, '/flashcards');

const description = ({ node, ancestors, flashcards }: Awaited<ReturnType<typeof load>>) =>
	flashcards
		? `${flashcards.length} flashcard su ${plainTitle(node.title)} (${plainTitle(ancestors[2]?.title)}, ${plainTitle(ancestors[1]?.title)}): definizioni, regole ed errori da ripassare in pochi minuti.`
		: `Flashcard su ${plainTitle(node.title)} in preparazione. Nel frattempo leggi la teoria della lezione.`;

/** A card's markdown as HTML; the two blank lines stand in for the title lines renderMarkdown drops. */
const cardHtml = (markdown: string) => renderMarkdown(`\n\n${markdown}`);

export function generateMetadata(props: LessonParams): Promise<Metadata> {
	return metadataOr404(async () => {
		const lesson = await load(props);
		return pageMetadata({ title: subviewTitle('Flashcards', lesson.node, lesson.ancestors), description: description(lesson), path: lesson.paths.flashcards, noindex: !lesson.flashcards });
	});
}

export default async function FlashcardsPage(props: LessonParams) {
	const lesson = await load(props);
	const { node, ancestors, paths, parentLink, navigation, dbPath, breadcrumb, titleHtml, flashcards, updatedAt } = lesson;
	const unlocked = !!flashcards && hasFeature(await currentUser(), Features.FLASHCARDS);
	const cards: FlashcardView[] = unlocked ? flashcards.map((c) => ({ id: c.id, frontHtml: cardHtml(c.front), backHtml: cardHtml(c.back) })) : [];
	const free = SUBSCRIPTION_PLANS.FREE.access[Features.FLASHCARDS];

	return (
		<>
			<JsonLd data={[breadcrumb, ...(flashcards ? [learningResourceJsonLd(node, ancestors, { description: description(lesson), resourceType: 'Flashcard', free, gatedSelector: free ? undefined : '#flashcard', dateModified: updatedAt, path: paths.flashcards })] : [])]} />
			<LessonFrame titleHtml={titleHtml} note={{ path: paths.theory, title: plainTitle(node.title) }} parentLink={parentLink} paths={paths}>
				{!flashcards ? (
					<ComingSoon kind="flashcards" chapterUrl={parentLink.url} theoryUrl={paths.theory} footer={<NavigationButtons navigation={navigation} />} />
				) : !unlocked ? (
					<div id="flashcard" className="h-full">
						<Paywall
							feature={Features.FLASHCARDS}
							returnTo={paths.flashcards}
							backUrl={paths.theory}
							benefit={`${flashcards.length} carte con le definizioni, le regole e gli errori della lezione, per ripassare in pochi minuti prima di una verifica.`}
							preview={
								<div className="flex h-full min-h-[40dvh] items-center justify-center p-6">
									<div className="w-full max-w-md rounded-3xl border border-edge-soft bg-surface px-6 py-10 text-center text-lg font-semibold text-fg-strong shadow-lg">
										<Html html={cardHtml(flashcards[0].front)} className="markdown-content math-content" />
									</div>
								</div>
							}
						/>
					</div>
				) : (
					<FlashcardDeck cards={cards} exercisesHref={hasExercises(dbPath, node.slug) ? paths.exercises : null} nextHref={navigation?.next?.url ?? null} />
				)}
			</LessonFrame>
		</>
	);
}

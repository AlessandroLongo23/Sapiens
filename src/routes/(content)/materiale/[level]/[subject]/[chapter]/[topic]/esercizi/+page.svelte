<script lang="ts">
	import { tick } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { Answer, ProgressState } from '$lib/exercises/abstract.svelte';
	import { sineOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import { subviewTitle } from '$lib/seo/meta';
	import { plainTitle } from '$lib/seo/slug';
	import { learningResourceJsonLd } from '$lib/seo/jsonld';
	import { SUBSCRIPTION_PLANS, Features } from '$lib/stripe/config';

	import Seo from '$lib/components/seo/Seo.svelte';
	import SegmentedProgressBar from '$lib/components/content/SegmentedProgressBar.svelte';
	import AnswerButton from '$lib/components/ui/buttons/AnswerButton.svelte';
	import SummaryModal from '$lib/components/ui/modals/SummaryModal.svelte';
	import MathRenderer from '$lib/components/content/markdown/MathRenderer.svelte';
	import ContentComingSoon from '$lib/components/content/ContentComingSoon.svelte';
	import StartScreen from '$lib/components/content/StartScreen.svelte';
	import Paywall from '$lib/components/subscription/Paywall.svelte';

	let { data } = $props();
	// `exercises` is reactive: a retry reloads the page data for a fresh set.
	let { exercises, available, locked, node, ancestors, paths, parentLink, navigation } = $derived(data);

	let hasStarted = $state(false);
	let currentExerciseIndex = $state(0);
	let progressStates = $state<ProgressState[]>([]);
	let selectedAnswer = $state<Answer | null>(null);
	let isAnswering = $state(false);
	let showSummaryModal = $state(false);

	const questionNumber = tweened(0, {
		duration: 400,
		easing: sineOut
	});

	$effect(() => {
		questionNumber.set(currentExerciseIndex);
	});

	function start() {
		progressStates = Array(exercises?.length ?? 0).fill(ProgressState.UNANSWERED);
		currentExerciseIndex = 0;
		questionNumber.set(0, { duration: 0 });
		selectedAnswer = null;
		isAnswering = false;
		showSummaryModal = false;
		hasStarted = true;
	}

	// New exercises, straight into the first question. The index goes back
	// to zero before the data changes, so the old position is never applied
	// to the new set.
	async function retry() {
		showSummaryModal = false;
		currentExerciseIndex = 0;
		questionNumber.set(0, { duration: 0 });
		await invalidateAll();
		start();
	}

	// Dismissed without choosing: back to the start screen.
	function closeSummary() {
		showSummaryModal = false;
		hasStarted = false;
	}

	let currentExercise = $derived(exercises && exercises.length > 0 ? exercises[Math.round($questionNumber)] : null);
	let estimatedTime = $derived(exercises && exercises.length ? `${Math.max(5, Math.ceil(exercises.length * 1.5))} min` : '10 min');

	function handleAnswer(answer: Answer): void {
		if (isAnswering) return;

		isAnswering = true;
		selectedAnswer = answer;

		progressStates[currentExerciseIndex] = answer.isCorrect ? ProgressState.CORRECT : ProgressState.INCORRECT;

		setTimeout(() => {
			selectedAnswer = null;
			isAnswering = false;

			if (exercises && currentExerciseIndex < exercises.length - 1) {
				currentExerciseIndex++;
			} else {
				showSummaryModal = true;
			}
		}, 1500);
	}

	function getButtonState(answer: Answer): ProgressState {
		if (!isAnswering) return ProgressState.UNANSWERED;
		if (answer !== selectedAnswer) return ProgressState.UNANSWERED;

		return answer.isCorrect ? ProgressState.CORRECT : ProgressState.INCORRECT;
	}

	let correctCount = $derived(progressStates.filter((s) => s === ProgressState.CORRECT).length);

	// Answers sit in two columns when every one of them is short enough to
	// share a row, otherwise in one. The guess comes from the text; after
	// rendering, any answer wider than its cell sends the whole set back to
	// one column, so the choice follows what is actually on screen.
	const SHORT_ANSWER = 14;
	const plainLength = (latex: string) =>
		latex
			.replace(/\$/g, '')
			.replace(/\\(?:frac|dfrac|sqrt|cdot|times|left|right|pm|mathbb|text)\b/g, '')
			.replace(/\\[a-zA-Z]+/g, 'x')
			.replace(/[{}^_\s]/g, '').length;

	let answerGrid = $state<HTMLElement | null>(null);
	let columns = $state<1 | 2>(1);

	let shortAnswers = $derived(
		!!currentExercise && currentExercise.options.every((a: Answer) => plainLength(a.textContent) <= SHORT_ANSWER)
	);

	// Measured once the math fonts are in, or the fallback font's wider
	// glyphs would send a set that fits to one column.
	async function fitColumns() {
		await tick();
		if (typeof document !== 'undefined' && 'fonts' in document) await document.fonts.ready;
		if (!answerGrid || columns !== 2) return;
		const cells = Array.from(answerGrid.querySelectorAll<HTMLElement>('[data-answer-content]'));
		if (cells.some((el) => el.scrollWidth > el.clientWidth + 1)) columns = 1;
	}

	$effect(() => {
		currentExercise;
		columns = shortAnswers ? 2 : 1;
		if (shortAnswers) fitColumns();
	});

	const [, subject, chapter] = ancestors;
	const title = subviewTitle('Esercizi', node, ancestors);
	const description = available
		? `Esercizi interattivi su ${plainTitle(node.title)} (${plainTitle(chapter?.title)}, ${plainTitle(subject?.title)}) con correzione immediata. Ripassa la teoria e mettiti alla prova.`
		: `Esercizi su ${plainTitle(node.title)} in preparazione. Nel frattempo leggi la teoria della lezione.`;

	// Exercises are part of the paid plans (see $lib/stripe/config); the markup declares the gated part.
	const exercisesFree = SUBSCRIPTION_PLANS.FREE.access[Features.EXERCISES];
	const jsonLd = available
		? learningResourceJsonLd(node, ancestors, {
				description,
				resourceType: 'Esercizi',
				free: exercisesFree,
				gatedSelector: exercisesFree ? undefined : '#esercizi',
				path: paths.exercises
			})
		: undefined;
</script>

<Seo {title} {description} path={paths.exercises} noindex={!available} {jsonLd} />

<svelte:window onresize={() => { columns = shortAnswers ? 2 : 1; if (shortAnswers) fitColumns(); }} />

{#if !available}
	<ContentComingSoon type="exercises" {navigation} chapterUrl={parentLink.url} theoryUrl={paths.theory} />
{:else if locked}
	<div id="esercizi" class="h-full">
		<Paywall
			feature={Features.EXERCISES}
			returnTo={paths.exercises}
			backUrl={paths.theory}
			benefit="Esercizi generati ogni volta diversi, con correzione immediata: il modo più rapido per scoprire se la teoria è chiara davvero."
		>
			{#snippet preview()}
				<StartScreen title="Esercizi: {node.title}" questionCount={10} estimatedTime="15 min" onStart={() => {}} type="exercise" />
			{/snippet}
		</Paywall>
	</div>
{:else if !hasStarted}
	<StartScreen
		title="Esercizi: {node.title}"
		questionCount={exercises.length}
		estimatedTime={estimatedTime}
		onStart={start}
		type="exercise"
	/>
{:else}
	<div id="esercizi" class="flex flex-col justify-between items-center gap-6 w-full h-full p-4 sm:p-8 md:px-10">
		<SegmentedProgressBar states={progressStates} />

		{#if currentExercise}
		{#key currentExercise.question}
			<div
				class="w-full max-w-2xl text-lg sm:text-2xl font-bold text-zinc-800 dark:text-zinc-200 break-words"
				in:fade={{ duration: 500}}
			>
				<!-- Long formulas scroll sideways inside this box; the padding leaves room for tall exponents and fractions. -->
				<div class="scroll-x px-2 py-3 text-center [&_.katex-display]:my-0 [&_.katex-display]:overflow-visible">
					<MathRenderer content={currentExercise.question.textContent} />
				</div>
			</div>

			<div
				bind:this={answerGrid}
				class="grid auto-rows-fr gap-3 sm:gap-4 w-full max-w-2xl mx-auto {columns === 2 ? 'grid-cols-2' : 'grid-cols-1'}"
				role="group"
				aria-label="Risposte"
			>
				{#each currentExercise.options as answer}
					<!-- An odd last answer takes the whole row instead of leaving a hole. -->
					<div class="h-full min-w-0 [&:nth-child(odd):last-child]:col-span-full">
						<AnswerButton answer={answer.textContent} state={getButtonState(answer)} onclick={() => handleAnswer(answer)} />
					</div>
				{/each}
			</div>
		{/key}
		{/if}
	</div>

	<SummaryModal
		bind:isOpen={showSummaryModal}
		correctCount={correctCount}
		totalCount={exercises.length}
		href={paths.theory}
		nextHref={navigation?.next?.url ?? null}
		onRetry={retry}
		onClose={closeSummary}
	/>
{/if}

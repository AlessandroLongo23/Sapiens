<script lang="ts">
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
	const { exercises, available, locked, node, ancestors, paths, parentLink, navigation } = data;

	let hasStarted = $state(false);
	let currentExerciseIndex = $state(0);
	let progressStates = $state<ProgressState[]>(exercises ? Array(exercises.length).fill(ProgressState.UNANSWERED) : []);
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
		onStart={() => hasStarted = true}
		type="exercise"
	/>
{:else}
	<div id="esercizi" class="flex flex-col justify-between items-center w-full h-full p-8 md:px-10">
		<SegmentedProgressBar states={progressStates} />

		{#key currentExercise.question}
			<div
				class="text-xl sm:text-2xl font-bold text-zinc-800 dark:text-zinc-200"
				in:fade={{ duration: 500}}
			>
				<MathRenderer content={currentExercise.question.textContent} />
			</div>

			<div class="grid grid-cols-2 gap-4 w-full max-w-2xl mx-auto justify-items-center">
				{#each currentExercise.options as answer}
					<div>
						<AnswerButton answer={answer.textContent} state={getButtonState(answer)} onclick={() => handleAnswer(answer)} />
					</div>
				{/each}
			</div>
		{/key}
	</div>

	<SummaryModal
		bind:isOpen={showSummaryModal}
		correctCount={correctCount}
		totalCount={exercises.length}
		href={paths.theory}
	/>
{/if}

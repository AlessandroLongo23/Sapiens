<script lang="ts">
	import { Answer, ProgressState } from '$lib/exercises/abstract.svelte';
	import { sineOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	
	import SegmentedProgressBar from '$lib/components/content/SegmentedProgressBar.svelte';
	import AnswerButton from '$lib/components/ui/buttons/AnswerButton.svelte';
	import SummaryModal from '$lib/components/ui/modals/SummaryModal.svelte';
	import MathRenderer from '$lib/components/content/markdown/MathRenderer.svelte';
    import ContentComingSoon from '$lib/components/content/ContentComingSoon.svelte';
    import StartScreen from '$lib/components/content/StartScreen.svelte';
	
	let { data } = $props();
	const { exercises, title, topic_id, level_id, subject_id, chapter_id, navigation } = data;

    let hasStarted = $state(false);
	let currentExerciseIndex = $state(0);
	let progressStates = $state<ProgressState[]>(exercises ? Array(exercises.length).fill(ProgressState.UNANSWERED) : []);
	let selectedAnswer = $state(null);
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
    let estimatedTime = $derived(exercises ? `${Math.max(5, Math.ceil(exercises.length * 1.5))} min` : "5 min");

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
</script>

<svelte:head>
    <title>Esercizi su {topic_id}</title>
</svelte:head>

{#if !exercises || exercises.length === 0}
    <ContentComingSoon type="exercises" navigation={navigation} />
{:else if !hasStarted}
    <StartScreen 
        title="Esercizi: {title}" 
        questionCount={exercises.length} 
        estimatedTime={estimatedTime}
        onStart={() => hasStarted = true}
        type="exercise"
    />
{:else}
    <div class="flex flex-col justify-between items-center w-full h-full p-8 md:px-10">
        <SegmentedProgressBar states={progressStates} />

        {#key currentExercise.question}
            <div
                class="text-xl sm:text-2xl font-bold text-zinc-800 dark:text-zinc-200"
                in:fade={{ duration: 500}}
            >
                <MathRenderer content={currentExercise.question.textContent} />
            </div>

            <div class="sm:flex sm:flex-row grid grid-cols-2 justify-center items-center gap-4 w-full">
                {#each currentExercise.answers as answer}
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
        href={`/content/${level_id}/${subject_id}/${chapter_id}/${topic_id}/theory`}
    />
{/if}

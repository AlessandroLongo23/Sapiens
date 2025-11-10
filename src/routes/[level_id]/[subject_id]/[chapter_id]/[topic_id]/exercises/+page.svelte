<script>
	import SegmentedProgressBar from '$lib/components/SegmentedProgressBar.svelte';
	import AnswerButton from '$lib/components/shared/ui/buttons/AnswerButton.svelte';
	import SummaryModal from '$lib/components/shared/ui/modals/SummaryModal.svelte';
	import MathRenderer from '$lib/components/students/markdown/MathRenderer.svelte';
	
	import { sineOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { fade } from 'svelte/transition';

	let { data } = $props();
	const { exercises, level_id, subject_id, chapter_id, topic_id } = data;

	let currentExerciseIndex = $state(0);
	let progressStates = $state(Array(exercises.length).fill('unanswered'));
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

	let currentExercise = $derived(exercises[Math.round($questionNumber)]);

	function handleAnswer(answer) {
		if (isAnswering) return;

		isAnswering = true;
		selectedAnswer = answer;

		progressStates[currentExerciseIndex] = answer.isCorrect ? 'correct' : 'incorrect';

		setTimeout(() => {
			selectedAnswer = null;
			isAnswering = false;

			if (currentExerciseIndex < exercises.length - 1) {
				currentExerciseIndex++;
			} else {
				showSummaryModal = true;
			}
		}, 1500);
	}

	function getButtonState(answer) {
		if (!isAnswering) return 'idle';
		if (answer !== selectedAnswer) return 'idle';

		return answer.isCorrect ? 'correct' : 'incorrect';
	}

	let correctCount = $derived(progressStates.filter((s) => s === 'correct').length);
</script>

<svelte:head>
	<title>Esercizi su {topic_id}</title>
</svelte:head>

<div class="flex flex-col justify-between items-center w-full max-w-2xl mx-auto p-4 gap-8 min-h-[calc(100vh-10rem)]">
	<SegmentedProgressBar states={progressStates} />

	{#key currentExercise.question}
		<div
			class="text-3xl sm:text-4xl font-bold text-zinc-800 dark:text-zinc-200"
			in:fade={{ opacity: 0, duration: 500}}
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
/>

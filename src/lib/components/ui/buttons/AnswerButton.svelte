<script>
	import { ProgressState } from '$lib/exercises/abstract.svelte';

	import MathRenderer from '$lib/components/content/markdown/MathRenderer.svelte';

	let { answer, state = ProgressState.UNANSWERED, onclick } = $props(); 

	// Fills its grid cell, so every answer of a question is the same size; a
	// formula wider than the cell scrolls inside it instead of breaking out.
	const baseClasses = 'relative flex h-full min-h-[56px] w-full min-w-0 items-center justify-center text-base sm:text-lg font-semibold border-2 rounded-xl py-3 sm:py-4 px-3 sm:px-6 transition-all duration-300 ease-in-out transform focus:outline-none break-words';

	const stateClasses = {
		[ProgressState.UNANSWERED]: 'bg-white dark:bg-zinc-800 border-zinc-500/25 hover:bg-zinc-100 dark:hover:bg-zinc-700 active:bg-zinc-100 dark:active:bg-zinc-700',
		[ProgressState.CORRECT]: 'z-10 bg-green-500 border-green-600 text-white scale-105 shadow-lg animate-pulse',
		[ProgressState.INCORRECT]: 'z-10 bg-red-500 border-red-600 text-white scale-105 shadow-lg animate-shake'
	};
</script>

<button class="{baseClasses} {stateClasses[state]} cursor-pointer" onclick={onclick}>
	<span data-answer-content class="block max-w-full scroll-x px-1 py-1 [&_.katex-display]:my-0 [&_.katex-display]:overflow-visible [&_.math-content]:text-inherit [&_.katex]:text-inherit">
		<MathRenderer content={answer}/>
	</span>
</button>

<style>
	@keyframes shake {
		0%,
		100% {
			transform: translateX(0) scale(1.05);
		}
		10%,
		30%,
		50%,
		70%,
		90% {
			transform: translateX(-5px) scale(1.05);
		}
		20%,
		40%,
		60%,
		80% {
			transform: translateX(5px) scale(1.05);
		}
	}
	.animate-shake {
		animation: shake 0.5s ease-in-out;
	}
</style> 
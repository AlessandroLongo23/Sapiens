<script>
	import MathRenderer from '$lib/components/students/markdown/MathRenderer.svelte';

	let { answer, state = 'idle', onclick } = $props(); 

	const baseClasses =
		'w-full max-w-sm text-base sm:text-lg font-semibold border-2 rounded-lg py-2 sm:py-4 px-6 sm:px-8 transition-all duration-300 ease-in-out transform focus:outline-none';

	const stateClasses = {
		idle: 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:border-blue-500',
		selected: 'bg-blue-500 border-blue-600 text-white scale-105 shadow-lg',
		correct: 'bg-green-500 border-green-600 text-white scale-105 shadow-lg animate-pulse',
		incorrect: 'bg-red-500 border-red-600 text-white scale-105 shadow-lg animate-shake'
	};
</script>

<button class="{baseClasses} {stateClasses[state]} cursor-pointer" onclick={onclick}>
	<MathRenderer content={answer}/>
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
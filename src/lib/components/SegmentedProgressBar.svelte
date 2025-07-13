<script>
	let { states = [] } = $props();

	const stateClasses = {
		unanswered: 'bg-zinc-300 dark:bg-zinc-700',
		correct: 'bg-green-500',
		incorrect: 'bg-red-500'
	};
</script>

<div class="flex w-full gap-2 p-1">
	{#each states as state, i (i)}
		<div class="flex-1 h-2.5 rounded-full transition-colors duration-500 {stateClasses[state]}"></div>
	{/each}
</div> 
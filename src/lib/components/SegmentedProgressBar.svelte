<script lang="ts">
	import { ProgressState } from '$lib/exercises/abstract.svelte';

	let { states = [] } = $props();

	const stateClasses: Record<ProgressState, string> = {
		[ProgressState.UNANSWERED]: 'bg-zinc-300 dark:bg-zinc-700',
		[ProgressState.CORRECT]: 'bg-green-500',
		[ProgressState.INCORRECT]: 'bg-red-500'
	};
</script>

<div class="flex w-full gap-2 p-1">
	{#each states as state, i (i)}
		<div class="flex-1 h-2.5 rounded-full transition-colors duration-500 {stateClasses[state]}"></div>
	{/each}
</div> 
<script>
	import { createEventDispatcher } from 'svelte';
	
	import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
	
	let { content, targetSection = '' } = $props();
		
	const dispatch = createEventDispatcher();
	
	function handleSectionActive(e) {
		dispatch('activeSection', { sectionId: e.detail.sectionId });
	}
</script>

<div class="w-full h-full overflow-hidden bg-zinc-50">
	{#if content}
		<MarkdownRenderer 
			{content}
			{targetSection}
			on:sectionActive={handleSectionActive}
		/>
	{:else}
		<div class="w-full h-full flex items-center justify-center">
			<div class="text-zinc-400 p-4 text-center">
				<p>Nessun contenuto disponibile</p>
			</div>
		</div>
	{/if}
</div> 
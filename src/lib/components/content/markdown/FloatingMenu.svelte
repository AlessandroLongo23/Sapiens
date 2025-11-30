<script lang="ts">
    import { contextualMenuPrompts, type Prompt } from '$lib/data/prompts';
    
    let { 
        isVisible = $bindable(false),
        position = $bindable({ x: 0, y: 0 }),
        onSelect = $bindable((prompt: Prompt) => {}),
    } = $props();

    function handleClick(prompt: Prompt) {
        // Clear the text selection
        window.getSelection()?.removeAllRanges();
        onSelect(prompt);
    }
</script>

{#if isVisible}
    <div 
		class="fixed z-50 -translate-x-1/2 -translate-y-full animate-in fade-in zoom-in-95 duration-200"
		style="top: {position.y}px; left: {position.x}px"
	>
		<div class="flex items-center gap-1 p-1.5 rounded-xl
			bg-white/95 dark:bg-zinc-900/95 
			backdrop-blur-lg
			border border-crimson-200 dark:border-crimson-500/25
			shadow-lg shadow-crimson-500/10 dark:shadow-crimson-500/20"
		>
			{#each Object.values(contextualMenuPrompts) as prompt}
				{@const Icon = prompt.icon}
			<button onclick={() => handleClick(prompt)} class="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg
				text-zinc-700 dark:text-zinc-200
				hover:bg-crimson-50 dark:hover:bg-crimson-500/10
				transition-colors"
			>
					<Icon class="size-4 text-crimson-500" />
					<span>{prompt.label}</span>
				</button>
			{/each}
		</div>
		
		<!-- Arrow -->
		<div class="absolute left-1/2 -translate-x-1/2 -bottom-1.5 
			w-3 h-3 rotate-45
			bg-white dark:bg-zinc-900
			border-r border-b border-crimson-200 dark:border-crimson-500/25"
		></div>
    </div>
{/if}

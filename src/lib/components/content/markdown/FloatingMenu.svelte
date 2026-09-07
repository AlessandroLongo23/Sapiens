<script lang="ts">
    import { contextualMenuPrompts, type Prompt } from '$lib/data/prompts';

    /**
     * The actions offered on a text selection. With a mouse it floats above
     * the selection as one row; on touch it sits below the last selected
     * line (the OS callout takes the space above) as a two-column grid of
     * large targets, kept inside the screen.
     */
    let {
        isVisible = $bindable(false),
        position = $bindable({ x: 0, y: 0 }),
        touch = false,
        onSelect = $bindable((prompt: Prompt) => {}),
    } = $props();

    let menuWidth = $state(0);

    const MARGIN = 8;

    // Horizontal clamp so the menu never leaves the screen on a phone.
    let left = $derived.by(() => {
        if (typeof window === 'undefined') return position.x;
        const half = menuWidth / 2;
        const min = MARGIN + half;
        const max = window.innerWidth - MARGIN - half;
        return Math.min(Math.max(position.x, min), Math.max(min, max));
    });

    // The finger's selection is dropped before `click`, so the choice is taken on pointerdown.
    function choose(event: Event, prompt: Prompt) {
        event.preventDefault();
        window.getSelection()?.removeAllRanges();
        onSelect(prompt);
    }
</script>

{#if isVisible}
    <div
        bind:clientWidth={menuWidth}
		class="fixed z-50 -translate-x-1/2 animate-in fade-in zoom-in-95 duration-200 max-w-[calc(100vw-16px)] {touch ? '' : '-translate-y-full'}"
		style="top: {position.y}px; left: {left}px"
        role="toolbar"
        aria-label="Chiedi a Sapiens AI"
	>
		<div class="rounded-2xl p-1.5
			bg-white/95 dark:bg-zinc-900/95
			backdrop-blur-lg
			border border-crimson-200 dark:border-crimson-500/25
			shadow-lg shadow-crimson-500/10 dark:shadow-crimson-500/20
            {touch ? 'grid grid-cols-[auto_auto] gap-1' : 'flex items-center gap-1'}"
		>
			{#each Object.values(contextualMenuPrompts) as prompt}
				{@const Icon = prompt.icon}
			<button
                type="button"
                onpointerdown={(e) => touch && choose(e, prompt)}
                onclick={(e) => !touch && choose(e, prompt)}
                class="flex items-center gap-2 rounded-xl text-sm font-medium whitespace-nowrap
				text-zinc-700 dark:text-zinc-200
				hover:bg-crimson-50 dark:hover:bg-crimson-500/10 active:bg-crimson-50 dark:active:bg-crimson-500/10
				transition-colors {touch ? 'min-h-[44px] px-3' : 'px-3 py-2'}"
			>
					<Icon class="size-4 shrink-0 text-crimson-500" aria-hidden="true" />
					<span>{prompt.label}</span>
				</button>
			{/each}
		</div>

		<!-- Arrow -->
		<div class="absolute left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white dark:bg-zinc-900 {touch
            ? '-top-1.5 border-l border-t'
            : '-bottom-1.5 border-r border-b'} border-crimson-200 dark:border-crimson-500/25"
            style={touch ? `margin-left: ${position.x - left}px` : ''}
            aria-hidden="true"
		></div>
    </div>
{/if}

<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { onMount } from 'svelte';

    let {
        options = [],
        type = 'text',
        labels = [],
        icons = [],
        value = $bindable(),
        style = 'flat',
        classes = ''
    } = $props();

    const dispatch = createEventDispatcher();
    let toggleRef = $state(null);
    let optionRefs = $state([]);
    let mounted = $state(false);

    $effect(() => {
        if (options.length > 0 && (value === undefined || value === null || !options.includes(value))) {
            value = options[0];
        }
    });

    onMount(() => {
        mounted = true;
    });

    function handleOptionClick(option) {
        value = option;
        dispatch('change', option);
    }

    function getOptionIndex(option) {
        return options.indexOf(option);
    }

    function getHighlighterStyle(selectedOption) {
        if (!mounted || !toggleRef || !optionRefs.length || !selectedOption) return 'opacity: 0;';
        
        const index = getOptionIndex(selectedOption);
        const selectedButton = optionRefs[index];
        
        if (!selectedButton) return 'opacity: 0;';
        
        const containerRect = toggleRef.getBoundingClientRect();
        const buttonRect = selectedButton.getBoundingClientRect();
        
        const left = buttonRect.left - containerRect.left;
        const width = buttonRect.width;
        
        return `width: ${width}px; left: ${left}px; opacity: 1;`;
    }

    let highlighterStyle = $derived(getHighlighterStyle(value));
    let highlighterClasses = $derived(style === '3d' ? 'shadow-lg' : 'border border-zinc-300 dark:border-zinc-700');
    let containerClasses = $derived(style === '3d' ? 'shadow-inner' : 'border border-zinc-300 dark:border-zinc-700 gap-1');
    let optionClasses = $derived(style === '3d' ? 'px-4 py-2' : 'px-3 py-1');
</script>

<div class="inline-flex items-center">
    <div class="relative flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 transition-all duration-200 {containerClasses}" bind:this={toggleRef}>
        <div 
            class="{highlighterClasses} absolute top-1 bottom-1 bg-white dark:bg-zinc-600 rounded-md opacity-0 z-10 transition-all duration-300 ease-out"
            style={highlighterStyle}
        ></div>
        
        {#each options as option, index}
            <button
                bind:this={optionRefs[index]}
                class="{optionClasses} relative flex items-center justify-center bg-transparent rounded-md cursor-pointer transition-colors duration-200 z-20 text-sm font-medium text-zinc-500 dark:text-zinc-400 whitespace-nowrap flex-1 min-h-8 box-border hover:text-zinc-900 dark:hover:text-zinc-100 focus:outline-none focus-visible:outline-2 focus-visible:outline-rose-500 focus-visible:outline-offset-2 {value === option ? 'text-zinc-900 dark:text-zinc-100' : ''} sm:px-3 sm:text-xs sm:min-h-7"
                onclick={() => handleOptionClick(option)}
                type="button"
            >
                {#if type === 'icon'}
                    <svelte:component this={icons[index]} class="w-4 h-4 flex-shrink-0" />
                {:else}
                    <span class="select-none block text-center">{labels[index]}</span>
                {/if}
            </button>
        {/each}
    </div>
</div>

<style>
    .shadow-inner {
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    :global(.dark) .shadow-inner {
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    .shadow-lg {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    :global(.dark) .shadow-lg {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    }

    .ease-out {
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
</style> 
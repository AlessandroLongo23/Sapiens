<script>
    import { Search, X } from 'lucide-svelte';
    import { searchStore } from '$lib/components/ui/search.js';
    
    let inputRef;
    let isMac = $state(false);

    let { 
        placeholder, 
        isNullable = true, 
        classes = '' 
    } = $props();

    const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchStore.toggleActive();
            inputRef?.focus();
        }

        if (e.key === 'Escape') {
            searchStore.clear();
            inputRef?.blur();
        }
    };

    $effect(() => {
        isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    });
</script>

<div class="relative flex items-center {classes}">
    <div class="absolute left-2 text-zinc-400">
        <Search class="size-5" />
    </div>
    
    <input
        bind:this={inputRef}
        type="text"
        placeholder={placeholder}
        class="w-full py-2 pl-9 pr-8 text-sm bg-transparent border rounded-lg
               dark:border-zinc-800 border-zinc-200
               dark:focus:border-zinc-700 focus:border-zinc-300
               dark:text-zinc-100 text-zinc-900
               placeholder:text-zinc-400
               outline-none transition-all duration-200"
        value={searchStore.query}
        oninput={(e) => searchStore.setQuery(e.target.value)}
        onfocus={() => searchStore.isActive = true}
        onblur={() => !searchStore.query && (searchStore.isActive = false)}
    />
    
    {#if $searchStore.query && isNullable}
        <button
            class="absolute right-2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md
                   transition-colors duration-200"
            onclick={() => searchStore.clear()}
            aria-label="Clear search"
        >
            <X size={14} />
        </button>
    {:else}
        <div
            class="absolute right-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md text-sm
                   transition-colors duration-200 px-2 bg-zinc-200 dark:bg-zinc-800 border border-zinc-500/25"
            onclick={() => searchStore.clear()}
            aria-label="Clear search"
        >
            {isMac ? '⌘ + K' : 'Ctrl + K'}
        </div>
    {/if}
</div>
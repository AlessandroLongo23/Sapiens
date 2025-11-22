<script lang="ts">
    import { receiveSearch, GLOBAL_SEARCH_KEY, HEADER_SEARCH_HEIGHT, SEARCH_OVERLAY_OFFSET } from '$lib/animations/search-transition';
    import { searchStore } from '$lib/components/ui/search';
    import { contentTree } from '$lib/data/content-tree';
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { LayoutGrid, List } from 'lucide-svelte';

    import Searchbar from '$lib/components/ui/Searchbar.svelte';
    import SearchGridItem from '$lib/components/ui/search-results/SearchGridItem.svelte';
    import SearchListItem from '$lib/components/ui/search-results/SearchListItem.svelte';
    import ToggleButton from '$lib/components/ui/ToggleButton.svelte';

    const closeOverlay = () => {
        searchStore.deactivate();
    };

    let headerHeight = $state(HEADER_SEARCH_HEIGHT);
    let viewMode = $state<'grid' | 'list'>('grid');

    const updateHeaderHeight = () => {
        if (typeof window === 'undefined') return;
        const header = document.querySelector('header');
        if (header) {
            const rect = header.getBoundingClientRect();
            headerHeight = rect.height;
        }
    };

    onMount(() => {
        updateHeaderHeight();

        const resizeObserver = typeof ResizeObserver !== 'undefined'
            ? new ResizeObserver(() => updateHeaderHeight())
            : null;

        const header = document.querySelector('header');
        if (header && resizeObserver) {
            resizeObserver.observe(header);
        }

        window.addEventListener('resize', updateHeaderHeight);

        return () => {
            window.removeEventListener('resize', updateHeaderHeight);
            if (header && resizeObserver) {
                resizeObserver.disconnect();
            }
        };
    });

    const flattenTopics = () => {
        const results = [];
        
        for (const level of contentTree) {
            for (const subject of level.subjects) {
                for (const chapter of subject.chapters) {
                    for (const topic of chapter.topics) {
                        results.push({ topic, level, subject, chapter });
                    }
                }
            }
        }
        
        return results;
    };

    let topicsResults = $derived.by(() => {
        const query = $searchStore?.query?.toLowerCase() ?? '';
        if (!query) return [];
        
        return flattenTopics().filter(
            ({ topic }) => topic.name.toLowerCase().includes(query)
        );
    });
</script>

{#if $searchStore?.isActive}
    <!-- Backdrop with click handler to close -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="fixed inset-0 z-40 flex items-start justify-center px-4 sm:px-6 overflow-y-auto bg-zinc-50/95 dark:bg-black/90 backdrop-blur-sm"
        style={`padding-top: ${headerHeight + SEARCH_OVERLAY_OFFSET}px;`}
        transition:fade={{ duration: 200 }}
        onclick={closeOverlay}
    >
        <!-- Content container with stopPropagation -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="flex flex-col items-center gap-4 relative z-10 w-full"
            style={`height: ${HEADER_SEARCH_HEIGHT}px;`}
            in:receiveSearch={{ key: GLOBAL_SEARCH_KEY }}
            onclick={(e) => e.stopPropagation()}
        >
            <Searchbar
                placeholder="Cerca in Sapiens"
                hasKeyboardShortcut={false}
                width="w-full"
                autofocus
                size="lg"
                closeOnBlur={false}
                classes="max-w-2xl"
            />

            {#if topicsResults.length > 0}
                <div class="relative z-10 w-full max-w-4xl flex flex-col gap-4">
                    <div class="flex items-center justify-between px-1">
                        <div class="text-sm text-zinc-500 font-medium">
                            {topicsResults.length} risultati trovati
                        </div>
                        <ToggleButton
                            options={['grid', 'list']}
                            icons={[LayoutGrid, List]}
                            type="icon"
                            bind:value={viewMode}
                        />
                    </div>

                    <!-- Results List/Grid -->
                    <div class={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8' : 'flex flex-col gap-2 pb-8'}>
                        {#each topicsResults as result}
                            {#if viewMode === 'grid'}
                                <SearchGridItem {result} onclick={() => setTimeout(closeOverlay, 10)} />
                            {:else}
                                <SearchListItem {result} onclick={() => setTimeout(closeOverlay, 10)} />
                            {/if}
                        {/each}
                    </div>
                </div>  
            {:else}
                <div class="relative z-10 w-full max-w-2xl">
                    <div class="text-center text-zinc-600 dark:text-zinc-400 py-8">
                        {#if $searchStore?.query}
                            Nessun risultato trovato per "{$searchStore.query}"
                        {:else}
                            Inserisci un termine per iniziare a cercare
                        {/if}
                    </div>
                </div>
            {/if}
        </div>
    </div>
{/if}
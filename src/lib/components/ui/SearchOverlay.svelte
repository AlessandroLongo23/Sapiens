<script lang="ts">
    import { receiveSearch, GLOBAL_SEARCH_KEY, HEADER_SEARCH_HEIGHT, SEARCH_OVERLAY_OFFSET } from '$lib/animations/search-transition';
    import { searchStore, type SearchResult } from '$lib/components/ui/search';
    import { page } from '$app/state';
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { LayoutGrid, List } from 'lucide-svelte';
    import { reconstructTree, type ContentNode } from '$lib/utils/tree';
    import { nodePath, plainTitle } from '$lib/seo/slug';

    import Searchbar from '$lib/components/ui/Searchbar.svelte';
    import SearchGridItem from '$lib/components/ui/search-results/SearchGridItem.svelte';
    import SearchListItem from '$lib/components/ui/search-results/SearchListItem.svelte';
    import ToggleButton from '$lib/components/ui/ToggleButton.svelte';

    const closeOverlay = () => {
        searchStore.deactivate();
    };

    let headerHeight = $state(HEADER_SEARCH_HEIGHT);
    let viewMode = $state<'grid' | 'list'>('grid');

    // The tree comes from the page when a content route loaded it; elsewhere it
    // is fetched the first time the search opens, so marketing pages ship nothing.
    let fetchedTree = $state<ContentNode[] | null>(null);
    let loading = $state(false);
    let tree = $derived((page.data.tree as ContentNode[] | undefined) ?? fetchedTree ?? []);

    $effect(() => {
        if ($searchStore?.isActive && !page.data.tree && !fetchedTree && !loading) {
            loading = true;
            fetch('/api/node/root')
                .then((r) => (r.ok ? r.json() : []))
                .then((nodes) => { fetchedTree = reconstructTree(nodes); })
                .catch(() => { fetchedTree = []; })
                .finally(() => { loading = false; });
        }
    });

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

    let allTopics = $derived.by((): SearchResult[] => {
        const results: SearchResult[] = [];
        for (const level of tree) {
            for (const subject of level.children) {
                for (const chapter of subject.children) {
                    for (const topic of chapter.children) {
                        results.push({ topic, level, subject, chapter, href: nodePath([level, subject, chapter, topic]) });
                    }
                }
            }
        }
        return results;
    });

    let topicsResults = $derived.by(() => {
        const query = $searchStore?.query?.toLowerCase() ?? '';
        if (!query) return [];

        return allTopics.filter(({ topic, chapter }) =>
            plainTitle(topic.title).toLowerCase().includes(query) ||
            plainTitle(chapter.title).toLowerCase().includes(query)
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
                        <div class="text-sm text-zinc-500 font-medium" aria-live="polite">
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
                        {#each topicsResults as result (result.topic.id)}
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
                    <div class="text-center text-zinc-600 dark:text-zinc-400 py-8" aria-live="polite">
                        {#if loading}
                            Caricamento del catalogo…
                        {:else if $searchStore?.query}
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

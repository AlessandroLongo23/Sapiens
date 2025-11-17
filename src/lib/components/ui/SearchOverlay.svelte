<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    import Searchbar from '$lib/components/ui/Searchbar.svelte';
    import { receiveSearch, GLOBAL_SEARCH_KEY, HEADER_SEARCH_HEIGHT, SEARCH_OVERLAY_OFFSET } from '$lib/animations/search-transition';
    import { searchStore } from '$lib/components/ui/search';

    const closeOverlay = () => {
        searchStore.deactivate();
    };

    let headerHeight = $state(HEADER_SEARCH_HEIGHT);

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
</script>

{#if $searchStore?.isActive}
    <div
        class="fixed inset-0 z-40 flex items-start justify-center px-4 sm:px-6"
        style={`padding-top: ${headerHeight + SEARCH_OVERLAY_OFFSET}px;`}
        transition:fade={{ duration: 200 }}
    >
        <button
            class="absolute inset-0"
            type="button"
            onclick={closeOverlay}
            aria-label="Chiudi ricerca"
        ></button>

        <div
            class="relative z-10 w-full max-w-2xl"
            style={`height: ${HEADER_SEARCH_HEIGHT}px;`}
            in:receiveSearch={{ key: GLOBAL_SEARCH_KEY }}
        >
            <Searchbar
                placeholder="Cerca in Sapiens"
                hasKeyboardShortcut={false}
                width="w-full"
                autofocus
                size="lg"
            />
        </div>
    </div>
{/if}
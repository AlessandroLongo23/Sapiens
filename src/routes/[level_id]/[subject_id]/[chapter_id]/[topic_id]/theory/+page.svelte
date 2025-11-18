<script lang="ts">
    import { goto } from '$app/navigation';
    import { PenLine } from 'lucide-svelte';
    import { page } from '$app/state';

    import TheoryContent from '$lib/components/students/markdown/TheoryContent.svelte';

    let { data } = $props();
    let { content, sections, error, title } = $derived(data);
    
    let activeTheorySection = $state('');

    const handleActiveSectionChange = (e: CustomEvent<{ sectionId: string }>) => {
        activeTheorySection = e.detail.sectionId;
    };

    let exercisePath = $derived(page.url.pathname.replace('/theory', '/exercises'));
</script>

<svelte:head>
    <title>{title || 'Teoria'}</title>
</svelte:head>

{#if error}
    <div class="flex justify-center items-center h-full text-red-500">
        <p>Errore: {error}</p>
    </div>
{:else if data.content}
    <div class="flex flex-col gap-4 w-full justify-center items-center mx-auto bg-zinc-50">
        {#if content}
            <TheoryContent
                {content}
                on:sectionActive={handleActiveSectionChange}
            />
        {:else}
            <div class="w-full h-full flex items-center justify-center">
                <div class="text-zinc-400 p-4 text-center">
                    <p>Nessun contenuto disponibile</p>
                </div>
            </div>
        {/if}

        <button
            onclick={() => goto(exercisePath)}
            class="flex items-center justify-center space-x-2 sm:space-x-3 btn-primary text-white px-6 sm:px-10 py-4 sm:py-5 rounded-2xl font-semibold text-base sm:text-lg shadow-elegant-lg group cursor-pointer mt-8 mb-32"
        >
            <PenLine
                class="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300"
            />
            <span>Vai agli esercizi</span>
        </button>
    </div>
{:else}
    <div class="flex justify-center items-center h-full bg-zinc-50">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
    </div>
{/if}

<script>
    import { goto } from '$app/navigation';
    import * as ls from 'lucide-svelte';
    import { page } from '$app/stores';

    import TheoryContent from '$lib/components/markdown/TheoryContent.svelte';

    let { data } = $props();
    let { content, sections, error, title } = $derived(data);

    let targetTheorySection = $state('');
    let activeTheorySection = $state('');

    const handleSectionSelect = (sectionId) => {
        targetTheorySection = sectionId;
    };
    
    const handleActiveSectionChange = (e) => {
        activeTheorySection = e.detail.sectionId;
    };

    let exercisePath = $derived($page.url.pathname.replace('/teoria/', '/esercizi/'));
</script>

<svelte:head>
    <title>{title || 'Teoria'}</title>
</svelte:head>

{#if data.error}
    <div class="flex justify-center items-center h-full bg-zinc-50 text-red-500">
        <p>Errore: {data.error}</p>
    </div>
{:else if data.content}
    <div class="flex flex-col gap-4 w-full justify-center items-center">
        <TheoryContent 
            content={data.content}
            sections={data.sections}
            targetSection={targetTheorySection} 
            on:activeSection={handleActiveSectionChange}
        />

        <button
            onclick={() => goto(exercisePath)}
            class="btn-primary text-white px-6 sm:px-10 py-4 sm:py-5 rounded-2xl font-semibold text-base sm:text-lg shadow-elegant-lg group cursor-pointer"
        >
            <span class="flex items-center justify-center space-x-2 sm:space-x-3">
                <ls.PenLine
                    class="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300"
                />
            <span>Vai agli esercizi</span>
            </span>
        </button>
    </div>
{:else}
    <div class="flex justify-center items-center h-full bg-zinc-50">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
{/if}
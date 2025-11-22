<script lang="ts">
    import { FileText, Clock } from 'lucide-svelte';

    import TheoryContent from '$lib/components/students/markdown/TheoryContent.svelte';
    import TheorySidebar from '$lib/components/students/markdown/TheorySidebar.svelte';
    import SidebarPortal from '$lib/components/layout/SidebarPortal.svelte';
    import { layoutState } from '$lib/state/layout.svelte.js';

    let { data } = $props();
    let { 
        content, 
        sections, 
        error, 
        title 
    } = $derived(data);
    
    let activeTheorySection = $state('');
    let targetSection = $state('');
    let isScrolled = $derived(layoutState.scrollY > 20);

    let textContent = $derived(content ? content.replace(/<[^>]*>/g, '') : '');
    let wordCount = $derived(textContent.split(/\s+/).length);
    let readingTime = $derived(Math.max(1, Math.ceil(wordCount / 50)));
    let pagesCount = $derived(Math.max(1, Math.ceil(wordCount / 120)));

    const handleActiveSectionChange = (e: CustomEvent<{ sectionId: string }>) => {
        activeTheorySection = e.detail.sectionId;
    };

    const handleSidebarSectionSelect = (e: CustomEvent<{ sectionId: string }>) => {
        targetSection = e.detail.sectionId;
    };
</script>

<svelte:head>
    <title>{title || 'Teoria'} | Sapiens</title>
</svelte:head>

<SidebarPortal side="left">
    <div class="mb-4 px-1">
        <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Indice</span>
    </div>
    <TheorySidebar 
        {sections} 
        activeSection={activeTheorySection} 
        on:sectionSelect={handleSidebarSectionSelect}
    />
</SidebarPortal>

{#if error}
    <div class="flex justify-center items-center h-full text-red-500 py-20">
        <div class="text-center">
            <h2 class="text-xl font-bold mb-2">Si è verificato un errore</h2>
            <p class="text-zinc-600">{error}</p>
        </div>
    </div>
{:else}
    <div class="px-6 md:px-10 pt-0 pb-8">
        <div class="overflow-hidden transition-all duration-300 ease-in-out {isScrolled ? 'h-0 opacity-0 mt-0' : 'h-auto opacity-100 mt-2'}">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-sm text-zinc-500">
                <div class="flex items-center gap-3">
                    <div class="flex items-center gap-2">
                        <FileText class="size-4" />
                        <span class="font-medium text-zinc-900 dark:text-zinc-100">{pagesCount} {pagesCount == 1 ? 'pagina' : 'pagine'}</span>
                    </div>
                    <span class="size-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                    <div class="flex items-center gap-2">
                        <Clock class="size-4" />
                        <span class="font-medium text-zinc-900 dark:text-zinc-100">{readingTime} min lettura</span>
                    </div>
                </div>
                
                <div class="flex items-center gap-2">
                    <span class="text-zinc-400">Prerequisiti:</span>
                    <span class="px-2 py-0.5 bg-zinc-50 border border-zinc-200 rounded text-xs font-medium text-zinc-600">
                        Algebra di base
                    </span>
                </div>
            </div>
        </div>

        {#if content}
            <div class="prose prose-zinc max-w-none prose-headings:font-bold prose-headings:text-zinc-900 prose-p:text-zinc-700 prose-a:text-blue-600 prose-img:rounded-xl">
                <TheoryContent 
                    {content}
                    {targetSection}
                    on:activeSection={handleActiveSectionChange}
                />
            </div>
        {:else}
             <div class="flex flex-col items-center justify-center py-20 text-zinc-400">
                <p>Nessun contenuto disponibile</p>
            </div>
        {/if}
    </div>
{/if}

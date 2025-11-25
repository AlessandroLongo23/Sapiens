<script lang="ts">
    import { FileText, Clock } from 'lucide-svelte';
    import { layoutState } from '$lib/state/layout.svelte.js';

    import TheoryContent from '$lib/components/content/markdown/TheoryContent.svelte';
    import TheorySidebar from '$lib/components/content/markdown/TheorySidebar.svelte';
    import SidebarPortal from '$lib/components/content/SidebarPortal.svelte';
    import ContentComingSoon from '$lib/components/content/ContentComingSoon.svelte';
    import NavigationButtons from '$lib/components/content/NavigationButtons.svelte';

    let { data } = $props();
    let { 
        content, 
        sections, 
        error, 
        title,
        navigation
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

    let prerequisites = $state([
        'Algebra',
        'Geometria',
        'Trigonometria',
        'Analisi',
    ])
</script>

<svelte:head>
    <title>{title || 'Teoria'} | Sapiens</title>
</svelte:head>

<SidebarPortal side="left">
    <TheorySidebar 
        {sections} 
        activeSection={activeTheorySection} 
        on:sectionSelect={handleSidebarSectionSelect}
    />
</SidebarPortal>

{#if error}
    <ContentComingSoon type="theory" navigation={navigation} />
{:else}
    <div class="px-6 md:px-10 pt-0 pb-8">
        <div class="overflow-hidden transition-all duration-300 ease-in-out {isScrolled ? 'h-0 opacity-0 mt-0' : 'h-auto opacity-100 mt-2'}">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 text-sm text-zinc-500">
                <div class="flex items-center gap-2">
                    <span>Prerequisiti:</span>
                    {#each prerequisites as prerequisite}
                        <span class="px-2 py-0.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-500/25 rounded-full text-xs font-medium text-zinc-600 dark:text-zinc-400">
                            {prerequisite}
                        </span>
                    {/each}
                </div>

                <div class="flex items-center gap-3">
                    <div class="flex items-center gap-2">
                        <FileText class="size-4" />
                        <span class="font-medium text-zinc-900 dark:text-zinc-100">{pagesCount} {pagesCount == 1 ? 'pagina' : 'pagine'}</span>
                    </div>
                    <span class="size-1 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>
                    <div class="flex items-center gap-2">
                        <Clock class="size-4" />
                        <span class="font-medium text-zinc-900 dark:text-zinc-100">{readingTime} min lettura</span>
                    </div>
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
<NavigationButtons navigation={navigation} />

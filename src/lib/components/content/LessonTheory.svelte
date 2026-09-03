<script lang="ts">
    import { FileText, Clock } from 'lucide-svelte';
    import { layoutState } from '$lib/state/layout.svelte.js';
    import type { ContentSection } from '$lib/utils/markdown.svelte.js';
    import type { LessonNavigation } from '$lib/utils/lesson-navigation';

    import TopicContent from '$lib/components/content/markdown/TopicContent.svelte';
    import TopicSidebar from '$lib/components/content/markdown/TopicSidebar.svelte';
    import SidebarPortal from '$lib/components/content/SidebarPortal.svelte';
    import ContentComingSoon from '$lib/components/content/ContentComingSoon.svelte';
    import NavigationButtons from '$lib/components/content/NavigationButtons.svelte';
    import AISidebar from '$lib/components/content/AISidebar.svelte';

    interface Props {
        content: string | null;
        sections: ContentSection[];
        navigation: LessonNavigation | null;
        /** 'theory' or 'formulary': decides the empty state and whether the AI sidebar shows. */
        kind?: 'theory' | 'formulary';
        backUrl: string;
        theoryUrl: string;
    }

    let { content, sections, navigation, kind = 'theory', backUrl, theoryUrl }: Props = $props();

    let activeSection = $state('');
    let targetSection = $state('');
    let isScrolled = $derived(layoutState.scrollY > 20);

    let textContent = $derived(content ? content.replace(/<[^>]*>/g, '') : '');
    let wordCount = $derived(textContent.split(/\s+/).filter(Boolean).length);
    let readingTime = $derived(Math.max(1, Math.ceil(wordCount / 50)));
    let pagesCount = $derived(Math.max(1, Math.ceil(wordCount / 120)));

    const handleActiveSectionChange = (e: CustomEvent<{ sectionId: string }>) => {
        activeSection = e.detail.sectionId;
    };

    const handleSidebarSectionSelect = (e: CustomEvent<{ sectionId: string }>) => {
        targetSection = e.detail.sectionId;
    };
</script>

<SidebarPortal side="left">
    <TopicSidebar
        {sections}
        {activeSection}
        on:sectionSelect={handleSidebarSectionSelect}
    />
</SidebarPortal>

{#if kind === 'theory'}
    <SidebarPortal side="right">
        <AISidebar />
    </SidebarPortal>
{/if}

{#if !content}
    <ContentComingSoon type={kind} {navigation} chapterUrl={backUrl} {theoryUrl} />
{:else}
    <div class="px-6 md:px-10 pt-0 pb-8">
        <div class="overflow-hidden transition-all duration-300 ease-in-out {isScrolled ? 'h-0 opacity-0 mt-0' : 'h-auto opacity-100 mt-2'}">
            <div class="flex items-center justify-end gap-3 text-sm text-zinc-500">
                <div class="flex items-center gap-2">
                    <FileText class="size-4" aria-hidden="true" />
                    <span class="font-medium text-zinc-900 dark:text-zinc-100">{pagesCount} {pagesCount == 1 ? 'pagina' : 'pagine'}</span>
                </div>
                <span class="size-1 rounded-full bg-zinc-300 dark:bg-zinc-600" aria-hidden="true"></span>
                <div class="flex items-center gap-2">
                    <Clock class="size-4" aria-hidden="true" />
                    <span class="font-medium text-zinc-900 dark:text-zinc-100">{readingTime} min lettura</span>
                </div>
            </div>
        </div>

        <div class="prose prose-zinc max-w-none prose-headings:font-bold prose-headings:text-zinc-900 prose-p:text-zinc-700 prose-a:text-blue-600 prose-img:rounded-xl">
            <TopicContent
                {content}
                {targetSection}
                on:activeSection={handleActiveSectionChange}
            />
        </div>
    </div>
    <NavigationButtons {navigation} />
{/if}

<script lang="ts">
    import { FileText, Clock, UsersRound, ArrowRight, ListTree, ChevronDown } from 'lucide-svelte';
    import { layoutState } from '$lib/state/layout.svelte.js';
    import { media } from '$lib/state/media.svelte';
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
        /** Link to the tutors who teach this subject and level; nothing is shown when null. */
        tutorHref?: string | null;
    }

    let { content, sections, navigation, kind = 'theory', backUrl, theoryUrl, tutorHref = null }: Props = $props();

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
    {#if kind === 'theory' && tutorHref}
        <aside class="mx-4 sm:mx-6 md:mx-10 rounded-2xl border border-zinc-500/25 bg-white dark:bg-zinc-900 p-5 flex flex-col sm:flex-row sm:items-center gap-4" aria-labelledby="tutor-cta">
            <span class="flex items-center justify-center size-11 shrink-0 rounded-xl bg-crimson-50 dark:bg-crimson-900/30 text-crimson-600 dark:text-crimson-300">
                <UsersRound class="size-5" aria-hidden="true" />
            </span>
            <div class="flex-1">
                <h2 id="tutor-cta" class="text-base font-semibold text-zinc-900 dark:text-zinc-100">Non ti torna qualcosa?</h2>
                <p class="text-sm text-zinc-600 dark:text-zinc-400">Un tutor di questa materia può spiegartelo in una lezione, online o vicino a te. Nessuna commissione sulle lezioni.</p>
            </div>
            <a href={tutorHref} class="inline-flex min-h-[44px] items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-700 active:bg-crimson-700 text-white text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900">
                Chiedi aiuto a un tutor
                <ArrowRight class="size-4" aria-hidden="true" />
            </a>
        </aside>
    {/if}
    <NavigationButtons {navigation} />
{/if}

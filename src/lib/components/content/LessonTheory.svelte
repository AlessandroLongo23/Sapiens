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
    import Sheet from '$lib/components/ui/Sheet.svelte';
    import Latex from '$lib/components/ui/Latex.svelte';

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

    // The layout's header shows the "Indice" button while this page has sections.
    $effect(() => {
        layoutState.hasToc = !!content && sections.length > 0;
        return () => {
            layoutState.hasToc = false;
            layoutState.tocOpen = false;
        };
    });

    const handleActiveSectionChange = (e: CustomEvent<{ sectionId: string }>) => {
        activeSection = e.detail.sectionId;
    };

    const handleSidebarSectionSelect = (e: CustomEvent<{ sectionId: string }>) => {
        targetSection = e.detail.sectionId;
    };

    // From the sheet (phones): jump, then close.
    const handleSheetSectionSelect = (e: CustomEvent<{ sectionId: string }>) => {
        targetSection = e.detail.sectionId;
        layoutState.tocOpen = false;
    };

    let sectionCount = $derived(
        sections.reduce((n, s) => n + 1 + (s.subsections?.length ?? 0), 0)
    );
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

{#if !media.lg}
    <Sheet open={layoutState.tocOpen} onClose={() => (layoutState.tocOpen = false)} title="Indice della lezione" size="auto">
        <TopicSidebar
            {sections}
            {activeSection}
            touch
            on:sectionSelect={handleSheetSectionSelect}
        />
    </Sheet>
{/if}

{#if !content}
    <ContentComingSoon type={kind} {navigation} chapterUrl={backUrl} {theoryUrl} />
{:else}
    <div class="px-4 sm:px-6 md:px-10 pt-0 pb-8">
        <div class="overflow-hidden transition-all duration-300 ease-in-out {isScrolled ? 'lg:h-0 lg:opacity-0 lg:mt-0' : ''} h-auto opacity-100 mt-2">
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

        {#if sections.length > 0}
            <!-- Phones and tablets: the outline at the top of the text, collapsed. -->
            <details class="lg:hidden group mt-4 rounded-2xl border border-zinc-500/20 bg-zinc-50 dark:bg-zinc-800/60">
                <summary class="flex min-h-[48px] cursor-pointer list-none items-center gap-3 px-4 text-sm font-semibold text-zinc-800 dark:text-zinc-100 [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 rounded-2xl">
                    <ListTree class="size-5 text-crimson-600 dark:text-crimson-400" aria-hidden="true" />
                    <span class="flex-1">In questa lezione: {sectionCount} {sectionCount === 1 ? 'sezione' : 'sezioni'}</span>
                    <ChevronDown class="size-5 text-zinc-400 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <ol class="border-t border-zinc-500/15 px-2 py-2">
                    {#each sections as section (section.id)}
                        <li>
                            <button
                                type="button"
                                onclick={() => (targetSection = section.id)}
                                class="flex min-h-[44px] w-full items-center rounded-xl px-3 text-left text-base text-zinc-700 hover:bg-white active:bg-white dark:text-zinc-200 dark:hover:bg-zinc-800 dark:active:bg-zinc-800"
                            >
                                <Latex content={section.title} />
                            </button>
                            {#if section.subsections?.length}
                                <ol class="ml-4 border-l border-zinc-500/20 pl-1">
                                    {#each section.subsections as sub (sub.id)}
                                        <li>
                                            <button
                                                type="button"
                                                onclick={() => (targetSection = sub.id)}
                                                class="flex min-h-[40px] w-full items-center rounded-xl px-3 text-left text-sm text-zinc-600 hover:bg-white active:bg-white dark:text-zinc-300 dark:hover:bg-zinc-800 dark:active:bg-zinc-800"
                                            >
                                                <Latex content={sub.title} />
                                            </button>
                                        </li>
                                    {/each}
                                </ol>
                            {/if}
                        </li>
                    {/each}
                </ol>
            </details>
        {/if}

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

<script lang="ts">
    import { page } from '$app/state';
    import { afterNavigate } from '$app/navigation';
    import { Book, PenLine, Sigma, Zap, ArrowLeft, ListTree, Sparkles } from 'lucide-svelte';
    import { layoutState } from '$lib/state/layout.svelte.js';
    import { aiSidebar } from '$lib/state/ai-sidebar.svelte.js';
    import { media } from '$lib/state/media.svelte';
    import { plainTitle, nodePath } from '$lib/seo/slug';
    import { breadcrumbJsonLd } from '$lib/seo/jsonld';
    import { CONTENT_ROOT } from '$lib/config/site';

    import Latex from '$lib/components/ui/Latex.svelte';
    import JsonLd from '$lib/components/seo/JsonLd.svelte';
    import Sheet from '$lib/components/ui/Sheet.svelte';
    import AISidebar from '$lib/components/content/AISidebar.svelte';

    let { data, children } = $props();
    let { node, ancestors, paths, parentLink } = $derived(data);

    let isScrolled = $derived(layoutState.scrollY > 20);

    function isActive(path: string) {
        return page.url.pathname === path;
    }

    // The lesson scrolls inside this element. Its position drives the header
    // (compact once scrolled) and the reading progress bar on phones.
    let scroller = $state<HTMLElement | null>(null);

    function onScroll(event: Event) {
        const el = event.currentTarget as HTMLElement;
        layoutState.scrollY = el.scrollTop;
        const range = el.scrollHeight - el.clientHeight;
        layoutState.scrollProgress = range > 0 ? Math.min(1, el.scrollTop / range) : 0;
    }

    afterNavigate(({ type, from, to }) => {
        const samePage = from?.url.pathname === to?.url.pathname;
        if (type !== 'popstate' && !samePage && scroller) scroller.scrollTop = 0;
        layoutState.tocOpen = false;
    });

    // Lesson pages have no visual trail (the header shows the way back), but
    // the breadcrumb structured data is emitted so results show the path.
    let lessonBreadcrumb = $derived(
        breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Materiale didattico', path: CONTENT_ROOT },
            ...ancestors.map((n, i) => ({
                name: n.title,
                path: nodePath(ancestors.slice(0, i + 1))
            }))
        ])
    );

    const sections = $derived([
        { href: paths.theory, label: 'Teoria', icon: Book },
        { href: paths.exercises, label: 'Esercizi', icon: PenLine },
        { href: paths.formulary, label: 'Formulario', icon: Sigma },
        { href: paths.flashcards, label: 'Flashcards', icon: Zap }
    ]);

    const getLinkClass = (active: boolean) =>
        `flex items-center justify-center size-10 rounded-xl transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 ${active
            ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-500/25 text-white dark:text-zinc-900 shadow-md scale-105'
            : 'bg-white dark:bg-zinc-900 border-zinc-500/25 text-zinc-500 dark:text-zinc-400 hover:border-zinc-500/50 hover:text-zinc-900 dark:hover:text-zinc-100 hover:shadow-sm'}`;

    const tabClass = (active: boolean) =>
        `flex h-full w-full flex-col items-center justify-center gap-1 text-[11px] font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-crimson-500 active:bg-zinc-100 dark:active:bg-zinc-800 ${active
            ? 'text-crimson-600 dark:text-crimson-400'
            : 'text-zinc-500 dark:text-zinc-400'}`;

    // Below `lg` the assistant opens in a sheet, driven by the same store the
    // desktop column uses; the column itself is only mounted from `lg` up, so
    // exactly one chat is alive at a time.
    let aiSheetOpen = $derived(!media.lg && aiSidebar.isOpen);
</script>

<JsonLd data={lessonBreadcrumb} />

<div class="relative flex w-full justify-center h-dvh md:h-[calc(100dvh-3.75rem)] overflow-hidden font-sans text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-900">
    <aside class="hidden lg:flex lg:flex-col absolute inset-y-0 left-0 w-1/4 overflow-y-auto py-6 px-4" aria-label="Indice della lezione">
        {#if media.lg && layoutState.leftSidebar}
            {@render layoutState.leftSidebar()}
        {/if}
    </aside>

    <div
        bind:this={scroller}
        class="relative flex flex-col justify-between lg:mx-[calc(1/4*100%)] w-full h-full overflow-y-scroll overscroll-contain no-scrollbar pb-tabbar lg:pb-0"
        onscroll={onScroll}
    >
        <header class="sticky top-0 z-20 transition-all duration-300">
            <div class="flex flex-row items-center justify-between gap-1 lg:gap-4 px-2 lg:px-10 bg-white dark:bg-zinc-900 transition-all duration-300 min-h-[56px] lg:min-h-0 {isScrolled ? 'lg:py-3' : 'lg:py-8'}">
                <div class="flex items-center gap-1 lg:gap-3 flex-1 min-w-0">
                    <a href={parentLink.url}
                        class="flex items-center justify-center size-[44px] shrink-0 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 active:bg-zinc-100 dark:text-zinc-300 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 dark:active:bg-zinc-800 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500"
                        title="Torna a {plainTitle(parentLink.label)}"
                        aria-label="Torna a {plainTitle(parentLink.label)}"
                    >
                        <ArrowLeft class="size-6 lg:size-5" aria-hidden="true" />
                    </a>
                    <h1 class="font-bold text-zinc-900 dark:text-zinc-100 leading-tight transition-all duration-300 origin-left text-lg {isScrolled ? 'lg:text-xl' : 'lg:text-3xl'} truncate">
                        <Latex content={node.title} />
                    </h1>
                </div>

                {#if layoutState.hasToc}
                    <button
                        type="button"
                        onclick={() => (layoutState.tocOpen = true)}
                        class="lg:hidden flex items-center justify-center size-[44px] shrink-0 rounded-xl text-zinc-600 hover:bg-zinc-100 active:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:active:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500"
                        aria-label="Indice della lezione"
                        aria-haspopup="dialog"
                        aria-expanded={layoutState.tocOpen}
                    >
                        <ListTree class="size-6" aria-hidden="true" />
                    </button>
                {/if}

                <nav class="hidden lg:flex items-center gap-2 shrink-0 transition-all duration-300 {isScrolled ? 'scale-90' : ''}" aria-label="Sezioni della lezione">
                    {#each sections as section (section.href)}
                        {@const Icon = section.icon}
                        <a href={section.href} class={getLinkClass(isActive(section.href))} title={section.label} aria-label={section.label} aria-current={isActive(section.href) ? 'page' : undefined}>
                            <Icon size={18} strokeWidth={2.5} aria-hidden="true" />
                        </a>
                    {/each}
                </nav>
            </div>

            <!-- Reading progress (phones and tablets). -->
            <div
                class="lg:hidden h-0.5 bg-zinc-200/80 dark:bg-zinc-800"
                role="progressbar"
                aria-label="Avanzamento della lettura"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={Math.round(layoutState.scrollProgress * 100)}
            >
                <div class="h-full bg-crimson-500 transition-[width] duration-150 ease-out" style="width: {Math.round(layoutState.scrollProgress * 100)}%"></div>
            </div>

            {#if isScrolled}
                <div class="hidden lg:block relative w-full h-8 bg-gradient-to-b from-white to-transparent dark:from-zinc-900 dark:to-transparent"></div>
            {/if}
        </header>

        <div class="flex-1 flex flex-col">
            <div class="flex-1">
                {@render children()}
            </div>
        </div>
    </div>

    <aside class="hidden lg:flex lg:flex-col absolute inset-y-0 right-0 w-1/4 overflow-y-auto py-6 px-4" aria-label="Assistente">
        {#if media.lg && layoutState.rightSidebar}
            {@render layoutState.rightSidebar()}
        {/if}
    </aside>

    <!-- Phones and tablets: the lesson's sections and the assistant, in the thumb zone. -->
    <nav
        aria-label="Sezioni"
        class="lg:hidden fixed inset-x-0 bottom-0 z-30 border-t border-zinc-500/20 bg-white dark:bg-zinc-900 pb-safe"
    >
        <ul class="grid grid-cols-5 h-[var(--tabbar-h)]">
            {#each sections as section (section.href)}
                {@const Icon = section.icon}
                {@const active = isActive(section.href)}
                <li>
                    <a href={section.href} aria-current={active ? 'page' : undefined} class={tabClass(active)}>
                        <Icon class="size-6" strokeWidth={active ? 2.4 : 1.8} aria-hidden="true" />
                        <span>{section.label}</span>
                    </a>
                </li>
            {/each}
            <li>
                <button
                    type="button"
                    onclick={() => aiSidebar.open()}
                    class="flex h-full w-full flex-col items-center justify-center gap-1 text-[11px] font-semibold leading-none text-crimson-600 dark:text-crimson-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-crimson-500 active:bg-crimson-50 dark:active:bg-crimson-900/20"
                    aria-label="Chiedi a Sapiens AI"
                    aria-haspopup="dialog"
                    aria-expanded={aiSheetOpen}
                >
                    <span class="flex size-7 items-center justify-center rounded-full bg-crimson-600 text-white shadow-sm shadow-crimson-500/30" aria-hidden="true">
                        <Sparkles class="size-4" />
                    </span>
                    <span>Chiedi</span>
                </button>
            </li>
        </ul>
    </nav>
</div>

{#if !media.lg}
    <Sheet open={aiSheetOpen} onClose={() => aiSidebar.close()} title="Sapiens AI" hideTitle size="full" bodyClass="flex flex-col">
        <AISidebar onClose={() => aiSidebar.close()} />
    </Sheet>
{/if}

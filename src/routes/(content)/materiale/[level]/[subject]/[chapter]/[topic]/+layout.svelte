<script lang="ts">
    import { page } from '$app/state';
    import { Book, PenLine, Sigma, Zap, ArrowLeft } from 'lucide-svelte';
    import { layoutState } from '$lib/state/layout.svelte.js';
    import { plainTitle, nodePath } from '$lib/seo/slug';
    import { breadcrumbJsonLd } from '$lib/seo/jsonld';
    import { CONTENT_ROOT } from '$lib/config/site';

    import Latex from '$lib/components/ui/Latex.svelte';
    import JsonLd from '$lib/components/seo/JsonLd.svelte';

    let { data, children } = $props();
    let { node, ancestors, paths, parentLink } = $derived(data);

    let isScrolled = $derived(layoutState.scrollY > 20);

    function isActive(path: string) {
        return page.url.pathname === path;
    }

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

    const getLinkClass = (active: boolean) =>
        `flex items-center justify-center size-10 rounded-xl transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 ${active
            ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-500/25 text-white dark:text-zinc-900 shadow-md scale-105'
            : 'bg-white dark:bg-zinc-900 border-zinc-500/25 text-zinc-500 dark:text-zinc-400 hover:border-zinc-500/50 hover:text-zinc-900 dark:hover:text-zinc-100 hover:shadow-sm'}`;
</script>

<JsonLd data={lessonBreadcrumb} />

<div class="relative flex w-full justify-center h-[calc(100vh-4.5rem)] overflow-hidden font-sans text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-900">
    <aside class="hidden lg:block fixed left-0 w-1/4 h-full py-6 px-4" aria-label="Indice della lezione">
        {#if layoutState.leftSidebar}
            {@render layoutState.leftSidebar()}
        {/if}
    </aside>

    <div
        class="relative flex flex-col justify-between lg:mx-[calc(1/4*100%)] w-full h-full overflow-y-scroll no-scrollbar"
        onscroll={(e) => layoutState.scrollY = e.currentTarget.scrollTop}
    >
        <header class="sticky top-0 z-20 transition-all duration-300">
            <div class="flex flex-row items-center justify-between gap-4 px-6 md:px-10 bg-white dark:bg-zinc-900 transition-all duration-300 {isScrolled ? 'py-3' : 'py-8'}">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                    <a href={parentLink.url}
                        class="flex items-center justify-center size-11 shrink-0 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500"
                        title="Torna a {plainTitle(parentLink.label)}"
                        aria-label="Torna a {plainTitle(parentLink.label)}"
                    >
                        <ArrowLeft class="size-5" aria-hidden="true" />
                    </a>
                    <h1 class="font-bold text-zinc-900 dark:text-zinc-100 leading-tight transition-all duration-300 origin-left {isScrolled ? 'text-xl' : 'text-3xl'} truncate">
                        <Latex content={node.title} />
                    </h1>
                </div>

                <nav class="flex items-center gap-2 shrink-0 transition-all duration-300 {isScrolled ? 'scale-90' : ''}" aria-label="Sezioni della lezione">
                    <a href={paths.theory} class={getLinkClass(isActive(paths.theory))} title="Teoria" aria-label="Teoria" aria-current={isActive(paths.theory) ? 'page' : undefined}>
                        <Book size={18} strokeWidth={2.5} aria-hidden="true" />
                    </a>
                    <a href={paths.exercises} class={getLinkClass(isActive(paths.exercises))} title="Esercizi" aria-label="Esercizi" aria-current={isActive(paths.exercises) ? 'page' : undefined}>
                        <PenLine size={18} strokeWidth={2.5} aria-hidden="true" />
                    </a>
                    <a href={paths.formulary} class={getLinkClass(isActive(paths.formulary))} title="Formulario" aria-label="Formulario" aria-current={isActive(paths.formulary) ? 'page' : undefined}>
                        <Sigma size={18} strokeWidth={2.5} aria-hidden="true" />
                    </a>
                    <a href={paths.flashcards} class={getLinkClass(isActive(paths.flashcards))} title="Flashcards" aria-label="Flashcards" aria-current={isActive(paths.flashcards) ? 'page' : undefined}>
                        <Zap size={18} strokeWidth={2.5} aria-hidden="true" />
                    </a>
                </nav>
            </div>

            {#if isScrolled}
                <div class="relative w-full h-8 bg-gradient-to-b from-white to-transparent dark:from-zinc-900 dark:to-transparent"></div>
            {/if}
        </header>

        <div class="flex-1 flex flex-col">
            <div class="flex-1">
                {@render children()}
            </div>
        </div>
    </div>

    <aside class="hidden lg:block fixed right-0 w-1/4 h-full overflow-y-auto py-6 px-4" aria-label="Assistente">
        {#if layoutState.rightSidebar}
            {@render layoutState.rightSidebar()}
        {/if}
    </aside>
</div>

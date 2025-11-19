<script lang="ts">
    import { page } from '$app/state';
    import { Book, PenLine, Sigma, Zap } from 'lucide-svelte';
    import { layoutState } from '$lib/state/layout.svelte.js';
    
    import Latex from '$lib/components/ui/Latex.svelte';

    let { data, children } = $props();
    let { title } = $derived(data);
    
    let scrollY = $state(0);
    let isScrolled = $derived(scrollY > 20);

    // Navigation paths
    let basePath = $derived(page.url.pathname.split('/').slice(0, 6).join('/')); // Get base topic path
    let theoryPath = $derived(`${basePath}/theory`);
    let exercisesPath = $derived(`${basePath}/exercises`);
    let formularyPath = $derived(`${basePath}/formulary`);
    let flashcardsPath = $derived(`${basePath}/flashcards`);

    // Helper to check active path
    function isActive(path: string) {
        return page.url.pathname.includes(path);
    }

    const getLinkClass = (active: boolean) => 
        `flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 border ${active 
            ? 'bg-zinc-900 border-zinc-900 text-white shadow-md scale-105' 
            : 'bg-white border-zinc-200 text-zinc-400 hover:border-zinc-300 hover:text-zinc-900 hover:shadow-sm'}`;
</script>

<svelte:window bind:scrollY />

<div class="relative flex w-full justify-center h-[calc(100vh-4.5rem)] overflow-hidden bg-zinc-50 font-sans text-zinc-900">
    <aside class="hidden lg:block fixed left-0 w-92 h-full border-r border-zinc-200 bg-zinc-50/50 py-6 px-4">
        {#if layoutState.leftSidebar}
            {@render layoutState.leftSidebar()}
        {/if}
    </aside>

    <div class="mx-92 min-w-0 overflow-y-scroll no-scrollbar border-r border-zinc-200/50 bg-white">
        <header class="relative bg-white/95 backdrop-blur-md transition-all duration-300">
            <div class="px-6 md:px-10 transition-all duration-300"
                class:py-3={isScrolled}
                class:py-8={!isScrolled}
            >
                <div class="flex flex-col gap-4">
                    <div class="flex items-start justify-between gap-4">
                        <h1 class="font-bold text-zinc-900 leading-tight transition-all duration-300 origin-left"
                            class:text-xl={isScrolled}
                            class:text-3xl={!isScrolled}
                        >
                            <Latex content={title} />
                        </h1>

                        <div class="flex items-center gap-2 shrink-0 transition-all duration-300"
                             class:scale-90={isScrolled}
                        >
                            <a href={theoryPath} class={getLinkClass(isActive('theory'))} title="Teoria">
                                <Book size={18} strokeWidth={2.5} />
                            </a>
                            <a href={exercisesPath} class={getLinkClass(isActive('exercises'))} title="Esercizi">
                                <PenLine size={18} strokeWidth={2.5} />
                            </a>
                            <a href={formularyPath} class={getLinkClass(isActive('formulary'))} title="Formulario">
                                <Sigma size={18} strokeWidth={2.5} />
                            </a>
                            <a href={flashcardsPath} class={getLinkClass(isActive('flashcards'))} title="Flashcards">
                                <Zap size={18} strokeWidth={2.5} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <main class="min-h-[calc(100vh-12rem)]">
            {@render children()}
        </main>
    </div>

    <aside class="hidden lg:block fixed right-0 w-92 h-full border-l border-zinc-200 bg-zinc-50/50 overflow-y-auto py-6 px-4">
        {#if layoutState.rightSidebar}
            {@render layoutState.rightSidebar()}
        {/if}
    </aside>
</div>


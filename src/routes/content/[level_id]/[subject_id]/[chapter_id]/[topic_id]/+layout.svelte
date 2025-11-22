<script lang="ts">
    import { page } from '$app/state';
    import { Book, PenLine, Sigma, Zap } from 'lucide-svelte';
    import { layoutState } from '$lib/state/layout.svelte.js';
    
    import Latex from '$lib/components/ui/Latex.svelte';

    let { data, children } = $props();
    let { title } = $derived(data);
    
    let isScrolled = $derived(layoutState.scrollY > 20);
    
    let basePath = $derived(page.url.pathname.split('/').slice(0, 6).join('/')); // Get base topic path
    let theoryPath = $derived(`${basePath}/theory`);
    let exercisesPath = $derived(`${basePath}/exercises`);
    let formularyPath = $derived(`${basePath}/formulary`);
    let flashcardsPath = $derived(`${basePath}/flashcards`);

    function isActive(path: string) {
        return page.url.pathname.includes(path);
    }

    const getLinkClass = (active: boolean) => 
        `flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 border ${active 
            ? 'bg-zinc-900 border-zinc-900 text-white shadow-md scale-105' 
            : 'bg-white border-zinc-200 text-zinc-400 hover:border-zinc-300 hover:text-zinc-900 hover:shadow-sm'}`;
</script>

<div class="relative flex w-full justify-center h-[calc(100vh-4.5rem)] overflow-hidden bg-zinc-50 font-sans text-zinc-900">
    <aside class="hidden lg:block fixed left-0 w-92 h-full border-r border-zinc-200 bg-zinc-50/50 py-6 px-4">
        {#if layoutState.leftSidebar}
            {@render layoutState.leftSidebar()}
        {/if}
    </aside>

    <div 
        class="relative mx-92 w-full overflow-y-scroll no-scrollbar border-r border-zinc-200/50 bg-white"
        onscroll={(e) => layoutState.scrollY = e.currentTarget.scrollTop}
    >
        <header class="sticky top-0 z-50 transition-all duration-300">
            <div class="flex flex-row items-center justify-between gap-4 px-6 md:px-10 bg-white transition-all duration-300 {isScrolled ? 'py-3' : 'py-8'}">
                <h1 class="font-bold text-zinc-900 leading-tight transition-all duration-300 origin-left {isScrolled ? 'text-xl' : 'text-3xl'}">
                    <Latex content={title} />
                </h1>

                <div class="flex items-center gap-2 shrink-0 transition-all duration-300 {isScrolled ? 'scale-90' : ''}">
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

            {#if isScrolled}
                <div class="relative w-full h-8 bg-gradient-to-b from-white to-transparent"></div>
            {/if}
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


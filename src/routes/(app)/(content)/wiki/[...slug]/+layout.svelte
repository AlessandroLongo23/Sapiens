<script lang="ts">
    import { page } from '$app/state';
    import { Book, PenLine, Sigma, Zap, ArrowLeft } from 'lucide-svelte';
    import { layoutState } from '$lib/state/layout.svelte.js';
    
    import Latex from '$lib/components/ui/Latex.svelte';

    let { data, children } = $props();
    let { title, navigation } = $derived(data);
    
    let isScrolled = $derived(layoutState.scrollY > 20);

    // TODO: Add logic for hierarchy error
    let hierarchyError = $state(false);
    
    let basePath = $derived(page.url.pathname.split('/').slice(0, 6).join('/'));
    let theoryPath = $derived(`${basePath}/theory`);
    let exercisesPath = $derived(`${basePath}/exercises`);
    let formularyPath = $derived(`${basePath}/formulary`);
    let flashcardsPath = $derived(`${basePath}/flashcards`);

    function isActive(path: string) {
        return page.url.pathname.includes(path);
    }

    const getLinkClass = (active: boolean) => 
        `flex items-center justify-center size-10 rounded-xl transition-all duration-200 border ${active 
            ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-500/25 text-white dark:text-zinc-900 shadow-md scale-105' 
            : 'bg-white dark:bg-zinc-900 border-zinc-500/25 text-zinc-400 dark:text-zinc-500 hover:border-zinc-500/50 hover:text-zinc-900 dark:hover:text-zinc-100 hover:shadow-sm'}`;

</script>

{#if hierarchyError}
    <!-- TODO: Add hierarchy error component -->
    <!-- <HierarchyErrorComponent /> -->
{:else}
    <div class="relative flex w-full justify-center h-[calc(100vh-4.5rem)] overflow-hidden font-sans text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-900">
        <aside class="hidden lg:block fixed left-0 w-1/4 h-full py-6 px-4">
            {#if layoutState.leftSidebar}
                {@render layoutState.leftSidebar()}
            {/if}
        </aside>

        <div 
            class="relative flex flex-col justify-between mx-[calc(1/4*100%)] w-full h-full overflow-y-scroll no-scrollbar"
            onscroll={(e) => layoutState.scrollY = e.currentTarget.scrollTop}
        >
            <header class="sticky top-0 z-20 transition-all duration-300">
                <div class="flex flex-row items-center justify-between gap-4 px-6 md:px-10 bg-white dark:bg-zinc-900 transition-all duration-300 {isScrolled ? 'py-3' : 'py-8'}">
                    <div class="flex items-center gap-4 flex-1 min-w-0">
                        {#if navigation?.parent}
                            <a href={navigation.parent.url} 
                            class="flex items-center justify-center p-2 -ml-2 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-all"
                            title={navigation.parent.label}>
                            <ArrowLeft class="size-5" />
                            </a>
                        {/if}
                        <h1 class="font-bold text-zinc-900 dark:text-zinc-100 leading-tight transition-all duration-300 origin-left {isScrolled ? 'text-xl' : 'text-3xl'} truncate">
                            <Latex content={title} />
                        </h1>
                    </div>

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
                    <div class="relative w-full h-8 bg-gradient-to-b from-white to-transparent dark:from-zinc-900 dark:to-transparent"></div>
                {/if}
            </header>
            
            <main class="flex-1 flex flex-col">
                <div class="flex-1">
                    {@render children()}
                </div>
            </main>
        </div>

        <aside class="hidden lg:block fixed right-0 w-1/4 h-full overflow-y-auto py-6 px-4">
            {#if layoutState.rightSidebar}
                {@render layoutState.rightSidebar()}
            {/if}
        </aside>
    </div>
{/if}

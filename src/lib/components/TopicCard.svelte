<script>
    import { goto } from '$app/navigation';
    import * as ls from 'lucide-svelte';
    import { selectedTopic } from '$lib/content.js';
    import MemoryBar from './MemoryBar.svelte';
    let { title, description, icon, path } = $props();
</script>

<div class="bg-zinc-50 overflow-hidden backdrop-blur-sm dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex flex-row justify-between gap-4">
    <div class="flex flex-col gap-4 flex-1 justify-between">
        <div class="flex flex-col gap-2">
            <h2 class="text-xl font-semibold flex items-center gap-2">
                <svelte:component this={icon} class="w-5 h-5" />
                <span>{title}</span>
            </h2>
            <p class="text-sm h-16">
                {description}
            </p>
        </div>

        <div class="flex flex-row gap-2">
            <button 
                class="flex flex-row justify-center items-center gap-2 btn-primary w-full text-white py-2 rounded-lg font-semibold text-sm" 
                onclick={() => {
                    $selectedTopic = { title, description, icon, path };
                    goto(`/private/teoria${path.replace('.md', '')}`);
                }}
            >
                <ls.BookOpen class="w-4 h-4" />
                <span>Teoria</span>
            </button>
            <button 
                class="flex flex-row justify-center items-center gap-2 btn-primary w-full text-white py-2 rounded-lg font-semibold text-sm" 
                onclick={() => {
                    $selectedTopic = { title, description, icon, path };
                    goto(`/private/esercizi${path.replace('.md', '')}`);
                }}
            >
                <ls.PenLine class="w-4 h-4" />
                <span>Esercizi</span>
            </button>
        </div>
    </div>

    <MemoryBar memory={Math.floor(Math.random() * 100)} />
</div>
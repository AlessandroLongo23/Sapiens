<script lang="ts">
    import { ArrowLeft, ArrowRight } from 'lucide-svelte';
    
    import Latex from '$lib/components/ui/Latex.svelte';

    let { navigation } = $props();
</script>

{#if navigation?.prev || navigation?.next}
    <div class="grid grid-cols-2 gap-3 sm:gap-4 p-4 sm:p-6 md:px-10 mt-8 border-t border-zinc-500/25">
        {#if navigation.prev}
            <a href={navigation.prev.url} class="group flex flex-col items-start justify-center min-h-[64px] min-w-0 p-3 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-crimson-500/30 dark:hover:border-crimson-500/30 hover:bg-crimson-50/50 dark:hover:bg-crimson-900/10 transition-all duration-200">
                <span class="flex items-center gap-2 text-xs font-medium text-zinc-400 group-hover:text-crimson-500 transition-colors mb-1">
                    <ArrowLeft size={14} />
                    {navigation.prev.subLabel || 'Precedente'}
                </span>
                <span class="w-full text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-crimson-600 dark:group-hover:text-crimson-400 transition-colors text-left line-clamp-2 break-words">
                    <Latex content={navigation.prev.label} />
                </span>
            </a>
        {:else}
            <div aria-hidden="true"></div>
        {/if}

        {#if navigation.next}
            <a href={navigation.next.url} class="group flex flex-col items-end justify-center min-h-[64px] min-w-0 p-3 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-crimson-500/30 dark:hover:border-crimson-500/30 hover:bg-crimson-50/50 dark:hover:bg-crimson-900/10 transition-all duration-200">
                <span class="flex items-center gap-2 text-xs font-medium text-zinc-400 group-hover:text-crimson-500 transition-colors mb-1">
                    {navigation.next.subLabel || 'Successivo'}
                    <ArrowRight size={14} />
                </span>
                <span class="w-full text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-crimson-600 dark:group-hover:text-crimson-400 transition-colors text-right line-clamp-2 break-words">
                    <Latex content={navigation.next.label} />
                </span>
            </a>
        {:else}
            <div aria-hidden="true"></div>
        {/if}
    </div>
{/if}
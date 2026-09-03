<script lang="ts">
    import { ChevronRight } from 'lucide-svelte';
    import { plainTitle } from '$lib/seo/slug';
    import { iconFor } from '$lib/utils/icons';
    import type { SearchResult } from '$lib/components/ui/search';

    let { result, onclick } = $props<{
        result: SearchResult,
        onclick?: () => void
    }>();

    let SubjectIcon = $derived(iconFor(result.subject));
</script>

<a
    href={result.href}
    class="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:border-zinc-500/50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500"
    {onclick}
>
    <div class="flex items-center gap-4 min-w-0">
        <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:bg-crimson-50 dark:group-hover:bg-crimson-900/20 group-hover:text-crimson-600 dark:group-hover:text-crimson-400 transition-colors">
             <SubjectIcon size={18} aria-hidden="true" />
        </div>
        <div class="flex flex-col min-w-0 gap-0.5">
            <span class="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-crimson-600 dark:group-hover:text-crimson-400 transition-colors truncate">
                 {plainTitle(result.topic.title)}
            </span>
            <div class="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-500">
                <span class="font-medium">{result.subject.title}</span>
                <span class="text-zinc-300 dark:text-zinc-700" aria-hidden="true">•</span>
                <span class="truncate italic">{plainTitle(result.chapter.title)}</span>
            </div>
        </div>
    </div>
    <div class="text-zinc-300 dark:text-zinc-600 group-hover:text-crimson-400 dark:group-hover:text-crimson-600 group-hover:translate-x-0.5 transition-all">
        <ChevronRight size={18} aria-hidden="true" />
    </div>
</a>

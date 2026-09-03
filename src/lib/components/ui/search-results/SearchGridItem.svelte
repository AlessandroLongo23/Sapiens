<script lang="ts">
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
    class="group flex flex-col gap-3 p-4 rounded-xl border border-zinc-500/25 bg-white dark:bg-zinc-900/50 hover:border-crimson-200 dark:hover:border-crimson-900/30 hover:shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500"
    {onclick}
>
    <div class="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <div class="p-1 rounded-md bg-zinc-50 dark:bg-zinc-800/50 group-hover:bg-crimson-50 dark:group-hover:bg-crimson-900/20 group-hover:text-crimson-600 dark:group-hover:text-crimson-400 transition-colors">
            <SubjectIcon size={14} aria-hidden="true" />
        </div>
        <span class="font-medium">{result.subject.title}</span>
    </div>

    <div class="flex flex-col gap-1">
        <div class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-crimson-600 dark:group-hover:text-crimson-400 transition-colors leading-tight">
            {plainTitle(result.topic.title)}
        </div>
        <div class="text-xs text-zinc-500 dark:text-zinc-500 truncate">
            In <span class="italic">{plainTitle(result.chapter.title)}</span>
        </div>
    </div>
</a>

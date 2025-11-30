<script lang="ts">
    import Latex from '$lib/components/ui/Latex.svelte';
    import type { TopicNode, ChapterNode, SubjectNode, LevelNode } from '$lib/data/content-tree';
    import { ChevronRight } from 'lucide-svelte';

    let { result, onclick } = $props<{ 
        result: { topic: TopicNode, level: LevelNode, subject: SubjectNode, chapter: ChapterNode },
        onclick?: () => void
    }>();
</script>

<a 
    href={`/wiki/${result.level.id}/${result.subject.id}/${result.chapter.id}/${result.topic.id}/theory`}
    class="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:border-zinc-500/50 transition-all duration-200"
    {onclick}
>
    <div class="flex items-center gap-4 min-w-0">
        <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:bg-crimson-50 dark:group-hover:bg-crimson-900/20 group-hover:text-crimson-600 dark:group-hover:text-crimson-400 transition-colors">
             <result.subject.icon size={18} />
        </div>
        <div class="flex flex-col min-w-0 gap-0.5">
            <span class="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-crimson-600 dark:group-hover:text-crimson-400 transition-colors truncate">
                 <Latex content={result.topic.name} />
            </span>
            <div class="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-500">
                <span class="font-medium">{result.subject.name}</span>
                <span class="text-zinc-300 dark:text-zinc-700">•</span>
                <span class="truncate italic">{result.chapter.name}</span>
            </div>
        </div>
    </div>
    <div class="text-zinc-300 dark:text-zinc-600 group-hover:text-crimson-400 dark:group-hover:text-crimson-600 group-hover:translate-x-0.5 transition-all">
        <ChevronRight size={18} />
    </div>
</a>

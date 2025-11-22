<script lang="ts">
    import Latex from '$lib/components/ui/Latex.svelte';
    import type { TopicNode, ChapterNode, SubjectNode, LevelNode } from '$lib/data/content-tree';

    let { result, onclick } = $props<{ 
        result: { topic: TopicNode, level: LevelNode, subject: SubjectNode, chapter: ChapterNode },
        onclick?: () => void
    }>();
</script>

<a 
    href={`/content/${result.level.id}/${result.subject.id}/${result.chapter.id}/${result.topic.id}/theory`}
    class="group flex flex-col gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-rose-200 dark:hover:border-rose-900/30 hover:shadow-sm transition-all duration-200"
    {onclick}
>
    <div class="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <div class="p-1 rounded-md bg-zinc-50 dark:bg-zinc-800/50 group-hover:bg-rose-50 dark:group-hover:bg-rose-900/20 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
            <result.subject.icon size={14} />
        </div>
        <span class="font-medium">{result.subject.name}</span>
    </div>
    
    <div class="flex flex-col gap-1">
        <div class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors leading-tight">
            <Latex content={result.topic.name} />
        </div>
        <div class="text-xs text-zinc-500 dark:text-zinc-500 truncate">
            In <span class="italic">{result.chapter.name}</span>
        </div>
    </div>
</a>

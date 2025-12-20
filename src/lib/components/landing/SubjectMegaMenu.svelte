<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import type { ContentNode } from '$lib/utils/tree';
	import { Plus } from 'lucide-svelte';

	import Latex from '$lib/components/ui/Latex.svelte';

	let {
		tree,
		level = $bindable<ContentNode | null>(),
		columnsCount = 3,
		topicsPerChapter = 3
	} = $props();
	
	// Subjects are children of a level node
	let subjects = $derived(level?.children || []);
	let selectedSubject = $state<ContentNode | null>(null);
	
	// Auto-select first subject when level changes
	$effect(() => {
		selectedSubject = subjects.length > 0 ? subjects[0] : null;
	});
	
	function handleSubjectHover(subject: ContentNode): void {
		selectedSubject = subject;
	}
</script>

<div
	class="w-full max-h-[80vh] overflow-hidden bg-white dark:bg-zinc-900 border-b border-t border-zinc-500/25 shadow-lg pointer-events-auto"
	role="menu"
	tabindex="-1"
	in:fly={{ y: -200, duration: 250, opacity: 0 }}
	out:fade={{ duration: 150 }}
>
	<div class="px-8 py-5 border-b border-zinc-500/25 bg-zinc-50 dark:bg-zinc-800/50">
		<div class="mx-auto flex items-center gap-3">
			<h3 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
				{level?.title}
			</h3>
		</div>
	</div>
	
	<div class="mx-auto flex min-h-[400px] overflow-hidden">
		<div class="w-1/6 border-r border-zinc-500/25 bg-zinc-50/50 dark:bg-zinc-800/30">
			{#each subjects as subject}
				<a
					href={`/wiki/${level?.slug}/${subject.slug}`}
					onclick={() => level = null}
					onmouseenter={() => handleSubjectHover(subject)}
					class="
						w-full flex items-center gap-2 text-left px-6 py-4 text-base font-medium transition-all duration-200
						text-zinc-700 dark:text-zinc-300 hover:text-rose-500 dark:hover:text-rose-400
						hover:bg-white dark:hover:bg-zinc-800 
							border-l-3
						{
							selectedSubject?.id === subject.id ? 
								'bg-white dark:bg-zinc-800 border-rose-500 dark:border-rose-400 text-rose-500 dark:text-rose-400' : 
								'border-transparent'
						}
					"
				>
					<span class="font-medium">{subject.title}</span>
				</a>
			{/each}
		</div>
		
		<div class="flex-1 p-8 overflow-y-auto h-full">
			{#if selectedSubject}
				{@const chapters = selectedSubject.children || []}
				<div class="gap-6 h-full" style="column-count: {columnsCount}; column-gap: 1.5rem; width: 100%;">
					{#each chapters as chapter, index}
						{@const topics = chapter.children || []}
						<div class="flex flex-col gap-4 mb-8" style="break-inside: avoid;">
							<a
								href={`/wiki/${level?.slug}/${selectedSubject.slug}/${chapter.slug}`}
								onclick={() => level = null}
								class="w-full flex items-center gap-2 text-left px-0 text-zinc-900 dark:text-zinc-100 transition-all duration-200 relative group"
							>
								<Latex content={`${index + 1}. ${chapter.title}`} class="font-semibold line-clamp-1" />
								<span class="absolute -bottom-2 left-1/2 -translate-x-1/2 h-0.5 bg-rose-500 rounded-full transition-all duration-200 opacity-0 w-0 group-hover:opacity-100 group-hover:w-full"></span>
							</a>

							<div class="flex flex-col gap-1.5">
								{#each topics.slice(0, topicsPerChapter) as topic}
									<a
										href={`/wiki/${level?.slug}/${selectedSubject.slug}/${chapter.slug}/${topic.slug}/theory`}
										onclick={() => level = null}
										class="w-full text-left px-3 ps-0 hover:ps-3 py-1.5 rounded-lg text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 group relative cursor-pointer"
									>
										<Latex content={topic.title} class="text-zinc-600 dark:text-zinc-400 group-hover:text-rose-500 dark:group-hover:text-rose-400 line-clamp-1" />
									</a>
								{/each}

								{#if topics.length == topicsPerChapter + 1}
									{@const topic = topics[topicsPerChapter]}
									<a
										href={`/wiki/${level?.slug}/${selectedSubject.slug}/${chapter.slug}/${topic.slug}/theory`}
										onclick={() => level = null}
										class="w-full text-left px-3 ps-0 hover:ps-3 py-1.5 rounded-lg text-sm  hover:bg-zinc-100 dark:hover:bg-zinc-800  transition-all duration-200 group relative"
									>
										<Latex content={topic.title} class="text-zinc-600 dark:text-zinc-400 group-hover:text-rose-500 dark:group-hover:text-rose-400 line-clamp-1" />
									</a>
								{:else if topics.length > topicsPerChapter + 1}
									<a
										href={`/wiki/${level?.slug}/${selectedSubject.slug}/${chapter.slug}`}
										onclick={() => level = null}
										class="w-full flex items-center text-left py-1.5 rounded-lg text-xs text-zinc-500 dark:text-zinc-500 hover:text-rose-500 dark:hover:text-rose-400 transition-all duration-200"
									>
										<Plus class="size-3" />
										<span>{topics.length - topicsPerChapter} lezioni</span>
									</a>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
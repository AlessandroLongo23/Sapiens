<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { contentTree, EducationalLevelMap } from '$lib/data/content-tree';
	import { Plus } from 'lucide-svelte';

	let {
		isOpen = false,
		level,
		columnsCount = 3,
		topicsPerChapter = 3
	} = $props();


	let subjects = $derived(contentTree.find(l => l.id === level.id)?.subjects || []);
	
	let selectedSubject = $state<string | null>(null);
	
	// Set default selected subject when menu opens
	$effect(() => {
		if (isOpen && subjects.length > 0 && !selectedSubject) {
			selectedSubject = subjects[0].id;
		}
		if (!isOpen) {
			selectedSubject = null;
		}
	});
	
	function handleChapterClick(subject_id: string, chapter_id: string) {
		goto(`/${level.id}/${subject_id}/${chapter_id}`);
	}

	function handleTopicClick(subject_id: string, chapter_id: string, topic_id: string) {
		goto(`/${level.id}/${subject_id}/${chapter_id}/${topic_id}`);
	}
	
	function handleLevelHover(subjectId: string) {
		selectedSubject = subjectId;
	}
	
	let currentSubjectData = $derived(
		subjects.find(s => s.id === selectedSubject) || subjects[0]
	);
</script>

<div
	class="w-full max-h-[80vh] overflow-hidden bg-white dark:bg-zinc-900 border-b border-t border-zinc-200 dark:border-zinc-700 shadow-lg pointer-events-auto"
	role="menu"
	tabindex="-1"
	in:fly={{ y: -200, duration: 250, opacity: 0 }}
	out:fade={{ duration: 150 }}
>
	<!-- Header -->
	<div class="px-8 py-5 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
		<div class="mx-auto flex items-center gap-3">
			<level.icon class="size-6 text-rose-500 dark:text-rose-400" />
			<h3 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
				{EducationalLevelMap[level.id]}
			</h3>
		</div>
	</div>
	
	<!-- Main Content -->
	<div class="mx-auto flex min-h-[400px] overflow-hidden">
		<!-- Left Sidebar - Educational Levels -->
		<div class="w-1/6 border-r border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/30">
			{#each subjects as subjectData}
				<button
					onmouseenter={() => handleLevelHover(subjectData.id)}
					class="
						w-full flex items-center gap-2 text-left px-6 py-4 text-base font-medium transition-all duration-200
						text-zinc-700 dark:text-zinc-300 hover:text-rose-500 dark:hover:text-rose-400
						hover:bg-white dark:hover:bg-zinc-800 
							border-l-3
						{
							selectedSubject === subjectData.id ? 
								'bg-white dark:bg-zinc-800 border-rose-500 dark:border-rose-400 text-rose-500 dark:text-rose-400' : 
								'border-transparent'
						}
					"
				>
					<subjectData.icon class="size-4" />
					<span class="font-medium">{subjectData.name}</span>
				</button>
			{/each}
		</div>
		
		<!-- Right Content Area - chapters columns -->
		<div class="flex-1 p-8 overflow-y-auto h-full">
			{#if currentSubjectData}
				<div class="gap-6 h-full" style="column-count: {columnsCount}; column-gap: 1.5rem; width: 100%;">
					{#each currentSubjectData.chapters as chapter, index}
						<div class="flex flex-col gap-4 mb-8" style="break-inside: avoid;">
							<button
								onclick={() => handleChapterClick(currentSubjectData.id, chapter.id)}
								class="w-full text-left px-0 text-zinc-900 dark:text-zinc-100 transition-all duration-200 relative group"
							>
								<span class="font-semibold line-clamp-1">
									{index + 1}. {chapter.name}
								</span>
								<span class="absolute -bottom-2 left-1/2 -translate-x-1/2 h-0.5 bg-rose-500 rounded-full transition-all duration-200 opacity-0 w-0 group-hover:opacity-100 group-hover:w-full"></span>
							</button>

							<div class="flex flex-col gap-1.5">
								{#each chapter.topics.slice(0, topicsPerChapter) as topic}
									<button
										onclick={() => handleTopicClick(currentSubjectData.id, chapter.id, topic.id)}
										class="w-full text-left px-3 ps-0 hover:ps-3 py-1.5 rounded-lg text-sm  hover:bg-zinc-100 dark:hover:bg-zinc-800  transition-all duration-200 group relative"
									>
										<span class="text-zinc-600 dark:text-zinc-400 group-hover:text-rose-500 dark:group-hover:text-rose-400 line-clamp-1">
											{topic.name}
										</span>
									</button>
								{/each}

								{#if chapter.topics.length == topicsPerChapter + 1}
									{@const topic = chapter.topics[topicsPerChapter]}
									<button
										onclick={() => handleTopicClick(currentSubjectData.id, chapter.id, topic.id)}
										class="w-full text-left px-3 ps-0 hover:ps-3 py-1.5 rounded-lg text-sm  hover:bg-zinc-100 dark:hover:bg-zinc-800  transition-all duration-200 group relative"
									>
										<span class="text-zinc-600 dark:text-zinc-400 group-hover:text-rose-500 dark:group-hover:text-rose-400 line-clamp-1">
											{topic.name}
										</span>
									</button>
								{:else if chapter.topics.length > topicsPerChapter + 1}
									<button
										onclick={() => handleChapterClick(currentSubjectData.id, chapter.id)}
										class="w-full flex items-center text-left py-1.5 rounded-lg text-xs text-zinc-500 dark:text-zinc-500 hover:text-rose-500 dark:hover:text-rose-400 transition-all duration-200"
									>
										<Plus class="size-3" />
										<span>{chapter.topics.length - topicsPerChapter} argomenti</span>
									</button>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
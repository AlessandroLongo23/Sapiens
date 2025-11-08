<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { contentTree, EducationalLevelMap } from '$lib/data/content-tree';
	
	let {
		isOpen = false,
		level,
		headerHeight = 0,
		onClose = () => {}
	} = $props();


	let subjects = $derived(contentTree.find(l => l.id === level.id)?.subjects || []);
	
	let menuRef = $state<HTMLElement | null>(null);
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
	
	function handleChapterClick(chapterId: string, subjectId: string) {
		goto(`/${level.id}/${subjectId}/${chapterId}`);
		onClose();
	}
	
	function handleMouseLeave() {
		setTimeout(() => {
			onClose();
		}, 150);
	}
	
	function handleLevelHover(subjectId: string) {
		selectedSubject = subjectId;
	}
	
	let currentSubjectData = $derived(
		subjects.find(s => s.id === selectedSubject) || subjects[0]
	);
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-40 pointer-events-none"
		style="top: {headerHeight}px;"
		transition:fade={{ duration: 150 }}
	>
		<div
			bind:this={menuRef}
			class="w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 shadow-lg pointer-events-auto"
			role="menu"
			tabindex="-1"
			transition:fly={{ y: -10, duration: 200 }}
			onmouseleave={handleMouseLeave}
		>
			<!-- Header -->
			<!-- <div class="px-8 py-5 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
				<div class="mx-auto flex items-center gap-3">
					<level.icon class="size-6 text-pink-500 dark:text-pink-400" />
					<h3 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
						{EducationalLevelMap[level.id]}
					</h3>
				</div>
			</div> -->
			
			<!-- Main Content -->
			<div class="mx-auto flex min-h-[400px]">
				<!-- Left Sidebar - Educational Levels -->
				<div class="w-1/6 border-r border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/30">
					{#each subjects as subjectData}
						<button
							onmouseenter={() => handleLevelHover(subjectData.id)}
							class="
								w-full flex items-center gap-2 text-left px-6 py-4 text-base font-medium transition-all duration-200
								text-zinc-700 dark:text-zinc-300 hover:text-pink-500 dark:hover:text-pink-400
								hover:bg-white dark:hover:bg-zinc-800 
								 border-l-3
								{
									selectedSubject === subjectData.id ? 
										'bg-white dark:bg-zinc-800 border-pink-500 dark:border-pink-400 text-pink-500 dark:text-pink-400' : 
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
				<div class="flex-1 p-8">
					{#if currentSubjectData}
						<div class="grid gap-6 h-full" style="grid-template-columns: repeat(3, minmax(0, 1fr)); width: 100%;">
							{#each currentSubjectData.chapters as chapter}
								<div class="">
									<button
										onclick={() => handleChapterClick(chapter.id, currentSubjectData.id)}
										class="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-pink-500 dark:hover:text-pink-400 transition-all duration-200 group"
									>
										<span class="group-hover:translate-x-1 transition-transform duration-200 inline-block">
											{chapter.name}
										</span>
									</button>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

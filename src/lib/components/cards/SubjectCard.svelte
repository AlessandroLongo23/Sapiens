<script lang="ts">
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import type { SubjectNode } from '$lib/data/content-tree';
    
	let { subject, level_id, chapterCount = 0 } = $props<{
		subject: SubjectNode;
		level_id: string;
		chapterCount?: number;
	}>();

	let isHovered = $state(false);

	function handleClick() {
		goto(`/${level_id}/${subject.id}`);
	}

	let totalTopics = $derived(
		subject.chapters.reduce((sum, chapter) => sum + chapter.topics.length, 0)
	);
</script>

<button
	onclick={handleClick}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
	class="group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-pink-300 dark:hover:border-pink-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/5"
	tabindex="0"
>
	<!-- Gradient overlay on hover -->
	<div
		class="absolute inset-0 bg-gradient-to-br from-pink-500/0 via-pink-500/0 to-pink-500/0 group-hover:from-pink-500/5 group-hover:via-pink-500/3 group-hover:to-pink-500/5 transition-all duration-300"
		transition:fade={{ duration: 300 }}
	></div>

	<div class="relative flex flex-col p-6 sm:p-8">
		<!-- Icon and Badge -->
		<div class="flex items-start justify-between mb-4">
			{#if subject.icon}
				{@const SubjectIcon = subject.icon}
				<div
					class="p-3 rounded-xl bg-gradient-to-br from-pink-500/10 to-pink-500/5 dark:from-pink-500/20 dark:to-pink-500/10 group-hover:from-pink-500/20 group-hover:to-pink-500/10 dark:group-hover:from-pink-500/30 dark:group-hover:to-pink-500/20 transition-all duration-300"
				>
					<SubjectIcon
						class="w-6 h-6 sm:w-7 sm:h-7 text-pink-500 dark:text-pink-400 transition-transform duration-300 group-hover:scale-110"
					/>
				</div>
			{/if}

			{#if chapterCount > 0}
				<div
					class="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400"
				>
					{chapterCount} {chapterCount === 1 ? 'capitolo' : 'capitoli'}
				</div>
			{/if}
		</div>

		<!-- Subject Name -->
		<h3
			class="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300"
		>
			{subject.name}
		</h3>

		<!-- Stats -->
		<div class="flex items-center gap-4 mt-auto pt-4 text-sm text-zinc-600 dark:text-zinc-400">
			<div class="flex items-center gap-1.5">
				<svg
					class="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
					/>
				</svg>
				<span class="font-medium">{subject.chapters.length}</span>
				<span class="hidden sm:inline">capitoli</span>
			</div>

			{#if totalTopics > 0}
				<div class="flex items-center gap-1.5">
					<svg
						class="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					<span class="font-medium">{totalTopics}</span>
					<span class="hidden sm:inline">argomenti</span>
				</div>
			{/if}
		</div>

		<!-- Arrow indicator -->
		<div
			class="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
		>
			<svg
				class="w-5 h-5 text-pink-500 dark:text-pink-400 transform group-hover:translate-x-1 transition-transform duration-300"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 5l7 7-7 7"
				/>
			</svg>
		</div>
	</div>
</button>

<style>
	button:focus-visible {
		outline: 2px solid rgb(236 72 153);
		outline-offset: 2px;
	}
</style>


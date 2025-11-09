<script lang="ts">
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import type { TopicNode } from '$lib/data/content-tree';
	import { BookOpen } from 'lucide-svelte';

	let { topic, level_id, subject_id, chapter_id } = $props<{
		topic: TopicNode;
		level_id: string;
		subject_id: string;
		chapter_id: string;
	}>();

	let isHovered = $state(false);

	function handleClick() {
		goto(`/${level_id}/${subject_id}/${chapter_id}/${topic.id}`);
	}
</script>

<button
	onclick={handleClick}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
	class="group relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-rose-300 dark:hover:border-rose-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/5"
	tabindex="0"
>
	<!-- Gradient overlay on hover -->
	<div
		class="absolute inset-0 bg-gradient-to-br from-rose-500/0 via-rose-500/0 to-rose-500/0 group-hover:from-rose-500/5 group-hover:via-rose-500/3 group-hover:to-rose-500/5 transition-all duration-300"
		transition:fade={{ duration: 300 }}
	></div>

	<div class="relative flex flex-col p-5 sm:p-6">
		<!-- Icon -->
		<div class="mb-3">
			<div
				class="p-2.5 rounded-lg bg-gradient-to-br from-rose-500/10 to-rose-500/5 dark:from-rose-500/20 dark:to-rose-500/10 group-hover:from-rose-500/20 group-hover:to-rose-500/10 dark:group-hover:from-rose-500/30 dark:group-hover:to-rose-500/20 transition-all duration-300 w-fit"
			>
				<BookOpen
					class="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 dark:text-rose-400 transition-transform duration-300 group-hover:scale-110"
				/>
			</div>
		</div>

		<!-- Topic Name -->
		<h3
			class="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors duration-300 line-clamp-2"
		>
			{topic.name}
		</h3>

		<!-- Arrow indicator -->
		<div
			class="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
		>
			<svg
				class="w-4 h-4 text-rose-500 dark:text-rose-400 transform group-hover:translate-x-1 transition-transform duration-300"
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


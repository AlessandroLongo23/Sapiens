<script lang="ts">
	import { goto } from '$app/navigation';
	import type { SubjectNode } from '$lib/data/content-tree';
	import { BookOpen, ChevronRight } from 'lucide-svelte';

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
	class="group w-full h-full flex flex-col text-left relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-300 hover:border-rose-200 dark:hover:border-rose-800 hover:shadow-xl hover:shadow-rose-500/5 hover:-translate-y-1"
	tabindex="0"
>
	<!-- Top accent line -->
	<div 
		class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-rose-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
	></div>

	<div class="p-6 flex flex-col flex-1">
		<!-- Header: Icon + Badge -->
		<div class="flex items-start justify-between mb-4">
			{#if subject.icon}
				{@const SubjectIcon = subject.icon}
				<div
					class="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:text-rose-500 dark:group-hover:text-rose-400 group-hover:bg-rose-50 dark:group-hover:bg-rose-900/20 transition-colors duration-300"
				>
					<SubjectIcon class="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
				</div>
			{/if}
		</div>

		<!-- Content -->
		<div class="flex-1">
			<h3 class="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 leading-snug group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors duration-300">
				{subject.name}
			</h3>
			
			<!-- Optional description or stats text -->
			<div class="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
				<span>{chapterCount} {chapterCount === 1 ? 'capitolo' : 'capitoli'}</span>
				<span>•</span>
				<span>{totalTopics} {totalTopics === 1 ? 'lezione' : 'lezioni'}</span>
			</div>
		</div>

		<!-- Footer -->
		<div class="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-sm">
			<div class="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
				<BookOpen class="w-4 h-4" />
				<span>Esplora la materia</span>
			</div>

			<div class="transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 text-rose-500">
				<ChevronRight class="w-5 h-5" />
			</div>
		</div>
	</div>
</button>

<style>
	@reference "../../../../app.css";

	button {
		outline: none;
	}

	button:focus-visible {
		@apply ring-2 ring-rose-500 ring-offset-2 dark:ring-offset-zinc-950;
	}
</style>
<script lang="ts">
	import type { ChapterNode } from '$lib/data/content-tree';
	import { ChevronRight, FileText } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	import Latex from '$lib/components/ui/Latex.svelte';

	let { chapter, level_id, subject_id, topicCount = 0 } = $props<{
		chapter: ChapterNode;
		level_id: string;
		subject_id: string;
		topicCount?: number;
	}>();

	let isHovered = $state(false);

	function handleClick() {
		goto(`/wiki/${level_id}/${subject_id}/${chapter.id}`);
	}
</script>

<button
	onclick={handleClick}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
	class="group w-full h-full flex flex-col text-left relative overflow-hidden rounded-2xl border border-zinc-500/25 bg-white dark:bg-zinc-900 transition-all duration-300 hover:border-crimson-200 dark:hover:border-crimson-800 hover:shadow-xl hover:shadow-crimson-500/5 hover:-translate-y-1"
>
	<!-- Top accent line -->
	<div 
		class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-crimson-500 to-crimson-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
	></div>

	<div class="p-6 flex flex-col flex-1">
		<!-- Header: Icon + Badge -->
		<div class="flex flex-row items-center justify-start gap-4 mb-4">
			{#if chapter.icon}
				{@const ChapterIcon = chapter.icon}
				<div
					class="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:text-crimson-500 dark:group-hover:text-crimson-400 group-hover:bg-crimson-50 dark:group-hover:bg-crimson-900/20 transition-colors duration-300"
				>
					<ChapterIcon class="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
				</div>
			{/if}

			<div class="flex flex-col">
				<h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 leading-snug group-hover:text-crimson-600 dark:group-hover:text-crimson-400 transition-colors duration-300">
					<Latex content={chapter.name} />
				</h3>
				
				
			</div>
		</div>

		<div class="flex-1">
			<span class="text-sm text-zinc-500 dark:text-zinc-400">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. 
			</span>
		</div>

		<!-- Footer -->
		<div class="mt-6 pt-4 border-t border-zinc-500/25 flex items-center justify-between text-sm">
			{#if topicCount > 0}
				<div class="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
					<FileText class="w-4 h-4" />
					<span>{topicCount} {topicCount === 1 ? 'lezione' : 'lezioni'}</span>
				</div>
			{:else}
				<span class="text-zinc-400 text-sm italic">In arrivo</span>
			{/if}

			<div class="transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 text-crimson-500">
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
		@apply ring-2 ring-crimson-500 ring-offset-2 dark:ring-offset-zinc-950;
	}
</style>
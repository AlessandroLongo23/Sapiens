<script lang="ts">
	import type { ContentNode } from '$lib/utils/tree';
	import { BookOpen, ChevronRight } from 'lucide-svelte';
	import { iconFor } from '$lib/utils/icons';

	let { level, href } = $props<{
		level: ContentNode;
		href: string;
	}>();

	let LevelIcon = $derived(iconFor(level));
	let totalSubjects = $derived(level.children.length);
	let totalChapters = $derived(level.children.reduce((sum: number, subject: ContentNode) => sum + subject.children.length, 0));
	let totalTopics = $derived(
		level.children.reduce(
			(sum: number, subject: ContentNode) =>
				sum + subject.children.reduce((chSum: number, chapter: ContentNode) => chSum + chapter.children.length, 0),
			0
		)
	);
</script>

<a
	{href}
	class="group w-full h-full flex flex-col text-left relative overflow-hidden rounded-2xl border border-zinc-500/25 bg-white dark:bg-zinc-900 transition-all duration-300 hover:border-crimson-200 dark:hover:border-crimson-800 hover:shadow-xl hover:shadow-crimson-500/5 hover:-translate-y-1 no-underline"
>
	<div
		class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-crimson-500 to-crimson-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
	></div>

	<div class="p-6 flex flex-col flex-1">
		<div class="flex flex-row items-center justify-start gap-4 mb-4">
			<div
				class="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:text-crimson-500 dark:group-hover:text-crimson-400 group-hover:bg-crimson-50 dark:group-hover:bg-crimson-900/20 transition-colors duration-300"
			>
				<LevelIcon class="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
			</div>

			<div class="flex flex-col">
				<h3 class="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 leading-snug group-hover:text-crimson-600 dark:group-hover:text-crimson-400 transition-colors duration-300">
					{level.title}
				</h3>

				<div class="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
					<span>{totalSubjects} {totalSubjects === 1 ? 'materia' : 'materie'}</span>
					<span aria-hidden="true">•</span>
					<span>{totalChapters} {totalChapters === 1 ? 'capitolo' : 'capitoli'}</span>
					<span aria-hidden="true">•</span>
					<span>{totalTopics} {totalTopics === 1 ? 'lezione' : 'lezioni'}</span>
				</div>
			</div>
		</div>

		<div class="flex-1">
			{#if level.description}
				<p class="text-sm text-zinc-500 dark:text-zinc-400">{level.description}</p>
			{/if}
		</div>

		<div class="mt-6 pt-4 border-t border-zinc-500/25 flex items-center justify-between text-sm">
			<div class="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
				<BookOpen class="w-4 h-4" />
				<span>Esplora il livello</span>
			</div>

			<div class="transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 text-crimson-500">
				<ChevronRight class="w-5 h-5" />
			</div>
		</div>
	</div>
</a>

<style>
	@reference "../../../../app.css";

	a {
		outline: none;
	}

	a:focus-visible {
		@apply ring-2 ring-crimson-500 ring-offset-2 dark:ring-offset-zinc-950;
	}
</style>

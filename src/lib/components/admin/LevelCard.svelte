<script lang="ts">
	import { CheckCircle2 } from 'lucide-svelte';

	interface ContentCounts {
		theory: number;
		formulary: number;
		exercises: number;
		flashcards: number;
	}

	interface Props {
		title: string;
		subjects: number;
		chapters: number;
		topics: number;
		readyTopics: number;
		content?: ContentCounts;
	}

	let { title, subjects, chapters, topics, readyTopics, content }: Props = $props();

	let percent = $derived(topics > 0 ? Math.round((readyTopics / topics) * 100) : 0);

	let statusClasses = $derived(
		percent >= 75 
			? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
			: percent >= 50 
				? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
				: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
	);
</script>

<div class="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 transition-all hover:border-zinc-200 dark:hover:border-zinc-700">
	<div class="flex items-center justify-between mb-3">
		<h3 class="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
			{title}
		</h3>
		<div class="flex items-center gap-1.5">
			{#if percent === 100}
				<CheckCircle2 class="size-4 text-emerald-500" />
			{/if}
			<span class="text-xs font-semibold px-2 py-0.5 rounded-full {statusClasses}">
				{percent}%
			</span>
		</div>
	</div>
	
	<div class="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
		<span class="flex items-center gap-1">
			<span class="font-medium text-zinc-700 dark:text-zinc-300">{subjects}</span> materie
		</span>
		<span class="text-zinc-300 dark:text-zinc-600">•</span>
		<span class="flex items-center gap-1">
			<span class="font-medium text-zinc-700 dark:text-zinc-300">{chapters}</span> capitoli
		</span>
		<span class="text-zinc-300 dark:text-zinc-600">•</span>
		<span class="flex items-center gap-1">
			<span class="font-medium text-zinc-700 dark:text-zinc-300">{readyTopics}</span>/{topics} pronti
		</span>
	</div>
	
	<div class="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
		<div 
			class="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-500"
			style="width: {percent}%"
		></div>
	</div>
</div>


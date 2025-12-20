<script lang="ts">
	import { goto } from '$app/navigation';
	import type { TopicNode } from '$lib/data/content-tree';
	import { BookOpen, ChevronRight } from 'lucide-svelte';
	import Latex from '$lib/components/ui/Latex.svelte';

	let { topic, href } = $props<{
		topic: TopicNode;
		href: string;
	}>();

	let isHovered = $state(false);

	function handleClick() {
		goto(href + '/theory');
	}
</script>

<button
	onclick={handleClick}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
	class="group w-full h-full flex flex-col text-left relative overflow-hidden rounded-2xl border border-zinc-500/25 bg-white dark:bg-zinc-900 transition-all duration-300 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1"
	tabindex="0"
>
	<div 
		class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-indigo-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
	></div>

	<div class="p-6 flex flex-col flex-1">
		<div class="mb-4">
			<div
				class="p-3 w-fit rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors duration-300"
			>
				<BookOpen
					class="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
				/>
			</div>
		</div>

		<div class="flex-1">
			<h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 line-clamp-2">
				<Latex content={topic.title} />
			</h3>
		</div>

		<div class="mt-6 pt-4 border-t border-zinc-500/25 flex items-center justify-between text-sm">
			<span class="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
				Vai alla lezione
			</span>

			<div class="transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 text-indigo-500">
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
		@apply ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-zinc-950;
	}
</style>
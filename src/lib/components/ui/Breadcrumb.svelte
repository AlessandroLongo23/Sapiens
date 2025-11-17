<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import Latex from '$lib/components/ui/Latex.svelte';

	export interface BreadcrumbItem {
		label: string;
		path?: string; // If undefined, the item is not clickable (current page)
	}

	let { items = $bindable() } = $props<{
		items: BreadcrumbItem[];
	}>();

	function handleClick(path: string) {
		if (path) {
			goto(path);
		}
	}
</script>

<nav
	class="flex items-center gap-2 text-sm mb-6 flex-wrap"
	aria-label="Breadcrumb"
>
	{#each items as item, index (index)}
		{#if item.path}
			<button
				onclick={() => handleClick(item.path!)}
				class="text-zinc-600 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-200 rounded"
			>
				<Latex content={item.label} />
			</button>
		{:else}
			<span class="text-zinc-900 dark:text-zinc-100 font-medium">
				<Latex content={item.label} />
			</span>
		{/if}

		{#if index < items.length - 1}
			<ChevronRight class="w-4 h-4 text-zinc-400 dark:text-zinc-600 flex-shrink-0" />
		{/if}
	{/each}
</nav>


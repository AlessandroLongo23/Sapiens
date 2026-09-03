<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';
	import { breadcrumbJsonLd } from '$lib/seo/jsonld';
	import type { IconComponent } from '$lib/utils/icons';

	import Latex from '$lib/components/ui/Latex.svelte';
	import JsonLd from '$lib/components/seo/JsonLd.svelte';

	export interface BreadcrumbItem {
		label: string;
		/** Path of the page. The last item is the current page and is never a link. */
		path?: string;
		icon?: IconComponent;
	}

	let { items, jsonLd = true } = $props<{
		items: BreadcrumbItem[];
		/** Emit the matching BreadcrumbList structured data. */
		jsonLd?: boolean;
	}>();

	let structured = $derived(
		jsonLd
			? breadcrumbJsonLd(
					items
						.filter((i: BreadcrumbItem) => i.path)
						.map((i: BreadcrumbItem) => ({ name: i.label, path: i.path! }))
				)
			: null
	);
</script>

{#if structured}
	<JsonLd data={structured} />
{/if}

<nav aria-label="Percorso" class="mb-6">
	<ol class="flex items-center gap-2 text-sm flex-wrap">
		{#each items as item, index (index)}
			{@const isLast = index === items.length - 1}
			<li class="flex items-center gap-2">
				{#if item.path && !isLast}
					<a
						href={item.path}
						class="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-crimson-500 dark:hover:text-crimson-400 transition-colors duration-200 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500"
					>
						{#if item.icon}
							<item.icon class="size-4" aria-hidden="true" />
						{/if}
						<Latex content={item.label} />
					</a>
				{:else}
					<span class="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-medium" aria-current="page">
						{#if item.icon}
							<item.icon class="size-4" aria-hidden="true" />
						{/if}
						<Latex content={item.label} />
					</span>
				{/if}

				{#if !isLast}
					<ChevronRight class="w-4 h-4 text-zinc-400 dark:text-zinc-600 flex-shrink-0" aria-hidden="true" />
				{/if}
			</li>
		{/each}
	</ol>
</nav>

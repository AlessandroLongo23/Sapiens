<script lang="ts">
	import type { JsonLd } from '$lib/seo/jsonld';

	let { data }: { data: JsonLd | JsonLd[] } = $props();

	// A closing script tag inside a JSON string would end the block early, so "<" is escaped.
	let blocks = $derived(
		(Array.isArray(data) ? data : [data]).map(
			(d) => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, '\\u003c')}<\/script>`
		)
	);
</script>

<svelte:head>
	{#each blocks as block}
		{@html block}
	{/each}
</svelte:head>

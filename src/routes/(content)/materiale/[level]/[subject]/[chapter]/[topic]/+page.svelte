<script lang="ts">
	import { learningResourceJsonLd } from '$lib/seo/jsonld';
	import { tutoringSearchHref } from '$lib/tutoring/content-link';

	import Seo from '$lib/components/seo/Seo.svelte';
	import LessonTheory from '$lib/components/content/LessonTheory.svelte';

	let { data } = $props();
	let { node, ancestors, path, paths, parentLink, navigation, seo, content, sections, updatedAt, theory } = $derived(data);

	let tutorHref = $derived(tutoringSearchHref(ancestors ?? []));

	let jsonLd = $derived(
		learningResourceJsonLd(node, ancestors, {
			description: seo.description,
			resourceType: 'Lezione',
			free: true,
			dateModified: updatedAt
		})
	);
</script>

<!-- A lesson whose theory is still being written stays reachable and linked, but out of the index. -->
<Seo title={seo.title} description={seo.description} {path} type="article" noindex={!theory} {jsonLd} />

<LessonTheory
	{content}
	{sections}
	{navigation}
	kind="theory"
	backUrl={parentLink.url}
	theoryUrl={paths.theory}
	{tutorHref}
/>

<script lang="ts">
	import { subviewTitle } from '$lib/seo/meta';
	import { plainTitle } from '$lib/seo/slug';
	import { learningResourceJsonLd } from '$lib/seo/jsonld';

	import Seo from '$lib/components/seo/Seo.svelte';
	import LessonTheory from '$lib/components/content/LessonTheory.svelte';

	let { data } = $props();
	let { content, sections, node, ancestors, paths, parentLink, navigation, updatedAt } = $derived(data);

	let title = $derived(subviewTitle('Formulario', node, ancestors));
	let description = $derived(
		content
			? `Formulario di ${plainTitle(node.title)} (${plainTitle(ancestors[2]?.title)}, ${plainTitle(ancestors[1]?.title)}): le formule essenziali della lezione raccolte in una pagina.`
			: `Formulario di ${plainTitle(node.title)} in preparazione. Nel frattempo leggi la teoria della lezione.`
	);
	let jsonLd = $derived(
		content
			? learningResourceJsonLd(node, ancestors, {
					description,
					resourceType: 'Formulario',
					free: true,
					dateModified: updatedAt,
					path: paths.formulary
				})
			: undefined
	);
</script>

<Seo {title} {description} path={paths.formulary} noindex={!content} {jsonLd} />

<LessonTheory
	{content}
	{sections}
	{navigation}
	kind="formulary"
	backUrl={parentLink.url}
	theoryUrl={paths.theory}
/>

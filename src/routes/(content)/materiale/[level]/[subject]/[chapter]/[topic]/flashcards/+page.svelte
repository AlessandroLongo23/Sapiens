<script lang="ts">
	import { subviewTitle } from '$lib/seo/meta';
	import { plainTitle } from '$lib/seo/slug';

	import Seo from '$lib/components/seo/Seo.svelte';
	import ContentComingSoon from '$lib/components/content/ContentComingSoon.svelte';

	let { data } = $props();
	let { node, ancestors, paths, parentLink, navigation } = $derived(data);
</script>

<!-- No flashcards exist yet: the page stays reachable but out of the index. -->
<Seo
	title={subviewTitle('Flashcards', node, ancestors)}
	description="Flashcards su {plainTitle(node.title)} in preparazione. Nel frattempo leggi la teoria della lezione."
	path={paths.flashcards}
	noindex
/>

<ContentComingSoon type="flashcards" {navigation} chapterUrl={parentLink.url} theoryUrl={paths.theory} />

<script>
	let { children } = $props();
</script>

<!-- Everything under (app) is a signed-in area: never indexed (the server adds X-Robots-Tag too). -->
<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{@render children()}

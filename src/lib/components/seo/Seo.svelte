<script lang="ts">
	import { page } from '$app/state';
	import {
		SITE_NAME,
		SITE_LOCALE,
		DEFAULT_TITLE,
		DEFAULT_DESCRIPTION,
		OG_IMAGE,
		absoluteUrl,
		isPrivatePath
	} from '$lib/config/site';
	import type { JsonLd } from '$lib/seo/jsonld';
	import JsonLdBlock from './JsonLd.svelte';

	interface Props {
		title?: string;
		description?: string;
		/** Canonical path. Defaults to the current pathname without query string. */
		path?: string;
		/** Force noindex. Private paths (see site config) are noindex regardless. */
		noindex?: boolean;
		type?: 'website' | 'article';
		image?: { path: string; width: number; height: number; alt: string };
		/** Structured data blocks to emit with the head. */
		jsonLd?: JsonLd | JsonLd[];
	}

	let {
		title = DEFAULT_TITLE,
		description = DEFAULT_DESCRIPTION,
		path,
		noindex = false,
		type = 'website',
		image = OG_IMAGE,
		jsonLd
	}: Props = $props();

	let pathname = $derived(path ?? page.url.pathname);
	let canonical = $derived(absoluteUrl(pathname));
	let robots = $derived(noindex || isPrivatePath(pathname) ? 'noindex, nofollow' : 'index, follow');
	let imageUrl = $derived(absoluteUrl(image.path));
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="robots" content={robots} />
	<link rel="canonical" href={canonical} />

	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content={SITE_LOCALE} />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content={String(image.width)} />
	<meta property="og:image:height" content={String(image.height)} />
	<meta property="og:image:alt" content={image.alt} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
	<meta name="twitter:image:alt" content={image.alt} />
</svelte:head>

{#if jsonLd}
	<JsonLdBlock data={jsonLd} />
{/if}

<script>
	import '../app.css';
	import '@fontsource-variable/inter';
	import '@fontsource/jetbrains-mono/400.css';
	import '@fontsource/jetbrains-mono/500.css';
	import '@fontsource/jetbrains-mono/600.css';
	import interWoff2 from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url';
	import '$lib/utils/prototypes.js';
	import { onMount } from 'svelte';
	import { searchStore } from '$lib/components/ui/search';
	import { GSC_VERIFICATION } from '$lib/config/site';
	import { organizationJsonLd, webSiteJsonLd } from '$lib/seo/jsonld';

	import ThemeProvider from '$lib/components/ui/theme/ThemeProvider.svelte';
	import GrainyBackground from '$lib/components/landing/background/GrainyBackground.svelte';
	import AuthModal from '$lib/components/ui/modals/AuthModal.svelte';
	import Header from '$lib/components/landing/Header.svelte';
	import SearchOverlay from '$lib/components/ui/SearchOverlay.svelte';
	import FooterSection from '$lib/components/landing/FooterSection.svelte';
	import JsonLd from '$lib/components/seo/JsonLd.svelte';

	let { children } = $props();

	let headerRef = $state(undefined);
	let isAuthModalOpen = $state(false);

	const siteJsonLd = [organizationJsonLd(), webSiteJsonLd()];

	// The WebGL grain background is decorative and costs seconds of main-thread
	// time on phones: start it once the page is idle, and never for visitors who
	// asked for reduced motion.
	let showBackground = $state(false);
	onMount(() => {
		if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
		const start = () => (showBackground = true);
		if ('requestIdleCallback' in window) {
			const id = window.requestIdleCallback(start, { timeout: 4000 });
			return () => window.cancelIdleCallback(id);
		}
		const timer = setTimeout(start, 1500);
		return () => clearTimeout(timer);
	});
</script>

<svelte:head>
	{#if GSC_VERIFICATION}
		<meta name="google-site-verification" content={GSC_VERIFICATION} />
	{/if}
	<link rel="preload" href={interWoff2} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

<JsonLd data={siteJsonLd} />

<a href="#contenuto" class="skip-link">Vai al contenuto</a>

<ThemeProvider>
	{#if showBackground}
		<GrainyBackground
			grain_amount={0.08}
			grain_size={1.0}
			speed={0.3}
		/>
	{/if}

	<AuthModal
		bind:isOpen={isAuthModalOpen}
		onClose={() => isAuthModalOpen = false}
	/>

	<div class="flex flex-col relative z-10 h-screen">
		<SearchOverlay />
		<Header
			bind:headerRef={headerRef}
			bind:isAuthModalOpen={isAuthModalOpen}
		/>

		<div class={`flex-1 overflow-y-auto no-scrollbar transition-opacity duration-300 ease-out ${$searchStore?.isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
			<main id="contenuto" style={`min-height: calc(100vh - ${headerRef?.offsetHeight ?? 0}px);`}>
				{@render children()}
			</main>

			<FooterSection />
		</div>
	</div>
</ThemeProvider>

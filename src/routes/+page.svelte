<script lang="ts">
	import { BookOpen, Layers, LibraryBig } from 'lucide-svelte';

	import Seo from '$lib/components/seo/Seo.svelte';
	import HeroSection from '$lib/components/landing/HeroSection.svelte';

	let { data } = $props();

	let heroSection = $state(null);

	// Content figures only, straight from the database: the library is what
	// exists today, and every number here grows as lessons are published.
	let stats = $derived([
		{
			value: data.counts?.subject ?? 0,
			label: 'Materie',
			icon: LibraryBig
		},
		{
			value: data.counts?.chapter ?? 0,
			label: 'Capitoli',
			icon: Layers
		},
		{
			value: data.counts?.published ?? 0,
			label: 'Lezioni pubblicate',
			icon: BookOpen
		}
	]);
</script>

<Seo path="/" />

<HeroSection bind:heroSection={heroSection} {stats} />

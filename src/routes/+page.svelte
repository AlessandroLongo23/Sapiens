<script lang="ts">
	import { BookOpen, Users } from 'lucide-svelte';

	import Seo from '$lib/components/seo/Seo.svelte';
	import HeroSection from '$lib/components/landing/HeroSection.svelte';

	let { data } = $props();

	let heroSection = $state(null);

	let stats = $derived([
		{
			value: data.counts?.topic ?? 0,
			label: 'Lezioni disponibili',
			icon: BookOpen
		},
		{
			// OWNER: hardcoded figure carried over from the previous landing page; replace with a real count or remove.
			value: 300,
			label: 'Studenti Iscritti',
			icon: Users
		}
	]);
</script>

<Seo path="/" />

<HeroSection bind:heroSection={heroSection} {stats} />

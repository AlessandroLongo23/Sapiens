<script lang="ts">
	import { contentTree } from '$lib/data/content-tree';
	import { BookOpen, Users } from 'lucide-svelte';

	import AuthModal from '$lib/components/shared/ui/modals/AuthModal.svelte';
	import Header from '$lib/components/shared/landing/Header.svelte';

	import HeroSection from '$lib/components/shared/landing/HeroSection.svelte';
	import FooterSection from '$lib/components/shared/landing/FooterSection.svelte';

	let isAuthModalOpen = $state(false);

	let { data } = $props();
	let { session } = $derived(data);
	
	let heroSection = $state(null);

	let stats = $derived({
		topics: {
			value: contentTree
				.flatMap(level => level.subjects)
				.flatMap(subject => subject.chapters)
				.reduce((acc: number, chapter) => acc + chapter.topics.length, 0),
			label: "Argomenti disponibili",
			icon: BookOpen,
		},
		students: {
			value: "300+",
			label: "Studenti Iscritti",
			icon: Users,
		}
	});
</script>

<svelte:head>
	<title>Sapiens</title>
	<meta
		name="description"
		content="Materiale didattico di matematica, fisica, informatica e altre materie scientifiche."
	/>
</svelte:head>


<AuthModal 
	bind:isOpen={isAuthModalOpen} 
	onClose={() => isAuthModalOpen = false} 
/>

<Header
	bind:isAuthModalOpen={isAuthModalOpen}
	session={session}
/>

<HeroSection bind:heroSection={heroSection} stats={stats} gradient={true}/>

<FooterSection />
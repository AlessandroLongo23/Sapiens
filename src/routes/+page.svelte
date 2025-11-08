<script lang="ts">
	import { statsStore } from '$lib/stores/stats.svelte.js';
	import { studentsStore } from '$lib/stores/students.js';
	import { subjectsStore } from '$lib/stores/subjects.js';
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
		subjects: {
			value: $subjectsStore.subjects.length,
			label: "Lezioni disponibili",
			icon: BookOpen,
		},
		hours: {
			value: Math.floor(statsStore.totalTime.hours / 10) * 10 + "+",
			label: "Studenti Iscritti",
			icon: Users,
		},
		students: {
			value: Math.floor($studentsStore.students.length / 5) * 5 + "+",
			label: "Studenti Seguiti",
			icon: Users,
		}
	});
</script>

<svelte:head>
	<title>Sapiens</title>
	<meta
		name="description"
		content="Ripetizioni personalizzate in matematica, fisica, informatica e altre materie scientifiche. Tutor esperto Laureato all'Università degli Studi di Firenze con oltre {stats.hours.value} ore di esperienza."
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
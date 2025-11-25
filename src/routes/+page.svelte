<script lang="ts">
	import { contentTree } from '$lib/data/content-tree';
	import { BookOpen, Users } from 'lucide-svelte';

	import HeroSection from '$lib/components/landing/HeroSection.svelte';

	let heroSection = $state(null);

	let stats = $derived({
		topics: {
			value: contentTree
				.flatMap(level => level.subjects)
				.flatMap(subject => subject.chapters)
				.reduce((acc: number, chapter) => acc + chapter.topics.length, 0),
			label: "Lezioni disponibili",
			icon: BookOpen,
		},
		students: {
			value: 300,
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

<HeroSection bind:heroSection={heroSection} stats={Object.values(stats)}/>
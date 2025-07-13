<script>
	import { goto } from '$app/navigation';
	import * as ls from 'lucide-svelte';
  	import { onMount } from 'svelte';

	import { content } from '$lib/content';
	import TopicCard from '$lib/components/TopicCard.svelte';

	let { data } = $props();
	let { user } = $derived(data);

	let isLoggingOut = $state(false);

	let student = $state(null);

	let motivational_messages = $state([
		'Riprendiamo?',
		'Dove eravamo rimasti?',
		'Ancora un altro esercizio?',
		'Pronto a imparare qualcosa di nuovo?',
	])

	let topics = $derived.by(() => {
		return Object.values(content["superiori"]["matematica"]["1"]["numeri naturali"]);
	})

	let motivational_message = $state(null);
	onMount(() => {
		motivational_message = motivational_messages[Math.floor(Math.random() * motivational_messages.length)];
	})
</script>

<div class="flex flex-col gap-8 mt-24">
	<div class="flex flex-row justify-between items-center">
		<h2 class="text-2xl font-bold text-zinc-950 dark:text-white">I miei argomenti</h2>
	
		<!-- sort by memory, alphabetically, by level, ecc -->
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
		{#each topics as topic}
		<TopicCard 
			title={topic.title} 
			description={topic.description} 
			icon={ls.BookOpen} 
			path={topic.path}
		/>
		{/each}
	</div>
</div>

<style>
	.glass-effect {
		background: rgba(255, 255, 255, 0.6);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}
	.btn-primary {
		background: #3b82f6; /* blue-500 */
		transition: background-color 0.3s;
	}
	.btn-primary:hover {
		background: #2563eb; /* blue-600 */
	}
	.btn-secondary {
		background-color: rgba(255, 255, 255, 0.7);
		transition: background-color 0.3s;
	}
	.btn-secondary:hover {
		background-color: rgba(255, 255, 255, 1);
	}
</style> 
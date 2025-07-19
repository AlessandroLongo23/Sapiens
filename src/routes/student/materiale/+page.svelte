<script>
	import { content } from '$lib/content';
	import * as ls from 'lucide-svelte';
	
	import TopicCard from '$lib/components/cards/TopicCard.svelte';

	let { data } = $props();
	let { user } = $derived(data);

	let topics = $derived.by(() => {
		let topics = []
		for (let topic of Object.values(content["superiori"]["matematica"]["1"]["numeri naturali"])) {
			topics.push(topic)
		}
		for (let topic of Object.values(content["superiori"]["informatica"]["3"])) {
			topics.push(topic)
		}
		return topics
	})

</script>

<div class="flex flex-col gap-8 mt-18 mx-auto px-32 py-8">
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
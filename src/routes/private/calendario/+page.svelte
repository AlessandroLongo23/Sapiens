<script>
	import { goto } from '$app/navigation';
	import * as ls from 'lucide-svelte';
  	import { onMount } from 'svelte';
	
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

	let motivational_message = $state(null);
	onMount(() => {
		motivational_message = motivational_messages[Math.floor(Math.random() * motivational_messages.length)];
	})
</script>

<div class="glass-effect p-6 rounded-2xl shadow-sm w-[80%] mx-auto">
	<h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
		<ls.Calendar class="w-5 h-5" />
		<span>Calendario Lezioni</span>
	</h2>
	<div
		class="aspect-video bg-white/50 rounded-lg flex items-center justify-center h-full border-2 border-dashed"
	>
		<div class="text-center">
			<ls.CalendarDays class="w-12 h-12 text-zinc-400 mx-auto mb-2" />
			<p class="text-zinc-500 font-medium">
				Il calendario interattivo è in arrivo.
			</p>
			<p class="text-sm text-zinc-400">
				Potrai visualizzare e proporre nuove lezioni.
			</p>
		</div>
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
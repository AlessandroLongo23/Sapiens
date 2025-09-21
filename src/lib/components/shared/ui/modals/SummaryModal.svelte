<script>
	import Modal from '$lib/components/shared/ui/modals/Modal.svelte';
	import * as ls from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { exercise_messages } from '$lib/const/microcopy.js';

	let {
		isOpen = $bindable(false),
		correctCount = 0,
		totalCount = 0
	} = $props();

	let incorrectCount = $derived(totalCount - correctCount);

	let message = $derived.by(() => {
		let percentage = (correctCount / totalCount) * 100;
		let pool;

		switch (true) {
			case percentage < 25:
				pool = $exercise_messages[0];
				break;
			case percentage < 50:
				pool = $exercise_messages[1];
				break;
			case percentage < 75:
				pool = $exercise_messages[2];
				break;
			case percentage < 100:
				pool = $exercise_messages[3];
				break;
			case percentage == 100:
				pool = $exercise_messages[4];
				break;
		}

		return pool[Math.floor(Math.random() * pool.length)];
	})
</script>

<Modal bind:isOpen title="Sessione Completata!" classes="bg-zinc-50 dark:bg-zinc-900 max-w-sm p-6 rounded-lg">
	<div class="flex flex-col items-center justify-center gap-6 text-center">
		<h2 class="text-2xl font-bold text-zinc-800 dark:text-zinc-200">{message}</h2>
		<p class="text-zinc-600 dark:text-zinc-400">Ecco il riepilogo della tua sessione:</p>

		<div class="flex gap-8 text-xl">
			<div class="flex items-center gap-2 font-semibold text-green-600 dark:text-green-400">
				<ls.CheckCircle class="w-7 h-7" />
				<span>{correctCount} Corrette</span>
			</div>
			<div class="flex items-center gap-2 font-semibold text-red-600 dark:text-red-400">
				<ls.XCircle class="w-7 h-7" />
				<span>{incorrectCount} Sbagliate</span>
			</div>
		</div>

		<button
			onclick={() => {
				isOpen = false;
				goto('/student/materiale');
			}}
			class="mt-4 btn-primary text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg group"
		>
			Chiudi
		</button>
	</div>
</Modal> 
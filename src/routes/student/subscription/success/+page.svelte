<script>
	import { CheckCircle } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let countdown = $state(5);

	onMount(() => {
		const interval = setInterval(() => {
			countdown--;
			if (countdown === 0) {
				goto('/student/subscription');
			}
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-4">
	<div class="max-w-md w-full bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-8 text-center">
		<div class="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
			<CheckCircle class="w-12 h-12 text-green-600 dark:text-green-400" />
		</div>

		<h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
			Pagamento completato!
		</h1>

		<p class="text-zinc-600 dark:text-zinc-400 mb-8">
			Il tuo abbonamento è stato attivato con successo. Ora puoi accedere a tutte le funzionalità del tuo piano.
		</p>

		<div class="space-y-4">
			<button
				onclick={() => goto('/student/subscription')}
				class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
			>
				Vai al tuo abbonamento
			</button>

			<button
				onclick={() => goto('/student/materiale')}
				class="w-full py-3 px-4 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 rounded-xl font-semibold transition-colors"
			>
				Inizia a studiare
			</button>
		</div>

		<p class="text-sm text-zinc-500 dark:text-zinc-500 mt-6">
			Reindirizzamento automatico tra {countdown} secondi...
		</p>
	</div>
</div>


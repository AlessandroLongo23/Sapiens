<script>
	import { XCircle } from 'lucide-svelte';
	import { goto } from '$app/navigation';
</script>

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-4">
	<div class="max-w-md w-full bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-500/25 p-8 text-center">
		<div class="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
			<XCircle class="w-12 h-12 text-red-600 dark:text-red-400" />
		</div>

		<h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
			Pagamento annullato
		</h1>

		<p class="text-zinc-600 dark:text-zinc-400 mb-8">
			Il processo di pagamento è stato annullato. Nessun addebito è stato effettuato. Puoi riprovare quando vuoi!
		</p>

		<div class="space-y-4">
			<button
				onclick={() => goto('/student/subscription')}
				class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
			>
				Torna ai piani
			</button>

			<button
				onclick={() => goto('/student/materiale')}
				class="w-full py-3 px-4 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 rounded-xl font-semibold transition-colors"
			>
				Continua con il piano gratuito
			</button>
		</div>
	</div>
</div>


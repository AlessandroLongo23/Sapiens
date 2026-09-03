<script lang="ts">
	import { XCircle } from 'lucide-svelte';

	import Seo from '$lib/components/seo/Seo.svelte';

	let { data } = $props();
</script>

<Seo title="Pagamento annullato | Sapiens" path="/pricing/cancel" noindex />

<div class="min-h-[70vh] flex items-center justify-center p-4">
	<div class="max-w-md w-full bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-500/25 p-8 text-center">
		<div class="w-20 h-20 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-6">
			<XCircle class="w-12 h-12 text-zinc-500 dark:text-zinc-300" aria-hidden="true" />
		</div>

		<h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Pagamento annullato</h1>

		<p class="text-zinc-600 dark:text-zinc-400 mb-8">
			Nessun addebito è stato effettuato. La teoria resta gratuita: puoi riprovare quando vuoi.
		</p>

		<div class="space-y-4">
			<a
				href="/pricing"
				class="block w-full py-3 px-4 bg-crimson-600 hover:bg-crimson-700 text-white rounded-xl font-semibold transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 focus-visible:ring-offset-2"
			>
				Torna ai piani
			</a>
			<a
				href={data.next}
				class="block w-full py-3 px-4 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 rounded-xl font-semibold transition-colors no-underline"
			>
				Continua con il piano gratuito
			</a>
		</div>
	</div>
</div>

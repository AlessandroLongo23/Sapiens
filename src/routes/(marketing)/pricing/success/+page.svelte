<script lang="ts">
	import { CheckCircle, Loader2 } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { authState } from '$lib/state/auth.svelte';

	import Seo from '$lib/components/seo/Seo.svelte';

	let { data } = $props();

	// Stripe confirms the payment through a webhook a few seconds after the
	// redirect: poll the account until the plan is on, then refresh the token
	// so the browser session carries it too.
	type Phase = 'waiting' | 'active' | 'slow';
	let phase = $state<Phase>('waiting');

	onMount(() => {
		let attempts = 0;
		let timer: ReturnType<typeof setTimeout> | undefined;

		const check = async () => {
			attempts++;
			try {
				const res = await fetch('/api/me', { cache: 'no-store' });
				const body = await res.json();
				const status = body?.subscription?.status;
				if (body?.plan && body.plan !== 'free' && (status === 'active' || status === 'trialing')) {
					await authState.refresh();
					phase = 'active';
					return;
				}
			} catch {
				// Network hiccup: try again.
			}
			if (attempts >= 15) {
				phase = 'slow';
				return;
			}
			timer = setTimeout(check, 2000);
		};

		check();
		return () => clearTimeout(timer);
	});
</script>

<Seo title="Abbonamento attivato | Sapiens" path="/pricing/success" noindex />

<div class="min-h-[70vh] flex items-center justify-center p-4">
	<div class="max-w-md w-full bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-500/25 p-8 text-center">
		{#if phase === 'active'}
			<div class="w-20 h-20 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-6">
				<CheckCircle class="w-12 h-12 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
			</div>
			<h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">{data.planName} attivo</h1>
			<p class="text-zinc-600 dark:text-zinc-400 mb-8">
				Tutto pronto. Puoi riprendere da dove eri rimasto.
			</p>
			<a
				href={data.next}
				class="block w-full py-3 px-4 bg-crimson-600 hover:bg-crimson-700 text-white rounded-xl font-semibold transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 focus-visible:ring-offset-2"
			>
				Continua
			</a>
		{:else if phase === 'slow'}
			<h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Ci vuole un attimo di più</h1>
			<p class="text-zinc-600 dark:text-zinc-400 mb-8">
				Il pagamento è andato a buon fine e il piano si attiverà entro pochi minuti. Se non succede, scrivici dalla
				pagina <a href="/contacts" class="text-crimson-600 dark:text-crimson-400 underline">Contatti</a>.
			</p>
			<a
				href={data.next}
				class="block w-full py-3 px-4 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 rounded-xl font-semibold transition-colors no-underline"
			>
				Torna alla pagina
			</a>
		{:else}
			<div class="w-20 h-20 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-6" role="status">
				<Loader2 class="w-10 h-10 text-crimson-600 animate-spin" aria-hidden="true" />
				<span class="sr-only">Attivazione in corso</span>
			</div>
			<h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Stiamo attivando il tuo piano</h1>
			<p class="text-zinc-600 dark:text-zinc-400">Pochi secondi e sei dentro.</p>
		{/if}
	</div>
</div>

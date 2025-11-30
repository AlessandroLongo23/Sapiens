<script lang="ts">
	import { SUBSCRIPTION_PLANS, type SubscriptionPlan } from '$lib/stripe/config';
	import { BillingOption } from '$lib/data/billing-options';
	import { Loader2 } from 'lucide-svelte';
	
	import SubscriptionPlans from '$lib/components/subscription/SubscriptionPlans.svelte';
	import SubscriptionTable from '$lib/components/subscription/SubscriptionTable.svelte';
	import BillingToggle from '$lib/components/ui/BillingToggle.svelte';

	let { data } = $props();
	let { user, subscription } = $derived(data);
	
	let isLoading = $state<boolean>(false);
	let error = $state<string | null>(null);
	let billingPeriod = $state<BillingOption>(BillingOption.MONTHLY);
	let currentPlan = $state<SubscriptionPlan>(SUBSCRIPTION_PLANS.FREE);

	async function handleSelectPlan(plan: SubscriptionPlan) {
		isLoading = true;
		error = null;

		try {
			const response = await fetch('/api/stripe/checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ plan: plan.id })
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Errore durante la creazione della sessione');
			}

			const { sessionId, url } = await response.json();

			window.location.href = url;
		} catch (err) {
			console.error('Error selecting plan:', err);
			error = err.message;
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Pricing - Sapiens</title>
	<meta
		name="description"
		content="Piani di abbonamento per il materiale didattico online Sapiens."
	/>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-12 z-10 flex flex-col gap-12">
	{#if error}
		<div class="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg">
			<p class="text-red-800 dark:text-red-200">{error}</p>
		</div>
	{/if}

	<div class="flex flex-col gap-12">
		<div class="text-center flex flex-col gap-4">
			<h2 class="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
				Scegli il piano adatto a te
			</h2>
			<p class="text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
				Inizia gratis e passa a Premium quando vuoi. Puoi annullare in qualsiasi momento.
				<br>
				<span class="text-base text-crimson-500 dark:text-crimson-400">
					Con l'abbonamento semestrale, il primo mese te lo regaliamo!
				</span>
			</p>
			
			<BillingToggle value={billingPeriod} onChange={(value) => billingPeriod = value} />
		</div>

		<SubscriptionPlans
			currentPlan={currentPlan}
			onSelectPlan={handleSelectPlan}
			billingPeriod={billingPeriod}
		/>

		<div class="text-center">
			<p class="text-sm text-zinc-600 dark:text-zinc-400">
				Prova gratuita di 7 giorni per tutti i piani Premium. Non serve la carta di credito.
			</p>
		</div>
	</div>

	<hr class="border-zinc-500/25">

	<div class="flex flex-col gap-12">
		<div class="text-center flex flex-col gap-4">
			<h2 class="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
				Confronta i piani
			</h2>
			<p class="text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
				Tutti i dettagli a colpo d'occhio per aiutarti a scegliere il piano perfetto per le tue esigenze.
				<br>
				<span class="text-base text-crimson-500 dark:text-crimson-400">
					Con l'abbonamento semestrale, il primo mese te lo regaliamo!
				</span>
			</p>

			<BillingToggle value={billingPeriod} onChange={(value) => billingPeriod = value} />
		</div>

		<div class="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-500/25 shadow-lg overflow-hidden p-6">
			<SubscriptionTable
				currentPlan={currentPlan}
				onSelectPlan={handleSelectPlan}
				billingPeriod={billingPeriod}
			/>
		</div>
	</div>
</div>

{#if isLoading}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
		<div class="bg-white dark:bg-zinc-800 rounded-lg p-8 flex flex-col items-center gap-4">
			<Loader2 class="w-12 h-12 text-crimson-600 animate-spin" />
			<p class="text-lg font-medium text-zinc-900 dark:text-zinc-100">
				Reindirizzamento in corso...
			</p>
		</div>
	</div>
{/if}
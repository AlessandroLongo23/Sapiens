<script lang="ts">
	import { SUBSCRIPTION_PLANS, getPlanById, TRIAL_DAYS, type SubscriptionPlan } from '$lib/stripe/config';
	import { BillingOption } from '$lib/data/billing-options';
	import { Loader2 } from 'lucide-svelte';
	import { SITE_NAME } from '$lib/config/site';
	import { productOffersJsonLd } from '$lib/seo/jsonld';
	import { requestCheckout } from '$lib/subscription/checkout';

	import Seo from '$lib/components/seo/Seo.svelte';
	import SubscriptionPlans from '$lib/components/subscription/SubscriptionPlans.svelte';
	import SubscriptionTable from '$lib/components/subscription/SubscriptionTable.svelte';
	import BillingToggle from '$lib/components/ui/BillingToggle.svelte';

	let { data } = $props();

	let isLoading = $state<boolean>(false);
	let error = $state<string | null>(null);
	let billingPeriod = $state<BillingOption>(BillingOption.MONTHLY);
	let currentPlan = $derived<SubscriptionPlan>(
		data.subscription && ['active', 'trialing'].includes(data.subscription.status)
			? getPlanById(data.subscription.plan)
			: SUBSCRIPTION_PLANS.FREE
	);

	// The six-month option exists only once its Stripe prices are configured.
	const semesterAvailable = Object.values(SUBSCRIPTION_PLANS).some((p) => p.stripePriceIdSemester);

	// Structured data reflects the published monthly prices of the paid plans only.
	const offers = productOffersJsonLd(
		[SUBSCRIPTION_PLANS.LITE, SUBSCRIPTION_PLANS.BASE, SUBSCRIPTION_PLANS.PRO].map((plan) => ({
			name: plan.name,
			description: `${plan.name}: ${Object.entries(plan.access).filter(([, ok]) => ok).length} funzionalità incluse.`,
			price: plan.price,
			currency: plan.currency,
			billingDuration: 'P1M'
		})),
		'/pricing'
	);

	const description = `Piano Free con teoria e formulari gratis. Piani Lite, Base e Pro con esercizi interattivi, flashcard, chat con Sapiens AI e lezioni individuali. Prova gratuita di ${TRIAL_DAYS} giorni, disdici quando vuoi.`;

	async function handleSelectPlan(plan: SubscriptionPlan) {
		isLoading = true;
		error = null;

		try {
			await requestCheckout({
				planId: plan.id,
				billing: billingPeriod === BillingOption.SEMESTER ? 'semester' : 'monthly',
				returnTo: '/subscription'
			});
		} catch (err) {
			error = err instanceof Error ? err.message : 'Errore durante la creazione della sessione';
		} finally {
			isLoading = false;
		}
	}
</script>

<Seo title="Prezzi e abbonamenti | {SITE_NAME}" {description} path="/pricing" jsonLd={offers} />

<div class="max-w-7xl mx-auto px-4 py-12 z-10 flex flex-col gap-12">
	{#if error}
		<div class="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg" role="alert">
			<p class="text-red-800 dark:text-red-200">{error}</p>
		</div>
	{/if}

	<div class="flex flex-col gap-12">
		<div class="text-center flex flex-col gap-4">
			<h1 class="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
				Prezzi e abbonamenti
			</h1>
			<p class="text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
				Inizia gratis e passa a Premium quando vuoi. Puoi annullare in qualsiasi momento.
				{#if semesterAvailable}
					<br>
					<span class="text-base text-crimson-500 dark:text-crimson-400">
						Con l'abbonamento semestrale, il primo mese te lo regaliamo!
					</span>
				{/if}
			</p>

			{#if semesterAvailable}
				<BillingToggle value={billingPeriod} onChange={(value) => billingPeriod = value} />
			{/if}
		</div>

		<SubscriptionPlans
			currentPlan={currentPlan}
			onSelectPlan={handleSelectPlan}
			billingPeriod={billingPeriod}
		/>

		<div class="text-center">
			<p class="text-sm text-zinc-600 dark:text-zinc-400">
				Prova gratuita di {TRIAL_DAYS} giorni per tutti i piani Premium. Non serve la carta di credito.
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
			</p>
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
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" role="status">
		<div class="bg-white dark:bg-zinc-800 rounded-lg p-8 flex flex-col items-center gap-4">
			<Loader2 class="w-12 h-12 text-crimson-600 animate-spin" aria-hidden="true" />
			<p class="text-lg font-medium text-zinc-900 dark:text-zinc-100">
				Reindirizzamento in corso...
			</p>
		</div>
	</div>
{/if}

<script lang="ts">
	import { Loader2 } from 'lucide-svelte';
	import { SUBSCRIPTION_PLANS, getPlanById, type SubscriptionPlan } from '$lib/stripe/config';
	import { BillingOption } from '$lib/data/billing-options';
	import { requestCheckout } from '$lib/subscription/checkout';

	import Seo from '$lib/components/seo/Seo.svelte';
	import SubscriptionPlans from '$lib/components/subscription/SubscriptionPlans.svelte';
	import SubscriptionStatus from '$lib/components/subscription/SubscriptionStatus.svelte';

	let { data } = $props();
	let subscription = $derived(data.subscription);
	let currentPlan = $derived<SubscriptionPlan>(
		subscription && ['active', 'trialing'].includes(subscription.status)
			? getPlanById(subscription.plan)
			: SUBSCRIPTION_PLANS.FREE
	);

	let isLoading = $state(false);
	let error = $state<string | null>(null);

	async function handleSelectPlan(plan: SubscriptionPlan) {
		isLoading = true;
		error = null;
		try {
			await requestCheckout({ planId: plan.id, returnTo: '/subscription' });
		} catch (err) {
			error = err instanceof Error ? err.message : 'Errore durante la creazione della sessione';
		} finally {
			isLoading = false;
		}
	}

	async function handleManageSubscription() {
		isLoading = true;
		error = null;
		try {
			const response = await fetch('/api/stripe/portal', { method: 'POST' });
			const body = await response.json().catch(() => ({}));
			if (!response.ok || !body.url) {
				throw new Error(body.error || "Errore durante l'apertura del portale");
			}
			window.location.href = body.url;
		} catch (err) {
			error = err instanceof Error ? err.message : "Errore durante l'apertura del portale";
			isLoading = false;
		}
	}
</script>

<Seo title="Il tuo abbonamento | Sapiens" path="/subscription" noindex />

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-900">
	<div class="max-w-7xl mx-auto px-4 py-8">
		{#if error}
			<div class="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg" role="alert">
				<p class="text-red-800 dark:text-red-200">{error}</p>
			</div>
		{/if}

		<div class="mb-8">
			<h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
				Il tuo abbonamento
			</h1>
			<p class="text-zinc-600 dark:text-zinc-400">
				Gestisci il tuo piano, il metodo di pagamento e le fatture.
			</p>
		</div>

		{#if subscription}
			<div class="mb-12">
				<SubscriptionStatus
					plan={subscription.plan}
					status={subscription.status}
					onManageSubscription={subscription.customerId ? handleManageSubscription : undefined}
				/>
			</div>
		{/if}

		<SubscriptionPlans
			{currentPlan}
			onSelectPlan={handleSelectPlan}
			billingPeriod={BillingOption.MONTHLY}
		/>

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
	</div>
</div>

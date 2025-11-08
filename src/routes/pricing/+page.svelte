<script>
	import { goto } from '$app/navigation';
	import { loadStripe } from '@stripe/stripe-js';
	import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';
	import { Loader2 } from 'lucide-svelte';
	
	import SubscriptionPlans from '$lib/components/students/SubscriptionPlans.svelte';
	import SubscriptionStatus from '$lib/components/students/SubscriptionStatus.svelte';

	let { data } = $props();
	let { user, subscription } = $derived(data);
	
	let isLoading = $state(false);
	let error = $state(null);

	async function handleSelectPlan(planId) {
		isLoading = true;
		error = null;

		try {
			// Create checkout session
			const response = await fetch('/api/stripe/checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ planId })
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Errore durante la creazione della sessione');
			}

			const { sessionId, url } = await response.json();

			// Redirect to Stripe Checkout
			if (url) {
				window.location.href = url;
			} else {
				// Fallback to using Stripe.js
				const stripe = await loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY);
				const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
				
				if (stripeError) {
					throw new Error(stripeError.message);
				}
			}
		} catch (err) {
			console.error('Error selecting plan:', err);
			error = err.message;
			isLoading = false;
		}
	}

	async function handleManageSubscription() {
		isLoading = true;
		error = null;

		try {
			const response = await fetch('/api/stripe/portal', {
				method: 'POST'
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Errore durante l\'apertura del portale');
			}

			const { url } = await response.json();
			window.location.href = url;
		} catch (err) {
			console.error('Error opening portal:', err);
			error = err.message;
			isLoading = false;
		}
	}
</script>

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-900">
	<div class="max-w-7xl mx-auto px-4 py-8">
		{#if error}
			<div class="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg">
				<p class="text-red-800 dark:text-red-200">{error}</p>
			</div>
		{/if}

		<SubscriptionPlans
			currentPlan={subscription?.plan || 'free'}
			onSelectPlan={handleSelectPlan}
		/>

		{#if isLoading}
			<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
				<div class="bg-white dark:bg-zinc-800 rounded-lg p-8 flex flex-col items-center gap-4">
					<Loader2 class="w-12 h-12 text-blue-600 animate-spin" />
					<p class="text-lg font-medium text-zinc-900 dark:text-zinc-100">
						Reindirizzamento in corso...
					</p>
				</div>
			</div>
		{/if}
	</div>
</div>


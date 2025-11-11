<script lang="ts">
	import { SUBSCRIPTION_PLANS, formatPrice, PLAN_DESCRIPTIONS, type SubscriptionPlan } from '$lib/stripe/config.js';
	import { BillingOption, getDisplayPrice } from '$lib/data/billing-options';
	import { Sparkles } from 'lucide-svelte';

	interface Props {
		currentPlan: SubscriptionPlan;
		onSelectPlan: (plan: SubscriptionPlan) => void;
		billingPeriod: BillingOption;
	}
	
	let { 
		currentPlan, 
		onSelectPlan,
		billingPeriod = BillingOption.MONTHLY
	}: Props = $props();

	const plans = Object.values(SUBSCRIPTION_PLANS);

	async function handleSelectPlan(plan: SubscriptionPlan) {
		if (plan.id === SUBSCRIPTION_PLANS.FREE.id || plan.id === currentPlan.id) return;
		
		if (onSelectPlan) {
			await onSelectPlan(plan);
		}
	}
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
	{#each plans as plan}
		<div
			class="relative bg-white dark:bg-zinc-800 rounded-2xl border-2 transition-all duration-200 
				{
					plan.popular
					? 'border-rose-400 shadow-xl scale-105'
					: 'border-zinc-200 dark:border-zinc-700'
				}"
		>
			{#if plan.popular}
				<div
					class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1"
				>
					<Sparkles class="w-4 h-4" />
					Più popolare
				</div>
			{/if}

			<div class="flex flex-col justify-between h-full p-6">
				<div class="flex flex-col gap-2">
					<h3 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
						{plan.name}
					</h3>

					<div class="mb-6">
						{#if plan.price > 0}
							{@const displayPrice = getDisplayPrice(plan, billingPeriod)}
							<div class="flex flex-col">
								<div class="flex items-baseline gap-2">
									<span class="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
										{formatPrice(displayPrice.price, plan.currency)}
									</span>
									<span class="text-zinc-600 dark:text-zinc-400">{displayPrice.period}</span>
								</div>
								{#if billingPeriod === BillingOption.SEMESTER}
									<div class="mt-1">
										<span class="text-sm text-zinc-500 dark:text-zinc-500 line-through">
											{formatPrice(plan.price * 6, plan.currency)}
										</span>
										<span class="text-sm text-rose-500 dark:text-rose-400 ml-2 font-medium">
											Risparmi {formatPrice((plan.price * 6) - displayPrice.price, plan.currency)}
										</span>
									</div>
								{/if}
							</div>
						{:else}
							<span class="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
								Gratis
							</span>
						{/if}
					</div>

					<p class="text-sm text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
						{PLAN_DESCRIPTIONS[plan.id]}
					</p>
				</div>

				<button
					onclick={() => handleSelectPlan(plan)}
					disabled={plan.id === SUBSCRIPTION_PLANS.FREE.id || currentPlan.id === plan.id}
					class="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 {plan.popular
						? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-lg hover:shadow-xl'
						: 'bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100'} disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if currentPlan.id === plan.id}
						Il tuo piano
					{:else if plan.id === SUBSCRIPTION_PLANS.FREE.id}
						Piano Free
					{:else}
						Seleziona
					{/if}
				</button>
			</div>
		</div>
	{/each}
</div>
<script lang="ts">
	import { CheckCircle, XCircle, Sparkles } from 'lucide-svelte';
	import { 
		SUBSCRIPTION_PLANS, 
		formatPrice, 
		FeaturesDetails, 
		canAccessFeature, 
		Features,
		type SubscriptionPlan,
	} from '$lib/stripe/config.js';
	import { BillingOption, getDisplayPrice } from '$lib/data/billing-options';

	interface Props {
		currentPlan?: SubscriptionPlan;
		onSelectPlan?: (plan: SubscriptionPlan) => void;
		billingPeriod?: BillingOption;
	}

	let { 
		currentPlan = SUBSCRIPTION_PLANS.FREE, 
		onSelectPlan,
		billingPeriod = BillingOption.MONTHLY,
	}: Props = $props();

	const plans = Object.values(SUBSCRIPTION_PLANS);
	const features = Object.values(Features);

	const td_width = 'w-56';

	async function handleSelectPlan(plan: SubscriptionPlan) {
		if (plan.id === SUBSCRIPTION_PLANS.FREE.id || plan.id === currentPlan.id) return;
			
		if (onSelectPlan) {
			await onSelectPlan(plan);
		}
	}
</script>

<div class="w-full overflow-x-auto">
	<div class="min-w-[800px]">
		<table class="w-full border-collapse">
			<thead>
				<tr class="border-b-2 border-zinc-500/25">
					<th class="text-left py-4 px-6 font-semibold text-zinc-900 dark:text-zinc-100 bg-transparent">
						Funzionalità
					</th>
					{#each plans as plan}
						<th class="text-center py-4 px-6 {td_width} {plan.popular ? 'bg-crimson-50 dark:bg-crimson-950/20 rounded-t-lg' : 'bg-transparent'}">
							<div class="flex flex-col items-center gap-2">
								<div class="relative">
									<span class="text-lg font-bold text-zinc-900 dark:text-zinc-100">
										{plan.name}
									</span>
									{#if plan.popular}
										<div
											class="absolute -top-2 -right-8 bg-gradient-to-r from-pink-600 to-crimson-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1"
										>
											<Sparkles class="w-3 h-3" />
										</div>
									{/if}
								</div>
							</div>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				<!-- Price Row -->
				<tr class="border-b border-zinc-500/25 bg-zinc-50 dark:bg-zinc-900/50">
					<td class="py-4 px-6 font-semibold text-zinc-900 dark:text-zinc-100">
						Prezzo
					</td>
					{#each plans as plan}
                        {@const displayPrice = getDisplayPrice(plan, billingPeriod)}
						<td class="py-4 px-6 text-center {plan.popular ? 'bg-crimson-50 dark:bg-crimson-950/20' : ''}">
							{#if plan.price > 0}
								<div class="flex flex-col items-center gap-1">
									<div class="flex items-baseline gap-1">
										<span class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
											{formatPrice(displayPrice.price, plan.currency)}
										</span>
										<span class="text-sm text-zinc-600 dark:text-zinc-400">
											{displayPrice.period}
										</span>
									</div>
									{#if billingPeriod === BillingOption.SEMESTER && plan.price > 0}
										<span class="text-xs text-zinc-500 dark:text-zinc-500 line-through">
											{formatPrice(plan.price * 6, plan.currency)}
										</span>
									{/if}
								</div>
							{:else}
								<span class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
									Gratis
								</span>
							{/if}
						</td>
					{/each}
				</tr>

				<!-- Features Rows -->
				{#each features as feature, index}
                    {@const Icon = FeaturesDetails[feature].icon}
					<tr class="border-b border-zinc-500/25 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/30 {index % 2 === 0 ? 'bg-white dark:bg-zinc-800' : 'bg-zinc-50 dark:bg-zinc-900/50'}">
						<td class="py-4 px-6">
							<div class="flex items-center gap-3">
								<Icon class="w-4 h-4 text-zinc-600 dark:text-zinc-400 flex-shrink-0" />
								<span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">
									{FeaturesDetails[feature].name}
								</span>
							</div>
						</td>
						{#each plans as plan}
							<td class="py-4 px-6 text-center {plan.popular ? 'bg-crimson-50 dark:bg-crimson-950/20' : ''}">
								{#if canAccessFeature(plan.id, feature)}
									<CheckCircle class="w-5 h-5 text-green-500 mx-auto" />
								{:else}
									<XCircle class="w-5 h-5 text-zinc-300 dark:text-zinc-700 mx-auto" />
								{/if}
							</td>
						{/each}
					</tr>
				{/each}

				<!-- Tutoring Hours Row (if applicable) -->
				{#if plans.some(p => p.tutoring_hours > 0)}
                    {@const Icon = FeaturesDetails[Features.TUTORING].icon}
					<tr class="border-b border-zinc-500/25 bg-zinc-50 dark:bg-zinc-900/50">
						<td class="py-4 px-6">
							<div class="flex items-center gap-3">
								<Icon class="w-4 h-4 text-zinc-600 dark:text-zinc-400 flex-shrink-0" />
								<span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">
									Ore di ripetizioni a settimana
								</span>
							</div>
						</td>
						{#each plans as plan}
							<td class="py-4 px-6 text-center {plan.popular ? 'bg-crimson-50 dark:bg-crimson-950/20' : ''}">
								{#if plan.tutoring_hours > 0}
									<span class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
										{plan.tutoring_hours}h
									</span>
								{:else}
									<span class="text-sm text-zinc-400 dark:text-zinc-600">—</span>
								{/if}
							</td>
						{/each}
					</tr>
				{/if}

				<!-- Action Row -->
				<tr>
					<td class="py-6 px-6"></td>
					{#each plans as plan}
						<td class="py-6 px-6 text-center {plan.popular ? 'bg-crimson-50 dark:bg-crimson-950/20 rounded-b-lg' : ''}">
							<button
								onclick={() => handleSelectPlan(plan)}
								disabled={plan.id === SUBSCRIPTION_PLANS.FREE.id || currentPlan.id === plan.id}
								class="w-full max-w-[140px] mx-auto py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 {plan.popular
									? 'bg-gradient-to-r from-pink-600 to-crimson-600 hover:from-pink-700 hover:to-crimson-700 text-white shadow-md hover:shadow-lg'
									: 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100'} disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{#if currentPlan.id === plan.id}
									Il tuo piano
								{:else if plan.id === SUBSCRIPTION_PLANS.FREE.id}
									Piano Free
								{:else}
									Seleziona
								{/if}
							</button>
						</td>
					{/each}
				</tr>
			</tbody>
		</table>
	</div>
</div>

<style>
	table {
		border-spacing: 0;
	}
	
	th, td {
		border-collapse: collapse;
	}
</style>


<script>
	import { CheckCircle, Sparkles, XCircle } from 'lucide-svelte';
	import { SUBSCRIPTION_PLANS, formatPrice, FeaturesDetails, canAccessFeature, Features } from '$lib/stripe/config.js';

	let { currentPlan = 'free', onSelectPlan } = $props();

	const plans = Object.values(SUBSCRIPTION_PLANS);

	async function handleSelectPlan(planId) {
		if (planId === 'free' || planId === currentPlan) return;
		
		if (onSelectPlan) {
			await onSelectPlan(planId);
		}
	}
</script>

<div class="py-12 px-4">
	<div class="max-w-7xl mx-auto">
		<div class="text-center mb-12">
			<h2 class="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
				Scegli il piano adatto a te
			</h2>
			<p class="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
				Inizia gratis e passa a Premium quando vuoi. Puoi annullare in qualsiasi momento.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each plans as plan}
				<div
					class="relative bg-white dark:bg-zinc-800 rounded-2xl border-2 transition-all duration-200 {plan.popular
						? 'border-rose-400 shadow-xl scale-105'
						: 'border-zinc-200 dark:border-zinc-700'} {currentPlan === plan.id ? 'ring-2 ring-rose-400' : ''}"
				>
					{#if plan.popular}
						<div
							class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1"
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
									<span class="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
										{formatPrice(plan.price, plan.currency)}
									</span>
									<span class="text-zinc-600 dark:text-zinc-400">/mese</span>
								{:else}
									<span class="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
										Gratis
									</span>
								{/if}
							</div>

							<ul class="space-y-3 mb-8">
								{#each Object.values(Features) as feature}
									<!-- {@const Icon = FeaturesDetails[feature].icon} -->
									{@const access = canAccessFeature(plan.id, feature)}
									<li class="flex items-start gap-3 relative">
										{#if access}
											<CheckCircle class="size-4 text-green-500 flex-shrink-0 mt-0.5" />
										{:else}
											<XCircle class="size-4 text-rose-500 flex-shrink-0 mt-0.5" />
										{/if}
										<!-- <Icon class="size-4 text-zinc-700 dark:text-zinc-300 flex-shrink-0 mt-0.5" /> -->
										<span class="text-sm text-zinc-700 dark:text-zinc-300 {access ? '' : 'line-through'}">{FeaturesDetails[feature].name}</span>
									</li>
								{/each}
							</ul>
						</div>


						<button
							onclick={() => handleSelectPlan(plan.id)}
							disabled={plan.id === 'free' || currentPlan === plan.id}
							class="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 {plan.popular
								? 'bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
								: 'bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100'} disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{#if currentPlan === plan.id}
								Il tuo piano
							{:else if plan.id === 'free'}
								Piano base
							{:else}
								Seleziona
							{/if}
						</button>
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-12 text-center">
			<p class="text-sm text-zinc-600 dark:text-zinc-400">
				Prova gratuita di 7 giorni per tutti i piani Premium. Non serve la carta di credito.
			</p>
		</div>
	</div>
</div>


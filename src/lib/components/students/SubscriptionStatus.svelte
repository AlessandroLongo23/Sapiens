<script>
	import { Crown, CreditCard, Calendar } from 'lucide-svelte';
	import { getPlanById, formatPrice } from '$lib/stripe/config.js';

	let { 
		plan = 'free', 
		status = 'active', 
		onManageSubscription 
	} = $props();

	const planInfo = $derived(getPlanById(plan));
	
	const statusColors = {
		active: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
		past_due: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
		canceled: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
		trialing: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
	};

	const statusText = {
		active: 'Attivo',
		past_due: 'Pagamento in sospeso',
		canceled: 'Cancellato',
		trialing: 'Periodo di prova'
	};
</script>

<div class="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
	<div class="flex items-start justify-between mb-4">
		<div class="flex items-center gap-3">
			<div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
				<Crown class="w-6 h-6 text-white" />
			</div>
			<div>
				<h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-100">
					{planInfo.name}
				</h3>
				<span class="text-sm px-2 py-1 rounded-full {statusColors[status] || statusColors.active}">
					{statusText[status] || 'Attivo'}
				</span>
			</div>
		</div>
		
		{#if plan !== 'free'}
			<div class="text-right">
				<p class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
					{formatPrice(planInfo.price, planInfo.currency)}
				</p>
				<p class="text-sm text-zinc-600 dark:text-zinc-400">al mese</p>
			</div>
		{/if}
	</div>

	<div class="space-y-3 mb-6">
		<div class="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
			<CreditCard class="w-4 h-4 text-zinc-500" />
			<span>
				{#if plan === 'free'}
					Nessun metodo di pagamento richiesto
				{:else}
					Pagamento automatico mensile
				{/if}
			</span>
		</div>
		
		{#if status === 'trialing'}
			<div class="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
				<Calendar class="w-4 h-4" />
				<span>Prova gratuita attiva</span>
			</div>
		{/if}
	</div>

	<div class="flex gap-3">
		{#if plan !== 'free' && onManageSubscription}
			<button
				onclick={onManageSubscription}
				class="flex-1 py-2 px-4 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 rounded-lg font-medium transition-colors"
			>
				Gestisci abbonamento
			</button>
		{/if}
	</div>
</div>


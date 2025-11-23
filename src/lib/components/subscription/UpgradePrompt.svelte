<script>
	import { Lock, Sparkles } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { getPlanById } from '$lib/stripe/config.js';

	let { 
		feature = 'questa funzionalità',
		requiredPlan = 'base',
		size = 'medium' 
	} = $props();

	const plan = $derived(getPlanById(requiredPlan));

	const sizes = {
		small: 'p-4 text-sm',
		medium: 'p-6 text-base',
		large: 'p-8 text-lg'
	};
</script>

<div class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl border-2 border-blue-200 dark:border-blue-900 {sizes[size]}">
	<div class="flex items-start gap-4">
		<div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
			<Lock class="w-6 h-6 text-white" />
		</div>
		
		<div class="flex-1">
			<h3 class="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
				Aggiorna per sbloccare {feature}
				<Sparkles class="w-4 h-4 text-yellow-500" />
			</h3>
			<p class="text-zinc-600 dark:text-zinc-400 mb-4">
				Questa funzionalità è disponibile con il piano <strong>{plan.name}</strong> e superiori.
				Aggiorna ora per accedere a tutte le funzionalità premium.
			</p>
			
			<button
				onclick={() => goto('/student/subscription')}
				class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
			>
				Vedi i piani
			</button>
		</div>
	</div>
</div>


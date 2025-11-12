<script>
	import { Crown, Sparkles } from 'lucide-svelte';
	import { getSubscriptionBadge } from '$lib/utils/subscription.svelte.js';

	let { user, showIcon = true } = $props();
	
	const badge = $derived(getSubscriptionBadge(user));

	const colors = {
		zinc: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700',
		blue: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700',
		purple: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700',
		amber: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white border-amber-500'
	};

	const icons = {
		free: null,
		lite: Sparkles,
		base: Crown,
		pro: Crown
	};

	const Icon = $derived(icons[badge.color] || Crown);
</script>

{#if badge}
	<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold {colors[badge.color]}">
		{#if showIcon && Icon}
			<Icon class="w-3.5 h-3.5" />
		{/if}
		<span>{badge.text}</span>
	</div>
{/if}


<script lang="ts">
	import type { Component } from 'svelte';

	interface Props {
		label: string;
		missing: number;
		total: number;
		icon: Component<any>;
		color: 'blue' | 'emerald' | 'violet' | 'amber';
	}

	let { label, missing, total, icon: Icon, color }: Props = $props();

	let percent = $derived(total > 0 ? Math.round((missing / total) * 100) : 0);
	let severity = $derived(percent > 50 ? 'high' : percent > 25 ? 'medium' : 'low');

	const colorConfig = {
		blue: 'text-blue-500 dark:text-blue-400',
		emerald: 'text-emerald-500 dark:text-emerald-400',
		violet: 'text-violet-500 dark:text-violet-400',
		amber: 'text-amber-500 dark:text-amber-400'
	};

	const severityConfig = {
		high: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50',
		medium: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50',
		low: 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50'
	};

	const severityText = {
		high: 'text-red-600 dark:text-red-400',
		medium: 'text-amber-600 dark:text-amber-400',
		low: 'text-zinc-600 dark:text-zinc-400'
	};
</script>

<div class="flex items-center gap-3 p-3 rounded-xl border {severityConfig[severity]} transition-all">
	<div class="p-2 rounded-lg bg-white dark:bg-zinc-800">
		<Icon class="size-4 {colorConfig[color]}" />
	</div>
	
	<div class="flex-1 min-w-0">
		<p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</p>
		<p class="text-xs {severityText[severity]}">
			{#if missing === 0}
				<span class="text-emerald-600 dark:text-emerald-400">Completo!</span>
			{:else}
				{missing} mancanti su {total}
			{/if}
		</p>
	</div>
	
	{#if missing > 0}
		<div class="text-right">
			<p class="text-lg font-bold {severityText[severity]}">{percent}%</p>
		</div>
	{/if}
</div>


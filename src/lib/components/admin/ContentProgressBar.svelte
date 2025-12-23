<script lang="ts">
	import type { Component } from 'svelte';

	interface Props {
		label: string;
		value: number;
		total: number;
		icon: Component<any>;
		color: 'blue' | 'emerald' | 'violet' | 'amber';
	}

	let { label, value, total, icon: Icon, color }: Props = $props();

	let percent = $derived(total > 0 ? Math.round((value / total) * 100) : 0);

	const colorConfig = {
		blue: {
			icon: 'text-blue-500 dark:text-blue-400',
			bar: 'from-blue-500 to-blue-400',
			bg: 'bg-blue-500/10'
		},
		emerald: {
			icon: 'text-emerald-500 dark:text-emerald-400',
			bar: 'from-emerald-500 to-emerald-400',
			bg: 'bg-emerald-500/10'
		},
		violet: {
			icon: 'text-violet-500 dark:text-violet-400',
			bar: 'from-violet-500 to-violet-400',
			bg: 'bg-violet-500/10'
		},
		amber: {
			icon: 'text-amber-500 dark:text-amber-400',
			bar: 'from-amber-500 to-amber-400',
			bg: 'bg-amber-500/10'
		}
	};

	let colors = $derived(colorConfig[color]);
</script>

<div class="space-y-2">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<div class="p-1 rounded-md {colors.bg}">
				<Icon class="size-3.5 {colors.icon}" />
			</div>
			<span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
		</div>
		<div class="flex items-center gap-2">
			<span class="text-xs text-zinc-500 tabular-nums">{value}/{total}</span>
			<span class="text-sm font-bold text-zinc-900 dark:text-zinc-100 tabular-nums w-10 text-right">{percent}%</span>
		</div>
	</div>
	<div class="h-2 bg-zinc-100 dark:bg-zinc-700/50 rounded-full overflow-hidden">
		<div 
			class="h-full bg-gradient-to-r {colors.bar} rounded-full transition-all duration-700 ease-out"
			style="width: {percent}%"
		></div>
	</div>
</div>


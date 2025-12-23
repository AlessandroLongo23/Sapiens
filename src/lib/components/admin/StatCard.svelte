<script lang="ts">
	import type { Component } from 'svelte';

	interface Props {
		value: number;
		label: string;
		icon: Component<any>;
		color?: 'rose' | 'blue' | 'emerald' | 'violet' | 'amber' | 'teal' | 'indigo' | 'zinc';
		href?: string;
	}

	let { value, label, icon: Icon, color = 'zinc', href }: Props = $props();

	const colorClasses = {
		rose: 'bg-rose-500/10 text-rose-500 dark:text-rose-400',
		blue: 'bg-blue-500/10 text-blue-500 dark:text-blue-400',
		emerald: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400',
		violet: 'bg-violet-500/10 text-violet-500 dark:text-violet-400',
		amber: 'bg-amber-500/10 text-amber-500 dark:text-amber-400',
		teal: 'bg-teal-500/10 text-teal-500 dark:text-teal-400',
		indigo: 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400',
		zinc: 'bg-zinc-500/10 text-zinc-500 dark:text-zinc-400'
	};

	const hoverClasses = href 
		? 'cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0' 
		: '';
</script>

{#if href}
	<a 
		{href}
		class="block bg-white dark:bg-zinc-800/60 rounded-2xl p-4 border border-zinc-200/60 dark:border-zinc-700/60 backdrop-blur-sm transition-all duration-200 {hoverClasses}"
	>
		<div class="flex items-center gap-3">
			<div class="p-2.5 rounded-xl {colorClasses[color]}">
				<Icon class="size-5" />
			</div>
			<div>
				<p class="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tabular-nums">{value}</p>
				<p class="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
			</div>
		</div>
	</a>
{:else}
	<div class="bg-white dark:bg-zinc-800/60 rounded-2xl p-4 border border-zinc-200/60 dark:border-zinc-700/60 backdrop-blur-sm">
		<div class="flex items-center gap-3">
			<div class="p-2.5 rounded-xl {colorClasses[color]}">
				<Icon class="size-5" />
			</div>
			<div>
				<p class="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tabular-nums">{value}</p>
				<p class="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
			</div>
		</div>
	</div>
{/if}


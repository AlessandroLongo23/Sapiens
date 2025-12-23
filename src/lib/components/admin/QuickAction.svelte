<script lang="ts">
	import type { Component } from 'svelte';
	import { ChevronRight } from 'lucide-svelte';

	interface Props {
		title: string;
		description: string;
		icon: Component<any>;
		href: string;
		color?: 'rose' | 'blue' | 'emerald' | 'violet' | 'amber';
	}

	let { title, description, icon: Icon, href, color = 'rose' }: Props = $props();

	const colorConfig = {
		rose: {
			bg: 'bg-rose-500',
			shadow: 'shadow-rose-500/25 hover:shadow-rose-500/40',
			iconBg: 'bg-rose-600/50'
		},
		blue: {
			bg: 'bg-blue-500',
			shadow: 'shadow-blue-500/25 hover:shadow-blue-500/40',
			iconBg: 'bg-blue-600/50'
		},
		emerald: {
			bg: 'bg-emerald-500',
			shadow: 'shadow-emerald-500/25 hover:shadow-emerald-500/40',
			iconBg: 'bg-emerald-600/50'
		},
		violet: {
			bg: 'bg-violet-500',
			shadow: 'shadow-violet-500/25 hover:shadow-violet-500/40',
			iconBg: 'bg-violet-600/50'
		},
		amber: {
			bg: 'bg-amber-500',
			shadow: 'shadow-amber-500/25 hover:shadow-amber-500/40',
			iconBg: 'bg-amber-600/50'
		}
	};

	let colors = $derived(colorConfig[color]);
</script>

<a 
	{href}
	class="group relative block overflow-hidden rounded-2xl {colors.bg} p-5 text-white shadow-lg {colors.shadow} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
>
	<div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
	<div class="absolute -right-4 -top-4 size-24 rounded-full {colors.iconBg} blur-2xl"></div>
	
	<div class="relative flex items-center justify-between">
		<div class="flex items-center gap-4">
			<div class="p-2.5 rounded-xl {colors.iconBg} backdrop-blur-sm">
				<Icon class="size-5" />
			</div>
			<div>
				<h3 class="font-semibold text-white">{title}</h3>
				<p class="text-sm text-white/75">{description}</p>
			</div>
		</div>
		<ChevronRight class="size-5 text-white/50 transition-transform group-hover:translate-x-1 group-hover:text-white/80" />
	</div>
</a>


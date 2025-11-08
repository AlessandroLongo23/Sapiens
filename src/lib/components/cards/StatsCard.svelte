<script>
	import * as ls from 'lucide-svelte';
	
	let { value, label, icon, color } = $props();
</script>

<div class="relative glass-effect rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-elegant">
	<div class="absolute -right-4 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
		<icon class="w-24 h-24 sm:w-28 sm:h-28 {color}" />
	</div>
	
	<div class="relative z-10">
		<div class="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-800 dark:text-zinc-100 mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-300">
			{value}
		</div>
		<div class="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 font-medium leading-tight">
			{label}
		</div>
	</div>
</div> 
<script>
	import { createEventDispatcher } from 'svelte';
	import * as ls from 'lucide-svelte';

	let { 
		isSidebarOpen = $bindable(true),
		sidebarElement = $bindable(''),	
		children,
		classes = ''
	} = $props();

	const dispatch = createEventDispatcher();
	
	const toggleSidebar = () => {
		isSidebarOpen = !isSidebarOpen;
		
		dispatch('toggle', { isSidebarOpen });
		
		if (isSidebarOpen) {
			setTimeout(() => {
				window.dispatchEvent(new Event('resize'));
			}, 300);
		}
	}
</script>

<div 
	id="sidebar" 
	bind:this={sidebarElement}
	class="h-full fixed left-0 top-0 transition-all duration-300 flex flex-col {isSidebarOpen ? 'w-60' : 'w-12'} {classes}" 
>
	<div class="p-3 flex items-center justify-between border-b border-zinc-700/50 flex-shrink-0">
		{#if isSidebarOpen}
			<h2 class="text-sm font-medium text-white/90 uppercase tracking-wider">Controls</h2>
		{/if}

		<button
			onclick={toggleSidebar}
			class="p-1 rounded-md hover:bg-zinc-700/70 transition-all text-white/80 hover:text-white/100"
			aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
		>
			{#if isSidebarOpen}
				<ls.ChevronLeft size={18} />
			{:else}
				<ls.ChevronRight size={18} />
			{/if}
		</button>
	</div>
	
	{#if isSidebarOpen}
		<div class="flex-1 overflow-hidden">
			{@render children()}
		</div>
	{/if}
</div>
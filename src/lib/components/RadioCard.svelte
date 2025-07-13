<script>
	let { 
		value, 
		selectedValue = $bindable(), 
		disabled = false,
		children
	} = $props();
	
	const isSelected = $derived(selectedValue === value);
	
	function handleSelect() {
		if (!disabled) {
			selectedValue = value;
		}
	}
</script>

<button
	class="group relative w-full text-left p-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 {
		isSelected 
			? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md' 
			: 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm'
	} {disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
	onclick={handleSelect}
	disabled={disabled}
>
	<!-- Radio Circle -->
	<div class="absolute top-3 right-3">
		<div class="relative w-4 h-4">
			<div class="w-4 h-4 rounded-full border-2 transition-all duration-300 {
				isSelected ? 'border-blue-500 bg-blue-500' : 'border-zinc-300 group-hover:border-zinc-400'
			}"></div>
			
			{#if isSelected}
				<div class="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 scale-100"></div>
			{/if}
		</div>
	</div>
	
	<!-- Content Area with right padding to avoid radio circle -->
	<div class="pr-6">
		{@render children()}
	</div>
	
	<!-- Selected overlay effect -->
	{#if isSelected}
		<div class="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 pointer-events-none"></div>
	{/if}
</button> 
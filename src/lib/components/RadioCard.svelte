<script>
	let { 
		value, 
		selectedValue = $bindable(), 
		title, 
		subtitle = '', 
		price = '', 
		icon = null,
		disabled = false,
		editable = false,
		editableValue = $bindable('')
	} = $props();
	
	const isSelected = $derived(selectedValue === value);
	const isEditable = $derived(editable && isSelected);
	
	function handleSelect() {
		if (!disabled) {
			selectedValue = value;
			if (editable) {
				// Focus the input after a short delay to ensure it's rendered
				setTimeout(() => {
					const input = document.querySelector(`input[data-editable="${value}"]`);
					if (input) input.focus();
				}, 100);
			}
		}
	}
	
	function handleInputChange(event) {
		editableValue = event.target.value;
	}
</script>

<button
	class="group relative w-full text-left p-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 {
		isSelected 
			? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md' 
			: 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
	} {disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
	onclick={handleSelect}
	disabled={disabled}
>
	<!-- Selection indicator -->
	<div class="absolute top-3 right-3">
		<div class="relative w-4 h-4">
			<!-- Outer circle -->
			<div class="w-4 h-4 rounded-full border-2 transition-all duration-300 {
				isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300 group-hover:border-slate-400'
			}"></div>
			
			<!-- Inner circle -->
			{#if isSelected}
				<div class="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 scale-100"></div>
			{/if}
		</div>
	</div>
	
	<!-- Content -->
	<div class="pr-6">
		<!-- Icon if provided -->
		{#if icon}
			<div class="mb-3">
				<div class="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center {
					isSelected ? 'from-blue-100 to-indigo-100' : ''
				} transition-all duration-300">
					<svelte:component this={icon} class="w-4 h-4 {isSelected ? 'text-blue-600' : 'text-slate-600'} transition-colors duration-300" />
				</div>
			</div>
		{/if}
		
		<!-- Title or editable input -->
		{#if isEditable}
			<input
				type="text"
				bind:value={editableValue}
				placeholder="Inserisci la materia..."
				data-editable={value}
				class="w-full bg-transparent border-none outline-none text-lg font-semibold text-blue-900 placeholder-blue-600/60"
				onclick={(e) => e.stopPropagation()}
				oninput={handleInputChange}
			/>
		{:else}
			<div class="text-base font-semibold {
				isSelected ? 'text-blue-900' : 'text-slate-800 group-hover:text-slate-900'
			} transition-colors duration-300 mb-1">
				{title}
			</div>
		{/if}
		
		<!-- Subtitle -->
		{#if subtitle && !isEditable}
			<div class="text-sm {
				isSelected ? 'text-blue-700' : 'text-slate-600'
			} transition-colors duration-300 mb-1">
				{subtitle}
			</div>
		{/if}
		
		<!-- Price -->
		{#if price}
			<div class="text-lg font-bold {
				isSelected ? 'text-blue-600' : 'text-slate-700'
			} transition-colors duration-300">
				{price}
			</div>
		{/if}
	</div>
	
	<!-- Subtle glow effect for selected state -->
	{#if isSelected}
		<div class="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 pointer-events-none"></div>
	{/if}
</button> 
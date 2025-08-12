<script>
	let { 
		value, 
		selectedValues = $bindable([]), 
		title, 
		editable = false,
		editableValue = $bindable('')
	} = $props();
	
	const isSelected = $derived(selectedValues.includes(value));
	const isEditable = $derived(editable && isSelected);
	
	function handleToggle() {
		if (isSelected) {
			selectedValues = selectedValues.filter(v => v !== value);
			if (editable) {
				editableValue = '';
			}
		} else {
			selectedValues = [...selectedValues, value];
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
    class="group relative text-left px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 {
        isSelected 
            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-md' 
            : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-sm'
    } cursor-pointer"
	onclick={handleToggle}
>
	<!-- Selection indicator (checkbox) -->
	<div class="absolute top-2 right-2">
		<div class="relative w-4 h-4">
			<!-- Checkbox -->
            <div class="w-4 h-4 rounded border-2 transition-all duration-300 {
                isSelected ? 'border-blue-500 bg-blue-500' : 'border-zinc-300 dark:border-zinc-600 group-hover:border-zinc-400 dark:group-hover:border-zinc-500'
            }"></div>
			
			<!-- Checkmark -->
			{#if isSelected}
				<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
					<svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
					</svg>
				</div>
			{/if}
		</div>
	</div>
	
	<!-- Content -->
	<div class="pr-6">
		<!-- Title or editable input -->
		{#if isEditable}
            <input
				type="text"
				bind:value={editableValue}
				placeholder="Inserisci la materia..."
				data-editable={value}
                class="w-full bg-transparent border-none outline-none text-sm font-semibold text-blue-900 dark:text-blue-300 placeholder-blue-600/60 dark:placeholder-blue-300/60"
				onclick={(e) => e.stopPropagation()}
				oninput={handleInputChange}
			/>
		{:else}
            <div class="text-sm font-semibold {
                isSelected ? 'text-blue-900 dark:text-blue-300' : 'text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
            } transition-colors duration-300">
				{title}
			</div>
		{/if}
	</div>
	
	<!-- Subtle glow effect for selected state -->
	{#if isSelected}
		<div class="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 pointer-events-none"></div>
	{/if}
</button> 
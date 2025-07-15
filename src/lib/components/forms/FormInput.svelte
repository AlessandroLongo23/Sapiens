<script>
	import { createEventDispatcher } from 'svelte';
	
	let { 
		value = $bindable(''),
		type = 'text',
		placeholder = '',
		label = '',
		required = false,
		disabled = false,
		error = '',
		icon = null,
		onchange = null
	} = $props();
	
	const dispatch = createEventDispatcher();
	let inputElement;
	
	const id = `form-input-${Math.random().toString(36).substring(2, 9)}`;
	
	const hasError = $derived(error && error.length > 0);
	const hasValue = $derived(value && value.length > 0);
	
	function handleInput(event) {
		value = event.target.value;
		onchange?.(value);
		dispatch('input', { value });
	}
	
	function handleFocus(event) {
		dispatch('focus', event);
	}
	
	function handleBlur(event) {
		dispatch('blur', event);
	}
</script>

<div class="space-y-2">
	<!-- Label -->
	{#if label}
		<label for={id} class="block text-sm font-medium text-zinc-700 mb-2">
			{label}
			{#if required}
				<span class="text-red-500 ml-1">*</span>
			{/if}
		</label>
	{/if}
	
	<!-- Input container -->
	<div class="relative">
		<!-- Icon -->
		{#if icon}
			<div class="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
				{@render icon({ class: `w-5 h-5 ${hasError ? 'text-red-500' : hasValue ? 'text-blue-600' : 'text-zinc-400'} transition-colors duration-300` })}
			</div>
		{/if}
		
		<!-- Input field -->
		<input
			bind:this={inputElement}
			{id}
			bind:value
			{type}
			{placeholder}
			{required}
			{disabled}
			class="w-full px-4 py-3 {icon ? 'pl-12' : ''} rounded-xl border-2 transition-all duration-300 bg-white focus:outline-none {
				hasError 
					? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
					: hasValue
						? 'border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
						: 'border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-zinc-300'
			} {disabled ? 'opacity-50 cursor-not-allowed bg-zinc-50' : ''}"
			oninput={handleInput}
			onfocus={handleFocus}
			onblur={handleBlur}
		/>
		
		<!-- Focus ring effect -->
		<div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 transition-opacity duration-300 pointer-events-none {
			!hasError && (hasValue) ? 'opacity-100' : ''
		}"></div>
	</div>
	
	<!-- Error message -->
	{#if hasError}
		<div class="flex items-center space-x-2 text-red-600 text-sm animate-in slide-in-from-top-1 duration-300">
			<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span>{error}</span>
		</div>
	{/if}
</div> 
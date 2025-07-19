<script>
	import { createEventDispatcher } from 'svelte';
	import * as ls from 'lucide-svelte';

	let { 
		isSidebarOpen = $bindable(true),
		sidebarElement = $bindable(''),	
		children,
		classes = '',
		side = 'left',
		type = "move", // shrink or move
		maxWidth = '60',
		minWidth = '12',
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

	// Convert Tailwind spacing values to rem (each unit is 0.25rem)
	let maxWidthRem = $derived(`${parseInt(maxWidth) * 0.25}rem`);
	let minWidthRem = $derived(`${parseInt(minWidth) * 0.25}rem`);

	// Static Tailwind classes for positioning
	let staticClasses = $derived.by(() => {
		if (side === 'left') {
			return 'left-0';
		} else {
			return 'right-0';
		}
	});

	// Dynamic inline styles for width and transform
	let dynamicStyles = $derived.by(() => {
		if (type === 'shrink') {
			return {
				width: isSidebarOpen ? maxWidthRem : minWidthRem,
				transform: 'none'
			};
		} else if (type === 'move') {
			const translateValue = isSidebarOpen ? '0' : 
				side === 'left' ? `-${maxWidthRem}` : maxWidthRem;
			
			return {
				width: maxWidthRem,
				transform: `translateX(${translateValue})`
			};
		}
		return {};
	});
</script>	

<div 
	id="sidebar" 
	bind:this={sidebarElement}
	class="h-full flex flex-col fixed top-0 transition-all duration-300 overflow-hidden {staticClasses} {classes}"
	style={Object.entries(dynamicStyles).map(([key, value]) => `${key}: ${value}`).join('; ')}
>
	{@render children()}
</div>
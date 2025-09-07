<script>
	import { createEventDispatcher } from 'svelte';
	import * as ls from 'lucide-svelte';

	let { 
		isSidebarOpen = $bindable(true),
		sidebarElement = $bindable(''),	
		children,
		classes = '',
		side = 'left',
		type = "move", 
		maxWidth = '60',
		minWidth = '12',
		useInlineWidth = true,
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

	
	let maxWidthRem = $derived(`${parseInt(maxWidth) * 0.25}rem`);
	let minWidthRem = $derived(`${parseInt(minWidth) * 0.25}rem`);

	
	let staticClasses = $derived.by(() => {
		if (side === 'left') {
			return 'left-0';
		} else {
			return 'right-0';
		}
	});

	
	let dynamicStyles = $derived.by(() => {
		if (type === 'shrink') {
			return {
				...(useInlineWidth ? { width: isSidebarOpen ? maxWidthRem : minWidthRem } : {}),
				transform: 'none'
			};
		} else if (type === 'move') {
			const translateValue = isSidebarOpen ? '0' : 
				side === 'left' ? `-${maxWidthRem}` : maxWidthRem;
			
			return {
				...(useInlineWidth ? { width: maxWidthRem } : {}),
				transform: useInlineWidth ? `translateX(${translateValue})` : 'none'
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
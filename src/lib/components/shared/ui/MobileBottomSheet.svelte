<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import * as ls from 'lucide-svelte';
	
	let { 
		isOpen = $bindable(false), 
		title = '', 
		height = '50vh', 
		contentComponent = null, 
		...props 
	} = $props();
	
	const dispatch = createEventDispatcher();
	
	function close() {
		dispatch('close');
	}
	
	let startY = 0;
	let currentY = 0;
	let sheetElement = $state(null);
	let isDragging = $state(false);
	let translateY = $state(0);
	
	function handleTouchStart(event) {
		startY = event.touches[0].clientY;
		isDragging = true;
	}
	
	function handleTouchMove(event) {
		if (!isDragging) return;
		currentY = event.touches[0].clientY;
		const diff = currentY - startY;
		if (diff > 0) {
			translateY = diff;
		}
	}
	
	function handleTouchEnd() {
		if (!isDragging) return;
		isDragging = false;
		
		if (translateY > 100) {
			close();
		} else {
			translateY = 0;
		}
	}
	
	$effect(() => {
		if (isOpen) {
			translateY = 0;
			// Prevent body scroll when sheet is open
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	});
	
	onMount(() => {
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

{#if isOpen}
	<!-- Overlay -->
	<button 
		class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 border-0"
		onclick={close}
		transition:fade={{ duration: 200 }}
		aria-label="Close modal"
	></button>
	
	<!-- Bottom Sheet -->
	<div 
		class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 rounded-t-2xl shadow-lg"
		style="height: {height}; transform: translateY({translateY}px); transition: transform 0.2s ease-out;"
		bind:this={sheetElement}
		transition:fly={{ y: '100%', duration: 300 }}
		ontouchstart={handleTouchStart}
		ontouchmove={handleTouchMove}
		ontouchend={handleTouchEnd}
	>
		<!-- Handle for dragging -->
		<div class="w-full flex justify-center pt-2 pb-4 cursor-grab active:cursor-grabbing">
			<div class="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
		</div>
		
		<!-- Header -->
		<div class="px-4 pb-3 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-700">
			<h2 class="text-lg font-medium text-zinc-900 dark:text-zinc-50">
				{title}
			</h2>
			<button 
				onclick={close}
				class="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
				aria-label="Close"
			>
				<ls.X size={18} />
			</button>
		</div>
		
		<!-- Content -->
		<div class="p-4 overflow-y-auto" style="max-height: calc({height} - 80px);">
			{#if contentComponent}
				{@const Component = contentComponent}
				<Component {...props} />
			{/if}
		</div>
	</div>
{/if}
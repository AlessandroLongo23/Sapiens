<script>
	import { onMount, onDestroy } from 'svelte';
	
	let { 
		images = [], 
		alt = '',
		duration = 5000,
		offset = 0,
		className = '' 
	} = $props();
	
	let currentIndex = $state(0);
	let intervalId = null;
	let transitioning = $state(true);
	
	const hasMultipleImages = $derived(images.length > 1);

	onMount(() => {
		if (hasMultipleImages) {
			const timeoutId = setTimeout(() => {
				startSlideshow();
			}, offset);

			return () => {
				clearTimeout(timeoutId);
			};
		}
	});
	
	onDestroy(() => {
		stopSlideshow();
	});
	
	function advanceSlide() {
		transitioning = true;
		currentIndex = currentIndex + 1;
	}

	function startSlideshow() {
        stopSlideshow();
        intervalId = setInterval(advanceSlide, duration);
	}
	
	function stopSlideshow() {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
	}
	
	function handleMouseEnter() {
		stopSlideshow();
	}
	
	function handleMouseLeave() {
		if (hasMultipleImages) {
			startSlideshow();
		}
	}

	function handleTransitionEnd() {
		if (currentIndex >= images.length) {
			transitioning = false;
			currentIndex = 0;
		}
	}
</script>

<div 
	role="region"
	aria-label="Image slideshow"
	class="relative w-full h-full overflow-hidden {className}"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
>
	{#if hasMultipleImages}
		{@const loopedImages = [...images, images[0]]}
		<div class="relative w-full h-full" ontransitionend={handleTransitionEnd}>
			{#each loopedImages as image, index}
				<div 
					class="absolute inset-0"
					class:transition-transform={transitioning}
					class:duration-700={transitioning}
					class:ease-in-out={transitioning}
					style="transform: translateX({(index - currentIndex) * 100}%)"
				>
					<img 
						src={image} 
						{alt} 
						class="w-full h-full object-cover"
						loading="lazy"
					/>
				</div>
			{/each}
		</div>
		
		<div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
			{#each images as _, index}
				<div 
					class="w-2 h-2 rounded-full transition-colors duration-300 {
						index === (currentIndex % images.length)
							? 'bg-white shadow-lg' 
							: 'bg-white/50'
					}"
				></div>
			{/each}
		</div>
	{:else if images.length === 1}
		<img 
			src={images[0]} 
			{alt} 
			class="w-full h-full object-cover"
		/>
	{/if}
</div> 
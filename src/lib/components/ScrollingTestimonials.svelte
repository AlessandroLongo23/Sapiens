<script>
	import { onMount, onDestroy } from 'svelte';
	import TestimonialCard from './TestimonialCard.svelte';
	
	let { 
		testimonials = [],
		scrollSpeed = 50, // pixels per second
		className = ''
	} = $props();
	
	let scrollContainer;
	let animationId;
	let scrollPosition = $state(0);
	let containerWidth = $state(0);
	let contentWidth = $state(0);
	let isPaused = $state(false);
	
	// Double the testimonials for seamless looping
	const loopedTestimonials = $derived([...testimonials, ...testimonials]);
	
	onMount(() => {
		if (scrollContainer) {
			updateDimensions();
			startScrolling();
			
			// Handle resize
			const resizeObserver = new ResizeObserver(updateDimensions);
			resizeObserver.observe(scrollContainer);
			
			return () => {
				resizeObserver.disconnect();
				stopScrolling();
			};
		}
	});
	
	onDestroy(() => {
		stopScrolling();
	});
	
	function updateDimensions() {
		if (scrollContainer) {
			containerWidth = scrollContainer.offsetWidth;
			const firstChild = scrollContainer.querySelector('.testimonial-track');
			if (firstChild) {
				contentWidth = firstChild.scrollWidth / 2; // Divide by 2 since we doubled the content
			}
		}
	}
	
	function startScrolling() {
		if (animationId) return;
		
		let lastTime = performance.now();
		
		function animate(currentTime) {
			if (!isPaused) {
				const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
				scrollPosition += scrollSpeed * deltaTime;
				
				// Reset when we've scrolled through one full set
				if (scrollPosition >= contentWidth) {
					scrollPosition = 0;
				}
			}
			
			lastTime = currentTime;
			animationId = requestAnimationFrame(animate);
		}
		
		animationId = requestAnimationFrame(animate);
	}
	
	function stopScrolling() {
		if (animationId) {
			cancelAnimationFrame(animationId);
			animationId = null;
		}
	}
</script>

<div 
	class="relative overflow-hidden {className}"
	bind:this={scrollContainer}
>
	<!-- Scrolling testimonials -->
	<div 
		class="testimonial-track flex gap-6 w-max transition-none"
		style="transform: translateX(-{scrollPosition}px)"
	>
		{#each loopedTestimonials as testimonial, index}
			<div class="flex-shrink-0 w-80">
				<TestimonialCard {...testimonial} />
			</div>
		{/each}
	</div>
	
	<!-- Left gradient overlay -->
	<div class="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
	
	<!-- Right gradient overlay -->
	<div class="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
</div> 
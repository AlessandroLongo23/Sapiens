<script>
	import { onMount, onDestroy } from 'svelte';
	import TestimonialCard from './TestimonialCard.svelte';
	
	let { 
		testimonials = [],
		duration = 5000,
		className = ''
	} = $props();
	
	let currentIndex = $state(0);
	let intervalId = null;
	let transitioning = $state(true);
	
	const hasMultipleTestimonials = $derived(testimonials.length > 1);

	onMount(() => {
		if (hasMultipleTestimonials) {
			startSlideshow();
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

	function handleTransitionEnd() {
		if (currentIndex >= testimonials.length) {
			transitioning = false;
			currentIndex = 0;
		}
	}
</script>

<div class="relative overflow-hidden {className}">
	{#if hasMultipleTestimonials}
		{@const loopedTestimonials = [...testimonials, testimonials[0]]}
		<div class="relative" ontransitionend={handleTransitionEnd}>
			{#each loopedTestimonials as testimonial, index}
				<div 
					class="w-full"
					class:transition-transform={transitioning}
					class:duration-700={transitioning}
					class:ease-in-out={transitioning}
					class:absolute={index !== 0}
					class:inset-0={index !== 0}
					style="transform: translateX({(index - currentIndex) * 100}%)"
				>
					<TestimonialCard {...testimonial} />
				</div>
			{/each}
		</div>
		
		<!-- Progress indicators -->
		<div class="flex justify-center space-x-2 mt-6">
			{#each testimonials as _, index}
				<div 
					class="w-2 h-2 rounded-full transition-colors duration-300 {
						index === (currentIndex % testimonials.length)
							? 'bg-slate-600' 
							: 'bg-slate-300'
					}"
				></div>
			{/each}
		</div>
	{:else if testimonials.length === 1}
		<TestimonialCard {...testimonials[0]} />
	{/if}
</div> 
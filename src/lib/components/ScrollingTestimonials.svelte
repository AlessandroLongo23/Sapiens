<script>
	import TestimonialCard from './TestimonialCard.svelte';
	import * as ls from 'lucide-svelte';

	let { 
		testimonials = [],
		className = ''
	} = $props();

	const itemsPerPage = 3;
	let isTransitioning = $state(true);

	const groups = $derived(
		Array.from({ length: Math.ceil(testimonials.length / itemsPerPage) }, (_, i) =>
			testimonials.slice(i * itemsPerPage, (i + 1) * itemsPerPage)
		)
	);

	const numGroups = $derived(groups.length);
	let currentIndex = $derived(numGroups > 1 ? 1 : 0);

	const displayGroups = $derived(
		numGroups > 1 ? [groups[numGroups - 1], ...groups, groups[0]] : groups
	);

	function showNext() {
		if (numGroups <= 1) return;
		isTransitioning = true;
		currentIndex = currentIndex + 1;
	}

	function showPrev() {
		if (numGroups <= 1) return;
		isTransitioning = true;
		currentIndex = currentIndex - 1;
	}

	function handleTransitionEnd() {
		if (currentIndex === 0) {
			isTransitioning = false;
			currentIndex = numGroups;
		} else if (currentIndex === numGroups + 1) {
			isTransitioning = false;
			currentIndex = 1;
		}
	}
</script>

<div class="relative {className}">
	<div class="overflow-hidden">
		<div 
			class="flex"
			style="transform: translateX(-{currentIndex * 100}%); transition: {isTransitioning ? 'transform 0.5s ease-in-out' : 'none'};"
			ontransitionend={handleTransitionEnd}
		>
			{#each displayGroups as group}
				<div class="w-full flex-shrink-0">
					<div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 items-start">
						{#each group as testimonial}
							<TestimonialCard {...testimonial} />
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>

	{#if numGroups > 1}
		<button
			onclick={showPrev}
			class="absolute -left-16 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg backdrop-blur-sm transition hover:bg-white hover:scale-110 focus:outline-none cursor-pointer"
			aria-label="Previous testimonial"
		>
			<ls.ChevronLeft class="h-6 w-6 text-zinc-800" />
		</button>
		
		<button
			onclick={showNext}
			class="absolute -right-16 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg backdrop-blur-sm transition hover:bg-white hover:scale-110 focus:outline-none cursor-pointer"
			aria-label="Next testimonial"
		>
			<ls.ChevronRight class="h-6 w-6 text-zinc-800" />
		</button>
	{/if}
</div> 
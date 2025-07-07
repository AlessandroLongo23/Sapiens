<script>
	import TestimonialCard from './TestimonialCard.svelte';
	import * as ls from 'lucide-svelte';

	let { 
		testimonials = [],
		className = ''
	} = $props();

	let currentIndex = $state(0);

	const numItems = $derived(testimonials.length);

	function next() {
		if (numItems === 0) return;
		currentIndex = (currentIndex + 1) % numItems;
	}

	function prev() {
		if (numItems === 0) return;
		currentIndex = (currentIndex - 1 + numItems) % numItems;
	}
</script>

<div class="relative {className}">
	<div class="overflow-hidden">
		<div 
			class="flex transition-transform duration-500 ease-in-out"
			style="transform: translateX(-{currentIndex * 100}%)"
		>
			{#each testimonials as testimonial}
				<div class="w-full flex-shrink-0 px-1">
					<TestimonialCard {...testimonial} />
				</div>
			{/each}
		</div>
	</div>

	{#if numItems > 1}
		<div class="mt-6 flex items-center justify-center space-x-4">
			<button
				onclick={prev}
				class="rounded-full bg-slate-100 p-2 shadow-sm transition hover:bg-slate-200 focus:outline-none"
				aria-label="Previous testimonial"
			>
				<ls.ChevronLeft class="h-5 w-5 text-slate-700" />
			</button>

			<div class="flex justify-center space-x-2">
				{#each testimonials as _, index}
					<button
						onclick={() => currentIndex = index}
						class="h-2 w-2 rounded-full transition-colors duration-300 {
							index === currentIndex
								? 'bg-slate-600 scale-125' 
								: 'bg-slate-300'
						}"
						aria-label="Go to testimonial {index + 1}"
					></button>
				{/each}
			</div>

			<button
				onclick={next}
				class="rounded-full bg-slate-100 p-2 shadow-sm transition hover:bg-slate-200 focus:outline-none"
				aria-label="Next testimonial"
			>
				<ls.ChevronRight class="h-5 w-5 text-slate-700" />
			</button>
		</div>
	{/if}
</div> 
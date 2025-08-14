<script>
	import TestimonialCard from '$lib/components/cards/TestimonialCard.svelte';
	import { reviewsStore } from '$lib/stores/reviews/reviews.js';
	import * as ls from 'lucide-svelte';

	let { 
		className = ''
	} = $props();

	let currentIndex = $state(0);

	const numItems = $derived($reviewsStore.reviews.length);

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
			{#each $reviewsStore.reviews as testimonial}
				<div class="w-full flex-shrink-0 px-1">
					<TestimonialCard review={testimonial} />
				</div>
			{/each}
		</div>
	</div>

	{#if numItems > 1}
    <div class="mt-6 flex items-center justify-center space-x-4">
			<button
				onclick={prev}
        class="rounded-full bg-zinc-100 dark:bg-zinc-800 p-2 shadow-sm transition hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:outline-none"
				aria-label="Previous testimonial"
			>
        <ls.ChevronLeft class="h-5 w-5 text-zinc-700 dark:text-zinc-200" />
			</button>

			<div class="flex justify-center space-x-2">
				{#each $reviewsStore.reviews as _, index}
					<button
						onclick={() => currentIndex = index}
          class="h-2 w-2 rounded-full transition-colors duration-300 {
              index === currentIndex
                ? 'bg-zinc-600 dark:bg-zinc-300 scale-125' 
                : 'bg-zinc-300 dark:bg-zinc-600'
            }"
						aria-label="Go to testimonial {index + 1}"
					></button>
				{/each}
			</div>

      <button
				onclick={next}
        class="rounded-full bg-zinc-100 dark:bg-zinc-800 p-2 shadow-sm transition hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:outline-none"
				aria-label="Next testimonial"
			>
        <ls.ChevronRight class="h-5 w-5 text-zinc-700 dark:text-zinc-200" />
			</button>
		</div>
	{/if}
</div> 
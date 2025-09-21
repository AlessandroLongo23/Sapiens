<script>
	import TestimonialCard from '$lib/components/cards/TestimonialCard.svelte';
	import * as ls from 'lucide-svelte';
	
	import { studentsStore } from '$lib/stores/students.js';

	let { 
		className = '',
		reviews
	} = $props();

	const itemsPerPage = 3;
	let isTransitioning = $state(true);

	const groups = $derived(
		Array.from({ length: Math.ceil(reviews.length / itemsPerPage) }, (_, i) =>
			reviews.slice(i * itemsPerPage, (i + 1) * itemsPerPage)
		)
	);

	const numGroups = $derived(groups.length);
	let currentIndex = $derived(numGroups > 1 ? 1 : 0);

	const displayGroups = $derived(
		numGroups > 1 ? [groups[numGroups - 1], ...groups, groups[0]] : groups
	);

	const showNext = () => {
		isTransitioning = true;
		currentIndex = currentIndex + 1;
	}

	const showPrev = () => {
		isTransitioning = true;
		currentIndex = currentIndex - 1;
	}

	const handleTransitionEnd = () => {
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
							{@const student = $studentsStore.students.find(s => s.id === testimonial.student_id)}
							<TestimonialCard review={testimonial} student={student} />
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>

	{#if numGroups > 1}
		<button
			onclick={showPrev}
			class="absolute -left-12 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 dark:bg-zinc-800/70 p-3 shadow-lg backdrop-blur-sm transition hover:bg-white dark:hover:bg-zinc-700/80 hover:scale-110 focus:outline-none cursor-pointer"
			aria-label="Previous testimonial"
		>
			<ls.ChevronLeft class="h-6 w-6 text-zinc-800 dark:text-zinc-200" />
		</button>
		
		<button
			onclick={showNext}
			class="absolute -right-12 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 dark:bg-zinc-800/70 p-3 shadow-lg backdrop-blur-sm transition hover:bg-white dark:hover:bg-zinc-700/80 hover:scale-110 focus:outline-none cursor-pointer"
			aria-label="Next testimonial"
		>
			<ls.ChevronRight class="h-6 w-6 text-zinc-800 dark:text-zinc-200" />
		</button>
	{/if}
</div> 
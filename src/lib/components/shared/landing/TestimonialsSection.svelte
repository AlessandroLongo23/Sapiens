<script>
	import { reviewsStore } from '$lib/stores/reviews/reviews.js';
    import { section_style } from '$lib/stores/appearance';
	import { onMount } from 'svelte';
	
	import MobileTestimonialSlideshow from '$lib/components/shared/landing/MobileTestimonialSlideshow.svelte';
	import ScrollingTestimonials from '$lib/components/shared/landing/ScrollingTestimonials.svelte';

	let { testimonialsSection = $bindable(null) } = $props();
</script>

<section id="testimonials" bind:this={testimonialsSection} class="{section_style} hero-gradient">
	<div class="max-w-6xl mx-auto">
        <div class="text-center mb-4 sm:mb-8">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-4 sm:mb-6">Cosa Dicono i Miei Studenti</h2>
            <p class="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto px-4">
				Testimonianze autentiche di chi ha già raggiunto i suoi obiettivi e trasformato 
				le difficoltà in successi concreti
			</p>
			<div class="w-16 sm:w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full mt-4 sm:mt-6"></div>
		</div>
		
		
		<div class="block lg:hidden">
			<MobileTestimonialSlideshow 
				reviews={$reviewsStore.reviews}
				duration={10000}
				className="px-4"
			/>
		</div>
		
		
		<div class="hidden lg:block">
			<ScrollingTestimonials 
				reviews={$reviewsStore.reviews}
				scrollSpeed={30}
				className="py-4"
			/>
		</div>
	</div>
</section>
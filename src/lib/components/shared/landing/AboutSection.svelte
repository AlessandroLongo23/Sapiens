<script>
	import { section_style } from '$lib/const/appearance';
	import { morgagniImages, dtuImages } from '$lib/const/data.js';
	import * as ls from 'lucide-svelte';

	let {
		aboutSection = $bindable(null),
	} = $props();

	import ImageSlideshow from '$lib/components/shared/landing/ImageSlideshow.svelte';
</script>

<section id="about" bind:this={aboutSection} class="{section_style} bg-white dark:bg-zinc-950 relative overflow-hidden">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-12 sm:mb-16">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-4 sm:mb-6">Chi Sono</h2>
			<div class="w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
		</div>
		
		<div class="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
			<div class="space-y-6 sm:space-y-8">
                <div class="glass-effect rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12">
                    <div class="space-y-4 sm:space-y-6 text-zinc-700 dark:text-zinc-200">
                        <p class="text-lg sm:text-xl leading-relaxed">
							Sono <strong class="text-zinc-900 dark:text-zinc-100">Alessandro</strong>, laureato con 110 e Lode in
                                <strong class="text-blue-600">Ingegneria Informatica</strong> presso l'<strong class="dark:text-white">Università degli Studi di Firenze</strong>
							e attualmente frequentante la facoltà di 
                                <strong class="text-blue-600">Human-Centered Artificial Intelligence</strong> alla 
                                <strong class="dark:text-white">Denmark Technical University</strong>, a Copenhagen.
						</p>
                        <p class="text-base sm:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
							Durante il mio percorso accademico ho sviluppato una profonda passione per l'insegnamento, 
							scoprendo che la mia capacità di rendere semplici concetti complessi può fare davvero 
							la differenza nel percorso di apprendimento degli studenti.
						</p>
                        <p class="text-base sm:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
							Oltre alla solida formazione teorica, porto con me <strong class="text-zinc-900 dark:text-zinc-100">anni di esperienza pratica</strong> 
							nel settore tecnologico, permettendomi di collegare sempre la teoria con applicazioni concrete 
							e stimolanti che preparano gli studenti al mondo reale.
						</p>
					</div>
				</div>
			</div>
			
			<div class="hidden lg:flex justify-center mt-8 lg:mt-0">
				<div class="flex flex-col gap-12">
					<div class="relative w-80 h-48 sm:w-96 sm:h-56 lg:w-[28rem] lg:h-64">
						<div class="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg">
							<ImageSlideshow 
								images={$morgagniImages}
								alt="UNIFI"
								duration={3000}
							/>
						</div>
						<div class="absolute -bottom-8 -right-8 sm:-bottom-8 sm:-right-8">
							<a href="https://www.ing-inl.unifi.it/" class="block glass-effect rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg">
								<ls.GraduationCap class="size-5 sm:size-6 text-blue-600 dark:text-blue-400 mx-auto mb-1 sm:mb-2" />
								<div class="font-semibold text-zinc-800 dark:text-zinc-100 text-xs sm:text-sm leading-tight">Università degli Studi di Firenze</div>
								<div class="text-xs text-zinc-600 dark:text-zinc-400">Ingegneria Informatica</div>
							</a>
						</div>
					</div>

					<div class="relative w-80 h-48 sm:w-96 sm:h-56 lg:w-[28rem] lg:h-64 left-8">
						<div class="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg">
							<ImageSlideshow 
								images={$dtuImages}
								alt="DTU"
								duration={5000}
								offset={2500}
							/>
						</div>
						<div class="absolute -bottom-8 -left-8 sm:-bottom-8 sm:-left-8">
							<a href="https://www.dtu.dk/english/education/graduate/msc-programmes/human-centered-artificial-intelligence" class="block glass-effect rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg">
								<ls.BookOpen class="size-5 sm:size-6 text-blue-600 dark:text-blue-400 mx-auto mb-1 sm:mb-2" />
								<div class="font-semibold text-zinc-800 dark:text-zinc-100 text-xs sm:text-sm leading-tight">Denmark Technical University</div>
								<div class="text-xs text-zinc-600 dark:text-zinc-400">Human-Centered Artificial Intelligence</div>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
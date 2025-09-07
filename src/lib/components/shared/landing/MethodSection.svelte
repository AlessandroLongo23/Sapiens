<script>
    import { section_style } from '$lib/stores/appearance';
	import { methodCards } from '$lib/data.js';

	let {
		methodSection = $bindable(null),
	} = $props();
</script>

<section id="metodo" bind:this={methodSection} class="{section_style} bg-white dark:bg-zinc-950 relative overflow-hidden">
    <div class="max-w-6xl mx-auto">
        <div class="text-center sm:mb-12 mb-16">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-3 sm:mb-4">Il Mio Metodo</h2>
            <p class="text-base sm:text-lg lg:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto px-4">
                Strategie didattiche personalizzate per ogni studente
            </p>
            <div class="w-16 sm:w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full mt-4 sm:mt-6"></div>
        </div>

        
        <div class="hidden sm:grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-8 lg:mb-12">
            <div class="lg:order-1">
                <h3 class="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-5">La mia filosofia</h3>
                <p class="text-zinc-600 dark:text-zinc-300 text-base sm:text-lg mb-6 leading-relaxed">
                    La mia didattica è incentrata sulla comprensione profonda e personalizzazione dell'apprendimento. Credo che ogni studente abbia il proprio ritmo e stile, e adatto le lezioni in base alle specifiche esigenze individuali.
                </p>
            </div>

            <div class="relative flex justify-center lg:justify-end lg:order-2">
                <div class="relative w-full max-w-lg">
                    <div class="rounded-md overflow-hidden shadow-xl border-3 border-zinc-800 bg-white dark:bg-zinc-800">
                        <img 
                            src="/images/desktop.png" 
                            alt="Dashboard studente (versione desktop)" 
                            class="w-full h-auto object-cover"
                        />
                    </div>
                    
                    <div class="absolute -bottom-8 -right-6 sm:-bottom-12 sm:-right-8 w-32 h-64 sm:w-40 sm:h-72 rounded-2xl overflow-hidden border-3 border-zinc-800 shadow-lg bg-white dark:bg-zinc-800 z-10">
                        <img 
                            src="/images/mobile.jpg" 
                            alt="Esercizi interattivi (versione mobile)" 
                            class="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>

        
        <div class="sm:hidden mb-10">
            <div class="relative mx-auto max-w-[280px] mb-8">
                <div class="rounded-md overflow-hidden shadow-xl border-2 border-zinc-800 bg-white dark:bg-zinc-800">
                    <img 
                        src="/images/desktop.png" 
                        alt="Dashboard studente (versione desktop)" 
                        class="w-full h-auto object-cover"
                    />
                </div>
                
                <div class="absolute -bottom-6 -right-4 w-28 h-56 rounded-xl overflow-hidden border-2 border-zinc-800 shadow-lg bg-white dark:bg-zinc-800 z-10">
                    <img 
                        src="/images/mobile.jpg" 
                        alt="Esercizi interattivi (versione mobile)" 
                        class="w-full h-full object-cover"
                    />
                </div>
            </div>
            
			<div class="px-4">
				<h3 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">La mia filosofia</h3>
				<p class="text-zinc-600 dark:text-zinc-300 text-base mb-4 leading-relaxed">
					La mia didattica è incentrata sulla comprensione profonda e personalizzazione dell'apprendimento. Credo che ogni studente abbia il proprio ritmo e stile, e adatto le lezioni in base alle specifiche esigenze individuali.
				</p>
			</div>
        </div>

        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 pt-4 sm:pt-8">
			{#each $methodCards as card}
				<div class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow">
					<div class="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
						<div class="{card.color} rounded-lg p-2 sm:p-2.5 flex-shrink-0 text-white">
							<card.icon class="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
						</div>
						<h3 class="text-base sm:text-lg lg:text-xl font-semibold text-zinc-900 dark:text-white">{card.title}</h3>
					</div>
					<p class="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
						{card.description}
					</p>
				</div>
			{/each}
        </div>
    </div>
</section>
<script>
	import * as ls from 'lucide-svelte';

    let { 
        heroSection = $bindable(null),
        isContactModalOpen = $bindable(false),
        stats,
    } = $props();
</script>

<section
    bind:this={heroSection}
    class="relative min-h-screen hero-gradient flex items-center justify-center md:scroll-mt-32 pt-24 md:pt-28 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
>
	<div class="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center z-10">
		<div class="text-center lg:text-left space-y-6 sm:space-y-8 lg:space-y-10">
			<div class="space-y-4 sm:space-y-6">
                <h1 class="flex flex-col gap-2 font-bold text-zinc-900 dark:text-white leading-tight tracking-tight">
					<span class="block text-xl sm:text-2xl md:text-3xl lg:text-5xl">Tutor Specializzato in</span>
					<span class="gradient-text block text-3xl sm:text-4xl md:text-5xl lg:text-7xl">Materie Scientifiche</span>
				</h1>

                <p class="text-base sm:text-lg lg:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl font-light mx-auto lg:mx-0">
					Trasforma le difficoltà in successi con ripetizioni personalizzate. Un approccio su
					misura che unisce teoria e pratica per risultati concreti.
				</p>
			</div>

			<div class="flex flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
				<button
					onclick={() => { isContactModalOpen = true }}
					class="btn-primary text-white px-6 sm:px-8 py-2 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg shadow-elegant-lg group cursor-pointer"
				>
					<span class="flex items-center justify-center space-x-2 sm:space-x-3">
						<ls.Calendar
							class="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300"
						/>
						<span>Prenota ora</span>
					</span>
				</button>

				<a 
					href="mailto:aleripetizioni2024@gmail.com" 
					class="inline-flex items-center justify-center btn-secondary text-zinc-700 dark:text-zinc-200 size-12 sm:w-auto sm:h-auto px-4 sm:px-8 py-4 sm:py-5 rounded-2xl font-semibold text-base sm:text-lg group cursor-pointer"
				>
					<ls.Mail class="size-4 sm:size-6" />
                </a>

                <a 
					href="tel:+393924090699" 
					class="inline-flex items-center justify-center btn-secondary text-zinc-700 dark:text-zinc-200 size-12 sm:w-auto sm:h-auto px-4 sm:px-8 py-4 sm:py-5 rounded-2xl font-semibold text-base sm:text-lg group cursor-pointer"
				>
                    <ls.Phone class="size-4 sm:size-6" />
                </a>
			</div>

            <div
                class="flex items-center justify-center lg:justify-start space-x-4 sm:space-x-8 pt-4 sm:pt-6"
            >
				{#each Object.values(stats) as stat, index}
					<div class="text-center">	
                        <div class="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-800 dark:text-zinc-100">{stat.value}</div>
                        <div class="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">{stat.label}</div>
					</div>
				{/each}
			</div>
		</div>
		
		<div class="flex justify-center lg:justify-end mt-8 lg:mt-0">
			<div class="relative">
				<div class="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 morphing-shape bg-gradient-to-br from-blue-400/20 via-indigo-500/20 to-blue-600/20 flex items-center justify-center floating-animation">
                    <div class="w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full glass-effect flex items-center justify-center">
                        <div class="w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300 shadow-elegant-lg">
							<img src="/profile.jpg" alt="profile" class="w-full h-full rounded-full" id="profile-image" />
						</div>
					</div>
				</div>
				
				<div class="absolute -top-4 -right-4 sm:-top-8 sm:-right-8 w-14 h-14 sm:w-20 sm:h-20 glass-effect rounded-full sm:rounded-2xl flex items-center justify-center floating-animation shadow-elegant" style="animation-delay: -2s;">
					<ls.Calculator class="w-6 h-6 sm:w-10 sm:h-10 text-blue-600" />
				</div>
				<div class="absolute -bottom-4 -left-4 sm:-bottom-8 sm:-left-8 w-14 h-14 sm:w-20 sm:h-20 glass-effect rounded-full sm:rounded-2xl flex items-center justify-center floating-animation shadow-elegant" style="animation-delay: -4s;">
					<ls.Atom class="w-6 h-6 sm:w-10 sm:h-10 text-purple-600" />
				</div>
				<div class="absolute top-1/2 -left-8 sm:-left-12 w-12 h-12 sm:w-16 sm:h-16 glass-effect rounded-full sm:rounded-2xl flex items-center justify-center floating-animation shadow-elegant" style="animation-delay: -6s;">
					<ls.Laptop class="w-5 h-5 sm:w-8 sm:h-8 text-green-600" />
				</div>
			</div>
		</div>
	</div>

	<a href="#about" aria-label="Scopri di più"
		class="hidden sm:flex items-center justify-center absolute left-1/2 -translate-x-1/2 bottom-6 w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/70 backdrop-blur text-zinc-700 dark:text-zinc-200 shadow-elegant animate-bounce cursor-pointer">
		<ls.ChevronDown class="w-5 h-5" />
	</a>
</section>
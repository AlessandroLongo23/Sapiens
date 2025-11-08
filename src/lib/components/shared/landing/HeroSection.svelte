<script>
	import GrainyBackground from './background/GrainyBackground.svelte';
	import * as ls from 'lucide-svelte';

    let { 
        heroSection = $bindable(null),
        isContactModalOpen = $bindable(false),
        stats,
        gradient = false,
    } = $props();
</script>

<section
    bind:this={heroSection}
    class="relative min-h-screen flex items-center justify-center md:scroll-mt-32 pt-32 pb-24 px-6 lg:px-8 overflow-hidden"
>
	<GrainyBackground 
		grain_amount={0.08}
		grain_size={1.0}
		speed={0.3}
	/>

	<!-- Subtle background decoration -->
	<div aria-hidden="true" class="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20">
		<div class="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/10 dark:bg-pink-400/10 rounded-full blur-[120px]"></div>
		<div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-[120px]"></div>
	</div>

	<div class="relative max-w-7xl mx-auto w-full z-10">
		<div class="grid lg:grid-cols-2 gap-16 items-center">
			<!-- Content Column -->
			<div class="text-center lg:text-left space-y-8">
				<!-- Heading -->
				<div class="space-y-6">
					<h1 class="text-4xl sm:text-5xl lg:text-[2.25rem] font-bold text-gray-900 dark:text-slate-50 leading-[1.2] tracking-tight">
						Studia in autonomia con
						<span class="block mt-2 text-pink-500 dark:text-pink-400">
							materiale chiaro e completo
						</span>
					</h1>

					<p class="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-[1.6] max-w-2xl mx-auto lg:mx-0">
						Teoria, formulari ed esercizi svolti per medie e superiori. Con Premium accedi a lezioni individuali e supporto personalizzato.
					</p>
				</div>

				<!-- CTAs -->
				<div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
					<a
						href="/student/subscription"
						class="group inline-flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 dark:bg-pink-400 dark:hover:bg-pink-500 text-white px-8 py-4 rounded-xl font-medium text-base shadow-sm hover:shadow-md transition-all duration-300 ease-in-out hover:scale-[1.02]"
					>
						<ls.GraduationCap class="w-5 h-5 transition-transform duration-300 ease-in-out group-hover:rotate-12" />
						<span>Scopri i piani</span>
					</a>

					<a
						href="/#materie"
						class="group inline-flex items-center justify-center gap-2 bg-white dark:bg-[#12161B] border border-gray-300 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700 text-gray-900 dark:text-slate-50 px-8 py-4 rounded-xl font-medium text-base shadow-sm hover:shadow-md transition-all duration-300 ease-in-out hover:scale-[1.02]"
					>
						<ls.BookOpen class="w-5 h-5" />
						<span>Esplora materiale</span>
					</a>
				</div>

				<!-- Stats -->
				<div class="flex items-center justify-center lg:justify-start gap-8 pt-8">
					{#each Object.values(stats) as stat}
						<div class="text-center lg:text-left">
							<div class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-50">
								{stat.value}
							</div>
							<div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
								{stat.label}
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Image Column -->
			<div class="hidden lg:block">
				<div class="relative">
					<div class="relative rounded-2xl overflow-hidden shadow-md">
						<img
							src="/images/desktop.png"
							alt="Anteprima della piattaforma educativa Sapiens"
							loading="lazy"
							decoding="async"
							class="w-full h-auto object-cover"
						/>
					</div>
					<!-- Subtle glow effect -->
					<div aria-hidden="true" class="absolute -inset-4 -z-10 bg-gradient-to-br from-pink-500/20 via-transparent to-blue-500/20 dark:from-pink-400/20 dark:to-blue-400/20 rounded-3xl blur-2xl opacity-50"></div>
				</div>
			</div>
		</div>
	</div>

	<!-- Scroll indicator -->
	<a 
		href="#about" 
		aria-label="Scopri di più"
		class="hidden sm:flex items-center justify-center absolute left-1/2 -translate-x-1/2 bottom-8 w-10 h-10 rounded-full border border-gray-300 dark:border-gray-800 bg-white/80 dark:bg-[#12161B]/80 backdrop-blur-sm text-gray-600 dark:text-gray-400 shadow-sm hover:shadow-md hover:border-pink-500 dark:hover:border-pink-400 transition-all duration-300 ease-in-out animate-bounce"
	>
		<ls.ChevronDown class="w-5 h-5" />
	</a>
</section>
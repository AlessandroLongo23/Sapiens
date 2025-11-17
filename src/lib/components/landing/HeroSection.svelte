<script lang="ts">
	import { themeStore } from '$lib/components/ui/theme/theme';
	import { GraduationCap, BookOpen } from 'lucide-svelte';

	interface Props {
		heroSection: HTMLElement | null;
		stats: {
			value: string;
			label: string;
			icon: typeof GraduationCap;
		}[];
	}

    let { 
        heroSection = $bindable(null),
        stats,
    }: Props = $props();
</script>

<section
    bind:this={heroSection}
    class="relative min-h-screen flex items-center justify-center pb-24 px-6 lg:px-8 overflow-hidden"
>
	<div aria-hidden="true" class="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20">
		<div class="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/10 dark:bg-rose-400/10 rounded-full blur-[120px]"></div>
		<div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-[120px]"></div>
	</div>

	<div class="relative max-w-7xl mx-auto w-full z-10">
		<div class="grid lg:grid-cols-2 gap-16 items-center">
			<div class="text-center lg:text-left space-y-8">
				<div class="space-y-6">
					<h1 class="text-4xl sm:text-5xl lg:text-[2.25rem] font-bold text-gray-900 dark:text-slate-50 leading-[1.2] tracking-tight">
						Studia in autonomia con
						<span class="block mt-2 text-rose-500 dark:text-rose-400">
							materiale chiaro e completo
						</span>
					</h1>

					<p class="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-[1.6] max-w-2xl mx-auto lg:mx-0">
						Teoria, formulari ed esercizi svolti per medie e superiori. Con Premium accedi a lezioni individuali e supporto personalizzato.
					</p>
				</div>

				<div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
					<a
						href="/pricing"
						class="group inline-flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 dark:bg-rose-400 dark:hover:bg-rose-500 text-white px-8 py-4 rounded-xl font-medium text-base shadow-sm hover:shadow-md transition-all duration-300 ease-in-out hover:scale-[1.02]"
					>
						<GraduationCap class="w-5 h-5 transition-transform duration-300 ease-in-out group-hover:rotate-12" />
						<span>Scopri i piani</span>
					</a>

					<a
						href="/search"
						class="group inline-flex items-center justify-center gap-2 bg-white dark:bg-[#12161B] border border-gray-300 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700 text-gray-900 dark:text-slate-50 px-8 py-4 rounded-xl font-medium text-base shadow-sm hover:shadow-md transition-all duration-300 ease-in-out hover:scale-[1.02]"
					>
						<BookOpen class="w-5 h-5" />
						<span>Esplora materiale</span>
					</a>
				</div>

				<div class="flex items-center justify-center lg:justify-start gap-8 pt-8">
					{#each stats as stat}
						{@const StatIcon = stat.icon}
						<div class="text-center lg:text-left">
							<div class="flex items-center gap-3">
								<StatIcon class="size-6 text-rose-500 dark:text-rose-400" />
								<div class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-50">
									{stat.value}
								</div>
							</div>
							<div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
								{stat.label}
							</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="hidden lg:block">
				<div class="relative">
					<div class="relative overflow-hidden">
						<img
							src="/landing-page.png"
							alt="Anteprima della piattaforma educativa Sapiens"
							loading="lazy"
							decoding="async"
							class="w-full h-auto object-cover"
							style="filter: { $themeStore === 'dark' ? 'invert(1)' : 'none' }"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Scroll indicator -->
	<!-- <a 
		href="#about" 
		aria-label="Scopri di più"
		class="hidden sm:flex items-center justify-center absolute left-1/2 -translate-x-1/2 bottom-8 w-10 h-10 rounded-full border border-gray-300 dark:border-gray-800 bg-white/80 dark:bg-[#12161B]/80 backdrop-blur-sm text-gray-600 dark:text-gray-400 shadow-sm hover:shadow-md hover:border-rose-500 dark:hover:border-rose-400 transition-all duration-300 ease-in-out animate-bounce"
	>
		<ChevronDown class="w-5 h-5" />
	</a> -->
</section>
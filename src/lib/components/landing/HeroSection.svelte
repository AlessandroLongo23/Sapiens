<script lang="ts">
	import { GraduationCap, BookOpen } from 'lucide-svelte';
	import landing from '$lib/assets/landing.png?enhanced';

	import AnimatedCounter from '$lib/components/ui/AnimatedCounter.svelte';

	interface Props {
		heroSection: HTMLElement | null;
		stats: {
			value: number;
			label: string;
			icon: typeof GraduationCap;
		}[];
	}

    let {
        heroSection = $bindable(null),
        stats,
    }: Props = $props();

	// The screenshot is the largest element of the desktop hero: preload the
	// AVIF candidates so the browser starts fetching before the CSS lands.
	const imageSizes = '(min-width: 1024px) 50vw, 1px';
</script>

<svelte:head>
	{#if landing.sources.avif}
		<link
			rel="preload"
			as="image"
			type="image/avif"
			imagesrcset={landing.sources.avif}
			imagesizes={imageSizes}
			media="(min-width: 1024px)"
		/>
	{/if}
</svelte:head>

<section
    bind:this={heroSection}
    class="relative min-h-screen flex items-center justify-center pb-24 px-6 lg:px-8 overflow-hidden"
>
	<div class="relative max-w-7xl mx-auto w-full z-10">
		<div class="grid lg:grid-cols-2 gap-2 items-center">
			<div class="text-center lg:text-left space-y-8">
				<div class="space-y-6">
					<h1 class="text-4xl sm:text-5xl lg:text-[2.25rem] font-bold text-gray-900 dark:text-slate-50 leading-[1.2] tracking-tight">
						Studia in autonomia con
						<span class="block mt-2 text-crimson-500 dark:text-crimson-400">
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
						class="group inline-flex items-center justify-center gap-2 bg-crimson-600 hover:bg-crimson-700 dark:bg-crimson-600 dark:hover:bg-crimson-700 text-white px-8 py-4 rounded-xl font-medium text-base shadow-sm hover:shadow-md transition-all duration-300 ease-in-out hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 focus-visible:ring-offset-2"
					>
						<GraduationCap class="w-5 h-5 transition-transform duration-300 ease-in-out group-hover:rotate-12" aria-hidden="true" />
						<span>Scopri i piani</span>
					</a>

					<a
						href="/materiale"
						class="group inline-flex items-center justify-center gap-2 bg-white dark:bg-[#12161B] border border-zinc-500/25 hover:border-zinc-500/50 text-gray-900 dark:text-slate-50 px-8 py-4 rounded-xl font-medium text-base shadow-sm hover:shadow-md transition-all duration-300 ease-in-out hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 focus-visible:ring-offset-2"
					>
						<BookOpen class="w-5 h-5" aria-hidden="true" />
						<span>Esplora materiale</span>
					</a>
				</div>

				<div class="flex items-center justify-center lg:justify-start gap-8 pt-8">
					{#each stats as stat}
						{@const StatIcon = stat.icon}
						<div class="text-center lg:text-left">
							<div class="flex items-center gap-3">
								<StatIcon class="size-6 text-crimson-500 dark:text-crimson-400" aria-hidden="true" />
								<div class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-50">
									<AnimatedCounter target={stat.value} duration={2000} />
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
						<enhanced:img
							src={landing}
							alt="Una lezione di Sapiens aperta nel browser, con indice a sinistra e teoria al centro"
							sizes={imageSizes}
							fetchpriority="high"
							decoding="async"
							class="w-full h-auto object-cover"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<script>
    import { section_style } from '$lib/stores/appearance';

	import StatsCard from '$lib/components/cards/StatsCard.svelte';

	let {
		stats,
		statsSection = $bindable(null),
	} = $props();
</script>

<section id="stats" bind:this={statsSection} class="{section_style} hero-gradient relative">
	<div class="max-w-6xl mx-auto">
        <div class="text-center mb-16 sm:mb-20">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-4 sm:mb-6">I Nostri Risultati</h2>
            <p class="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto px-4">
				Numeri che parlano da soli e testimoniano anni di dedizione nell'insegnamento
			</p>
			<div class="w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mt-4 sm:mt-6"></div>
		</div>
		
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
			{#each Object.values(stats) as stat, index}
				<div style="animation-delay: {index * 200}ms">
					<StatsCard {...stat} />
				</div>
			{/each}
		</div>
	</div>
</section>
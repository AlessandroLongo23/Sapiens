<script>
    import { section_style } from '$lib/const/appearance';
    import { Pi, Atom, Code2, Beaker, Sigma, Activity, Database, Cpu } from 'lucide-svelte';

    let {
		subjectsSection = $bindable(null),
        gradient = false,
	} = $props();

    const subjects = [
		{ title: 'Matematica', icon: Pi },
		{ title: 'Fisica', icon: Atom },
		{ title: 'Informatica', icon: Code2 },
		{ title: 'Chimica', icon: Beaker },
		{ title: 'Analisi I/II', icon: Sigma },
		{ title: 'Teoria dei Segnali', icon: Activity },
		{ title: 'Database', icon: Database },
		{ title: 'Programmazione', icon: Cpu }
	];
</script>

<section id="subjects" bind:this={subjectsSection} class="{section_style} {gradient ? 'hero-gradient' : 'bg-white dark:bg-zinc-950'}">
    <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12 sm:mb-16">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-4 sm:mb-6">Materie disponibili</h2>
            <p class="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto px-4">Dalle scuole medie all'università, trovi tutto il materiale che ti serve</p>
            <div class="w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mt-4 sm:mt-6"></div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {#each subjects as s}
                <div class="group rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm">
                    <div class="flex items-center gap-3">
                        <s.icon class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                        <div class="font-semibold text-zinc-900 dark:text-zinc-100 text-xs sm:text-base">{s.title}</div>
                    </div>
                </div>
            {/each}
        </div>

        <div class="text-center mt-10 sm:mt-12">
			<p class="text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto px-4 text-base">Non trovi la tua materia? Contattaci per scoprire se possiamo aiutarti</p>
		</div>
    </div>
</section>
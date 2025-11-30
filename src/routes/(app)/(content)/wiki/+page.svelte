<script lang="ts">
	import { contentTree } from '$lib/data/content-tree';
	import { Home, BookOpen, LibraryBig, Layers, FileText } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	import LevelCard from '$lib/components/ui/cards/LevelCard.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';

    let isLoading = $derived(!contentTree);

    let totalSubjects = $derived(contentTree?.reduce((sum, level) => sum + level.subjects.length, 0) || 0);

	let totalChapters = $derived(
		contentTree?.reduce((sum, level) => sum + level.subjects.reduce((sum, subject) => sum + subject.chapters.length, 0), 0) || 0
	);

	let totalTopics = $derived(
		contentTree?.reduce((sum, level) => sum + level.subjects.reduce((sum, subject) => sum + subject.chapters.reduce((chSum, chapter) => chSum + chapter.topics.length, 0), 0), 0) || 0
	);

    let breadcrumbItems = $derived([
        { label: 'Home', path: '/', icon: Home },
        { label: 'Materiale didattico', path: '/wiki', icon: LibraryBig }
    ]);
</script>

<svelte:head>
	<title>
		Contenuti didattici - Sapiens
	</title>
	<meta
		name="description"
		content="Esplora i contenuti didattici. Trova teoria, esercizi e risorse per tutte le materie disponibili."
	/>
</svelte:head>

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
	<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
		{#if isLoading}
			<div class="flex justify-center items-center h-96">
				<div
					class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-crimson-500"
				></div>
			</div>
		{:else}
			<!-- Header Section -->
			<header class="mb-12" in:fade={{ duration: 300 }}>
				<!-- Back Button -->
				<Breadcrumb items={breadcrumbItems} />

				<div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
					<div class="flex items-start gap-6">
                        <div class="hidden sm:flex items-center justify-center size-32 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-500/25 text-crimson-500 dark:text-crimson-400">
                            <LibraryBig class="size-16" />
                        </div>

						<div class="flex-1 space-y-4">
							<div class="space-y-2">
								<div class="flex items-center gap-3">
                                    <LibraryBig class="w-8 h-8 text-crimson-500 dark:text-crimson-400 sm:hidden" />
									<h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
										Materiale didattico
									</h1>
								</div>
								<p class="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
									Esplora i contenuti didattici disponibili per questo livello. Trova teoria,
									esercizi e risorse per tutte le materie.
								</p>
							</div>

							<!-- Quick Stats -->
							<div class="flex flex-wrap gap-3">
								<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-500/25 text-sm text-zinc-700 dark:text-zinc-300 backdrop-blur-sm">
									<BookOpen class="w-4 h-4 text-crimson-500" />
									<span class="font-medium">{totalSubjects}</span> Materie
								</div>
								<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-500/25 text-sm text-zinc-700 dark:text-zinc-300 backdrop-blur-sm">
									<Layers class="w-4 h-4 text-teal-500" />
									<span class="font-medium">{totalChapters}</span> Capitoli
								</div>
								{#if totalTopics > 0}
									<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-500/25 text-sm text-zinc-700 dark:text-zinc-300 backdrop-blur-sm">
										<FileText class="w-4 h-4 text-indigo-500" />
										<span class="font-medium">{totalTopics}</span> Lezioni
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</header>

			<!-- Levels Grid -->
			{#if contentTree.length > 0}
				<section class="space-y-6" in:fade={{ duration: 400, delay: 100 }}>
					<div class="flex items-center justify-between border-b border-zinc-500/25 pb-4">
						<h2 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
							<BookOpen class="w-5 h-5 text-crimson-500" />
							Livelli didattici disponibili
						</h2>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{#each contentTree as level, index (level.id)}
							<div in:fly={{ y: 20, duration: 400, delay: index * 50 }} class="h-full">
								<LevelCard
									level={level}
								/>
							</div>
						{/each}
					</div>
				</section>
			{/if}
		{/if}
	</div>
</div>
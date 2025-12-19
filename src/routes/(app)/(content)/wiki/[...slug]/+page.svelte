<script lang="ts">
	import { contentTree, EducationalLevelMap } from '$lib/data/content-tree';
	import { Home, BookOpen, GraduationCap, Layers, FileText, LibraryBig } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
    import NodeCard from '$lib/components/ui/cards/NodeCard.svelte';

    let { node } = $props() 

	let node_slug = $derived(node.slug);

	let totalChildren = $derived(
		levelInfo?.subjects.reduce((sum, subject) => sum + subject.chapters.length, 0) || 0
	);

	let totalTopics = $derived(
		levelInfo?.subjects.reduce(
			(sum, subject) =>
				sum + subject.chapters.reduce((chSum, chapter) => chSum + chapter.topics.length, 0),
			0
		) || 0
	);

	let isLoading = $derived(!levelInfo);

	let breadcrumbItems = $derived.by(() => {
		if (!levelInfo) return [];
		return [
			{ label: 'Home', path: '/', icon: Home },
			{ label: 'Materiale didattico', path: '/wiki', icon: LibraryBig },
			{ label: levelInfo.name, icon: levelInfo.icon }
		];
	});
</script>

<svelte:head>
	<title>
		{levelInfo?.name || 'Livello'} - Sapiens
	</title>
	<meta
		name="description"
		content="Esplora i contenuti didattici per {levelInfo?.name || 'questo livello'}. Trova teoria, esercizi e risorse per tutte le materie disponibili."
	/>
</svelte:head>

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
	<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
		{#if isLoading}
			<div class="flex justify-center items-center h-96">
				<div
					class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"
				></div>
			</div>
		{:else if levelInfo}
			<!-- Header Section -->
			<header class="mb-12" in:fade={{ duration: 300 }}>
				<!-- Back Button -->
				<Breadcrumb items={breadcrumbItems} />

				<div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
					<div class="flex items-start gap-6">
						{#if levelInfo.icon}
							{@const LevelIcon = levelInfo.icon}
							<div class="hidden sm:flex items-center justify-center size-32 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-500/25 text-rose-500 dark:text-rose-400">
								<LevelIcon class="size-16" />
							</div>
						{/if}

						<div class="flex-1 space-y-4">
							<div class="space-y-2">
								<div class="flex items-center gap-3">
									{#if levelInfo.icon}
										{@const LevelIcon = levelInfo.icon}
										<LevelIcon class="w-8 h-8 text-rose-500 dark:text-rose-400 sm:hidden" />
									{/if}
									<h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
										{levelInfo.name}
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
									<BookOpen class="w-4 h-4 text-rose-500" />
									<span class="font-medium">{levelInfo.subjects.length}</span> Materie
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

			<!-- Subjects Grid -->
			{#if levelInfo.subjects.length > 0}
				<section class="space-y-6" in:fade={{ duration: 400, delay: 100 }}>
					<div class="flex items-center justify-between border-b border-zinc-500/25 pb-4">
						<h2 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
							<BookOpen class="w-5 h-5 text-rose-500" />
							Materie disponibili
						</h2>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{#each levelInfo.subjects as subject, index (subject.id)}
							<div in:fly={{ y: 20, duration: 400, delay: index * 50 }} class="h-full">
								<NodeCard
									node={node}
								/>
							</div>
						{/each}
					</div>
				</section>
			{:else}
				<!-- Empty State -->
				<div class="flex flex-col items-center justify-center py-24 text-center" in:fade={{ duration: 300 }}>
					<div class="p-6 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-6 ring-1 ring-zinc-500/25">
						<BookOpen class="w-12 h-12 text-zinc-400 dark:text-zinc-600" />
					</div>
					<h3 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
						Nessuna materia disponibile
					</h3>
					<p class="text-zinc-600 dark:text-zinc-400 max-w-md mb-8">
						Al momento non ci sono materie disponibili per questo livello. Torna presto per
						nuovi contenuti!
					</p>
				</div>
			{/if}
		{:else}
			<!-- 404 State -->
			<div class="flex flex-col items-center justify-center py-24 text-center" in:fade={{ duration: 300 }}>
				<div class="p-6 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-6 ring-1 ring-zinc-500/25">
					<GraduationCap class="w-12 h-12 text-zinc-400 dark:text-zinc-600" />
				</div>
				<h3 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
					Livello non trovato
				</h3>
				<p class="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md">
					Il livello che stai cercando non esiste o non è disponibile.
				</p>
				<button
					onclick={() => goto('/wiki')}
					class="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
				>
					Torna alla home
				</button>
			</div>
		{/if}
	</div>
</div>
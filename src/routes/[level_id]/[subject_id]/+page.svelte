<script lang="ts">
	import { page } from '$app/state';
	import { contentTree, EducationalLevelMap } from '$lib/data/content-tree';
	import { fade, fly } from 'svelte/transition';
	import { BookOpen, Layers, FileText } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	
	import ChapterCard from '$lib/components/ui/cards/ChapterCard.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';

	let level_id = $derived(page.params.level_id);
	let subject_id = $derived(page.params.subject_id);

	let levelData = $derived.by(() => {
		if (!level_id) return null;
		return contentTree.find((l) => l.id === level_id);
	});

	let subjectData = $derived.by(() => {
		if (!levelData || !subject_id) return null;
		return levelData.subjects.find((s) => s.id === subject_id);
	});

	let levelInfo = $derived.by(() => {
		if (!levelData) return null;
		return {
			name: EducationalLevelMap[levelData.id],
			icon: levelData.icon
		};
	});

	let totalTopics = $derived(
		subjectData?.chapters.reduce((sum, chapter) => sum + chapter.topics.length, 0) || 0
	);

	let isLoading = $derived(!subjectData || !levelInfo);

	let breadcrumbItems = $derived.by(() => {
		if (!levelInfo || !subjectData) return [];
		return [
			{ label: 'Home', path: '/' },
			{ label: levelInfo.name, path: `/${level_id}` },
			{ label: subjectData.name }
		];
	});
</script>

<svelte:head>
	<title>
		{subjectData?.name || 'Materia'} - {levelInfo?.name || 'Livello'} - Sapiens
	</title>
	<meta
		name="description"
		content="Esplora i contenuti didattici di {subjectData?.name || 'questa materia'} per {levelInfo?.name || 'questo livello'}. Trova teoria, esercizi e risorse organizzate per capitoli."
	/>
</svelte:head>

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
	<!-- Background Pattern -->
	<div class="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
		style="background-image: radial-gradient(#6b7280 1px, transparent 1px); background-size: 24px 24px;">
	</div>

	<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
		{#if isLoading}
			<div class="flex justify-center items-center h-96">
				<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
			</div>
		{:else if subjectData && levelInfo}
			<!-- Header Section -->
			<header class="mb-12" in:fade={{ duration: 300 }}>
				<Breadcrumb items={breadcrumbItems} />

				<div class="mt-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
					<div class="flex items-start gap-6">
						{#if subjectData.icon}
							{@const SubjectIcon = subjectData.icon}
							<div class="hidden sm:flex items-center justify-center w-20 h-20 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 text-rose-500 dark:text-rose-400">
								<SubjectIcon class="w-10 h-10" />
							</div>
						{/if}
						
						<div class="flex-1 space-y-4">
							<div class="space-y-2">
								<div class="flex items-center gap-3">
									{#if subjectData.icon}
										{@const SubjectIcon = subjectData.icon}
										<SubjectIcon class="w-8 h-8 text-rose-500 dark:text-rose-400 sm:hidden" />
									{/if}
									<h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
										{subjectData.name}
									</h1>
								</div>
								<p class="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
									Esplora i contenuti organizzati per capitoli. Trova teoria, esercizi e risorse per approfondire ogni lezione.
								</p>
							</div>

							<!-- Quick Stats -->
							<div class="flex flex-wrap gap-3">
								<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-700 dark:text-zinc-300 backdrop-blur-sm">
									<Layers class="w-4 h-4 text-teal-500" />
									<span class="font-medium">{subjectData.chapters.length}</span> Capitoli
								</div>
								{#if totalTopics > 0}
									<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-700 dark:text-zinc-300 backdrop-blur-sm">
										<FileText class="w-4 h-4 text-indigo-500" />
										<span class="font-medium">{totalTopics}</span> Lezioni
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</header>

			<!-- Chapters Grid -->
			{#if subjectData.chapters.length > 0}
				<section class="space-y-6" in:fade={{ duration: 400, delay: 100 }}>
					<div class="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
						<h2 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
							<Layers class="w-5 h-5 text-teal-500" />
							Capitoli disponibili
						</h2>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{#each subjectData.chapters as chapter, index (chapter.id)}
							<div in:fly={{ y: 20, duration: 400, delay: index * 50 }} class="h-full">
								<ChapterCard
									chapter={chapter}
									level_id={level_id}
									subject_id={subject_id}
									topicCount={chapter.topics.length}
								/>
							</div>
						{/each}
					</div>
				</section>
			{:else}
				<!-- Empty State -->
				<div class="flex flex-col items-center justify-center py-24 text-center" in:fade={{ duration: 300 }}>
					<div class="p-6 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-6 ring-1 ring-zinc-200 dark:ring-zinc-800">
						<BookOpen class="w-12 h-12 text-zinc-400 dark:text-zinc-600" />
					</div>
					<h3 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
						Nessun capitolo disponibile
					</h3>
					<p class="text-zinc-600 dark:text-zinc-400 max-w-md mb-8">
						Al momento non ci sono capitoli disponibili per questa materia. Torna presto per nuovi contenuti!
					</p>
					<button
						onclick={() => goto(`/${level_id}`)}
						class="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
					>
						Torna alle materie
					</button>
				</div>
			{/if}
		{:else}
			<!-- 404 State -->
			<div class="flex flex-col items-center justify-center py-24 text-center" in:fade={{ duration: 300 }}>
				<div class="p-6 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-6 ring-1 ring-zinc-200 dark:ring-zinc-800">
					<BookOpen class="w-12 h-12 text-zinc-400 dark:text-zinc-600" />
				</div>
				<h3 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
					Materia non trovata
				</h3>
				<p class="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md">
					La materia che stai cercando non esiste o non è disponibile per questo livello.
				</p>
				<div class="flex gap-4">
					{#if level_id}
						<button
							onclick={() => goto(`/${level_id}`)}
							class="px-6 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium transition-all duration-200"
						>
							Torna al livello
						</button>
					{/if}
					<button
						onclick={() => goto('/')}
						class="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
					>
						Torna alla home
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
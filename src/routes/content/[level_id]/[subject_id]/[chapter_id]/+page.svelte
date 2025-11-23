<script lang="ts">
	import { contentTree, EducationalLevelMap } from '$lib/data/content-tree';
	import { fade, fly } from 'svelte/transition';
	import { BookOpen, FileText, Home, LibraryBig } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import TopicCard from '$lib/components/ui/cards/TopicCard.svelte';
	import Latex from '$lib/components/ui/Latex.svelte';

	let level_id = $derived(page.params.level_id);
	let subject_id = $derived(page.params.subject_id);
	let chapter_id = $derived(page.params.chapter_id);

	let levelData = $derived.by(() => {
		if (!level_id) return null;
		return contentTree.find((l) => l.id === level_id);
	});

	let subjectData = $derived.by(() => {
		if (!levelData || !subject_id) return null;
		return levelData.subjects.find((s) => s.id === subject_id);
	});

	let chapterData = $derived.by(() => {
		if (!subjectData || !chapter_id) return null;
		return subjectData.chapters.find((c) => c.id === chapter_id);
	});

	let levelInfo = $derived.by(() => {
		if (!levelData) return null;
		return {
			name: EducationalLevelMap[levelData.id],
			icon: levelData.icon
		};
	});

	let isLoading = $derived(!chapterData || !subjectData || !levelInfo);

	let breadcrumbItems = $derived.by(() => {
		if (!levelInfo || !subjectData || !chapterData) return [];
		return [
			{ label: 'Home', path: '/', icon: Home },
			{ label: 'Materiale didattico', path: '/content', icon: LibraryBig },
			{ label: levelInfo.name, path: `/content/${level_id}`, icon: levelInfo.icon },
			{ label: subjectData.name, path: `/content/${level_id}/${subject_id}`, icon: subjectData.icon },
			{ label: chapterData.name, icon: chapterData.icon }
		];
	});
</script>

<svelte:head>
	<title>
		{chapterData?.name || 'Capitolo'} - {subjectData?.name || 'Materia'} - {levelInfo?.name || 'Livello'} - Sapiens
	</title>
	<meta
		name="description"
		content="Esplora le lezioni del capitolo {chapterData?.name || 'questo capitolo'} di {subjectData?.name || 'questa materia'} per {levelInfo?.name || 'questo livello'}."
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
		{:else if chapterData && subjectData && levelInfo}
			<!-- Header Section -->
			<header class="mb-12" in:fade={{ duration: 300 }}>
				<!-- Breadcrumb Navigation -->
				<Breadcrumb items={breadcrumbItems} />

				<div class="mt-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
					<div class="flex items-start gap-6">
						{#if chapterData.icon}
							{@const ChapterIcon = chapterData.icon}
							<div class="hidden sm:flex items-center justify-center size-32 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-500/25 text-rose-500 dark:text-rose-400">
								<ChapterIcon class="size-16" />
							</div>
						{/if}

						<div class="flex-1 space-y-4">
							<div class="space-y-2">
								<div class="flex items-center gap-3">
									{#if chapterData.icon}
										{@const ChapterIcon = chapterData.icon}
										<ChapterIcon class="w-8 h-8 text-rose-500 dark:text-rose-400 sm:hidden" />
									{/if}
									<div class="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
										<Latex content={chapterData.name} />
									</div>
								</div>
								<p class="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
									Esplora le lezioni di questo capitolo. Trova teoria, esercizi e risorse per
									approfondire ogni concetto.
								</p>
							</div>

							<!-- Quick Stats -->
							{#if chapterData.topics.length > 0}
								<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-500/25 text-sm text-zinc-700 dark:text-zinc-300 backdrop-blur-sm">
									<FileText class="w-4 h-4 text-indigo-500" />
									<span class="font-medium">{chapterData.topics.length}</span> Lezioni
								</div>
							{/if}
						</div>
					</div>
				</div>
			</header>

			<!-- Topics Grid -->
			{#if chapterData.topics.length > 0}
				<section class="space-y-6" in:fade={{ duration: 400, delay: 100 }}>
					<div class="flex items-center justify-between border-b border-zinc-500/25 pb-4">
						<h2 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
							<FileText class="w-5 h-5 text-indigo-500" />
							Lezioni disponibili
						</h2>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{#each chapterData.topics as topic, index (topic.id)}
							<div in:fly={{ y: 20, duration: 400, delay: index * 50 }} class="h-full">
								<TopicCard
									topic={topic}
									level_id={level_id}
									subject_id={subject_id}
									chapter_id={chapter_id}
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
						Nessuna lezione disponibile
					</h3>
					<p class="text-zinc-600 dark:text-zinc-400 max-w-md mb-8">
						Al momento non ci sono lezioni disponibili per questo capitolo. Torna presto per
						nuovi contenuti!
					</p>
					<button
						onclick={() => goto(`/content/${level_id}/${subject_id}`)}
						class="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
					>
						Torna ai capitoli
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
					Capitolo non trovato
				</h3>
				<p class="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md">
					Il capitolo che stai cercando non esiste o non è disponibile.
				</p>
				<div class="flex gap-4">
					{#if level_id && subject_id}
						<button
							onclick={() => goto(`/content/${level_id}/${subject_id}`)}
							class="px-6 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-500/25 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium transition-all duration-200"
						>
							Torna alla materia
						</button>
					{/if}
					<button
						onclick={() => goto('/content')}
						class="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
					>
						Torna alla home
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
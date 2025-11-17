<script lang="ts">
	import { contentTree, EducationalLevelMap } from '$lib/data/content-tree';
	import { ArrowLeft, BookOpen, GraduationCap } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	import SubjectCard from '$lib/components/ui/cards/SubjectCard.svelte';

	let level_id = $derived(page.params.level_id);

	let levelData = $derived.by(() => {
		if (!level_id) return null;
		return contentTree.find((l) => l.id === level_id);
	});

	let levelInfo = $derived.by(() => {
		if (!levelData) return null;
		return {
			name: EducationalLevelMap[levelData.id],
			icon: levelData.icon,
			subjects: levelData.subjects
		};
	});

	let totalChapters = $derived(
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

<div class="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
		{#if isLoading}
			<div class="flex justify-center items-center h-96">
				<div
					class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"
				></div>
			</div>
		{:else if levelInfo}
			<!-- Header Section -->
			<header
				class="mb-8 sm:mb-12"
				in:fade={{ duration: 300 }}
			>
				<!-- Back Button -->
				<button
					onclick={() => goto('/')}
					class="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-200 mb-6 group"
				>
					<ArrowLeft
						class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200"
					/>
					<span class="text-sm font-medium">Torna alla home</span>
				</button>

				<!-- Level Title and Icon -->
				<div class="flex items-start gap-4 sm:gap-6 mb-6">
					{#if levelInfo.icon}
						{@const LevelIcon = levelInfo.icon}
						<div
							class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 to-rose-500/5 dark:from-rose-500/20 dark:to-rose-500/10 shadow-lg"
						>
							<LevelIcon
								class="w-8 h-8 sm:w-10 sm:h-10 text-rose-500 dark:text-rose-400"
							/>
						</div>
					{/if}

					<div class="flex-1">
						<h1
							class="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-3"
						>
							{levelInfo.name}
						</h1>
						<p
							class="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl"
						>
							Esplora i contenuti didattici disponibili per questo livello. Trova teoria,
							esercizi e risorse per tutte le materie.
						</p>
					</div>
				</div>

				<!-- Stats -->
				<div
					class="flex flex-wrap items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800"
				>
					<div class="flex items-center gap-2">
						<div
							class="p-2 rounded-lg bg-rose-500/10 dark:bg-rose-500/20"
						>
							<BookOpen class="w-4 h-4 text-rose-500 dark:text-rose-400" />
						</div>
						<div>
							<div class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
								{levelInfo.subjects.length}
							</div>
							<div class="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
								{levelInfo.subjects.length === 1 ? 'Materia' : 'Materie'}
							</div>
						</div>
					</div>

					<div class="flex items-center gap-2">
						<div
							class="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20"
						>
							<svg
								class="w-4 h-4 text-blue-500 dark:text-blue-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
								/>
							</svg>
						</div>
						<div>
							<div class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
								{totalChapters}
							</div>
							<div class="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
								{totalChapters === 1 ? 'Capitolo' : 'Capitoli'}
							</div>
						</div>
					</div>

					{#if totalTopics > 0}
						<div class="flex items-center gap-2">
							<div
								class="p-2 rounded-lg bg-green-500/10 dark:bg-green-500/20"
							>
								<svg
									class="w-4 h-4 text-green-500 dark:text-green-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
							<div>
								<div class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
									{totalTopics}
								</div>
								<div class="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
									{totalTopics === 1 ? 'Argomento' : 'Argomenti'}
								</div>
							</div>
						</div>
					{/if}
				</div>
			</header>

			<!-- Subjects Grid -->
			{#if levelInfo.subjects.length > 0}
				<section
					class="mb-8"
					in:fade={{ duration: 400, delay: 100 }}
				>
					<h2
						class="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6"
					>
						Materie disponibili
					</h2>

					<div
						class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
					>
						{#each levelInfo.subjects as subject, index (subject.id)}
							<div
								in:fly={{ y: 20, duration: 400, delay: index * 50 }}
							>
								<SubjectCard
									subject={subject}
									level_id={level_id}
									chapterCount={subject.chapters.length}
								/>
							</div>
						{/each}
					</div>
				</section>
			{:else}
				<!-- Empty State -->
				<div
					class="flex flex-col items-center justify-center py-16 text-center"
					in:fade={{ duration: 300 }}
				>
					<div
						class="p-6 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-6"
					>
						<BookOpen class="w-12 h-12 text-zinc-400 dark:text-zinc-600" />
					</div>
					<h3
						class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2"
					>
						Nessuna materia disponibile
					</h3>
					<p class="text-zinc-600 dark:text-zinc-400 max-w-md">
						Al momento non ci sono materie disponibili per questo livello. Torna presto per
						nuovi contenuti!
					</p>
				</div>
			{/if}
		{:else}
			<!-- 404 State -->
			<div
				class="flex flex-col items-center justify-center py-16 text-center"
				in:fade={{ duration: 300 }}
			>
				<div
					class="p-6 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-6"
				>
					<GraduationCap class="w-12 h-12 text-zinc-400 dark:text-zinc-600" />
				</div>
				<h3
					class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2"
				>
					Livello non trovato
				</h3>
				<p class="text-zinc-600 dark:text-zinc-400 mb-6 max-w-md">
					Il livello che stai cercando non esiste o non è disponibile.
				</p>
				<button
					onclick={() => goto('/')}
					class="px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium transition-colors duration-200"
				>
					Torna alla home
				</button>
			</div>
		{/if}
	</div>
</div>


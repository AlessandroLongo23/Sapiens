<script lang="ts">
	import { contentTree, EducationalLevelMap } from '$lib/data/content-tree';
	import { BookOpen, FileText, PenLine, ChevronRight } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	import Breadcrumb from '$lib/components/shared/ui/Breadcrumb.svelte';
	import Latex from '$lib/components/shared/ui/Latex.svelte';
	
	let level_id = $derived(page.params.level_id);
	let subject_id = $derived(page.params.subject_id);
	let chapter_id = $derived(page.params.chapter_id);
	let topic_id = $derived(page.params.topic_id);

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

	let topicData = $derived.by(() => {
		if (!chapterData || !topic_id) return null;
		return chapterData.topics.find((t) => t.id === topic_id);
	});

	let levelInfo = $derived.by(() => {
		if (!levelData) return null;
		return {
			name: EducationalLevelMap[levelData.id],
			icon: levelData.icon
		};
	});

	let isLoading = $derived(!topicData || !chapterData || !subjectData || !levelInfo);

	let breadcrumbItems = $derived.by(() => {
		if (!levelInfo || !subjectData || !chapterData || !topicData) return [];
		return [
			{ label: 'Home', path: '/' },
			{ label: levelInfo.name, path: `/${level_id}` },
			{ label: subjectData.name, path: `/${level_id}/${subject_id}` },
			{ label: chapterData.name, path: `/${level_id}/${subject_id}/${chapter_id}` },
			{ label: topicData.name }
		];
	});

	function handleContentTypeClick(contentType: string) {
		goto(`/${level_id}/${subject_id}/${chapter_id}/${topic_id}/${contentType}`);
	}

	const contents = [
		{
			type: 'theory',
			title: 'Teoria',
			description: 'Studia i concetti teorici, le definizioni e gli esempi per comprendere appieno l\'argomento.',
			icon: FileText,
			buttonText: 'Inizia a studiare',
		},
		{
			type: 'exercises',
			title: 'Esercizi',
			description: 'Metti in pratica le tue conoscenze con esercizi interattivi e problemi da risolvere.',
			icon: PenLine,
			buttonText: 'Inizia a esercitarti',
		}
	]
</script>

<svelte:head>
	<title>
		{topicData?.name || 'Argomento'} - {chapterData?.name || 'Capitolo'} - {subjectData?.name || 'Materia'} - Sapiens
	</title>
	<meta
		name="description"
		content="Studia {topicData?.name || 'questo argomento'} del capitolo {chapterData?.name || 'questo capitolo'} di {subjectData?.name || 'questa materia'}. Teoria ed esercizi disponibili."
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
		{:else if topicData && chapterData && subjectData && levelInfo}
			<!-- Header Section -->
			<header
				class="mb-8 sm:mb-12"
				in:fade={{ duration: 300 }}
			>
				<!-- Breadcrumb Navigation -->
				<Breadcrumb items={breadcrumbItems} />

				<!-- Topic Title and Icon -->
				<div class="flex items-start gap-4 sm:gap-6 mb-6">
					<div
						class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 to-rose-500/5 dark:from-rose-500/20 dark:to-rose-500/10 shadow-lg"
					>
						<BookOpen
							class="w-8 h-8 sm:w-10 sm:h-10 text-rose-500 dark:text-rose-400"
						/>
					</div>

					<div class="flex-1">
						<Latex
							class="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-3"
							content={topicData.name}
						/>
						<p
							class="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl"
						>
							Esplora la teoria e gli esercizi per questo argomento. Approfondisci i concetti
							e metti in pratica le tue conoscenze.
						</p>
					</div>
				</div>
			</header>

			<!-- Content Type Cards -->
			<section
				class="mb-8"
				in:fade={{ duration: 400, delay: 100 }}
			>
				<h2 class="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
					Contenuti disponibili
				</h2>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
					{#each contents as content }
						<button
							onclick={() => handleContentTypeClick(content.type)}
							class="group relative overflow-hidden rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-rose-300 dark:hover:border-rose-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/10 p-6 sm:p-8 text-left"
							tabindex="0"
						>
							<div
								class="absolute inset-0 bg-gradient-to-br from-rose-500/0 via-rose-500/0 to-rose-500/0 group-hover:from-rose-500/5 group-hover:via-rose-500/3 group-hover:to-rose-500/5 transition-all duration-300"
							></div>

							<div class="relative flex flex-col">
								<div class="flex items-start justify-between mb-4">
									<div class="p-3 rounded-xl bg-gradient-to-br from-rose-500/10 to-rose-500/5 dark:from-rose-500/20 dark:to-rose-500/10 group-hover:from-rose-500/20 group-hover:to-rose-500/10 dark:group-hover:from-rose-500/30 dark:group-hover:to-rose-500/20 transition-all duration-300">
										<content.icon
											class="w-6 h-6 sm:w-7 sm:h-7 text-rose-500 dark:text-rose-400 transition-transform duration-300 group-hover:scale-110"
										/>
									</div>
								</div>

								<h3 class="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors duration-300">
									{content.title}
								</h3>

								<p class="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mb-4">
									{content.description}
								</p>

								<div class="flex items-center gap-2 text-rose-500 dark:text-rose-400 font-medium text-sm sm:text-base mt-auto">
									<span>{content.buttonText}</span>
									<ChevronRight class="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
								</div>
							</div>
						</button>
					{/each}
				</div>
			</section>

			<!-- Related Topics (if available) -->
			{#if chapterData.topics.length > 1}
				<section
					class="mb-8"
					in:fade={{ duration: 400, delay: 200 }}
				>
					<h2 class="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
						Altri argomenti del capitolo
					</h2>

					<div class="flex flex-wrap gap-2">
						{#each chapterData.topics as relatedTopic}
							{#if relatedTopic.id !== topic_id}
								<button
									onclick={() => goto(`/${level_id}/${subject_id}/${chapter_id}/${relatedTopic.id}`)}
									class="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-200 text-sm font-medium"
								>
									<Latex content={relatedTopic.name} />
								</button>
							{/if}
						{/each}
					</div>
				</section>
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
					<BookOpen class="w-12 h-12 text-zinc-400 dark:text-zinc-600" />
				</div>
				<h3
					class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2"
				>
					Argomento non trovato
				</h3>
				<p class="text-zinc-600 dark:text-zinc-400 mb-6 max-w-md">
					L'argomento che stai cercando non esiste o non è disponibile.
				</p>
				<div class="flex gap-4">
					{#if level_id && subject_id && chapter_id}
						<button
							onclick={() => goto(`/${level_id}/${subject_id}/${chapter_id}`)}
							class="px-6 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium transition-colors duration-200"
						>
							Torna al capitolo
						</button>
					{/if}
					<button
						onclick={() => goto('/')}
						class="px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium transition-colors duration-200"
					>
						Torna alla home
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	button:focus-visible {
		outline: 2px solid rgb(236 72 153);
		outline-offset: 2px;
	}
</style>


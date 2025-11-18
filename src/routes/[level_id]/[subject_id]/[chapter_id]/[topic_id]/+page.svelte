<script lang="ts">
	import { contentTree, EducationalLevelMap } from '$lib/data/content-tree';
	import { BookOpen, FileText, PenLine, ChevronRight, Sparkles } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import Latex from '$lib/components/ui/Latex.svelte';
	
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
			description: 'Studia i concetti teorici, le definizioni e gli esempi per comprendere appieno la lezione.',
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
		{topicData?.name || 'Lezione'} - {chapterData?.name || 'Capitolo'} - {subjectData?.name || 'Materia'} - Sapiens
	</title>
	<meta
		name="description"
		content="Studia {topicData?.name || 'questa lezione'} del capitolo {chapterData?.name || 'questo capitolo'} di {subjectData?.name || 'questa materia'}. Teoria ed esercizi disponibili."
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
				<div
					class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"
				></div>
			</div>
		{:else if topicData && chapterData && subjectData && levelInfo}
			<header class="mb-12" in:fade={{ duration: 300 }}>
				<Breadcrumb items={breadcrumbItems} />

				<div class="mt-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
					<div class="flex items-start gap-6">
						<div class="hidden sm:flex items-center justify-center w-20 h-20 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 text-rose-500 dark:text-rose-400">
							<BookOpen class="w-10 h-10" />
						</div>

						<div class="flex-1 space-y-4">
							<div class="space-y-2">
								<div class="flex items-center gap-3">
									<BookOpen class="w-8 h-8 text-rose-500 dark:text-rose-400 sm:hidden" />
									<div class="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
										<Latex content={topicData.name} />
									</div>
								</div>
								<p class="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
									Esplora la teoria e gli esercizi per questa lezione. Approfondisci i concetti
									e metti in pratica le tue conoscenze.
								</p>
							</div>
						</div>
					</div>
				</div>
			</header>

			<section class="space-y-6" in:fade={{ duration: 400, delay: 100 }}>
				<div class="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
					<h2 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
						<Sparkles class="w-5 h-5 text-amber-500" />
						Contenuti disponibili
					</h2>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
					{#each contents as content, i }
						<button
							onclick={() => handleContentTypeClick(content.type)}
							class="group w-full h-full flex flex-col text-left relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-300 hover:border-rose-200 dark:hover:border-rose-800 hover:shadow-xl hover:shadow-rose-500/5 hover:-translate-y-1"
							in:fly={{ y: 20, duration: 400, delay: i * 100 }}
						>
							<div 
								class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-rose-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
							></div>

							<div class="p-8 flex flex-col h-full">
								<div class="flex items-start justify-between mb-6">
									<div class="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:text-rose-500 dark:group-hover:text-rose-400 group-hover:bg-rose-50 dark:group-hover:bg-rose-900/20 transition-colors duration-300">
										<content.icon class="w-8 h-8 transition-transform duration-300 group-hover:scale-110" />
									</div>
								</div>

								<h3 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors duration-300">
									{content.title}
								</h3>

								<p class="text-base text-zinc-600 dark:text-zinc-400 mb-8 flex-1 leading-relaxed">
									{content.description}
								</p>

								<div class="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
									<span class="font-medium text-rose-500 dark:text-rose-400 group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors">
										{content.buttonText}
									</span>
									<ChevronRight class="w-5 h-5 text-rose-500 dark:text-rose-400 transform group-hover:translate-x-1 transition-transform duration-300" />
								</div>
							</div>
						</button>
					{/each}
				</div>
			</section>

			{#if chapterData.topics.length > 1}
				<section class="mt-12" in:fade={{ duration: 400, delay: 200 }}>
					<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
						Altre lezioni dello stesso capitolo
					</h2>

					<div class="flex flex-wrap gap-3">
						{#each chapterData.topics as relatedTopic}
							{#if relatedTopic.id !== topic_id}
								<button
									onclick={() => goto(`/${level_id}/${subject_id}/${chapter_id}/${relatedTopic.id}`)}
									class="px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-rose-200 dark:hover:border-rose-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all duration-200 text-sm font-medium"
								>
									<Latex content={relatedTopic.name} />
								</button>
							{/if}
						{/each}
					</div>
				</section>
			{/if}
		{:else}
			<div class="flex flex-col items-center justify-center py-24 text-center" in:fade={{ duration: 300 }}>
				<div class="p-6 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-6 ring-1 ring-zinc-200 dark:ring-zinc-800">
					<BookOpen class="w-12 h-12 text-zinc-400 dark:text-zinc-600" />
				</div>
				<h3 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
					Lezione non trovata
				</h3>
				<p class="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md">
					La lezione che stai cercando non esiste o non è disponibile.
				</p>
				<div class="flex gap-4">
					{#if level_id && subject_id && chapter_id}
						<button
							onclick={() => goto(`/${level_id}/${subject_id}/${chapter_id}`)}
							class="px-6 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium transition-all duration-200"
						>
							Torna al capitolo
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
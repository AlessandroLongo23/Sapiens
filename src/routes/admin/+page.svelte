<script lang="ts">
	import { 
		GraduationCap, 
		BookOpen, 
		Layers, 
		FileText, 
		Book,
		PenLine,
		Sigma,
		Zap,
		Pencil,
		FolderTree,
		Target,
		AlertCircle,
		TrendingUp
	} from 'lucide-svelte';

	import StatCard from '$lib/components/admin/StatCard.svelte';
	import ContentProgressBar from '$lib/components/admin/ContentProgressBar.svelte';
	import LevelBarChart from '$lib/components/admin/LevelBarChart.svelte';
	import CompletionGauge from '$lib/components/admin/CompletionGauge.svelte';
	import QuickAction from '$lib/components/admin/QuickAction.svelte';
	import LevelCard from '$lib/components/admin/LevelCard.svelte';
	import TopicStatusRow from '$lib/components/admin/TopicStatusRow.svelte';
	import ContentGapCard from '$lib/components/admin/ContentGapCard.svelte';

	import type { ContentStats } from './+page.server';

	let { data } = $props();
	let stats: ContentStats | null = $derived(data.stats);

	// Calculate completion percentage
	let completionPercent = $derived(stats && stats.topics > 0 ? Math.round((stats.fullyComplete / stats.topics) * 100) : 0);

	// Bar chart data
	let barData = $derived(stats ? stats.levelBreakdown.map(l => ({
		name: l.title.replace('Scuole ', '').replace('Scuola ', '').substring(0, 10),
		total: l.topics,
		ready: l.readyTopics
	})) : []);
</script>

<svelte:head>
	<title>Dashboard Admin - Sapiens</title>
</svelte:head>

<div class="h-screen overflow-hidden flex flex-col p-4 lg:p-6">
	{#if stats}
		<!-- Main Grid -->
		<div class="flex-1 grid grid-cols-12 gap-4 lg:gap-5 min-h-0">
			
			<!-- Left Column: Actions + Stats -->
			<div class="col-span-12 lg:col-span-3 flex flex-col gap-4">
				<!-- Quick Actions -->
				<QuickAction 
					title="Genera Contenuto"
					description="Apri il desk per creare"
					icon={Pencil}
					href="/admin/desk"
					color="rose"
				/>

				<QuickAction 
					title="Sfoglia Wiki"
					description="Gestisci la struttura"
					icon={FolderTree}
					href="/admin/wiki"
					color="violet"
				/>

				<!-- Structure Stats -->
				<div class="bg-white dark:bg-zinc-800/60 rounded-2xl p-4 border border-zinc-200/60 dark:border-zinc-700/60 backdrop-blur-sm">
					<h3 class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
						Struttura
					</h3>
					<div class="grid grid-cols-2 gap-3">
						<StatCard value={stats.levels} label="Livelli" icon={GraduationCap} color="indigo" />
						<StatCard value={stats.subjects} label="Materie" icon={BookOpen} color="teal" />
						<StatCard value={stats.chapters} label="Capitoli" icon={Layers} color="amber" />
						<StatCard value={stats.topics} label="Topic" icon={FileText} color="rose" />
					</div>
				</div>

				<!-- Completion Gauge -->
				<div class="bg-white dark:bg-zinc-800/60 rounded-2xl p-4 border border-zinc-200/60 dark:border-zinc-700/60 backdrop-blur-sm flex flex-col items-center justify-center">
					<div class="flex items-center gap-2 mb-2">
						<Target class="size-4 text-zinc-400" />
						<p class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
							Topic Pronti
						</p>
					</div>
					<CompletionGauge percent={completionPercent} label="completi" size={130} />
					<p class="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-1">
						{stats.fullyComplete} di {stats.topics} topic
					</p>
				</div>
			</div>

			<!-- Center Column: Content Progress + Gaps -->
			<div class="col-span-12 lg:col-span-5 flex flex-col gap-4">
				<!-- Content Progress -->
				<div class="bg-white dark:bg-zinc-800/60 rounded-2xl p-5 border border-zinc-200/60 dark:border-zinc-700/60 backdrop-blur-sm">
					<div class="flex items-center gap-2 mb-4">
						<TrendingUp class="size-4 text-zinc-400" />
						<h3 class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
							Copertura Contenuti
						</h3>
					</div>

					<div class="space-y-4">
						<ContentProgressBar 
							label="Teoria"
							value={stats.topicsWithTheory}
							total={stats.topics}
							icon={Book}
							color="blue"
						/>
						<ContentProgressBar 
							label="Esercizi"
							value={stats.topicsWithExercises}
							total={stats.topics}
							icon={PenLine}
							color="emerald"
						/>
						<ContentProgressBar 
							label="Formulario"
							value={stats.topicsWithFormulary}
							total={stats.topics}
							icon={Sigma}
							color="violet"
						/>
						<ContentProgressBar 
							label="Flashcards"
							value={stats.topicsWithFlashcards}
							total={stats.topics}
							icon={Zap}
							color="amber"
						/>
					</div>
				</div>

				<!-- Content Gaps -->
				<div class="bg-white dark:bg-zinc-800/60 rounded-2xl p-5 border border-zinc-200/60 dark:border-zinc-700/60 backdrop-blur-sm">
					<div class="flex items-center gap-2 mb-4">
						<AlertCircle class="size-4 text-zinc-400" />
						<h3 class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
							Contenuti Mancanti
						</h3>
					</div>

					<div class="grid grid-cols-2 gap-3">
						<ContentGapCard 
							label="Teoria"
							missing={stats.contentGaps.missingTheory}
							total={stats.topics}
							icon={Book}
							color="blue"
						/>
						<ContentGapCard 
							label="Esercizi"
							missing={stats.contentGaps.missingExercises}
							total={stats.topics}
							icon={PenLine}
							color="emerald"
						/>
						<ContentGapCard 
							label="Formulario"
							missing={stats.contentGaps.missingFormulary}
							total={stats.topics}
							icon={Sigma}
							color="violet"
						/>
						<ContentGapCard 
							label="Flashcards"
							missing={stats.contentGaps.missingFlashcards}
							total={stats.topics}
							icon={Zap}
							color="amber"
						/>
					</div>
				</div>

				<!-- Topics Needing Work -->
				<div class="bg-white dark:bg-zinc-800/60 rounded-2xl p-5 border border-zinc-200/60 dark:border-zinc-700/60 backdrop-blur-sm flex-1 overflow-hidden flex flex-col min-h-0">
					<div class="flex items-center justify-between mb-3">
						<div class="flex items-center gap-2">
							<AlertCircle class="size-4 text-amber-500" />
							<h3 class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
								Topic da Completare
							</h3>
						</div>
						<span class="text-xs text-zinc-400">{stats.topicsNeedingWork.length} topic</span>
					</div>

					<div class="space-y-2 overflow-y-auto flex-1 -mr-2 pr-2">
						{#each stats.topicsNeedingWork as topic (topic.id)}
							<TopicStatusRow 
								title={topic.title}
								path={topic.path}
								hasTheory={topic.hasTheory}
								hasFormulary={topic.hasFormulary}
								hasExercises={topic.hasExercises}
								hasFlashcards={topic.hasFlashcards}
							/>
						{/each}
						
						{#if stats.topicsNeedingWork.length === 0}
							<div class="flex flex-col items-center justify-center py-6 text-center">
								<div class="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-2">
									<Target class="size-5 text-emerald-500" />
								</div>
								<p class="text-sm font-medium text-emerald-600 dark:text-emerald-400">Tutto completato!</p>
								<p class="text-xs text-zinc-500">Ottimo lavoro.</p>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Right Column: Level Breakdown -->
			<div class="col-span-12 lg:col-span-4 flex flex-col gap-4">
				<!-- Bar Chart -->
				<div class="bg-white dark:bg-zinc-800/60 rounded-2xl p-5 border border-zinc-200/60 dark:border-zinc-700/60 backdrop-blur-sm">
					<h3 class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
						Topic per Livello
					</h3>
					<div class="flex items-center justify-center">
						<LevelBarChart data={barData} width={280} height={150} />
					</div>
					<div class="flex items-center justify-center gap-6 mt-3 text-xs">
						<div class="flex items-center gap-2">
							<div class="size-2.5 rounded bg-zinc-300 dark:bg-zinc-600"></div>
							<span class="text-zinc-500">Totali</span>
						</div>
						<div class="flex items-center gap-2">
							<div class="size-2.5 rounded bg-rose-500"></div>
							<span class="text-zinc-500">Pronti</span>
						</div>
					</div>
				</div>

				<!-- Level Cards -->
				<div class="bg-white dark:bg-zinc-800/60 rounded-2xl p-5 border border-zinc-200/60 dark:border-zinc-700/60 backdrop-blur-sm flex-1 overflow-hidden flex flex-col min-h-0">
					<h3 class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
						Dettaglio Livelli
					</h3>

					<div class="space-y-3 overflow-y-auto flex-1 -mr-2 pr-2">
						{#each stats.levelBreakdown as level (level.id)}
							<LevelCard 
								title={level.title}
								subjects={level.subjects}
								chapters={level.chapters}
								topics={level.topics}
								readyTopics={level.readyTopics}
							/>
						{/each}
						
						{#if stats.levelBreakdown.length === 0}
							<div class="flex items-center justify-center py-8 text-center">
								<p class="text-sm text-zinc-500">Nessun livello disponibile</p>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Empty State -->
		<div class="flex-1 flex items-center justify-center">
			<div class="text-center max-w-md">
				<div class="p-5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-5 inline-block">
					<FileText class="size-10 text-zinc-400" />
				</div>
				<h2 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
					Nessun dato disponibile
				</h2>
				<p class="text-zinc-500 mb-6">
					Non è stato possibile caricare i dati dei contenuti. 
					Verifica la connessione al database o inizia ad aggiungere contenuti.
				</p>
				<a 
					href="/admin/desk"
					class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium transition-all duration-200 shadow-lg shadow-rose-500/25"
				>
					<Pencil class="size-4" />
					Inizia a creare
				</a>
			</div>
		</div>
	{/if}
</div>

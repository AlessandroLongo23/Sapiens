<script lang="ts">
	import { Book, PenLine, Sigma, Zap, Sparkles, Save, Construction } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';
	import FormInput from '$lib/components/ui/forms/FormInput.svelte';
	import FormButton from '$lib/components/ui/forms/FormButton.svelte';
	import MarkdownMessage from '$lib/components/ui/MarkdownMessage.svelte';
	import Latex from '$lib/components/ui/Latex.svelte';
	import ContentTreeSidebar from '$lib/components/admin/ContentTreeSidebar.svelte';
	import NodeModal from '$lib/components/admin/NodeModal.svelte';
	import ConfirmModal from '$lib/components/admin/ConfirmModal.svelte';
	import type { ContentNodeWithStatus } from './+page.server';

	let { data } = $props();
	let tree = $derived(data.tree || []);

	// Selection state
	let selectedNode = $state<ContentNodeWithStatus | null>(null);
	let selectedId = $derived(selectedNode?.id || null);
	
	// Tab state
	type ContentTab = 'theory' | 'exercises' | 'formulary' | 'flashcards';
	let selectedTab = $state<ContentTab>('theory');

	// Generation form state
	let topicTitle = $state('');
	let isLoading = $state(false);
	let error = $state('');
	let success = $state('');
	let generatedContent = $state('');

	// Editor state (for existing content)
	let theoryContent = $state('');
	let formularyContent = $state('');
	let isSaving = $state(false);
	let hasTheoryChanges = $state(false);
	let hasFormularyChanges = $state(false);

	// Modal states
	let renameModalOpen = $state(false);
	let addModalOpen = $state(false);
	let deleteModalOpen = $state(false);
	let modalNode = $state<ContentNodeWithStatus | null>(null);
	let modalValue = $state('');
	let modalLoading = $state(false);
	let modalError = $state('');

	// Derived states
	let isTopic = $derived(selectedNode?.type === 'topic');
	
	// Tab configuration with static Tailwind classes
	const tabs: { 
		id: ContentTab; 
		label: string; 
		icon: typeof Book; 
		activeClass: string;
		iconActiveClass: string;
		dotClass: string;
		hasContent: () => boolean;
	}[] = [
		{ 
			id: 'theory', 
			label: 'Teoria', 
			icon: Book, 
			activeClass: 'text-blue-600 dark:text-blue-400',
			iconActiveClass: 'text-blue-500',
			dotClass: 'bg-blue-500',
			hasContent: () => selectedNode?.hasTheory || false 
		},
		{ 
			id: 'exercises', 
			label: 'Esercizi', 
			icon: PenLine, 
			activeClass: 'text-emerald-600 dark:text-emerald-400',
			iconActiveClass: 'text-emerald-500',
			dotClass: 'bg-emerald-500',
			hasContent: () => selectedNode?.hasExercises || false 
		},
		{ 
			id: 'formulary', 
			label: 'Formulario', 
			icon: Sigma, 
			activeClass: 'text-violet-600 dark:text-violet-400',
			iconActiveClass: 'text-violet-500',
			dotClass: 'bg-violet-500',
			hasContent: () => selectedNode?.hasFormulary || false 
		},
		{ 
			id: 'flashcards', 
			label: 'Flashcards', 
			icon: Zap, 
			activeClass: 'text-amber-600 dark:text-amber-400',
			iconActiveClass: 'text-amber-500',
			dotClass: 'bg-amber-500',
			hasContent: () => selectedNode?.hasFlashcards || false 
		}
	];

	// Child type labels
	const childTypeLabels: Record<string, string> = {
		level: 'materia',
		subject: 'capitolo',
		chapter: 'topic'
	};

	// Handle node selection
	function handleSelectNode(node: ContentNodeWithStatus) {
		selectedNode = node;
		selectedTab = 'theory'; // Reset to theory tab
		error = '';
		success = '';
		generatedContent = '';

		if (node.type === 'topic') {
			topicTitle = node.title;
			theoryContent = node.theory || '';
			formularyContent = node.formulary || '';
			hasTheoryChanges = false;
			hasFormularyChanges = false;
		}
	}

	// Build path for display
	function buildDisplayPath(node: ContentNodeWithStatus): string {
		return node.path.split('/').slice(0, -1).join(' › ');
	}

	// ========== Tree Node Actions ==========

	function handleRename(node: ContentNodeWithStatus) {
		modalNode = node;
		modalValue = node.title;
		modalError = '';
		renameModalOpen = true;
	}

	function handleAddChild(node: ContentNodeWithStatus) {
		modalNode = node;
		modalValue = '';
		modalError = '';
		addModalOpen = true;
	}

	function handleDelete(node: ContentNodeWithStatus) {
		modalNode = node;
		deleteModalOpen = true;
	}

	function handleAddRoot() {
		modalNode = null;
		modalValue = '';
		modalError = '';
		addModalOpen = true;
	}

	async function confirmRename(newTitle: string) {
		if (!modalNode) return;
		
		modalLoading = true;
		modalError = '';

		try {
			// TODO: Implement API call to rename node
			console.log('Rename:', modalNode.id, 'to', newTitle);
			await new Promise(resolve => setTimeout(resolve, 500)); // Placeholder
			
			renameModalOpen = false;
			modalNode = null;
			await invalidateAll(); // Refresh data
		} catch (e) {
			modalError = e instanceof Error ? e.message : 'Errore durante la rinomina';
		} finally {
			modalLoading = false;
		}
	}

	async function confirmAddChild(title: string) {
		modalLoading = true;
		modalError = '';

		try {
			// Determine the type of child to create
			const parentType = modalNode?.type;
			const childType = parentType === 'level' ? 'subject' 
				: parentType === 'subject' ? 'chapter'
				: parentType === 'chapter' ? 'topic'
				: 'level'; // Root level

			// TODO: Implement API call to add child node
			console.log('Add child:', { 
				parentId: modalNode?.id || null, 
				title, 
				type: childType 
			});
			await new Promise(resolve => setTimeout(resolve, 500)); // Placeholder
			
			addModalOpen = false;
			modalNode = null;
			await invalidateAll(); // Refresh data
		} catch (e) {
			modalError = e instanceof Error ? e.message : 'Errore durante la creazione';
		} finally {
			modalLoading = false;
		}
	}

	async function confirmDelete() {
		if (!modalNode) return;
		
		modalLoading = true;

		try {
			// TODO: Implement API call to delete node
			console.log('Delete:', modalNode.id);
			await new Promise(resolve => setTimeout(resolve, 500)); // Placeholder
			
			deleteModalOpen = false;
			if (selectedNode?.id === modalNode.id) {
				selectedNode = null;
			}
			modalNode = null;
			await invalidateAll(); // Refresh data
		} catch (e) {
			console.error('Delete error:', e);
		} finally {
			modalLoading = false;
		}
	}

	// ========== Content Actions ==========

	async function handleGenerate() {
		if (!topicTitle.trim() || !selectedNode) return;

		isLoading = true;
		error = '';
		success = '';
		generatedContent = '';

		try {
			const response = await fetch('/api/generate-draft', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ lessonTopic: topicTitle.trim() })
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Errore durante la generazione');
			}

			if (data.success) {
				success = 'Draft generato con successo!';
				generatedContent = data.lesson_markdown;
			} else {
				throw new Error(data.error || 'Errore durante la generazione');
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Errore sconosciuto';
		} finally {
			isLoading = false;
		}
	}

	async function handleSaveTheory() {
		if (!selectedNode) return;

		isSaving = true;
		// TODO: Implement actual save to database
		await new Promise(resolve => setTimeout(resolve, 500));
		hasTheoryChanges = false;
		isSaving = false;
	}

	async function handleSaveFormulary() {
		if (!selectedNode) return;

		isSaving = true;
		// TODO: Implement actual save to database
		await new Promise(resolve => setTimeout(resolve, 500));
		hasFormularyChanges = false;
		isSaving = false;
	}
</script>

<svelte:head>
	<title>Admin Desk - Sapiens</title>
</svelte:head>

<!-- Modals -->
<NodeModal
	isOpen={renameModalOpen}
	title="Rinomina"
	label="Nuovo nome"
	bind:value={modalValue}
	placeholder="Inserisci il nuovo nome..."
	confirmLabel="Rinomina"
	isLoading={modalLoading}
	error={modalError}
	onConfirm={confirmRename}
	onCancel={() => { renameModalOpen = false; modalNode = null; }}
/>

<NodeModal
	isOpen={addModalOpen}
	title={modalNode ? `Aggiungi ${childTypeLabels[modalNode.type] || 'elemento'}` : 'Aggiungi livello'}
	label="Nome"
	bind:value={modalValue}
	placeholder={modalNode ? `Nome del nuovo ${childTypeLabels[modalNode.type] || 'elemento'}...` : 'Nome del nuovo livello...'}
	confirmLabel="Crea"
	isLoading={modalLoading}
	error={modalError}
	onConfirm={confirmAddChild}
	onCancel={() => { addModalOpen = false; modalNode = null; }}
/>

<ConfirmModal
	isOpen={deleteModalOpen}
	title="Elimina elemento"
	message={modalNode ? `Sei sicuro di voler eliminare "${modalNode.title}"? Questa azione eliminerà anche tutti gli elementi figli e non può essere annullata.` : ''}
	confirmLabel="Elimina"
	isLoading={modalLoading}
	onConfirm={confirmDelete}
	onCancel={() => { deleteModalOpen = false; modalNode = null; }}
/>

<div class="h-screen flex overflow-hidden">
	<!-- Sidebar -->
	<aside class="w-72 shrink-0">
		<ContentTreeSidebar 
			{tree}
			{selectedId}
			onSelect={handleSelectNode}
			onRename={handleRename}
			onAddChild={handleAddChild}
			onDelete={handleDelete}
			onAddRoot={handleAddRoot}
		/>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
		{#if !selectedNode}
			<!-- Empty State -->
			<div class="h-full flex items-center justify-center">
				<div class="text-center max-w-md px-4">
					<div class="p-5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-5 inline-block">
						<Sparkles class="size-10 text-zinc-400" />
					</div>
					<h2 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
						Seleziona un topic
					</h2>
					<p class="text-zinc-500">
						Seleziona un topic dalla struttura a sinistra per generare nuovi contenuti o modificare quelli esistenti.
					</p>
				</div>
			</div>
		{:else if !isTopic}
			<!-- Non-topic selected -->
			<div class="h-full flex items-center justify-center">
				<div class="text-center max-w-md px-4">
					<div class="p-5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-5 inline-block">
						<Sparkles class="size-10 text-zinc-400" />
					</div>
					<h2 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
						<Latex content={selectedNode.title} />
					</h2>
					<p class="text-zinc-500">
						Espandi questa sezione e seleziona un topic per modificarlo o generare contenuti.
					</p>
				</div>
			</div>
		{:else}
			<div class="h-full flex flex-col p-6">
				<!-- Topic Header -->
				<header class="mb-6 shrink-0">
					<p class="text-sm text-zinc-500 mb-1">{buildDisplayPath(selectedNode)}</p>
					<h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
						<Latex content={selectedNode.title} />
					</h1>

					<!-- Content Tabs -->
					<div class="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-fit">
						{#each tabs as tab}
							{@const hasContent = tab.hasContent()}
							{@const isActive = selectedTab === tab.id}
							<button
								type="button"
								onclick={() => selectedTab = tab.id}
								class="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
									{isActive 
										? `bg-white dark:bg-zinc-700 shadow-sm ${tab.activeClass}` 
										: 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}"
							>
								<tab.icon class="size-3.5 {hasContent ? tab.iconActiveClass : 'text-zinc-400'}" />
								{tab.label}
								{#if hasContent}
									<span class="size-1.5 rounded-full {tab.dotClass}"></span>
								{/if}
							</button>
						{/each}
					</div>
				</header>

				<!-- Tab Content -->
				{#if selectedTab === 'theory'}
					<!-- Theory Tab -->
					{#if !selectedNode.hasTheory}
						<!-- Content Generator -->
						<div class="flex-1 flex flex-col min-h-0">
							<div class="bg-white dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 p-6 space-y-6">
								<div class="flex items-center gap-3">
									<div class="p-2.5 rounded-xl bg-rose-500/10 text-rose-500">
										<Sparkles class="size-5" />
									</div>
									<div>
										<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
											Genera teoria
										</h2>
										<p class="text-sm text-zinc-500">
											Nessuna teoria esistente. Genera un nuovo draft con AI.
										</p>
									</div>
								</div>

								<form
									onsubmit={(e) => {
										e.preventDefault();
										handleGenerate();
									}}
									class="space-y-4"
								>
									<FormInput
										bind:value={topicTitle}
										label="Titolo del topic"
										placeholder="Es: Equazioni di Secondo Grado"
										required={true}
										disabled={isLoading}
										error={error && !success ? error : ''}
									/>

									<FormButton
										variant="primary"
										size="lg"
										fullWidth={true}
										loading={isLoading}
										disabled={isLoading || !topicTitle.trim()}
										onclick={handleGenerate}
									>
										<Sparkles class="size-4 mr-2" />
										{isLoading ? 'Generazione in corso...' : 'Genera draft con AI'}
									</FormButton>
								</form>

								{#if success}
									<div class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
										<p class="text-emerald-800 dark:text-emerald-200 font-medium">{success}</p>
									</div>
								{/if}
							</div>

							<!-- Generated Preview (side by side layout) -->
							{#if generatedContent}
								<div class="mt-6 flex-1 grid grid-cols-2 gap-4 min-h-0">
									<!-- Editor -->
									<div class="bg-white dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 p-4 flex flex-col min-h-0">
										<div class="flex items-center justify-between mb-3 shrink-0">
											<h3 class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Markdown</h3>
											<button
												type="button"
												onclick={() => {
													generatedContent = '';
													success = '';
												}}
												class="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
											>
												Chiudi
											</button>
										</div>
										<textarea
											bind:value={generatedContent}
											class="flex-1 w-full p-3 font-mono text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
										></textarea>
										<div class="mt-3 shrink-0">
											<FormButton
												variant="primary"
												fullWidth={true}
												onclick={() => {
													theoryContent = generatedContent;
													hasTheoryChanges = true;
													generatedContent = '';
													success = '';
												}}
											>
												<Save class="size-4 mr-2" />
												Usa come teoria
											</FormButton>
										</div>
									</div>

									<!-- Preview -->
									<div class="bg-white dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 p-4 flex flex-col min-h-0">
										<h3 class="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3 shrink-0">Anteprima</h3>
										<div class="flex-1 overflow-y-auto p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
											<MarkdownMessage content={generatedContent} />
										</div>
									</div>
								</div>
							{/if}
						</div>
					{:else}
						<!-- Theory Editor - Side by Side -->
						<div class="flex-1 flex flex-col min-h-0">
							<!-- Toolbar -->
							<div class="flex items-center justify-between mb-4 shrink-0">
								<div class="flex items-center gap-3">
									<div class="p-2 rounded-xl bg-blue-500/10 text-blue-500">
										<Book class="size-4" />
									</div>
									<div>
										<h2 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
											Modifica teoria
										</h2>
										<p class="text-xs text-zinc-500">
											{theoryContent.length} caratteri
										</p>
									</div>
								</div>

								<div class="flex items-center gap-3">
									{#if hasTheoryChanges}
										<span class="text-xs text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full">
											Non salvato
										</span>
									{/if}
									<FormButton
										variant="secondary"
										size="sm"
										disabled={!hasTheoryChanges}
										onclick={() => {
											theoryContent = selectedNode?.theory || '';
											hasTheoryChanges = false;
										}}
									>
										Annulla
									</FormButton>
									<FormButton
										variant="primary"
										size="sm"
										loading={isSaving}
										disabled={!hasTheoryChanges || isSaving}
										onclick={handleSaveTheory}
									>
										<Save class="size-3.5 mr-1.5" />
										Salva
									</FormButton>
								</div>
							</div>

							<!-- Side by side editor and preview -->
							<div class="flex-1 grid grid-cols-2 gap-4 min-h-0">
								<!-- Editor -->
								<div class="bg-white dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 p-4 flex flex-col min-h-0">
									<h3 class="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 shrink-0">Markdown</h3>
									<textarea
										bind:value={theoryContent}
										oninput={() => hasTheoryChanges = true}
										class="flex-1 w-full p-3 font-mono text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
										placeholder="Scrivi il contenuto in Markdown..."
									></textarea>
									<p class="text-xs text-zinc-400 mt-2 shrink-0">
										Supporta Markdown e LaTeX ($inline$ e $$block$$)
									</p>
								</div>

								<!-- Preview -->
								<div class="bg-white dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 p-4 flex flex-col min-h-0">
									<h3 class="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 shrink-0">Anteprima</h3>
									<div class="flex-1 overflow-y-auto p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
										<MarkdownMessage content={theoryContent} />
									</div>
								</div>
							</div>
						</div>
					{/if}
				{:else if selectedTab === 'formulary'}
					<!-- Formulary Tab (same as theory) -->
					{#if !selectedNode.hasFormulary}
						<!-- Empty state for formulary -->
						<div class="flex-1 flex flex-col min-h-0">
							<div class="bg-white dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 p-6 space-y-6">
								<div class="flex items-center gap-3">
									<div class="p-2.5 rounded-xl bg-violet-500/10 text-violet-500">
										<Sigma class="size-5" />
									</div>
									<div>
										<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
											Nessun formulario
										</h2>
										<p class="text-sm text-zinc-500">
											Non esiste ancora un formulario per questo topic. Inizia a scrivere per crearne uno.
										</p>
									</div>
								</div>
							</div>

							<!-- Side by side editor and preview for new formulary -->
							<div class="mt-6 flex-1 grid grid-cols-2 gap-4 min-h-0">
								<!-- Editor -->
								<div class="bg-white dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 p-4 flex flex-col min-h-0">
									<div class="flex items-center justify-between mb-3 shrink-0">
										<h3 class="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Markdown</h3>
										{#if hasFormularyChanges}
											<span class="text-xs text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full">
												Non salvato
											</span>
										{/if}
									</div>
									<textarea
										bind:value={formularyContent}
										oninput={() => hasFormularyChanges = true}
										class="flex-1 w-full p-3 font-mono text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none"
										placeholder="Scrivi il formulario in Markdown..."
									></textarea>
									<div class="mt-3 shrink-0 flex gap-2">
										<FormButton
											variant="secondary"
											size="sm"
											disabled={!hasFormularyChanges}
											onclick={() => {
												formularyContent = '';
												hasFormularyChanges = false;
											}}
										>
											Annulla
										</FormButton>
										<div class="flex-1">
											<FormButton
												variant="primary"
												size="sm"
												fullWidth={true}
												loading={isSaving}
												disabled={!hasFormularyChanges || isSaving}
												onclick={handleSaveFormulary}
											>
												<Save class="size-3.5 mr-1.5" />
												Salva formulario
											</FormButton>
										</div>
									</div>
								</div>

								<!-- Preview -->
								<div class="bg-white dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 p-4 flex flex-col min-h-0">
									<h3 class="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 shrink-0">Anteprima</h3>
									<div class="flex-1 overflow-y-auto p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
										{#if formularyContent}
											<MarkdownMessage content={formularyContent} />
										{:else}
											<p class="text-zinc-400 text-sm italic">L'anteprima apparirà qui...</p>
										{/if}
									</div>
								</div>
							</div>
						</div>
					{:else}
						<!-- Formulary Editor - Side by Side -->
						<div class="flex-1 flex flex-col min-h-0">
							<!-- Toolbar -->
							<div class="flex items-center justify-between mb-4 shrink-0">
								<div class="flex items-center gap-3">
									<div class="p-2 rounded-xl bg-violet-500/10 text-violet-500">
										<Sigma class="size-4" />
									</div>
									<div>
										<h2 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
											Modifica formulario
										</h2>
										<p class="text-xs text-zinc-500">
											{formularyContent.length} caratteri
										</p>
									</div>
								</div>

								<div class="flex items-center gap-3">
									{#if hasFormularyChanges}
										<span class="text-xs text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full">
											Non salvato
										</span>
									{/if}
									<FormButton
										variant="secondary"
										size="sm"
										disabled={!hasFormularyChanges}
										onclick={() => {
											formularyContent = selectedNode?.formulary || '';
											hasFormularyChanges = false;
										}}
									>
										Annulla
									</FormButton>
									<FormButton
										variant="primary"
										size="sm"
										loading={isSaving}
										disabled={!hasFormularyChanges || isSaving}
										onclick={handleSaveFormulary}
									>
										<Save class="size-3.5 mr-1.5" />
										Salva
									</FormButton>
								</div>
							</div>

							<!-- Side by side editor and preview -->
							<div class="flex-1 grid grid-cols-2 gap-4 min-h-0">
								<!-- Editor -->
								<div class="bg-white dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 p-4 flex flex-col min-h-0">
									<h3 class="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 shrink-0">Markdown</h3>
									<textarea
										bind:value={formularyContent}
										oninput={() => hasFormularyChanges = true}
										class="flex-1 w-full p-3 font-mono text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none"
										placeholder="Scrivi il formulario in Markdown..."
									></textarea>
									<p class="text-xs text-zinc-400 mt-2 shrink-0">
										Supporta Markdown e LaTeX ($inline$ e $$block$$)
									</p>
								</div>

								<!-- Preview -->
								<div class="bg-white dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 p-4 flex flex-col min-h-0">
									<h3 class="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 shrink-0">Anteprima</h3>
									<div class="flex-1 overflow-y-auto p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
										<MarkdownMessage content={formularyContent} />
									</div>
								</div>
							</div>
						</div>
					{/if}
				{:else if selectedTab === 'exercises'}
					<!-- Exercises Tab - Placeholder -->
					<div class="flex-1 flex items-center justify-center">
						<div class="text-center max-w-md px-4">
							<div class="p-5 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mb-5 inline-block">
								<Construction class="size-10 text-emerald-500" />
							</div>
							<h2 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
								Editor esercizi
							</h2>
							<p class="text-zinc-500 mb-4">
								L'editor per gli esercizi è in fase di sviluppo. Presto potrai creare e modificare esercizi interattivi direttamente da qui.
							</p>
							{#if selectedNode.hasExercises}
								<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
									<PenLine class="size-4" />
									Esercizi esistenti configurati
								</span>
							{:else}
								<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
									Nessun esercizio configurato
								</span>
							{/if}
						</div>
					</div>
				{:else if selectedTab === 'flashcards'}
					<!-- Flashcards Tab - Placeholder -->
					<div class="flex-1 flex items-center justify-center">
						<div class="text-center max-w-md px-4">
							<div class="p-5 rounded-2xl bg-amber-100 dark:bg-amber-900/30 mb-5 inline-block">
								<Construction class="size-10 text-amber-500" />
							</div>
							<h2 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
								Editor flashcards
							</h2>
							<p class="text-zinc-500 mb-4">
								L'editor per le flashcards è in fase di sviluppo. Presto potrai creare e modificare flashcards per il ripasso veloce.
							</p>
							{#if selectedNode.hasFlashcards}
								<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
									<Zap class="size-4" />
									Flashcards esistenti
								</span>
							{:else}
								<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
									Nessuna flashcard
								</span>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</main>
</div>

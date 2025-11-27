<script lang="ts">
	import FormInput from '$lib/components/ui/forms/FormInput.svelte';
	import FormButton from '$lib/components/ui/forms/FormButton.svelte';
	import MarkdownMessage from '$lib/components/ui/MarkdownMessage.svelte';

	let topicTitle = $state('');
	let isLoading = $state(false);
	let error = $state('');
	let success = $state('');
	let generatedContent = $state('');

	// Log state changes
	$effect(() => {
		console.log('[Admin Desk] topicTitle cambiato:', topicTitle);
	});

	$effect(() => {
		console.log('[Admin Desk] isLoading cambiato:', isLoading);
	});

	$effect(() => {
		if (error) {
			console.log('[Admin Desk] error impostato:', error);
		}
	});

	$effect(() => {
		if (success) {
			console.log('[Admin Desk] success impostato:', success);
		}
	});

	$effect(() => {
		if (generatedContent) {
			console.log('[Admin Desk] generatedContent impostato, lunghezza:', generatedContent.length);
		}
	});

	async function handleSubmit() {
		console.log('[Admin Desk] handleSubmit chiamato');
		console.log('[Admin Desk] topicTitle:', topicTitle);

		if (!topicTitle.trim()) {
			console.warn('[Admin Desk] Topic title vuoto, validazione fallita');
			error = 'Inserisci un titolo per il topic';
			return;
		}

		console.log('[Admin Desk] Inizializzazione stati...');
		isLoading = true;
		error = '';
		success = '';
		generatedContent = '';

		const trimmedTopic = topicTitle.trim();
		console.log('[Admin Desk] Topic da inviare:', trimmedTopic);

		try {
			console.log('[Admin Desk] Chiamata API a /api/generate-draft...');
			const requestBody = { lessonTopic: trimmedTopic };
			console.log('[Admin Desk] Request body:', requestBody);

			const response = await fetch('/api/generate-draft', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestBody)
			});

			console.log('[Admin Desk] Response ricevuta:', {
				status: response.status,
				statusText: response.statusText,
				ok: response.ok
			});

			const data = await response.json();
			console.log('[Admin Desk] Response data:', {
				success: data.success,
				topic: data.topic,
				status: data.status,
				hasMarkdown: !!data.lesson_markdown,
				markdownLength: data.lesson_markdown?.length || 0
			});

			if (!response.ok) {
				console.error('[Admin Desk] Response non OK:', data);
				throw new Error(data.error || 'Errore durante la generazione del draft');
			}

			if (data.success) {
				console.log('[Admin Desk] Generazione completata con successo');
				console.log('[Admin Desk] Status:', data.status);
				success = `Draft generato con successo! Status: ${data.status}`;
				generatedContent = data.lesson_markdown;
				console.log('[Admin Desk] Contenuto generato salvato, lunghezza:', generatedContent.length);
				console.log('[Admin Desk] Reset form...');
				topicTitle = ''; // Reset form
				console.log('[Admin Desk] Form resettato');
			} else {
				console.error('[Admin Desk] data.success è false:', data);
				throw new Error(data.error || 'Errore durante la generazione');
			}
		} catch (e) {
			console.error('[Admin Desk] Errore catturato:', e);
			console.error('[Admin Desk] Tipo errore:', e instanceof Error ? 'Error' : typeof e);
			console.error('[Admin Desk] Messaggio errore:', e instanceof Error ? e.message : String(e));
			if (e instanceof Error && e.stack) {
				console.error('[Admin Desk] Stack trace:', e.stack);
			}
			error = e instanceof Error ? e.message : 'Errore sconosciuto';
		} finally {
			console.log('[Admin Desk] Finalizzazione, isLoading = false');
			isLoading = false;
		}
	}

</script>

<div class="min-h-screen p-8">
	<div class="max-w-5xl mx-auto space-y-8">
		<!-- Header -->
		<div class="space-y-2">
			<h1 class="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
				Admin Desk
			</h1>
			<p class="text-zinc-600 dark:text-zinc-400">
				Genera e gestisci i contenuti dei topic della wiki
			</p>
		</div>

		<!-- Form Section -->
		<div class="bg-white dark:bg-zinc-800 rounded-2xl shadow-md p-8 space-y-6">
			<h2 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
				Genera nuovo draft
			</h2>

			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				class="space-y-6"
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
					onclick={handleSubmit}
				>
					{isLoading ? 'Generazione in corso...' : 'Genera draft'}
				</FormButton>
			</form>

			<!-- Success Message -->
			{#if success}
				<div
					class="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800"
				>
					<div class="flex items-center space-x-3">
						<svg
							class="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<p class="text-green-800 dark:text-green-200 font-medium">{success}</p>
					</div>
				</div>
			{/if}
		</div>

		<!-- Preview Section -->
		{#if generatedContent}
			<div class="bg-white dark:bg-zinc-800 rounded-2xl shadow-md p-8 space-y-4">
				<div class="flex items-center justify-between">
					<h2 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
						Anteprima del contenuto generato
					</h2>
					<button
						onclick={() => {
							generatedContent = '';
							success = '';
						}}
						class="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
					>
						Chiudi
					</button>
				</div>

				<div
					class="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-auto max-h-[600px]"
				>
					<MarkdownMessage content={generatedContent} class="text-zinc-800 dark:text-zinc-200" />
				</div>
			</div>
		{/if}
	</div>
</div>


<script>
	import { Send, Bot, User, Loader2 } from 'lucide-svelte';
	import { tick } from 'svelte';
	import UpgradePrompt from '$lib/components/subscription/UpgradePrompt.svelte';

	let { data } = $props();
	let { hasAccess } = $derived(data);

	let messages = $state([]);
	let inputMessage = $state('');
	let isLoading = $state(false);
	let chatContainer = $state(null);

	const scrollToBottom = async () => {
		await tick();
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	};

	const sendMessage = async () => {
		if (!inputMessage.trim() || isLoading) return;

		const userMessage = inputMessage.trim();
		inputMessage = '';

		// Add user message to chat
		messages = [...messages, { role: 'user', content: userMessage }];
		await scrollToBottom();

		// Add empty assistant message
		const assistantMessageIndex = messages.length;
		messages = [...messages, { role: 'assistant', content: '' }];
		isLoading = true;

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					messages: messages.slice(0, -1).map((msg) => ({
						role: msg.role,
						content: msg.content
					}))
				})
			});

			if (!response.ok) {
				throw new Error('Errore nella risposta del server');
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value);
				messages[assistantMessageIndex].content += chunk;
				messages = [...messages]; // Trigger reactivity
				await scrollToBottom();
			}
		} catch (error) {
			console.error('Error:', error);
			messages[assistantMessageIndex].content =
				'Mi dispiace, si è verificato un errore. Riprova più tardi.';
			messages = [...messages];
		} finally {
			isLoading = false;
		}
	};

	const handleKeyPress = (event) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	};
</script>

<div class="flex flex-col h-[calc(100dvh-3.75rem)] bg-zinc-50 dark:bg-zinc-900">
	{#if !hasAccess}
		<div class="flex-1 overflow-y-auto px-4 py-6 max-w-4xl mx-auto w-full">
			<UpgradePrompt 
				feature="Sapiens AI"
				requiredPlan="base"
				size="large"
			/>
		</div>
	{:else}

	<div
		bind:this={chatContainer}
		class="flex-1 overflow-y-auto px-4 py-6 space-y-6 max-w-4xl mx-auto w-full"
	>
		{#if messages.length === 0}
			<div class="flex flex-col items-center justify-center h-full text-center py-12">
				<div
					class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4"
				>
					<Bot class="w-8 h-8 text-white" />
				</div>
				<h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
					Ciao! Sono Sapiens AI
				</h2>
				<p class="text-zinc-600 dark:text-zinc-400 max-w-md">
					Sono qui per aiutarti con le tue domande su matematica, fisica, informatica e altre
					materie. Chiedi pure qualsiasi cosa!
				</p>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 w-full max-w-2xl">
					<button
						onclick={() => {
							inputMessage = 'Come si risolve un\'equazione di secondo grado?';
							sendMessage();
						}}
						class="p-4 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-500/25 hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-left"
					>
						<p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
							📐 Equazioni di secondo grado
						</p>
						<p class="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
							Come si risolvono?
						</p>
					</button>
					<button
						onclick={() => {
							inputMessage = 'Spiega il teorema di Pitagora';
							sendMessage();
						}}
						class="p-4 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-500/25 hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-left"
					>
						<p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
							📊 Teorema di Pitagora
						</p>
						<p class="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
							Una spiegazione chiara
						</p>
					</button>
					<button
						onclick={() => {
							inputMessage = 'Come si calcola la derivata di una funzione?';
							sendMessage();
						}}
						class="p-4 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-500/25 hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-left"
					>
						<p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
							📈 Derivate
						</p>
						<p class="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
							Calcolo differenziale
						</p>
					</button>
					<button
						onclick={() => {
							inputMessage = 'Aiutami con la programmazione in Python';
							sendMessage();
						}}
						class="p-4 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-500/25 hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-left"
					>
						<p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
							💻 Python
						</p>
						<p class="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
							Impara a programmare
						</p>
					</button>
				</div>
			</div>
		{:else}
			{#each messages as message}
				<div
					class="flex gap-3 {message.role === 'user'
						? 'justify-end'
						: 'justify-start'}"
				>
					{#if message.role === 'assistant'}
						<div
							class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0"
						>
							<Bot class="w-5 h-5 text-white" />
						</div>
					{/if}

					<div
						class="max-w-[80%] rounded-2xl px-4 py-3 {message.role === 'user'
							? 'bg-blue-600 text-white'
							: 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-500/25'}"
					>
						<div class="prose prose-sm max-w-none {message.role === 'user' ? 'prose-invert' : 'dark:prose-invert'}">
							{@html message.content.replace(/\n/g, '<br>')}
						</div>
					</div>

					{#if message.role === 'user'}
						<div
							class="w-8 h-8 rounded-full bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0"
						>
							<User class="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
						</div>
					{/if}
				</div>
			{/each}

			{#if isLoading && messages[messages.length - 1]?.content === ''}
				<div class="flex gap-3 justify-start">
					<div
						class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0"
					>
						<Bot class="w-5 h-5 text-white" />
					</div>
					<div
						class="bg-white dark:bg-zinc-800 rounded-2xl px-4 py-3 border border-zinc-500/25"
					>
						<div class="flex gap-1">
							<div class="w-2 h-2 rounded-full bg-zinc-400 animate-bounce"></div>
							<div class="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]"></div>
							<div class="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]"></div>
						</div>
					</div>
				</div>
			{/if}
		{/if}
	</div>

	{#if hasAccess}
		<div class="border-t border-zinc-500/25 bg-white dark:bg-zinc-800 px-4 py-4">
			<div class="max-w-4xl mx-auto">
				<div class="flex gap-2">
					<textarea
						bind:value={inputMessage}
						onkeypress={handleKeyPress}
						placeholder="Scrivi la tua domanda..."
						disabled={isLoading}
						rows="1"
						class="flex-1 resize-none rounded-xl px-4 py-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 dark:text-zinc-100"
					></textarea>
					<button
						onclick={sendMessage}
						disabled={!inputMessage.trim() || isLoading}
						class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center gap-2"
					>
						{#if isLoading}
							<Loader2 class="w-5 h-5 animate-spin" />
						{:else}
							<Send class="w-5 h-5" />
						{/if}
					</button>
				</div>
			</div>
		</div>
	{/if}
	{/if}
</div>


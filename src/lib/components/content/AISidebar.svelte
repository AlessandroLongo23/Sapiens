<script lang="ts">
    import { Send, Bot, Loader2, Sparkles, X, Trash2, MessageSquare } from 'lucide-svelte';
    import { tick } from 'svelte';
    import { aiSidebar, type Message } from '$lib/state/ai-sidebar.svelte.js';
    import MarkdownMessage from '$lib/components/ui/MarkdownMessage.svelte';

    let chatContainer = $state<HTMLElement | null>(null);
    let inputElement = $state<HTMLTextAreaElement | null>(null);

    // Computed prompt display text (for showing selected text context)
    let pendingDisplayText = $derived(
        aiSidebar.pendingPrompt 
            ? `"${aiSidebar.pendingPrompt.selectedText.slice(0, 100)}${aiSidebar.pendingPrompt.selectedText.length > 100 ? '...' : ''}"`
            : null
    );

    const scrollToBottom = async () => {
        await tick();
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    };

    // Auto-scroll when messages change
    $effect(() => {
        if (aiSidebar.messages.length > 0) {
            scrollToBottom();
        }
    });

    // Focus input when sidebar opens
    $effect(() => {
        if (aiSidebar.isOpen && inputElement) {
            tick().then(() => inputElement?.focus());
        }
    });

    // Auto-send when a pending prompt is set
    $effect(() => {
        if (aiSidebar.pendingPrompt) {
            const { prompt, selectedText } = aiSidebar.pendingPrompt;
            const fullMessage = `${prompt.prompt}\n\n${selectedText}`;
            aiSidebar.clearPendingPrompt();
            sendMessage(fullMessage, `${prompt.label}: "${selectedText.slice(0, 50)}${selectedText.length > 50 ? '...' : ''}"`);
        }
    });

    const sendMessage = async (content?: string, displayContent?: string) => {
        const messageContent = content || aiSidebar.inputValue.trim();
        if (!messageContent || aiSidebar.isLoading) return;

        // Clear input
        aiSidebar.inputValue = '';

        // Add user message (display version for UI, actual content for API)
        const userDisplayContent = displayContent || messageContent;
        aiSidebar.addUserMessage(userDisplayContent);
        await scrollToBottom();

        // Add empty assistant message
        aiSidebar.addAssistantMessage();
        aiSidebar.isLoading = true;

        try {
            // Prepare messages for API (use actual content, not display content)
            const apiMessages = aiSidebar.messages.slice(0, -1).map((msg) => ({
                role: msg.role,
                content: msg.role === 'user' && msg.content === userDisplayContent ? messageContent : msg.content
            }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages: apiMessages })
            });

            if (!response.ok) {
                throw new Error('Errore nella risposta del server');
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error('No reader available');
            
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                aiSidebar.appendToLastMessage(chunk);
                await scrollToBottom();
            }

            aiSidebar.finishStreaming();
        } catch (error) {
            console.error('Error:', error);
            aiSidebar.setError('Mi dispiace, si è verificato un errore. Riprova più tardi.');
        } finally {
            aiSidebar.isLoading = false;
        }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        aiSidebar.clearMessages();
    };
</script>

<div class="flex flex-col flex-1 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-crimson-500 to-crimson-600 flex items-center justify-center">
                <Sparkles class="w-4 h-4 text-white" />
            </div>
            <div>
                <h3 class="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Sapiens AI</h3>
                <p class="text-xs text-zinc-500">Il tuo assistente di studio</p>
            </div>
        </div>
        {#if aiSidebar.messages.length > 0}
            <button
                onclick={clearChat}
                class="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Cancella conversazione"
            >
                <Trash2 class="w-4 h-4" />
            </button>
        {/if}
    </div>

    <!-- Chat Container -->
    <div
        bind:this={chatContainer}
        class="flex-1 overflow-y-auto px-3 py-4 space-y-4"
    >
        {#if aiSidebar.messages.length === 0}
            <!-- Empty State -->
            <div class="flex flex-col items-center justify-center h-full text-center px-4">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-crimson-500 to-crimson-600 flex items-center justify-center mb-4 shadow-lg shadow-crimson-500/20">
                    <MessageSquare class="w-7 h-7 text-white" />
                </div>
                <h4 class="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                    Come posso aiutarti?
                </h4>
                <p class="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed">
                    Seleziona del testo nella lezione per chiedere spiegazioni, oppure scrivi qui la tua domanda.
                </p>
                
                <!-- Quick Actions -->
                <div class="flex flex-wrap gap-2 mt-6 justify-center">
                    <button
                        onclick={() => {
                            aiSidebar.inputValue = 'Puoi spiegarmi questo concetto in modo più semplice?';
                        }}
                        class="px-3 py-1.5 text-xs font-medium rounded-full bg-crimson-50 dark:bg-crimson-500/10 text-crimson-600 dark:text-crimson-400 hover:bg-crimson-100 dark:hover:bg-crimson-500/20 transition-colors"
                    >
                        Semplifica
                    </button>
                    <button
                        onclick={() => {
                            aiSidebar.inputValue = 'Puoi farmi un esempio pratico?';
                        }}
                        class="px-3 py-1.5 text-xs font-medium rounded-full bg-crimson-50 dark:bg-crimson-500/10 text-crimson-600 dark:text-crimson-400 hover:bg-crimson-100 dark:hover:bg-crimson-500/20 transition-colors"
                    >
                        Esempio
                    </button>
                    <button
                        onclick={() => {
                            aiSidebar.inputValue = 'Perché questo è importante?';
                        }}
                        class="px-3 py-1.5 text-xs font-medium rounded-full bg-crimson-50 dark:bg-crimson-500/10 text-crimson-600 dark:text-crimson-400 hover:bg-crimson-100 dark:hover:bg-crimson-500/20 transition-colors"
                    >
                        Approfondisci
                    </button>
                </div>
            </div>
        {:else}
            <!-- Messages -->
            {#each aiSidebar.messages as message (message.id)}
                <div class="flex gap-2.5 {message.role === 'user' ? 'flex-row-reverse' : ''}">
                    {#if message.role === 'assistant'}
                        <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-crimson-500 to-crimson-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Bot class="w-4 h-4 text-white" />
                        </div>
                    {/if}

                    <div
                        class="max-w-[85%] rounded-2xl px-3.5 py-2.5 {message.role === 'user'
                            ? 'bg-crimson-500 text-white rounded-br-md'
                            : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-bl-md shadow-sm'}"
                    >
                        {#if message.role === 'assistant'}
                            {#if message.content}
                                <MarkdownMessage 
                                    content={message.content} 
                                    class="text-sm leading-relaxed"
                                />
                            {:else if message.isStreaming}
                                <div class="flex gap-1 py-1">
                                    <div class="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce"></div>
                                    <div class="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.15s]"></div>
                                    <div class="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.3s]"></div>
                                </div>
                            {/if}
                        {:else}
                            <p class="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        {/if}
                    </div>
                </div>
            {/each}
        {/if}
    </div>

    <!-- Input Area -->
    <div class="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3">
        <div class="flex gap-2">
            <textarea
                bind:this={inputElement}
                bind:value={aiSidebar.inputValue}
                onkeypress={handleKeyPress}
                placeholder="Scrivi una domanda..."
                disabled={aiSidebar.isLoading}
                rows="1"
                class="flex-1 resize-none rounded-xl px-3.5 py-2.5 bg-zinc-100 dark:bg-zinc-800 border-0 focus:outline-none focus:ring-2 focus:ring-crimson-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
            ></textarea>
            <button
                onclick={() => sendMessage()}
                disabled={!aiSidebar.inputValue.trim() || aiSidebar.isLoading}
                class="p-2.5 bg-crimson-500 hover:bg-crimson-600 disabled:bg-zinc-200 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed text-white disabled:text-zinc-400 rounded-xl transition-colors flex-shrink-0"
            >
                {#if aiSidebar.isLoading}
                    <Loader2 class="w-4 h-4 animate-spin" />
                {:else}
                    <Send class="w-4 h-4" />
                {/if}
            </button>
        </div>
    </div>
</div>

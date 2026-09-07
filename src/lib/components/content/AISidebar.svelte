<script lang="ts">
    import { Send, Bot, Loader2, Sparkles, X, Trash2, MessageSquare } from 'lucide-svelte';
    import { tick } from 'svelte';
    import { page } from '$app/state';
    import { aiSidebar, type Message } from '$lib/state/ai-sidebar.svelte.js';
    import { authState } from '$lib/state/auth.svelte';
    import { media } from '$lib/state/media.svelte';
    import { hasFeature } from '$lib/auth/entitlements';
    import { Features } from '$lib/stripe/config';
    import MarkdownMessage from '$lib/components/ui/MarkdownMessage.svelte';
    import Paywall from '$lib/components/subscription/Paywall.svelte';

    /**
     * The study assistant. Beside the lesson on wide screens; inside a
     * bottom sheet on phones, where `onClose` adds the close button and
     * the panel fills the sheet.
     */
    let { onClose }: { onClose?: () => void } = $props();
    let inSheet = $derived(!!onClose);

    // The chat is part of the paid plans. The server decides for real
    // (/api/chat answers 401/403); this only chooses what to show.
    let apiRefused = $state(false);
    let locked = $derived(apiRefused || !hasFeature(authState.user, Features.AI_CHAT));

    let chatContainer = $state<HTMLElement | null>(null);
    let inputElement = $state<HTMLTextAreaElement | null>(null);

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

    // Focus the input when the panel opens, unless a prompt is about to be
    // sent (then the student wants to read the answer, not type). On phones
    // the focus waits for the sheet to finish sliding in, so the keyboard
    // does not fight the animation.
    $effect(() => {
        if (!aiSidebar.isOpen || !inputElement || aiSidebar.pendingPrompt) return;
        const delay = media.coarse ? 320 : 0;
        const timer = setTimeout(() => inputElement?.focus({ preventScroll: true }), delay);
        return () => clearTimeout(timer);
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
        resizeInput();

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

            if (response.status === 401 || response.status === 403) {
                apiRefused = true;
                aiSidebar.clearMessages();
                return;
            }
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

    // Enter sends with a keyboard; on a phone Enter adds a line and the
    // button sends, as in every messaging app.
    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey && !media.coarse) {
            event.preventDefault();
            sendMessage();
        }
    };

    // The box grows with the text, up to a few lines.
    function resizeInput() {
        const el = inputElement;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
    }

    const clearChat = () => {
        aiSidebar.clearMessages();
    };

    const suggestions = [
        { label: 'Semplifica', text: 'Puoi spiegarmi questo concetto in modo più semplice?' },
        { label: 'Esempio', text: 'Puoi farmi un esempio pratico?' },
        { label: 'Approfondisci', text: 'Perché questo è importante?' }
    ];

    function suggest(text: string) {
        aiSidebar.inputValue = text;
        tick().then(() => {
            resizeInput();
            inputElement?.focus();
        });
    }
</script>

<div class="flex flex-col flex-1 min-h-0 bg-zinc-50 dark:bg-zinc-900 {inSheet ? 'h-full' : 'rounded-2xl border border-zinc-200 dark:border-zinc-800'} overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between gap-2 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div class="flex items-center gap-2 min-w-0">
            <div class="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-crimson-500 to-crimson-600 flex items-center justify-center">
                <Sparkles class="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <div class="min-w-0">
                <h3 class="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Sapiens AI</h3>
                <p class="text-xs text-zinc-500 truncate">Il tuo assistente di studio</p>
            </div>
        </div>
        <div class="flex items-center gap-1 shrink-0">
            {#if aiSidebar.messages.length > 0}
                <button
                    type="button"
                    onclick={clearChat}
                    class="flex {inSheet ? 'size-[44px]' : 'size-9'} items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:bg-zinc-100 dark:active:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500"
                    title="Cancella conversazione"
                    aria-label="Cancella conversazione"
                >
                    <Trash2 class="w-4 h-4" aria-hidden="true" />
                </button>
            {/if}
            {#if onClose}
                <button
                    type="button"
                    onclick={onClose}
                    class="flex size-[44px] items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 active:bg-zinc-100 dark:active:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500"
                    aria-label="Chiudi"
                >
                    <X class="size-5" aria-hidden="true" />
                </button>
            {/if}
        </div>
    </div>

    {#if !authState.ready}
        <div class="flex-1" aria-busy="true"></div>
    {:else if locked}
        <div class="flex-1 overflow-y-auto overscroll-contain">
            <Paywall
                feature={Features.AI_CHAT}
                returnTo={page.url.pathname}
                benefit="Seleziona un passaggio della lezione e chiedi una spiegazione diversa, un esempio o un approfondimento, subito."
                compact
            />
        </div>
    {:else}
    <!-- Chat Container -->
    <div
        bind:this={chatContainer}
        class="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 py-4 space-y-4"
    >
        {#if aiSidebar.messages.length === 0}
            <!-- Empty State -->
            <div class="flex flex-col items-center justify-center h-full text-center px-4">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-crimson-500 to-crimson-600 flex items-center justify-center mb-4 shadow-lg shadow-crimson-500/20">
                    <MessageSquare class="w-7 h-7 text-white" aria-hidden="true" />
                </div>
                <h4 class="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                    Come posso aiutarti?
                </h4>
                <p class="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed">
                    {#if media.coarse}
                        Tieni premuto su una frase della lezione per chiedere una spiegazione, oppure scrivi qui la tua domanda.
                    {:else}
                        Seleziona del testo nella lezione per chiedere spiegazioni, oppure scrivi qui la tua domanda.
                    {/if}
                </p>

                <!-- Quick Actions -->
                <div class="flex flex-wrap gap-2 mt-6 justify-center">
                    {#each suggestions as s (s.label)}
                        <button
                            type="button"
                            onclick={() => suggest(s.text)}
                            class="min-h-[40px] px-4 py-1.5 text-sm font-medium rounded-full bg-crimson-50 dark:bg-crimson-500/10 text-crimson-600 dark:text-crimson-400 hover:bg-crimson-100 dark:hover:bg-crimson-500/20 active:bg-crimson-100 dark:active:bg-crimson-500/20 transition-colors"
                        >
                            {s.label}
                        </button>
                    {/each}
                </div>
            </div>
        {:else}
            <!-- Messages -->
            {#each aiSidebar.messages as message (message.id)}
                <div class="flex gap-2.5 {message.role === 'user' ? 'flex-row-reverse' : ''}">
                    {#if message.role === 'assistant'}
                        <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-crimson-500 to-crimson-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Bot class="w-4 h-4 text-white" aria-hidden="true" />
                        </div>
                    {/if}

                    <div
                        class="max-w-[85%] min-w-0 rounded-2xl px-3.5 py-2.5 {message.role === 'user'
                            ? 'bg-crimson-500 text-white rounded-br-md'
                            : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-bl-md shadow-sm'} [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden"
                    >
                        {#if message.role === 'assistant'}
                            {#if message.content}
                                <MarkdownMessage
                                    content={message.content}
                                    class="text-sm sm:text-base leading-relaxed break-words"
                                />
                            {:else if message.isStreaming}
                                <div class="flex gap-1 py-1" aria-label="Sto scrivendo" role="status">
                                    <div class="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce"></div>
                                    <div class="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.15s]"></div>
                                    <div class="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.3s]"></div>
                                </div>
                            {/if}
                        {:else}
                            <p class="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                        {/if}
                    </div>
                </div>
            {/each}
        {/if}
    </div>

    <!-- Input Area -->
    <div class="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 {inSheet ? 'pb-[calc(0.75rem+var(--safe-b))]' : ''}">
        <div class="flex items-end gap-2">
            <label for="ai-chat-input" class="sr-only">La tua domanda</label>
            <textarea
                id="ai-chat-input"
                bind:this={inputElement}
                bind:value={aiSidebar.inputValue}
                onkeypress={handleKeyPress}
                oninput={resizeInput}
                placeholder="Scrivi una domanda..."
                disabled={aiSidebar.isLoading}
                rows="1"
                class="flex-1 min-h-[44px] max-h-[140px] resize-none rounded-xl px-3.5 py-2.5 bg-zinc-100 dark:bg-zinc-800 border-0 focus:outline-none focus:ring-2 focus:ring-crimson-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
            ></textarea>
            <button
                type="button"
                onclick={() => sendMessage()}
                disabled={!aiSidebar.inputValue.trim() || aiSidebar.isLoading}
                class="flex size-[44px] shrink-0 items-center justify-center bg-crimson-500 hover:bg-crimson-600 active:bg-crimson-600 disabled:bg-zinc-200 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed text-white disabled:text-zinc-400 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
                aria-label="Invia"
            >
                {#if aiSidebar.isLoading}
                    <Loader2 class="w-5 h-5 animate-spin" aria-hidden="true" />
                {:else}
                    <Send class="w-5 h-5" aria-hidden="true" />
                {/if}
            </button>
        </div>
    </div>
    {/if}
</div>

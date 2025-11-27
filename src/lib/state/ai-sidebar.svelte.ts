import type { Prompt } from '$lib/data/prompts';

export type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isStreaming?: boolean;
};

export type PendingPrompt = {
    prompt: Prompt;
    selectedText: string;
} | null;

class AISidebarStore {
    messages = $state<Message[]>([]);
    isLoading = $state(false);
    isOpen = $state(false);
    pendingPrompt = $state<PendingPrompt>(null);
    inputValue = $state('');

    generateId(): string {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    addUserMessage(content: string): string {
        const id = this.generateId();
        this.messages.push({
            id,
            role: 'user',
            content,
            timestamp: new Date()
        });
        return id;
    }

    addAssistantMessage(): string {
        const id = this.generateId();
        this.messages.push({
            id,
            role: 'assistant',
            content: '',
            timestamp: new Date(),
            isStreaming: true
        });
        return id;
    }

    appendToLastMessage(chunk: string): void {
        const lastMessage = this.messages[this.messages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.content += chunk;
        }
    }

    finishStreaming(): void {
        const lastMessage = this.messages[this.messages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.isStreaming = false;
        }
    }

    setError(error: string): void {
        const lastMessage = this.messages[this.messages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.content = error;
            lastMessage.isStreaming = false;
        }
    }

    setPendingPrompt(prompt: Prompt, selectedText: string): void {
        this.pendingPrompt = { prompt, selectedText };
        this.isOpen = true;
    }

    clearPendingPrompt(): void {
        this.pendingPrompt = null;
    }

    clearMessages(): void {
        this.messages = [];
    }

    open(): void {
        this.isOpen = true;
    }

    close(): void {
        this.isOpen = false;
    }

    toggle(): void {
        this.isOpen = !this.isOpen;
    }
}

export const aiSidebar = new AISidebarStore();


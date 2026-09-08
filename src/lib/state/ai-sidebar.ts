import { create } from 'zustand';
import type { Prompt } from '@/lib/data/prompts';

export type Message = { id: string; role: 'user' | 'assistant'; content: string; isStreaming?: boolean };

export type PendingPrompt = { prompt: Prompt; selectedText: string } | null;

interface AISidebarState {
	messages: Message[];
	isLoading: boolean;
	isOpen: boolean;
	pendingPrompt: PendingPrompt;
	inputValue: string;
	addUserMessage: (content: string) => void;
	addAssistantMessage: () => void;
	appendToLastMessage: (chunk: string) => void;
	finishStreaming: (error?: string) => void;
	setPendingPrompt: (prompt: Prompt, selectedText: string) => void;
	clearPendingPrompt: () => void;
	clearMessages: () => void;
	setInput: (value: string) => void;
	setLoading: (loading: boolean) => void;
	open: () => void;
	close: () => void;
}

const id = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const updateLast = (messages: Message[], patch: (m: Message) => Message) =>
	messages.map((m, i) => (i === messages.length - 1 && m.role === 'assistant' ? patch(m) : m));

/** The study assistant's conversation: shared by the desktop column and the phone sheet, so it survives a layout change. */
export const useAISidebar = create<AISidebarState>((set) => ({
	messages: [],
	isLoading: false,
	isOpen: false,
	pendingPrompt: null,
	inputValue: '',
	addUserMessage: (content) => set((s) => ({ messages: [...s.messages, { id: id(), role: 'user', content }] })),
	addAssistantMessage: () => set((s) => ({ messages: [...s.messages, { id: id(), role: 'assistant', content: '', isStreaming: true }] })),
	appendToLastMessage: (chunk) => set((s) => ({ messages: updateLast(s.messages, (m) => ({ ...m, content: m.content + chunk })) })),
	finishStreaming: (error) => set((s) => ({ messages: updateLast(s.messages, (m) => ({ ...m, content: error ?? m.content, isStreaming: false })) })),
	setPendingPrompt: (prompt, selectedText) => set({ pendingPrompt: { prompt, selectedText }, isOpen: true }),
	clearPendingPrompt: () => set({ pendingPrompt: null }),
	clearMessages: () => set({ messages: [] }),
	setInput: (inputValue) => set({ inputValue }),
	setLoading: (isLoading) => set({ isLoading }),
	open: () => set({ isOpen: true }),
	close: () => set({ isOpen: false })
}));

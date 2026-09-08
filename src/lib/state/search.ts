import { create } from 'zustand';

interface SearchState {
	query: string;
	isActive: boolean;
	setQuery: (query: string) => void;
	activate: () => void;
	deactivate: () => void;
	clear: () => void;
}

/** Focus goes back to the header's search control when the overlay closes (the field on desktop, the button on phones). */
export const focusSearchTrigger = () => requestAnimationFrame(() => (document.getElementById('site-search') ?? document.querySelector<HTMLElement>('button[aria-label="Cerca su Sapiens"]'))?.focus());

/** The full-page search: open or closed, and what has been typed. */
export const useSearch = create<SearchState>((set) => ({
	query: '',
	isActive: false,
	setQuery: (query) => set({ query }),
	activate: () => set({ isActive: true }),
	deactivate: () => set({ isActive: false }),
	clear: () => set({ query: '', isActive: false })
}));

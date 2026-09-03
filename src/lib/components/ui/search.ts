import { writable } from 'svelte/store';
import type { ContentNode } from '$lib/utils/tree';

/** One lesson hit in the search overlay, with the chain it belongs to and its public URL. */
export interface SearchResult {
    topic: ContentNode;
    chapter: ContentNode;
    subject: ContentNode;
    level: ContentNode;
    href: string;
}

type SearchState = {
    query: string;
    isActive: boolean;
};

const initialState: SearchState = {
    query: '',
    isActive: false
};

export function createSearchStore() {
    const { subscribe, set, update } = writable<SearchState>(initialState);

    return {
        subscribe,
        setQuery: (value: string) =>
            update((state) => ({
                ...state,
                query: value.toLowerCase()
            })),
        activate: () =>
            update((state) => ({
                ...state,
                isActive: true
            })),
        deactivate: () =>
            update((state) => ({
                ...state,
                isActive: false
            })),
        toggleActive: () =>
            update((state) => ({
                ...state,
                isActive: !state.isActive
            })),
        clear: () => set(initialState)
    };
}

export const searchStore = createSearchStore();
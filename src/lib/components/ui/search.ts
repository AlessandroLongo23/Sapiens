import { writable } from 'svelte/store';

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
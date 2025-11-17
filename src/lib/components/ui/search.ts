import { writable } from 'svelte/store';

export function createSearchStore() {
    const { subscribe, set, update } = writable<SearchStore>({
        query: '',
        isActive: false
    });

    return {
        subscribe,
        setQuery: (value: string) => {
            update((state: SearchStore) => ({
                ...state,
                query: value.toLowerCase()
            }));
        },
        toggleActive: () => {
            update((state: SearchStore) => ({
                ...state,
                isActive: !state.isActive
            }));
        },
        clear: () => {
            set({
                query: '',
                isActive: false
            });
        }
    };
}

export const searchStore = createSearchStore();

export interface SearchStore {
    query: string;
    isActive: boolean;
}
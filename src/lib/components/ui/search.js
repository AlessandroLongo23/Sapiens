import { writable } from 'svelte/store';

function createSearchStore() {
    const { subscribe, set, update } = writable({
        query: '',
        isActive: false
    });

    return {
        subscribe,
        setQuery: (value) => {
            update(state => ({
                ...state,
                query: value.toLowerCase()
            }));
        },
        toggleActive: () => {
            update(state => ({
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
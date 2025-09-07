import { writable } from 'svelte/store';

const createMessagePopupStore = () => {
    const { subscribe, set, update } = writable([]);
    
    const show = (message, type = 'info', duration = 3000, position = 'top-right') => {
        const id = Math.random().toString(36).slice(2);
        
        update(messages => [
            ...messages,
            { id, message, type, position }
        ]);

        if (duration > 0) {
            setTimeout(() => {
                dismiss(id);
            }, duration);
        }
    }

    const dismiss = (id) => {
        update(messages => messages.filter(n => n.id !== id));
    }

    return {
        subscribe,
        show,
        dismiss,
        success: (msg, duration) => show(msg, 'success', duration),
        error: (msg, duration) => show(msg, 'error', duration),
        info: (msg, duration) => show(msg, 'info', duration)
    };
}

export const messagePopup = createMessagePopupStore();
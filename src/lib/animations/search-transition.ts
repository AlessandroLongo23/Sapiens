import { quintOut } from 'svelte/easing';
import { crossfade } from 'svelte/transition';

export const GLOBAL_SEARCH_KEY = 'global-search';
export const HEADER_SEARCH_HEIGHT = 36; // px, matches the h-10 input with the compact spacing token
export const SEARCH_OVERLAY_OFFSET = 32; // px

const [sendSearch, receiveSearch] = crossfade({
    duration: 600,
    easing: quintOut,
    fallback(node) {
        const style = getComputedStyle(node);
        const opacity = parseFloat(style.opacity) || 1;

        return {
            duration: 200,
            easing: quintOut,
            css: (t) => `opacity: ${t * opacity};`
        };
    }
});

export { sendSearch, receiveSearch };


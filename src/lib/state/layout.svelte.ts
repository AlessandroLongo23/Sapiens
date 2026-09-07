import { writable } from 'svelte/store';

export const topicLayoutState = writable({
    leftSidebar: null,
    rightSidebar: null,
});

/**
 * Shared state of the lesson layout. On wide screens the two sidebars are
 * rendered beside the text through the portals; on phones the same content
 * opens in bottom sheets, and the flags below let the layout's header (the
 * "Indice" button) and the page (the sheet itself) agree on what is open.
 */
export class TopicLayoutStore {
    leftSidebar = $state<import('svelte').Snippet | null>(null);
    rightSidebar = $state<import('svelte').Snippet | null>(null);
    scrollY = $state(0);
    /** 0..1, how far the lesson has been scrolled. */
    scrollProgress = $state(0);
    /** The current page has a table of contents to show. */
    hasToc = $state(false);
    /** The table of contents sheet is open (phones and tablets). */
    tocOpen = $state(false);
}

export const layoutState = new TopicLayoutStore();

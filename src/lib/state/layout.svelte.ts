import { writable } from 'svelte/store';

export const topicLayoutState = writable({
    leftSidebar: null,
    rightSidebar: null,
});

export class TopicLayoutStore {
    leftSidebar = $state<import('svelte').Snippet | null>(null);
    rightSidebar = $state<import('svelte').Snippet | null>(null);
    scrollY = $state(0);
}

export const layoutState = new TopicLayoutStore();


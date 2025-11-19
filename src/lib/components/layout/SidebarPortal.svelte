<script lang="ts">
    import { layoutState } from '$lib/state/layout.svelte.js';
    import type { Snippet } from 'svelte';

    let { side, children }: { side: 'left' | 'right', children: Snippet } = $props();

    $effect(() => {
        if (side === 'left') {
            layoutState.leftSidebar = children;
        } else if (side === 'right') {
            layoutState.rightSidebar = children;
        }

        return () => {
            if (side === 'left') {
                layoutState.leftSidebar = null;
            } else if (side === 'right') {
                layoutState.rightSidebar = null;
            }
        };
    });
</script>


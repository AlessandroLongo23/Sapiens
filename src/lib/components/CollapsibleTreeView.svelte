<script>
    import { contentStore } from '$lib/stores/content/content.js';
    import * as ls from 'lucide-svelte';
    import { createEventDispatcher } from 'svelte';
    import TreeNode from './TreeNode.svelte';
    
    // Component props
    let { selectedIds = [] } = $props();
    
    // Create reactive state for selected and expanded nodes
    let selected = $state(new Set(selectedIds));
    let expanded = $state(new Set());
    
    // Create event dispatcher for external communication
    const dispatch = createEventDispatcher();
    
    // Handle expanding/collapsing nodes
    function handleToggleExpand(event) {
        console.log('Toggling expand', event.detail);
        expanded = event.detail.expanded;
    }
    
    // Handle selection changes
    function handleToggleSelect(event) {
        console.log('Toggling select', event.detail);
        
        // Start with the selection from the event
        let newSelected = new Set([...event.detail.selected]);
        
        // If we're deselecting a node, we need to recursively deselect all parent nodes
        if (!event.detail.wasSelected && event.detail.parentId) {
            // We need to recursively deselect parents
            recursiveDeselectParents(event.detail.parentId, newSelected);
        }
        
        selected = newSelected;
        dispatch('change', Array.from(selected));
    }
    
    // Helper function to recursively deselect parents
    function recursiveDeselectParents(nodeId, selectedSet) {
        // Find the node
        const node = findNodeById(nodeId);
        if (!node) return;
        
        // Deselect this node
        selectedSet.delete(nodeId);
        
        // If this node has a parent, recursively deselect the parent too
        if (node.parent_id) {
            recursiveDeselectParents(node.parent_id, selectedSet);
        }
    }
    
    // Helper function to find a node by its ID in the flat nodes list
    function findNodeById(nodeId) {
        return $contentStore.flatNodes.find(node => node.id === nodeId);
    }
    
    $effect(() => {
        dispatch('change', Array.from(selected));
    });
    
    // Helper function to expand all nodes
    function expandAll() {
        const newExpanded = new Set();
        $contentStore.flatNodes.forEach(node => {
            if (node.children && node.children.length > 0) {
                newExpanded.add(node.id);
            }
        });
        expanded = newExpanded;
    }
    
    // Helper function to collapse all nodes
    function collapseAll() {
        expanded = new Set();
    }
</script>

{#if $contentStore.loading}
    <div class="flex justify-center items-center p-6">
        <ls.Loader class="size-6 text-blue-600 dark:text-blue-400 animate-spin" />
    </div>
{:else if $contentStore.error}
    <div class="text-red-600 dark:text-red-400 p-4">
        Error loading content: {$contentStore.error}
    </div>
{:else if !$contentStore.contentTree || $contentStore.contentTree.length === 0}
    <div class="text-zinc-600 dark:text-zinc-400 p-4">
        No content available.
    </div>
{:else}
    <div class="tree-view">
        <!-- Controls -->
        <div class="flex justify-end mb-2 gap-2">
            <button
                type="button"
                class="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 px-2 py-1"
                onclick={() => collapseAll()}
            >
                <ls.ChevronRight class="size-3" />
                Chiudi tutto
            </button>
            <button
                type="button"
                class="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 px-2 py-1"
                onclick={() => expandAll()}
            >
                <ls.ChevronDown class="size-3" />
                Espandi tutto
            </button>
        </div>
        
        <!-- Tree nodes -->
        {#each $contentStore.contentTree as node}
            <TreeNode 
                {node} 
                {expanded} 
                {selected} 
                depth={0}
                on:toggleExpand={handleToggleExpand}
                on:toggleSelect={handleToggleSelect}
            />
        {/each}
    </div>
{/if}

<style>
    .tree-view {
        width: 100%;
        overflow-y: auto;
        max-height: 500px;
    }
    
    :global(.tree-view::-webkit-scrollbar) {
        width: 6px;
    }
    
    :global(.tree-view::-webkit-scrollbar-track) {
        background: transparent;
    }
    
    :global(.tree-view::-webkit-scrollbar-thumb) {
        background-color: rgb(209 213 219);
        border-radius: 20px;
    }
    
    :global(.dark .tree-view::-webkit-scrollbar-thumb) {
        background-color: rgb(55 65 81);
    }
</style>
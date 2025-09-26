<script>
    import { contentStore } from '$lib/stores/content.js';
    import { createEventDispatcher } from 'svelte';
    import * as ls from 'lucide-svelte';

    import TreeNode from '$lib/components/admin/topics/TreeNode.svelte';
    
    let { selectedIds = [] } = $props();
    
    let selected = $state(new Set(selectedIds));
    let expanded = $state(new Set());
    
    const dispatch = createEventDispatcher();
    
    const handleToggleExpand = (event) => {
        expanded = event.detail.expanded;
    }
    
    const handleToggleSelect = (event) => {
        let newSelected = new Set([...event.detail.selected]);
        
        if (!event.detail.wasSelected && event.detail.parentId) {
            recursiveDeselectParents(event.detail.parentId, newSelected);
        }
        
        selected = newSelected;
        dispatch('change', Array.from(selected));
    }
    
    const recursiveDeselectParents = (nodeId, selectedSet) => {
        const node = findNodeById(nodeId);
        if (!node) return;
        
        selectedSet.delete(nodeId);
        
        if (node.parent_id) {
            recursiveDeselectParents(node.parent_id, selectedSet);
        }
    }
    
    const findNodeById = (nodeId) => {
        return $contentStore.flatNodes.find(node => node.id === nodeId);
    }
    
    $effect(() => {
        dispatch('change', Array.from(selected));
    });
    
    const expandAll = () => {
        const newExpanded = new Set();
        $contentStore.flatNodes.forEach(node => {
            if (node.children && node.children.length > 0) {
                newExpanded.add(node.id);
            }
        });
        expanded = newExpanded;
    }
    
    const collapseAll = () => {
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
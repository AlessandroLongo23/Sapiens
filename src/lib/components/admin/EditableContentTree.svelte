<script>
    import { contentStore } from '$lib/stores/content/content.js';
    import * as ls from 'lucide-svelte';
    import { createEventDispatcher } from 'svelte';
    import EditableTreeNode from './EditableTreeNode.svelte';
    import ContextMenu from '../ui/ContextMenu.svelte';
    
    // Component props
    let { selectedIds = [] } = $props();
    
    // Create reactive state for selected and expanded nodes
    let selected = $state(new Set(selectedIds));
    let expanded = $state(new Set());
    
    // Context menu state for the background
    let showContextMenu = $state(false);
    let contextMenuX = $state(0);
    let contextMenuY = $state(0);
    
    // Create event dispatcher for external communication
    const dispatch = createEventDispatcher();
    
    // Handle expanding/collapsing nodes
    function handleToggleExpand(event) {
        expanded = event.detail.expanded;
    }
    
    // Handle selection changes
    function handleToggleSelect(event) {
        selected = event.detail.selected;
        dispatch('change', Array.from(selected));
    }
    
    // Handle node actions (create, edit, delete)
    function handleNodeAction(event) {
        const { action, nodeId, nodeType, node } = event.detail;
        dispatch('nodeAction', { action, nodeId, nodeType, node });
    }
    
    // Background context menu handler
    function handleBackgroundContextMenu(event) {
        // Only allow context menu in empty areas
        if (event.target.classList.contains('tree-view')) {
            event.preventDefault();
            contextMenuX = event.clientX;
            contextMenuY = event.clientY;
            showContextMenu = true;
        }
    }
    
    function closeContextMenu() {
        showContextMenu = false;
    }
    
    // Context menu items for the background (root level)
    const backgroundContextMenuItems = [
        {
            label: 'Add Level',
            icon: ls.Plus,
            action: 'create',
            data: { nodeType: 'level' }
        },
        {
            label: 'Expand All',
            icon: ls.ChevronsDown,
            action: 'expandAll'
        },
        {
            label: 'Collapse All',
            icon: ls.ChevronsUp,
            action: 'collapseAll'
        }
    ];
    
    // Handle background context menu actions
    function handleBackgroundAction(event) {
        const { action, data } = event.detail;
        
        if (action === 'expandAll') {
            expandAll();
        } else if (action === 'collapseAll') {
            collapseAll();
        } else {
            dispatch('nodeAction', { action, nodeType: data.nodeType });
        }
    }
    
    // Helper function to expand all nodes
    function expandAll() {
        const newExpanded = new Set();
        $contentStore.flatNodes.forEach(node => {
            if (hasChildren(node.id)) {
                newExpanded.add(node.id);
            }
        });
        expanded = newExpanded;
    }
    
    // Helper function to collapse all nodes
    function collapseAll() {
        expanded = new Set();
    }
    
    // Helper function to check if a node has children
    function hasChildren(nodeId) {
        return $contentStore.flatNodes.some(node => node.parent_id === nodeId);
    }
    
    $effect(() => {
        dispatch('change', Array.from(selected));
    });
</script>

<div 
    class="tree-view" 
    oncontextmenu={handleBackgroundContextMenu}
    role="tree"
    tabindex="0"
>
    {#if $contentStore.loading}
        <div class="flex justify-center items-center p-6">
            <ls.Loader class="size-6 text-blue-600 dark:text-blue-400 animate-spin" />
        </div>
    {:else if $contentStore.error}
        <div class="text-red-600 dark:text-red-400 p-4">
            Error loading content: {$contentStore.error}
        </div>
    {:else if !$contentStore.contentTree || $contentStore.contentTree.length === 0}
        <div class="text-zinc-600 dark:text-zinc-400 p-4 text-center my-8">
            <ls.FileQuestion class="size-10 mx-auto mb-2 opacity-50" />
            <p>No content available. Right-click to add content.</p>
        </div>
    {:else}
        <div class="pb-2 flex justify-between items-center mb-2 border-b border-zinc-200 dark:border-zinc-700">
            <h3 class="text-sm font-medium text-zinc-900 dark:text-zinc-100">Content Structure</h3>
            
            <div class="flex gap-1">
                <button
                    type="button"
                    class="p-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded"
                    onclick={expandAll}
                    title="Expand All"
                >
                    <ls.ChevronsDown class="size-4" />
                </button>
                <button
                    type="button"
                    class="p-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded"
                    onclick={collapseAll}
                    title="Collapse All"
                >
                    <ls.ChevronsUp class="size-4" />
                </button>
                <button
                    type="button"
                    class="p-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded"
                    onclick={() => dispatch('nodeAction', { action: 'create', nodeType: 'level' })}
                    title="Add Level"
                >
                    <ls.Plus class="size-4" />
                </button>
            </div>
        </div>
        
        {#each $contentStore.contentTree as node}
            <EditableTreeNode 
                {node} 
                {expanded} 
                {selected} 
                depth={0}
                on:toggleExpand={handleToggleExpand}
                on:toggleSelect={handleToggleSelect}
                on:nodeAction={handleNodeAction}
            />
        {/each}
    {/if}
</div>

{#if showContextMenu}
    <ContextMenu
        x={contextMenuX}
        y={contextMenuY}
        items={backgroundContextMenuItems}
        on:close={closeContextMenu}
        on:action={handleBackgroundAction}
    />
{/if}

<style>
    .tree-view {
        width: 100%;
        overflow-y: auto;
        max-height: 70vh;
        padding: 8px;
        min-height: 300px;
        position: relative;
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

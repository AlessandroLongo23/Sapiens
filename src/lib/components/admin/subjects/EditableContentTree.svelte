<script>
    import { reorderChildNodes } from '$lib/services/contentNodeService.js';
    import { contentStore } from '$lib/stores/content/content.js';
    import { dragHandleZone } from 'svelte-dnd-action';
    import { createEventDispatcher } from 'svelte';
    import * as ls from 'lucide-svelte';
    
    import EditableTreeNode from '$lib/components/admin/subjects/EditableTreeNode.svelte';
    import ContextMenu from '$lib/components/shared/ui/ContextMenu.svelte';
    
    let { selectedIds = [] } = $props();
    
    let selected = $state(new Set(selectedIds));
    let expanded = $state(new Set());
    let showContextMenu = $state(false);
    let contextMenuX = $state(0);
    let contextMenuY = $state(0);
    
    const dispatch = createEventDispatcher();
    
    function handleToggleExpand(event) {
        expanded = event.detail.expanded;
    }
    
    function handleToggleSelect(event) {
        selected = event.detail.selected;
        dispatch('change', Array.from(selected));
    }
    
    function handleNodeAction(event) {
        const { action, nodeId, nodeType, node } = event.detail;
        dispatch('nodeAction', { action, nodeId, nodeType, node });
    }
    
    function handleBackgroundContextMenu(event) {
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
    
    function expandAll() {
        const newExpanded = new Set();
        $contentStore.flatNodes.forEach(node => {
            if (hasChildren(node.id)) {
                newExpanded.add(node.id);
            }
        });
        expanded = newExpanded;
    }
    
    function collapseAll() {
        expanded = new Set();
    }
    
    function hasChildren(nodeId) {
        return $contentStore.flatNodes.some(node => node.parent_id === nodeId);
    }
    
    $effect(() => {
        dispatch('change', Array.from(selected));
    });

    
    let rootItems = $state([]);
    let isRootDragging = $state(false);
    
    $effect(() => {
        const tree = Array.isArray($contentStore.contentTree) ? $contentStore.contentTree : [];
        if (!isRootDragging) {
            
            rootItems = tree.map(n => ({ ...n }));
        }
    });
    
    function onRootConsider(event) {
        isRootDragging = true;
        const { items } = event.detail;
        rootItems = items;
    }
    
    async function onRootFinalize(event) {
        const { items } = event.detail;
        rootItems = items;
        try {
            const orderedIds = rootItems.map(n => n.id);
            await reorderChildNodes(null, orderedIds);
        } catch (err) {
            console.error('Failed to persist root reorder:', err);
        } finally {
            isRootDragging = false;
        }
    }
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
        
        <div
            use:dragHandleZone={{ items: rootItems, dropFromOthersDisabled: true, flipDurationMs: 150 }}
            onconsider={onRootConsider}
            onfinalize={onRootFinalize}
        >
            {#if Array.isArray(rootItems)}
                {#each rootItems as node (node.id)}
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
    :global(.dndDragging) {
        opacity: 0.85;
        transform: scale(0.99);
    }
    :global(.dndPlaceholder) {
        border: 2px dashed rgb(161 161 170);
        border-radius: 0.5rem;
        margin-bottom: 0.25rem;
        min-height: 2rem;
        background: rgba(161,161,170,0.08);
    }
</style>

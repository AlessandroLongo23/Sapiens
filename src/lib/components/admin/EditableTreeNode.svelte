<script>
    import { slide } from 'svelte/transition';
    import * as ls from 'lucide-svelte';
    import { createEventDispatcher } from 'svelte';
    import ContextMenu from '../ui/ContextMenu.svelte';
    
    // Props
    let { 
        node,
        expanded = new Set(),
        selected = new Set(),
        depth = 0
    } = $props();
    
    // Import self for recursion
    import EditableTreeNode from './EditableTreeNode.svelte';
    
    // Create event dispatcher
    const dispatch = createEventDispatcher();
    
    // Context menu state
    let showContextMenu = $state(false);
    let contextMenuX = $state(0);
    let contextMenuY = $state(0);
    
    function toggleExpand(nodeId, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        // Create a new set to ensure reactivity
        const newExpanded = new Set([...expanded]);
        
        if (newExpanded.has(nodeId)) {
            newExpanded.delete(nodeId);
        } else {
            newExpanded.add(nodeId);
        }
        
        // Dispatch event to parent component
        dispatch('toggleExpand', { expanded: newExpanded });
    }
    
    function toggleSelect(nodeId, event) {
        if (event) {
            event.stopPropagation();
        }
        
        // Create a new set to ensure reactivity
        const newSelected = new Set([...selected]);
        
        if (newSelected.has(nodeId)) {
            newSelected.delete(nodeId);
        } else {
            newSelected.add(nodeId);
        }
        
        // Dispatch event to parent component
        dispatch('toggleSelect', { selected: newSelected });
    }
    
    function handleContextMenu(event) {
        event.preventDefault();
        
        // Show context menu at click position
        contextMenuX = event.clientX;
        contextMenuY = event.clientY;
        showContextMenu = true;
    }
    
    function closeContextMenu() {
        showContextMenu = false;
    }
    
    function handleNodeAction(event) {
        const { action, data } = event.detail;
        
        // Dispatch action to parent component
        dispatch('nodeAction', { 
            action, 
            nodeId: node.id, 
            nodeType: node.node_type,
            node
        });
    }
    
    // Get list of possible child node types based on parent node type
    function getChildNodeTypes(nodeType) {
        switch (nodeType) {
            case 'level':
                return ['subject'];
            case 'subject':
                return ['year'];
            case 'year':
                return ['topic'];
            case 'topic':
                return ['subtopic'];
            default:
                return [];
        }
    }
    
    // Build context menu items dynamically based on node type
    let contextMenuItems = $derived(() => {
        const childTypes = getChildNodeTypes(node.node_type);
        
        const items = [
            { 
                label: 'Edit', 
                icon: ls.Pencil, 
                action: 'edit', 
                data: { nodeId: node.id }
            },
            {
                label: 'Delete',
                icon: ls.Trash2,
                action: 'delete',
                data: { nodeId: node.id }
            }
        ];
        
        // If node can have children, add create options
        if (childTypes.length > 0) {
            items.unshift(
                {
                    label: `Add ${childTypes[0]}`,
                    icon: ls.Plus,
                    action: 'create',
                    data: { 
                        parentId: node.id,
                        nodeType: childTypes[0]
                    }
                }
            );
        }
        
        return items;
    });
    
    function getNodeTypeLabel(nodeType) {
        const labels = {
            'level': 'Livello',
            'subject': 'Materia',
            'year': 'Anno',
            'topic': 'Argomento',
            'subtopic': 'Sottoargomento'
        };
        return labels[nodeType] || nodeType;
    }
    
    const hasChildren = $derived(node.children && node.children.length > 0);
    const isExpanded = $derived(expanded.has(node.id));
    const isSelected = $derived(selected.has(node.id));
</script>

<div class="tree-node mb-1" oncontextmenu={handleContextMenu} role="treeitem" aria-selected={isSelected} tabindex="0">
    <div class="tree-node-content flex justify-between items-center px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors w-full text-left {isSelected ? 'bg-blue-50 dark:bg-blue-900/30' : ''}">
        <div class="flex items-center gap-2">
            {#if hasChildren}
                <div 
                    onkeydown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleExpand(node.id, e);
                        }
                    }}
                    class="w-5 h-5 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                    onclick={(e) => {
                        e.stopPropagation();
                        toggleExpand(node.id, e);
                    }}
                    role="button"
                    tabindex="0"
                >
                    {#if isExpanded}
                        <ls.ChevronDown class="size-4" />
                    {:else}
                        <ls.ChevronRight class="size-4" />
                    {/if}
                </div>
            {:else}
                <span class="w-5"></span>
            {/if}
            
            <div class="flex items-center">
                <input 
                    type="checkbox" 
                    id="node-{node.id}" 
                    class="form-checkbox h-4 w-4 text-blue-600 dark:text-blue-400 rounded border-zinc-300 dark:border-zinc-600 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                    checked={isSelected}
                    onclick={(e) => toggleSelect(node.id, e)}
                />
                <label for="node-{node.id}" class="ml-2 font-medium text-zinc-900 dark:text-zinc-100">
                    <span
                        role="button"
                        tabindex="0"
                        onclick={() => toggleExpand(node.id)}
                        onkeydown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                toggleExpand(node.id);
                            }
                        }}
                    >
                        {node.title || node.slug}
                    </span>
                </label>
            </div>
            
            <div class="flex gap-1 ml-2">
                <button 
                    type="button" 
                    class="p-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded"
                    onclick={(e) => {
                        e.stopPropagation();
                        dispatch('nodeAction', { 
                            action: 'edit', 
                            nodeId: node.id, 
                            nodeType: node.node_type,
                            node
                        });
                    }}
                    title="Edit"
                >
                    <ls.Pencil class="size-3.5" />
                </button>
                
                {#if getChildNodeTypes(node.node_type).length > 0}
                    <button 
                        type="button" 
                        class="p-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded"
                        onclick={(e) => {
                            e.stopPropagation();
                            dispatch('nodeAction', { 
                                action: 'create', 
                                nodeId: node.id, 
                                nodeType: getChildNodeTypes(node.node_type)[0],
                                node
                            });
                        }}
                        title="Add child"
                    >
                        <ls.Plus class="size-3.5" />
                    </button>
                {/if}
                
                <button 
                    type="button" 
                    class="p-1 text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 rounded"
                    onclick={(e) => {
                        e.stopPropagation();
                        dispatch('nodeAction', { 
                            action: 'delete', 
                            nodeId: node.id, 
                            nodeType: node.node_type,
                            node
                        });
                    }}
                    title="Delete"
                >
                    <ls.Trash2 class="size-3.5" />
                </button>
            </div>
        </div>
        
        <span class="text-xs font-medium px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
            {getNodeTypeLabel(node.node_type)}
        </span>
    </div>
    
    {#if isExpanded && hasChildren}
        <div class="pl-4 border-l border-zinc-200 dark:border-zinc-700 ml-5.5 mt-1" transition:slide={{duration: 200}}>
            {#each node.children as childNode}
                <EditableTreeNode 
                    node={childNode} 
                    expanded={expanded} 
                    selected={selected}
                    depth={depth + 1}
                    on:toggleExpand
                    on:toggleSelect
                    on:nodeAction
                />
            {/each}
        </div>
    {/if}
</div>

{#if showContextMenu}
    <ContextMenu
        x={contextMenuX}
        y={contextMenuY}
        items={contextMenuItems}
        on:close={closeContextMenu}
        on:action={handleNodeAction}
    />
{/if}

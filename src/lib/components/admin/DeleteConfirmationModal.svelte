<script>
    import { createEventDispatcher } from 'svelte';
    import * as ls from 'lucide-svelte';
    
    // Props
    let { node = null } = $props();
    
    // Create event dispatcher
    const dispatch = createEventDispatcher();
    
    // Check if the node might have children (if it's a node type that could have children)
    const mightHaveChildren = ['level', 'subject', 'year', 'topic'].includes(node?.node_type);
    
    function handleConfirm() {
        dispatch('confirm', { nodeId: node?.id });
    }
    
    function handleCancel() {
        dispatch('cancel');
    }
    
    // Get node type label
    function getNodeTypeLabel(type) {
        const labels = {
            'level': 'Level',
            'subject': 'Subject',
            'year': 'Year',
            'topic': 'Topic',
            'subtopic': 'Subtopic'
        };
        
        return labels[type] || type;
    }
</script>

<div class="p-6">
    <div class="flex items-center gap-3 mb-4">
        <div class="bg-red-100 dark:bg-red-900/20 p-2.5 rounded-full">
            <ls.AlertTriangle class="size-6 text-red-600 dark:text-red-500" />
        </div>
        <h2 class="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Delete {getNodeTypeLabel(node?.node_type)}
        </h2>
    </div>
    
    <div class="space-y-4">
        <p class="text-zinc-700 dark:text-zinc-300">
            Are you sure you want to delete <strong>{node?.title || node?.slug}</strong>?
        </p>
        
        {#if mightHaveChildren}
            <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md border-l-4 border-amber-500 dark:border-amber-600">
                <p class="text-sm font-medium text-amber-800 dark:text-amber-300">Warning</p>
                <p class="text-sm text-amber-700 dark:text-amber-400 mt-1">
                    This action will also delete all child items. This cannot be undone.
                </p>
            </div>
        {/if}
        
        <div class="flex justify-end gap-3 pt-4">
            <button 
                type="button" 
                class="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                onclick={handleCancel}
            >
                Cancel
            </button>
            <button 
                type="button" 
                class="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
                onclick={handleConfirm}
            >
                Delete
            </button>
        </div>
    </div>
</div>

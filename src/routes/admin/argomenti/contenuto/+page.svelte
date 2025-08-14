<script>
    import * as ls from 'lucide-svelte';
    import { onMount } from 'svelte';
    import EditableContentTree from '$lib/components/admin/EditableContentTree.svelte';
    import ContentNodeForm from '$lib/components/admin/ContentNodeForm.svelte';
    import DeleteConfirmationModal from '$lib/components/admin/DeleteConfirmationModal.svelte';
    import { messagePopup } from '$lib/components/messagePopup/messagePopup.js';
    import { contentStore } from '$lib/stores/content/content.js';
    import { createContentNode, updateContentNode, deleteContentNode, getNodeById } from '$lib/services/contentNodeService.js';
    
    // State for modals
    let showCreateModal = $state(false);
    let showEditModal = $state(false);
    let showDeleteModal = $state(false);
    
    // Currently selected node info
    let currentNode = $state(null);
    let currentNodeType = $state('level');
    let parentNode = $state(null);
    
    // Selected content nodes
    let selectedIds = $state([]);
    
    onMount(() => {
        // Ensure content is loaded
        contentStore.fetchContent();
    });
    
    async function handleNodeAction(event) {
        const { action, nodeId, nodeType, node } = event.detail;
        
        switch (action) {
            case 'create':
                // Prepare for node creation
                currentNodeType = nodeType;
                currentNode = null;
                parentNode = nodeId ? await getNodeById(nodeId) : null;
                showCreateModal = true;
                break;
                
            case 'edit':
                // Prepare for node editing
                currentNode = node || await getNodeById(nodeId);
                currentNodeType = nodeType || currentNode.node_type;
                parentNode = currentNode.parent_id ? await getNodeById(currentNode.parent_id) : null;
                showEditModal = true;
                break;
                
            case 'delete':
                // Prepare for node deletion
                currentNode = node || await getNodeById(nodeId);
                showDeleteModal = true;
                break;
                
            default:
                console.warn('Unknown action:', action);
        }
    }
    
    async function handleCreateNode(event) {
        const { node: nodeData } = event.detail;
        
        try {
            const result = await createContentNode(nodeData);
            messagePopup.success(`${nodeData.title} created successfully`);
            showCreateModal = false;
        } catch (error) {
            messagePopup.error(`Error creating node: ${error.message}`);
        }
    }
    
    async function handleUpdateNode(event) {
        const { node: nodeData } = event.detail;
        
        try {
            const result = await updateContentNode(nodeData.id, nodeData);
            messagePopup.success(`${nodeData.title} updated successfully`);
            showEditModal = false;
        } catch (error) {
            messagePopup.error(`Error updating node: ${error.message}`);
        }
    }
    
    async function handleDeleteNode() {
        try {
            await deleteContentNode(currentNode.id);
            messagePopup.success(`${currentNode.title || currentNode.slug} deleted successfully`);
            showDeleteModal = false;
        } catch (error) {
            messagePopup.error(`Error deleting node: ${error.message}`);
        }
    }
    
    function handleSelectionChange(event) {
        selectedIds = event.detail;
    }
</script>

<div class="space-y-6">
    <div class="flex justify-between items-center">
        <h1 class="text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
            <ls.LayoutGrid class="text-blue-600 dark:text-blue-400 size-6" />
            Content Management
        </h1>
        
        <div class="flex gap-2">
            <button 
                class="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-md text-sm flex items-center gap-1.5 transition-colors"
                onclick={() => contentStore.fetchContent()}
            >
                <ls.RefreshCw class="size-3.5" />
                Refresh
            </button>
            
            <button 
                class="px-3 py-1.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-md text-sm flex items-center gap-1.5 transition-colors"
                onclick={() => {
                    currentNodeType = 'level';
                    currentNode = null;
                    parentNode = null;
                    showCreateModal = true;
                }}
            >
                <ls.Plus class="size-3.5" />
                Add Level
            </button>
        </div>
    </div>
    
    <div class="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm">
        <EditableContentTree 
            selectedIds={selectedIds} 
            on:change={handleSelectionChange}
            on:nodeAction={handleNodeAction}
        />
    </div>
    
    <!-- Create Node Modal -->
    {#if showCreateModal}
        <div class="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <ContentNodeForm 
                    nodeType={currentNodeType}
                    parentNode={parentNode}
                    isNew={true}
                    on:save={handleCreateNode}
                    on:cancel={() => showCreateModal = false}
                />
            </div>
        </div>
    {/if}
    
    <!-- Edit Node Modal -->
    {#if showEditModal}
        <div class="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <ContentNodeForm 
                    nodeType={currentNodeType}
                    node={currentNode}
                    parentNode={parentNode}
                    isNew={false}
                    on:save={handleUpdateNode}
                    on:cancel={() => showEditModal = false}
                />
            </div>
        </div>
    {/if}
    
    <!-- Delete Confirmation Modal -->
    {#if showDeleteModal}
        <div class="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-xl w-full max-w-md">
                <DeleteConfirmationModal 
                    node={currentNode}
                    on:confirm={handleDeleteNode}
                    on:cancel={() => showDeleteModal = false}
                />
            </div>
        </div>
    {/if}
</div>

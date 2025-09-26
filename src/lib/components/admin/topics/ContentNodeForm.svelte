<script>
    import { createEventDispatcher } from 'svelte';
    import * as ls from 'lucide-svelte';
    
    let { 
        node = null,
        nodeType = 'level', 
        parentNode = null,
        isNew = true,
    } = $props();
    
    const dispatch = createEventDispatcher();
    
    let title = $state(node?.title || '');
    let slug = $state(node?.slug || '');
    let description = $state(node?.description || '');
    let formValid = $state(false);
    let slugEdited = $state(false);
    
    $effect(() => {
        if (title && !slugEdited) {
            slug = title
                .toLowerCase()
                .replace(/\s+/g, '-')     
                .replace(/[^\w\-]+/g, '') 
                .replace(/\-\-+/g, '-')   
                .replace(/^-+/, '')       
                .replace(/-+$/, '');      
        }
    });
    
    $effect(() => {
        formValid = !!title && !!slug;
    });
    
    function handleSubmit() {
        if (!formValid) return;
        
        const nodeData = {
            ...(node?.id && { id: node.id }),
            node_type: nodeType,
            parent_id: parentNode?.id || null,
            slug,
            title,
            description,
        };
        
        dispatch('save', { node: nodeData, isNew });
    }
    
    function handleCancel() {
        dispatch('cancel');
    }
    
    function getFormTitle() {
        const action = isNew ? 'New' : 'Edit';
        const type = getNodeTypeLabel(nodeType);
        return `${action} ${type}`;
    }
    
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
    
    function handleFormSubmit(event) {
        event.preventDefault();
        handleSubmit();
    }
</script>

<div class="p-6">
    <h2 class="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
        {#if isNew}
            <ls.Plus class="size-5 text-blue-600 dark:text-blue-400" />
        {:else}
            <ls.Pencil class="size-5 text-orange-600 dark:text-orange-400" />
        {/if}
        {getFormTitle()}
    </h2>
    
    <form onsubmit={handleFormSubmit} class="space-y-4">
        {#if parentNode}
            <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md text-sm text-blue-700 dark:text-blue-300">
                <p class="font-medium">Parent: {parentNode.title || parentNode.slug}</p>
                <p class="text-xs opacity-75 mt-1">{getNodeTypeLabel(parentNode.node_type)}</p>
            </div>
        {/if}
        
        <div class="space-y-4">
            <div>
                <label for="title" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Title *</label>
                <input 
                    id="title" 
                    type="text" 
                    bind:value={title} 
                    class="w-full p-2.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                    placeholder="Enter title"
                    required
                />
            </div>
            
            <div>
                <label for="slug" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Slug *</label>
                <div class="flex gap-2">
                    <input 
                        id="slug" 
                        type="text" 
                        bind:value={slug}
                        onchange={() => slugEdited = true}
                        class="w-full p-2.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                        placeholder="enter-slug"
                        required
                    />
                </div>
                <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Used in URLs. Use lowercase letters, numbers, and hyphens only.</p>
            </div>
            
            <div>
                <label for="description" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
                <textarea 
                    id="description" 
                    bind:value={description} 
                    class="w-full p-2.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 min-h-[100px]"
                    placeholder="Enter description"
                ></textarea>
            </div>
        </div>
        
        <div class="flex justify-end gap-3 pt-4">
            <button 
                type="button" 
                class="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                onclick={handleCancel}
            >
                Cancel
            </button>
            <button 
                type="submit" 
                class="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                disabled={!formValid}
            >
                {isNew ? 'Create' : 'Update'}
            </button>
        </div>
    </form>
</div>
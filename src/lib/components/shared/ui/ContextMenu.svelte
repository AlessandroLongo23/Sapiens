<script>
    import { onMount, createEventDispatcher } from 'svelte';

    let { 
        x = 0, 
        y = 0, 
        items = [] 
    } = $props();
    
    const dispatch = createEventDispatcher();
    
    let menuRef;
    
    $effect(() => {
        if (!menuRef) return;
        
        setTimeout(() => {
            if (!menuRef) return;
            
            const viewport = {
                width: window.innerWidth,
                height: window.innerHeight
            };
            
            const menu = {
                width: menuRef.offsetWidth,
                height: menuRef.offsetHeight
            };
            
            if (x + menu.width > viewport.width) {
                x = viewport.width - menu.width - 10;
            }
            
            if (y + menu.height > viewport.height) {
                y = viewport.height - menu.height - 10;
            }
        }, 0);
    });
    
    function handleClickOutside(e) {
        if (menuRef && !menuRef.contains(e.target)) {
            dispatch('close');
        }
    }
    
    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            dispatch('close');
        }
    }
    
    onMount(() => {
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    });
    
    function handleMenuItemClick(item) {
        dispatch('action', { action: item.action, data: item.data });
        dispatch('close');
    }
</script>

<div 
    class="absolute z-50 bg-white dark:bg-zinc-800 rounded-md shadow-lg border border-zinc-200 dark:border-zinc-700 py-1 min-w-[160px]"
    style="top: {y}px; left: {x}px;"
    bind:this={menuRef}
>
    {#each items as item}
        {#if item.separator}
            <div class="my-1 mx-2 border-t border-zinc-200 dark:border-zinc-700"></div>
        {:else}
            <button
                class="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={item.disabled}
                onclick={() => handleMenuItemClick(item)}
            >
                {#if item.icon}
                    <div class="size-4">
                        {#key item.icon}
                            <item.icon />
                        {/key}
                    </div>
                {/if}
                {item.label}
            </button>
        {/if}
    {/each}
</div>

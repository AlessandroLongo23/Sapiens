<script>
    import { Loader, LogOut } from 'lucide-svelte';
    import { goto } from '$app/navigation';

    let isLoggingOut = $state(false);
</script>

<button
    disabled={isLoggingOut}
    class="
        flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm group cursor-pointer transition-all duration-300
        bg-zinc-100 dark:bg-zinc-800 border border-zinc-500/25 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 
        {isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}
    "
    onclick={async () => { 
        isLoggingOut = true;
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = '/';
        }
    }}
>
    <span>{isLoggingOut ? 'Uscendo...' : 'Logout'}</span>
    {#if isLoggingOut}
        <Loader class="size-4 animate-spin" />
    {:else}
        <LogOut class="size-4" />
    {/if}
</button>
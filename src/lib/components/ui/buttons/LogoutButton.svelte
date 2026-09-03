<script lang="ts">
    import { Loader, LogOut } from 'lucide-svelte';
    import { authState } from '$lib/state/auth.svelte';

    let isLoggingOut = $state(false);

    const logout = async () => {
        isLoggingOut = true;
        try {
            await authState.signOut();
        } finally {
            // Full reload: every cached page state is dropped with the session.
            window.location.href = '/';
        }
    };
</script>

<button
    type="button"
    disabled={isLoggingOut}
    class="flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm group cursor-pointer transition-all duration-300 bg-zinc-100 dark:bg-zinc-800 border border-zinc-500/25 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
    onclick={logout}
>
    <span>{isLoggingOut ? 'Uscendo…' : 'Esci'}</span>
    {#if isLoggingOut}
        <Loader class="size-4 animate-spin" aria-hidden="true" />
    {:else}
        <LogOut class="size-4" aria-hidden="true" />
    {/if}
</button>

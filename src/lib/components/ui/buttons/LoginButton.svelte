<script lang="ts">
    import { Home, LogIn } from 'lucide-svelte';
    import { authState } from '$lib/state/auth.svelte';
    import { isStaff } from '$lib/auth/entitlements';

    // Public pages are cached without any user data, so the logged-in state
    // comes from the cookie session read in the browser after hydration.
    let loggedIn = $derived(authState.user !== null);
    let accountUrl = $derived(isStaff(authState.user) ? '/admin' : '/subscription');
</script>

{#if loggedIn}
    <a
        href={accountUrl}
        class="bg-zinc-100 dark:bg-zinc-800 border border-zinc-500/25 text-zinc-700 dark:text-zinc-200 px-4 py-2 rounded-xl font-semibold text-sm cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 no-underline"
    >
        <span class="flex items-center justify-center gap-2">
            <span>{isStaff(authState.user) ? 'Dashboard' : 'Account'}</span>
            <Home class="size-4" aria-hidden="true" />
        </span>
    </a>
{:else}
    <button
        type="button"
        onclick={() => authState.openModal()}
        class="bg-zinc-100 dark:bg-zinc-800 border border-zinc-500/25 text-zinc-700 dark:text-zinc-200 px-4 py-2 rounded-xl font-semibold text-sm cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
    >
        <span class="flex items-center justify-center gap-2">
            <span>Accedi</span>
            <LogIn class="size-4" aria-hidden="true" />
        </span>
    </button>
{/if}

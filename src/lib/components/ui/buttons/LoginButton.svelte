<script lang="ts">
    import { Home, LogIn } from 'lucide-svelte';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let {
        session = null,
        isAuthModalOpen = $bindable(false)
    } = $props();

    // Public pages are cached without any user data, so the logged-in state is
    // confirmed in the browser after hydration.
    let loggedIn = $state(false);

    $effect(() => {
        if (session) loggedIn = true;
    });

    onMount(async () => {
        if (session) return;
        try {
            // The Supabase client is loaded on demand so public pages do not ship it.
            const { supabase } = await import('$lib/supabase.js');
            const { data } = await supabase.auth.getSession();
            if (data.session) loggedIn = true;
        } catch {
            // Not logged in.
        }
    });

    const clickAccessButton = async () => {
		if (loggedIn) {
			// const redirectPath = session?.user?.user_metadata?.role === 'admin' ? '/admin/analytics' : '/student/materiale';
			const redirectPath = '/admin';
			await goto(redirectPath);
		} else {
			isAuthModalOpen = true;
		}
	}
</script>

<button
    type="button"
    onclick={clickAccessButton}
    class="bg-zinc-100 dark:bg-zinc-800 border border-zinc-500/25 text-zinc-700 dark:text-zinc-200 px-4 py-2 rounded-xl font-semibold text-sm cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
>
    <span class="flex items-center justify-center gap-2">
        <span>{loggedIn ? 'Dashboard' : 'Accedi'}</span>
        {#if loggedIn}
            <Home class="size-4" aria-hidden="true" />
        {:else}
            <LogIn class="size-4" aria-hidden="true" />
        {/if}
    </span>
</button>

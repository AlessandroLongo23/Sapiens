<script lang="ts">
    import { Home, LogIn } from 'lucide-svelte';
    import { goto } from '$app/navigation';
    let { 
        session = $bindable(false), 
        isAuthModalOpen = $bindable(false)
    } = $props();

    const clickAccessButton = async () => {
		if (session) { 
			// const redirectPath = session?.user?.user_metadata?.role === 'admin' ? '/admin/analytics' : '/student/materiale';
			const redirectPath = '/student/dashboard';
			await goto(redirectPath);
		} else { 
			isAuthModalOpen = true;
		} 
	}
</script>

<button
    onclick={clickAccessButton}
    class="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 px-4 py-2 rounded-xl font-semibold text-sm cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
>
    <span class="flex items-center justify-center gap-2">
        <span>{session ? 'Dashboard' : 'Accedi'}</span>
        {#if session}
            <Home class="size-4" />
        {:else}
            <LogIn class="size-4" />
        {/if}
    </span>
</button>
<script>
    import { goto } from '$app/navigation';
    import * as ls from 'lucide-svelte';

    import ThemeToggle from '$lib/components/shared/ui/theme/ThemeToggle.svelte';
    import BookingModal from '$lib/components/shared/ui/modals/BookingModal.svelte';

    let { 
        session,
        isAuthModalOpen = $bindable(false),
		isContactModalOpen = $bindable(false),
        activeSection = $bindable('about')
    } = $props();

    function openAuthModal() {
		isAuthModalOpen = true;
	}

    const accessPrivateRoute = async () => {
		const redirectPath = session?.user?.user_metadata?.role === 'admin' ? '/admin/analytics' : '/student/materiale';
		await goto(redirectPath);
	}

    const sections = [
		{
			id: 'about',
			label: 'Chi sono',
			icon: ls.User
		},
		{
			id: 'subjects',	
			label: 'Materie',
			icon: ls.BookOpen
		},
		{
			id: 'metodo',
			label: 'Metodo',
			icon: ls.Lightbulb
		},
		{
			id: 'stats',
			label: 'Risultati',
			icon: ls.Calculator
		},
		{
			id: 'testimonials',
			label: 'Recensioni',
			icon: ls.Star
		}
	]
</script>

<header class="sm:top-8 top-4 z-30 fixed left-1/2 -translate-x-1/2 sm:left-4 sm:right-4 sm:translate-x-0 mx-auto max-w-7xl rounded-2xl border border-zinc-200/70 dark:border-zinc-700/60 bg-white/70 dark:bg-zinc-900/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-zinc-900/60">
	<div class="flex items-center sm:justify-between justify-center px-2 sm:px-4 py-3">
		<a href="/" class="hidden sm:flex items-center gap-3">
			<img src="/icon.png" alt="logo" class="size-8 rounded-md" />
			<span class="font-semibold text-zinc-900 dark:text-zinc-100">Sapiens</span>
		</a>
		<nav class="hidden sm:flex items-center gap-6 text-sm">
			{#each sections as section}
				<a href={`#${section.id}`} class="relative nav-link group text-zinc-900 dark:text-zinc-100">
					{section.label}
					<span class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-500 rounded-full transition-opacity duration-200 {activeSection === section.id ? 'opacity-100' : 'opacity-0'}"></span>
				</a>
			{/each}
		</nav>
		<div class="flex items-center gap-2 sm:gap-3">
			<ThemeToggle />
			<button
				onclick={() => { if (session) { accessPrivateRoute() } else { openAuthModal() } }}
				class="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 px-4 py-2 rounded-xl font-semibold text-sm group cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
			>
				<span class="flex items-center justify-center gap-2">
					<span>{session ? 'Dashboard' : 'Accedi'}</span>
					{#if session}
						<ls.Home class="w-4 h-4" />
					{:else}
						<ls.LogIn class="w-4 h-4" />
					{/if}
				</span>
			</button>
			<button
				onclick={() => { isContactModalOpen = true }}
				class="btn-primary text-white px-4 sm:px-5 py-2 rounded-xl font-semibold shadow-elegant-lg group cursor-pointer"
			>
				<span class="flex items-center gap-2 text-sm">
					<ls.Calendar class="w-4 h-4" />
					<span class="hidden sm:inline">Prenota ora</span>
					<span class="sm:hidden">Prenota</span>
				</span>
			</button>
		</div>
    </div>
</header>
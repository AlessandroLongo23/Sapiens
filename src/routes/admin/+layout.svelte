<script>
	import { goto } from '$app/navigation';
	import * as ls from 'lucide-svelte';
	import ThemeToggle from '$lib/components/theme/ThemeToggle.svelte';
	import MessagePopupContainer from '$lib/components/messagePopup/MessagePopupContainer.svelte';
	import Sidebar from '$lib/components/sidebar/Sidebar.svelte';

	import { page } from '$app/stores';

	let title = $derived($page.url.pathname.split('/').pop().charAt(0).toUpperCase() + $page.url.pathname.split('/').pop().slice(1));

	let { children, data } = $props();

	let tabs = [
		{ name: 'Analytics', icon: ls.ChartArea },
		{ name: 'Calendario', icon: ls.Calendar },
		{ name: 'Studenti', icon: ls.Users },
		{ name: 'Argomenti', icon: ls.BookOpen }
	];
</script>

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 p-4 sm:p-6 lg:p-8 font-sans">
	<div class="max-w-7xl mx-auto h-full">
		<header class="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-4 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700">
			<h1 class="text-2xl font-bold text-zinc-900 dark:text-white">Ciao Alessandro!</h1>
			<div class="flex items-center gap-4">
				<ThemeToggle />
				<form
					action="/auth/logout"
					method="POST"
				>
					<button
						type="submit"
						class="bg-zinc-50 dark:bg-zinc-800 border hover:bg-zinc-200 dark:hover:bg-zinc-700 border-zinc-200 dark:border-zinc-700 text-red-500 dark:text-red-400 px-4 py-2 rounded-xl font-semibold text-sm group cursor-pointer transition-all duration-100 ease-in-out"
					>
						<span class="flex items-center justify-center space-x-2">
							<ls.LogOut class="w-4 h-4" />
							<span>Logout</span>
						</span>
					</button>
				</form>
			</div>
		</header>

		<div class="mt-24 min-h-[calc(100vh-10rem)]">
			<Sidebar classes="bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-700">
				<div class="flex flex-col gap-2 p-4 mt-4">
					{#each tabs as tab}
						<a href={`/admin/${tab.name.toLowerCase()}`} class="
						flex items-center gap-2 font-medium transition-all duration-200 ease-in-out px-4 py-2
						{
							$page.url.pathname.split('/').pop().toLowerCase() === tab.name.toLowerCase()
								? 'text-zinc-900 dark:text-zinc-200 bg-zinc-200 dark:bg-zinc-800 rounded-lg'
								: 'text-zinc-900/50 dark:text-zinc-200/50 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 rounded-lg'
						}
						">
							<tab.icon class="size-4" />
							<span>{tab.name}</span>
						</a>
					{/each}
				</div>
			</Sidebar>

			<div class="ml-60">
				{@render children()}
			</div>
		</div>
	</div>
</div>

<MessagePopupContainer />
<script>
	import { designSystem } from '$lib/const/appearance.js';
	import { page } from '$app/stores';
	import * as ls from 'lucide-svelte';

	import ThemeToggle from '$lib/components/shared/ui/theme/ThemeToggle.svelte';
	import MessagePopupContainer from '$lib/components/shared/ui/messagePopup/MessagePopupContainer.svelte';
	import Sidebar from '$lib/components/shared/ui/sidebar/Sidebar.svelte';

	let { children, data } = $props();
	
	let title = $derived($page.url.pathname.split('/').pop().charAt(0).toUpperCase() + $page.url.pathname.split('/').pop().slice(1));

	let tabs = [
		{ name: 'Analytics', icon: ls.ChartArea },
		{ name: 'Calendario', icon: ls.Calendar },
		{ name: 'Studenti', icon: ls.Users },
		{ name: 'Argomenti', icon: ls.BookOpen }
	];

	let date = $state('');
    let time = $state('');
    let seconds = $state('');
    let timeHasLoaded = $state(false);

	setInterval(() => {
		let d = new Date();
		let hours = d.getHours();
		let minutes = d.getMinutes();
        let secs = d.getSeconds();
        time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        seconds = secs.toString().padStart(2, '0');

        date = `${d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}`;
        timeHasLoaded = true;
    }, 1000);

	let isLoggingOut = $state(false);
	let isMobileSidebarOpen = $state(false);

	$effect(() => {
		$page.url.pathname;
		isMobileSidebarOpen = false;
	});
</script>

<div class="min-h-screen bg-[#F9FAFB] dark:bg-[#0A0A0A] text-[#374151] dark:text-white p-0 font-sans">
	<div class="h-full">
		<header class="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 md:px-6 py-3 md:py-4 bg-white dark:bg-[#121212] border-b border-[#E5E7EB] dark:border-[#2A2A2A] shadow-sm dark:shadow-md">
			<div class="flex flex-row items-center gap-3 md:gap-4">
				<button
					class="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border border-[#E5E7EB] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] text-[#111827] dark:text-white"
					onclick={() => (isMobileSidebarOpen = true)}
					aria-label="Apri menu"
				>
					<ls.Menu class="w-5 h-5" />
				</button>


				<div class="flex flex-row items-center gap-4 {timeHasLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-500">
					<div class="flex flex-row items-center gap-2">
						<ls.Calendar class="w-5 h-5 text-zinc-900 dark:text-white" />
						<h1 class="text-lg md:text-xl font-medium text-zinc-900 dark:text-white">{date}</h1>
					</div>
					
					<div class="hidden sm:flex flex-row items-center gap-2">
						<ls.Clock class="w-5 h-5 text-zinc-900 dark:text-white" />
						<div class="flex flex-row items-baseline">
							<h1 class="text-lg md:text-xl font-medium text-zinc-900 dark:text-white">{time}</h1>
							<h1 class="text-sm md:text-base font-medium text-zinc-500 dark:text-zinc-400">:{seconds}</h1>
						</div>
					</div>
				</div>
			</div>
			<div class="flex items-center gap-4 md:gap-5">
				<div class="flex items-center gap-3">
					<div class="w-9 h-9 rounded-full border-2 border-[#E5E7EB] dark:border-[#333333] overflow-hidden">
						<img src="/profile.jpg" alt="Profile" class="w-full h-full object-cover" id="profile-image"/>
					</div>
					<div class="hidden md:block">
						<p class="text-sm font-medium text-[#111827] dark:text-white">Alessandro</p>
						<p class="text-xs text-[#6B7280] dark:text-[#A0A0A0]">Tutor</p>
					</div>
				</div>
				<ThemeToggle />
				<form
					action="/auth/logout"
					method="POST"
					onsubmit={() => { isLoggingOut = true }}
				>
					<button
						type="submit"
						disabled={isLoggingOut}
						class="
							flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm group cursor-pointer transition-all duration-300
							bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 
							{isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}
						"
					>
						<span>{isLoggingOut ? 'Uscendo...' : 'Logout'}</span>
						{#if isLoggingOut}
							<ls.Loader class="w-4 h-4 animate-spin" />
						{:else}
							<ls.LogOut class="w-4 h-4" />
						{/if}
					</button>
				</form>
			</div>
		</header>

		<div class="flex">
			
			<Sidebar
				classes="md:hidden fixed top-16 bottom-0 left-0 bg-white dark:bg-[#121212] border-r border-[#E5E7EB] dark:border-[#2A2A2A] z-50"
				maxWidth="64"
				minWidth="16"
				type="move"
				isSidebarOpen={isMobileSidebarOpen}
			>
				<div class="p-6 space-y-1">
					<div class="flex items-center justify-between mb-2">
						<h2 class="text-base font-semibold">Menu</h2>
						<button class="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-[#F3F4F6] dark:hover:bg-[#1E1E1E]" onclick={() => (isMobileSidebarOpen = false)} aria-label="Chiudi menu">
							<ls.X class="w-5 h-5" />
						</button>
					</div>
					{#each tabs as tab}
						<a href={`/admin/${tab.name.toLowerCase()}`} class="
						flex items-center gap-3 font-medium transition-all duration-200 ease-in-out px-4 py-3 text-sm rounded-md
						{
							$page.url.pathname.split('/').pop().toLowerCase() === tab.name.toLowerCase()
								? 'text-[#15803D] bg-[#F0FDF4] dark:text-[#22C55E] dark:bg-[#1E1E1E] font-medium dark:shadow-glow'
								: 'text-[#6B7280] hover:text-[#374151] hover:bg-[#F9FAFB] dark:text-[#A0A0A0] dark:hover:text-white dark:hover:bg-[#1E1E1E]'
						}
						" onclick={() => (isMobileSidebarOpen = false)}>
							<tab.icon class="w-5 h-5" />
							<span>{tab.name}</span>
						</a>
					{/each}
				</div>
			</Sidebar>

			{#if isMobileSidebarOpen}
				
				<button
					type="button"
					class="md:hidden fixed inset-0 bg-black/40 z-40"
					onclick={() => (isMobileSidebarOpen = false)}
					aria-label="Chiudi menu"
				></button>
			{/if}

			
			<Sidebar classes="hidden md:flex fixed top-16 bottom-0 left-0 bg-white dark:bg-[#121212] border-r border-[#E5E7EB] dark:border-[#2A2A2A] w-[72px] lg:w-[240px]" useInlineWidth={false}>
				<div class="p-6 space-y-1">
					{#each tabs as tab}
						<a href={`/admin/${tab.name.toLowerCase()}`} class="
						flex items-center justify-center lg:justify-start gap-0 lg:gap-3 font-medium transition-all duration-200 ease-in-out px-0 lg:px-4 py-3 text-sm rounded-md
						{
							$page.url.pathname.split('/').pop().toLowerCase() === tab.name.toLowerCase()
								? 'text-[#15803D] bg-[#F0FDF4] dark:text-[#22C55E] dark:bg-[#1E1E1E] font-medium dark:shadow-glow'
								: 'text-[#6B7280] hover:text-[#374151] hover:bg-[#F9FAFB] dark:text-[#A0A0A0] dark:hover:text-white dark:hover:bg-[#1E1E1E]'
						}
						">
							<tab.icon class="w-5 h-5" />
							<span class="hidden lg:inline">{tab.name}</span>
						</a>
					{/each}
				</div>
			</Sidebar>

			<div class="ml-0 md:ml-[72px] lg:ml-[240px] px-4 md:p-6 dark:bg-[#0A0A0A] min-h-screen w-full pt-20 md:pt-24">
				{@render children()}
			</div>
		</div>
	</div>
</div>

<MessagePopupContainer />
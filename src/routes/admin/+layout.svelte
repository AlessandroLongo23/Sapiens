<script>
	import { designSystem } from '$lib/const/appearance.js';
	import { page } from '$app/stores';
	import * as ls from 'lucide-svelte';

	import MessagePopupContainer from '$lib/components/shared/ui/messagePopup/MessagePopupContainer.svelte';
	import LogoutButton from '$lib/components/shared/ui/buttons/LogoutButton.svelte';
	import ThemeToggle from '$lib/components/shared/ui/theme/ThemeToggle.svelte';
	import Sidebar from '$lib/components/shared/ui/sidebar/Sidebar.svelte';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';

	let { children, data } = $props();

	let isMobileSidebarOpen = $state(false);
	
	let title = $derived($page.url.pathname.split('/').pop().charAt(0).toUpperCase() + $page.url.pathname.split('/').pop().slice(1));

	let tabs = [
		{ name: 'Analytics', icon: ls.ChartArea },
		{ name: 'Calendario', icon: ls.Calendar },
		{ name: 'Studenti', icon: ls.Users },
		{ name: 'Argomenti', icon: ls.BookOpen }
	];

	$effect(() => {
		$page.url.pathname;
		isMobileSidebarOpen = false;
	});
</script>

<div class="min-h-screen bg-[#F9FAFB] dark:bg-[#0A0A0A] text-[#374151] dark:text-white p-0 font-sans">
	<div class="h-full">
		<AdminHeader bind:isMobileSidebarOpen />

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
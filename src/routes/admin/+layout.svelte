<script>
	import { goto } from '$app/navigation';
	import * as ls from 'lucide-svelte';
	import ThemeToggle from '$lib/components/theme/ThemeToggle.svelte';
	import MessagePopupContainer from '$lib/components/messagePopup/MessagePopupContainer.svelte';
	import Sidebar from '$lib/components/sidebar/Sidebar.svelte';
	import { designSystem } from '$lib/stores/appearance.js';

	import { page } from '$app/stores';

	let title = $derived($page.url.pathname.split('/').pop().charAt(0).toUpperCase() + $page.url.pathname.split('/').pop().slice(1));

	let { children, data } = $props();

	let tabs = [
		{ name: 'Analytics', icon: ls.ChartArea },
		{ name: 'Calendario', icon: ls.Calendar },
		{ name: 'Studenti', icon: ls.Users },
		{ name: 'Argomenti', icon: ls.BookOpen }
	];

	let date = $derived.by(() => {
		const date = new Date();
		const formattedTime = `${date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'long' })}`;
		return formattedTime;
	});

	let time = $derived.by(() => {
		const date = new Date();
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
		return formattedTime;
	});
</script>

<div class="min-h-screen bg-[#F9FAFB] dark:bg-[#0A0A0A] text-[#374151] dark:text-white p-0 font-sans">
	<div class="h-full">
		<header class="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-white dark:bg-[#121212] border-b border-[#E5E7EB] dark:border-[#2A2A2A] shadow-sm dark:shadow-md">
			<div class="flex flex-row items-center gap-4">
				<div class="flex flex-row items-center gap-2">
					<ls.Calendar class="w-5 h-5 text-[#111827] dark:text-white" />
					<h1 class="text-xl font-semibold text-[#111827] dark:text-white">{date}</h1>
				</div>

				<div class="flex flex-row items-center gap-2">
					<ls.Clock class="w-5 h-5 text-[#111827] dark:text-white" />
					<h1 class="text-xl font-semibold text-[#111827] dark:text-white">{time}</h1>
				</div>
			</div>
			<div class="flex items-center gap-5">
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
				>
					<button
						type="submit"
						class="bg-white dark:bg-[#1E1E1E] border hover:bg-[#F3F4F6] dark:hover:bg-[#2B2B2B] border-[#D1D5DB] dark:border-[#333333] text-[#EF4444] px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-200"
					>
						<span class="flex items-center justify-center gap-2">
							<ls.LogOut class="w-4 h-4" />
							<span>Logout</span>
						</span>
					</button>
				</form>
			</div>
		</header>

		<div class="flex">
			<Sidebar classes="fixed top-16 bottom-0 left-0 bg-white dark:bg-[#121212] border-r border-[#E5E7EB] dark:border-[#2A2A2A] w-[240px]">
				<div class="p-6 space-y-1">
					{#each tabs as tab}
						<a href={`/admin/${tab.name.toLowerCase()}`} class="
						flex items-center gap-3 font-medium transition-all duration-200 ease-in-out px-4 py-3 text-sm rounded-md
						{
							$page.url.pathname.split('/').pop().toLowerCase() === tab.name.toLowerCase()
								? 'text-[#15803D] bg-[#F0FDF4] dark:text-[#22C55E] dark:bg-[#1E1E1E] font-medium dark:shadow-glow'
								: 'text-[#6B7280] hover:text-[#374151] hover:bg-[#F9FAFB] dark:text-[#A0A0A0] dark:hover:text-white dark:hover:bg-[#1E1E1E]'
						}
						">
							<tab.icon class="w-5 h-5" />
							<span>{tab.name}</span>
						</a>
					{/each}
				</div>
			</Sidebar>

			<div class="ml-[240px] p-6 dark:bg-[#0A0A0A] min-h-screen w-full pt-24">
				<div class="p-6 bg-white dark:bg-[#121212] border border-[#E5E7EB] dark:border-[#2A2A2A] shadow-md dark:shadow-glow rounded-lg">
					{@render children()}
				</div>
			</div>
		</div>
	</div>
</div>

<MessagePopupContainer />
<script>
    import * as ls from 'lucide-svelte';
    import { page } from '$app/stores';

    import ThemeToggle from '$lib/components/shared/ui/theme/ThemeToggle.svelte';
    import LogoutButton from '$lib/components/shared/ui/buttons/LogoutButton.svelte';

    let {
        isMobileSidebarOpen = $bindable(false)
    } = $props();

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

	$effect(() => {
		$page.url.pathname;
		isMobileSidebarOpen = false;
	});
</script>

<header class="fixed flex flex-row top-0 left-0 right-0 z-50 px-4 md:px-6 py-3 md:py-4 bg-white dark:bg-[#121212] border-b border-[#E5E7EB] dark:border-[#2A2A2A] shadow-sm dark:shadow-md">
    <a href="/" class="flex-1/3 hidden sm:flex items-center gap-3">
        <img src="/icon.png" alt="logo" class="size-8 rounded-md" />
        <span class="font-semibold text-zinc-900 dark:text-zinc-100">Sapiens</span>
    </a>
    
    <div class="flex flex-1/3 justify-center flex-row items-center gap-3 md:gap-4 ">
        <button
            class="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border border-[#E5E7EB] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] text-[#111827] dark:text-white"
            onclick={() => (isMobileSidebarOpen = true)}
            aria-label="Apri menu"
        >
            <ls.Menu class="w-5 h-5" />
        </button>

        <div class="flex flex-row justify-center items-center gap-4 {timeHasLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-500">
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

    <div class="flex flex-1/3 justify-end items-center gap-4 md:gap-5">
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
        <LogoutButton />
    </div>
</header>
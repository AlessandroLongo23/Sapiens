<script lang="ts">
	import { contentTree, EducationalLevelMap } from '$lib/data/content-tree';
    import { goto } from '$app/navigation';
    import * as ls from 'lucide-svelte';

    import ThemeToggle from '$lib/components/shared/ui/theme/ThemeToggle.svelte';
	import Searchbar from '$lib/components/shared/ui/Searchbar.svelte';
	import SubjectMegaMenu from './SubjectMegaMenu.svelte';

    let { 
        session,
        isAuthModalOpen = $bindable(false),
    } = $props();

	const clickAccessButton = async () => {
		if (session) { 
			const redirectPath = session?.user?.user_metadata?.role === 'admin' ? '/admin/analytics' : '/student/materiale';
			await goto(redirectPath);
		} else { 
			isAuthModalOpen = true;
		} 
	}
    
	let hoveredLevel = $state<string | null>(null);
	let headerRef = $state<HTMLElement | null>(null);
	let headerHeight = $state(0);

	function handleSubjectMouseEnter(levelId: string) {
		hoveredLevel = levelId;
		if (headerRef) {
			headerHeight = headerRef.offsetHeight;
		}
	}

	let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

	function handleSubjectMouseLeave() {
		hoverTimeout = setTimeout(() => {
			hoveredLevel = null;
		}, 500);
	}

	function handleMenuMouseEnter() {
		if (hoverTimeout) {
			clearTimeout(hoverTimeout);
			hoverTimeout = null;
		}
	}

	function handleMenuMouseLeave() {
		hoveredLevel = null;
	}
</script>

<header 
	bind:this={headerRef}
	class="fixed top-0 left-0 right-0 z-30 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 transition-transform duration-300"
>
	<div class="w-full mx-auto flex items-center sm:justify-between justify-center p-4">
		<div class="flex justify-start items-center gap-16">
			<a href="/" class="justify-start hidden sm:flex items-center gap-3">
				<img src="/icon.png" alt="logo" class="size-10 rounded-md" />
				<span class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Sapiens</span>
			</a>

			<nav class="flex justify-center items-center gap-12">
				{#each contentTree as level}
					<div
						class="relative"
						role="button"
						tabindex="0"
						onmouseenter={() => {
							if (hoverTimeout) {
								clearTimeout(hoverTimeout);
								hoverTimeout = null;
							}
							handleSubjectMouseEnter(level.id);
						}}
						onmouseleave={handleSubjectMouseLeave}
					>
						<a 
							href={`/${level.id}`} 
							class="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 hover:text-pink-500 dark:hover:text-pink-400 transition-colors duration-200 cursor-pointer"
						>
							<level.icon class="size-4" />
							<span class="font-medium">{EducationalLevelMap[level.id]}</span>
						</a>
					</div>
				{/each}
			</nav>
		</div>

		<div class="flex justify-end items-center gap-2 sm:gap-3">
			<Searchbar 
				placeholder="Cerca su Sapiens" 
				hasKeyboardShortcut={false}
				width='w-92'
			/>
			<ThemeToggle />
			<button
				onclick={clickAccessButton}
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
		</div>
    </div>
	
	<!-- Mega Menu -->
	{#if hoveredLevel}
		{@const level = contentTree.find(level => level.id === hoveredLevel)}
		{#if level}
			<div 
				class="mega-menu-container"
				role="menu"
				tabindex="-1"
				onmouseenter={handleMenuMouseEnter}
				onmouseleave={handleMenuMouseLeave}
			>
				<SubjectMegaMenu
					isOpen={true}
					level={level}
					headerHeight={headerHeight}
					onClose={handleMenuMouseLeave}
				/>
			</div>
		{/if}
	{/if}
</header>
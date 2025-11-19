<script lang="ts">
	import { contentTree, EducationalLevelMap, type LevelNode } from '$lib/data/content-tree';
	import { sendSearch, GLOBAL_SEARCH_KEY, HEADER_SEARCH_HEIGHT } from '$lib/animations/search-transition';
	import { searchStore } from '$lib/components/ui/search';
	import { page } from '$app/state';

    import ThemeToggle from '$lib/components/ui/theme/ThemeToggle.svelte';
	import Searchbar from '$lib/components/ui/Searchbar.svelte';
	import SubjectMegaMenu from '$lib/components/landing/SubjectMegaMenu.svelte';
	import LoginButton from '$lib/components/ui/buttons/LoginButton.svelte';

    let { 
		headerRef = $bindable(undefined),
        session,
        isAuthModalOpen = $bindable(false),
    } = $props();
    
	let hoveredLevel = $state<LevelNode | null>(null);
	let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

	function handleSubjectMouseEnter(level: LevelNode): void {
		hoveredLevel = level;
	}

	function handleMenuMouseLeave(): void {
		hoveredLevel = null;
	}

	let isRoot = $derived(page.url.pathname === '/');
</script>

<header 
	role="menu"
	tabindex="-1"
	onmouseleave={handleMenuMouseLeave}
	class="z-30 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 transition-transform duration-300"
>
	{#if hoveredLevel}
		<div 
			class="absolute left-0 right-0 z-10"
			style="top: {headerRef.offsetHeight || 0}px;"
		>
			<SubjectMegaMenu
				bind:level={hoveredLevel}
				columnsCount={5}
				topicsPerChapter={4}
			/>
		</div>
	{/if}

	<div 
		bind:this={headerRef}
		class="relative w-full mx-auto flex items-center sm:justify-between justify-center p-3 z-20 bg-white dark:bg-zinc-900"
	>
		<div class="flex justify-start items-center gap-16">
			<a href="/" class="justify-start hidden sm:flex items-center gap-3">
				<img src="/icon.png" alt="logo" class="size-10 rounded-md" />
				<span class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Sapiens</span>
			</a>

			{#if !isRoot}
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
							handleSubjectMouseEnter(level);
						}}
					>
						<a 
							href={`/content/${level.id}`} 
							onclick={handleMenuMouseLeave}
							class="
								flex items-center gap-2 transition-colors duration-200 cursor-pointer relative
								{hoveredLevel?.id === level.id ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400'}
							"
						>
							<level.icon class="size-4" />
							<span class="font-medium">{EducationalLevelMap[level.id]}</span>
							<span class="absolute -bottom-2 left-1/2 -translate-x-1/2 h-0.5 bg-rose-500 rounded-full transition-all duration-200 {hoveredLevel?.id === level.id ? 'opacity-100 w-full' : 'opacity-0 w-0'}"></span>
						</a>
					</div>
					{/each}
				</nav>
			{/if}
		</div>

		<div class="flex items-center justify-end gap-2 sm:gap-3 flex-1 sm:flex-none">
			<div 
				class="w-full sm:w-80 lg:w-96 shrink-0"
				style={`height: ${HEADER_SEARCH_HEIGHT}px;`}
			>
				{#if !$searchStore?.isActive}
					<div class="h-full" out:sendSearch={{ key: GLOBAL_SEARCH_KEY }}>
						<Searchbar 
							placeholder="Cerca su Sapiens" 
							hasKeyboardShortcut={false}
							width="w-full"
							size="md"
						/>
					</div>
				{:else}
					<div 
						class="h-full w-full rounded-lg border border-transparent" 
						aria-hidden="true"
					></div>
				{/if}
			</div>
			<ThemeToggle />
			<LoginButton 
				bind:session
				bind:isAuthModalOpen
			/>
		</div>
    </div>
</header>
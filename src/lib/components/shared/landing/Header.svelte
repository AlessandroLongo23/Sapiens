<script lang="ts">
	import { contentTree, EducationalLevelMap, type LevelNode } from '$lib/data/content-tree';

    import ThemeToggle from '$lib/components/shared/ui/theme/ThemeToggle.svelte';
	import Searchbar from '$lib/components/shared/ui/Searchbar.svelte';
	import SubjectMegaMenu from './SubjectMegaMenu.svelte';
	import LoginButton from '$lib/components/shared/ui/buttons/LoginButton.svelte';

    let { 
        session,
        isAuthModalOpen = $bindable(false),
    } = $props();
    
	let hoveredLevel = $state<LevelNode | null>(null);
	let headerRef = $state<HTMLElement | null>(null);
	let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

	function handleSubjectMouseEnter(level: LevelNode): void {
		hoveredLevel = level;
	}

	function handleMenuMouseLeave(): void {
		hoveredLevel = null;
	}
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
							href={`/${level.id}`} 
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
		</div>

		<div class="flex justify-end items-center gap-2 sm:gap-3">
			<Searchbar 
				placeholder="Cerca su Sapiens" 
				hasKeyboardShortcut={false}
				width='w-92'
			/>
			<ThemeToggle />
			<LoginButton 
				bind:session
				bind:isAuthModalOpen
			/>
		</div>
    </div>
</header>
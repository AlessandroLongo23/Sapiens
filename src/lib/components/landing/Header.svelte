<script lang="ts">
	import { sendSearch, GLOBAL_SEARCH_KEY, HEADER_SEARCH_HEIGHT } from '$lib/animations/search-transition';
	import { searchStore } from '$lib/components/ui/search';
	import { page } from '$app/state';
	import { nodePath } from '$lib/seo/slug';
	import { authState } from '$lib/state/auth.svelte';
	import type { ContentNode } from '$lib/utils/tree';

	import ThemeToggle from '$lib/components/ui/theme/ThemeToggle.svelte';
	import Searchbar from '$lib/components/ui/Searchbar.svelte';
	import SubjectMegaMenu from '$lib/components/landing/SubjectMegaMenu.svelte';
	import LoginButton from '$lib/components/ui/buttons/LoginButton.svelte';
	import LogoutButton from '$lib/components/ui/buttons/LogoutButton.svelte';

	let {
		headerRef = $bindable(undefined)
	} = $props();

	// The content tree is loaded only by the /materiale routes; other pages ship none of it.
	let tree = $derived((page.data.tree ?? []) as ContentNode[]);

	let hoveredLevel = $state<ContentNode | null>(null);

	function handleMenuMouseLeave(): void {
		hoveredLevel = null;
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === 'Escape') hoveredLevel = null;
	}

	let isMegaMenuVisible = $derived(
		tree.length > 0 && (page.url.pathname.startsWith('/materiale') || page.url.pathname.startsWith('/admin'))
	);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<header
	onmouseleave={handleMenuMouseLeave}
	onkeydown={handleKeydown}
	class="z-30 bg-white dark:bg-zinc-900 border-b border-zinc-500/25 transition-transform duration-300"
>
	{#if hoveredLevel}
		<div
			class="absolute left-0 right-0 z-10"
			style="top: {headerRef?.offsetHeight || 0}px;"
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
			<a href="/" class="justify-start hidden sm:flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500">
				<img src="/favicon.svg" alt="" width="40" height="40" class="size-10 rounded-md" />
				<span class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Sapiens</span>
			</a>

			{#if isMegaMenuVisible}
				<nav aria-label="Livelli didattici">
					<ul class="flex justify-center items-center gap-12">
						{#each tree as level (level.id)}
							<li class="relative">
								<a
									href={nodePath([level])}
									onclick={handleMenuMouseLeave}
									onmouseenter={() => (hoveredLevel = level)}
									onfocus={() => (hoveredLevel = level)}
									aria-haspopup="true"
									aria-expanded={hoveredLevel?.id === level.id}
									class="
										flex items-center gap-2 transition-colors duration-200 cursor-pointer relative rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500
										{hoveredLevel?.id === level.id ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400'}
									"
								>
									<span class="font-medium">{level.title}</span>
									<span class="absolute -bottom-2 left-1/2 -translate-x-1/2 h-0.5 bg-crimson-500 rounded-full transition-all duration-200 {hoveredLevel?.id === level.id ? 'opacity-100 w-full' : 'opacity-0 w-0'}" aria-hidden="true"></span>
								</a>
							</li>
						{/each}
					</ul>
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
			<LoginButton />
			{#if authState.user}
				<LogoutButton />
			{/if}
		</div>
	</div>
</header>

<script lang="ts">
	import { sendSearch, GLOBAL_SEARCH_KEY, HEADER_SEARCH_HEIGHT } from '$lib/animations/search-transition';
	import { searchStore } from '$lib/components/ui/search';
	import { page } from '$app/state';
	import { nodePath } from '$lib/seo/slug';
	import { CONTENT_ROOT, TUTORING_ROOT } from '$lib/config/site';
	import { Menu, Search } from 'lucide-svelte';
	import { authState } from '$lib/state/auth.svelte';
	import type { ContentNode } from '$lib/utils/tree';

	import ThemeToggle from '$lib/components/ui/theme/ThemeToggle.svelte';
	import Searchbar from '$lib/components/ui/Searchbar.svelte';
	import SubjectMegaMenu from '$lib/components/landing/SubjectMegaMenu.svelte';
	import LoginButton from '$lib/components/ui/buttons/LoginButton.svelte';
	import LogoutButton from '$lib/components/ui/buttons/LogoutButton.svelte';
	import MobileMenu from '$lib/components/landing/MobileMenu.svelte';

	/**
	 * Site header. Below `md` it is a phone bar: logo, a search field that
	 * opens the overlay, and a menu button for everything else; the parent
	 * can slide it away while the page scrolls down (`hidden`). From `md`
	 * up it is the full desktop bar with the level menu and account buttons.
	 */
	let {
		headerRef = $bindable(undefined),
		/** Slide the bar out of view (phones only). */
		hidden = false,
		/** Lesson pages on phones: no site header at all, the lesson has its own. */
		immersive = false
	} = $props();

	// The content tree is loaded only by the /materiale routes; other pages ship none of it.
	let tree = $derived((page.data.tree ?? []) as ContentNode[]);

	let hoveredLevel = $state<ContentNode | null>(null);
	let menuOpen = $state(false);

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
	class="sticky top-0 z-30 bg-white dark:bg-zinc-900 border-b border-zinc-500/25 transition-transform duration-300 ease-out {hidden
		? 'max-md:-translate-y-full'
		: ''} {immersive ? 'max-md:hidden' : ''}"
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
		class="relative z-20 flex w-full items-center gap-2 px-3 py-2 md:justify-between md:gap-4 md:p-3 bg-white dark:bg-zinc-900"
	>
		<div class="flex min-w-0 items-center gap-2 md:gap-10">
			<a
				href="/"
				class="flex shrink-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500"
				aria-label="Sapiens, pagina iniziale"
			>
				<img src="/favicon.svg" alt="" width="40" height="40" class="size-10 rounded-md" />
				<span class="hidden md:inline text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Sapiens</span>
			</a>

			{#if isMegaMenuVisible}
				<nav aria-label="Livelli didattici" class="hidden lg:block">
					<ul class="flex justify-center items-center gap-8">
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

			<!-- Tablets have no room for the level menu: the short links stand in for it until `lg`. -->
			<nav aria-label="Sezioni" class="{isMegaMenuVisible ? 'hidden md:flex lg:hidden xl:flex' : 'hidden md:flex'} items-center gap-6 whitespace-nowrap">
				<a
					href={CONTENT_ROOT}
					class="{isMegaMenuVisible ? 'lg:hidden' : ''} font-medium transition-colors duration-200 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 {page.url.pathname.startsWith(CONTENT_ROOT) ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}"
				>
					Materiale
				</a>
				<a
					href={TUTORING_ROOT}
					aria-current={page.url.pathname.startsWith(TUTORING_ROOT) ? 'page' : undefined}
					class="font-medium transition-colors duration-200 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 {page.url.pathname.startsWith(TUTORING_ROOT) ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}"
				>
					Ripetizioni
				</a>
			</nav>
		</div>

		<div class="flex min-w-0 flex-1 items-center justify-end gap-2 md:flex-none md:gap-3">
			<div class="min-w-0 flex-1 md:flex-none md:w-64 lg:w-72 xl:w-96 h-[40px] md:h-auto" style="--search-h: {HEADER_SEARCH_HEIGHT}px;">
				{#if !$searchStore?.isActive}
					<div class="h-full md:h-[var(--search-h)]" out:sendSearch={{ key: GLOBAL_SEARCH_KEY }}>
						<!-- Phones: a field-shaped button; the real input is in the overlay, where it gets the keyboard. -->
						<button
							type="button"
							onclick={() => searchStore.activate()}
							class="md:hidden flex h-full w-full items-center gap-2 rounded-xl border border-zinc-500/25 bg-zinc-50 dark:bg-zinc-800 px-3 text-left text-base text-zinc-500 dark:text-zinc-400 active:bg-zinc-100 dark:active:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500"
							aria-label="Cerca su Sapiens"
						>
							<Search class="size-5 shrink-0" aria-hidden="true" />
							<span class="truncate">Cerca su Sapiens</span>
						</button>
						<div class="hidden md:block h-full">
							<Searchbar
								placeholder="Cerca su Sapiens"
								hasKeyboardShortcut={false}
								width="w-full"
								size="md"
							/>
						</div>
					</div>
				{:else}
					<div
						class="h-full w-full rounded-lg border border-transparent"
						aria-hidden="true"
					></div>
				{/if}
			</div>

			<div class="hidden md:flex items-center gap-3">
				<ThemeToggle />
				<LoginButton />
				{#if authState.user}
					<LogoutButton />
				{/if}
			</div>

			<button
				type="button"
				onclick={() => (menuOpen = true)}
				class="md:hidden flex size-[44px] shrink-0 items-center justify-center rounded-xl border border-zinc-500/25 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 active:bg-zinc-200 dark:active:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500"
				aria-label="Apri il menu"
				aria-haspopup="dialog"
				aria-expanded={menuOpen}
			>
				<Menu class="size-6" aria-hidden="true" />
			</button>
		</div>
	</div>
</header>

<MobileMenu bind:open={menuOpen} />

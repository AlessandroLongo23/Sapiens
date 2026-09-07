<script lang="ts">
	import { page } from '$app/state';
	import { House, LibraryBig, UsersRound, UserRound } from 'lucide-svelte';
	import { authState } from '$lib/state/auth.svelte';
	import { isStaff } from '$lib/auth/entitlements';
	import { CONTENT_ROOT, TUTORING_ROOT } from '$lib/config/site';

	/**
	 * The phone's primary navigation: four always-visible destinations in
	 * the thumb zone. Lesson pages replace it with their own section bar.
	 */
	let pathname = $derived(page.url.pathname);
	let accountUrl = $derived(isStaff(authState.user) ? '/admin' : '/subscription');
	let accountActive = $derived(
		['/subscription', '/admin', '/richieste', '/dashboard', '/leads', '/profile-editor', '/billing'].some((p) =>
			pathname.startsWith(p)
		)
	);

	const itemClass = (active: boolean) =>
		`flex h-full w-full flex-col items-center justify-center gap-1 text-[11px] font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-crimson-500 active:bg-zinc-100 dark:active:bg-zinc-800 ${
			active ? 'text-crimson-600 dark:text-crimson-400' : 'text-zinc-500 dark:text-zinc-400'
		}`;

	let tabs = $derived([
		{ href: '/', label: 'Home', icon: House, active: pathname === '/' },
		{ href: CONTENT_ROOT, label: 'Materiale', icon: LibraryBig, active: pathname.startsWith(CONTENT_ROOT) },
		{ href: TUTORING_ROOT, label: 'Ripetizioni', icon: UsersRound, active: pathname.startsWith(TUTORING_ROOT) }
	]);
</script>

<nav
	aria-label="Navigazione principale"
	class="md:hidden fixed inset-x-0 bottom-0 z-30 border-t border-zinc-500/20 bg-white dark:bg-zinc-900 pb-safe"
>
	<ul class="grid grid-cols-4 h-[var(--tabbar-h)]">
		{#each tabs as tab (tab.href)}
			{@const Icon = tab.icon}
			<li>
				<a href={tab.href} aria-current={tab.active ? 'page' : undefined} class={itemClass(tab.active)}>
					<Icon class="size-6" strokeWidth={tab.active ? 2.4 : 1.8} aria-hidden="true" />
					<span>{tab.label}</span>
				</a>
			</li>
		{/each}
		<li>
			{#if authState.user}
				<a href={accountUrl} aria-current={accountActive ? 'page' : undefined} class={itemClass(accountActive)}>
					<UserRound class="size-6" strokeWidth={accountActive ? 2.4 : 1.8} aria-hidden="true" />
					<span>Account</span>
				</a>
			{:else}
				<button type="button" onclick={() => authState.openModal()} class={itemClass(false)}>
					<UserRound class="size-6" strokeWidth={1.8} aria-hidden="true" />
					<span>Accedi</span>
				</button>
			{/if}
		</li>
	</ul>
</nav>

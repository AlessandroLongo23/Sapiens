<script lang="ts">
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import {
		House,
		LibraryBig,
		UsersRound,
		CreditCard,
		CircleHelp,
		Mail,
		LogIn,
		UserPlus,
		UserRound,
		ChevronRight
	} from 'lucide-svelte';
	import type { IconComponent } from '$lib/utils/icons';
	import { authState } from '$lib/state/auth.svelte';
	import { isStaff } from '$lib/auth/entitlements';
	import { CONTENT_ROOT, TUTORING_ROOT } from '$lib/config/site';
	import { nodePath } from '$lib/seo/slug';
	import type { ContentNode } from '$lib/utils/tree';

	import Sheet from '$lib/components/ui/Sheet.svelte';
	import ThemeToggle from '$lib/components/ui/theme/ThemeToggle.svelte';
	import LogoutButton from '$lib/components/ui/buttons/LogoutButton.svelte';

	/** The phone menu: every section of the site, the theme and the account, in one sheet. */
	let { open = $bindable(false) } = $props();

	// The content tree is loaded by the /materiale routes only; elsewhere the
	// menu links to the library without listing the levels.
	let tree = $derived((page.data.tree ?? []) as ContentNode[]);
	let pathname = $derived(page.url.pathname);
	let accountUrl = $derived(isStaff(authState.user) ? '/admin' : '/subscription');

	afterNavigate(() => (open = false));

	const close = () => (open = false);

	function login(register = false) {
		close();
		authState.openModal({ register });
	}

	const rowClass = (active: boolean) =>
		`flex min-h-[48px] items-center gap-3 rounded-xl px-3 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 ${
			active
				? 'bg-crimson-50 text-crimson-700 dark:bg-crimson-900/30 dark:text-crimson-200'
				: 'text-zinc-800 hover:bg-zinc-100 active:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:active:bg-zinc-800'
		}`;

	let links = $derived<{ href: string; label: string; icon: IconComponent; active: boolean }[]>([
		{ href: '/', label: 'Home', icon: House, active: pathname === '/' },
		{ href: CONTENT_ROOT, label: 'Materiale didattico', icon: LibraryBig, active: pathname.startsWith(CONTENT_ROOT) },
		{ href: TUTORING_ROOT, label: 'Ripetizioni', icon: UsersRound, active: pathname.startsWith(TUTORING_ROOT) },
		{ href: '/pricing', label: 'Prezzi e abbonamenti', icon: CreditCard, active: pathname.startsWith('/pricing') },
		{ href: '/faq', label: 'Domande frequenti', icon: CircleHelp, active: pathname === '/faq' },
		{ href: '/contacts', label: 'Contatti', icon: Mail, active: pathname === '/contacts' }
	]);
</script>

<Sheet {open} onClose={close} title="Menu" bodyClass="px-3 pb-3">
	<nav aria-label="Menu" class="flex flex-col gap-0.5">
		{#each links as link (link.href)}
			{@const Icon = link.icon}
			<a href={link.href} aria-current={link.active ? 'page' : undefined} class={rowClass(link.active)}>
				<Icon class="size-5 shrink-0" aria-hidden="true" />
				<span class="flex-1">{link.label}</span>
				<ChevronRight class="size-4 text-zinc-400" aria-hidden="true" />
			</a>
			{#if link.href === CONTENT_ROOT && tree.length > 0}
				<ul class="ml-8 mb-1 flex flex-col border-l border-zinc-500/20 pl-2" aria-label="Livelli didattici">
					{#each tree as level (level.id)}
						{@const href = nodePath([level])}
						<li>
							<a
								{href}
								aria-current={pathname.startsWith(href) ? 'page' : undefined}
								class="flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium {pathname.startsWith(href)
									? 'text-crimson-700 dark:text-crimson-300'
									: 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'}"
							>
								{level.title}
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		{/each}
	</nav>

	<div class="my-3 border-t border-zinc-500/20"></div>

	<div class="flex min-h-[48px] items-center justify-between gap-3 px-3">
		<span class="text-base font-medium text-zinc-800 dark:text-zinc-100">Tema chiaro o scuro</span>
		<ThemeToggle />
	</div>

	<div class="my-3 border-t border-zinc-500/20"></div>

	{#if authState.user}
		<div class="flex flex-col gap-2 px-1">
			<a href={accountUrl} class={rowClass(pathname.startsWith(accountUrl))}>
				<UserRound class="size-5 shrink-0" aria-hidden="true" />
				<span class="flex-1">{isStaff(authState.user) ? 'Dashboard' : 'Il tuo account'}</span>
				<ChevronRight class="size-4 text-zinc-400" aria-hidden="true" />
			</a>
			{#if !isStaff(authState.user)}
				<a href="/richieste" class={rowClass(pathname.startsWith('/richieste'))}>
					<Mail class="size-5 shrink-0" aria-hidden="true" />
					<span class="flex-1">Le tue richieste ai tutor</span>
					<ChevronRight class="size-4 text-zinc-400" aria-hidden="true" />
				</a>
			{/if}
			<div class="px-2 pt-1 [&>button]:w-full [&>button]:min-h-[48px]">
				<LogoutButton />
			</div>
		</div>
	{:else}
		<div class="grid grid-cols-2 gap-2 px-1">
			<button
				type="button"
				onclick={() => login(false)}
				class="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-zinc-500/25 bg-zinc-100 dark:bg-zinc-800 text-base font-semibold text-zinc-800 dark:text-zinc-100 active:bg-zinc-200 dark:active:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500"
			>
				<LogIn class="size-5" aria-hidden="true" />
				Accedi
			</button>
			<button
				type="button"
				onclick={() => login(true)}
				class="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-crimson-600 text-base font-semibold text-white active:bg-crimson-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
			>
				<UserPlus class="size-5" aria-hidden="true" />
				Registrati
			</button>
		</div>
	{/if}
</Sheet>

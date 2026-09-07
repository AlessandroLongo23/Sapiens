<script lang="ts">
	import { page } from '$app/state';
	import { LayoutDashboard, Inbox, UserPen, ExternalLink } from 'lucide-svelte';
	import { TUTORING_ROOT } from '$lib/config/site';

	let { data, children } = $props();
	let tutor = $derived(data.tutor);

	let links = $derived(
		tutor
			? [
					{ href: '/dashboard', label: 'Riepilogo', icon: LayoutDashboard },
					{ href: '/leads', label: 'Richieste', icon: Inbox },
					{ href: '/profile-editor', label: 'Profilo', icon: UserPen }
				]
			: [{ href: '/profile-editor', label: 'Crea il profilo', icon: UserPen }]
	);
</script>

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">
	<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="flex flex-wrap items-center justify-between gap-4 mb-8">
			<div>
				<p class="text-sm font-medium text-crimson-600 dark:text-crimson-400">Area tutor</p>
				{#if tutor?.status === 'published'}
					<a href="{TUTORING_ROOT}/{tutor.slug}" class="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-crimson-600 dark:hover:text-crimson-400 transition-colors">
						Il tuo profilo pubblico
						<ExternalLink class="size-3.5" aria-hidden="true" />
					</a>
				{/if}
			</div>
			<nav aria-label="Area tutor" class="flex gap-1 rounded-xl border border-zinc-500/25 bg-white dark:bg-zinc-950 p-1">
				{#each links as link (link.href)}
					{@const Icon = link.icon}
					{@const active = page.url.pathname === link.href}
					<a
						href={link.href}
						aria-current={active ? 'page' : undefined}
						class="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors {active
							? 'bg-crimson-600 text-white'
							: 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}"
					>
						<Icon class="size-4" aria-hidden="true" />
						{link.label}
					</a>
				{/each}
			</nav>
		</div>

		{@render children()}
	</div>
</div>

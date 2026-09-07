<script lang="ts">
	import { PenLine, LibraryBig, UsersRound, ArrowRight } from 'lucide-svelte';
	import Seo from '$lib/components/seo/Seo.svelte';

	const sections = [
		{ href: '/admin/tutors', title: 'Tutor', text: 'Profili in revisione, pubblicazione, verifica.', icon: UsersRound },
		{ href: '/admin/wiki', title: 'Wiki', text: 'Livelli, materie, capitoli e lezioni.', icon: LibraryBig },
		{ href: '/admin/desk', title: 'Desk', text: 'Bozze di lezione generate.', icon: PenLine }
	];
</script>

<Seo title="Admin | Sapiens" path="/admin" noindex />

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Amministrazione</h1>
	<ul class="grid sm:grid-cols-3 gap-4">
		{#each sections as s (s.href)}
			{@const Icon = s.icon}
			<li>
				<a href={s.href} class="group block h-full rounded-2xl border border-zinc-500/25 bg-white dark:bg-zinc-950 p-5 hover:border-crimson-300 dark:hover:border-crimson-800 transition-colors">
					<Icon class="size-6 text-crimson-500 mb-3" aria-hidden="true" />
					<h2 class="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">{s.title} <ArrowRight class="size-4 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" /></h2>
					<p class="text-sm text-zinc-600 dark:text-zinc-400">{s.text}</p>
				</a>
			</li>
		{/each}
	</ul>
</div>

<script lang="ts">
	import { page } from '$app/state';
	import { SearchX, Home, LibraryBig } from 'lucide-svelte';
	import { SITE_NAME, CONTENT_ROOT } from '$lib/config/site';

	import Seo from '$lib/components/seo/Seo.svelte';

	let notFound = $derived(page.status === 404);
	let title = $derived(notFound ? `Pagina non trovata | ${SITE_NAME}` : `Errore ${page.status} | ${SITE_NAME}`);
</script>

<Seo
	{title}
	description={notFound ? 'La pagina che cerchi non esiste o è stata spostata.' : 'Si è verificato un errore.'}
	noindex
/>

<section class="min-h-[60vh] flex items-center justify-center px-4 py-16">
	<div class="max-w-md w-full text-center">
		<div class="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 ring-1 ring-zinc-500/25">
			<SearchX class="size-10 text-zinc-400 dark:text-zinc-600" aria-hidden="true" />
		</div>

		<h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
			{#if notFound}
				Pagina non trovata
			{:else}
				Qualcosa è andato storto
			{/if}
		</h1>

		<p class="text-zinc-600 dark:text-zinc-400 mb-8">
			{#if notFound}
				L'indirizzo che hai aperto non corrisponde a nessuna pagina. Il materiale potrebbe essere stato spostato.
			{:else}
				{page.error?.message ?? 'Riprova tra qualche istante.'}
			{/if}
		</p>

		<div class="flex flex-col sm:flex-row gap-3 justify-center">
			<a
				href={CONTENT_ROOT}
				class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-crimson-600 hover:bg-crimson-700 text-white font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 focus-visible:ring-offset-2"
			>
				<LibraryBig class="size-4" aria-hidden="true" />
				Materiale didattico
			</a>
			<a
				href="/"
				class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-500/25 text-zinc-900 dark:text-zinc-100 font-medium hover:border-zinc-500/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500"
			>
				<Home class="size-4" aria-hidden="true" />
				Torna alla home
			</a>
		</div>
	</div>
</section>

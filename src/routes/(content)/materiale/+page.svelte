<script lang="ts">
	import { Home, BookOpen, LibraryBig, Layers, FileText } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { CONTENT_ROOT, SITE_NAME } from '$lib/config/site';
	import { nodePath } from '$lib/seo/slug';

	import Seo from '$lib/components/seo/Seo.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import NodeCard from '$lib/components/ui/cards/NodeCard.svelte';

	let { data } = $props();
	let { tree, counts } = $derived(data);

	let breadcrumbItems = $derived([
		{ label: 'Home', path: '/', icon: Home },
		{ label: 'Materiale didattico', path: CONTENT_ROOT, icon: LibraryBig }
	]);

	let description = $derived(
		`Materiale didattico gratuito per scuola media, scuola superiore e università: ${counts.subject} materie, ${counts.chapter} capitoli e ${counts.topic} lezioni con teoria, formulari ed esercizi.`
	);
</script>

<Seo
	title="Materiale didattico: medie, superiori, università | {SITE_NAME}"
	{description}
	path={CONTENT_ROOT}
/>

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
	<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
		<header class="mb-12" in:fade={{ duration: 300 }}>
			<Breadcrumb items={breadcrumbItems} />

			<div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
				<div class="flex items-start gap-6">
					<div class="hidden sm:flex items-center justify-center size-32 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-500/25 text-crimson-500 dark:text-crimson-400">
						<LibraryBig class="size-16" aria-hidden="true" />
					</div>

					<div class="flex-1 space-y-4">
						<div class="space-y-2">
							<div class="flex items-center gap-3">
								<LibraryBig class="w-8 h-8 text-crimson-500 dark:text-crimson-400 sm:hidden" aria-hidden="true" />
								<h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
									Materiale didattico
								</h1>
							</div>
							<p class="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
								Teoria, formulari ed esercizi organizzati per livello scolastico, materia e capitolo.
								Scegli il tuo livello per iniziare.
							</p>
						</div>

						<div class="flex flex-wrap gap-3">
							<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-500/25 text-sm text-zinc-700 dark:text-zinc-300 backdrop-blur-sm">
								<BookOpen class="w-4 h-4 text-rose-500" aria-hidden="true" />
								<span class="font-medium">{counts.subject} Materie</span>
							</div>
							<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-500/25 text-sm text-zinc-700 dark:text-zinc-300 backdrop-blur-sm">
								<Layers class="w-4 h-4 text-teal-500" aria-hidden="true" />
								<span class="font-medium">{counts.chapter} Capitoli</span>
							</div>
							<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-500/25 text-sm text-zinc-700 dark:text-zinc-300 backdrop-blur-sm">
								<FileText class="w-4 h-4 text-indigo-500" aria-hidden="true" />
								<span class="font-medium">{counts.topic} Lezioni</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>

		{#if tree.length > 0}
			<section class="space-y-6" in:fade={{ duration: 400, delay: 100 }} aria-labelledby="livelli-heading">
				<div class="flex items-center justify-between border-b border-zinc-500/25 pb-4">
					<h2 id="livelli-heading" class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
						<BookOpen class="w-5 h-5 text-crimson-500" aria-hidden="true" />
						Livelli didattici disponibili
					</h2>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each tree as node, index (node.id)}
						<div in:fly={{ y: 20, duration: 400, delay: index * 50 }} class="h-full">
							<NodeCard {node} href={nodePath([node])} />
						</div>
					{/each}
				</div>
			</section>
		{/if}
	</div>
</div>

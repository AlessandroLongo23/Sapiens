<script lang="ts">
	import { Home, BookOpen, GraduationCap, Layers, FileText, LibraryBig } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { countByType, type NodeType } from '$lib/utils/tree';

	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import NodeCard from '$lib/components/ui/cards/NodeCard.svelte';

	let { data } = $props();
	let node = $derived(data.node);
	let pathSegments = $derived(data.pathSegments);

	let isLoading = $derived(!node);

	// Build breadcrumb paths from accumulated slugs
	let breadcrumbItems = $derived.by(() => {
		if (!node) return [];
		const items = [
			{ label: 'Home', path: '/', icon: Home },
			{ label: 'Materiale didattico', path: '/wiki', icon: LibraryBig }
		];
		pathSegments.forEach((segment, i) => {
			const slugPath = pathSegments.slice(0, i + 1).map(s => s.slug).join('/');
			items.push({ label: segment.title, path: `/wiki/${slugPath}`, icon: segment.icon });
		});
		return items;
	});

	// Count children by type for stats display
	let stats = $derived.by(() => {
		if (!node?.children) return null;
		return countByType(node.children);
	});

	// Labels for each stat type based on current node type
	const statConfig: Record<NodeType, { key: keyof typeof stats; label: string; icon: typeof BookOpen; color: string }[]> = {
		level: [
			{ key: 'subject', label: 'Materie', icon: BookOpen, color: 'text-rose-500' },
			{ key: 'chapter', label: 'Capitoli', icon: Layers, color: 'text-teal-500' },
			{ key: 'topic', label: 'Lezioni', icon: FileText, color: 'text-indigo-500' }
		],
		subject: [
			{ key: 'chapter', label: 'Capitoli', icon: Layers, color: 'text-teal-500' },
			{ key: 'topic', label: 'Lezioni', icon: FileText, color: 'text-indigo-500' }
		],
		chapter: [
			{ key: 'topic', label: 'Lezioni', icon: FileText, color: 'text-indigo-500' }
		],
		topic: []
	};

	let visibleStats = $derived(node ? statConfig[node.type as NodeType] ?? [] : []);

	function getChildPath(child) {
		return `/wiki/${[...pathSegments, child].map(s => s.slug).join('/')}`;
	}
</script>

<svelte:head>
	<title>
		{node?.name || 'Nodo'} - Sapiens
	</title>
	<meta
		name="description"
		content="Esplora i contenuti didattici per {node?.title || 'questo nodo'}. Trova teoria, esercizi e risorse per tutte le materie disponibili."
	/>
</svelte:head>

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
	<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
		{#if isLoading}
			<div class="flex justify-center items-center h-96">
				<div
					class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"
				></div>
			</div>
		{:else if node && node.type !== 'topic'}
			<header class="mb-12" in:fade={{ duration: 300 }}>
				<Breadcrumb items={breadcrumbItems} />

				<div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
					<div class="flex items-start gap-6">
						{#if node.icon}
							{@const NodeIcon = node.icon}
							<div class="hidden sm:flex items-center justify-center size-32 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-500/25 text-rose-500 dark:text-rose-400">
								<NodeIcon class="size-16" />
							</div>
						{/if}

						<div class="flex-1 space-y-4">
							<div class="space-y-2">
								<div class="flex items-center gap-3">
									{#if node.icon}
										{@const NodeIcon = node.icon}
										<NodeIcon class="w-8 h-8 text-rose-500 dark:text-rose-400 sm:hidden" />
									{/if}
									<h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
										{node.name}
									</h1>
								</div>
								<p class="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
									Esplora i contenuti didattici disponibili per questo livello. Trova teoria,
									esercizi e risorse per tutte le materie.
								</p>
							</div>

							{#if stats && visibleStats.length > 0}
								<div class="flex flex-wrap gap-3">
									{#each visibleStats as { key, label, icon: Icon, color }}
										{@const count = stats[key]}
										{#if count > 0}
											<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-500/25 text-sm text-zinc-700 dark:text-zinc-300 backdrop-blur-sm">
												<Icon class="w-4 h-4 {color}" />
												<span class="font-medium">{count}</span> {label}
											</div>
										{/if}
									{/each}
								</div>
							{/if}
						</div>
					</div>
				</div>
			</header>

			{#if node.children.length > 0}
				<section class="space-y-6" in:fade={{ duration: 400, delay: 100 }}>
					<div class="flex items-center justify-between border-b border-zinc-500/25 pb-4">
						<h2 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
							{#if node.type === 'level'}
								<BookOpen class="w-5 h-5 text-rose-500" />
								Materie disponibili
							{:else if node.type === 'subject'}
								<Layers class="w-5 h-5 text-teal-500" />
								Capitoli disponibili
							{:else if node.type === 'chapter'}
								<FileText class="w-5 h-5 text-indigo-500" />
								Lezioni disponibili
							{/if}
						</h2>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{#each node.children as child, index (child.id)}
							<div in:fly={{ y: 20, duration: 400, delay: index * 50 }} class="h-full">
								<NodeCard node={child} href={getChildPath(child)} />
							</div>
						{/each}
					</div>
				</section>
			{:else}
				<div class="flex flex-col items-center justify-center py-24 text-center" in:fade={{ duration: 300 }}>
					<div class="p-6 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-6 ring-1 ring-zinc-500/25">
						<BookOpen class="w-12 h-12 text-zinc-400 dark:text-zinc-600" />
					</div>
					<h3 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
						Nessuna materia disponibile
					</h3>
					<p class="text-zinc-600 dark:text-zinc-400 max-w-md mb-8">
						Al momento non ci sono materie disponibili per questo livello. Torna presto per
						nuovi contenuti!
					</p>
				</div>
			{/if}
		{:else}
			<div class="flex flex-col items-center justify-center py-24 text-center" in:fade={{ duration: 300 }}>
				<div class="p-6 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-6 ring-1 ring-zinc-500/25">
					<GraduationCap class="w-12 h-12 text-zinc-400 dark:text-zinc-600" />
				</div>
				<h3 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
					Livello non trovato
				</h3>
				<p class="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md">
					Il livello che stai cercando non esiste o non è disponibile.
				</p>
				<button
					onclick={() => goto('/wiki')}
					class="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
				>
					Torna alla home
				</button>
			</div>
		{/if}
	</div>
</div>
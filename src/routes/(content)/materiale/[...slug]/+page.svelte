<script lang="ts">
	import { Home, BookOpen, Layers, FileText, LibraryBig } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { countByType, type NodeType } from '$lib/utils/tree';
	import { nodePath, plainTitle } from '$lib/seo/slug';
	import { iconFor } from '$lib/utils/icons';
	import { CONTENT_ROOT } from '$lib/config/site';
	import { courseJsonLd, learningResourceJsonLd, type JsonLd } from '$lib/seo/jsonld';
	import { subjectCopy } from '$lib/content/subject-copy';

	import Seo from '$lib/components/seo/Seo.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';
	import NodeCard from '$lib/components/ui/cards/NodeCard.svelte';
	import Latex from '$lib/components/ui/Latex.svelte';
	import SubjectGuide from '$lib/components/content/SubjectGuide.svelte';

	let { data } = $props();
	let { node, ancestors, path, parentLink, seo } = $derived(data);

	let NodeIcon = $derived(iconFor(node));

	let breadcrumbItems = $derived.by(() => {
		const items = [
			{ label: 'Home', path: '/', icon: Home },
			{ label: 'Materiale didattico', path: CONTENT_ROOT, icon: LibraryBig }
		];
		ancestors.forEach((segment, i) => {
			items.push({ label: segment.title, path: nodePath(ancestors.slice(0, i + 1)), icon: iconFor(segment) });
		});
		return items;
	});

	let stats = $derived(node.children ? countByType(node.children) : null);

	const statConfig: Record<NodeType, { key: NodeType; label: string; icon: typeof BookOpen; color: string }[]> = {
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

	let visibleStats = $derived(statConfig[node.type as NodeType] ?? []);

	let childrenHeading = $derived(
		node.type === 'level' ? 'Materie disponibili' : node.type === 'subject' ? 'Capitoli disponibili' : 'Lezioni disponibili'
	);

	let guide = $derived(node.type === 'subject' ? subjectCopy(ancestors[0]?.slug, node.slug) : null);

	let structuredData = $derived.by((): JsonLd | undefined => {
		switch (node.type) {
			case 'subject':
				return courseJsonLd(node, ancestors, seo.description);
			case 'chapter':
				return learningResourceJsonLd(node, ancestors, {
					description: seo.description,
					resourceType: 'Capitolo',
					free: true
				});
			default:
				return undefined;
		}
	});
</script>

<Seo title={seo.title} description={seo.description} {path} jsonLd={structuredData} />

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
	<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
		<header class="mb-12" in:fade={{ duration: 300 }}>
			<Breadcrumb items={breadcrumbItems} />

			<div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
				<div class="flex items-start gap-6">
					<div class="hidden sm:flex items-center justify-center size-32 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-500/25 text-rose-500 dark:text-rose-400">
						<NodeIcon class="size-16" aria-hidden="true" />
					</div>

					<div class="flex-1 space-y-4">
						<div class="space-y-2">
							<div class="flex items-center gap-3">
								<NodeIcon class="w-8 h-8 text-rose-500 dark:text-rose-400 sm:hidden" aria-hidden="true" />
								<h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
									<Latex content={node.title} />
								</h1>
							</div>
							{#if node.description}
								<p class="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
									{node.description}
								</p>
							{/if}
						</div>

						{#if stats && visibleStats.length > 0}
							<div class="flex flex-wrap gap-3">
								{#each visibleStats as { key, label, icon: Icon, color }}
									{@const count = stats[key]}
									{#if count > 0}
										<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-500/25 text-sm text-zinc-700 dark:text-zinc-300 backdrop-blur-sm">
											<Icon class="w-4 h-4 {color}" aria-hidden="true" />
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
			<section class="space-y-6" in:fade={{ duration: 400, delay: 100 }} aria-labelledby="children-heading">
				<div class="flex items-center justify-between border-b border-zinc-500/25 pb-4">
					<h2 id="children-heading" class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
						{#if node.type === 'level'}
							<BookOpen class="w-5 h-5 text-rose-500" aria-hidden="true" />
						{:else if node.type === 'subject'}
							<Layers class="w-5 h-5 text-teal-500" aria-hidden="true" />
						{:else}
							<FileText class="w-5 h-5 text-indigo-500" aria-hidden="true" />
						{/if}
						{childrenHeading}
					</h2>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each node.children as child, index (child.id)}
						<div in:fly={{ y: 20, duration: 400, delay: index * 50 }} class="h-full">
							<NodeCard node={child} href={nodePath([...ancestors, child])} />
						</div>
					{/each}
				</div>
			</section>
		{:else}
			<div class="flex flex-col items-center justify-center py-24 text-center" in:fade={{ duration: 300 }}>
				<div class="p-6 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-6 ring-1 ring-zinc-500/25">
					<BookOpen class="w-12 h-12 text-zinc-500 dark:text-zinc-500" aria-hidden="true" />
				</div>
				<h2 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
					Contenuti in arrivo
				</h2>
				<p class="text-zinc-600 dark:text-zinc-400 max-w-md mb-8">
					Al momento non ci sono contenuti pubblicati per {plainTitle(node.title)}. Torna presto per
					nuovi contenuti, oppure esplora <a href={parentLink.url} class="text-crimson-600 dark:text-crimson-400 hover:underline">{plainTitle(parentLink.label)}</a>.
				</p>
			</div>
		{/if}

		{#if guide}
			<SubjectGuide {guide} subject={node} {ancestors} />
		{/if}
	</div>
</div>

<script lang="ts">
	import { Search, FolderTree, X, Plus } from 'lucide-svelte';
	import ContentTreeNode from './ContentTreeNode.svelte';
	import type { ContentNodeWithStatus } from '../../../routes/admin/desk/+page.server';

	interface Props {
		tree: ContentNodeWithStatus[];
		selectedId: string | null;
		onSelect: (node: ContentNodeWithStatus) => void;
		onRename?: (node: ContentNodeWithStatus) => void;
		onAddChild?: (node: ContentNodeWithStatus) => void;
		onDelete?: (node: ContentNodeWithStatus) => void;
		onAddRoot?: () => void;
	}

	let { 
		tree, 
		selectedId, 
		onSelect, 
		onRename,
		onAddChild,
		onDelete,
		onAddRoot
	}: Props = $props();

	let searchQuery = $state('');

	// Filter tree based on search
	function filterTree(nodes: ContentNodeWithStatus[], query: string): ContentNodeWithStatus[] {
		if (!query.trim()) return nodes;

		const lowerQuery = query.toLowerCase();

		function filterNode(node: ContentNodeWithStatus): ContentNodeWithStatus | null {
			// If this node matches, include it with all children
			if (node.title.toLowerCase().includes(lowerQuery)) {
				return node;
			}

			// If it has matching children, filter children recursively
			if (node.children?.length) {
				const filteredChildren = node.children
					.map(filterNode)
					.filter((n): n is ContentNodeWithStatus => n !== null);

				if (filteredChildren.length > 0) {
					return { ...node, children: filteredChildren };
				}
			}

			return null;
		}

		return nodes
			.map(filterNode)
			.filter((n): n is ContentNodeWithStatus => n !== null);
	}

	let filteredTree = $derived(filterTree(tree, searchQuery));
</script>

<div class="flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
	<!-- Header -->
	<div class="p-4 border-b border-zinc-200 dark:border-zinc-800">
		<div class="flex items-center justify-between mb-3">
			<div class="flex items-center gap-2">
				<FolderTree class="size-5 text-rose-500" />
				<h2 class="font-semibold text-zinc-900 dark:text-zinc-100">Contenuti</h2>
			</div>
			{#if onAddRoot}
				<button
					type="button"
					onclick={onAddRoot}
					class="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
					title="Aggiungi livello"
				>
					<Plus class="size-4" />
				</button>
			{/if}
		</div>

		<!-- Search -->
		<div class="relative">
			<Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Cerca topic..."
				class="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
			/>
			{#if searchQuery}
				<button
					type="button"
					onclick={() => searchQuery = ''}
					class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
				>
					<X class="size-3" />
				</button>
			{/if}
		</div>
	</div>

	<!-- Tree -->
	<div class="flex-1 overflow-y-auto p-2">
		{#if filteredTree.length > 0}
			{#each filteredTree as node (node.id)}
				<ContentTreeNode 
					{node} 
					{selectedId}
					{onSelect}
					{onRename}
					{onAddChild}
					{onDelete}
				/>
			{/each}
		{:else if searchQuery}
			<div class="flex flex-col items-center justify-center py-8 text-center">
				<Search class="size-8 text-zinc-300 dark:text-zinc-600 mb-2" />
				<p class="text-sm text-zinc-500">Nessun risultato per "{searchQuery}"</p>
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center py-8 text-center">
				<FolderTree class="size-8 text-zinc-300 dark:text-zinc-600 mb-2" />
				<p class="text-sm text-zinc-500">Nessun contenuto disponibile</p>
				{#if onAddRoot}
					<button
						type="button"
						onclick={onAddRoot}
						class="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
					>
						<Plus class="size-4" />
						Aggiungi livello
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>

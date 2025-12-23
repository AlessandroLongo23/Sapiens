<script lang="ts">
	import { Book, PenLine, Sigma, Zap, ChevronRight, GraduationCap, BookOpen, Layers, FileText } from 'lucide-svelte';
	import Latex from '$lib/components/ui/Latex.svelte';
	import ContentTreeNode from './ContentTreeNode.svelte';
	import TreeNodeMenu from './TreeNodeMenu.svelte';
	import type { ContentNodeWithStatus } from '../../../routes/admin/desk/+page.server';

	interface Props {
		node: ContentNodeWithStatus;
		selectedId: string | null;
		depth?: number;
		onSelect: (node: ContentNodeWithStatus) => void;
		onRename?: (node: ContentNodeWithStatus) => void;
		onAddChild?: (node: ContentNodeWithStatus) => void;
		onDelete?: (node: ContentNodeWithStatus) => void;
	}

	let { 
		node, 
		selectedId, 
		depth = 0, 
		onSelect, 
		onRename,
		onAddChild,
		onDelete
	}: Props = $props();

	let isExpanded = $state(false); // Collapsed by default
	let hasChildren = $derived(node.children && node.children.length > 0);
	let isSelected = $derived(selectedId === node.id);
	let isTopic = $derived(node.type === 'topic');
	let canHaveChildren = $derived(!isTopic); // Only non-topics can have children

	// Type icons
	const typeIcons = {
		level: GraduationCap,
		subject: BookOpen,
		chapter: Layers,
		topic: FileText
	};

	// Child type labels for context menu
	const childLabels: Record<string, string> = {
		level: 'materia',
		subject: 'capitolo',
		chapter: 'topic'
	};

	let TypeIcon = $derived(typeIcons[node.type] || FileText);
	let childLabel = $derived(childLabels[node.type] || 'elemento');

	function handleClick() {
		if (hasChildren || canHaveChildren) {
			isExpanded = !isExpanded;
		}
		onSelect(node);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleClick();
		}
	}

	// Status indicator classes
	const statusClass = (has: boolean) => has 
		? 'text-current opacity-100' 
		: 'text-zinc-300 dark:text-zinc-600 opacity-50';

	// Menu handlers
	function handleRename() {
		onRename?.(node);
	}

	function handleAddChild() {
		onAddChild?.(node);
		// Auto-expand when adding child
		isExpanded = true;
	}

	function handleDelete() {
		onDelete?.(node);
	}
</script>

<div class="select-none">
	<!-- Node Row -->
	<div
		class="relative flex items-center gap-1 pr-1 rounded-lg transition-all duration-150 group
			{isSelected 
				? 'bg-rose-500/10' 
				: 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}"
	>
		<button
			type="button"
			onclick={handleClick}
			onkeydown={handleKeydown}
			class="flex-1 flex items-center gap-2 px-2 py-1.5 text-left min-w-0
				{isSelected 
					? 'text-rose-600 dark:text-rose-400' 
					: 'text-zinc-700 dark:text-zinc-300'}"
			style="padding-left: {depth * 16 + 8}px"
		>
			<!-- Expand Arrow -->
			{#if canHaveChildren}
				<ChevronRight 
					class="size-3.5 shrink-0 transition-transform duration-200 text-zinc-400 {isExpanded ? 'rotate-90' : ''}" 
				/>
			{:else}
				<span class="size-3.5 shrink-0"></span>
			{/if}

			<!-- Type Icon -->
			<TypeIcon class="size-4 shrink-0 {isSelected ? 'text-rose-500' : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'}" />

			<!-- Title -->
			<span class="flex-1 text-sm font-medium truncate">
				<Latex content={node.title} />
			</span>

			<!-- Content Status Icons (only for topics) -->
			{#if isTopic}
				<div class="flex items-center gap-0.5 shrink-0">
					<div class="p-0.5" title="Teoria">
						<Book class="size-3 {statusClass(node.hasTheory)} text-blue-500" />
					</div>
					<div class="p-0.5" title="Esercizi">
						<PenLine class="size-3 {statusClass(node.hasExercises)} text-emerald-500" />
					</div>
					<div class="p-0.5" title="Formulario">
						<Sigma class="size-3 {statusClass(node.hasFormulary)} text-violet-500" />
					</div>
					<div class="p-0.5" title="Flashcards">
						<Zap class="size-3 {statusClass(node.hasFlashcards)} text-amber-500" />
					</div>
				</div>
			{/if}
		</button>

		<!-- Context Menu (only for non-topics) -->
		{#if canHaveChildren}
			<TreeNodeMenu 
				{childLabel}
				onRename={handleRename}
				onAddChild={handleAddChild}
				onDelete={handleDelete}
			/>
		{/if}
	</div>

	<!-- Children (recursive) -->
	{#if canHaveChildren && isExpanded}
		<div class="overflow-hidden">
			{#each node.children as child (child.id)}
				<ContentTreeNode 
					node={child} 
					{selectedId}
					depth={depth + 1} 
					{onSelect}
					{onRename}
					{onAddChild}
					{onDelete}
				/>
			{/each}
		</div>
	{/if}
</div>

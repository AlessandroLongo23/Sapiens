<script lang="ts">
	import { MoreVertical, Pencil, Plus, Trash2, X } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	interface Props {
		onRename: () => void;
		onAddChild: () => void;
		onDelete: () => void;
		childLabel?: string;
	}

	let { onRename, onAddChild, onDelete, childLabel = 'elemento' }: Props = $props();

	let isOpen = $state(false);
	let menuRef = $state<HTMLDivElement>();

	function toggleMenu(e: MouseEvent) {
		e.stopPropagation();
		isOpen = !isOpen;
	}

	function handleAction(action: () => void) {
		action();
		isOpen = false;
	}

	function handleClickOutside(e: MouseEvent) {
		if (menuRef && !menuRef.contains(e.target as Node)) {
			isOpen = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			isOpen = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<div class="relative" bind:this={menuRef}>
	<!-- Trigger Button -->
	<button
		type="button"
		onclick={toggleMenu}
		class="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-all duration-150 focus:opacity-100"
		title="Opzioni"
	>
		<MoreVertical class="size-3.5" />
	</button>

	<!-- Dropdown Menu -->
	{#if isOpen}
		<div 
			transition:fly={{ y: -5, duration: 150 }}
			class="absolute right-0 top-full mt-1 z-50 min-w-[160px] py-1.5 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-lg shadow-zinc-900/10"
		>
			<button
				type="button"
				onclick={() => handleAction(onRename)}
				class="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
			>
				<Pencil class="size-3.5 text-zinc-400" />
				Rinomina
			</button>
			
			<button
				type="button"
				onclick={() => handleAction(onAddChild)}
				class="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
			>
				<Plus class="size-3.5 text-zinc-400" />
				Aggiungi {childLabel}
			</button>
			
			<div class="my-1.5 border-t border-zinc-200 dark:border-zinc-700"></div>
			
			<button
				type="button"
				onclick={() => handleAction(onDelete)}
				class="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
			>
				<Trash2 class="size-3.5" />
				Elimina
			</button>
		</div>
	{/if}
</div>


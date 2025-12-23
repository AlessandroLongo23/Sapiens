<script lang="ts">
	import { X, AlertTriangle } from 'lucide-svelte';
	import { fly, fade } from 'svelte/transition';
	import FormButton from '$lib/components/ui/forms/FormButton.svelte';

	interface Props {
		isOpen: boolean;
		title: string;
		message: string;
		confirmLabel?: string;
		isLoading?: boolean;
		onConfirm: () => void;
		onCancel: () => void;
	}

	let { 
		isOpen, 
		title, 
		message,
		confirmLabel = 'Elimina',
		isLoading = false,
		onConfirm,
		onCancel
	}: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onCancel();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<!-- Backdrop -->
	<button 
		type="button"
		transition:fade={{ duration: 150 }}
		class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm cursor-default"
		onclick={onCancel}
		aria-label="Chiudi"
	></button>

	<!-- Modal -->
	<div 
		transition:fly={{ y: -20, duration: 200 }}
		class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm"
	>
		<div class="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-2xl">
			<!-- Header -->
			<div class="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
				<div class="flex items-center gap-3">
					<div class="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
						<AlertTriangle class="size-5" />
					</div>
					<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
						{title}
					</h2>
				</div>
				<button
					type="button"
					onclick={onCancel}
					class="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
				>
					<X class="size-5" />
				</button>
			</div>

			<!-- Body -->
			<div class="p-4">
				<p class="text-sm text-zinc-600 dark:text-zinc-400">
					{message}
				</p>

				<!-- Actions -->
				<div class="flex justify-end gap-3 pt-6">
					<FormButton
						variant="secondary"
						onclick={onCancel}
						disabled={isLoading}
					>
						Annulla
					</FormButton>
					<FormButton
						variant="danger"
						loading={isLoading}
						disabled={isLoading}
						onclick={onConfirm}
					>
						{confirmLabel}
					</FormButton>
				</div>
			</div>
		</div>
	</div>
{/if}


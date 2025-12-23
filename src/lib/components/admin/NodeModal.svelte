<script lang="ts">
	import { X } from 'lucide-svelte';
	import { fly, fade } from 'svelte/transition';
	import FormInput from '$lib/components/ui/forms/FormInput.svelte';
	import FormButton from '$lib/components/ui/forms/FormButton.svelte';

	interface Props {
		isOpen: boolean;
		title: string;
		label: string;
		value: string;
		placeholder?: string;
		confirmLabel?: string;
		confirmVariant?: 'primary' | 'danger';
		isLoading?: boolean;
		error?: string;
		onConfirm: (value: string) => void;
		onCancel: () => void;
	}

	let { 
		isOpen, 
		title, 
		label, 
		value = $bindable(''),
		placeholder = '',
		confirmLabel = 'Conferma',
		confirmVariant = 'primary',
		isLoading = false,
		error = '',
		onConfirm,
		onCancel
	}: Props = $props();

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (value.trim()) {
			onConfirm(value.trim());
		}
	}

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
		class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
	>
		<div class="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-2xl">
			<!-- Header -->
			<div class="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
				<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
					{title}
				</h2>
				<button
					type="button"
					onclick={onCancel}
					class="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
				>
					<X class="size-5" />
				</button>
			</div>

			<!-- Body -->
			<form onsubmit={handleSubmit} class="p-4 space-y-4">
				<FormInput
					bind:value
					{label}
					{placeholder}
					required={true}
					disabled={isLoading}
					{error}
				/>

				<!-- Actions -->
				<div class="flex justify-end gap-3 pt-2">
					<FormButton
						variant="secondary"
						onclick={onCancel}
						disabled={isLoading}
					>
						Annulla
					</FormButton>
					<FormButton
						variant={confirmVariant}
						loading={isLoading}
						disabled={isLoading || !value.trim()}
						onclick={() => handleSubmit(new Event('submit'))}
					>
						{confirmLabel}
					</FormButton>
				</div>
			</form>
		</div>
	</div>
{/if}


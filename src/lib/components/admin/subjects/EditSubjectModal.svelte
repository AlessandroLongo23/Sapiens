<script>
    import { messagePopup } from '$lib/components/shared/ui/messagePopup/messagePopup.js';
    import { subjectsStore } from '$lib/stores/subjects.js';

    import EditModal from '$lib/components/shared/ui/modals/EditModal.svelte';
    import ColorPicker from '$lib/components/shared/ui/ColorPicker.svelte';

    let {
        isOpen = $bindable(false),
        selectedSubject = $bindable(null),
    } = $props();

    let formData = $state({
        id: null,
        name: '',
        hex_color: ''
    });

	$effect(() => {
		if (selectedSubject) {
			formData = { ...selectedSubject };
		} else {
			formData = {
				id: null,
				name: '',
				hex_color: ''
			};
		}
	});

    let isSubmitting = $state(false);
    let errorMessage = $state('');

	async function handleSubmit(event) {
		event.preventDefault();
		isSubmitting = true;
		errorMessage = '';
		
		try {
			const { id, ...updates } = formData;
			await subjectsStore.updateSubject(id, updates);
			
			messagePopup.success('Materia aggiornata con successo!');
		} catch (error) {
			errorMessage = error.message || 'An unknown error occurred';
		} finally {
			isSubmitting = false;
			isOpen = false;
			selectedSubject = null;
		}
	}
</script>

<EditModal 
	bind:isOpen={isOpen} 
	onClose={() => isOpen = false}
	onSubmit={handleSubmit}
	title="Modifica Materia"
	subtitle="Gestione Materie"
	classes="max-w-xl bg-zinc-50 dark:bg-zinc-900 rounded-md"
>
	<form onsubmit={handleSubmit} class="p-4 space-y-4">
		<div class="flex flex-row gap-4 justify-between items-center">
			<div class="flex-1">
				<label for="name" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
					Nome Materia
				</label>
				<input 
					type="text" 
					id="name"
					bind:value={formData.name}
					class="w-full px-3 py-2 border border-zinc-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
					required
				/>
			</div>
			
			<div>
				<label for="color" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
					Colore Materia
				</label>
				<ColorPicker 
					selectedColor={formData.hex_color}
					onColorSelect={(e) => formData.hex_color = e.hex}
				/>
			</div>
		</div>
		
		{#if errorMessage}
			<div class="text-red-500 text-sm">{errorMessage}</div>
		{/if}
	</form>
</EditModal> 
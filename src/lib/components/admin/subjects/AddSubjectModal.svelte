<script>
    import { messagePopup } from '$lib/components/shared/ui/messagePopup/messagePopup.js';
    import { subjectsStore } from '$lib/stores/subjects.js';

    import AddModal from '$lib/components/shared/ui/modals/AddModal.svelte';
    import ColorPicker from '$lib/components/shared/ui/ColorPicker.svelte';

    let {
        isOpen = $bindable(false),
    } = $props();

    let formData = $state({
        name: '',
        hex_color: ''
    });
    let isLoading = $state(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.hex_color) {
            messagePopup.error('I campi Nome e Colore sono obbligatori');
            return;
        }

        isLoading = true;
        try {
            await subjectsStore.addSubject({
                name: formData.name,
                hex_color: formData.hex_color
            });

            messagePopup.success('Materia aggiunta con successo');
        } catch (error) {
            messagePopup.error('Errore durante la creazione della materia');
        } finally {
            isLoading = false;
            isOpen = false;
        }
    };
</script>

<AddModal 
	bind:isOpen={isOpen} 
	onClose={() => isOpen = false}
	onSubmit={handleSubmit}
	title="Aggiungi Materia"
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
	</form>
</AddModal>

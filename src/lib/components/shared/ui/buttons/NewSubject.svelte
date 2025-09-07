<script>
    import { messagePopup } from '$lib/components/shared/ui/messagePopup/messagePopup.js';
    import { subjectsStore } from '$lib/stores/subjects/subjects.js';
    import { addSubject } from '$lib/stores/subjects/subjects.svelte.js';
    import { themeStore } from '$lib/components/shared/ui/theme/theme.js';
    import { createEventDispatcher } from 'svelte';
    import * as ls from 'lucide-svelte';
    import { slide } from 'svelte/transition';

    import CustomSelect from '$lib/components/shared/ui/forms/CustomSelect.svelte';
    import ColorPicker from '$lib/components/shared/ui/ColorPicker.svelte';
    import AddModal from '$lib/components/shared/ui/modals/AddModal.svelte';
    import Modal from '$lib/components/shared/ui/modals/Modal.svelte';
    import PhoneNumber from '$lib/components/shared/ui/forms/PhoneNumber.svelte';
    import FormInput from '$lib/components/shared/ui/forms/FormInput.svelte';

    let isAddNewSubjectModalOpen = $state(false);
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
            const [data, error] = await addSubject({
                name: formData.name,
                hex_color: formData.hex_color
            });

            messagePopup.success('Materia aggiunta con successo');
        } catch (error) {
            messagePopup.error('Errore durante la creazione della materia: ' + error.message);
            console.error('Error creating subject:', error);
        } finally {
            isLoading = false;
            isAddNewSubjectModalOpen = false;
        }
    };
</script>

<button
    class="flex flex-row items-center whitespace-nowrap justify-center px-4 py-2 gap-2 text-sm font-medium transition-all duration-200 ease-in-out bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-lg border border-zinc-500/25"
    onclick={() => isAddNewSubjectModalOpen = true}
>
    <ls.Plus class="size-5"/>
    <span>Nuova Materia</span>
</button>

<AddModal 
	isOpen={isAddNewSubjectModalOpen} 
	onClose={() => isAddNewSubjectModalOpen = false}
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

<style>
    .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: rgb(161 161 170) transparent;
    }

    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgb(161 161 170);
        border-radius: 20px;
    }
</style>

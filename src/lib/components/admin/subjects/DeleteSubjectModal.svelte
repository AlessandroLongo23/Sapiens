<script>
    import { subjectsStore } from '$lib/stores/subjects/subjects.js';
    import { messagePopup } from '$lib/components/shared/ui/messagePopup/messagePopup.js';

    import DeleteModal from '$lib/components/shared/ui/modals/DeleteModal.svelte';

    let {
        isOpen = $bindable(false),
        selectedSubject = $bindable(null),
    } = $props();

    async function handleDeleteSubject() {
        if (!selectedSubject) return;

		try {
			await subjectsStore.deleteSubject(selectedSubject.id);
		} catch (error) {
            messagePopup.error("Errore durante l'eliminazione.");
		} finally {
            isOpen = false;
            selectedSubject = null;
            messagePopup.success('Materia eliminata con successo.');
		}
    }
</script>

<DeleteModal
    bind:isOpen={isOpen} 
    onConfirm={handleDeleteSubject}
    onCancel={() => isOpen = false}
    onClose={() => isOpen = false}
>
    <p>Sei sicuro di voler eliminare la materia <strong>{selectedSubject.name}</strong>?</p>
    <p class="text-sm text-zinc-500 dark:text-zinc-400">Questa azione è irreversibile.</p>
</DeleteModal>

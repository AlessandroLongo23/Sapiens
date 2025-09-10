<script>
    import { messagePopup } from '$lib/components/shared/ui/messagePopup/messagePopup.js';
    import { studentsStore } from '$lib/stores/students/students.js';

    import DeleteModal from '$lib/components/shared/ui/modals/DeleteModal.svelte';

    let {
        isOpen = $bindable(false),
        selectedStudent = $bindable(null),
    } = $props();

    async function handleDeleteStudent() {
        if (!selectedStudent) return;
        
        try {
            await studentsStore.deleteStudent(selectedStudent.id);
            messagePopup.success('Studente eliminato con successo.');
            selectedStudent = null;
            isOpen = false;
        } catch (error) {
            messagePopup.error("Errore durante l'eliminazione.");
        }
    }
</script>

<DeleteModal
    bind:isOpen={isOpen} 
    onConfirm={handleDeleteStudent}
    onCancel={() => isOpen = false}
    onClose={() => isOpen = false}
>
    <p>Sei sicuro di voler eliminare lo studente <strong>{selectedStudent.first_name} {selectedStudent.last_name}</strong>?</p>
    <p class="text-sm text-zinc-500 dark:text-zinc-400">Questa azione è irreversibile.</p>
</DeleteModal>


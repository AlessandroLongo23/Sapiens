<script>
    import { levels } from '$lib/models/students.svelte.js';
    import { studentsStore } from '$lib/stores/students.js';
    import { messagePopup } from '$lib/components/shared/ui/messagePopup/messagePopup.js';
    import * as ls from 'lucide-svelte';
    
    import EditModal from '$lib/components/shared/ui/modals/EditModal.svelte';
    import CustomSelect from '$lib/components/shared/ui/forms/CustomSelect.svelte';
    import PhoneNumber from '$lib/components/shared/ui/forms/PhoneNumber.svelte';

    let {
        isOpen = $bindable(false),
        editedStudent = $bindable({}),
        selectedStudent = $bindable(null),
    } = $props();

    async function handleUpdateStudent() {
        if (!selectedStudent) return;

        try {
            const studentToUpdateInStore = { ...selectedStudent, ...editedStudent };
            studentsStore.updateStudent(selectedStudent.id, studentToUpdateInStore);
        } catch (error) {
            messagePopup.error("Errore durante l'aggiornamento.");
        } finally {
            messagePopup.success('Studente aggiornato con successo!');
            isOpen = false;
            selectedStudent = null;
        }
    }
</script>

<EditModal 
    bind:isOpen={isOpen} 
    title="Modifica Studente" 
    subtitle="Aggiorna i dati dello studente" 
    onSubmit={handleUpdateStudent}
    onCancel={() => isOpen = false}
    onClose={() => isOpen = false}
    classes="max-w-2xl"
>
    <div class="flex flex-col gap-4">
        <div class="max-h-[60vh] pr-2 custom-scrollbar">
            <div class="flex flex-col gap-6">
                <div class="flex flex-row items-center gap-6 w-full">
                    <div class="flex flex-grow flex-col gap-2">
                        <div class="flex flex-row items-center gap-2">
                            <ls.User class="w-4 h-4" />
                            <label for="student-name" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Nome *
                            </label>
                        </div>
                        <input 
                            type="text" 
                            id="student-name" 
                            class="w-full p-2 rounded-lg border border-zinc-500/25 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                            bind:value={editedStudent.first_name}
                            required
                        />
                    </div>

                    <div class="flex flex-grow flex-col gap-2">
                        <div class="flex flex-row items-center gap-2">
                            <ls.User class="w-4 h-4" />
                            <label for="student-name" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Cognome *
                            </label>
                        </div>
                        <input 
                            type="text" 
                            id="student-name" 
                            class="w-full p-2 rounded-lg border border-zinc-500/25 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                            bind:value={editedStudent.last_name}
                            required
                        />
                    </div>
                </div>

                <div class="flex flex-row items-center gap-6 w-full">
                    <div class="flex flex-grow flex-col gap-2">
                        <div class="flex flex-row items-center gap-2">
                            <ls.Phone class="w-4 h-4" />
                            <label for="student-phone" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Telefono
                            </label>
                        </div>
                        <PhoneNumber
                            bind:prefixCode={editedStudent.phonePrefix}
                            bind:phoneNumber={editedStudent.phoneNumber}
                        />
                    </div>
                </div>

                <div class="flex flex-row items-center gap-6 w-full">
                    <div class="flex flex-grow flex-col gap-2">
                        <div class="flex flex-row items-center gap-2">
                            <ls.MapPin class="w-4 h-4" />
                            <label for="student-city" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Città
                            </label>
                        </div>
                        <input 
                            type="text" 
                            id="student-city" 
                            class="w-full p-2 rounded-lg border border-zinc-500/25 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                            bind:value={editedStudent.city}
                        />
                    </div>

                    <div class="flex flex-grow flex-col gap-2">
                        <div class="flex flex-row items-center gap-2">
                            <ls.GraduationCap class="w-4 h-4" />
                            <label for="student-level" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Livello scolastico
                            </label>
                        </div>
                        <CustomSelect
                            options={levels}
                            placeholder="Seleziona un livello"
                            labelKey='label'
                            valueKey='value'
                            bind:value={editedStudent.level}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</EditModal>

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
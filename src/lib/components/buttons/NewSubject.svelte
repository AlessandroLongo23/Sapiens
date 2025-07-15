<script>
    import { messagePopup } from '$lib/components/messagePopup/messagePopup.js';
    import { subjectsStore } from '$lib/stores/subjects/subjects.js';
    import { themeStore } from '$lib/components/theme/theme.js';
    import { createEventDispatcher } from 'svelte';
    import * as ls from 'lucide-svelte';
    import { slide } from 'svelte/transition';

    import CustomSelect from '$lib/components/forms/CustomSelect.svelte';
    import ColorPicker from '$lib/components/ui/ColorPicker.svelte';
    import AddModal from '$lib/components/modals/AddModal.svelte';
    import Modal from '$lib/components/modals/Modal.svelte';
    import PhoneNumber from '$lib/components/forms/PhoneNumber.svelte';
    import FormInput from '$lib/components/forms/FormInput.svelte';

    let isAddNewSubjectModalOpen = $state(false);
    let firstName = $state('');
    let lastName = $state('');
    let fullName = $derived(`${firstName} ${lastName}`);
    let email = $state('');
    let phone = $state('');
    let password = $state('');
    let city = $state('');
    let level = $state('');
    let isLoading = $state(false);

    let passwordValidation = $derived({
        hasMinLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!firstName || !lastName || !email || !password) {
            messagePopup.error('I campi Nome, Cognome, Email e Password sono obbligatori');
            return;
        }

        isLoading = true;
        try {
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    student: {
                        firstName,
                        lastName,
                        email,
                        password,
                        phone,
                        city,
                        level,
                    }
                })
            });

            const result = await response.json();
            if (!result.success) throw new Error(result.error);

            studentsStore.addStudent({
                id: result.user.id,
                first_name: firstName,
                last_name: lastName,
                role: 'student'
            });
            
            messagePopup.success('Studente aggiunto con successo');
            
            firstName = '';
            lastName = '';
            email = '';
            phone = '';
            password = '';
        } catch (error) {
            messagePopup.error('Errore durante la creazione dello studente: ' + error.message);
            console.error('Error creating student:', error);
        } finally {
            isLoading = false;
            isAddNewStudentModalOpen = false;
        }
    };

//     const handleAddStudentSubmit = async () => {
//         let student = {
//             full_name: studentName,
//             email: studentEmail,
//             color: studentColor
//         }
//         await addStudent(student);
//     }
// </script>

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
					onColorSelect={handleColorSelect}
				/>
			</div>
		</div>
		
		{#if errorMessage}
			<div class="text-red-500 text-sm">{errorMessage}</div>
		{/if}
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

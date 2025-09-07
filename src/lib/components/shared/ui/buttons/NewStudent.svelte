<script>
    import { messagePopup } from '$lib/components/shared/ui/messagePopup/messagePopup.js';
    import { studentsStore, levels } from '$lib/stores/students/students.js';
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

    let isAddNewStudentModalOpen = $state(false);
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
    onclick={() => isAddNewStudentModalOpen = true}
>
    <ls.UserPlus class="size-5"/>
    <span>Nuovo studente</span>
</button>

<AddModal 
    isOpen={isAddNewStudentModalOpen}
    title="Nuovo studente"
    subtitle="Aggiungi un nuovo studente"
    onClose={() => isAddNewStudentModalOpen = false}
    onSubmit={handleSubmit}
    classes="max-w-2xl"
>
    <div class="flex flex-col gap-4">
        <div class="max-h-[60vh] pr-2 custom-scrollbar">
            <div class="flex flex-col gap-6">
                <div class="flex flex-row items-center gap-6 w-full">
                    <div class="flex flex-grow flex-col gap-2">
                        <label class="text-sm text-zinc-900 dark:text-zinc-100" for="student-name">Nome *</label>
                        <input 
                            type="text" 
                            id="student-name" 
                            class="w-full p-2 rounded-lg border border-zinc-500/25 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                            bind:value={firstName}
                            required
                        />
                    </div>

                    <div class="flex flex-grow flex-col gap-2">
                        <label class="text-sm text-zinc-900 dark:text-zinc-100" for="student-name">Cognome *</label>
                        <input 
                            type="text" 
                            id="student-name" 
                            class="w-full p-2 rounded-lg border border-zinc-500/25 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                            bind:value={lastName}
                            required
                        />
                    </div>
                </div>

                <div class="flex flex-row items-center gap-6 w-full">
                    <div class="flex flex-grow flex-col gap-2">
                        <label class="text-sm text-zinc-900 dark:text-zinc-100" for="student-email">Email *</label>
                        <input 
                            type="email" 
                            id="student-email" 
                            class="w-full p-2 rounded-lg border border-zinc-500/25 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                            bind:value={email}
                            required
                        />
                    </div>

                    <div class="flex flex-grow flex-col gap-2">
                        <label class="text-sm text-zinc-900 dark:text-zinc-100" for="student-phone">Telefono</label>
                        <PhoneNumber
                            value={phone}
                            onChange={(value) => phone = value}
                        />
                    </div>
                </div>

                <div class="flex flex-row items-center gap-6 w-full">
                    <div class="flex flex-grow flex-col gap-2">
                        <label class="text-sm text-zinc-900 dark:text-zinc-100" for="student-city">Città</label>
                        <input 
                            type="text" 
                            id="student-city" 
                            class="w-full p-2 rounded-lg border border-zinc-500/25 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                            bind:value={city}
                        />
                    </div>

                    <div class="flex flex-grow flex-col gap-2">
                        <label class="text-sm text-zinc-900 dark:text-zinc-100" for="student-level">Livello scolastico</label>
                        <CustomSelect
                            options={levels}
                            bind:value={level}
                        />
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-sm text-zinc-900 dark:text-zinc-100" for="student-password">Password *</label>
                    <input 
                        type="password" 
                        id="student-password" 
                        class="w-full p-2 rounded-lg border border-zinc-500/25 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                        bind:value={password}
                        required
                        minlength="8"
                    />
                    <p class="text-xs text-zinc-500 dark:text-zinc-400">La password deve contenere:</p>
                    <ul class="text-xs text-zinc-500 dark:text-zinc-400 list-disc list-inside">
                        <li class:text-emerald-500={passwordValidation.hasMinLength}>Almeno 8 caratteri</li>
                        <li class:text-emerald-500={passwordValidation.hasUpperCase}>Almeno una lettera maiuscola</li>
                        <li class:text-emerald-500={passwordValidation.hasNumber}>Almeno un numero</li>
                        <li class:text-emerald-500={passwordValidation.hasSpecialChar}>Almeno un carattere speciale</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
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

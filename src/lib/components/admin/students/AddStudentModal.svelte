<script>
    import { messagePopup } from '$lib/components/shared/ui/messagePopup/messagePopup.js';
    import { studentsStore } from '$lib/stores/students.js';
    import { levels } from '$lib/models/students.svelte.js';
    import * as ls from 'lucide-svelte';

    import CustomSelect from '$lib/components/shared/ui/forms/CustomSelect.svelte';
    import PhoneNumber from '$lib/components/shared/ui/forms/PhoneNumber.svelte';
    import AddModal from '$lib/components/shared/ui/modals/AddModal.svelte';

    let {
        isOpen = $bindable(false),
    } = $props();

    let firstName = $state('');
    let lastName = $state('');
    let fullName = $derived(`${firstName} ${lastName}`);
    let email = $state('');
    let password = $state('');
    let city = $state('');
    let phonePrefix = $state('');
    let phoneNumber = $state('');
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
        if (!firstName || !lastName || !email || !password || !phonePrefix || !phoneNumber) {
            messagePopup.error('I campi Nome, Cognome, Email, Password e Telefono sono obbligatori');
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
                        phonePrefix: phonePrefix,
                        phoneNumber: phoneNumber,
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
            });
            
            messagePopup.success('Studente aggiunto con successo');
            
            firstName = '';
            lastName = '';
            email = '';
            phonePrefix = '';
            phoneNumber = '';
            password = '';
        } catch (error) {
            messagePopup.error('Errore durante la creazione dello studente: ' + error.message);
            console.error('Error creating student:', error);
        } finally {
            isLoading = false;
            isOpen = false;
        }
    };
</script>

<AddModal 
    bind:isOpen={isOpen}
    title="Nuovo studente"
    subtitle="Aggiungi un nuovo studente"
    onClose={() => isOpen = false}
    onSubmit={handleSubmit}
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
                            bind:value={firstName}
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
                            bind:value={lastName}
                            required
                        />
                    </div>
                </div>

                <div class="flex flex-row items-center gap-6 w-full">
                    <div class="flex flex-grow flex-col gap-2">
                        <div class="flex flex-row items-center gap-2">
                            <ls.Mail class="w-4 h-4" />
                            <label for="student-email" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Email *
                            </label>
                        </div>
                        <input 
                            type="email" 
                            id="student-email" 
                            class="w-full p-2 rounded-lg border border-zinc-500/25 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                            bind:value={email}
                            required
                        />
                    </div>

                    <div class="flex flex-grow flex-col gap-2">
                        <div class="flex flex-row items-center gap-2">
                            <ls.Phone class="w-4 h-4" />
                            <label for="student-phone" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Telefono
                            </label>
                        </div>
                        <PhoneNumber
                            bind:prefixCode={phonePrefix}
                            bind:phoneNumber={phoneNumber}
                            required
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
                            bind:value={city}
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
                            bind:value={level}
                        />
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <div class="flex flex-row items-center gap-2">
                        <ls.Lock class="w-4 h-4" />
                        <label for="student-password" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Password *
                        </label>
                    </div>
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
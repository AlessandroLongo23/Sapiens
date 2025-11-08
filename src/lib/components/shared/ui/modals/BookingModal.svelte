<script>
	import * as ls from 'lucide-svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import RadioCard from '$lib/components/cards/RadioCard.svelte';
	import CheckboxCard from '$lib/components/cards/CheckboxCard.svelte';
	import FormInput from '$lib/components/shared/ui/forms/FormInput.svelte';
	import FormButton from '$lib/components/shared/ui/forms/FormButton.svelte';
	import Modal from '$lib/components/shared/ui/modals/Modal.svelte';

	import { subjectOptionsByLevel, frequencyOptions, levelOptions } from '$lib/const/data.js';

	let { 
		isOpen = $bindable(false),
		title = 'Prenota una lezione privata' 
	} = $props();

	let currentStep = $state(1);
	let isSubmitting = $state(false);
	let isSubmitted = $state(false);

	let formData = $state({
		level: '',
		subjects: [],
		customSubject: '',
		frequency: '',
		firstName: '',
		lastName: '',
		city: '',
		contact: '',
		contactType: 'email'
	});

	let errors = $state({});

	const currentSubjectOptions = $derived(
		formData.level ? $subjectOptionsByLevel[formData.level] || [] : []
	);

	function closeModal() {
		isOpen = false;
		setTimeout(() => {
			currentStep = 1;
			isSubmitted = false;
			formData = {
				level: '',
				subjects: [],
				customSubject: '',
				frequency: '',
				firstName: '',
				lastName: '',
				city: '',
				contact: '',
				contactType: 'email'
			};
			errors = {};
		}, 300);
	}

	function handleKeydown(event) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}

	function handleModalScroll(event) {
		event.stopPropagation();
	}

	function handleBackgroundScroll(event) {
		event.preventDefault();
		event.stopPropagation();
	}

	function validateStep(step) {
		const newErrors = {};

		switch (step) {
			case 1:
				if (!formData.level) newErrors.level = 'Seleziona un livello di studio';
				break;
			case 2:
				if (formData.subjects.length === 0) newErrors.subjects = 'Seleziona almeno una materia';
				if (formData.subjects.includes('altro') && !formData.customSubject.trim()) {
					newErrors.customSubject = 'Inserisci il nome della materia';
				}
				break;
			case 3:
				if (!formData.frequency) newErrors.frequency = 'Seleziona la frequenza delle lezioni';
				break;
			case 4:
				if (!formData.firstName) newErrors.firstName = 'Inserisci il nome';
				if (!formData.lastName) newErrors.lastName = 'Inserisci il cognome';
				if (!formData.contact) {
					newErrors.contact =
						formData.contactType === 'email'
							? "Inserisci l'email"
							: 'Inserisci il numero di telefono';
				} else if (formData.contactType === 'email' && !formData.contact.includes('@')) {
					newErrors.contact = "Inserisci un'email valida";
				}
				break;
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	function nextStep() {
		if (validateStep(currentStep)) {
			currentStep++;
		}
	}

	function previousStep() {
		currentStep--;
		errors = {};
	}

	function handleLevelChange() {
		formData.subjects = [];
		formData.customSubject = '';
		errors = {};
	}

	async function submitForm() {
		if (!validateStep(4)) return;

		isSubmitting = true;

		try {
			const response = await fetch('/api/emails/first-contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: 'Server error' }));
				throw new Error(errorData.error || 'Failed to send email');
			}

			const result = await response.json();

			if (result.success) {
				isSubmitted = true;
			} else {
				console.error('Submission error:', result.error);
			}
		} catch (error) {
			console.error('Submission error:', error);
		} finally {
			isSubmitting = false;
		}
	}
</script>

<Modal 
	bind:isOpen={isOpen} 
	title="Prenota una Lezione" 
	onClose={closeModal}
	classes="bg-white dark:bg-zinc-800 shadow-2xl rounded-2xl sm:rounded-3xl max-w-4xl"
>
	{#if isSubmitted}
		<div class="p-4 sm:p-8 flex-1 flex items-center justify-center">
			<div class="text-center">
				<div
					class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center"
				>
					<ls.CheckCircle class="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
				</div>
				<h3 class="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 sm:mb-4">
					Richiesta inviata
				</h3>
				<p class="text-zinc-600 dark:text-zinc-300 text-base sm:text-lg mb-4 sm:mb-6 px-2">
					Grazie per la tua richiesta. Ti contatteremo entro 24 ore per organizzare la prima lezione.
				</p>
				<FormButton onclick={closeModal} variant="primary" size="lg"> Perfetto! </FormButton>
			</div>
		</div>
	{:else}
		<div
			class="flex justify-between items-center p-4 sm:p-6 border-b border-zinc-100 dark:border-zinc-700/50 flex-shrink-0"
		>
			<h3
				class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-zinc-800 to-zinc-900 dark:from-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent"
			>
				{title}
			</h3>
			<button
				onclick={closeModal}
				class="group p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl transition-colors duration-300 cursor-pointer"
				aria-label="Chiudi modal"
			>
				<ls.X
					class="w-5 h-5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors duration-300"
				/>
			</button>
		</div>

		<div class="px-4 sm:px-6 pt-2 sm:pt-4 flex-shrink-0">
			<ProgressBar {currentStep} />
		</div>

		<div class="flex-1 overflow-hidden flex flex-col">
			<div class="p-4 sm:p-8 pt-2 flex-1 overflow-y-auto min-h-72 max-h-96">
				{#if currentStep === 1}
					<div
						class="h-full flex flex-col justify-center animate-in slide-in-from-right-4 duration-500"
					>
						<div class="text-center mb-4 sm:mb-6">
						<h4 class="text-lg sm:text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-2">
								Qual è il tuo livello di studio?
							</h4>
						<p class="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base px-2">
								Scegli il livello che stai frequentando
							</p>
						</div>

						<div class="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-4xl mx-auto">
							{#each $levelOptions as option}
								<RadioCard
									bind:selectedValue={formData.level}
									value={option.value}
									onclick={handleLevelChange}
								>
									<div class="flex flex-col justify-between h-full">
										<div class="flex flex-row items-center justify-start gap-4 mb-3">
											{#if option.icon}
									<div
										class="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-600 flex items-center justify-center {
											formData.level === option.value
												? 'from-blue-100 to-indigo-100 dark:from-blue-950/40 dark:to-indigo-900/40'
												: ''
										} transition-all duration-300"
									>
													<option.icon
											class="w-4 h-4 {formData.level === option.value
												? 'text-blue-600 dark:text-blue-400'
												: 'text-zinc-600 dark:text-zinc-300'} transition-colors duration-300"
													/>
												</div>
											{/if}

											<div
									class="text-base font-semibold {
													formData.level === option.value
											? 'text-blue-900 dark:text-blue-300'
											: 'text-zinc-800 dark:text-zinc-100 group-hover:text-zinc-900 dark:group-hover:text-zinc-50'
												} transition-colors duration-300 mb-1"
											>
												{option.title}
											</div>
										</div>

										{#if option.subtitle}
											<div
									class="text-sm {
													formData.level === option.value
											? 'text-blue-700 dark:text-blue-400'
											: 'text-zinc-600 dark:text-zinc-300'
												} transition-colors duration-300 mb-1"
											>
												{option.subtitle}
											</div>
										{/if}

										{#if option.price}
											<div
									class="text-lg font-bold {
													formData.level === option.value
											? 'text-blue-600 dark:text-blue-400'
											: 'text-zinc-700 dark:text-zinc-200'
												} transition-colors duration-300"
											>
												{option.price}
											</div>
										{/if}
									</div>
								</RadioCard>
							{/each}
						</div>

			{#if errors.level}
				<div class="text-red-600 dark:text-red-400 text-sm text-center mt-4">{errors.level}</div>
						{/if}
					</div>
				{:else if currentStep === 2}
					<div
						class="h-full flex flex-col justify-start animate-in slide-in-from-right-4 duration-500"
					>
						<div class="text-center mb-6">
							<h4 class="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-2">Seleziona le materie</h4>
							<p class="text-zinc-600 dark:text-zinc-300">
								Scegli una o più materie per cui hai bisogno di supporto
							</p>
						</div>

						<div class="max-w-3xl mx-auto">
							<div class="flex flex-wrap justify-center gap-3">
								{#each currentSubjectOptions as option}
									<CheckboxCard
										bind:selectedValues={formData.subjects}
										bind:editableValue={formData.customSubject}
										value={option.value}
										title={option.title}
										editable={option.editable || false}
									/>
								{/each}
							</div>

							{#if errors.subjects}
								<div class="text-red-600 dark:text-red-400 text-sm text-center mt-4">
									{errors.subjects}
								</div>
							{/if}
							{#if errors.customSubject}
								<div class="text-red-600 dark:text-red-400 text-sm text-center mt-2">
									{errors.customSubject}
								</div>
							{/if}
						</div>
					</div>
				{:else if currentStep === 3}
					<div
						class="h-full flex flex-col justify-start animate-in slide-in-from-right-4 duration-500"
					>
						<div class="text-center mb-4 sm:mb-6">
							<h4 class="text-lg sm:text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-2">
								Frequenza delle lezioni
							</h4>
							<p class="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base px-2">
								Scegli la frequenza che meglio si adatta alle tue esigenze
							</p>
						</div>

						<div class="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-4xl mx-auto">
							{#each $frequencyOptions as option}
								<RadioCard bind:selectedValue={formData.frequency} value={option.value}>
									<div
										class="text-base font-semibold {
											formData.frequency === option.value
												? 'text-blue-900 dark:text-blue-300'
												: 'text-zinc-800 dark:text-zinc-100 group-hover:text-zinc-900 dark:group-hover:text-zinc-50'
										} transition-colors duration-300 mb-1"
									>
										{option.title}
									</div>

									{#if option.subtitle}
										<div
											class="text-sm {
												formData.frequency === option.value
													? 'text-blue-700 dark:text-blue-400'
													: 'text-zinc-600 dark:text-zinc-300'
											} transition-colors duration-300 mb-1"
										>
											{option.subtitle}
										</div>
									{/if}
								</RadioCard>
							{/each}
						</div>

						{#if errors.frequency}
							<div class="text-red-600 dark:text-red-400 text-sm text-center mt-4">{errors.frequency}</div>
						{/if}
					</div>
				{:else if currentStep === 4}
					<div
						class="h-full flex flex-col justify-center animate-in slide-in-from-right-4 duration-500"
					>
					<div class="text-center mb-4 sm:mb-6">
						<h4 class="text-lg sm:text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-2">
								I tuoi dati di contatto
							</h4>
						<p class="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base px-2">
								Inserisci le informazioni per essere contattato
							</p>
						</div>

						<div class="max-w-2xl mx-auto w-full space-y-4">
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<FormInput
									bind:value={formData.firstName}
									label="Nome"
									placeholder="Mario"
									required
									error={errors.firstName}
								/>
								<FormInput
									bind:value={formData.lastName}
									label="Cognome"
									placeholder="Rossi"
									required
									error={errors.lastName}
								/>
							</div>

							<FormInput
								bind:value={formData.city}
								label="Città"
								placeholder="Firenze"
								error={errors.city}
							/>

							<div class="grid grid-cols-3 gap-2">
								<div class="col-span-1">
									<label
										for="contact-type"
								class="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-2"
										>Contatto</label
									>
									<select
										id="contact-type"
										bind:value={formData.contactType}
								class="w-full py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300"
									>
										<option value="email">Email</option>
										<option value="phone">Telefono</option>
									</select>
								</div>
								<div class="col-span-2">
									<FormInput
										bind:value={formData.contact}
										type={formData.contactType === 'email' ? 'email' : 'tel'}
										placeholder={
											formData.contactType === 'email'
												? 'mario.rossi@esempio.com'
												: '3331234567'
										}
										label={formData.contactType === 'email' ? 'Email' : 'Telefono'}
										required
										error={errors.contact}
									/>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<div class="flex justify-between p-4 sm:p-6 border-t border-zinc-100 flex-shrink-0">
				<div>
					{#if currentStep > 1}
						<FormButton onclick={previousStep} variant="ghost"> Indietro </FormButton>
					{/if}
				</div>

				<div class="flex space-x-3">
					{#if currentStep < 4}
						<FormButton onclick={nextStep} variant="primary"> Continua </FormButton>
					{:else}
						<FormButton
							onclick={submitForm}
							variant="primary"
							loading={isSubmitting}
							disabled={isSubmitting}
						>
							{#if isSubmitting}
								Invio in corso...
							{:else}
								<span class="flex items-center space-x-2">
									<ls.Send class="w-4 h-4" />
									<span>Invia Richiesta</span>
								</span>
							{/if}
						</FormButton>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</Modal>
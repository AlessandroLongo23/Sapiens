<script>
	import * as ls from 'lucide-svelte';
	import ProgressBar from './ProgressBar.svelte';
	import RadioCard from './RadioCard.svelte';
	import CheckboxCard from './CheckboxCard.svelte';
	import FormInput from './FormInput.svelte';
	import FormButton from './FormButton.svelte';
	import { subjectOptionsByLevel, frequencyOptions, levelOptions } from '$lib/data.js';

	let { isOpen = $bindable(false), title = "Prenota una Lezione" } = $props();
	
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
					newErrors.contact = formData.contactType === 'email' ? 'Inserisci l\'email' : 'Inserisci il numero di telefono';
				} else if (formData.contactType === 'email' && !formData.contact.includes('@')) {
					newErrors.contact = 'Inserisci un\'email valida';
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
		if (!validateStep(4)) {
			console.log('Form validation failed');
			return;
		}
		
		isSubmitting = true;
		
		try {
			const response = await fetch('/api/send-email', {
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

{#if isOpen}
	<div 
		class="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 transition-all duration-500"
		onclick={closeModal}
		onkeydown={handleKeydown}
		onwheel={handleBackgroundScroll}
		ontouchmove={handleBackgroundScroll}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div 
            role="dialog"
            tabindex="-1"
            onkeydown={() => {}}
			class="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl h-[90vh] sm:h-[85vh] flex flex-col border border-slate-100/60 transform transition-all duration-500 scale-100"
			onclick={(e) => e.stopPropagation()}
			onwheel={handleModalScroll}
			ontouchmove={handleModalScroll}
		>
			{#if isSubmitted}
				<div class="p-4 sm:p-8 flex-1 flex items-center justify-center">
					<div class="text-center">
						<div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
							<ls.CheckCircle class="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
						</div>
						<h3 class="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">Richiesta Inviata!</h3>
						<p class="text-slate-600 text-base sm:text-lg mb-4 sm:mb-6 px-2">
							Grazie per aver scelto i miei servizi. Ti contatterò entro 24 ore per organizzare la prima lezione.
						</p>
						<FormButton onclick={closeModal} variant="primary" size="lg">
							Perfetto!
						</FormButton>
					</div>
				</div>
			{:else}
				<div class="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 flex-shrink-0">
					<h3 class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
						{title}
					</h3>
					<button 
						onclick={closeModal}
						class="group p-2 hover:bg-slate-100 rounded-xl transition-colors duration-300 cursor-pointer"
						aria-label="Chiudi modal"
					>
						<ls.X class="w-5 h-5 text-slate-500 group-hover:text-slate-700 transition-colors duration-300" />
					</button>
				</div>
				
				<div class="px-4 sm:px-6 pt-2 sm:pt-4 flex-shrink-0">
					<ProgressBar {currentStep} />
				</div>
				
				<div class="flex-1 overflow-hidden flex flex-col">
					<div class="p-4 sm:p-8 pt-2 flex-1 overflow-y-auto">
						{#if currentStep === 1}
							<div class="h-full flex flex-col justify-center animate-in slide-in-from-right-4 duration-500">
								<div class="text-center mb-4 sm:mb-6">
									<h4 class="text-lg sm:text-xl font-semibold text-slate-800 mb-2">Seleziona il tuo livello di studio</h4>
									<p class="text-slate-600 text-sm sm:text-base px-2">Scegli il livello che meglio rappresenta la tua situazione attuale</p>
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
														<div class="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center {
															formData.level === option.value ? 'from-blue-100 to-indigo-100' : ''
														} transition-all duration-300">
															<svelte:component this={option.icon} class="w-4 h-4 {formData.level === option.value ? 'text-blue-600' : 'text-slate-600'} transition-colors duration-300" />
														</div>
													{/if}
													 
													<div class="text-base font-semibold {
														formData.level === option.value ? 'text-blue-900' : 'text-slate-800 group-hover:text-slate-900'
													} transition-colors duration-300 mb-1">
														{option.title}
													</div>
												</div>
												
												{#if option.subtitle}
													<div class="text-sm {
														formData.level === option.value ? 'text-blue-700' : 'text-slate-600'
													} transition-colors duration-300 mb-1">
														{option.subtitle}
													</div>
												{/if}
												
												{#if option.price}
													<div class="text-lg font-bold {
														formData.level === option.value ? 'text-blue-600' : 'text-slate-700'
													} transition-colors duration-300">
														{option.price}
													</div>
												{/if}
											</div>

										</RadioCard>
									{/each}
								</div>
								
								{#if errors.level}
									<div class="text-red-600 text-sm text-center mt-4">{errors.level}</div>
								{/if}
							</div>
						{:else if currentStep === 2}
							<div class="h-full flex flex-col justify-start animate-in slide-in-from-right-4 duration-500">
								<div class="text-center mb-6">
									<h4 class="text-xl font-semibold text-slate-800 mb-2">Seleziona le materie</h4>
									<p class="text-slate-600">Scegli una o più materie per cui hai bisogno di supporto</p>
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
										<div class="text-red-600 text-sm text-center mt-4">{errors.subjects}</div>
									{/if}
									{#if errors.customSubject}
										<div class="text-red-600 text-sm text-center mt-2">{errors.customSubject}</div>
									{/if}
								</div>
							</div>
						{:else if currentStep === 3}
							<div class="h-full flex flex-col justify-start animate-in slide-in-from-right-4 duration-500">
								<div class="text-center mb-4 sm:mb-6">
									<h4 class="text-lg sm:text-xl font-semibold text-slate-800 mb-2">Frequenza delle lezioni</h4>
									<p class="text-slate-600 text-sm sm:text-base px-2">Scegli la frequenza che meglio si adatta alle tue esigenze</p>
								</div>
								
								<div class="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-4xl mx-auto">
									{#each $frequencyOptions as option}
										<RadioCard
											bind:selectedValue={formData.frequency}
											value={option.value}
										>
											<div class="text-base font-semibold {
												formData.frequency === option.value ? 'text-blue-900' : 'text-slate-800 group-hover:text-slate-900'
											} transition-colors duration-300 mb-1">
												{option.title}
											</div>
											
											{#if option.subtitle}
												<div class="text-sm {
													formData.frequency === option.value ? 'text-blue-700' : 'text-slate-600'
												} transition-colors duration-300 mb-1">
													{option.subtitle}
												</div>
											{/if}
										</RadioCard>
									{/each}
								</div>
								
								{#if errors.frequency}
									<div class="text-red-600 text-sm text-center mt-4">{errors.frequency}</div>
								{/if}
							</div>
						{:else if currentStep === 4}
							<div class="h-full flex flex-col justify-center animate-in slide-in-from-right-4 duration-500">
								<div class="text-center mb-4 sm:mb-6">
									<h4 class="text-lg sm:text-xl font-semibold text-slate-800 mb-2">I tuoi dati di contatto</h4>
									<p class="text-slate-600 text-sm sm:text-base px-2">Inserisci le informazioni per essere contattato</p>
								</div>
								
								<div class="max-w-2xl mx-auto w-full space-y-4">
									<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormInput
											bind:value={formData.firstName}
											label="Nome"
											placeholder="Il tuo nome"
											required
											error={errors.firstName}
											icon={ls.User}
										/>
										<FormInput
											bind:value={formData.lastName}
											label="Cognome"
											placeholder="Il tuo cognome"
											required
											error={errors.lastName}
											icon={ls.User}
										/>
									</div>
									
									<!-- <FormInput
										bind:value={formData.city}
										label="Città"
										placeholder="La tua città"
										required
										error={errors.city}
										icon={MapPin}
									/> -->
									
									<div class="space-y-3">
										<label class="block text-sm font-medium text-slate-700">
											Preferenza di contatto <span class="text-red-500">*</span>
										</label>
										<div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
											<label class="flex items-center flex-1">
												<input
													type="radio"
													bind:group={formData.contactType}
													value="email"
													class="sr-only"
												/>
												<div class="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 rounded-lg border-2 transition-all duration-300 cursor-pointer w-full {
													formData.contactType === 'email' 
														? 'border-blue-500 bg-blue-50 text-blue-700' 
														: 'border-slate-200 hover:border-slate-300'
												}">
													<ls.Mail class="w-4 h-4" />
													<span class="text-sm font-medium">Email</span>
												</div>
											</label>

                                            <label class="flex items-center flex-1">
												<input
													type="radio"
													bind:group={formData.contactType}
													value="message"
													class="sr-only"
												/>
												<div class="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 rounded-lg border-2 transition-all duration-300 cursor-pointer w-full {
													formData.contactType === 'message' 
														? 'border-blue-500 bg-blue-50 text-blue-700' 
														: 'border-slate-200 hover:border-slate-300'
												}">
													<ls.MessageCircle class="w-4 h-4" />
													<span class="text-sm font-medium">Messaggio</span>
												</div>
											</label>

											<label class="flex items-center flex-1">
												<input
													type="radio"
													bind:group={formData.contactType}
													value="call"
													class="sr-only"
												/>
												<div class="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 rounded-lg border-2 transition-all duration-300 cursor-pointer w-full {
													formData.contactType === 'call' 
														? 'border-blue-500 bg-blue-50 text-blue-700' 
														: 'border-slate-200 hover:border-slate-300'
												}">
													<ls.Phone class="w-4 h-4" />
													<span class="text-sm font-medium">Chiamata</span>
												</div>
											</label>
										</div>
									</div>
									
									<FormInput
										bind:value={formData.contact}
										type={formData.contactType === 'email' ? 'email' : 'tel'}
										label={formData.contactType === 'email' ? 'Email' : 'Numero di telefono'}
										placeholder={formData.contactType === 'email' ? 'la-tua-email@esempio.com' : '+39 123 456 7890'}
										required
										error={errors.contact}
										icon={formData.contactType === 'email' ? ls.Mail : ls.Phone}
									/>
								</div>
							</div>
						{/if}
					</div>
					
					<div class="flex justify-between p-4 sm:p-6 border-t border-slate-100 flex-shrink-0">
						<div>
							{#if currentStep > 1}
								<FormButton onclick={previousStep} variant="ghost">
									Indietro
								</FormButton>
							{/if}
						</div>
						
						<div class="flex space-x-3">
							{#if currentStep < 4}
								<FormButton onclick={nextStep} variant="primary">
									Continua
								</FormButton>
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
		</div>
	</div>
{/if} 
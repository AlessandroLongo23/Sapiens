<script>
	import { isSameDay, isToday, isPast, parseISO, setHours, setMinutes, format } from 'date-fns';
	import { studentsStore } from '$lib/stores/students.js';
	import { lecturesStore } from '$lib/stores/lectures.js';
	import { subjectsStore } from '$lib/stores/subjects.js';
	import { formatDateString } from '$lib/utils/date.svelte.js';
	import { capitalize } from '$lib/utils/string.svelte.js';
	import { createEventDispatcher } from 'svelte';
	import * as ls from 'lucide-svelte';
	
	import CustomSelect from '$lib/components/shared/ui/forms/CustomSelect.svelte';

	const dispatch = createEventDispatcher();

	let { 
		isOpen = $bindable(false), 
		selectedDay = null, 
		user 
	} = $props();
	
	let isSubmitting = $state(false);
	let isSubmitted = $state(false);
	let validationError = $state('');
	let currentTime = $state(new Date());
	
	let timeInterval;
	
	$effect(() => {
		if (isOpen && isToday(selectedDay)) {
			timeInterval = setInterval(() => {
				currentTime = new Date();
				if (formData.start_time && formData.end_time) {
					validateTimes(formData.start_time, formData.end_time);
				}
			}, 60000);
			
			return () => {
				clearInterval(timeInterval);
			};
		}
	});
	
	$effect(() => {
		if (isOpen && formData.start_time && formData.end_time) {
			validateTimes(formData.start_time, formData.end_time);
		}
	});
	
	$effect(() => {
		if (isOpen && formData.subject_id !== undefined) {
			validateTimes(formData.start_time, formData.end_time);
		}
	});

	function validateTimeNotInPast(timeString) {
		if (!selectedDay || !isToday(selectedDay)) return true;
		
		const [hours, minutes] = timeString.split(':').map(Number);
		
		const now = new Date(currentTime);
		const currentHours = now.getHours();
		const currentMinutes = now.getMinutes();
		
		if (hours < currentHours) {
			return false;
		}
		
		if (hours === currentHours && minutes <= currentMinutes) {
			return false;
		}
		
		return true;
	}
	
	function validateBusinessHours(timeString) {
		const [hours, minutes] = timeString.split(':').map(Number);
		return hours >= 6 && hours < 22;
	}
	
	function validateStartBeforeEnd(startTime, endTime) {
		const startMinutes = convertToMinutes(startTime);
		const endMinutes = convertToMinutes(endTime);
		
		return startMinutes < endMinutes;
	}

    const convertToMinutes = (timeString) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    };
	
	function checkForTimeOverlap(startTime, endTime) {
		if (!selectedDay || !dayLectures.length) return false;
		
		const newStartMinutes = convertToMinutes(startTime);
		const newEndMinutes = convertToMinutes(endTime);
		
		return dayLectures.some(lecture => {
			const existingStartMinutes = convertToMinutes(lecture.start_time);
			const existingEndMinutes = convertToMinutes(lecture.end_time);
			
			return (
				(newStartMinutes >= existingStartMinutes && newStartMinutes < existingEndMinutes) ||
				(newEndMinutes > existingStartMinutes && newEndMinutes <= existingEndMinutes) ||
				(newStartMinutes <= existingStartMinutes && newEndMinutes >= existingEndMinutes)
			);
		});
	}

	let dayLectures = $derived.by(() => {
		return $lecturesStore.lectures
			.filter(lecture => isSameDay(new Date(lecture.date), new Date(selectedDay)))
			.sort((a, b) => a.start_time.localeCompare(b.start_time))
			.map(lecture => ({
				...lecture,
				student: $studentsStore.students.find(student => student.id === lecture.student_id),
				subject: $subjectsStore.subjects.find(subject => subject.id === lecture.subject_id)
			}));
	});

	let formData = $state({
		student_id: user.id,
		first_name: '',
		last_name: '',
		date: '',
		start_time: '15:00',
		end_time: '16:00',
		subject_id: '',
		status: 'pending',
		level: '',
		hourly_rate: 0,
	});
	
	$effect(() => {
		if (isOpen && selectedDay) {
			const student = $studentsStore.students.find(student => student.id === user.id);
			
			let hourlyRate = 15;
			if (student?.level === 'university') {
				hourlyRate = 20;
			}
			
			formData = {
				student_id: user.id,
				first_name: student?.first_name,
				last_name: student?.last_name,
				date: formatDateString(selectedDay, 'yyyy-MM-dd'),
				start_time: '15:00',
				end_time: '16:00',
				subject_id: $subjectsStore.subjects.length > 0 ? $subjectsStore.subjects[0].id : '',
				status: 'pending',
				level: student?.level || 'high_school',
				hourly_rate: hourlyRate,
			};
		}
	});

	function closeModal() {
		dispatch('close');
	}

	const validateTimes = (start_time, end_time) => {
		if (start_time && end_time) {
			if (isToday(selectedDay) && !validateTimeNotInPast(start_time)) {
				validationError = "L'orario d'inizio scelto è nel passato.";
				return false;
			}
			
			if (!validateStartBeforeEnd(start_time, end_time)) {
				validationError = "L'orario di inizio è successivo all'orario di fine.";
				return false;
			}
			
			if (!validateBusinessHours(start_time) || !validateBusinessHours(end_time)) {
				validationError = "L'orario di lezione è tra le 6:00 e le 22:00.";
				return false;
			}

			if (checkForTimeOverlap(start_time, end_time)) {
				validationError = "L'orario scelto si sovrappone a un impegno.";
				return false;
			}
			
			if (!formData.subject_id) {
				validationError = "È necessario selezionare una materia.";
				return false;
			}
			
			validationError = "";
		}

		return true;
	}

	async function handleSubmit(event) {
		event.preventDefault();

		if (!validateTimes(formData.start_time, formData.end_time)) {
			return;
		}
		
		isSubmitting = true;

		try {
			const lectureData = {
				student_id: formData.student_id,
				subject_id: formData.subject_id,
				date: formData.date,
				start_time: formData.start_time,
				end_time: formData.end_time,
				status: 'pending',
				level: formData.level,
				hourly_rate: formData.hourly_rate,
				paid: false
			};
			
			const result = await lecturesStore.addLecture(lectureData);
			
			const emailData = {
				student_id: formData.student_id,
				first_name: formData.first_name,
				last_name: formData.last_name,
				date: formData.date,
				start_time: formData.start_time,
				end_time: formData.end_time,
				subject_id: formData.subject_id,
				level: formData.level,
				status: 'pending'
			};
			
			const emailResponse = await fetch('/api/emails/request-lecture', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(emailData)
			});

			if (!emailResponse.ok) {
				console.warn('Email notification failed, but lecture was added successfully');
			}

			if (result) {
				isSubmitted = true;
				setTimeout(() => {
					isSubmitted = false;
					closeModal();
				}, 4000);
			} else {
				throw new Error('Impossibile aggiungere la lezione');
			}
		} catch (error) {
			console.error('Submission error:', error);
			validationError = error.message || "Si è verificato un errore durante l'invio della richiesta.";
		} finally {
			isSubmitting = false;
		}
	}
</script>

{#if isOpen && selectedDay}
	<div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
		<div class="bg-white dark:bg-zinc-900 rounded-md shadow-lg w-full max-w-md relative overflow-hidden border border-zinc-200 dark:border-zinc-700">
			<div class="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-700">
				<h2 class="text-lg font-medium text-zinc-900 dark:text-zinc-50">
					{capitalize(formatDateString(selectedDay, 'EEEE'))}
					<span class="block text-sm text-zinc-500 dark:text-zinc-400">
						{formatDateString(selectedDay, 'PP')}
					</span>
				</h2>
				<button 
					onclick={closeModal}
					class="p-1.5 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
					aria-label="Close modal"
				>
					<ls.X size={18} />
				</button>
			</div>
			
			<div class="p-5">
				{#if isSubmitted}
					<div class="flex flex-col items-center justify-center text-center py-6">
						<div class="w-16 h-16 mx-auto mb-5 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
							<ls.CheckCircle class="w-8 h-8 text-green-600 dark:text-green-400" />
						</div>
						<h3 class="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-3">
							Proposta Inviata!
						</h3>
						<p class="text-zinc-600 dark:text-zinc-400 text-sm mb-5 max-w-xs">
							La tua proposta di lezione per il <strong>{formatDateString(selectedDay, 'PPP')}</strong> è stata inviata con successo.
						</p>
						<button
							onclick={closeModal}
							class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
						>
							Perfetto!
						</button>
					</div>
				{:else}
					<div class="space-y-4">
						<div>
							<h3 class="text-base font-medium text-zinc-900 dark:text-zinc-50 mb-3">
								Proponi una lezione
							</h3>

							<form onsubmit={handleSubmit} class="space-y-4">
								{#if validationError}
									<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-3 py-2 rounded text-sm flex items-start">
										<ls.AlertCircle class="w-4 h-4 mr-2 mt-0.5 shrink-0" />
										<span>{validationError}</span>
									</div>
								{/if}
								
								<div class="space-y-4">
									<div class="grid grid-cols-2 gap-4">
										<div>
											<label for="start-time" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
												Inizio
											</label>
											<input 
												type="time" 
												id="start-time"
												bind:value={formData.start_time}
												onchange={() => { validateTimes(formData.start_time, formData.end_time); }}
												class="w-full px-3 py-2 text-base border {validationError && (!validateTimeNotInPast(formData.start_time) || (formData.end_time && !validateStartBeforeEnd(formData.start_time, formData.end_time))) ? 'border-red-300 dark:border-red-700' : 'border-zinc-300 dark:border-zinc-700'} rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-zinc-100"
												required
											/>
										</div>
										
										<div>
											<label for="end-time" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
												Fine
											</label>
											<input 
												type="time" 
												id="end-time"
												bind:value={formData.end_time}
												onchange={() => { validateTimes(formData.start_time, formData.end_time); }}
												class="w-full px-3 py-2 text-base border {validationError && (!validateTimeNotInPast(formData.end_time) || (formData.start_time && !validateStartBeforeEnd(formData.start_time, formData.end_time))) ? 'border-red-300 dark:border-red-700' : 'border-zinc-300 dark:border-zinc-700'} rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-zinc-100"
												required
											/>
										</div>
									</div>

									<div>
										<label for="subject-select" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
											Materia
										</label>
										<CustomSelect
											bind:value={formData.subject_id}
											options={$subjectsStore.subjects}
											placeholder="Seleziona una materia"
											searchable={true}
											labelKey='name'
											valueKey='id'
											classes={validationError && !formData.subject_id ? "error" : ""}
										/>
									</div>
								</div>

								<button 
									type="submit"
									disabled={isSubmitting || validationError !== ''}
									class="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded text-sm font-medium flex items-center justify-center gap-2"
								>
									{#if isSubmitting}
										<ls.Loader2 class="w-4 h-4 animate-spin" />
										<span>Invio in corso...</span>
									{:else}
										<ls.Send class="w-4 h-4" />
										<span>Proponi lezione</span>
									{/if}
								</button>
							</form>
						</div>

						<div class="pt-5 mt-2 border-t border-zinc-200 dark:border-zinc-700">
							<h3 class="text-base font-medium text-zinc-900 dark:text-zinc-50 mb-3 flex items-center">
								<ls.Calendar class="w-4 h-4 mr-2 text-zinc-500" />
								Impegni del giorno
							</h3>

							{#if dayLectures.length > 0}
								<div class="space-y-2 max-h-48 overflow-y-auto pr-1">
									{#each dayLectures as dayLecture}
										{#if dayLecture.student_id === user.id}
											<div class="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 border-l-2 border-green-500 rounded px-3 py-2">
												<div class="flex items-center">
													<ls.Clock class="w-4 h-4 mr-2 text-zinc-500" />
													<span class="text-sm">{dayLecture.start_time} - {dayLecture.end_time}</span>
												</div>
												{#if dayLecture.subject}
													<span class="text-sm px-2 py-0.5 bg-zinc-200/70 dark:bg-zinc-700/50 rounded text-zinc-700 dark:text-zinc-300">{dayLecture.subject.name}</span>
												{/if}
											</div>
										{:else}
											
											<div class="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 border-l-2 border-red-500 rounded px-3 py-2">
												<div class="flex items-center">
													<ls.Clock class="w-4 h-4 mr-2 text-zinc-500" />
													<span class="text-sm">{dayLecture.start_time} - {dayLecture.end_time}</span>
												</div>
												<span class="text-sm px-2 py-0.5 bg-red-100/80 dark:bg-red-900/30 rounded text-red-600 dark:text-red-400 font-medium">Occupato</span>
											</div>
										{/if}
									{/each}
								</div>
							{:else}
								<div class="flex items-center justify-center py-6 text-zinc-400 text-sm">
									<ls.Calendar class="w-5 h-5 mr-2 text-zinc-400" />
									<span>Nessun impegno per questa giornata</span>
								</div>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

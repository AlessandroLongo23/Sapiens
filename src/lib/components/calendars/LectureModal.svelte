<script>
	import { studentsStore } from '$lib/stores/students.js';
	import { subjectsStore } from '$lib/stores/subjects.svelte.js';
	import { lecturesStore } from '$lib/stores/lectures.svelte.js';
	import { createEventDispatcher } from 'svelte';
	import { format } from 'date-fns';
	import { X } from 'lucide-svelte';
	
	import CustomSelect from '$lib/components/forms/CustomSelect.svelte';
	import AddModal from '$lib/components/modals/AddModal.svelte';

	let { 
		isOpen = false, 
		lecture = null, 
		selectedDate = new Date() 
	} = $props();
	
	let formData = $state({
		id: null,
		student_id: '',
		subject_id: '',
		date: format(selectedDate, 'yyyy-MM-dd'),
		start_time: '15:00',
		end_time: '16:30',
		hourly_rate: 25,
		level: 'high_school',
	});
	
	let isSubmitting = $state(false);
	let errorMessage = $state('');
	
	const dispatch = createEventDispatcher();
	
	$effect(() => {
		if (isOpen) {
			if (lecture) {
				formData = {
					id: lecture.id,
					student_id: lecture.student_id,
					subject_id: lecture.subject_id,
					date: format(lecture.date, 'yyyy-MM-dd'),
					start_time: lecture.start_time,
					end_time: lecture.end_time,
					hourly_rate: lecture.hourly_rate,
					level: lecture.level,
				};
			} else {
				formData = {
					id: null,
					student_id: '',
					subject_id: '',
					date: format(selectedDate, 'yyyy-MM-dd'),
					start_time: '15:00',
					end_time: '16:00',
					hourly_rate: 15,
					level: 'high_school',
				};
			}
			errorMessage = '';
		}
	});
	
	// Close the modal
	function closeModal() {
		dispatch('close');
	}
	
	async function handleSubmit(event) {
		event.preventDefault();
		if (!formData.student_id || !formData.subject_id) {
			errorMessage = 'Please select a student and subject';
			return;
		}
		
		isSubmitting = true;
		errorMessage = '';
		
		try {
			if (formData.id) {
				const { id, ...updates } = formData;
				const result = await lecturesStore.updateLecture(id, updates);
				if (result) {
					closeModal();
					dispatch('lectureUpdated', result);
				} else {
					errorMessage = 'Failed to update lecture';
				}
			} else {
				// Add new lecture
				const { id, ...newLecture } = formData;
				const result = await lecturesStore.addLecture(newLecture);
				if (result) {
					closeModal();
					dispatch('lectureAdded', result);
				} else {
					errorMessage = 'Failed to add lecture';
				}
			}
		} catch (error) {
			errorMessage = error.message || 'An unknown error occurred';
		} finally {
			isSubmitting = false;
		}
	}
	
	// Handle lecture deletion
	async function handleDelete() {
		if (!formData.id) return;
		
		isSubmitting = true;
		errorMessage = '';
		
		try {
			const result = await lecturesStore.deleteLecture(formData.id);
			if (result) {
				closeModal();
				dispatch('lectureDeleted', formData.id);
			} else {
				errorMessage = 'Failed to delete lecture';
			}
		} catch (error) {
			errorMessage = error.message || 'An unknown error occurred';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<AddModal 
	bind:isOpen={isOpen} 
	title={lecture ? 'Modifica Lezione' : 'Nuova Lezione'}
	subtitle={lecture ? 'Modifica la lezione selezionata' : 'Crea una nuova lezione'}
	classes="bg-zinc-50 dark:bg-zinc-900 max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-md shadow-md"
>
	<!-- <div class="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
		<h2 class="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
			{lecture ? 'Edit Lecture' : 'New Lecture'}
		</h2>
		<button 
			class="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
			onclick={closeModal}
			aria-label="Close"
		>
			<X size={20} />
		</button>
	</div> -->
	
	<form onsubmit={handleSubmit} class="space-y-4">
		<!-- Date field -->
		<div>
			<label for="date" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
				Data
			</label>
			<input 
				type="date" 
				id="date"
				bind:value={formData.date}
				class="w-full px-3 py-2 border border-zinc-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
				required
			/>
		</div>
		
		<!-- Student field -->
		<div>
			<label for="student" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
				Studente
			</label>
			<select 
				id="student"
				bind:value={formData.student_id}
				class="w-full px-3 py-2 border border-zinc-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
				required
			>
				<option value="" disabled>Seleziona uno studente</option>
				{#each studentsStore.students as student}
					<option value={student.id}>{student.name} {student.last_name}</option>
				{/each}
			</select>
		</div>
		
		<!-- Subject field -->
		<div>
			<label for="subject" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
				Materia
			</label>
			<select 
				id="subject"
				bind:value={formData.subject_id}
				class="w-full px-3 py-2 border border-zinc-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
				required
			>
				<option value="" disabled>Seleziona una materia</option>
				{#each subjectsStore.subjects as subject}
					<option value={subject.id}>{subject.name}</option>
				{/each}
			</select>
		</div>
		
		<!-- Time fields -->
		<div class="grid grid-cols-2 gap-4">
			<div>
				<label for="start-time" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
					Inizio
				</label>
				<input 
					type="time" 
					id="start-time"
					bind:value={formData.start_time}
					class="w-full px-3 py-2 border border-zinc-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
					required
				/>
			</div>
			
			<div>
				<label for="end-time" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
					Fine
				</label>
				<input 
					type="time" 
					id="end-time"
					bind:value={formData.end_time}
					class="w-full px-3 py-2 border border-zinc-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
					required
				/>
			</div>
		</div>
		
		<div class="flex flex-row items-center justify-between gap-4">			
			<div>
				<label for="level" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
					Livello
				</label>
				<CustomSelect
					classes="min-w-60"
					bind:value={formData.level}
					searchable={false}
					options={[
						{ label: 'Scuola Media', value: 'middle_school' },
						{ label: 'Scuole Superiori', value: 'high_school' },
						{ label: 'Università', value: 'university' }
					]}
				/>
			</div>

			<div>
				<label for="rate" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
					Prezzo Orario (€)
				</label>
				<input 
					type="number" 
					id="rate"
					bind:value={formData.hourly_rate}
					min="0"
					step="0.5"
					class="w-full px-3 py-2 border border-zinc-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
					required
				/>
			</div>

			<div>
				<label for="paid" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
					Pagato
				</label>
				<input type="checkbox" id="paid" bind:checked={formData.paid} />
			</div>
		</div>
		
		{#if errorMessage}
			<div class="text-red-500 text-sm">{errorMessage}</div>
		{/if}
		
		<div class="flex justify-between pt-2">
			{#if lecture}
				<button
					type="button"
					class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
					onclick={handleDelete}
					disabled={isSubmitting}
				>
					Delete
				</button>
			{:else}
				<div></div>
			{/if}
			
			<!-- <div class="space-x-2">
				<button
					type="button"
					class="px-4 py-2 bg-zinc-200 text-zinc-900 rounded hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
					onclick={closeModal}
					disabled={isSubmitting}
				>
					Cancel
				</button>
				
				<button
					type="submit"
					class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
					disabled={isSubmitting}
				>
					{lecture ? 'Update' : 'Add'} Lecture
				</button>
			</div> -->
		</div>
	</form>
</AddModal> 
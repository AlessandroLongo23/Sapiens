<script>
	import { studentsStore } from '$lib/stores/students.js';
	import { subjectsStore } from '$lib/stores/subjects.js';
	import { lecturesStore } from '$lib/stores/lectures.js';
	import { levels } from '$lib/models/students.svelte.js';
	import { format } from 'date-fns';
	import { it } from 'date-fns/locale';
	import * as ls from 'lucide-svelte';
	
	import CustomSelect from '$lib/components/shared/ui/forms/CustomSelect.svelte';
	import AddModal from '$lib/components/shared/ui/modals/AddModal.svelte';

	let { 
		isOpen = $bindable(false), 
		selectedDate = new Date(),
		classes = ''
	} = $props();
	
	let formData = $state({
		id: null,
		student_id: '',
		subject_id: '',
		date: format(selectedDate, 'yyyy-MM-dd', { locale: it }),
		start_time: '15:00',
		end_time: '16:00',
		hourly_rate: 15,
		level: 'medie',
		paid: false,
		status: 'accepted',
	});
	
	let errorMessage = $state('');
	
	$effect(() => {
		if (isOpen) {
			formData = {
				id: null,
				student_id: '',
				subject_id: '',
				date: format(selectedDate, 'yyyy-MM-dd', { locale: it }),
				start_time: '15:00',
				end_time: '16:30',
				hourly_rate: 25,
				level: 'high_school',
				paid: false,
				status: 'accepted',
			};
			
			errorMessage = '';
		}
	});
	
	async function handleSubmit(event) {
		event.preventDefault();
		if (!formData.student_id || !formData.subject_id) {
			errorMessage = 'Seleziona uno studente e una materia';
			return;
		}
		
		errorMessage = '';
		
		try {
			const { id, ...newLecture } = formData;
			const result = await lecturesStore.addLecture(newLecture);
			if (result) {
				isOpen = false;
			} else {
				errorMessage = 'Impossibile aggiungere la lezione';
			}
		} catch (error) {
			errorMessage = error.message || 'Si è verificato un errore sconosciuto';
		}
	}
</script>

<AddModal 
	bind:isOpen={isOpen}
	onClose={() => isOpen = false}
	onCancel={() => isOpen = false}
	onSubmit={handleSubmit}
	title="Nuova Lezione"
	subtitle="Crea una nuova lezione"
	classes="bg-zinc-50 dark:bg-zinc-900 w-full max-h-[90vh] overflow-y-auto rounded-md shadow-md {classes}"
>
	<form onsubmit={handleSubmit} class="space-y-4">
		<div class="flex flex-col gap-2">
			<div class="flex flex-row items-center gap-2">
				<ls.Calendar class="w-4 h-4" />
				<label for="date" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
					Data
				</label>
			</div>
			<input 
				type="date" 
				id="date"
				bind:value={formData.date}
				class="w-full px-3 py-2 border border-zinc-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
				required
			/>
		</div>
		
		<div class="flex flex-col gap-2">
			<div class="flex flex-row items-center gap-2">
				<ls.User class="w-4 h-4" />
				<label for="student" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
					Studente
				</label>
			</div>
			<CustomSelect
				bind:value={formData.student_id}
				options={$studentsStore.students}
				labelKey={student => `${student.first_name} ${student.last_name}`}
				valueKey="id"
				placeholder="Seleziona uno studente"
				searchable
			/>
		</div>
		
		<div class="flex flex-col gap-2">
			<div class="flex flex-row items-center gap-2">
				<ls.BookOpen class="w-4 h-4" />
				<label for="subject" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
					Materia
				</label>
			</div>
			<CustomSelect
				bind:value={formData.subject_id}
				placeholder="Seleziona una materia"
				labelKey="name"
				valueKey="id"
				searchable
				options={$subjectsStore.subjects}
			/>
		</div>
		
		<div class="grid grid-cols-2 gap-4">
			<div class="flex flex-col gap-2">
				<div class="flex flex-row items-center gap-2">
					<ls.Clock class="w-4 h-4" />
					<label for="start-time" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
						Inizio
					</label>
				</div>
				<input 
					type="time" 
					id="start-time"
					bind:value={formData.start_time}
					class="w-full px-3 py-2 border border-zinc-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
					required
				/>
			</div>
			
			<div class="flex flex-col gap-2">
				<div class="flex flex-row items-center gap-2">
					<ls.Clock class="w-4 h-4" />
					<label for="end-time" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
						Fine
					</label>
				</div>
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
			<div class="flex flex-col gap-2">
				<div class="flex flex-row items-center gap-2">
					<ls.GraduationCap class="w-4 h-4" />
					<label for="level" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
						Livello
					</label>
				</div>
				<CustomSelect
					classes="min-w-60"
					options={levels}
					placeholder="Seleziona un livello"
					labelKey='label'
					valueKey='value'
					bind:value={formData.level}
					searchable={false}
				/>
			</div>

			<div class="flex flex-col gap-2">
				<div class="flex flex-row items-center gap-2">
					<ls.Euro class="w-4 h-4" />
					<label for="rate" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
						Prezzo Orario (€)
					</label>
				</div>
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

			<div class="flex flex-col gap-2">
				<div class="flex flex-row items-center gap-2">
					<ls.HandCoins class="w-4 h-4" />
					<label for="paid" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
						Pagato
					</label>
				</div>
				<input type="checkbox" id="paid" bind:checked={formData.paid} />
			</div>
		</div>
		
		{#if errorMessage}
			<div class="text-red-500 text-sm">{errorMessage}</div>
		{/if}
	</form>
</AddModal> 
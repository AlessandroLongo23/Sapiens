<script>
	import { calendarView, getMonthDays, weekDays, nextMonth, prevMonth, formatDateString } from '$lib/utils/date.svelte.js';
	import { capitalize } from '$lib/utils/string.svelte.js';
	import { studentsStore } from '$lib/stores/students/students.js';
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import * as ls from 'lucide-svelte';

	import CalendarDayStudent from '$lib/components/calendars/CalendarDayStudent.svelte';
	import Sidebar from '$lib/components/sidebar/Sidebar.svelte';

	const dispatch = createEventDispatcher();

	let { user } = $props();

	let isCalendarSidebarOpen = $state(false);
	let calendarSidebarElement = $state(null);
	let selectedDay = $state(null);
	let isSubmitting = $state(false);
	let isSubmitted = $state(false);

	let monthDays = $state([]);
	$effect(() => {
		if ($calendarView) {
			monthDays = getMonthDays();
		}
	})
	
	function handleDayClick(day) {
		dispatch('daySelected', day);
		selectedDay = day;
		isCalendarSidebarOpen = true;
	}
	
	function handleLectureSelected(event) {
		dispatch('lectureSelected', event.detail);
	}

	let calendarContainerMargin = $derived(isCalendarSidebarOpen ? 'mr-[24rem]' : 'mr-0');

	let formData = $derived.by(() => {
		const student = $studentsStore.students.find(student => student.id === user.id);
		return {
			student_id: user.id,
			first_name: student?.first_name,
			last_name: student?.last_name,
			date: formatDateString(selectedDay, 'yyyy-MM-dd'),
			start_time: '15:00',
			end_time: '16:00',
		}
	});

	async function handleSubmit(event) {
		event.preventDefault();
		isSubmitting = true;

		try {
			const response = await fetch('/api/request-lecture', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: 'Server error' }));
				throw new Error(errorData.error || 'Failed to request lecture');
			}

			const result = await response.json();

			if (result.success) {
				isSubmitted = true;
				// Reset the form after 4 seconds
				setTimeout(() => {
					isSubmitted = false;
					isCalendarSidebarOpen = false;
				}, 4000);
			} else {
				console.error('Submission error:', result.error);
			}
		} catch (error) {
			console.error('Submission error:', error);
		} finally {
			isSubmitting = false;
		}
	}

	function resetForm() {
		isSubmitted = false;
		isCalendarSidebarOpen = false;
	}
</script>

<div class="relative h-full flex flex-col {calendarContainerMargin} transition-all duration-200 ease-in-out gap-4">
	<div class="flex w-full justify-center items-center space-x-2">
		<button 
			onclick={prevMonth} 
			class="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
			aria-label="Previous month"
		>
			<ls.ChevronLeft size={20} />
		</button>

		<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-50 w-40 text-center">
			{capitalize(formatDateString($calendarView, 'MMMM yyyy'))}
		</h2>

		<button 
			onclick={nextMonth} 
			class="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
			aria-label="Next month"
		>
			<ls.ChevronRight size={20} />
		</button>
	</div>

	<div class="grid grid-cols-7">
		{#each weekDays as day}
			<div class="text-center text-sm font-semibold text-zinc-500 dark:text-zinc-400 py-2">
				{day}
			</div>
		{/each}
	</div>
	
	<div class="grid grid-cols-7 pt-0">
		{#each monthDays as day}
			<CalendarDayStudent
				day={day.date} 
				isCurrentMonth={day.isCurrentMonth}
				on:click={() => handleDayClick(day.date)} 
				on:lectureSelected={handleLectureSelected}
			/>
		{/each}
	</div>

	<Sidebar 
		bind:isSidebarOpen={isCalendarSidebarOpen}
		bind:sidebarElement={calendarSidebarElement}
		side="right"
		type="move"
		maxWidth="96"
		classes="bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 z-20 mt-18"
	>
		<div class="p-6 h-full flex flex-col">
			<button 
				onclick={() => isCalendarSidebarOpen = false}
				class="absolute top-6 right-6 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 p-2 border border-zinc-200 dark:border-zinc-700 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all duration-200 ease-in-out"
			>
				<ls.X size={20} class="text-zinc-900 dark:text-zinc-50"/>
			</button>

			{#if isSubmitted}
				<div class="flex flex-col items-center justify-center h-full text-center">
					<div class="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 flex items-center justify-center animate-pulse">
						<ls.CheckCircle class="w-10 h-10 text-green-600 dark:text-green-400" />
					</div>
					<h3 class="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
						Proposta Inviata!
					</h3>
					<p class="text-zinc-600 dark:text-zinc-400 text-sm mb-6 max-w-xs">
						La tua proposta di lezione per il <strong>{formatDateString(selectedDay, 'PPP')}</strong> è stata inviata con successo.
					</p>
					<p class="text-zinc-500 dark:text-zinc-500 text-xs mb-4">
						Ti contatterò presto per confermare la lezione.
					</p>
					<button
						onclick={resetForm}
						class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 text-sm"
					>
						Perfetto!
					</button>
				</div>
			{:else}
				<h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
					{capitalize(formatDateString(selectedDay, 'EEEE'))}
					<span class="block text-sm text-zinc-500 dark:text-zinc-400 font-normal">
						{formatDateString(selectedDay, 'PPP')}
					</span>
				</h2>

				<form onsubmit={handleSubmit} class="space-y-4">
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label for="start-time" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
								Inizio
							</label>
							<input 
								type="time" 
								id="start-time"
								bind:value={formData.start_time}
								class="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-zinc-100 transition-colors duration-200"
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
								class="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-zinc-100 transition-colors duration-200"
								required
							/>
						</div>
					</div>

					<button 
						type="submit"
						disabled={isSubmitting}
						class="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2"
					>
						{#if isSubmitting}
							<ls.Loader2 class="w-4 h-4 animate-spin" />
							Invio in corso...
						{:else}
							<ls.Send class="w-4 h-4" />
							Proponi lezione
						{/if}
					</button>
				</form>
			{/if}
		</div>
	</Sidebar>
</div>
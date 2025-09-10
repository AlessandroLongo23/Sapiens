<script>
	import { calendarView, getMonthDays, weekDays, nextMonth, prevMonth, formatDateString } from '$lib/utils/date.svelte.js';
	import { capitalize } from '$lib/utils/string.svelte.js';
	import { createEventDispatcher } from 'svelte';
	import * as ls from 'lucide-svelte';
	
	import CalendarDayStudent from '$lib/components/students/calendars/CalendarDayStudent.svelte';
	import ScheduleLessonModal from '$lib/components/students/calendars/ScheduleLessonModal.svelte';

	const dispatch = createEventDispatcher();

	let { user } = $props();

	let selectedDay = $state(null);
	let isModalOpen = $state(false);

	let monthDays = $state([]);
	$effect(() => {
		if ($calendarView) {
			monthDays = getMonthDays();
		}
	})
	
	function handleDayClick(day) {
		dispatch('daySelected', day);
	}
	
	function handleLectureSelected(event) {
		dispatch('lectureSelected', event.detail);
	}
	
	function handleScheduleModalOpen(event) {
		selectedDay = event.detail.day;
		isModalOpen = true;
	}
	
	function handleModalClose() {
		isModalOpen = false;
		selectedDay = null;
	}
</script>

<div class="relative h-full flex flex-col">
	<div class="flex w-full justify-between items-center py-4 mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-700">
		<div class="flex flex-row items-center gap-2">
			<div class="flex flex-col border border-zinc-200 dark:border-zinc-700 rounded-md justify-between items-center w-16 h-16">
				<span class="text-xs font-medium bg-zinc-200 text-zinc-500 dark:text-zinc-400 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-700 w-full text-center py-1">
					{formatDateString(new Date(), 'MMM')}
				</span>
				<span class="text-2xl font-bold text-zinc-900 dark:text-zinc-50 py-1">
					{formatDateString(new Date(), 'd')}
				</span>
			</div>
			<div class="text-xl font-bold text-zinc-700 dark:text-zinc-300 ml-2">
				{formatDateString(new Date(), 'MMMM yyyy')}
			</div>
		</div>

		<div class="flex flex-row gap-4 items-center">
			<div class="flex flex-row gap-6 mr-4">
				<div class="flex flex-row gap-2 justify-center items-center">
					<span class="h-2 w-2 rounded-full bg-green-500"></span>
					<span class="text-sm">Le mie Lezioni</span>
				</div>

				<div class="flex flex-row gap-2 justify-center items-center">
					<span class="h-2 w-2 rounded-full bg-amber-500"></span>
					<span class="text-sm">Le mie Proposte</span>
				</div>

				<div class="flex flex-row gap-2 justify-center items-center">
					<span class="h-2 w-2 rounded-full bg-red-500"></span>
					<span class="text-sm">Non disponibile</span>
				</div>
			</div>

			<div class="flex flex-row justify-between items-center border border-zinc-200 dark:border-zinc-700 rounded-md w-54">
				<button 
					onclick={prevMonth} 
					class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-l-md"
					aria-label="Previous month"
				>
					<ls.ChevronLeft size={18} />
				</button>
				
				<button 
					onclick={() => {
						$calendarView = new Date();
						monthDays = getMonthDays();
					}} 
					class="flex-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 "
				>
					{capitalize(formatDateString($calendarView, 'MMMM yyyy'))}
				</button>
				
				<button 
					onclick={nextMonth} 
					class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-r-md"
					aria-label="Next month"
				>
					<ls.ChevronRight size={18} />
				</button>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-7">
		{#each weekDays as day}
			<div class="text-center text-xs font-medium text-zinc-500 dark:text-zinc-400 py-2 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-700">
				{day}
			</div>
		{/each}
	</div>
		
	<div class="grid grid-cols-7 pt-0 gap-0 border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
		{#each monthDays as day}
			<CalendarDayStudent
				user={user}
				day={day.date} 
				isCurrentMonth={day.isCurrentMonth}
				on:click={() => handleDayClick(day.date)} 
				on:lectureSelected={handleLectureSelected}
				on:openScheduleModal={handleScheduleModalOpen}
			/>
		{/each}
	</div>

	<ScheduleLessonModal 
		isOpen={isModalOpen} 
		selectedDay={selectedDay} 
		user={user}
		on:close={handleModalClose}
	/>
</div>
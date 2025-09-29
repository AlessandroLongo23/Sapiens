<script>
	import { calendarView, getMonthDays, weekDays, nextMonth, prevMonth, formatDateString } from '$lib/utils/date.svelte.js';
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import * as ls from 'lucide-svelte';
	import { cardStyle } from '$lib/const/appearance.js';
	
	import CalendarDay from '$lib/components/admin/calendars/CalendarDayAdmin.svelte';

	const dispatch = createEventDispatcher();

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
</script>

<div class='w-full flex flex-col {cardStyle} gap-4 p-4'>
	<div class="flex items-center justify-between">
		<div class="flex-1 flex flex-row gap-2 items-center text-lg font-semibold text-zinc-900 dark:text-zinc-50">
			<ls.Calendar class='size-5'/>
			<span class="text-zinc-800 dark:text-zinc-200">
				Calendario
			</span>
		</div>

		<div class="flex-1 flex flex-row gap-2 items-center justify-center">
			<button 
				onclick={prevMonth} 
				class="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
				aria-label="Previous month"
			>
				<ls.ChevronLeft class="size-5" />
			</button>
			<div class="w-40 flex flex-row gap-2 items-center text-lg font-semibold text-zinc-900 dark:text-zinc-50 justify-center">
				{formatDateString($calendarView, 'MMMM yyyy')}
			</div>
			<button 
				onclick={nextMonth} 
				class="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
				aria-label="Next month"
			>
				<ls.ChevronRight class="size-5" />
			</button>
		</div>

		<div class="flex-1"></div>
	</div>
	
	<div class="grid grid-cols-7 gap-1 px-4 pb-2">
		{#each weekDays as day}
			<div class="text-center text-sm font-semibold text-zinc-500 dark:text-zinc-400 py-2">
				{day}
			</div>
		{/each}
	</div>
	
	<div class="grid grid-cols-7 gap-1 p-4 pt-0">
		{#each monthDays as day}
			<CalendarDay
				day={day.date} 
				isCurrentMonth={day.isCurrentMonth}
				on:click={() => handleDayClick(day.date)} 
				on:lectureSelected={handleLectureSelected}
			/>
		{/each}
	</div>
</div> 
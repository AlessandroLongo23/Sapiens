<script>
	import { calendarView, getMonthDays, weekDays, nextMonth, prevMonth, formatDateString } from '$lib/utils/date.svelte.js';
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import * as ls from 'lucide-svelte';
	import { cardStyle } from '$lib/stores/appearance.js';
	
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

<div class={`w-full flex flex-col ${cardStyle}`}>
	<div class="flex items-center justify-between p-4">
		<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-50 ps-2">
			{formatDateString($calendarView, 'MMMM yyyy')}
		</h2>
		<div class="flex items-center space-x-2">
			<button 
				onclick={prevMonth} 
				class="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
				aria-label="Previous month"
			>
				<ls.ChevronLeft size={20} />
			</button>
			<button 
				onclick={nextMonth} 
				class="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
				aria-label="Next month"
			>
				<ls.ChevronRight size={20} />
			</button>
		</div>
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
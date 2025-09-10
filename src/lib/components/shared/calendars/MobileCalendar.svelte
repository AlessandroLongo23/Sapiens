<script>
	import { calendarView, getMonthDays, weekDays, nextMonth, prevMonth, formatDateString } from '$lib/utils/date.svelte.js';
	import { createEventDispatcher } from 'svelte';
	import { format, isToday, isSameDay } from 'date-fns';
	import { it } from 'date-fns/locale';
	import * as ls from 'lucide-svelte';
	import { lecturesStore } from '$lib/stores/lectures/lectures.js';
	import { cardStyle } from '$lib/stores/appearance.js';
	import MobileBottomSheet from '$lib/components/shared/ui/MobileBottomSheet.svelte';
	import BottomSheetContent from '$lib/components/shared/calendars/BottomSheetContent.svelte';
	
	const dispatch = createEventDispatcher();
	
	let monthDays = $state([]);
	let selectedDate = $state(null);
	let isBottomSheetOpen = $state(false);
	
	$effect(() => {
		if ($calendarView) {
			monthDays = getMonthDays();
		}
	});
	
	let selectedDayLectures = $derived.by(() => {
		if (!selectedDate) return [];
		
		return $lecturesStore.lectures
			.filter(lecture => isSameDay(new Date(lecture.date), selectedDate))
			.sort((a, b) => a.start_time.localeCompare(b.start_time));
	});
	
	function handleDayClick(day) {
		selectedDate = day;
		isBottomSheetOpen = true;
		dispatch('daySelected', day);
	}
	
	function hasLectures(day) {
		return $lecturesStore.lectures.some(lecture => 
			isSameDay(new Date(lecture.date), new Date(day))
		);
	}
	
	function hasPendingLectures(day) {
		return $lecturesStore.lectures.some(lecture => 
			isSameDay(new Date(lecture.date), new Date(day)) && 
			lecture.status === 'pending'
		);
	}
	
	function closeBottomSheet() {
		isBottomSheetOpen = false;
	}
	
	function handleLectureClick(lecture) {
		dispatch('lectureSelected', lecture);
		closeBottomSheet();
	}
</script>

<div class={`w-full flex flex-col ${cardStyle}`}>
	<div class="flex items-center justify-between p-4">
		<h2 class="text-lg font-medium text-zinc-900 dark:text-zinc-50">
			{formatDateString($calendarView, 'MMMM yyyy')}
		</h2>
		<div class="flex items-center space-x-2">
			<button 
				onclick={prevMonth} 
				class="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
				aria-label="Previous month"
			>
				<ls.ChevronLeft size={18} />
			</button>
			<button 
				onclick={nextMonth} 
				class="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
				aria-label="Next month"
			>
				<ls.ChevronRight size={18} />
			</button>
		</div>
	</div>
	
	<div class="grid grid-cols-7 gap-1 px-2">
		{#each weekDays as day}
			<div class="text-center text-xs font-medium text-zinc-500 dark:text-zinc-400 py-1">
				{day.substring(0, 1)}
			</div>
		{/each}
	</div>
	
	<div class="grid grid-cols-7 gap-1 p-2">
		{#each monthDays as day}
			{@const isDayToday = isToday(day.date)}
			{@const hasLecturesForDay = hasLectures(day.date)}
			{@const hasPendingLecturesForDay = hasPendingLectures(day.date)}
			
			<button 
				class="flex flex-col items-center justify-center aspect-square relative"
				class:opacity-40={!day.isCurrentMonth}
				onclick={() => day.isCurrentMonth && handleDayClick(day.date)}
				disabled={!day.isCurrentMonth}
			>
				<div 
					class="h-8 w-8 rounded-full flex items-center justify-center text-sm
						{!day.isCurrentMonth ? 'text-zinc-300 dark:text-zinc-600' : 
						isDayToday ? 'bg-blue-50 text-blue-600 font-medium dark:bg-blue-950 dark:text-blue-300' : 
						'text-zinc-900 dark:text-zinc-100'}"
				>
					{format(day.date, 'd')}
				</div>
				
				{#if day.isCurrentMonth && (hasLecturesForDay || hasPendingLecturesForDay)}
					<div class="absolute bottom-0 flex gap-1 justify-center">
						{#if hasPendingLecturesForDay}
							<div class="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
						{/if}
						{#if hasLecturesForDay && !hasPendingLecturesForDay}
							<div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
						{/if}
					</div>
				{/if}
			</button>
		{/each}
	</div>
</div>

<MobileBottomSheet 
	bind:isOpen={isBottomSheetOpen}
	title={selectedDate ? formatDateString(selectedDate, 'EEEE, d MMMM') : ''}
	on:close={closeBottomSheet}
	contentComponent={selectedDate ? BottomSheetContent : null}
	{selectedDate}
	{selectedDayLectures}
	{handleLectureClick}
/>

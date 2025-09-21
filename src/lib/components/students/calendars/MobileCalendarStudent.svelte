<script>
	import { calendarView, getMonthDays, weekDays, nextMonth, prevMonth, formatDateString } from '$lib/utils/date.svelte.js';
	import { createEventDispatcher } from 'svelte';
	import { format, isToday, isSameDay, isPast, isFuture, startOfToday } from 'date-fns';
	import { it } from 'date-fns/locale';
	import * as ls from 'lucide-svelte';
	import { lecturesStore } from '$lib/stores/lectures.js';
	import { subjectsStore } from '$lib/stores/subjects.js';
	import { cardStyle } from '$lib/const/appearance.js';
	import { fade, fly } from 'svelte/transition';
	import { capitalize } from '$lib/utils/string.svelte.js';
	import ScheduleLessonModal from './ScheduleLessonModal.svelte';
	
	let { user } = $props();
	
	const dispatch = createEventDispatcher();
	
	// State
	let monthDays = $state([]);
	let selectedDate = $state(null);
	let isBottomSheetOpen = $state(false);
	let showScheduleModal = $state(false);
	
	// Get calendar days when the month changes
	$effect(() => {
		if ($calendarView) {
			monthDays = getMonthDays();
		}
	});
	
	let selectedDayLectures = $derived.by(() => {
		if (!selectedDate) return [];
		
		return $lecturesStore.lectures
			.filter(lecture => isSameDay(new Date(lecture.date), selectedDate))
			.sort((a, b) => a.start_time.localeCompare(b.start_time))
			.map(lecture => ({
				...lecture,
				subject: $subjectsStore.subjects.find(subject => subject.id === lecture.subject_id)
			}));
	});
	
	// Handle day selection
	function handleDayClick(day) {
		selectedDate = day;
		isBottomSheetOpen = true;
	}
	
	// Check if a day has user's lectures
	function hasUserLectures(day) {
		return $lecturesStore.lectures.some(lecture => 
			isSameDay(new Date(lecture.date), new Date(day)) &&
			lecture.student_id === user.id
		);
	}
	
	// Check if a day has other students' lectures
	function hasOtherLectures(day) {
		return $lecturesStore.lectures.some(lecture => 
			isSameDay(new Date(lecture.date), new Date(day)) &&
			lecture.student_id !== user.id
		);
	}
	
	// Close bottom sheet
	function closeBottomSheet() {
		isBottomSheetOpen = false;
	}
	
	// Open schedule modal
	function openScheduleModal() {
		showScheduleModal = true;
		isBottomSheetOpen = false;
	}
	
	function closeScheduleModal() {
		showScheduleModal = false;
	}
	
	// Check if a day is in the past
	function isDayPast(day) {
		return isPast(day) && !isToday(day);
	}
	
	// Check if a day is in the future or today
	function isDayInFuture(day) {
		return isFuture(day) || isToday(day);
	}
	
	// Go to today
	function goToToday() {
		const today = new Date();
		$calendarView = new Date(today.getFullYear(), today.getMonth(), 1);
	}
</script>

<div class={`w-full flex flex-col ${cardStyle}`}>
	<!-- Calendar header -->
	<div class="flex items-center justify-between p-4">
		<div>
			<h2 class="text-lg font-medium text-zinc-900 dark:text-zinc-50">
				{formatDateString($calendarView, 'MMMM yyyy')}
			</h2>
			<div class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
				{formatDateString(new Date(), 'EEEE, d MMMM')}
			</div>
		</div>
		<div class="flex items-center space-x-2">
			<button 
				onclick={goToToday} 
				class="px-2 py-1 text-xs font-medium rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
			>
				Oggi
			</button>
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
	
	<!-- Legend -->
	<div class="flex items-center justify-center gap-4 px-4 pb-3 text-xs">
		<div class="flex items-center gap-1.5">
			<div class="w-2.5 h-2.5 rounded-full bg-green-500"></div>
			<span class="text-zinc-600 dark:text-zinc-400">Le mie lezioni</span>
		</div>
		<div class="flex items-center gap-1.5">
			<div class="w-2.5 h-2.5 rounded-full bg-red-500"></div>
			<span class="text-zinc-600 dark:text-zinc-400">Occupato</span>
		</div>
	</div>
	
	<!-- Weekday headers -->
	<div class="grid grid-cols-7 gap-1 px-2">
		{#each weekDays as day}
			<div class="text-center text-xs font-medium text-zinc-500 dark:text-zinc-400 py-1">
				{day.substring(0, 1)}
			</div>
		{/each}
	</div>
	
	<!-- Calendar days -->
	<div class="grid grid-cols-7 gap-1 p-2">
		{#each monthDays as day}
			{@const isDayToday = isToday(day.date)}
			{@const hasUserLecturesForDay = hasUserLectures(day.date)}
			{@const hasOtherLecturesForDay = hasOtherLectures(day.date)}
			{@const isPastDay = isDayPast(day.date)}
			
			<div 
				class="flex flex-col items-center justify-center aspect-square relative"
				class:opacity-40={!day.isCurrentMonth}
			>
				<button 
					class="h-8 w-8 rounded-full flex items-center justify-center text-sm relative"
					class:opacity-40={!day.isCurrentMonth}
					class:text-zinc-400={isPastDay && day.isCurrentMonth}
					class:dark:text-zinc-500={isPastDay && day.isCurrentMonth}
					class:text-zinc-300={!day.isCurrentMonth}
					class:dark:text-zinc-600={!day.isCurrentMonth}
					class:bg-blue-50={isDayToday}
					class:text-blue-600={isDayToday}
					class:dark:bg-blue-950={isDayToday}
					class:dark:text-blue-300={isDayToday}
					class:text-zinc-900={!isDayToday && !isPastDay && day.isCurrentMonth}
					class:dark:text-zinc-100={!isDayToday && !isPastDay && day.isCurrentMonth}
					onclick={() => day.isCurrentMonth && handleDayClick(day.date)}
					disabled={!day.isCurrentMonth}
				>
					{format(day.date, 'd')}
				</button>
				
				<!-- Indicators for lectures -->
				{#if day.isCurrentMonth && (hasUserLecturesForDay || hasOtherLecturesForDay)}
					<div class="absolute bottom-0 flex gap-1 justify-center">
						{#if hasUserLecturesForDay}
							<div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
						{/if}
						{#if hasOtherLecturesForDay}
							<div class="w-1.5 h-1.5 rounded-full bg-red-500"></div>
						{/if}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

{#if isBottomSheetOpen}
	<!-- Simple Bottom Sheet Implementation -->
	<!-- Overlay -->
	<button 
		class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 border-0"
		onclick={closeBottomSheet}
		transition:fade={{ duration: 200 }}
		aria-label="Close sheet"
	></button>
	
	<!-- Bottom Sheet -->
	<div 
		class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 rounded-t-2xl shadow-lg"
		style="height: 50vh;"
		transition:fly={{ y: '100%', duration: 300 }}
	>
		<!-- Handle for dragging -->
		<div class="w-full flex justify-center pt-2 pb-4">
			<div class="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
		</div>
		
		<!-- Header -->
		<div class="px-4 pb-3 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-700">
			<h2 class="text-lg font-medium text-zinc-900 dark:text-zinc-50">
				{selectedDate ? formatDateString(selectedDate, 'EEEE, d MMMM') : ''}
			</h2>
			<button 
				onclick={closeBottomSheet}
				class="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
				aria-label="Close"
			>
				<ls.X size={18} />
			</button>
		</div>
		
		<!-- Content -->
		<div class="p-4 overflow-y-auto" style="max-height: calc(50vh - 80px);">
			{#if selectedDayLectures.length > 0}
				<div class="space-y-3">
					{#each selectedDayLectures as lecture}
						{@const isUserLecture = lecture.student_id === user.id}
						<div 
							class="p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg
								{isUserLecture ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'}"
						>
							<div class="flex justify-between items-start">
								<div class="flex flex-col">
									<div class="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
										<ls.Clock size={14} />
										{lecture.start_time} - {lecture.end_time}
									</div>
									
									{#if isUserLecture}
										<div class="text-sm text-zinc-600 dark:text-zinc-300 flex items-center gap-2 mt-1">
											<ls.BookOpen size={14} />
											{lecture.subject?.name || 'Materia non specificata'}
										</div>
									{:else}
										<div class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
											Occupato
										</div>
									{/if}
								</div>
								
								{#if isUserLecture}
									<span class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
										La mia lezione
									</span>
								{:else}
									<span class="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs font-medium">
										Occupato
									</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center py-8 text-center">
					<div class="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
						<ls.Calendar class="text-zinc-400 dark:text-zinc-500" size={24} />
					</div>
					<h3 class="text-base font-medium text-zinc-900 dark:text-zinc-100">Nessuna lezione</h3>
					<p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Non ci sono lezioni programmate per questa data.</p>
				</div>
			{/if}
			
			{#if selectedDate && isDayInFuture(selectedDate)}
				<div class="mt-6 flex justify-center">
					<button 
						onclick={openScheduleModal}
						class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
					>
						<ls.Plus size={16} />
						Proponi lezione
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}

{#if showScheduleModal && selectedDate}
	<ScheduleLessonModal 
		isOpen={showScheduleModal}
		{selectedDate}
		{user}
		on:close={closeScheduleModal}
	/>
{/if}
<script>
	import { calendarView, isSelectedDate } from '$lib/utils/date.svelte.js';
	import { lecturesStore } from '$lib/stores/lectures.js';
	import { studentsStore } from '$lib/stores/students.js';
	import { subjectsStore } from '$lib/stores/subjects.js';
	import { isToday, format, isSameDay, isPast, startOfToday, isFuture } from 'date-fns';
	import { it } from 'date-fns/locale';
	import { createEventDispatcher } from 'svelte';
	import * as ls from 'lucide-svelte';

	let { 
		user,
		day, 
		isCurrentMonth = true 
	} = $props();
	
	const dispatch = createEventDispatcher();

	let isHovered = $state(false);
	let showModal = $state(false);

	let hasLectures = $derived.by(() => {
		return $lecturesStore.lectures.some(lecture => isSameDay(new Date(lecture.date), new Date(day)));
	});
	
	let lectureCount = $derived.by(() => {
		return $lecturesStore.lectures.filter(lecture => isSameDay(new Date(lecture.date), new Date(day))).length;
	});

	let dayLectures = $derived.by(() => {
		return $lecturesStore.lectures
			.filter(lecture => isSameDay(new Date(lecture.date), new Date(day)))
			.sort((a, b) => a.start_time.localeCompare(b.start_time))
			.map(lecture => ({
				...lecture,
				student: $studentsStore.students.find(student => student.id === lecture.student_id),
				subject: $subjectsStore.subjects.find(subject => subject.id === lecture.subject_id)
			}));
	});

	let isDayToday = $derived(isToday(day));
	let isSelected = $derived(isSelectedDate(day));
	let isDayPast = $derived(isPast(day) && !isToday(day));
	let isDayInFuture = $derived(isFuture(day) || isToday(day));
	
	let dayClasses = $derived.by(() => {
		if (!isCurrentMonth) {
			return `text-zinc-300 dark:text-zinc-600`;
		}
		
		if (isDayPast) {
			return `text-zinc-400 dark:text-zinc-500`;
		}
		
		if (isSelected) {
			return `bg-blue-100 text-blue-700 font-semibold dark:bg-blue-900 dark:text-blue-100`;
		}
		
		return `text-zinc-900 dark:text-zinc-100`;
	});
	
	function handleClick() {
		if (isCurrentMonth) {
			dispatch('click', day);
		}
	}

	function handleLectureClick(lecture, event) {
		event.stopPropagation();
		dispatch('lectureSelected', lecture);
	}
	
	function openScheduleModal(event) {
		event.stopPropagation();
		
		if (isDayPast) {
			return; 
		}
		
		showModal = true;
		dispatch('openScheduleModal', { day });
	}
	
	function handleModalClose() {
		showModal = false;
	}
</script>

<div 
	class="flex flex-col items-center relative w-full h-28 bg-white dark:bg-zinc-900 border-r border-b border-zinc-200 dark:border-zinc-700"
	class:opacity-40={!isCurrentMonth}
	onmouseenter={() => isHovered = isCurrentMonth}
	onmouseleave={() => isHovered = false}
	role="button"
	tabindex="0"
>
	<button 
		class="{isHovered && isCurrentMonth && isDayInFuture ? 'opacity-100' : 'opacity-0'} absolute top-1 right-1 z-10 size-6 bg-zinc-200 hover:bg-zinc-300 text-white rounded-sm flex items-center justify-center transition-all duration-200"
		onclick={isHovered && isCurrentMonth && isDayInFuture && openScheduleModal}
		aria-label="Schedule lesson"
		disabled={!isDayInFuture}
	>
		<ls.Plus size={12} class="text-zinc-900 dark:text-zinc-100"/>
	</button>

	<button 
		class='w-full h-full flex flex-col items-start justify-start p-2 relative {dayClasses}'
		onclick={handleClick}
		aria-label="Select {format(day, 'PPP', { locale: it })}"
	>
		<span class="text-sm font-medium {isDayToday ? 'text-white bg-blue-600 rounded-full w-7 h-7 flex items-center justify-center' : ''}">
			{format(day, 'd', { locale: it })}
		</span>
		
		<div class="mt-auto w-full">
			{#if dayLectures.length > 0 && isCurrentMonth}
				{#each dayLectures as dayLecture}
					{#if dayLecture.student_id === user.id}
						<div class="{dayLecture.status == 'accepted' ? 'bg-green-500/20 border-l-2 border-green-500' : 'bg-amber-500/20 border-l-2 border-amber-500'} flex flex-row w-full gap-1 justify-between items-center px-1 py-0.5 my-0.5 text-xs rounded-r-sm">
							<span class="font-medium">{dayLecture.start_time}</span>
							<span class="truncate text-xs text-zinc-500">-</span>
							<span class="font-medium">{dayLecture.end_time}</span>
						</div>
					{:else if dayLecture.status == 'accepted'}
						<div class="flex flex-row w-full gap-1 justify-between items-center px-1 py-0.5 my-0.5 text-xs bg-red-500/20 border-l-2 border-red-500 rounded-r-sm">
							<span class="font-medium text-zinc-700 dark:text-zinc-300">{dayLecture.start_time} - {dayLecture.end_time}</span>
							<span class="text-xs text-red-600 dark:text-red-400 font-medium">Occupato</span>
						</div>
					{/if}
				{/each}
			{/if}
		</div>
	</button>
</div>
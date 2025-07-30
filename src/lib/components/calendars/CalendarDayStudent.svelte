<script>
	import { calendarView, isSelectedDate } from '$lib/utils/date.svelte.js';
	import { lecturesStore } from '$lib/stores/lectures/lectures.js';
	import { studentsStore } from '$lib/stores/students/students.js';
	import { subjectsStore } from '$lib/stores/subjects/subjects.js';
	import { isToday, format, isSameDay } from 'date-fns';
	import { it } from 'date-fns/locale';
	import { createEventDispatcher } from 'svelte';
	import * as ls from 'lucide-svelte';

	let { 
		user,
		day, 
		isCurrentMonth = true 
	} = $props();
	
	const dispatch = createEventDispatcher();

	let showTooltip = $state(false);
	let mouseOverTooltip = $state(false);

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
	
	let dayClasses = $derived.by(() => {
		if (!isCurrentMonth) {
			return `text-zinc-300 dark:text-zinc-600`;
		}
		
		if (isSelected) {
			return `bg-blue-100 text-blue-700 font-semibold dark:bg-blue-900 dark:text-blue-100`;
		}
		
		if (isDayToday) {
			return `bg-blue-50 text-blue-600 font-medium dark:bg-blue-950 dark:text-blue-300`;
		}
		
		return `hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100`;
	});
	
	function handleClick() {
		if (isCurrentMonth) {
			dispatch('click', day);
		}
	}

	function handleLectureClick(lecture, event) {
		event.stopPropagation();
		dispatch('lectureSelected', lecture);
		showTooltip = false;
	}
	
	function handleMouseLeave() {
		setTimeout(() => {
			if (!mouseOverTooltip) {
				showTooltip = false;
			}
		}, 100);
	}
</script>

<div 
	class="flex flex-col items-center relative w-full h-28 border border-zinc-200 dark:border-zinc-700"
	class:opacity-40={!isCurrentMonth}
>
	<button 
		class='w-full h-full flex items-center justify-center relative {dayClasses}'
		onclick={handleClick}
		onmouseenter={() => { if (dayLectures.length > 0 && isCurrentMonth) showTooltip = true; }}
		onmouseleave={handleMouseLeave}
		aria-label="Select {format(day, 'PPP', { locale: it })}"
	>
		<span class="text-sm absolute top-2 left-1/2 transform -translate-x-1/2">
			{format(day, 'd', { locale: it })}
		</span>
		
		<div class="flex flex-col justify-center items-start absolute p-4 w-full left-1/2 transform -translate-x-1/2">
			{#if dayLectures.length > 0 && isCurrentMonth}
				{#each dayLectures as dayLecture}
					{#if dayLecture.student_id === user.id}
						<div class="flex flex-row w-full gap-1 justify-center items-center bg-green-500/50 rounded-md">
							<span class="text-xs text-zinc-900 dark:text-zinc-100 p-1">{dayLecture.start_time} - {dayLecture.end_time}</span>
						</div>
					{/if}
				{/each}
			{/if}
		</div>
	</button>
</div> 
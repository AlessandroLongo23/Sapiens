<script>
	import { calendarView, isSelectedDate } from '$lib/utils/date.svelte.js';
	import { Calendar, Clock, BookOpen, User } from 'lucide-svelte';
	import { lecturesStore } from '$lib/stores/lectures.svelte.js';
	import { isToday, format, isSameDay } from 'date-fns';
	import { createEventDispatcher } from 'svelte';

	let { day, isCurrentMonth = true } = $props();
	
	const dispatch = createEventDispatcher();

	let showTooltip = $state(false);
	let mouseOverTooltip = $state(false);

	let hasLectures = $derived.by(() => {
		return lecturesStore.lectures.some(lecture => isSameDay(new Date(lecture.date), new Date(day)));
	});
	
	let lectureCount = $derived.by(() => {
		return lecturesStore.lectures.filter(lecture => isSameDay(new Date(lecture.date), new Date(day))).length;
	});

	let dayLectures = $derived.by(() => {
		return lecturesStore.lectures
			.filter(lecture => isSameDay(new Date(lecture.date), new Date(day)))
			.sort((a, b) => a.start_time.localeCompare(b.start_time));
	});

	let isDayToday = $derived(isToday(day));
	let isSelected = $derived(isSelectedDate(day));
	
	let dayClasses = $derived.by(() => {
		const baseClasses = "h-10 w-10 rounded-full flex items-center justify-center text-sm relative";
		
		if (!isCurrentMonth) {
			return `${baseClasses} text-zinc-300 dark:text-zinc-600`;
		}
		
		if (isSelected) {
			return `${baseClasses} bg-blue-100 text-blue-700 font-semibold dark:bg-blue-900 dark:text-blue-100`;
		}
		
		if (isDayToday) {
			return `${baseClasses} bg-blue-50 text-blue-600 font-medium dark:bg-blue-950 dark:text-blue-300`;
		}
		
		return `${baseClasses} hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100`;
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
	class="flex flex-col items-center py-1 relative"
	class:opacity-40={!isCurrentMonth}
>
	<button 
		class={dayClasses}
		onclick={handleClick}
		onmouseenter={() => { if (dayLectures.length > 0 && isCurrentMonth) showTooltip = true; }}
		onmouseleave={handleMouseLeave}
		aria-label="Select {format(day, 'PPP')}"
	>
		{format(day, 'd')}
		
		<div class="flex flex-row gap-1 justify-center items-center absolute bottom-1 left-1/2 transform -translate-x-1/2 translate-y-1/4">
			{#if dayLectures.length > 0 && isCurrentMonth}
				{#each dayLectures as dayLecture}
					<span class="w-1.5 h-1.5 rounded-full {dayLecture.paid ? 'bg-green-500' : 'bg-red-500'}"></span>
				{/each}
			{/if}
		</div>
	</button>
	
	{#if showTooltip && dayLectures.length > 0}
		<div 
			role="tooltip"
			class="
				absolute z-10 top-full mt-1 left-1/2 transform -translate-x-1/2 
				flex flex-col min-w-48 max-w-64
				bg-white dark:bg-zinc-800 shadow-lg rounded-md border border-zinc-200 dark:border-zinc-700
			"
			onmouseenter={() => { mouseOverTooltip = true; }}
			onmouseleave={() => { mouseOverTooltip = false; showTooltip = false; }}
		>
			<div class="text-xs font-medium text-zinc-500 dark:text-zinc-400 p-3 flex flex-row gap-2 items-center">
				<Calendar size={12} />
				{format(day, 'EEEE, MMMM d')}
			</div>

			<div class="flex flex-col max-h-64 overflow-y-auto">
				{#each dayLectures as lecture}
					<hr class="border-zinc-200 dark:border-zinc-700">
					<button 
						class="flex flex-col gap-1 w-full text-left rounded text-xs hover:bg-zinc-100 dark:hover:bg-zinc-700 transition p-3"
						onclick={(e) => handleLectureClick(lecture, e)}
					>
						<div class="flex justify-between">
							<span class="font-medium text-zinc-900 dark:text-zinc-100 flex flex-row gap-2 items-center">
								<Clock size={12} />
								{lecture.start_time} - {lecture.end_time}
							</span>
						</div>
						<div class="text-zinc-600 dark:text-zinc-300 flex flex-row gap-2 items-center">
							<User size={12} />
							{#if lecture.student}
								{lecture.student.name} {lecture.student.last_name}
							{:else}
								Unknown Student
							{/if}
						</div>
						{#if lecture.subject}
							<div class="text-zinc-500 dark:text-zinc-400 truncate flex flex-row gap-2 items-center">
								<BookOpen size={12} />
								{lecture.subject.name}
							</div>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div> 
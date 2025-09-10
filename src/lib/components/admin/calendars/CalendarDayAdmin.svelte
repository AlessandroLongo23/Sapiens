<script>
	import { calendarView, isSelectedDate } from '$lib/utils/date.svelte.js';
	import { lecturesStore } from '$lib/stores/lectures/lectures.js';
	import { studentsStore } from '$lib/stores/students/students.js';
	import { subjectsStore } from '$lib/stores/subjects/subjects.js';
	import { isToday, format, isSameDay } from 'date-fns';
	import { it } from 'date-fns/locale';
	import { createEventDispatcher } from 'svelte';
	import * as ls from 'lucide-svelte';
	import { messagePopup } from '$lib/components/shared/ui/messagePopup/messagePopup.js';

	let { day, isCurrentMonth = true } = $props();
	
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

	async function handleAcceptLecture(lecture, event) {
		let student = $studentsStore.students.find(student => student.id === lecture.student_id);
		let subject = $subjectsStore.subjects.find(subject => subject.id === lecture.subject_id);
		try {
			let updatedLecture = {
				...lecture,
				student_id: student.id,
				subject_id: subject.id,
				status: 'accepted' 
			};
			delete updatedLecture.student;
			delete updatedLecture.subject;

			const result = await lecturesStore.updateLecture(lecture.id, updatedLecture);
			
			if (result) {
				messagePopup.success(`Lezione con ${student.first_name} ${student.last_name} accettata con successo.`);
			} else {
				console.error('Error accepting lecture:', error);
				messagePopup.error('Si è verificato un errore durante l\'accettazione della lezione.');
				throw new Error('Impossibile accettare la lezione');
			}
		} catch (error) {
			console.error('Error accepting lecture:', error);
			messagePopup.error('Si è verificato un errore durante l\'accettazione della lezione.');
		}
	}
	
	async function handleRefuseLecture(lecture, event) {
		let student = $studentsStore.students.find(student => student.id === lecture.student_id);
		try {
			const result = await lecturesStore.deleteLecture(lecture.id);
			
			if (result) {
				messagePopup.success(`Lezione con ${student.first_name} ${student.last_name} rifiutata con successo.`);
			} else {
				throw new Error('Impossibile rifiutare la lezione');
			}
		} catch (error) {
			console.error('Error refusing lecture:', error);
			messagePopup.error('Si è verificato un errore durante il rifiuto della lezione.');
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
		aria-label="Select {format(day, 'PPP', { locale: it })}"
	>
		{format(day, 'd', { locale: it })}
		
		<div class="flex flex-row gap-1 justify-center items-center absolute bottom-1 left-1/2 transform -translate-x-1/2 translate-y-1/4">
			{#if dayLectures.length > 0 && isCurrentMonth}
				{#each dayLectures as dayLecture}
					<span class="w-1.5 h-1.5 rounded-full {dayLecture.paid ? 'bg-green-500' : dayLecture.status == 'accepted' ? 'bg-red-500' : 'bg-amber-500'}"></span>
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
				<ls.Calendar size={12} />
				{format(day, 'EEEE, MMMM d', { locale: it })}
			</div>

			<div class="flex flex-col max-h-64 overflow-y-auto">
				{#each dayLectures as lecture}
					<hr class="border-zinc-200 dark:border-zinc-700">
					<div class="flex flex-col w-full">
						<button 
							class="flex flex-col gap-1 w-full text-left rounded text-xs hover:bg-zinc-100 dark:hover:bg-zinc-700 transition p-3"
							onclick={(e) => handleLectureClick(lecture, e)}
						>
							<div class="flex justify-between">
								<span class="font-medium text-zinc-900 dark:text-zinc-100 flex flex-row gap-2 items-center">
									<ls.Clock size={12} />
									{lecture.start_time} - {lecture.end_time}
								</span>
								{#if lecture.status === 'pending'}
									<span class="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded text-[10px] font-medium">
										In attesa
									</span>
								{/if}
							</div>
							<div class="text-zinc-600 dark:text-zinc-300 flex flex-row gap-2 items-center">
								<ls.User size={12} />
								{lecture.student.first_name} {lecture.student.last_name}
							</div>
							<div class="text-zinc-500 dark:text-zinc-400 truncate flex flex-row gap-2 items-center">
								<ls.BookOpen size={12} />
								{lecture.subject.name}
							</div>
						</button>
						
						{#if lecture.status === 'pending'}
							<div class="flex justify-end px-3 pb-2">
								<div class="flex gap-2">
									<button 
										onclick={(e) => handleAcceptLecture(lecture, e)}
										class="p-1.5 rounded-full bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/50 dark:hover:bg-green-900 dark:text-green-400 transition"
										title="Accetta lezione"
									>
										<ls.Check size={14} />
									</button>
									<button 
										onclick={(e) => handleRefuseLecture(lecture, e)}
										class="p-1.5 rounded-full bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/50 dark:hover:bg-red-900 dark:text-red-400 transition"
										title="Rifiuta lezione"
									>
										<ls.X size={14} />
									</button>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div> 
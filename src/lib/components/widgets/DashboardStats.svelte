<script>
	import { formatCurrency, formatDateDisplay, calculateEarnings } from '$lib/utils/format.svelte.js';
	import { subjectsStore } from '$lib/stores/subjects/subjects.js';
	import { studentsStore } from '$lib/stores/students/students.js';
	import { lecturesStore } from '$lib/stores/lectures/lectures.js';	
	import { isSameDay } from 'date-fns';
	import * as ls from 'lucide-svelte';

	let totalTime = $derived.by(() => {
		let total = $lecturesStore.lectures.reduce((total, lecture) => {
			const startTime = lecture.start_time.split(':');
			const endTime = lecture.end_time.split(':');
			const startHour = parseInt(startTime[0]) + parseInt(startTime[1]) / 60;
			const endHour = parseInt(endTime[0]) + parseInt(endTime[1]) / 60;
			const hours = endHour - startHour;
			
			return total + hours;
		}, 0);

		return {
			hours: Math.floor(total),
			minutes: Math.round((total - Math.floor(total)) * 60)
		}
	});

	let totalEarnings = $derived.by(() => {
		return $lecturesStore.lectures.reduce((total, lecture) => {
			return total + calculateEarnings(lecture.start_time, lecture.end_time, lecture.hourly_rate);
		}, 0);
	});
	
	let averageRate = $derived.by(() => {
		if ($lecturesStore.lectures.length === 0) return 0;
		
		const totalRates = $lecturesStore.lectures.reduce((sum, lecture) => {
			return sum + (lecture.hourly_rate || 0);
		}, 0);
		
		return totalRates / $lecturesStore.lectures.length;
	});
	
	let nextLecture = $derived.by(() => {
		const now = new Date();
		const today = now.toISOString().split('T')[0];
		const currentTime = `${now.getHours()}:${now.getMinutes()}`;
		
		let nextLecture = $lecturesStore.lectures
			.filter(lecture => {
				let lecture_start_hour = lecture.start_time.split(':')[0];
				let lecture_start_minute = lecture.start_time.split(':')[1];
				let current_hour = currentTime.split(':')[0];
				let current_minute = currentTime.split(':')[1];
				let lecture_date = new Date(lecture.date);
				let today_date = new Date(today);
				
				return (isSameDay(lecture_date, today_date) && lecture_start_hour === current_hour && lecture_start_minute >= current_minute) || 
					(isSameDay(lecture_date, today_date) && lecture_start_hour > current_hour) || 
					lecture_date > today_date;
			})
			.sort((a, b) => {
				if (a.date !== b.date) {
					return a.date.localeCompare(b.date);
				}
				return a.start_time.localeCompare(b.start_time);
			});

		if (nextLecture.length > 0) {
			nextLecture = nextLecture[0];
			nextLecture.student = $studentsStore.students.find(student => student.id === nextLecture.student_id);
			nextLecture.subject = $subjectsStore.subjects.find(subject => subject.id === nextLecture.subject_id);
			return nextLecture;
		}

		return null;
	});
</script>

<div class="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
	<div class="flex items-start p-6 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 shadow-sm dark:border-zinc-800">
		<div class="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
			<ls.Users size={24} class="text-blue-600 dark:text-blue-300" />
		</div>
		<div>
			<p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Students</p>
			<p class="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{$studentsStore.students.length}</p>
		</div>
	</div>
	
	<div class="flex items-start p-6 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 shadow-sm dark:border-zinc-800">
		<div class="bg-green-100 dark:bg-green-900 p-3 rounded-full mr-4">
			<ls.BookOpen size={24} class="text-green-600 dark:text-green-300" />
		</div>
		<div>
			<p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Subjects</p>
			<p class="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{$subjectsStore.subjects.length}</p>
		</div>
	</div>
	
	<div class="flex items-start p-6 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 shadow-sm dark:border-zinc-800">
		<div class="bg-purple-100 dark:bg-purple-900 p-3 rounded-full mr-4">
			<ls.Clock size={24} class="text-purple-600 dark:text-purple-300" />
		</div>
		<div>
			<p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">Hours Taught</p>
			<p class="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{totalTime.hours}h {totalTime.minutes}m</p>
		</div>
	</div>
	
	<div class="flex items-start p-6 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 shadow-sm dark:border-zinc-800">
		<div class="bg-amber-100 dark:bg-amber-900 p-3 rounded-full mr-4">
			<ls.CreditCard size={24} class="text-amber-600 dark:text-amber-300" />
		</div>
		<div>
			<p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Earnings</p>
			<p class="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{formatCurrency(totalEarnings)}</p>
		</div>
	</div>
</div>

{#if nextLecture}
	<div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
		<h3 class="font-medium text-blue-700 dark:text-blue-300">Next Lecture</h3>
		<div class="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm">
			<div>
				<span class="text-zinc-500 dark:text-zinc-400">Date:</span> 
				<span class="text-zinc-900 dark:text-zinc-100 font-medium">{formatDateDisplay(nextLecture.date)}</span>
			</div>
			<div>
				<span class="text-zinc-500 dark:text-zinc-400">Time:</span> 
				<span class="text-zinc-900 dark:text-zinc-100 font-medium">{nextLecture.start_time} - {nextLecture.end_time}</span>
			</div>
			<div>
				<span class="text-zinc-500 dark:text-zinc-400">Student:</span> 
				<span class="text-zinc-900 dark:text-zinc-100 font-medium">
					{nextLecture.student?.first_name} {nextLecture.student?.last_name}
				</span>
			</div>
			<div>
				<span class="text-zinc-500 dark:text-zinc-400">Subject:</span> 
				<span class="text-zinc-900 dark:text-zinc-100 font-medium">{nextLecture.subject?.name}</span>
			</div>
		</div>
	</div>
{/if} 
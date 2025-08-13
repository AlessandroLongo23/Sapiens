<script>
	import { formatCurrency, formatDateDisplay, calculateEarnings } from '$lib/utils/format.svelte.js';
	import { subjectsStore } from '$lib/stores/subjects/subjects.js';
	import { studentsStore } from '$lib/stores/students/students.js';
	import { lecturesStore } from '$lib/stores/lectures/lectures.js';	
	import { isSameDay } from 'date-fns';
	import * as ls from 'lucide-svelte';
    import { cardStyle, designSystem } from '$lib/stores/appearance.js';

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

<div class="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
	<div class="bg-white border border-[#E5E7EB] dark:bg-[#121212] dark:border-[#2A2A2A] rounded-lg shadow-base dark:shadow-md transition-all hover:shadow-md dark:hover:shadow-glow p-6">
		<div class="flex flex-row justify-between">
			<div class="w-14 h-14 bg-[#EFF6FF] dark:bg-[#1E1E1E] rounded-lg flex items-center justify-center">
				<ls.Users class="w-7 h-7 text-[#3B82F6]" />
			</div>
			<div class="flex flex-col items-end">
				<span class="text-xs font-medium text-[#6B7280] dark:text-[#A0A0A0] uppercase tracking-wide mb-2">STUDENTS</span>
				<div class="flex items-baseline">
					<span class="text-3xl font-bold text-[#111827] dark:text-white">{$studentsStore.students.length}</span>
					<!-- <span class="text-sm text-[#22C55E] font-medium ml-3">+2 this month</span> -->
				</div>
			</div>
		</div>
	</div>
	
	<div class="bg-white border border-[#E5E7EB] dark:bg-[#121212] dark:border-[#2A2A2A] rounded-lg shadow-base dark:shadow-md transition-all hover:shadow-md dark:hover:shadow-glow p-6">
		<div class="flex flex-row justify-between">
			<div class="w-14 h-14 bg-[#F0FDF4] dark:bg-[#1E1E1E] rounded-lg flex items-center justify-center">
				<ls.BookOpen class="w-7 h-7 text-[#22C55E]" />
			</div>
			<div class="flex flex-col items-end">
				<span class="text-xs font-medium text-[#6B7280] dark:text-[#A0A0A0] uppercase tracking-wide mb-2">SUBJECTS</span>
				<div class="flex items-baseline">
					<span class="text-3xl font-bold text-[#111827] dark:text-white">{$subjectsStore.subjects.length}</span>
				</div>
			</div>
		</div>
	</div>
	
	<div class="bg-white border border-[#E5E7EB] dark:bg-[#121212] dark:border-[#2A2A2A] rounded-lg shadow-base dark:shadow-md transition-all hover:shadow-md dark:hover:shadow-glow p-6">
		<div class="flex flex-row justify-between">
			<div class="w-14 h-14 bg-[#F3E8FF] dark:bg-[#1E1E1E] rounded-lg flex items-center justify-center">
				<ls.Clock class="w-7 h-7 text-[#8B5CF6]" />
			</div>
			<div class="flex flex-col items-end">
				<span class="text-xs font-medium text-[#6B7280] dark:text-[#A0A0A0] uppercase tracking-wide mb-2">HOURS TAUGHT</span>
				<div class="flex items-baseline">
					<span class="text-3xl font-bold text-[#111827] dark:text-white">{totalTime.hours}h {totalTime.minutes}m</span>
					<!-- <span class="text-sm text-[#22C55E] font-medium ml-3">+4h this week</span> -->
				</div>
			</div>
		</div>
	</div>
	
	<div class="bg-white border border-[#E5E7EB] dark:bg-[#121212] dark:border-[#2A2A2A] rounded-lg shadow-base dark:shadow-md transition-all hover:shadow-md dark:hover:shadow-glow p-6">
		<div class="flex flex-row justify-between">
			<div class="w-14 h-14 bg-[#FEF3C7] dark:bg-[#1E1E1E] rounded-lg flex items-center justify-center">
				<ls.CreditCard class="w-7 h-7 text-[#F59E0B]" />
			</div>
			<div class="flex flex-col items-end">
				<span class="text-xs font-medium text-[#6B7280] dark:text-[#A0A0A0] uppercase tracking-wide mb-2">TOTAL EARNINGS</span>
				<div class="flex items-baseline">
					<span class="text-3xl font-bold text-[#111827] dark:text-white">{formatCurrency(totalEarnings)}</span>
				</div>
			</div>
		</div>
	</div>
</div>

{#if nextLecture}
	<div class="bg-white border-l-4 border-l-[#3B82F6] border-t border-r border-b border-[#E5E7EB] dark:bg-[#121212] dark:border-l-[#3B82F6] dark:border-t-[#2A2A2A] dark:border-r-[#2A2A2A] dark:border-b-[#2A2A2A] rounded-md p-5 shadow-base dark:shadow-glow mb-8">
		<div class="flex items-center">
			<div class="p-3 rounded-md bg-[#EFF6FF] dark:bg-[#1E1E1E] mr-4">
				<ls.Calendar class="w-6 h-6 text-[#3B82F6]" />
			</div>
			<div>
				<h3 class="font-semibold text-[#111827] dark:text-white text-sm mb-2">Next Lecture</h3>
				<div class="flex flex-wrap gap-x-8 gap-y-2 text-sm">
					<div class="flex items-center">
						<span class="text-xs text-[#6B7280] dark:text-[#A0A0A0]">Date:</span> 
						<span class="text-sm text-[#111827] dark:text-white font-medium ml-2">{formatDateDisplay(nextLecture.date)}</span>
					</div>
					<div class="flex items-center">
						<span class="text-xs text-[#6B7280] dark:text-[#A0A0A0]">Time:</span> 
						<span class="text-sm text-[#111827] dark:text-white font-medium ml-2">{nextLecture.start_time} - {nextLecture.end_time}</span>
					</div>
					<div class="flex items-center">
						<span class="text-xs text-[#6B7280] dark:text-[#A0A0A0]">Student:</span> 
						<span class="text-sm text-[#111827] dark:text-white font-medium ml-2">
							{nextLecture.student?.first_name} {nextLecture.student?.last_name}
						</span>
					</div>
					<div class="flex items-center">
						<span class="text-xs text-[#6B7280] dark:text-[#A0A0A0]">Subject:</span> 
						<span class="text-sm text-[#111827] dark:text-white font-medium ml-2">{nextLecture.subject?.name}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if} 
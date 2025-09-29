<script>
	import { formatCurrency, formatDateDisplay, calculateEarnings } from '$lib/utils/format.svelte.js';
    import { cardStyle, designSystem } from '$lib/const/appearance.js';
	import { subjectsStore } from '$lib/stores/subjects.js';
	import { studentsStore } from '$lib/stores/students.js';
	import { lecturesStore } from '$lib/stores/lectures.js';	
	import { statsStore } from '$lib/stores/stats.svelte.js';
	import { isSameDay } from 'date-fns';
	import * as ls from 'lucide-svelte';
	import { goto } from '$app/navigation';
	
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

	let cardsData = $derived.by(() => {
	return [
		{
			icon: ls.CreditCard,
			label: 'TOTAL EARNINGS',
			value: statsStore.totalEarnings + "€",
			mobileValue: `${statsStore.totalEarnings}€`,
			backgroundColor: 'bg-[#F0FDF4]',
			iconColor: 'text-[#22C55E]',
			href: null,
		},
		{
			icon: ls.Clock,
			label: 'HOURS TAUGHT',
			value: statsStore.totalTime.hours + "h\n" + statsStore.totalTime.minutes + "m",
			mobileValue: `${statsStore.totalTime.hours}h ${statsStore.totalTime.minutes}m`,
			backgroundColor: 'bg-[#FEF3C7]',
			iconColor: 'text-[#F59E0B]',
			href: "/admin/calendario",
		},
		{
			icon: ls.Users,
			label: 'STUDENTS',
			value: $studentsStore.students.length,
			backgroundColor: 'bg-[#EFF6FF]',
			iconColor: 'text-[#3B82F6]',
			href: "/admin/studenti",
		},
		{
			icon: ls.BookOpen,
			label: 'SUBJECTS',
			value: $subjectsStore.subjects.length,
			backgroundColor: 'bg-[#F3E8FF]',
			iconColor: 'text-[#8B5CF6]',
			href: "/admin/materie",
		},
	]
})
</script>

<div class="w-full grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
	{#each cardsData as card, index}
		<div 
			class="bg-white border border-[#E5E7EB] dark:bg-[#121212] dark:border-[#2A2A2A] rounded-lg shadow-base dark:shadow-md transition-all hover:shadow-md dark:hover:shadow-glow p-4 sm:p-6 cursor-pointer" 
			onclick={() => {
				if (card.href) {
					goto(card.href);
				}
			}}
			onkeydown={(e) => {}}
			role="button"
			tabindex="0"
		>
			<div class="flex flex-col sm:flex-row justify-between h-full">	
				<div class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 {card.backgroundColor} rounded-lg flex items-center justify-center mb-3 sm:mb-0">
					<card.icon class="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 {card.iconColor}" />
				</div>
				<div class="flex flex-col sm:items-end w-full sm:w-auto">
					<span class="text-xs font-medium text-[#6B7280] dark:text-[#A0A0A0] uppercase tracking-wide mb-1">{card.label}</span>
					<div class="flex items-baseline">
						{#if card.mobileValue && (index === 2 || index === 3)}
							<span class="text-xl sm:text-2xl md:text-3xl font-bold text-[#111827] dark:text-white block sm:hidden">{card.mobileValue}</span>
							<span class="hidden sm:block text-xl sm:text-2xl md:text-3xl font-bold text-[#111827] dark:text-white">{card.value}</span>
						{:else}
							<span class="text-xl sm:text-2xl md:text-3xl font-bold text-[#111827] dark:text-white">{card.value}</span>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/each}
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
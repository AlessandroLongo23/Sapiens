<script>
	import { setSelectedDate, selectedDate } from '$lib/utils/date.svelte.js';
	import { format, isSameDay, parseISO, isAfter } from 'date-fns';
	import { lecturesStore } from '$lib/stores/lectures.svelte.js';
	import { Plus } from 'lucide-svelte';
	
	import UpcomingLectures from '$lib/components/widgets/UpcomingLectures.svelte';
	import LectureModal from '$lib/components/calendars/LectureModal.svelte';
	import Calendar from '$lib/components/calendars/Calendar.svelte';

	let showLectureModal = $state(false);
	let selectedLecture = $state(null);
	
	function handleDaySelected(event) {
		setSelectedDate(event.detail);
		selectedLecture = null;
		showLectureModal = true;
	}
	
	function handleLectureSelected(event) {
		selectedLecture = event.detail;
		showLectureModal = true;
	}
	
	function handleNewLecture() {
		selectedLecture = null;
		showLectureModal = true;
	}
	
	function handleModalClose() {
		showLectureModal = false;
		selectedLecture = null;
	}
</script>

<div class="space-y-6">
	<div class="flex justify-between items-center">
		<h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Calendar</h1>
		
		<button 
			class="px-3 py-2 flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
			onclick={handleNewLecture}
		>
			<Plus size={18} />
			New Lecture
		</button>
	</div>
	
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<div class="lg:col-span-2">
			<Calendar 
				on:daySelected={handleDaySelected} 
				on:lectureSelected={handleLectureSelected}
			/>
		</div>
		
		<UpcomingLectures />
	</div>
	
	<LectureModal 
		isOpen={showLectureModal} 
		lecture={selectedLecture} 
		selectedDate={$selectedDate}
		on:close={handleModalClose}
	/>
</div> 
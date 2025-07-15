<script>
	import { setSelectedDate, selectedDate } from '$lib/utils/date.svelte.js';
	import { lecturesStore } from '$lib/stores/lectures.svelte.js';
	import { format } from 'date-fns';

	import DashboardStats from '$lib/components/widgets/DashboardStats.svelte';
	import TopEarningsBar from '$lib/components/widgets/TopEarningsBar.svelte';
	import LectureModal from '$lib/components/calendars/LectureModal.svelte';
	import Calendar from '$lib/components/calendars/Calendar.svelte';
	import Earnings from '$lib/components/widgets/Earnings.svelte';
	
	let showLectureModal = $state(false);
	let selectedLecture = $state(null);
	let currentDate = $state(new Date());
	
	function handleDaySelected(event) {
		setSelectedDate(event.detail);
		selectedLecture = null;
		showLectureModal = true;
	}
	
	function handleModalClose() {
		selectedLecture = null;
		showLectureModal = false;
	}
</script>

<div class="space-y-6">
	<DashboardStats />
	
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<Earnings />
		<TopEarningsBar />
	</div>
	
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<div>
			<h2 class="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Monthly Calendar</h2>
			<Calendar on:daySelected={handleDaySelected} />
		</div>
	</div>
	
	<LectureModal 
		isOpen={showLectureModal} 
		lecture={selectedLecture} 
		selectedDate={$selectedDate}
		on:close={handleModalClose}
	/>
</div>

<script>
	import { setSelectedDate, selectedDate } from '$lib/utils/date.svelte.js';
	import { selectedLectureStore } from '$lib/stores/lectures.js';
	
	import UpcomingLectures from '$lib/components/admin/calendars/UpcomingLectures.svelte';
	import UnpaidLectures from '$lib/components/admin/widgets/UnpaidLectures.svelte';
	import AddLectureModal from '$lib/components/admin/calendars/AddLectureModal.svelte';
	import EditLectureModal from '$lib/components/admin/calendars/EditLectureModal.svelte';
	import ResponsiveCalendar from '$lib/components/shared/calendars/ResponsiveCalendar.svelte';

	let showLectureModal = $state(false);
	let showAddLectureModal = $state(false);
	let showEditLectureModal = $state(false);
	
	function handleDaySelected(event) {
		setSelectedDate(event.detail);
		$selectedLectureStore = null;
		showAddLectureModal = true;
	}
	
	function handleLectureSelected(event) {
		$selectedLectureStore = event.detail;
		showEditLectureModal = true;
	}
</script>

<div class="space-y-6">
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<div class="lg:col-span-2 space-y-6">
			<ResponsiveCalendar 
				on:daySelected={handleDaySelected} 
				on:lectureSelected={handleLectureSelected}
			/>

			<UnpaidLectures />
		</div>
		
		<div>
			<UpcomingLectures />
		</div>
	</div>
</div>

<AddLectureModal 
	bind:isOpen={showAddLectureModal} 
	selectedDate={$selectedDate}
	classes="max-w-xl"
/>

<EditLectureModal 
	bind:isOpen={showEditLectureModal} 
	selectedDate={$selectedDate}
	classes="max-w-xl"
/>
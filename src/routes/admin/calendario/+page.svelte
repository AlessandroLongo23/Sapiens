<script>
	import { setSelectedDate, selectedDate } from '$lib/utils/date.svelte.js';
	import { lecturesStore } from '$lib/stores/lectures/lectures.js';
	// import { messagePopup } from '$lib/components/shared/ui/messagePopup/messagePopup.js';
	
	import UpcomingLectures from '$lib/components/admin/widgets/UpcomingLectures.svelte';
	import UnpaidLectures from '$lib/components/admin/widgets/UnpaidLectures.svelte';
	import AddLectureModal from '$lib/components/shared/ui/modals/AddLectureModal.svelte';
	import EditLectureModal from '$lib/components/shared/ui/modals/EditLectureModal.svelte';
	import Calendar from '$lib/components/admin/calendars/CalendarAdmin.svelte';

	let showLectureModal = $state(false);
	let selectedLecture = $state(null);
	let showAddLectureModal = $state(false);
	let showEditLectureModal = $state(false);
	
	function handleDaySelected(event) {
		setSelectedDate(event.detail);
		selectedLecture = null;
		showAddLectureModal = true;
	}
	
	function handleLectureSelected(event) {
		selectedLecture = event.detail;
		showEditLectureModal = true;
	}
	
	function handleNewLecture() {
		selectedLecture = null;
		showAddLectureModal = true;
	}
	
	function handleModalClose() {
		showAddLectureModal = false;
		showEditLectureModal = false;
		selectedLecture = null;
	}
</script>

<div class="space-y-6">
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<div class="lg:col-span-2 space-y-6">
			<Calendar 
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
	isOpen={showAddLectureModal} 
	selectedDate={$selectedDate}
	classes="max-w-xl"
	on:close={handleModalClose}
/>

<EditLectureModal 
	isOpen={showEditLectureModal} 
	lecture={selectedLecture}
	selectedDate={$selectedDate}
	classes="max-w-xl"
	on:close={handleModalClose}
/>
<script>
	import { setSelectedDate, selectedDate } from '$lib/utils/date.svelte.js';
	import { format, isSameDay, parseISO, isAfter } from 'date-fns';
	import { lecturesStore } from '$lib/stores/lectures/lectures.js';
	import { Plus } from 'lucide-svelte';
	
	import UpcomingLectures from '$lib/components/widgets/UpcomingLectures.svelte';
	import UnpaidLectures from '$lib/components/widgets/UnpaidLectures.svelte';
	import AddLectureModal from '$lib/components/modals/AddLectureModal.svelte';
	import EditLectureModal from '$lib/components/modals/EditLectureModal.svelte';
	import Calendar from '$lib/components/calendars/CalendarAdmin.svelte';

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
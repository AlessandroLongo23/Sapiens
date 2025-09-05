<script>
	import { setSelectedDate, selectedDate } from '$lib/utils/date.svelte.js';
	import { lecturesStore } from '$lib/stores/lectures/lectures.js';
	import { format } from 'date-fns';

	import DashboardStats from '$lib/components/widgets/DashboardStats.svelte';
	import TopEarningsBar from '$lib/components/widgets/TopEarningsBar.svelte';
	import AddLectureModal from '$lib/components/modals/AddLectureModal.svelte';
	import EditLectureModal from '$lib/components/modals/EditLectureModal.svelte';
	import Earnings from '$lib/components/widgets/Earnings.svelte';
	import LecturesTimeDistribution from '$lib/components/widgets/LecturesTimeDistribution.svelte';
	import LecturesWeekDistribution from '$lib/components/widgets/LecturesWeekDistribution.svelte';

	let showAddLectureModal = $state(false);
	let showEditLectureModal = $state(false);
	let selectedLecture = $state(null);
	let currentDate = $state(new Date());
	
	function handleDaySelected(event) {
		setSelectedDate(event.detail);
		selectedLecture = null;
		showAddLectureModal = true;
	}
	
	function handleModalClose() {
		selectedLecture = null;
		showAddLectureModal = false;
		showEditLectureModal = false;
	}

	function handleLectureSelected(event) {
		selectedLecture = event.detail;
		showEditLectureModal = true;
	}
</script>

<div class="space-y-4 md:space-y-6">
	<DashboardStats />
	
	<div class="grid grid-cols-1 lg:grid-cols-7 gap-4 md:gap-6">
		<div class="lg:col-span-4">
			<Earnings />
		</div>
		<div class="lg:col-span-3">
			<TopEarningsBar />
		</div>
	</div>
	
	<div class="grid grid-cols-1 lg:grid-cols-7 gap-4 md:gap-6">
		<div class="lg:col-span-3">
			<LecturesWeekDistribution />
		</div>
		<div class="lg:col-span-4">
			<LecturesTimeDistribution />
		</div>
	</div>
</div>

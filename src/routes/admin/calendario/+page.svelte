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
	
	// async function handleAcceptLecture(event) {
	// 	const lecture = event.detail;
	// 	try {
	// 		const result = await lecturesStore.updateLecture(lecture.id, { status: 'accepted' });
			
	// 		if (result) {
	// 			messagePopup.success({
	// 				title: 'Lezione accettata',
	// 				description: `Lezione con ${lecture.student.first_name} ${lecture.student.last_name} accettata con successo.`,
	// 				type: 'success',
	// 				duration: 3000
	// 			});
	// 		} else {
	// 			throw new Error('Impossibile accettare la lezione');
	// 		}
	// 	} catch (error) {
	// 		console.error('Error accepting lecture:', error);
	// 		messagePopup.error({
	// 			title: 'Errore',
	// 			description: 'Si è verificato un errore durante l\'accettazione della lezione.',
	// 			type: 'error',
	// 			duration: 3000
	// 		});
	// 	}
	// }
	
	// async function handleRefuseLecture(event) {
	// 	const lecture = event.detail;
	// 	try {
	// 		const result = await lecturesStore.deleteLecture(lecture.id);
			
	// 		if (result) {
	// 			messagePopup.success({
	// 				title: 'Lezione rifiutata',
	// 				description: `Lezione con ${lecture.student.first_name} ${lecture.student.last_name} rifiutata con successo.`,
	// 				type: 'success',
	// 				duration: 3000
	// 			});
	// 		} else {
	// 			throw new Error('Impossibile rifiutare la lezione');
	// 		}
	// 	} catch (error) {
	// 		console.error('Error refusing lecture:', error);
	// 		messagePopup.error({
	// 			title: 'Errore',
	// 			description: 'Si è verificato un errore durante il rifiuto della lezione.',
	// 			type: 'error',
	// 			duration: 3000
	// 		});
	// 	}
	// }
</script>

<div class="space-y-6">
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<div class="lg:col-span-2 space-y-6">
			<Calendar 
				on:daySelected={handleDaySelected} 
				on:lectureSelected={handleLectureSelected}
				on:acceptLecture={handleAcceptLecture}
				on:refuseLecture={handleRefuseLecture}
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
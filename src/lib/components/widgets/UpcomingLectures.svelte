<script>
    import { lecturesStore } from '$lib/stores/lectures.svelte.js';
    import { isAfter, isSameDay } from 'date-fns';
    
    import UpcomingLecture from '$lib/components/UpcomingLecture.svelte';

    let filteredLectures = $derived.by(() => {
		return lecturesStore.lectures.sort((a, b) => {
			if (a.date !== b.date)
				return a.date.localeCompare(b.date);
			
			return a.start_time.localeCompare(b.start_time);
		}).filter((lecture) => {
			const now = new Date();
			
			if (lecture.start_time) {
				const lectureDate = new Date(lecture.date);
				const [hours, minutes] = lecture.start_time.split(':').map(Number);
				
				const lectureDateWithTime = new Date(
					lectureDate.getFullYear(),
					lectureDate.getMonth(),
					lectureDate.getDate(),
					hours,
					minutes
				);
				
				return isAfter(lectureDateWithTime, now) || 
				       (isSameDay(lectureDateWithTime, now) && isAfter(lectureDateWithTime, now));
			} else {
				return isAfter(new Date(lecture.date), now);
			}
		});
	});

	function handleOpenLectureModal(event) {
		selectedLecture = event.detail;
		showLectureModal = true;
	}
</script>

<div class="bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 shadow-sm dark:border-zinc-800 p-4 max-h-[calc(100vh-120px)] overflow-y-scroll">
    <h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Upcoming Lectures</h2>
    
    <div class="space-y-3 pr-2">
        {#if filteredLectures.length === 0}
            <p class="text-zinc-500 dark:text-zinc-400 text-sm">No lectures scheduled. Click on a day to add a lecture.</p>
        {:else}
            {#each filteredLectures as lecture}
                <UpcomingLecture 
                    lecture={lecture}
                    on:openLectureModal={handleOpenLectureModal}
                />
            {/each}
        {/if}
    </div>
</div>
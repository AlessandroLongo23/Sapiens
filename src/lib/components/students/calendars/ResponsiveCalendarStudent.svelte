<script>
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	import MobileCalendarStudent from '$lib/components/students/calendars/MobileCalendarStudent.svelte';
	import ScheduleLessonModal from '$lib/components/students/calendars/ScheduleLessonModal.svelte';
	import CalendarStudent from '$lib/components/students/calendars/CalendarStudent.svelte';
	
	let { user } = $props();
	
	// State
	let isMobile = $state(false);
	let windowWidth = $state(0);
	let showScheduleModal = $state(false);
	let selectedDate = $state(null);
	
	// Update window width on resize
	function updateWindowWidth() {
		windowWidth = window.innerWidth;
		isMobile = windowWidth < 768; // md breakpoint in Tailwind
	}
	
	onMount(() => {
		if (browser) {
			updateWindowWidth();
			window.addEventListener('resize', updateWindowWidth);
			return () => {
				window.removeEventListener('resize', updateWindowWidth);
			};
		}
	});
	
	// Handle schedule modal
	function handleOpenScheduleModal(event) {
		showScheduleModal = true;
		selectedDate = event.detail.selectedDate;
	}
	
	function closeScheduleModal() {
		showScheduleModal = false;
		selectedDate = null;
	}
</script>

<div class="w-full">
	{#if isMobile}
		<MobileCalendarStudent {user} />
	{:else}
		<CalendarStudent {user} />
	{/if}
</div>

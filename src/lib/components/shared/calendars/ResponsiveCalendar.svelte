<script>
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	import CalendarAdmin from '$lib/components/admin/calendars/CalendarAdmin.svelte';
	import MobileCalendar from '$lib/components/shared/calendars/MobileCalendar.svelte';
	
	let isMobile = $state(false);
	let windowWidth = $state(0);
	
	function updateWindowWidth() {
		windowWidth = window.innerWidth;
		isMobile = windowWidth < 768;
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
	
	function forwardEvent(name) {
		return (event) => {
			dispatch(name, event.detail);
		};
	}
	
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<div class="w-full">
	{#if isMobile}
		<MobileCalendar 
			on:daySelected={forwardEvent('daySelected')}
			on:lectureSelected={forwardEvent('lectureSelected')}
		/>
	{:else}
		<CalendarAdmin 
			on:daySelected={forwardEvent('daySelected')}
			on:lectureSelected={forwardEvent('lectureSelected')}
		/>
	{/if}
</div>


<script>
	import CalendarStudent from '$lib/components/students/calendars/CalendarStudent.svelte';

	let { data } = $props();
	let { user } = $derived(data);
</script>

<div class="relative px-16 py-4">
	<CalendarStudent user={user} />
</div>
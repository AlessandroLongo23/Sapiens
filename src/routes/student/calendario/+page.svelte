<script>
	import CalendarStudent from '$lib/components/calendars/CalendarStudent.svelte';

	let { data } = $props();
	let { user } = $derived(data);
</script>

<div class="relative px-8 py-4">
	<CalendarStudent user={user}>
		<div>
		</div>
	</CalendarStudent>
</div>
	
<style>
	.glass-effect {
		background: rgba(255, 255, 255, 0.6);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}
	.btn-primary {
		background: #3b82f6; /* blue-500 */
		transition: background-color 0.3s;
	}
	.btn-primary:hover {
		background: #2563eb; /* blue-600 */
	}
	.btn-secondary {
		background-color: rgba(255, 255, 255, 0.7);
		transition: background-color 0.3s;
	}
	.btn-secondary:hover {
		background-color: rgba(255, 255, 255, 1);
	}
</style> 
<script>
	let { data, children } = $props();
	let { user } = $derived(data);
</script>

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-sans">
	<div class="relative min-h-screen">
		{@render children()}
	</div>
</div>
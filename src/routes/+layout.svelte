<script>
	import '../app.css';
	import '$lib/utils/auxiliary.js';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	import ThemeProvider from '$lib/components/theme/ThemeProvider.svelte';

	let { data, children } = $props();
	let { session, supabase, user } = $derived(data)

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange(async (event, _session) => {
			const { data: { user: authUser }, error } = await supabase.auth.getUser()
			
			if (error || !authUser) {
				invalidate('supabase:auth')
				return
			}

			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			}
		})

		return () => data.subscription.unsubscribe()
	})
</script>

<ThemeProvider>
	{@render children()}
</ThemeProvider>
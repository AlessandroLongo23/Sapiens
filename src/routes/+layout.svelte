<script>
	import '../app.css';
	import '$lib/utils/prototypes.js';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	import ThemeProvider from '$lib/components/shared/ui/theme/ThemeProvider.svelte';
	import GrainyBackground from '$lib/components/shared/landing/background/GrainyBackground.svelte';
	
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
	<GrainyBackground 
		grain_amount={0.08}
		grain_size={1.0}
		speed={0.3}
	/>

	<div class="relative z-10">
		{@render children()}
	</div>
</ThemeProvider>
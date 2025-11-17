<script>
	import '../app.css';
	import '$lib/utils/prototypes.js';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	import ThemeProvider from '$lib/components/shared/ui/theme/ThemeProvider.svelte';
	import GrainyBackground from '$lib/components/shared/landing/background/GrainyBackground.svelte';
	import AuthModal from '$lib/components/shared/ui/modals/AuthModal.svelte';
	import Header from '$lib/components/shared/landing/Header.svelte';

	let { data, children } = $props();
	let { session, supabase, user } = $derived(data)

	let isAuthModalOpen = $state(false);

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

	<AuthModal 
		bind:isOpen={isAuthModalOpen} 
		onClose={() => isAuthModalOpen = false} 
	/>

	<div class="flex flex-col relative z-10 h-screen">
		<Header
			bind:isAuthModalOpen={isAuthModalOpen}
			session={session}
		/>

		<div class="overflow-y-auto">
			{@render children()}
		</div>
	</div>
</ThemeProvider>
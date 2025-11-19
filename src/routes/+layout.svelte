<script>
	import '../app.css';
	import '$lib/utils/prototypes.js';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { searchStore } from '$lib/components/ui/search';

	import ThemeProvider from '$lib/components/ui/theme/ThemeProvider.svelte';
	import GrainyBackground from '$lib/components/landing/background/GrainyBackground.svelte';
	import AuthModal from '$lib/components/ui/modals/AuthModal.svelte';
	import Header from '$lib/components/landing/Header.svelte';
	import SearchOverlay from '$lib/components/ui/SearchOverlay.svelte';
	import FooterSection from '$lib/components/landing/FooterSection.svelte';
	
	let { data, children } = $props();
	let { session, supabase, user } = $derived(data)

	let headerRef = $state(undefined);
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
		<SearchOverlay />
		<Header
			bind:headerRef={headerRef}
			bind:isAuthModalOpen={isAuthModalOpen}
			session={session}
		/>

		<div class={`flex-1 overflow-y-auto no-scrollbar transition-opacity duration-300 ease-out ${$searchStore?.isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
			<div style={`min-height: calc(100vh - ${headerRef?.offsetHeight ?? 0}px);`}>
				{@render children()}
			</div>

			<FooterSection />
		</div>
	</div>
</ThemeProvider>
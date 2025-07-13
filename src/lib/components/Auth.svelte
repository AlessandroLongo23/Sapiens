<script>
	import FormButton from '$lib/components/FormButton.svelte';
	import FormInput from '$lib/components/FormInput.svelte';
	import { goto } from '$app/navigation';

	let { supabase } = $props();

	let email = $state('');
	let password = $state('');
	let error = $state(null);
	let loading = $state(false);

	const handleLogin = async () => {
		try {
			loading = true;
			const { error: err } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (err) {
				error = err;
			} else {
				goto('/private/calendario');
			}
		} catch (e) {
			error = e;
		} finally {
			loading = false;
		}
	};
</script>

<div class="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
	<form
		onsubmit={(e) => {
			e.preventDefault();
			handleLogin();
		}}
		class="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
	>
		<FormInput type="email" placeholder="Email" bind:value={email} onchange={() => error = null} />
		<FormInput type="password" placeholder="Password" bind:value={password} onchange={() => error = null} />
		<FormButton type="submit" disabled={loading}>
			{loading ? 'Loading...' : 'Sign In'}
		</FormButton>
	</form>

	{#if error?.code === 'invalid_credentials'}
		<p class="p-4 pb-2 bg-foreground/10 text-foreground text-center text-red-600">
			Email o password errate. Riprova
		</p>
	{/if}
</div> 
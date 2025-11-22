<script>
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase.js';
	import { X } from 'lucide-svelte';
	
	import FormButton from '$lib/components/ui/forms/FormButton.svelte';
	import FormInput from '$lib/components/ui/forms/FormInput.svelte';
	import Modal from '$lib/components/ui/modals/Modal.svelte';

	let { 
		isOpen = $bindable(false),
		onClose = () => {},
		register = false
	} = $props();

	let email = $state('');
	let password = $state('');
	let name = $state('')
	let surname = $state('')
	let error = $state(null);
	let loading = $state(false);
	let isNavigating = $state(false);

	const handleLogin = async (event) => {
		if (isNavigating) return;

		event.preventDefault();
		loading = true;
		error = null;

		try {
			const { data: { user }, error: error } = await supabase.auth.signInWithPassword({ 
				email, 
				password 
			});

			if (error) throw error;

			isNavigating = true;
			// const redirectPath = user?.user_metadata?.role === 'admin' ? '/admin/analytics' : '/student/materiale';
			const redirectPath = '/student/dashboard';
			await goto(redirectPath);
		} catch (err) {
			error = err.message;
			if (error.includes('Invalid login')) {
				error = 'Email o password errate. Riprova';
			}
		} finally {
			loading = false;
			isNavigating = false;
		}
	}

	const handleRegister = async (event) => {
		if (isNavigating) return;

		event.preventDefault();
		loading = true;
		error = null;

		try {
			const { data: { user }, error: error } = await supabase.auth.signUp({ 
				email,
				name,
				surname,
				password 
			});

			if (error) throw error;

			isNavigating = true;
			// const redirectPath = user?.user_metadata?.role === 'admin' ? '/admin/analytics' : '/student/materiale';
			const redirectPath = '/student/dashboard';
			await goto(redirectPath);
		} catch (err) {
			error = err.message;
			if (error.includes('Invalid Registration')) {
				error = 'Email o password errate. Riprova';
			}
		} finally {
			loading = false;
			isNavigating = false;
		}
	}

	const switchMode = () => {
		register = !register
	}

</script>

<Modal 
	bind:isOpen={isOpen} 
	title={register ? 'Registra il tuo account' : "Accedi al tuo account"} 
	size={register ? "md" : "sm"} 
	backgroundBlur="xs" 
	onClose={onClose} 
	classes="bg-white dark:bg-zinc-800 shadow-2xl rounded-2xl sm:rounded-3xl max-w-xs sm:max-w-sm"
>
	<div class="flex justify-between items-center p-6 border-b border-zinc-100 dark:border-zinc-700 flex-shrink-0">
		<h3
			class="text-lg sm:text-xl font-bold bg-gradient-to-r from-zinc-800 to-zinc-900 dark:from-zinc-200 dark:to-zinc-100 bg-clip-text text-transparent"
		>
			{register ? "Registra il tuo account" : "Accedi al tuo account"}
		</h3>
		<button
			onclick={onClose}
			class="group p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl transition-colors duration-300 cursor-pointer"
			aria-label="close modal"
		>
			<X class="size-5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors duration-300"/>
		</button>
	</div>
	
	<div class="flex-1 flex flex-col w-full sm:max-w-md justify-center gap-2 p-6">
		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleLogin(e);
			}}
			class="flex-1 flex flex-col w-full justify-center gap-4 text-foreground"
		>
			<div class="flex flex-col gap-2">
				{#if register}
				<FormInput type="name" placeholder="Name" bind:value={name} onchange={() => error = null} />
				<FormInput type="surname" placeholder="Surname" bind:value={surname} onchange={() => error = null} />
				{/if}
				<FormInput type="email" placeholder="Email" bind:value={email} onchange={() => error = null} />
				<FormInput type="password" placeholder="Password" bind:value={password} onchange={() => error = null} />
			</div>

			<FormButton type="submit" disabled={loading}>
				{loading ? 'Loading...' : 'Sign In'}
			</FormButton>
			<div class="d-flex justify-content-between">
				{#if register}
				<span class="d-block">Non sei ancora registrato?</span>
				{:else}
				<span class="d-block">Sei già registrato? Vai al</span>
				{/if}
				<a disabled={loading} onclick={switchMode}>
					{loading ? 'Loading...' : register ? 'Registrati' : 'Login'}
				</a>
			</div>
		</form>

		{#if error}
			<p class="p-4 pb-2 bg-foreground/10 text-foreground text-center text-red-600">
				{error}
			</p>
		{/if}
	</div>
</Modal>
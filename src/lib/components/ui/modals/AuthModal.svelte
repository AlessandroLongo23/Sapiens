<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { createBrowserSupabaseClient } from '$lib/supabase.js';
	import { X, Mail, Lock, User } from 'lucide-svelte';
	
	import FormButton from '$lib/components/ui/forms/FormButton.svelte';
	import FormInput from '$lib/components/ui/forms/FormInput.svelte';
	import Modal from '$lib/components/ui/modals/Modal.svelte';

	let { 
		isOpen = $bindable(false),
		onClose = () => {},
		register = $bindable(false)
	} = $props();

	let email = $state('');
	let password = $state('');
	let name = $state('');
	let surname = $state('');
	let error = $state<string | null>(null);
	let loading = $state(false);
	let isNavigating = $state(false);

	// Create browser client for auth operations
	const supabase = createBrowserSupabaseClient();

	const handleLogin = async () => {
		if (isNavigating) return;

		loading = true;
		error = null;

		try {
			const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({ 
				email, 
				password 
			});

			if (authError) throw authError;

			isNavigating = true;
			
			// Invalidate all load functions to refresh session data
			await invalidateAll();
			
			// Redirect using window.location to ensure cookies are sent with the new request
			const redirectPath = '/admin';
			window.location.href = redirectPath;
		} catch (err: any) {
			error = err.message;
			if (error?.includes('Invalid login')) {
				error = 'Email o password errate. Riprova';
			}
		} finally {
			loading = false;
			isNavigating = false;
		}
	}

	const handleRegister = async () => {
		if (isNavigating) return;

		loading = true;
		error = null;

		try {
			const { data: { user }, error: authError } = await supabase.auth.signUp({ 
				email,
				password,
				options: {
					data: {
						name,
						surname
					}
				}
			});

			if (authError) throw authError;

			isNavigating = true;
			
			// Invalidate all load functions to refresh session data
			await invalidateAll();
			
			// Redirect using window.location to ensure cookies are sent with the new request
			const redirectPath = '/admin';
			window.location.href = redirectPath;
		} catch (err: any) {
			error = err.message;
			if (error?.includes('Invalid Registration')) {
				error = 'Email o password errate. Riprova';
			}
		} finally {
			loading = false;
			isNavigating = false;
		}
	}

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		if (register) {
			handleRegister();
		} else {
			handleLogin();
		}
	}

	const switchMode = () => {
		register = !register
		error = null;
	}
</script>

<Modal 
	bind:isOpen={isOpen} 
	backgroundBlur="sm" 
	onClose={onClose} 
	classes="bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl sm:rounded-3xl w-full max-w-[400px] p-0 overflow-hidden border border-zinc-500/25"
>
	<div class="relative px-6 pt-10 pb-8">
		<!-- Close Button -->
		<button
			onclick={() => onClose()}
			class="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all duration-200 cursor-pointer"
			aria-label="close modal"
		>
			<X class="size-5" />
		</button>
		
		<!-- Header -->
		<div class="text-center mb-8">
			<h3 class="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
				{register ? "Crea un account" : "Bentornato"}
			</h3>
			<p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
				{register ? "Inizia il tuo percorso di apprendimento." : "Accedi per continuare a studiare."}
			</p>
		</div>
	
		<!-- Form -->
		<form onsubmit={handleSubmit} class="flex flex-col gap-4">
			{#if register}
				<div class="flex gap-3">
					<div class="flex-1">
						<FormInput 
							type="text" 
							placeholder="Nome" 
							bind:value={name} 
							FormIcon={User}
							onchange={() => error = null} 
						/>
					</div>
					<div class="flex-1">
						<FormInput 
							type="text" 
							placeholder="Cognome" 
							bind:value={surname} 
							onchange={() => error = null} 
						/>
					</div>
				</div>
			{/if}
			
			<FormInput 
				type="email" 
				placeholder="Email" 
				bind:value={email} 
				FormIcon={Mail}
				onchange={() => error = null} 
			/>
			<FormInput 
				type="password" 
				placeholder="Password" 
				bind:value={password} 
				FormIcon={Lock}
				onchange={() => error = null} 
			/>

			<!-- Error Message -->
			{#if error}
				<div class="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-sm text-red-600 dark:text-red-400 text-center animate-in slide-in-from-top-2 fade-in duration-200">
					{error}
				</div>
			{/if}

			<!-- Submit Button -->
			<div class="mt-2">
				<FormButton disabled={loading} fullWidth size="md">
					{loading ? 'Attendi...' : register ? 'Registrati' : 'Accedi'}
				</FormButton>
			</div>

			<!-- Toggle Mode -->
			<div class="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
				{register ? "Hai già un account?" : "Non hai ancora un account?"}
				<button 
					type="button"
					onclick={switchMode}
					class="ml-1 font-semibold text-crimson-600 hover:text-crimson-500 dark:text-crimson-500 dark:hover:text-crimson-400 hover:underline transition-colors focus:outline-none cursor-pointer"
				>
					{register ? 'Accedi' : 'Registrati'}
				</button>
			</div>
		</form>
	</div>
</Modal>

<script lang="ts">
	import { X, Mail, Lock, User } from 'lucide-svelte';
	import { authState } from '$lib/state/auth.svelte';
	import { LEGAL, LEGAL_VERSIONS } from '$lib/config/legal';

	// The Supabase client is loaded when the form is submitted, so every public
	// page stays free of the auth library until someone actually signs in.
	const getSupabase = async () => (await import('$lib/auth/client')).getBrowserClient();

	import FormButton from '$lib/components/ui/forms/FormButton.svelte';
	import FormInput from '$lib/components/ui/forms/FormInput.svelte';
	import Modal from '$lib/components/ui/modals/Modal.svelte';

	let register = $derived(authState.modalRegister);
	// Registration needs both confirmations before the button does anything.
	let canSubmit = $derived(!register || (acceptedTerms && ageDeclared));

	let email = $state('');
	let password = $state('');
	let name = $state('');
	let surname = $state('');
	let acceptedTerms = $state(false);
	let ageDeclared = $state(false);
	let error = $state<string | null>(null);
	let notice = $state<string | null>(null);
	let loading = $state(false);

	const close = () => {
		authState.closeModal();
		error = null;
		notice = null;
	};

	function friendly(message: string): string {
		if (/invalid login/i.test(message)) return 'Email o password errate. Riprova.';
		if (/already registered/i.test(message)) return 'Esiste già un account con questa email. Prova ad accedere.';
		if (/password/i.test(message) && /6/.test(message)) return 'La password deve avere almeno 6 caratteri.';
		if (/rate limit/i.test(message)) return 'Troppi tentativi. Riprova tra qualche minuto.';
		return message;
	}

	const handleLogin = async () => {
		const supabase = await getSupabase();
		const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
		if (authError) throw authError;
		if (data.user) await authState.completeLogin(data.user);
	};

	const handleRegister = async () => {
		if (!acceptedTerms || !ageDeclared) {
			throw new Error('Per registrarti devi accettare i Termini e confermare la tua età.');
		}
		const supabase = await getSupabase();
		const { data, error: authError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				// The confirmation link comes back to the same host (localhost while testing, the site in production).
				emailRedirectTo: `${window.location.origin}/`,
				data: {
					first_name: name.trim(),
					last_name: surname.trim(),
					// Record of what was accepted at signup, with the document versions.
					legal: {
						terms: LEGAL_VERSIONS.terms,
						privacy: LEGAL_VERSIONS.privacy,
						age_declaration: `over_${LEGAL.digitalConsentAge}_or_parent`,
						accepted_at: new Date().toISOString()
					}
				}
			}
		});
		if (authError) throw authError;

		if (data.session && data.user) {
			await authState.completeLogin(data.user);
		} else {
			// Email confirmation is on: the session arrives after the link is clicked.
			notice = `Ti abbiamo inviato un'email a ${email}: apri il link per confermare l'account, poi accedi.`;
			authState.modalRegister = false;
		}
	};

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		if (loading) return;
		loading = true;
		error = null;
		notice = null;
		try {
			if (register) await handleRegister();
			else await handleLogin();
		} catch (err) {
			error = friendly(err instanceof Error ? err.message : String(err));
		} finally {
			loading = false;
		}
	};

	const switchMode = () => {
		authState.modalRegister = !authState.modalRegister;
		error = null;
		notice = null;
	};
</script>

<Modal
	isOpen={authState.modalOpen}
	backgroundBlur="sm"
	onClose={close}
	classes="bg-white dark:bg-zinc-900 shadow-2xl rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[420px] p-0 border border-zinc-500/25 pb-safe sm:pb-0"
>
	<div class="relative px-5 pt-8 pb-6 sm:px-6 sm:pt-10 sm:pb-8" role="dialog" aria-modal="true" aria-labelledby="auth-title">
		<button
			type="button"
			onclick={close}
			class="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500"
			aria-label="Chiudi"
		>
			<X class="size-5" aria-hidden="true" />
		</button>

		<div class="text-center mb-8">
			<h2 id="auth-title" class="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
				{register ? 'Crea un account' : 'Bentornato'}
			</h2>
			<p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
				{register ? 'Serve solo per i piani Premium: la teoria resta gratis.' : 'Accedi per continuare a studiare.'}
			</p>
		</div>

		<form onsubmit={handleSubmit} class="flex flex-col gap-4">
			{#if register}
				<div class="flex gap-3">
					<div class="flex-1">
						<FormInput type="text" placeholder="Nome" bind:value={name} FormIcon={User} onchange={() => (error = null)} />
					</div>
					<div class="flex-1">
						<FormInput type="text" placeholder="Cognome" bind:value={surname} onchange={() => (error = null)} />
					</div>
				</div>
			{/if}

			<FormInput type="email" placeholder="Email" bind:value={email} FormIcon={Mail} onchange={() => (error = null)} />
			<FormInput type="password" placeholder="Password" bind:value={password} FormIcon={Lock} onchange={() => (error = null)} />

			{#if register}
				<div class="flex flex-col gap-3 text-sm text-zinc-600 dark:text-zinc-400">
					<label class="flex items-start gap-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={acceptedTerms}
							required
							class="mt-0.5 size-4 rounded border-zinc-400 text-crimson-600 focus:ring-crimson-500 dark:bg-zinc-800 dark:border-zinc-600"
						/>
						<span>
							Ho letto e accetto i <a href="/terms" target="_blank" class="font-medium text-crimson-600 dark:text-crimson-400 hover:underline">Termini e condizioni</a>
							e ho preso visione dell'<a href="/privacy" target="_blank" class="font-medium text-crimson-600 dark:text-crimson-400 hover:underline">informativa sulla privacy</a>.
						</span>
					</label>
					<label class="flex items-start gap-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={ageDeclared}
							required
							class="mt-0.5 size-4 rounded border-zinc-400 text-crimson-600 focus:ring-crimson-500 dark:bg-zinc-800 dark:border-zinc-600"
						/>
						<span>
							Ho almeno {LEGAL.digitalConsentAge} anni, oppure sono il genitore (o chi ne fa le veci) che crea l'account per uno studente più giovane.
						</span>
					</label>
				</div>
			{/if}

			{#if error}
				<div class="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-sm text-red-600 dark:text-red-400 text-center" role="alert">
					{error}
				</div>
			{/if}
			{#if notice}
				<div class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 text-sm text-emerald-700 dark:text-emerald-300 text-center" role="status">
					{notice}
				</div>
			{/if}

			<div class="mt-2">
				<FormButton disabled={loading || !canSubmit} fullWidth size="md">
					{loading ? 'Attendi…' : register ? 'Registrati' : 'Accedi'}
				</FormButton>
			</div>

			<div class="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
				{register ? 'Hai già un account?' : 'Non hai ancora un account?'}
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

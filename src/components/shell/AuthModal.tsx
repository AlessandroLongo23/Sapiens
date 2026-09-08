'use client';

import { useState, type FormEvent } from 'react';
import { Lock, Mail, User, X } from 'lucide-react';
import { useAuth } from '@/lib/state/auth';
import { LEGAL, LEGAL_VERSIONS } from '@/lib/config/legal';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { checkboxClass, fieldClass } from '@/components/ui/Field';
import type { IconComponent } from '@/lib/utils/icons';

// The Supabase client is loaded when the form is submitted, so every public
// page stays free of the auth library until someone actually signs in.
const getSupabase = async () => (await import('@/lib/auth/client')).getBrowserClient();

function friendly(message: string): string {
	if (/invalid login/i.test(message)) return 'Email o password errate. Riprova.';
	if (/already registered/i.test(message)) return 'Esiste già un account con questa email. Prova ad accedere.';
	if (/password/i.test(message) && /6/.test(message)) return 'La password deve avere almeno 6 caratteri.';
	if (/rate limit/i.test(message)) return 'Troppi tentativi. Riprova tra qualche minuto.';
	if (/anonymous sign-ins|missing email|email.*required/i.test(message)) return 'Inserisci email e password.';
	if (/invalid.*email|unable to validate email/i.test(message)) return "L'indirizzo email non sembra valido.";
	return message;
}

function IconInput({ icon: Icon, label, ...rest }: { icon?: IconComponent; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
	return (
		<div className="relative">
			{Icon && <Icon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-fg-faint" aria-hidden="true" />}
			<input className={`${fieldClass} px-4 py-3 ${Icon ? 'pl-12' : ''}`} aria-label={label} placeholder={label} {...rest} />
		</div>
	);
}

/** Login and registration in one dialog; registration records the accepted document versions with the account. */
export function AuthModal() {
	const { modalOpen, modalRegister: register, closeModal, setRegister, completeLogin } = useAuth();
	const [form, setForm] = useState({ email: '', password: '', name: '', surname: '', terms: false, age: false });
	const [status, setStatus] = useState<{ error?: string; notice?: string; loading?: boolean }>({});
	const canSubmit = !register || (form.terms && form.age);
	// Typing clears an error; a notice (the confirmation email) stays until the dialog closes.
	const field = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
		if (status.error) setStatus({});
	};

	const close = () => {
		closeModal();
		setStatus({});
	};

	const submit = async (e: FormEvent) => {
		e.preventDefault();
		if (status.loading) return;
		setStatus({ loading: true });
		try {
			const supabase = await getSupabase();
			if (!register) {
				const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
				if (error) throw error;
				if (data.user) await completeLogin(data.user);
				return;
			}
			const { data, error } = await supabase.auth.signUp({
				email: form.email,
				password: form.password,
				options: {
					// The confirmation link comes back to the same host (localhost while testing, the site in production).
					emailRedirectTo: `${window.location.origin}/`,
					data: {
						first_name: form.name.trim(),
						last_name: form.surname.trim(),
						// Record of what was accepted at signup, with the document versions.
						legal: { terms: LEGAL_VERSIONS.terms, privacy: LEGAL_VERSIONS.privacy, age_declaration: `over_${LEGAL.digitalConsentAge}_or_parent`, accepted_at: new Date().toISOString() }
					}
				}
			});
			if (error) throw error;
			if (data.session && data.user) await completeLogin(data.user);
			else {
				// Email confirmation is on: the session arrives after the link is clicked.
				setStatus({ notice: `Ti abbiamo inviato un'email a ${form.email}: apri il link per confermare l'account, poi accedi.` });
				setRegister(false);
			}
		} catch (err) {
			setStatus({ error: friendly(err instanceof Error ? err.message : String(err)) });
		} finally {
			setStatus((s) => (s.loading ? {} : s));
		}
	};

	return (
		<Modal open={modalOpen} onClose={close} blur="sm" className="w-full rounded-t-3xl border border-edge bg-surface pb-safe shadow-2xl sm:max-w-[420px] sm:rounded-3xl sm:pb-0">
			<div className="relative px-5 pb-6 pt-8 sm:px-6 sm:pb-8 sm:pt-10" role="dialog" aria-modal="true" aria-labelledby="auth-title">
				<button type="button" onClick={close} className="absolute right-4 top-4 rounded-full p-2 text-fg-faint transition-colors hover:bg-surface-3 hover:text-fg-muted focus-ring" aria-label="Chiudi">
					<X className="size-5" aria-hidden="true" />
				</button>
				<div className="mb-8 text-center">
					<h2 id="auth-title" className="text-2xl font-bold tracking-tight text-fg-strong">
						{register ? 'Crea un account' : 'Bentornato'}
					</h2>
					<p className="mt-2 text-sm text-fg-subtle">{register ? 'Serve solo per i piani Premium: la teoria resta gratis.' : 'Accedi per continuare a studiare.'}</p>
				</div>
				<form onSubmit={submit} className="flex flex-col gap-4">
					{register && (
						<div className="flex gap-3">
							<div className="flex-1">
								<IconInput icon={User} type="text" label="Nome" required autoComplete="given-name" value={form.name} onChange={field('name')} />
							</div>
							<div className="flex-1">
								<IconInput type="text" label="Cognome" required autoComplete="family-name" value={form.surname} onChange={field('surname')} />
							</div>
						</div>
					)}
					<IconInput icon={Mail} type="email" label="Email" required value={form.email} onChange={field('email')} autoComplete="email" />
					<IconInput icon={Lock} type="password" label="Password" required minLength={6} value={form.password} onChange={field('password')} autoComplete={register ? 'new-password' : 'current-password'} />
					{register && (
						<div className="flex flex-col gap-3 text-sm text-fg-muted">
							<label className="flex cursor-pointer items-start gap-3">
								<input type="checkbox" checked={form.terms} onChange={field('terms')} required className={checkboxClass} />
								<span>
									Ho letto e accetto i{' '}
									<a href="/terms" target="_blank" className="font-medium text-accent-fg hover:underline">
										Termini e condizioni
									</a>{' '}
									e ho preso visione dell&apos;
									<a href="/privacy" target="_blank" className="font-medium text-accent-fg hover:underline">
										informativa sulla privacy
									</a>
									.
								</span>
							</label>
							<label className="flex cursor-pointer items-start gap-3">
								<input type="checkbox" checked={form.age} onChange={field('age')} required className={checkboxClass} />
								<span>Ho almeno {LEGAL.digitalConsentAge} anni, oppure sono il genitore (o chi ne fa le veci) che crea l&apos;account per uno studente più giovane.</span>
							</label>
						</div>
					)}
					{status.error && <Alert tone="error">{status.error}</Alert>}
					{status.notice && <Alert tone="success">{status.notice}</Alert>}
					<Button type="submit" size="lg" className="mt-2 w-full" disabled={!canSubmit} loading={status.loading}>
						{status.loading ? 'Attendi…' : register ? 'Registrati' : 'Accedi'}
					</Button>
					<p className="mt-2 text-center text-sm text-fg-muted">
						{register ? 'Hai già un account?' : 'Non hai ancora un account?'}
						<button type="button" onClick={() => { setRegister(!register); setStatus({}); }} className="ml-1 font-semibold text-accent-fg hover:underline focus-ring rounded">
							{register ? 'Accedi' : 'Registrati'}
						</button>
					</p>
				</form>
			</div>
		</Modal>
	);
}

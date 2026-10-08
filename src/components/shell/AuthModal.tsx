'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, Mail, User, X } from 'lucide-react';
import { useAuth } from '@/lib/state/auth';
import { LEGAL } from '@/lib/config/legal';
import { DOORS, SIGNUP_PATH, WELCOME_PATH, type AgeBand, type Door } from '@/lib/onboarding/config';
import { REFERRAL } from '@/lib/referrals/config';
import { inviteCode } from '@/lib/referrals/cookie';
import { TRIAL_DAYS } from '@/lib/stripe/config';
import { Modal } from '@/components/ui/Modal';
import { Button, buttonClass } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { checkboxClass, fieldClass } from '@/components/ui/Field';
import { cn } from '@/lib/utils/cn';
import type { IconComponent } from '@/lib/utils/icons';

// The Supabase client is loaded when the form is submitted, so every public
// page stays free of the auth library until someone actually signs in.
const getSupabase = async () => (await import('@/lib/auth/client')).getBrowserClient();

function friendly(message: string): string {
	if (/invalid login/i.test(message)) return 'Email o password errate. Riprova.';
	if (/banned/i.test(message)) return 'Questo account aspetta la conferma di un genitore: gli abbiamo scritto quando ti sei iscritto.';
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

const EMPTY = { email: '', password: '', name: '', surname: '', parentEmail: '', terms: false, adult: false };

const choiceClass = (selected: boolean) =>
	cn(
		'rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors focus-ring',
		selected ? 'border-accent bg-accent-soft text-fg-strong' : 'border-edge bg-surface text-fg hover:bg-surface-3'
	);

/**
 * Login and registration in one dialog. Registration starts from "Chi sei?", then the form: a student says whether
 * they are under 14 (then a parent confirms by email before the account can be used), every other role declares to
 * be an adult. The account is made on the server and is signed in at once: the email is confirmed later, with a
 * code (vault/Prodotti/Studenti/Onboarding.md).
 */
export function AuthModal() {
	const router = useRouter();
	const { modalOpen, modalRegister: register, closeModal, setRegister, completeLogin } = useAuth();
	const [form, setForm] = useState(EMPTY);
	const [door, setDoor] = useState<Door | null>(null);
	const [age, setAge] = useState<Extract<AgeBand, 'under14' | '14plus'> | null>(null);
	const [status, setStatus] = useState<{ error?: string; notice?: string; loading?: boolean }>({});
	const waiting = useAuth((state) => state.next !== null);
	const invite = modalOpen && register ? inviteCode() : null;

	// Signing up with nothing else in progress is the onboarding, a page of its own; the dialog keeps the short
	// form for whoever signs up in the middle of something (a checkout, a request to a tutor) and goes back to it.
	useEffect(() => {
		if (!modalOpen || !register || waiting) return;
		closeModal();
		router.push(SIGNUP_PATH);
	}, [modalOpen, register, waiting, closeModal, router]);
	const student = door === 'student';
	const copy = DOORS.find((d) => d.id === door);
	const canSubmit = !register || (form.terms && (student ? age !== null : form.adult));
	// Typing clears an error; a notice (the email to the parent) stays until the dialog closes.
	const field = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
		if (status.error) setStatus({});
	};

	const close = () => {
		closeModal();
		setStatus({});
		setDoor(null);
	};

	const signIn = async () => {
		const supabase = await getSupabase();
		const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
		if (error) throw error;
		return data.user;
	};

	const submit = async (e: FormEvent) => {
		e.preventDefault();
		if (status.loading) return;
		setStatus({ loading: true });
		try {
			if (!register) {
				const user = await signIn();
				if (user) await completeLogin(user);
				return;
			}
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					role: door,
					firstName: form.name,
					lastName: form.surname,
					email: form.email,
					password: form.password,
					terms: form.terms,
					age: student ? age : form.adult ? 'adult' : null,
					parentEmail: form.parentEmail,
					invite
				})
			});
			const result = await response.json().catch(() => ({}));
			if (!response.ok) throw new Error(result.error || 'Iscrizione non riuscita. Riprova.');
			if (result.state === 'parent') {
				setStatus({ notice: `Abbiamo scritto a ${result.parentEmail}. Quando un genitore conferma, entri con la tua email e la tua password.` });
				setForm(EMPTY);
				return;
			}
			const user = await signIn();
			if (!user) return;
			// Whoever signed up to do something (a checkout, a request to a tutor) goes on with it; everyone else is
			// taken to their first step.
			const midAction = useAuth.getState().next !== null;
			await completeLogin(user);
			setDoor(null);
			setForm(EMPTY);
			if (!midAction) router.push(door === 'student' ? WELCOME_PATH : door === 'tutor' ? '/profile-editor' : '/');
		} catch (err) {
			setStatus({ error: friendly(err instanceof Error ? err.message : String(err)) });
		} finally {
			setStatus((s) => (s.loading ? {} : s));
		}
	};

	const asking = register && door === null;
	const waitingParent = register && !!status.notice;

	return (
		<Modal open={modalOpen && (!register || waiting)} onClose={close} blur="sm" className="w-full rounded-t-3xl border border-edge bg-surface pb-safe shadow-2xl sm:max-w-[420px] sm:rounded-3xl sm:pb-0">
			<div className="relative px-5 pb-6 pt-8 sm:px-6 sm:pb-8 sm:pt-10" role="dialog" aria-modal="true" aria-labelledby="auth-title">
				{register && door !== null && !waitingParent && (
					<button type="button" onClick={() => { setDoor(null); setStatus({}); }} className="absolute left-4 top-4 rounded-full p-2 text-fg-faint transition-colors hover:bg-surface-3 hover:text-fg-muted focus-ring" aria-label="Indietro">
						<ArrowLeft className="size-5" aria-hidden="true" />
					</button>
				)}
				<button type="button" onClick={close} className="absolute right-4 top-4 rounded-full p-2 text-fg-faint transition-colors hover:bg-surface-3 hover:text-fg-muted focus-ring" aria-label="Chiudi">
					<X className="size-5" aria-hidden="true" />
				</button>
				<div className="mb-8 text-center">
					<h2 id="auth-title" className="text-2xl font-bold tracking-tight text-fg-strong">
						{!register ? 'Bentornato' : asking ? 'Chi sei?' : waitingParent ? 'Manca un passo' : 'Crea un account'}
					</h2>
					<p className="mt-2 text-sm text-fg-subtle">
						{!register
							? 'Accedi per continuare a studiare.'
							: asking
								? 'Sapiens è fatto per chi studia, e per chi lo aiuta.'
								: waitingParent
									? 'Il tuo account parte quando un genitore conferma.'
									: student
										? `Provi Studio per ${invite ? REFERRAL.trialDays : TRIAL_DAYS} giorni, senza carta. Teoria e formulari restano gratis.`
										: 'La teoria e i formulari sono gratis per tutti.'}
					</p>
				</div>

				{asking ? (
					<div className="flex flex-col gap-3">
						{DOORS.map((d) => (
							<button key={d.id} type="button" onClick={() => setDoor(d.id)} className={choiceClass(false)}>
								{d.label}
							</button>
						))}
						<p className="mt-2 text-center text-sm text-fg-muted">
							Hai già un account?
							<button type="button" onClick={() => { setRegister(false); setStatus({}); }} className="ml-1 font-semibold text-accent-fg hover:underline focus-ring rounded">
								Accedi
							</button>
						</p>
					</div>
				) : register && door === 'school' ? (
					<div className="flex flex-col gap-4">
						<p className="text-sm text-fg-muted">{copy?.today}</p>
						<Link href="/contacts" onClick={close} className={buttonClass('primary', 'lg', 'w-full no-underline')}>
							Scrivici
						</Link>
					</div>
				) : waitingParent ? (
					<div className="flex flex-col gap-4">
						<Alert tone="success">{status.notice}</Alert>
						<p className="text-sm text-fg-muted">Nel frattempo le lezioni sono aperte a tutti: puoi cominciare a leggere.</p>
						<Button size="lg" className="w-full" onClick={close}>
							Ho capito
						</Button>
					</div>
				) : (
					<form onSubmit={submit} className="flex flex-col gap-4">
						{register && copy?.today && <p className="text-sm text-fg-muted">{copy.today}</p>}
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
						{register && student && (
							<fieldset className="flex flex-col gap-2">
								<legend className="mb-2 text-sm font-medium text-fg-muted">Quanti anni hai?</legend>
								<div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Quanti anni hai?">
									{(
										[
											['under14', `Meno di ${LEGAL.digitalConsentAge}`],
											['14plus', `${LEGAL.digitalConsentAge} o più`]
										] as const
									).map(([value, label]) => (
										<button key={value} type="button" role="radio" aria-checked={age === value} onClick={() => { setAge(value); if (status.error) setStatus({}); }} className={cn(choiceClass(age === value), 'text-center')}>
											{label}
										</button>
									))}
								</div>
							</fieldset>
						)}
						{register && student && age === 'under14' && (
							<div className="flex flex-col gap-2">
								<p className="text-sm text-fg-muted">Sotto i {LEGAL.digitalConsentAge} anni serve il consenso di un genitore. Scrivi la sua email: gli mandiamo un link, e il tuo account parte quando conferma.</p>
								<IconInput icon={Mail} type="email" label="Email di un genitore" required value={form.parentEmail} onChange={field('parentEmail')} autoComplete="off" />
							</div>
						)}
						{register && (
							<div className="flex flex-col gap-3 text-sm text-fg-muted">
								{!student && (
									<label className="flex cursor-pointer items-start gap-3">
										<input type="checkbox" checked={form.adult} onChange={field('adult')} required className={checkboxClass} />
										<span>Ho almeno 18 anni.</span>
									</label>
								)}
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
							</div>
						)}
						{register && invite && <Alert tone="success">Sei qui con un invito: la prova di Studio dura {REFERRAL.trialDays} giorni invece di {TRIAL_DAYS}, senza carta.</Alert>}
						{status.error && <Alert tone="error">{status.error}</Alert>}
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
				)}
			</div>
		</Modal>
	);
}

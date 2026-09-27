'use client';

import { useState } from 'react';
import { getBrowserClient } from '@/lib/auth/client';
import { ACCOUNT_ROOT } from '@/lib/config/site';
import { Hint, Input, Label } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { SettingRow, SettingsForm, SettingsGroup } from './Settings';

type Status = { busy?: boolean; ok?: string; error?: string };

/** Supabase's messages, in Italian and in the student's terms. */
function message(error: { message: string; code?: string }): string {
	const m = error.message;
	if (/rate limit|security purposes|seconds/i.test(m)) return 'Troppi tentativi ravvicinati. Aspetta un minuto e riprova.';
	if (/already.*registered|already exists|email_exists/i.test(m) || error.code === 'email_exists') return "Quest'email è già usata da un altro account.";
	if (/invalid.*email|email.*invalid/i.test(m)) return "Quest'indirizzo email non è valido.";
	if (/same.*password|different from the old/i.test(m)) return 'La nuova password deve essere diversa da quella attuale.';
	if (/weak|at least|characters/i.test(m)) return 'La password deve avere almeno 6 caratteri.';
	return 'Qualcosa non ha funzionato. Riprova.';
}

/**
 * A new email: Supabase writes to both addresses and switches only when both
 * links are opened (secure email change is on in the project).
 */
export function EmailForm({ email }: { email: string }) {
	const [next, setNext] = useState('');
	const [status, setStatus] = useState<Status>({});
	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		const value = next.trim();
		if (value.toLowerCase() === email.toLowerCase()) return setStatus({ error: "È già l'email del tuo account." });
		setStatus({ busy: true });
		const { error } = await getBrowserClient().auth.updateUser({ email: value }, { emailRedirectTo: `${window.location.origin}${ACCOUNT_ROOT}/accesso` });
		if (error) return setStatus({ error: message(error) });
		setNext('');
		setStatus({ ok: `Ti abbiamo scritto a ${email} e a ${value}. L'email cambia quando apri il link in entrambe.` });
	};
	return (
		<SettingsGroup title="Email" description={<>Usi <span className="font-medium text-fg">{email}</span> per accedere e per ricevere i messaggi di Sapiens.</>}>
			<SettingsForm onSubmit={submit}>
				<div>
					<Label htmlFor="new-email">Nuova email</Label>
					<Input id="new-email" type="email" required autoComplete="email" value={next} onChange={(e) => setNext(e.target.value)} className="sm:max-w-sm" />
					<Hint>Riceverai un link di conferma sia qui sia all&apos;indirizzo attuale.</Hint>
				</div>
				{status.error && <Alert tone="error">{status.error}</Alert>}
				{status.ok && <Alert tone="success">{status.ok}</Alert>}
				<div>
					<Button type="submit" size="sm" loading={status.busy} disabled={!next.trim()}>
						Cambia email
					</Button>
				</div>
			</SettingsForm>
		</SettingsGroup>
	);
}

/**
 * A new password, after the current one: the project does not ask for a
 * reauthentication, so the check is ours, by signing in again with it.
 */
export function PasswordForm({ email }: { email: string }) {
	const [form, setForm] = useState({ current: '', next: '', repeat: '' });
	const [status, setStatus] = useState<Status>({});
	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (form.next !== form.repeat) return setStatus({ error: 'Le due password nuove non coincidono.' });
		setStatus({ busy: true });
		const supabase = getBrowserClient();
		const check = await supabase.auth.signInWithPassword({ email, password: form.current });
		if (check.error) return setStatus({ error: /invalid login/i.test(check.error.message) ? 'La password attuale non è corretta.' : message(check.error) });
		const { error } = await supabase.auth.updateUser({ password: form.next });
		if (error) return setStatus({ error: message(error) });
		setForm({ current: '', next: '', repeat: '' });
		setStatus({ ok: 'Password cambiata.' });
	};
	const field = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value });
	return (
		<SettingsGroup title="Password">
			<SettingsForm onSubmit={submit}>
				{/* For password managers: the account the password belongs to. */}
				<input type="email" value={email} autoComplete="username" readOnly hidden />
				<div className="grid gap-4 sm:max-w-sm">
					<div>
						<Label htmlFor="current-password">Password attuale</Label>
						<Input id="current-password" type="password" required autoComplete="current-password" value={form.current} onChange={field('current')} />
					</div>
					<div>
						<Label htmlFor="new-password">Nuova password</Label>
						<Input id="new-password" type="password" required minLength={6} autoComplete="new-password" value={form.next} onChange={field('next')} />
						<Hint>Almeno 6 caratteri.</Hint>
					</div>
					<div>
						<Label htmlFor="repeat-password">Ripeti la nuova password</Label>
						<Input id="repeat-password" type="password" required minLength={6} autoComplete="new-password" value={form.repeat} onChange={field('repeat')} />
					</div>
				</div>
				{status.error && <Alert tone="error">{status.error}</Alert>}
				{status.ok && <Alert tone="success">{status.ok}</Alert>}
				<div>
					<Button type="submit" size="sm" loading={status.busy}>
						Cambia password
					</Button>
				</div>
			</SettingsForm>
		</SettingsGroup>
	);
}

/** Ends every session of the account, this one included: for a lost phone or a shared computer. */
export function SignOutEverywhere() {
	const [busy, setBusy] = useState(false);
	const run = async () => {
		setBusy(true);
		try {
			await getBrowserClient().auth.signOut({ scope: 'global' });
		} finally {
			window.location.assign(window.location.origin + '/');
		}
	};
	return (
		<SettingsGroup title="Dispositivi">
			<SettingRow label="Esci da tutti i dispositivi" hint="Chiude Sapiens su ogni telefono, tablet e computer dove hai fatto l'accesso, compreso questo. Utile se hai perso il telefono o hai usato un computer della scuola.">
				<Button variant="secondary" size="sm" onClick={run} loading={busy}>
					Esci ovunque
				</Button>
			</SettingRow>
		</SettingsGroup>
	);
}

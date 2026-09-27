'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { useConsent } from '@/lib/consent/consent';
import { getBrowserClient } from '@/lib/auth/client';
import { Hint, Input, Label } from '@/components/ui/Field';
import { Button, buttonClass } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { SettingRow, SettingsForm, SettingsGroup } from './Settings';

/** The cookie choice as it stands, and the banner again to change it. */
export function CookieSettings() {
	const { consent, hydrated, hydrate, reopen } = useConsent();
	useEffect(() => {
		hydrate();
	}, [hydrate]);
	const state = !hydrated ? '' : consent === null ? 'Non hai ancora scelto.' : consent.analytics ? 'Accettate: ci aiutano a capire quali lezioni sono più utili.' : 'Rifiutate: usiamo solo i cookie tecnici per farti accedere.';
	return (
		<SettingsGroup title="Cookie">
			<SettingRow label="Statistiche anonime" hint={state}>
				<Button variant="secondary" size="sm" onClick={reopen}>
					Cambia scelta
				</Button>
			</SettingRow>
		</SettingsGroup>
	);
}

/** Everything Sapiens keeps about the student, as a JSON file (art. 20 GDPR). */
export function ExportData() {
	return (
		<SettingsGroup title="Scarica i tuoi dati">
			<SettingRow label="Una copia di tutto" hint="Profilo, quaderni e note, diario, esercizi svolti, adesivi e richieste ai tutor, in un file JSON che puoi aprire o portare altrove.">
				<a href="/api/account/export" download className={buttonClass('secondary', 'sm')}>
					<Download className="size-4" aria-hidden="true" />
					Scarica
				</a>
			</SettingRow>
		</SettingsGroup>
	);
}

/**
 * Deleting the account, behind a second step where the student types the
 * account's email: the server checks it again and does the deleting.
 */
export function DeleteAccount({ email, subscribed }: { email: string; subscribed: boolean }) {
	const [open, setOpen] = useState(false);
	const [typed, setTyped] = useState('');
	const [status, setStatus] = useState<{ busy?: boolean; error?: string }>({});
	const matches = typed.trim().toLowerCase() === email.toLowerCase();

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus({ busy: true });
		const response = await fetch('/api/account/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: typed }) }).catch(() => null);
		const body = await response?.json().catch(() => ({}));
		if (!response?.ok) return setStatus({ error: body?.error ?? 'Qualcosa non ha funzionato. Riprova.' });
		// The user is gone on the server; this drops the session cookies left in the browser.
		await getBrowserClient().auth.signOut({ scope: 'local' }).catch(() => {});
		window.location.assign(window.location.origin + '/');
	};

	return (
		<SettingsGroup
			title="Elimina l'account"
			tone="danger"
			description="Cancella per sempre l'account e tutto quello che contiene: quaderni e note, diario, esercizi, adesivi e richieste ai tutor. Non si può annullare."
		>
			{!open ? (
				<SettingRow label="Eliminare l'account?" hint={subscribed ? "L'abbonamento viene chiuso subito, senza rimborso del mese in corso. Le ricevute restano disponibili nelle email di Stripe." : 'Se vuoi tenere una copia, scarica prima i tuoi dati.'}>
					<Button variant="secondary" size="sm" onClick={() => setOpen(true)} className="text-danger-fg">
						Elimina l&apos;account
					</Button>
				</SettingRow>
			) : (
				<SettingsForm onSubmit={submit}>
					<div className="sm:max-w-sm">
						<Label htmlFor="confirm-email">Per confermare, scrivi la tua email</Label>
						<Input id="confirm-email" type="email" autoComplete="off" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder={email} autoFocus />
						<Hint>{email}</Hint>
					</div>
					{status.error && <Alert tone="error">{status.error}</Alert>}
					<div className="flex flex-wrap gap-2">
						<Button type="submit" size="sm" disabled={!matches} loading={status.busy} className="bg-danger hover:bg-danger">
							Elimina per sempre
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								setOpen(false);
								setTyped('');
								setStatus({});
							}}
						>
							Annulla
						</Button>
					</div>
				</SettingsForm>
			)}
		</SettingsGroup>
	);
}

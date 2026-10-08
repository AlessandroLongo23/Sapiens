'use client';

import { useState, useSyncExternalStore } from 'react';
import { authStore } from '@/lib/state/auth';
import { useRouter } from 'next/navigation';
import { Check, Copy, Share2 } from 'lucide-react';
import { REFERRAL } from '@/lib/referrals/config';
import { Input, Label, checkboxClass } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { SettingsForm, SettingsGroup } from './Settings';

const noSubscription = () => () => {};

/** The student's invite link, to copy or to send with the phone's share sheet (WhatsApp, in practice). */
export function InviteLink({ url, code }: { url: string; code: string }) {
	const [copied, setCopied] = useState(false);
	// Known only in the browser: the server renders the copy button alone, and the share button appears after hydration.
	const canShare = useSyncExternalStore(noSubscription, () => typeof navigator.share === 'function', () => false);
	const message = `Io studio matematica su Sapiens: con il mio invito la prova di Studio dura ${REFERRAL.trialDays} giorni, senza carta.`;

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Clipboard refused (an old browser, a denied permission): the link stays selectable in the field.
		}
	};
	const share = () => navigator.share({ title: 'Sapiens', text: message, url }).catch(() => {});

	return (
		<SettingsGroup title="Il tuo link" description={`Il tuo codice è ${code}. Chi apre il link e si iscrive lo usa da solo; puoi anche dettarglielo.`}>
			<div className="flex flex-col gap-3 py-4">
				<Input readOnly value={url} aria-label="Il tuo link di invito" onFocus={(e) => e.currentTarget.select()} />
				<div className="flex flex-wrap gap-2">
					<Button size="sm" variant={canShare ? 'secondary' : 'primary'} onClick={copy}>
						{copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
						{copied ? 'Copiato' : 'Copia il link'}
					</Button>
					{canShare && (
						<Button size="sm" onClick={share}>
							<Share2 className="size-4" aria-hidden="true" />
							Condividi
						</Button>
					)}
				</div>
			</div>
		</SettingsGroup>
	);
}

/** Before a code of one's own: the declaration of being an adult, which makes the code. */
export function AdultDeclaration() {
	const router = useRouter();
	const [adult, setAdult] = useState(false);
	const [status, setStatus] = useState<{ busy?: boolean; error?: string }>({});

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus({ busy: true });
		try {
			const response = await fetch('/api/inviti', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adult }) });
			const body = await response.json().catch(() => ({}));
			if (body.code === 'email_unverified') {
				setStatus({});
				return authStore.getState().openVerify(() => router.refresh());
			}
			if (!response.ok) throw new Error(body.error || 'Non siamo riusciti a creare il tuo codice. Riprova.');
			router.refresh();
		} catch (err) {
			setStatus({ error: err instanceof Error ? err.message : 'Non siamo riusciti a creare il tuo codice. Riprova.' });
		}
	};

	return (
		<SettingsGroup title="Il tuo link" description={`Gli inviti sono per chi ha almeno ${REFERRAL.minAge} anni: studenti maggiorenni, universitari, genitori che consigliano Sapiens ad altri genitori.`}>
			<SettingsForm onSubmit={submit}>
				<label className="flex cursor-pointer items-start gap-3 text-sm text-fg-muted">
					<input type="checkbox" checked={adult} onChange={(e) => setAdult(e.target.checked)} className={checkboxClass} />
					<span>Ho almeno {REFERRAL.minAge} anni.</span>
				</label>
				{status.error && <Alert tone="error">{status.error}</Alert>}
				<div>
					<Button type="submit" size="sm" disabled={!adult} loading={status.busy}>
						Crea il mio link
					</Button>
				</div>
			</SettingsForm>
		</SettingsGroup>
	);
}

/** A code received from a friend or a creator, entered by hand in the first days of the account. */
export function ClaimInvite() {
	const router = useRouter();
	const [code, setCode] = useState('');
	const [status, setStatus] = useState<{ busy?: boolean; ok?: boolean; error?: string }>({});

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus({ busy: true });
		try {
			const response = await fetch('/api/inviti/codice', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
			const body = await response.json().catch(() => ({}));
			if (!response.ok) throw new Error(body.error || 'Non siamo riusciti a usare il codice. Riprova.');
			setStatus({ ok: true });
			router.refresh();
		} catch (err) {
			setStatus({ error: err instanceof Error ? err.message : 'Non siamo riusciti a usare il codice. Riprova.' });
		}
	};

	return (
		<SettingsGroup title="Hai ricevuto un codice?" description={`Se ti sei iscritto senza il link di un invito, puoi inserire qui il codice: la tua prova dura ${REFERRAL.trialDays} giorni.`}>
			<SettingsForm onSubmit={submit}>
				<div>
					<Label htmlFor="invite-code">Codice</Label>
					<Input
						id="invite-code"
						value={code}
						maxLength={20}
						autoComplete="off"
						autoCapitalize="characters"
						spellCheck={false}
						onChange={(e) => {
							setCode(e.target.value.toUpperCase());
							if (status.error) setStatus({});
						}}
					/>
				</div>
				{status.error && <Alert tone="error">{status.error}</Alert>}
				{status.ok && <Alert tone="success">Fatto: la tua prova di Studio dura {REFERRAL.trialDays} giorni.</Alert>}
				<div>
					<Button type="submit" size="sm" disabled={code.trim().length < 4} loading={status.busy}>
						Usa il codice
					</Button>
				</div>
			</SettingsForm>
		</SettingsGroup>
	);
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { getBrowserClient } from '@/lib/auth/client';
import { ACCOUNT_ROOT } from '@/lib/config/site';
import { Input, Label } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { SettingRow, SettingsForm, SettingsGroup } from './Settings';

const text = (value: unknown) => (typeof value === 'string' ? value : '');

/**
 * Name and surname, the only personal data Sapiens asks for, with the email beside them. `user` comes from the
 * server, so the fields are filled on the first paint.
 */
export function ProfileForm({ user: initial }: { user: User }) {
	const router = useRouter();
	const [user, setUser] = useState(initial);
	const saved = { first: text(user.user_metadata?.first_name), last: text(user.user_metadata?.last_name) };
	const [form, setForm] = useState(saved);
	const [status, setStatus] = useState<{ busy?: boolean; ok?: boolean; error?: string }>({});
	const changed = form.first.trim() !== saved.first || form.last.trim() !== saved.last;

	const save = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus({ busy: true });
		const { data, error } = await getBrowserClient().auth.updateUser({ data: { first_name: form.first.trim(), last_name: form.last.trim() } });
		if (error || !data.user) return setStatus({ error: 'Non siamo riusciti a salvare. Riprova.' });
		setUser(data.user);
		setForm({ first: form.first.trim(), last: form.last.trim() });
		setStatus({ ok: true });
		router.refresh();
	};

	return (
		<SettingsGroup title="Dati personali" description="Il nome compare nel menu dell'account e nelle richieste che mandi ai tutor.">
			<SettingsForm onSubmit={save}>
				<div className="grid gap-4 sm:grid-cols-2">
					<div>
						<Label htmlFor="first-name">Nome</Label>
						<Input id="first-name" value={form.first} maxLength={60} autoComplete="given-name" onChange={(e) => setForm({ ...form, first: e.target.value })} />
					</div>
					<div>
						<Label htmlFor="last-name">Cognome</Label>
						<Input id="last-name" value={form.last} maxLength={60} autoComplete="family-name" onChange={(e) => setForm({ ...form, last: e.target.value })} />
					</div>
				</div>
				{status.error && <Alert tone="error">{status.error}</Alert>}
				{status.ok && !changed && <Alert tone="success">Salvato.</Alert>}
				<div>
					<Button type="submit" size="sm" disabled={!changed} loading={status.busy}>
						Salva
					</Button>
				</div>
			</SettingsForm>
			<SettingRow label="Email" hint={user.email}>
				<Link href={`${ACCOUNT_ROOT}/accesso`} className="text-sm font-medium text-accent-fg hover:underline underline-offset-2 rounded focus-ring">
					Cambia email
				</Link>
			</SettingRow>
		</SettingsGroup>
	);
}

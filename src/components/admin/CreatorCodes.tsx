'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CreatorCodeStats } from '@/lib/server/referrals';
import { Input, Label } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

async function post(url: string, body: unknown) {
	const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
	const data = await response.json().catch(() => ({}));
	if (!response.ok) throw new Error(data.error || 'Operazione non riuscita.');
	return data;
}

/** A new creator's code: the code they will say in their videos and their name. */
export function NewCreatorCode() {
	const router = useRouter();
	const [form, setForm] = useState({ code: '', label: '' });
	const [status, setStatus] = useState<{ busy?: boolean; error?: string }>({});
	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus({ busy: true });
		try {
			await post('/api/admin/inviti', form);
			setForm({ code: '', label: '' });
			setStatus({});
			router.refresh();
		} catch (err) {
			setStatus({ error: err instanceof Error ? err.message : 'Operazione non riuscita.' });
		}
	};
	return (
		<form onSubmit={submit} className="flex flex-col gap-4 rounded-xl border border-edge bg-surface p-4 sm:flex-row sm:items-end">
			<div className="flex-1">
				<Label htmlFor="creator-code">Codice</Label>
				<Input id="creator-code" value={form.code} maxLength={20} placeholder="MATEFACILE" onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
			</div>
			<div className="flex-1">
				<Label htmlFor="creator-label">Creator</Label>
				<Input id="creator-label" value={form.label} maxLength={100} placeholder="Nome e profilo" onChange={(e) => setForm({ ...form, label: e.target.value })} />
			</div>
			<Button type="submit" loading={status.busy} disabled={form.code.length < 4 || !form.label.trim()}>
				Crea il codice
			</Button>
			{status.error && <Alert tone="error">{status.error}</Alert>}
		</form>
	);
}

/** A creator's row: what the code brought, and the switch to turn the code off. */
export function CreatorCodeRow({ stats }: { stats: CreatorCodeStats }) {
	const router = useRouter();
	const [busy, setBusy] = useState(false);
	const toggle = async () => {
		setBusy(true);
		try {
			await post(`/api/admin/inviti/${stats.code}`, { active: !stats.active });
			router.refresh();
		} catch (err) {
			window.alert(err instanceof Error ? err.message : 'Operazione non riuscita.');
		} finally {
			setBusy(false);
		}
	};
	return (
		<tr className="border-b border-edge-soft last:border-0">
			<th scope="row" className="px-4 py-3 text-left font-normal">
				<span className="font-mono font-medium text-fg">{stats.code}</span>
				<span className="block text-fg-subtle">{stats.label}</span>
				{!stats.active && <span className="text-xs text-danger-fg">disattivato</span>}
			</th>
			<td className="px-4 py-3 tabular-nums">{stats.signups}</td>
			<td className="px-4 py-3 tabular-nums">{stats.activated}</td>
			<td className="px-4 py-3 tabular-nums">{stats.paying}</td>
			<td className="px-4 py-3">
				<Button size="sm" variant="ghost" disabled={busy} onClick={toggle}>
					{stats.active ? 'Disattiva' : 'Riattiva'}
				</Button>
			</td>
		</tr>
	);
}

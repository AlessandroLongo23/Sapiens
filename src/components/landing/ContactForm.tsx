'use client';

import { useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { FREQUENCY_OPTIONS, LEVEL_OPTIONS, SUBJECT_OPTIONS_BY_LEVEL } from '@/lib/data/contact-options';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Input, Label, Select, checkboxClass } from '@/components/ui/Field';

/** The contact form: who, which level and subjects, how often; sent by email to the owner. */
export function ContactForm() {
	const [form, setForm] = useState({ firstName: '', lastName: '', contact: '', level: '', subjects: [] as string[], customSubject: '', frequency: '' });
	const [state, setState] = useState<{ sending?: boolean; sent?: boolean; error?: string }>({});
	// Honeypot: hidden from people, filled by bots; the server drops any submission that carries a value.
	const [website, setWebsite] = useState('');
	const subjects = form.level ? (SUBJECT_OPTIONS_BY_LEVEL[form.level] ?? []) : [];
	const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [key]: e.target.value });

	const submit = async (e: FormEvent) => {
		e.preventDefault();
		if (state.sending) return;
		setState({ sending: true });
		try {
			const response = await fetch('/api/emails/first-contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, website }) });
			if (!response.ok) {
				const body = await response.json().catch(() => ({}));
				throw new Error(typeof body.error === 'string' ? body.error : '');
			}
			setState({ sent: true });
		} catch (err) {
			setState({ error: (err instanceof Error && err.message) || 'Non siamo riusciti a inviare la richiesta. Riprova tra qualche minuto.' });
		}
	};

	if (state.sent) {
		return (
			<Alert tone="success" title="Richiesta inviata" className="rounded-2xl p-6">
				<p className="text-fg-muted">Grazie {form.firstName}. Ti rispondiamo il prima possibile all&apos;indirizzo {form.contact}.</p>
			</Alert>
		);
	}

	return (
		<form onSubmit={submit} className="space-y-6 rounded-2xl border border-edge bg-surface/80 p-6 sm:p-8">
			<div className="hidden" aria-hidden="true">
				<label htmlFor="website">Sito web</label>
				<input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				<div>
					<Label htmlFor="firstName">Nome</Label>
					<Input id="firstName" name="firstName" type="text" required autoComplete="given-name" value={form.firstName} onChange={set('firstName')} />
				</div>
				<div>
					<Label htmlFor="lastName">Cognome</Label>
					<Input id="lastName" name="lastName" type="text" required autoComplete="family-name" value={form.lastName} onChange={set('lastName')} />
				</div>
			</div>
			<div>
				<Label htmlFor="contact">Email</Label>
				<Input id="contact" name="contact" type="email" required autoComplete="email" value={form.contact} onChange={set('contact')} />
			</div>
			<div>
				<Label htmlFor="level">Livello di studio</Label>
				<Select id="level" name="level" required value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value, subjects: [] })}>
					<option value="" disabled>Scegli un livello</option>
					{LEVEL_OPTIONS.map((o) => (
						<option key={o.value} value={o.value}>{o.title}</option>
					))}
				</Select>
			</div>
			{subjects.length > 0 && (
				<fieldset>
					<legend className="mb-1 block text-sm font-medium text-fg-muted">Materie</legend>
					<div className="grid gap-2 sm:grid-cols-2">
						{subjects.map((o) => (
							<label key={o.value} className="flex cursor-pointer items-center gap-2 rounded-lg border border-edge px-3 py-2 text-fg hover:border-edge-strong">
								<input type="checkbox" name="subjects" value={o.value} checked={form.subjects.includes(o.value)} onChange={(e) => setForm({ ...form, subjects: e.target.checked ? [...form.subjects, o.value] : form.subjects.filter((s) => s !== o.value) })} className={checkboxClass} />
								{o.title}
							</label>
						))}
					</div>
					{form.subjects.includes('altro') && (
						<div className="mt-3">
							<Label htmlFor="customSubject">Quale materia?</Label>
							<Input id="customSubject" name="customSubject" type="text" value={form.customSubject} onChange={set('customSubject')} />
						</div>
					)}
				</fieldset>
			)}
			<div>
				<Label htmlFor="frequency">Frequenza</Label>
				<Select id="frequency" name="frequency" required value={form.frequency} onChange={set('frequency')}>
					<option value="" disabled>Scegli</option>
					{FREQUENCY_OPTIONS.map((o) => (
						<option key={o.value} value={o.value}>{o.title}: {o.subtitle}</option>
					))}
				</Select>
			</div>
			{state.error && <Alert tone="error">{state.error}</Alert>}
			<Button type="submit" size="lg" loading={state.sending}>
				{!state.sending && <Send className="size-4" aria-hidden="true" />}
				{state.sending ? 'Invio in corso…' : 'Invia la richiesta'}
			</Button>
		</form>
	);
}

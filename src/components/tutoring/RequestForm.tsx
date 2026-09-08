'use client';

import { useState, type FormEvent } from 'react';
import { Send, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/state/auth';
import { levelName, modeName, subjectName, tutorDisplayName, type TutorProfile } from '@/lib/tutoring/config';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { CheckboxRow, Hint, Input, Label, Select, Textarea } from '@/components/ui/Field';

const MIN_MESSAGE = 20;
const MAX_MESSAGE = 1500;

interface Props {
	tutor: TutorProfile;
	/** Preselected values, from the list filters. */
	initial?: { subject?: string; level?: string; mode?: string };
	/** One field per row, for a narrow column such as the profile sidebar. */
	compact?: boolean;
}

const pick = (options: string[], wanted?: string) => (wanted && options.includes(wanted) ? wanted : (options[0] ?? ''));

/**
 * A student's (or parent's) request to be put in touch with one tutor.
 * Anonymous visitors fill it in and are asked to log in on submit; the
 * request is then sent on its own. Contact details reach the tutor only
 * when they accept, and the form says so.
 */
export function RequestForm({ tutor, initial = {}, compact = false }: Props) {
	const { user, openModal } = useAuth();
	const name = tutorDisplayName(tutor);
	const [form, setForm] = useState({
		subject: pick(tutor.subjects, initial.subject),
		level: pick(tutor.levels, initial.level),
		mode: pick(tutor.modes, initial.mode),
		requester: 'student' as 'student' | 'parent',
		// Null until typed into: name and email then come from the account, once known.
		contactName: null as string | null,
		contactPhone: '',
		contactEmail: null as string | null,
		message: '',
		consent: false
	});
	const [state, setState] = useState<{ sending?: boolean; sent?: boolean; error?: string }>({});
	const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));

	const meta = (user?.user_metadata ?? {}) as Record<string, unknown>;
	const contactName = form.contactName ?? [meta.first_name, meta.last_name].filter((v) => typeof v === 'string' && v).join(' ');
	const contactEmail = form.contactEmail ?? user?.email ?? '';

	const validate = (): string | null => {
		if (!form.subject || !form.level || !form.mode) return 'Scegli materia, livello e modalità.';
		if (contactName.trim().length < 2) return 'Inserisci il nome di chi verrà contattato.';
		if (form.contactPhone.replace(/^\+/, '').replace(/\D/g, '').length < 8) return 'Inserisci un numero di telefono valido.';
		if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) return "L'indirizzo email non sembra valido.";
		if (form.message.trim().length < MIN_MESSAGE) return `Racconta al tutor di cosa hai bisogno (almeno ${MIN_MESSAGE} caratteri).`;
		if (form.message.length > MAX_MESSAGE) return `Il messaggio può avere al massimo ${MAX_MESSAGE} caratteri.`;
		if (!form.consent) return 'Per inviare la richiesta devi acconsentire alla comunicazione dei contatti al tutor.';
		return null;
	};

	const send = async (): Promise<void> => {
		const response = await fetch('/api/tutoring/requests', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ tutorId: tutor.id, ...form, contactName: contactName.trim(), contactPhone: form.contactPhone.trim(), contactEmail: contactEmail.trim() || null, message: form.message.trim() })
		});
		const body = await response.json().catch(() => ({}));
		if (response.status === 401) return openModal({ next: deliver });
		if (!response.ok) throw new Error(body.error ?? 'Invio non riuscito. Riprova tra qualche minuto.');
		setState({ sent: true });
	};

	/** Sends and shows the outcome in the form, whether called from the submit button or right after a login. */
	const deliver = async (): Promise<void> => {
		setState({ sending: true });
		try {
			await send();
		} catch (err) {
			setState({ error: err instanceof Error ? err.message : 'Invio non riuscito. Riprova tra qualche minuto.' });
		}
	};

	const submit = async (e: FormEvent) => {
		e.preventDefault();
		if (state.sending) return;
		const error = validate();
		if (error) return setState({ error });
		// The request is sent as soon as the login (or signup) completes.
		if (!user) return openModal({ register: true, next: deliver });
		await deliver();
	};

	if (state.sent) {
		return (
			<Alert tone="success" title={`Richiesta inviata a ${name}`} className="rounded-2xl p-5">
				<p className="text-fg-muted">{name} ha 48 ore per accettare. Se accetta, vi mandiamo i contatti a vicenda e organizzate le lezioni direttamente tra voi. Se non risponde, la richiesta scade e puoi scriverne un&apos;altra.</p>
			</Alert>
		);
	}

	return (
		<form onSubmit={submit} className="space-y-5" noValidate>
			<div className={cn('grid gap-3', !compact && 'sm:grid-cols-3')}>
				<div>
					<Label htmlFor="req-subject">Materia</Label>
					<Select id="req-subject" value={form.subject} onChange={(e) => set('subject', e.target.value)} required>
						{tutor.subjects.map((s) => <option key={s} value={s}>{subjectName(s)}</option>)}
					</Select>
				</div>
				<div>
					<Label htmlFor="req-level">Livello</Label>
					<Select id="req-level" value={form.level} onChange={(e) => set('level', e.target.value)} required>
						{tutor.levels.map((l) => <option key={l} value={l}>{levelName(l)}</option>)}
					</Select>
				</div>
				<div>
					<Label htmlFor="req-mode">Modalità</Label>
					<Select id="req-mode" value={form.mode} onChange={(e) => set('mode', e.target.value)} required>
						{tutor.modes.map((m) => <option key={m} value={m}>{modeName(m)}</option>)}
					</Select>
				</div>
			</div>
			<fieldset>
				<legend className="mb-1 block text-sm font-medium text-fg-muted">Chi scrive</legend>
				<div className="grid grid-cols-2 gap-2">
					{([['student', 'Sono lo studente'], ['parent', 'Sono un genitore']] as const).map(([id, label]) => (
						<label key={id} className={cn('flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors', form.requester === id ? 'border-accent bg-accent-soft text-fg' : 'border-edge text-fg-muted hover:border-edge-strong')}>
							<input type="radio" name="requester" value={id} checked={form.requester === id} onChange={() => set('requester', id)} className="text-accent-fg focus:ring-crimson-500" />
							{label}
						</label>
					))}
				</div>
				<Hint className="mt-1.5">Se hai meno di 18 anni, indica i contatti di un genitore.</Hint>
			</fieldset>
			<div className={cn('grid gap-3', !compact && 'sm:grid-cols-2')}>
				<div className="sm:col-span-2">
					<Label htmlFor="req-name">Nome e cognome</Label>
					<Input id="req-name" type="text" value={contactName} onChange={(e) => set('contactName', e.target.value)} autoComplete="name" required />
				</div>
				<div>
					<Label htmlFor="req-phone">Telefono</Label>
					<Input id="req-phone" type="tel" value={form.contactPhone} onChange={(e) => set('contactPhone', e.target.value)} autoComplete="tel" inputMode="tel" placeholder="+39 333 123 4567" required />
				</div>
				<div>
					<Label htmlFor="req-email">Email <span className="font-normal text-fg-subtle">(facoltativa)</span></Label>
					<Input id="req-email" type="email" value={contactEmail} onChange={(e) => set('contactEmail', e.target.value)} autoComplete="email" />
				</div>
			</div>
			<div>
				<Label htmlFor="req-message">Di cosa hai bisogno?</Label>
				<Textarea id="req-message" value={form.message} onChange={(e) => set('message', e.target.value)} rows={4} maxLength={MAX_MESSAGE} required placeholder="Es. Frequento la quarta liceo scientifico e tra due settimane ho una verifica sui limiti: vorrei due lezioni la settimana prossima." className="min-h-24" />
				<Hint className="text-right">{form.message.length}/{MAX_MESSAGE}</Hint>
			</div>
			<CheckboxRow checked={form.consent} onChange={(e) => set('consent', e.target.checked)} required>
				Acconsento a comunicare nome, telefono ed email a {name} per organizzare le lezioni, solo se accetta la richiesta. Leggi l&apos;<a href="/privacy" className="text-accent-fg hover:underline">informativa privacy</a>.
			</CheckboxRow>
			{state.error && <Alert tone="error">{state.error}</Alert>}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<Button type="submit" size="lg" className="shrink-0 whitespace-nowrap" loading={state.sending}>
					{!state.sending && <Send className="size-4" aria-hidden="true" />}
					{state.sending ? 'Invio in corso' : 'Invia la richiesta'}
				</Button>
				<p className="inline-flex items-start gap-1.5 text-xs text-fg-subtle">
					<ShieldCheck className="size-4 shrink-0 text-ok-fg" aria-hidden="true" />
					<span>Gratis. Nessun pagamento passa da Sapiens: le lezioni le concordate tra voi.</span>
				</p>
			</div>
		</form>
	);
}

'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Save } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { TUTOR_LEVELS, TUTOR_MODES, TUTOR_SUBJECTS, type TutorLevel, type TutorMode } from '@/lib/tutoring/config';
import type { TutorRow } from '@/lib/server/tutoring-admin';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CheckboxRow, Chip, Hint, Input, Label, Textarea, labelClass } from '@/components/ui/Field';

const school = TUTOR_SUBJECTS.filter((s) => s.group === 'scuola');
const university = TUTOR_SUBJECTS.filter((s) => s.group === 'università');

const toggle = <T extends string>(list: T[], value: T): T[] => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

/** Prefilled from the existing profile, or from the account for a new one. */
function initialForm(tutor: TutorRow | null, user: Pick<User, 'email' | 'user_metadata'> | null) {
	const meta = (user?.user_metadata ?? {}) as Record<string, unknown>;
	return {
		firstName: tutor?.first_name ?? (typeof meta.first_name === 'string' ? meta.first_name : ''),
		lastName: tutor?.last_name ?? (typeof meta.last_name === 'string' ? meta.last_name : ''),
		headline: tutor?.headline ?? '',
		bio: tutor?.bio ?? '',
		subjects: tutor?.subjects ?? ([] as string[]),
		levels: tutor?.levels ?? ([] as TutorLevel[]),
		modes: tutor?.modes ?? ([] as TutorMode[]),
		city: tutor?.city ?? '',
		hourlyRate: tutor?.hourly_rate == null ? '' : String(tutor.hourly_rate),
		education: tutor?.education ?? '',
		years: String(tutor?.years_experience ?? 0),
		contactPhone: tutor?.contact_phone ?? '',
		contactEmail: tutor?.contact_email ?? user?.email ?? '',
		terms: false
	};
}

/** Create or edit the signed-in user's tutor profile. A new profile goes to review; edits to a published one go live within a few minutes. */
export function ProfileEditor({ tutor, user }: { tutor: TutorRow | null; user: Pick<User, 'email' | 'user_metadata'> | null }) {
	const router = useRouter();
	const isNew = !tutor;
	const [form, setForm] = useState(() => initialForm(tutor, user));
	const [state, setState] = useState<{ saving?: boolean; saved?: boolean; error?: string }>({});
	const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));
	const text = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(key, e.target.value as never);

	const submit = async (e: FormEvent) => {
		e.preventDefault();
		if (state.saving) return;
		setState({ saving: true });
		try {
			const response = await fetch('/api/tutoring/profile', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					first_name: form.firstName,
					last_name: form.lastName,
					headline: form.headline,
					bio: form.bio,
					subjects: form.subjects,
					levels: form.levels,
					modes: form.modes,
					city: form.modes.includes('in_person') ? form.city : '',
					hourly_rate: form.hourlyRate === '' ? null : Number(form.hourlyRate),
					education: form.education,
					years_experience: Number(form.years || 0),
					contact_phone: form.contactPhone,
					contact_email: form.contactEmail,
					terms: form.terms
				})
			});
			const body = await response.json().catch(() => ({}));
			if (!response.ok) throw new Error(body.error ?? 'Salvataggio non riuscito. Riprova tra qualche minuto.');
			setState({ saved: true });
			router.refresh();
		} catch (err) {
			setState({ error: err instanceof Error ? err.message : 'Salvataggio non riuscito. Riprova tra qualche minuto.' });
		}
	};

	const chips = <T extends string>(items: { id: T; name: string }[], list: T[], key: 'subjects' | 'levels' | 'modes', label: string) => (
		<div className="flex flex-wrap gap-2" role="group" aria-label={label}>
			{items.map((item) => (
				<Chip key={item.id} on={list.includes(item.id)} onClick={() => set(key, toggle(list, item.id) as never)}>{item.name}</Chip>
			))}
		</div>
	);

	return (
		<div className="max-w-3xl">
			<header className="mb-6">
				<h1 className="text-3xl font-bold text-fg">{isNew ? 'Crea il tuo profilo tutor' : 'Il tuo profilo tutor'}</h1>
				<p className="mt-1 text-fg-muted">
					{isNew
						? 'Sul sito compaiono nome e iniziale del cognome, presentazione, materie, livelli e prezzo indicativo. Telefono ed email restano privati: li ricevono solo gli studenti che accetti.'
						: tutor?.status === 'pending'
							? 'Il profilo è in revisione: puoi modificarlo finché non è pubblicato.'
							: 'Le modifiche compaiono sul profilo pubblico entro pochi minuti.'}
				</p>
			</header>
			{state.saved && (
				<Alert tone="success" title="Profilo salvato" className="mb-6 rounded-2xl p-5">
					<p className="text-fg-muted">{tutor?.status === 'pending' || isNew ? 'Lo controlliamo a breve e ti avvisiamo via email quando è pubblico.' : 'Le modifiche sono online.'}</p>
					<Link href="/dashboard" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent-fg hover:underline">Vai al riepilogo <ArrowRight className="size-3.5" aria-hidden="true" /></Link>
				</Alert>
			)}
			<form onSubmit={submit} className="space-y-8" noValidate>
				<Card as="section" className="space-y-4 bg-surface/80 p-5 sm:p-6" aria-labelledby="chi-sei">
					<h2 id="chi-sei" className="text-lg font-semibold text-fg">Chi sei</h2>
					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<Label htmlFor="first_name">Nome</Label>
							<Input id="first_name" type="text" value={form.firstName} onChange={text('firstName')} autoComplete="given-name" required />
						</div>
						<div>
							<Label htmlFor="last_name">Cognome</Label>
							<Input id="last_name" type="text" value={form.lastName} onChange={text('lastName')} autoComplete="family-name" required />
							<Hint>Sul sito compare solo l&apos;iniziale.</Hint>
						</div>
					</div>
					<div>
						<Label htmlFor="headline">Presentazione in una riga</Label>
						<Input id="headline" type="text" value={form.headline} onChange={text('headline')} maxLength={120} placeholder="Es. Laureanda in Matematica, preparo alle verifiche di quarta e quinta" required />
						<Hint>{form.headline.length}/120</Hint>
					</div>
					<div>
						<Label htmlFor="bio">Presentazione</Label>
						<Textarea id="bio" value={form.bio} onChange={text('bio')} rows={6} maxLength={2000} required placeholder="Cosa studi o hai studiato, da quanto dai ripetizioni, come lavori con gli studenti. Un paragrafo vuoto separa i capoversi." />
						<Hint>{form.bio.length}/2000, almeno 40 caratteri.</Hint>
					</div>
					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<Label htmlFor="education">Formazione <span className="font-normal text-fg-subtle">(facoltativa)</span></Label>
							<Input id="education" type="text" value={form.education} onChange={text('education')} maxLength={120} placeholder="Es. Ingegneria informatica, Politecnico di Torino" />
						</div>
						<div>
							<Label htmlFor="years">Anni di ripetizioni</Label>
							<Input id="years" type="number" value={form.years} onChange={text('years')} min={0} max={50} step={1} />
						</div>
					</div>
				</Card>

				<Card as="section" className="space-y-5 bg-surface/80 p-5 sm:p-6" aria-labelledby="cosa-insegni">
					<h2 id="cosa-insegni" className="text-lg font-semibold text-fg">Cosa insegni</h2>
					<fieldset>
						<legend className={labelClass}>Materie <span className="font-normal text-fg-subtle">(fino a otto)</span></legend>
						<p className="mb-2 text-xs text-fg-subtle">Scuola</p>
						<div className="mb-3">{chips(school, form.subjects, 'subjects', 'Materie di scuola')}</div>
						<p className="mb-2 text-xs text-fg-subtle">Università</p>
						{chips(university, form.subjects, 'subjects', 'Materie universitarie')}
					</fieldset>
					<fieldset>
						<legend className={labelClass}>Livelli</legend>
						{chips(TUTOR_LEVELS, form.levels, 'levels', 'Livelli')}
					</fieldset>
					<fieldset>
						<legend className={labelClass}>Modalità</legend>
						{chips(TUTOR_MODES, form.modes, 'modes', 'Modalità')}
					</fieldset>
					<div className="grid gap-4 sm:grid-cols-2">
						{form.modes.includes('in_person') && (
							<div>
								<Label htmlFor="city">Città per le lezioni in presenza</Label>
								<Input id="city" type="text" value={form.city} onChange={text('city')} maxLength={60} autoComplete="address-level2" placeholder="Es. Bologna" />
							</div>
						)}
						<div>
							<Label htmlFor="hourly_rate">Prezzo orario indicativo <span className="font-normal text-fg-subtle">(facoltativo)</span></Label>
							<div className="relative">
								<Input id="hourly_rate" type="number" value={form.hourlyRate} onChange={text('hourlyRate')} min={5} max={200} step={0.5} placeholder="15" className="pr-12" />
								<span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-fg-subtle">€/h</span>
							</div>
							<Hint>Il prezzo lo concordi con lo studente; qui serve solo a orientare.</Hint>
						</div>
					</div>
				</Card>

				<Card as="section" className="space-y-4 bg-surface/80 p-5 sm:p-6" aria-labelledby="contatti">
					<h2 id="contatti" className="text-lg font-semibold text-fg">Contatti privati</h2>
					<p className="text-sm text-fg-muted">Non compaiono sul profilo. Li inviamo allo studente solo quando accetti la sua richiesta.</p>
					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<Label htmlFor="contact_phone">Telefono</Label>
							<Input id="contact_phone" type="tel" value={form.contactPhone} onChange={text('contactPhone')} autoComplete="tel" inputMode="tel" placeholder="+39 333 123 4567" required />
						</div>
						<div>
							<Label htmlFor="contact_email">Email</Label>
							<Input id="contact_email" type="email" value={form.contactEmail} onChange={text('contactEmail')} autoComplete="email" />
						</div>
					</div>
				</Card>

				{isNew && (
					<CheckboxRow checked={form.terms} onChange={(e) => set('terms', e.target.checked)} required className="rounded-2xl bg-surface/80 p-4">
						Accetto i <Link href="/terms" className="text-accent-fg hover:underline">Termini</Link> e l&apos;<Link href="/privacy" className="text-accent-fg hover:underline">informativa privacy</Link>. I dati degli studenti che accetto mi vengono comunicati solo per organizzare le lezioni: li uso per quello, non li cedo e li cancello se le lezioni non si fanno. Dichiaro imposte e contributi sulle lezioni per conto mio.
					</CheckboxRow>
				)}
				{state.error && <Alert tone="error">{state.error}</Alert>}
				<Button type="submit" size="lg" loading={state.saving}>
					{!state.saving && <Save className="size-4" aria-hidden="true" />}
					{state.saving ? 'Salvataggio' : isNew ? 'Invia il profilo in revisione' : 'Salva le modifiche'}
				</Button>
			</form>
		</div>
	);
}

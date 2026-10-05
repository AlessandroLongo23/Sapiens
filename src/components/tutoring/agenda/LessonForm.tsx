'use client';

import { useState } from 'react';
import { DURATIONS, durationLabel, isDayString, longDay, weeklyUntilMonthEnd, type Side } from '@/lib/tutoring/agenda';
import { TUTOR_MODES, type TutorMode } from '@/lib/tutoring/config';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { CheckboxRow, Hint, Input, Label, Select } from '@/components/ui/Field';
import { useApi } from './useApi';

/**
 * A new lesson. The tutor's is confirmed at once and can repeat weekly until the month ends; the student's is a
 * proposal. With `students` the tutor picks who it is with (the calendar); otherwise `linkId` says it.
 */
export function LessonForm({ side, linkId, students, today, day, onDone }: { side: Side; linkId?: string; students?: { id: string; name: string }[]; today: string; /** The day preselected. */ day?: string; onDone: () => void }) {
	const { busy, error, call } = useApi();
	const [link, setLink] = useState(linkId ?? students?.[0]?.id ?? '');
	const [date, setDate] = useState(day ?? '');
	const [time, setTime] = useState('16:00');
	const [durationMin, setDurationMin] = useState(60);
	const [mode, setMode] = useState<TutorMode>('online');
	const [place, setPlace] = useState('');
	const [note, setNote] = useState('');
	const [repeat, setRepeat] = useState(false);

	const series = isDayString(date) ? weeklyUntilMonthEnd(date) : [];

	const submit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (await call('lesson', '/api/tutoring/lessons', 'POST', { as: side, linkId: link, day: date, time, durationMin, mode, place, note, repeat: repeat && series.length > 1 })) onDone();
	};

	return (
		<form onSubmit={submit} className="space-y-4" noValidate>
			{error && <Alert tone="error">{error}</Alert>}
			{students && (
				<div>
					<Label htmlFor="lesson-student">Studente</Label>
					<Select id="lesson-student" value={link} onChange={(e) => setLink(e.target.value)} required>
						{students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
					</Select>
				</div>
			)}
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
				<div className="col-span-2 sm:col-span-1">
					<Label htmlFor="lesson-day">Giorno</Label>
					<Input id="lesson-day" type="date" value={date} min={side === 'student' ? today : undefined} onChange={(e) => setDate(e.target.value)} required />
				</div>
				<div>
					<Label htmlFor="lesson-time">Ora</Label>
					<Input id="lesson-time" type="time" value={time} step={300} onChange={(e) => setTime(e.target.value)} required />
				</div>
				<div>
					<Label htmlFor="lesson-duration">Durata</Label>
					<Select id="lesson-duration" value={durationMin} onChange={(e) => setDurationMin(Number(e.target.value))}>
						{DURATIONS.map((d) => <option key={d} value={d}>{durationLabel(d)}</option>)}
					</Select>
				</div>
			</div>
			<div className="grid gap-4 sm:grid-cols-[minmax(0,11rem)_1fr]">
				<div>
					<Label htmlFor="lesson-mode">Dove</Label>
					<Select id="lesson-mode" value={mode} onChange={(e) => setMode(e.target.value as TutorMode)}>
						{TUTOR_MODES.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
					</Select>
				</div>
				{side === 'tutor' && (
					<div>
						<Label htmlFor="lesson-place">{mode === 'online' ? 'Link della videochiamata' : 'Indirizzo'} <span className="font-normal text-fg-subtle">(facoltativo)</span></Label>
						<Input id="lesson-place" value={place} onChange={(e) => setPlace(e.target.value)} maxLength={300} placeholder={mode === 'online' ? 'https://meet.google.com/…' : 'Biblioteca Salaborsa, Bologna'} />
					</div>
				)}
			</div>
			<div>
				<Label htmlFor="lesson-note">{side === 'tutor' ? 'Argomenti' : 'Cosa vorresti fare'} <span className="font-normal text-fg-subtle">(facoltativo)</span></Label>
				<Input id="lesson-note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} placeholder="Disequazioni di secondo grado, verifica di giovedì" />
			</div>
			{side === 'tutor' ? (
				<CheckboxRow checked={repeat && series.length !== 1} disabled={series.length === 1} onChange={(e) => setRepeat(e.target.checked)}>
					Ripeti ogni settimana fino alla fine del mese
					{series.length === 1 ? <span className="mt-0.5 block text-fg-subtle">Dopo quel giorno il mese non ha altre settimane.</span> : repeat && series.length > 1 && <span className="mt-0.5 block text-fg-subtle">{series.length} lezioni, l&apos;ultima {longDay(series[series.length - 1])}.</span>}
				</CheckboxRow>
			) : (
				<Hint className="mt-0">Il tutor riceve la proposta e la accetta o la rifiuta. Quando accetta, la lezione compare nel tuo diario.</Hint>
			)}
			<div className="flex flex-wrap justify-end gap-2">
				<Button variant="ghost" onClick={onDone}>Annulla</Button>
				<Button type="submit" loading={busy === 'lesson'} disabled={!link || !date || !time}>{side === 'tutor' ? 'Fissa la lezione' : 'Proponi la lezione'}</Button>
			</div>
		</form>
	);
}

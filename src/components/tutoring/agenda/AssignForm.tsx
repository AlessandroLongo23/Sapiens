'use client';

import { useMemo, useState } from 'react';
import { subjectName } from '@/lib/tutoring/config';
import type { AssignableLesson } from '@/lib/tutoring/agenda';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Hint, Input, Label, Select } from '@/components/ui/Field';
import { useApi } from './useApi';

const fold = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** The tutor picks a lesson of the library, a level and a day: the exercises land in the student's diary. */
export function AssignForm({ linkId, lessons, subject, today, onDone }: { linkId: string; lessons: AssignableLesson[]; /** The link's subject, preselected when the library has it. */ subject: string | null; today: string; onDone: () => void }) {
	const { busy, error, call } = useApi();
	const subjects = useMemo(() => [...new Set(lessons.map((l) => l.subject))], [lessons]);
	const [chosenSubject, setChosenSubject] = useState(subject && subjects.includes(subject) ? subject : (subjects[0] ?? ''));
	const [query, setQuery] = useState('');
	const [path, setPath] = useState('');
	const [level, setLevel] = useState('');
	const [due, setDue] = useState('');
	const [note, setNote] = useState('');

	const shown = useMemo(() => {
		const q = fold(query.trim());
		return lessons.filter((l) => l.subject === chosenSubject && (!q || fold(`${l.title} ${l.chapter}`).includes(q)));
	}, [lessons, chosenSubject, query]);
	const chapters = useMemo(() => {
		const groups = new Map<string, AssignableLesson[]>();
		for (const l of shown) groups.set(l.chapter, [...(groups.get(l.chapter) ?? []), l]);
		return [...groups.entries()];
	}, [shown]);
	const lesson = lessons.find((l) => l.path === path) ?? null;

	const submit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (await call('assign', '/api/tutoring/assignments', 'POST', { linkId, lessonPath: path, level, due, note })) onDone();
	};

	return (
		<form onSubmit={submit} className="space-y-4" noValidate>
			{error && <Alert tone="error">{error}</Alert>}
			<div className="grid gap-4 sm:grid-cols-[minmax(0,12rem)_1fr]">
				<div>
					<Label htmlFor="assign-subject">Materia</Label>
					<Select id="assign-subject" value={chosenSubject} onChange={(e) => { setChosenSubject(e.target.value); setPath(''); setLevel(''); }}>
						{subjects.map((s) => <option key={s} value={s}>{subjectName(s)}</option>)}
					</Select>
				</div>
				<div>
					<Label htmlFor="assign-search">Cerca una lezione</Label>
					<Input id="assign-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="equazioni, frazioni, moto…" autoComplete="off" />
				</div>
			</div>
			<div>
				<Label htmlFor="assign-lesson">Lezione</Label>
				<Select id="assign-lesson" value={path} onChange={(e) => { setPath(e.target.value); setLevel(''); }} required>
					<option value="">{shown.length === 0 ? 'Nessuna lezione trovata' : `Scegli tra ${shown.length} lezioni`}</option>
					{chapters.map(([chapter, items]) => (
						<optgroup key={chapter} label={chapter}>
							{items.map((l) => <option key={l.path} value={l.path}>{l.title}</option>)}
						</optgroup>
					))}
				</Select>
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				<div>
					<Label htmlFor="assign-level">Cosa deve fare</Label>
					<Select id="assign-level" value={level} onChange={(e) => setLevel(e.target.value)} disabled={!lesson}>
						<option value="">Tutti i livelli della lezione</option>
						{lesson?.levels.map((l) => <option key={l.level} value={l.level}>Livello {l.level}{l.name ? `: ${l.name}` : ''}</option>)}
					</Select>
					<Hint>Il compito risulta fatto quando il livello è superato.</Hint>
				</div>
				<div>
					<Label htmlFor="assign-due">Entro</Label>
					<Input id="assign-due" type="date" value={due} min={today} onChange={(e) => setDue(e.target.value)} required />
				</div>
			</div>
			<div>
				<Label htmlFor="assign-note">Nota per lo studente <span className="font-normal text-fg-subtle">(facoltativa)</span></Label>
				<Input id="assign-note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} placeholder="Guarda bene i segni nel livello 3." />
			</div>
			<div className="flex flex-wrap justify-end gap-2">
				<Button variant="ghost" onClick={onDone}>Annulla</Button>
				<Button type="submit" loading={busy === 'assign'} disabled={!path || !due}>Assegna</Button>
			</div>
		</form>
	);
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TUTOR_LEVELS, TUTOR_SUBJECTS } from '@/lib/tutoring/config';
import type { TutorLink } from '@/lib/tutoring/agenda';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Hint, Input, Label, Select } from '@/components/ui/Field';
import { useApi } from './useApi';

/** A student's card: new (an invite is made, and the page of the student opens) or being changed. */
export function StudentForm({ link, subjects, onDone }: { link?: TutorLink; /** The tutor's own subjects, first in the list. */ subjects: string[]; onDone: () => void }) {
	const router = useRouter();
	const { busy, error, call } = useApi();
	const [name, setName] = useState(link?.name ?? '');
	const [subject, setSubject] = useState(link?.subject ?? subjects[0] ?? '');
	const [level, setLevel] = useState<string>(link?.level ?? '');
	const own = TUTOR_SUBJECTS.filter((s) => subjects.includes(s.id));
	const others = TUTOR_SUBJECTS.filter((s) => !subjects.includes(s.id));

	const submit = async (event: React.FormEvent) => {
		event.preventDefault();
		const saved = await call<{ link: TutorLink }>('student', link ? `/api/tutoring/students/${link.id}` : '/api/tutoring/students', link ? 'PATCH' : 'POST', { name, subject, level });
		if (!saved) return;
		onDone();
		if (!link) router.push(`/studenti/${saved.link.id}`);
	};

	return (
		<form onSubmit={submit} className="space-y-4" noValidate>
			{error && <Alert tone="error">{error}</Alert>}
			<div>
				<Label htmlFor="student-name">Nome dello studente</Label>
				<Input id="student-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder="Giulia R." autoComplete="off" required />
				{!link && <Hint>Lo vedi solo tu: serve a riconoscerlo nell&apos;elenco.</Hint>}
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				<div>
					<Label htmlFor="student-subject">Materia</Label>
					<Select id="student-subject" value={subject} onChange={(e) => setSubject(e.target.value)}>
						<option value="">Non indicata</option>
						{own.length > 0 && <optgroup label="Le tue materie">{own.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</optgroup>}
						<optgroup label={own.length > 0 ? 'Altre' : 'Materie'}>{others.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</optgroup>
					</Select>
				</div>
				<div>
					<Label htmlFor="student-level">Livello</Label>
					<Select id="student-level" value={level} onChange={(e) => setLevel(e.target.value)}>
						<option value="">Non indicato</option>
						{TUTOR_LEVELS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
					</Select>
				</div>
			</div>
			<div className="flex flex-wrap justify-end gap-2">
				<Button variant="ghost" onClick={onDone}>Annulla</Button>
				<Button type="submit" loading={busy === 'student'}>{link ? 'Salva' : "Aggiungi e crea l'invito"}</Button>
			</div>
		</form>
	);
}

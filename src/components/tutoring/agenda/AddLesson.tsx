'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { LessonForm } from './LessonForm';

/** "Fissa una lezione" on the calendar: the tutor picks the student too. */
export function AddLesson({ students, today }: { students: { id: string; name: string }[]; today: string }) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button onClick={() => setOpen(true)} disabled={students.length === 0}>
				<Plus className="size-4" aria-hidden="true" />
				Fissa una lezione
			</Button>
			<Sheet open={open} onClose={() => setOpen(false)} title="Fissa una lezione" align="center" width="md">
				<LessonForm side="tutor" students={students} today={today} onDone={() => setOpen(false)} />
			</Sheet>
		</>
	);
}

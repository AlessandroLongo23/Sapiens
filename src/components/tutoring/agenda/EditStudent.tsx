'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';
import type { TutorLink } from '@/lib/tutoring/agenda';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { StudentForm } from './StudentForm';

/** "Modifica" on a student's page: name, subject and level in a sheet. */
export function EditStudent({ link, subjects }: { link: TutorLink; subjects: string[] }) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
				<Pencil className="size-4" aria-hidden="true" />
				Modifica
			</Button>
			<Sheet open={open} onClose={() => setOpen(false)} title="Modifica lo studente" align="center" width="md">
				<StudentForm link={link} subjects={subjects} onDone={() => setOpen(false)} />
			</Sheet>
		</>
	);
}

'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { StudentForm } from './StudentForm';

/** "Aggiungi uno studente": the form in a sheet. */
export function AddStudent({ subjects, primary = true }: { subjects: string[]; primary?: boolean }) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button variant={primary ? 'primary' : 'secondary'} onClick={() => setOpen(true)}>
				<UserPlus className="size-4" aria-hidden="true" />
				Aggiungi uno studente
			</Button>
			<Sheet open={open} onClose={() => setOpen(false)} title="Aggiungi uno studente" description="Per uno studente che segui già. Gli mandi un invito, da aprire con il suo account Sapiens." align="center" width="md">
				<StudentForm subjects={subjects} onDone={() => setOpen(false)} />
			</Sheet>
		</>
	);
}

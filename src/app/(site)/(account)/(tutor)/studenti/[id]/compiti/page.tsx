import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { assignableLessons } from '@/lib/server/tutor-agenda';
import { studentFolder } from '@/lib/server/tutor-folder';
import { Assign, Assignments } from '@/components/tutoring/agenda/Assignments';
import { SectionTitle } from '@/components/tutoring/agenda/Paper';

export const metadata: Metadata = pageMetadata({ title: 'Compiti | Area tutor | Sapiens', path: '/studenti' });

/** The exercises assigned to a student: to do, done, late. */
export default async function StudentAssignmentsPage({ params }: { params: Promise<{ id: string }> }) {
	const folder = await studentFolder(params);
	if (!folder) return null;
	const { link, assignments, today, progress } = folder.sheet;
	const canAssign = link.status === 'active' && link.joined;
	const tutor = { linkId: link.id, lessons: canAssign ? await assignableLessons() : [], subject: link.subject, canAssign, shared: !!progress };
	return (
		<section aria-labelledby="compiti">
			<SectionTitle id="compiti" title="Compiti" count={assignments.length} action={<Assign tutor={tutor} today={today} primary />} />
			<Assignments
				assignments={assignments}
				today={today}
				tutor={tutor}
				empty={link.status === 'ended' ? 'Nessun compito assegnato.' : !link.joined ? `I compiti si assegnano quando ${link.name} accetta l'invito.` : 'Nessun compito assegnato. Scegli una lezione: gli esercizi compaiono nel suo diario.'}
			/>
		</section>
	);
}

import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { tutorFolder } from '@/lib/server/tutor-folder';
import { Assignments } from '@/components/tutoring/agenda/Assignments';
import { SectionTitle } from '@/components/tutoring/agenda/Paper';

export const metadata: Metadata = pageMetadata({ title: 'Compiti del tutor | Sapiens', path: '/il-mio-tutor' });

/** The exercises a tutor assigned: each opens the lesson's exercises, and ticks itself when the level is passed. */
export default async function MyTutorAssignmentsPage({ params }: { params: Promise<{ id: string }> }) {
	const { link, assignments, today } = await tutorFolder(params);
	return (
		<section aria-labelledby="compiti">
			<SectionTitle id="compiti" title="Compiti" count={assignments.length} />
			<Assignments assignments={assignments} today={today} empty={`${link.tutor.firstName} non ti ha ancora assegnato esercizi.`} />
			{assignments.length > 0 && <p className="mt-6 text-sm text-fg-subtle">Un compito si spunta da solo quando superi il livello negli esercizi. Li trovi anche nel diario, il giorno della scadenza.</p>}
		</section>
	);
}

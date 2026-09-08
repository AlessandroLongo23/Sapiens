import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { tutorArea } from '@/lib/server/tutor-area';
import { listTutorInbox } from '@/lib/server/tutoring-admin';
import { TutorInbox } from '@/components/tutoring/TutorInbox';
import { NoProfile } from '@/components/tutoring/NoProfile';

export const metadata: Metadata = pageMetadata({ title: 'Richieste | Area tutor | Sapiens', path: '/leads' });

export default async function LeadsPage() {
	const { tutor } = await tutorArea();
	return (
		<>
			<header className="mb-6">
				<h1 className="text-3xl font-bold text-fg">Richieste</h1>
				<p className="mt-1 text-fg-muted">Hai 48 ore per rispondere. Accettando ricevi i contatti dello studente e lo studente riceve i tuoi.</p>
			</header>
			{tutor ? <TutorInbox requests={await listTutorInbox(tutor.id)} published={tutor.status === 'published'} /> : <NoProfile title="Prima crea il tuo profilo" />}
		</>
	);
}

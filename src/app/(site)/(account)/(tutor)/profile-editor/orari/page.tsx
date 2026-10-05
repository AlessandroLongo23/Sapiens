import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { tutorArea } from '@/lib/server/tutor-area';
import { getAvailability } from '@/lib/server/tutor-agenda';
import { NoProfile } from '@/components/tutoring/NoProfile';
import { AvailabilityEditor } from '@/components/tutoring/agenda/AvailabilityEditor';

export const metadata: Metadata = pageMetadata({ title: 'Orari liberi | Area tutor | Sapiens', path: '/profile-editor' });

/** The hours of the week a tutor is free, shown on the public profile. */
export default async function AvailabilityPage() {
	const { tutor } = await tutorArea();
	if (!tutor) return <NoProfile title="Prima crea il tuo profilo" />;
	return <AvailabilityEditor slots={await getAvailability(tutor.id)} />;
}

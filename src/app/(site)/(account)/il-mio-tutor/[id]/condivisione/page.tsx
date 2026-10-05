import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { tutorFolder } from '@/lib/server/tutor-folder';
import { ConsentToggle } from '@/components/tutoring/agenda/ConsentToggle';
import { EndLink } from '@/components/tutoring/agenda/EndLink';
import { SectionTitle } from '@/components/tutoring/agenda/Paper';
import { ReviewForm } from '@/components/tutoring/agenda/ReviewForm';

export const metadata: Metadata = pageMetadata({ title: 'Condivisione | Il mio tutor | Sapiens', path: '/il-mio-tutor' });

/** What the tutor sees of the student, what the student says of the tutor, and the way out. */
export default async function MyTutorSharingPage({ params }: { params: Promise<{ id: string }> }) {
	const { link, review } = await tutorFolder(params);
	return (
		<div className="max-w-2xl space-y-12">
			<section aria-labelledby="cosa-vede">
				<SectionTitle id="cosa-vede" title="Cosa vede il tutor" />
				<ConsentToggle linkId={link.id} shared={link.progressShared} tutor={link.tutor.firstName} />
			</section>
			<section aria-labelledby="recensione">
				<SectionTitle id="recensione" title="La tua recensione" />
				<ReviewForm linkId={link.id} tutor={link.tutor.firstName} review={review} />
			</section>
			<section aria-labelledby="interrompi" className="border-t border-edge pt-6">
				<h2 id="interrompi" className="label-mono mb-2 text-fg-subtle">Non fai più lezione con {link.tutor.firstName}?</h2>
				<EndLink linkId={link.id} side="student" name={link.tutor.firstName} />
			</section>
		</div>
	);
}

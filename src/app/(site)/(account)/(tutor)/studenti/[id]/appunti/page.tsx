import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { studentFolder } from '@/lib/server/tutor-folder';
import { EndLink } from '@/components/tutoring/agenda/EndLink';
import { NotesBox } from '@/components/tutoring/agenda/NotesBox';
import { SectionTitle } from '@/components/tutoring/agenda/Paper';

export const metadata: Metadata = pageMetadata({ title: 'Appunti | Area tutor | Sapiens', path: '/studenti' });

/** The tutor's own page on a student, and the way to stop following them. */
export default async function StudentNotesPage({ params }: { params: Promise<{ id: string }> }) {
	const folder = await studentFolder(params);
	if (!folder) return null;
	const { link } = folder.sheet;
	return (
		<div className="space-y-12">
			<section aria-labelledby="appunti">
				<SectionTitle id="appunti" title="Appunti" />
				<NotesBox linkId={link.id} notes={link.notes} />
			</section>
			{link.status !== 'ended' && (
				<section aria-labelledby="interrompi" className="border-t border-edge pt-6">
					<h2 id="interrompi" className="label-mono mb-2 text-fg-subtle">Non lo segui più?</h2>
					<EndLink linkId={link.id} side="tutor" name={link.name} />
				</section>
			)}
		</div>
	);
}

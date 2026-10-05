import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { studentFolder } from '@/lib/server/tutor-folder';
import { Lessons, NewLesson } from '@/components/tutoring/agenda/Lessons';
import { SectionTitle } from '@/components/tutoring/agenda/Paper';

export const metadata: Metadata = pageMetadata({ title: 'Lezioni | Area tutor | Sapiens', path: '/studenti' });

/** The lessons with a student: the proposals to answer, the ones planned, the history. */
export default async function StudentLessonsPage({ params }: { params: Promise<{ id: string }> }) {
	const folder = await studentFolder(params);
	if (!folder) return null;
	const { link, lessons, today, now } = folder.sheet;
	const ended = link.status === 'ended';
	return (
		<section aria-labelledby="lezioni">
			<SectionTitle id="lezioni" title="Lezioni" count={lessons.length} action={!ended && <NewLesson side="tutor" linkId={link.id} today={today} primary />} />
			<Lessons lessons={lessons} side="tutor" now={now} canAdd={!ended} />
		</section>
	);
}

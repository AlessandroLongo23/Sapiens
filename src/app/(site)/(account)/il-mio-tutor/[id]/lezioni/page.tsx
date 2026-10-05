import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { tutorFolder } from '@/lib/server/tutor-folder';
import { Lessons, NewLesson } from '@/components/tutoring/agenda/Lessons';
import { SectionTitle } from '@/components/tutoring/agenda/Paper';

export const metadata: Metadata = pageMetadata({ title: 'Lezioni con il tutor | Sapiens', path: '/il-mio-tutor' });

/** The lessons with a tutor: the ones planned, the ones asked for, the history. */
export default async function MyTutorLessonsPage({ params }: { params: Promise<{ id: string }> }) {
	const { link, lessons, today, now } = await tutorFolder(params);
	return (
		<section aria-labelledby="lezioni">
			<SectionTitle id="lezioni" title="Lezioni" count={lessons.length} action={<NewLesson side="student" linkId={link.id} today={today} primary />} />
			<Lessons lessons={lessons} side="student" now={now} />
		</section>
	);
}

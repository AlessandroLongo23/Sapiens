import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { tutorArea } from '@/lib/server/tutor-area';
import { agendaClock, listTutorStudents, tutorLessonsBetween, tutorProposals } from '@/lib/server/tutor-agenda';
import { addDay, isDayString, mondayOf, romeInstant } from '@/lib/tutoring/agenda';
import { NoProfile } from '@/components/tutoring/NoProfile';
import { AddLesson } from '@/components/tutoring/agenda/AddLesson';
import { LessonCard } from '@/components/tutoring/agenda/Lessons';
import { AreaHeader, SectionTitle } from '@/components/tutoring/agenda/Paper';
import { WeekCalendar } from '@/components/tutoring/agenda/WeekCalendar';

export const metadata: Metadata = pageMetadata({ title: 'Calendario | Area tutor | Sapiens', path: '/calendario' });

/** The tutor's week of lessons, the proposals to answer, and the way to plan a new lesson. */
export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ settimana?: string }> }) {
	const { tutor } = await tutorArea();
	if (!tutor) return <NoProfile title="Prima crea il tuo profilo" />;
	const { settimana } = await searchParams;
	const { today, now } = agendaClock();
	const monday = mondayOf(isDayString(settimana) ? settimana : today);
	const [lessons, proposals, students] = await Promise.all([
		tutorLessonsBetween(tutor.id, romeInstant(monday, '00:00').toISOString(), romeInstant(addDay(monday, 7), '00:00').toISOString()),
		tutorProposals(tutor.id),
		listTutorStudents(tutor.id)
	]);
	const open = students.filter((s) => s.status !== 'ended').map((s) => ({ id: s.id, name: s.name }));
	return (
		<>
			<AreaHeader
				eyebrow={lessons.length === 1 ? '1 lezione in questa settimana' : `${lessons.length} lezioni in questa settimana`}
				title="Calendario"
				lead={open.length === 0 ? 'Per fissare una lezione aggiungi prima uno studente, dalla pagina Studenti.' : 'Le lezioni confermate compaiono anche nel diario dello studente.'}
				action={<AddLesson students={open} today={today} />}
			/>
			{proposals.length > 0 && (
				<section aria-labelledby="proposte" className="mb-10">
					<SectionTitle id="proposte" title="Proposte da confermare" count={proposals.length} />
					<ul className="grid gap-5 md:grid-cols-2">{proposals.map((l) => <LessonCard key={l.id} lesson={l} side="tutor" showWith now={now} />)}</ul>
				</section>
			)}
			<WeekCalendar monday={monday} today={today} lessons={lessons} now={now} subjects={Object.fromEntries(students.map((s) => [s.id, s.subject]))} />
		</>
	);
}

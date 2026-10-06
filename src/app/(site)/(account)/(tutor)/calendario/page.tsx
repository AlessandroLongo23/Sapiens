import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { tutorArea } from '@/lib/server/tutor-area';
import { agendaClock, firstLessonYear, listTutorStudents, tutorLessonsBetween, tutorProposals } from '@/lib/server/tutor-agenda';
import { addDay, euro, lessonFee, monthGrid, romeInstant, romeParts } from '@/lib/tutoring/agenda';
import { NoProfile } from '@/components/tutoring/NoProfile';
import { AddLesson } from '@/components/tutoring/agenda/AddLesson';
import { LessonCard } from '@/components/tutoring/agenda/Lessons';
import { MonthCalendar } from '@/components/tutoring/agenda/MonthCalendar';
import { AreaHeader, Figure, Figures, SectionTitle } from '@/components/tutoring/agenda/Paper';

export const metadata: Metadata = pageMetadata({ title: 'Calendario | Area tutor | Sapiens', path: '/calendario' });

const isMonth = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(v);

/** The tutor's month of lessons with its hours and what they are worth, the proposals to answer, and the way to plan a new lesson. */
export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ mese?: string }> }) {
	const { tutor } = await tutorArea();
	if (!tutor) return <NoProfile title="Prima crea il tuo profilo" />;
	const { mese } = await searchParams;
	const { today, now } = agendaClock();
	const month = isMonth(mese) ? mese : today.slice(0, 7);
	const days = monthGrid(month);
	const [lessons, proposals, students, first] = await Promise.all([
		tutorLessonsBetween(tutor.id, romeInstant(days[0], '00:00').toISOString(), romeInstant(addDay(days[days.length - 1], 1), '00:00').toISOString()),
		tutorProposals(tutor.id),
		listTutorStudents(tutor.id),
		firstLessonYear(tutor.id)
	]);
	const open = students.filter((s) => s.status !== 'ended').map((s) => ({ id: s.id, name: s.name, subject: s.subject }));
	const choices = { subjects: tutor.subjects, rate: tutor.hourly_rate };
	const own = lessons.filter((l) => l.status === 'confirmed' && romeParts(l.startsAt).day.startsWith(month));
	const hours = own.reduce((sum, l) => sum + l.durationMin / 60, 0);
	const earned = own.reduce((sum, l) => sum + lessonFee(l), 0);
	const thisYear = Number(today.slice(0, 4));
	const years = Array.from({ length: thisYear + 1 - Math.min(first ?? thisYear, thisYear) + 1 }, (_, i) => Math.min(first ?? thisYear, thisYear) + i);
	return (
		<>
			<AreaHeader
				eyebrow="Le tue lezioni"
				title="Calendario"
				lead={open.length === 0 ? 'Per fissare una lezione aggiungi prima uno studente, dalla pagina Studenti.' : 'Le lezioni confermate compaiono anche nel diario dello studente.'}
				action={<AddLesson students={open} today={today} choices={choices} />}
			/>
			{proposals.length > 0 && (
				<section aria-labelledby="proposte" className="mb-10">
					<SectionTitle id="proposte" title="Proposte da confermare" count={proposals.length} />
					<ul className="grid gap-5 md:grid-cols-2">{proposals.map((l) => <LessonCard key={l.id} lesson={l} side="tutor" showWith now={now} />)}</ul>
				</section>
			)}
			<div className="mb-8">
				<Figures label="Il mese in breve">
					<Figure value={own.length} label={own.length === 1 ? 'lezione nel mese' : 'lezioni nel mese'} />
					<Figure value={`${hours.toLocaleString('it-IT', { maximumFractionDigits: 1 })} h`} label="ore di lezione" />
					<Figure href="/guadagni" value={euro(earned)} label="valore del mese" />
					{hours > 0 && earned > 0 && <Figure value={euro(earned / hours)} label="in media l'ora" />}
				</Figures>
			</div>
			<MonthCalendar month={month} today={today} lessons={lessons} now={now} students={open} choices={choices} years={years} />
		</>
	);
}

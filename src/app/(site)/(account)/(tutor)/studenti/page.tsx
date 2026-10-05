import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarDays, ClipboardList, Clock, Eye, MessageCircle } from 'lucide-react';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { tutorArea } from '@/lib/server/tutor-area';
import { listTutorStudents, type StudentCard } from '@/lib/server/tutor-agenda';
import { lessonWhen } from '@/lib/tutoring/agenda';
import { levelName, subjectName } from '@/lib/tutoring/config';
import { NoProfile } from '@/components/tutoring/NoProfile';
import { AddStudent } from '@/components/tutoring/agenda/AddStudent';
import { Badge } from '@/components/ui/Badge';
import { CardLink } from '@/components/ui/Card';
import { AreaHeader, Empty, Initials } from '@/components/tutoring/agenda/Paper';

export const metadata: Metadata = pageMetadata({ title: 'Studenti | Area tutor | Sapiens', path: '/studenti' });

/** A student as a card: the name at the top, what waits below. */
function StudentRow({ s }: { s: StudentCard }) {
	const facts = [s.subject && subjectName(s.subject), s.level && levelName(s.level)].filter(Boolean).join(' · ');
	const lines = [
		{ icon: CalendarDays, text: s.nextLesson ? lessonWhen({ startsAt: s.nextLesson, durationMin: 0 }).replace(/-\d{2}:\d{2}$/, '') : 'Nessuna lezione fissata', strong: false },
		s.openAssignments > 0 && { icon: ClipboardList, text: s.openAssignments === 1 ? '1 compito aperto' : `${s.openAssignments} compiti aperti`, strong: false },
		s.unread > 0 && { icon: MessageCircle, text: s.unread === 1 ? '1 messaggio nuovo' : `${s.unread} messaggi nuovi`, strong: true },
		s.progressShared && { icon: Eye, text: 'Condivide i progressi', strong: false },
		s.hoursHeld > 0 && { icon: Clock, text: `${s.hoursHeld.toLocaleString('it-IT', { maximumFractionDigits: 1 })} h di lezione fatte`, strong: false }
	].filter((l): l is { icon: typeof Eye; text: string; strong: boolean } => !!l);
	return (
		<li data-student={s.name}>
			<CardLink href={`/studenti/${s.id}`} className="gap-3 p-5">
				<div className="flex items-center justify-between gap-3">
					<div className="flex min-w-0 items-center gap-3">
						<Initials name={s.name} subject={s.subject} size="sm" />
						<div className="min-w-0">
							<p className="truncate font-display text-xl font-semibold text-fg-strong">{s.name}</p>
							<p className="label-mono truncate text-fg-subtle">{facts || 'Materia non indicata'}</p>
						</div>
					</div>
					{s.status === 'invited' ? <Badge tone="warn">Invitato</Badge> : s.status === 'ended' ? <Badge>Interrotto</Badge> : null}
				</div>
				{s.status !== 'ended' && (
					<ul className="space-y-1.5 border-t border-edge pt-3">
						{lines.map(({ icon: Icon, text, strong }) => (
							<li key={text} className={`flex items-center gap-2 truncate text-sm first-letter:uppercase ${strong ? 'font-medium text-accent-fg' : 'text-fg-muted'}`}>
								<Icon className="size-3.5 shrink-0 text-fg-faint" aria-hidden="true" />
								{text}
							</li>
						))}
					</ul>
				)}
			</CardLink>
		</li>
	);
}

/** The students a tutor follows, as cards: the ones who found them on Sapiens and the ones they invited. */
export default async function StudentsPage() {
	const { tutor } = await tutorArea();
	if (!tutor) return <NoProfile title="Prima crea il tuo profilo" />;
	const students = await listTutorStudents(tutor.id);
	const open = students.filter((s) => s.status !== 'ended');
	const ended = students.filter((s) => s.status === 'ended');
	return (
		<>
			<AreaHeader
				eyebrow={open.length === 1 ? '1 studente' : `${open.length} studenti`}
				title="Studenti"
				lead="Chi ti ha trovato su Sapiens e chi seguivi già. Ogni scheda ha le sue lezioni, i compiti e i messaggi."
				action={<AddStudent subjects={tutor.subjects} />}
			/>
			{open.length === 0 ? (
				<Empty action={<p className="max-w-md">Aggiungi uno studente che segui già e mandagli l&apos;invito. Chi ti scrive da Sapiens entra qui quando accetti la sua richiesta.</p>}>
					<span role="heading" aria-level={2} className="font-semibold text-fg">Ancora nessuno studente</span>
				</Empty>
			) : (
				<ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{open.map((s) => <StudentRow key={s.id} s={s} />)}</ul>
			)}
			{ended.length > 0 && (
				<details className="mt-10">
					<summary className="label-mono cursor-pointer py-2 text-fg-subtle hover:text-fg">Interrotti ({ended.length})</summary>
					<ul className="mt-3 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{ended.map((s) => <StudentRow key={s.id} s={s} />)}</ul>
				</details>
			)}
			<p className="mt-10 text-sm text-fg-subtle">
				Chi ti scrive da Sapiens per la prima volta è in <Link href="/leads" className="text-accent-fg hover:underline">Richieste</Link>.
			</p>
		</>
	);
}

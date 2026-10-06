import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { assignableLessons } from '@/lib/server/tutor-agenda';
import { studentFolder } from '@/lib/server/tutor-folder';
import { formatDateTime } from '@/lib/tutoring/time';
import { Assign, Assignments } from '@/components/tutoring/agenda/Assignments';
import { InviteBox } from '@/components/tutoring/agenda/InviteBox';
import { Lessons, NewLesson } from '@/components/tutoring/agenda/Lessons';
import { Count, MoreLink, SectionTitle } from '@/components/tutoring/agenda/Paper';
import { NotShared, ProgressFigures, WeekTicks } from '@/components/tutoring/agenda/ProgressPanel';

export const metadata: Metadata = pageMetadata({ title: 'Scheda dello studente | Area tutor | Sapiens', path: '/studenti' });

/** The cover page of a student's folder: what is next, what is still to do, how it is going, the last word. */
export default async function StudentOverviewPage({ params }: { params: Promise<{ id: string }> }) {
	const folder = await studentFolder(params);
	if (!folder) return null;
	const { sheet } = folder;
	const { link, today, now } = sheet;
	const base = `/studenti/${link.id}`;
	const ended = link.status === 'ended';
	const canAssign = link.status === 'active' && link.joined;
	const lessons = canAssign ? await assignableLessons() : [];
	const last = sheet.messages.at(-1);

	return (
		<div className="grid items-start gap-x-12 [&>*]:min-w-0 gap-y-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
			<div className="space-y-10">
				{link.inviteCode && <InviteBox code={link.inviteCode} name={link.name} />}
				<section aria-labelledby="prossime-lezioni">
					<SectionTitle id="prossime-lezioni" title="Prossime lezioni" action={!ended && <NewLesson side="tutor" linkId={link.id} today={today} choices={{ subjects: folder.tutor.subjects, subject: link.subject, rate: folder.tutor.hourly_rate }} />} />
					<Lessons lessons={sheet.lessons} side="tutor" now={now} canAdd={!ended} limit={3} />
					<MoreLink href={`${base}/lezioni`}>Tutte le lezioni</MoreLink>
				</section>
				{(link.joined || sheet.assignments.length > 0) && (
					<section aria-labelledby="da-fare">
						<SectionTitle id="da-fare" title="Compiti da fare" action={<Assign tutor={{ linkId: link.id, lessons, subject: link.subject, canAssign, shared: !!sheet.progress }} today={today} />} />
						<Assignments assignments={sheet.assignments} today={today} tutor={{ linkId: link.id, lessons, subject: link.subject, canAssign, shared: !!sheet.progress }} empty={ended ? 'Nessun compito assegnato.' : 'Nessun compito assegnato. Gli esercizi che scegli compaiono nel suo diario.'} limit={3} />
						<MoreLink href={`${base}/compiti`}>Tutti i compiti</MoreLink>
					</section>
				)}
			</div>
			<aside className="space-y-8">
				{link.joined && !ended && (
					<section aria-labelledby="come-va">
						<SectionTitle id="come-va" title="Come va" />
						{sheet.progress ? (
							<div className="space-y-6">
								<ProgressFigures progress={sheet.progress} compact />
								<WeekTicks week={sheet.progress.week} />
								<MoreLink href={`${base}/progressi`}>Lezioni e livelli</MoreLink>
							</div>
						) : (
							<NotShared name={link.name} joined={link.joined} />
						)}
					</section>
				)}
				{link.joined && (
					<section aria-labelledby="ultimo-messaggio">
						<SectionTitle id="ultimo-messaggio" title="Messaggi" action={<Count n={sheet.unread} label={sheet.unread === 1 ? 'nuovo' : 'nuovi'} />} />
						{last ? (
							<>
								<p className="line-clamp-3 text-sm text-fg">{last.body}</p>
								<p className="mt-1 text-xs text-fg-subtle">{last.sender === 'student' ? link.name : 'Tu'} · {formatDateTime(last.createdAt)}</p>
							</>
						) : (
							<p className="text-sm text-fg-muted">Non vi siete ancora scritti.</p>
						)}
						<MoreLink href={`/messaggi/${link.id}`}>Apri la conversazione</MoreLink>
					</section>
				)}
				{link.notes && (
					<section aria-labelledby="i-tuoi-appunti">
						<SectionTitle id="i-tuoi-appunti" title="Appunti" />
						<p className="line-clamp-4 whitespace-pre-wrap text-sm text-fg">{link.notes}</p>
						<MoreLink href={`${base}/appunti`}>Apri gli appunti</MoreLink>
					</section>
				)}
			</aside>
		</div>
	);
}

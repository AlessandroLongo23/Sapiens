import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';
import { TUTORING_ROOT } from '@/lib/config/site';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { tutorArea } from '@/lib/server/tutor-area';
import { agendaClock, tutorBadges, tutorLessonsBetween, tutorProposals, tutorStats } from '@/lib/server/tutor-agenda';
import type { TutorStatus } from '@/lib/server/tutoring-admin';
import { longDay, romeParts } from '@/lib/tutoring/agenda';
import type { IconComponent } from '@/lib/utils/icons';
import { Badge } from '@/components/ui/Badge';
import { Card, type CardTone } from '@/components/ui/Card';
import { NoProfile } from '@/components/tutoring/NoProfile';
import { MonthSquares } from '@/components/tutoring/agenda/MonthSquares';
import { AreaHeader, DayLeaf, Empty, Figure, Figures, MoreLink, SectionTitle } from '@/components/tutoring/agenda/Paper';

export const metadata: Metadata = pageMetadata({ title: 'Area tutor | Sapiens', path: '/dashboard' });

const STATUS: Record<TutorStatus, { icon: IconComponent; title: string; text: string; tone: CardTone }> = {
	draft: { icon: Clock, title: 'Bozza', text: 'Completa il profilo per inviarlo in revisione.', tone: 'default' },
	pending: { icon: Clock, title: 'In revisione', text: 'Controlliamo il profilo e ti avvisiamo via email quando è pubblico. Nel frattempo puoi ancora modificarlo.', tone: 'warn' },
	published: { icon: CheckCircle2, title: 'Pubblicato', text: 'Il profilo è visibile nella lista dei tutor. Le richieste degli studenti arrivano qui e via email.', tone: 'ok' },
	suspended: { icon: ShieldAlert, title: 'Sospeso', text: 'Il profilo non è visibile. Scrivici dalla pagina contatti per chiarire.', tone: 'danger' }
};

const MONTH = new Intl.DateTimeFormat('it-IT', { month: 'short', timeZone: 'UTC' });
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** The tutor's first page: what waits for an answer, the lessons to come, and the hours held. */
export default async function TutorDashboardPage() {
	const { tutor } = await tutorArea();
	if (!tutor) return <NoProfile title="Non hai ancora un profilo tutor" text="Racconta cosa insegni, a chi e dove: bastano cinque minuti. Il profilo va in revisione e poi compare nella lista." />;
	const { today, now } = agendaClock();
	const [stats, badges, upcoming, proposals] = await Promise.all([
		tutorStats(tutor.id),
		tutorBadges(tutor.id),
		tutorLessonsBetween(tutor.id, new Date(now - 2 * 3_600_000).toISOString(), new Date(now + 14 * 86_400_000).toISOString()),
		tutorProposals(tutor.id)
	]);
	const next = upcoming.filter((l) => l.status === 'confirmed' && Date.parse(l.startsAt) + l.durationMin * 60_000 > now).slice(0, 5);
	const hours = (h: number) => `${h.toLocaleString('it-IT', { maximumFractionDigits: 1 })} h`;
	const status = STATUS[tutor.status];
	const todo = [
		badges.requests > 0 && { href: '/leads', title: plural(badges.requests, 'richiesta nuova', 'richieste nuove'), text: 'Rispondi entro 48 ore dalla richiesta.' },
		proposals.length > 0 && { href: '/calendario', title: plural(proposals.length, 'lezione da confermare', 'lezioni da confermare'), text: `${proposals[0].with} propone ${longDay(romeParts(proposals[0].startsAt).day)} alle ${romeParts(proposals[0].startsAt).time}.` },
		badges.unread > 0 && { href: '/messaggi', title: plural(badges.unread, 'messaggio da leggere', 'messaggi da leggere'), text: 'I tuoi studenti ti hanno scritto.' },
		stats.invited > 0 && { href: '/studenti', title: plural(stats.invited, 'invito non ancora accettato', 'inviti non ancora accettati'), text: 'Rimanda il link a chi non lo ha aperto.' }
	].filter((n): n is { href: string; title: string; text: string } => !!n);
	const profile = (
		<Card as="section" tone={status.tone} className="flex flex-wrap items-start gap-3 p-5" aria-labelledby="stato">
			<status.icon className="mt-0.5 size-5 shrink-0 text-fg" aria-hidden="true" />
			<div className="min-w-0 flex-1 space-y-1">
				<h2 id="stato" className="flex flex-wrap items-center gap-2 font-sans text-base font-semibold text-fg">
					Profilo: {status.title}
					{tutor.verified && <Badge tone="info" icon={BadgeCheck}>Identità verificata</Badge>}
				</h2>
				<p className="text-sm text-fg-muted">{status.text}</p>
			</div>
			<div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium">
				{tutor.status === 'published' && <MoreLink href={`${TUTORING_ROOT}/${tutor.slug}`}>Vedi il profilo pubblico</MoreLink>}
				<MoreLink href="/profile-editor">Modifica il profilo</MoreLink>
			</div>
		</Card>
	);

	return (
		<>
			<AreaHeader eyebrow={longDay(today)} title={`Ciao ${tutor.first_name}`} />
			{tutor.status !== 'published' && <div className="mb-10">{profile}</div>}
			<div className="mb-12">
				<Figures label="In breve">
					<Figure href="/studenti" value={stats.activeStudents} label={stats.activeStudents === 1 ? 'studente seguito' : 'studenti seguiti'} />
					<Figure href="/calendario" value={stats.lessonsThisWeek} label={stats.lessonsThisWeek === 1 ? 'lezione questa settimana' : 'lezioni questa settimana'} />
					<Figure href="/studenti" value={stats.openAssignments} label={stats.openAssignments === 1 ? 'compito aperto' : 'compiti aperti'} />
					<Figure value={hours(stats.hoursThisMonth)} label="ore nel mese" />
				</Figures>
			</div>
			<div className="grid items-start gap-x-12 [&>*]:min-w-0 gap-y-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
				<section aria-labelledby="prossime">
					<SectionTitle id="prossime" title="Prossime lezioni" action={<MoreLink href="/calendario">Calendario</MoreLink>} />
					{next.length === 0 ? (
						<Empty>Nessuna lezione nei prossimi giorni.</Empty>
					) : (
						<ul>
							{next.map((l, i) => {
								const { day, time } = romeParts(l.startsAt);
								// One leaf a day: the lessons after the first of a day line up under it.
								const sameDay = i > 0 && romeParts(next[i - 1].startsAt).day === day;
								return (
									<li key={l.id} className={sameDay ? '' : 'border-t border-edge first:border-t-0'}>
										<Link href={`/studenti/${l.linkId}/lezioni`} className={`group flex items-center gap-4 focus-ring ${sameDay ? 'pb-3.5' : 'py-3.5'}`}>
											{sameDay ? <span className="w-12 shrink-0" aria-hidden="true" /> : <DayLeaf iso={l.startsAt} />}
											<span className="min-w-0 flex-1">
												<span className="block truncate text-lg font-medium text-fg-strong group-hover:text-accent-fg">{l.with}</span>
												<span className="block truncate text-sm text-fg-muted first-letter:uppercase">{day === today ? 'oggi' : longDay(day)} · {l.mode === 'online' ? 'online' : 'in presenza'}{l.note ? ` · ${l.note}` : ''}</span>
											</span>
											<span className="font-display text-xl font-semibold text-fg-strong tabular-nums">{time}</span>
										</Link>
									</li>
								);
							})}
						</ul>
					)}
				</section>
				<section aria-labelledby="da-fare">
					<SectionTitle id="da-fare" title="Ti aspettano" count={todo.length} />
					{todo.length === 0 ? (
						<Empty>Niente in sospeso: sei in pari.</Empty>
					) : (
						<ul>
							{todo.map((n) => (
								<li key={n.href} className="border-t border-edge first:border-t-0">
									<Link href={n.href} className="group flex items-center gap-3 py-3.5 focus-ring">
										<span className="min-w-0 flex-1">
											<span className="block font-medium text-fg-strong group-hover:text-accent-fg">{n.title}</span>
											<span className="block text-sm text-fg-muted">{n.text}</span>
										</span>
										<ArrowRight className="size-4 shrink-0 text-fg-faint group-hover:text-accent-fg" aria-hidden="true" />
									</Link>
								</li>
							))}
						</ul>
					)}
				</section>
			</div>
			<section aria-labelledby="ore" className="mt-14">
				<SectionTitle id="ore" title="Le tue ore di lezione" action={stats.lessonsHeld > 0 && <p className="label-mono text-fg-subtle">{plural(stats.lessonsHeld, 'lezione fatta', 'lezioni fatte')}, {hours(stats.hoursTotal)} in tutto</p>} />
				{stats.lessonsHeld === 0 ? (
					<Empty>Qui si contano le ore delle lezioni fatte, mese per mese.</Empty>
				) : (
					<MonthSquares label="Ore di lezione per mese, ultimi sei mesi" months={stats.months.map((m) => ({ name: MONTH.format(new Date(`${m.month}-01T00:00:00Z`)).replace('.', ''), hours: m.hours }))} unit={hours} />
				)}
			</section>
			{tutor.status === 'published' && <div className="mt-14">{profile}</div>}
		</>
	);
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { tutorFolder } from '@/lib/server/tutor-folder';
import { formatDateTime } from '@/lib/tutoring/time';
import { Assignments } from '@/components/tutoring/agenda/Assignments';
import { Lessons, NewLesson } from '@/components/tutoring/agenda/Lessons';
import { Count, MoreLink, SectionTitle } from '@/components/tutoring/agenda/Paper';

export const metadata: Metadata = pageMetadata({ title: 'Il mio tutor | Sapiens', path: '/il-mio-tutor' });

/** The first page with a tutor: what to do, when the next lesson is, the last message, what they can see. */
export default async function MyTutorOverviewPage({ params }: { params: Promise<{ id: string }> }) {
	const sheet = await tutorFolder(params);
	const { link, today, now } = sheet;
	const base = `/il-mio-tutor/${link.id}`;
	const last = sheet.messages.at(-1);
	const Shared = link.progressShared ? Eye : EyeOff;
	return (
		<div className="grid items-start gap-x-12 [&>*]:min-w-0 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
			<div className="space-y-10">
				<section aria-labelledby="da-fare">
					<SectionTitle id="da-fare" title="Da fare" />
					<Assignments assignments={sheet.assignments} today={today} empty={`${link.tutor.firstName} non ti ha ancora assegnato esercizi.`} limit={4} />
					<MoreLink href={`${base}/compiti`}>Tutti i compiti</MoreLink>
				</section>
				<section aria-labelledby="prossime-lezioni">
					<SectionTitle id="prossime-lezioni" title="Prossime lezioni" action={<NewLesson side="student" linkId={link.id} today={today} />} />
					<Lessons lessons={sheet.lessons} side="student" now={now} limit={3} />
					<MoreLink href={`${base}/lezioni`}>Tutte le lezioni</MoreLink>
				</section>
			</div>
			<aside className="space-y-6">
				<section aria-labelledby="ultimo-messaggio">
					<SectionTitle id="ultimo-messaggio" title="Messaggi" action={<Count n={sheet.unread} label={sheet.unread === 1 ? 'nuovo' : 'nuovi'} />} />
					{last ? (
						<>
							<p className="line-clamp-3 text-sm text-fg">{last.body}</p>
							<p className="mt-1 text-xs text-fg-subtle">{last.sender === 'student' ? 'Tu' : link.tutor.firstName} · {formatDateTime(last.createdAt)}</p>
						</>
					) : (
						<p className="text-sm text-fg-muted">Non vi siete ancora scritti.</p>
					)}
					<MoreLink href={`${base}/messaggi`}>Apri la conversazione</MoreLink>
				</section>
				<Link href={`${base}/condivisione`} className="flex items-start gap-3 rounded-2xl border border-edge bg-surface p-5 shadow-paper transition-colors hover:border-edge-strong focus-ring">
					<Shared className="mt-0.5 size-5 shrink-0 text-fg-muted" aria-hidden="true" />
					<span>
						<span className="block font-medium text-fg-strong">{link.progressShared ? `${link.tutor.firstName} vede i tuoi progressi` : `${link.tutor.firstName} non vede i tuoi progressi`}</span>
						<span className="block text-sm text-fg-muted">Decidi tu, e puoi cambiare idea quando vuoi.</span>
					</span>
				</Link>
			</aside>
		</div>
	);
}

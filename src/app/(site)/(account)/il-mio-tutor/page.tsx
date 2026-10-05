import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Search } from 'lucide-react';
import { TUTORING_ROOT } from '@/lib/config/site';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { currentUser } from '@/lib/server/auth';
import { studentTutors } from '@/lib/server/tutor-agenda';
import { subjectName } from '@/lib/tutoring/config';
import { LinkButton } from '@/components/ui/Button';
import { CardLink } from '@/components/ui/Card';
import { AreaHeader, Empty, Initials } from '@/components/tutoring/agenda/Paper';

export const metadata: Metadata = pageMetadata({ title: 'Il mio tutor | Sapiens', path: '/il-mio-tutor' });

/** With one tutor, straight to their pages; with more, the choice; with none, how to get one. */
export default async function MyTutorPage() {
	const user = await currentUser();
	if (!user) redirect('/');
	const tutors = await studentTutors(user.id);
	if (tutors.length === 1) redirect(`/il-mio-tutor/${tutors[0].link.id}`);
	if (tutors.length === 0) {
		return (
			<>
				<AreaHeader eyebrow="Ripetizioni" title="Il mio tutor" />
				<Empty
					action={
						<>
							<p className="max-w-md text-sm text-fg-muted">Se fai già ripetizioni, chiedi al tuo tutor di mandarti l&apos;invito. Altrimenti cercane uno: quando accetta la tua richiesta lo trovi qui.</p>
							<div className="flex flex-wrap items-center gap-4">
								<LinkButton href={TUTORING_ROOT}>
									<Search className="size-4" aria-hidden="true" />
									Cerca un tutor
								</LinkButton>
								<Link href="/richieste" className="text-sm font-medium text-accent-fg hover:underline">Le tue richieste</Link>
							</div>
						</>
					}
				>
					<span role="heading" aria-level={2}>Nessun tutor ti segue su Sapiens</span>
				</Empty>
			</>
		);
	}
	return (
		<>
			<AreaHeader eyebrow="Ripetizioni" title="I miei tutor" lead="Scegli con chi: ognuno ha le sue lezioni, i suoi compiti e i suoi messaggi." />
			<ul className="grid gap-5 sm:grid-cols-2">
				{tutors.map(({ link, unread, assignments }) => {
					const todo = assignments.filter((a) => a.done === false).length;
					return (
						<li key={link.id} data-tutor={link.tutor.slug}>
							<CardLink href={`/il-mio-tutor/${link.id}`} className="gap-3 p-5">
								<div className="flex items-center gap-3">
									<Initials name={`${link.tutor.firstName} ${link.tutor.lastInitial}`} subject={link.subject} size="sm" />
									<div className="min-w-0">
										<p className="truncate font-display text-xl font-semibold text-fg-strong">{link.tutor.firstName} {link.tutor.lastInitial}.</p>
										<p className="label-mono text-fg-subtle">{link.subject ? subjectName(link.subject) : 'Ripetizioni'}</p>
									</div>
								</div>
								<div className="space-y-1.5 border-t border-edge pt-3">
									<p className="text-sm text-fg-muted">{todo === 0 ? 'Nessun compito da fare' : todo === 1 ? '1 compito da fare' : `${todo} compiti da fare`}</p>
									{unread > 0 && <p className="text-sm font-medium text-accent-fg">{unread === 1 ? '1 messaggio nuovo' : `${unread} messaggi nuovi`}</p>}
								</div>
							</CardLink>
						</li>
					);
				})}
			</ul>
		</>
	);
}

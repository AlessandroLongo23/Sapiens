import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, FolderOpen } from 'lucide-react';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { isUuid } from '@/lib/server/http';
import { tutorArea } from '@/lib/server/tutor-area';
import { agendaClock, getTutorLink, readMessages } from '@/lib/server/tutor-agenda';
import { TutoringError } from '@/lib/server/tutoring-admin';
import type { AgendaMessage, TutorLink } from '@/lib/tutoring/agenda';
import { LinkButton, buttonClass } from '@/components/ui/Button';
import { Chat } from '@/components/tutoring/agenda/Chat';

export const metadata: Metadata = pageMetadata({ title: 'Conversazione | Area tutor | Sapiens', path: '/messaggi' });

/** One conversation, filling the page. Opening it marks the student's messages read. */
export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
	const { tutor } = await tutorArea();
	if (!tutor) return null;
	const { id } = await params;
	if (!isUuid(id)) notFound();
	let link: TutorLink;
	let messages: AgendaMessage[];
	try {
		[link, messages] = await Promise.all([getTutorLink(tutor.id, id), readMessages({ tutorId: tutor.id }, id)]);
	} catch (err) {
		if (err instanceof TutoringError && err.status === 404) notFound();
		throw err;
	}
	if (!link.joined) notFound();
	const { today } = agendaClock();
	return (
		<div className="space-y-3">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex min-w-0 items-center gap-3">
					<Link href="/messaggi" aria-label="Tutte le conversazioni" className={buttonClass('ghost', 'icon', 'lg:hidden')}>
						<ArrowLeft className="size-5" aria-hidden="true" />
					</Link>
					<h2 className="truncate text-2xl font-semibold text-fg-strong">{link.name}</h2>
				</div>
				<LinkButton href={`/studenti/${link.id}`} variant="secondary" size="sm">
					<FolderOpen className="size-4" aria-hidden="true" />
					Apri la scheda
				</LinkButton>
			</div>
			<Chat linkId={link.id} side="tutor" initial={messages} other={link.name} today={today} disabled={link.status === 'ended' ? 'Hai interrotto le lezioni con questo studente: non potete più scrivervi.' : undefined} />
		</div>
	);
}

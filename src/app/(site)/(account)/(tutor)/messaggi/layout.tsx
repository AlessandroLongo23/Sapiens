import type { ReactNode } from 'react';
import { tutorArea } from '@/lib/server/tutor-area';
import { tutorInbox } from '@/lib/server/tutor-agenda';
import { NoProfile } from '@/components/tutoring/NoProfile';
import { ConversationList } from '@/components/tutoring/agenda/ConversationList';
import { AreaHeader } from '@/components/tutoring/agenda/Paper';

/** The tutor's messages: the conversations on the left, the open one filling the rest of the page. */
export default async function MessagesLayout({ children }: { children: ReactNode }) {
	const { tutor } = await tutorArea();
	if (!tutor) return <NoProfile title="Prima crea il tuo profilo" />;
	const conversations = await tutorInbox(tutor.id);
	return (
		<>
			<AreaHeader size="md" eyebrow="Con i tuoi studenti" title="Messaggi" />
			<div className="grid items-start gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[19rem_minmax(0,1fr)]">
				<ConversationList conversations={conversations} />
				<div className="min-w-0">{children}</div>
			</div>
		</>
	);
}

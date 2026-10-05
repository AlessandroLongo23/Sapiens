import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { currentUser } from '@/lib/server/auth';
import { readMessages } from '@/lib/server/tutor-agenda';
import { tutorFolder } from '@/lib/server/tutor-folder';
import { Chat } from '@/components/tutoring/agenda/Chat';

export const metadata: Metadata = pageMetadata({ title: 'Messaggi con il tutor | Sapiens', path: '/il-mio-tutor' });

/** The conversation with a tutor, filling the page. Opening it marks the tutor's messages read. */
export default async function MyTutorMessagesPage({ params }: { params: Promise<{ id: string }> }) {
	const { link, today } = await tutorFolder(params);
	const user = await currentUser();
	const messages = user ? await readMessages({ userId: user.id }, link.id) : [];
	return <Chat linkId={link.id} side="student" initial={messages} other={link.tutor.firstName} today={today} />;
}

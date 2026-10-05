import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { tutorArea } from '@/lib/server/tutor-area';
import { tutorInbox } from '@/lib/server/tutor-agenda';
import { OpenLatest } from '@/components/tutoring/agenda/OpenLatest';

export const metadata: Metadata = pageMetadata({ title: 'Messaggi | Area tutor | Sapiens', path: '/messaggi' });

/** No conversation chosen: a phone shows the list (in the layout); a computer opens the most recent one. */
export default async function MessagesPage() {
	const { tutor } = await tutorArea();
	const latest = tutor ? (await tutorInbox(tutor.id))[0] : undefined;
	return (
		<>
			{latest && <OpenLatest linkId={latest.linkId} />}
			<div className="hidden h-[calc(100dvh-16rem)] min-h-[22rem] items-center justify-center rounded-2xl border border-dashed border-edge-strong bg-surface lg:flex">
				<p className="max-w-xs text-center text-sm text-fg-muted">{latest ? 'Apro la conversazione più recente.' : 'Quando uno studente accetta il tuo invito, vi scrivete da qui.'}</p>
			</div>
		</>
	);
}

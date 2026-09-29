import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { ZAINO_ROOT } from '@/lib/config/site';
import { getSession } from '@/lib/server/auth';
import { listTrash } from '@/lib/server/zaino';
import { HOME_CRUMB, ZAINO_CRUMB } from '@/components/content/Breadcrumb';
import { Page, PageHeader } from '@/components/content/PageHeader';
import { Stat } from '@/components/ui/Badge';
import { TrashList } from '@/components/zaino/TrashList';

export const metadata: Metadata = pageMetadata({ title: 'Cestino | Sapiens', path: `${ZAINO_ROOT}/cestino` });

export const dynamic = 'force-dynamic';

/** The trash and the time it was read at, which the days left are counted from. */
async function load(supabase: Awaited<ReturnType<typeof getSession>>['supabase'], userId: string) {
	return { trash: await listTrash(supabase, userId), now: Date.now() };
}

/** The Zaino's trash: what was deleted in the last 30 days, to put back or delete for good. */
export default async function TrashPage() {
	const { supabase, user } = await getSession();
	if (!user) redirect(ZAINO_ROOT);
	const { trash, now } = await load(supabase, user.id);
	const books = trash.notebooks.length;
	const notes = trash.notes.length;

	return (
		<Page width="medium">
			<PageHeader
				crumbs={[HOME_CRUMB, ZAINO_CRUMB, { label: 'Cestino' }]}
				eyebrow="Eliminati"
				title="Cestino"
				lead="Quello che elimini resta qui per 30 giorni e puoi rimetterlo al suo posto. Poi viene cancellato per sempre."
				stats={
					books + notes > 0 && (
						<>
							{books > 0 && <Stat value={String(books).padStart(2, '0')}>{books === 1 ? 'quaderno' : 'quaderni'}</Stat>}
							{notes > 0 && <Stat value={String(notes).padStart(2, '0')}>{notes === 1 ? 'nota' : 'note'}</Stat>}
						</>
					)
				}
			/>
			<TrashList trash={trash} now={now} />
		</Page>
	);
}

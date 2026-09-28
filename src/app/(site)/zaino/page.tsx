import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { ZAINO_ROOT } from '@/lib/config/site';
import { getSession } from '@/lib/server/auth';
import { getQuota, listNotebooks, recentNotes, shelfStats, trashCount } from '@/lib/server/zaino';
import { HOME_CRUMB } from '@/components/content/Breadcrumb';
import { CoverStickers, CoverStickersButton } from '@/components/content/CoverStickers';
import { Page, PageHeader } from '@/components/content/PageHeader';
import { Stat } from '@/components/ui/Badge';
import { NotebookShelf } from '@/components/zaino/NotebookShelf';
import { RecentNotes } from '@/components/zaino/RecentNotes';
import { ZainoLanding } from '@/components/zaino/ZainoLanding';

export const metadata: Metadata = pageMetadata({ title: 'Zaino | Sapiens', path: ZAINO_ROOT });

/** The shelf. Signed-out visitors get the landing instead: the page sells itself. */
export const dynamic = 'force-dynamic';

export default async function ZainoPage() {
	const { supabase, user } = await getSession();
	const [notebooks, quota, recent, stats, inTrash] = user
		? await Promise.all([listNotebooks(supabase, user.id), getQuota(supabase, user), recentNotes(supabase, user.id), shelfStats(supabase, user.id), trashCount(supabase, user.id)])
		: [[], null, [], {}, 0];
	const all = Object.values(stats);
	const notes = all.reduce((n, s) => n + s.notes, 0);
	const fromLessons = all.reduce((n, s) => n + s.fromLessons, 0);

	return (
		<Page width="medium" cover={<CoverStickers page="zaino" />}>
			<PageHeader
				crumbs={[HOME_CRUMB, { label: 'Zaino' }]}
				eyebrow="Quaderni e note"
				title="Zaino"
				lead="I tuoi quaderni e le tue note, scritti da te e visibili solo a te."
				aside={<CoverStickersButton />}
				stats={
					notebooks.length > 0 && (
						<>
							<Stat value={String(notebooks.length).padStart(2, '0')}>{notebooks.length === 1 ? 'quaderno' : 'quaderni'}</Stat>
							<Stat value={String(notes).padStart(2, '0')}>{notes === 1 ? 'nota' : 'note'}</Stat>
							{fromLessons > 0 && <Stat value={String(fromLessons).padStart(2, '0')}>dalle lezioni</Stat>}
						</>
					)
				}
			/>
			{user && quota ? (
				<div className="space-y-12">
					<RecentNotes notes={recent} />
					<NotebookShelf notebooks={notebooks} stats={stats} quota={quota} trashCount={inTrash} />
				</div>
			) : (
				<ZainoLanding />
			)}
		</Page>
	);
}

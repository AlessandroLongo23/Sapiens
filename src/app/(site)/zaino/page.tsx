import type { Metadata } from 'next';
import { Backpack } from 'lucide-react';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { ZAINO_ROOT } from '@/lib/config/site';
import { getSession } from '@/lib/server/auth';
import { countNotes, getQuota, listNotebooks, recentNotes } from '@/lib/server/zaino';
import { HOME_CRUMB } from '@/components/content/Breadcrumb';
import { Page, PageHeader } from '@/components/content/PageHeader';
import { NotebookShelf } from '@/components/zaino/NotebookShelf';
import { RecentNotes } from '@/components/zaino/RecentNotes';
import { ZainoLanding } from '@/components/zaino/ZainoLanding';

export const metadata: Metadata = pageMetadata({ title: 'Zaino | Sapiens', path: ZAINO_ROOT });

/** The shelf. Signed-out visitors get the landing instead: the page sells itself. */
export const dynamic = 'force-dynamic';

export default async function ZainoPage() {
	const { supabase, user } = await getSession();
	const [notebooks, quota, recent] = user
		? await Promise.all([listNotebooks(supabase, user.id), getQuota(supabase, user), recentNotes(supabase, user.id)])
		: [[], null, []];
	// One count per quaderno: the shelf shows them and the delete dialog names them.
	const counts = Object.fromEntries(
		await Promise.all(notebooks.map(async (n) => [n.id, user ? await countNotes(supabase, user.id, n.id) : 0] as const))
	);

	return (
		<Page width="medium">
			<PageHeader
				crumbs={[HOME_CRUMB, { label: 'Zaino' }]}
				icon={Backpack}
				eyebrow="Quaderni e note"
				title="Zaino"
				lead="I tuoi quaderni e le tue note, scritti da te e visibili solo a te."
			/>
			{user && quota ? (
				<div className="space-y-8">
					<RecentNotes notes={recent} />
					<NotebookShelf notebooks={notebooks} counts={counts} quota={quota} />
				</div>
			) : (
				<ZainoLanding />
			)}
		</Page>
	);
}

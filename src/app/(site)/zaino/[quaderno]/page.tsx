import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { ZAINO_ROOT } from '@/lib/config/site';
import { getSession } from '@/lib/server/auth';
import { isUuid } from '@/lib/server/http';
import { firstPages, getNotebook, getQuota, listNotebooks, listNotes, trashCount } from '@/lib/server/zaino';
import { HOME_CRUMB, ZAINO_CRUMB } from '@/components/content/Breadcrumb';
import { Page, PageHeader } from '@/components/content/PageHeader';
import { Stat } from '@/components/ui/Badge';
import { NoteList } from '@/components/zaino/NoteList';
import { NotebookCover } from '@/components/zaino/NotebookCover';

export const metadata: Metadata = pageMetadata({ title: 'Quaderno | Sapiens', path: ZAINO_ROOT });

export const dynamic = 'force-dynamic';

const day = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short' });

/**
 * A quaderno: the header every index page has, with the quaderno itself where the icon goes, and its notes under
 * it. The page wears the quaderno's colour, so the cards and the pen strokes pick it up.
 */
export default async function NotebookPage({ params }: { params: Promise<{ quaderno: string }> }) {
	const { quaderno } = await params;
	// A malformed id is a 404, not the invalid-uuid error Postgres would raise.
	if (!isUuid(quaderno)) notFound();
	const { supabase, user } = await getSession();
	if (!user) redirect(ZAINO_ROOT);
	const notebook = await getNotebook(supabase, user.id, quaderno);
	if (!notebook) notFound();
	const [notes, notebooks, quota, pages, inTrash] = await Promise.all([
		listNotes(supabase, user.id, notebook.id),
		listNotebooks(supabase, user.id),
		getQuota(supabase, user),
		firstPages(supabase, user.id, notebook.id),
		trashCount(supabase, user.id)
	]);
	const latest = notes.reduce<string | null>((a, n) => (!a || n.updated_at > a ? n.updated_at : a), null);
	const fromLessons = notes.filter((n) => n.lesson_path).length;

	return (
		<div data-notebook={notebook.color}>
			<Page width="medium">
				<PageHeader
					crumbs={[HOME_CRUMB, ZAINO_CRUMB, { label: notebook.title }]}
					eyebrow="Quaderno"
					title={notebook.title}
					stats={
						notes.length > 0 && (
							<>
								<Stat value={String(notes.length).padStart(2, '0')}>{notes.length === 1 ? 'nota' : 'note'}</Stat>
								{fromLessons > 0 && <Stat value={String(fromLessons).padStart(2, '0')}>dalle lezioni</Stat>}
								{latest && <Stat value={day.format(new Date(latest))}>ultima modifica</Stat>}
							</>
						)
					}
					figure={
						<span
							className="zn-notebook pointer-events-none mr-2 mt-2 hidden w-48 shrink-0 sm:block lg:w-52"
							style={{ '--tilt': '3deg' } as CSSProperties}
							aria-hidden="true"
						>
							<NotebookCover title={notebook.title} index={Math.max(0, notebooks.findIndex((n) => n.id === notebook.id))} notes={notes.length} updated={latest} />
						</span>
					}
				/>
				<NoteList notebookId={notebook.id} notes={notes} pages={pages} notebooks={notebooks} quota={quota} trashCount={inTrash} />
			</Page>
		</div>
	);
}

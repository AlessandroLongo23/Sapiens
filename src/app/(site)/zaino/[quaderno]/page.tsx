import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { ZAINO_ROOT } from '@/lib/config/site';
import { getSession } from '@/lib/server/auth';
import { isUuid } from '@/lib/server/http';
import { getNotebook, getQuota, listNotebooks, listNotes } from '@/lib/server/zaino';
import { Breadcrumb, HOME_CRUMB, ZAINO_CRUMB } from '@/components/content/Breadcrumb';
import { Page } from '@/components/content/PageHeader';
import { NotebookTitle } from '@/components/zaino/NotebookTitle';
import { NoteList } from '@/components/zaino/NoteList';

export const metadata: Metadata = pageMetadata({ title: 'Quaderno | Sapiens', path: ZAINO_ROOT });

export const dynamic = 'force-dynamic';

export default async function NotebookPage({ params }: { params: Promise<{ quaderno: string }> }) {
	const { quaderno } = await params;
	// A malformed id is a 404, not the invalid-uuid error Postgres would raise.
	if (!isUuid(quaderno)) notFound();
	const { supabase, user } = await getSession();
	if (!user) redirect(ZAINO_ROOT);
	const notebook = await getNotebook(supabase, user.id, quaderno);
	if (!notebook) notFound();
	const [notes, notebooks, quota] = await Promise.all([
		listNotes(supabase, user.id, notebook.id),
		listNotebooks(supabase, user.id),
		getQuota(supabase, user)
	]);

	return (
		<Page width="narrow">
			<Breadcrumb items={[HOME_CRUMB, ZAINO_CRUMB, { label: notebook.title }]} />
			<NotebookTitle title={notebook.title} color={notebook.color} />
			<NoteList notebookId={notebook.id} notes={notes} notebooks={notebooks} quota={quota} />
		</Page>
	);
}

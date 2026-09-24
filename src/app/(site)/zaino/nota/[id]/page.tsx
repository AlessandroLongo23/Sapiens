import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { ZAINO_ROOT } from '@/lib/config/site';
import { getSession } from '@/lib/server/auth';
import { isUuid } from '@/lib/server/http';
import { getNote, getNoteStickers, getNotebook, listNotebooks } from '@/lib/server/zaino';
import { NoteEditor } from '@/components/zaino/NoteEditor';

export const metadata: Metadata = pageMetadata({ title: 'Nota | Sapiens', path: ZAINO_ROOT });

export const dynamic = 'force-dynamic';

/** The editor. Full screen on phones: the note brings its own chrome (see Shell). */
export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	if (!isUuid(id)) notFound();
	const { supabase, user } = await getSession();
	if (!user) redirect(ZAINO_ROOT);
	const note = await getNote(supabase, user.id, id);
	if (!note) notFound();
	const [notebook, notebooks, stickers] = await Promise.all([
		getNotebook(supabase, user.id, note.notebook_id),
		listNotebooks(supabase, user.id),
		getNoteStickers(supabase, user.id, note.id)
	]);
	return <NoteEditor note={note} notebookTitle={notebook?.title ?? 'Quaderno'} notebooks={notebooks} stickers={stickers} />;
}

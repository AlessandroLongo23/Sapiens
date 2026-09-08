'use client';

import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Features } from '@/lib/stripe/config';
import { ZAINO_ROOT } from '@/lib/config/site';
import type { NoteSummary, Quota } from '@/lib/zaino/config';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Paywall } from '@/components/subscription/Paywall';
import { useZainoAction } from './ZainoActions';
import { QuotaBar } from './QuotaBar';

const when = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

/** One quaderno's note, with create and delete. Opening a note is a plain link. */
export function NoteList({ notebookId, notes, quota }: { notebookId: string; notes: NoteSummary[]; quota: Quota }) {
	const { busy, error, blocked, run } = useZainoAction();
	const [confirming, setConfirming] = useState<string | null>(null);

	if (blocked) {
		return (
			<Paywall
				feature={Features.NOTEBOOKS}
				returnTo={`${ZAINO_ROOT}/${notebookId}`}
				backUrl={ZAINO_ROOT}
				benefit={blocked}
			/>
		);
	}

	const create = () => run('new', `/api/zaino/quaderni/${notebookId}/note`, 'POST');

	return (
		<div className="space-y-5">
			{error && <Alert tone="error">{error}</Alert>}
			{notes.length > 0 && (
				<div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-b border-edge-soft pb-4">
					<div className="min-w-0">
						<h2 className="text-lg font-semibold text-fg-strong">{notes.length === 1 ? '1 nota' : `${notes.length} note`}</h2>
						<QuotaBar quota={quota} />
					</div>
					<Button onClick={create} loading={busy === 'new'}>
						<Plus className="size-4" aria-hidden="true" />
						Nuova nota
					</Button>
				</div>
			)}

			{notes.length === 0 ? (
				<Card tone="dashed" className="note-in flex flex-col items-center gap-3 px-6 py-16 text-center">
					<span className="mb-1 flex size-16 items-center justify-center rounded-2xl bg-accent-soft text-accent-fg">
						<FileText className="size-8" aria-hidden="true" />
					</span>
					<p className="text-lg font-semibold text-fg-strong">Nessuna nota, per ora</p>
					<p className="max-w-sm text-sm leading-relaxed text-fg-muted">
						Scrivi la prima: puoi formattarla con la barra degli strumenti o scriverla in markdown, come preferisci.
					</p>
					<Button onClick={create} loading={busy === 'new'} className="mt-2">
						<Plus className="size-4" aria-hidden="true" />
						Scrivi la prima nota
					</Button>
					<QuotaBar quota={quota} />
				</Card>
			) : (
				<ul className="space-y-2.5">
					{notes.map((note, i) => (
						<li key={note.id} className="note-in group/note relative" style={{ '--i': i } as CSSProperties}>
							<Link
								href={`${ZAINO_ROOT}/nota/${note.id}`}
								className={cn(
									'flex min-w-0 flex-col gap-1 rounded-2xl border border-edge bg-surface py-3.5 pl-4 pr-14 no-underline shadow-sm transition duration-200 ease-out',
									'hover:-translate-y-0.5 hover:border-accent-edge hover:shadow-md active:translate-y-0 active:scale-[0.995] focus-ring-offset'
								)}
							>
								<span className="truncate font-semibold text-fg-strong">{note.title}</span>
								<span className="truncate text-sm text-fg-muted">{note.excerpt || 'Nota vuota'}</span>
								<span className="text-xs text-fg-faint">Modificata il {when.format(new Date(note.updated_at))}</span>
							</Link>
							{confirming === note.id ? (
								// Inline, as the tutoring actions do: no dialog for one row.
								<span className="absolute inset-y-0 right-0 flex items-center gap-1 rounded-r-2xl bg-surface pl-3 pr-2">
									<Button
										variant="inverse"
										size="sm"
										loading={busy === note.id}
										onClick={async () => {
											const ok = await run(note.id, `/api/zaino/note/${note.id}`, 'DELETE');
											if (ok) setConfirming(null);
										}}
									>
										Elimina
									</Button>
									<Button variant="ghost" size="sm" onClick={() => setConfirming(null)}>
										Annulla
									</Button>
								</span>
							) : (
								<button
									type="button"
									onClick={() => setConfirming(note.id)}
									aria-label={`Elimina ${note.title}`}
									className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-fg-subtle opacity-100 transition duration-150 hover:bg-danger-soft hover:text-danger-fg active:scale-95 focus-ring md:opacity-0 md:group-hover/note:opacity-100 md:focus-visible:opacity-100"
								>
									<Trash2 className="size-4" aria-hidden="true" />
								</button>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

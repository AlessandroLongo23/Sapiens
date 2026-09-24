'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { FileText, GripVertical, MoreHorizontal, Plus, Search, Trash2 } from 'lucide-react';
import { Features } from '@/lib/stripe/config';
import { ZAINO_ROOT } from '@/lib/config/site';
import type { NotebookRow, NoteSummary, Quota } from '@/lib/zaino/config';
import { useReorder } from '@/lib/hooks/use-reorder';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Field';
import { Sheet } from '@/components/ui/Sheet';
import { Paywall } from '@/components/subscription/Paywall';
import { cn } from '@/lib/utils/cn';
import { useZainoAction } from './ZainoActions';
import { QuotaBar } from './QuotaBar';
import { MoveNoteSheet } from './MoveNoteSheet';

const when = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

/** One quaderno's note: filter, open, reorder, move and delete. */
export function NoteList({
	notebookId,
	notes,
	notebooks,
	quota
}: {
	notebookId: string;
	notes: NoteSummary[];
	notebooks: NotebookRow[];
	quota: Quota;
}) {
	const { busy, error, blocked, run } = useZainoAction();
	const [menu, setMenu] = useState<NoteSummary | null>(null);
	const [moving, setMoving] = useState<NoteSummary | null>(null);
	const [confirming, setConfirming] = useState<NoteSummary | null>(null);
	const [filter, setFilter] = useState('');

	const byId = useMemo(() => new Map(notes.map((note) => [note.id, note])), [notes]);
	const ids = useMemo(() => notes.map((note) => note.id), [notes]);
	const { order, dragging, rowProps, handleProps } = useReorder(ids, (next) =>
		run('reorder', `/api/zaino/quaderni/${notebookId}/note/reorder`, 'POST', { ids: next })
	);

	// Filtering is local: a quaderno's list is already on the page, and the
	// site-wide search covers everything else.
	const needle = filter.trim().toLowerCase();
	const shown = order
		.map((id) => byId.get(id))
		.filter((note): note is NoteSummary => !!note)
		.filter((note) => !needle || `${note.title} ${note.excerpt}`.toLowerCase().includes(needle));

	if (blocked) {
		return <Paywall feature={Features.NOTEBOOKS} returnTo={`${ZAINO_ROOT}/${notebookId}`} backUrl={ZAINO_ROOT} benefit={blocked} />;
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

			{notes.length > 3 && (
				<div className="relative">
					<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-faint" aria-hidden="true" />
					<Input
						type="search"
						value={filter}
						onChange={(e) => setFilter(e.target.value)}
						placeholder="Filtra le note di questo quaderno"
						aria-label="Filtra le note di questo quaderno"
						className="pl-9"
					/>
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
			) : shown.length === 0 ? (
				<Card tone="dashed" className="px-6 py-10 text-center text-sm text-fg-muted">
					Nessuna nota per «{filter.trim()}».
				</Card>
			) : (
				<ul className="space-y-2.5">
					{shown.map((note, i) => (
						<li
							key={note.id}
							{...rowProps(note.id)}
							className={cn('note-in group/note relative', dragging === note.id && 'z-10')}
							style={{ '--i': i } as CSSProperties}
						>
							<div
								className={cn(
									'flex items-stretch overflow-hidden rounded-2xl border border-edge bg-surface shadow-sm transition-shadow duration-200',
									dragging === note.id && 'border-accent-edge shadow-lg'
								)}
							>
								{/* Reordering is off while a filter hides rows: dropping between two
								    visible notes would move it past the ones it cannot see. */}
								<button
									type="button"
									data-reorder-handle
									{...handleProps(note.id)}
									disabled={!!needle}
									aria-label={`Riordina ${note.title}. Usa le frecce su e giù.`}
									className="flex w-8 shrink-0 cursor-grab touch-none items-center justify-center text-fg-faint transition-colors hover:bg-surface-3 hover:text-fg-muted active:cursor-grabbing disabled:cursor-default disabled:opacity-30 focus-ring"
								>
									<GripVertical className="size-4" aria-hidden="true" />
								</button>
								<Link
									href={`${ZAINO_ROOT}/nota/${note.id}`}
									className="flex min-w-0 flex-1 flex-col gap-1 py-3.5 pl-1 pr-12 no-underline transition-colors hover:bg-surface-2 focus-ring"
								>
									<span className="truncate font-semibold text-fg-strong">{note.title}</span>
									<span className="truncate text-sm text-fg-muted">{note.excerpt || 'Nota vuota'}</span>
									<span className="truncate text-xs text-fg-faint">
										Modificata il {when.format(new Date(note.updated_at))}
										{note.lesson_title ? ` · da ${note.lesson_title}` : ''}
									</span>
								</Link>
							</div>
							<button
								type="button"
								onClick={() => setMenu(note)}
								aria-label={`Opzioni di ${note.title}`}
								className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-fg-subtle opacity-100 transition duration-150 hover:bg-surface-3 hover:text-fg active:scale-95 focus-ring md:opacity-0 md:group-hover/note:opacity-100 md:focus-visible:opacity-100"
							>
								<MoreHorizontal className="size-5" aria-hidden="true" />
							</button>
						</li>
					))}
				</ul>
			)}

			<Sheet open={!!menu} onClose={() => setMenu(null)} title={menu?.title ?? 'Nota'} size="auto">
				<div className="flex flex-col px-2 pb-3">
					<button
						type="button"
						onClick={() => {
							setMoving(menu);
							setMenu(null);
						}}
						className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-left font-medium text-fg transition-colors hover:bg-surface-3 focus-ring"
					>
						<MoreHorizontal className="size-4 text-fg-subtle" aria-hidden="true" />
						Sposta in un altro quaderno
					</button>
					<button
						type="button"
						onClick={() => {
							setConfirming(menu);
							setMenu(null);
						}}
						className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-left font-medium text-danger-fg transition-colors hover:bg-danger-soft focus-ring"
					>
						<Trash2 className="size-4" aria-hidden="true" />
						Elimina la nota
					</button>
				</div>
			</Sheet>

			<MoveNoteSheet
				open={!!moving}
				notebooks={notebooks}
				currentId={notebookId}
				busy={busy === moving?.id}
				onClose={() => setMoving(null)}
				onMove={async (destination) => {
					if (!moving) return;
					const done = await run(moving.id, `/api/zaino/note/${moving.id}`, 'PATCH', {
						notebookId: destination,
						version: moving.version
					});
					if (done) setMoving(null);
				}}
			/>

			<Sheet open={!!confirming} onClose={() => setConfirming(null)} title="Elimina la nota" size="auto">
				<div className="space-y-4 px-4 pb-4">
					<p className="text-sm text-fg-muted">Vuoi eliminare «{confirming?.title}»? Non si può recuperare.</p>
					<div className="flex gap-2">
						<Button
							variant="inverse"
							loading={busy === confirming?.id}
							onClick={async () => {
								if (!confirming) return;
								const done = await run(confirming.id, `/api/zaino/note/${confirming.id}`, 'DELETE');
								if (done) setConfirming(null);
							}}
						>
							<Trash2 className="size-4" aria-hidden="true" />
							Elimina
						</Button>
						<Button variant="ghost" onClick={() => setConfirming(null)}>
							Annulla
						</Button>
					</div>
				</div>
			</Sheet>
		</div>
	);
}

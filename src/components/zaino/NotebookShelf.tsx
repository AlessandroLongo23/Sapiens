'use client';

import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { Backpack, MoreHorizontal, NotebookPen, Plus, Trash2 } from 'lucide-react';
import { Features } from '@/lib/stripe/config';
import { COLOR_LABEL, DEFAULT_NOTEBOOK_TITLE, NOTEBOOK_COLORS, type NotebookColor, type NotebookRow, type Quota } from '@/lib/zaino/config';
import { ZAINO_ROOT } from '@/lib/config/site';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, Label } from '@/components/ui/Field';
import { Sheet } from '@/components/ui/Sheet';
import { Paywall } from '@/components/subscription/Paywall';
import { cn } from '@/lib/utils/cn';
import { useZainoAction } from './ZainoActions';
import { QuotaBar } from './QuotaBar';

/** The spine of a quaderno: a solid edge plus a wash that bleeds into the cover. */
const SPINE: Record<NotebookColor, string> = {
	zinc: 'bg-zinc-400 dark:bg-zinc-500',
	crimson: 'bg-crimson-500',
	amber: 'bg-amber-500',
	teal: 'bg-teal-500',
	sky: 'bg-sky-500',
	indigo: 'bg-indigo-500'
};

/** The faint tint the cover carries, so two quaderni are told apart at a glance. */
const WASH: Record<NotebookColor, string> = {
	zinc: 'from-zinc-500/[0.07]',
	crimson: 'from-crimson-500/[0.07]',
	amber: 'from-amber-500/[0.07]',
	teal: 'from-teal-500/[0.07]',
	sky: 'from-sky-500/[0.07]',
	indigo: 'from-indigo-500/[0.07]'
};

/** The shelf: every quaderno, with create, rename and delete. */
export function NotebookShelf({ notebooks, counts, quota }: { notebooks: NotebookRow[]; counts: Record<string, number>; quota: Quota }) {
	const { busy, error, blocked, clearBlocked, run } = useZainoAction();
	const [editing, setEditing] = useState<NotebookRow | null>(null);
	const [confirming, setConfirming] = useState<NotebookRow | null>(null);

	if (blocked) {
		return (
			<Paywall
				feature={Features.NOTEBOOKS}
				returnTo={ZAINO_ROOT}
				benefit={blocked}
				preview={<Shelf notebooks={notebooks} counts={counts} onEdit={() => {}} />}
			/>
		);
	}

	const create = () => run('new', '/api/zaino/quaderni', 'POST', { title: DEFAULT_NOTEBOOK_TITLE, color: 'zinc' });

	return (
		<div className="space-y-5">
			{error && <Alert tone="error">{error}</Alert>}
			{notebooks.length > 0 && (
				<div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-b border-edge-soft pb-4">
					<div className="min-w-0">
						<h2 className="text-lg font-semibold text-fg-strong">
							{notebooks.length === 1 ? '1 quaderno' : `${notebooks.length} quaderni`}
						</h2>
						<QuotaBar quota={quota} />
					</div>
					<Button onClick={create} loading={busy === 'new'}>
						<Plus className="size-4" aria-hidden="true" />
						Nuovo quaderno
					</Button>
				</div>
			)}

			{notebooks.length === 0 ? (
				<Card tone="dashed" className="note-in flex flex-col items-center gap-3 px-6 py-16 text-center">
					<span className="mb-1 flex size-16 items-center justify-center rounded-2xl bg-accent-soft text-accent-fg">
						<Backpack className="size-8" aria-hidden="true" />
					</span>
					<p className="text-lg font-semibold text-fg-strong">Lo zaino è vuoto</p>
					<p className="max-w-sm text-sm leading-relaxed text-fg-muted">
						Crea il primo quaderno: dentro ci metti le note di una materia, di un capitolo o di quello che vuoi.
					</p>
					<Button onClick={create} loading={busy === 'new'} className="mt-2">
						<Plus className="size-4" aria-hidden="true" />
						Crea il primo quaderno
					</Button>
					<QuotaBar quota={quota} />
				</Card>
			) : (
				<Shelf notebooks={notebooks} counts={counts} onEdit={setEditing} />
			)}

			<EditSheet
				notebook={editing}
				busy={busy}
				onClose={() => setEditing(null)}
				onSave={async (input) => {
					if (!editing) return;
					const ok = await run(editing.id, `/api/zaino/quaderni/${editing.id}`, 'PATCH', input);
					if (ok) setEditing(null);
				}}
				onDelete={() => {
					setConfirming(editing);
					setEditing(null);
				}}
			/>

			<Sheet open={!!confirming} onClose={() => setConfirming(null)} title="Elimina il quaderno" size="auto">
				<div className="space-y-4 px-4 pb-4">
					<p className="text-sm text-fg-muted">
						{confirming && counts[confirming.id] > 0
							? `«${confirming.title}» contiene ${counts[confirming.id]} ${counts[confirming.id] === 1 ? 'nota' : 'note'}. Eliminando il quaderno elimini anche quelle, e non si possono recuperare.`
							: `Vuoi eliminare «${confirming?.title}»?`}
					</p>
					<div className="flex gap-2">
						<Button
							variant="inverse"
							loading={busy === confirming?.id}
							onClick={async () => {
								if (!confirming) return;
								const ok = await run(confirming.id, `/api/zaino/quaderni/${confirming.id}?confirm=1`, 'DELETE');
								if (ok) setConfirming(null);
							}}
						>
							<Trash2 className="size-4" aria-hidden="true" />
							Elimina
						</Button>
						<Button variant="ghost" onClick={() => setConfirming(null)}>Annulla</Button>
					</div>
				</div>
			</Sheet>

			{blocked && <button type="button" onClick={clearBlocked} className="sr-only">Chiudi</button>}
		</div>
	);
}

function Shelf({ notebooks, counts, onEdit }: { notebooks: NotebookRow[]; counts: Record<string, number>; onEdit: (n: NotebookRow) => void }) {
	return (
		<ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
			{notebooks.map((notebook, i) => {
				const count = counts[notebook.id] ?? 0;
				return (
					<li key={notebook.id} className="note-in group/card relative" style={{ '--i': i } as CSSProperties}>
						<Link
							href={`${ZAINO_ROOT}/${notebook.id}`}
							className="flex h-full items-stretch overflow-hidden rounded-2xl border border-edge bg-surface no-underline shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:border-accent-edge hover:shadow-lg active:translate-y-0 active:scale-[0.99] focus-ring-offset"
						>
							{/* The spine, and a wash of the same colour across the cover. */}
							<span className={cn('w-2.5 shrink-0', SPINE[notebook.color])} aria-hidden="true" />
							<span className={cn('flex min-w-0 flex-1 flex-col gap-2 bg-gradient-to-r to-transparent py-6 pl-5 pr-14', WASH[notebook.color])}>
								<span className="truncate text-lg font-semibold leading-tight text-fg-strong">{notebook.title}</span>
								<span className="inline-flex items-center gap-1.5 text-sm text-fg-subtle">
									<NotebookPen className="size-4 shrink-0" aria-hidden="true" />
									{count === 0 ? 'Nessuna nota' : count === 1 ? '1 nota' : `${count} note`}
								</span>
							</span>
						</Link>
						{/* Always reachable on touch; on a mouse it fades in with the card. */}
						<button
							type="button"
							onClick={() => onEdit(notebook)}
							aria-label={`Opzioni di ${notebook.title}`}
							className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-fg-subtle opacity-100 transition duration-150 hover:bg-surface-3 hover:text-fg active:scale-95 focus-ring md:opacity-0 md:group-hover/card:opacity-100 md:focus-visible:opacity-100"
						>
							<MoreHorizontal className="size-5" aria-hidden="true" />
						</button>
					</li>
				);
			})}
		</ul>
	);
}

function EditSheet({ notebook, busy, onClose, onSave, onDelete }: { notebook: NotebookRow | null; busy: string | null; onClose: () => void; onSave: (input: { title: string; color: NotebookColor }) => void; onDelete: () => void }) {
	const [title, setTitle] = useState('');
	const [color, setColor] = useState<NotebookColor>('zinc');
	const [shown, setShown] = useState<string | null>(null);

	// The sheet is filled from the row the first time it opens for it.
	if (notebook && shown !== notebook.id) {
		setShown(notebook.id);
		setTitle(notebook.title);
		setColor(notebook.color);
	}

	return (
		<Sheet open={!!notebook} onClose={onClose} title="Modifica il quaderno" size="auto">
			<form
				className="space-y-5 px-4 pb-4"
				onSubmit={(e) => {
					e.preventDefault();
					onSave({ title: title.trim(), color });
				}}
			>
				<div>
					<Label htmlFor="notebook-title">Nome</Label>
					<Input id="notebook-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} required />
				</div>
				<fieldset>
					<legend className="mb-2 text-sm font-medium text-fg-muted">Colore</legend>
					<div className="flex flex-wrap gap-2">
						{NOTEBOOK_COLORS.map((c) => (
							<button
								key={c}
								type="button"
								aria-pressed={color === c}
								aria-label={COLOR_LABEL[c]}
								onClick={() => setColor(c)}
								className={cn('size-11 rounded-full border-2 transition-transform focus-ring', SPINE[c], color === c ? 'scale-110 border-fg' : 'border-transparent')}
							/>
						))}
					</div>
				</fieldset>
				<div className="flex flex-wrap gap-2">
					<Button type="submit" loading={busy === notebook?.id}>Salva</Button>
					<Button type="button" variant="ghost" onClick={onClose}>Annulla</Button>
					<Button type="button" variant="ghost" onClick={onDelete} className="ml-auto text-danger-fg">
						<Trash2 className="size-4" aria-hidden="true" />
						Elimina
					</Button>
				</div>
			</form>
		</Sheet>
	);
}

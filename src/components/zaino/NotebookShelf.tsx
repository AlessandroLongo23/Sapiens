'use client';

import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUp, Backpack, MoreHorizontal, NotebookPen, Plus, Trash2 } from 'lucide-react';
import { Features } from '@/lib/stripe/config';
import { COLOR_LABEL, DEFAULT_NOTEBOOK_TITLE, NOTEBOOK_COLORS, type NotebookColor, type NotebookRow, type Quota } from '@/lib/zaino/config';
import { ZAINO_ROOT } from '@/lib/config/site';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Sticker } from '@/components/ui/Sticker';
import { Card } from '@/components/ui/Card';
import { Input, Label } from '@/components/ui/Field';
import { Sheet } from '@/components/ui/Sheet';
import { Paywall } from '@/components/subscription/Paywall';
import { cn } from '@/lib/utils/cn';
import { useZainoAction } from './ZainoActions';
import { QuotaBar } from './QuotaBar';

/** The shelf: every quaderno, with create, rename and delete. */
export function NotebookShelf({ notebooks, counts, quota }: { notebooks: NotebookRow[]; counts: Record<string, number>; quota: Quota }) {
	const { busy, error, blocked, clearBlocked, run } = useZainoAction();
	const [editing, setEditing] = useState<NotebookRow | null>(null);
	const [confirming, setConfirming] = useState<NotebookRow | null>(null);

	/**
	 * The shelf reflows between one, two and three columns, so "up" and "down"
	 * are the only directions that mean the same thing at every width. A drag
	 * belongs to the note list, which is always a single column.
	 */
	const shift = (notebook: NotebookRow, step: -1 | 1) => {
		const ids = notebooks.map((n) => n.id);
		const from = ids.indexOf(notebook.id);
		const to = from + step;
		if (from < 0 || to < 0 || to >= ids.length) return;
		ids.splice(to, 0, ids.splice(from, 1)[0]);
		return run(notebook.id, '/api/zaino/quaderni/reorder', 'POST', { ids });
	};

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
				<div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-b border-edge-strong pb-3">
					<div className="min-w-0">
						<h2 className="flex items-baseline gap-3 text-3xl font-semibold text-fg-strong">
							Quaderni
							<span className="label-mono text-fg-subtle">{String(notebooks.length).padStart(2, '0')}</span>
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
					<Sticker icon={Backpack} tone="accent" className="mb-2" />
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
				position={editing ? notebooks.findIndex((n) => n.id === editing.id) : -1}
				total={notebooks.length}
				onShift={(step) => editing && shift(editing, step)}
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
						{/* The cover of the quaderno, like the subject covers in the library but smaller. */}
						<Link
							href={`${ZAINO_ROOT}/${notebook.id}`}
							data-notebook={notebook.color}
							className="relative isolate flex h-full min-h-28 flex-col justify-end gap-1.5 overflow-hidden rounded-2xl bg-tint-cover py-5 pl-7 pr-14 text-tint-cover-fg no-underline shadow-paper transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0 active:scale-[0.99] focus-ring-offset"
						>
							<span className="grid-paper absolute inset-0 -z-10 opacity-60 [--grid:color-mix(in_oklab,white_14%,transparent)]" aria-hidden="true" />
							<span className="absolute inset-y-0 left-0 -z-10 w-3 bg-black/15" aria-hidden="true" />
							<span className="truncate font-display text-2xl font-semibold leading-tight tracking-tight">{notebook.title}</span>
							<span className="label-mono inline-flex items-center gap-1.5 text-white/75">
								<NotebookPen className="size-3.5 shrink-0" aria-hidden="true" />
								{count === 0 ? 'Nessuna nota' : count === 1 ? '1 nota' : `${count} note`}
							</span>
						</Link>
						{/* Always reachable on touch; on a mouse it fades in with the card. */}
						<button
							type="button"
							onClick={() => onEdit(notebook)}
							aria-label={`Opzioni di ${notebook.title}`}
							className="absolute right-2 top-2 flex size-11 items-center justify-center rounded-full text-white/80 opacity-100 transition duration-150 hover:bg-white/15 hover:text-white active:scale-95 focus-ring md:opacity-0 md:group-hover/card:opacity-100 md:focus-visible:opacity-100"
						>
							<MoreHorizontal className="size-5" aria-hidden="true" />
						</button>
					</li>
				);
			})}
		</ul>
	);
}

function EditSheet({
	notebook,
	busy,
	position,
	total,
	onShift,
	onClose,
	onSave,
	onDelete
}: {
	notebook: NotebookRow | null;
	busy: string | null;
	position: number;
	total: number;
	onShift: (step: -1 | 1) => void;
	onClose: () => void;
	onSave: (input: { title: string; color: NotebookColor }) => void;
	onDelete: () => void;
}) {
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
								data-notebook={c}
								className={cn('size-11 rounded-full border-2 bg-tint-cover transition-transform focus-ring', color === c ? 'scale-110 border-fg' : 'border-transparent')}
							/>
						))}
					</div>
				</fieldset>
				{total > 1 && (
					<div className="flex items-center gap-2">
						<span className="text-sm font-medium text-fg-muted">
							Posizione {position + 1} di {total}
						</span>
						<Button type="button" variant="secondary" size="sm" disabled={position <= 0} onClick={() => onShift(-1)} aria-label="Sposta il quaderno su">
							<ArrowUp className="size-4" aria-hidden="true" />
						</Button>
						<Button type="button" variant="secondary" size="sm" disabled={position < 0 || position >= total - 1} onClick={() => onShift(1)} aria-label="Sposta il quaderno giù">
							<ArrowDown className="size-4" aria-hidden="true" />
						</Button>
					</div>
				)}
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

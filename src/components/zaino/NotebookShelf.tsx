'use client';

import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUp, Loader2, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { Features } from '@/lib/stripe/config';
import { COLOR_LABEL, DEFAULT_NOTEBOOK_TITLE, NOTEBOOK_COLORS, type NotebookColor, type NotebookRow, type Quota, type ShelfStats } from '@/lib/zaino/config';
import { ZAINO_ROOT } from '@/lib/config/site';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Field';
import { Sheet, sheetActions } from '@/components/ui/Sheet';
import { Paywall } from '@/components/subscription/Paywall';
import { cn } from '@/lib/utils/cn';
import { useZainoAction } from './ZainoActions';
import { QuotaBar } from './QuotaBar';
import { NotebookCover } from './NotebookCover';
import './zaino.css';

/** The shelf: every quaderno, with create, rename and delete. */
export function NotebookShelf({ notebooks, stats, quota }: { notebooks: NotebookRow[]; stats: Record<string, ShelfStats>; quota: Quota }) {
	const counts = (id: string) => stats[id]?.notes ?? 0;
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
				preview={<Shelf notebooks={notebooks} stats={stats} onEdit={() => {}} />}
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
				<div className="note-in grid items-center gap-8 rounded-2xl border border-dashed border-edge-strong bg-surface/60 px-6 py-10 sm:grid-cols-[11rem_1fr] sm:px-10">
					{/* A quaderno still in its wrapper: the one the student is about to start. */}
					<span data-notebook="crimson" className="zn-notebook pointer-events-none mx-auto w-36 [--tilt:-3deg] sm:w-40" aria-hidden="true">
						<span className="zn-block" data-fill="0" />
						<span className="zn-cover" />
						<span className="zn-holes" />
						<span className="zn-spiral" />
						<span className="relative z-[2] flex h-full flex-col px-3 pl-5 pt-[24%]">
							<span className="zn-label block px-2.5 pb-2 pt-1.5">
								<span className="label-mono block text-[0.6rem] text-tint-fg">Nº 01</span>
								<span className="block h-7" />
							</span>
						</span>
					</span>
					<div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
						<p className="font-display text-3xl font-semibold leading-tight text-fg-strong">Lo zaino è vuoto</p>
						<p className="max-w-sm leading-relaxed text-fg-muted">
							Crea il primo quaderno: dentro ci metti le note di una materia, di un capitolo o di quello che vuoi. Il nome lo scrivi tu,
							sull&apos;etichetta.
						</p>
						<Button onClick={create} loading={busy === 'new'} className="mt-1">
							<Plus className="size-4" aria-hidden="true" />
							Crea il primo quaderno
						</Button>
						<QuotaBar quota={quota} />
					</div>
				</div>
			) : (
				<Shelf notebooks={notebooks} stats={stats} onEdit={setEditing} onCreate={create} creating={busy === 'new'} />
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

			<Sheet open={!!confirming} onClose={() => setConfirming(null)} title="Elimina il quaderno" size="auto" width="sm" align="center">
				<div>
					<p className="text-sm text-fg-muted">
						{confirming && counts(confirming.id) > 0
							? `«${confirming.title}» contiene ${counts(confirming.id)} ${counts(confirming.id) === 1 ? 'nota' : 'note'}. Eliminando il quaderno elimini anche quelle, e non si possono recuperare.`
							: `Vuoi eliminare «${confirming?.title}»?`}
					</p>
					<div className={cn(sheetActions, 'mt-5')}>
						<Button variant="ghost" onClick={() => setConfirming(null)}>Annulla</Button>
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
					</div>
				</div>
			</Sheet>

			{blocked && <button type="button" onClick={clearBlocked} className="sr-only">Chiudi</button>}
		</div>
	);
}

const TILTS = [-1.1, 0.8, -0.4, 1.2, -0.8, 0.5];

/**
 * The quaderni as spiral notebooks standing on a shelf: the cover in the colour the student chose, the name
 * written in pen on the label, the pages showing at the edge as it fills up. `onCreate` adds the outline of one
 * more at the end; the paywall's preview has none.
 */
function Shelf({
	notebooks,
	stats,
	onEdit,
	onCreate,
	creating = false
}: {
	notebooks: NotebookRow[];
	stats: Record<string, ShelfStats>;
	onEdit: (n: NotebookRow) => void;
	onCreate?: () => void;
	creating?: boolean;
}) {
	return (
		<ul className="grid grid-cols-2 gap-x-6 gap-y-8 pr-1 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-4">
			{notebooks.map((notebook, i) => {
				const s = stats[notebook.id];
				const count = s?.notes ?? 0;
				return (
					<li key={notebook.id} className="note-in group/card relative" style={{ '--i': i } as CSSProperties}>
						<Link
							href={`${ZAINO_ROOT}/${notebook.id}`}
							data-notebook={notebook.color}
							className="zn-notebook text-tint-cover-fg no-underline focus-ring-offset"
							style={{ '--tilt': `${TILTS[i % TILTS.length]}deg` } as CSSProperties}
						>
							<NotebookCover title={notebook.title} index={i} notes={count} updated={s?.updated ?? null} />
						</Link>
						{/* Always reachable on touch; on a mouse it fades in with the card. */}
						<button
							type="button"
							onClick={() => onEdit(notebook)}
							aria-label={`Opzioni di ${notebook.title}`}
							className="absolute right-1 top-1 z-10 flex size-11 items-center justify-center rounded-full text-white/85 opacity-100 transition duration-150 hover:bg-white/15 hover:text-white active:scale-95 focus-ring md:opacity-0 md:group-hover/card:opacity-100 md:focus-visible:opacity-100"
						>
							<MoreHorizontal className="size-5" aria-hidden="true" />
						</button>
					</li>
				);
			})}
			{onCreate && (
				<li className="note-in" style={{ '--i': notebooks.length } as CSSProperties}>
					<button
						type="button"
						onClick={onCreate}
						disabled={creating}
						aria-label="Aggiungi un quaderno"
						className="zn-slot group/slot flex w-full flex-col items-center justify-center gap-2 px-4 text-fg-subtle hover:text-accent-fg disabled:opacity-60 focus-ring-offset"
					>
						<span className="flex size-11 items-center justify-center rounded-full border border-dashed border-current transition-transform duration-300 ease-out-soft group-hover/slot:rotate-90">
							{creating ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <Plus className="size-5" aria-hidden="true" />}
						</span>
						<span className="font-hand text-2xl font-semibold leading-none">Un altro quaderno</span>
					</button>
				</li>
			)}
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
		<Sheet open={!!notebook} onClose={onClose} title="Modifica il quaderno" size="auto" width="sm" align="center">
			<form
				className="space-y-5"
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
				<div className={cn(sheetActions, 'pt-1')}>
					<Button type="button" variant="ghost" onClick={onDelete} className="text-danger-fg hover:text-danger-fg sm:mr-auto">
						<Trash2 className="size-4" aria-hidden="true" />
						Elimina
					</Button>
					<Button type="button" variant="ghost" onClick={onClose}>Annulla</Button>
					<Button type="submit" loading={busy === notebook?.id}>Salva</Button>
				</div>
			</form>
		</Sheet>
	);
}

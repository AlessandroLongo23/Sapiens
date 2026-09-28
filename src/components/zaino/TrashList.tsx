'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { RotateCcw, Trash2 } from 'lucide-react';
import { TRASH_DAYS, type Trash, type TrashedNote, type TrashedNotebook } from '@/lib/zaino/config';
import { ZAINO_ROOT } from '@/lib/config/site';
import { useSlideIntoPlace } from '@/lib/hooks/use-slide-into-place';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Sheet, sheetActions } from '@/components/ui/Sheet';
import { cn } from '@/lib/utils/cn';
import { useZainoAction } from './ZainoActions';
import './zaino.css';

const DAY = 86_400_000;
const when = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short' });

/** "tra 27 giorni", "domani", "oggi": when the nightly job takes it. */
function goesIn(deletedAt: string, now: number): string {
	const left = TRASH_DAYS - Math.floor((now - new Date(deletedAt).getTime()) / DAY);
	if (left <= 0) return 'si cancella stanotte';
	if (left === 1) return 'si cancella domani';
	return `si cancella tra ${left} giorni`;
}

type Item = { kind: 'notebook'; row: TrashedNotebook } | { kind: 'note'; row: TrashedNote };

/**
 * The trash: quaderni and notes deleted in the last 30 days, newest first. Each can be put back ("Ripristina") or
 * deleted for good, which asks first, since that one cannot be undone; "Svuota il cestino" does the same for all.
 * `now` comes from the server, so the days left read the same on both sides of hydration.
 */
export function TrashList({ trash, now }: { trash: Trash; now: number }) {
	const { busy, error, blocked, clearBlocked, run } = useZainoAction();
	const [confirm, setConfirm] = useState<Item | 'all' | null>(null);
	const [restored, setRestored] = useState<{ message: string; notebookId: string } | null>(null);
	const [gone, setGone] = useState<ReadonlySet<string>>(new Set());
	const list = useRef<HTMLDivElement>(null);
	const closeGap = useSlideIntoPlace(list, 'data-trash-id');

	const notebooks = trash.notebooks.filter((b) => !gone.has(b.id));
	const notes = trash.notes.filter((n) => !gone.has(n.id));
	const empty = notebooks.length === 0 && notes.length === 0;
	const take = (id: string) => {
		closeGap();
		setGone((now) => new Set(now).add(id));
	};

	const restore = async (item: Item) => {
		clearBlocked();
		setRestored(null);
		const path = item.kind === 'note' ? `/api/zaino/cestino/note/${item.row.id}` : `/api/zaino/cestino/quaderni/${item.row.id}`;
		const done = await run(item.row.id, path, 'POST');
		if (!done) return;
		take(item.row.id);
		// A note whose quaderno was in the trash brings it back too: that row goes as well.
		if (item.kind === 'note' && done.notebookRestored) take(item.row.notebook_id);
		setRestored(
			item.kind === 'note'
				? {
						message: done.notebookRestored
							? `«${item.row.title}» è tornata in «${item.row.notebook_title}», e con lei il quaderno.`
							: `«${item.row.title}» è tornata in «${item.row.notebook_title}».`,
						notebookId: item.row.notebook_id
					}
				: { message: `«${item.row.title}» è tornato sullo scaffale.`, notebookId: item.row.id }
		);
	};

	const forget = async () => {
		if (!confirm) return;
		setRestored(null);
		if (confirm === 'all') {
			const done = await run('all', '/api/zaino/cestino', 'DELETE');
			if (done) {
				for (const id of [...notebooks.map((b) => b.id), ...notes.map((n) => n.id)]) take(id);
				setConfirm(null);
			}
			return;
		}
		const path = confirm.kind === 'note' ? `/api/zaino/cestino/note/${confirm.row.id}` : `/api/zaino/cestino/quaderni/${confirm.row.id}`;
		const done = await run(confirm.row.id, path, 'DELETE');
		if (!done) return;
		take(confirm.row.id);
		setConfirm(null);
	};

	const row = (item: Item) => {
		const { row: r } = item;
		const color = item.kind === 'note' ? item.row.notebook_color : item.row.color;
		const meta =
			item.kind === 'note'
				? `da «${item.row.notebook_title}» · eliminata il ${when.format(new Date(r.deleted_at))}`
				: `${item.row.notes === 0 ? 'vuoto' : `${item.row.notes} ${item.row.notes === 1 ? 'nota' : 'note'}`} · eliminato il ${when.format(new Date(r.deleted_at))}`;
		return (
			<li key={r.id} data-trash-id={r.id} data-notebook={color} className="note-in flex items-stretch border-b border-edge bg-surface last:border-b-0">
				<span className="w-1 shrink-0 bg-tint opacity-80" aria-hidden="true" />
				<div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2 py-3.5 pl-4 pr-3">
					<div className="min-w-0 flex-1 basis-60">
						<p className="truncate font-display text-lg font-medium leading-snug tracking-tight text-fg-strong">{r.title}</p>
						<p className="mt-0.5 font-mono text-[0.6875rem] text-fg-faint">
							{meta} · {goesIn(r.deleted_at, now)}
						</p>
						{item.kind === 'note' && item.row.excerpt && <p className="mt-1 truncate text-sm text-fg-muted">{item.row.excerpt}</p>}
					</div>
					<div className="flex shrink-0 items-center gap-1">
						<Button variant="secondary" size="sm" loading={busy === r.id} onClick={() => restore(item)}>
							<RotateCcw className="size-4" aria-hidden="true" />
							Ripristina
						</Button>
						<button
							type="button"
							onClick={() => setConfirm(item)}
							aria-label={`Elimina per sempre «${r.title}»`}
							title="Elimina per sempre"
							className="flex size-10 items-center justify-center rounded-xl text-fg-subtle transition-colors hover:bg-danger-soft hover:text-danger-fg focus-ring"
						>
							<Trash2 className="size-4" aria-hidden="true" />
						</button>
					</div>
				</div>
			</li>
		);
	};

	const count = notebooks.length + notes.length;
	return (
		<div ref={list} className="space-y-8">
			{error && <Alert tone="error">{error}</Alert>}
			{blocked && (
				<Alert tone="error">
					{blocked}{' '}
					<Link href="/pricing" className="font-semibold underline underline-offset-2">
						Vedi i piani
					</Link>
				</Alert>
			)}
			{restored && (
				<Alert tone="success">
					{restored.message}{' '}
					<Link href={`${ZAINO_ROOT}/${restored.notebookId}`} className="font-semibold underline underline-offset-2">
						Apri il quaderno
					</Link>
				</Alert>
			)}

			{empty ? (
				<div className="note-in flex flex-col items-center gap-3 rounded-2xl border border-dashed border-edge-strong bg-surface/60 px-6 py-14 text-center">
					<p className="zn-pen text-3xl leading-9">Il cestino è vuoto.</p>
					<Link href={ZAINO_ROOT} className="text-sm font-medium text-fg-muted underline decoration-edge-strong underline-offset-4 hover:text-fg focus-ring">
						Torna allo Zaino
					</Link>
				</div>
			) : (
				<>
					<div className="flex justify-end">
						<Button variant="ghost" onClick={() => setConfirm('all')} className="text-danger-fg hover:text-danger-fg">
							<Trash2 className="size-4" aria-hidden="true" />
							Svuota il cestino
						</Button>
					</div>
					{notebooks.length > 0 && (
						<section className="space-y-3">
							<h2 className="flex items-baseline gap-3 text-2xl font-semibold text-fg-strong">
								Quaderni <span className="label-mono text-fg-subtle">{String(notebooks.length).padStart(2, '0')}</span>
							</h2>
							<ul className="overflow-hidden rounded-2xl border border-edge bg-surface shadow-paper">{notebooks.map((book) => row({ kind: 'notebook', row: book }))}</ul>
						</section>
					)}
					{notes.length > 0 && (
						<section className="space-y-3">
							<h2 className="flex items-baseline gap-3 text-2xl font-semibold text-fg-strong">
								Note <span className="label-mono text-fg-subtle">{String(notes.length).padStart(2, '0')}</span>
							</h2>
							<ul className="overflow-hidden rounded-2xl border border-edge bg-surface shadow-paper">{notes.map((note) => row({ kind: 'note', row: note }))}</ul>
						</section>
					)}
				</>
			)}

			<Sheet
				open={!!confirm}
				onClose={() => setConfirm(null)}
				title={confirm === 'all' ? 'Svuota il cestino' : 'Elimina per sempre'}
				size="auto"
				width="sm"
				align="center"
			>
				<p className="text-sm text-fg-muted">
					{confirm === 'all'
						? `${count === 1 ? "L'elemento nel cestino viene cancellato" : `I ${count} elementi nel cestino vengono cancellati`} per sempre e non si possono più recuperare.`
						: confirm?.kind === 'notebook'
							? confirm.row.notes === 0
								? `«${confirm.row.title}» viene cancellato per sempre e non si può più recuperare.`
								: `«${confirm.row.title}» e ${confirm.row.notes === 1 ? 'la nota che contiene vengono cancellati' : `le ${confirm.row.notes} note che contiene vengono cancellati`} per sempre e non si possono più recuperare.`
							: `«${confirm?.row.title}» viene cancellata per sempre e non si può più recuperare.`}
				</p>
				<div className={cn(sheetActions, 'mt-5')}>
					<Button variant="ghost" onClick={() => setConfirm(null)}>
						Annulla
					</Button>
					<Button variant="inverse" loading={confirm === 'all' ? busy === 'all' : !!confirm && busy === confirm.row.id} onClick={forget}>
						<Trash2 className="size-4" aria-hidden="true" />
						{confirm === 'all' ? 'Svuota' : 'Elimina per sempre'}
					</Button>
				</div>
			</Sheet>
		</div>
	);
}

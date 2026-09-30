'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, FolderInput, GripVertical, LayoutGrid, List, MoreHorizontal, Plus, Search, Trash2 } from 'lucide-react';
import { Features } from '@/lib/stripe/config';
import { ZAINO_ROOT } from '@/lib/config/site';
import type { FirstPage, NotebookRow, NoteHit, NoteSummary, Quota } from '@/lib/zaino/config';
import { useReorder } from '@/lib/hooks/use-reorder';
import { useSlideIntoPlace } from '@/lib/hooks/use-slide-into-place';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { Sheet } from '@/components/ui/Sheet';
import { Paywall } from '@/components/subscription/Paywall';
import { cn } from '@/lib/utils/cn';
import { useZainoAction } from './ZainoActions';
import { QuotaBar } from './QuotaBar';
import { MoveNoteSheet } from './MoveNoteSheet';
import { FirstPageThumb } from './FirstPageThumb';
import { NoteCrumple, warmUpCrumple, type CrumpleState } from './NoteCrumple';
import { DropBin, TrashLink } from './Trash';
import './zaino.css';
import { Spinner } from '@/components/ui/Spinner';

const when = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short' });

type View = 'griglia' | 'elenco';
/** The view is the student's, kept in this browser. */
const VIEW_KEY = 'sapiens:zaino-vista';
const readView = (): View => {
	try {
		return localStorage.getItem(VIEW_KEY) === 'elenco' ? 'elenco' : 'griglia';
	} catch {
		// No storage (a private window): the grid it is.
		return 'griglia';
	}
};
const viewListeners = new Set<() => void>();
const subscribeView = (listener: () => void) => {
	viewListeners.add(listener);
	window.addEventListener('storage', listener);
	return () => {
		viewListeners.delete(listener);
		window.removeEventListener('storage', listener);
	};
};
const saveView = (next: View) => {
	try {
		localStorage.setItem(VIEW_KEY, next);
	} catch {
		// Not remembered: it still changes for this visit, below.
	}
	memoryView = next;
	viewListeners.forEach((listener) => listener());
};
/** What was picked in this visit, for a browser that cannot store it. */
let memoryView: View | null = null;

/** A search in the text waits for a pause in the typing. */
const SEARCH_DELAY_MS = 250;

/**
 * One quaderno's notes, under the page header: a toolbar (search, grid or list, a new note), then the notes as
 * cards of squared paper or as rows. The search matches titles and excerpts at once and the whole text from the
 * server a moment later. Open, reorder (drag the handle, or its arrows), move and delete.
 *
 * Deleting moves to the trash, so nothing asks to confirm: from the ⋯ menu the note is crumpled and thrown into the
 * trash in the toolbar; dragged, a trash appears at the bottom of the screen, the note crumples while it is held over
 * it and flattens again when it leaves, and letting go there throws it in.
 */
export function NoteList({
	notebookId,
	notes,
	pages,
	notebooks,
	quota,
	trashCount
}: {
	notebookId: string;
	notes: NoteSummary[];
	/** The first page of each note, by id, for the grid. */
	pages: Record<string, FirstPage>;
	notebooks: NotebookRow[];
	quota: Quota;
	/** What is in the trash, for the count on its link. */
	trashCount: number;
}) {
	const router = useRouter();
	const { busy, error, blocked, run } = useZainoAction();
	const [menu, setMenu] = useState<NoteSummary | null>(null);
	const [moving, setMoving] = useState<NoteSummary | null>(null);
	/** The note whose crumple is prepared (its menu is open, or it is being dragged), held over the trash or thrown;
	 *  `gone` are the notes thrown away and not yet refreshed out of the list. */
	const [crumple, setCrumple] = useState<{ id: string; state: CrumpleState; via: 'menu' | 'drag' } | null>(null);
	const [gone, setGone] = useState<ReadonlySet<string>>(new Set());
	const [deleteError, setDeleteError] = useState<string | null>(null);
	/** The trash requests in flight, by note: the list refreshes once the ball has landed and the server has answered. */
	const requests = useRef(new Map<string, Promise<boolean>>());
	/** The count on the trash link: the server's, plus what landed since. */
	const [landed, setLanded] = useState({ base: trashCount, extra: 0 });
	if (landed.base !== trashCount) setLanded({ base: trashCount, extra: 0 });
	const [bump, setBump] = useState(0);
	const trashLink = useRef<HTMLAnchorElement>(null);
	const dropBin = useRef<HTMLDivElement>(null);
	const [overBin, setOverBin] = useState(false);
	/** The trash in the toolbar is out of view: a note thrown from its menu goes to the one that comes up instead. */
	const [binForMenu, setBinForMenu] = useState(false);
	const list = useRef<HTMLDivElement>(null);
	const closeGap = useSlideIntoPlace(list, 'data-note-id');
	const hasNotes = notes.length > 0;
	useEffect(() => {
		if (hasNotes) warmUpCrumple(list.current?.querySelector<HTMLElement>('.zn-page') ?? list.current);
	}, [hasNotes]);
	const showAgain = (id: string) =>
		setGone((now) => {
			const next = new Set(now);
			next.delete(id);
			return next;
		});
	const [filter, setFilter] = useState('');
	// The server draws the grid; a student who picked the list gets it right after hydration.
	const view = useSyncExternalStore(subscribeView, () => memoryView ?? readView(), () => 'griglia' as View);
	/** Notes whose text matches the search, from the server; null while there is no answer for it. */
	const [inText, setInText] = useState<{ q: string; ids: Set<string> } | null>(null);

	const byId = useMemo(() => new Map(notes.map((note) => [note.id, note])), [notes]);
	const ids = useMemo(() => notes.map((note) => note.id), [notes]);
	/** Sends the note to the trash; the answer is awaited once the ball has landed. */
	const throwAway = (note: NoteSummary, via: 'menu' | 'drag') => {
		setDeleteError(null);
		if (via === 'menu') {
			const link = trashLink.current?.getBoundingClientRect();
			// The bin comes up while the note crumples, so it is in place when the ball flies.
			setBinForMenu(!link || link.bottom < 0 || link.top > window.innerHeight);
		}
		setCrumple({ id: note.id, state: 'thrown', via });
		requests.current.set(
			note.id,
			fetch(`/api/zaino/note/${note.id}`, { method: 'DELETE' })
				.then((response) => response.ok)
				.catch(() => false)
		);
	};
	const landedIn = () => {
		setLanded((now) => ({ ...now, extra: now.extra + 1 }));
		setBump((n) => n + 1);
	};
	const thrown = async (id: string) => {
		setBinForMenu(false);
		closeGap();
		setGone((now) => new Set(now).add(id));
		setCrumple(null);
		const ok = await (requests.current.get(id) ?? Promise.resolve(false));
		requests.current.delete(id);
		if (ok) return router.refresh();
		showAgain(id);
		setLanded((now) => ({ ...now, extra: Math.max(0, now.extra - 1) }));
		setDeleteError('Non sono riuscito a spostare la nota nel cestino. Riprova.');
	};
	const openMenu = (note: NoteSummary) => {
		setMenu(note);
		// A delete is in sight: the page is photographed and the paper laid while the menu is read.
		if (!crumple || crumple.state === 'ready') setCrumple({ id: note.id, state: 'ready', via: 'menu' });
	};
	const closeMenu = () => {
		setMenu(null);
		setCrumple((now) => (now?.via === 'menu' && now.state === 'ready' ? null : now));
	};

	/** Is the point on the trash that appears while a note is dragged? A little margin makes it easy to hit. */
	const onBin = (x: number, y: number) => {
		const box = dropBin.current?.getBoundingClientRect();
		return !!box && x > box.left - 24 && x < box.right + 24 && y > box.top - 24 && y < box.bottom + 24;
	};
	const binRef = useRef(false);
	const { order, dragging, rowProps, handleProps } = useReorder(
		ids,
		(next) => run('reorder', `/api/zaino/quaderni/${notebookId}/note/reorder`, 'POST', { ids: next }),
		true,
		{
			start: (id) => {
				binRef.current = false;
				setCrumple((now) => (now?.state === 'thrown' ? now : { id, state: 'ready', via: 'drag' }));
			},
			over: (id, x, y) => {
				const over = onBin(x, y);
				if (over !== binRef.current) {
					binRef.current = over;
					setOverBin(over);
					setCrumple((now) => (now?.id === id && now.state !== 'thrown' ? { ...now, state: over ? 'held' : 'ready' } : now));
				}
				return over;
			},
			release: (id, x, y) => {
				const note = byId.get(id);
				if (!note || !onBin(x, y)) return false;
				throwAway(note, 'drag');
				return true;
			},
			end: () => {
				binRef.current = false;
				setOverBin(false);
				setCrumple((now) => (now?.via === 'drag' && now.state !== 'thrown' ? null : now));
			}
		}
	);

	const needle = filter.trim().toLowerCase();
	useEffect(() => {
		if (needle.length < 2) return;
		const controller = new AbortController();
		const timer = setTimeout(async () => {
			try {
				const response = await fetch(`/api/zaino/cerca?q=${encodeURIComponent(needle)}&quaderno=${notebookId}`, { signal: controller.signal });
				if (!response.ok) return;
				const { notes: hits } = (await response.json()) as { notes: NoteHit[] };
				setInText({ q: needle, ids: new Set(hits.map((hit) => hit.id)) });
			} catch {
				// Aborted or offline: the titles still filter.
			}
		}, SEARCH_DELAY_MS);
		return () => {
			clearTimeout(timer);
			controller.abort();
		};
	}, [needle, notebookId]);
	const textHits = inText && inText.q === needle ? inText.ids : null;
	const searchingText = needle.length >= 2 && !textHits;

	const inTitle = (note: NoteSummary) => `${note.title} ${note.excerpt}`.toLowerCase().includes(needle);
	const shown = order
		.map((id) => byId.get(id))
		.filter((note): note is NoteSummary => !!note)
		.filter((note) => !gone.has(note.id))
		.filter((note) => !needle || inTitle(note) || !!textHits?.has(note.id));

	if (blocked) {
		return <Paywall feature={Features.NOTEBOOKS} returnTo={`${ZAINO_ROOT}/${notebookId}`} backUrl={ZAINO_ROOT} benefit={blocked} />;
	}

	const create = () => run('new', `/api/zaino/quaderni/${notebookId}/note`, 'POST');
	// Reordering is off while a search hides notes: dropping between two visible ones would move it past the others.
	const canReorder = !needle;
	/** Found only in the text, where the card does not show it: said on the card. */
	const onlyInText = (note: NoteSummary) => !!needle && !inTitle(note);

	return (
		<div ref={list} className="space-y-6">
			{(error || deleteError) && <Alert tone="error">{error ?? deleteError}</Alert>}

			{/* Empty as soon as the last note is thrown away, before the list comes back from the server. */}
			{notes.every((note) => gone.has(note.id)) ? (
				<div className="space-y-4">
					{/* The trash stays where it was in the toolbar, so what went in can come back out. */}
					{landed.base + landed.extra > 0 && (
						<div className="flex justify-end">
							<TrashLink ref={trashLink} count={landed.base + landed.extra} bump={bump} />
						</div>
					)}
					<div className="note-in flex flex-col items-center gap-4 rounded-2xl border border-dashed border-edge-strong bg-surface/60 px-6 py-16 text-center">
						<p className="zn-pen text-4xl leading-10">Qui comincia il quaderno.</p>
						<p className="max-w-md leading-relaxed text-fg-muted">
							Scrivi la prima nota: puoi formattarla con la barra degli strumenti o scriverla in markdown, come preferisci.
						</p>
						<Button onClick={create} loading={busy === 'new'} className="mt-1">
							<Plus className="size-4" aria-hidden="true" />
							Scrivi la prima nota
						</Button>
						<QuotaBar quota={quota} />
					</div>
				</div>
			) : (
				<>
					<div className="flex flex-wrap items-center gap-3 border-b border-edge-strong pb-4">
						<div className="relative w-full sm:w-80">
							<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-faint" aria-hidden="true" />
							<Input
								type="search"
								value={filter}
								onChange={(e) => setFilter(e.target.value)}
								placeholder="Cerca in titoli e testo"
								aria-label="Filtra le note di questo quaderno"
								className="pl-9 pr-9"
							/>
							{searchingText && <Spinner className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-fg-faint" />}
						</div>
						<div className="flex items-center gap-3 sm:ml-auto">
							<TrashLink ref={trashLink} count={landed.base + landed.extra} bump={bump} />
							<ViewSwitch value={view} onChange={saveView} />
							<Button onClick={create} loading={busy === 'new'}>
								<Plus className="size-4" aria-hidden="true" />
								Nuova nota
							</Button>
						</div>
					</div>

					<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
						<p className="label-mono text-fg-subtle" aria-live="polite">
							{needle
								? `${shown.length} ${shown.length === 1 ? 'nota trovata' : 'note trovate'}${searchingText ? ', cerco nel testo…' : ''}`
								: canReorder && notes.length > 1 && (
										<>
											<span className="pointer-coarse:hidden">Trascina la maniglia per riordinare</span>
											<span className="hidden pointer-coarse:inline">Per riordinare, passa all&apos;elenco</span>
										</>
									)}
						</p>
						<QuotaBar quota={quota} />
					</div>

					{shown.length === 0 ? (
						<div className="rounded-2xl border border-dashed border-edge-strong px-6 py-12 text-center text-sm text-fg-muted">
							{searchingText ? 'Cerco nel testo delle note…' : <>Nessuna nota contiene «{filter.trim()}».</>}
						</div>
					) : view === 'griglia' ? (
						<ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6">
							{!needle && (
								<li className="note-in">
									<button
										type="button"
										onClick={create}
										disabled={busy === 'new'}
										aria-label="Aggiungi una nota"
										className="zn-new group/new flex w-full flex-col items-center justify-center gap-2 text-fg-subtle hover:text-accent-fg disabled:opacity-60 focus-ring-offset"
									>
										<span className="flex size-11 items-center justify-center rounded-full border border-dashed border-current transition-transform duration-300 ease-out-soft group-hover/new:rotate-90">
											{busy === 'new' ? <Spinner className="size-5" /> : <Plus className="size-5" aria-hidden="true" />}
										</span>
										<span className="font-hand text-2xl font-semibold leading-none">Nuova nota</span>
									</button>
								</li>
							)}
							{shown.map((note, i) => {
								const page = pages[note.id];
								return (
									<li key={note.id} data-note-id={note.id} {...rowProps(note.id)} className={cn('note-in group/note relative', dragging === note.id && 'z-10')} style={{ '--i': i + 1 } as CSSProperties}>
										{/* The page opens the note too; the title below is the link that keyboards and readers get. */}
										<Link href={`${ZAINO_ROOT}/nota/${note.id}`} tabIndex={-1} aria-hidden="true" className="block">
											<div className="zn-page" data-dragging={dragging === note.id ? '' : undefined} data-more={page && page.pages > 1 ? '' : undefined}>
												{page && <FirstPageThumb page={page} />}
											</div>
										</Link>
										{/* On a touch screen a note is reordered from the list, where the grip does not cover the page. */}
										<Handle
											title={note.title}
											disabled={!canReorder}
											props={handleProps(note.id)}
											className="absolute left-1.5 top-1.5 size-9 bg-surface/85 shadow-paper backdrop-blur-sm pointer-coarse:hidden md:opacity-0 md:group-hover/note:opacity-100 md:focus-visible:opacity-100"
										/>
										<div className="mt-3 flex items-start gap-1">
											<Link href={`${ZAINO_ROOT}/nota/${note.id}`} className="min-w-0 flex-1 rounded no-underline focus-ring-offset">
												<span data-note-title className="block truncate font-display text-lg font-medium leading-snug tracking-tight text-fg-strong">
													{note.title}
												</span>
												<Meta note={note} pages={page?.pages ?? 1} onlyInText={onlyInText(note)} />
											</Link>
											<Options title={note.title} onClick={() => openMenu(note)} className="-mr-2 -mt-1.5 size-9 shrink-0" />
										</div>
									</li>
								);
							})}
						</ul>
					) : (
						<ul className="overflow-hidden rounded-2xl border border-edge bg-surface shadow-paper">
							{shown.map((note, i) => (
								<li
									key={note.id}
									data-note-id={note.id}
									{...rowProps(note.id)}
									className={cn(
										'note-in group/note relative flex items-stretch border-b border-edge bg-surface last:border-b-0',
										dragging === note.id && 'z-10 shadow-lift'
									)}
									style={{ '--i': i } as CSSProperties}
								>
									<span className="w-1 shrink-0 bg-tint opacity-80" aria-hidden="true" />
									<Handle title={note.title} disabled={!canReorder} props={handleProps(note.id)} className="w-9 shrink-0" />
									<Link
										href={`${ZAINO_ROOT}/nota/${note.id}`}
										className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 py-3.5 pr-14 no-underline transition-colors hover:bg-surface-2 focus-ring"
									>
										<span data-note-title className="truncate font-display text-lg font-medium leading-snug tracking-tight text-fg-strong">{note.title}</span>
										<time dateTime={note.updated_at} className="row-span-2 font-mono text-[0.6875rem] text-fg-faint max-sm:hidden">
											{when.format(new Date(note.updated_at))}
										</time>
										<span className={cn('truncate text-sm', note.excerpt ? 'text-fg-muted' : 'italic text-fg-faint')}>
											{onlyInText(note) ? 'Trovata nel testo della nota' : note.excerpt || 'Nota vuota'}
										</span>
									</Link>
									<Options title={note.title} onClick={() => openMenu(note)} className="absolute right-2 top-1/2 -translate-y-1/2" />
								</li>
							))}
						</ul>
					)}
				</>
			)}

			<Sheet open={!!menu} onClose={closeMenu} title={menu?.title ?? 'Nota'} size="auto">
				<div className="-mx-3 flex flex-col">
					<button
						type="button"
						onClick={() => {
							setMoving(menu);
							closeMenu();
						}}
						className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-left font-medium text-fg transition-colors hover:bg-surface-3 focus-ring"
					>
						<FolderInput className="size-4 text-fg-subtle" aria-hidden="true" />
						Sposta in un altro quaderno
					</button>
					<button
						type="button"
						onClick={() => {
							if (!menu) return;
							throwAway(menu, 'menu');
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

			{crumple && (
				<NoteCrumple
					key={crumple.id}
					noteId={crumple.id}
					state={crumple.state}
					target={() => (crumple.via === 'drag' || binForMenu ? dropBin.current : trashLink.current)}
					onLanded={landedIn}
					onDone={() => thrown(crumple.id)}
				/>
			)}
			<DropBin ref={dropBin} shown={!!dragging || binForMenu || (crumple?.via === 'drag' && crumple.state === 'thrown')} over={overBin} bump={bump} label={(binForMenu || crumple?.state === 'thrown') && !dragging ? 'Nel cestino' : undefined} />
			<p className="sr-only" aria-live="polite">
				{landed.extra > 0 ? (landed.extra === 1 ? 'Nota spostata nel cestino.' : `${landed.extra} note spostate nel cestino.`) : ''}
			</p>
		</div>
	);
}

/** Under a card: when it was written, how many pages, and the lesson it came from or where the search found it. */
function Meta({ note, pages, onlyInText }: { note: NoteSummary; pages: number; onlyInText: boolean }) {
	return (
		<div className="mt-1 flex min-w-0 flex-col gap-1">
			<p className="font-mono text-[0.6875rem] text-fg-faint">
				<time dateTime={note.updated_at}>{when.format(new Date(note.updated_at))}</time>
				{pages > 1 && ` · ${pages} pagine`}
			</p>
			{onlyInText ? (
				<em className="label-mono w-fit rounded-full bg-accent-soft px-2 py-0.5 not-italic text-accent-fg">Trovata nel testo</em>
			) : (
				note.lesson_title && (
					<em className="label-mono flex min-w-0 items-center gap-1.5 not-italic text-tint-fg">
						<BookOpen className="size-3.5 shrink-0" aria-hidden="true" />
						<b className="truncate font-medium">{note.lesson_title}</b>
					</em>
				)
			)}
		</div>
	);
}

const VIEWS = [
	{ value: 'griglia', label: 'Griglia', icon: LayoutGrid },
	{ value: 'elenco', label: 'Elenco', icon: List }
] as const;

/** Grid or list: two square buttons in a frame as tall as the fields next to it, the chosen one raised. */
function ViewSwitch({ value, onChange }: { value: View; onChange: (view: View) => void }) {
	return (
		<div role="group" aria-label="Mostra le note" className="flex h-11 items-center gap-0.5 rounded-xl border border-edge bg-surface-2 p-1">
			{VIEWS.map(({ value: v, label, icon: Icon }) => (
				<button
					key={v}
					type="button"
					aria-pressed={value === v}
					aria-label={label}
					title={label}
					onClick={() => onChange(v)}
					className={cn(
						'flex h-full items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium transition-colors duration-150 focus-ring',
						value === v ? 'bg-surface text-fg-strong shadow-paper' : 'text-fg-subtle hover:text-fg'
					)}
				>
					<Icon className="size-4" aria-hidden="true" />
					<span className="max-md:sr-only">{label}</span>
				</button>
			))}
		</div>
	);
}

/** The grip that reorders a note: dragged, or focused and moved with the arrows. */
function Handle({
	title,
	disabled,
	props,
	className
}: {
	title: string;
	disabled: boolean;
	props: ReturnType<ReturnType<typeof useReorder>['handleProps']>;
	className?: string;
}) {
	return (
		<button
			type="button"
			data-reorder-handle
			{...props}
			disabled={disabled}
			aria-label={`Riordina ${title}. Usa le frecce.`}
			className={cn(
				'flex cursor-grab touch-none items-center justify-center rounded-lg text-fg-faint transition hover:bg-surface-3 hover:text-fg-muted active:cursor-grabbing disabled:hidden focus-ring',
				className
			)}
		>
			<GripVertical className="size-4" aria-hidden="true" />
		</button>
	);
}

/** The ⋯ of a note, always reachable on touch; on a mouse it fades in with the note. */
function Options({ title, onClick, className }: { title: string; onClick: () => void; className?: string }) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={`Opzioni di ${title}`}
			className={cn(
				'flex size-11 items-center justify-center rounded-full text-fg-subtle opacity-100 transition duration-150 hover:bg-surface-3 hover:text-fg active:scale-95 focus-ring md:opacity-0 md:group-hover/note:opacity-100 md:focus-visible:opacity-100',
				className
			)}
		>
			<MoreHorizontal className="size-5" aria-hidden="true" />
		</button>
	);
}

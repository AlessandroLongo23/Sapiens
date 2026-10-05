'use client';

import { useRef, useState, type DragEvent, type FormEvent } from 'react';
import { Braces, Check, ChevronDown, ChevronRight, FileCode, FilePlus, FileText, Folder, FolderOpen, FolderPlus, Image as ImageIcon, ImagePlus, Pencil, Play, Trash2, X } from 'lucide-react';
import { IMAGE_TYPES, kindOf, targetOf, type FileKind } from '@/lib/codice/progetto';
import { cn } from '@/lib/utils/cn';

const ICON: Partial<Record<FileKind, typeof FileCode>> = { image: ImageIcon, text: FileText, markdown: FileText, json: Braces };
const SMALL = 'flex size-7 shrink-0 items-center justify-center rounded-md text-fg-muted hover:bg-surface-3 hover:text-fg-strong focus-ring';
const HOVER = 'opacity-0 group-focus-within/row:opacity-100 group-hover/row:opacity-100 max-lg:opacity-100';
const indent = (depth: number) => ({ paddingLeft: `${0.5 + depth * 0.85}rem` });

/** What is being typed in the list: the name of a new file or folder, or the new name of one. */
interface Naming {
	what: 'file' | 'folder';
	/** The file or the folder being renamed; null for a new one. */
	of: string | null;
	text: string;
}

type Row = { folder: string; depth: number } | { path: string; depth: number };

/**
 * The files of a project, as a tree: each folder with what is inside it, folders first. A click opens a file in the
 * editor, or opens and closes a folder. With `editable` files and folders can be made, renamed and deleted, a
 * picture added from the device, and a file dragged into a folder (or out of every folder, onto the empty part of
 * the list): the folder under it is marked, as in an editor of programs, to say the file would go there. In a lesson the files are the
 * lesson's and the list only opens them. What changes the project answers with a sentence when it cannot be done.
 */
export function Explorer({
	paths,
	folders,
	active,
	target,
	editable,
	onOpen,
	onAim,
	onCreate,
	onCreateFolder,
	onRename,
	onRenameFolder,
	onMove,
	onDelete,
	onDeleteFolder,
	onUpload
}: {
	/** The files, by path. */
	paths: string[];
	/** The folders kept for themselves, which may have nothing in them yet; the others are read from the paths. */
	folders: string[];
	active: string;
	/** The file "Esegui" runs or shows. */
	target: string | null;
	editable: boolean;
	onOpen: (path: string) => void;
	/** Makes a program the one "Esegui" runs. */
	onAim: (path: string) => void;
	onCreate: (path: string) => string | null;
	onCreateFolder: (path: string) => string | null;
	onRename: (from: string, to: string) => string | null;
	onRenameFolder: (from: string, to: string) => string | null;
	/** Puts a file in a folder; '' is the project itself, outside every folder. */
	onMove: (path: string, folder: string) => string | null;
	onDelete: (path: string) => void;
	onDeleteFolder: (path: string) => void;
	onUpload: (file: File) => Promise<string | null>;
}) {
	const [naming, setNaming] = useState<Naming | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [asked, setAsked] = useState<string | null>(null);
	const [closed, setClosed] = useState<Set<string>>(new Set());
	/** The file being dragged, and the folder it is over ('' for the project itself). */
	const dragged = useRef<string | null>(null);
	const [over, setOver] = useState<string | null>(null);
	const picker = useRef<HTMLInputElement>(null);

	const begin = (next: Naming) => {
		setError(null);
		setNaming(next);
	};
	const cancel = () => {
		setNaming(null);
		setError(null);
	};
	const submit = (event: FormEvent) => {
		event.preventDefault();
		if (!naming) return;
		const name = naming.text.trim().replace(/\/+$/, '');
		const problem = naming.of === null ? (naming.what === 'file' ? onCreate(name) : onCreateFolder(name)) : name === naming.of ? null : naming.what === 'file' ? onRename(naming.of, name) : onRenameFolder(naming.of, name);
		setError(problem);
		if (!problem) setNaming(null);
	};
	const field = (
		<form onSubmit={submit} className="flex items-center gap-1 px-2 py-1">
			<input
				autoFocus
				value={naming?.text ?? ''}
				onChange={(e) => setNaming((now) => now && { ...now, text: e.target.value })}
				onKeyDown={(e) => e.key === 'Escape' && cancel()}
				aria-label={naming?.what === 'folder' ? (naming.of === null ? 'Nome della nuova cartella' : 'Nuovo nome della cartella') : naming?.of === null ? 'Nome del nuovo file' : 'Nuovo nome del file'}
				placeholder={naming?.what === 'folder' ? 'cartella' : 'nome.py'}
				autoCapitalize="off"
				autoCorrect="off"
				spellCheck={false}
				className="h-7 min-w-0 flex-1 rounded-md border border-edge-strong bg-surface px-1.5 font-mono text-[0.8125rem] text-fg-strong focus-ring max-sm:text-base"
			/>
			<button type="submit" aria-label="Conferma" className={SMALL}>
				<Check className="size-3.5" aria-hidden="true" />
			</button>
			<button type="button" onClick={cancel} aria-label="Annulla" className={SMALL}>
				<X className="size-3.5" aria-hidden="true" />
			</button>
		</form>
	);

	/** Every folder: the ones kept for themselves, and the ones the files are in, each with the folders above it. */
	const all = new Set<string>();
	for (const path of [...folders.map((folder) => `${folder}/x`), ...paths]) {
		const parts = path.split('/');
		for (let i = 1; i < parts.length; i++) all.add(parts.slice(0, i).join('/'));
	}
	const parent = (path: string) => path.split('/').slice(0, -1).join('/');
	const name = (path: string) => path.split('/').pop()!;
	/** The rows of the tree under a folder ('' is the project): its folders, then its files, and inside an open folder its own. */
	const rows = (inside: string, depth: number): Row[] => [
		...[...all]
			.filter((folder) => parent(folder) === inside)
			.sort((a, b) => name(a).localeCompare(name(b)))
			.flatMap((folder) => [{ folder, depth }, ...(closed.has(folder) ? [] : rows(folder, depth + 1))]),
		...paths
			.filter((path) => parent(path) === inside)
			.sort((a, b) => name(a).localeCompare(name(b)))
			.map((path) => ({ path, depth }))
	];

	/** A file dragged over a folder, or over the list outside every folder. */
	const hover = (event: DragEvent, folder: string) => {
		if (!dragged.current) return;
		event.preventDefault();
		event.stopPropagation();
		// a file is not moved to where it is
		setOver(parent(dragged.current) === folder ? null : folder);
	};
	const drop = (event: DragEvent, folder: string) => {
		event.preventDefault();
		event.stopPropagation();
		const path = dragged.current;
		dragged.current = null;
		setOver(null);
		if (!path || parent(path) === folder) return;
		setError(onMove(path, folder));
		// what the file was put in is shown open
		setClosed((now) => new Set([...now].filter((other) => other !== folder)));
	};

	return (
		<nav aria-label="File del progetto" className="flex h-full flex-col bg-surface-2">
			<div className="flex shrink-0 items-center gap-1 border-b border-edge px-2 py-1.5">
				<span className="label-mono flex-1 px-1 text-fg-subtle">File</span>
				{editable && (
					<>
						<button type="button" onClick={() => begin({ what: 'file', of: null, text: '' })} aria-label="Nuovo file" title="Nuovo file" className={SMALL}>
							<FilePlus className="size-4" aria-hidden="true" />
						</button>
						<button type="button" onClick={() => begin({ what: 'folder', of: null, text: '' })} aria-label="Nuova cartella" title="Nuova cartella" className={SMALL}>
							<FolderPlus className="size-4" aria-hidden="true" />
						</button>
						<button type="button" onClick={() => picker.current?.click()} aria-label="Aggiungi un’immagine" title="Aggiungi un’immagine dal dispositivo" className={SMALL}>
							<ImagePlus className="size-4" aria-hidden="true" />
						</button>
						<input
							ref={picker}
							type="file"
							accept={IMAGE_TYPES}
							className="hidden"
							onChange={async (event) => {
								const file = event.target.files?.[0];
								event.target.value = '';
								if (file) setError(await onUpload(file));
							}}
						/>
					</>
				)}
			</div>
			{naming?.of === null && field}
			{error && (
				<p role="alert" className="m-0 px-3 py-1 text-xs text-accent-fg">
					{error}
				</p>
			)}
			{/* the empty part of the list is the project itself: a file dropped there leaves its folder */}
			<ul className={cn('m-0 min-h-0 flex-1 list-none overflow-auto p-1', over === '' && 'bg-surface-3/60')} onDragOver={(event) => hover(event, '')} onDragLeave={() => setOver(null)} onDrop={(event) => drop(event, '')}>
				{rows('', 0).map((row) => {
					if ('path' in row) {
						const { path, depth } = row;
						if (naming?.what === 'file' && naming.of === path) return <li key={path}>{field}</li>;
						const Icon = ICON[kindOf(path) ?? 'text'] ?? FileCode;
						const chosen = path === active;
						return (
							<li
								key={path}
								draggable={editable}
								onDragStart={(event) => {
									dragged.current = path;
									event.dataTransfer.effectAllowed = 'move';
									event.dataTransfer.setData('text/plain', path);
								}}
								onDragEnd={() => {
									dragged.current = null;
									setOver(null);
								}}
								// over a file the place is the folder the file is in
								onDragOver={(event) => hover(event, parent(path))}
								onDrop={(event) => drop(event, parent(path))}
								className={cn('group/row flex items-center rounded-md', chosen ? 'bg-surface-3' : 'hover:bg-surface-3/60')}
							>
								<button type="button" onClick={() => onOpen(path)} aria-current={chosen ? 'true' : undefined} title={path} data-path={path} className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md py-1 pr-1 text-left font-mono text-[0.8125rem] focus-ring" style={indent(depth)}>
									<Icon className="size-3.5 shrink-0 text-fg-subtle" aria-hidden="true" />
									<span className={cn('truncate', chosen ? 'font-semibold text-fg-strong' : 'text-fg')}>{name(path)}</span>
									{path === target && <Play className="size-3 shrink-0 text-accent-fg" aria-label="è il file avviato" />}
								</button>
								{path !== target && targetOf(path, paths) === 'program' && asked !== path && (
									<button type="button" onClick={() => onAim(path)} aria-label={`Avvia da ${path}`} title="Fai partire il programma da questo file" className={cn(SMALL, HOVER)}>
										<Play className="size-3.5" aria-hidden="true" />
									</button>
								)}
								{editable &&
									(asked === path ? (
										<button type="button" onClick={() => onDelete(path)} onBlur={() => setAsked(null)} autoFocus className="mr-1 h-6 shrink-0 rounded-md bg-accent px-2 text-xs font-medium text-white focus-ring">
											Elimina
										</button>
									) : (
										<span className={cn('flex shrink-0', HOVER)}>
											<button type="button" onClick={() => begin({ what: 'file', of: path, text: path })} aria-label={`Rinomina ${path}`} title="Rinomina" className={SMALL}>
												<Pencil className="size-3.5" aria-hidden="true" />
											</button>
											<button type="button" onClick={() => setAsked(path)} aria-label={`Elimina ${path}`} title="Elimina" className={SMALL}>
												<Trash2 className="size-3.5" aria-hidden="true" />
											</button>
										</span>
									))}
							</li>
						);
					}
					const { folder, depth } = row;
					if (naming?.what === 'folder' && naming.of === folder) return <li key={`${folder}/`}>{field}</li>;
					const open = !closed.has(folder);
					/** A file is over it: the row is marked as the place it would go, and a closed folder is drawn open. */
					const taking = over === folder;
					const Chevron = open ? ChevronDown : ChevronRight;
					const Shape = taking || open ? FolderOpen : Folder;
					return (
						<li key={`${folder}/`} data-taking={taking ? '' : undefined} onDragOver={(event) => hover(event, folder)} onDrop={(event) => drop(event, folder)} className={cn('group/row flex items-center rounded-md', taking ? 'bg-surface-3' : 'hover:bg-surface-3/60')}>
							<button
								type="button"
								onClick={() => setClosed((now) => new Set(now.has(folder) ? [...now].filter((other) => other !== folder) : [...now, folder]))}
								aria-expanded={open}
								title={`${folder}/`}
								data-path={`${folder}/`}
								className="flex min-w-0 flex-1 items-center gap-1 rounded-md py-1 pr-1 text-left font-mono text-[0.8125rem] text-fg focus-ring"
								style={indent(depth)}
							>
								<Chevron className="size-3 shrink-0 text-fg-subtle" aria-hidden="true" />
								<Shape className="size-4 shrink-0 text-fg-subtle" aria-hidden="true" />
								<span className="ml-0.5 truncate">{name(folder)}</span>
							</button>
							{editable &&
								(asked === `${folder}/` ? (
									<button type="button" onClick={() => onDeleteFolder(folder)} onBlur={() => setAsked(null)} autoFocus className="mr-1 h-6 shrink-0 rounded-md bg-accent px-2 text-xs font-medium text-white focus-ring">
										Elimina tutto
									</button>
								) : (
									<span className={cn('flex shrink-0', HOVER)}>
										<button type="button" onClick={() => begin({ what: 'file', of: null, text: `${folder}/` })} aria-label={`Nuovo file in ${folder}`} title="Nuovo file in questa cartella" className={SMALL}>
											<FilePlus className="size-3.5" aria-hidden="true" />
										</button>
										<button type="button" onClick={() => begin({ what: 'folder', of: folder, text: folder })} aria-label={`Rinomina la cartella ${folder}`} title="Rinomina" className={SMALL}>
											<Pencil className="size-3.5" aria-hidden="true" />
										</button>
										<button type="button" onClick={() => setAsked(`${folder}/`)} aria-label={`Elimina la cartella ${folder}`} title="Elimina la cartella e quello che contiene" className={SMALL}>
											<Trash2 className="size-3.5" aria-hidden="true" />
										</button>
									</span>
								))}
						</li>
					);
				})}
			</ul>
		</nav>
	);
}

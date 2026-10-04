'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Braces, Check, FileCode, FilePlus, FileText, Image as ImageIcon, ImagePlus, Pencil, Play, Trash2, X } from 'lucide-react';
import { IMAGE_TYPES, kindOf, targetOf, type FileKind } from '@/lib/codice/progetto';
import { cn } from '@/lib/utils/cn';

const ICON: Partial<Record<FileKind, typeof FileCode>> = { image: ImageIcon, text: FileText, markdown: FileText, json: Braces };
const SMALL = 'flex size-7 shrink-0 items-center justify-center rounded-md text-fg-muted hover:bg-surface-3 hover:text-fg-strong focus-ring';

/**
 * The files of a project, as a list: folders first, each file under its folder. A click opens a file in the editor.
 * With `editable` a file can be made, renamed and deleted, and a picture added from the device; in a lesson the
 * files are the lesson's and the list only opens them. `onCreate`, `onRename` and `onUpload` answer with a sentence
 * when they cannot do it.
 */
export function Explorer({
	paths,
	active,
	target,
	editable,
	onOpen,
	onAim,
	onCreate,
	onRename,
	onDelete,
	onUpload
}: {
	/** In the order of the list (sortedPaths). */
	paths: string[];
	active: string;
	/** The file "Esegui" runs or shows. */
	target: string | null;
	editable: boolean;
	onOpen: (path: string) => void;
	/** Makes a program the one "Esegui" runs. */
	onAim: (path: string) => void;
	onCreate: (path: string) => string | null;
	onRename: (from: string, to: string) => string | null;
	onDelete: (path: string) => void;
	onUpload: (file: File) => Promise<string | null>;
}) {
	/** What is being typed: the name of a new file, or the new name of one. */
	const [naming, setNaming] = useState<{ of: string | null; text: string } | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [asked, setAsked] = useState<string | null>(null);
	const picker = useRef<HTMLInputElement>(null);

	const submit = (event: FormEvent) => {
		event.preventDefault();
		if (!naming) return;
		const name = naming.text.trim();
		const problem = naming.of === null ? onCreate(name) : name === naming.of ? null : onRename(naming.of, name);
		setError(problem);
		if (!problem) setNaming(null);
	};
	const cancel = () => {
		setNaming(null);
		setError(null);
	};
	const field = (
		<form onSubmit={submit} className="flex items-center gap-1 px-2 py-1">
			<input
				autoFocus
				value={naming?.text ?? ''}
				onChange={(e) => setNaming((now) => now && { ...now, text: e.target.value })}
				onKeyDown={(e) => e.key === 'Escape' && cancel()}
				aria-label={naming?.of === null ? 'Nome del nuovo file' : 'Nuovo nome del file'}
				placeholder="nome.py"
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

	/** The folders are not kept anywhere: each is shown once, above the first file inside it. */
	const seen = new Set<string>();
	const rows: { folder?: string; path?: string; depth: number }[] = [];
	for (const path of paths) {
		const parts = path.split('/');
		for (let i = 1; i < parts.length; i++) {
			const folder = parts.slice(0, i).join('/');
			if (!seen.has(folder)) {
				seen.add(folder);
				rows.push({ folder: parts[i - 1], depth: i - 1 });
			}
		}
		rows.push({ path, depth: parts.length - 1 });
	}

	return (
		<nav aria-label="File del progetto" className="flex h-full flex-col bg-surface-2">
			<div className="flex shrink-0 items-center gap-1 border-b border-edge px-2 py-1.5">
				<span className="label-mono flex-1 px-1 text-fg-subtle">File</span>
				{editable && (
					<>
						<button
							type="button"
							onClick={() => {
								setError(null);
								setNaming({ of: null, text: '' });
							}}
							aria-label="Nuovo file"
							title="Nuovo file"
							className={SMALL}
						>
							<FilePlus className="size-4" aria-hidden="true" />
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
			<ul className="m-0 min-h-0 flex-1 list-none overflow-auto p-1">
				{rows.map((row) =>
					row.folder !== undefined ? (
						<li key={`folder:${row.depth}:${row.folder}`} className="truncate px-2 py-1 font-mono text-[0.8125rem] text-fg-subtle" style={{ paddingLeft: `${0.5 + row.depth * 0.75}rem` }}>
							{row.folder}/
						</li>
					) : naming?.of === row.path ? (
						<li key={row.path}>{field}</li>
					) : (
						<FileRow key={row.path} path={row.path!} depth={row.depth} active={row.path === active} target={row.path === target} editable={editable} runnable={row.path !== target && targetOf(row.path!, paths) === 'program'} asked={asked === row.path} onOpen={onOpen} onAim={onAim} onRename={(path) => (setError(null), setNaming({ of: path, text: path }))} onAsk={setAsked} onDelete={onDelete} />
					)
				)}
			</ul>
		</nav>
	);
}

function FileRow({
	path,
	depth,
	active,
	target,
	editable,
	runnable,
	asked,
	onOpen,
	onAim,
	onRename,
	onAsk,
	onDelete
}: {
	path: string;
	depth: number;
	active: boolean;
	target: boolean;
	editable: boolean;
	/** A program that is not the one "Esegui" runs, and can be made it. */
	runnable: boolean;
	asked: boolean;
	onOpen: (path: string) => void;
	onAim: (path: string) => void;
	onRename: (path: string) => void;
	onAsk: (path: string | null) => void;
	onDelete: (path: string) => void;
}) {
	const name = path.split('/').pop()!;
	const Icon = ICON[kindOf(path) ?? 'text'] ?? FileCode;
	return (
		<li className={cn('group/file flex items-center rounded-md', active ? 'bg-surface-3' : 'hover:bg-surface-3/60')}>
			<button type="button" onClick={() => onOpen(path)} aria-current={active ? 'true' : undefined} title={path} className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md py-1 pr-1 text-left font-mono text-[0.8125rem] focus-ring" style={{ paddingLeft: `${0.5 + depth * 0.75}rem` }}>
				<Icon className="size-3.5 shrink-0 text-fg-subtle" aria-hidden="true" />
				<span className={cn('truncate', active ? 'font-semibold text-fg-strong' : 'text-fg')}>{name}</span>
				{target && <Play className="size-3 shrink-0 text-accent-fg" aria-label="è il file avviato" />}
			</button>
			{runnable && !asked && (
				<button type="button" onClick={() => onAim(path)} aria-label={`Avvia da ${path}`} title="Fai partire il programma da questo file" className={cn(SMALL, 'opacity-0 group-focus-within/file:opacity-100 group-hover/file:opacity-100 max-lg:opacity-100')}>
					<Play className="size-3.5" aria-hidden="true" />
				</button>
			)}
			{editable &&
				(asked ? (
					<button type="button" onClick={() => onDelete(path)} onBlur={() => onAsk(null)} autoFocus className="mr-1 h-6 shrink-0 rounded-md bg-accent px-2 text-xs font-medium text-white focus-ring">
						Elimina
					</button>
				) : (
					<span className="flex shrink-0 opacity-0 group-focus-within/file:opacity-100 group-hover/file:opacity-100 max-lg:opacity-100">
						<button type="button" onClick={() => onRename(path)} aria-label={`Rinomina ${path}`} title="Rinomina" className={SMALL}>
							<Pencil className="size-3.5" aria-hidden="true" />
						</button>
						<button type="button" onClick={() => onAsk(path)} aria-label={`Elimina ${path}`} title="Elimina" className={SMALL}>
							<Trash2 className="size-3.5" aria-hidden="true" />
						</button>
					</span>
				))}
		</li>
	);
}

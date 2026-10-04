'use client';

import dynamic from 'next/dynamic';
import { useCallback, useRef, useState, type ReactNode } from 'react';
import type { Check, Language, Test } from '@/lib/codice/blocco';
import { MAX_FILES, MAX_PROJECT_SIZE, isImage, kindOf, pathProblem, sortedPaths, targetOf, type ProjectFiles } from '@/lib/codice/progetto';
import { cn } from '@/lib/utils/cn';
import { Explorer } from './Explorer';
import { WebBench } from './WebBench';
import { Workbench } from './Workbench';

const Editor = dynamic(() => import('./Editor'), {
	ssr: false,
	loading: () => <p className="p-4 text-sm text-fg-subtle">Carico l&apos;editor…</p>
});

/** What a project gives to the bench that runs it (Workbench for a program, WebBench for a page). */
export interface ProjectSlots {
	/** `explorer`: the list of files at the left, the output under the code. `tabs`: a tab per file above the code. */
	layout: 'tabs' | 'explorer';
	/** The list of the files, to choose the one in the editor. */
	chooser: ReactNode;
	editor: ReactNode;
	/** The program "Esegui" runs, with the files around it; null when the project has none. */
	job: () => { language: Language; source: string; files: ProjectFiles } | null;
	/** The page "Esegui" shows. */
	page: () => { files: ProjectFiles; path: string } | null;
	/** A link in the preview leads to another page of the project. */
	navigate: (path: string) => void;
	/** Calls `changed` whenever a file changes; answers with the function that stops it. */
	listen: (changed: () => void) => () => void;
	/** The bench gives its "Esegui" here, for Ctrl+Enter in the editor and for the opening of another page. */
	register: (run: () => void) => void;
	edited: boolean;
	reset: () => void;
	/** Puts the solution in the files; missing when there is none, or it is there already. */
	solve?: () => void;
}

/** The longest side of a picture kept in a project: a photo from a phone is made this small before it is stored. */
const PICTURE = 1280;

/** A picture from the device as the data URL the project keeps, and the extension that goes with it. */
async function readPicture(file: File): Promise<{ data: string; extension: string } | null> {
	const dataUrl = (blob: Blob) =>
		new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(String(reader.result));
			reader.onerror = () => reject(reader.error);
			reader.readAsDataURL(blob);
		});
	try {
		if (file.type === 'image/svg+xml') return { data: await dataUrl(file), extension: 'svg' };
		if (file.type === 'image/gif') return { data: await dataUrl(file), extension: 'gif' };
		const bitmap = await createImageBitmap(file);
		const scale = Math.min(1, PICTURE / Math.max(bitmap.width, bitmap.height));
		const canvas = document.createElement('canvas');
		canvas.width = Math.round(bitmap.width * scale);
		canvas.height = Math.round(bitmap.height * scale);
		canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
		// a photo as JPEG, anything that may be transparent as PNG
		const photo = file.type === 'image/jpeg';
		return { data: canvas.toDataURL(photo ? 'image/jpeg' : 'image/png', 0.85), extension: photo ? 'jpg' : 'png' };
	} catch {
		return null;
	}
}

const weight = (files: ProjectFiles) => Object.values(files).reduce((sum, text) => sum + text.length, 0);

/**
 * More files under one name: a program with its modules, a site of pages that link each other. One file is in the
 * editor; "Esegui" runs the program, or shows the page, that was opened last (the one with the mark in the list),
 * with every other file there for it to import, open, include or link.
 *
 * `layout` is how the files are chosen: `explorer`, for the tool, is the list at the left with the output under the
 * code; `tabs`, for a lesson, is a tab per file above the code. With `editable` files can be made, renamed, deleted
 * and pictures added. A new `initial` needs a new `key`.
 */
export function ProjectBench({
	initial,
	open,
	layout,
	editable = false,
	tests,
	checks,
	solution,
	toolbar,
	compact = false,
	onEdit
}: {
	initial: ProjectFiles;
	/** The file in the editor at the start. */
	open: string;
	layout: 'tabs' | 'explorer';
	editable?: boolean;
	/** For a program: the lines it reads and what it must print. */
	tests?: Test[];
	/** For a page: what must be true of it. */
	checks?: Check[];
	solution?: ProjectFiles | null;
	toolbar?: ReactNode;
	compact?: boolean;
	onEdit?: (files: ProjectFiles) => void;
}) {
	/** The files in the order they are listed: sorted in the explorer, as the lesson wrote them in the tabs. */
	const listed = (of: ProjectFiles) => (layout === 'explorer' ? sortedPaths(of) : Object.keys(of));
	const first = open in initial ? open : listed(initial)[0];
	const firstTarget = targetOf(first, Object.keys(initial)) ? first : (listed(initial).find((path) => targetOf(path, Object.keys(initial))) ?? null);

	/** The files as they are now; the list is drawn from `paths`, which changes only when a file is made, renamed or deleted. */
	const files = useRef(initial);
	const [paths, setPaths] = useState(() => listed(initial));
	/** The file in the editor, with its text as it was when it was opened: the editor reads it once. */
	const [view, setView] = useState({ path: first, text: initial[first] ?? '', count: 0 });
	/** What "Esegui" runs or shows: the last program or page that was opened. */
	const [target, setTarget] = useState<string | null>(firstTarget);
	const targetNow = useRef(firstTarget);
	const [edited, setEdited] = useState(false);
	const [solved, setSolved] = useState(false);
	const listeners = useRef(new Set<() => void>());
	const actions = useRef<{ run?: () => void }>({});

	const changed = (next: ProjectFiles) => {
		files.current = next;
		setEdited(true);
		setSolved(false);
		onEdit?.(next);
		listeners.current.forEach((listener) => listener());
	};

	const show = (path: string) => {
		setView(({ count }) => ({ path, text: files.current[path] ?? '', count: count + 1 }));
		if (targetOf(path, Object.keys(files.current)) && path !== targetNow.current) {
			const page = targetOf(path, Object.keys(files.current)) === 'page';
			targetNow.current = path;
			setTarget(path);
			// another page is shown at once; another program waits for Esegui
			if (page) queueMicrotask(() => actions.current.run?.());
		}
	};

	/** Every file of `next` in the place of the ones there are: the starting files, or the solution. */
	const put = (next: ProjectFiles, isSolution: boolean) => {
		files.current = next;
		const path = view.path in next ? view.path : listed(next)[0];
		const run = targetNow.current && targetNow.current in next ? targetNow.current : (listed(next).find((p) => targetOf(p, Object.keys(next))) ?? null);
		targetNow.current = run;
		setTarget(run);
		setPaths(listed(next));
		setView(({ count }) => ({ path, text: next[path] ?? '', count: count + 1 }));
		setEdited(isSolution);
		setSolved(isSolution);
		onEdit?.(next);
		listeners.current.forEach((listener) => listener());
		if (run && targetOf(run, Object.keys(next)) === 'page') queueMicrotask(() => actions.current.run?.());
	};

	const create = (path: string): string | null => {
		const problem = pathProblem(path);
		if (problem) return problem;
		if (isImage(path)) return 'Un’immagine si aggiunge dal dispositivo, con il tasto accanto.';
		if (path in files.current) return 'C’è già un file con questo nome.';
		if (Object.keys(files.current).length >= MAX_FILES) return `Un progetto ha al più ${MAX_FILES} file.`;
		const next = { ...files.current, [path]: '' };
		changed(next);
		setPaths(listed(next));
		show(path);
		return null;
	};

	const rename = (from: string, to: string): string | null => {
		const problem = pathProblem(to);
		if (problem) return problem;
		if (to in files.current) return 'C’è già un file con questo nome.';
		if (isImage(from) !== isImage(to)) return 'Un’immagine resta un’immagine, e un file di testo un file di testo.';
		const next: ProjectFiles = {};
		for (const [path, text] of Object.entries(files.current)) next[path === from ? to : path] = text;
		changed(next);
		setPaths(listed(next));
		if (targetNow.current === from) {
			targetNow.current = targetOf(to, Object.keys(next)) ? to : null;
			setTarget(targetNow.current);
		}
		if (view.path === from) setView(({ count }) => ({ path: to, text: next[to], count: count + 1 }));
		return null;
	};

	const remove = (path: string) => {
		const next = { ...files.current };
		delete next[path];
		const rest = listed(next);
		if (rest.length === 0) return;
		changed(next);
		setPaths(rest);
		if (targetNow.current === path) {
			targetNow.current = rest.find((p) => targetOf(p, Object.keys(next))) ?? null;
			setTarget(targetNow.current);
		}
		if (view.path === path) setView(({ count }) => ({ path: rest[0], text: next[rest[0]], count: count + 1 }));
	};

	const upload = async (file: File): Promise<string | null> => {
		const picture = await readPicture(file);
		if (!picture) return 'Questa immagine non si può leggere.';
		const base =
			file.name
				.replace(/\.[^.]*$/, '')
				.replace(/[^A-Za-z0-9_-]+/g, '-')
				.replace(/^-+|-+$/g, '') || 'immagine';
		let path = `${base}.${picture.extension}`;
		for (let n = 2; path in files.current; n++) path = `${base}-${n}.${picture.extension}`;
		if (Object.keys(files.current).length >= MAX_FILES) return `Un progetto ha al più ${MAX_FILES} file.`;
		if (weight(files.current) + picture.data.length > MAX_PROJECT_SIZE) return 'Il progetto è troppo pesante per questa immagine: togline un’altra, o usane una più piccola.';
		const next = { ...files.current, [path]: picture.data };
		changed(next);
		setPaths(listed(next));
		show(path);
		return null;
	};

	const listen = useCallback((listener: () => void) => {
		listeners.current.add(listener);
		return () => void listeners.current.delete(listener);
	}, []);

	const register = useCallback((run: () => void) => {
		actions.current.run = run;
	}, []);

	const kind = kindOf(view.path);
	const explorer = layout === 'explorer';
	const slots: ProjectSlots = {
		layout,
		chooser: explorer ? (
			<Explorer paths={paths} active={view.path} target={target} editable={editable} onOpen={show} onCreate={create} onRename={rename} onDelete={remove} onUpload={upload} />
		) : (
			<div role="tablist" aria-label="File" className="flex shrink-0 gap-1 overflow-x-auto border-b border-edge bg-surface-2 px-2 pt-1.5">
				{paths.map((path) => (
					<button
						key={path}
						type="button"
						role="tab"
						aria-selected={view.path === path}
						onClick={() => show(path)}
						className={cn('shrink-0 rounded-t-lg border border-b-0 px-3 py-1.5 font-mono text-[0.8125rem] focus-ring', view.path === path ? 'border-edge bg-surface text-fg-strong' : 'border-transparent text-fg-muted hover:text-fg-strong')}
					>
						{path}
					</button>
				))}
			</div>
		),
		editor: (
			<div className={cn('min-h-0 overflow-auto', explorer ? 'h-full' : compact ? 'max-h-[26rem] border-b border-edge' : 'h-[20rem] border-b border-edge lg:h-[calc(32rem-2.4rem)] lg:border-b-0')}>
				{kind === 'image' ? (
					// eslint-disable-next-line @next/next/no-img-element -- a picture the student added, kept as a data URL
					<img src={view.text} alt={`L’immagine ${view.path}`} className="m-4 max-h-[calc(100%-2rem)] max-w-[calc(100%-2rem)] rounded-lg border border-edge bg-white object-contain" />
				) : (
					<Editor key={`${view.count}:${view.path}`} initial={view.text} language={kind ?? 'text'} label={view.path} minimap={explorer} onChange={(text) => changed({ ...files.current, [view.path]: text })} onRun={() => actions.current.run?.()} />
				)}
			</div>
		),
		job: () => {
			const path = targetNow.current;
			const language = path ? kindOf(path) : null;
			if (!path || (language !== 'python' && language !== 'c' && language !== 'cpp' && language !== 'javascript')) return null;
			return { language, source: files.current[path], files: files.current };
		},
		page: () => (targetNow.current ? { files: files.current, path: targetNow.current } : null),
		navigate: show,
		listen,
		register,
		edited,
		reset: () => put(initial, false),
		solve: solution && !solved ? () => put(solution, true) : undefined
	};

	const language = target ? kindOf(target) : null;
	return target && targetOf(target, paths) === 'page' ? (
		<WebBench project={slots} checks={checks} toolbar={toolbar} compact={compact} />
	) : (
		<Workbench project={slots} language={language === 'c' || language === 'cpp' || language === 'javascript' ? language : 'python'} initial="" tests={tests} toolbar={toolbar} compact={compact} />
	);
}

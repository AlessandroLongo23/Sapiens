'use client';

import dynamic from 'next/dynamic';
import { useCallback, useRef, useState, type DragEvent, type ReactNode } from 'react';
import { Columns2, Globe, Settings, X } from 'lucide-react';
import type { Check, Language, Test } from '@/lib/codice/blocco';
import { MAX_FILES, MAX_PROJECT_SIZE, isImage, kindOf, pathProblem, sortedPaths, targetOf, type ProjectFiles } from '@/lib/codice/progetto';
import { cn } from '@/lib/utils/cn';
import { Explorer } from './Explorer';
import { SettingsPanel } from './SettingsPanel';
import { SPLIT_MAX, SPLIT_MIN, DEFAULTS, saveSettings, useEditorSettings } from './settings';
import { Handle } from './Split';
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
	/** With `tabs`: the editor of the file chosen. */
	editor: ReactNode;
	/** With `explorer`: the files that are open, as tabs, each with its editor; `preview` is what the tab of the page shows. */
	area: (preview: ReactNode | null) => ReactNode;
	/** The output under the code: whether it is shown, the button's action, and what opens it when there is something to read. */
	output: { open: boolean; toggle: () => void; show: () => void };
	/** Opens the tab of the page, when "Esegui" is pressed and it was closed. */
	showPreview: () => void;
	/** With `explorer` the editor's settings are a tab among the files': whether it is open, and the gear's action. */
	settings: { open: boolean; toggle: () => void };
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

/** The tab of the page "Esegui" shows, among the tabs of the files. */
const PREVIEW = ':anteprima';
/** The tab of the editor's settings. */
const SETTINGS = ':impostazioni';
/** A tab that is not a file. */
const special = (tab: string | null) => tab !== null && tab.startsWith(':');
const NAMES: Record<string, string> = { [PREVIEW]: 'Anteprima', [SETTINGS]: 'Impostazioni' };

/** Files open side by side: each group has its tabs, and one of them in view. `text` is that file as it was when it came into view (the editor reads it once), `count` makes the editor anew. */
interface Group {
	tabs: string[];
	active: string | null;
	text: string;
	count: number;
}

const inView = (tabs: string[], active: string | null, files: ProjectFiles, count = 0): Group => ({ tabs, active, text: active && !special(active) ? (files[active] ?? '') : '', count });
/** A group left without tabs goes away, unless it is the only one. */
const tidy = (groups: Group[]) => (groups.length > 1 ? groups.filter((group) => group.tabs.length > 0) : groups);

/**
 * More files under one name: a program with its modules, a site of pages that link each other. "Esegui" runs one
 * program, or shows one page, with every other file there for it to import, open, include or link: the page that
 * was opened last, or the program chosen in the list (the one with the mark), which at the start is the first.
 *
 * `layout` is how the files are chosen. `explorer`, for the tool, is an editor of programs: the list of files at the
 * left; beside it the files that are open, as tabs that can be closed, put in another order and moved to a second
 * column; the page of a site is one more tab, beside the code or in its place; under the code the output, which a
 * button hides. `tabs`, for a lesson, is a tab per file above the code, with the output beside or below. With
 * `editable` files can be made, renamed, deleted and pictures added. A new `initial` needs a new `key`.
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
	const explorer = layout === 'explorer';
	/** The files in the order they are listed: sorted in the explorer, as the lesson wrote them in the tabs. */
	const listed = (of: ProjectFiles) => (explorer ? sortedPaths(of) : Object.keys(of));
	/** What "Esegui" does at the start, and the tabs that are open: in a lesson every file, in the tool the first, with the page beside it when there is one. */
	const starting = (of: ProjectFiles, path: string) => {
		const run = targetOf(path, Object.keys(of)) ? path : (listed(of).find((other) => targetOf(other, Object.keys(of))) ?? null);
		const page = run !== null && targetOf(run, Object.keys(of)) === 'page';
		const groups = !explorer ? [inView(listed(of), path, of)] : page ? [inView([path], path, of), inView([PREVIEW], PREVIEW, of)] : [inView([path], path, of)];
		return { run, page, groups };
	};
	const first = open in initial ? open : listed(initial)[0];

	/** The files as they are now; the list is drawn from `paths`, which changes only when a file is made, renamed or deleted. */
	const files = useRef(initial);
	const [paths, setPaths] = useState(() => listed(initial));
	const [groups, setGroups] = useState(() => starting(initial, first).groups);
	/** The group the keyboard was last in: a file opened from the list goes there. */
	const [focus, setFocus] = useState(0);
	/** What "Esegui" runs or shows: the last program or page that was opened. */
	const [target, setTarget] = useState(() => starting(initial, first).run);
	const targetNow = useRef(target);
	const [output, setOutput] = useState(() => !starting(initial, first).page);
	const [edited, setEdited] = useState(false);
	const [solved, setSolved] = useState(false);
	const listeners = useRef(new Set<() => void>());
	const actions = useRef<{ run?: () => void }>({});
	const dragged = useRef<{ group: number; tab: string } | null>(null);
	const area = useRef<HTMLDivElement>(null);
	const { split } = useEditorSettings();

	const changed = (next: ProjectFiles) => {
		files.current = next;
		setEdited(true);
		setSolved(false);
		onEdit?.(next);
		listeners.current.forEach((listener) => listener());
	};

	/** The tab of the page is there for a page and not for a program. */
	const withPreview = (now: Group[], wanted: boolean): Group[] => {
		const there = now.some((group) => group.tabs.includes(PREVIEW));
		if (!explorer || wanted === there) return now;
		if (!wanted) return tidy(now.map((group) => (group.tabs.includes(PREVIEW) ? inView(group.tabs.filter((tab) => tab !== PREVIEW), group.active === PREVIEW ? (group.tabs.find((tab) => tab !== PREVIEW) ?? null) : group.active, files.current, group.count + 1) : group)));
		return now.length === 1 ? [...now, inView([PREVIEW], PREVIEW, files.current)] : now.map((group, i) => (i === now.length - 1 ? inView([...group.tabs, PREVIEW], PREVIEW, files.current, group.count + 1) : group));
	};

	/** Makes `path` what "Esegui" does, when it is a program or a page. */
	const aim = (path: string | null) => {
		if (path === targetNow.current) return;
		const page = path !== null && targetOf(path, Object.keys(files.current)) === 'page';
		targetNow.current = path;
		setTarget(path);
		setGroups((now) => withPreview(now, page));
		// another page is shown at once; another program waits for Esegui
		if (page) queueMicrotask(() => actions.current.run?.());
	};

	/** Opens a file: in the group where it is a tab already, or in the one in use (not over the page beside the code). */
	const show = (path: string) => {
		const at = groups.findIndex((group) => group.tabs.includes(path));
		const used = Math.min(focus, groups.length - 1);
		const where = at >= 0 ? at : special(groups[used].active) && groups.length > 1 ? 1 - used : used;
		setGroups((now) => now.map((group, i) => (i === where ? inView(group.tabs.includes(path) ? group.tabs : [...group.tabs, path], path, files.current, group.count + 1) : group)));
		setFocus(where);
		// a page that is opened is the page shown; among programs the one to run is chosen in the list, since a module is a program too
		const keys = Object.keys(files.current);
		const kind = targetOf(path, keys);
		if (kind === 'page' || (kind === 'program' && (targetNow.current === null || targetOf(targetNow.current, keys) !== 'program'))) aim(path);
	};

	const close = (at: number, tab: string) => {
		setGroups((now) =>
			tidy(
				now.map((group, i) => {
					if (i !== at) return group;
					const tabs = group.tabs.filter((other) => other !== tab);
					const index = group.tabs.indexOf(tab);
					return group.active === tab ? inView(tabs, tabs[Math.min(index, tabs.length - 1)] ?? null, files.current, group.count + 1) : { ...group, tabs };
				})
			)
		);
		setFocus(0);
	};

	/** Moves a tab before `before` in a group, the one it is in or the other; a second group is made when `to` is past the last. */
	const move = (from: number, tab: string, to: number, before: string | null) => {
		setGroups((now) => {
			const next = now.map((group, i) => {
				if (i !== from) return group;
				const tabs = group.tabs.filter((other) => other !== tab);
				return from === to ? { ...group, tabs } : group.active === tab ? inView(tabs, tabs[0] ?? null, files.current, group.count + 1) : { ...group, tabs };
			});
			if (to >= next.length) next.push(inView([], null, files.current));
			const target = next[to];
			const tabs = target.tabs.filter((other) => other !== tab);
			const index = before && tabs.includes(before) ? tabs.indexOf(before) : tabs.length;
			tabs.splice(index, 0, tab);
			next[to] = from === to ? { ...target, tabs } : inView(tabs, tab, files.current, target.count + 1);
			return tidy(next);
		});
		setFocus(Math.min(to, 1));
	};

	/** Every file of `next` in the place of the ones there are: the starting files, or the solution. */
	const put = (next: ProjectFiles, isSolution: boolean) => {
		files.current = next;
		const now = groups[Math.min(focus, groups.length - 1)]?.active;
		const start = starting(next, now && !special(now) && now in next ? now : listed(next)[0]);
		targetNow.current = start.run;
		setTarget(start.run);
		setPaths(listed(next));
		setGroups(start.groups.map((group) => ({ ...group, count: group.count + groups[0].count + 1 })));
		setFocus(0);
		setEdited(isSolution);
		setSolved(isSolution);
		onEdit?.(next);
		listeners.current.forEach((listener) => listener());
		if (start.page) queueMicrotask(() => actions.current.run?.());
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
		setGroups((now) => now.map((group) => (group.tabs.includes(from) ? inView(group.tabs.map((tab) => (tab === from ? to : tab)), group.active === from ? to : group.active, next, group.count + 1) : group)));
		if (targetNow.current === from) aim(targetOf(to, Object.keys(next)) ? to : null);
		return null;
	};

	const remove = (path: string) => {
		const next = { ...files.current };
		delete next[path];
		const rest = listed(next);
		if (rest.length === 0) return;
		changed(next);
		setPaths(rest);
		setGroups((now) =>
			tidy(
				now.map((group) => {
					if (!group.tabs.includes(path)) return group;
					const tabs = group.tabs.filter((tab) => tab !== path);
					return inView(tabs, group.active === path ? (tabs[0] ?? null) : group.active, next, group.count + 1);
				})
			)
		);
		if (targetNow.current === path) aim(rest.find((other) => targetOf(other, rest)) ?? null);
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

	/** What a group shows: the page, a picture, or the editor of its file. */
	const content = (group: Group, at: number, preview: ReactNode | null) => {
		const path = group.active;
		if (path === null) return <p className="p-4 text-sm text-fg-subtle">Apri un file dall’elenco.</p>;
		if (path === SETTINGS) return <SettingsPanel className="h-full" />;
		if (path === PREVIEW) return preview ?? <p className="p-4 text-sm text-fg-subtle">Apri una pagina del progetto per vederla qui.</p>;
		const kind = kindOf(path);
		if (kind === 'image')
			// eslint-disable-next-line @next/next/no-img-element -- a picture the student added, kept as a data URL
			return <img src={group.text} alt={`L’immagine ${path}`} className="m-4 max-h-[calc(100%-2rem)] max-w-[calc(100%-2rem)] rounded-lg border border-edge bg-white object-contain" />;
		return <Editor key={`${group.count}:${path}`} initial={group.text} language={kind ?? 'text'} label={path} minimap={explorer} onChange={(text) => changed({ ...files.current, [path]: text })} onRun={() => actions.current.run?.()} onFocus={() => setFocus(at)} />;
	};

	const drop = (event: DragEvent, to: number, before: string | null) => {
		event.preventDefault();
		event.stopPropagation();
		const tab = dragged.current;
		dragged.current = null;
		if (tab && !(tab.group === to && tab.tab === before)) move(tab.group, tab.tab, to, before);
	};

	/** The tabs of a group of the explorer: closed, dragged to another place or to the other group, moved beside. */
	const bar = (group: Group, at: number) => (
		<div role="tablist" aria-label={groups.length > 1 ? `File aperti, colonna ${at + 1}` : 'File aperti'} onDragOver={(event) => event.preventDefault()} onDrop={(event) => drop(event, at, null)} className="flex shrink-0 items-stretch overflow-x-auto border-b border-edge bg-surface-2">
			{group.tabs.map((tab) => {
				const name = NAMES[tab] ?? tab.split('/').pop();
				const chosen = group.active === tab;
				return (
					<div
						key={tab}
						draggable
						onDragStart={(event) => {
							dragged.current = { group: at, tab };
							event.dataTransfer.effectAllowed = 'move';
							event.dataTransfer.setData('text/plain', name ?? '');
						}}
						onDragOver={(event) => event.preventDefault()}
						onDrop={(event) => drop(event, at, tab)}
						className={cn('group/tab flex shrink-0 items-center border-r border-edge', chosen ? 'bg-surface' : 'hover:bg-surface-3/60')}
					>
						<button
							type="button"
							role="tab"
							aria-selected={chosen}
							title={tab === PREVIEW ? 'La pagina del progetto, come in un browser' : tab === SETTINGS ? 'Le impostazioni dell’editor' : tab}
							onClick={() => {
								setGroups((now) => now.map((other, i) => (i === at ? inView(other.tabs, tab, files.current, other.count + 1) : other)));
								setFocus(at);
							}}
							className={cn('flex items-center gap-1.5 py-1.5 pr-1 pl-3 font-mono text-[0.8125rem] focus-ring', chosen ? 'text-fg-strong' : 'text-fg-muted')}
						>
							{tab === PREVIEW && <Globe className="size-3.5" aria-hidden="true" />}
							{tab === SETTINGS && <Settings className="size-3.5" aria-hidden="true" />}
							{name}
						</button>
						<button type="button" onClick={() => close(at, tab)} aria-label={`Chiudi ${name}`} title="Chiudi" className={cn('mr-1 flex size-5 items-center justify-center rounded text-fg-muted hover:bg-surface-3 hover:text-fg-strong focus-ring', !chosen && 'opacity-0 group-hover/tab:opacity-100 focus-visible:opacity-100')}>
							<X className="size-3" aria-hidden="true" />
						</button>
					</div>
				);
			})}
			{group.active && group.tabs.length > 1 && (
				<button type="button" onClick={() => move(at, group.active!, groups.length > 1 ? 1 - at : 1, null)} aria-label="Sposta la scheda nell’altra colonna" title="Sposta la scheda nell’altra colonna" className="ml-auto flex w-8 shrink-0 items-center justify-center text-fg-muted hover:bg-surface-3 hover:text-fg-strong focus-ring max-lg:hidden">
					<Columns2 className="size-3.5" aria-hidden="true" />
				</button>
			)}
		</div>
	);

	const single = groups[0];
	const slots: ProjectSlots = {
		layout,
		chooser: explorer ? (
			<Explorer paths={paths} active={groups[Math.min(focus, groups.length - 1)]?.active ?? ''} target={target} editable={editable} onOpen={show} onAim={aim} onCreate={create} onRename={rename} onDelete={remove} onUpload={upload} />
		) : (
			<div role="tablist" aria-label="File" className="flex shrink-0 gap-1 overflow-x-auto border-b border-edge bg-surface-2 px-2 pt-1.5">
				{paths.map((path) => (
					<button
						key={path}
						type="button"
						role="tab"
						aria-selected={single.active === path}
						onClick={() => show(path)}
						className={cn('shrink-0 rounded-t-lg border border-b-0 px-3 py-1.5 font-mono text-[0.8125rem] focus-ring', single.active === path ? 'border-edge bg-surface text-fg-strong' : 'border-transparent text-fg-muted hover:text-fg-strong')}
					>
						{path}
					</button>
				))}
			</div>
		),
		editor: <div className={cn('min-h-0 overflow-auto border-b border-edge', compact ? 'max-h-[26rem]' : 'h-[20rem] lg:h-[calc(32rem-2.4rem)] lg:border-b-0')}>{content(single, 0, null)}</div>,
		area: (preview) => (
			<div ref={area} className="flex h-full min-h-0 flex-col lg:flex-row" style={{ '--split': `${split * 100}%` } as React.CSSProperties}>
				{groups.map((group, at) => (
					<div key={at} className={cn('flex min-h-0 min-w-0 flex-col max-lg:h-[20rem] max-lg:border-b max-lg:border-edge', groups.length > 1 && at === 0 ? 'lg:w-[var(--split)] lg:shrink-0' : 'flex-1')} onPointerDown={() => setFocus(at)}>
						{bar(group, at)}
						<div className="min-h-0 flex-1 overflow-auto">{content(group, at, preview)}</div>
					</div>
				)).flatMap((column, at) => (at === 0 && groups.length > 1 ? [column, <Handle key="handle" box={area} upright value={split} min={SPLIT_MIN} max={SPLIT_MAX} label="Larghezza della prima colonna" onChange={(share) => saveSettings({ split: share })} onReset={() => saveSettings({ split: DEFAULTS.split })} />] : [column]))}
			</div>
		),
		output: { open: output, toggle: () => setOutput((now) => !now), show: () => setOutput(true) },
		showPreview: () => setGroups((now) => withPreview(now, true)),
		settings: {
			open: groups.some((group) => group.tabs.includes(SETTINGS)),
			// beside the code, so a change is seen as it is made: in the second column, which is made if there is none
			toggle: () =>
				setGroups((now) => {
					const at = now.findIndex((group) => group.tabs.includes(SETTINGS));
					if (at >= 0) return tidy(now.map((group, i) => (i === at ? inView(group.tabs.filter((tab) => tab !== SETTINGS), group.active === SETTINGS ? (group.tabs.find((tab) => tab !== SETTINGS) ?? null) : group.active, files.current, group.count + 1) : group)));
					return now.length === 1 ? [...now, inView([SETTINGS], SETTINGS, files.current)] : now.map((group, i) => (i === now.length - 1 ? inView([...group.tabs, SETTINGS], SETTINGS, files.current, group.count + 1) : group));
				})
		},
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

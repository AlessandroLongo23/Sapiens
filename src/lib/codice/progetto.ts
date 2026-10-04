/**
 * A project of the code editor: more files under one name, with a list to move among them (components/codice/
 * ProjectBench.tsx). A program with a module, a C++ program in more files, a site of pages that link each other.
 * Pure: the server reads a saved project with the same rules the browser writes it with.
 *
 * A file is a path and a text. The path may have folders (`css/style.css`). A folder with nothing in it yet is kept
 * as a path that ends with a slash and has no text (`img/`): everything that runs a project passes over it. A
 * picture is kept as the data URL of its bytes, so a project is one object of text whatever is in it.
 */

export type ProjectFiles = Record<string, string>;

/** What a file is, by its extension: how it is coloured, and what "Esegui" does with it. */
export type FileKind = 'python' | 'c' | 'cpp' | 'header' | 'javascript' | 'html' | 'css' | 'markdown' | 'json' | 'text' | 'image';

const KINDS: Record<string, FileKind> = {
	py: 'python',
	c: 'c',
	cpp: 'cpp',
	h: 'header',
	hpp: 'header',
	js: 'javascript',
	html: 'html',
	css: 'css',
	md: 'markdown',
	json: 'json',
	txt: 'text',
	csv: 'text',
	png: 'image',
	jpg: 'image',
	jpeg: 'image',
	gif: 'image',
	webp: 'image',
	svg: 'image'
};

/** The extensions a file may have, as the student reads them. */
export const TEXT_EXTENSIONS = ['py', 'c', 'cpp', 'h', 'js', 'html', 'css', 'md', 'json', 'txt', 'csv'];
export const IMAGE_TYPES = 'image/png,image/jpeg,image/gif,image/webp,image/svg+xml';

export const MAX_FILES = 40;
/** The most the files of a project weigh together, in characters, pictures included (a picture weighs a third more than its bytes). */
export const MAX_PROJECT_SIZE = 1_500_000;
const MAX_PATH = 80;
const MAX_DEPTH = 4;

/** The mark of a folder kept for itself: `img/`. */
export const isFolder = (path: string) => path.endsWith('/');

export const extensionOf = (path: string) => /\.([a-z0-9]+)$/i.exec(path)?.[1].toLowerCase() ?? '';
export const kindOf = (path: string): FileKind | null => KINDS[extensionOf(path)] ?? null;
export const isImage = (path: string) => kindOf(path) === 'image';

/** Why a path cannot be a folder's (written without the slash at its end), as a sentence; null when it can. */
export function folderProblem(path: string): string | null {
	if (!path) return 'Scrivi un nome.';
	if (path.length > MAX_PATH) return `Il nome è troppo lungo: al più ${MAX_PATH} caratteri.`;
	const parts = path.split('/');
	if (parts.length > MAX_DEPTH - 1) return 'Troppe cartelle una dentro l’altra.';
	if (parts.some((part) => !/^[A-Za-z0-9_][A-Za-z0-9_-]*$/.test(part))) return 'Nel nome di una cartella vanno solo lettere, cifre e trattini.';
	return null;
}

/** Why a path cannot be a file's, as a sentence; null when it can. */
export function pathProblem(path: string): string | null {
	if (!path) return 'Scrivi un nome.';
	if (path.length > MAX_PATH) return `Il nome è troppo lungo: al più ${MAX_PATH} caratteri.`;
	const parts = path.split('/');
	if (parts.length > MAX_DEPTH) return 'Troppe cartelle una dentro l’altra.';
	if (parts.some((part) => !/^[A-Za-z0-9_][A-Za-z0-9_.-]*$/.test(part))) return 'Nel nome vanno solo lettere, cifre, trattini, punti e la barra per le cartelle.';
	if (!kindOf(path)) return `L’estensione deve essere una di queste: ${TEXT_EXTENSIONS.join(', ')}, oppure un’immagine.`;
	return null;
}

/** The files of a project read from what a request or a row carries: valid paths, all text, not too many nor too heavy. */
export function readProject(value: unknown): ProjectFiles | null {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
	const entries = Object.entries(value as Record<string, unknown>);
	if (entries.length === 0 || entries.length > MAX_FILES) return null;
	const files: ProjectFiles = {};
	let size = 0;
	for (const [path, text] of entries) {
		if (isFolder(path)) {
			if (text !== '' || folderProblem(path.slice(0, -1))) return null;
			files[path] = '';
			continue;
		}
		if (typeof text !== 'string' || pathProblem(path)) return null;
		if (isImage(path) && !/^data:image\/(png|jpeg|gif|webp|svg\+xml);base64,[A-Za-z0-9+/=]*$/.test(text)) return null;
		size += text.length;
		files[path] = text;
	}
	// folders alone are not a project
	if (Object.keys(files).every(isFolder)) return null;
	return size <= MAX_PROJECT_SIZE ? files : null;
}

/** The paths of a project in the order of its list: folders first, then names. */
export const sortedPaths = (files: ProjectFiles) =>
	Object.keys(files)
		.filter((path) => !isFolder(path))
		.sort((a, b) => {
		const [x, y] = [a.split('/'), b.split('/')];
		for (let i = 0; i < Math.min(x.length, y.length); i++) {
			const [last, other] = [i === x.length - 1, i === y.length - 1];
			if (last !== other) return last ? 1 : -1;
			if (x[i] !== y[i]) return x[i].localeCompare(y[i]);
		}
		return x.length - y.length;
	});

/** A path written in a file, from the folder of that file: `../img/a.png` in `pagine/chi.html` is `img/a.png`. Null when it leaves the project or is not a path of it (a web address, an anchor). */
export function resolvePath(from: string, written: string): string | null {
	const clean = written.split(/[?#]/)[0];
	if (!clean || /^[a-z][a-z0-9+.-]*:|^\/\//i.test(clean)) return null;
	const parts = clean.startsWith('/') ? [] : from.split('/').slice(0, -1);
	for (const part of clean.split('/')) {
		if (part === '' || part === '.') continue;
		if (part === '..') {
			if (parts.length === 0) return null;
			parts.pop();
		} else parts.push(part);
	}
	return parts.join('/');
}

/** What "Esegui" runs: a program in a language, or a page shown in the preview. Null for a file that is only read by others. */
export function targetOf(path: string, paths: string[]): 'program' | 'page' | null {
	const kind = kindOf(path);
	if (kind === 'python' || kind === 'c' || kind === 'cpp') return 'program';
	if (kind === 'html' || kind === 'markdown') return 'page';
	// a script is a program of its own only where there is no page for it to be the script of
	if (kind === 'javascript') return paths.some((other) => kindOf(other) === 'html') ? null : 'program';
	return null;
}

import { kindOf, resolvePath, type ProjectFiles } from '@/lib/codice/progetto';

/**
 * A page of a project made into the one document the preview shows. A real page takes its styles, its scripts and
 * its pictures from other files, by their path: `<link rel="stylesheet" href="style.css">`, `<script
 * src="script.js"></script>`, `<img src="img/foto.png">`. Here every such path that is a file of the project is
 * given the file: a style sheet is written in the page, a script and a picture get an address the preview can load.
 * A path that is no file of the project is said in a note, and so is a style sheet or a script nobody links:
 * forgetting the tag is the mistake a beginner makes.
 */

/** The name of the function every loop of a page's script calls (loop-guard.ts puts the calls, pagina.ts has the function). */
export const GUARD = '__ciclo';

const LINK = /<link\b[^>]*>/gi;
const SOURCE = /(<(script|img|source|video|audio)\b[^>]*?\bsrc\s*=\s*)(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
const HREF = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i;
const CSS_URL = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)\s]+))\s*\)/gi;

/** A style sheet with the pictures it names given their data. */
const styled = (files: ProjectFiles, path: string) =>
	files[path].replace(CSS_URL, (all, a?: string, b?: string, c?: string) => {
		const target = resolvePath(path, a ?? b ?? c ?? '');
		return target && kindOf(target) === 'image' && files[target] ? `url("${files[target]}")` : all;
	});

/**
 * `path` is the page shown and `html` its text (the file's own, or what a Markdown file was turned into); `address`
 * gives the address a script of the project is loaded from in the preview.
 */
export function assemble(files: ProjectFiles, path: string, html: string, address: (script: string) => string): { html: string; notes: string[] } {
	const notes: string[] = [];
	const linked = new Set<string>();
	const missing = (written: string) => {
		// a web address is not ours to find
		if (resolvePath(path, written) !== null) notes.push(`${written} non esiste nel progetto: controlla il nome e la cartella.`);
	};

	let out = html.replace(LINK, (tag) => {
		const match = HREF.exec(tag);
		const written = match?.[1] ?? match?.[2] ?? match?.[3] ?? '';
		if (!/\brel\s*=\s*["']?stylesheet/i.test(tag) || !written) return tag;
		const target = resolvePath(path, written);
		if (target && kindOf(target) === 'css' && target in files) {
			linked.add(target);
			return `<style>${styled(files, target).replace(/<\/style/gi, '<\\/style')}</style>`;
		}
		missing(written);
		return tag;
	});

	out = out.replace(SOURCE, (all, before: string, tag: string, a?: string, b?: string, c?: string) => {
		const written = a ?? b ?? c ?? '';
		const target = resolvePath(path, written);
		if (target && target in files) {
			const kind = kindOf(target);
			if (tag.toLowerCase() === 'script' && kind === 'javascript') {
				linked.add(target);
				return `${before}"${address(target)}"`;
			}
			if (kind === 'image') return `${before}"${files[target]}"`;
		}
		if (written) missing(written);
		return all;
	});

	// a style sheet or a script the page does not link does nothing, as in a real site
	if (kindOf(path) === 'html') {
		const pages = Object.keys(files).filter((file) => kindOf(file) === 'html').length;
		for (const file of Object.keys(files)) {
			const kind = kindOf(file);
			if (linked.has(file) || !files[file].trim() || (kind !== 'css' && kind !== 'javascript')) continue;
			// with more pages a file may be another page's: said only when this page links none of its kind
			if (pages > 1 && [...linked].some((other) => kindOf(other) === kind)) continue;
			const from = resolvePath(path, '.') ?? '';
			const written = from && file.startsWith(`${from}/`) ? file.slice(from.length + 1) : `${'../'.repeat(from ? from.split('/').length : 0)}${file}`;
			notes.push(
				kind === 'css'
					? `${file} non è collegato alla pagina: nella head di ${path} serve <link rel="stylesheet" href="${written}">.`
					: `${file} non è collegato alla pagina: prima di </body> in ${path} serve <script src="${written}"></script>.`
			);
		}
	}
	return { html: out, notes };
}

/** Whether the project runs code in its pages: then the preview waits for "Esegui" and does not follow every key. */
export const hasScript = (files: ProjectFiles) =>
	Object.entries(files).some(([path, text]) => (kindOf(path) === 'javascript' && text.trim() !== '') || (kindOf(path) === 'html' && /<script\b|\son[a-z]+\s*=/i.test(text)));

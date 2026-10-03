import type { Page } from '@/lib/codice/blocco';

/**
 * The three files of a page made into the one document the preview shows. A real page takes its style and its
 * script through `<link rel="stylesheet" href="style.css">` and `<script src="script.js"></script>`: here the two
 * tags are found and given the files' text. A file that has something in it and is not linked is left out, as a
 * browser would, and a note says so: forgetting the tag is the mistake a beginner makes.
 */

/** The name of the function every loop of a page's script calls (loop-guard.ts puts the calls, pagina.ts has the function). */
export const GUARD = '__ciclo';

export const FILE_NAMES: Record<keyof Page, string> = { html: 'index.html', css: 'style.css', js: 'script.js' };

const LINK = /<link\b[^>]*\bhref\s*=\s*(["']?)(?:\.\/)?style\.css\1[^>]*>/i;
const SCRIPT = /<script\b[^>]*\bsrc\s*=\s*(["']?)(?:\.\/)?script\.js\1[^>]*>/i;

/** `script` is the address the page's script is served from (a blob of the preview's own). */
export function assemble(page: Page, script: string): { html: string; notes: string[] } {
	const notes: string[] = [];
	let html = page.html;
	if (LINK.test(html)) html = html.replace(LINK, () => `<style>${page.css.replace(/<\/style/gi, '<\\/style')}</style>`);
	else if (page.css.trim()) notes.push('style.css non è collegato alla pagina: nella head di index.html serve <link rel="stylesheet" href="style.css">.');
	if (SCRIPT.test(html)) html = html.replace(SCRIPT, (tag) => tag.replace(/(\bsrc\s*=\s*)(["']?)(?:\.\/)?script\.js\2/i, () => `src="${script}"`));
	else if (page.js.trim()) notes.push('script.js non è collegato alla pagina: prima di </body> in index.html serve <script src="script.js"></script>.');
	return { html, notes };
}

/** Whether the page runs code: then the preview waits for "Esegui" and does not follow every key. */
export const hasScript = (page: Page) => page.js.trim() !== '' || /<script\b|\son[a-z]+\s*=/i.test(page.html);

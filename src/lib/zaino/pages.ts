/**
 * Pages of a note. A note is one markdown document; a page break is a line of
 * its own, `<!-- pagina -->`, between blank lines. An HTML comment because it
 * is invisible to any markdown renderer that meets it, and readable in the
 * Advanced editor, where the student sees and can type it.
 *
 * Pure and TipTap-free: the store, the header and the server import it.
 */
import { MAX_PAGES, MAX_STICKERS, type PlacedSticker } from './stickers';

export { MAX_PAGES };
export const PAGE_BREAK = '<!-- pagina -->';

const BREAK_LINE = /^[ \t]*<!--[ \t]*pagina[ \t]*-->[ \t]*$/;

/** The note's pages, each without the blank lines around it. A note with no break is one page. */
export function splitPages(markdown: string): string[] {
	const pages: string[] = [];
	let current: string[] = [];
	let fenced = false;
	for (const line of markdown.replace(/\r\n?/g, '\n').split('\n')) {
		if (/^[ \t]*```/.test(line)) fenced = !fenced;
		if (!fenced && BREAK_LINE.test(line)) {
			pages.push(current.join('\n'));
			current = [];
			continue;
		}
		current.push(line);
	}
	pages.push(current.join('\n'));
	return pages.map((p) => p.replace(/^\n+/, '').replace(/\s+$/, ''));
}

/** The document for a list of pages, in the same shape `tidy` gives a single page. */
export function joinPages(pages: string[]): string {
	return pages.map((p) => p.replace(/^\n+/, '').replace(/\s+$/, '')).join(`\n\n${PAGE_BREAK}\n\n`) + '\n';
}

export const pageCount = (markdown: string) => splitPages(markdown).length;

export type PageOp =
	| { kind: 'add'; at: number }
	| { kind: 'duplicate'; index: number }
	| { kind: 'delete'; index: number }
	| { kind: 'move'; from: number; to: number }
	/** A deleted page put back, with its stickers (the undo of a deletion). */
	| { kind: 'insert'; at: number; text: string; stickers: PlacedSticker[] };

const newId = () => crypto.randomUUID();

/**
 * Where every page comes from after an operation on `n` pages: the index it
 * had before, or null for a page that did not exist. `focus` is the page to
 * show afterwards. Null when the operation cannot apply.
 */
export function planPageOp(n: number, op: PageOp): { order: (number | null)[]; focus: number } | null {
	let order: (number | null)[] = Array.from({ length: n }, (_, i) => i);
	switch (op.kind) {
		case 'add':
		case 'insert':
			if (n >= MAX_PAGES || op.at < 0 || op.at > n) return null;
			order.splice(op.at, 0, null);
			return { order, focus: op.at };
		case 'duplicate':
			if (n >= MAX_PAGES || op.index < 0 || op.index >= n) return null;
			order.splice(op.index + 1, 0, op.index);
			return { order, focus: op.index + 1 };
		case 'delete':
			if (n <= 1 || op.index < 0 || op.index >= n) return null;
			order = order.filter((i) => i !== op.index);
			return { order, focus: Math.min(op.index, n - 2) };
		case 'move': {
			if (op.from === op.to || op.from < 0 || op.from >= n || op.to < 0 || op.to >= n) return null;
			const [page] = order.splice(op.from, 1);
			order.splice(op.to, 0, page);
			return { order, focus: op.to };
		}
	}
}

/**
 * A page operation on the text and on the stickers together: a sticker
 * belongs to its page and goes where the page goes. Used where the document
 * is plain markdown (the Advanced editor); the Simple editor keeps its pages
 * mounted and applies the same plan to them.
 */
export function applyPageOp(pages: string[], stickers: PlacedSticker[], op: PageOp): { pages: string[]; stickers: PlacedSticker[]; focus: number } | null {
	const plan = planPageOp(pages.length, op);
	if (!plan) return null;
	const { order, focus } = plan;
	const nextPages = order.map((i) => (i === null ? (op.kind === 'insert' ? op.text : '') : pages[i]));
	const nextStickers: PlacedSticker[] = [];
	const seen = new Set<number>();
	// A duplicated or restored page brings its stickers while the note has room for them.
	let room = MAX_STICKERS - stickers.length;
	order.forEach((from, to) => {
		if (from === null) {
			if (op.kind === 'insert') for (const s of op.stickers) if (room-- > 0) nextStickers.push({ ...s, page: to });
			return;
		}
		const copy = seen.has(from);
		seen.add(from);
		for (const s of stickers) {
			if ((s.page ?? 0) !== from) continue;
			if (!copy) nextStickers.push({ ...s, page: to });
			else if (room-- > 0) nextStickers.push({ ...s, id: newId(), page: to });
		}
	});
	return { pages: nextPages, stickers: nextStickers, focus };
}

/** Words in a note, for the menu. Formulas count as one word each, markup as none. */
export function countWords(markdown: string): number {
	const text = markdown
		.replace(/^[ \t]*<!--[ \t]*pagina[ \t]*-->[ \t]*$/gm, ' ')
		.replace(/\$\$[\s\S]*?\$\$/g, ' formula ')
		.replace(/\$[^$\n]+\$/g, ' formula ')
		.replace(/[#>*_`~[\]()|-]/g, ' ');
	return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

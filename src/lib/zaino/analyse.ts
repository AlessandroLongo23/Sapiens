/**
 * Markdown constructs the Simple editor cannot model, and how to find them.
 *
 * This file must never import TipTap: the note header and the store read it,
 * and an import from here would pull ProseMirror into the shell bundle. That
 * is also why it matches the constructs itself instead of reusing the node in
 * ./raw-block — which imports FROZEN from here, and not the other way round.
 */

export type FrozenKind = 'table' | 'footnote' | 'html';

export interface FrozenMatcher {
	kind: FrozenKind;
	/** Singular and plural, for the banner. */
	label: [string, string];
	/** Where the construct could start, for marked's tokenizer. */
	start: RegExp;
	/** The whole construct, anchored at the start of what is left. */
	match: RegExp;
}

export const FROZEN: FrozenMatcher[] = [
	{
		kind: 'table',
		label: ['tabella', 'tabelle'],
		// Two or more pipe rows where the second is a delimiter: a GFM table.
		start: /^ {0,3}\|/m,
		match: /^ {0,3}\|.*\n {0,3}\|?[ \t:|-]*-[ \t:|-]*\n(?: {0,3}\|.*(?:\n|$))*/
	},
	{
		kind: 'footnote',
		label: ['nota a piè di pagina', 'note a piè di pagina'],
		start: /^\[\^/m,
		match: /^\[\^[^\]\n]+\]:.*(?:\n[ \t]+.*)*(?:\n|$)/
	},
	{
		kind: 'html',
		label: ['blocco HTML', 'blocchi HTML'],
		start: /^ {0,3}</m,
		match: /^ {0,3}<[\s\S]*?(?:\n[ \t]*\n|$)/
	}
];

/** The earliest place any frozen construct could begin, or -1. */
export function frozenStart(src: string): number {
	let best = -1;
	for (const { start } of FROZEN) {
		const at = src.search(start);
		if (at >= 0 && (best === -1 || at < best)) best = at;
	}
	return best;
}

/** The frozen construct at the head of `src`, if there is one. */
export function frozenAt(src: string): { kind: FrozenKind; raw: string } | null {
	for (const { kind, match } of FROZEN) {
		const m = match.exec(src);
		if (m && m[0].trim()) return { kind, raw: m[0] };
	}
	return null;
}

/**
 * What a document holds that Simple mode would only be able to show, not edit.
 * Fenced code is skipped: a table drawn inside a ``` block is code, not a table.
 */
export function frozenBlocks(markdown: string): { kind: FrozenKind; count: number }[] {
	const counts = new Map<FrozenKind, number>();
	// Fenced blocks are blanked out, keeping the offsets so `start` still lines up.
	const scanned = markdown.replace(/^```[\s\S]*?^```/gm, (block) => block.replace(/[^\n]/g, ' '));

	let rest = scanned;
	let guard = 0;
	while (rest && guard++ < 5000) {
		const at = frozenStart(rest);
		if (at < 0) break;
		rest = rest.slice(at);
		const hit = frozenAt(rest);
		if (hit) {
			counts.set(hit.kind, (counts.get(hit.kind) ?? 0) + 1);
			rest = rest.slice(hit.raw.length);
		} else {
			// The line only looked like one: step past it and keep going.
			const nl = rest.indexOf('\n');
			if (nl < 0) break;
			rest = rest.slice(nl + 1);
		}
	}
	return [...counts].map(([kind, count]) => ({ kind, count }));
}

/** "1 tabella e 2 blocchi HTML", for the banner. */
export function describeFrozen(blocks: { kind: FrozenKind; count: number }[]): string {
	const parts = blocks.map(({ kind, count }) => {
		const [one, many] = FROZEN.find((f) => f.kind === kind)!.label;
		return `${count} ${count === 1 ? one : many}`;
	});
	if (parts.length <= 1) return parts[0] ?? '';
	return `${parts.slice(0, -1).join(', ')} e ${parts[parts.length - 1]}`;
}

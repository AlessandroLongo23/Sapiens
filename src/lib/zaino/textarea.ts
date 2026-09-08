/**
 * Markdown niceties for the Advanced editor, as pure functions over the value
 * and the selection, so they can be reasoned about (and tested) without a DOM.
 * Each returns the whole new value and where the caret should end up, or null
 * when the key should do whatever the browser does with it.
 */

export interface Edit {
	text: string;
	start: number;
	end: number;
}

const lineStart = (text: string, at: number) => text.lastIndexOf('\n', at - 1) + 1;
const lineEnd = (text: string, at: number) => {
	const i = text.indexOf('\n', at);
	return i === -1 ? text.length : i;
};

/** The list or quote marker a line opens with, if any. */
const MARKER = /^(\s*)(?:([-*+])\s+(\[[ xX]\]\s+)?|(\d+)\.\s+|(>)\s?)/;

/**
 * Enter inside a list or quote repeats the marker, renumbering an ordered
 * list; Enter on a marker with nothing after it clears the marker instead,
 * which is how every editor ends a list.
 */
export function continueList(text: string, start: number, end: number): Edit | null {
	if (start !== end) return null;
	const from = lineStart(text, start);
	const line = text.slice(from, start);
	const m = MARKER.exec(line);
	if (!m) return null;

	const [marker] = m;
	// Nothing but the marker on the line: clear it and stay put.
	if (line.trim() === marker.trim()) {
		const cleared = text.slice(0, from) + text.slice(start);
		return { text: cleared, start: from, end: from };
	}

	const indent = m[1] ?? '';
	const next = m[4] ? `${indent}${Number(m[4]) + 1}. ` : m[5] ? `${indent}> ` : `${indent}${m[2]}${m[3] ? ' [ ]' : ''} `;
	const inserted = `\n${next}`;
	return { text: text.slice(0, start) + inserted + text.slice(start), start: start + inserted.length, end: start + inserted.length };
}

/** Every line the selection touches, as [from, to) offsets. */
function selectedLines(text: string, start: number, end: number): [number, number] {
	return [lineStart(text, start), lineEnd(text, end)];
}

/**
 * Tab indents. It only acts inside a list or on a multi-line selection:
 * anywhere else Tab must move the focus, or the textarea becomes a keyboard
 * trap with no way out.
 */
export function indent(text: string, start: number, end: number, outdent = false): Edit | null {
	const multiline = text.slice(start, end).includes('\n');
	const inList = MARKER.test(text.slice(lineStart(text, start), lineEnd(text, start)));
	if (!multiline && !inList) return null;

	const [from, to] = selectedLines(text, start, end);
	const lines = text.slice(from, to).split('\n');
	let firstDelta = 0;
	let total = 0;
	const shifted = lines.map((line, i) => {
		if (outdent) {
			const removed = /^( {1,2}|\t)/.exec(line)?.[0].length ?? 0;
			if (i === 0) firstDelta = -removed;
			total -= removed;
			return line.slice(removed);
		}
		if (i === 0) firstDelta = 2;
		total += 2;
		return `  ${line}`;
	});
	return {
		text: text.slice(0, from) + shifted.join('\n') + text.slice(to),
		start: Math.max(from, start + firstDelta),
		end: Math.max(from, end + total)
	};
}

/** Wraps the selection in a pair (`**`, `*`, `` ` ``, `$`), or unwraps it when it is already wrapped. */
export function toggleWrap(text: string, start: number, end: number, pair: string): Edit {
	const selected = text.slice(start, end);
	const before = text.slice(start - pair.length, start);
	const after = text.slice(end, end + pair.length);
	if (before === pair && after === pair) {
		const from = start - pair.length;
		return { text: text.slice(0, from) + selected + text.slice(end + pair.length), start: from, end: from + selected.length };
	}
	if (selected.startsWith(pair) && selected.endsWith(pair) && selected.length > pair.length * 2) {
		const inner = selected.slice(pair.length, -pair.length);
		return { text: text.slice(0, start) + inner + text.slice(end), start, end: start + inner.length };
	}
	const wrapped = pair + selected + pair;
	return {
		text: text.slice(0, start) + wrapped + text.slice(end),
		start: start + pair.length,
		end: start + pair.length + selected.length
	};
}

/** Adds a line prefix (`## `, `- `, `1. `, `> `) to every selected line, or strips it when all of them already have it. */
export function toggleLinePrefix(text: string, start: number, end: number, prefix: string): Edit {
	const [from, to] = selectedLines(text, start, end);
	const lines = text.slice(from, to).split('\n');
	// An ordered list renumbers, so match the shape and not the literal "1. ".
	const numbered = /^\d+\.\s$/.test(prefix);
	const marker = prefix.trim();
	// The whitespace after the marker is required, or "##" would match "### x"
	// and switching a heading's level would strip one hash instead of replacing it.
	// A quote is the exception: ">testo" is a quote in markdown.
	const escaped = marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const found = numbered ? /^(\s*)\d+\.\s/ : new RegExp(`^(\\s*)${escaped}\\s${marker === '>' ? '?' : ''}`);
	const strip = lines.every((line) => !line.trim() || found.test(line));

	const next = lines.map((line, i) => {
		if (!line.trim()) return line;
		if (strip) return line.replace(found, '$1');
		const indentation = /^\s*/.exec(line)?.[0] ?? '';
		const body = line.slice(indentation.length).replace(/^(#{1,6}\s|[-*+]\s|\d+\.\s|>\s?)/, '');
		return indentation + (numbered ? `${i + 1}. ` : prefix) + body;
	});
	const replaced = next.join('\n');
	return { text: text.slice(0, from) + replaced + text.slice(to), start: from, end: from + replaced.length };
}

/**
 * Applies an edit to a live textarea through execCommand. It is deprecated and
 * it is still the only way to change a textarea without wiping the browser's
 * native undo stack — which on a phone is the only undo a student has.
 * Only the span that actually changed is replaced, so undo stays granular and
 * a long note is not rewritten to add two spaces.
 */
export function applyEdit(el: HTMLTextAreaElement, edit: Edit): void {
	const before = el.value;
	const { text } = edit;
	let from = 0;
	while (from < before.length && from < text.length && before[from] === text[from]) from++;
	let tail = 0;
	while (tail < before.length - from && tail < text.length - from && before[before.length - 1 - tail] === text[text.length - 1 - tail]) tail++;

	el.focus();
	if (before !== text) {
		el.setSelectionRange(from, before.length - tail);
		const ok = document.execCommand('insertText', false, text.slice(from, text.length - tail));
		if (!ok) {
			el.value = text;
			el.dispatchEvent(new Event('input', { bubbles: true }));
		}
	}
	el.setSelectionRange(edit.start, edit.end);
}

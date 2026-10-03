'use client';

import type { MathfieldElement } from 'mathlive';
import { cn } from '@/lib/utils/cn';

/**
 * Proposals while a formula is typed: the letters before the cursor are looked up in a list of words, the words
 * that begin with them are shown under the cursor, and the one chosen takes the letters' place. The list of words
 * is the page's (the plotter's is lib/grafico/comandi.ts); here is what is common to any list.
 *
 * A field with proposals has no word shortcuts of MathLive's own: a word has one owner. With both, "tan" would
 * become the tangent function before "tangente" could be typed.
 */

/** A word of the list, as the proposals show it. */
export interface Proposal {
	id: string;
	title: string;
	/** How it is written, one line for each way. */
	uses: string[];
	about: string;
	/** What choosing it writes, in MathLive's notation: #? is a hole. */
	insert: string;
}

/** Letters before the cursor that give way to a formula. */
export interface Replacement {
	/** How many letters before the cursor are replaced. */
	letters: number;
	insert: string;
	/** Whether the key that asked for it has done its work, and MathLive is not to have it. */
	swallow?: boolean;
}

export interface Completer {
	/** The proposals for the letters before the cursor, and how many of those letters are the word. */
	propose: (run: string) => { letters: number; items: Proposal[] } | null;
	/** What the letters become by themselves once a letter has been typed. */
	typed: (run: string) => Replacement | null;
	/** What they become when another key follows: a character, or 'leave' when the cursor leaves the field. */
	key: (run: string, key: string) => Replacement | null;
}

/** The proposals on screen. */
export interface ProposalList {
	items: Proposal[];
	/** The one the arrows have reached: none until an arrow is pressed, so that Enter keeps its meaning. */
	active: number;
	/** The cursor's place in the window, in pixels. */
	at: { left: number; top: number; bottom: number };
}

/** The letters just before the cursor, read one position at a time: each is a letter of its own in MathLive. */
function runBefore(mf: MathfieldElement): string {
	const pos = mf.position;
	let k = 0;
	while (k < pos && k < 24 && /^[a-zA-Z]$/.test(mf.getValue(pos - k - 1, pos - k, 'latex'))) k++;
	return mf.getValue(pos - k, pos, 'latex');
}

/**
 * Gives a field its proposals. `show` is told the list to draw, or null; `changed` that the field's text was
 * rewritten. Returns `leave`, to call when the student has finished with the field (a word left whole is settled),
 * `pick`, for a proposal chosen with the pointer, and `detach`.
 */
export function attachCompletion(mf: MathfieldElement, completer: Completer, show: (list: ProposalList | null) => void, changed: () => void) {
	// only the shortcuts that are signs stay (<= for ≤): the words are the list's
	mf.inlineShortcuts = Object.fromEntries(Object.entries(mf.inlineShortcuts).filter(([word]) => !/[a-zA-Z]/.test(word)));

	let list: ProposalList | null = null;
	let letters = 0;
	/** What was before the cursor at the last look: a letter more than this is a letter typed. */
	let seen = { run: '', value: mf.value };
	/** The letters the student closed the proposals on, with Esc: they stay closed until the letters change. */
	let dismissed: string | null = null;
	/** After a word has written its own brackets, an opening bracket typed out of habit is not a second one. */
	let justOpened = false;
	/**
	 * A whole word before the cursor that the next key may settle. A key of a real keyboard is heard before MathLive
	 * has it; one of the keyboard on screen is not heard at all, and the word is settled once its sign is written.
	 */
	let pending: { at: number; word: string; insert: string } | null = null;

	const set = (next: ProposalList | null) => {
		list = next;
		show(next);
	};
	const replace = (r: Replacement) => {
		const pos = mf.position;
		mf.selection = { ranges: [[pos - r.letters, pos]] };
		mf.insert(r.insert, { insertionMode: 'replaceSelection', selectionMode: r.insert.includes('#?') ? 'placeholder' : 'after', focus: false });
		justOpened = /\\left\($/.test(r.insert.split('#?')[0]);
		seen = { run: runBefore(mf), value: mf.value };
		pending = null;
		set(null);
		changed();
	};

	const place = () => {
		const box = mf.getElementInfo(mf.position)?.bounds ?? mf.getBoundingClientRect();
		return { left: box.left, top: box.top, bottom: box.bottom };
	};

	const look = () => {
		if (!mf.hasFocus()) return set(null);
		// one sign written right after a whole word, by a key that was not heard: "sin" and then a bracket
		if (pending && (mf.position < pending.at || mf.getValue(pending.at - pending.word.length, pending.at, 'latex') !== pending.word)) pending = null;
		if (pending && mf.position === pending.at + 1 && !/^[a-zA-Z]$/.test(mf.getValue(pending.at, pending.at + 1, 'latex'))) {
			const { at, word, insert } = pending;
			const cursor = mf.position;
			mf.selection = { ranges: [[at - word.length, at]] };
			mf.insert(insert, { insertionMode: 'replaceSelection', selectionMode: 'after', focus: false });
			// the word was as many places as its letters, and is now one
			mf.position = cursor - word.length + 1;
			seen = { run: runBefore(mf), value: mf.value };
			pending = null;
			changed();
		}
		const run = runBefore(mf);
		const typed = mf.value !== seen.value && run.length === seen.run.length + 1 && run.startsWith(seen.run);
		if (mf.value !== seen.value) justOpened = justOpened && run === seen.run;
		seen = { run, value: mf.value };
		// kept while the cursor is elsewhere after it: the keyboard on screen writes a bracket in more than one step
		const whole = completer.key(run, 'leave');
		if (whole && !whole.insert.includes('#?')) pending = { at: mf.position, word: run.slice(run.length - whole.letters), insert: whole.insert };
		if (typed) {
			const settled = completer.typed(run);
			if (settled) return replace(settled);
		}
		if (run !== dismissed) dismissed = null;
		const found = dismissed === null ? completer.propose(run) : null;
		if (!found?.items.length) return set(null);
		letters = found.letters;
		// the arrows' place is kept while the same proposals are on screen
		const same = list && list.items.length === found.items.length && list.items.every((item, i) => item.id === found.items[i].id);
		set({ items: found.items, active: same ? list!.active : -1, at: place() });
	};

	const pick = (i: number) => {
		const item = list?.items[i];
		if (item) replace({ letters, insert: item.insert });
	};

	const onKey = (e: KeyboardEvent) => {
		const take = () => {
			e.preventDefault();
			e.stopImmediatePropagation();
		};
		if (list) {
			const n = list.items.length;
			if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
				take();
				const step = e.key === 'ArrowDown' ? 1 : -1;
				set({ ...list, active: list.active < 0 ? (step > 0 ? 0 : n - 1) : (list.active + step + n) % n });
				return;
			}
			if (e.key === 'Tab' || (e.key === 'Enter' && list.active >= 0)) {
				take();
				pick(Math.max(list.active, 0));
				return;
			}
			if (e.key === 'Escape') {
				take();
				dismissed = seen.run;
				set(null);
				return;
			}
		}
		if (e.key.length !== 1 || e.metaKey || e.ctrlKey || e.altKey || /[a-zA-Z]/.test(e.key)) return;
		if (justOpened && e.key === '(') {
			justOpened = false;
			take();
			return;
		}
		const settled = completer.key(runBefore(mf), e.key);
		if (!settled) return;
		replace(settled);
		justOpened = false;
		if (settled.swallow) take();
	};

	const close = () => set(null);
	const events = ['input', 'keyup', 'selection-change', 'focusin'] as const;
	events.forEach((name) => mf.addEventListener(name, look));
	mf.addEventListener('keydown', onKey, { capture: true });
	mf.addEventListener('focusout', close);
	window.addEventListener('scroll', close, { capture: true, passive: true });
	window.addEventListener('resize', close);

	return {
		pick,
		leave: () => {
			const settled = completer.key(runBefore(mf), 'leave');
			if (settled) replace(settled);
			else set(null);
		},
		detach: () => {
			events.forEach((name) => mf.removeEventListener(name, look));
			mf.removeEventListener('keydown', onKey, { capture: true });
			mf.removeEventListener('focusout', close);
			window.removeEventListener('scroll', close, { capture: true });
			window.removeEventListener('resize', close);
		}
	};
}

const WIDTH = 288;
/** The room the list wants under the cursor before it goes above it. */
const ROOM = 220;

/** The proposals, under the cursor of the field or above it where the keyboard leaves no room below. */
export function Proposals({ list, onPick }: { list: ProposalList; onPick: (i: number) => void }) {
	const keyboard = window.mathVirtualKeyboard?.visible ? window.mathVirtualKeyboard.boundingRect.height : 0;
	const height = (window.visualViewport?.height ?? window.innerHeight) - keyboard;
	const above = height - list.at.bottom < ROOM && list.at.top > height - list.at.bottom;
	const left = Math.max(8, Math.min(list.at.left, window.innerWidth - WIDTH - 8));
	// the guide is of the proposal the arrows have reached, or of the only one
	const shown = list.active >= 0 ? list.active : list.items.length === 1 ? 0 : -1;
	return (
		<ul
			role="listbox"
			aria-label="Proposte"
			className="fixed z-50 m-0 flex max-h-72 list-none flex-col overflow-y-auto rounded-xl border border-edge-strong bg-surface p-1 shadow-paper"
			style={{ left, width: WIDTH, ...(above ? { bottom: window.innerHeight - list.at.top + 6 } : { top: list.at.bottom + 6 }) }}
		>
			{list.items.map((item, i) => (
				<li
					key={item.id}
					role="option"
					aria-selected={i === list.active}
					// pressed, not clicked: the field keeps the focus
					onPointerDown={(e) => {
						e.preventDefault();
						onPick(i);
					}}
					className={cn('cursor-pointer rounded-lg px-2.5 py-1.5', i === list.active ? 'bg-surface-3' : 'hover:bg-surface-2')}
				>
					<div className="flex items-baseline justify-between gap-3">
						<span className="text-sm font-medium text-fg-strong">{item.title}</span>
						<span className="shrink-0 font-mono text-xs text-fg-muted">{item.uses[0]}</span>
					</div>
					{i === shown && (
						<p className="m-0 mt-0.5 text-xs text-fg-muted">
							{item.uses.length > 1 && <span className="mb-0.5 block font-mono">{item.uses.slice(1).join(' · ')}</span>}
							{item.about}
						</p>
					)}
				</li>
			))}
			<li aria-hidden="true" className="px-2.5 pt-1 pb-0.5 text-[11px] text-fg-faint pointer-coarse:hidden">
				Tab sceglie la prima · frecce e Invio · Esc chiude
			</li>
		</ul>
	);
}

import { onDevice } from './pad';

/*
 * The lab notebook. It is not an object on the bench: B brings it up wherever the student is, the mouse becomes a
 * cursor again, and its pages can be turned and written in (components/lab/quaderno draws it, as a page over the
 * scene). This file is what it holds, with no drawing: the pages an experiment gives it, what the student has
 * written in their fields, and what the experiment says of each value.
 *
 * Pages are A5 (560 by 792 px at full size), shown two at a time. What is written is plain data (`toJSON`), so it can
 * be saved as a lab report.
 *
 * To write, both hands must be free; with something in a hand it opens to be read only (free.ts decides).
 */

export type NotebookTask = { text: string; state: 'done' | 'now' | 'todo' | 'bad' };

/** The steps' spread, as the experiment writes it: the step in hand, or at the end the results. */
export type NotebookPage = {
	/** A pencil line above the title (where the work is up to). */
	kicker?: string;
	title: string;
	intro: string;
	tasks: NotebookTask[];
	/** Pencil note at the bottom of the right page: how to do the current step. */
	hint: string;
	/** Written when the work is done. */
	done: string | null;
	/** The right page's heading ('Procedimento' if not given). */
	steps?: string;
	/** The tasks done are not struck through: what they say is still needed (the colours seen so far). */
	keep?: boolean;
	/** Results, as a table under the intro. */
	rows?: [string, string][];
	/** Every step of the experiment, for the index on the left page. */
	outline?: { title: string; state: 'done' | 'now' | 'todo' }[];
};

/** A blank the student fills in. */
export type FieldDef = {
	id: string;
	kind: 'number' | 'text' | 'choice';
	/** Written after a number. */
	unit?: string;
	/** A number's step for the wheel and the controller, and how many decimals it is shown with. */
	step?: number;
	decimals?: number;
	/** What a choice offers; `color` (CSS) draws a swatch beside the word. */
	options?: { value: string; label: string; color?: string }[];
	placeholder?: string;
	/** Its width, in characters. */
	width?: number;
	/** The field an empty number starts from when it is stepped (a final reading from the initial one). */
	seed?: string;
};

export type Block =
	| { type: 'text'; text: string }
	| { type: 'heading'; text: string }
	/** A table: a cell is a printed word or a blank. */
	| { type: 'table'; head: string[]; rows: (string | FieldDef)[][] }
	/** Blanks one under the other, each with what it asks. */
	| { type: 'fields'; items: { label: string; field: FieldDef }[] }
	/** A scale of colours to compare with what is seen. */
	| { type: 'swatches'; title: string; items: { label: string; color: string; note?: string }[] }
	/** The burette's scale at the meniscus, live (the titration). */
	| { type: 'burette' }
	/** Ruled lines to write on freely. */
	| { type: 'lines'; id: string; rows: number; placeholder?: string };

/** Something on the bench, in the notebook's first pages. */
export type KitItem = {
	name: string;
	/** Its photo (public/lab/strumenti). */
	image: string;
	formula?: string;
	text: string;
};

export type BookPage =
	| { kind: 'kit'; title: string; items: KitItem[] }
	/** The spread the experiment writes as it goes: every step on the left, the one in hand on the right. */
	| { kind: 'steps' }
	| { kind: 'form'; id: string; tab: string; title: string; blocks: Block[] }
	| { kind: 'free'; id: string; title: string };

/** What the experiment says of a value: right, or wrong with a word of help; null for a field it does not judge. */
export type Verdict = { ok: boolean; hint?: string } | null;
export type Mark = 'ok' | 'wrong';

export type NotebookSnapshot = { open: boolean; readOnly: boolean; version: number };

export class Notebook {
	private isOpen = false;
	/** Opened with something in a hand: it can be read, not written in. */
	readOnly = false;
	/** Called when it comes up or goes away, by the student or by the work (at the end, with the results). */
	onToggle: (open: boolean) => void = () => {};
	steps: NotebookPage | null = null;
	pages: BookPage[] = [{ kind: 'steps' }];
	/** What the student has written, by field. */
	readonly values: Record<string, string> = {};
	readonly marks: Record<string, Mark> = {};
	/** The fields the experiment has taken: written in ink, not changed again. */
	readonly inked = new Set<string>();
	/** The last word of help, shown at the foot of the page. */
	hint = '';
	/** The field being written in, not judged yet; and the spread the student was last on. */
	private pending: string | null = null;
	lastSpread: number | null = null;
	/** Where to open: a page's id ('steps', a form's, a free page's), and the field to put the cursor in. */
	goto: { page: string; field?: string } | null = null;
	/** What the experiment says of a value written in a field. */
	verify: (id: string, value: string) => Verdict = () => null;
	/** Whether a field can be written in now, or why not. */
	blocked: (id: string) => string = () => '';
	/** Live values a page draws from the bench (the burette's level, or why it cannot be read). */
	live: { burette?: () => { level: number } | { why: string }; warn?: () => string } = {};
	private listeners = new Set<() => void>();
	private snap: NotebookSnapshot = { open: false, readOnly: false, version: 0 };

	constructor() {
		// the hints name the inputs: redrawn when the student moves from the keyboard to a controller, or back
		onDevice(() => this.emit());
	}

	subscribe = (fn: () => void) => {
		this.listeners.add(fn);
		return () => this.listeners.delete(fn);
	};

	getSnapshot = () => this.snap;

	private emit() {
		this.snap = { open: this.isOpen, readOnly: this.readOnly, version: this.snap.version + 1 };
		for (const fn of this.listeners) fn();
	}

	get open() {
		return this.isOpen;
	}

	set open(v: boolean) {
		if (v === this.isOpen) return;
		// what was being typed is not lost with the page: it is judged as if the cursor had left the field
		if (!v) this.settle();
		this.isOpen = v;
		this.hint = '';
		if (!v) this.readOnly = false;
		this.emit();
		this.onToggle(v);
	}

	/** Opens it at a page, with the cursor in a field; `readOnly` when a hand is not free (free.ts, openBook). */
	show(page: string, field?: string, readOnly = false) {
		this.goto = { page, field };
		this.readOnly = readOnly;
		if (this.isOpen) this.emit();
		else this.open = true;
	}

	/** B, Esc or the cross: it goes away. */
	close = () => {
		this.open = false;
	};

	/** Where it was asked to open, once: the page drawn takes it. */
	take() {
		const g = this.goto;
		this.goto = null;
		return g;
	}

	/** The experiment's pages: after the steps come what it adds, and two blank pages at the end. */
	setPages(pages: BookPage[]) {
		this.pages = pages;
		this.emit();
	}

	/** The steps' spread, rewritten by the experiment as the work moves on. */
	draw(p: NotebookPage) {
		this.steps = p;
		this.emit();
	}

	/** While the student types: kept, not judged yet. */
	type(id: string, value: string) {
		if (this.inked.has(id) || this.readOnly) return;
		this.values[id] = value;
		delete this.marks[id];
		this.pending = id;
		this.hint = '';
		this.emit();
	}

	/** Judges the field last typed in, if it has not been yet (the page is turned, the notebook closed). */
	settle() {
		if (this.pending) this.commit(this.pending);
	}

	/** The student has finished a field (Enter, or the cursor elsewhere): the experiment has its say. */
	commit(id: string) {
		if (this.pending === id) this.pending = null;
		if (this.inked.has(id) || this.readOnly) return;
		const value = (this.values[id] ?? '').trim();
		if (!value) {
			delete this.marks[id];
			return this.emit();
		}
		const why = this.blocked(id);
		if (why) {
			this.hint = why;
			delete this.values[id];
			return this.emit();
		}
		const v = this.verify(id, value);
		if (v) {
			this.marks[id] = v.ok ? 'ok' : 'wrong';
			if (v.ok) this.inked.add(id);
			this.hint = v.hint ?? '';
		}
		this.emit();
	}

	/** The experiment takes a value back (a reading that no longer holds). */
	clear(id: string) {
		delete this.values[id];
		delete this.marks[id];
		this.inked.delete(id);
		this.emit();
	}

	/** A value the experiment has taken as right, as a number (a comma or a point for the decimals). */
	number(id: string): number | null {
		if (this.marks[id] !== 'ok') return null;
		return parseNumber(this.values[id]);
	}

	/** What the student has written, to be saved as a lab report. */
	toJSON() {
		return { values: { ...this.values }, marks: { ...this.marks } };
	}

	/** Kept for the experiments' frame loop: the page over the scene moves by itself. */
	update(_dt: number) {}
}

/** A number as a student writes it: "12,35", "12.35", "0,0522 mol/L". */
export function parseNumber(text: string | undefined): number | null {
	if (!text) return null;
	const m = /-?(?:\d+(?:[.,]\d+)?|[.,]\d+)/.exec(text.replace(/\s/g, ''));
	if (!m) return null;
	const n = Number(m[0].replace(',', '.').replace(/^(-?)\./, '$10.'));
	return Number.isFinite(n) ? n : null;
}

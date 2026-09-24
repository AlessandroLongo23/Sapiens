import { create } from 'zustand';

/** Writing with formatting, writing the markdown, or reading without any editing chrome. */
export type EditorMode = 'simple' | 'advanced' | 'reading';
export type SaveStatusValue = 'clean' | 'dirty' | 'saving' | 'saved' | 'error' | 'conflict';

/** The saved row the editor lost to, when a second tab wrote first. */
export interface ConflictRow {
	content: string;
	title: string;
	version: number;
}

interface NoteEditorState {
	noteId: string;
	mode: EditorMode;
	status: SaveStatusValue;
	/** Server row version: what the next save claims to be updating. */
	version: number;
	savedAt: number | null;
	error: string;
	conflict: ConflictRow | null;
	/**
	 * The markdown as last serialized. Rewritten only by a real edit, never by
	 * mounting: the WYSIWYG serializer normalises escapes on every pass, so a
	 * note that was merely opened must never be written back.
	 */
	markdown: string;
	title: string;
	/** Registered by whichever engine is mounted, called only when a save runs. */
	getMarkdown: (() => string) | null;

	reset: (noteId: string, markdown: string, title: string, version: number) => void;
	setMode: (mode: EditorMode) => void;
	setTitle: (title: string) => void;
	/** An actual edit: the only thing that may set `dirty`. */
	edited: (markdown: string) => void;
	register: (getMarkdown: (() => string) | null) => void;
	setStatus: (status: SaveStatusValue, error?: string) => void;
	/**
	 * A save landed. Only the version comes back: the text on screen is the
	 * authority, always. `settled` is false when the student typed while the
	 * request was in flight, which keeps the note dirty so the rest is picked up.
	 */
	saved: (version: number, settled: boolean) => void;
	setConflict: (conflict: ConflictRow | null) => void;
}

/**
 * Shared state of the note editor. It lives here rather than in the page
 * because four sibling subtrees read it — the header's save indicator, the
 * mode switch, whichever editor is mounted, and the phone toolbar, which is
 * `fixed` and therefore outside the editor's own DOM subtree.
 *
 * It deliberately does not hold live keystrokes: TipTap owns its document and
 * the textarea owns its value, and `getMarkdown` is called only when a save
 * runs or the mode changes. Serializing on every keystroke would run the whole
 * markdown round trip several times a second.
 */
export const useNoteEditor = create<NoteEditorState>((set) => ({
	noteId: '',
	mode: 'simple',
	status: 'clean',
	version: 1,
	savedAt: null,
	error: '',
	conflict: null,
	markdown: '',
	title: '',
	getMarkdown: null,

	reset: (noteId, markdown, title, version) =>
		set({ noteId, markdown, title, version, status: 'clean', savedAt: null, error: '', conflict: null }),
	setMode: (mode) => set({ mode }),
	setTitle: (title) => set({ title, status: 'dirty' }),
	edited: (markdown) => set({ markdown, status: 'dirty' }),
	register: (getMarkdown) => set({ getMarkdown }),
	setStatus: (status, error = '') => set({ status, error }),
	saved: (version, settled) => set({ version, status: settled ? 'saved' : 'dirty', savedAt: Date.now(), error: '' }),
	setConflict: (conflict) => set({ conflict, status: conflict ? 'conflict' : 'dirty' })
}));

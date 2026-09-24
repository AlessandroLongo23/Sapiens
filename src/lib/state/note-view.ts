import { create } from 'zustand';

/** Where the floating toolbar sits: centred on the bottom edge, or on a side, standing up. */
export type ToolbarDock = 'bottom' | 'left' | 'right';

/** Zoom steps, as a fraction of the sheet's real size. */
export const ZOOM_STEPS = [0.5, 0.67, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2] as const;

interface NoteViewState {
	dock: ToolbarDock;
	/** The toolbar is folded into a pill. */
	collapsed: boolean;
	/** The page thumbnails are open, right of the sheet. */
	pagesOpen: boolean;
	/** The outline of the titles is open, left of the sheet. */
	outlineOpen: boolean;
	/** The title being read, as its page and its place on the page. */
	heading: { page: number; index: number } | null;
	/**
	 * A request to bring a title into view (index −1: the top of the page),
	 * used once by the view on screen. `instant` for putting the reader back
	 * after a change of mode; `n` makes a repeat request a new one.
	 */
	headingJump: { page: number; index: number; n: number; instant: boolean } | null;
	/** 'fit' follows the window; a number is a zoom the student picked. */
	zoom: 'fit' | number;
	/** What 'fit' works out to right now, measured by the editor. */
	fit: number;
	/** The page most in view, from 0. */
	page: number;
	/** A request to bring a page into view; `n` makes a repeat request a new one. */
	jump: { page: number; n: number } | null;
	setDock: (dock: ToolbarDock) => void;
	setCollapsed: (collapsed: boolean) => void;
	setPagesOpen: (pagesOpen: boolean) => void;
	setOutlineOpen: (outlineOpen: boolean) => void;
	setHeading: (heading: { page: number; index: number } | null) => void;
	jumpToHeading: (page: number, index: number, instant?: boolean) => void;
	clearHeadingJump: () => void;
	setZoom: (zoom: 'fit' | number) => void;
	setFit: (fit: number) => void;
	setPage: (page: number) => void;
	jumpTo: (page: number) => void;
}

const DOCK_KEY = 'zaino:toolbar';
const PAGES_KEY = 'zaino:pages';
const ZOOM_KEY = 'zaino:zoom';
const OUTLINE_KEY = 'zaino:outline';

const remember = (key: string, value: string) => {
	try {
		window.localStorage.setItem(key, value);
	} catch {
		// Site data blocked: the choice lasts until the page is closed.
	}
};

/**
 * How the note editor is laid out on this device: the toolbar's place, the
 * thumbnails, the outline, the zoom and the page and title in view. Apart from the note's own state
 * (./note-editor) because none of it is saved with the note; the toolbar's
 * place, the panels and the zoom are remembered in this browser only.
 */
export const useNoteView = create<NoteViewState>((set) => ({
	dock: 'bottom',
	collapsed: false,
	pagesOpen: false,
	outlineOpen: false,
	heading: null,
	headingJump: null,
	zoom: 'fit',
	fit: 1,
	page: 0,
	jump: null,
	setDock: (dock) => {
		set({ dock, collapsed: false });
		remember(DOCK_KEY, dock);
	},
	setCollapsed: (collapsed) => {
		set({ collapsed });
		remember(`${DOCK_KEY}:collapsed`, collapsed ? '1' : '0');
	},
	setPagesOpen: (pagesOpen) => {
		set({ pagesOpen });
		remember(PAGES_KEY, pagesOpen ? '1' : '0');
	},
	setOutlineOpen: (outlineOpen) => {
		set({ outlineOpen });
		remember(OUTLINE_KEY, outlineOpen ? '1' : '0');
	},
	setHeading: (heading) => set({ heading }),
	jumpToHeading: (page, index, instant = false) =>
		set((s) => ({ headingJump: { page, index, instant, n: (s.headingJump?.n ?? 0) + 1 }, heading: index < 0 ? s.heading : { page, index } })),
	clearHeadingJump: () => set({ headingJump: null }),
	setZoom: (zoom) => {
		set({ zoom });
		remember(ZOOM_KEY, String(zoom));
	},
	setFit: (fit) => set({ fit }),
	setPage: (page) => set({ page }),
	jumpTo: (page) => set((s) => ({ jump: { page, n: (s.jump?.n ?? 0) + 1 }, page }))
}));

/** Reads the remembered layout. Called after hydration, so the server render never depends on it. */
export function restoreNoteView() {
	try {
		const dock = window.localStorage.getItem(DOCK_KEY);
		const collapsed = window.localStorage.getItem(`${DOCK_KEY}:collapsed`) === '1';
		const pagesOpen = window.localStorage.getItem(PAGES_KEY) === '1';
		const outlineOpen = window.localStorage.getItem(OUTLINE_KEY) === '1';
		// On a phone this is "Scrivi più grande" remembered: the student picks it once, not per note.
		const saved = Number(window.localStorage.getItem(ZOOM_KEY));
		const zoom = saved >= ZOOM_STEPS[0] && saved <= ZOOM_STEPS[ZOOM_STEPS.length - 1] ? saved : 'fit';
		useNoteView.setState({
			dock: dock === 'left' || dock === 'right' || dock === 'bottom' ? dock : 'bottom',
			collapsed,
			pagesOpen,
			outlineOpen,
			heading: null,
			headingJump: null,
			zoom,
			page: 0,
			jump: null
		});
	} catch {
		// Keep the defaults.
	}
}

/** The zoom in effect. */
export const effectiveZoom = (s: Pick<NoteViewState, 'zoom' | 'fit'>) => (s.zoom === 'fit' ? s.fit : s.zoom);

/** One step up or down from the zoom in effect. */
export function stepZoom(current: number, dir: 1 | -1): number {
	if (dir > 0) return ZOOM_STEPS.find((z) => z > current + 0.001) ?? ZOOM_STEPS[ZOOM_STEPS.length - 1];
	return [...ZOOM_STEPS].reverse().find((z) => z < current - 0.001) ?? ZOOM_STEPS[0];
}

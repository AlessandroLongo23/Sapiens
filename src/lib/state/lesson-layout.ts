import { create } from 'zustand';

interface LessonLayoutState {
	scrollY: number;
	/** 0..1, how far the lesson has been scrolled. */
	scrollProgress: number;
	/** The table of contents sheet is open (phones and tablets). */
	tocOpen: boolean;
	/** Section id to scroll to; consumed by the lesson body. */
	targetSection: string;
	/** Section currently under the sticky header. */
	activeSection: string;
	/** A lesson frame is on screen (true), a non-lesson page took its place (false), or nothing has said yet (null). */
	frameMounted: boolean | null;
	setScroll: (scrollY: number, scrollProgress: number) => void;
	setTocOpen: (tocOpen: boolean) => void;
	jumpTo: (targetSection: string) => void;
	setActiveSection: (activeSection: string) => void;
	setFrameMounted: (frameMounted: boolean | null) => void;
	/** A new lesson starts with no section highlighted or targeted. */
	resetSections: () => void;
}

/**
 * Shared state of the lesson layout: the scroll position drives the compact
 * header and the reading progress bar, and the table of contents (a column
 * on wide screens, a sheet on phones) agrees with the body on the section
 * being read.
 */
export const useLessonLayout = create<LessonLayoutState>((set) => ({
	scrollY: 0,
	scrollProgress: 0,
	tocOpen: false,
	targetSection: '',
	activeSection: '',
	frameMounted: null,
	setScroll: (scrollY, scrollProgress) => set({ scrollY, scrollProgress }),
	setTocOpen: (tocOpen) => set({ tocOpen }),
	jumpTo: (targetSection) => set({ targetSection, tocOpen: false }),
	setActiveSection: (activeSection) => set({ activeSection }),
	setFrameMounted: (frameMounted) => set({ frameMounted }),
	resetSections: () => set({ targetSection: '', activeSection: '' })
}));

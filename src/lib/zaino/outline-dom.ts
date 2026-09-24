/**
 * Finding the outline's headings on screen. Every view marks each page with
 * `data-page-index`, and a page's titles are the `h1`–`h3` inside its
 * `.note-body`, in document order (see ./outline). Shared by the Simple
 * editor, the reading view and the Advanced preview.
 */

const HEADINGS = ':scope .note-body :is(h1, h2, h3)';

export function headingAt(scroller: HTMLElement, page: number, index: number): HTMLElement | null {
	const sheet = scroller.querySelector<HTMLElement>(`[data-page-index="${page}"]`);
	return (sheet?.querySelectorAll<HTMLElement>(HEADINGS)[index] as HTMLElement | undefined) ?? null;
}

/**
 * Scrolls a title (or, with index −1, the top of a page) to just under the top
 * of the scroller. False when it is not on screen yet, for the caller to retry.
 */
export function scrollToHeading(scroller: HTMLElement, page: number, index: number, instant = false): boolean {
	const el = index < 0 ? scroller.querySelector<HTMLElement>(`[data-page-index="${page}"]`) : headingAt(scroller, page, index);
	if (!el || el.getClientRects().length === 0) return false;
	const top = scroller.scrollTop + el.getBoundingClientRect().top - scroller.getBoundingClientRect().top - (index < 0 ? 16 : 24);
	const smooth = !instant && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	scroller.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
	return true;
}

/**
 * The last heading that has reached the top of the scroller: the section being
 * read. The line sits a little below where scrollToHeading puts a title, so a
 * title picked in the outline is the one marked, not a short section under it.
 */
export function headingInView(scroller: HTMLElement): { page: number; index: number } | null {
	const line = scroller.getBoundingClientRect().top + 72;
	let found: { page: number; index: number } | null = null;
	for (const sheet of scroller.querySelectorAll<HTMLElement>('[data-page-index]')) {
		const page = Number(sheet.dataset.pageIndex);
		sheet.querySelectorAll<HTMLElement>(HEADINGS).forEach((el, index) => {
			if (el.getBoundingClientRect().top <= line) found = { page, index };
		});
	}
	// Above the first title, the first one: something is always marked while there are titles.
	if (!found) {
		const first = scroller.querySelector<HTMLElement>('[data-page-index]');
		if (first?.querySelector(HEADINGS)) found = { page: Number(first.dataset.pageIndex), index: 0 };
	}
	return found;
}

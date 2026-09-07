import { browser } from '$app/environment';

/**
 * The viewport breakpoints that decide which shell is shown, as reactive
 * booleans. They mirror Tailwind's `md` and `lg`; components that must
 * mount a piece of UI once (not once per layout) branch on these instead
 * of rendering both copies and hiding one with CSS.
 *
 * Everything is false during server rendering and until the first
 * `matchMedia` read after hydration.
 */
class MediaState {
	/** At least 640px wide: dialogs are centred instead of anchored to the bottom. */
	sm = $state(false);
	/** At least 768px wide: the desktop header and no bottom tab bar. */
	md = $state(false);
	/** At least 1024px wide: lesson sidebars beside the text. */
	lg = $state(false);
	/** Touch as the main pointer (phones and tablets). */
	coarse = $state(false);
	/** The visitor asked for less motion. */
	reducedMotion = $state(false);
}

export const media = new MediaState();

if (browser) {
	const watch = (query: string, apply: (matches: boolean) => void) => {
		const list = window.matchMedia(query);
		apply(list.matches);
		list.addEventListener('change', (event) => apply(event.matches));
	};
	watch('(min-width: 640px)', (m) => (media.sm = m));
	watch('(min-width: 768px)', (m) => (media.md = m));
	watch('(min-width: 1024px)', (m) => (media.lg = m));
	watch('(pointer: coarse)', (m) => (media.coarse = m));
	watch('(prefers-reduced-motion: reduce)', (m) => (media.reducedMotion = m));
}

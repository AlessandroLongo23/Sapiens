import { useEffect, useRef, useState } from 'react';

/**
 * The editor over the whole screen, as the plotter does: the browser's own full screen where it has one for an
 * element, and in every case the editor laid over the page (an iPhone has no full screen for an element). Esc, or
 * the button again, goes back.
 */
export function useFullscreen() {
	const root = useRef<HTMLElement>(null);
	const [full, setFull] = useState(false);

	const exit = () => {
		setFull(false);
		if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
	};
	const enter = () => {
		setFull(true);
		root.current?.requestFullscreen?.().catch(() => {});
	};

	useEffect(() => {
		if (!full) return;
		// left by the browser's own way out
		const changed = () => !document.fullscreenElement && setFull(false);
		const escape = (event: KeyboardEvent) => event.key === 'Escape' && !document.fullscreenElement && setFull(false);
		document.addEventListener('fullscreenchange', changed);
		document.addEventListener('keydown', escape);
		return () => {
			document.removeEventListener('fullscreenchange', changed);
			document.removeEventListener('keydown', escape);
		};
	}, [full]);

	return { root, full, toggle: () => (full ? exit() : enter()) };
}

/** The classes of the editor's frame: a card in the page, or the whole screen. */
export const FRAME = 'not-prose overflow-hidden border-edge bg-surface';
export const frame = (full: boolean) => (full ? `${FRAME} fixed inset-0 z-50 flex flex-col` : `${FRAME} rounded-2xl border shadow-paper`);

'use client';

import { useSyncExternalStore } from 'react';

/**
 * How many pixels of the window the on-screen keyboard covers, so a bar
 * anchored to the bottom edge can ride above it. Chrome Android shrinks the
 * layout viewport (the root layout asks it to, with interactive-widget), but
 * iOS Safari only shrinks the visual viewport and leaves `fixed` elements
 * under the keyboard; the difference between the two is the lift.
 *
 * iOS fires `scroll` on the visual viewport, not `resize`, when the page
 * shifts under the keyboard, so both are needed.
 */
function subscribe(onChange: () => void): () => void {
	const vv = window.visualViewport;
	if (!vv) return () => {};
	vv.addEventListener('resize', onChange);
	vv.addEventListener('scroll', onChange);
	return () => {
		vv.removeEventListener('resize', onChange);
		vv.removeEventListener('scroll', onChange);
	};
}

function read(): number {
	const vv = window.visualViewport;
	if (!vv) return 0;
	// Rounded: sub-pixel jitter while scrolling would re-render on every frame.
	return Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
}

export function useKeyboardInset(): number {
	return useSyncExternalStore(subscribe, read, () => 0);
}

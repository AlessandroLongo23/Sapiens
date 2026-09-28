import { useLayoutEffect, useRef, type RefObject } from 'react';

/**
 * Cards that close a gap slide into it instead of jumping (a FLIP animation). Call `measure()` right before the change
 * that takes a card out; after the next render every element under `container` matching `[attr]` that moved slides
 * from where it was. Elements are matched by the value of `attr`. With reduced motion they just move.
 */
export function useSlideIntoPlace(container: RefObject<HTMLElement | null>, attr: string) {
	const before = useRef<Map<string, DOMRect> | null>(null);

	const measure = () => {
		const root = container.current;
		if (!root) return;
		before.current = new Map(Array.from(root.querySelectorAll<HTMLElement>(`[${attr}]`), (el) => [el.getAttribute(attr) ?? '', el.getBoundingClientRect()]));
	};

	useLayoutEffect(() => {
		const was = before.current;
		const root = container.current;
		if (!was || !root) return;
		before.current = null;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		for (const el of Array.from(root.querySelectorAll<HTMLElement>(`[${attr}]`))) {
			const old = was.get(el.getAttribute(attr) ?? '');
			if (!old) continue;
			const now = el.getBoundingClientRect();
			const dx = old.left - now.left;
			const dy = old.top - now.top;
			if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue;
			el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
		}
	});

	return measure;
}

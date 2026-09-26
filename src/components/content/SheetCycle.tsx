'use client';

import { useEffect, useRef } from 'react';

const FIRST = 9000; // the first working is left on the sheet this long before the next, in milliseconds
const HOLD = 8000; // each later one

/**
 * Turns a level sheet (LevelSheet) through its subjects: every few seconds the
 * sheet's `data-active` moves to the next subject, and CSS shows that subject's
 * working, which the pen writes again, and stands its divider up. Hovering or
 * focusing a subject in the list shows it at once; while the pointer is on the
 * sheet it stays. Only while the sheet is on screen, and never with reduced motion.
 */
export function SheetCycle({ count, offset = 0 }: { count: number; offset?: number }) {
	const ref = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const sheet = ref.current?.closest<HTMLElement>('[data-active]');
		if (!sheet || count < 2) return;
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		let active = Number(sheet.dataset.active) || 0;
		let timer: ReturnType<typeof setTimeout> | undefined;
		let visible = false;
		let held = false;

		const show = (i: number) => {
			active = i;
			sheet.dataset.active = String(i);
		};
		const schedule = (ms: number) => {
			clearTimeout(timer);
			if (reduce || !visible || held) return;
			timer = setTimeout(() => {
				show((active + 1) % count);
				schedule(HOLD);
			}, ms);
		};

		const io = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
				if (visible) schedule(FIRST + offset * 1500);
				else clearTimeout(timer);
			},
			{ threshold: 0.4 }
		);
		io.observe(sheet);

		const pick = (e: Event) => {
			const tab = (e.target as Element).closest<HTMLElement>('[data-tab]');
			if (tab && Number(tab.dataset.tab) !== active) show(Number(tab.dataset.tab));
		};
		const hold = () => {
			held = true;
			clearTimeout(timer);
		};
		const release = () => {
			held = false;
			schedule(HOLD);
		};
		sheet.addEventListener('pointerenter', hold);
		sheet.addEventListener('pointerleave', release);
		sheet.addEventListener('pointerover', pick);
		sheet.addEventListener('focusin', pick);

		return () => {
			clearTimeout(timer);
			io.disconnect();
			sheet.removeEventListener('pointerenter', hold);
			sheet.removeEventListener('pointerleave', release);
			sheet.removeEventListener('pointerover', pick);
			sheet.removeEventListener('focusin', pick);
		};
	}, [count, offset]);

	return <span ref={ref} hidden />;
}

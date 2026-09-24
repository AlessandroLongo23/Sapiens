'use client';

import { useEffect, type RefObject } from 'react';
import { SHEET_WIDTH } from '@/lib/zaino/stickers';
import { useNoteView } from '@/lib/state/note-view';

/**
 * Measures the zoom at which the sheet fits its scroller and hands it to the
 * view state, where 'fit' reads it. `gutter` is the room kept either side:
 * wider when the toolbar stands on a side.
 */
export function useSheetFit(scroller: RefObject<HTMLElement | null>, sideDock: boolean) {
	const setFit = useNoteView((s) => s.setFit);
	useEffect(() => {
		const el = scroller.current;
		if (!el) return;
		const measure = () => {
			const gutter = sideDock ? 176 : el.clientWidth < 640 ? 24 : 64;
			setFit(Math.max(0.2, Math.min(1, (el.clientWidth - gutter) / SHEET_WIDTH)));
		};
		const observer = new ResizeObserver(measure);
		observer.observe(el);
		measure();
		return () => observer.disconnect();
	}, [scroller, setFit, sideDock]);
}

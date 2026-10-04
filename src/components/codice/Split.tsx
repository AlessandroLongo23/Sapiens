'use client';

import { useRef, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { DEFAULTS, SPLIT_MAX, SPLIT_MIN, saveSettings, useEditorSettings } from './settings';

const clamp = (share: number) => Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, share));
/** How much an arrow key moves the handle. */
const STEP = 0.02;

/**
 * The code and what comes of it. On a wide screen they are side by side, with a handle between them that gives one
 * the width it takes from the other: dragged, or moved with the arrow keys, and put back in the middle by a double
 * click. The share is one of the student's settings, so every editor opens as the last was left. On a narrow screen,
 * and in a lesson (`stacked`), the two are one above the other and there is no handle.
 */
export function Split({ left, right, stacked = false }: { left: ReactNode; right: ReactNode; stacked?: boolean }) {
	const { split } = useEditorSettings();
	const box = useRef<HTMLDivElement>(null);
	const dragging = useRef(false);

	if (stacked)
		return (
			<div>
				{left}
				{right}
			</div>
		);

	const drag = (event: PointerEvent<HTMLDivElement>) => {
		if (!dragging.current || !box.current) return;
		const { left: start, width } = box.current.getBoundingClientRect();
		saveSettings({ split: clamp((event.clientX - start) / width) });
	};
	const keys = (event: KeyboardEvent<HTMLDivElement>) => {
		const move = event.key === 'ArrowLeft' ? -STEP : event.key === 'ArrowRight' ? STEP : 0;
		if (!move) return;
		event.preventDefault();
		saveSettings({ split: clamp(split + move) });
	};

	return (
		<div ref={box} className="flex flex-col lg:flex-row" style={{ '--split': `${split * 100}%` } as CSSProperties}>
			<div className="min-w-0 lg:w-[var(--split)] lg:shrink-0">{left}</div>
			<div
				role="separator"
				aria-orientation="vertical"
				aria-label="Larghezza del codice"
				aria-valuemin={SPLIT_MIN * 100}
				aria-valuemax={SPLIT_MAX * 100}
				aria-valuenow={Math.round(split * 100)}
				tabIndex={0}
				title="Trascina per cambiare la larghezza; doppio clic per rimetterla a metà"
				// the pointer is captured, so the drag goes on over the preview of a page, which is another document
				onPointerDown={(event) => {
					dragging.current = true;
					event.currentTarget.setPointerCapture(event.pointerId);
					event.preventDefault();
				}}
				onPointerMove={drag}
				onPointerUp={() => (dragging.current = false)}
				onPointerCancel={() => (dragging.current = false)}
				onDoubleClick={() => saveSettings({ split: DEFAULTS.split })}
				onKeyDown={keys}
				className={cn(
					'group relative z-10 hidden w-px shrink-0 cursor-col-resize touch-none bg-edge outline-none lg:block',
					// wider than it looks: the line is one pixel, the grip around it nine
					"after:absolute after:inset-y-0 after:-right-1 after:-left-1 after:content-['']",
					'before:absolute before:inset-y-0 before:-right-px before:-left-px before:bg-accent before:opacity-0 before:transition-opacity hover:before:opacity-100 focus-visible:before:opacity-100 active:before:opacity-100'
				)}
			>
				{/* the grip says the line can be taken; the clicks are the handle's */}
				<span className="pointer-events-none absolute top-1/2 left-1/2 z-10 flex h-8 w-3.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-edge-strong bg-surface text-fg-muted shadow-sm group-hover:border-accent group-hover:text-accent-fg group-focus-visible:border-accent group-active:border-accent">
					<GripVertical className="size-3" aria-hidden="true" />
				</span>
			</div>
			<div className="min-w-0 flex-1">{right}</div>
		</div>
	);
}

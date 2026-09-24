'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useReducedMotion } from '@/lib/hooks/use-media';
import { cn } from '@/lib/utils/cn';

/**
 * A column beside the sheet that slides open and shut: its width grows from
 * nothing while the content fades in from the side it opens on, so the sheet
 * makes room at the same pace. The content keeps its own width throughout,
 * so nothing inside reflows while it moves, and stays mounted until the
 * closing has finished. Shut, the column is `inert`: out of the tab order and
 * of the accessibility tree. With reduced motion it simply appears.
 */
export function SidePanel({ open, side, width, label, children }: { open: boolean; side: 'left' | 'right'; width: number; label: string; children: ReactNode }) {
	// Mounted while open and while closing; `shown` drives the transition one frame after mounting.
	const [mounted, setMounted] = useState(open);
	const [shown, setShown] = useState(open);
	const reduced = useReducedMotion();
	if (open && !mounted) setMounted(true);
	// Without a transition there is no transitionend to wait for.
	if (!open && mounted && reduced) setMounted(false);
	if (!open && shown) setShown(false);

	// Opening waits a frame, so the column is first laid out shut and the width has something to grow from.
	useEffect(() => {
		if (!open) return;
		const frame = requestAnimationFrame(() => setShown(true));
		return () => cancelAnimationFrame(frame);
	}, [open]);

	if (!mounted) return null;
	return (
		<aside
			aria-label={label}
			inert={!open || undefined}
			onTransitionEnd={(e) => {
				if (e.target === e.currentTarget && e.propertyName === 'width' && !open) setMounted(false);
			}}
			style={{ width: shown ? width : 0 }}
			className={cn(
				'relative shrink-0 overflow-hidden bg-surface transition-[width] duration-300 ease-(--ease-out-soft) motion-reduce:transition-none',
				side === 'left' ? 'border-r' : 'border-l',
				shown ? 'border-edge' : 'border-transparent'
			)}
		>
			<div
				style={{ width }}
				className={cn(
					'absolute inset-y-0 transition-[opacity,translate] duration-300 ease-(--ease-out-soft) motion-reduce:transition-none',
					side === 'left' ? 'right-0' : 'left-0',
					shown ? 'translate-x-0 opacity-100' : cn('opacity-0', side === 'left' ? '-translate-x-4' : 'translate-x-4')
				)}
			>
				{children}
			</div>
		</aside>
	);
}

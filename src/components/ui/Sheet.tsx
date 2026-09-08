'use client';

import { useEffect, useId, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * Bottom sheet for phones and tablets. It slides up from the bottom edge
 * over a dimmed backdrop and closes on backdrop tap, Escape, the close
 * button, or a downward drag on the handle. The body scrolls on its own
 * without dragging the page behind it, and the panel keeps clear of the
 * home indicator. From `sm` up it stays at the bottom edge or is centred.
 */
export interface SheetProps {
	open: boolean;
	onClose: () => void;
	/** Accessible name of the dialog; also the heading unless `hideTitle`. */
	title: string;
	hideTitle?: boolean;
	/** 'auto' fits the content (up to 85% of the screen); 'full' is a tall panel. */
	size?: 'auto' | 'full';
	align?: 'bottom' | 'center';
	bodyClass?: string;
	/** Rendered right of the title. */
	actions?: ReactNode;
	footer?: ReactNode;
	children: ReactNode;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal behaviour for a portalled panel: focus moves inside while `open` and
 * back to where it was afterwards, Tab cycles within the panel, everything
 * else on the page is `inert` (unreachable by keyboard and assistive tech),
 * and Escape closes wherever the focus is (the panel's own handler stops the
 * key from reaching an overlay underneath).
 */
export function useFocusTrap(open: boolean, panel: React.RefObject<HTMLElement | null>, onClose: () => void) {
	useEffect(() => {
		if (!open) return;
		const node = panel.current;
		const previous = document.activeElement as HTMLElement | null;
		if (node && !node.contains(document.activeElement)) node.focus({ preventScroll: true });

		// The portal root is a direct child of <body>; its siblings go inert until the panel closes.
		const root = node ? Array.from(document.body.children).find((c) => c.contains(node)) : undefined;
		const madeInert = Array.from(document.body.children).filter((c) => c !== root && c.tagName !== 'SCRIPT' && !c.hasAttribute('inert'));
		madeInert.forEach((c) => c.setAttribute('inert', ''));

		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') return onClose();
			if (e.key !== 'Tab' || !node) return;
			const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.getClientRects().length > 0);
			const active = document.activeElement;
			const outside = !node.contains(active) || active === node;
			if (items.length === 0) {
				e.preventDefault();
				node.focus();
			} else if (e.shiftKey && (outside || active === items[0])) {
				e.preventDefault();
				items[items.length - 1].focus();
			} else if (!e.shiftKey && (outside || active === items[items.length - 1])) {
				e.preventDefault();
				items[0].focus();
			}
		};
		document.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('keydown', onKey);
			madeInert.forEach((c) => c.removeAttribute('inert'));
			previous?.focus?.({ preventScroll: true });
		};
	}, [open, panel, onClose]);
}

export function Sheet({ open, onClose, title, hideTitle = false, size = 'auto', align = 'bottom', bodyClass, actions, footer, children }: SheetProps) {
	const panel = useRef<HTMLDivElement>(null);
	const titleId = useId();
	const [dragY, setDragY] = useState(0);
	const drag = useRef<{ start: number; time: number } | null>(null);
	useFocusTrap(open, panel, onClose);

	if (!open) return null;

	const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
		if ((e.pointerType === 'mouse' && e.button !== 0) || (e.target as HTMLElement).closest('button, a, input, select, textarea')) return;
		drag.current = { start: e.clientY, time: performance.now() };
		e.currentTarget.setPointerCapture(e.pointerId);
	};
	const onPointerMove = (e: PointerEvent) => drag.current && setDragY(Math.max(0, e.clientY - drag.current.start));
	const onPointerUp = () => {
		if (!drag.current) return;
		const speed = dragY / Math.max(performance.now() - drag.current.time, 1);
		drag.current = null;
		setDragY(0);
		if (dragY > 110 || speed > 0.6) onClose();
	};

	return createPortal(
		<div
			className={cn('fixed inset-0 z-50 flex flex-col justify-end sm:items-center', align === 'center' && 'sm:justify-center')}
			onKeyDown={(e) => {
				if (e.key === 'Escape') {
					e.stopPropagation();
					onClose();
				}
			}}
		>
			<div className="absolute inset-0 animate-fade-in touch-none bg-black/40 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
			<div
				ref={panel}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				tabIndex={-1}
				className={cn(
					'relative z-10 flex w-full animate-slide-up flex-col rounded-t-3xl bg-surface text-fg shadow-2xl shadow-black/30 outline-none sm:max-w-xl sm:rounded-b-3xl',
					align === 'center' ? 'sm:my-6' : 'sm:mb-6',
					size === 'full' ? 'h-[calc(100dvh-var(--safe-t)-1.5rem)] sm:h-[min(92dvh,52rem)]' : 'max-h-[85dvh]'
				)}
				style={dragY ? { transform: `translateY(${dragY}px)`, transition: 'none', animation: 'none' } : undefined}
			>
				<div className="shrink-0 cursor-grab touch-none select-none active:cursor-grabbing" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
					<div className={cn('mx-auto mt-2.5 h-1.5 w-11 rounded-full bg-surface-4', align === 'center' && 'sm:invisible')} aria-hidden="true" />
					{hideTitle ? (
						<>
							<h2 id={titleId} className="sr-only">
								{title}
							</h2>
							<div className="h-2" />
						</>
					) : (
						<div className="flex items-center gap-2 px-4 pb-2 pt-3">
							<h2 id={titleId} className="min-w-0 flex-1 truncate text-base font-semibold">
								{title}
							</h2>
							{actions}
							<button type="button" onClick={onClose} className="flex size-11 shrink-0 items-center justify-center rounded-full text-fg-subtle transition-colors hover:bg-surface-3 hover:text-fg focus-ring" aria-label="Chiudi">
								<X className="size-5" aria-hidden="true" />
							</button>
						</div>
					)}
				</div>
				<div className={cn('min-h-0 flex-1 overflow-y-auto overscroll-contain', !footer && 'pb-safe', bodyClass)}>{children}</div>
				{footer && <div className="shrink-0 rounded-b-3xl border-t border-edge-soft bg-surface px-4 pt-3 pb-[calc(0.75rem+var(--safe-b))] sm:pb-3">{footer}</div>}
			</div>
		</div>,
		document.body
	);
}

'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils/cn';

type Placement = 'bottom-end' | 'bottom-start' | 'top-center' | 'right-end' | 'left-end';
const PLACEMENT: Record<Placement, string> = {
	'bottom-end': 'right-0 top-full mt-2',
	'bottom-start': 'left-0 top-full mt-2',
	'top-center': 'bottom-full left-1/2 mb-3 -translate-x-1/2',
	'right-end': 'bottom-0 left-full ml-3',
	'left-end': 'bottom-0 right-full mr-3'
};

/**
 * A panel that drops from its trigger: the note's menu, the paper, a page's
 * actions. Not modal: a click outside or Escape closes it and the focus goes
 * back to the trigger. The caller wraps trigger and panel in a `relative` box.
 * Phones use a Sheet instead (see the callers).
 */
export function Popover({
	open,
	onClose,
	label,
	role = 'dialog',
	placement = 'bottom-end',
	at,
	className,
	children
}: {
	/** Viewport coordinates for a panel that must escape a scrolling parent. */
	at?: { x: number; y: number };
	open: boolean;
	onClose: () => void;
	label: string;
	role?: 'dialog' | 'menu';
	/** Which side of the trigger it opens on, and which edge it lines up with. */
	placement?: Placement;
	className?: string;
	children: ReactNode;
}) {
	const panel = useRef<HTMLDivElement>(null);
	const close = useRef(onClose);
	useEffect(() => {
		close.current = onClose;
	});

	useEffect(() => {
		if (!open) return;
		const node = panel.current;
		const trigger = document.activeElement as HTMLElement | null;
		const first = node?.querySelector<HTMLElement>(role === 'menu' ? '[role="menuitem"]:not([disabled])' : 'input, [aria-checked="true"], button:not([disabled]):not([tabindex="-1"])');
		(first ?? node)?.focus({ preventScroll: true });

		// A press on a trigger is left to the trigger's own toggle.
		const onDown = (e: PointerEvent) => {
			const target = e.target as Element | null;
			if (node?.contains(target) || target?.closest?.('[aria-haspopup]')) return;
			close.current();
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.stopPropagation();
				close.current();
				trigger?.focus({ preventScroll: true });
			}
		};
		document.addEventListener('pointerdown', onDown, true);
		document.addEventListener('keydown', onKey, true);
		return () => {
			document.removeEventListener('pointerdown', onDown, true);
			document.removeEventListener('keydown', onKey, true);
		};
	}, [open, role]);

	// Arrow keys between the items of a menu.
	const onKeyDown = (e: React.KeyboardEvent) => {
		if (role !== 'menu' || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
		const items = Array.from(panel.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled]), [role="menuitemradio"]:not([disabled])') ?? []);
		if (!items.length) return;
		e.preventDefault();
		const at = items.indexOf(document.activeElement as HTMLElement);
		const next = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : (at + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
		items[next].focus();
	};

	if (!open) return null;
	const panelNode = (
		<div
			ref={panel}
			role={role}
			aria-label={label}
			tabIndex={-1}
			onKeyDown={onKeyDown}
			style={at ? { left: at.x, top: at.y } : undefined}
			className={cn(
				'z-50 rounded-2xl border border-edge bg-surface p-1.5 text-fg shadow-2xl outline-none animate-fade-in',
				at ? 'fixed' : 'absolute',
				!at && PLACEMENT[placement],
				className
			)}
		>
			{children}
		</div>
	);
	// Placed by coordinates, it goes to <body>: no parent's overflow or stacking can hide it.
	return at ? createPortal(panelNode, document.body) : panelNode;
}

/** A row of a menu: icon, label and, optionally, a hint on the right. */
export function MenuItem({
	icon: Icon,
	children,
	hint,
	danger = false,
	disabled = false,
	onSelect
}: {
	icon?: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' }>;
	children: ReactNode;
	hint?: string;
	danger?: boolean;
	disabled?: boolean;
	onSelect: () => void;
}) {
	return (
		<button
			type="button"
			role="menuitem"
			disabled={disabled}
			onClick={onSelect}
			className={cn(
				'flex min-h-10 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-40',
				danger ? 'text-danger-fg hover:bg-danger-soft focus-visible:bg-danger-soft' : 'text-fg hover:bg-surface-3 focus-visible:bg-surface-3'
			)}
		>
			{Icon && <Icon className={cn('size-4 shrink-0', danger ? 'text-danger-fg' : 'text-fg-subtle')} aria-hidden="true" />}
			<span className="min-w-0 flex-1 truncate">{children}</span>
			{hint && <span className="label-mono shrink-0 text-[11px] text-fg-faint">{hint}</span>}
		</button>
	);
}

export const MenuSeparator = () => <div role="separator" className="-mx-1.5 my-1.5 h-px bg-edge-soft" />;

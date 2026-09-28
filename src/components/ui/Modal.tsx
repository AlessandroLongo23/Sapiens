'use client';

import { useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils/cn';
import { useFocusTrap, usePresence } from './Sheet';

/**
 * Dialog container. On phones the panel is anchored to the bottom edge and
 * slides up like a sheet, with its own scrolling and room for the home
 * indicator; from `sm` up it is centred. The child provides the dialog role.
 */
export function Modal({ open, onClose, className, blur = 'none', children }: { open: boolean; onClose: () => void; className?: string; blur?: 'none' | 'xs' | 'sm'; children: ReactNode }) {
	const panel = useRef<HTMLDivElement>(null);
	useFocusTrap(open, panel, onClose);
	const { shown, leaving, content } = usePresence(open, children);
	if (!shown) return null;
	return createPortal(
		<div className={cn('fixed inset-0 z-50 flex flex-col justify-end sm:items-center sm:justify-center', leaving && 'pointer-events-none')} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
			<div className={cn('absolute inset-0 touch-none bg-black/25', leaving ? 'animate-fade-out' : 'animate-fade-in', blur === 'xs' && 'backdrop-blur-xs', blur === 'sm' && 'backdrop-blur-sm')} onClick={onClose} role="presentation" />
			<div
				ref={panel}
				tabIndex={-1}
				className={cn(
					'relative z-10 w-full max-h-[calc(100dvh-var(--safe-t)-1rem)] overflow-y-auto overscroll-contain outline-none sm:mx-auto sm:max-h-[92dvh]',
					leaving ? 'animate-slide-down sm:animate-sink-out' : 'animate-slide-up sm:animate-rise-in',
					className
				)}
			>
				{content}
			</div>
		</div>,
		document.body
	);
}

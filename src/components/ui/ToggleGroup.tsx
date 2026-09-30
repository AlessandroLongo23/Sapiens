'use client';

import { useLayoutEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react';
import type { IconComponent } from '@/lib/utils/icons';
import { cn } from '@/lib/utils/cn';

export interface ToggleOption<T extends string> {
	value: T;
	label: string;
	icon?: IconComponent;
}

/**
 * A segmented control: one of a few options, the selected one raised. The raised part is one piece that slides to the
 * option chosen, so the choice is seen moving; until it has been measured the selected button draws its own. The
 * hover is one piece too, under the raised one, that glides from option to option under a mouse (after Glide Select
 * in React Bits): it appears where the pointer comes in, follows it, and fades when it leaves.
 */
export function ToggleGroup<T extends string>({
	options,
	value,
	onChange,
	label,
	iconOnly = false,
	labelClass,
	compact = false,
	describedBy
}: {
	/** The id of a text that explains the choice. */
	describedBy?: string;
	options: ToggleOption<T>[];
	value: T;
	onChange: (value: T) => void;
	label: string;
	iconOnly?: boolean;
	/** On the label text, for hiding it at narrow widths. */
	labelClass?: string;
	/** Shorter, with a quiet selected state, for a toolbar where it must not outshout the content. */
	compact?: boolean;
}) {
	const group = useRef<HTMLDivElement>(null);
	const thumb = useRef<HTMLSpanElement>(null);
	const hover = useRef<HTMLSpanElement>(null);

	const followPointer = (e: PointerEvent<HTMLDivElement>) => {
		const node = group.current;
		const pill = hover.current;
		const button = (e.target as HTMLElement).closest('button');
		if (e.pointerType === 'touch' || !node || !pill || !button || button.parentElement !== node || node.dataset.ready === undefined) return;
		const box = button.getBoundingClientRect();
		// Arriving, it appears in place and only fades in; moving from option to option, it glides.
		pill.style.transitionDuration = pill.dataset.on === undefined ? '0ms, 0ms, 150ms' : '';
		// Clear of the raised piece by 2px a side, whose rounded corners would show it behind them.
		pill.style.width = `${box.width - 4}px`;
		pill.style.transform = `translateX(${box.left - node.getBoundingClientRect().left - node.clientLeft + 2}px)`;
		pill.dataset.on = '';
	};
	// one choice among a few: a radio group, one Tab stop, the arrows move the choice (the ARIA radio pattern)
	const arrows = (e: KeyboardEvent<HTMLDivElement>) => {
		const i = options.findIndex((o) => o.value === value);
		const n = options.length;
		const to = {
			ArrowRight: i + 1,
			ArrowDown: i + 1,
			ArrowLeft: i - 1,
			ArrowUp: i - 1,
			Home: 0,
			End: n - 1
		}[e.key];
		if (to === undefined) return;
		e.preventDefault();
		const next = options[(to + n) % n];
		onChange(next.value);
		const buttons = group.current?.querySelectorAll<HTMLButtonElement>('button[role="radio"]');
		buttons?.[options.indexOf(next)]?.focus();
	};
	const leave = () => {
		if (hover.current) delete hover.current.dataset.on;
	};

	// Placed by hand, not through state: it follows layout (the buttons' widths), not data.
	useLayoutEffect(() => {
		const node = group.current;
		const piece = thumb.current;
		if (!node || !piece) return;
		const place = () => {
			const selected = node.querySelector<HTMLElement>(':scope > button[aria-checked="true"]');
			if (!selected) return;
			// Sub-pixel, from the group's padding edge where `left: 0` is: offsetLeft and offsetWidth round to whole
			// pixels, and the piece would overlap its neighbour by a fraction.
			const box = selected.getBoundingClientRect();
			const left = box.left - node.getBoundingClientRect().left - node.clientLeft;
			piece.style.width = `${box.width}px`;
			piece.style.transform = `translateX(${left}px)`;
			// The first placement is not a move: the transition starts from the next frame.
			if (node.dataset.ready === undefined) requestAnimationFrame(() => (node.dataset.ready = ''));
		};
		place();
		const observer = new ResizeObserver(place);
		observer.observe(node);
		return () => observer.disconnect();
	}, [value]);

	return (
		<div
			ref={group}
			role="radiogroup"
			aria-label={label}
			aria-describedby={describedBy}
			onKeyDown={arrows}
			onPointerOver={followPointer}
			onPointerLeave={leave}
			className={cn('toggle-slide relative flex rounded-xl border border-edge', compact ? 'bg-surface-2 p-0.5' : 'bg-surface p-1')}
		>
			<span ref={hover} className={cn('toggle-hover pointer-events-none absolute left-0 rounded-lg bg-surface-3', compact ? 'inset-y-0.5' : 'inset-y-1')} aria-hidden="true" />
			<span
				ref={thumb}
				className={cn(
					'toggle-thumb pointer-events-none absolute left-0 rounded-lg',
					compact ? 'inset-y-0.5 bg-surface shadow-paper ring-1 ring-fg-subtle dark:bg-surface-3' : 'inset-y-1 bg-accent shadow-sm'
				)}
				aria-hidden="true"
			/>
			{/* Every button carries aria-label: with `labelClass` the text can be hidden at
			    narrow widths, and a button whose only label is display:none has no name. */}
			{options.map((o) => (
				<button
					key={o.value}
					type="button"
					role="radio"
					aria-checked={value === o.value}
					tabIndex={value === o.value ? 0 : -1}
					aria-label={o.label}
					title={compact ? o.label : undefined}
					onClick={() => onChange(o.value)}
					className={cn(
						'relative flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2 text-sm font-medium transition-colors duration-200 focus-ring',
						compact ? 'min-h-8 px-2.5' : 'min-h-[40px] py-1.5',
						value === o.value ? (compact ? 'bg-surface font-semibold text-fg-strong shadow-paper' : 'bg-accent text-white shadow-sm') : 'text-fg-muted hover:bg-surface-3'
					)}
				>
					{o.icon && <o.icon className="size-4 shrink-0" aria-hidden="true" />}
					{!iconOnly && <span className={labelClass}>{o.label}</span>}
				</button>
			))}
		</div>
	);
}

'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Drag-to-reorder for a vertical list, on a pointer or a keyboard.
 *
 * The list is re-rendered in the new order as the pointer crosses each row, so
 * what is on screen is always the order that would be committed. Rows animate
 * to their new places with a FLIP pass: the DOM has already moved by the time
 * we can measure, so each row is transformed back to where it was and released,
 * which is the only way to animate a reorder without animating layout itself.
 *
 * Keyboard support is not an afterthought here: a drag handle is a button, and
 * ArrowUp/ArrowDown move the row it belongs to.
 */
export interface Reorder {
	/** The ids in their current (possibly mid-drag) order. */
	order: string[];
	/** The row being dragged, for styling. */
	dragging: string | null;
	/** Spread onto each row element. */
	rowProps: (id: string) => { ref: (el: HTMLElement | null) => void; 'data-reorder-id': string };
	/** Spread onto the grab handle inside a row. */
	handleProps: (id: string) => {
		onPointerDown: (e: React.PointerEvent) => void;
		onKeyDown: (e: React.KeyboardEvent) => void;
	};
}

export function useReorder(ids: string[], commit: (ids: string[]) => void, enabled = true): Reorder {
	const [order, setOrder] = useState<string[]>(ids);
	const [dragging, setDragging] = useState<string | null>(null);
	const rows = useRef(new Map<string, HTMLElement>());
	const before = useRef(new Map<string, number>());

	// The server is the authority whenever a drag is not in progress. Adjusted
	// during render, the way Shell tracks the path: an effect would re-render a
	// second time to say the same thing.
	const key = ids.join();
	const [applied, setApplied] = useState(key);
	if (!dragging && key !== applied) {
		setApplied(key);
		setOrder(ids);
	}

	/** Where every row sits right now, to invert against after the re-render. */
	const measure = () => {
		before.current.clear();
		for (const [id, el] of rows.current) before.current.set(id, el.getBoundingClientRect().top);
	};

	// FLIP: after the order changes, put each row back where it was and let it go.
	useEffect(() => {
		if (before.current.size === 0) return;
		for (const [id, el] of rows.current) {
			const was = before.current.get(id);
			if (was === undefined) continue;
			const delta = was - el.getBoundingClientRect().top;
			if (!delta) continue;
			el.style.transition = 'none';
			el.style.transform = `translateY(${delta}px)`;
			requestAnimationFrame(() => {
				el.style.transition = 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1)';
				el.style.transform = '';
			});
		}
		before.current.clear();
	}, [order]);

	/** The list with `id` moved to `index`, or the same array when nothing moves. */
	const moved = (current: string[], id: string, index: number) => {
		const from = current.indexOf(id);
		const to = Math.max(0, Math.min(current.length - 1, index));
		if (from < 0 || from === to) return current;
		const next = [...current];
		next.splice(to, 0, next.splice(from, 1)[0]);
		return next;
	};

	const onPointerDown = (id: string) => (e: React.PointerEvent) => {
		if (!enabled || (e.pointerType === 'mouse' && e.button !== 0)) return;
		e.preventDefault();
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		setDragging(id);
		// The drag owns the order while it lasts. Keeping it in the closure rather
		// than a ref means no state is read during render, and every pointermove
		// sees what the previous one decided even before React has re-rendered.
		let current = order;

		const onMove = (move: PointerEvent) => {
			// The row whose middle the pointer has passed becomes the new index.
			const boxes = current
				.map((rowId) => ({ rowId, box: rows.current.get(rowId)?.getBoundingClientRect() }))
				.filter((entry): entry is { rowId: string; box: DOMRect } => !!entry.box);
			const over = boxes.findIndex(({ box }) => move.clientY < box.top + box.height / 2);
			const index = over === -1 ? boxes.length - 1 : over;
			if (current[index] === id) return;
			measure();
			current = moved(current, id, index);
			setOrder(current);
		};
		const onUp = () => {
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerup', onUp);
			window.removeEventListener('pointercancel', onUp);
			setDragging(null);
			if (current.some((rowId, i) => ids[i] !== rowId)) commit(current);
		};
		window.addEventListener('pointermove', onMove);
		window.addEventListener('pointerup', onUp);
		window.addEventListener('pointercancel', onUp);
	};

	const onKeyDown = (id: string) => (e: React.KeyboardEvent) => {
		if (!enabled) return;
		const step = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0;
		if (!step) return;
		e.preventDefault();
		const from = order.indexOf(id);
		if (from + step < 0 || from + step >= order.length) return;
		measure();
		// Computed here, not read back from state: setOrder has not flushed yet.
		const next = moved(order, id, from + step);
		setOrder(next);
		// The handle keeps focus across the re-render, so a run of presses works.
		requestAnimationFrame(() => rows.current.get(id)?.querySelector<HTMLElement>('[data-reorder-handle]')?.focus());
		commit(next);
	};

	return {
		order,
		dragging,
		rowProps: (id) => ({
			ref: (el: HTMLElement | null) => {
				if (el) rows.current.set(id, el);
				else rows.current.delete(id);
			},
			'data-reorder-id': id
		}),
		handleProps: (id) => ({ onPointerDown: onPointerDown(id), onKeyDown: onKeyDown(id) })
	};
}

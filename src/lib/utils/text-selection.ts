/**
 * Reports text selections made inside `node`.
 *
 * With a mouse the menu can follow the selection as it grows. With a
 * finger, the OS shows its own handles and callout and `selectionchange`
 * fires on every drag step, so the report waits until the selection has
 * been still for a moment and the finger has lifted; the position passed
 * is the last line of the selection, so a menu can sit below it, clear of
 * the native callout that appears above.
 */
export interface SelectionReport {
	text: string;
	top: number;
	bottom: number;
	left: number;
	width: number;
	/** The selection was made by touch. */
	touch: boolean;
}

export interface SelectionParams {
	onSelect: (report: SelectionReport) => void;
	onDeselect: () => void;
	/**
	 * Every change of the range, mid-drag included, so a highlight of its own
	 * can follow the drag while the menu waits for it to end. Null when the
	 * selection is empty or has left `node`.
	 */
	onRange?: (range: Range | null) => void;
	/** The settled selection, before it is measured: a chance to round it out to whole objects. */
	settle?: (selection: Selection) => void;
	/** The text of the settled range. `selection.toString()` when absent. */
	read?: (range: Range) => string;
}

export function textSelection(node: HTMLElement, params: SelectionParams) {
	let timer: ReturnType<typeof setTimeout> | null = null;
	let touching = false;
	let lastTouch = false;

	const clear = () => {
		if (timer) clearTimeout(timer);
		timer = null;
	};

	/** The live range, while it is inside `node` and holds something. */
	const current = (): Range | null => {
		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;
		const range = selection.getRangeAt(0);
		return node.contains(range.commonAncestorContainer) ? range : null;
	};

	const report = () => {
		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0 || selection.toString().trim().length === 0) {
			params.onRange?.(null);
			params.onDeselect();
			return;
		}
		if (!node.contains(selection.getRangeAt(0).commonAncestorContainer)) {
			params.onRange?.(null);
			params.onDeselect();
			return;
		}
		params.settle?.(selection);
		const range = selection.getRangeAt(0);
		params.onRange?.(range);

		const rects = Array.from(range.getClientRects());
		const rect = range.getBoundingClientRect();
		const last = rects[rects.length - 1] ?? rect;

		params.onSelect({
			text: params.read?.(range) ?? selection.toString(),
			top: rect.top,
			bottom: last.bottom,
			left: lastTouch ? last.left : rect.left,
			width: lastTouch ? last.width : rect.width,
			touch: lastTouch
		});
	};

	const handleSelection = () => {
		clear();
		// The highlight follows the drag; only the menu waits for it to be over,
		// and a menu left over from the last selection goes as soon as this one
		// starts moving, so it never points at text nobody has selected any more.
		params.onRange?.(current());
		if (touching) {
			params.onDeselect();
			return;
		}
		timer = setTimeout(report, lastTouch ? 250 : 0);
	};

	const onPointerDown = (event: PointerEvent) => {
		lastTouch = event.pointerType === 'touch' || event.pointerType === 'pen';
		touching = true;
		clear();
	};

	const onPointerUp = () => {
		touching = false;
		handleSelection();
	};

	document.addEventListener('selectionchange', handleSelection);
	document.addEventListener('pointerdown', onPointerDown, true);
	document.addEventListener('pointerup', onPointerUp, true);
	document.addEventListener('pointercancel', onPointerUp, true);

	return {
		destroy() {
			clear();
			params.onRange?.(null);
			document.removeEventListener('selectionchange', handleSelection);
			document.removeEventListener('pointerdown', onPointerDown, true);
			document.removeEventListener('pointerup', onPointerUp, true);
			document.removeEventListener('pointercancel', onPointerUp, true);
		}
	};
}

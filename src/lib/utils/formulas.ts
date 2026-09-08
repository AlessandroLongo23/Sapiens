/**
 * A typeset formula is a row of glyph spans, and the browser treats it as
 * one: a drag through it paints a ragged strip, stops halfway down a
 * fraction, and copies `a−n=1an`. Here a formula behaves as a single object.
 * A click takes all of it, a drag that runs into it rounds out to its edges,
 * and what the selection reads back is the LaTeX the lesson was written
 * with, which is what the assistant and the Zaino both understand.
 *
 * The source travels in `data-tex` on the wrapper the server emits; KaTeX's
 * MathML twin no longer carries it (the TeX annotation is stripped so raw
 * LaTeX never lands in the page text).
 */

const FORMULA = '[data-tex]';
const BLOCK = /^(P|DIV|LI|UL|OL|H[1-6]|BLOCKQUOTE|TABLE|TR|PRE|SECTION|FIGURE)$/;

/** The formula around `node`, when there is one inside `root`. */
export function formulaAt(node: Node | null, root: HTMLElement): HTMLElement | null {
	const from = node instanceof Element ? node : (node?.parentElement ?? null);
	const formula = from?.closest<HTMLElement>(FORMULA) ?? null;
	return formula && root.contains(formula) ? formula : null;
}

/** True when the selection was drawn right to left, so rounding it out can keep its direction. */
function isBackwards(selection: Selection): boolean {
	const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
	if (!anchorNode || !focusNode) return false;
	if (anchorNode === focusNode) return anchorOffset > focusOffset;
	return (anchorNode.compareDocumentPosition(focusNode) & Node.DOCUMENT_POSITION_PRECEDING) !== 0;
}

/**
 * Grows a selection that starts or ends inside a formula until it holds the
 * whole formula. Called once the drag is over, never during it: moving the
 * selection under a finger or a held mouse button fights the browser's own
 * drag, and the highlight has been showing the rounded result all along.
 */
export function snapToFormulas(selection: Selection, root: HTMLElement): void {
	if (selection.rangeCount === 0) return;
	const range = selection.getRangeAt(0);
	const start = formulaAt(range.startContainer, root);
	const end = formulaAt(range.endContainer, root);
	if (!start && !end) return;

	const rounded = range.cloneRange();
	if (start) rounded.setStartBefore(start);
	if (end) rounded.setEndAfter(end);
	// Setting back an unchanged range would fire another `selectionchange` for nothing.
	if (
		rounded.startContainer === range.startContainer &&
		rounded.startOffset === range.startOffset &&
		rounded.endContainer === range.endContainer &&
		rounded.endOffset === range.endOffset
	)
		return;

	const back = isBackwards(selection);
	selection.setBaseAndExtent(
		back ? rounded.endContainer : rounded.startContainer,
		back ? rounded.endOffset : rounded.startOffset,
		back ? rounded.startContainer : rounded.endContainer,
		back ? rounded.startOffset : rounded.endOffset
	);
}

/**
 * How the range holds this formula: as the one thing it holds, as part of a
 * longer passage, or not at all. Contact is not overlap, so a selection that
 * stops right before a formula does not light it up.
 */
function held(range: Range, formula: Element): 'alone' | 'part' | null {
	const box = document.createRange();
	box.selectNode(formula);
	// The range's end has to sit past the formula's start, and its start short of the formula's end.
	if (range.compareBoundaryPoints(Range.START_TO_END, box) !== 1) return null;
	if (range.compareBoundaryPoints(Range.END_TO_START, box) !== -1) return null;
	const exact = range.compareBoundaryPoints(Range.START_TO_START, box) === 0 && range.compareBoundaryPoints(Range.END_TO_END, box) === 0;
	return exact ? 'alone' : 'part';
}

/**
 * Marks every formula the range runs through. The stylesheet turns the
 * native highlight off inside a marked formula and draws this one instead,
 * so a formula lights up as one rounded block from the first pixel of the
 * drag that touches it, whole long before the selection is rounded out. A
 * formula held on its own is the one that wears the outline: inside a longer
 * passage it fills flush with the rest and the highlight stays one band.
 */
export function paintFormulas(root: HTMLElement, range: Range | null): void {
	const live = range && !range.collapsed ? range : null;
	for (const formula of root.querySelectorAll<HTMLElement>(FORMULA)) {
		const state = live && held(live, formula);
		if (state) formula.setAttribute('data-picked', state);
		else formula.removeAttribute('data-picked');
	}
}

const childrenText = (node: Node): string => Array.from(node.childNodes, serialize).join('');

function serialize(node: Node): string {
	if (node.nodeType === Node.TEXT_NODE) return node.nodeValue ?? '';
	if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) return childrenText(node);
	if (!(node instanceof Element)) return '';
	const tex = node.getAttribute('data-tex');
	if (tex !== null) return node.hasAttribute('data-block') ? `\n\n$$${tex}$$\n\n` : `$${tex}$`;
	// The MathML twin is the same formula a second time, and a script tag is TikZ source.
	if (node.classList.contains('katex-mathml') || node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return '';
	if (node.tagName === 'BR') return '\n';
	const inner = childrenText(node);
	return BLOCK.test(node.tagName) ? `${inner}\n` : inner;
}

/**
 * The selected passage as markdown: formulas as `$…$`, blocks kept apart by
 * a blank line. A partly selected element is cloned whole with its
 * attributes, so `data-tex` survives even on a range nobody rounded out.
 */
export function rangeToText(range: Range): string {
	return serialize(range.cloneContents())
		.replace(/[ \t]+$/gm, '')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

/** Under this many pixels the pointer was tapping, not dragging a selection or scrolling a wide formula. */
const TAP = 6;

/**
 * A click on a formula selects the whole of it, which is what brings up the
 * assistant's menu above it. A second click on the same one lets it go: the
 * formula that opened the menu is the obvious place to tap to close it.
 */
export function formulaTaps(root: HTMLElement): () => void {
	let x = 0;
	let y = 0;
	let picked: HTMLElement | null = null;

	const down = (event: PointerEvent) => {
		x = event.clientX;
		y = event.clientY;
		// The press itself drops the selection, so "the same formula again" is
		// remembered here instead of being read back off the DOM at click time.
		if (formulaAt(event.target as Node, root) !== picked) picked = null;
	};

	const click = (event: MouseEvent) => {
		const formula = formulaAt(event.target as Node, root);
		if (!formula || Math.abs(event.clientX - x) > TAP || Math.abs(event.clientY - y) > TAP) {
			picked = null;
			return;
		}
		const selection = window.getSelection();
		if (!selection) return;
		selection.removeAllRanges();
		if (picked === formula) {
			picked = null;
			return;
		}
		const range = document.createRange();
		range.selectNode(formula);
		selection.addRange(range);
		picked = formula;
	};

	root.addEventListener('pointerdown', down);
	root.addEventListener('click', click);
	return () => {
		root.removeEventListener('pointerdown', down);
		root.removeEventListener('click', click);
	};
}

/**
 * Copying a passage that holds a formula puts the LaTeX on the clipboard.
 * The glyph spans would paste as `a−n=1an` (and the MathML twin after them),
 * while `$a^{-n}$` pastes into a note as the formula it is.
 */
export function copyAsTex(root: HTMLElement): () => void {
	const copy = (event: ClipboardEvent) => {
		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
		const range = selection.getRangeAt(0);
		if (!root.contains(range.commonAncestorContainer)) return;
		if (!range.cloneContents().querySelector(FORMULA)) return;
		event.clipboardData?.setData('text/plain', rangeToText(range));
		event.preventDefault();
	};
	document.addEventListener('copy', copy);
	return () => document.removeEventListener('copy', copy);
}

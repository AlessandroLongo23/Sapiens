/**
 * Moves the element to the end of `document.body`, so fixed overlays
 * (sheets, dialogs) are stacked above everything on the page no matter how
 * deep in the layout the component that owns them sits. The element is
 * removed again when the component goes away.
 */
export function portal(node: HTMLElement, target: HTMLElement = document.body) {
	target.appendChild(node);
	return {
		destroy() {
			node.remove();
		}
	};
}

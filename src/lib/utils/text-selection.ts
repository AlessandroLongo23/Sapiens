export function textSelection(node, params) {
	const handleSelection = () => {
		const selection = window.getSelection();
		if (!selection || selection.toString().length === 0) {
			params.onDeselect();
			return;
		}

		const range = selection.getRangeAt(0);
		const rect = range.getBoundingClientRect();

		params.onSelect({
			text: selection.toString(),
			top: rect.top,
			left: rect.left,
			width: rect.width
		});
	};

	document.addEventListener('selectionchange', handleSelection);

	return {
		destroy() {
			document.removeEventListener('selectionchange', handleSelection);
		}
	};
}
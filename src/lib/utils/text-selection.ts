export function textSelection(node, params) {
	const handleSelection = () => {
		const selection = window.getSelection();
		if (!selection || selection.toString().length === 0) {
            // Nascondi il menu se non c'è selezione
			params.onDeselect();
			return;
		}

        // Ottieni le coordinate del rettangolo di selezione
		const range = selection.getRangeAt(0);
		const rect = range.getBoundingClientRect();

        // Passa le coordinate e il testo selezionato al componente padre
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
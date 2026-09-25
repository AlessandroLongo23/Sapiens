/**
 * 3D molecules in lessons: a ```molecola3d block is published as its 2D drawing plus the molecule's coordinates
 * (`data-xyz` on the figure, see chemFigure in content/markdown.ts). The button under the drawing swaps it for a
 * ball-and-stick model the student can turn. 3Dmol is bundled (the CSP allows no script CDN) and loaded only on
 * that click.
 */

/** `C 0.000 0.000 0.000; H …` → the XYZ file 3Dmol reads. */
const xyzFile = (atoms: string) => {
	const lines = atoms.split(';').map((a) => a.trim()).filter(Boolean);
	return `${lines.length}\n\n${lines.join('\n')}\n`;
};

export function activate3dModels(root: HTMLElement): () => void {
	const viewers: { clear(): void }[] = [];
	const onClick = async (event: MouseEvent) => {
		const button = (event.target as HTMLElement).closest<HTMLButtonElement>('.chem-3d-button');
		const figure = button?.closest<HTMLElement>('figure[data-xyz]');
		if (!button || !figure || button.disabled) return;
		button.disabled = true;
		button.textContent = 'Carico il modello…';
		try {
			const $3Dmol = await import('3dmol');
			const img = figure.querySelector('img');
			const box = document.createElement('div');
			box.className = 'relative aspect-[4/3] w-[min(360px,100%)] rounded-lg border border-edge bg-surface';
			box.setAttribute('role', 'img');
			box.setAttribute('aria-label', `Modello 3D da ruotare: ${figure.dataset.alt ?? ''}`);
			img?.replaceWith(box);
			const viewer = $3Dmol.createViewer(box, { backgroundAlpha: 0 });
			viewer.addModel(xyzFile(figure.dataset.xyz ?? ''), 'xyz');
			viewer.setStyle({}, { stick: { radius: 0.14 }, sphere: { scale: 0.26 } });
			viewer.zoomTo();
			// zoomTo leaves a wide margin around a small molecule: bring it closer.
			viewer.zoom(1.8);
			viewer.render();
			if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
				viewer.spin('y', 0.5);
				box.addEventListener('pointerdown', () => viewer.spin(false), { once: true });
			}
			viewers.push(viewer);
			button.textContent = 'Trascina per ruotare';
		} catch {
			button.disabled = false;
			button.textContent = 'Il modello non si è caricato: riprova';
		}
	};
	root.addEventListener('click', onClick);
	return () => {
		root.removeEventListener('click', onClick);
		for (const v of viewers) v.clear();
	};
}

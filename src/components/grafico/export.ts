/**
 * The plane as an image to download: the drawing as it is on screen, in its fixed colours on white, as an SVG file
 * or drawn on a canvas at twice the size for a sharp PNG. What is only there for the pointer (hit areas, the label
 * under the mouse) is left out.
 */

function save(blob: Blob, name: string) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = name;
	document.body.append(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** The drawing as a standalone SVG document. */
export function standaloneSvg(svg: SVGSVGElement): { text: string; width: number; height: number } {
	const [, , width, height] = (svg.getAttribute('viewBox') ?? '0 0 800 560').split(' ').map(Number);
	const copy = svg.cloneNode(true) as SVGSVGElement;
	copy.querySelectorAll('[data-export="no"]').forEach((node) => node.remove());
	for (const node of [copy, ...copy.querySelectorAll('*')]) for (const name of ['class', 'style', 'tabindex', 'role', 'aria-label', 'aria-hidden']) node.removeAttribute(name);
	copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
	copy.setAttribute('width', String(width));
	copy.setAttribute('height', String(height));
	const paper = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	paper.setAttribute('width', String(width));
	paper.setAttribute('height', String(height));
	paper.setAttribute('fill', '#ffffff');
	copy.prepend(paper);
	return { text: new XMLSerializer().serializeToString(copy), width, height };
}

export async function downloadPlane(svg: SVGSVGElement, kind: 'svg' | 'png', name = 'grafico') {
	const { text, width, height } = standaloneSvg(svg);
	if (kind === 'svg') {
		save(new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${text}`], { type: 'image/svg+xml' }), `${name}.svg`);
		return;
	}
	const img = new Image();
	const url = URL.createObjectURL(new Blob([text], { type: 'image/svg+xml' }));
	try {
		await new Promise<void>((resolve, reject) => {
			img.onload = () => resolve();
			img.onerror = () => reject(new Error('image'));
			img.src = url;
		});
		const scale = 2;
		const canvas = document.createElement('canvas');
		canvas.width = width * scale;
		canvas.height = height * scale;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		await new Promise<void>((resolve) => canvas.toBlob((blob) => (blob && save(blob, `${name}.png`), resolve()), 'image/png'));
	} finally {
		URL.revokeObjectURL(url);
	}
}

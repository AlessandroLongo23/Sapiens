'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Controls, clamp, num } from '../kit';
import { Contatori, Figura, Frase } from '../informatica';
import { GrigliaPixel, peso } from './multimedia';

/**
 * "Che cosa succede ingrandendo la stessa figura salvata come bitmap e come disegno vettoriale?" The same drawing
 * (a sun behind two mountains) twice: on the left as a grid of 96 × 96 pixels, on the right as its three shapes.
 * The slider enlarges both around the same point: the pixels turn into squares, the shapes are drawn again.
 */

const LATO = 96; // the side of the drawing, in its own units and in pixels of the bitmap
const SFONDO = '#e6f0fa';
/** The shapes, from the one at the back: what the vector file contains, and what the bitmap is sampled from. */
const FORME = [
	{ tipo: 'cerchio', cx: 64, cy: 32, r: 18, colore: '#f5a524' },
	{ tipo: 'poligono', punti: [[6, 86], [38, 26], [70, 86]], colore: '#1f3b5c' },
	{ tipo: 'poligono', punti: [[42, 86], [66, 50], [90, 86]], colore: '#4a7fb5' }
] as const;
/** The point the enlargement closes on: the edge of the sun where it goes behind the mountain. */
const FUOCO = { x: 51, y: 44 };
const MAX = 24;

/** The file of the vector drawing, as it would be written in SVG: its length is its weight in bytes. */
const SVG = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LATO} ${LATO}">`, `<rect width="${LATO}" height="${LATO}" fill="${SFONDO}"/>`, ...FORME.map((f) => (f.tipo === 'cerchio' ? `<circle cx="${f.cx}" cy="${f.cy}" r="${f.r}" fill="${f.colore}"/>` : `<polygon points="${f.punti.map((p) => p.join(',')).join(' ')}" fill="${f.colore}"/>`)), '</svg>'].join('\n');

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

function dentro(f: (typeof FORME)[number], x: number, y: number): boolean {
	if (f.tipo === 'cerchio') return Math.hypot(x - f.cx, y - f.cy) <= f.r;
	// a point is inside a polygon when a ray from it crosses the border an odd number of times
	let inside = false;
	for (let i = 0, j = f.punti.length - 1; i < f.punti.length; j = i++) {
		const [xi, yi] = f.punti[i], [xj, yj] = f.punti[j];
		if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
	}
	return inside;
}

/** The bitmap: each pixel is the mean colour of the drawing over its square, as a program that exports it would compute. */
function campiona(): string[][] {
	const S = 4;
	const colours = [rgb(SFONDO), ...FORME.map((f) => rgb(f.colore))];
	return Array.from({ length: LATO }, (_, r) =>
		Array.from({ length: LATO }, (_, c) => {
			const sum = [0, 0, 0];
			for (let i = 0; i < S; i++) for (let j = 0; j < S; j++) {
				const x = c + (j + 0.5) / S, y = r + (i + 0.5) / S;
				let top = 0;
				FORME.forEach((f, k) => {
					if (dentro(f, x, y)) top = k + 1;
				});
				for (let k = 0; k < 3; k++) sum[k] += colours[top][k];
			}
			return `rgb(${sum.map((s) => Math.round(s / (S * S))).join(',')})`;
		})
	);
}

export default function BitmapVettorialeZoom({ alt }: { alt?: string }) {
	const [zoom, setZoom] = useState(1);
	const pixel = useMemo(() => campiona(), []);
	// the side of each of the two views on the page, followed as the column changes
	const box = useRef<HTMLDivElement>(null);
	const [side, setSide] = useState(150);
	useLayoutEffect(() => {
		const node = box.current;
		if (!node) return;
		const observer = new ResizeObserver(() => setSide(Math.floor(node.clientWidth)));
		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	// the window on the drawing: a square of LATO / zoom units around the focus, kept inside the drawing
	const w = LATO / zoom;
	const x0 = clamp(FUOCO.x - w / 2, 0, LATO - w);
	const y0 = clamp(FUOCO.y - w / 2, 0, LATO - w);
	const px = (side * zoom) / LATO; // how wide a pixel of the bitmap is on the page
	const view = 'relative aspect-square w-full overflow-hidden rounded-sm border border-edge-strong shadow-paper';
	const title = 'label-mono text-center text-fg-subtle';

	return (
		<Figura>
			<div className="grid w-full max-w-md grid-cols-2 gap-3 sm:gap-5" role="group" aria-label={alt ?? 'Lo stesso disegno come bitmap e come disegno vettoriale, ingranditi nello stesso punto'}>
				<div className="flex flex-col gap-1.5">
					<div ref={box} className={view} data-vista="bitmap">
						<div className="absolute" style={{ width: side * zoom + 2, left: (-x0 / LATO) * side * zoom - 1, top: (-y0 / LATO) * side * zoom - 1 }}>
							<GrigliaPixel pixel={pixel} lato={side * zoom + 2} griglia={px >= 7} label={`La bitmap di ${LATO} per ${LATO} pixel, ingrandita ${zoom} volte`} />
						</div>
					</div>
					<span className={title}>bitmap</span>
				</div>
				<div className="flex flex-col gap-1.5">
					<div className={view} data-vista="vettoriale">
						<svg viewBox={`${x0} ${y0} ${w} ${w}`} className="block size-full" role="img" aria-label={`Il disegno vettoriale, ingrandito ${zoom} volte: i bordi restano lisci`}>
							<rect width={LATO} height={LATO} fill={SFONDO} />
							{FORME.map((f, i) => (f.tipo === 'cerchio' ? <circle key={i} cx={f.cx} cy={f.cy} r={f.r} fill={f.colore} /> : <polygon key={i} points={f.punti.map((p) => p.join(',')).join(' ')} fill={f.colore} />))}
						</svg>
					</div>
					<span className={title}>vettoriale</span>
				</div>
			</div>
			<Contatori voci={{ pixel: LATO * LATO, bitmap: peso(LATO * LATO * 24), vettoriale: `${SVG.length} B` }} />
			<Frase tutte={[`Ingrandita 24 volte, la bitmap ha sempre gli stessi ${LATO} · ${LATO} pixel: ognuno è diventato un quadretto di 43 px. Il disegno vettoriale viene ricalcolato dalle sue tre forme, e i bordi restano netti.`]}>
				{zoom === 1
					? `Alla dimensione di partenza le due immagini sembrano uguali: nella bitmap ogni pixel è largo appena ${num(px, 1)} px sullo schermo.`
					: `Ingrandita ${zoom} volte, la bitmap ha sempre gli stessi ${LATO} · ${LATO} pixel: ognuno è diventato un quadretto di ${num(px, 0)} px. Il disegno vettoriale viene ricalcolato dalle sue tre forme, e i bordi restano netti.`}
			</Frase>
			<Controls>
				<Slider label="ingrandimento" value={zoom} min={1} max={MAX} step={1} unit="×" onChange={setZoom} />
			</Controls>
		</Figura>
	);
}

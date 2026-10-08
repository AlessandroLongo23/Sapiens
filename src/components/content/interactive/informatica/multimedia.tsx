'use client';

import { useState, type KeyboardEvent, type PointerEvent } from 'react';
import { clamp } from '../kit';

/**
 * The multimedia pieces of the computer science kit (docs/lezioni/informatica/README.md, "Figure interattive").
 */

/**
 * A bitmap image enlarged until its pixels are squares one can count: `pixel[r][c]` is the colour of the pixel in
 * row r and column c, as a CSS colour. The colours are those of the image and stay the same in the dark theme.
 * With `griglia` the pixels are separated by thin lines (leave it off above 32 pixels a side).
 *
 * With `onPixel` the student colours it: a press or a drag calls it for every pixel touched; from the keyboard the
 * arrows move a mark from pixel to pixel and Space or Enter calls it there.
 */
export function GrigliaPixel({ pixel, lato = 256, griglia = true, onPixel, label }: { pixel: readonly (readonly string[])[]; /** The side of the image on the page, in CSS pixels at most. */ lato?: number; griglia?: boolean; onPixel?: (r: number, c: number) => void; label: string }) {
	const rows = pixel.length;
	const cols = Math.max(1, ...pixel.map((r) => r.length));
	const [at, setAt] = useState<{ r: number; c: number } | null>(null);
	const [last, setLast] = useState('');
	const hit = (e: PointerEvent<SVGSVGElement>) => {
		const box = e.currentTarget.getBoundingClientRect();
		const c = clamp(Math.floor(((e.clientX - box.left) / box.width) * cols), 0, cols - 1);
		const r = clamp(Math.floor(((e.clientY - box.top) / box.height) * rows), 0, rows - 1);
		// once per pixel while the pointer drags over it
		if (`${r},${c}` === last) return;
		setLast(`${r},${c}`);
		onPixel?.(r, c);
	};
	const keys = (e: KeyboardEvent<SVGSVGElement>) => {
		const d = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }[e.key];
		const now = at ?? { r: 0, c: 0 };
		if (d) setAt({ r: clamp(now.r + d[0], 0, rows - 1), c: clamp(now.c + d[1], 0, cols - 1) });
		else if (e.key === ' ' || e.key === 'Enter') {
			setAt(now);
			onPixel?.(now.r, now.c);
		} else return;
		e.preventDefault();
	};
	const lines: string[] = [];
	if (griglia) {
		for (let c = 1; c < cols; c++) lines.push(`M${c},0V${rows}`);
		for (let r = 1; r < rows; r++) lines.push(`M0,${r}H${cols}`);
	}
	return (
		<svg
			viewBox={`0 0 ${cols} ${rows}`}
			width={lato}
			height={(lato * rows) / cols}
			shapeRendering="crispEdges"
			className={onPixel ? 'max-w-full cursor-crosshair rounded-sm border border-edge-strong shadow-paper select-none focus-ring' : 'max-w-full rounded-sm border border-edge-strong shadow-paper select-none'}
			style={{ height: 'auto', touchAction: onPixel ? 'none' : 'pan-y' }}
			role={onPixel ? 'application' : 'img'}
			aria-label={onPixel ? `${label}. Con le frecce ti sposti da un pixel all'altro, con Spazio lo colori.` : label}
			tabIndex={onPixel ? 0 : undefined}
			onKeyDown={onPixel ? keys : undefined}
			onBlur={onPixel ? () => setAt(null) : undefined}
			onPointerDown={
				onPixel
					? (e) => {
							e.currentTarget.setPointerCapture(e.pointerId);
							hit(e);
						}
					: undefined
			}
			onPointerMove={onPixel ? (e) => e.buttons > 0 && hit(e) : undefined}
			onPointerUp={onPixel ? () => setLast('') : undefined}
			data-pixel
		>
			{pixel.map((row, r) => row.map((colore, c) => <rect key={`${r}-${c}`} x={c} y={r} width={1.02} height={1.02} fill={colore} />))}
			{griglia && <path d={lines.join('')} stroke="#808080" strokeOpacity={0.45} strokeWidth={1} vectorEffect="non-scaling-stroke" fill="none" />}
			{at && <rect x={at.c} y={at.r} width={1} height={1} fill="none" stroke="oklch(0.7 0.16 52)" strokeWidth={3} vectorEffect="non-scaling-stroke" />}
		</svg>
	);
}

/** A whole number of bits as the lessons write it: bit up to a byte, then B, kB and MB with at most one decimal (1 kB = 1000 B). */
export function peso(bit: number): string {
	const it = (x: number) => (Math.round(x * 10) / 10).toString().replace('.', ',');
	if (bit < 8 || bit % 8 !== 0) return `${bit} bit`;
	const byte = bit / 8;
	if (byte < 1000) return `${byte} B`;
	if (byte < 1e6) return `${it(byte / 1000)} kB`;
	return `${it(byte / 1e6)} MB`;
}

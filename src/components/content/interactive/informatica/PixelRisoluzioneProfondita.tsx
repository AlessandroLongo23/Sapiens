'use client';

import { useMemo, useState } from 'react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Caption } from '../kit';
import { Contatori, Figura } from '../informatica';
import { GrigliaPixel, peso } from './multimedia';

/**
 * "Che cosa si guadagna e che cosa si paga aumentando la risoluzione o la profondità di colore di un'immagine?"
 * The same picture (a sun over two hills) sampled on a grid of n × n pixels in shades of grey, with the number of
 * bits per pixel the student chooses. The size without compression is n · n · bit.
 */

/** The brightness of the picture at the point (x, y) of the unit square, from 0 (black) to 1 (white). */
function scena(x: number, y: number): number {
	const sun = Math.hypot(x - 0.68, y - 0.3);
	if (sun < 0.17) return 1;
	const near = 0.74 + 0.1 * Math.sin(x * 5.2 + 0.6);
	if (y > near) return 0.08 + 0.1 * (y - near);
	const far = 0.6 + 0.09 * Math.sin(x * 3.4 + 2.4);
	if (y > far) return 0.3;
	// the sky, lighter towards the horizon
	return clamp01(0.46 + 0.4 * y);
}
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** The picture on n × n pixels: each is the mean of the scene over its square, rounded to one of 2^bit greys. */
function campiona(n: number, bit: number): string[][] {
	const levels = 2 ** bit;
	const S = 4;
	return Array.from({ length: n }, (_, r) =>
		Array.from({ length: n }, (_, c) => {
			let sum = 0;
			for (let i = 0; i < S; i++) for (let j = 0; j < S; j++) sum += scena((c + (j + 0.5) / S) / n, (r + (i + 0.5) / S) / n);
			const level = Math.min(levels - 1, Math.floor((sum / (S * S)) * levels));
			const grey = Math.round((level / (levels - 1)) * 255);
			return `rgb(${grey},${grey},${grey})`;
		})
	);
}

const LATI = ['8', '16', '32', '64'] as const;
const BIT = ['1', '2', '4', '8'] as const;

export default function PixelRisoluzioneProfondita({ alt }: { alt?: string }) {
	const [lato, setLato] = useState<(typeof LATI)[number]>('16');
	const [bit, setBit] = useState<(typeof BIT)[number]>('2');
	const n = Number(lato), b = Number(bit);
	const pixel = useMemo(() => campiona(n, b), [n, b]);
	return (
		<Figura>
			<GrigliaPixel pixel={pixel} griglia={n <= 32} lato={288} label={alt ?? `Un sole sopra due colline, in ${n} per ${n} pixel con ${2 ** b} tonalità di grigio`} />
			<Contatori voci={{ pixel: n * n, 'tonalità': 2 ** b, 'senza compressione': peso(n * n * b) }} />
			<Caption>
				{n} · {n} = {n * n} pixel, ognuno scritto con {b} bit: {n * n} · {b} = {n * n * b} bit{n * n * b >= 8 ? `, cioè ${peso(n * n * b)}` : ''}. Con {b} bit si distinguono 2<sup>{b}</sup> = {2 ** b} tonalità di grigio.
			</Caption>
			<div className="flex w-full max-w-md flex-col gap-3">
				<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
					<span className="label-mono text-fg-subtle">Pixel per lato</span>
					<ToggleGroup label="Pixel per lato" compact value={lato} onChange={setLato} options={LATI.map((value) => ({ value, label: value }))} />
				</div>
				<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
					<span className="label-mono text-fg-subtle">Bit per pixel</span>
					<ToggleGroup label="Bit per pixel" compact value={bit} onChange={setBit} options={BIT.map((value) => ({ value, label: value }))} />
				</div>
			</div>
		</Figura>
	);
}

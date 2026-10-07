'use client';

import { useMemo, useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { comprimiImmagine, type Rgb } from '@/lib/informatica/compressione';
import { Caption, Controls, num } from '../kit';
import { Contatori, Figura } from '../informatica';
import { GrigliaPixel } from './multimedia';

/**
 * "Che cosa si perde, e che cosa si risparmia, abbassando la qualità di una compressione con perdita?" The same
 * picture (64 × 64 pixels) beside itself after a compression by blocks of 8 × 8 pixels, the way JPEG works: the
 * slider sets the quality, the counters say how many of the numbers that describe the blocks are left.
 * A simplification, and the caption says so: the three colour channels are treated alike and the size is only
 * estimated from the numbers that are not zero (src/lib/informatica/compressione.ts).
 */

const LATO = 64;
const mix = (a: Rgb, b: Rgb, t: number): Rgb => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/** The colour of the picture at the point (x, y) of the unit square: a kite in the sky over two hills. */
function scena(x: number, y: number): Rgb {
	// the kite: a diamond with sharp edges, and its string
	const kx = Math.abs(x - 0.3) / 0.11, ky = (y - 0.27) / (y < 0.27 ? 0.14 : 0.2);
	if (kx + Math.abs(ky) < 1) return x < 0.3 === y < 0.27 ? [214, 48, 49] : [246, 185, 59];
	if (y > 0.47 && y < 0.8 && Math.abs(x - (0.3 + (y - 0.47) * 0.45)) < 0.006) return [60, 50, 50];
	if (Math.hypot(x - 0.76, y - 0.22) < 0.1) return [255, 236, 170];
	const near = 0.78 + 0.07 * Math.sin(x * 6.1 + 0.4);
	if (y > near) return mix([70, 140, 72], [38, 92, 52], Math.min(1, (y - near) * 5));
	const far = 0.64 + 0.08 * Math.sin(x * 3.6 + 2.2);
	if (y > far) return [112, 168, 110];
	// the sky, lighter towards the horizon
	return mix([64, 132, 214], [190, 224, 246], Math.min(1, y / 0.7));
}

/** The picture on 64 × 64 pixels: each is the mean of the scene over its square. */
function campiona(): Rgb[][] {
	const S = 3;
	return Array.from({ length: LATO }, (_, r) =>
		Array.from({ length: LATO }, (_, c) => {
			const sum = [0, 0, 0];
			for (let i = 0; i < S; i++) for (let j = 0; j < S; j++) scena((c + (j + 0.5) / S) / LATO, (r + (i + 0.5) / S) / LATO).forEach((v, k) => (sum[k] += v));
			return [Math.round(sum[0] / (S * S)), Math.round(sum[1] / (S * S)), Math.round(sum[2] / (S * S))] as const;
		})
	);
}
const css = (image: readonly (readonly Rgb[])[]) => image.map((row) => row.map((p) => `rgb(${p[0]},${p[1]},${p[2]})`));

export default function CompressionePerdita({ alt }: { alt?: string }) {
	const [qualita, setQualita] = useState(50);
	const originale = useMemo(() => campiona(), []);
	const pixelOriginale = useMemo(() => css(originale), [originale]);
	const compressa = useMemo(() => comprimiImmagine(originale, qualita), [originale, qualita]);
	const pixelCompressa = useMemo(() => css(compressa.immagine), [compressa]);
	const quota = (compressa.diversiDaZero / compressa.numeri) * 100;
	const title = 'label-mono text-center text-fg-subtle';
	return (
		<Figura>
			<div className="grid w-full max-w-md grid-cols-2 gap-3 sm:gap-5" role="group" aria-label={alt ?? "La stessa immagine prima e dopo una compressione con perdita"}>
				<div className="flex flex-col items-center gap-1.5">
					<GrigliaPixel pixel={pixelOriginale} griglia={false} lato={224} label="L'immagine di partenza: un aquilone nel cielo sopra due colline, 64 per 64 pixel" />
					<span className={title}>originale</span>
				</div>
				<div className="flex flex-col items-center gap-1.5">
					<GrigliaPixel pixel={pixelCompressa} griglia={false} lato={224} label={`La stessa immagine dopo la compressione con perdita a qualità ${qualita}`} />
					<span className={title}>qualità {qualita}</span>
				</div>
			</div>
			<Contatori voci={{ 'diversi da zero': compressa.diversiDaZero, 'del totale': `${num(quota, quota < 10 ? 1 : 0)}%` }} />
			<Caption>
				Ogni blocco di 8 · 8 pixel è descritto da 64 numeri per colore, dal più grossolano al più fine. A qualità {qualita} ne restano diversi da zero {compressa.diversiDaZero} su {compressa.numeri}: gli altri erano i dettagli più fini, e sono stati buttati via. È una versione semplificata di quello che fa JPEG.
			</Caption>
			<Controls>
				<Slider label="qualità" value={qualita} min={5} max={95} step={5} onChange={setQualita} />
			</Controls>
		</Figura>
	);
}

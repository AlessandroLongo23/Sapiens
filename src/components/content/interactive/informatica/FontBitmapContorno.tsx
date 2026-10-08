'use client';

import { useMemo, useState } from 'react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { ALTA, ERRE, ERRE_BITMAP, LARGA, ingrandisci, punti, rasterizza, tracciato } from '@/lib/informatica/glifi';
import { Caption } from '../kit';
import { Contatori, Figura } from '../informatica';
import { GrigliaPixel } from './multimedia';

/**
 * "Che cosa succede a una lettera quando la ingrandisci, se il font la tiene come griglia di pixel e se la tiene
 * come contorno?" The same capital R at four sizes: on the left the bitmap font, which has one drawing of 8 × 10
 * pixels and can only repeat each pixel; on the right the outline font, which works out the pixels again from the
 * outline at every size. The switch draws the outline and its points over the pixels.
 */
const CORPI = ['10', '20', '40', '80'] as const;
const INCHIOSTRO = '#1c1917';
const CARTA = '#fafaf9';
const colori = (pixel: boolean[][]) => pixel.map((riga) => riga.map((nero) => (nero ? INCHIOSTRO : CARTA)));

export default function FontBitmapContorno({ alt }: { alt?: string }) {
	const [corpo, setCorpo] = useState<(typeof CORPI)[number]>('10');
	const [vista, setVista] = useState<'pixel' | 'contorno'>('pixel');
	const contorno = vista === 'contorno';
	const scala = Number(corpo) / ALTA;
	const bitmap = useMemo(() => colori(ingrandisci(ERRE_BITMAP, scala)), [scala]);
	const vettoriale = useMemo(() => colori(rasterizza(ERRE, scala)), [scala]);
	const griglia = scala <= 4;
	return (
		<Figura>
			<div className="grid w-full max-w-lg grid-cols-2 gap-3 sm:gap-6">
				<figure className="m-0 flex flex-col items-center gap-1.5">
					<GrigliaPixel pixel={bitmap} lato={224} griglia={griglia} label={alt ?? `La R di un font bitmap disegnata per 10 pixel di altezza, mostrata a ${corpo} pixel: ogni suo pixel è un quadrato di ${scala} per ${scala}`} />
					<figcaption className="label-mono text-center text-fg-subtle">Font bitmap</figcaption>
				</figure>
				<figure className="m-0 flex flex-col items-center gap-1.5">
					<div className="relative flex max-w-full">
						<GrigliaPixel pixel={vettoriale} lato={224} griglia={griglia} label={`La R di un font a contorni a ${corpo} pixel di altezza: i pixel sono ricalcolati dal contorno`} />
						{contorno && (
							<svg viewBox={`0 0 ${LARGA} ${ALTA}`} className="pointer-events-none absolute inset-0 size-full" aria-hidden="true" data-contorno>
								<path d={tracciato(ERRE)} fill="none" stroke="oklch(0.7 0.16 52)" strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
								{ERRE.flat().map((p, i) =>
									p.su ? <rect key={i} x={p.x - 0.14} y={p.y - 0.14} width={0.28} height={0.28} fill="#fff" stroke="oklch(0.55 0.16 52)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" /> : <circle key={i} cx={p.x} cy={p.y} r={0.15} fill="oklch(0.7 0.16 52)" stroke="#fff" strokeWidth={1} vectorEffect="non-scaling-stroke" />
								)}
							</svg>
						)}
					</div>
					<figcaption className="label-mono text-center text-fg-subtle">Font a contorni</figcaption>
				</figure>
			</div>
			<Contatori voci={{ 'disegno bitmap': `${LARGA} × ${ALTA}`, 'punti del contorno': punti(ERRE) }} />
			<Caption>
				{scala === 1 ? (
					<>
						A {corpo} pixel di altezza il font bitmap ha il disegno fatto apposta, {LARGA} · {ALTA} = {LARGA * ALTA} pixel accesi o spenti: è nitido quanto si può. Il font a contorni calcola quali pixel cadono dentro il contorno, e con così pochi pixel il risultato è più impastato.
					</>
				) : (
					<>
						A {corpo} pixel di altezza il font bitmap ha ancora solo il disegno da {ALTA}: ogni suo pixel diventa un quadrato di {scala} × {scala}, e le curve restano scalini. Il font a contorni ricalcola dagli stessi {punti(ERRE)} punti quali dei {LARGA * scala} · {ALTA * scala} = {LARGA * scala * ALTA * scala} pixel annerire.
					</>
				)}
			</Caption>
			<div className="flex w-full max-w-md flex-col gap-3">
				<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
					<span className="label-mono text-fg-subtle">Altezza in pixel</span>
					<ToggleGroup label="Altezza della lettera in pixel" compact value={corpo} onChange={setCorpo} options={CORPI.map((value) => ({ value, label: value }))} />
				</div>
				<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
					<span className="label-mono text-fg-subtle">Sul font a contorni</span>
					<ToggleGroup
						label="Che cosa mostrare sul font a contorni"
						compact
						value={vista}
						onChange={setVista}
						options={[
							{ value: 'pixel', label: 'Solo i pixel' },
							{ value: 'contorno', label: 'Il contorno' }
						]}
					/>
				</div>
			</div>
		</Figura>
	);
}

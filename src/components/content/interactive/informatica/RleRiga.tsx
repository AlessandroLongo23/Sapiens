'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { pesoRle, sequenze } from '@/lib/informatica/compressione';
import { ButtonRow, num } from '../kit';
import { Contatori, Figura, Frase } from '../informatica';
import { GrigliaPixel } from './multimedia';

/**
 * "Quando RLE accorcia una riga di pixel, e quando la allunga?" The student colours a row of sixteen pixels; under
 * each run stands its pair (how many, which colour), and the counters weigh the row (one byte per pixel) against
 * its code (two bytes per run). With more than eight runs the code is longer than the row.
 */

/** The colours of the row: the letter the lesson writes for each, its name and the colour of the image. */
const COLORI = [
	{ lettera: 'B', nome: 'bianco', css: '#ffffff' },
	{ lettera: 'N', nome: 'nero', css: '#1f1f1f' },
	{ lettera: 'R', nome: 'rosso', css: '#e5484d' },
	{ lettera: 'V', nome: 'verde', css: '#3d9a50' }
] as const;
type Lettera = (typeof COLORI)[number]['lettera'];
const colore = (lettera: Lettera) => COLORI.find((c) => c.lettera === lettera)!;

const ESEMPI: { nome: string; riga: string }[] = [
	{ nome: 'Bandiera', riga: 'VVVVVVBBBBBRRRRR' },
	{ nome: 'Tinta unita', riga: 'RRRRRRRRRRRRRRRR' },
	{ nome: 'Scacchiera', riga: 'BNBNBNBNBNBNBNBN' }
];
const leggi = (riga: string) => [...riga] as Lettera[];

export default function RleRiga({ alt }: { alt?: string }) {
	// the row of the lesson's worked example
	const [riga, setRiga] = useState<Lettera[]>(leggi('BBBBBBNNNNRRRRBB'));
	const [pennello, setPennello] = useState<Lettera>('N');
	const runs = sequenze(riga);
	const { originale, compressa } = pesoRle(riga);
	const n = runs.length;
	const esito = compressa < originale ? 'meglio' : compressa === originale ? 'pari' : 'peggio';
	const frase =
		esito === 'meglio'
			? `${n === 1 ? 'Una sola sequenza, di due byte' : `${n} sequenze, due byte ciascuna`}: ${n} · 2 = ${compressa} byte al posto di ${originale}. Rapporto di compressione ${originale} : ${compressa} = ${num(originale / compressa)}.`
			: esito === 'pari'
				? `${n} sequenze, due byte ciascuna: ${n} · 2 = ${compressa} byte, quanti ne occupava la riga. Qui RLE non fa guadagnare niente.`
				: `${n} sequenze, due byte ciascuna: ${n} · 2 = ${compressa} byte, più dei ${originale} della riga. Qui RLE peggiora: le sequenze sono troppo corte.`;
	return (
		<Figura>
			<div role="group" aria-label="Il colore con cui dipingi" className="flex flex-wrap items-center justify-center gap-2">
				<span className="label-mono text-fg-subtle">Colore</span>
				{COLORI.map((c) => (
					<button
						key={c.lettera}
						type="button"
						aria-pressed={pennello === c.lettera}
						aria-label={`${c.nome}, lettera ${c.lettera}`}
						title={c.nome}
						onClick={() => setPennello(c.lettera)}
						className={cn('flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] bg-surface py-0 pr-2.5 pl-1.5 font-mono text-sm font-semibold text-fg-strong transition focus-ring', pennello === c.lettera ? 'border-[oklch(0.64_var(--chroma)_var(--hue))] bg-tint-soft ring-[3px] ring-tint/20' : 'border-edge-strong shadow-paper hover:border-fg-faint')}
					>
						<span aria-hidden="true" className="block size-5 rounded-[5px] border border-edge-strong" style={{ background: c.css }} />
						{c.lettera}
					</button>
				))}
			</div>

			<div className="flex w-full max-w-lg flex-col gap-1.5">
				<GrigliaPixel pixel={[riga.map((l) => colore(l).css)]} lato={512} onPixel={(_, c) => setRiga((now) => (now[c] === pennello ? now : now.map((l, i) => (i === c ? pennello : l))))} label={alt ?? `Una riga di ${riga.length} pixel: ${riga.join(' ')}`} />
				{/* the letters of the pixels, each under its own */}
				<div aria-hidden="true" className="grid font-mono text-xs leading-none text-fg-muted sm:text-sm" style={{ gridTemplateColumns: `repeat(${riga.length}, minmax(0, 1fr))` }} data-lettere>
					{riga.map((l, i) => (
						<span key={i} className="text-center">
							{l}
						</span>
					))}
				</div>
				{/* the runs, each as wide as its pixels */}
				<div role="img" aria-label={`La codifica: ${runs.map((s) => `${s.quanti} ${colore(s.simbolo).nome}`).join(', ')}`} className="grid gap-y-1" style={{ gridTemplateColumns: `repeat(${riga.length}, minmax(0, 1fr))` }} data-sequenze>
					{runs.map((s) => (
						<span key={s.da} className="px-px" style={{ gridColumn: `span ${s.quanti}` }}>
							<span className={cn('flex h-7 items-center justify-center overflow-hidden rounded-md border-[1.5px] font-mono leading-none font-semibold tabular-nums', esito === 'peggio' ? 'border-warn-edge bg-warn-soft text-warn-fg' : 'border-[oklch(0.64_var(--chroma)_var(--hue))] bg-tint-soft text-fg-strong', s.quanti === 1 ? 'text-[10px] tracking-tighter sm:text-xs sm:tracking-normal' : 'text-xs sm:text-sm')}>
								{s.quanti}
								{s.simbolo}
							</span>
						</span>
					))}
				</div>
			</div>

			<Contatori voci={{ riga: `${originale} B`, codifica: `${compressa} B`, sequenze: n }} />
			<Frase tutte={[`16 sequenze, due byte ciascuna: 16 · 2 = 32 byte, più dei 16 della riga. Qui RLE peggiora: le sequenze sono troppo corte.`]}>{frase}</Frase>
			<ButtonRow>
				{ESEMPI.map((e) => (
					<Button key={e.nome} variant="secondary" size="sm" onClick={() => setRiga(leggi(e.riga))}>
						{e.nome}
					</Button>
				))}
			</ButtonRow>
		</Figura>
	);
}

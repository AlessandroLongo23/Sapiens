import type { CSSProperties } from 'react';
import { SITE_NAME } from '@/lib/config/site';
import { ELEMENTI, FAMILIES, SERIES_CELLS, TRENDS, gridPlace, trendText, type ChemElement } from '@/lib/tools/tavola-periodica';

const electronegativity = TRENDS.find((t) => t.id === 'elettronegativita')!;

export type SheetVariant = 'colori' | 'bianco-nero';
export const SHEET_VARIANTS: SheetVariant[] = ['colori', 'bianco-nero'];

/** A cell of the sheet's grid; the first column holds the numbers of the periods. */
const place = (row: number, col: number): CSSProperties => ({ gridColumn: col + 1, gridRow: row });

function Cell({ el, colour }: { el: ChemElement; colour: boolean }) {
	// From rutherfordium on the oxidation states are calculations: they stay off the sheet.
	const oxidation = el.oxidationPredicted ? [] : el.oxidation;
	return (
		<div
			className="ptable-cell flex min-w-0 flex-col items-center justify-between overflow-hidden border-[0.2mm] border-black/70 px-[0.5mm] pt-[0.4mm] pb-[0.4mm] leading-none"
			style={colour ? ({ '--pt-fill': `var(--pt-${el.family})` } as CSSProperties) : undefined}
		>
			<div className="flex w-full justify-between font-mono text-[5.4pt]">
				<span className="font-semibold">{el.z}</span>
				<span>{el.electronegativity === null ? '' : trendText(electronegativity, el.electronegativity)}</span>
			</div>
			<div className="font-display text-[12pt] font-semibold">{el.symbol}</div>
			<div className="w-full truncate text-center text-[5pt] leading-tight">{el.name}</div>
			<div className="font-mono text-[5.4pt]">{el.mass}</div>
			{/* Two lines: nitrogen has eight. */}
			<div className="flex h-[9.4pt] w-full items-center justify-center text-center font-mono text-[4.4pt] leading-[4.7pt]">{oxidation.join(' ')}</div>
		</div>
	);
}

/**
 * The periodic table on one A4 sheet, landscape, for the PDF (scripts/tavola-periodica/pdf.mjs) and for printing from
 * the browser. Each cell has the atomic number, the electronegativity, the symbol, the name, the atomic mass and the
 * oxidation numbers; the key in the empty space says which is which. Sizes are in millimetres and points.
 */
export function PeriodicSheet({ variant }: { variant: SheetVariant }) {
	const iron = ELEMENTI[25];
	const colour = variant === 'colori';
	return (
		<main id="ptable-sheet" className="ptable ptable-print mx-auto flex h-[210mm] w-[297mm] flex-col bg-white px-[8mm] pt-[7mm] pb-[6mm] text-black">
			<header className="mb-[2.5mm] flex items-baseline justify-between">
				<h1 className="font-display text-[15pt] font-semibold leading-none">Tavola periodica degli elementi</h1>
				<p className="font-mono text-[6.5pt]">{SITE_NAME}</p>
			</header>

			<div className="grid flex-1 gap-[0.5mm]" style={{ gridTemplateColumns: '3mm repeat(18, minmax(0, 1fr))', gridTemplateRows: '3mm repeat(7, minmax(0, 1fr)) 2.5mm repeat(2, minmax(0, 1fr))' }}>
				{Array.from({ length: 18 }, (_, i) => (
					<span key={i} className="text-center font-mono text-[5.4pt] leading-none" style={place(1, i + 1)}>
						{i + 1}
					</span>
				))}

				{Array.from({ length: 7 }, (_, i) => (
					<span key={i} className="flex items-center font-mono text-[5.4pt] leading-none" style={place(i + 2, 0)}>
						{i + 1}
					</span>
				))}

				{/* The key, in the space above the transition metals. */}
				<div className="flex items-center gap-[5mm] px-[4mm]" style={{ gridColumn: '4 / 14', gridRow: '2 / 5' }}>
					<div className="grid h-[30mm] w-[27mm] shrink-0 [&>div]:border-[0.3mm]">
						<Key el={iron} colour={colour} />
					</div>
					<ul className="flex flex-col gap-[1.1mm] text-[6pt] leading-none">
						<li>In alto a sinistra: numero atomico</li>
						<li>In alto a destra: elettronegatività (Pauling)</li>
						<li>Al centro: simbolo e nome</li>
						<li>Sotto il nome: massa atomica (u)</li>
						<li>In basso: numeri di ossidazione</li>
						<li>[ ] numero di massa dell’isotopo più stabile</li>
					</ul>
					{colour && (
						<ul className="grid grid-cols-2 gap-x-[4mm] gap-y-[1.1mm] text-[6pt] leading-none">
							{FAMILIES.map((f) => (
								<li key={f.id} className="flex items-center gap-[1.2mm]">
									<span className="ptable-cell size-[2.6mm] border-[0.2mm] border-black/70" style={{ '--pt-fill': `var(--pt-${f.id})` } as CSSProperties} />
									{f.name}
								</li>
							))}
						</ul>
					)}
				</div>

				{SERIES_CELLS.map((cell) => (
					<div key={cell.label} className="ptable-cell flex flex-col items-center justify-center gap-[0.8mm] border-[0.2mm] border-dashed border-black/70 leading-none" style={{ ...place(cell.row + 1, cell.col), '--pt-fill': colour ? `var(--pt-${cell.family})` : undefined } as CSSProperties}>
						<span className="font-mono text-[6pt]">{cell.label}</span>
						<span className="text-[4.6pt]">{cell.name}</span>
					</div>
				))}

				{ELEMENTI.map((el) => {
					const { row, col } = gridPlace(el);
					return (
						<div key={el.z} className="grid min-h-0" style={place(row + 1, col)}>
							<Cell el={el} colour={colour} />
						</div>
					);
				})}
			</div>

			<footer className="mt-[2mm] flex justify-between gap-[6mm] text-[5.6pt] leading-tight">
				<p>Masse atomiche: pesi atomici standard IUPAC 2021, arrotondati a due decimali. Elettronegatività e numeri di ossidazione: PubChem, ottobre 2026.</p>
				<p className="shrink-0">Gruppi da 1 a 18 in colonna, periodi da 1 a 7 in riga.</p>
			</footer>
		</main>
	);
}

/** The cell of the key: iron, larger. */
function Key({ el, colour }: { el: ChemElement; colour: boolean }) {
	return (
		<div className="ptable-cell flex flex-col items-center justify-between border-black/70 px-[1mm] py-[0.8mm] leading-none" style={colour ? ({ '--pt-fill': `var(--pt-${el.family})` } as CSSProperties) : undefined}>
			<div className="flex w-full justify-between font-mono text-[8pt]">
				<span className="font-semibold">{el.z}</span>
				<span>{trendText(electronegativity, el.electronegativity!)}</span>
			</div>
			<div className="font-display text-[22pt] font-semibold">{el.symbol}</div>
			<div className="text-[8pt]">{el.name}</div>
			<div className="font-mono text-[8pt]">{el.mass}</div>
			<div className="font-mono text-[7pt]">{el.oxidation.join(' ')}</div>
		</div>
	);
}

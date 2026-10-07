'use client';

import { Fragment, useState } from 'react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { cn } from '@/lib/utils/cn';
import { tracciaCsv, type Separatore } from '@/lib/informatica/csv-campi';
import { ComandiPassi, Figura, Frase, usePassi } from '../informatica';

/**
 * "Dove taglia il programma una riga di un file CSV, e che cosa succede se il separatore non è quello del file?"
 * The file of lesson 80 on the left of the pipeline: a row is read as one text, cut where the separator is, and its
 * fields (numbered from 0, as `campi[0]` in the program) go each into its column of the table. The student chooses
 * the file (whole marks separated by commas, or marks with a decimal comma separated by semicolons) and the
 * character the program cuts at: with the wrong one every row stays in one piece, or a number is cut in two.
 */
const FILE = {
	'voti.csv': 'nome,materia,voto\nAnna,matematica,8\nLuca,fisica,6\nSara,storia,7\n',
	'medie.csv': 'nome;materia;media\nAnna;matematica;8,5\nLuca;fisica;6\nSara;storia;7,25\n'
} as const;
type Nome = keyof typeof FILE;
const NOMI = Object.keys(FILE) as Nome[];
const SEPARATORI: Separatore[] = [',', ';'];
const TRACCE = Object.fromEntries(NOMI.map((nome) => [nome, Object.fromEntries(SEPARATORI.map((s) => [s, tracciaCsv(FILE[nome], s)]))])) as Record<Nome, Record<Separatore, ReturnType<typeof tracciaCsv>>>;
const FRASI = NOMI.flatMap((nome) => SEPARATORI.flatMap((s) => TRACCE[nome][s].passi.map((p) => p.frase)));

const ARANCIO = 'border-[oklch(0.64_var(--chroma)_var(--hue))]';
const ETICHETTA = 'label-mono text-fg-subtle';

/** A row of the file with its separators marked, when the row has been cut. */
function Riga({ testo, separatore, tagliata }: { testo: string; separatore: Separatore; tagliata: boolean }) {
	if (!tagliata) return <>{testo}</>;
	const pezzi = testo.split(separatore);
	return (
		<>
			{pezzi.map((pezzo, i) => (
				<Fragment key={i}>
					{i > 0 && <span className="mx-px rounded-[3px] bg-[oklch(0.75_var(--chroma)_var(--hue))] px-[3px] font-semibold text-ink-950">{separatore}</span>}
					{pezzo}
				</Fragment>
			))}
		</>
	);
}

export default function CsvCampi({ alt }: { alt?: string }) {
	const [nome, setNome] = useState<Nome>('voti.csv');
	const [separatore, setSeparatore] = useState<Separatore>(',');
	const { passi: lista, linee } = TRACCE[nome][separatore];
	const passi = usePassi(lista.length, { ritmo: 2200 });
	const passo = lista[passi.passo];
	// the table as it is at this step: the names of the columns once the header is cut, then the rows cut so far
	const tagliate = linee.map((l) => l.split(separatore));
	const larghezza = Math.max(...tagliate.map((r) => r.length));
	const colonne = Array.from({ length: larghezza }, (_, c) => (passo.intestazione ? (tagliate[0][c] ?? '') : ''));
	const righe = tagliate.slice(1).map((r, i) => Array.from({ length: larghezza }, (_, c) => (i < passo.righeInTabella ? (r[c] ?? '') : '')));
	// the room of the row of fields: that of the step with most of them, so the table under it does not move
	const stretta = larghezza === 1;
	return (
		<Figura>
			<div className="flex w-full flex-wrap items-end justify-center gap-x-5 gap-y-2.5">
				<div className="flex flex-col items-center gap-1">
					<span className={ETICHETTA}>Il file</span>
					<ToggleGroup
						label="Il file da leggere"
						compact
						value={nome}
						onChange={(value) => {
							setNome(value);
							passi.ricomincia();
						}}
						options={NOMI.map((value) => ({ value, label: value }))}
					/>
				</div>
				<div className="flex flex-col items-center gap-1">
					<span className={ETICHETTA}>Il programma taglia a</span>
					<ToggleGroup
						label="Il carattere a cui il programma taglia le righe"
						compact
						value={separatore}
						onChange={(value) => {
							setSeparatore(value);
							passi.ricomincia();
						}}
						options={[
							{ value: ',', label: 'virgola' },
							{ value: ';', label: 'punto e virgola' }
						]}
					/>
				</div>
			</div>

			<div className="flex w-full max-w-md flex-col gap-3" role="group" aria-label={alt ?? 'Un file CSV letto riga per riga e la tabella che si riempie'}>
				{/* the file, row by row */}
				<div className="overflow-hidden rounded-xl border border-edge bg-surface shadow-paper" data-file>
					<div className="border-b border-edge bg-surface-2 px-3 py-1 font-mono text-xs text-fg-muted">{nome}</div>
					<div role="list" className="py-1 font-mono text-[13px] leading-6 [font-variant-ligatures:none]" aria-label={`Le righe del file ${nome}`}>
						{linee.map((linea, i) => {
							const ora = i === passo.riga;
							const fatta = i < passo.riga;
							return (
								<div key={i} role="listitem" aria-current={ora ? 'step' : undefined} className={cn('flex items-baseline gap-2 border-l-[3px] px-2.5 whitespace-pre motion-safe:transition-colors motion-safe:duration-200', ora ? cn(ARANCIO, 'bg-tint-soft text-fg-strong') : 'border-transparent', fatta && 'text-fg-subtle', !ora && !fatta && 'text-fg')}>
									<span aria-hidden="true" className="w-3 shrink-0 text-right text-[11px] text-fg-faint tabular-nums">
										{i + 1}
									</span>
									<span>
										<Riga testo={linea} separatore={separatore} tagliata={ora && passo.tagliata} />
									</span>
								</div>
							);
						})}
					</div>
				</div>

				{/* the fields of the row, numbered from 0 */}
				<div className="flex flex-col items-center gap-1" data-campi>
					<span className={ETICHETTA}>I campi della riga</span>
					<div className="flex min-h-[52px] w-full flex-wrap items-start justify-center gap-x-2 gap-y-1.5" aria-live="off">
						{passo.tagliata ? (
							passo.campi.map((campo, i) => (
								<div key={i} className="flex min-w-0 flex-col items-center gap-1">
									<span className={cn('flex h-8 max-w-full items-center rounded-lg border-[1.5px] px-2 font-mono leading-none font-semibold text-fg-strong', stretta ? 'text-[11.5px]' : 'text-[13px]', passo.storta ? 'border-danger bg-danger-soft' : cn(ARANCIO, 'bg-tint-soft'))}>{campo}</span>
									<span aria-hidden="true" className="font-mono text-[11px] leading-none text-fg-subtle tabular-nums">
										{i}
									</span>
								</div>
							))
						) : (
							<span className="flex h-8 items-center rounded-lg border-[1.5px] border-dashed border-edge-strong px-3 text-xs text-fg-subtle">{passo.riga < 0 ? 'nessuna riga letta' : 'la riga non è ancora tagliata'}</span>
						)}
					</div>
				</div>

				{/* the table that fills */}
				{/* a grid with the roles of a table: inside a lesson the page's own style for tables would win over these classes */}
				<div role="table" aria-label="La tabella con le righe lette finora" className="overflow-hidden rounded-xl border border-edge-strong bg-surface font-mono text-[13px] [font-variant-ligatures:none]" data-tabella>
					<div role="row" className="grid bg-surface-2" style={{ gridTemplateColumns: `repeat(${larghezza}, minmax(0, 1fr))` }}>
						{colonne.map((colonna, c) => (
							<div key={c} role="columnheader" className={cn('flex h-8 min-w-0 items-center border-b border-edge-strong px-2 font-semibold text-fg-strong motion-safe:transition-colors motion-safe:duration-200', c > 0 && 'border-l border-edge', stretta && 'text-[11.5px]', passo.riga === 0 && passo.tagliata && 'bg-tint-soft')}>
								<span className="block truncate">{colonna || '\u00a0'}</span>
							</div>
						))}
					</div>
					{righe.map((riga, r) => (
						<div key={r} role="row" className={cn('grid motion-safe:transition-colors motion-safe:duration-200', r + 1 === passo.riga && passo.tagliata && (passo.storta ? 'bg-danger-soft' : 'bg-tint-soft'))} style={{ gridTemplateColumns: `repeat(${larghezza}, minmax(0, 1fr))` }}>
							{riga.map((cella, c) => (
								<div key={c} role="cell" className={cn('flex h-8 min-w-0 items-center px-2 text-fg', r > 0 && 'border-t border-edge', c > 0 && 'border-l border-edge', stretta && 'text-[11.5px]')}>
									<span className="block truncate">{cella || '\u00a0'}</span>
								</div>
							))}
						</div>
					))}
				</div>
			</div>

			<Frase tutte={FRASI}>{passo.frase}</Frase>
			<ComandiPassi passi={passi} />
		</Figura>
	);
}

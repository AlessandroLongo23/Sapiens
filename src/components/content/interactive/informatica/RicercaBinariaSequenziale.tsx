'use client';

import { useMemo, useState } from 'react';
import { confrontoRicerche, type Riga } from '@/lib/informatica/tracce-ricerca-selezione';
import { Celle, ComandiPassi, Contatori, Dati, Figura, Frase, Legenda, usePassi } from '../informatica';

/**
 * "Sullo stesso vettore ordinato, quanti confronti fa la ricerca sequenziale e quanti la binaria?" The two searches
 * of the same value run side by side, one comparison each per step, with the two counters next to each other: for
 * the last but one of twelve lockers, eleven against three. The figure of lesson 74.
 *
 * The trace is computed once per vector and value (src/lib/informatica/tracce-ricerca-selezione.ts).
 */
const INIZIALI = [3, 8, 12, 17, 21, 26, 34, 40, 47, 52, 59, 63];

function Ricerca({ nome, riga, righe }: { nome: string; riga: Riga; righe: readonly Riga[] }) {
	return (
		<div className="flex w-full flex-col items-center gap-1.5">
			<span className="label-mono text-fg-subtle">{nome}</span>
			<Celle celle={riga.celle} puntatori={riga.puntatori} passi={righe} label={nome} max={44} />
		</div>
	);
}

export default function RicercaBinariaSequenziale() {
	const [valori, setValori] = useState<readonly number[]>(INIZIALI);
	const [cerca, setCerca] = useState(59);
	const { passi: lista } = useMemo(() => confrontoRicerche(valori, cerca), [valori, cerca]);
	const passi = usePassi(lista.length);
	const passo = lista[passi.passo];
	const frasi = useMemo(() => lista.map((p) => p.frase), [lista]);
	const sequenziali = useMemo(() => lista.map((p) => p.sequenziale), [lista]);
	const binarie = useMemo(() => lista.map((p) => p.binaria), [lista]);

	return (
		<Figura>
			<div className="flex w-full flex-col items-center gap-4">
				<div className="flex items-center gap-2" data-cerco>
					<span className="label-mono text-fg-subtle">Cerco</span>
					<span className="flex h-8 min-w-8 items-center justify-center rounded-lg border-[1.5px] border-[oklch(0.64_var(--chroma)_var(--hue))] bg-surface px-1.5 font-mono text-sm leading-none font-semibold text-fg-strong tabular-nums">{cerca}</span>
				</div>
				<Ricerca nome="Ricerca sequenziale" riga={passo.sequenziale} righe={sequenziali} />
				<Ricerca nome="Ricerca binaria" riga={passo.binaria} righe={binarie} />
				<Legenda stati={{ esame: 'guardato adesso', scartata: 'scartato', trovata: 'trovato' }} />
			</div>
			<Frase tutte={frasi}>{passo.frase}</Frase>
			{/* the two counters take the same width, so the line between them is in the middle of the figure */}
			<div className="flex flex-col items-center gap-2 [&_[data-contatore]]:w-32">
				<span className="label-mono text-fg-subtle">Confronti fatti</span>
				<Contatori voci={passo.contatori} />
			</div>
			<ComandiPassi passi={passi} />
			<Dati
				valori={valori}
				onValori={(nuovi) => {
					setValori(nuovi);
					passi.ricomincia();
				}}
				cerca={cerca}
				onCerca={(valore) => {
					setCerca(valore);
					passi.ricomincia();
				}}
				ordinati
			/>
		</Figura>
	);
}

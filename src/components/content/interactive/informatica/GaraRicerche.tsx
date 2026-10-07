'use client';

import { useMemo, useState } from 'react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { ricercaBinaria, ricercaSequenziale } from '@/lib/informatica/tracce';
import { ComandiPassi, Figura, Frase, Legenda, usePassi } from '../informatica';
import { Corsia, Scelta, corridore, ritmoDi } from './gara';

/**
 * "Sullo stesso vettore ordinato, quanti confronti servono alla ricerca sequenziale e quanti alla binaria? E quando
 * gli elementi raddoppiano?" The second race of lesson 78 (inf-confronto-algoritmi): the two searches side by side,
 * one comparison each per tick, for a value at the start, in the middle, at the end, or missing.
 */
const VALORI = [11, 14, 18, 23, 27, 32, 36, 41, 45, 52, 58, 63];
const ASSENTE = 70; // larger than every element: both searches go all the way
type Cerca = 'primo' | 'centrale' | 'ultimo' | 'assente';
type Quanti = '6' | '12';

function gara(n: number, cerca: Cerca) {
	const valori = VALORI.slice(0, n);
	const cercato = { primo: valori[0], centrale: valori[Math.floor((n - 1) / 2)], ultimo: valori[n - 1], assente: ASSENTE }[cerca];
	const sequenziale = ricercaSequenziale(valori, cercato);
	const binaria = ricercaBinaria(valori, cercato);
	const corridori = [corridore('Sequenziale', sequenziale.passi), corridore('Binaria', binaria.passi)];
	const ultimo = Math.max(sequenziale.confronti, binaria.confronti);
	const dove = sequenziale.posizione < 0 ? 'non è nel vettore' : `è all'indice ${sequenziale.posizione}`;
	const testi = Array.from({ length: ultimo + 1 }, (_, t) => {
		if (t === 0) return `Cerco ${cercato} tra ${n} elementi in ordine. La sequenziale parte dall'indice 0, la binaria dal centro: un confronto a testa per passo.`;
		if (t === ultimo) return `${cercato} ${dove}. Per saperlo la sequenziale ha fatto ${sequenziale.confronti} ${sequenziale.confronti === 1 ? 'confronto' : 'confronti'}, la binaria ${binaria.confronti}.`;
		const prima = sequenziale.confronti <= t ? 'la sequenziale' : binaria.confronti <= t ? 'la binaria' : '';
		return `Confronto numero ${t}.${prima ? ` Ha già finito ${prima}.` : ''}`;
	});
	return { cercato, corridori, testi, esito: sequenziale.posizione < 0 ? 'non c’è' : `all'indice ${sequenziale.posizione}` };
}

export default function GaraRicerche() {
	const [quanti, setQuanti] = useState<Quanti>('12');
	const [cerca, setCerca] = useState<Cerca>('ultimo');
	const { cercato, corridori, testi, esito } = useMemo(() => gara(Number(quanti), cerca), [quanti, cerca]);
	const passi = usePassi(testi.length, { ritmo: ritmoDi(testi.length) });
	return (
		<Figura>
			<div className="flex flex-wrap items-end justify-center gap-x-4 gap-y-3">
				<Scelta nome="Il valore cercato">
					<ToggleGroup
						label="Il valore cercato"
						compact
						value={cerca}
						onChange={(value) => {
							setCerca(value);
							passi.ricomincia();
						}}
						options={[
							{ value: 'primo', label: 'Primo' },
							{ value: 'centrale', label: 'Centrale' },
							{ value: 'ultimo', label: 'Ultimo' },
							{ value: 'assente', label: 'Assente' }
						]}
					/>
				</Scelta>
				<Scelta nome="Elementi">
					<ToggleGroup
						label="Numero di elementi"
						compact
						value={quanti}
						onChange={(value) => {
							setQuanti(value);
							passi.ricomincia();
						}}
						options={[
							{ value: '6', label: '6' },
							{ value: '12', label: '12' }
						]}
					/>
				</Scelta>
			</div>
			<div className="flex items-center gap-2" data-cerco>
				<span className="label-mono text-fg-subtle">Cerco</span>
				<span className="flex h-8 min-w-8 items-center justify-center rounded-lg border-[1.5px] border-[oklch(0.64_var(--chroma)_var(--hue))] bg-surface px-1.5 font-mono text-sm leading-none font-semibold text-fg-strong tabular-nums">{cercato}</span>
			</div>
			<div className="flex w-full max-w-xl flex-col gap-2">
				{corridori.map((c) => (
					<Corsia key={c.nome} corridore={c} tick={passi.passo} esito={esito} />
				))}
			</div>
			<Legenda stati={{ esame: 'guardato', scartata: 'scartato', trovata: 'trovato' }} />
			<Frase tutte={testi}>{testi[passi.passo]}</Frase>
			<ComandiPassi passi={passi} />
		</Figura>
	);
}

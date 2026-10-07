'use client';

import { ordinamentoABolle } from '@/lib/informatica/tracce';
import { VettorePassi } from './VettorePassi';

/**
 * "Quanti confronti e quanti scambi fa l'ordinamento a bolle sui sei tempi della lezione, e che cosa risparmia la
 * bandierina?" The figure of lesson 76 (inf-bubble-sort): the vector `tempi` of its program, with `j` and `j+1` on
 * the two neighbours compared, pass after pass. The choice above turns on the flag `scambiato`, which stops the run
 * at the first pass without swaps.
 */
const traccia = (valori: readonly number[], { variante }: { variante: string }) => ordinamentoABolle(valori, { bandierina: variante === 'bandierina' });

export default function BubbleSortGiri({ alt }: { alt?: string }) {
	return (
		<VettorePassi
			alt={alt}
			valori={[15, 12, 19, 13, 17, 14]}
			traccia={traccia}
			varianti={{
				label: "Versione dell'algoritmo",
				opzioni: [
					{ value: 'semplice', label: 'Tutti i giri' },
					{ value: 'bandierina', label: 'Con la bandierina' }
				]
			}}
			legenda={{ confronto: 'confrontati', scambio: 'scambiati', ordinata: 'al suo posto' }}
		/>
	);
}

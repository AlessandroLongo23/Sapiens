'use client';

import { ordinamentoPerSelezione } from '@/lib/informatica/tracce';
import { VettorePassi } from './VettorePassi';

/**
 * "Come fa l'ordinamento per selezione a mettere in ordine un vettore, e quanti confronti e scambi gli servono?"
 * For every place from the left the minimum of what is left is found and swapped there: the comparisons are always
 * n(n − 1)/2, the swaps at most n − 1.
 */
const traccia = (valori: readonly number[]) => ordinamentoPerSelezione(valori);

export default function SelectionSortPassi({ alt }: { alt?: string }) {
	return <VettorePassi alt={alt} valori={[29, 10, 14, 37, 8, 21, 3, 17]} traccia={traccia} legenda={{ esame: 'minimo finora', confronto: 'confrontato', scambio: 'scambiato', ordinata: 'al suo posto' }} />;
}

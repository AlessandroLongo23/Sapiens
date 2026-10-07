'use client';

import { ordinamentoPerSelezioneImin } from '@/lib/informatica/tracce-ricerca-selezione';
import { VettorePassi } from './VettorePassi';

/**
 * "Come fa l'ordinamento per selezione a mettere in ordine sei tempi, e quanti confronti e quanti scambi gli
 * servono?" Fifteen comparisons whatever the order, and a swap only in the turns where the minimum is not already
 * in its place. The figure of lesson 75: the names `i`, `j` and `imin`, the sentences and the order of the steps
 * are those of the program of the lesson (the figure of the kit, inf-selection-sort-passi, calls the index `min`).
 */
const traccia = (valori: readonly number[]) => ordinamentoPerSelezioneImin(valori);

export default function SelectionSortImin({ alt }: { alt?: string }) {
	return <VettorePassi alt={alt} valori={[15, 12, 19, 13, 17, 14]} traccia={traccia} legenda={{ esame: 'minimo finora', confronto: 'confrontato', scambio: 'scambiato', ordinata: 'al suo posto' }} />;
}

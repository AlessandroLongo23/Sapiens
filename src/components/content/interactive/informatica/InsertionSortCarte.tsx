'use client';

import { ordinamentoPerInserimento } from '@/lib/informatica/tracce';
import { VettorePassi } from './VettorePassi';

/**
 * "Dove si ferma ogni carta quando la inserisci tra quelle già in ordine, e quanti elementi deve spostare per farle
 * posto?" The figure of lesson 77 (inf-insertion-sort): the vector `carte` of its program. The element of index `i`
 * is taken out (the variable `x` of the program), the larger ones on its left move one place to the right, and it
 * goes into the place left free; `j` is the index of the element it has just been compared with.
 */
const traccia = (valori: readonly number[]) => ordinamentoPerInserimento(valori);

export default function InsertionSortCarte({ alt }: { alt?: string }) {
	return <VettorePassi alt={alt} valori={[8, 5, 9, 3, 7, 4]} traccia={traccia} legenda={{ sollevata: 'x, da inserire', confronto: 'confrontato', scambio: 'spostato', ordinata: 'in ordine tra loro' }} />;
}

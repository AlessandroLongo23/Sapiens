'use client';

import { ordinamentoPerInserimento } from '@/lib/informatica/tracce';
import { VettorePassi } from './VettorePassi';

/**
 * "Come trova il suo posto ogni elemento nell'ordinamento per inserimento?" The element is taken out of the row,
 * the larger ones on its left move one place to the right, and it goes into the place left free.
 */
const traccia = (valori: readonly number[]) => ordinamentoPerInserimento(valori);

export default function InsertionSortPassi({ alt }: { alt?: string }) {
	return <VettorePassi alt={alt} valori={[12, 25, 7, 31, 18, 3, 21, 14]} traccia={traccia} legenda={{ sollevata: 'da inserire', confronto: 'confrontato', scambio: 'spostato', ordinata: 'in ordine tra loro' }} />;
}

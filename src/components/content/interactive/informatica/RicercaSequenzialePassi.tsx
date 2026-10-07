'use client';

import { ricercaSequenziale } from '@/lib/informatica/tracce';
import { VettorePassi } from './VettorePassi';

/**
 * "Quanti confronti servono per trovare un valore in un vettore, e quanti per sapere che non c'è?" The elements are
 * compared with the value one after the other from index 0; with a value that is not there, all of them are.
 */
const traccia = (valori: readonly number[], { cerca }: { cerca: number }) => ricercaSequenziale(valori, cerca);

export default function RicercaSequenzialePassi({ alt }: { alt?: string }) {
	return <VettorePassi alt={alt} valori={[12, 7, 25, 3, 18, 9, 31, 14]} cerca={18} traccia={traccia} legenda={{ esame: 'in esame', scartata: 'diverso', trovata: 'trovato' }} />;
}

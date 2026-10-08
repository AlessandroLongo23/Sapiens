'use client';

import { ricercaBinaria } from '@/lib/informatica/tracce';
import { VettorePassi } from './VettorePassi';

/**
 * "Quanti elementi deve guardare la ricerca binaria per trovare 21 tra otto numeri in ordine, e quanti per sapere
 * che 30 non c'è?" Three in both cases. The figure of lesson 74, with the lockers of its example and the value its
 * table of trace follows: `sinistra`, `destra` and `centro` are the variables of the program of the lesson.
 */
const traccia = (valori: readonly number[], { cerca }: { cerca: number }) => ricercaBinaria(valori, cerca);

export default function RicercaBinariaArmadietti({ alt }: { alt?: string }) {
	return <VettorePassi alt={alt} valori={[3, 8, 12, 17, 21, 26, 34, 40]} cerca={21} ordinati traccia={traccia} legenda={{ esame: 'al centro', scartata: 'scartato', trovata: 'trovato' }} />;
}

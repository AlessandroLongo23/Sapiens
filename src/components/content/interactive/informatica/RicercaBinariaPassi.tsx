'use client';

import { ricercaBinaria } from '@/lib/informatica/tracce';
import { VettorePassi } from './VettorePassi';

/**
 * "Quanti elementi guarda la ricerca binaria prima di trovare un valore, o di sapere che non c'è?" The vector is
 * kept sorted; every comparison with the element in the middle throws away half of what is left.
 */
const traccia = (valori: readonly number[], { cerca }: { cerca: number }) => ricercaBinaria(valori, cerca);

export default function RicercaBinariaPassi({ alt }: { alt?: string }) {
	return <VettorePassi alt={alt} valori={[3, 8, 12, 17, 21, 26, 34, 40]} cerca={26} ordinati traccia={traccia} legenda={{ esame: 'al centro', scartata: 'scartato', trovata: 'trovato' }} />;
}

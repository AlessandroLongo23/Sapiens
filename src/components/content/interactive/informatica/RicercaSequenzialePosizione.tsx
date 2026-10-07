'use client';

import { ricercaConPosizione } from '@/lib/informatica/tracce-vettori';
import { VettorePassi } from './VettorePassi';

/**
 * "Quanti elementi guarda la ricerca prima di rispondere, e che cosa cambia se il ciclo non si ferma al primo che
 * trova?" The search of the lesson on the vector `arrivi`, with its variable `posizione` beside the count of the
 * comparisons: stopping at the first element found, or going on to the end.
 *
 * RicercaSequenzialePassi.tsx with the names and the sentences of the lesson's program, and the two versions.
 */
const traccia = (valori: readonly number[], { cerca, variante }: { cerca: number; variante: string }) => ricercaConPosizione(valori, cerca, { ferma: variante !== 'avanti' });

export default function RicercaSequenzialePosizione({ alt }: { alt?: string }) {
	return (
		<VettorePassi
			alt={alt}
			valori={[12, 7, 25, 3, 18, 9, 31, 14]}
			cerca={18}
			traccia={traccia}
			varianti={{
				label: 'Quando trova il valore, il ciclo',
				opzioni: [
					{ value: 'ferma', label: 'Si ferma' },
					{ value: 'avanti', label: 'Va avanti' }
				]
			}}
			legenda={{ esame: 'arrivi[i]', scartata: 'diverso', trovata: 'uguale' }}
		/>
	);
}

'use client';

import { ordinamentoABolle } from '@/lib/informatica/tracce';
import { VettorePassi } from './VettorePassi';

/**
 * "Che cosa cambia nell'ordinamento a bolle se ci si ferma al primo giro senza scambi?" Neighbours are compared and
 * swapped pass after pass; the choice above the cells turns the flag on, and the counters show what it saves.
 */
const traccia = (valori: readonly number[], { variante }: { variante: string }) => ordinamentoABolle(valori, { bandierina: variante === 'bandierina' });

export default function BubbleSortPassi({ alt }: { alt?: string }) {
	return (
		<VettorePassi
			alt={alt}
			valori={[5, 2, 9, 12, 7, 15, 18, 21]}
			traccia={traccia}
			varianti={{
				label: 'Versione dell\'algoritmo',
				opzioni: [
					{ value: 'semplice', label: 'Tutti i giri' },
					{ value: 'bandierina', label: 'Con la bandierina' }
				]
			}}
			legenda={{ confronto: 'confrontati', scambio: 'scambiati', ordinata: 'al suo posto' }}
		/>
	);
}

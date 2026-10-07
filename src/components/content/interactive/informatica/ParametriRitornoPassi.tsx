'use client';

import { puntiConRitorno, type Linguaggio } from '@/lib/informatica/tracce-funzioni';
import { ProgrammaPassi } from './ProgrammaPassi';

/**
 * "Quale argomento finisce in quale parametro, e dove va il valore restituito?" Lesson 66: `punti(vinte, pareggi)`
 * called from the main program. The arguments are copied into the parameters by their place, `return` sends one
 * value back and it takes the place of the call. With the arguments swapped the result is wrong and nothing says so.
 */
const traccia = (linguaggio: Linguaggio, variante: 'giusta' | 'scambiata') => puntiConRitorno(linguaggio, variante === 'scambiata');

export default function ParametriRitornoPassi() {
	return (
		<ProgrammaPassi
			traccia={traccia}
			legenda={{ esame: 'appena nata', confronto: 'letta', scambio: 'valore restituito' }}
			varianti={{
				label: 'La chiamata',
				opzioni: [
					{ value: 'giusta', label: 'punti(v, p)' },
					{ value: 'scambiata', label: 'punti(p, v)' }
				]
			}}
		/>
	);
}

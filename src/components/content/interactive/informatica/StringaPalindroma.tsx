'use client';

import { controllaPalindroma } from '@/lib/informatica/tracce-matrici-stringhe';
import { StringaPassi } from './StringaPassi';

/**
 * "Quanti confronti servono per sapere se una parola è palindroma, e quando ci si può fermare?" Two indices walk
 * towards each other on the word of lesson 73, `i` from the first character and `j` from the last: the run stops at
 * the first pair that differs, or when the two meet.
 */
const traccia = (parola: string) => controllaPalindroma(parola);

export default function StringaPalindroma({ alt }: { alt?: string }) {
	return <StringaPassi alt={alt} parola="ossesso" esempi={['radar', 'ossuto', 'anna', 'casa', 'ingegni']} traccia={traccia} ritmo={1500} legenda={{ esame: 'coppia uguale', scambio: 'coppia diversa', ordinata: 'già controllato' }} />;
}

'use client';

import { contaVocali } from '@/lib/informatica/tracce-matrici-stringhe';
import { StringaPassi } from './StringaPassi';

/**
 * "Come fa un programma a contare le vocali di una parola, se può guardare un solo carattere alla volta?" The index
 * `i` goes from 0 to the last character of the word of lesson 73, and the counter goes up at every vowel.
 */
const traccia = (parola: string) => contaVocali(parola);

export default function StringaVocali({ alt }: { alt?: string }) {
	return <StringaPassi alt={alt} parola="informatica" esempi={['aiuola', 'ritmo', 'scuola', 'tre']} traccia={traccia} legenda={{ esame: 'in esame', ordinata: 'vocale contata', scartata: 'non è una vocale' }} />;
}

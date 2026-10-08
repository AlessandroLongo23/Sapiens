'use client';

import { classificaConLinea } from '@/lib/informatica/tracce-funzioni';
import { ProgrammaPassi } from './ProgrammaPassi';

/**
 * "In che ordine vengono eseguite le righe di un programma con una funzione?" Lesson 65: the standings of the
 * tournament with the function `linea`, called twice. The row of the dashes runs twice though it is written once,
 * and each time the flow goes back to the row after the call it came from.
 */
export default function DefinireFunzionePassi() {
	return <ProgrammaPassi traccia={classificaConLinea} />;
}

'use client';

import { useEffect, useState } from 'react';
import type { Passi } from '../informatica';

/**
 * `usePassi` of the kit with one thing more: `parti(k)` goes to step k and walks on from there by itself. A figure
 * needs it when something the student does in the drawing (a click on a button of a page) starts the trace: with
 * `usePassi` going to a step always stops the walk, and `esegui` in the same handler still sees the step before.
 * The rest is the same, so the result goes to <ComandiPassi> as it is.
 */
export function usePassiAvvio(quanti: number, { ritmo = 1100 }: { ritmo?: number } = {}): Passi & { parti: (k?: number) => void } {
	const [stato, setStato] = useState({ at: 0, playing: false });
	const ultimo = Math.max(0, quanti - 1);
	const passo = Math.min(stato.at, ultimo);
	const inCorso = stato.playing && passo < ultimo;
	useEffect(() => {
		if (!inCorso) return;
		const timer = setTimeout(() => setStato({ at: passo + 1, playing: passo + 1 < ultimo }), ritmo);
		return () => clearTimeout(timer);
	}, [inCorso, passo, ultimo, ritmo]);
	const stretto = (k: number) => Math.min(ultimo, Math.max(0, k));
	const vai = (k: number) => setStato({ at: stretto(k), playing: false });
	return {
		passo,
		quanti,
		inCorso,
		inizio: passo === 0,
		fine: passo >= ultimo,
		vai,
		avanti: () => vai(passo + 1),
		indietro: () => vai(passo - 1),
		ricomincia: () => vai(0),
		// from the last step it starts over, as a player does
		esegui: () => setStato(inCorso ? { at: passo, playing: false } : { at: passo >= ultimo ? 0 : passo, playing: true }),
		parti: (k = 0) => setStato({ at: Math.max(0, k), playing: true })
	};
}

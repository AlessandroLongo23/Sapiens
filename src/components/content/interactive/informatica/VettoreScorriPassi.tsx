'use client';

import { useMemo, useState } from 'react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { scorriVettore, type Calcolo } from '@/lib/informatica/tracce-vettori';
import { Celle, ComandiPassi, Dati, Figura, Frase, Legenda, Variabili, usePassi } from '../informatica';

/**
 * "Che cosa cambia, giro dopo giro, mentre un ciclo scorre il vettore? E che cosa succede all'ultimo giro se la
 * condizione è i <= n al posto di i < n?" The loop of the lesson on the vector `voti`, one turn at a time: the
 * index `i` under the cells and, beside it, the variable that the loop builds (the sum, or the largest element).
 * With the mistaken condition the loop runs once more and lands on a cell that is not of the vector.
 */
type Condizione = 'giusta' | 'oltre';

export default function VettoreScorriPassi({ alt }: { alt?: string }) {
	const [valori, setValori] = useState<readonly number[]>([7, 5, 8, 6, 10]);
	const [calcolo, setCalcolo] = useState<Calcolo>('somma');
	const [condizione, setCondizione] = useState<Condizione>('giusta');
	const oltre = condizione === 'oltre';
	const { passi: lista } = useMemo(() => scorriVettore(valori, { calcolo, oltre }), [valori, calcolo, oltre]);
	// the sentences of every version, so that the figure keeps its height when the student changes version
	const frasi = useMemo(() => (['somma', 'massimo'] as const).flatMap((c) => [false, true].flatMap((o) => scorriVettore(valori, { calcolo: c, oltre: o }).passi.map((p) => p.frase))), [valori]);
	const passi = usePassi(lista.length, { ritmo: 1600 });
	const passo = lista[passi.passo];
	const n = valori.length;
	return (
		<Figura>
			<div className="flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-2">
				<ToggleGroup
					label="Che cosa calcola il ciclo"
					compact
					value={calcolo}
					onChange={(value) => {
						setCalcolo(value);
						passi.ricomincia();
					}}
					options={[
						{ value: 'somma', label: 'Somma' },
						{ value: 'massimo', label: 'Massimo' }
					]}
				/>
				<ToggleGroup
					label="La condizione del ciclo"
					compact
					value={condizione}
					onChange={(value) => {
						setCondizione(value);
						passi.ricomincia();
					}}
					options={[
						{ value: 'giusta', label: `i < ${n}` },
						{ value: 'oltre', label: `i <= ${n}` }
					]}
				/>
			</div>
			<div className="flex w-full flex-col items-center gap-3">
				<Celle celle={passo.celle} puntatori={passo.puntatori} passi={lista} label={alt ?? 'Il vettore voti'} />
				<Legenda stati={{ esame: 'voti[i]', ordinata: 'già guardato', ...(oltre ? { scartata: 'fuori dal vettore' } : {}) }} />
			</div>
			<Variabili
				variabili={[
					// before the loop `i` has no value yet: its box is there all the same, so nothing moves at the first turn
					...(passo.variabili.some((v) => v.nome === 'i') ? [] : [{ nome: 'i', valore: '' }]),
					...passo.variabili
				].sort((a, b) => Number(b.nome === 'i') - Number(a.nome === 'i'))}
			/>
			<Frase tutte={frasi}>{passo.frase}</Frase>
			<ComandiPassi passi={passi} />
			<Dati
				valori={valori}
				max={8}
				onValori={(nuovi) => {
					setValori(nuovi);
					passi.ricomincia();
				}}
			/>
		</Figura>
	);
}

'use client';

import { useState } from 'react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import type { PassoPila, Variabile } from '@/lib/informatica/tracce';
import { ComandiPassi, Figura, Frase, Pila, usePassi } from '../informatica';

/**
 * "Perché una funzione che scambia i suoi due parametri non scambia le variabili di chi la chiama, se li riceve per
 * valore?" The stack of the calls while `main` calls `scambia(a, b)`: by value the parameters are copies, born and
 * gone with the call; by reference they are other names of `a` and `b`.
 *
 * The example of how <Pila> is used: a trace of stacks written by hand, one per step. No code is shown, so that it
 * holds in C++ and in Python (where the same thing happens with the elements of a list).
 */
function traccia(riferimento: boolean): PassoPila[] {
	const A = 3, B = 8;
	type Stato = Variabile['stato'];
	const main = (a: number, b: number, sa?: Stato, sb?: Stato) => ({ nome: 'main', variabili: [{ nome: 'a', valore: a, stato: sa }, { nome: 'b', valore: b, stato: sb }] });
	const scambia = (x: number, y: number, tmp: number | null, sx?: Stato, sy?: Stato, st?: Stato) => ({
		nome: 'scambia',
		variabili: [
			{ nome: 'x', valore: x, stato: sx, rif: riferimento ? 'a di main' : undefined },
			{ nome: 'y', valore: y, stato: sy, rif: riferimento ? 'b di main' : undefined },
			...(tmp === null ? [] : [{ nome: 'tmp', valore: tmp, stato: st }])
		]
	});
	// what main holds while scambia runs: by reference, writing x or y writes a or b
	const a = (x: number) => (riferimento ? x : A);
	const b = (y: number) => (riferimento ? y : B);
	return [
		{ pila: [main(A, B)], frase: `main ha due variabili: a vale ${A} e b vale ${B}. Ora chiama scambia(a, b).` },
		{
			pila: [main(A, B, 'letta', 'letta'), scambia(A, B, null, 'nuova', 'nuova')],
			frase: riferimento
				? 'La chiamata apre un riquadro per scambia, sopra quello di main. I parametri x e y non sono variabili nuove: sono altri due nomi per a e b di main.'
				: 'La chiamata apre un riquadro per scambia, sopra quello di main. I parametri x e y sono variabili nuove, che nascono con una copia dei valori di a e b.'
		},
		{ pila: [main(A, B), scambia(A, B, A, 'letta', 'normale', 'nuova')], frase: `Nasce la variabile locale tmp, che prende il valore di x: ${A}.` },
		{
			pila: [main(a(B), B, riferimento ? 'scritta' : 'normale'), scambia(B, B, A, 'scritta', 'letta')],
			frase: riferimento ? `x prende il valore di y, ${B}. Ma x è un altro nome di a: anche in main ora a vale ${B}.` : `x prende il valore di y, ${B}. Cambia solo la copia: in main a vale ancora ${A}.`
		},
		{
			pila: [main(a(B), b(A), 'normale', riferimento ? 'scritta' : 'normale'), scambia(B, A, A, 'normale', 'scritta', 'letta')],
			frase: riferimento ? `y prende il valore di tmp, ${A}, e con y cambia b di main. Lo scambio è fatto dove serviva.` : `y prende il valore di tmp, ${A}. Dentro scambia x e y sono scambiate; in main non è cambiato niente.`
		},
		{
			pila: [main(a(B), b(A))],
			frase: riferimento
				? `scambia finisce e il suo riquadro sparisce, con i nomi x e y e con tmp. In main a vale ${B} e b vale ${A}: sono state scambiate.`
				: `scambia finisce e il suo riquadro sparisce, con x, y e tmp. In main a vale ancora ${A} e b vale ancora ${B}: la funzione ha lavorato sulle copie.`
		}
	];
}
const TRACCE = { valore: traccia(false), riferimento: traccia(true) };

export default function ScambiaValoreRiferimento() {
	const [modo, setModo] = useState<keyof typeof TRACCE>('valore');
	const lista = TRACCE[modo];
	const passi = usePassi(lista.length, { ritmo: 2200 });
	const passo = lista[passi.passo];
	return (
		<Figura>
			<ToggleGroup
				label="Come scambia riceve i parametri"
				compact
				value={modo}
				onChange={(value) => {
					setModo(value);
					passi.ricomincia();
				}}
				options={[
					{ value: 'valore', label: 'Per valore' },
					{ value: 'riferimento', label: 'Per riferimento' }
				]}
			/>
			<Pila pila={passo.pila} passi={lista.map((p) => p.pila)} />
			<Frase tutte={[...TRACCE.valore, ...TRACCE.riferimento].map((p) => p.frase)}>{passo.frase}</Frase>
			<ComandiPassi passi={passi} />
		</Figura>
	);
}

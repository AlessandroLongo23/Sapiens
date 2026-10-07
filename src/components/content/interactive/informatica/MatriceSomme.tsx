'use client';

import { useState } from 'react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { passoDi, sommeMatrice } from '@/lib/informatica/tracce-matrici-stringhe';
import { ComandiPassi, Figura, Frase, Legenda, Matrice, Variabili, usePassi } from '../informatica';

/**
 * "In che ordine due cicli annidati visitano gli elementi di una matrice, e che cosa cambia tra sommare per righe e
 * sommare per colonne?" The marks of lesson 72 walked by the two loops: `i` and `j` move beside the matrix, `somma`
 * grows with every element and starts again from 0 at every row (or column), and each finished sum is written.
 * Touching a mark jumps to the step in which it is added.
 */
const VOTI = [
	[7, 8, 6, 9],
	[5, 6, 7, 6],
	[8, 9, 9, 10]
];
const TRACCE = { righe: sommeMatrice(VOTI, 'righe', 'voti').passi, colonne: sommeMatrice(VOTI, 'colonne', 'voti').passi };
const FRASI = [...TRACCE.righe, ...TRACCE.colonne].map((p) => p.frase);

export default function MatriceSomme({ alt }: { alt?: string }) {
	const [verso, setVerso] = useState<keyof typeof TRACCE>('righe');
	const lista = TRACCE[verso];
	const passi = usePassi(lista.length, { ritmo: 1300 });
	const passo = lista[passi.passo];
	return (
		<Figura>
			<ToggleGroup
				label="Come si sommano i voti"
				compact
				value={verso}
				onChange={(value) => {
					setVerso(value);
					passi.ricomincia();
				}}
				options={[
					{ value: 'righe', label: 'Per righe' },
					{ value: 'colonne', label: 'Per colonne' }
				]}
			/>
			<div className="flex w-full flex-col items-center gap-3">
				<Matrice
					valori={VOTI}
					label={alt ?? 'La matrice voti'}
					stato={(r, c) => passo.stati[r][c]}
					riga={{ nome: 'i', su: passo.i ?? -1 }}
					colonna={{ nome: 'j', su: passo.j ?? -1 }}
					onCella={(r, c) => passi.vai(passoDi(lista, r, c))}
				/>
				<Legenda stati={{ esame: 'aggiunto adesso', confronto: 'già sommato', ordinata: verso === 'righe' ? 'riga finita' : 'colonna finita' }} />
			</div>
			<div className="flex w-full flex-wrap items-start justify-center gap-x-8 gap-y-3">
				<Variabili
					variabili={[
						{ nome: 'i', valore: passo.i ?? '', stato: passo.i === null ? 'normale' : 'letta' },
						{ nome: 'j', valore: passo.j ?? '', stato: passo.j === null ? 'normale' : 'letta' },
						{ nome: 'somma', valore: passo.somma ?? '', stato: passo.scritta === 'somma' ? 'scritta' : 'normale' }
					]}
				/>
				<div className="flex flex-col items-center gap-1" data-uscita>
					<div className="flex h-10 min-w-36 items-center justify-center gap-3 rounded-lg border border-edge bg-surface-2 px-3 font-mono text-[15px] leading-none font-semibold text-fg-strong tabular-nums" aria-live="polite" aria-label={`Il programma ha scritto: ${passo.uscita.join(', ') || 'niente'}`}>
						{passo.uscita.map((somma, k) => (
							<span key={k}>{somma}</span>
						))}
					</div>
					<div className="text-xs leading-none text-fg-muted">scritto finora</div>
				</div>
			</div>
			<Frase tutte={FRASI}>{passo.frase}</Frase>
			<ComandiPassi passi={passi} />
		</Figura>
	);
}

'use client';

import { useState } from 'react';
import { Figura, Frase, Matrice, Variabili } from '../informatica';

/**
 * "Con quali due indici si scrive un elemento di una matrice, e quale dei due viene prima?" The marks of three
 * students in four tests (lesson 72): the student touches a mark and reads its row index `i`, its column index `j`
 * and the expression `voti[i][j]`, with the whole row and the whole column lit so that the two are seen crossing.
 */
const VOTI = [
	[7, 8, 6, 9],
	[5, 6, 7, 6],
	[8, 9, 9, 10]
];
const ORDINALE = ['prima', 'seconda', 'terza', 'quarta'];
const frase = (r: number, c: number) => `voti[${r}][${c}] vale ${VOTI[r][c]}: sta nella riga di indice ${r}, che è la ${ORDINALE[r]}, e nella colonna di indice ${c}, che è la ${ORDINALE[c]}. Prima la riga, poi la colonna.`;
const FRASI = VOTI.flatMap((row, r) => row.map((_, c) => frase(r, c)));

export default function MatriceIndici({ alt }: { alt?: string }) {
	const [{ r, c }, setCella] = useState({ r: 1, c: 2 });
	return (
		<Figura>
			<div className="flex w-full flex-col items-center gap-2">
				<div className="label-mono text-fg-subtle">Tocca un voto</div>
				<Matrice
					valori={VOTI}
					label={alt ?? 'La matrice voti'}
					stato={(x, y) => (x === r && y === c ? 'esame' : x === r || y === c ? 'confronto' : 'normale')}
					riga={{ nome: 'i', su: r }}
					colonna={{ nome: 'j', su: c }}
					onCella={(x, y) => setCella({ r: x, c: y })}
				/>
			</div>
			<Variabili
				label="Gli indici e l'elemento"
				variabili={[
					{ nome: 'i', valore: r, stato: 'letta' },
					{ nome: 'j', valore: c, stato: 'letta' },
					{ nome: `voti[${r}][${c}]`, valore: VOTI[r][c], stato: 'nuova' }
				]}
			/>
			<Frase tutte={FRASI}>{frase(r, c)}</Frase>
		</Figura>
	);
}

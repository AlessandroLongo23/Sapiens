'use client';

import { useState, type ReactNode } from 'react';
import type { Cella, Stato } from '@/lib/informatica/tracce';
import { Celle, Contatori, Figura, Legenda, Matrice, Stringa, Variabili } from '../informatica';
import { GrigliaPixel } from './multimedia';

/**
 * Not a figure for a lesson: the pieces of informatica.tsx side by side, to see them all at once in light, in dark
 * and on a phone (`figura=inf-kit-campionario`) after changing one.
 */
const STATI: Stato[] = ['normale', 'esame', 'confronto', 'scambio', 'ordinata', 'trovata', 'scartata', 'sollevata'];
const CELLE: Cella[] = STATI.map((stato, id) => ({ id, valore: [12, 7, 25, 3, 18, 9, 31, 14][id], stato }));
const DODICI: Cella[] = Array.from({ length: 12 }, (_, id) => ({ id, valore: (id * 37 + 11) % 100, stato: id === 4 ? 'esame' : id === 9 ? 'confronto' : id < 2 ? 'ordinata' : 'normale' }));
const MATRICE = [
	[4, 9, 2, 7],
	[3, 5, 7, 1],
	[8, 1, 6, 0]
];

function Pezzo({ titolo, children }: { titolo: string; children: ReactNode }) {
	return (
		<div className="flex w-full flex-col items-center gap-2.5">
			<div className="label-mono text-fg-subtle">{titolo}</div>
			{children}
		</div>
	);
}

export default function Campionario() {
	const [cella, setCella] = useState({ r: 1, c: 2 });
	const [lettera, setLettera] = useState(5);
	const [bit, setBit] = useState(() => ['00111100', '01000010', '10100101', '10000001', '10100101', '10011001', '01000010', '00111100'].map((row) => [...row].map(Number)));
	return (
		<Figura>
			<Pezzo titolo="Celle: gli otto stati, puntatori sotto e sopra">
				<Celle
					celle={CELLE}
					puntatori={[
						{ nome: 'i', su: 1 },
						{ nome: 'min', su: 1 },
						{ nome: 'sinistra', su: 5 },
						{ nome: 'destra', su: 6 },
						{ nome: 'centro', su: 3, lato: 'sopra' }
					]}
				/>
				<Legenda stati={Object.fromEntries(STATI.map((s) => [s, true]))} />
			</Pezzo>
			<Pezzo titolo="Celle: dodici elementi">
				<Celle celle={DODICI} puntatori={[{ nome: 'i', su: 4 }, { nome: 'j', su: 9 }]} />
			</Pezzo>
			<Pezzo titolo="Stringa: tocca un carattere">
				<Stringa testo="CIAO MONDO" stato={(i) => (i === lettera ? 'esame' : i < lettera ? 'scartata' : 'normale')} puntatori={[{ nome: 'i', su: lettera }]} onCella={(i) => setLettera(i)} />
			</Pezzo>
			<Pezzo titolo="Matrice: tocca una cella">
				<Matrice valori={MATRICE} stato={(r, c) => (r === cella.r && c === cella.c ? 'esame' : r === cella.r || c === cella.c ? 'confronto' : 'normale')} riga={{ nome: 'i', su: cella.r }} colonna={{ nome: 'j', su: cella.c }} onCella={(r, c) => setCella({ r, c })} />
			</Pezzo>
			<Pezzo titolo="Pixel: tocca o trascina per cambiarli">
				<GrigliaPixel pixel={bit.map((row) => row.map((x) => (x ? '#16181d' : '#ffffff')))} lato={176} label="Una faccina di 8 per 8 pixel, in bianco e nero" onPixel={(r, c) => setBit(bit.map((row, i) => row.map((x, j) => (i === r && j === c ? 1 - x : x))))} />
				<div className="font-mono text-xs leading-tight text-fg-muted" data-bit>
					{bit.map((row, i) => (
						<div key={i}>{row.join(' ')}</div>
					))}
				</div>
			</Pezzo>
			<Pezzo titolo="Variabili e contatori">
				<Variabili
					variabili={[
						{ nome: 'somma', valore: 42 },
						{ nome: 'i', valore: 3, stato: 'letta' },
						{ nome: 'max', valore: 31, stato: 'scritta' },
						{ nome: 'trovato', valore: 'falso', stato: 'nuova' },
						{ nome: 'x', valore: 7, rif: 'a di main' }
					]}
				/>
				<Contatori voci={{ confronti: 28, scambi: 5, passi: 44 }} />
			</Pezzo>
		</Figura>
	);
}

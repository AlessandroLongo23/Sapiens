'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Cella } from '@/lib/informatica/tracce';
import { Celle, Figura, Frase, Legenda, Variabili } from '../informatica';

/**
 * "In un vettore di cinque elementi, quale elemento è voti[3]? E che cosa c'è in voti[5]?" The student moves the
 * index `i` along the vector `voti` of the lesson (or touches a cell), reads `voti[i]`, and can add 1 to it: only
 * that element changes. One step past the last index there is a cell that is not of the vector: nothing to read.
 */
const VOTI = [7, 5, 8, 6, 10];
const N = VOTI.length;

function frase(i: number, voti: readonly number[]) {
	if (i >= N) return `voti[${N}] non esiste: gli indici di un vettore di ${N} elementi vanno da 0 a ${N - 1}. La dimensione non è un indice valido.`;
	const quale = i === 0 ? 'il primo elemento: gli indici si contano da 0' : i === N - 1 ? `l'ultimo elemento: il suo indice è ${N} - 1` : `l'elemento di indice ${i}, cioè il ${['primo', 'secondo', 'terzo', 'quarto', 'quinto'][i]} della fila`;
	return `voti[${i}] è ${quale}. Vale ${voti[i]}.`;
}
// the longest sentences the figure can say, for a height that does not change
const FRASI = [frase(N, VOTI), frase(2, VOTI), frase(N - 1, [10, 10, 10, 10, 10])];

export default function VettoreIndiceElemento({ alt }: { alt?: string }) {
	const [voti, setVoti] = useState<readonly number[]>(VOTI);
	const [i, setI] = useState(3);
	const fuori = i >= N;
	const celle: Cella[] = [...voti.map((valore, id): Cella => ({ id, valore, stato: id === i ? 'esame' : 'normale' })), { id: N, valore: '?', stato: fuori ? 'esame' : 'scartata' }];
	const cambiato = voti.some((v, k) => v !== VOTI[k]);
	return (
		<Figura>
			<div className="flex w-full flex-col items-center gap-3">
				<Celle celle={celle} puntatori={[{ nome: 'i', su: i }]} label={alt ?? 'Il vettore voti'} onCella={(k) => setI(k)} />
				<Legenda stati={{ esame: 'voti[i]', scartata: 'fuori dal vettore' }} />
			</div>
			<Variabili
				variabili={[
					{ nome: 'i', valore: i },
					{ nome: `voti[${i}]`, valore: fuori ? '?' : voti[i], stato: 'nuova' }
				]}
			/>
			<Frase tutte={FRASI}>{frase(i, voti)}</Frase>
			<div className="flex flex-col items-center gap-1.5" role="group" aria-label="Cambia l'indice o l'elemento">
				<div className="flex items-center justify-center gap-1.5">
					<Button variant="secondary" size="sm" disabled={i === 0} onClick={() => setI(i - 1)}>
						<ChevronLeft className="size-3.5" aria-hidden="true" />i - 1
					</Button>
					<Button variant="secondary" size="sm" disabled={fuori} onClick={() => setI(i + 1)}>
						i + 1
						<ChevronRight className="size-3.5" aria-hidden="true" />
					</Button>
				</div>
				<div className="flex items-center justify-center gap-1.5">
					<Button variant="secondary" size="sm" disabled={fuori || voti[i] >= 10} onClick={() => setVoti(voti.map((v, k) => (k === i ? v + 1 : v)))} className="font-mono">
						voti[i] = voti[i] + 1
					</Button>
					<Button variant="secondary" size="sm" disabled={!cambiato} onClick={() => setVoti(VOTI)} aria-label="Rimetti i voti di partenza" title="Rimetti i voti di partenza">
						<RotateCcw className="size-3.5" aria-hidden="true" />
					</Button>
				</div>
			</div>
		</Figura>
	);
}

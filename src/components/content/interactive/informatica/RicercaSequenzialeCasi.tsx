'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Cella } from '@/lib/informatica/tracce';
import { confrontiPerTrovare } from '@/lib/informatica/tracce-vettori';
import { Celle, Contatori, Figura, Frase, Legenda } from '../informatica';

/**
 * "Quanti confronti fa la ricerca sequenziale, a seconda del posto in cui sta il valore cercato?" The student
 * touches the cell where the value is, or says that it is not there, and changes the size of the vector: the count
 * goes from 1 (the first cell, the best case) to n (the last cell, or no cell: the worst case).
 */
const VALORI = [12, 7, 25, 3, 18, 9, 31, 14, 40, 22, 5, 36];
const MIN = 2;
const MAX = VALORI.length;

function frase(n: number, dove: number) {
	const confronti = confrontiPerTrovare(n, dove);
	if (dove < 0) return `Il valore non c'è: per saperlo la ricerca deve guardare tutti gli elementi. Sono ${confronti} confronti, uno per elemento: è il caso peggiore.`;
	if (dove === 0) return `Il valore è all'indice 0: lo trova al primo confronto. È il caso migliore, e non dipende da quanti elementi ha il vettore.`;
	if (dove === n - 1) return `Il valore è all'indice ${dove}, l'ultimo: la ricerca guarda tutti gli elementi, ${confronti} confronti. È il caso peggiore, come quando il valore non c'è.`;
	const prima = dove === 1 ? "l'elemento che lo precede" : `i ${dove} elementi che lo precedono`;
	return `Il valore è all'indice ${dove}: la ricerca guarda prima ${prima}, poi lo trova. Sono ${confronti} confronti, uno più dell'indice.`;
}
const FRASI = [frase(MAX, -1), frase(MAX, MAX - 1), frase(MAX, MAX - 2), frase(MAX, 0)];

export default function RicercaSequenzialeCasi({ alt }: { alt?: string }) {
	const [n, setN] = useState(8);
	// the index of the cell that holds the value, or -1 when it is not in the vector
	const [dove, setDove] = useState(4);
	const celle: Cella[] = VALORI.slice(0, n).map((valore, id) => ({ id, valore, stato: dove < 0 || id < dove ? 'scartata' : id === dove ? 'trovata' : 'normale' }));
	const cambia = (nuovo: number) => {
		setN(nuovo);
		if (dove >= nuovo) setDove(nuovo - 1);
	};
	return (
		<Figura>
			<div className="flex w-full flex-col items-center gap-3">
				<div className="label-mono text-center text-fg-subtle">Tocca la cella dove sta il valore cercato</div>
				{/* the cells shrink as the vector grows: the row keeps the height of the largest */}
				<div className="flex min-h-[92px] w-full items-center">
					<Celle celle={celle} puntatori={dove >= 0 ? [{ nome: 'i', su: dove }] : []} passi={[{ celle, puntatori: [{ nome: 'i', su: 0 }] }]} label={alt ?? 'Il vettore'} onCella={(k) => setDove(k)} />
				</div>
				<Legenda stati={{ scartata: 'diverso', trovata: 'uguale', normale: 'non guardato' }} />
			</div>
			<Contatori voci={{ confronti: confrontiPerTrovare(n, dove), 'caso migliore': 1, 'caso peggiore': n }} />
			<Frase tutte={FRASI}>{frase(n, dove)}</Frase>
			<div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
				<Button variant={dove < 0 ? 'primary' : 'secondary'} size="sm" aria-pressed={dove < 0} onClick={() => setDove(dove < 0 ? n - 1 : -1)}>
					Il valore non c&apos;è
				</Button>
				<div className="flex items-center gap-1.5" role="group" aria-label="Quanti elementi ha il vettore">
					<Button variant="secondary" size="sm" disabled={n <= MIN} onClick={() => cambia(n - 1)} aria-label="Un elemento in meno" title="Un elemento in meno">
						<Minus className="size-3.5" aria-hidden="true" />
					</Button>
					<span className="label-mono min-w-24 text-center text-fg-subtle tabular-nums">{n} elementi</span>
					<Button variant="secondary" size="sm" disabled={n >= MAX} onClick={() => cambia(n + 1)} aria-label="Un elemento in più" title="Un elemento in più">
						<Plus className="size-3.5" aria-hidden="true" />
					</Button>
				</div>
			</div>
		</Figura>
	);
}

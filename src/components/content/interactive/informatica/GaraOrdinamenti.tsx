'use client';

import { useMemo, useState } from 'react';
import { Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { casuale, mescola, ordinamentoABolle, ordinamentoPerInserimento, ordinamentoPerSelezione } from '@/lib/informatica/tracce';
import { ComandiPassi, Figura, Frase, Legenda, usePassi } from '../informatica';
import { Corsia, Scelta, corridore, passoAl, ritmoDi, type Corridore } from './gara';

/**
 * "Sullo stesso vettore, quale dei tre ordinamenti fa meno confronti e quale meno scambi? E che cosa cambia se il
 * vettore è già in ordine, rovesciato o a caso, e se gli elementi raddoppiano?" The race of lesson 78
 * (inf-confronto-algoritmi): selection, bubble (with the flag) and insertion sort side by side, one comparison
 * each per tick, with their counters.
 */
const VALORI = [11, 14, 18, 23, 27, 32, 36, 41, 45, 52, 58, 63];
type Ordine = 'ordinato' | 'rovesciato' | 'caso';
type Quanti = '3' | '6' | '12';

function vettore(n: number, ordine: Ordine, seme: number): number[] {
	const v = VALORI.slice(0, n);
	if (ordine === 'rovesciato') return v.reverse();
	return ordine === 'caso' ? mescola(v, casuale(seme)) : v;
}

function gara(valori: readonly number[]): Corridore[] {
	return [corridore('Selezione', ordinamentoPerSelezione(valori).passi), corridore('Bolle', ordinamentoABolle(valori, { bandierina: true }).passi), corridore('Inserimento', ordinamentoPerInserimento(valori).passi)];
}

const elenco = (nomi: string[]) => (nomi.length < 2 ? nomi.join('') : `${nomi.slice(0, -1).join(', ')} e ${nomi[nomi.length - 1]}`);

function frasi(corridori: Corridore[], n: number): string[] {
	const ultimo = Math.max(...corridori.map((c) => c.confronti));
	const alla = (c: Corridore) => passoAl(c, c.confronti).contatori;
	const [selezione, bolle, inserimento] = corridori.map(alla);
	return Array.from({ length: ultimo + 1 }, (_, t) => {
		if (t === 0) return `Lo stesso vettore di ${n} elementi per tutti e tre. A ogni passo ciascuno fa un confronto: chi ne fa di meno finisce prima.`;
		if (t === ultimo) return `Hanno finito tutti. Scambi: ${selezione.scambi} la selezione, ${bolle.scambi} le bolle; l'inserimento ha fatto ${inserimento.spostamenti} spostamenti di un posto.`;
		const arrivati = corridori.filter((c) => c.confronti <= t).map((c) => c.nome.toLowerCase());
		return `Confronto numero ${t}.${arrivati.length ? ` ${arrivati.length > 1 ? 'Hanno' : 'Ha'} già finito: ${elenco(arrivati)}.` : ''}`;
	});
}

export default function GaraOrdinamenti() {
	const [quanti, setQuanti] = useState<Quanti>('6');
	const [ordine, setOrdine] = useState<Ordine>('caso');
	const [seme, setSeme] = useState(4);
	const n = Number(quanti);
	const { corridori, testi } = useMemo(() => {
		const corridori = gara(vettore(n, ordine, seme));
		return { corridori, testi: frasi(corridori, n) };
	}, [n, ordine, seme]);
	const passi = usePassi(testi.length, { ritmo: ritmoDi(testi.length) });
	return (
		<Figura>
			<div className="flex flex-wrap items-end justify-center gap-x-4 gap-y-3">
				<Scelta nome="Vettore di partenza">
					<ToggleGroup
						label="Vettore di partenza"
						compact
						value={ordine}
						onChange={(value) => {
							setOrdine(value);
							passi.ricomincia();
						}}
						options={[
							{ value: 'ordinato', label: 'In ordine' },
							{ value: 'rovesciato', label: 'Rovesciato' },
							{ value: 'caso', label: 'A caso' }
						]}
					/>
				</Scelta>
				<Scelta nome="Elementi">
					<ToggleGroup
						label="Numero di elementi"
						compact
						value={quanti}
						onChange={(value) => {
							setQuanti(value);
							passi.ricomincia();
						}}
						options={[
							{ value: '3', label: '3' },
							{ value: '6', label: '6' },
							{ value: '12', label: '12' }
						]}
					/>
				</Scelta>
				<Button
					variant="secondary"
					size="sm"
					title="Un altro vettore a caso"
					onClick={() => {
						setOrdine('caso');
						setSeme(seme + 1);
						passi.ricomincia();
					}}
				>
					<Shuffle className="size-3.5" aria-hidden="true" />
					Mescola
				</Button>
			</div>
			<div className="flex w-full max-w-xl flex-col gap-2">
				{corridori.map((c) => (
					<Corsia key={c.nome} corridore={c} tick={passi.passo} />
				))}
			</div>
			<Legenda stati={{ esame: 'minimo, o da inserire', confronto: 'confrontato', scambio: 'spostato', ordinata: 'in ordine' }} />
			<Frase tutte={testi}>{testi[passi.passo]}</Frase>
			<ComandiPassi passi={passi} />
		</Figura>
	);
}

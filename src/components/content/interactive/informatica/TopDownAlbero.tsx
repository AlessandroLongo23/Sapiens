'use client';

import { cn } from '@/lib/utils/cn';
import { ComandiPassi, Figura, Frase, Legenda, usePassi } from '../informatica';
import { useLinguaggio } from './PilaProgramma';

/**
 * "Fin dove conviene scendere, e in che ordine si scrivono le funzioni?" The tree of the decomposition of lesson
 * 69 (the outcomes of a class), which opens one level at a time: the problem, its two subproblems, theirs. Then
 * each box takes the name of its function, and in the last steps the boxes change state in the order in which the
 * functions are written: the main program first, with the functions it calls still empty, then one function at a
 * time going down, each run before the next.
 *
 * The kit has no tree: this one is five boxes in a grid, joined by lines, in the site's tokens. The states are the
 * kit's colours (the orange of what is being worked on, the green of what is settled), each with its word.
 */

type Come = 'nascosto' | 'problema' | 'nome' | 'vuota' | 'scritta';
type Nodo = 'radice' | 'conta' | 'riga' | 'voto' | 'esito';

const TESTO: Record<Nodo, string> = {
	radice: 'Scrivere gli esiti della classe',
	conta: 'Contare le insufficienze di uno studente',
	riga: 'Scrivere la riga di uno studente',
	voto: 'Leggere un voto valido',
	esito: "Decidere l'esito"
};
const FUNZIONE: Record<Exclude<Nodo, 'radice'>, string> = { conta: 'insufficienze', riga: 'stampa_riga', voto: 'leggi_voto', esito: 'esito' };

const PASSI: { nodi: Record<Nodo, Come>; frase: string }[] = [
	{ nodi: { radice: 'problema', conta: 'nascosto', riga: 'nascosto', voto: 'nascosto', esito: 'nascosto' }, frase: "Il problema intero: scrivere l'esito di ogni studente e contare gli ammessi. È troppo grande per scriverlo di getto." },
	{ nodi: { radice: 'problema', conta: 'problema', riga: 'problema', voto: 'nascosto', esito: 'nascosto' }, frase: 'Primo livello. Per ogni studente le cose da fare sono due: contare le insufficienze e scrivere la riga. Il conto degli ammessi resta al programma principale.' },
	{ nodi: { radice: 'problema', conta: 'problema', riga: 'problema', voto: 'problema', esito: 'nascosto' }, frase: 'Per contare le insufficienze bisogna leggere i voti, e ogni voto va richiesto finché non è tra 1 e 10: leggere un voto valido è un sottoproblema a sé.' },
	{ nodi: { radice: 'problema', conta: 'problema', riga: 'problema', voto: 'problema', esito: 'problema' }, frase: "Per scrivere la riga bisogna decidere l'esito dal numero di insufficienze: un altro sottoproblema. Ora ogni foglia si scrive in poche righe, e la scomposizione si ferma." },
	{ nodi: { radice: 'nome', conta: 'nome', riga: 'nome', voto: 'nome', esito: 'nome' }, frase: "Ogni sottoproblema diventa una funzione, con un nome che dice che cosa fa. Un ramo dell'albero diventa una chiamata." },
	{ nodi: { radice: 'scritta', conta: 'vuota', riga: 'vuota', voto: 'nome', esito: 'nome' }, frase: 'Si scrive per primo il programma principale. Le due funzioni che chiama esistono ma sono vuote: insufficienze restituisce sempre 0, stampa_riga scrive solo il numero dello studente.' },
	{ nodi: { radice: 'scritta', conta: 'scritta', riga: 'vuota', voto: 'vuota', esito: 'nome' }, frase: 'Si riempie insufficienze, con il ciclo e il contatore. La funzione che chiama, leggi_voto, nasce vuota: per ora legge un voto senza controllarlo.' },
	{ nodi: { radice: 'scritta', conta: 'scritta', riga: 'vuota', voto: 'scritta', esito: 'nome' }, frase: 'Si riempie leggi_voto, con il ciclo che richiede il voto finché non è valido. Il ramo di sinistra è finito, e il programma conta già gli ammessi.' },
	{ nodi: { radice: 'scritta', conta: 'scritta', riga: 'scritta', voto: 'scritta', esito: 'vuota' }, frase: 'Si riempie stampa_riga. La funzione che chiama, esito, nasce vuota: per ora restituisce sempre lo stesso testo.' },
	{ nodi: { radice: 'scritta', conta: 'scritta', riga: 'scritta', voto: 'scritta', esito: 'scritta' }, frase: 'Si riempie esito, con la selezione a tre vie. Tutte le funzioni sono scritte, e dopo ogni passo il programma si poteva eseguire.' }
];

const ASPETTO: Record<Come, string> = {
	nascosto: 'invisible',
	problema: 'border-edge-strong bg-surface shadow-paper',
	nome: 'border-edge-strong bg-surface shadow-paper',
	vuota: 'border-dashed border-[oklch(0.64_var(--chroma)_var(--hue))] bg-tint-soft',
	scritta: 'border-ok/45 bg-ok-soft'
};
const PAROLA: Record<Come, string> = { nascosto: '', problema: '', nome: 'da scrivere', vuota: 'vuota', scritta: 'scritta' };

function Riquadro({ testo, funzione, come, apparso }: { testo: string; funzione: string; come: Come; apparso: boolean }) {
	const conNome = come !== 'nascosto' && come !== 'problema';
	return (
		<div
			aria-hidden={come === 'nascosto' || undefined}
			data-nodo={funzione}
			data-come={come}
			className={cn('flex w-full max-w-60 flex-col items-center gap-1 rounded-xl border-[1.5px] px-2 py-2 text-center motion-safe:transition-[background-color,border-color] motion-safe:duration-200', ASPETTO[come], apparso && 'motion-safe:animate-drop-in')}
		>
			<div className="text-[13px] leading-snug text-fg-strong">{testo}</div>
			<div className={cn('font-mono text-xs leading-tight font-semibold break-all text-fg-strong', !conNome && 'invisible')}>{funzione}</div>
			<div className={cn('label-mono', !conNome && 'invisible', come === 'scritta' ? 'text-ok-fg' : come === 'vuota' ? 'text-tint-fg' : 'text-fg-subtle')}>{PAROLA[come] || 'da scrivere'}</div>
		</div>
	);
}

const LINEA = 'absolute bg-edge-strong';

export default function TopDownAlbero() {
	const [linguaggio] = useLinguaggio();
	const passi = usePassi(PASSI.length, { ritmo: 2600 });
	const { nodi, frase } = PASSI[passi.passo];
	const prima = passi.passo > 0 ? PASSI[passi.passo - 1].nodi : null;
	const funzione = (nodo: Nodo) => (nodo === 'radice' ? (linguaggio === 'cpp' ? 'main' : 'programma principale') : FUNZIONE[nodo]);
	const riquadro = (nodo: Nodo) => <Riquadro testo={TESTO[nodo]} funzione={funzione(nodo)} come={nodi[nodo]} apparso={!!prima && prima[nodo] === 'nascosto' && nodi[nodo] !== 'nascosto'} />;
	const c = (nodo: Nodo) => nodi[nodo] !== 'nascosto';
	return (
		<Figura>
			<div role="group" aria-label="L'albero della scomposizione: in cima il problema, sotto i sottoproblemi" className="grid w-full max-w-lg grid-cols-2 justify-items-center gap-x-2" data-albero>
				<div className="col-span-2 flex w-full justify-center">{riquadro('radice')}</div>
				{/* from the problem to its two subproblems: down, across, down; the columns' centres are 2px inside the quarters, for the gap */}
				<div aria-hidden="true" className={cn('relative col-span-2 h-5 w-full', !c('conta') && 'invisible')}>
					<span className={cn(LINEA, 'top-0 left-1/2 h-1/2 w-px')} />
					<span className={cn(LINEA, 'top-1/2 right-[calc(25%-2px)] left-[calc(25%-2px)] h-px')} />
					<span className={cn(LINEA, 'top-1/2 left-[calc(25%-2px)] h-1/2 w-px')} />
					<span className={cn(LINEA, 'top-1/2 right-[calc(25%-2px)] h-1/2 w-px')} />
				</div>
				{riquadro('conta')}
				{riquadro('riga')}
				<div aria-hidden="true" className={cn('relative h-5 w-full', !c('voto') && 'invisible')}>
					<span className={cn(LINEA, 'inset-y-0 left-1/2 w-px')} />
				</div>
				<div aria-hidden="true" className={cn('relative h-5 w-full', !c('esito') && 'invisible')}>
					<span className={cn(LINEA, 'inset-y-0 left-1/2 w-px')} />
				</div>
				{riquadro('voto')}
				{riquadro('esito')}
			</div>
			<Legenda stati={{ normale: 'da scrivere', esame: 'vuota, per ora', ordinata: 'scritta ed eseguita' }} />
			<Frase tutte={PASSI.map((p) => p.frase)}>{frase}</Frase>
			<ComandiPassi passi={passi} />
		</Figura>
	);
}
